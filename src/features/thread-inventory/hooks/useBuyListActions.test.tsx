// @vitest-environment jsdom

import { act, renderHook, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { addToBuyList, removeFromBuyList } from "../../../lib/database";
import type {
    BuyListItem,
    DmcColour,
    ThreadInventoryRecord,
} from "../../../types/thread";
import { useBuyListActions } from "./useBuyListActions";

vi.mock("../../../lib/database", () => ({
    addToBuyList: vi.fn(),
    removeFromBuyList: vi.fn(),
}));

vi.mock("sonner", () => ({
    toast: {
        error: vi.fn(),
        success: vi.fn(),
    },
}));

const colour: DmcColour = {
    dmcNumber: "310",
    colourName: "Black",
    hex: "#000000",
};

const ownedRecord: ThreadInventoryRecord = {
    rangeId: "mouline-special",
    dmcNumber: "310",
    fullSkeins: 1,
    updatedAt: "2026-08-05T00:00:00.000Z",
};

const item: BuyListItem = {
    rangeId: "mouline-special",
    dmcNumber: "310",
    quantity: 1,
    addedAt: "2026-08-05T00:00:00.000Z",
};

describe("useBuyListActions", () => {
    beforeEach(() => vi.clearAllMocks());

    it("requires confirmation before adding an owned colour", async () => {
        const { result } = renderHook(() =>
            useBuyListActions(
                "mouline-special",
                new Map([["310", ownedRecord]]),
                new Map(),
            ),
        );

        act(() => result.current.requestAddToBuyList(colour));
        expect(result.current.pendingBuyColour).toBe(colour);
        expect(addToBuyList).not.toHaveBeenCalled();

        act(() => result.current.confirmPendingBuyColour());
        await waitFor(() => expect(addToBuyList).toHaveBeenCalledOnce());
        expect(result.current.pendingBuyColour).toBeNull();
        expect(toast.success).toHaveBeenCalledWith("Added to your buy list");
    });

    it("removes an item through the persistence boundary", async () => {
        const { result } = renderHook(() =>
            useBuyListActions("mouline-special", new Map(), new Map()),
        );

        await act(async () => result.current.removeItemFromBuyList(item));

        expect(removeFromBuyList).toHaveBeenCalledWith(
            "mouline-special",
            "310",
        );
        expect(toast.success).toHaveBeenCalledWith(
            "Removed from your buy list",
        );
    });
});
