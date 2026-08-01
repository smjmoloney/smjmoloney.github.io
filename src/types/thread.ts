export const THREAD_RANGE_IDS = {
    moulineSpecial: "mouline-special",
} as const;

export type ThreadRangeId =
    (typeof THREAD_RANGE_IDS)[keyof typeof THREAD_RANGE_IDS];

export type RemainingLevel =
    | "full"
    | "three-quarter"
    | "half"
    | "quarter"
    | "low"
    | "empty";

export interface DmcColour {
    dmcNumber: string;
    colourName: string;
    hex: `#${string}`;
}

export interface DmcThreadRange {
    rangeId: ThreadRangeId;
    name: string;
    productReference: string;
    material: string;
    strandStructure: string;
    catalogueStatus: "fixture" | "complete";
    colours: DmcColour[];
}

export interface ThreadInventoryRecord {
    rangeId: ThreadRangeId;
    dmcNumber: string;
    fullSkeins: number;
    activeSkeinRemaining?: RemainingLevel;
    notes?: string;
    updatedAt: string;
}

export interface BuyListItem {
    rangeId: ThreadRangeId;
    dmcNumber: string;
    quantity: number;
    addedAt: string;
}

export type InventoryStatus = "all" | "owned" | "need" | "low";
