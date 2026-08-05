import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../../lib/database";
import type { DmcColour } from "../../../types/thread";
import { isLowStock, isOwned } from "../threadInventoryUtils";

export const useThreadInventoryData = (colours: readonly DmcColour[]) => {
    const inventory = useLiveQuery(() => db.inventory.toArray(), []) ?? [];
    const buyList = useLiveQuery(() => db.buyList.toArray(), []) ?? [];
    const inventoryByNumber = new Map(
        inventory.map((record) => [record.dmcNumber, record]),
    );
    const buyListByNumber = new Map(
        buyList.map((item) => [item.dmcNumber, item]),
    );
    const colourByNumber = new Map(
        colours.map((colour) => [colour.dmcNumber, colour]),
    );
    const ownedCount = colours.filter((colour) =>
        isOwned(inventoryByNumber.get(colour.dmcNumber)),
    ).length;
    const lowStockCount = colours.filter((colour) =>
        isLowStock(inventoryByNumber.get(colour.dmcNumber)),
    ).length;

    return {
        buyList,
        buyListByNumber,
        colourByNumber,
        inventoryByNumber,
        lowStockCount,
        ownedCount,
    };
};
