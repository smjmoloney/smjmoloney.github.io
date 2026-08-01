# Catalogue Data

## Target Range

Thread Tracker targets DMC Mouliné Spécial six-strand cotton, product reference
`117MC`. DMC's US product listing exposed 504 selectable options when checked on
1 August 2026. Its structured product endpoint contained 505 unique colour
records; DMC 336, Indigo Blue, was the sole record marked out of stock.

Thread Tracker retains all 505 records because purchase availability should not
remove a colour from a personal inventory. The generated snapshot is intended
for private, noncommercial reference use by the owner of this application.

## Generation

Run:

```sh
npm run generate:catalogue
```

The generator reads DMC's structured US `117MC` product endpoint. It preserves
numeric identifiers as strings, maps `BLANC` to `White` and `ECRU` to `Ecru`,
uses familiar traditional names from the 454-row legacy reference where
available, and retains current DMC presentation names for newer colours. Sharp's
dominant-colour analysis on each thread swatch image derives an approximate
display hex value. The generated TypeScript snapshot is checked in so ordinary
builds remain deterministic and work without network access.

Generated entries use natural numeric ordering. Codes such as `01` retain their
official leading zero but sort by numeric value; special identifiers such as
`B5200`, `Ecru`, and `White` follow the numeric catalogue.

Seven incomplete source records use explicit legacy fallbacks:

- DMC 3685 uses legacy RGB value `#881531` because its current record has no
	swatch image.
- DMC 3773, 504, 731, 781, 806, and 971 use expanded legacy names because their
	current records have blank presentation names. Their current swatch images
	still provide the approximate display colours.

## Sources Reviewed

### DMC product pages

DMC's product listing verifies the current 504 selectable-option scope. The
structured endpoint provides exact codes, presentation names, availability, and
swatch images for 505 inventory records. DMC's website terms limit reproduction
to personal and private noncommercial use, which is the scope of this tool.

### `sharlagelfand/dmc`

The R package contains 454 processed rows. Its raw reference names and documented
normalization rules provide familiar search terms for those established colours,
plus the seven explicit fallback fields listed above. Its processing script
identifies `adrianj/CrossStitchCreator` as the source of the underlying floss
data.

## Validation Contract

The catalogue tests enforce:

- The expected 505-row inventory count.
- Unique, non-empty exact-string identifiers without surrounding whitespace.
- Non-empty trimmed colour names.
- Uppercase six-digit hexadecimal colours.
- Preservation of identifiers used by the original 12-colour fixture.

Screen colours remain approximate recognition aids and are not authoritative
colour-matching values.