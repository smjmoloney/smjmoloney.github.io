import Dexie, { type Table } from "dexie";
import type { BuyListItem, ThreadInventoryRecord } from "../types/thread";

class ThreadDatabase extends Dexie {
    inventory!: Table<ThreadInventoryRecord>;
    buyList!: Table<BuyListItem>;

    constructor() {
        super("ThreadInventory");
        this.version(1).stores({
            threads: "++id,dmc,name",
        });
        this.version(2).stores({
            threads: null,
            inventory: "[rangeId+dmcNumber],rangeId,dmcNumber,updatedAt",
            buyList: "[rangeId+dmcNumber],rangeId,dmcNumber,addedAt",
        });
    }
}

export const db = new ThreadDatabase();

export async function saveInventory(
    record: ThreadInventoryRecord,
): Promise<void> {
    await db.inventory.put(record);
}

export async function addToBuyList(item: BuyListItem): Promise<void> {
    await db.buyList.put(item);
}

export async function removeFromBuyList(
    rangeId: string,
    dmcNumber: string,
): Promise<void> {
    await db.buyList.delete([rangeId, dmcNumber]);
}
