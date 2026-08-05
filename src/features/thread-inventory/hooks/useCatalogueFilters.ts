import { useState } from "react";
import {
    sortAndGroupColours,
    type CatalogueSort,
} from "../../../lib/thread-sorting";
import type {
    DmcColour,
    InventoryStatus,
    ThreadInventoryRecord,
} from "../../../types/thread";
import { filterCatalogueColours } from "../threadInventoryUtils";

export const useCatalogueFilters = (
    colours: readonly DmcColour[],
    inventoryByNumber: ReadonlyMap<string, ThreadInventoryRecord>,
) => {
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState<InventoryStatus>("all");
    const [sort, setSort] = useState<CatalogueSort>("number");
    const filteredColours = filterCatalogueColours(
        colours,
        inventoryByNumber,
        query,
        status,
    );
    const groupedColours = sortAndGroupColours(filteredColours, sort);

    return {
        filteredColours,
        groupedColours,
        query,
        setQuery,
        setSort,
        setStatus,
        sort,
        status,
    };
};
