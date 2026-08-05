import { THREAD_RANGE_IDS, type DmcThreadRange } from "../types/thread";
import { moulineSpecialColours } from "./dmc-colours.generated";

export const moulineSpecial: DmcThreadRange = {
    rangeId: THREAD_RANGE_IDS.moulineSpecial,
    name: "Mouliné Spécial / Six-Strand Cotton",
    productReference: "117MC",
    material: "100% cotton",
    strandStructure: "Six strand",
    catalogueStatus: "complete",
    colours: moulineSpecialColours,
};
