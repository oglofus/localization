import type { LanguageAlpha2 } from "./languages_alpha2.js";
import { type LanguageAlpha3 } from "./languages_alpha3.js";

export const languages: readonly {
  alpha2: LanguageAlpha2;
  alpha3: LanguageAlpha3;
  bibliographic: string;
  name: string;
}[] = [
  {
    alpha2: "ar",
    alpha3: "ara",
    bibliographic: "",
    name: "Arabic",
  },
  {
    alpha2: "eu",
    alpha3: "eus",
    bibliographic: "baq",
    name: "Basque",
  },
  {
    alpha2: "bg",
    alpha3: "bul",
    bibliographic: "",
    name: "Bulgarian",
  },
  {
    alpha2: "ca",
    alpha3: "cat",
    bibliographic: "",
    name: "Catalan",
  },
  {
    alpha2: "zh",
    alpha3: "zho",
    bibliographic: "chi",
    name: "Chinese",
  },
  {
    alpha2: "kw",
    alpha3: "cor",
    bibliographic: "",
    name: "Cornish",
  },
  {
    alpha2: "hr",
    alpha3: "hrv",
    bibliographic: "",
    name: "Croatian",
  },
  {
    alpha2: "cs",
    alpha3: "ces",
    bibliographic: "cze",
    name: "Czech",
  },
  {
    alpha2: "da",
    alpha3: "dan",
    bibliographic: "",
    name: "Danish",
  },
  {
    alpha2: "nl",
    alpha3: "nld",
    bibliographic: "dut",
    name: "Dutch",
  },
  {
    alpha2: "en",
    alpha3: "eng",
    bibliographic: "",
    name: "English",
  },
  {
    alpha2: "et",
    alpha3: "est",
    bibliographic: "",
    name: "Estonian",
  },
  {
    alpha2: "fi",
    alpha3: "fin",
    bibliographic: "",
    name: "Finnish",
  },
  {
    alpha2: "fr",
    alpha3: "fra",
    bibliographic: "fre",
    name: "French",
  },
  {
    alpha2: "gd",
    alpha3: "gla",
    bibliographic: "",
    name: "Gaelic",
  },
  {
    alpha2: "gl",
    alpha3: "glg",
    bibliographic: "",
    name: "Galician",
  },
  {
    alpha2: "de",
    alpha3: "deu",
    bibliographic: "ger",
    name: "German",
  },
  {
    alpha2: "el",
    alpha3: "ell",
    bibliographic: "gre",
    name: "Greek",
  },
  {
    alpha2: "he",
    alpha3: "heb",
    bibliographic: "",
    name: "Hebrew",
  },
  {
    alpha2: "hi",
    alpha3: "hin",
    bibliographic: "",
    name: "Hindi",
  },
  {
    alpha2: "hu",
    alpha3: "hun",
    bibliographic: "",
    name: "Hungarian",
  },
  {
    alpha2: "is",
    alpha3: "isl",
    bibliographic: "ice",
    name: "Icelandic",
  },
  {
    alpha2: "id",
    alpha3: "ind",
    bibliographic: "",
    name: "Indonesian",
  },
  {
    alpha2: "ga",
    alpha3: "gle",
    bibliographic: "",
    name: "Irish",
  },
  {
    alpha2: "it",
    alpha3: "ita",
    bibliographic: "",
    name: "Italian",
  },
  {
    alpha2: "ja",
    alpha3: "jpn",
    bibliographic: "",
    name: "Japanese",
  },
  {
    alpha2: "ko",
    alpha3: "kor",
    bibliographic: "",
    name: "Korean",
  },
  {
    alpha2: "lv",
    alpha3: "lav",
    bibliographic: "",
    name: "Latvian",
  },
  {
    alpha2: "lt",
    alpha3: "lit",
    bibliographic: "",
    name: "Lithuanian",
  },
  {
    alpha2: "lb",
    alpha3: "ltz",
    bibliographic: "",
    name: "Luxembourgish",
  },
  {
    alpha2: "ms",
    alpha3: "msa",
    bibliographic: "may",
    name: "Malay",
  },
  {
    alpha2: "mt",
    alpha3: "mlt",
    bibliographic: "",
    name: "Maltese",
  },
  {
    alpha2: "mi",
    alpha3: "mri",
    bibliographic: "mao",
    name: "Maori",
  },
  {
    alpha2: "no",
    alpha3: "nor",
    bibliographic: "",
    name: "Norwegian",
  },
  {
    alpha2: "pl",
    alpha3: "pol",
    bibliographic: "",
    name: "Polish",
  },
  {
    alpha2: "pt",
    alpha3: "por",
    bibliographic: "",
    name: "Portuguese",
  },
  {
    alpha2: "ro",
    alpha3: "ron",
    bibliographic: "rum",
    name: "Romanian",
  },
  {
    alpha2: "rm",
    alpha3: "roh",
    bibliographic: "",
    name: "Romansh",
  },
  {
    alpha2: "ru",
    alpha3: "rus",
    bibliographic: "",
    name: "Russian",
  },
  {
    alpha2: "sk",
    alpha3: "slk",
    bibliographic: "slo",
    name: "Slovak",
  },
  {
    alpha2: "sl",
    alpha3: "slv",
    bibliographic: "",
    name: "Slovenian",
  },
  {
    alpha2: "es",
    alpha3: "spa",
    bibliographic: "",
    name: "Spanish",
  },
  {
    alpha2: "sv",
    alpha3: "swe",
    bibliographic: "",
    name: "Swedish",
  },
  {
    alpha2: "ta",
    alpha3: "tam",
    bibliographic: "",
    name: "Tamil",
  },
  {
    alpha2: "th",
    alpha3: "tha",
    bibliographic: "",
    name: "Thai",
  },
  {
    alpha2: "tr",
    alpha3: "tur",
    bibliographic: "",
    name: "Turkish",
  },
  {
    alpha2: "uk",
    alpha3: "ukr",
    bibliographic: "",
    name: "Ukrainian",
  },
  {
    alpha2: "cy",
    alpha3: "cym",
    bibliographic: "wel",
    name: "Welsh",
  },
] as const;

export type Language = (typeof languages)[number];
