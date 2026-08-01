import {
	THREAD_RANGE_IDS,
	type DmcThreadRange,
} from "../types/thread";

// Temporary UI fixture. Replace only with a complete catalogue whose reuse terms are documented.
export const moulineSpecialFixture: DmcThreadRange = {
	rangeId: THREAD_RANGE_IDS.moulineSpecial,
	name: "Mouliné Spécial / Six-Strand Cotton",
	productReference: "117MC",
	material: "100% cotton",
	strandStructure: "Six strand",
	catalogueStatus: "fixture",
	colours: [
		{ dmcNumber: "B5200", colourName: "Snow White", hex: "#FFFFFF" },
		{ dmcNumber: "Ecru", colourName: "Ecru", hex: "#F0EADA" },
		{ dmcNumber: "310", colourName: "Black", hex: "#000000" },
		{ dmcNumber: "321", colourName: "Red", hex: "#C72B3B" },
		{ dmcNumber: "444", colourName: "Lemon Dark", hex: "#FFD600" },
		{ dmcNumber: "550", colourName: "Violet Very Dark", hex: "#5C184E" },
		{ dmcNumber: "666", colourName: "Bright Red", hex: "#E31D42" },
		{ dmcNumber: "699", colourName: "Green", hex: "#056517" },
		{ dmcNumber: "798", colourName: "Delft Blue Dark", hex: "#466A8E" },
		{ dmcNumber: "995", colourName: "Electric Blue Dark", hex: "#2696B6" },
		{ dmcNumber: "3348", colourName: "Yellow Green Light", hex: "#CCD9B1" },
		{ dmcNumber: "3865", colourName: "Winter White", hex: "#F9F7F1" },
	],
};
