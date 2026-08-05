import { useState } from "react";
import { toast } from "sonner";
import { addToBuyList, removeFromBuyList } from "../../../lib/database";
import type {
    BuyListItem,
    DmcColour,
    ThreadInventoryRecord,
    ThreadRangeId,
} from "../../../types/thread";
import { isOwned } from "../threadInventoryUtils";

export const useBuyListActions = (
    rangeId: ThreadRangeId,
    inventoryByNumber: ReadonlyMap<string, ThreadInventoryRecord>,
    buyListByNumber: ReadonlyMap<string, BuyListItem>,
) => {
    const [pendingBuyColour, setPendingBuyColour] = useState<DmcColour | null>(
        null,
    );

    const addColourToBuyList = async (colour: DmcColour): Promise<void> => {
        const existing = buyListByNumber.get(colour.dmcNumber);
        const item: BuyListItem = {
            rangeId,
            dmcNumber: colour.dmcNumber,
            quantity: existing?.quantity ?? 1,
            addedAt: existing?.addedAt ?? new Date().toISOString(),
        };

        try {
            await addToBuyList(item);
            toast.success("Added to your buy list");
        } catch {
            toast.error("This colour could not be added. Please try again.");
        }
    };

    const requestAddToBuyList = (colour: DmcColour): void => {
        if (isOwned(inventoryByNumber.get(colour.dmcNumber))) {
            setPendingBuyColour(colour);
            return;
        }

        void addColourToBuyList(colour);
    };

    const removeItemFromBuyList = async (item: BuyListItem): Promise<void> => {
        try {
            await removeFromBuyList(item.rangeId, item.dmcNumber);
            toast.success("Removed from your buy list");
        } catch {
            toast.error("This colour could not be removed. Please try again.");
        }
    };

    const confirmPendingBuyColour = (): void => {
        if (pendingBuyColour) void addColourToBuyList(pendingBuyColour);
        setPendingBuyColour(null);
    };

    return {
        confirmPendingBuyColour,
        pendingBuyColour,
        removeItemFromBuyList,
        requestAddToBuyList,
        setPendingBuyColour,
    };
};
