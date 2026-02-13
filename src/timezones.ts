import type { CountryAlpha2 } from "./countries_alpha2.js";
import type { TimezoneIdentifier } from "./timezones_identifiers.js";

export const timezones: readonly {
  identifier: TimezoneIdentifier;
  countries: CountryAlpha2[];
}[] = [
  {
    identifier: "America/Mexico_City",
    countries: ["MX"],
  },
  {
    identifier: "America/New_York",
    countries: ["US"],
  },
  {
    identifier: "America/Sao_Paulo",
    countries: ["BR"],
  },
  {
    identifier: "America/Toronto",
    countries: ["CA"],
  },
  {
    identifier: "Asia/Bangkok",
    countries: ["TH"],
  },
  {
    identifier: "Asia/Dubai",
    countries: ["AE"],
  },
  {
    identifier: "Asia/Hong_Kong",
    countries: ["HK"],
  },
  {
    identifier: "Asia/Jakarta",
    countries: ["ID"],
  },
  {
    identifier: "Asia/Jerusalem",
    countries: ["IL"],
  },
  {
    identifier: "Asia/Kolkata",
    countries: ["IN"],
  },
  {
    identifier: "Asia/Kuala_Lumpur",
    countries: ["MY"],
  },
  {
    identifier: "Asia/Riyadh",
    countries: ["SA"],
  },
  {
    identifier: "Asia/Seoul",
    countries: ["KR"],
  },
  {
    identifier: "Asia/Shanghai",
    countries: ["CN"],
  },
  {
    identifier: "Asia/Singapore",
    countries: ["SG"],
  },
  {
    identifier: "Asia/Taipei",
    countries: ["TW"],
  },
  {
    identifier: "Asia/Tokyo",
    countries: ["JP"],
  },
  {
    identifier: "Atlantic/Reykjavik",
    countries: ["IS"],
  },
  {
    identifier: "Australia/Sydney",
    countries: ["AU"],
  },
  {
    identifier: "Europe/Amsterdam",
    countries: ["NL"],
  },
  {
    identifier: "Europe/Andorra",
    countries: ["AD"],
  },
  {
    identifier: "Europe/Athens",
    countries: ["GR"],
  },
  {
    identifier: "Europe/Berlin",
    countries: ["DE"],
  },
  {
    identifier: "Europe/Bratislava",
    countries: ["SK"],
  },
  {
    identifier: "Europe/Brussels",
    countries: ["BE"],
  },
  {
    identifier: "Europe/Bucharest",
    countries: ["RO"],
  },
  {
    identifier: "Europe/Budapest",
    countries: ["HU"],
  },
  {
    identifier: "Europe/Copenhagen",
    countries: ["DK"],
  },
  {
    identifier: "Europe/Dublin",
    countries: ["IE"],
  },
  {
    identifier: "Europe/Helsinki",
    countries: ["FI"],
  },
  {
    identifier: "Europe/Kiev",
    countries: ["UA"],
  },
  {
    identifier: "Europe/Lisbon",
    countries: ["PT"],
  },
  {
    identifier: "Europe/Ljubljana",
    countries: ["SI"],
  },
  {
    identifier: "Europe/London",
    countries: ["GB"],
  },
  {
    identifier: "Europe/Luxembourg",
    countries: ["LU"],
  },
  {
    identifier: "Europe/Madrid",
    countries: ["ES"],
  },
  {
    identifier: "Europe/Malta",
    countries: ["MT"],
  },
  {
    identifier: "Europe/Monaco",
    countries: ["MC"],
  },
  {
    identifier: "Europe/Moscow",
    countries: ["RU"],
  },
  {
    identifier: "Europe/Nicosia",
    countries: ["CY"],
  },
  {
    identifier: "Europe/Oslo",
    countries: ["NO"],
  },
  {
    identifier: "Europe/Paris",
    countries: ["FR"],
  },
  {
    identifier: "Europe/Prague",
    countries: ["CZ"],
  },
  {
    identifier: "Europe/Riga",
    countries: ["LV"],
  },
  {
    identifier: "Europe/Rome",
    countries: ["IT"],
  },
  {
    identifier: "Europe/Sofia",
    countries: ["BG"],
  },
  {
    identifier: "Europe/Stockholm",
    countries: ["SE"],
  },
  {
    identifier: "Europe/Tallinn",
    countries: ["EE"],
  },
  {
    identifier: "Europe/Vaduz",
    countries: ["LI"],
  },
  {
    identifier: "Europe/Vienna",
    countries: ["AT"],
  },
  {
    identifier: "Europe/Vilnius",
    countries: ["LT"],
  },
  {
    identifier: "Europe/Warsaw",
    countries: ["PL"],
  },
  {
    identifier: "Europe/Zagreb",
    countries: ["HR"],
  },
  {
    identifier: "Europe/Zurich",
    countries: ["CH"],
  },
  {
    identifier: "Pacific/Auckland",
    countries: ["NZ"],
  },
  {
    identifier: "UTC",
    countries: [], // Default fallback timezone, not directly associated with any country in your list
  },
] as const;

export type Timezone = (typeof timezones)[number];
