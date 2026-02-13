# @oglofus/localization [![NPM Version](https://img.shields.io/npm/v/%40oglofus%2Flocalization)](https://www.npmjs.com/package/@oglofus/localization) [![Publish Package to NPM](https://github.com/oglofus/localization/actions/workflows/release-package.yml/badge.svg)](https://github.com/oglofus/localization/actions/workflows/release-package.yml)

A lightweight, strongly typed localization data library for countries, currencies, languages, and timezones.

## Install

```bash
npm install @oglofus/localization
```

```bash
pnpm add @oglofus/localization
```

```bash
yarn add @oglofus/localization
```

```bash
bun add @oglofus/localization
```

## Quick start

```ts
import {
  countries,
  countries_map,
  currencies,
  languages,
  timezones,
  country_alpha2_values,
  country_alpha3_values,
  currency_codes,
  language_alpha2_values,
  language_alpha3_values,
  language_alpha2_to_alpha3,
  language_alpha3_to_alpha2,
  timezones_identifiers,
} from "@oglofus/localization";

const us = countries.find((country) => country.alpha2 === "US");
const usd = currencies.find((currency) => currency.code === "USD");
const french = languages.find((language) => language.alpha2 === "fr");
const parisTz = timezones.find((tz) => tz.identifier === "Europe/Paris");

const usEmoji = countries_map.US.emoji; // "🇺🇸"
const alpha3 = language_alpha2_to_alpha3.en; // "eng"
```

## Data exports

All datasets are readonly arrays with strongly typed values.

- `countries`: list of countries with ISO codes, calling codes, currencies, languages, emoji, and timezones.
- `countries_map`: quick lookup map of country name + emoji keyed by alpha-2 code.
- `currencies`: list of currencies with ISO code, name, number, and decimal precision.
- `languages`: list of languages with ISO alpha-2/alpha-3 codes and bibliographic codes.
- `timezones`: list of timezone identifiers mapped to associated country alpha-2 codes.

## Code lists and types

Each code list is exported as a readonly array plus a union type.

- `country_alpha2_values`, `CountryAlpha2`
- `country_alpha3_values`, `CountryAlpha3`
- `currency_codes`, `CurrencyCode`
- `language_alpha2_values`, `LanguageAlpha2`
- `language_alpha3_values`, `LanguageAlpha3`
- `timezones_identifiers`, `TimezoneIdentifier`

## Mappings

- `language_alpha2_to_alpha3`: map from alpha-2 to alpha-3 language codes.
- `language_alpha3_to_alpha2`: map from alpha-3 to alpha-2 language codes.

## ESM + TypeScript

This package ships as ESM and includes TypeScript declarations out of the box.

## Development

- Build: `npm run build` (outputs to `dist/`)
- TypeScript config: `tsconfig.json`

## License

ISC License. See the LICENSE file for details.

## Links

- Repository: https://github.com/oglofus/localization
- NPM: https://www.npmjs.com/package/@oglofus/localization
