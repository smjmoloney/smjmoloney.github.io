import { Search } from "lucide-react";
import type { RefObject } from "react";
import type { CatalogueGroup } from "../../../lib/thread-sorting";
import type {
    BuyListItem,
    DmcColour,
    ThreadInventoryRecord,
} from "../../../types/thread";
import { ThreadCard } from "./ThreadCard";

interface CatalogueGridProps {
    buyListByNumber: ReadonlyMap<string, BuyListItem>;
    catalogueRef: RefObject<HTMLElement | null>;
    groups: CatalogueGroup[];
    inventoryByNumber: ReadonlyMap<string, ThreadInventoryRecord>;
    matchingCount: number;
    onAddToBuyList: (colour: DmcColour) => void;
    onEdit: (colour: DmcColour) => void;
    sort: string;
}

export const CatalogueGrid = ({
    buyListByNumber,
    catalogueRef,
    groups,
    inventoryByNumber,
    matchingCount,
    onAddToBuyList,
    onEdit,
    sort,
}: CatalogueGridProps) => (
    <>
        <div className="mt-16 flex items-center justify-between gap-4">
            <p className="text-sm text-neutral-600" aria-live="polite">
                Showing{" "}
                <strong className="font-medium text-neutral-900">
                    {matchingCount}
                </strong>{" "}
                matching {matchingCount === 1 ? "colour" : "colours"}
            </p>
        </div>

        {matchingCount ? (
            <section
                ref={catalogueRef}
                className="space-y-8"
                aria-label="DMC colour catalogue"
            >
                {groups.map((group) => {
                    const headingId = `catalogue-group-${sort}-${group.key}`;

                    return (
                        <section
                            key={group.key}
                            data-catalogue-group={group.label}
                            aria-labelledby={headingId}
                        >
                            <h2 id={headingId} className="sr-only">
                                {group.label}
                            </h2>
                            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                                {group.colours.map((colour) => (
                                    <ThreadCard
                                        key={colour.dmcNumber}
                                        colour={colour}
                                        inventory={inventoryByNumber.get(
                                            colour.dmcNumber,
                                        )}
                                        onEdit={onEdit}
                                        onAddToBuyList={onAddToBuyList}
                                        isOnBuyList={buyListByNumber.has(
                                            colour.dmcNumber,
                                        )}
                                    />
                                ))}
                            </div>
                        </section>
                    );
                })}
            </section>
        ) : (
            <div className="rounded-sm border border-dashed border-neutral-200 bg-white px-6 py-14 text-center">
                <Search className="mx-auto text-neutral-400" size={28} />
                <h2 className="mt-3 text-lg font-medium">
                    No matching colours
                </h2>
                <p className="mt-1 text-sm text-neutral-600">
                    Clear your search or choose another filter.
                </p>
            </div>
        )}
    </>
);
