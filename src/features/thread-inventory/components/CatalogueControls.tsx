import { Hash, Palette, Search, X } from "lucide-react";
import type { CatalogueSort } from "../../../lib/thread-sorting";
import type { InventoryStatus } from "../../../types/thread";

interface CatalogueControlsProps {
    lowStockCount: number;
    onQueryChange: (query: string) => void;
    onSortChange: (sort: CatalogueSort) => void;
    onStatusChange: (status: InventoryStatus) => void;
    ownedCount: number;
    query: string;
    sort: CatalogueSort;
    status: InventoryStatus;
    totalCount: number;
}

const sortOptions = [
    { icon: Hash, label: "Number", value: "number" },
    { icon: Palette, label: "Colour", value: "colour" },
] as const;

export const CatalogueControls = ({
    lowStockCount,
    onQueryChange,
    onSortChange,
    onStatusChange,
    ownedCount,
    query,
    sort,
    status,
    totalCount,
}: CatalogueControlsProps) => {
    const statusOptions: Array<{
        count: number;
        label: string;
        value: InventoryStatus;
    }> = [
        { count: totalCount, label: "All", value: "all" },
        { count: ownedCount, label: "Owned", value: "owned" },
        { count: totalCount - ownedCount, label: "Needed", value: "need" },
        { count: lowStockCount, label: "Low", value: "low" },
    ];

    return (
        <section aria-label="Catalogue controls">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
                <label className="block min-w-0 flex-1">
                    <span className="sr-only">
                        Search by DMC number or colour name
                    </span>
                    <span className="relative block">
                        <Search
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
                            size={19}
                        />
                        <input
                            type="search"
                            className="min-h-11 w-full rounded-sm border border-neutral-200 bg-white pl-10 pr-11 text-sm leading-tight"
                            value={query}
                            onChange={(event) =>
                                onQueryChange(event.target.value)
                            }
                            placeholder="For example, 310 or Black"
                        />
                        {query ? (
                            <button
                                type="button"
                                className="absolute right-1 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded text-neutral-500 hover:bg-neutral-100"
                                onClick={() => onQueryChange("")}
                                aria-label="Clear search"
                            >
                                <X size={18} />
                            </button>
                        ) : null}
                    </span>
                </label>
                <div className="flex min-w-0 flex-wrap gap-2">
                    <div
                        className="flex max-w-full shrink-0 gap-1 overflow-x-auto rounded-sm border border-neutral-200/80 bg-white"
                        aria-label="Filter catalogue"
                    >
                        {statusOptions.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                className={`min-h-10 shrink-0 px-3 text-sm ${status === option.value ? "bg-neutral-900 text-white" : "text-neutral-600 hover:text-neutral-950"}`}
                                onClick={() => onStatusChange(option.value)}
                                aria-pressed={status === option.value}
                            >
                                {option.label}{" "}
                                <span className="ml-1 opacity-70">
                                    {option.count}
                                </span>
                            </button>
                        ))}
                    </div>
                    <div
                        className="flex shrink-0 gap-1 rounded-sm border border-neutral-200/80 bg-white"
                        aria-label="Sort catalogue"
                    >
                        {sortOptions.map((option) => {
                            const Icon = option.icon;

                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    className={`inline-flex min-h-10 items-center gap-1.5 px-3 text-sm ${sort === option.value ? "bg-neutral-900 text-white" : "text-neutral-600 hover:text-neutral-950"}`}
                                    onClick={() => onSortChange(option.value)}
                                    aria-pressed={sort === option.value}
                                >
                                    <Icon size={16} aria-hidden="true" />
                                    {option.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
            <p className="mt-2 text-sm leading-tight text-neutral-500">
                Colour swatches are approximate and may differ from physical
                thread.
            </p>
        </section>
    );
};
