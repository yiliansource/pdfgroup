import { arrayMoveImmutable } from "array-move";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { PDFDocument } from "pdf-lib";
import { useRecoilCallback } from "recoil";
import { v4 as uuidv4 } from "uuid";

import { folderNameAtom } from "../atoms/folderNameAtom";
import { groupAtom } from "../atoms/groupAtom";
import { groupNameAtom } from "../atoms/groupNameAtom";
import { groupPagesAtom } from "../atoms/groupPagesAtom";
import { isImportingAtom } from "../atoms/isImportingAtom";
import { pageAtom } from "../atoms/pageAtom";
import { Settings } from "../atoms/settingsAtom";
import { removeExtension } from "../io/ext";
import logger from "../log";
import { Page } from "../pdf/page";
import { flattenDocument } from "../pdf/pipes/flattener";
import { PdfSource } from "../pdf/soure";
import { PDFPipeMethod } from "../pdf/types";
import { groupNamePlaceholderSelector } from "../selectors/groupNamePlaceholderSelector";
import { groupNameSelector } from "../selectors/groupNameSelector";
import { pageGroupSelector } from "../selectors/pageGroupSelector";

export function usePageActions() {
    return {
        move: useRecoilCallback(
            ({ snapshot, set }) =>
                (page: string, destGroup: string, destIndex: number) => {
                    const group = snapshot.getLoadable(pageGroupSelector(page)).valueOrThrow();

                    if (group === destGroup) {
                        set(groupPagesAtom(destGroup), (pages) => {
                            const pageIndex = pages.indexOf(page);
                            if (destIndex > pageIndex) destIndex--;
                            return arrayMoveImmutable(pages, pages.indexOf(page), destIndex);
                        });
                    } else {
                        set(groupPagesAtom(group), (pages) => pages.filter((p) => p !== page));
                        set(groupPagesAtom(destGroup), (pages) => [
                            ...pages.slice(0, destIndex),
                            page,
                            ...pages.slice(destIndex),
                        ]);
                    }
                },
            []
        ),
        remove: useRecoilCallback(
            ({ snapshot, set }) =>
                (page: string) => {
                    const group = snapshot.getLoadable(pageGroupSelector(page)).valueOrThrow();
                    set(groupPagesAtom(group), (pages) => pages.filter((p) => p !== page));
                },
            []
        ),
    };
}

export function useGroupActions() {
    return {
        add: useRecoilCallback(
            ({ snapshot, set }) =>
                (initialPage?: string) => {
                    const newGroup = uuidv4();
                    set(groupAtom, (groups) => groups.concat(newGroup));

                    if (initialPage) {
                        const group = snapshot.getLoadable(pageGroupSelector(initialPage)).valueOrThrow();
                        set(groupPagesAtom(group), (pages) => pages.filter((p) => p !== initialPage));
                        set(groupPagesAtom(newGroup), (pages) => pages.concat(initialPage));
                    }
                },
            []
        ),
        move: useRecoilCallback(
            ({ set }) =>
                (group: string, index: number) => {
                    set(groupAtom, (groups) => arrayMoveImmutable(groups, groups.indexOf(group), index));
                },
            []
        ),
        remove: useRecoilCallback(
            ({ set }) =>
                (group: string) => {
                    set(groupAtom, (groups) => groups.filter((g) => g !== group));
                },
            []
        ),
    };
}

export function useFileActions() {
    return {
        import: useRecoilCallback(({ set }) => async (...files: File[]) => {
            set(isImportingAtom, true);

            for (const file of files) {
                if (!file || !file.name.endsWith(".pdf")) continue;

                logger.info(`Importing ${file.name} ...`);

                const source = await PdfSource.fromFile(file);
                if (!source) continue;

                const group = uuidv4();
                const pageIndices = (await source.toPdflibDocument()).getPageIndices();

                set(groupAtom, (groups) => groups.concat(group));
                set(groupNameAtom(group), removeExtension(file.name));

                const pages: string[] = [];
                for (const index of pageIndices) {
                    const page = uuidv4();
                    set(pageAtom(page), new Page(index, source));
                    pages.push(page);
                }

                set(groupPagesAtom(group), pages);

                logger.info(`Imported ${pageIndices.length} pages.`);
            }

            set(isImportingAtom, false);
        }),
        export: useRecoilCallback(({ snapshot }) => async (exportOptions: Settings["exportOptions"]) => {
            logger.info("Preparing file download ...");

            // Determine which pipes to use.
            const pipes: PDFPipeMethod[] = [];
            if (exportOptions.flatten) pipes.push(flattenDocument);
            const zip = new JSZip();

            for (const group of snapshot.getLoadable(groupAtom).valueOrThrow()) {
                const pages = snapshot.getLoadable(groupPagesAtom(group)).valueOrThrow();
                if (pages.length <= 0) continue;

                const doc = await PDFDocument.create();

                for (const page of pages) {
                    const pageValue = snapshot.getLoadable(pageAtom(page)).valueOrThrow();
                    const source = await pageValue.source.toPdflibDocument();
                    const [sourcePage] = await doc.copyPages(source, [pageValue.sourceIndex]);

                    doc.addPage(sourcePage);
                }
                if (!doc) continue;

                // Send the document through all the provided pipe operations.
                const piped = await pipes.reduce(
                    async (piping, pipe) => await pipe(await piping),
                    Promise.resolve(doc)
                );

                const bytes = await piped.save();
                zip.file(snapshot.getLoadable(groupNameSelector(group)).valueOrThrow() + ".pdf", bytes);
            }

            const content = await zip.generateAsync({ type: "blob" });
            saveAs(content, snapshot.getLoadable(folderNameAtom).valueOrThrow() + ".zip");

            logger.info("Download successful.");
        }),
    };
}
