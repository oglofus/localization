/**
 * Regenerates every dataset in src/ from authoritative sources:
 *
 * - ISO 3166-1 country codes:        Debian iso-codes project
 * - ISO 639-2 language codes:        Debian iso-codes project
 * - ISO 4217 currencies + decimals:  SIX Group (official ISO 4217 maintenance agency)
 * - Country -> legal tender:         Unicode CLDR supplemental currencyData
 * - English language names:          Unicode CLDR en locale display names
 * - Timezones per country:           IANA tz database zone.tab
 * - Calling codes, IOC, languages:   country-data npm package (stable fields only)
 *
 * Usage: node scripts/generate.mjs
 * Sources are cached in scripts/.cache; delete it to force a re-download.
 */

import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CACHE = join(ROOT, "scripts", ".cache");
const SRC = join(ROOT, "src");

const SOURCES = {
  "iso_3166-1.json":
    "https://salsa.debian.org/iso-codes-team/iso-codes/-/raw/main/data/iso_3166-1.json",
  "iso_639-2.json":
    "https://salsa.debian.org/iso-codes-team/iso-codes/-/raw/main/data/iso_639-2.json",
  "zone.tab": "https://raw.githubusercontent.com/eggert/tz/main/zone.tab",
  "list-one.xml":
    "https://www.six-group.com/dam/download/financial-information/data-center/iso-currrency/lists/list-one.xml",
  "currencyData.json":
    "https://raw.githubusercontent.com/unicode-org/cldr-json/main/cldr-json/cldr-core/supplemental/currencyData.json",
  "cldr-en-languages.json":
    "https://raw.githubusercontent.com/unicode-org/cldr-json/main/cldr-json/cldr-localenames-full/main/en/languages.json",
  "country-data-countries.json":
    "https://unpkg.com/country-data@0.0.31/data/countries.json",
  "restcountries.json":
    "https://gitlab.com/restcountries/restcountries/-/raw/master/src/main/resources/countriesV3.1.json",
};

/** Seven-continent model with the conventional two-letter codes. */
const CONTINENTS = [
  { code: "AF", name: "Africa" },
  { code: "AN", name: "Antarctica" },
  { code: "AS", name: "Asia" },
  { code: "EU", name: "Europe" },
  { code: "NA", name: "North America" },
  { code: "OC", name: "Oceania" },
  { code: "SA", name: "South America" },
];

/**
 * Continent membership comes from the restcountries dataset. These overrides
 * align the handful of transcontinental countries with the predominant
 * convention (mainland spanning a continental boundary), which restcountries
 * applies inconsistently (e.g. AZ is Europe+Asia but GE is Asia only).
 */
const CONTINENT_OVERRIDES = {
  KZ: ["Asia", "Europe"], // west of the Ural River
  GE: ["Asia", "Europe"], // same Caucasus convention as AZ
  EG: ["Africa", "Asia"], // Sinai Peninsula
  ID: ["Asia", "Oceania"], // Western New Guinea
  TL: ["Asia"], // UN M49: South-Eastern Asia
};

/**
 * country-data is the source for calling codes, IOC codes, and spoken
 * languages only (its currency data is stale, so currencies come from CLDR).
 * These overrides patch the few entries where it is wrong or empty.
 */
const LANGUAGE_OVERRIDES = {
  // country-data lists the invalid code "mot"; Montenegrin is "cnr"
  // (ISO 639-2 assigned 2017). Other official languages per the constitution.
  ME: ["cnr", "srp", "bos", "sqi", "hrv"],
  // country-data lists only English; Filipino is co-official.
  PH: ["fil", "eng"],
  // Empty in country-data; uninhabited territories stay empty.
  AQ: [],
  BV: [],
  HM: [],
  EH: ["ara"],
  MQ: ["fra"],
  MS: ["eng"],
  SJ: ["nor"],
};

/** Fixes for stale or wrong IOC codes in country-data. */
const IOC_OVERRIDES = {
  // Changed in 2016 to match ISO 3166-1 alpha-3.
  LB: "LBN",
  SG: "SGP",
  // No National Olympic Committee; FAI/GCI/JCI are Island Games codes,
  // not IOC codes.
  FO: "",
  GG: "",
  JE: "",
};

/** Fixes for stale or wrong calling codes in country-data. */
const CALLING_CODE_OVERRIDES = {
  // Grenada is part of the NANP; country-data drops the +1.
  GD: ["+1 473"],
  // Pitcairn dropped the Inmarsat +872 code; reachable via New Zealand.
  PN: ["+64"],
  // South Georgia is reached through the Falkland Islands plan.
  GS: ["+500"],
  // French Southern Territories are reached through the Réunion plan.
  TF: ["+262"],
};

/**
 * Kosovo is not in ISO 3166-1 but XK is in widespread "user assigned" use
 * (EU, IMF, SWIFT). XKX is the World Bank convention for the alpha-3 code.
 * Timezone per CLDR windowsZones territory mapping.
 */
const KOSOVO = {
  alpha2: "XK",
  alpha3: "XKX",
  ioc: "KOS",
  name: "Kosovo",
  status: "user assigned",
  timezones: ["Europe/Belgrade"],
};

async function load(name) {
  const path = join(CACHE, name);
  if (!existsSync(path)) {
    const url = SOURCES[name];
    process.stderr.write(`fetching ${url}\n`);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
    await mkdir(CACHE, { recursive: true });
    await writeFile(path, Buffer.from(await res.arrayBuffer()));
  }
  return readFile(path, "utf8");
}

const q = JSON.stringify;
const flagEmoji = (alpha2) =>
  String.fromCodePoint(
    ...[...alpha2].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65),
  );

// ---------------------------------------------------------------------------
// Load sources
// ---------------------------------------------------------------------------

const iso3166 = JSON.parse(await load("iso_3166-1.json"))["3166-1"];
const iso639 = JSON.parse(await load("iso_639-2.json"))["639-2"];
const zoneTab = await load("zone.tab");
const listOne = await load("list-one.xml");
const cldrCurrency = JSON.parse(await load("currencyData.json")).supplemental
  .currencyData;
const cldrLangNames = JSON.parse(await load("cldr-en-languages.json")).main.en
  .localeDisplayNames.languages;
const countryData = JSON.parse(await load("country-data-countries.json"));
const restCountries = JSON.parse(await load("restcountries.json"));

// ---------------------------------------------------------------------------
// Country -> continents
// ---------------------------------------------------------------------------

const continentCodeByName = new Map(CONTINENTS.map((c) => [c.name, c.code]));
const continentsByAlpha2 = new Map();
for (const entry of restCountries) {
  const names = CONTINENT_OVERRIDES[entry.cca2] ?? entry.continents;
  const codes = names.map((name) => {
    const code = continentCodeByName.get(name);
    if (!code) throw new Error(`${entry.cca2}: unknown continent ${name}`);
    return code;
  });
  continentsByAlpha2.set(entry.cca2, codes.sort());
}

// ---------------------------------------------------------------------------
// ISO 4217 currencies (official list-one.xml, includes minor units)
// ---------------------------------------------------------------------------

const currencyByCode = new Map();
const countryNameToCurrencies = new Map();
for (const block of listOne.matchAll(/<CcyNtry>([\s\S]*?)<\/CcyNtry>/g)) {
  const get = (tag) => {
    const m = block[1].match(new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`));
    return m ? m[1].trim() : null;
  };
  const code = get("Ccy");
  if (!code) continue; // e.g. Antarctica: "No universal currency"
  const entry = {
    code,
    decimals: /^\d+$/.test(get("CcyMnrUnts") ?? "")
      ? Number(get("CcyMnrUnts"))
      : null,
    name: get("CcyNm"),
    number: get("CcyNbr"),
  };
  const prev = currencyByCode.get(code);
  if (
    prev &&
    (prev.number !== entry.number || prev.decimals !== entry.decimals)
  ) {
    throw new Error(`inconsistent ISO 4217 data for ${code}`);
  }
  currencyByCode.set(code, prev ?? entry);
  const country = get("CtryNm");
  if (country) {
    if (!countryNameToCurrencies.has(country))
      countryNameToCurrencies.set(country, []);
    countryNameToCurrencies.get(country).push(code);
  }
}
const currencies = [...currencyByCode.values()].sort((a, b) =>
  a.code < b.code ? -1 : 1,
);

// ---------------------------------------------------------------------------
// Country -> currencies currently in use (CLDR, filtered to today; keeps
// non-tender ISO funds codes such as CHE/CHW/MXV/USN, drops XXX)
// ---------------------------------------------------------------------------

const today = new Date().toISOString().slice(0, 10);
function currentCurrencies(region) {
  const out = [];
  for (const item of cldrCurrency.region[region] ?? []) {
    for (const [code, meta] of Object.entries(item)) {
      if (code === "XXX") continue;
      if (meta._to && meta._to < today) continue;
      if (meta._from && meta._from > today) continue;
      if (!currencyByCode.has(code)) {
        // CLDR carries some non-ISO market codes (e.g. CNH) as non-tender.
        if (meta._tender === "false") continue;
        throw new Error(`${region}: tender currency ${code} not in ISO 4217`);
      }
      out.push(code);
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Timezones (IANA zone.tab: every assigned country with at least one zone)
// ---------------------------------------------------------------------------

const zonesByCountry = new Map();
const countriesByZone = new Map();
for (const line of zoneTab.split("\n")) {
  if (!line || line.startsWith("#")) continue;
  const [cc, , zone] = line.split("\t");
  if (!zonesByCountry.has(cc)) zonesByCountry.set(cc, []);
  zonesByCountry.get(cc).push(zone.trim());
  countriesByZone.set(zone.trim(), [cc]);
}
zonesByCountry.set(KOSOVO.alpha2, KOSOVO.timezones);
for (const zone of KOSOVO.timezones)
  countriesByZone.get(zone).push(KOSOVO.alpha2);

const timezoneIdentifiers = [...countriesByZone.keys(), "UTC"].sort();
countriesByZone.set("UTC", []);

// ---------------------------------------------------------------------------
// Countries (ISO 3166-1 + Kosovo)
// ---------------------------------------------------------------------------

const countryDataByAlpha2 = new Map();
for (const entry of countryData) {
  if (entry.status === "assigned" || entry.alpha2 === "XK") {
    countryDataByAlpha2.set(entry.alpha2, entry);
  }
}

const countries = iso3166
  .map((entry) => {
    const alpha2 = entry.alpha_2;
    const extra = countryDataByAlpha2.get(alpha2);
    if (!extra) throw new Error(`no country-data entry for ${alpha2}`);
    const emoji = flagEmoji(alpha2);
    if (entry.flag && entry.flag !== emoji)
      throw new Error(`flag mismatch for ${alpha2}`);
    if (!continentsByAlpha2.has(alpha2))
      throw new Error(`no continent data for ${alpha2}`);
    return {
      alpha2,
      alpha3: entry.alpha_3,
      continents: continentsByAlpha2.get(alpha2),
      countryCallingCodes:
        CALLING_CODE_OVERRIDES[alpha2] ?? extra.countryCallingCodes,
      currencies: currentCurrencies(alpha2),
      emoji,
      ioc: IOC_OVERRIDES[alpha2] ?? extra.ioc,
      languages: LANGUAGE_OVERRIDES[alpha2] ?? extra.languages,
      name: entry.common_name ?? entry.name,
      status: "assigned",
      timezones: (zonesByCountry.get(alpha2) ?? []).slice().sort(),
    };
  })
  .concat([
    {
      ...KOSOVO,
      continents: continentsByAlpha2.get("XK"),
      countryCallingCodes: countryDataByAlpha2.get("XK").countryCallingCodes,
      currencies: currentCurrencies("XK"),
      emoji: flagEmoji("XK"),
      languages: countryDataByAlpha2.get("XK").languages,
    },
  ])
  .sort((a, b) => (a.alpha2 < b.alpha2 ? -1 : 1));

// ---------------------------------------------------------------------------
// Languages: every ISO 639-1 language, plus 639-2-only codes referenced by
// countries (alpha2 is null for those)
// ---------------------------------------------------------------------------

const referenced = new Set(countries.flatMap((c) => c.languages));
const iso639ByAlpha3 = new Map(iso639.map((e) => [e.alpha_3, e]));
for (const code of referenced) {
  if (!iso639ByAlpha3.has(code))
    throw new Error(`country references unknown language ${code}`);
}

const languageName = (entry) =>
  cldrLangNames[entry.alpha_2] ??
  cldrLangNames[entry.alpha_3] ??
  entry.name.split(";")[0].trim();

const languages = iso639
  .filter((e) => e.alpha_2 || referenced.has(e.alpha_3))
  .map((e) => ({
    alpha2: e.alpha_2 ?? null,
    alpha3: e.alpha_3,
    bibliographic: e.bibliographic ?? "",
    name: languageName(e),
  }))
  .sort((a, b) => (a.alpha3 < b.alpha3 ? -1 : 1));

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

const currencyCodes = new Set(currencies.map((c) => c.code));
const languageAlpha3 = new Set(languages.map((l) => l.alpha3));
const tzSet = new Set(timezoneIdentifiers);
for (const c of countries) {
  for (const code of c.currencies)
    if (!currencyCodes.has(code))
      throw new Error(`${c.alpha2}: unknown currency ${code}`);
  for (const code of c.languages)
    if (!languageAlpha3.has(code))
      throw new Error(`${c.alpha2}: unknown language ${code}`);
  for (const tz of c.timezones)
    if (!tzSet.has(tz)) throw new Error(`${c.alpha2}: unknown timezone ${tz}`);
}

// ---------------------------------------------------------------------------
// Emit
// ---------------------------------------------------------------------------

const HEADER = `// Generated by scripts/generate.mjs — do not edit by hand.\n// Run \`npm run generate\` to refresh from authoritative sources.\n\n`;

async function emit(file, body) {
  await writeFile(join(SRC, file), HEADER + body);
  process.stderr.write(`wrote src/${file}\n`);
}

const list = (values) => values.map((v) => `  ${q(v)},\n`).join("");

await emit(
  "continents_codes.ts",
  `export const continent_codes = [\n${list(
    CONTINENTS.map((c) => c.code),
  )}] as const;\n\nexport type ContinentCode = (typeof continent_codes)[number];\n`,
);

await emit(
  "continents.ts",
  `import type { ContinentCode } from "./continents_codes.js";

export const continents: readonly {
  code: ContinentCode;
  name: string;
}[] = [
${CONTINENTS.map(
  (c) => `  {
    code: ${q(c.code)},
    name: ${q(c.name)},
  },\n`,
).join("")}] as const;

export type Continent = (typeof continents)[number];
`,
);

await emit(
  "countries_alpha2.ts",
  `export const country_alpha2_values = [\n${list(
    countries.map((c) => c.alpha2),
  )}] as const;\n\nexport type CountryAlpha2 = (typeof country_alpha2_values)[number];\n`,
);

await emit(
  "countries_alpha3.ts",
  `export const countries_alpha3_values = [\n${list(
    countries.map((c) => c.alpha3),
  )}] as const;\n\nexport type CountryAlpha3 = (typeof countries_alpha3_values)[number];\n`,
);

await emit(
  "currencies_codes.ts",
  `export const currency_codes = [\n${list(
    currencies.map((c) => c.code),
  )}] as const;\n\nexport type CurrencyCode = (typeof currency_codes)[number];\n`,
);

await emit(
  "languages_alpha2.ts",
  `export const language_alpha2_values = [\n${list(
    languages.filter((l) => l.alpha2).map((l) => l.alpha2),
  )}] as const;\n\nexport type LanguageAlpha2 = (typeof language_alpha2_values)[number];\n`,
);

await emit(
  "languages_alpha3.ts",
  `export const language_alpha3_values = [\n${list(
    languages.map((l) => l.alpha3),
  )}] as const;\n\nexport type LanguageAlpha3 = (typeof language_alpha3_values)[number];\n`,
);

await emit(
  "timezones_identifiers.ts",
  `export const timezones_identifiers = [\n${list(
    timezoneIdentifiers,
  )}] as const;\n\nexport type TimezoneIdentifier = (typeof timezones_identifiers)[number];\n`,
);

await emit(
  "countries.ts",
  `import type { ContinentCode } from "./continents_codes.js";
import type { CountryAlpha2 } from "./countries_alpha2.js";
import type { CountryAlpha3 } from "./countries_alpha3.js";
import type { CurrencyCode } from "./currencies_codes.js";
import type { LanguageAlpha3 } from "./languages_alpha3.js";
import type { TimezoneIdentifier } from "./timezones_identifiers.js";

export const countries: readonly {
  alpha2: CountryAlpha2;
  alpha3: CountryAlpha3;
  continents: ContinentCode[];
  countryCallingCodes: string[];
  currencies: CurrencyCode[];
  emoji: string;
  ioc: string;
  languages: LanguageAlpha3[];
  name: string;
  status: "assigned" | "reserved" | "user assigned";
  timezones: TimezoneIdentifier[];
}[] = [
${countries
  .map(
    (c) => `  {
    alpha2: ${q(c.alpha2)},
    alpha3: ${q(c.alpha3)},
    continents: [${c.continents.map(q).join(", ")}],
    countryCallingCodes: [${c.countryCallingCodes.map(q).join(", ")}],
    currencies: [${c.currencies.map(q).join(", ")}],
    emoji: ${q(c.emoji)},
    ioc: ${q(c.ioc)},
    languages: [${c.languages.map(q).join(", ")}],
    name: ${q(c.name)},
    status: ${q(c.status)},
    timezones: [${c.timezones.map(q).join(", ")}],
  },\n`,
  )
  .join("")}] as const;

export type Country = (typeof countries)[number];
`,
);

await emit(
  "countries_map.ts",
  `import { countries, type Country } from "./countries.js";
import type { CountryAlpha2 } from "./countries_alpha2.js";
import type { CountryAlpha3 } from "./countries_alpha3.js";

export const countries_alpha2_map: Record<CountryAlpha2, Country> =
  /* @__PURE__ */ Object.fromEntries(
    countries.map((country) => [country.alpha2, country])
  ) as Record<CountryAlpha2, Country>;

export const countries_alpha3_map: Record<CountryAlpha3, Country> =
  /* @__PURE__ */ Object.fromEntries(
    countries.map((country) => [country.alpha3, country])
  ) as Record<CountryAlpha3, Country>;

/** @deprecated Use {@link countries_alpha2_map} instead. */
export const countries_map: Record<CountryAlpha2, Country> =
  countries_alpha2_map;
`,
);

await emit(
  "currencies_map.ts",
  `import { currencies, type Currency } from "./currencies.js";
import type { CurrencyCode } from "./currencies_codes.js";

export const currencies_map: Record<CurrencyCode, Currency> =
  /* @__PURE__ */ Object.fromEntries(
    currencies.map((currency) => [currency.code, currency])
  ) as Record<CurrencyCode, Currency>;
`,
);

await emit(
  "languages_map.ts",
  `import { languages, type Language } from "./languages.js";
import type { LanguageAlpha2 } from "./languages_alpha2.js";
import type { LanguageAlpha3 } from "./languages_alpha3.js";

export const languages_alpha2_map: Record<LanguageAlpha2, Language> =
  /* @__PURE__ */ Object.fromEntries(
    languages
      .filter((language) => language.alpha2 !== null)
      .map((language) => [language.alpha2, language])
  ) as Record<LanguageAlpha2, Language>;

export const languages_alpha3_map: Record<LanguageAlpha3, Language> =
  /* @__PURE__ */ Object.fromEntries(
    languages.map((language) => [language.alpha3, language])
  ) as Record<LanguageAlpha3, Language>;
`,
);

await emit(
  "timezones_map.ts",
  `import { timezones, type Timezone } from "./timezones.js";
import type { TimezoneIdentifier } from "./timezones_identifiers.js";

export const timezones_map: Record<TimezoneIdentifier, Timezone> =
  /* @__PURE__ */ Object.fromEntries(
    timezones.map((timezone) => [timezone.identifier, timezone])
  ) as Record<TimezoneIdentifier, Timezone>;
`,
);

await emit(
  "currencies.ts",
  `import { type CurrencyCode } from "./currencies_codes.js";

export const currencies: readonly {
  code: CurrencyCode;
  decimals: number | null;
  name: string;
  number: string;
}[] = [
${currencies
  .map(
    (c) => `  {
    code: ${q(c.code)},
    decimals: ${c.decimals},
    name: ${q(c.name)},
    number: ${q(c.number)},
  },\n`,
  )
  .join("")}] as const;

export type Currency = (typeof currencies)[number];
`,
);

await emit(
  "languages.ts",
  `import type { LanguageAlpha2 } from "./languages_alpha2.js";
import { type LanguageAlpha3 } from "./languages_alpha3.js";

export const languages: readonly {
  alpha2: LanguageAlpha2 | null;
  alpha3: LanguageAlpha3;
  bibliographic: string;
  name: string;
}[] = [
${languages
  .map(
    (l) => `  {
    alpha2: ${l.alpha2 ? q(l.alpha2) : "null"},
    alpha3: ${q(l.alpha3)},
    bibliographic: ${q(l.bibliographic)},
    name: ${q(l.name)},
  },\n`,
  )
  .join("")}] as const;

export type Language = (typeof languages)[number];
`,
);

const withAlpha2 = languages.filter((l) => l.alpha2);
await emit(
  "languages_alpha2_to_alpha3.ts",
  `import type { LanguageAlpha2 } from "./languages_alpha2.js";
import type { LanguageAlpha3 } from "./languages_alpha3.js";

export const language_alpha2_to_alpha3: Record<LanguageAlpha2, LanguageAlpha3> = {
${withAlpha2.map((l) => `  ${l.alpha2}: ${q(l.alpha3)},\n`).join("")}};
`,
);

await emit(
  "languages_alpha3_to_alpha2.ts",
  `import type { LanguageAlpha2 } from "./languages_alpha2.js";
import type { LanguageAlpha3 } from "./languages_alpha3.js";

export const language_alpha3_to_alpha2: Partial<
  Record<LanguageAlpha3, LanguageAlpha2>
> = {
${withAlpha2.map((l) => `  ${l.alpha3}: ${q(l.alpha2)},\n`).join("")}};
`,
);

const zoneContinents = (tz) =>
  [
    ...new Set(
      countriesByZone.get(tz).flatMap((cc) => continentsByAlpha2.get(cc)),
    ),
  ].sort();

await emit(
  "timezones.ts",
  `import type { ContinentCode } from "./continents_codes.js";
import type { CountryAlpha2 } from "./countries_alpha2.js";
import type { TimezoneIdentifier } from "./timezones_identifiers.js";

export const timezones: readonly {
  identifier: TimezoneIdentifier;
  continents: ContinentCode[];
  countries: CountryAlpha2[];
}[] = [
${timezoneIdentifiers
  .map(
    (tz) => `  {
    identifier: ${q(tz)},
    continents: [${zoneContinents(tz).map(q).join(", ")}],
    countries: [${countriesByZone.get(tz).map(q).join(", ")}],
  },\n`,
  )
  .join("")}] as const;

export type Timezone = (typeof timezones)[number];
`,
);

process.stderr.write(
  `done: ${countries.length} countries, ${currencies.length} currencies, ` +
    `${languages.length} languages, ${timezoneIdentifiers.length} timezones\n`,
);
