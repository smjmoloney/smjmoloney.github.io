import { describe, expect, it } from "vitest";
import type { DmcColour, ThreadInventoryRecord } from "../../types/thread";
import {
    filterCatalogueColours,
    getStockSummary,
    isLowStock,
    isOwned,
} from "./threadInventoryUtils";

const makeRecord = (
    overrides: Partial<ThreadInventoryRecord> = {},
): ThreadInventoryRecord => ({
    rangeId: "mouline-special",
    dmcNumber: "310",
    fullSkeins: 0,
    updatedAt: "2026-08-05T00:00:00.000Z",
    ...overrides,
});

const colours: DmcColour[] = [
    { dmcNumber: "310", colourName: "Black", hex: "#000000" },
    { dmcNumber: "321", colourName: "Red", hex: "#C72B3B" },
    { dmcNumber: "995", colourName: "Electric Blue", hex: "#2696B6" },
];

describe("thread inventory utilities", () => {
    it("classifies owned and low-stock records", () => {
        expect(isOwned()).toBe(false);
        expect(isOwned(makeRecord())).toBe(false);
        expect(isOwned(makeRecord({ fullSkeins: 1 }))).toBe(true);
        expect(isOwned(makeRecord({ activeSkeinRemaining: "half" }))).toBe(
            true,
        );
        expect(isOwned(makeRecord({ activeSkeinRemaining: "empty" }))).toBe(
            false,
        );
        expect(
            isLowStock(makeRecord({ activeSkeinRemaining: "quarter" })),
        ).toBe(true);
        expect(isLowStock(makeRecord({ activeSkeinRemaining: "low" }))).toBe(
            true,
        );
        expect(
            isLowStock(
                makeRecord({ fullSkeins: 1, activeSkeinRemaining: "low" }),
            ),
        ).toBe(false);
    });

    it("describes inventory without duplicating stock rules", () => {
        expect(getStockSummary()).toBe("Not owned");
        expect(getStockSummary(makeRecord({ fullSkeins: 1 }))).toBe(
            "1 full skein",
        );
        expect(
            getStockSummary(
                makeRecord({ fullSkeins: 2, activeSkeinRemaining: "half" }),
            ),
        ).toBe("2 full skeins · About half remaining");
    });

    it("filters by number, name, and inventory status", () => {
        const inventory = new Map([
            ["310", makeRecord({ dmcNumber: "310", fullSkeins: 1 })],
            [
                "321",
                makeRecord({ dmcNumber: "321", activeSkeinRemaining: "low" }),
            ],
        ]);

        expect(
            filterCatalogueColours(colours, inventory, "electric", "all"),
        ).toEqual([colours[2]]);
        expect(
            filterCatalogueColours(colours, inventory, "31", "owned"),
        ).toEqual([colours[0]]);
        expect(filterCatalogueColours(colours, inventory, "", "low")).toEqual([
            colours[1],
        ]);
        expect(filterCatalogueColours(colours, inventory, "", "need")).toEqual([
            colours[2],
        ]);
    });
});
