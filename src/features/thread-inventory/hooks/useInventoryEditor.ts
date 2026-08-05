import { toast } from "sonner";
import { saveInventory } from "../../../lib/database";
import type { DmcColour, ThreadRangeId } from "../../../types/thread";
import type { InventoryEditorDraft } from "../threadInventoryTypes";

export const useInventoryEditor = (rangeId: ThreadRangeId) => {
    const saveThread = async (
        colour: DmcColour,
        draft: InventoryEditorDraft,
    ): Promise<boolean> => {
        try {
            await saveInventory({
                rangeId,
                dmcNumber: colour.dmcNumber,
                ...draft,
                updatedAt: new Date().toISOString(),
            });
            toast.success("Thread saved");
            return true;
        } catch {
            toast.error("Your changes could not be saved. Please try again.");
            return false;
        }
    };

    return { saveThread };
};
