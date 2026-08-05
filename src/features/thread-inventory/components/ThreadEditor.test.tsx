// @vitest-environment jsdom

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { DmcColour, ThreadInventoryRecord } from "../../../types/thread";
import { ThreadEditor } from "./ThreadEditor";

const colour: DmcColour = {
    dmcNumber: "321",
    colourName: "Red",
    hex: "#C72B3B",
};

const inventory: ThreadInventoryRecord = {
    rangeId: "mouline-special",
    dmcNumber: "321",
    fullSkeins: 1,
    activeSkeinRemaining: "quarter",
    notes: "Current note",
    updatedAt: "2026-08-05T00:00:00.000Z",
};

describe("ThreadEditor", () => {
    it("initializes a draft and closes only after a successful save", async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();
        const onSave = vi.fn().mockResolvedValue(true);

        render(
            <ThreadEditor
                colour={colour}
                inventory={inventory}
                onClose={onClose}
                onSave={onSave}
            />,
        );

        await user.click(
            screen.getByRole("button", { name: "Add one full skein" }),
        );
        await user.selectOptions(screen.getByRole("combobox"), "half");
        const notes = screen.getByPlaceholderText(
            "Optional notes about this colour",
        );
        await user.clear(notes);
        await user.type(notes, "Updated note");
        await user.click(screen.getByRole("button", { name: "Save changes" }));

        await waitFor(() =>
            expect(onSave).toHaveBeenCalledWith(colour, {
                fullSkeins: 2,
                activeSkeinRemaining: "half",
                notes: "Updated note",
            }),
        );
        expect(onClose).toHaveBeenCalledOnce();
    });

    it("remains open when persistence fails", async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();

        render(
            <ThreadEditor
                colour={colour}
                onClose={onClose}
                onSave={vi.fn().mockResolvedValue(false)}
            />,
        );

        await user.click(screen.getByRole("button", { name: "Save changes" }));
        expect(onClose).not.toHaveBeenCalled();
    });
});
