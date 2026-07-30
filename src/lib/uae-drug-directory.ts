/**
 * UAE Registered Medicines Directory
 *
 * Source: Emirates Drug Establishment (EDE) — Registered Medical Product Directory
 *         https://services.ede.gov.ae/drugdirectory/  (official UAE open data)
 *
 * The dataset (~17,000 active registered products) is shipped as a static JSON
 * file in /public/data/uae-drugs.json and fetched lazily the first time a
 * lookup is performed, so it never blocks initial page load.
 */

export type DispensingMode = "OTC" | "P" | "Rx" | "SCD" | "CD" | "HCP" | "HOSP" | "NA";

export interface UaeProduct {
  name: string;
  strength: string;
  form: string;
  pack: string;
  priceAed: number | null;
  manufacturer: string;
  mode: DispensingMode;
  ingredients: string;
}

export const MODE_LABEL: Record<DispensingMode, string> = {
  OTC: "OTC",
  P: "Pharmacy only",
  Rx: "Rx — prescription",
  SCD: "Semi-controlled",
  CD: "Controlled",
  HCP: "Healthcare professional",
  HOSP: "Hospital only",
  NA: "Unclassified",
};

export const MODE_STYLE: Record<DispensingMode, string> = {
  OTC: "bg-green-100 text-green-700 border-green-200",
  P: "bg-teal-100 text-teal-700 border-teal-200",
  Rx: "bg-blue-100 text-blue-700 border-blue-200",
  SCD: "bg-purple-100 text-purple-700 border-purple-200",
  CD: "bg-red-100 text-red-700 border-red-200",
  HCP: "bg-slate-100 text-slate-600 border-slate-200",
  HOSP: "bg-slate-100 text-slate-600 border-slate-200",
  NA: "bg-slate-100 text-slate-500 border-slate-200",
};

type RawRow = [
  string, // name
  string, // strength
  string, // form
  string, // pack
  number | null, // price
  string, // manufacturer
  string, // mode
  string, // ingredients
];

interface RawFile {
  source: string;
  url: string;
  count: number;
  items: RawRow[];
}

export const DIRECTORY_SOURCE = {
  label: "Emirates Drug Establishment — Registered Medical Product Directory",
  url: "https://services.ede.gov.ae/drugdirectory/",
};

let products: UaeProduct[] | null = null;
let haystack: string[] = [];
let loading: Promise<UaeProduct[]> | null = null;

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
}

export function isDirectoryLoaded(): boolean {
  return products !== null;
}

export async function loadUaeDirectory(): Promise<UaeProduct[]> {
  if (products) return products;
  if (loading) return loading;

  loading = fetch("/data/uae-drugs.json")
    .then((r) => {
      if (!r.ok) throw new Error(`Failed to load UAE drug directory (${r.status})`);
      return r.json() as Promise<RawFile>;
    })
    .then((raw) => {
      products = raw.items.map((row) => ({
        name: row[0],
        strength: row[1],
        form: row[2],
        pack: row[3],
        priceAed: row[4] && row[4] > 0 ? row[4] : null,
        manufacturer: row[5],
        mode: (row[6] as DispensingMode) ?? "NA",
        ingredients: row[7] ?? "",
      }));
      haystack = products.map((p) => normalize(`${p.name} ${p.ingredients}`));
      return products;
    })
    .catch((err) => {
      loading = null;
      throw err;
    });

  return loading;
}

const COMMON_FORMS = /tablet|capsule|syrup|suspension|oral|cream|ointment|drops|inhal|sachet|gel|spray/i;

/** Everyday dispensable forms first, then cheapest priced, unpriced last. */
function sortProducts(list: UaeProduct[]): UaeProduct[] {
  return list.sort((a, b) => {
    const fa = COMMON_FORMS.test(a.form) ? 0 : 1;
    const fb = COMMON_FORMS.test(b.form) ? 0 : 1;
    if (fa !== fb) return fa - fb;
    if (a.priceAed === null) return b.priceAed === null ? 0 : 1;
    if (b.priceAed === null) return -1;
    return a.priceAed - b.priceAed;
  });
}

/** Free-text search across brand name and active ingredients. */
export function searchProducts(query: string, limit = 60): UaeProduct[] {
  if (!products) return [];
  const q = normalize(query);
  if (q.length < 2) return [];
  const terms = q.split(" ");
  const hits: UaeProduct[] = [];
  for (let i = 0; i < haystack.length; i++) {
    const h = haystack[i];
    let ok = true;
    for (const t of terms) {
      if (!h.includes(t)) {
        ok = false;
        break;
      }
    }
    if (ok) hits.push(products[i]);
  }
  return sortProducts(hits).slice(0, limit);
}

/**
 * Find UAE-registered brands for a generic / INN name.
 * Matches products whose active ingredient list or brand name contains the generic.
 */
export function findBrandsForGeneric(generic: string, limit = 12): UaeProduct[] {
  if (!products) return [];
  // Strip descriptive suffixes e.g. "Ibuprofen (oral)" or "Paracetamol 500 mg"
  const base = normalize(generic.replace(/\(.*?\)/g, "").split("/")[0]);
  if (base.length < 3) return [];

  const byIngredient: UaeProduct[] = [];
  const byName: UaeProduct[] = [];
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    if (normalize(p.ingredients).includes(base)) byIngredient.push(p);
    else if (normalize(p.name).includes(base)) byName.push(p);
  }
  const pool = byIngredient.length > 0 ? byIngredient : byName;

  // Deduplicate by brand name + pack, keeping the cheapest option
  const seen = new Map<string, UaeProduct>();
  for (const p of pool) {
    const key = `${p.name}|${p.strength}|${p.pack}`;
    const prev = seen.get(key);
    if (!prev || (p.priceAed ?? Infinity) < (prev.priceAed ?? Infinity)) seen.set(key, p);
  }
  return sortProducts([...seen.values()]).slice(0, limit);
}
