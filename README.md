# @oglofus/localization [![NPM Version](https://img.shields.io/npm/v/%40oglofus%2Flocalization)](https://www.npmjs.com/package/@oglofus/localization) [![CI](https://github.com/oglofus/localization/actions/workflows/ci.yml/badge.svg)](https://github.com/oglofus/localization/actions/workflows/ci.yml) [![Publish Package to NPM](https://github.com/oglofus/localization/actions/workflows/release-package.yml/badge.svg)](https://github.com/oglofus/localization/actions/workflows/release-package.yml)

A lightweight, strongly typed localization data library for countries, currencies, languages, and timezones.

## Install

```bash
# npm
npm install @oglofus/localization

# pnpm
pnpm add @oglofus/localization

# yarn
yarn add @oglofus/localization

# bun
bun add @oglofus/localization

# deno
deno add npm:@oglofus/localization
```

## Quick start

```ts
import {
  countries,
  countries_alpha2_map,
  currencies,
  currencies_map,
  languages,
  languages_alpha2_map,
  timezones,
  timezones_map,
  country_alpha2_values,
  countries_alpha3_values,
  currency_codes,
  language_alpha2_values,
  language_alpha3_values,
  language_alpha2_to_alpha3,
  language_alpha3_to_alpha2,
  timezones_identifiers,
} from "@oglofus/localization";

// O(1) lookups via the prebuilt maps (preferred)
const us = countries_alpha2_map.US; // full Country object
const usd = currencies_map.USD;
const french = languages_alpha2_map.fr;
const parisTz = timezones_map["Europe/Paris"];

const usEmoji = countries_alpha2_map.US.emoji; // "🇺🇸"
const alpha3 = language_alpha2_to_alpha3.en; // "eng"

// The readonly arrays are still there for iteration and filtering
const euroCountries = countries.filter((c) => c.currencies.includes("EUR"));
```

## Data exports

All datasets are readonly arrays with strongly typed values.

- `continents`: the seven continents with conventional two-letter codes (`AF`, `AN`, `AS`, `EU`, `NA`, `OC`, `SA`).
- `countries`: all 249 ISO 3166-1 assigned countries (plus the user-assigned `XK` Kosovo) with ISO codes, continents, calling codes, current currencies, languages, emoji, IOC codes, and IANA timezones. Transcontinental countries (e.g. Russia, Turkey, Egypt) list every continent their mainland spans.
- `countries_alpha2_map`: quick lookup map of the full `Country` object keyed by alpha-2 code (built from `countries`, so entries are the same objects).
- `countries_alpha3_map`: the same `Country` objects keyed by alpha-3 code.
- `countries_map`: deprecated alias of `countries_alpha2_map`.
- `currencies`: all active ISO 4217 currencies (including funds codes) with code, name, numeric code, and minor-unit precision (`decimals` is `null` for codes without one, e.g. precious metals).
- `languages`: all ISO 639-1 languages plus ISO 639-2-only languages referenced by countries (`alpha2` is `null` for those), with bibliographic codes and English names.
- `timezones`: every IANA `zone.tab` timezone (plus `UTC`) mapped to associated country alpha-2 codes and continents (derived from those countries, since identifier prefixes like `America/` or `Pacific/` are not continents).
- `currencies_map`, `languages_alpha2_map`, `languages_alpha3_map`, `timezones_map`: O(1) lookup maps keyed by the respective code, holding the same objects as the arrays.

All lookup maps are built once at import time from the dataset arrays (about a millisecond in total), so lookups are plain object property accesses — roughly 50x faster than scanning the arrays with `.find()`, with no duplicated data in the bundle.

## Data sources

Datasets are generated from authoritative sources by `scripts/generate.mjs` (`npm run generate`):

- ISO 3166-1 and ISO 639-2 codes from the Debian [iso-codes](https://salsa.debian.org/iso-codes-team/iso-codes) project
- ISO 4217 currencies and minor units from the official [ISO 4217 maintenance agency list](https://www.six-group.com/en/products-services/financial-information/data-standards.html)
- Country-to-currency mappings (current legal tender) and English language names from [Unicode CLDR](https://github.com/unicode-org/cldr-json)
- Timezones from the [IANA time zone database](https://www.iana.org/time-zones) `zone.tab`
- Calling codes, IOC codes, and spoken languages from [country-data](https://www.npmjs.com/package/country-data), with documented corrections
- Continent membership from [restcountries](https://gitlab.com/restcountries/restcountries), with documented corrections for transcontinental countries

## Code lists and types

Each code list is exported as a readonly array plus a union type.

- `continent_codes`, `ContinentCode`
- `country_alpha2_values`, `CountryAlpha2`
- `countries_alpha3_values`, `CountryAlpha3`
- `currency_codes`, `CurrencyCode`
- `language_alpha2_values`, `LanguageAlpha2`
- `language_alpha3_values`, `LanguageAlpha3`
- `timezones_identifiers`, `TimezoneIdentifier`

## Mappings

- `language_alpha2_to_alpha3`: map from alpha-2 to alpha-3 language codes.
- `language_alpha3_to_alpha2`: map from alpha-3 to alpha-2 language codes.

## ESM + TypeScript

This package ships as ESM and includes TypeScript declarations out of the box.

## Runtimes and bundlers

Works out of the box on Node.js (>= 18), Bun, Deno, and in the browser via any bundler.

```ts
// Node / Bun / bundlers (Vite, webpack, Rollup, esbuild)
import { countries_alpha2_map } from "@oglofus/localization";

// Deno
import { countries_alpha2_map } from "npm:@oglofus/localization";
```

### Bundle size (React, Svelte, and other frontend apps)

The package is marked side-effect free and the lookup maps carry `/* @__PURE__ */` annotations, so bundlers only include the datasets you actually use. Importing a single map from the root entry costs ~10 kB minified instead of the ~125 kB full package.

Every module is also available as a subpath import if you want the guarantee regardless of bundler:

```ts
import { currencies_map } from "@oglofus/localization/currencies_map";
import { countries } from "@oglofus/localization/countries";
import { timezones_map } from "@oglofus/localization/timezones_map";
```

## Development

- Build: `npm run build` (outputs to `dist/`)
- Regenerate datasets: `npm run generate` (fetches sources, caches them in `scripts/.cache`)
- Test: `npm test` (builds and runs the dataset integrity suite in `test/`)
- TypeScript config: `tsconfig.json`

## License

ISC License. See the LICENSE file for details.

## Links

- Repository: https://github.com/oglofus/localization
- NPM: https://www.npmjs.com/package/@oglofus/localization
