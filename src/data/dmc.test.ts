import { describe, expect, it } from "vitest";
import { getCatalogueValidationErrors } from "../lib/catalogue";
import type { DmcThreadRange } from "../types/thread";
import { moulineSpecial } from "./dmc";

const fixtureIdentifiers = [
    "B5200",
    "Ecru",
    "310",
    "321",
    "444",
    "550",
    "666",
    "699",
    "798",
    "995",
    "3348",
    "3865",
] as const;

describe("Mouline Special catalogue", () => {
    it("satisfies the complete catalogue contract", () => {
        expect(
            getCatalogueValidationErrors(moulineSpecial, {
                expectedCount: 505,
                requiredIdentifiers: fixtureIdentifiers,
            }),
        ).toEqual([]);
        expect(
            moulineSpecial.colours.find((colour) => colour.dmcNumber === "310")
                ?.colourName,
        ).toBe("Black");
        expect(
            moulineSpecial.colours.find((colour) => colour.dmcNumber === "321")
                ?.colourName,
        ).toBe("Red");

        const numericIdentifiers = moulineSpecial.colours
            .map((colour) => colour.dmcNumber)
            .filter((identifier) => /^\d+$/.test(identifier));
        expect(numericIdentifiers.map(Number)).toEqual(
            [...numericIdentifiers.map(Number)].sort(
                (left, right) => left - right,
            ),
        );
        expect(numericIdentifiers).toContain("01");
        expect(numericIdentifiers.indexOf("99")).toBeLessThan(
            numericIdentifiers.indexOf("105"),
        );
        expect(numericIdentifiers.indexOf("731")).toBeLessThan(
            numericIdentifiers.indexOf("732"),
        );
    });

    it("reports malformed and duplicate catalogue entries", () => {
        const invalidRange: DmcThreadRange = {
            ...moulineSpecial,
            colours: [
                { dmcNumber: "310", colourName: "Black", hex: "#000000" },
                { dmcNumber: "310", colourName: " ", hex: "#ffffff" },
                { dmcNumber: " 321", colourName: "Red ", hex: "#C72B3B" },
            ],
        };

        expect(
            getCatalogueValidationErrors(invalidRange, {
                expectedCount: 4,
                requiredIdentifiers: ["B5200"],
            }),
        ).toEqual([
            "Expected 4 colours, received 3.",
            "Duplicate DMC identifier: 310.",
            "Colour at index 1 has an empty colour name.",
            "Colour at index 1 has an invalid hex colour: #ffffff.",
            "Colour at index 2 has surrounding whitespace in its DMC identifier.",
            "Colour at index 2 has surrounding whitespace in its name.",
            "Required DMC identifier is missing: B5200.",
        ]);
    });
});
