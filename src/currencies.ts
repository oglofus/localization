import { type CurrencyCode } from "./currencies_codes.js";

export const currencies: readonly {
  code: CurrencyCode;
  decimals: number | null;
  name: string;
  number: string;
}[] = [
  {
    code: "AZN",
    decimals: 2,
    name: "Azerbaijani manat",
    number: "944",
  },
  {
    code: "AUD",
    decimals: 2,
    name: "Australian dollar",
    number: "36",
  },
  {
    code: "BRL",
    decimals: 2,
    name: "Brazilian real",
    number: "986",
  },
  {
    code: "BGN",
    decimals: 2,
    name: "Bulgarian lev",
    number: "975",
  },
  {
    code: "CAD",
    decimals: 2,
    name: "Canadian dollar",
    number: "124",
  },
  {
    code: "CNY",
    decimals: 2,
    name: "Chinese yuan",
    number: "156",
  },
  {
    code: "CZK",
    decimals: 2,
    name: "Czech koruna",
    number: "203",
  },
  {
    code: "DKK",
    decimals: 2,
    name: "Danish krone",
    number: "208",
  },
  {
    code: "EUR",
    decimals: 2,
    name: "Euro",
    number: "978",
  },
  {
    code: "HKD",
    decimals: 2,
    name: "Hong Kong dollar",
    number: "344",
  },
  {
    code: "HUF",
    decimals: 2,
    name: "Hungarian forint",
    number: "348",
  },
  {
    code: "ISK",
    decimals: 0,
    name: "Icelandic króna",
    number: "352",
  },
  {
    code: "INR",
    decimals: 2,
    name: "Indian rupee",
    number: "356",
  },
  {
    code: "IDR",
    decimals: 2,
    name: "Indonesian rupiah",
    number: "360",
  },
  {
    code: "ILS",
    decimals: 2,
    name: "Israeli new shekel",
    number: "376",
  },
  {
    code: "JPY",
    decimals: 0,
    name: "Japanese yen",
    number: "392",
  },
  {
    code: "MYR",
    decimals: 2,
    name: "Malaysian ringgit",
    number: "458",
  },
  {
    code: "MXN",
    decimals: 2,
    name: "Mexican peso",
    number: "484",
  },
  {
    code: "MXV",
    decimals: 2,
    name: "Mexican Unidad de Inversion (UDI) (funds code)",
    number: "979",
  },
  {
    code: "TWD",
    decimals: 2,
    name: "New Taiwan dollar",
    number: "901",
  },
  {
    code: "NZD",
    decimals: 2,
    name: "New Zealand dollar",
    number: "554",
  },
  {
    code: "NOK",
    decimals: 2,
    name: "Norwegian krone",
    number: "578",
  },
  {
    code: "PLN",
    decimals: 2,
    name: "Polish złoty",
    number: "985",
  },
  {
    code: "GBP",
    decimals: 2,
    name: "Pound sterling",
    number: "826",
  },
  {
    code: "RON",
    decimals: 2,
    name: "Romanian new leu",
    number: "946",
  },
  {
    code: "RUB",
    decimals: 2,
    name: "Russian rouble",
    number: "643",
  },
  {
    code: "SAR",
    decimals: 2,
    name: "Saudi riyal",
    number: "682",
  },
  {
    code: "SGD",
    decimals: 2,
    name: "Singapore dollar",
    number: "702",
  },
  {
    code: "KRW",
    decimals: 0,
    name: "South Korean won",
    number: "410",
  },
  {
    code: "SEK",
    decimals: 2,
    name: "Swedish krona/kronor",
    number: "752",
  },
  {
    code: "CHF",
    decimals: 2,
    name: "Swiss franc",
    number: "756",
  },
  {
    code: "THB",
    decimals: 2,
    name: "Thai baht",
    number: "764",
  },
  {
    code: "UAH",
    decimals: 2,
    name: "Ukrainian hryvnia",
    number: "980",
  },
  {
    code: "AED",
    decimals: 2,
    name: "United Arab Emirates dirham",
    number: "784",
  },
  {
    code: "USD",
    decimals: 2,
    name: "United States dollar",
    number: "840",
  },
] as const;

export type Currency = (typeof currencies)[number];
