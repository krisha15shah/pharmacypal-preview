import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import {
  AlertTriangle, CheckCircle, XCircle, Info, ChevronDown, ChevronUp,
  Pill, User, Baby, Clock, Activity, ShieldAlert, BookOpen, MessageSquare,
  Stethoscope, RotateCcw, PillBottle, Brain, Loader2, RefreshCw, FlaskConical
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { SYMPTOMS, CONDITIONS, ALLERGIES, CURRENT_MEDICATIONS } from "@/lib/clinical-data";
import { runClinicalEngine, type PatientProfile, type MedicationResult } from "@/lib/clinical-engine";
import MedicationSearch, { type SelectedDrug } from "@/components/medication-search";
import IcdSearch, { type SelectedIcdItem } from "@/components/icd-search";
import { LAB_CATEGORIES, getLabStatus, getRefRangeText, type LabDef } from "@/lib/lab-data";

// ─── Chip selector ───
function ChipSelector({
  items,
  selected,
  onToggle,
  colorClass = "bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100",
  selectedClass = "bg-blue-600 border-blue-600 text-white hover:bg-blue-700",
  redFlagClass = "bg-red-50 border-red-300 text-red-800 hover:bg-red-100",
  redFlagSelectedClass = "bg-red-600 border-red-600 text-white",
}: {
  items: { id: string; label: string; isRedFlag?: boolean }[];
  selected: string[];
  onToggle: (id: string) => void;
  colorClass?: string;
  selectedClass?: string;
  redFlagClass?: string;
  redFlagSelectedClass?: string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        const isSelected = selected.includes(item.id);
        const isRed = item.isRedFlag;
        let cls = "cursor-pointer border rounded-full px-3 py-1 text-sm font-medium transition-all select-none ";
        if (isRed) {
          cls += isSelected ? redFlagSelectedClass : redFlagClass;
        } else {
          cls += isSelected ? selectedClass : colorClass;
        }
        return (
          <span key={item.id} className={cls} onClick={() => onToggle(item.id)}>
            {isRed && <span className="mr-1">🚨</span>}
            {item.label}
          </span>
        );
      })}
    </div>
  );
}

// ─── Category section ───
function CategorySection({
  title,
  items,
  selected,
  onToggle,
  colorClass,
  selectedClass,
}: {
  title: string;
  items: { id: string; label: string; isRedFlag?: boolean }[];
  selected: string[];
  onToggle: (id: string) => void;
  colorClass?: string;
  selectedClass?: string;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 hover:text-slate-700"
      >
        {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        {title}
      </button>
      {open && (
        <ChipSelector
          items={items}
          selected={selected}
          onToggle={onToggle}
          colorClass={colorClass}
          selectedClass={selectedClass}
        />
      )}
    </div>
  );
}

// ─── Safety badge ───
function SafetyBadge({ level }: { level: "recommended" | "caution" | "avoid" }) {
  if (level === "recommended")
    return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-xs">✅ Recommended</Badge>;
  if (level === "caution")
    return <Badge className="bg-amber-100 text-amber-800 border-amber-300 text-xs">⚠️ Use with Caution</Badge>;
  return <Badge className="bg-red-100 text-red-800 border-red-300 text-xs">❌ Avoid</Badge>;
}

// ─── Severity badge ───
function SeverityBadge({ severity }: { severity: "mild" | "moderate" | "severe" }) {
  if (severity === "severe")
    return <span className="text-xs font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">Severe</span>;
  if (severity === "moderate")
    return <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">Moderate</span>;
  return <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">Mild</span>;
}

// ─── Medication card ───
function MedicationCard({ result }: { result: MedicationResult }) {
  const [expanded, setExpanded] = useState(result.safetyLevel === "recommended");
  const { medication: med, safetyLevel, avoidReasons, cautionReasons, activeInteractions } = result;

  const borderColor =
    safetyLevel === "recommended"
      ? "border-l-emerald-500"
      : safetyLevel === "caution"
      ? "border-l-amber-500"
      : "border-l-red-500";

  return (
    <div className={`border border-slate-200 border-l-4 ${borderColor} rounded-lg bg-white mb-3 overflow-hidden`}>
      <button
        className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Pill className="w-4 h-4 text-slate-400 shrink-0" />
          <div className="min-w-0">
            <div className="font-semibold text-slate-900 text-sm truncate">{med.name}</div>
            <div className="text-xs text-slate-500 truncate">{med.brandExamples}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-2 shrink-0">
          <SafetyBadge level={safetyLevel} />
          {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-slate-100">
          <div className="mt-3 grid grid-cols-1 gap-3">
            {/* Category & mechanism */}
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">{med.category}</span>
            </div>

            {/* Avoid reasons */}
            {avoidReasons.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="text-xs font-bold text-red-700 mb-1 flex items-center gap-1">
                  <XCircle className="w-3 h-3" /> REASONS TO AVOID
                </div>
                {avoidReasons.map((r, i) => (
                  <div key={i} className="text-xs text-red-700 mt-1">• {r}</div>
                ))}
              </div>
            )}

            {/* Caution reasons */}
            {cautionReasons.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="text-xs font-bold text-amber-700 mb-1 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> CAUTIONS / MONITORING
                </div>
                {cautionReasons.map((r, i) => (
                  <div key={i} className="text-xs text-amber-700 mt-1">• {r}</div>
                ))}
              </div>
            )}

            {/* Dosage (show only if recommended or caution) */}
            {safetyLevel !== "avoid" && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                <div className="text-xs font-bold text-emerald-700 mb-2 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> DOSAGE GUIDE
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 font-medium">Adult dose:</span>
                    <div className="text-slate-800">{med.dosage.adult}</div>
                  </div>
                  {med.dosage.pediatric && (
                    <div>
                      <span className="text-slate-500 font-medium">Paediatric:</span>
                      <div className="text-slate-800">{med.dosage.pediatric}</div>
                    </div>
                  )}
                  {med.dosage.elderly && (
                    <div>
                      <span className="text-slate-500 font-medium">Elderly:</span>
                      <div className="text-slate-800">{med.dosage.elderly}</div>
                    </div>
                  )}
                  <div>
                    <span className="text-slate-500 font-medium">Max daily:</span>
                    <div className="text-slate-800">{med.dosage.maxDaily}</div>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Duration:</span>
                    <div className="text-slate-800">{med.dosage.duration}</div>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">With food:</span>
                    <div className="text-slate-800">{med.dosage.withFood ? "Yes – required" : "Not required"}</div>
                  </div>
                </div>
                {med.dosage.notes && (
                  <div className="mt-2 text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-200">
                    ⚡ {med.dosage.notes}
                  </div>
                )}
              </div>
            )}

            {/* Drug interactions */}
            {activeInteractions.length > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <div className="text-xs font-bold text-orange-700 mb-2 flex items-center gap-1">
                  <Activity className="w-3 h-3" /> DRUG INTERACTIONS DETECTED
                </div>
                {activeInteractions.map((ix, i) => (
                  <div key={i} className="mb-2">
                    <div className="flex items-center gap-2 text-xs text-orange-700 font-medium">
                      <SeverityBadge severity={ix.severity} />
                      <span>{ix.drug}</span>
                    </div>
                    <div className="text-xs text-slate-600 mt-0.5 ml-1">{ix.effect}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Counseling points (only for recommended/caution) */}
            {safetyLevel !== "avoid" && med.counselingPoints.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="text-xs font-bold text-blue-700 mb-2 flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" /> COUNSELING POINTS
                </div>
                {med.counselingPoints.map((pt, i) => (
                  <div key={i} className="text-xs text-slate-700 mt-1">• {pt}</div>
                ))}
              </div>
            )}

            {/* Patient explanation */}
            {safetyLevel !== "avoid" && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <div className="text-xs font-bold text-slate-600 mb-1 flex items-center gap-1">
                  <User className="w-3 h-3" /> PATIENT EXPLANATION
                </div>
                <div className="text-xs text-slate-700 italic">"{med.patientExplanation}"</div>
              </div>
            )}

            {/* Refer if no improvement */}
            {safetyLevel !== "avoid" && (
              <div className="text-xs text-slate-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Refer if no improvement after: <span className="font-medium text-slate-700">{med.referralIfNoImprovement}</span>
              </div>
            )}

            {/* Source */}
            <div className="text-xs text-slate-400 flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              {med.source}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Lab category block ───
function LabCategoryBlock({
  category,
  values,
  gender,
  onChange,
}: {
  category: { id: string; label: string; labs: LabDef[] };
  values: Record<string, string>;
  gender: string;
  onChange: (id: string, val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const abnormalCount = category.labs.filter((lab) => {
    const v = parseFloat(values[lab.id] ?? "");
    return !isNaN(v) && getLabStatus(lab, v, gender) !== "normal";
  }).length;

  return (
    <div className="border border-slate-100 rounded-lg overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-3 py-2 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{category.label}</span>
        <div className="flex items-center gap-1.5">
          {abnormalCount > 0 && (
            <span className="text-[10px] font-bold bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full">
              {abnormalCount} ↑↓
            </span>
          )}
          {open ? <ChevronUp className="w-3 h-3 text-slate-400" /> : <ChevronDown className="w-3 h-3 text-slate-400" />}
        </div>
      </button>

      {open && (
        <div className="divide-y divide-slate-100">
          {category.labs.map((lab) => {
            const valStr = values[lab.id] ?? "";
            const val = parseFloat(valStr);
            const status = !isNaN(val) && valStr ? getLabStatus(lab, val, gender) : "normal";
            const isAbnormal = status !== "normal";
            const isCritical = status === "critical-high" || status === "critical-low";
            const refRange = getRefRangeText(lab, gender);

            return (
              <div
                key={lab.id}
                className={`flex items-center gap-2 px-3 py-2 ${
                  isCritical ? "bg-red-100" : isAbnormal ? "bg-red-50" : "bg-white"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className={`text-xs font-medium truncate ${isAbnormal ? "text-red-800" : "text-slate-700"}`}>
                    {lab.label}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {refRange ? `Ref: ${refRange}` : lab.note ?? ""} {lab.unit}
                  </div>
                </div>
                <input
                  type="number"
                  step="any"
                  value={valStr}
                  onChange={(e) => onChange(lab.id, e.target.value)}
                  placeholder="—"
                  className={`w-[72px] h-7 text-xs text-right border rounded px-2 focus:outline-none focus:ring-1 ${
                    isCritical
                      ? "border-red-500 bg-red-50 text-red-800 focus:ring-red-400"
                      : isAbnormal
                      ? "border-red-300 bg-red-50 text-red-700 focus:ring-red-300"
                      : "border-slate-300 bg-white text-slate-800 focus:ring-blue-300"
                  }`}
                />
                <div className="w-8 text-center">
                  {isAbnormal ? (
                    <span
                      className={`text-[10px] font-bold px-1 py-0.5 rounded ${
                        isCritical
                          ? "bg-red-600 text-white"
                          : status === "high" || status === "critical-high"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {isCritical ? "‼" : status === "high" || status === "critical-high" ? "H" : "L"}
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-300">—</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── MAIN DASHBOARD ───
const DEFAULT_PROFILE: PatientProfile = {
  age: 35,
  gender: "male",
  isPregnant: false,
  selectedSymptoms: [],
  selectedConditions: [],
  selectedMedications: [],
  selectedAllergies: [],
};
const DEFAULT_DRUGS: SelectedDrug[] = [];

const symptomsByCategory = SYMPTOMS.reduce(
  (acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  },
  {} as Record<string, typeof SYMPTOMS>
);

export default function Dashboard() {
  const [profile, setProfile] = useState<PatientProfile>(DEFAULT_PROFILE);
  const [selectedDrugs, setSelectedDrugs] = useState<SelectedDrug[]>(DEFAULT_DRUGS);
  // ICD-10-CM selections — kept separate from chip selections to avoid stale-closure sync bugs
  const [icdSymptoms, setIcdSymptoms] = useState<SelectedIcdItem[]>([]);
  const [icdConditions, setIcdConditions] = useState<SelectedIcdItem[]>([]);
  const [icdAllergies, setIcdAllergies] = useState<SelectedIcdItem[]>([]);
  const [activeTab, setActiveTab] = useState("recommended");
  const [labValues, setLabValues] = useState<Record<string, string>>({});
  const [labPanelOpen, setLabPanelOpen] = useState(false);

  // ── AI clinical analysis ──
  type AiAnalysis = {
    conditionOverview: { label: string; code: string; meaning: string; pharmacyNote: string }[];
    otcOptions: string[];
    prescriptionNeeds: string[];
    redFlags: string[];
    drugSafety: string[];
    counselingPoints: string[];
  };
  const [aiAnalysis, setAiAnalysis] = useState<AiAnalysis | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const aiDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const aiAbortRef = useRef<AbortController | null>(null);

  const fetchAiAnalysis = useCallback(async (payload: object) => {
    if (aiAbortRef.current) aiAbortRef.current.abort();
    aiAbortRef.current = new AbortController();
    setAiLoading(true);
    setAiError(null);
    try {
      const res = await fetch("/api/ai-clinical", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: aiAbortRef.current.signal,
      });
      if (!res.ok) throw new Error("Analysis failed");
      const data = await res.json();
      setAiAnalysis(data);
    } catch (e: any) {
      if (e.name !== "AbortError") setAiError("AI analysis unavailable. Please try again.");
    } finally {
      setAiLoading(false);
    }
  }, []);

  const toggle = (field: keyof Pick<PatientProfile, "selectedSymptoms" | "selectedConditions" | "selectedAllergies">) =>
    (id: string) => {
      setProfile((prev) => {
        const arr = prev[field] as string[];
        return { ...prev, [field]: arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id] };
      });
    };

  const handleDrugsChange = (drugs: SelectedDrug[]) => {
    setSelectedDrugs(drugs);
    const internalIds = drugs.map((d) => d.internalId).filter(Boolean) as string[];
    setProfile((prev) => ({ ...prev, selectedMedications: internalIds }));
  };

  // Simple ICD handlers — merging is done in effectiveProfile, not in profile state
  const handleIcdSymptoms = (items: SelectedIcdItem[]) => setIcdSymptoms(items);
  const handleIcdConditions = (items: SelectedIcdItem[]) => setIcdConditions(items);
  const handleIcdAllergies = (items: SelectedIcdItem[]) => setIcdAllergies(items);

  // Derive a merged profile for the clinical engine — no state sync needed
  const effectiveProfile = useMemo<PatientProfile>(() => {
    const merge = (chipIds: string[], icdItems: SelectedIcdItem[]) =>
      Array.from(new Set([...chipIds, ...icdItems.map((i) => i.internalId).filter(Boolean) as string[]]));
    return {
      ...profile,
      selectedSymptoms: merge(profile.selectedSymptoms, icdSymptoms),
      selectedConditions: merge(profile.selectedConditions, icdConditions),
      selectedAllergies: merge(profile.selectedAllergies, icdAllergies),
    };
  }, [profile, icdSymptoms, icdConditions, icdAllergies]);

  // Compute abnormal lab values — must be declared before the AI effect that uses it
  const abnormalLabs = useMemo<string[]>(() => {
    const out: string[] = [];
    for (const cat of LAB_CATEGORIES) {
      for (const lab of cat.labs) {
        const valStr = labValues[lab.id];
        if (!valStr || valStr.trim() === "") continue;
        const val = parseFloat(valStr);
        if (isNaN(val)) continue;
        const status = getLabStatus(lab, val, profile.gender);
        if (status !== "normal") {
          const refRange = getRefRangeText(lab, profile.gender);
          const flag = status.includes("critical") ? `‼ ${status.replace("-", " ").toUpperCase()}` : status.toUpperCase();
          out.push(`${lab.label}: ${val} ${lab.unit} [${flag}] (ref: ${refRange} ${lab.unit})`);
        }
      }
    }
    return out;
  }, [labValues, profile.gender]);

  // Trigger AI analysis (debounced 1.5 s) whenever profile or ICD selections change
  useEffect(() => {
    if (aiDebounceRef.current) clearTimeout(aiDebounceRef.current);

    const hasData =
      icdSymptoms.length > 0 || icdConditions.length > 0 || icdAllergies.length > 0 ||
      profile.selectedSymptoms.length > 0 || profile.selectedConditions.length > 0;
    if (!hasData) { setAiAnalysis(null); return; }

    aiDebounceRef.current = setTimeout(() => {
      const payload = {
        age: profile.age,
        gender: profile.gender,
        isPregnant: profile.isPregnant,
        icdSymptoms,
        icdConditions,
        icdAllergies,
        chipSymptoms: profile.selectedSymptoms.map(id => SYMPTOMS.find(s => s.id === id)?.label ?? id),
        chipConditions: profile.selectedConditions.map(id => CONDITIONS.find(c => c.id === id)?.label ?? id),
        chipAllergies: profile.selectedAllergies.map(id => ALLERGIES.find(a => a.id === id)?.label ?? id),
        currentMedications: selectedDrugs.map(d => d.label),
        abnormalLabs,
      };
      fetchAiAnalysis(payload);
    }, 1500);

    return () => { if (aiDebounceRef.current) clearTimeout(aiDebounceRef.current); };
  }, [profile, icdSymptoms, icdConditions, icdAllergies, selectedDrugs, abnormalLabs, fetchAiAnalysis]);

  // Badge counts: chips + ICD items (including record-only ones for display)
  const totalSymptoms = effectiveProfile.selectedSymptoms.length + icdSymptoms.filter((i) => !i.internalId).length;
  const totalConditions = effectiveProfile.selectedConditions.length + icdConditions.filter((i) => !i.internalId).length;
  const totalAllergies = effectiveProfile.selectedAllergies.length + icdAllergies.filter((i) => !i.internalId).length;

  const result = useMemo(() => {
    if (effectiveProfile.selectedSymptoms.length === 0) return null;
    return runClinicalEngine(effectiveProfile);
  }, [effectiveProfile]);

  const recommended = result?.medicationResults.filter((r) => r.safetyLevel === "recommended") ?? [];
  const caution = result?.medicationResults.filter((r) => r.safetyLevel === "caution") ?? [];
  const avoid = result?.medicationResults.filter((r) => r.safetyLevel === "avoid") ?? [];

  const hasRedFlags = (result?.redFlags.length ?? 0) > 0;
  const totalInteractions = result?.medicationResults.reduce(
    (sum, r) => sum + r.activeInteractions.filter((ix) => ix.severity === "severe" || ix.severity === "moderate").length,
    0
  ) ?? 0;

  // Panel is visible when any clinical data is present — not just when engine matches
  const hasAnyData =
    result !== null ||
    icdSymptoms.length > 0 ||
    icdConditions.length > 0 ||
    profile.selectedConditions.length > 0 ||
    profile.selectedSymptoms.length > 0;

  // Auto-switch to AI tab when ICD codes are present but engine has no matching rules
  useEffect(() => {
    if (!result && (icdSymptoms.length > 0 || icdConditions.length > 0)) {
      setActiveTab("ai");
    }
  }, [result, icdSymptoms, icdConditions]);

  const reset = () => {
    setProfile(DEFAULT_PROFILE);
    setSelectedDrugs(DEFAULT_DRUGS);
    setIcdSymptoms([]);
    setIcdConditions([]);
    setIcdAllergies([]);
    setLabValues({});
    setLabPanelOpen(false);
    setActiveTab("recommended");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* ── Header ── */}
      <header className="bg-[#0B3D91] text-white shadow-md">
        <div className="max-w-screen-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
              <PillBottle className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-lg leading-tight">RxCopilot</div>
              <div className="text-xs text-blue-200">AI Pharmacist Copilot · UpToDate-backed clinical rules</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {result && (
              <div className="hidden sm:flex items-center gap-2 text-xs text-blue-200">
                <Stethoscope className="w-4 h-4" />
                {recommended.length} recommended · {caution.length} caution · {avoid.length} avoid
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={reset}
            >
              <RotateCcw className="w-4 h-4 mr-1" /> New Patient
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-screen-2xl mx-auto w-full px-4 py-4 flex gap-4 flex-1">
        {/* ══ LEFT PANEL — Patient Input ══ */}
        <div className="w-[380px] shrink-0 flex flex-col gap-3 overflow-y-auto max-h-[calc(100vh-80px)] pb-4 pr-1">
          {/* Basic info */}
          <Card className="border-slate-200">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <User className="w-4 h-4 text-[#0B3D91]" /> Patient Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-4">
              {/* Age */}
              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Age</span>
                  <span className="font-bold text-slate-800">{profile.age} years</span>
                </div>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={[profile.age]}
                  onValueChange={([v]) => setProfile((p) => ({ ...p, age: v }))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>0</span><span>25</span><span>50</span><span>75</span><span>100</span>
                </div>
              </div>

              {/* Gender */}
              <div>
                <div className="text-xs text-slate-500 mb-1">Gender</div>
                <div className="flex gap-2">
                  {(["male", "female", "other"] as const).map((g) => (
                    <button
                      key={g}
                      onClick={() => setProfile((p) => ({ ...p, gender: g, isPregnant: g !== "female" ? false : p.isPregnant }))}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-medium capitalize transition-all ${
                        profile.gender === g
                          ? "bg-[#0B3D91] text-white border-[#0B3D91]"
                          : "bg-white text-slate-600 border-slate-300 hover:border-slate-400"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pregnancy */}
              {profile.gender === "female" && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Baby className="w-4 h-4 text-pink-500" />
                    <span>Pregnant</span>
                  </div>
                  <button
                    onClick={() => setProfile((p) => ({ ...p, isPregnant: !p.isPregnant }))}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      profile.isPregnant ? "bg-pink-500" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        profile.isPregnant ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Symptoms */}
          <Card className="border-slate-200">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-bold text-slate-700 flex items-center gap-2 justify-between">
                <span className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#0B3D91]" /> Symptoms
                </span>
                {totalSymptoms > 0 && (
                  <Badge className="bg-blue-100 text-blue-700 text-xs">{totalSymptoms} selected</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-3">
              <IcdSearch
                mode="symptom"
                selectedItems={icdSymptoms}
                onItemsChange={handleIcdSymptoms}
              />
            </CardContent>
          </Card>

          {/* Known Conditions */}
          <Card className="border-slate-200">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-bold text-slate-700 flex items-center gap-2 justify-between">
                <span className="flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-[#0B3D91]" /> Known Conditions
                </span>
                {totalConditions > 0 && (
                  <Badge className="bg-purple-100 text-purple-700 text-xs">{totalConditions} selected</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-3">
              <IcdSearch
                mode="condition"
                selectedItems={icdConditions}
                onItemsChange={handleIcdConditions}
              />
            </CardContent>
          </Card>

          {/* Current Medications */}
          <Card className="border-slate-200">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-bold text-slate-700 flex items-center gap-2 justify-between">
                <span className="flex items-center gap-2">
                  <Pill className="w-4 h-4 text-[#0B3D91]" /> Current Medications
                </span>
                {selectedDrugs.length > 0 && (
                  <Badge className="bg-orange-100 text-orange-700 text-xs">{selectedDrugs.length} added</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <p className="text-xs text-slate-400 mb-3">
                Search any real drug name — powered by NLM RxNav.
              </p>
              <MedicationSearch
                selectedDrugs={selectedDrugs}
                onDrugsChange={handleDrugsChange}
              />
            </CardContent>
          </Card>

          {/* Allergies */}
          <Card className="border-slate-200">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-bold text-slate-700 flex items-center gap-2 justify-between">
                <span className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-[#0B3D91]" /> Known Allergies
                </span>
                {totalAllergies > 0 && (
                  <Badge className="bg-red-100 text-red-700 text-xs">{totalAllergies} selected</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-3">
              <IcdSearch
                mode="allergy"
                selectedItems={icdAllergies}
                onItemsChange={handleIcdAllergies}
              />
            </CardContent>
          </Card>

          {/* Lab Values */}
          <Card className="border-slate-200">
            <CardHeader className="pb-2 pt-3 px-4">
              <CardTitle className="text-sm font-bold text-slate-700">
                <button
                  className="flex items-center gap-2 w-full text-left"
                  onClick={() => setLabPanelOpen((o) => !o)}
                >
                  <FlaskConical className="w-4 h-4 text-[#0B3D91]" />
                  <span>Lab Values</span>
                  <div className="flex items-center gap-2 ml-auto">
                    {abnormalLabs.length > 0 && (
                      <Badge className="bg-red-100 text-red-700 border-red-200 text-xs">
                        {abnormalLabs.length} abnormal
                      </Badge>
                    )}
                    {labPanelOpen
                      ? <ChevronUp className="w-4 h-4 text-slate-400" />
                      : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </button>
              </CardTitle>
            </CardHeader>

            {labPanelOpen && (
              <CardContent className="px-3 pb-4 space-y-2">
                <p className="text-xs text-slate-400 px-1">
                  Enter any lab result — values outside reference range are flagged red.
                </p>
                {LAB_CATEGORIES.map((cat) => (
                  <LabCategoryBlock
                    key={cat.id}
                    category={cat}
                    values={labValues}
                    gender={profile.gender}
                    onChange={(id, val) => setLabValues((prev) => ({ ...prev, [id]: val }))}
                  />
                ))}
              </CardContent>
            )}
          </Card>
        </div>

        {/* ══ RIGHT PANEL — Results ══ */}
        <div className="flex-1 min-w-0 overflow-y-auto max-h-[calc(100vh-80px)] pb-4">
          {!hasAnyData ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 py-24">
              <Activity className="w-16 h-16 mb-4 text-slate-300" />
              <div className="text-xl font-semibold text-slate-500 mb-2">Select symptoms to begin</div>
              <div className="text-sm max-w-sm">Search and select ICD-10 codes on the left to see AI-powered clinical analysis, OTC recommendations, and referral advice.</div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* ── ICD-only banner (no engine rules matched) ── */}
              {!result && hasAnyData && (
                <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 flex items-start gap-3">
                  <Brain className="w-5 h-5 text-violet-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-violet-800 text-sm mb-1">AI Analysis is your primary guide for these codes</div>
                    <div className="text-xs text-violet-700 leading-relaxed">
                      The OTC safety engine covers ~30 common symptom categories. These ICD codes fall outside that set — the <span className="font-semibold">🧠 AI Analysis tab</span> provides full UpToDate-level clinical coverage for any ICD-10-CM code.
                    </div>
                  </div>
                </div>
              )}

              {/* ── Red Flags ── */}
              {result && result.redFlags.length > 0 && (
                <div className="bg-red-600 text-white rounded-xl p-4 shadow-lg">
                  <div className="flex items-center gap-2 font-bold text-lg mb-3">
                    <AlertTriangle className="w-5 h-5" />
                    🚨 EMERGENCY / RED FLAG SYMPTOMS DETECTED
                  </div>
                  {result.redFlags.map((rf, i) => (
                    <div key={i} className="bg-red-700 rounded-lg p-3 mb-2">
                      <div className="font-semibold text-sm">{rf.symptom}</div>
                      <div className="text-xs text-red-100 mt-1">{rf.message}</div>
                    </div>
                  ))}
                  <div className="text-xs text-red-100 mt-2">⚠️ Do not recommend OTC medications for the red flag symptoms above without physician evaluation.</div>
                </div>
              )}

              {/* ── Referral Advice (urgent) ── */}
              {result && result.referralAdvice.filter(r => r.urgency === "emergency" || r.urgency === "urgent").length > 0 && (
                <div className="bg-amber-50 border border-amber-300 rounded-xl p-4">
                  <div className="flex items-center gap-2 font-bold text-amber-800 mb-2">
                    <AlertTriangle className="w-4 h-4" /> PHYSICIAN REFERRAL ADVISED
                  </div>
                  {result.referralAdvice
                    .filter(r => r.urgency === "urgent" || r.urgency === "emergency")
                    .map((r, i) => (
                      <div key={i} className="mb-2">
                        <div className="text-xs text-amber-800">{r.message}</div>
                        <div className="text-xs text-amber-600 italic mt-0.5">Reason: {r.reason}</div>
                      </div>
                    ))}
                </div>
              )}

              {/* ── Summary Bar (engine results only) ── */}
              {result && (
                <div className="grid grid-cols-4 gap-2">
                  <div className="bg-white rounded-lg border border-slate-200 p-3 text-center">
                    <div className="text-2xl font-bold text-emerald-600">{recommended.length}</div>
                    <div className="text-xs text-slate-500 mt-0.5">Recommended</div>
                  </div>
                  <div className="bg-white rounded-lg border border-slate-200 p-3 text-center">
                    <div className="text-2xl font-bold text-amber-600">{caution.length}</div>
                    <div className="text-xs text-slate-500 mt-0.5">Use w/ Caution</div>
                  </div>
                  <div className="bg-white rounded-lg border border-slate-200 p-3 text-center">
                    <div className="text-2xl font-bold text-red-600">{avoid.length}</div>
                    <div className="text-xs text-slate-500 mt-0.5">Avoid</div>
                  </div>
                  <div className="bg-white rounded-lg border border-slate-200 p-3 text-center">
                    <div className={`text-2xl font-bold ${totalInteractions > 0 ? "text-orange-600" : "text-slate-300"}`}>{totalInteractions}</div>
                    <div className="text-xs text-slate-500 mt-0.5">Interactions</div>
                  </div>
                </div>
              )}

              {/* ── Tabs ── */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full bg-white border border-slate-200 rounded-lg h-auto p-1 flex flex-wrap gap-1">
                  <TabsTrigger value="recommended" disabled={!result} className="flex-1 text-xs data-[state=active]:bg-emerald-600 data-[state=active]:text-white rounded disabled:opacity-40 disabled:cursor-not-allowed">
                    ✅ Recommended ({recommended.length})
                  </TabsTrigger>
                  <TabsTrigger value="caution" disabled={!result} className="flex-1 text-xs data-[state=active]:bg-amber-500 data-[state=active]:text-white rounded disabled:opacity-40 disabled:cursor-not-allowed">
                    ⚠️ Caution ({caution.length})
                  </TabsTrigger>
                  <TabsTrigger value="avoid" disabled={!result} className="flex-1 text-xs data-[state=active]:bg-red-600 data-[state=active]:text-white rounded disabled:opacity-40 disabled:cursor-not-allowed">
                    ❌ Avoid ({avoid.length})
                  </TabsTrigger>
                  <TabsTrigger value="conditions" disabled={!result} className="flex-1 text-xs data-[state=active]:bg-[#0B3D91] data-[state=active]:text-white rounded disabled:opacity-40 disabled:cursor-not-allowed">
                    🩺 Conditions ({result?.possibleConditions.length ?? 0})
                  </TabsTrigger>
                  <TabsTrigger value="counseling" disabled={!result} className="flex-1 text-xs data-[state=active]:bg-slate-700 data-[state=active]:text-white rounded disabled:opacity-40 disabled:cursor-not-allowed">
                    💬 Counseling
                  </TabsTrigger>
                  <TabsTrigger value="ai" className="flex-1 text-xs data-[state=active]:bg-violet-600 data-[state=active]:text-white rounded flex items-center gap-1">
                    <Brain className="w-3 h-3" />
                    AI Analysis {aiLoading && <Loader2 className="w-3 h-3 animate-spin" />}
                  </TabsTrigger>
                </TabsList>

                {/* Recommended */}
                <TabsContent value="recommended" className="mt-3">
                  {recommended.length === 0 ? (
                    <div className="text-center text-slate-400 py-12">
                      <CheckCircle className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                      <div className="text-sm">No fully safe OTC medications found for the selected profile.</div>
                      <div className="text-xs mt-1">Check the "Caution" tab for options requiring monitoring, or refer to a physician.</div>
                    </div>
                  ) : (
                    recommended.map((r) => <MedicationCard key={r.medication.id} result={r} />)
                  )}
                </TabsContent>

                {/* Caution */}
                <TabsContent value="caution" className="mt-3">
                  {caution.length === 0 ? (
                    <div className="text-center text-slate-400 py-12 text-sm">No caution medications for this profile.</div>
                  ) : (
                    <>
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3 text-xs text-amber-800">
                        <AlertTriangle className="w-3 h-3 inline mr-1" />
                        These medications can be used but require monitoring, dose adjustment, or specific counseling due to the patient's profile.
                      </div>
                      {caution.map((r) => <MedicationCard key={r.medication.id} result={r} />)}
                    </>
                  )}
                </TabsContent>

                {/* Avoid */}
                <TabsContent value="avoid" className="mt-3">
                  {avoid.length === 0 ? (
                    <div className="text-center text-slate-400 py-12 text-sm">No medications to avoid for this profile.</div>
                  ) : (
                    <>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3 text-xs text-red-800">
                        <XCircle className="w-3 h-3 inline mr-1" />
                        These medications are contraindicated for this patient profile. Reasons are shown in each card.
                      </div>
                      {avoid.map((r) => <MedicationCard key={r.medication.id} result={r} />)}
                    </>
                  )}
                </TabsContent>

                {/* Possible Conditions */}
                <TabsContent value="conditions" className="mt-3">
                  {!result || result.possibleConditions.length === 0 ? (
                    <div className="text-center text-slate-400 py-12 text-sm">Select more symptoms to identify possible conditions.</div>
                  ) : (
                    <div className="space-y-3">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
                        <Info className="w-3 h-3 inline mr-1" />
                        These are possible clinical conditions based on the selected symptoms. This is not a diagnosis. Always consider clinical examination and investigations.
                      </div>
                      {result.possibleConditions.map((cond, i) => (
                        <div key={i} className="bg-white border border-slate-200 rounded-lg p-4">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="font-semibold text-slate-800 text-sm">{cond.name}</div>
                            <div className="flex items-center gap-1 shrink-0">
                              <Badge className={cond.likelihood === "common" ? "bg-emerald-100 text-emerald-700 text-xs" : "bg-slate-100 text-slate-600 text-xs"}>
                                {cond.likelihood === "common" ? "Common" : "Possible"}
                              </Badge>
                              <Badge className={cond.otcManageable ? "bg-blue-100 text-blue-700 text-xs" : "bg-orange-100 text-orange-700 text-xs"}>
                                {cond.otcManageable ? "OTC manageable" : "Rx/Referral needed"}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-xs text-slate-600">{cond.description}</div>
                          {cond.referralNote && (
                            <div className="mt-2 text-xs text-amber-700 bg-amber-50 px-2 py-1.5 rounded border border-amber-200">
                              <AlertTriangle className="w-3 h-3 inline mr-1" />
                              {cond.referralNote}
                            </div>
                          )}
                          <div className="mt-2 flex flex-wrap gap-1">
                            {cond.triggerSymptoms.map((s) => {
                              const sym = SYMPTOMS.find((x) => x.id === s);
                              return sym ? (
                                <span
                                  key={s}
                                  className={`text-xs px-2 py-0.5 rounded-full ${
                                    result.medicationResults.length > 0 && profile.selectedSymptoms.includes(s)
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-slate-100 text-slate-500"
                                  }`}
                                >
                                  {sym.label}
                                </span>
                              ) : null;
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Counseling */}
                <TabsContent value="counseling" className="mt-3">
                  <div className="space-y-3">
                    {/* General counseling */}
                    {result && result.generalCounseling.length > 0 && (
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <div className="font-bold text-sm text-blue-800 mb-3 flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" /> General Clinical Counseling Points
                        </div>
                        {result.generalCounseling.map((pt, i) => (
                          <div key={i} className="flex gap-2 text-sm text-blue-900 mb-2">
                            <span className="text-blue-400 mt-0.5">•</span>
                            <span>{pt}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Per-medication counseling for recommended only */}
                    {recommended.length > 0 && (
                      <div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Medication-Specific Counseling</div>
                        {recommended.map((r) => (
                          <div key={r.medication.id} className="bg-white border border-slate-200 rounded-lg p-4 mb-3">
                            <div className="font-semibold text-sm text-slate-800 mb-2 flex items-center gap-2">
                              <Pill className="w-4 h-4 text-emerald-600" />
                              {r.medication.name}
                            </div>
                            <div className="mb-3">
                              <div className="text-xs font-medium text-slate-500 mb-1">Key counseling points:</div>
                              {r.medication.counselingPoints.map((pt, i) => (
                                <div key={i} className="text-xs text-slate-700 mb-1">• {pt}</div>
                              ))}
                            </div>
                            <div className="bg-emerald-50 border border-emerald-200 rounded p-2">
                              <div className="text-xs font-medium text-emerald-700 mb-1">Patient-friendly explanation:</div>
                              <div className="text-xs text-slate-700 italic">"{r.medication.patientExplanation}"</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Routine referral advice */}
                    {result && result.referralAdvice.filter(r => r.urgency === "routine").length > 0 && (
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                        <div className="font-bold text-sm text-slate-700 mb-2 flex items-center gap-2">
                          <Info className="w-4 h-4" /> Routine Follow-up Notes
                        </div>
                        {result.referralAdvice
                          .filter(r => r.urgency === "routine")
                          .map((r, i) => (
                            <div key={i} className="text-xs text-slate-600 mb-1">• {r.message}</div>
                          ))}
                      </div>
                    )}

                    {(!result || result.generalCounseling.length === 0) && recommended.length === 0 && (
                      <div className="text-center text-slate-400 py-12 text-sm">
                        <MessageSquare className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                        Select symptoms to see counseling guidance.
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* AI Analysis */}
                <TabsContent value="ai" className="mt-3">
                  {aiLoading && !aiAnalysis ? (
                    <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                      <Loader2 className="w-10 h-10 animate-spin mb-3 text-violet-400" />
                      <div className="text-sm font-medium text-slate-600">Analysing patient profile…</div>
                      <div className="text-xs mt-1">GPT-4o · UpToDate-level clinical reasoning</div>
                    </div>
                  ) : aiError ? (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      {aiError}
                      <button onClick={() => fetchAiAnalysis({})} className="ml-auto text-xs underline">Retry</button>
                    </div>
                  ) : !aiAnalysis ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400">
                      <Brain className="w-12 h-12 mb-3 text-slate-300" />
                      <div className="text-sm font-medium text-slate-500">Select any symptom or condition to activate AI Analysis</div>
                      <div className="text-xs mt-1 max-w-sm">AI provides UpToDate-level clinical reasoning for every ICD-10-CM code, including conditions outside our rule set.</div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Loading indicator overlay when refreshing */}
                      {aiLoading && (
                        <div className="flex items-center gap-2 text-xs text-violet-600 bg-violet-50 border border-violet-200 rounded-lg px-3 py-2">
                          <Loader2 className="w-3 h-3 animate-spin" /> Updating analysis…
                        </div>
                      )}

                      {/* Source badge */}
                      <div className="flex items-center gap-2 text-xs text-slate-500 bg-violet-50 border border-violet-200 rounded-lg px-3 py-2">
                        <Brain className="w-3 h-3 text-violet-600" />
                        <span className="font-medium text-violet-700">GPT-4o Clinical Pharmacist Analysis</span>
                        <span className="text-slate-400">· UpToDate · BNF · WHO · NICE · Cochrane · MIMS · Lexicomp · Micromedex · Beers Criteria · STOPP/START</span>
                      </div>

                      {/* Condition Overview */}
                      {aiAnalysis.conditionOverview?.length > 0 && (
                        <div className="bg-white border border-slate-200 rounded-xl p-4">
                          <div className="font-bold text-sm text-slate-700 mb-3 flex items-center gap-2">
                            <Stethoscope className="w-4 h-4 text-violet-600" /> Condition / Symptom Overview
                          </div>
                          <div className="space-y-3">
                            {aiAnalysis.conditionOverview.map((item, i) => (
                              <div key={i} className="border-l-2 border-violet-300 pl-3">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold text-sm text-slate-800">{item.label}</span>
                                  {item.code && (
                                    <span className="text-xs font-mono bg-violet-100 text-violet-700 px-1.5 py-0.5 rounded">{item.code}</span>
                                  )}
                                </div>
                                <div className="text-xs text-slate-600 mb-1">{item.meaning}</div>
                                <div className="text-xs text-violet-700 bg-violet-50 px-2 py-1 rounded">
                                  <span className="font-medium">Pharmacy note: </span>{item.pharmacyNote}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* OTC Options */}
                      {aiAnalysis.otcOptions?.length > 0 && (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                          <div className="font-bold text-sm text-emerald-800 mb-2 flex items-center gap-2">
                            <Pill className="w-4 h-4" /> OTC Management Options
                          </div>
                          {aiAnalysis.otcOptions.map((opt, i) => (
                            <div key={i} className="flex gap-2 text-xs text-emerald-900 mb-2">
                              <span className="text-emerald-500 mt-0.5 shrink-0">✓</span>
                              <span>{opt}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Prescription Needs */}
                      {aiAnalysis.prescriptionNeeds?.length > 0 && (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                          <div className="font-bold text-sm text-amber-800 mb-2 flex items-center gap-2">
                            <BookOpen className="w-4 h-4" /> Prescription / Physician Required
                          </div>
                          {aiAnalysis.prescriptionNeeds.map((need, i) => (
                            <div key={i} className="flex gap-2 text-xs text-amber-900 mb-2">
                              <span className="text-amber-500 mt-0.5 shrink-0">→</span>
                              <span>{need}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Red Flags */}
                      {aiAnalysis.redFlags?.length > 0 && (
                        <div className="bg-red-50 border border-red-300 rounded-xl p-4">
                          <div className="font-bold text-sm text-red-800 mb-2 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" /> Red Flags — Refer Immediately
                          </div>
                          {aiAnalysis.redFlags.map((flag, i) => (
                            <div key={i} className="flex gap-2 text-xs text-red-900 mb-2">
                              <span className="text-red-500 mt-0.5 shrink-0">🚨</span>
                              <span>{flag}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Drug Safety */}
                      {aiAnalysis.drugSafety?.length > 0 && (
                        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                          <div className="font-bold text-sm text-orange-800 mb-2 flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4" /> Drug Safety Notes
                          </div>
                          {aiAnalysis.drugSafety.map((note, i) => (
                            <div key={i} className="flex gap-2 text-xs text-orange-900 mb-2">
                              <span className="text-orange-500 mt-0.5 shrink-0">⚠</span>
                              <span>{note}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Counseling Points */}
                      {aiAnalysis.counselingPoints?.length > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                          <div className="font-bold text-sm text-blue-800 mb-2 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" /> Patient Counseling Points
                          </div>
                          {aiAnalysis.counselingPoints.map((pt, i) => (
                            <div key={i} className="flex gap-2 text-xs text-blue-900 mb-2">
                              <span className="text-blue-500 mt-0.5 shrink-0">•</span>
                              <span>{pt}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="text-xs text-slate-400 text-center pb-1">
                        AI analysis is for pharmacist decision support only. Does not replace clinical judgment or physical examination.
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              {/* Footer note */}
              <div className="bg-slate-100 border border-slate-200 rounded-lg p-3 text-xs text-slate-500 flex items-start gap-2">
                <BookOpen className="w-3 h-3 mt-0.5 shrink-0" />
                <span>Clinical rules based on UpToDate, BNF, WHO guidelines, NICE guidelines, and AGS Beers Criteria 2023. This tool supports pharmacist decision-making and does not replace clinical judgment.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
