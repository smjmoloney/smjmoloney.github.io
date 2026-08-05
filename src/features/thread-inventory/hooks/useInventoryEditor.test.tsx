// @vitest-environment jsdom

import { act, renderHook } from "@testing-library/react";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { saveInventory } from "../../../lib/database";
import type { DmcColour } from "../../../types/thread";
import { useInventoryEditor } from "./useInventoryEditor";

vi.mock("../../../lib/database", () => ({
    saveInventory: vi.fn(),
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

describe("useInventoryEditor", () => {
    beforeEach(() => vi.clearAllMocks());

    it("persists typed drafts and reports success", async () => {
        const { result } = renderHook(() =>
            useInventoryEditor("mouline-special"),
        );
        let wasSaved = false;

        await act(async () => {
            wasSaved = await result.current.saveThread(colour, {
                fullSkeins: 2,
                notes: "Stored",
            });
        });

        expect(wasSaved).toBe(true);
        expect(saveInventory).toHaveBeenCalledWith(
            expect.objectContaining({
                rangeId: "mouline-special",
                dmcNumber: "310",
                fullSkeins: 2,
                notes: "Stored",
            }),
        );
        expect(toast.success).toHaveBeenCalledWith("Thread saved");
    });

    it("keeps the editor open when persistence fails", async () => {
        vi.mocked(saveInventory).mockRejectedValueOnce(new Error("failed"));
        const { result } = renderHook(() =>
            useInventoryEditor("mouline-special"),
        );
        let wasSaved = true;

        await act(async () => {
            wasSaved = await result.current.saveThread(colour, {
                fullSkeins: 0,
            });
        });

        expect(wasSaved).toBe(false);
        expect(toast.error).toHaveBeenCalledWith(
            "Your changes could not be saved. Please try again.",
        );
    });
});
