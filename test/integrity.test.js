import assert from "node:assert/strict";
import { test } from "node:test";
import {
  continent_codes,
  continents,
  countries,
  countries_alpha2_map,
  countries_alpha3_map,
  countries_alpha3_values,
  countries_map,
  country_alpha2_values,
  currencies,
  currencies_map,
  currency_codes,
  language_alpha2_to_alpha3,
  language_alpha2_values,
  language_alpha3_to_alpha2,
  language_alpha3_values,
  languages,
  languages_alpha2_map,
  languages_alpha3_map,
  timezones,
  timezones_identifiers,
  timezones_map,
} from "../dist/index.js";

const unique = (values) => new Set(values).size === values.length;
const flagEmoji = (alpha2) =>
  String.fromCodePoint(
    ...[...alpha2].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65),
  );

test("countries cover ISO 3166-1 (249 assigned) plus Kosovo", () => {
  assert.equal(countries.length, 250);
  assert.equal(countries.filter((c) => c.status === "assigned").length, 249);
});

test("country codes are unique and consistent with code lists", () => {
  assert.ok(unique(countries.map((c) => c.alpha2)));
  assert.ok(unique(countries.map((c) => c.alpha3)));
  assert.deepEqual(
    [...countries.map((c) => c.alpha2)].sort(),
    [...country_alpha2_values].sort(),
  );
  assert.deepEqual(
    [...countries.map((c) => c.alpha3)].sort(),
    [...countries_alpha3_values].sort(),
  );
});

test("country fields are well-formed", () => {
  for (const c of countries) {
    assert.match(c.alpha2, /^[A-Z]{2}$/, c.alpha2);
    assert.match(c.alpha3, /^[A-Z]{3}$/, c.alpha2);
    assert.ok(c.name.length > 0, c.alpha2);
    assert.equal(c.emoji, flagEmoji(c.alpha2), c.alpha2);
    for (const code of c.countryCallingCodes) {
      assert.match(code, /^\+\d+(?: \d+)*$/, `${c.alpha2}: ${code}`);
    }
  }
});

test("country references resolve to known currencies, languages, timezones", () => {
  const currencySet = new Set(currency_codes);
  const languageSet = new Set(language_alpha3_values);
  const tzSet = new Set(timezones_identifiers);
  for (const c of countries) {
    for (const code of c.currencies)
      assert.ok(currencySet.has(code), `${c.alpha2}: currency ${code}`);
    for (const code of c.languages)
      assert.ok(languageSet.has(code), `${c.alpha2}: language ${code}`);
    for (const tz of c.timezones)
      assert.ok(tzSet.has(tz), `${c.alpha2}: timezone ${tz}`);
  }
});

test("country maps mirror the countries dataset", () => {
  assert.equal(Object.keys(countries_alpha2_map).length, countries.length);
  for (const c of countries) {
    assert.equal(countries_alpha2_map[c.alpha2], c);
  }
  // deprecated alias stays identical to the alpha-2 map
  assert.equal(countries_map, countries_alpha2_map);
});

test("lookup maps reference the same objects as their datasets", () => {
  assert.equal(Object.keys(countries_alpha3_map).length, countries.length);
  for (const c of countries) assert.equal(countries_alpha3_map[c.alpha3], c);

  assert.equal(Object.keys(currencies_map).length, currencies.length);
  for (const c of currencies) assert.equal(currencies_map[c.code], c);

  const withAlpha2 = languages.filter((l) => l.alpha2 !== null);
  assert.equal(Object.keys(languages_alpha2_map).length, withAlpha2.length);
  for (const l of withAlpha2) assert.equal(languages_alpha2_map[l.alpha2], l);
  assert.equal(Object.keys(languages_alpha3_map).length, languages.length);
  for (const l of languages) assert.equal(languages_alpha3_map[l.alpha3], l);

  assert.equal(Object.keys(timezones_map).length, timezones.length);
  for (const t of timezones) assert.equal(timezones_map[t.identifier], t);
});

test("currencies are unique with valid ISO 4217 shapes", () => {
  assert.ok(currencies.length >= 170);
  assert.ok(unique(currencies.map((c) => c.code)));
  assert.ok(unique(currencies.map((c) => c.number)));
  assert.deepEqual(
    [...currencies.map((c) => c.code)].sort(),
    [...currency_codes].sort(),
  );
  for (const c of currencies) {
    assert.match(c.code, /^[A-Z]{3}$/);
    assert.match(c.number, /^\d{3}$/, c.code);
    assert.ok(
      c.decimals === null || (Number.isInteger(c.decimals) && c.decimals >= 0),
      c.code,
    );
    assert.ok(c.name.length > 0, c.code);
  }
});

test("currency spot checks", () => {
  const byCode = Object.fromEntries(currencies.map((c) => [c.code, c]));
  assert.equal(byCode.USD.number, "840");
  assert.equal(byCode.EUR.number, "978");
  assert.equal(byCode.JPY.decimals, 0);
  assert.equal(byCode.BHD.decimals, 3);
  assert.equal(byCode.XAU.decimals, null);
  // Bulgaria adopted the euro on 2026-01-01; BGN is no longer active.
  assert.equal(byCode.BGN, undefined);
  assert.deepEqual(countries.find((c) => c.alpha2 === "BG").currencies, [
    "EUR",
  ]);
});

test("languages cover ISO 639-1 and code lists agree", () => {
  assert.ok(languages.filter((l) => l.alpha2).length >= 180);
  assert.ok(unique(languages.map((l) => l.alpha3)));
  assert.ok(unique(languages.filter((l) => l.alpha2).map((l) => l.alpha2)));
  assert.deepEqual(
    [...languages.map((l) => l.alpha3)].sort(),
    [...language_alpha3_values].sort(),
  );
  assert.deepEqual(
    languages
      .filter((l) => l.alpha2)
      .map((l) => l.alpha2)
      .sort(),
    [...language_alpha2_values].sort(),
  );
});

test("language alpha2/alpha3 maps are exact inverses", () => {
  assert.equal(
    Object.keys(language_alpha2_to_alpha3).length,
    language_alpha2_values.length,
  );
  for (const [a2, a3] of Object.entries(language_alpha2_to_alpha3)) {
    assert.equal(language_alpha3_to_alpha2[a3], a2);
  }
  for (const [a3, a2] of Object.entries(language_alpha3_to_alpha2)) {
    assert.equal(language_alpha2_to_alpha3[a2], a3);
  }
});

test("timezone identifiers are unique and accepted by Intl", () => {
  assert.ok(timezones.length >= 400);
  assert.ok(unique(timezones.map((t) => t.identifier)));
  assert.deepEqual(
    [...timezones.map((t) => t.identifier)].sort(),
    [...timezones_identifiers].sort(),
  );
  for (const tz of timezones_identifiers) {
    assert.doesNotThrow(
      () => new Intl.DateTimeFormat("en", { timeZone: tz }),
      tz,
    );
  }
});

test("timezones and countries cross-reference each other", () => {
  const countrySet = new Set(country_alpha2_values);
  const zonesByCountry = new Map();
  for (const tz of timezones) {
    for (const cc of tz.countries) {
      assert.ok(countrySet.has(cc), `${tz.identifier}: ${cc}`);
      if (!zonesByCountry.has(cc)) zonesByCountry.set(cc, new Set());
      zonesByCountry.get(cc).add(tz.identifier);
    }
  }
  for (const c of countries) {
    assert.deepEqual(
      [...c.timezones].sort(),
      [...(zonesByCountry.get(c.alpha2) ?? new Set())].sort(),
      c.alpha2,
    );
  }
});

test("continents dataset and country membership", () => {
  assert.equal(continents.length, 7);
  assert.deepEqual(
    continents.map((c) => c.code),
    [...continent_codes],
  );
  const codeSet = new Set(continent_codes);
  for (const c of countries) {
    assert.ok(c.continents.length >= 1, c.alpha2);
    for (const code of c.continents)
      assert.ok(codeSet.has(code), `${c.alpha2}: ${code}`);
  }
  const byAlpha2 = Object.fromEntries(countries.map((c) => [c.alpha2, c]));
  assert.deepEqual(byAlpha2.RU.continents, ["AS", "EU"]);
  assert.deepEqual(byAlpha2.TR.continents, ["AS", "EU"]);
  assert.deepEqual(byAlpha2.EG.continents, ["AF", "AS"]);
  assert.deepEqual(byAlpha2.AQ.continents, ["AN"]);
  assert.deepEqual(byAlpha2.GR.continents, ["EU"]);
  assert.deepEqual(byAlpha2.US.continents, ["NA"]);
});

test("timezone continents are the union of member country continents", () => {
  const byAlpha2 = Object.fromEntries(countries.map((c) => [c.alpha2, c]));
  for (const tz of timezones) {
    const expected = [
      ...new Set(tz.countries.flatMap((cc) => byAlpha2[cc].continents)),
    ].sort();
    assert.deepEqual([...tz.continents].sort(), expected, tz.identifier);
  }
  const ny = timezones.find((t) => t.identifier === "America/New_York");
  assert.deepEqual(ny.continents, ["NA"]);
  const utc = timezones.find((t) => t.identifier === "UTC");
  assert.deepEqual(utc.continents, []);
});

test("dataset spot checks", () => {
  const gr = countries.find((c) => c.alpha2 === "GR");
  assert.equal(gr.alpha3, "GRC");
  assert.equal(gr.ioc, "GRE");
  assert.deepEqual(gr.timezones, ["Europe/Athens"]);
  const ua = countries.find((c) => c.alpha2 === "UA");
  assert.ok(ua.timezones.includes("Europe/Kyiv"));
  assert.ok(!timezones_identifiers.includes("Europe/Kiev"));
  const xk = countries.find((c) => c.alpha2 === "XK");
  assert.equal(xk.status, "user assigned");
  assert.deepEqual(xk.currencies, ["EUR"]);
});
