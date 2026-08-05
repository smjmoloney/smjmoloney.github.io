import type { RemainingLevel } from "../types/thread";

export const remainingLevelCopy: Record<RemainingLevel, string> = {
    full: "Full active skein",
    "three-quarter": "About three quarters remaining",
    half: "About half remaining",
    quarter: "About one quarter remaining",
    low: "Running low",
    empty: "Empty",
};

export const remainingLevelOptions = Object.entries(
    remainingLevelCopy,
) as Array<[RemainingLevel, string]>;
