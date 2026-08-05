import { Check, ShoppingBasket } from "lucide-react";
import type { DmcColour, ThreadInventoryRecord } from "../../../types/thread";
import { getStockSummary, isLowStock, isOwned } from "../threadInventoryUtils";

interface ThreadCardProps {
    colour: DmcColour;
    inventory?: ThreadInventoryRecord;
    isOnBuyList: boolean;
    onAddToBuyList: (colour: DmcColour) => void;
    onEdit: (colour: DmcColour) => void;
}

export const ThreadCard = ({
    colour,
    inventory,
    isOnBuyList,
    onAddToBuyList,
    onEdit,
}: ThreadCardProps) => {
    const lowStock = isLowStock(inventory);
    const owned = isOwned(inventory);

    return (
        <article className="group relative flex min-h-52 flex-col overflow-hidden rounded-sm border border-neutral-200/80 bg-white transition duration-200 hover:border-neutral-300 hover:shadow-[0_2px_8px_rgba(23,23,23,0.05)]">
            <button
                type="button"
                className="flex flex-1 flex-col text-left"
                onClick={() => onEdit(colour)}
                aria-label={`Edit DMC ${colour.dmcNumber}, ${colour.colourName}`}
            >
                <span
                    className="block h-32 w-full border-b border-black/5"
                    style={{ backgroundColor: colour.hex }}
                    aria-hidden="true"
                />
                <span className="flex flex-1 flex-col gap-1 px-3 py-2.5">
                    <span className="block text-base font-medium leading-tight text-neutral-900">
                        {colour.dmcNumber}
                    </span>
                    <span className="block text-sm leading-snug text-neutral-600">
                        {colour.colourName}
                    </span>
                    {owned ? (
                        <span className="mt-1 text-sm leading-snug text-neutral-500">
                            {getStockSummary(inventory)}
                        </span>
                    ) : null}
                </span>
            </button>
            <div className="flex min-h-11 items-center justify-between gap-2 border-t border-neutral-100 px-3 py-1">
                <span className="min-w-0 text-sm leading-none text-neutral-500">
                    {lowStock ? "Low stock" : owned ? "Owned" : "Not owned"}
                </span>
                <button
                    type="button"
                    className="inline-flex min-h-9 shrink-0 items-center justify-center gap-1.5 rounded-sm px-2 text-sm text-neutral-700 hover:bg-neutral-100 disabled:text-neutral-400"
                    onClick={() => onAddToBuyList(colour)}
                    disabled={isOnBuyList}
                    aria-label={
                        isOnBuyList
                            ? `DMC ${colour.dmcNumber} is on your buy list`
                            : `Add DMC ${colour.dmcNumber} to buy list`
                    }
                >
                    {isOnBuyList ? (
                        <Check size={16} />
                    ) : (
                        <ShoppingBasket size={16} />
                    )}
                    {isOnBuyList ? "Added" : "Add"}
                </button>
            </div>
        </article>
    );
};
