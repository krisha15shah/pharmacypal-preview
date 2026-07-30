import { useEffect, useMemo, useState } from "react";
import { Search, Loader2, ExternalLink, Package } from "lucide-react";
import {
  loadUaeDirectory,
  searchProducts,
  findBrandsForGeneric,
  MODE_LABEL,
  MODE_STYLE,
  DIRECTORY_SOURCE,
  type UaeProduct,
} from "@/lib/uae-drug-directory";

function ProductRow({ p }: { p: UaeProduct }) {
  return (
    <tr className="align-top">
      <td className="py-1.5 pr-2">
        <div className="font-medium text-slate-800">{p.name}</div>
        <div className="text-[11px] text-slate-500">
          {[p.strength, p.form].filter(Boolean).join(" · ")}
        </div>
        {p.manufacturer && (
          <div className="text-[10px] text-slate-400">{p.manufacturer}</div>
        )}
      </td>
      <td className="py-1.5 pr-2 text-slate-500">{p.pack || "—"}</td>
      <td className="py-1.5 pr-2">
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-semibold whitespace-nowrap ${MODE_STYLE[p.mode]}`}>
          {MODE_LABEL[p.mode]}
        </span>
      </td>
      <td className="py-1.5 text-right whitespace-nowrap">
        {p.priceAed === null ? (
          <span className="text-slate-400">—</span>
        ) : (
          <>
            <span className="font-semibold text-slate-800">{p.priceAed.toFixed(2)}</span>
            <span className="text-slate-400 ml-0.5">AED</span>
          </>
        )}
      </td>
    </tr>
  );
}

function ProductTable({ items }: { items: UaeProduct[] }) {
  return (
    <table className="w-full text-xs">
      <thead>
        <tr className="text-slate-400 uppercase tracking-wide">
          <th className="text-left font-medium pb-2">Brand / product</th>
          <th className="text-left font-medium pb-2">Pack</th>
          <th className="text-left font-medium pb-2">Dispensing</th>
          <th className="text-right font-medium pb-2">Public price</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {items.map((p, i) => (
          <ProductRow key={`${p.name}-${p.pack}-${i}`} p={p} />
        ))}
      </tbody>
    </table>
  );
}

interface Props {
  /** Generic / INN names from the current recommendations, used to auto-show brands. */
  generics: string[];
}

export function UaeBrandLookup({ generics }: Props) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let alive = true;
    loadUaeDirectory()
      .then(() => alive && setReady(true))
      .catch((e) => alive && setError(e.message));
    return () => {
      alive = false;
    };
  }, []);

  const searchResults = useMemo(
    () => (ready && query.trim().length >= 2 ? searchProducts(query, 60) : []),
    [ready, query],
  );

  const uniqueGenerics = useMemo(() => {
    const seen = new Set<string>();
    return generics.filter((g) => {
      const k = g.toLowerCase().trim();
      if (!k || seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  }, [generics]);

  const matched = useMemo(() => {
    if (!ready) return [];
    return uniqueGenerics
      .map((g) => ({ generic: g, items: findBrandsForGeneric(g, 10) }))
      .filter((m) => m.items.length > 0);
  }, [ready, uniqueGenerics]);

  return (
    <div className="space-y-3">
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-[11px] text-slate-600 flex items-start gap-2">
        <Package className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400" />
        <span>
          UAE-registered brand names and official public prices (AED) from the{" "}
          <a
            href={DIRECTORY_SOURCE.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline inline-flex items-center gap-0.5"
          >
            {DIRECTORY_SOURCE.label}
            <ExternalLink className="w-3 h-3" />
          </a>
          . Prices are the regulated maximum retail price; pharmacies may sell below it.
        </span>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={ready ? "Search any UAE brand or generic (e.g. Panadol, amoxicillin)…" : "Loading UAE registry…"}
          disabled={!ready}
          className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 disabled:bg-slate-50"
        />
      </div>

      {error && (
        <div className="text-xs text-red-700 bg-red-50 border border-red-200 rounded p-2">
          Could not load the UAE medicines registry: {error}
        </div>
      )}

      {!ready && !error && (
        <div className="flex items-center gap-2 text-xs text-slate-500 py-6 justify-center">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading UAE registered medicines…
        </div>
      )}

      {/* Search results take priority */}
      {ready && query.trim().length >= 2 && (
        <div className="bg-white border border-slate-200 rounded-lg p-3">
          <div className="text-xs font-semibold text-slate-700 mb-2">
            {searchResults.length > 0
              ? `${searchResults.length} match${searchResults.length === 1 ? "" : "es"} for "${query}"`
              : `No UAE-registered product matches "${query}"`}
          </div>
          {searchResults.length > 0 && <ProductTable items={searchResults} />}
        </div>
      )}

      {/* Auto brands for the recommended generics */}
      {ready && query.trim().length < 2 && (
        matched.length === 0 ? (
          <div className="text-center text-slate-400 py-8 text-sm">
            No UAE-registered brands matched the current recommendations — use the search above.
          </div>
        ) : (
          <div className="space-y-3">
            {matched.map(({ generic, items }) => (
              <div key={generic} className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between gap-2">
                  <div className="font-semibold text-sm text-slate-800 capitalize">{generic}</div>
                  <div className="text-[11px] text-slate-400">{items.length} UAE brands</div>
                </div>
                <div className="px-4 py-3">
                  <ProductTable items={items} />
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
