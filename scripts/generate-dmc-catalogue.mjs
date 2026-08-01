import { writeFile } from "node:fs/promises";
import { parse } from "csv-parse/sync";
import sharp from "sharp";

const PRODUCT_DATA_URL =
    "https://www.dmc.com/US/en/api/quilt/products/mouline-special/product_data";
const LEGACY_NAMES_URL =
    "https://raw.githubusercontent.com/sharlagelfand/dmc/master/data-raw/floss_adrianj.csv";
const OUTPUT_URL = new URL(
    "../src/data/dmc-colours.generated.ts",
    import.meta.url,
);
const EXPECTED_COLOUR_COUNT = 505;
const CONCURRENCY = 8;
const FALLBACK_METADATA = {
    "3685": { hex: "#881531" },
    "3773": { colourName: "Desert Sand - Medium" },
    "504": { colourName: "Blue Green - Very Light" },
    "731": { colourName: "Olive Green - Dark" },
    "781": { colourName: "Topaz - Very Dark" },
    "806": { colourName: "Peacock Blue - Dark" },
    "971": { colourName: "Pumpkin" },
};
const LEGACY_NAME_CORRECTIONS = {
    "311": "Navy Blue - Medium",
    "407": "Desert Sand - Dark",
    "561": "Jade - Very Dark",
    "608": "Orange - Bright",
    "666": "Red - Bright",
    "890": "Pistachio Green - Ultra Dark",
    "934": "Avocado Green - Black",
    "943": "Aquamarine - Medium",
    "966": "Baby Green - Medium",
    "3773": "Desert Sand - Medium",
    "3844": "Turquoise - Dark Bright",
    "3845": "Turquoise - Medium Bright",
    "3846": "Turquoise - Light Bright",
};

function cleanLegacyName(name) {
    const replacements = {
        Ult: "Ultra",
        Vy: "Very",
        Dk: "Dark",
        Med: "Medium",
        Lt: "Light",
        Vry: "Very",
        Md: "Medium",
        M: "Medium",
        V: "Very",
        D: "Dark",
        VD: "Very Dark",
        VyDk: "Very Dark",
        Grn: "Green",
        Brt: "Bright",
        Ylw: "Yellow",
        Brn: "Brown",
        U: "Ultra",
    };
    let cleaned = name.replaceAll("?", " ");

    for (const [abbreviation, replacement] of Object.entries(replacements)) {
        cleaned = cleaned.replace(
            new RegExp(`\\b${abbreviation}\\b`, "g"),
            replacement,
        );
    }

    cleaned = cleaned.replace(/\s+/g, " ").trim();
    const descriptions = [
        "Ultra Very Light",
        "Ultra Very Dark",
        "Medium Very Light",
        "Medium Very Dark",
        "Medium Light",
        "Medium Dark",
        "Ultra Light",
        "Ultra Pale",
        "Ultra Dark",
        "Very Light",
        "Very Dark",
        "Pale Light",
        "Light",
        "Pale",
        "Medium",
        "Dark",
        "Bright",
        "Deep",
    ];
    const description = descriptions.find((value) =>
        cleaned.endsWith(` ${value}`),
    );
    if (description) {
        cleaned = `${cleaned.slice(0, -description.length).trim()} - ${description}`;
    }

    return cleaned
        .replace("Blue Gray", "Gray Blue")
        .replaceAll("Sea Green", "Seagreen");
}

async function getLegacyNames() {
    const response = await fetch(LEGACY_NAMES_URL);
    if (!response.ok) {
        throw new Error(`Could not fetch legacy names (${response.status}).`);
    }

    const rows = parse(await response.text(), {
        bom: true,
        columns: true,
        skip_empty_lines: true,
    });
    return new Map(
        rows.map((row) => {
            const identifier = normalizeIdentifier(row["Floss#"].trim());
            const colourName =
                LEGACY_NAME_CORRECTIONS[identifier] ??
                cleanLegacyName(row.Description);
            return [identifier, colourName];
        }),
    );
}

function normalizeIdentifier(code) {
    if (code === "BLANC") return "White";
    if (code === "ECRU") return "Ecru";
    return code;
}

function compareIdentifiers(left, right) {
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

function toHex({ r, g, b }) {
    return `#${[r, g, b]
        .map((channel) => channel.toString(16).padStart(2, "0"))
        .join("")
        .toUpperCase()}`;
}

async function getApproximateHex(swatchUrl) {
    const response = await fetch(swatchUrl);
    if (!response.ok) {
        throw new Error(
            `Could not fetch swatch (${response.status}): ${swatchUrl}`,
        );
    }

    const image = Buffer.from(await response.arrayBuffer());
    const { dominant } = await sharp(image).stats();
    return toHex(dominant);
}

async function mapWithConcurrency(items, mapper) {
    const results = new Array(items.length);
    let nextIndex = 0;

    async function worker() {
        while (nextIndex < items.length) {
            const index = nextIndex++;
            results[index] = await mapper(items[index], index);
        }
    }

    await Promise.all(
        Array.from(
            { length: Math.min(CONCURRENCY, items.length) },
            () => worker(),
        ),
    );
    return results;
}

const [response, legacyNames] = await Promise.all([
    fetch(PRODUCT_DATA_URL, { headers: { Accept: "application/json" } }),
    getLegacyNames(),
]);
if (!response.ok) {
    throw new Error(`Could not fetch product data (${response.status}).`);
}

const product = await response.json();
const variants = product.variants.sort(
    (left, right) => left.position - right.position,
);

if (variants.length !== EXPECTED_COLOUR_COUNT) {
    throw new Error(
        `Expected ${EXPECTED_COLOUR_COUNT} colour variants, received ${variants.length}.`,
    );
}

const colours = await mapWithConcurrency(variants, async (variant, index) => {
    const code = variant.colour?.code?.trim();
    const identifier = normalizeIdentifier(code);
    const fallback = FALLBACK_METADATA[code];
    const colourName =
        legacyNames.get(identifier) ||
        variant.colour?.presentation?.trim() ||
        fallback?.colourName;
    const swatchUrl = variant.colour?.swatch;

    if (!code || !colourName || (!swatchUrl && !fallback?.hex)) {
        throw new Error(`Variant at index ${index} is missing colour metadata.`);
    }

    const colour = {
        dmcNumber: identifier,
        colourName,
        hex: swatchUrl ? await getApproximateHex(swatchUrl) : fallback.hex,
    };

    if ((index + 1) % 50 === 0 || index === variants.length - 1) {
        console.log(
            `[catalogue] Processed ${index + 1}/${variants.length} colours.`,
        );
    }

    return colour;
});

const identifiers = new Set(colours.map((colour) => colour.dmcNumber));
if (identifiers.size !== colours.length) {
    throw new Error("Generated catalogue contains duplicate DMC identifiers.");
}

colours.sort((left, right) =>
    compareIdentifiers(left.dmcNumber, right.dmcNumber),
);

const source = `import type { DmcColour } from "../types/thread";

// Generated by scripts/generate-dmc-catalogue.mjs from DMC's US 117MC product data.
// Names and screen colours are approximate reference aids for personal use.
export const moulineSpecialColours = ${JSON.stringify(colours, null, 4)} satisfies DmcColour[];
`;

await writeFile(OUTPUT_URL, source, "utf8");
console.log(
    `[catalogue] Wrote ${colours.length} colours to ${OUTPUT_URL.pathname}.`,
);