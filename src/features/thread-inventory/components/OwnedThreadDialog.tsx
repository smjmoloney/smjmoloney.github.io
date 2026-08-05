import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { CircleAlert } from "lucide-react";
import type { DmcColour, ThreadInventoryRecord } from "../../../types/thread";
import { getStockSummary } from "../threadInventoryUtils";

interface OwnedThreadDialogProps {
    colour: DmcColour | null;
    inventory?: ThreadInventoryRecord;
    onCancel: VoidFunction;
    onConfirm: VoidFunction;
}

export const OwnedThreadDialog = ({
    colour,
    inventory,
    onCancel,
    onConfirm,
}: OwnedThreadDialogProps) => (
    <AlertDialog.Root
        open={Boolean(colour)}
        onOpenChange={(open) => !open && onCancel()}
    >
        <AlertDialog.Portal>
            <AlertDialog.Overlay className="fixed inset-0 z-50 bg-neutral-950/40 backdrop-blur-[2px]" />
            <AlertDialog.Content className="fixed left-1/2 top-1/2 z-60 w-[min(92vw,460px)] -translate-x-1/2 -translate-y-1/2 rounded-sm bg-white p-6 shadow-[0_8px_24px_rgba(23,23,23,0.12)]">
                <div className="flex size-11 items-center justify-center rounded-sm bg-neutral-100 text-neutral-700">
                    <CircleAlert size={22} />
                </div>
                <AlertDialog.Title className="mt-4 text-xl font-medium text-neutral-900">
                    You already own this colour
                </AlertDialog.Title>
                <AlertDialog.Description className="mt-2 text-sm leading-5 text-neutral-600">
                    {colour
                        ? `DMC ${colour.dmcNumber}, ${colour.colourName}. ${getStockSummary(inventory)}.`
                        : ""}
                </AlertDialog.Description>
                <div className="mt-6 flex justify-end gap-3">
                    <AlertDialog.Cancel className="min-h-11 rounded-sm border border-neutral-200 px-4 text-sm text-neutral-700 hover:bg-neutral-50">
                        Cancel
                    </AlertDialog.Cancel>
                    <AlertDialog.Action
                        className="min-h-11 rounded-sm bg-neutral-900 px-4 text-sm text-white hover:bg-neutral-800"
                        onClick={onConfirm}
                    >
                        Add another to buy list
                    </AlertDialog.Action>
                </div>
            </AlertDialog.Content>
        </AlertDialog.Portal>
    </AlertDialog.Root>
);
