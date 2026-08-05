// @vitest-environment jsdom

import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { CatalogueGroup } from "../../../lib/thread-sorting";
import { CatalogueGrid } from "./CatalogueGrid";

const groups: CatalogueGroup[] = [
    {
        key: "300",
        label: "300–399",
        colours: [{ dmcNumber: "310", colourName: "Black", hex: "#000000" }],
    },
];

describe("CatalogueGrid", () => {
    it("renders accessible groups and their cards", () => {
        render(
            <CatalogueGrid
                buyListByNumber={new Map()}
                catalogueRef={createRef<HTMLElement>()}
                groups={groups}
                inventoryByNumber={new Map()}
                matchingCount={1}
                onAddToBuyList={vi.fn()}
                onEdit={vi.fn()}
                sort="number"
            />,
        );

        expect(
            screen.getByRole("heading", { name: "300–399" }),
        ).toBeInTheDocument();
        expect(screen.getByText("1").closest("p")).toHaveTextContent(
            "Showing 1 matching colour",
        );
        expect(
            screen.getByRole("button", { name: /edit dmc 310/i }),
        ).toBeInTheDocument();
    });

    it("renders the filtered empty state", () => {
        render(
            <CatalogueGrid
                buyListByNumber={new Map()}
                catalogueRef={createRef<HTMLElement>()}
                groups={[]}
                inventoryByNumber={new Map()}
                matchingCount={0}
                onAddToBuyList={vi.fn()}
                onEdit={vi.fn()}
                sort="number"
            />,
        );

        expect(screen.getByText("No matching colours")).toBeInTheDocument();
    });
});
