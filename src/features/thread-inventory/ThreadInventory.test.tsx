// @vitest-environment jsdom

import "fake-indexeddb/auto";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { db } from "../../lib/database";
import { ThreadInventory } from "./ThreadInventory";

vi.mock("./hooks/useScrollMarker", () => ({
    useScrollMarker: () => ({
        catalogueRef: { current: null },
        scrollMarker: { label: "", top: 0, visible: false },
    }),
}));

describe("ThreadInventory", () => {
    beforeEach(async () => {
        await db.delete();
        await db.open();
    });

    afterEach(async () => {
        await db.delete();
    });

    it("edits inventory and completes an owned-colour buy-list journey", async () => {
        const user = userEvent.setup();
        render(<ThreadInventory />);

        await user.type(
            screen.getByRole("searchbox", {
                name: "Search by DMC number or colour name",
            }),
            "310",
        );
        await user.click(
            screen.getByRole("button", { name: /edit dmc 310, black/i }),
        );
        const editor = screen.getByRole("dialog");
        await user.click(
            within(editor).getByRole("button", {
                name: "Add one full skein",
            }),
        );
        await user.click(
            within(editor).getByRole("button", { name: "Save changes" }),
        );

        await waitFor(() =>
            expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
        );
        expect(await screen.findByText("1 full skein")).toBeInTheDocument();

        await user.click(
            screen.getByRole("button", { name: "Add DMC 310 to buy list" }),
        );
        const confirmation = screen.getByRole("alertdialog");
        await user.click(
            within(confirmation).getByRole("button", {
                name: "Add another to buy list",
            }),
        );
        const navigation = within(
            screen.getByRole("navigation", { name: "Primary views" }),
        );

        await waitFor(() =>
            expect(
                navigation.getByRole("button", { name: /buy list/i }),
            ).toHaveTextContent("(1)"),
        );
        await user.click(navigation.getByRole("button", { name: /buy list/i }));
        expect(screen.getByText("310 · Black")).toBeInTheDocument();
        await user.click(
            screen.getByRole("button", {
                name: "Remove DMC 310 from buy list",
            }),
        );

        expect(
            await screen.findByText("Your buy list is empty"),
        ).toBeInTheDocument();
    });
});
