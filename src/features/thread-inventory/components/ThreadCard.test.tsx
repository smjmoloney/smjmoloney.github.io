// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { DmcColour, ThreadInventoryRecord } from "../../../types/thread";
import { ThreadCard } from "./ThreadCard";

const colour: DmcColour = {
    dmcNumber: "310",
    colourName: "Black",
    hex: "#000000",
};

const inventory: ThreadInventoryRecord = {
    rangeId: "mouline-special",
    dmcNumber: "310",
    fullSkeins: 0,
    activeSkeinRemaining: "low",
    updatedAt: "2026-08-05T00:00:00.000Z",
};

describe("ThreadCard", () => {
    it("shows stock and emits edit and buy-list intents", async () => {
        const user = userEvent.setup();
        const onAddToBuyList = vi.fn();
        const onEdit = vi.fn();

        render(
            <ThreadCard
                colour={colour}
                inventory={inventory}
                isOnBuyList={false}
                onAddToBuyList={onAddToBuyList}
                onEdit={onEdit}
            />,
        );

        expect(screen.getByText("Low stock")).toBeInTheDocument();
        expect(
            screen.getByText("0 full skeins · Running low"),
        ).toBeInTheDocument();
        await user.click(screen.getByRole("button", { name: /edit dmc 310/i }));
        await user.click(screen.getByRole("button", { name: /add dmc 310/i }));

        expect(onEdit).toHaveBeenCalledWith(colour);
        expect(onAddToBuyList).toHaveBeenCalledWith(colour);
    });

    it("disables duplicate buy-list actions", () => {
        render(
            <ThreadCard
                colour={colour}
                isOnBuyList
                onAddToBuyList={vi.fn()}
                onEdit={vi.fn()}
            />,
        );

        expect(
            screen.getByRole("button", { name: /is on your buy list/i }),
        ).toBeDisabled();
    });
});
