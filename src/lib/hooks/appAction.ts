import { arrayMoveImmutable } from "array-move";
import { useRecoilCallback } from "recoil";
import { v4 as uuidv4 } from "uuid";

import { groupAtom } from "../atoms/groupAtom";
import { groupNameAtom } from "../atoms/groupNameAtom";
import { groupPagesAtom } from "../atoms/groupPagesAtom";
import { isImportingAtom } from "../atoms/isImportingAtom";
import { pageAtom } from "../atoms/pageAtom";
import { removeExtension } from "../io/ext";
import logger from "../log";
import { PdfSource } from "../pdf/file";
import { Page } from "../pdf/group";
import { pageGroupSelector } from "../selectors/pageGroupSelector";

export function usePageActions() {
    return {
        move: useRecoilCallback(
            ({ snapshot, set }) =>
                (page: string, destGroup: string, destIndex: number) => {
                    const group = snapshot.getLoadable(pageGroupSelector(page)).valueOrThrow();

                    if (group === destGroup) {
                        set(groupPagesAtom(destGroup), (pages) =>
                            arrayMoveImmutable(pages, pages.indexOf(page), destIndex)
                        );
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
            ({ set }) =>
                () => {
                    set(groupAtom, (groups) => groups.concat(uuidv4()));
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
        export: null,
    };
}
