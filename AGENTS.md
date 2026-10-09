# Architecture rules

- Keep information-page location records in `src/lib/locais.ts` and generate address-based map and directions URLs from them, so displayed addresses and map searches remain consistent without guessed coordinates.
- Use a Google Maps address embed for the information page, with an external directions link as a fallback, so no private API key or additional map library is required.