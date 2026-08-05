import { Trash2 } from "lucide-react";
import type {
    BuyListItem,
    DmcColour,
    ThreadInventoryRecord,
} from "../../../types/thread";
import { getStockSummary, isOwned } from "../threadInventoryUtils";

interface BuyListItemCardProps {
    colour: DmcColour;
    inventory?: ThreadInventoryRecord;
    item: BuyListItem;
    onRemove: (item: BuyListItem) => void;
}

export const BuyListItemCard = ({
    colour,
    inventory,
    item,
    onRemove,
}: BuyListItemCardProps) => {
    const owned = isOwned(inventory);

    return (
        <article className="flex items-center gap-4 rounded-sm border border-neutral-200/80 bg-white p-3 sm:p-4">
            <span
                className="size-14 shrink-0 rounded-sm border border-black/5"
                style={{ backgroundColor: colour.hex }}
                aria-hidden="true"
            />
            <div className="min-w-0 flex-1">
                <h3 className="text-base font-medium text-neutral-900">
                    {colour.dmcNumber} · {colour.colourName}
                </h3>
                <p
                    className={`mt-1 text-sm ${owned ? "text-neutral-700" : "text-neutral-600"}`}
                >
                    {owned
                        ? `Already owned: ${getStockSummary(inventory)}`
                        : "Not currently owned"}
                </p>
            </div>
            <button
                type="button"
                className="grid size-11 shrink-0 place-items-center rounded-sm text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                onClick={() => onRemove(item)}
                aria-label={`Remove DMC ${colour.dmcNumber} from buy list`}
            >
                <Trash2 size={19} />
            </button>
        </article>
    );
};
