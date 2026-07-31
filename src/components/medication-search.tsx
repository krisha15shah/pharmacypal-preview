import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, Loader2, ExternalLink, Pencil, Check } from "lucide-react";

export interface SelectedDrug {
  rxcui: string;
  name: string;
  internalId: string | null;
  dose?: string; // e.g. "400mg twice daily", "10mg OD"
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
  if (n.includes("paracetamol") || n.includes("acetaminophen") || n.includes("panadol") || n.includes("tylenol") || n.includes("calpol") || n.includes("dolo") || n.includes("panadeine") || n.includes("paramol") || n.includes("hedex") || n.includes("perfalgan")) return "paracetamol";
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
    paracetamol: { label: "Paracetamol", color: "bg-green-100 text-green-700" },
  };
  return internalId ? (map[internalId] ?? null) : null;
}

// ── Therapeutic duplication / same-class detection ───────────────────────────
type DupGroup = { key: string; label: string; risk: string };

// Drug classes that must not be doubled up (same class or overlapping pharmacology)
const CLASS_GROUPS: Record<string, DupGroup> = {
  nsaids:            { key: "nsaid",        label: "NSAIDs",                     risk: "Two NSAIDs together give no extra analgesia but multiply GI bleeding, renal impairment and cardiovascular risk. Use only one." },
  aspirin_cardio:    { key: "nsaid",        label: "NSAIDs / Aspirin",           risk: "Aspirin plus another NSAID markedly increases GI bleeding and blunts aspirin's cardioprotective effect. Avoid or add gastroprotection." },
  paracetamol:       { key: "paracetamol",  label: "Paracetamol",                risk: "Duplicate paracetamol (including combination/brand products) risks exceeding 4 g/day — hepatotoxicity. Check every product for hidden paracetamol." },
  ace_inhibitors:    { key: "raas",         label: "RAAS blockers",              risk: "Dual RAAS blockade (ACE inhibitor + ARB) increases hyperkalaemia, hypotension and acute kidney injury without outcome benefit." },
  arbs:              { key: "raas",         label: "RAAS blockers",              risk: "Dual RAAS blockade (ACE inhibitor + ARB) increases hyperkalaemia, hypotension and acute kidney injury without outcome benefit." },
  ssri:              { key: "serotonergic", label: "Serotonergic agents",        risk: "Combining serotonergic drugs (SSRI/SNRI/TCA/MAOI) risks serotonin syndrome — agitation, hyperthermia, clonus. Avoid overlap and observe washout periods." },
  snri:              { key: "serotonergic", label: "Serotonergic agents",        risk: "Combining serotonergic drugs (SSRI/SNRI/TCA/MAOI) risks serotonin syndrome — agitation, hyperthermia, clonus. Avoid overlap and observe washout periods." },
  tricyclics:        { key: "serotonergic", label: "Serotonergic agents",        risk: "Combining serotonergic drugs (SSRI/SNRI/TCA/MAOI) risks serotonin syndrome plus additive anticholinergic and cardiac conduction effects." },
  maoi:              { key: "serotonergic", label: "Serotonergic agents",        risk: "MAOI with any other serotonergic drug is contraindicated — potentially fatal serotonin syndrome / hypertensive crisis." },
  warfarin:          { key: "anticoag",     label: "Anticoagulants",             risk: "Two anticoagulants together cause major bleeding. Never overlap except in a supervised bridging protocol." },
  dabigatran_rivaroxaban: { key: "anticoag", label: "Anticoagulants",            risk: "Two anticoagulants together cause major bleeding. Never overlap except in a supervised bridging protocol." },
  clopidogrel:       { key: "antiplatelet", label: "Antiplatelets",              risk: "Dual antiplatelet therapy is only appropriate for a defined indication and duration — otherwise bleeding risk outweighs benefit." },
  metformin:         { key: "antidiabetic", label: "Oral antidiabetics",         risk: "Multiple glucose-lowering agents increase hypoglycaemia risk (especially sulfonylureas). Confirm the regimen is intentional and monitor glucose." },
  insulin:           { key: "antidiabetic", label: "Antidiabetics",              risk: "Insulin plus oral hypoglycaemics increases hypoglycaemia risk — verify dosing and educate on symptoms." },
  beta_blockers:     { key: "beta_blocker", label: "Beta blockers",              risk: "Two beta blockers cause additive bradycardia, hypotension and heart block. Use only one." },
  calcium_channel_blockers: { key: "ccb",   label: "Calcium channel blockers",   risk: "Two CCBs (especially a rate-limiting plus a dihydropyridine) risk bradycardia, heart block and oedema." },
  diuretics:         { key: "diuretic",     label: "Diuretics",                  risk: "Multiple diuretics cause additive volume depletion and electrolyte disturbance — check U&Es if intentional (e.g. sequential nephron blockade)." },
  corticosteroids:   { key: "steroid",      label: "Corticosteroids",            risk: "Overlapping systemic/inhaled steroids increase cumulative exposure — adrenal suppression, hyperglycaemia, osteoporosis." },
  statins:           { key: "statin",       label: "Statins",                    risk: "Two statins together add no benefit and multiply myopathy/rhabdomyolysis risk." },
  omeprazole_ppi:    { key: "ppi",          label: "Proton pump inhibitors",     risk: "Duplicate PPI therapy is unnecessary — deprescribe to a single agent." },
  antiepileptics:    { key: "aed",          label: "Antiepileptics",             risk: "Polytherapy is sometimes intentional, but adds sedation and enzyme-mediated interactions — confirm it is a planned regimen." },
  quinolone_antibiotics: { key: "quinolone", label: "Quinolone antibiotics",     risk: "Two quinolones give no added cover and increase tendinopathy, QT prolongation and CNS effects." },
  azole_antifungals: { key: "azole",        label: "Azole antifungals",          risk: "Two azoles add no benefit and compound CYP3A4 inhibition and QT prolongation." },
};

export interface DuplicateWarning {
  label: string;
  drugs: string[];
  risk: string;
  sameDrug: boolean;
}

export function findDuplicateTherapy(drugs: SelectedDrug[]): DuplicateWarning[] {
  const byGroup = new Map<string, { group: DupGroup; items: SelectedDrug[] }>();
  for (const d of drugs) {
    const group = d.internalId ? CLASS_GROUPS[d.internalId] : undefined;
    if (!group) continue;
    const entry = byGroup.get(group.key);
    if (entry) entry.items.push(d);
    else byGroup.set(group.key, { group, items: [d] });
  }
  const out: DuplicateWarning[] = [];
  for (const { group, items } of byGroup.values()) {
    if (items.length < 2) continue;
    const ids = new Set(items.map((i) => i.internalId));
    out.push({
      label: group.label,
      drugs: items.map((i) => i.name),
      risk: group.risk,
      sameDrug: ids.size === 1,
    });
  }
  return out;
}

// ── Inline dose editor on a single chip ──────────────────────────────────────
function DrugChip({
  drug,
  onDoseChange,
  onRemove,
}: {
  drug: SelectedDrug;
  onDoseChange: (rxcui: string, dose: string) => void;
  onRemove: (rxcui: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(drug.dose ?? "");
  const inputRef = useRef<HTMLInputElement>(null);
  const cls = classLabel(drug.internalId);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const commit = () => {
    onDoseChange(drug.rxcui, draft.trim());
    setEditing(false);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") commit();
    if (e.key === "Escape") { setDraft(drug.dose ?? ""); setEditing(false); }
  };

  return (
    <div className="flex flex-col gap-0.5 bg-orange-50 border border-orange-200 rounded-xl px-3 py-1.5 text-sm min-w-0 max-w-[260px]">
      {/* Top row: name + class badge + remove */}
      <div className="flex items-center gap-1.5 min-w-0">
        <span className="text-orange-900 font-medium truncate flex-1" title={drug.name}>
          {drug.name}
        </span>
        {cls && (
          <span className={`text-xs px-1.5 py-0.5 rounded font-medium shrink-0 ${cls.color}`}>
            {cls.label}
          </span>
        )}
        {!drug.internalId && (
          <span className="text-xs text-slate-400 italic shrink-0">no rule match</span>
        )}
        <button
          onClick={() => onRemove(drug.rxcui)}
          className="text-orange-400 hover:text-orange-700 shrink-0 ml-0.5"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Bottom row: dose */}
      {editing ? (
        <div className="flex items-center gap-1 mt-0.5">
          <input
            ref={inputRef}
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKey}
            onBlur={commit}
            placeholder="e.g. 400mg twice daily"
            className="flex-1 text-xs bg-white border border-orange-300 rounded px-2 py-0.5 outline-none focus:border-orange-500 placeholder-slate-400 min-w-0"
          />
          <button onMouseDown={(e) => { e.preventDefault(); commit(); }} className="text-green-600 hover:text-green-700 shrink-0">
            <Check className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => { setDraft(drug.dose ?? ""); setEditing(true); }}
          className="flex items-center gap-1 text-left group"
        >
          {drug.dose ? (
            <span className="text-xs text-orange-700 font-medium">{drug.dose}</span>
          ) : (
            <span className="text-xs text-slate-400 italic">+ add dose</span>
          )}
          <Pencil className="w-2.5 h-2.5 text-slate-300 group-hover:text-orange-500 shrink-0 transition-colors" />
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

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
    if (term.length < 2) { setResults([]); setOpen(false); return; }
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

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current && !inputRef.current.contains(e.target as Node)
      ) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const addDrug = (candidate: RxNavCandidate) => {
    if (selectedDrugs.find((d) => d.rxcui === candidate.rxcui)) { setQuery(""); setOpen(false); return; }
    onDrugsChange([...selectedDrugs, {
      rxcui: candidate.rxcui,
      name: candidate.name,
      internalId: mapToInternalId(candidate.name),
    }]);
    setQuery("");
    setResults([]);
    setOpen(false);
  };

  const removeDrug = (rxcui: string) => onDrugsChange(selectedDrugs.filter((d) => d.rxcui !== rxcui));

  const duplicates = findDuplicateTherapy(selectedDrugs);

  const updateDose = (rxcui: string, dose: string) => {
    onDrugsChange(selectedDrugs.map((d) => d.rxcui === rxcui ? { ...d, dose: dose || undefined } : d));
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
          <div ref={dropdownRef} className="absolute z-50 top-full mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
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
          {selectedDrugs.map((drug) => (
            <DrugChip
              key={drug.rxcui}
              drug={drug}
              onDoseChange={updateDose}
              onRemove={removeDrug}
            />
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-400 italic">No medications added yet. Search above to add.</p>
      )}

      {/* Therapeutic duplication warning */}
      {duplicates.length > 0 && (
        <div className="space-y-2">
          {duplicates.map((d) => (
            <div
              key={d.label + d.drugs.join()}
              className="text-xs rounded-lg px-3 py-2 border bg-red-50 border-red-200 text-red-800"
            >
              <div className="font-semibold flex items-center gap-1.5">
                <span>🚫</span>
                {d.sameDrug ? "Duplicate therapy" : "Same-class overlap"} — {d.label}
              </div>
              <div className="mt-1 text-red-700">{d.drugs.join("  +  ")}</div>
              <div className="mt-1 text-red-700/90">{d.risk}</div>
            </div>
          ))}
        </div>
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
