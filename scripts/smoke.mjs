/**
 * Cross-runtime smoke test (Node, Bun, Deno). Imports the package the way a
 * consumer would (bare specifier + subpath, resolved through the exports map)
 * and checks a few known values. Requires `npm run build` and a
 * node_modules/@oglofus/localization link to the repo root.
 */

import assert from "node:assert/strict";

import {
  continents,
  countries,
  countries_alpha2_map,
  currencies,
  languages,
  timezones,
  timezones_map,
} from "@oglofus/localization";
import { currencies_map } from "@oglofus/localization/currencies_map";

assert.equal(countries.length, 250);
assert.ok(currencies.length >= 170);
assert.ok(languages.length >= 180);
assert.ok(timezones.length >= 400);
assert.equal(continents.length, 7);

assert.equal(countries_alpha2_map.GR.name, "Greece");
assert.equal(countries_alpha2_map.GR.emoji, "🇬🇷");
assert.equal(currencies_map.EUR.number, "978");
assert.deepEqual(timezones_map["Europe/Athens"].countries, ["GR"]);

const runtime =
  typeof Bun !== "undefined"
    ? `bun ${Bun.version}`
    : typeof Deno !== "undefined"
      ? `deno ${Deno.version.deno}`
      : `node ${process.version}`;
console.log(`smoke test passed on ${runtime}`);
