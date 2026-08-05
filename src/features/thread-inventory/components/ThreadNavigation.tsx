import type { InventoryView } from "../threadInventoryTypes";

interface ThreadNavigationProps {
    buyListCount: number;
    onViewChange: (view: InventoryView) => void;
    view: InventoryView;
}

export const ThreadNavigation = ({
    buyListCount,
    onViewChange,
    view,
}: ThreadNavigationProps) => (
    <header className="border-b border-neutral-200/80 bg-[#fafafa]/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 pb-4 pt-[calc(1rem+env(safe-area-inset-top))] sm:px-6 lg:px-8">
            <nav
                className="w-fit rounded-sm border border-neutral-200/80 bg-white"
                aria-label="Primary views"
            >
                <button
                    type="button"
                    className={`min-h-11 px-5 text-sm ${view === "catalogue" ? "bg-neutral-900 text-white" : "text-neutral-600 hover:bg-neutral-100"}`}
                    onClick={() => onViewChange("catalogue")}
                >
                    Catalogue
                </button>
                <button
                    type="button"
                    className={`inline-flex min-h-11 items-center gap-1.5 px-5 text-sm ${view === "buy-list" ? "bg-neutral-900 text-white" : "bg-white text-neutral-600 hover:bg-neutral-100"}`}
                    onClick={() => onViewChange("buy-list")}
                >
                    Buy list
                    <span
                        className={
                            view === "buy-list"
                                ? "text-neutral-300"
                                : "text-neutral-500"
                        }
                    >
                        ({buyListCount})
                    </span>
                </button>
            </nav>
        </div>
    </header>
);
