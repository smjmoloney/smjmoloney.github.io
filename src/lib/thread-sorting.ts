import type { DmcColour } from "../types/thread";

export type CatalogueSort = "number" | "colour";

export type CatalogueGroup = {
    key: string;
    label: string;
    colours: DmcColour[];
};

const colourFamilies = [
    "Neutral",
    "Red",
    "Orange",
    "Yellow",
    "Green",
    "Blue",
    "Purple",
    "Pink",
] as const;

function compareIdentifiers(left: string, right: string): number {
    const leftIsNumeric = /^\d+$/.test(left);
    const rightIsNumeric = /^\d+$/.test(right);

    if (leftIsNumeric && rightIsNumeric) {
        return Number(left) - Number(right) || left.localeCompare(right);
    }
    if (leftIsNumeric) return -1;
    if (rightIsNumeric) return 1;
    return left.localeCompare(right, "en", {
        numeric: true,
        sensitivity: "base",
    });
}

function getColourMetrics(hex: string) {
    const [red, green, blue] = [
        Number.parseInt(hex.slice(1, 3), 16) / 255,
        Number.parseInt(hex.slice(3, 5), 16) / 255,
        Number.parseInt(hex.slice(5, 7), 16) / 255,
    ];
    const maximum = Math.max(red, green, blue);
    const minimum = Math.min(red, green, blue);
    const delta = maximum - minimum;
    const lightness = (maximum + minimum) / 2;
    const saturation =
        delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));
    let hue = 0;

    if (delta !== 0) {
        if (maximum === red) hue = 60 * (((green - blue) / delta) % 6);
        else if (maximum === green) hue = 60 * ((blue - red) / delta + 2);
        else hue = 60 * ((red - green) / delta + 4);
    }

    return { hue: hue < 0 ? hue + 360 : hue, lightness, saturation };
}

function getColourFamily(hex: string) {
    const metrics = getColourMetrics(hex);
    let familyIndex = 0;

    if (metrics.saturation >= 0.12) {
        if (metrics.hue < 15 || metrics.hue >= 345) familyIndex = 1;
        else if (metrics.hue < 45) familyIndex = 2;
        else if (metrics.hue < 75) familyIndex = 3;
        else if (metrics.hue < 170) familyIndex = 4;
        else if (metrics.hue < 255) familyIndex = 5;
        else if (metrics.hue < 315) familyIndex = 6;
        else familyIndex = 7;
    }

    return {
        ...metrics,
        familyIndex,
        family: colourFamilies[familyIndex],
    };
}

function getNumberGroup(identifier: string) {
    if (!/^\d+$/.test(identifier)) {
        return { key: "special", label: "Special" };
    }

    const start = Math.floor(Number(identifier) / 100) * 100;
    return { key: String(start), label: `${start}–${start + 99}` };
}

export function sortAndGroupColours(
    colours: readonly DmcColour[],
    sort: CatalogueSort,
): CatalogueGroup[] {
    const sorted = [...colours].sort((left, right) => {
        if (sort === "number") {
            return compareIdentifiers(left.dmcNumber, right.dmcNumber);
        }

        const leftColour = getColourFamily(left.hex);
        const rightColour = getColourFamily(right.hex);
        return (
            leftColour.familyIndex - rightColour.familyIndex ||
            leftColour.hue - rightColour.hue ||
            rightColour.lightness - leftColour.lightness ||
            compareIdentifiers(left.dmcNumber, right.dmcNumber)
        );
    });

    const groups = new Map<string, CatalogueGroup>();
    for (const colour of sorted) {
        const group =
            sort === "number"
                ? getNumberGroup(colour.dmcNumber)
                : (() => {
                      const family = getColourFamily(colour.hex).family;
                      return { key: family.toLowerCase(), label: family };
                  })();
        const existing = groups.get(group.key);
        if (existing) existing.colours.push(colour);
        else groups.set(group.key, { ...group, colours: [colour] });
    }

    return [...groups.values()];
}
