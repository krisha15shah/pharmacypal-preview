import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, Loader2, ExternalLink } from "lucide-react";

export interface SelectedDrug {
  rxcui: string;
  name: string;
  internalId: string | null;
}

interface RxNavCandidate {
  rxcui: string;
  name: string;
  score: string;
}

// Map RxNav drug names → our internal rule engine IDs
function mapToInternalId(drugName: string): string | null {
  const n = drugName.toLowerCase();
  if (n.includes("warfarin") || n.includes("acenocoumarol") || n.includes("coumadin") || n.includes("jantoven")) return "warfarin";
  if (n.includes("dabigatran") || n.includes("rivaroxaban") || n.includes("apixaban") || n.includes("edoxaban") || n.includes("xarelto") || n.includes("eliquis") || n.includes("pradaxa")) return "dabigatran_rivaroxaban";
  if ((n.includes("aspirin") || n.includes("acetylsalicylic")) && !n.includes("oxycodone")) return "aspirin_cardio";
  if (n.includes("clopidogrel") || n.includes("prasugrel") || n.includes("ticagrelor") || n.includes("plavix")) return "clopidogrel";
  if (n.includes("enalapril") || n.includes("lisinopril") || n.includes("ramipril") || n.includes("perindopril") || n.includes("captopril") || n.includes("quinapril") || n.includes("benazepril") || n.includes("fosinopril")) return "ace_inhibitors";
  if (n.includes("losartan") || n.includes("valsartan") || n.includes("telmisartan") || n.includes("irbesartan") || n.includes("candesartan") || n.includes("olmesartan") || n.includes("cozaar") || n.includes("diovan")) return "arbs";
  if (n.includes("atenolol") || n.includes("metoprolol") || n.includes("bisoprolol") || n.includes("carvedilol") || n.includes("propranolol") || n.includes("nebivolol") || n.includes("labetalol")) return "beta_blockers";
  if (n.includes("amlodipine") || n.includes("nifedipine") || n.includes("diltiazem") || n.includes("verapamil") || n.includes("felodipine") || n.includes("lercanidipine")) return "calcium_channel_blockers";
  if (n.includes("furosemide") || n.includes("hydrochlorothiazide") || n.includes("spironolactone") || n.includes("indapamide") || n.includes("bendroflumethiazide") || n.includes("chlorthalidone") || n.includes("torasemide") || n.includes("eplerenone")) return "diuretics";
  if (n.includes("metformin") || n.includes("glipizide") || n.includes("gliclazide") || n.includes("glibenclamide") || n.includes("sitagliptin") || n.includes("empagliflozin") || n.includes("dapagliflozin") || n.includes("liraglutide") || n.includes("semaglutide") || n.includes("januvia") || n.includes("jardiance") || n.includes("glucophage")) return "metformin";
  if (n.includes("insulin")) return "insulin";
  if (n.includes("fluoxetine") || n.includes("sertraline") || n.includes("escitalopram") || n.includes("citalopram") || n.includes("paroxetine") || n.includes("fluvoxamine") || n.includes("prozac") || n.includes("zoloft") || n.includes("lexapro")) return "ssri";
  if (n.includes("venlafaxine") || n.includes("duloxetine") || n.includes("desvenlafaxine") || n.includes("effexor") || n.includes("cymbalta")) return "snri";
  if (n.includes("phenelzine") || n.includes("tranylcypromine") || n.includes("moclobemide") || n.includes("isocarboxazid")) return "maoi";
  if (n.includes("amitriptyline") || n.includes("imipramine") || n.includes("nortriptyline") || n.includes("clomipramine") || n.includes("doxepin") || n.includes("trimipramine")) return "tricyclics";
  if (n.includes("prednisolone") || n.includes("prednisone") || n.includes("dexamethasone") || n.includes("hydrocortisone") || n.includes("methylprednisolone") || n.includes("budesonide") || n.includes("beclomethasone") || n.includes("fluticasone")) return "corticosteroids";
  if (n.includes("digoxin") || n.includes("digitalis") || n.includes("lanoxin")) return "digoxin";
  if (n.includes("lithium") || n.includes("lithobid") || n.includes("eskalith")) return "lithium";
  if (n.includes("methotrexate") || n.includes("rheumatrex")) return "methotrexate";
  if (n.includes("phenytoin") || n.includes("carbamazepine") || n.includes("valproate") || n.includes("valproic") || n.includes("lamotrigine") || n.includes("levetiracetam") || n.includes("topiramate") || n.includes("oxcarbazepine") || n.includes("gabapentin") || n.includes("tegretol") || n.includes("depakote") || n.includes("keppra")) return "antiepileptics";
  if (n.includes("fluconazole") || n.includes("ketoconazole") || n.includes("itraconazole") || n.includes("voriconazole") || n.includes("posaconazole") || n.includes("diflucan")) return "azole_antifungals";
  if (n.includes("atorvastatin") || n.includes("rosuvastatin") || n.includes("simvastatin") || n.includes("pravastatin") || n.includes("lovastatin") || n.includes("fluvastatin") || n.includes("lipitor") || n.includes("crestor") || n.includes("zocor")) return "statins";
  if (n.includes("omeprazole") || n.includes("pantoprazole") || n.includes("esomeprazole") || n.includes("lansoprazole") || n.includes("rabeprazole") || n.includes("prilosec") || n.includes("nexium") || n.includes("prevacid")) return "omeprazole_ppi";
  if (n.includes("levothyroxine") || n.includes("thyroxine") || n.includes("synthroid") || n.includes("eltroxin")) return "levothyroxine";
  if (n.includes("levodopa") || n.includes("carbidopa") || n.includes("sinemet")) return "levodopa";
  if (n.includes("theophylline") || n.includes("aminophylline")) return "theophylline";
  if (n.includes("ciprofloxacin") || n.includes("levofloxacin") || n.includes("moxifloxacin") || n.includes("ofloxacin") || n.includes("norfloxacin")) return "quinolone_antibiotics";
  if (n.includes("ibuprofen") || n.includes("diclofenac") || n.includes("naproxen") || n.includes("indomethacin") || n.includes("celecoxib") || n.includes("mefenamic") || n.includes("piroxicam") || n.includes("meloxicam") || n.includes("etoricoxib")) return "nsaids";
  return null;
}

// Drug class badge colour
function classLabel(internalId: string | null): { label: string; color: string } | null {
  const map: Record<string, { label: string; color: string }> = {
    warfarin: { label: "Anticoagulant", color: "bg-red-100 text-red-700" },
    dabigatran_rivaroxaban: { label: "DOAC", color: "bg-red-100 text-red-700" },
    aspirin_cardio: { label: "Antiplatelet", color: "bg-orange-100 text-orange-700" },
    clopidogrel: { label: "Antiplatelet", color: "bg-orange-100 text-orange-700" },
    ace_inhibitors: { label: "ACE Inhibitor", color: "bg-purple-100 text-purple-700" },
    arbs: { label: "ARB", color: "bg-purple-100 text-purple-700" },
    beta_blockers: { label: "Beta Blocker", color: "bg-indigo-100 text-indigo-700" },
    calcium_channel_blockers: { label: "CCB", color: "bg-indigo-100 text-indigo-700" },
    diuretics: { label: "Diuretic", color: "bg-cyan-100 text-cyan-700" },
    metformin: { label: "Antidiabetic", color: "bg-teal-100 text-teal-700" },
    insulin: { label: "Insulin", color: "bg-teal-100 text-teal-700" },
    ssri: { label: "SSRI", color: "bg-violet-100 text-violet-700" },
    snri: { label: "SNRI", color: "bg-violet-100 text-violet-700" },
    maoi: { label: "⚠️ MAOI", color: "bg-red-100 text-red-700" },
    tricyclics: { label: "TCA", color: "bg-violet-100 text-violet-700" },
    corticosteroids: { label: "Steroid", color: "bg-yellow-100 text-yellow-700" },
    digoxin: { label: "Cardiac glycoside", color: "bg-red-100 text-red-700" },
    lithium: { label: "⚠️ Lithium", color: "bg-red-100 text-red-700" },
    methotrexate: { label: "⚠️ Methotrexate", color: "bg-red-100 text-red-700" },
    antiepileptics: { label: "Antiepileptic", color: "bg-pink-100 text-pink-700" },
    azole_antifungals: { label: "Azole Antifungal", color: "bg-amber-100 text-amber-700" },
    statins: { label: "Statin", color: "bg-blue-100 text-blue-700" },
    omeprazole_ppi: { label: "PPI", color: "bg-green-100 text-green-700" },
    levothyroxine: { label: "Thyroid hormone", color: "bg-lime-100 text-lime-700" },
    levodopa: { label: "Anti-Parkinson", color: "bg-amber-100 text-amber-700" },
    theophylline: { label: "Bronchodilator", color: "bg-sky-100 text-sky-700" },
    quinolone_antibiotics: { label: "Quinolone Abx", color: "bg-rose-100 text-rose-700" },
    nsaids: { label: "NSAID", color: "bg-orange-100 text-orange-700" },
  };
  return internalId ? (map[internalId] ?? null) : null;
}

interface MedicationSearchProps {
  selectedDrugs: SelectedDrug[];
  onDrugsChange: (drugs: SelectedDrug[]) => void;
}

export default function MedicationSearch({ selectedDrugs, onDrugsChange }: MedicationSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<RxNavCandidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const searchRxNav = useCallback(async (term: string) => {
    if (term.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `https://rxnav.nlm.nih.gov/REST/approximateTerm.json?term=${encodeURIComponent(term)}&maxEntries=30`
      );
      const data = await res.json();
      const candidates: RxNavCandidate[] = (data.approximateGroup?.candidate ?? [])
        .filter((c: any) => c.name && c.rxcui)
        .reduce((acc: RxNavCandidate[], c: any) => {
          if (!acc.find((x) => x.name.toLowerCase() === c.name.toLowerCase())) {
            acc.push({ rxcui: c.rxcui, name: c.name, score: c.score });
          }
          return acc;
        }, [])
        .slice(0, 10);
      setResults(candidates);
      setOpen(candidates.length > 0);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchRxNav(query), 280);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, searchRxNav]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current && !inputRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const addDrug = (candidate: RxNavCandidate) => {
    if (selectedDrugs.find((d) => d.rxcui === candidate.rxcui)) {
      setQuery("");
      setOpen(false);
      return;
    }
    const drug: SelectedDrug = {
      rxcui: candidate.rxcui,
      name: candidate.name,
      internalId: mapToInternalId(candidate.name),
    };
    onDrugsChange([...selectedDrugs, drug]);
    setQuery("");
    setResults([]);
    setOpen(false);
  };

  const removeDrug = (rxcui: string) => {
    onDrugsChange(selectedDrugs.filter((d) => d.rxcui !== rxcui));
  };

  return (
    <div className="space-y-3">
      {/* Search input */}
      <div className="relative">
        <div className="flex items-center border border-slate-300 rounded-lg bg-white focus-within:border-[#0B3D91] focus-within:ring-1 focus-within:ring-[#0B3D91]/30 transition-all">
          <Search className="w-4 h-4 text-slate-400 ml-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && setOpen(true)}
            placeholder="Search any medication by name…"
            className="flex-1 px-2 py-2 text-sm bg-transparent outline-none placeholder-slate-400"
          />
          {loading && <Loader2 className="w-4 h-4 text-slate-400 mr-3 animate-spin shrink-0" />}
          {query && !loading && (
            <button onClick={() => { setQuery(""); setResults([]); setOpen(false); }} className="mr-2">
              <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
            </button>
          )}
        </div>

        {/* Dropdown */}
        {open && results.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute z-50 top-full mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden"
          >
            <div className="py-1 max-h-52 overflow-y-auto">
              {results.map((c) => {
                const already = selectedDrugs.find((d) => d.rxcui === c.rxcui);
                const cls = classLabel(mapToInternalId(c.name));
                return (
                  <button
                    key={`${c.rxcui}-${c.name}`}
                    onClick={() => addDrug(c)}
                    disabled={!!already}
                    className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between gap-2 transition-colors ${
                      already ? "bg-slate-50 text-slate-400 cursor-not-allowed" : "hover:bg-blue-50 text-slate-800"
                    }`}
                  >
                    <span className="flex-1 truncate">{c.name}</span>
                    <span className="flex items-center gap-1 shrink-0">
                      {cls && (
                        <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${cls.color}`}>
                          {cls.label}
                        </span>
                      )}
                      {already && <span className="text-xs text-slate-400">Added</span>}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="border-t border-slate-100 px-3 py-1.5 flex items-center gap-1 text-xs text-slate-400 bg-slate-50">
              <ExternalLink className="w-3 h-3" />
              Powered by NLM RxNav API · {results.length} results
            </div>
          </div>
        )}
      </div>

      {/* Selected drugs */}
      {selectedDrugs.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {selectedDrugs.map((drug) => {
            const cls = classLabel(drug.internalId);
            return (
              <div
                key={drug.rxcui}
                className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 rounded-full pl-3 pr-2 py-1 text-sm"
              >
                <span className="text-orange-900 font-medium max-w-[180px] truncate" title={drug.name}>
                  {drug.name}
                </span>
                {cls && (
                  <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${cls.color}`}>
                    {cls.label}
                  </span>
                )}
                {!drug.internalId && (
                  <span className="text-xs text-slate-400 italic">no rule match</span>
                )}
                <button
                  onClick={() => removeDrug(drug.rxcui)}
                  className="text-orange-400 hover:text-orange-700 ml-1 shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-xs text-slate-400 italic">No medications added yet. Search above to add.</p>
      )}

      {/* Unmatched warning */}
      {selectedDrugs.some((d) => !d.internalId) && (
        <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          ⚠️ Some medications don't match our drug interaction database — they will be recorded but won't trigger automated safety rules. Always apply clinical judgment.
        </div>
      )}
    </div>
  );
}
