// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { BuyListItem, DmcColour } from "../../../types/thread";
import { BuyListView } from "./BuyListView";

const item: BuyListItem = {
    rangeId: "mouline-special",
    dmcNumber: "310",
    quantity: 1,
    addedAt: "2026-08-05T00:00:00.000Z",
};

const colour: DmcColour = {
    dmcNumber: "310",
    colourName: "Black",
    hex: "#000000",
};

describe("BuyListView", () => {
    it("renders indexed catalogue data and emits remove intent", async () => {
        const user = userEvent.setup();
        const onRemove = vi.fn();

        render(
            <BuyListView
                buyList={[item]}
                colourByNumber={new Map([["310", colour]])}
                inventoryByNumber={new Map()}
                onBrowseCatalogue={vi.fn()}
                onRemove={onRemove}
            />,
        );

        expect(screen.getByText("310 · Black")).toBeInTheDocument();
        await user.click(
            screen.getByRole("button", { name: /remove dmc 310/i }),
        );
        expect(onRemove).toHaveBeenCalledWith(item);
    });

    it("returns to the catalogue from an empty list", async () => {
        const user = userEvent.setup();
        const onBrowseCatalogue = vi.fn();

        render(
            <BuyListView
                buyList={[]}
                colourByNumber={new Map()}
                inventoryByNumber={new Map()}
                onBrowseCatalogue={onBrowseCatalogue}
                onRemove={vi.fn()}
            />,
        );

        await user.click(
            screen.getByRole("button", { name: "Browse the catalogue" }),
        );
        expect(onBrowseCatalogue).toHaveBeenCalledOnce();
    });
});
