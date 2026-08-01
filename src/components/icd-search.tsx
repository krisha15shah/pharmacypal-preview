import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, Loader2, ExternalLink, Zap } from "lucide-react";
import { icdToSymptomId, icdToConditionId, icdToAllergyId, icdChapterColor } from "@/lib/icd-mapping";
import { SYMPTOMS } from "@/lib/clinical-data";

export interface SelectedIcdItem {
  code: string;
  name: string;
  internalId: string | null;
}

export type IcdMode = "symptom" | "condition" | "allergy";

interface IcdResult {
  code: string;
  name: string;
  isLocal?: boolean;          // true = came from local SYMPTOMS list
  internalIdDirect?: string;  // pre-resolved for local picks
  isRedFlag?: boolean;
  // When set, selecting this result adds multiple ICD items at once (e.g. "fever with chills").
  expandsTo?: { code: string; name: string }[];
}

// ICD-10-CM has no single "chills with fever" code: R68.83 is explicitly
// "Chills (without fever)" and fever-with-chills is indexed to R50.9.
// Offer a synthetic combined option that captures both symptoms in one click.
const CHILLS_FEVER_COMBO: IcdResult = {
  code: "R50.9+R68.83",
  name: "Fever with chills",
  expandsTo: [
    { code: "R50.9", name: "Fever, unspecified (with chills)" },
    { code: "R68.83", name: "Chills (without fever)" },
  ],
};

function mapToInternal(code: string, name: string, mode: IcdMode): string | null {
  // Symptom search often surfaces diagnosis codes (e.g. "diabetes"). Fall back to
  // the condition mapping so those still resolve to therapy guidance instead of
  // being flagged as unmapped.
  if (mode === "symptom") return icdToSymptomId(code, name) ?? icdToConditionId(code);
  if (mode === "condition") return icdToConditionId(code);
  return icdToAllergyId(code);
}

// For allergy mode only: pre-populate with Z88 drug allergy codes on focus
const ALLERGY_DEFAULT_TERM = "Z88";

const PLACEHOLDERS: Record<IcdMode, string> = {
  symptom: "Search symptom (e.g. itching, headache, cough…)",
  condition: "Search ICD-10 diagnosis (e.g. hypertension, asthma…)",
  allergy: "Search drug allergy code (e.g. penicillin, NSAID…)",
};

const MODE_COLORS: Record<IcdMode, { chip: string; badge: string }> = {
  symptom: {
    chip: "bg-blue-50 border-blue-200",
    badge: "bg-blue-600 text-white",
  },
  condition: {
    chip: "bg-purple-50 border-purple-200",
    badge: "bg-purple-600 text-white",
  },
  allergy: {
    chip: "bg-red-50 border-red-200",
    badge: "bg-red-600 text-white",
  },
};

/** Search the local SYMPTOMS list for instant plain-English matches. */
function searchLocalSymptoms(query: string): IcdResult[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return SYMPTOMS
    .filter((s) => {
      const label = s.label.toLowerCase();
      const id = s.id.replace(/_/g, " ");
      return label.includes(q) || id.includes(q);
    })
    .slice(0, 6)
    .map((s) => ({
      code: `SX:${s.id}`,
      name: s.label,
      isLocal: true,
      internalIdDirect: s.id,
      isRedFlag: s.isRedFlag,
    }));
}

interface IcdSearchProps {
  mode: IcdMode;
  selectedItems: SelectedIcdItem[];
  onItemsChange: (items: SelectedIcdItem[]) => void;
  label?: string;
}

export default function IcdSearch({ mode, selectedItems, onItemsChange, label }: IcdSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<IcdResult[]>([]);
  const [localResults, setLocalResults] = useState<IcdResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const searchIcd = useCallback(async (term: string, forceDefault = false) => {
    const searchTerm = term.trim() || (forceDefault && mode === "allergy" ? ALLERGY_DEFAULT_TERM : "");

    // Always update local symptom results immediately (no debounce needed)
    if (mode === "symptom") {
      const local = searchLocalSymptoms(searchTerm);
      setLocalResults(local);
    }

    if (!searchTerm) { setResults([]); setOpen(false); return; }
    setLoading(true);
    try {
      const url = new URL("https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/search");
      url.searchParams.set("terms", searchTerm);
      url.searchParams.set("maxList", "12");
      url.searchParams.set("sf", "code,name");
      url.searchParams.set("df", "code,name");
      const res = await fetch(url.toString());
      const data: [number, string[], null, string[][]] = await res.json();
      const items: IcdResult[] = (data[3] ?? []).map(([code, name]) => ({ code, name }));
      // Surface a synthetic "Fever with chills" option when relevant, since ICD-10 has no combined code.
      const q = searchTerm.toLowerCase();
      if (mode === "symptom" && /chill|rigor|shiver|fever|pyrex|febrile/.test(q)) {
        items.unshift(CHILLS_FEVER_COMBO);
      }
      setResults(items);
      setOpen(true);
    } catch {
      setResults([]);
      setOpen(localResults.length > 0);
    } finally {
      setLoading(false);
    }
  }, [mode, localResults.length]);

  // Update local results immediately on every keystroke (no debounce)
  useEffect(() => {
    if (mode === "symptom") {
      const local = searchLocalSymptoms(query);
      setLocalResults(local);
      if (local.length > 0 && query.trim()) setOpen(true);
    }
  }, [query, mode]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchIcd(query), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, searchIcd]);

  // Close on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current && !inputRef.current.contains(e.target as Node)
      ) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const addItem = (item: IcdResult) => {
    if (item.isLocal) {
      // Local symptom — use synthetic code so it doesn't clash with real ICD codes
      const already = selectedItems.find((i) => i.code === item.code);
      if (!already) {
        onItemsChange([...selectedItems, {
          code: item.code,
          name: item.name,
          internalId: item.internalIdDirect ?? null,
        }]);
      }
      setQuery("");
      setResults([]);
      setLocalResults([]);
      setOpen(false);
      return;
    }

    const toAdd = item.expandsTo ?? [{ code: item.code, name: item.name }];
    const additions = toAdd
      .filter((a) => !selectedItems.find((i) => i.code === a.code))
      .map((a) => ({ code: a.code, name: a.name, internalId: mapToInternal(a.code, a.name, mode) }));
    if (additions.length > 0) onItemsChange([...selectedItems, ...additions]);
    setQuery("");
    setResults([]);
    setLocalResults([]);
    setOpen(false);
  };

  const removeItem = (code: string) => onItemsChange(selectedItems.filter((i) => i.code !== code));

  const colors = MODE_COLORS[mode];
  const allVisible = open && (localResults.length > 0 || results.length > 0);

  return (
    <div className="space-y-2">
      {label && <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</div>}

      {/* Search input */}
      <div className="relative">
        <div className="flex items-center border border-slate-300 rounded-lg bg-white focus-within:border-[#0B3D91] focus-within:ring-1 focus-within:ring-[#0B3D91]/30 transition-all">
          <Search className="w-4 h-4 text-slate-400 ml-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (localResults.length > 0 || results.length > 0) setOpen(true);
              else searchIcd(query, true);
            }}
            placeholder={PLACEHOLDERS[mode]}
            className="flex-1 px-2 py-2 text-sm bg-transparent outline-none placeholder-slate-400"
          />
          {loading && <Loader2 className="w-4 h-4 text-slate-400 mr-3 animate-spin shrink-0" />}
          {query && !loading && (
            <button onClick={() => { setQuery(""); setResults([]); setLocalResults([]); setOpen(false); }} className="mr-2">
              <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
            </button>
          )}
        </div>

        {/* Dropdown */}
        {allVisible && (
          <div ref={dropdownRef} className="absolute z-50 top-full mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
            <div className="py-1 max-h-64 overflow-y-auto">

              {/* ── Local quick-pick results (instant, no API needed) ── */}
              {localResults.length > 0 && (
                <>
                  <div className="px-3 py-1 text-[10px] font-semibold text-green-700 bg-green-50 border-b border-green-100 flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Quick pick
                  </div>
                  {localResults.map((item) => {
                    const already = selectedItems.find((i) => i.code === item.code);
                    return (
                      <button
                        key={item.code}
                        onClick={() => addItem(item)}
                        disabled={!!already}
                        className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 transition-colors ${
                          already ? "bg-slate-50 text-slate-400 cursor-not-allowed" : "hover:bg-green-50 text-slate-800"
                        }`}
                      >
                        {item.isRedFlag && <span className="text-sm shrink-0">🚨</span>}
                        <span className="flex-1 text-sm leading-snug font-medium">{item.name}</span>
                        {already
                          ? <span className="text-xs text-slate-400 shrink-0">Added</span>
                          : <span className="text-[10px] text-green-700 bg-green-50 border border-green-200 rounded px-1.5 py-0.5 shrink-0">Built-in</span>
                        }
                      </button>
                    );
                  })}
                </>
              )}

              {/* ── ICD-10 API results ── */}
              {results.length > 0 && (
                <>
                  {localResults.length > 0 && (
                    <div className="px-3 py-1 text-[10px] font-semibold text-slate-500 bg-slate-50 border-y border-slate-100">
                      ICD-10 codes
                    </div>
                  )}
                  {results.map((item) => {
                    const already = selectedItems.find((i) => i.code === item.code);
                    const chap = icdChapterColor(item.code);
                    const mapped = mapToInternal(item.code, item.name, mode);
                    return (
                      <button
                        key={item.code}
                        onClick={() => addItem(item)}
                        disabled={!!already}
                        className={`w-full text-left px-3 py-2 text-sm flex items-start gap-2 transition-colors ${
                          already ? "bg-slate-50 text-slate-400 cursor-not-allowed" : "hover:bg-blue-50 text-slate-800"
                        }`}
                      >
                        <span className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded shrink-0 mt-0.5 ${chap.bg} ${chap.text}`}>
                          {item.code}
                        </span>
                        <span className="flex-1 text-xs leading-snug">{item.name}</span>
                        <span className="flex items-center gap-1 shrink-0 mt-0.5">
                          {!mapped && !already && (
                            <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5 whitespace-nowrap">
                              Physician referral needed
                            </span>
                          )}
                          {already && <span className="text-xs text-slate-400">Added</span>}
                        </span>
                      </button>
                    );
                  })}
                </>
              )}
            </div>

            <div className="border-t border-slate-100 px-3 py-1.5 flex items-center gap-1 text-xs text-slate-400 bg-slate-50">
              <ExternalLink className="w-3 h-3" />
              ICD-10-CM · NLM Clinical Tables
              {localResults.length > 0 && (
                <span className="ml-1 text-green-600">· {localResults.length} quick picks</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Selected items */}
      {selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedItems.map((item) => {
            const isLocal = item.code.startsWith("SX:");
            const chap = isLocal ? null : icdChapterColor(item.code);
            return (
              <div
                key={item.code}
                className={`flex items-center gap-1 border rounded-full pl-1.5 pr-2 py-0.5 text-xs ${colors.chip}`}
                title={item.name}
              >
                <span className={`font-mono font-bold px-1 py-0.5 rounded text-[10px] ${colors.badge}`}>
                  {isLocal ? "✓" : item.code}
                </span>
                <span className="text-slate-800">{item.name}</span>
                {!item.internalId && (
                  <span className={`text-[10px] italic px-1 rounded ${chap?.bg ?? ""} ${chap?.text ?? ""}`}>•</span>
                )}
                <button onClick={() => removeItem(item.code)} className="ml-0.5 text-slate-400 hover:text-slate-700">
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Note for codes outside the engine rule set */}
      {selectedItems.some((i) => !i.internalId) && (
        <div className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded px-2 py-1.5 flex gap-1.5">
          <span>⚕️</span>
          <span>
            One or more selected codes fall outside the automated OTC rule set. <strong>Physician referral is recommended</strong> — these conditions typically require prescription therapy or clinical evaluation.
          </span>
        </div>
      )}
    </div>
  );
}
