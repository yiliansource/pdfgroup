import update from "immutability-helper";

import { Settings } from "./hooks/useSettings";
import logger from "./log";
import { PdfSource } from "./pdf/file";
import { GroupEnvironment, PageGroup, Page } from "./pdf/group";
import { flattenDocument } from "./pdf/pipes/flattener";
import { PageLocation, PDFPipeMethod } from "./pdf/types";

/**
 * Imports a specified file into the specified environment.
 *
 * @param file The file to import.
 */
export async function importFile(env: GroupEnvironment, file: File): Promise<GroupEnvironment> {
    if (!file || !file.name.endsWith(".pdf")) return env;

    logger.info(`Importing ${file.name} ...`);

    const source = await PdfSource.fromFile(file);
    const pageIndices = (await source.toPdflibDocument()).getPageIndices();
    env = update(env, {
        groups: {
            $push: [
                new PageGroup(
                    source.name,
                    pageIndices.map((index) => new Page(index, source))
                ),
            ],
        },
    });

    logger.info(`Imported ${pageIndices.length} pages.`);

    return env;
}

/**
 * Renames the specified environment to the specified label.
 *
 * @param label The string to rename the environment to.
 */
export function renameEnvironment(env: GroupEnvironment, label: string): GroupEnvironment {
    env = update(env, { label: { $set: label } });

    logger.debug(`Renamed the environment to '${label}'.`);

    return env;
}

/**
 * Moves a page from one location to another.
 * This method can be used to move a page to a different group, or re-arrange it in it's current group.
 *
 * @param source The current location of the page, used for indexing.
 * @param dest The desired location of the page, used for indexing.
 */
export function movePage(env: GroupEnvironment, source: PageLocation, dest: PageLocation): GroupEnvironment {
    // If source and destination match, don't perform any movement.
    if (source.group === dest.group && source.page === dest.page) return env;

    // Determine the page instance to move around.
    const page = env.getPage(source);

    env =
        source.group === dest.group
            ? // If we need to move around the page inside it's current group, we use two splicing transactions
              // on the same array. Note that the index is adjusted appropriately by the calling component.
              update(env, {
                  groups: {
                      [dest.group]: {
                          pages: {
                              $splice: [
                                  [source.page, 1],
                                  [dest.page, 0, page],
                              ],
                          },
                      },
                  },
              })
            : update(env, {
                  groups: {
                      [source.group]: { pages: { $splice: [[source.page, 1]] } },
                      [dest.group]: { pages: { $splice: [[dest.page, 0, page]] } },
                  },
              });

    logger.debug(`Moved page from [${source.group}, ${source.page}] to [${dest.group}, ${dest.page}].`);

    return env;
}

/**
 * Removes the page at the specified location from the environment.
 *
 * @param location The location at which to remove the page.
 */
export function removePage(env: GroupEnvironment, location: PageLocation): GroupEnvironment {
    env = update(env, {
        groups: {
            [location.group]: {
                pages: {
                    $splice: [[location.page, 1]],
                },
            },
        },
    });

    logger.debug(`Removed page [${location.group}, ${location.page}].`);

    return env;
}

/**
 * Moves a group to a specified destination index.
 *
 * @param sourceIndex The current location of the group.
 * @param destIndex The desired location of the group.
 */
export function moveGroup(env: GroupEnvironment, sourceIndex: number, destIndex: number): GroupEnvironment {
    // If source and destination match, don't perform any movement.
    if (sourceIndex === destIndex) return env;

    // Determine the group to move.
    const group = env.groups[sourceIndex];

    env = update(env, {
        groups: {
            $splice: [
                [sourceIndex, 1],
                [destIndex, 0, group],
            ],
        },
    });

    logger.debug(`Moved group from ${sourceIndex} to ${destIndex}.`);

    return env;
}

/**
 * Adds a new group to the environment.
 * Optionally, an initial page can be specified to be immediately moved into the group.
 *
 * @param initial The (optional) initial page to populate the group with.
 */
export function addGroup(env: GroupEnvironment, initial?: PageLocation): GroupEnvironment {
    // TODO: Pick appropriate group label.
    const label = "";
    if (initial) {
        // Determine the page to move.
        const page = env.getPage(initial);

        // Since we are moving a page around, we need to remove it from it's old location, before inserting
        // it into the new, created group.
        env = update(env, {
            groups: {
                [initial.group]: { pages: { $splice: [[initial.page, 1]] } },
                $push: [new PageGroup(label, [page])],
            },
        });
    } else {
        env = update(env, {
            groups: {
                $push: [new PageGroup(label)],
            },
        });
    }

    logger.debug(`Added a new group.`);

    return env;
}

/**
 * Renames a specific group to a specific string.
 *
 * @param groupIndex The index of the group to rename.
 * @param label The string to rename the group to.
 */
export function renameGroup(env: GroupEnvironment, groupIndex: number, label: string): GroupEnvironment {
    env = update(env, {
        groups: {
            [groupIndex]: {
                label: { $set: label },
            },
        },
    });

    logger.debug(`Renamed group ${groupIndex} to '${label}'.`);

    return env;
}

/**
 * Removes the group at the specified index.
 * Note that this simply removes it, without any warning or additional checks.
 *
 * @param groupIndex The index of the group to remove.
 */
export function removeGroup(env: GroupEnvironment, groupIndex: number): GroupEnvironment {
    env = update(env, {
        groups: {
            $splice: [[groupIndex, 1]],
        },
    });

    logger.debug(`Removed group ${groupIndex}.`);

    return env;
}

export function toggleSelect(env: GroupEnvironment, location: PageLocation, selectionGroup?: number): GroupEnvironment {
    if (env.getPage(location).selectionGroup != undefined) {
        selectionGroup = undefined
    }
    env = update(env, {
        groups: {
            [location.group]: {
               pages: {
                   [location.page]: {
                       selectionGroup: {$set: selectionGroup}
                   }
               }
            }
        }
    })

    return env;
}

export function moveSelectionToGroups(env: GroupEnvironment): GroupEnvironment {
    const groups = new Map<number, Array<PageLocation>>()

    env.groups.forEach((grp, gIdx) => {
        grp.pages.forEach((page, pIdx) => {
            if (typeof(page.selectionGroup) === "number") {
                if (!groups.has(page.selectionGroup)) {
                    groups.set(page.selectionGroup, [])
                }
                groups.get(page.selectionGroup)?.push({group: gIdx, page: pIdx})
            }
        })
    });

    for (const [sel, pages] of groups.entries()) {
        env = addGroup(env);
        const group = env.groups.length - 1;
        for (const page of pages.reverse()) {
            env = movePage(env, page, { group, page: env.groups[group].pages.length })
        }
    }

    // TODO unselect

    return env;
}

/**
 * Initiates the download of the environment.
 * This also prompts a save/download dialog.
 */
export async function download(env: GroupEnvironment, exportOptions: Settings["exportOptions"]) {
    logger.info("Preparing file download ...");

    // Determine which pipes to use.
    const pipes: PDFPipeMethod[] = [];
    if (exportOptions.flatten) pipes.push(flattenDocument);

    await env.save({ pipes });

    logger.info("Download successful.");
}
