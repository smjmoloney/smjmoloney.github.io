import type { DmcThreadRange } from "../types/thread";

interface CatalogueValidationOptions {
    expectedCount: number;
    requiredIdentifiers?: readonly string[];
}

export function getCatalogueValidationErrors(
    range: DmcThreadRange,
    { expectedCount, requiredIdentifiers = [] }: CatalogueValidationOptions,
): string[] {
    const errors: string[] = [];
    const identifiers = new Set<string>();

    if (range.colours.length !== expectedCount) {
        errors.push(
            `Expected ${expectedCount} colours, received ${range.colours.length}.`,
        );
    }

    for (const [index, colour] of range.colours.entries()) {
        const location = `Colour at index ${index}`;

        if (!colour.dmcNumber.trim()) {
            errors.push(`${location} has an empty DMC identifier.`);
        } else if (colour.dmcNumber !== colour.dmcNumber.trim()) {
            errors.push(
                `${location} has surrounding whitespace in its DMC identifier.`,
            );
        } else if (identifiers.has(colour.dmcNumber)) {
            errors.push(`Duplicate DMC identifier: ${colour.dmcNumber}.`);
        } else {
            identifiers.add(colour.dmcNumber);
        }

        if (!colour.colourName.trim()) {
            errors.push(`${location} has an empty colour name.`);
        } else if (colour.colourName !== colour.colourName.trim()) {
            errors.push(`${location} has surrounding whitespace in its name.`);
        }

        if (!/^#[0-9A-F]{6}$/.test(colour.hex)) {
            errors.push(
                `${location} has an invalid hex colour: ${colour.hex}.`,
            );
        }
    }

    for (const identifier of requiredIdentifiers) {
        if (!identifiers.has(identifier)) {
            errors.push(`Required DMC identifier is missing: ${identifier}.`);
        }
    }

    return errors;
}
