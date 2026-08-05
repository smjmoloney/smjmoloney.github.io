import { useState } from "react";
import { Toaster } from "sonner";
import { moulineSpecial } from "../../data/dmc";
import type { DmcColour } from "../../types/thread";
import { BuyListView } from "./components/BuyListView";
import { CatalogueControls } from "./components/CatalogueControls";
import { CatalogueGrid } from "./components/CatalogueGrid";
import { OwnedThreadDialog } from "./components/OwnedThreadDialog";
import { ScrollMarker } from "./components/ScrollMarker";
import { ThreadEditor } from "./components/ThreadEditor";
import { ThreadNavigation } from "./components/ThreadNavigation";
import { useBuyListActions } from "./hooks/useBuyListActions";
import { useCatalogueFilters } from "./hooks/useCatalogueFilters";
import { useInventoryEditor } from "./hooks/useInventoryEditor";
import { useScrollMarker } from "./hooks/useScrollMarker";
import { useThreadInventoryData } from "./hooks/useThreadInventoryData";
import type { InventoryView } from "./threadInventoryTypes";

const range = moulineSpecial;

export const ThreadInventory = () => {
    const [view, setView] = useState<InventoryView>("catalogue");
    const [editingColour, setEditingColour] = useState<DmcColour | null>(null);
    const {
        buyList,
        buyListByNumber,
        colourByNumber,
        inventoryByNumber,
        lowStockCount,
        ownedCount,
    } = useThreadInventoryData(range.colours);
    const {
        filteredColours,
        groupedColours,
        query,
        setQuery,
        setSort,
        setStatus,
        sort,
        status,
    } = useCatalogueFilters(range.colours, inventoryByNumber);
    const {
        confirmPendingBuyColour,
        pendingBuyColour,
        removeItemFromBuyList,
        requestAddToBuyList,
        setPendingBuyColour,
    } = useBuyListActions(range.rangeId, inventoryByNumber, buyListByNumber);
    const { saveThread } = useInventoryEditor(range.rangeId);
    const groupSignature = groupedColours.map((group) => group.key).join("|");
    const { catalogueRef, scrollMarker } = useScrollMarker(
        view,
        groupSignature,
    );

    return (
        <div className="min-h-screen pb-[calc(2rem+env(safe-area-inset-bottom))]">
            <Toaster position="top-center" richColors closeButton />
            <ScrollMarker marker={scrollMarker} />
            <ThreadNavigation
                buyListCount={buyList.length}
                onViewChange={setView}
                view={view}
            />

            <main className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
                {view === "catalogue" ? (
                    <>
                        <CatalogueControls
                            lowStockCount={lowStockCount}
                            onQueryChange={setQuery}
                            onSortChange={setSort}
                            onStatusChange={setStatus}
                            ownedCount={ownedCount}
                            query={query}
                            sort={sort}
                            status={status}
                            totalCount={range.colours.length}
                        />
                        <CatalogueGrid
                            buyListByNumber={buyListByNumber}
                            catalogueRef={catalogueRef}
                            groups={groupedColours}
                            inventoryByNumber={inventoryByNumber}
                            matchingCount={filteredColours.length}
                            onAddToBuyList={requestAddToBuyList}
                            onEdit={setEditingColour}
                            sort={sort}
                        />
                    </>
                ) : (
                    <BuyListView
                        buyList={buyList}
                        colourByNumber={colourByNumber}
                        inventoryByNumber={inventoryByNumber}
                        onBrowseCatalogue={() => setView("catalogue")}
                        onRemove={(item) => void removeItemFromBuyList(item)}
                    />
                )}
            </main>

            <ThreadEditor
                key={editingColour?.dmcNumber ?? "closed"}
                colour={editingColour}
                inventory={
                    editingColour
                        ? inventoryByNumber.get(editingColour.dmcNumber)
                        : undefined
                }
                onClose={() => setEditingColour(null)}
                onSave={saveThread}
            />
            <OwnedThreadDialog
                colour={pendingBuyColour}
                inventory={
                    pendingBuyColour
                        ? inventoryByNumber.get(pendingBuyColour.dmcNumber)
                        : undefined
                }
                onCancel={() => setPendingBuyColour(null)}
                onConfirm={confirmPendingBuyColour}
            />
        </div>
    );
};
