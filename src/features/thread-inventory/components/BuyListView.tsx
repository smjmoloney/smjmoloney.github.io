import { ShoppingBasket } from "lucide-react";
import type {
    BuyListItem,
    DmcColour,
    ThreadInventoryRecord,
} from "../../../types/thread";
import { BuyListItemCard } from "./BuyListItemCard";

interface BuyListViewProps {
    buyList: BuyListItem[];
    colourByNumber: ReadonlyMap<string, DmcColour>;
    inventoryByNumber: ReadonlyMap<string, ThreadInventoryRecord>;
    onBrowseCatalogue: VoidFunction;
    onRemove: (item: BuyListItem) => void;
}

export const BuyListView = ({
    buyList,
    colourByNumber,
    inventoryByNumber,
    onBrowseCatalogue,
    onRemove,
}: BuyListViewProps) => (
    <section>
        <div className="mb-5">
            <h2 className="text-xl font-medium text-neutral-900">
                Your personal buy list
            </h2>
            <p className="mt-1 text-sm text-neutral-600">
                A private checklist for shopping elsewhere. Current stock is
                shown to help prevent duplicate purchases.
            </p>
        </div>
        {buyList.length ? (
            <div className="space-y-3">
                {buyList.map((item) => {
                    const colour = colourByNumber.get(item.dmcNumber);
                    if (!colour) return null;

                    return (
                        <BuyListItemCard
                            key={`${item.rangeId}-${item.dmcNumber}`}
                            colour={colour}
                            inventory={inventoryByNumber.get(item.dmcNumber)}
                            item={item}
                            onRemove={onRemove}
                        />
                    );
                })}
            </div>
        ) : (
            <div className="rounded-sm border border-dashed border-neutral-200 bg-white px-6 py-14 text-center">
                <ShoppingBasket
                    className="mx-auto text-neutral-400"
                    size={30}
                />
                <h3 className="mt-3 text-lg font-medium">
                    Your buy list is empty
                </h3>
                <p className="mt-1 text-sm text-neutral-600">
                    Add colours from the catalogue when you want to replace or
                    restock them.
                </p>
                <button
                    type="button"
                    className="mt-5 min-h-11 rounded-sm bg-neutral-900 px-4 text-sm text-white hover:bg-neutral-800"
                    onClick={onBrowseCatalogue}
                >
                    Browse the catalogue
                </button>
            </div>
        )}
    </section>
);
