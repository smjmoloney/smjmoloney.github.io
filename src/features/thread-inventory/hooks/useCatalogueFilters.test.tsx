// @vitest-environment jsdom

import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { DmcColour } from "../../../types/thread";
import { useCatalogueFilters } from "./useCatalogueFilters";

const colours: DmcColour[] = [
    { dmcNumber: "310", colourName: "Black", hex: "#000000" },
    { dmcNumber: "321", colourName: "Red", hex: "#C72B3B" },
    { dmcNumber: "995", colourName: "Electric Blue", hex: "#2696B6" },
];

describe("useCatalogueFilters", () => {
    it("owns search, status, and grouping transitions", () => {
        const { result } = renderHook(() =>
            useCatalogueFilters(colours, new Map()),
        );

        act(() => result.current.setQuery("blue"));
        expect(result.current.filteredColours).toEqual([colours[2]]);

        act(() => {
            result.current.setQuery("");
            result.current.setSort("colour");
        });
        expect(
            result.current.groupedColours.map((group) => group.label),
        ).toEqual(["Neutral", "Red", "Blue"]);

        act(() => result.current.setStatus("need"));
        expect(result.current.filteredColours).toHaveLength(3);
    });
});
