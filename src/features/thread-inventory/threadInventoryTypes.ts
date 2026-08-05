import type { RemainingLevel } from "../../types/thread";

export type InventoryView = "catalogue" | "buy-list";

export type InventoryEditorDraft = {
    fullSkeins: number;
    activeSkeinRemaining?: RemainingLevel;
    notes?: string;
};

export type ScrollMarkerState = {
    label: string;
    top: number;
    visible: boolean;
};
