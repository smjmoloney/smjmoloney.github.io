import * as AlertDialog from "@radix-ui/react-alert-dialog";
import * as Dialog from "@radix-ui/react-dialog";
import { useLiveQuery } from "dexie-react-hooks";
import {
    Check,
    ChevronDown,
    CircleAlert,
    Hash,
    Minus,
    Palette,
    Plus,
    Search,
    ShoppingBasket,
    Trash2,
    X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast, Toaster } from "sonner";
import { moulineSpecial } from "../../data/dmc";
import {
    addToBuyList,
    db,
    removeFromBuyList,
    saveInventory,
} from "../../lib/database";
import {
    remainingLevelCopy,
    remainingLevelOptions,
} from "../../lib/thread-copy";
import {
    sortAndGroupColours,
    type CatalogueSort,
} from "../../lib/thread-sorting";
import type {
    BuyListItem,
    DmcColour,
    InventoryStatus,
    RemainingLevel,
    ThreadInventoryRecord,
} from "../../types/thread";

const range = moulineSpecial;

function isOwned(record?: ThreadInventoryRecord): boolean {
    return Boolean(
        record &&
            (record.fullSkeins > 0 ||
                (record.activeSkeinRemaining &&
                    record.activeSkeinRemaining !== "empty")),
    );
}

function isLowStock(record?: ThreadInventoryRecord): boolean {
    return Boolean(
        record &&
            record.fullSkeins === 0 &&
            (record.activeSkeinRemaining === "quarter" ||
                record.activeSkeinRemaining === "low"),
    );
}

function stockSummary(record?: ThreadInventoryRecord): string {
    if (!record || !isOwned(record)) return "Not owned";

    const full = `${record.fullSkeins} full ${record.fullSkeins === 1 ? "skein" : "skeins"}`;
    if (!record.activeSkeinRemaining || record.activeSkeinRemaining === "empty") {
        return full;
    }

    return `${full} · ${remainingLevelCopy[record.activeSkeinRemaining]}`;
}

interface ThreadCardProps {
    colour: DmcColour;
    inventory?: ThreadInventoryRecord;
    onEdit: (colour: DmcColour) => void;
    onAddToBuyList: (colour: DmcColour) => void;
    isOnBuyList: boolean;
}

function ThreadCard({
    colour,
    inventory,
    onEdit,
    onAddToBuyList,
    isOnBuyList,
}: ThreadCardProps) {
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
                            {stockSummary(inventory)}
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
                    aria-label={isOnBuyList ? `DMC ${colour.dmcNumber} is on your buy list` : `Add DMC ${colour.dmcNumber} to buy list`}
                >
                    {isOnBuyList ? <Check size={16} /> : <ShoppingBasket size={16} />}
                    {isOnBuyList ? "Added" : "Add"}
                </button>
            </div>
        </article>
    );
}

interface EditorProps {
    colour: DmcColour | null;
    inventory?: ThreadInventoryRecord;
    onClose: () => void;
}

function ThreadEditor({ colour, inventory, onClose }: EditorProps) {
    const [fullSkeins, setFullSkeins] = useState(0);
    const [remaining, setRemaining] = useState<RemainingLevel | "">("");
    const [notes, setNotes] = useState("");

    useEffect(() => {
        setFullSkeins(inventory?.fullSkeins ?? 0);
        setRemaining(inventory?.activeSkeinRemaining ?? "");
        setNotes(inventory?.notes ?? "");
    }, [colour, inventory]);

    if (!colour) return null;

    async function handleSave() {
        if (!colour) return;
        try {
            await saveInventory({
                rangeId: range.rangeId,
                dmcNumber: colour.dmcNumber,
                fullSkeins,
                activeSkeinRemaining: remaining || undefined,
                notes: notes.trim() || undefined,
                updatedAt: new Date().toISOString(),
            });
            toast.success("Thread saved");
            onClose();
        } catch {
            toast.error("Your changes could not be saved. Please try again.");
        }
    }

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
                        <Dialog.Close className="grid size-11 place-items-center rounded-sm text-neutral-600 hover:bg-neutral-100" aria-label="Close without saving">
                            <X size={20} />
                        </Dialog.Close>
                    </div>

                    <div className="mt-5 space-y-5">
                        <fieldset>
                            <legend className="text-sm text-neutral-700">Full skeins</legend>
                            <div className="mt-2 inline-grid grid-cols-[44px_72px_44px] items-center overflow-hidden rounded-sm border border-neutral-200">
                                <button
                                    type="button"
                                    className="grid size-11 place-items-center hover:bg-neutral-100 disabled:text-neutral-300"
                                    onClick={() => setFullSkeins((value) => Math.max(0, value - 1))}
                                    disabled={fullSkeins === 0}
                                    aria-label="Remove one full skein"
                                >
                                    <Minus size={18} />
                                </button>
                                <output className="text-center text-sm" aria-live="polite">
                                    {fullSkeins}
                                </output>
                                <button
                                    type="button"
                                    className="grid size-11 place-items-center hover:bg-neutral-100"
                                    onClick={() => setFullSkeins((value) => value + 1)}
                                    aria-label="Add one full skein"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>
                        </fieldset>

                        <label className="block">
                            <span className="text-sm text-neutral-700">Active skein</span>
                            <span className="relative mt-2 block">
                                <select
                                    className="min-h-12 w-full appearance-none rounded-sm border border-neutral-200 bg-white px-3 pr-10 text-sm text-neutral-800"
                                    value={remaining}
                                    onChange={(event) => setRemaining(event.target.value as RemainingLevel | "")}
                                >
                                    <option value="">No active skein</option>
                                    {remainingLevelOptions.map(([value, label]) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                            </span>
                        </label>

                        <label className="block">
                            <span className="text-sm text-neutral-700">Notes</span>
                            <textarea
                                className="mt-2 min-h-24 w-full resize-y rounded-sm border border-neutral-200 px-3 py-2 text-sm"
                                value={notes}
                                onChange={(event) => setNotes(event.target.value)}
                                placeholder="Optional notes about this colour"
                            />
                        </label>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <button type="button" className="min-h-12 rounded-sm border border-neutral-200 text-sm text-neutral-700 hover:bg-neutral-50" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="button" className="min-h-12 rounded-sm bg-neutral-900 text-sm text-white hover:bg-neutral-800" onClick={handleSave}>
                            Save changes
                        </button>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

export default function ThreadInventory() {
    const inventory = useLiveQuery(() => db.inventory.toArray(), []) ?? [];
    const buyList = useLiveQuery(() => db.buyList.toArray(), []) ?? [];
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState<InventoryStatus>("all");
    const [sort, setSort] = useState<CatalogueSort>("number");
    const [view, setView] = useState<"catalogue" | "buy-list">("catalogue");
    const [scrollMarker, setScrollMarker] = useState({ label: "", top: 0, visible: false });
    const [editingColour, setEditingColour] = useState<DmcColour | null>(null);
    const [pendingBuyColour, setPendingBuyColour] = useState<DmcColour | null>(null);
    const catalogueRef = useRef<HTMLElement>(null);

    const inventoryByNumber = new Map(inventory.map((record) => [record.dmcNumber, record]));
    const buyListByNumber = new Map(buyList.map((item) => [item.dmcNumber, item]));
    const ownedCount = range.colours.filter((colour) => isOwned(inventoryByNumber.get(colour.dmcNumber))).length;
    const lowStockCount = range.colours.filter((colour) => isLowStock(inventoryByNumber.get(colour.dmcNumber))).length;

    const normalizedQuery = query.trim().toLocaleLowerCase();
    const filteredColours = range.colours.filter((colour) => {
        const matchesQuery =
            !normalizedQuery ||
            colour.dmcNumber.toLocaleLowerCase().includes(normalizedQuery) ||
            colour.colourName.toLocaleLowerCase().includes(normalizedQuery);
        const record = inventoryByNumber.get(colour.dmcNumber);
        const matchesStatus =
            status === "all" ||
            (status === "owned" && isOwned(record)) ||
            (status === "need" && !isOwned(record)) ||
            (status === "low" && isLowStock(record));
        return matchesQuery && matchesStatus;
    });
    const groupedColours = sortAndGroupColours(filteredColours, sort);
    const groupSignature = groupedColours.map((group) => group.key).join("|");

    useEffect(() => {
        let frame = 0;

        function updateScrollMarker() {
            const catalogue = catalogueRef.current;
            if (!catalogue || view !== "catalogue") {
                setScrollMarker((marker) => ({ ...marker, visible: false }));
                return;
            }

            const documentHeight = document.documentElement.scrollHeight;
            const viewportHeight = window.innerHeight;
            const scrollRange = Math.max(documentHeight - viewportHeight, 1);
            const thumbHeight = Math.max((viewportHeight * viewportHeight) / documentHeight, 24);
            const thumbTravel = Math.max(viewportHeight - thumbHeight, 0);
            const thumbCenter = (window.scrollY / scrollRange) * thumbTravel + thumbHeight / 2;
            const catalogueBounds = catalogue.getBoundingClientRect();
            const sections = Array.from(catalogue.querySelectorAll<HTMLElement>("[data-catalogue-group]"));
            const currentSection = sections.reduce((current, section) =>
                section.getBoundingClientRect().top <= 64 ? section : current,
            sections[0]);

            setScrollMarker({
                label: currentSection?.dataset.catalogueGroup ?? "",
                top: thumbCenter,
                visible: catalogueBounds.top < viewportHeight && catalogueBounds.bottom > 0,
            });
        }

        function scheduleUpdate() {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(updateScrollMarker);
        }

        scheduleUpdate();
        window.addEventListener("scroll", scheduleUpdate, { passive: true });
        window.addEventListener("resize", scheduleUpdate);
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("scroll", scheduleUpdate);
            window.removeEventListener("resize", scheduleUpdate);
        };
    }, [groupSignature, view]);

    async function commitBuyList(colour: DmcColour) {
        const existing = buyListByNumber.get(colour.dmcNumber);
        const item: BuyListItem = {
            rangeId: range.rangeId,
            dmcNumber: colour.dmcNumber,
            quantity: existing?.quantity ?? 1,
            addedAt: existing?.addedAt ?? new Date().toISOString(),
        };
        try {
            await addToBuyList(item);
            toast.success("Added to your buy list");
        } catch {
            toast.error("This colour could not be added. Please try again.");
        }
    }

    function requestAddToBuyList(colour: DmcColour) {
        if (isOwned(inventoryByNumber.get(colour.dmcNumber))) {
            setPendingBuyColour(colour);
            return;
        }
        void commitBuyList(colour);
    }

    async function handleRemoveFromBuyList(item: BuyListItem) {
        try {
            await removeFromBuyList(item.rangeId, item.dmcNumber);
            toast.success("Removed from your buy list");
        } catch {
            toast.error("This colour could not be removed. Please try again.");
        }
    }

    return (
        <div className="min-h-screen pb-[calc(2rem+env(safe-area-inset-bottom))]">
            <Toaster position="top-center" richColors closeButton />
            {scrollMarker.visible && (
                <div
                    className="pointer-events-none fixed right-3 z-30 -translate-y-1/2 rounded-sm border border-neutral-300 bg-white/95 px-2.5 py-1 text-sm font-medium text-neutral-700 shadow-sm backdrop-blur"
                    style={{ top: scrollMarker.top }}
                    aria-hidden="true"
                >
                    {scrollMarker.label}
                </div>
            )}
            <header className="border-b border-neutral-200/80 bg-[#fafafa]/95 backdrop-blur">
                <div className="mx-auto max-w-7xl px-4 pb-4 pt-[calc(1rem+env(safe-area-inset-top))] sm:px-6 lg:px-8">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <nav className="rounded-sm border border-neutral-200/80 bg-white" aria-label="Primary views">
                            <button
                                type="button"
                                className={`min-h-11 px-5 text-sm ${view === "catalogue" ? "bg-neutral-900 text-white" : "text-neutral-600 hover:bg-neutral-100"}`}
                                onClick={() => setView("catalogue")}
                            >
                                Catalogue
                            </button>
                            <button
                                type="button"
                                className={`inline-flex min-h-11 items-center gap-1.5 px-5 text-sm ${view === "buy-list" ? "bg-neutral-900 text-white" : "bg-white text-neutral-600 hover:bg-neutral-100"}`}
                                onClick={() => setView("buy-list")}
                            >
                                Buy list
                                <span className={view === "buy-list" ? "text-neutral-300" : "text-neutral-500"}>({buyList.length})</span>
                            </button>
                        </nav>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
                {view === "catalogue" ? (
                    <>
                        <section aria-label="Catalogue controls">
                            <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
                                <label className="block min-w-0 flex-1">
                                    <span className="sr-only">Search by DMC number or colour name</span>
                                    <span className="relative block">
                                        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={19} />
                                        <input
                                            type="search"
                                            className="min-h-11 w-full rounded-sm border border-neutral-200 bg-white pl-10 pr-11 text-sm leading-tight"
                                            value={query}
                                            onChange={(event) => setQuery(event.target.value)}
                                            placeholder="For example, 310 or Black"
                                        />
                                        {query ? (
                                            <button type="button" className="absolute right-1 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded text-neutral-500 hover:bg-neutral-100" onClick={() => setQuery("")} aria-label="Clear search">
                                                <X size={18} />
                                            </button>
                                        ) : null}
                                    </span>
                                </label>
                                <div className="flex min-w-0 flex-wrap gap-2">
                                    <div className="flex max-w-full shrink-0 gap-1 overflow-x-auto rounded-sm border border-neutral-200/80 bg-white" aria-label="Filter catalogue">
                                        {([
                                            ["all", "All", range.colours.length],
                                            ["owned", "Owned", ownedCount],
                                            ["need", "Needed", range.colours.length - ownedCount],
                                            ["low", "Low", lowStockCount],
                                        ] as Array<[InventoryStatus, string, number]>).map(([value, label, count]) => (
                                            <button
                                                key={value}
                                                type="button"
                                                className={`min-h-10 shrink-0 px-3 text-sm ${status === value ? "bg-neutral-900 text-white" : "text-neutral-600 hover:text-neutral-950"}`}
                                                onClick={() => setStatus(value)}
                                                aria-pressed={status === value}
                                            >
                                                {label} <span className="ml-1 opacity-70">{count}</span>
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex shrink-0 gap-1 rounded-sm border border-neutral-200/80 bg-white" aria-label="Sort catalogue">
                                        {([
                                            ["number", "Number", Hash],
                                            ["colour", "Colour", Palette],
                                        ] as const).map(([value, label, Icon]) => (
                                            <button
                                                key={value}
                                                type="button"
                                                className={`inline-flex min-h-10 items-center gap-1.5 px-3 text-sm ${sort === value ? "bg-neutral-900 text-white" : "text-neutral-600 hover:text-neutral-950"}`}
                                                onClick={() => setSort(value)}
                                                aria-pressed={sort === value}
                                            >
                                                <Icon size={16} aria-hidden="true" />
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <p className="mt-2 text-sm leading-tight text-neutral-500">Colour swatches are approximate and may differ from physical thread.</p>
                        </section>

                        <div className="mt-16 flex items-center justify-between gap-4">
                            <p className="text-sm text-neutral-600" aria-live="polite">
                                Showing <strong className="font-medium text-neutral-900">{filteredColours.length}</strong> matching {filteredColours.length === 1 ? "colour" : "colours"}
                            </p>
                        </div>

                        {filteredColours.length ? (
                            <section ref={catalogueRef} className="space-y-8" aria-label="DMC colour catalogue">
                                {groupedColours.map((group) => {
                                    const headingId = `catalogue-group-${sort}-${group.key}`;
                                    return (
                                        <section key={group.key} data-catalogue-group={group.label} aria-labelledby={headingId}>
                                            <h2 id={headingId} className="sr-only">{group.label}</h2>
                                            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                                                {group.colours.map((colour) => (
                                                    <ThreadCard
                                                        key={colour.dmcNumber}
                                                        colour={colour}
                                                        inventory={inventoryByNumber.get(colour.dmcNumber)}
                                                        onEdit={setEditingColour}
                                                        onAddToBuyList={requestAddToBuyList}
                                                        isOnBuyList={buyListByNumber.has(colour.dmcNumber)}
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
                                <h2 className="mt-3 text-lg font-medium">No matching colours</h2>
                                <p className="mt-1 text-sm text-neutral-600">Clear your search or choose another filter.</p>
                            </div>
                        )}
                    </>
                ) : (
                    <section>
                        <div className="mb-5">
                            <h2 className="text-xl font-medium text-neutral-900">Your personal buy list</h2>
                            <p className="mt-1 text-sm text-neutral-600">A private checklist for shopping elsewhere. Current stock is shown to help prevent duplicate purchases.</p>
                        </div>
                        {buyList.length ? (
                            <div className="space-y-3">
                                {buyList.map((item) => {
                                    const colour = range.colours.find((candidate) => candidate.dmcNumber === item.dmcNumber);
                                    if (!colour) return null;
                                    const record = inventoryByNumber.get(item.dmcNumber);
                                    return (
                                        <article key={`${item.rangeId}-${item.dmcNumber}`} className="flex items-center gap-4 rounded-sm border border-neutral-200/80 bg-white p-3 sm:p-4">
                                            <span className="size-14 shrink-0 rounded-sm border border-black/5" style={{ backgroundColor: colour.hex }} aria-hidden="true" />
                                            <div className="min-w-0 flex-1">
                                                <h3 className="text-base font-medium text-neutral-900">{colour.dmcNumber} · {colour.colourName}</h3>
                                                <p className={`mt-1 text-sm ${isOwned(record) ? "text-neutral-700" : "text-neutral-600"}`}>
                                                    {isOwned(record) ? `Already owned: ${stockSummary(record)}` : "Not currently owned"}
                                                </p>
                                            </div>
                                            <button type="button" className="grid size-11 shrink-0 place-items-center rounded-sm text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900" onClick={() => void handleRemoveFromBuyList(item)} aria-label={`Remove DMC ${colour.dmcNumber} from buy list`}>
                                                <Trash2 size={19} />
                                            </button>
                                        </article>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="rounded-sm border border-dashed border-neutral-200 bg-white px-6 py-14 text-center">
                                <ShoppingBasket className="mx-auto text-neutral-400" size={30} />
                                <h3 className="mt-3 text-lg font-medium">Your buy list is empty</h3>
                                <p className="mt-1 text-sm text-neutral-600">Add colours from the catalogue when you want to replace or restock them.</p>
                                <button type="button" className="mt-5 min-h-11 rounded-sm bg-neutral-900 px-4 text-sm text-white hover:bg-neutral-800" onClick={() => setView("catalogue")}>Browse the catalogue</button>
                            </div>
                        )}
                    </section>
                )}
            </main>

            <ThreadEditor
                colour={editingColour}
                inventory={editingColour ? inventoryByNumber.get(editingColour.dmcNumber) : undefined}
                onClose={() => setEditingColour(null)}
            />

            <AlertDialog.Root open={Boolean(pendingBuyColour)} onOpenChange={(open) => !open && setPendingBuyColour(null)}>
                <AlertDialog.Portal>
                    <AlertDialog.Overlay className="fixed inset-0 z-50 bg-neutral-950/40 backdrop-blur-[2px]" />
                    <AlertDialog.Content className="fixed left-1/2 top-1/2 z-60 w-[min(92vw,460px)] -translate-x-1/2 -translate-y-1/2 rounded-sm bg-white p-6 shadow-[0_8px_24px_rgba(23,23,23,0.12)]">
                        <div className="flex size-11 items-center justify-center rounded-sm bg-neutral-100 text-neutral-700"><CircleAlert size={22} /></div>
                        <AlertDialog.Title className="mt-4 text-xl font-medium text-neutral-900">You already own this colour</AlertDialog.Title>
                        <AlertDialog.Description className="mt-2 text-sm leading-5 text-neutral-600">
                            {pendingBuyColour && `DMC ${pendingBuyColour.dmcNumber}, ${pendingBuyColour.colourName}. ${stockSummary(inventoryByNumber.get(pendingBuyColour.dmcNumber))}.`}
                        </AlertDialog.Description>
                        <div className="mt-6 flex justify-end gap-3">
                            <AlertDialog.Cancel className="min-h-11 rounded-sm border border-neutral-200 px-4 text-sm text-neutral-700 hover:bg-neutral-50">Cancel</AlertDialog.Cancel>
                            <AlertDialog.Action
                                className="min-h-11 rounded-sm bg-neutral-900 px-4 text-sm text-white hover:bg-neutral-800"
                                onClick={() => {
                                    if (pendingBuyColour) void commitBuyList(pendingBuyColour);
                                    setPendingBuyColour(null);
                                }}
                            >
                                Add another to buy list
                            </AlertDialog.Action>
                        </div>
                    </AlertDialog.Content>
                </AlertDialog.Portal>
            </AlertDialog.Root>
        </div>
    );
}