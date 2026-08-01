import { describe, expect, it } from "vitest";
import type { DmcColour } from "../types/thread";
import { sortAndGroupColours } from "./thread-sorting";

const colours: DmcColour[] = [
    { dmcNumber: "731", colourName: "Olive", hex: "#77752B" },
    { dmcNumber: "99", colourName: "Rose", hex: "#A84858" },
    { dmcNumber: "312", colourName: "Blue", hex: "#084878" },
    { dmcNumber: "105", colourName: "Brown", hex: "#7A482A" },
    { dmcNumber: "995", colourName: "Blue Dark", hex: "#0878C8" },
    { dmcNumber: "White", colourName: "White", hex: "#F8F8F8" },
];

describe("catalogue sorting", () => {
    it("sorts numeric identifiers into hundred ranges", () => {
        const groups = sortAndGroupColours(colours, "number");

        expect(groups.map((group) => group.label)).toEqual([
            "0–99",
            "100–199",
            "300–399",
            "700–799",
            "900–999",
            "Special",
        ]);
        expect(groups.flatMap((group) => group.colours).map((colour) => colour.dmcNumber)).toEqual([
            "99",
            "105",
            "312",
            "731",
            "995",
            "White",
        ]);
    });

    it("keeps colours in the same family together", () => {
        const groups = sortAndGroupColours(colours, "colour");
        const blue = groups.find((group) => group.label === "Blue");

        expect(
            blue?.colours
                .map((colour) => colour.dmcNumber)
                .sort(),
        ).toEqual(["312", "995"]);
    });
});