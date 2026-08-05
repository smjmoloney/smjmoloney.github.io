// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CatalogueControls } from "./CatalogueControls";

describe("CatalogueControls", () => {
    it("emits search, status, and sort changes through accessible controls", async () => {
        const user = userEvent.setup();
        const onQueryChange = vi.fn();
        const onSortChange = vi.fn();
        const onStatusChange = vi.fn();

        render(
            <CatalogueControls
                lowStockCount={2}
                onQueryChange={onQueryChange}
                onSortChange={onSortChange}
                onStatusChange={onStatusChange}
                ownedCount={10}
                query=""
                sort="number"
                status="all"
                totalCount={505}
            />,
        );

        await user.type(
            screen.getByRole("searchbox", {
                name: "Search by DMC number or colour name",
            }),
            "310",
        );
        await user.click(screen.getByRole("button", { name: /low 2/i }));
        await user.click(screen.getByRole("button", { name: "Colour" }));

        expect(onQueryChange).toHaveBeenLastCalledWith("0");
        expect(onStatusChange).toHaveBeenCalledWith("low");
        expect(onSortChange).toHaveBeenCalledWith("colour");
    });
});
