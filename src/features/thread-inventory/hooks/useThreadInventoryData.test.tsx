// @vitest-environment jsdom

import { renderHook } from "@testing-library/react";
import { useLiveQuery } from "dexie-react-hooks";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type {
    BuyListItem,
    DmcColour,
    ThreadInventoryRecord,
} from "../../../types/thread";
import { useThreadInventoryData } from "./useThreadInventoryData";

vi.mock("dexie-react-hooks", () => ({
    useLiveQuery: vi.fn(),
}));

const inventory: ThreadInventoryRecord[] = [
    {
        rangeId: "mouline-special",
        dmcNumber: "310",
        fullSkeins: 1,
        updatedAt: "2026-08-05T00:00:00.000Z",
    },
    {
        rangeId: "mouline-special",
        dmcNumber: "321",
        fullSkeins: 0,
        activeSkeinRemaining: "low",
        updatedAt: "2026-08-05T00:00:00.000Z",
    },
];

const buyList: BuyListItem[] = [
    {
        rangeId: "mouline-special",
        dmcNumber: "321",
        quantity: 1,
        addedAt: "2026-08-05T00:00:00.000Z",
    },
];

const colours: DmcColour[] = [
    { dmcNumber: "310", colourName: "Black", hex: "#000000" },
    { dmcNumber: "321", colourName: "Red", hex: "#C72B3B" },
];

describe("useThreadInventoryData", () => {
    beforeEach(() => {
        vi.mocked(useLiveQuery)
            .mockReturnValueOnce(inventory)
            .mockReturnValueOnce(buyList);
    });

    it("builds feature lookups and stock counts from live records", () => {
        const { result } = renderHook(() => useThreadInventoryData(colours));

        expect(result.current.inventoryByNumber.get("310")).toBe(inventory[0]);
        expect(result.current.buyListByNumber.get("321")).toBe(buyList[0]);
        expect(result.current.colourByNumber.get("310")).toBe(colours[0]);
        expect(result.current.ownedCount).toBe(2);
        expect(result.current.lowStockCount).toBe(1);
    });
});
