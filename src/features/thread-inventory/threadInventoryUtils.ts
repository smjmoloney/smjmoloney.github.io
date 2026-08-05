import { remainingLevelCopy } from "../../lib/thread-copy";
import type {
    DmcColour,
    InventoryStatus,
    ThreadInventoryRecord,
} from "../../types/thread";

export const isOwned = (record?: ThreadInventoryRecord): boolean =>
    Boolean(
        record &&
        (record.fullSkeins > 0 ||
            (record.activeSkeinRemaining &&
                record.activeSkeinRemaining !== "empty")),
    );

export const isLowStock = (record?: ThreadInventoryRecord): boolean =>
    Boolean(
        record &&
        record.fullSkeins === 0 &&
        (record.activeSkeinRemaining === "quarter" ||
            record.activeSkeinRemaining === "low"),
    );

export const getStockSummary = (record?: ThreadInventoryRecord): string => {
    if (!record || !isOwned(record)) return "Not owned";

    const fullSkeins = `${record.fullSkeins} full ${record.fullSkeins === 1 ? "skein" : "skeins"}`;
    if (
        !record.activeSkeinRemaining ||
        record.activeSkeinRemaining === "empty"
    ) {
        return fullSkeins;
    }

    return `${fullSkeins} · ${remainingLevelCopy[record.activeSkeinRemaining]}`;
};

export const filterCatalogueColours = (
    colours: readonly DmcColour[],
    inventoryByNumber: ReadonlyMap<string, ThreadInventoryRecord>,
    query: string,
    status: InventoryStatus,
): DmcColour[] => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    return colours.filter((colour) => {
        const matchesQuery =
            !normalizedQuery ||
            colour.dmcNumber.toLocaleLowerCase().includes(normalizedQuery) ||
            colour.colourName.toLocaleLowerCase().includes(normalizedQuery);
        const record = inventoryByNumber.get(colour.dmcNumber);
        const matchesStatus =
            status === "all" ||
            (status === "owned" && isOwned(record)) ||
            (status === "need" && !isOwned(record)) ||
            (status === "low" && isLowStock(record));

        return matchesQuery && matchesStatus;
    });
};
