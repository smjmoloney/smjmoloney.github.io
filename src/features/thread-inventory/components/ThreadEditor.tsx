import * as Dialog from "@radix-ui/react-dialog";
import { ChevronDown, X } from "lucide-react";
import { useState } from "react";
import { remainingLevelOptions } from "../../../lib/thread-copy";
import type {
    DmcColour,
    RemainingLevel,
    ThreadInventoryRecord,
} from "../../../types/thread";
import type { InventoryEditorDraft } from "../threadInventoryTypes";
import { SkeinCounter } from "./SkeinCounter";

interface ThreadEditorProps {
    colour: DmcColour | null;
    inventory?: ThreadInventoryRecord;
    onClose: VoidFunction;
    onSave: (
        colour: DmcColour,
        draft: InventoryEditorDraft,
    ) => Promise<boolean>;
}

export const ThreadEditor = ({
    colour,
    inventory,
    onClose,
    onSave,
}: ThreadEditorProps) => {
    const [fullSkeins, setFullSkeins] = useState(inventory?.fullSkeins ?? 0);
    const [remaining, setRemaining] = useState<RemainingLevel | "">(
        inventory?.activeSkeinRemaining ?? "",
    );
    const [notes, setNotes] = useState(inventory?.notes ?? "");

    if (!colour) return null;

    const handleSave = async () => {
        const wasSaved = await onSave(colour, {
            fullSkeins,
            activeSkeinRemaining: remaining || undefined,
            notes: notes.trim() || undefined,
        });

        if (wasSaved) onClose();
    };

    return (
        <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-40 bg-neutral-950/40 backdrop-blur-[2px] data-[state=open]:animate-in" />
                <Dialog.Content className="fixed inset-x-0 bottom-0 z-50 max-h-[92vh] overflow-y-auto rounded-t-sm bg-white p-5 shadow-[0_8px_24px_rgba(23,23,23,0.12)] sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:w-[min(92vw,520px)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-sm sm:p-6">
                    <div className="mx-auto mb-4 h-1 w-12 rounded-sm bg-neutral-300 sm:hidden" />
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <Dialog.Title className="text-xl font-medium text-neutral-900">
                                {colour.dmcNumber}
                            </Dialog.Title>
                            <Dialog.Description className="mt-1 text-sm text-neutral-600">
                                {colour.colourName}
                            </Dialog.Description>
                        </div>
                        <Dialog.Close
                            className="grid size-11 place-items-center rounded-sm text-neutral-600 hover:bg-neutral-100"
                            aria-label="Close without saving"
                        >
                            <X size={20} />
                        </Dialog.Close>
                    </div>

                    <div className="mt-5 space-y-5">
                        <SkeinCounter
                            onChange={setFullSkeins}
                            value={fullSkeins}
                        />

                        <label className="block">
                            <span className="text-sm text-neutral-700">
                                Active skein
                            </span>
                            <span className="relative mt-2 block">
                                <select
                                    className="min-h-12 w-full appearance-none rounded-sm border border-neutral-200 bg-white px-3 pr-10 text-sm text-neutral-800"
                                    value={remaining}
                                    onChange={(event) =>
                                        setRemaining(
                                            event.target.value as
                                                RemainingLevel | "",
                                        )
                                    }
                                >
                                    <option value="">No active skein</option>
                                    {remainingLevelOptions.map(
                                        ([value, label]) => (
                                            <option key={value} value={value}>
                                                {label}
                                            </option>
                                        ),
                                    )}
                                </select>
                                <ChevronDown
                                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500"
                                    size={18}
                                />
                            </span>
                        </label>

                        <label className="block">
                            <span className="text-sm text-neutral-700">
                                Notes
                            </span>
                            <textarea
                                className="mt-2 min-h-24 w-full resize-y rounded-sm border border-neutral-200 px-3 py-2 text-sm"
                                value={notes}
                                onChange={(event) =>
                                    setNotes(event.target.value)
                                }
                                placeholder="Optional notes about this colour"
                            />
                        </label>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            className="min-h-12 rounded-sm border border-neutral-200 text-sm text-neutral-700 hover:bg-neutral-50"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="min-h-12 rounded-sm bg-neutral-900 text-sm text-white hover:bg-neutral-800"
                            onClick={handleSave}
                        >
                            Save changes
                        </button>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};
