import { useState, useMemo, useEffect } from "react";
import { Link } from "wouter";
import {
  AlertTriangle, CheckCircle, XCircle, Info, ChevronDown, ChevronUp,
  Pill, User, Baby, Clock, Activity, ShieldAlert, BookOpen, MessageSquare,
  Stethoscope, RotateCcw, PillBottle, RefreshCw, FlaskConical, HeartPulse,
  Calculator
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { SYMPTOMS, CONDITIONS, ALLERGIES, CURRENT_MEDICATIONS } from "@/lib/clinical-data";
import { runClinicalEngine, calcBMI, bmiCategory, type PatientProfile, type MedicationResult } from "@/lib/clinical-engine";
import MedicationSearch, { type SelectedDrug } from "@/components/medication-search";
import IcdSearch, { type SelectedIcdItem } from "@/components/icd-search";
import { LAB_CATEGORIES, getLabStatus, getRefRangeText, type LabDef } from "@/lib/lab-data";
import { getTherapyFor, type ConditionTherapy } from "@/lib/who-eml-therapy";

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
function MedicationCard({
  result,
  patientAge,
  patientWeight,
}: {
  result: MedicationResult;
  patientAge: number;
  patientWeight?: number;
}) {
  const [expanded, setExpanded] = useState(result.safetyLevel === "recommended");
  const { medication: med, safetyLevel, avoidReasons, cautionReasons, activeInteractions } = result;

  // Dose recommendation tailored to this specific patient (age / weight / BMI / gender)
  const pd = result.personalizedDose;

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
        <div className="flex items-center gap-3 flex-1">
          <Pill className="w-4 h-4 text-slate-400 shrink-0" />
          <div className="flex-1">
            <div className="flex items-start gap-1.5 flex-wrap">
              <span className="font-semibold text-slate-900 text-sm leading-snug">{med.name}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded font-semibold shrink-0 mt-0.5 ${
                !med.rxType || med.rxType === "OTC"
                  ? "bg-emerald-100 text-emerald-700"
                  : med.rxType === "Prescription"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-purple-100 text-purple-700"
              }`}>
                {!med.rxType || med.rxType === "OTC" ? "OTC" : med.rxType === "Prescription" ? "Rx" : "OTC / Rx"}
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">{med.brandExamples}</div>
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

            {/* ── PRESCRIPTION REQUIRED BANNER ── */}
            {med.rxType === "Prescription" && (
              <div className="bg-blue-50 border border-blue-300 rounded-lg px-3 py-2.5 flex items-start gap-2">
                <svg className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div>
                  <p className="text-xs font-bold text-blue-800 uppercase tracking-wide">Physician Prescription Required</p>
                  <p className="text-xs text-blue-700 mt-0.5">This is a prescription-only medication. A valid prescription from a licensed physician is required before dispensing. Verify prescription before supply.</p>
                </div>
              </div>
            )}

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
                {/* ── PERSONALISED DOSE (this patient) ── */}
                <div className="mb-3 bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                  <div className="text-xs font-bold text-indigo-700 mb-1.5 flex items-center gap-1">
                    <User className="w-3 h-3" /> RECOMMENDED FOR THIS PATIENT
                  </div>
                  <div className="text-xs text-indigo-500 font-medium mb-1">{pd.bandLabel}</div>
                  {pd.weightBasedDose ? (
                    <div className="flex gap-2 items-baseline">
                      <span className="text-indigo-800 font-bold text-sm">{pd.weightBasedDose}</span>
                      <span className="text-indigo-400 text-[11px]">(weight-based)</span>
                    </div>
                  ) : (
                    <div className="text-indigo-800 font-bold text-sm">{pd.bandDose}</div>
                  )}
                  {pd.maxDailyForPatient && (
                    <div className="text-xs text-indigo-600 mt-1">Max/day for patient: <span className="font-semibold">{pd.maxDailyForPatient}</span></div>
                  )}
                  {pd.adjustments.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {pd.adjustments.map((a, i) => (
                        <div key={i} className="text-[11px] text-indigo-700 leading-relaxed flex gap-1">
                          <span className="shrink-0">↳</span><span>{a}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Reference ranges</div>
                <div className="space-y-2 text-xs">
                  <div className="flex gap-2">
                    <span className="text-slate-500 font-medium shrink-0 w-24">Adult dose:</span>
                    <span className="text-slate-800">{med.dosage.adult}</span>
                  </div>
                  {med.dosage.pediatric && (
                    <div className="flex gap-2">
                      <span className="text-slate-500 font-medium shrink-0 w-24">Paediatric:</span>
                      <span className="text-slate-800">{med.dosage.pediatric}</span>
                    </div>
                  )}
                  {med.dosage.elderly && (
                    <div className="flex gap-2">
                      <span className="text-slate-500 font-medium shrink-0 w-24">Elderly:</span>
                      <span className="text-slate-800">{med.dosage.elderly}</span>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <span className="text-slate-500 font-medium shrink-0 w-24">Max daily:</span>
                    <span className="text-slate-800">{med.dosage.maxDaily}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-slate-500 font-medium shrink-0 w-24">Duration:</span>
                    <span className="text-slate-800">{med.dosage.duration}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-slate-500 font-medium shrink-0 w-24">With food:</span>
                    <span className="text-slate-800">{med.dosage.withFood ? "Yes – take with food" : "Not required"}</span>
                  </div>
                </div>
                {med.dosage.notes && (
                  <div className="mt-2 text-xs text-amber-700 bg-amber-50 px-2 py-1.5 rounded border border-amber-200 leading-relaxed">
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
                          : status === "high"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {isCritical ? "‼" : status === "high" ? "H" : "L"}
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
  isBreastfeeding: false,
  selectedSymptoms: [],
  selectedConditions: [],
  selectedMedications: [],
  selectedAllergies: [],
  weight: undefined,
  height: undefined,
};
const DEFAULT_DRUGS: SelectedDrug[] = [];

// ─── Lifestyle & Social ───
interface Lifestyle {
  smoking: "never" | "former" | "light" | "heavy";
  alcohol: "none" | "occasional" | "moderate" | "heavy";
  recreationalDrugs: boolean;
  caffeineHigh: boolean;
  diet: "balanced" | "vegan" | "vegetarian" | "lowSodium" | "highSalt" | "highFat";
  exercise: "sedentary" | "moderate" | "active";
  occupationRisk: boolean;    // drives / operates machinery
  poorSleep: boolean;
  grapefruitJuice: boolean;
}
const DEFAULT_LIFESTYLE: Lifestyle = {
  smoking: "never",
  alcohol: "none",
  recreationalDrugs: false,
  caffeineHigh: false,
  diet: "balanced",
  exercise: "moderate",
  occupationRisk: false,
  poorSleep: false,
  grapefruitJuice: false,
};

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
  const [lifestyle, setLifestyle] = useState<Lifestyle>(DEFAULT_LIFESTYLE);
  const [lifestylePanelOpen, setLifestylePanelOpen] = useState(false);

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

  // Compute abnormal lab values
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

  // Lifestyle-derived counseling notes
  const lifestyleNotes = useMemo<string[]>(() => {
    const notes: string[] = [];
    const meds = new Set(profile.selectedMedications);
    const conds = new Set(effectiveProfile.selectedConditions);

    // Smoking
    if (lifestyle.smoking === "light" || lifestyle.smoking === "heavy") {
      notes.push(
        `Smoker (${lifestyle.smoking}): induces CYP1A2 — reduces levels of theophylline, clozapine, olanzapine, caffeine. Increases CV risk with NSAIDs and combined hormonal contraceptives (avoid COC if ≥35 y).`
      );
      if (meds.has("warfarin")) notes.push("Smoking alters warfarin metabolism — monitor INR closely, especially after cessation.");
    }
    if (lifestyle.smoking === "former") {
      notes.push("Former smoker: re-check doses of CYP1A2 substrates (theophylline, clozapine) — levels rise after quitting.");
    }

    // Alcohol
    if (lifestyle.alcohol === "moderate" || lifestyle.alcohol === "heavy") {
      notes.push(
        `Alcohol use (${lifestyle.alcohol}): avoid combining with paracetamol >2 g/day (hepatotoxicity), NSAIDs (GI bleeding), metronidazole/tinidazole (disulfiram reaction), sedatives, tramadol, opioids and benzodiazepines.`
      );
      if (lifestyle.alcohol === "heavy") {
        notes.push("Heavy alcohol use: cap paracetamol at 2 g/day; screen for liver disease; increased bleeding risk with anticoagulants.");
      }
    }

    // Recreational drugs
    if (lifestyle.recreationalDrugs) {
      notes.push("Recreational drug use disclosed: screen for interactions (opioids, MDMA, cocaine, cannabis) — avoid additional CNS depressants and serotonergic agents (tramadol, SSRIs).");
    }

    // Caffeine
    if (lifestyle.caffeineHigh) {
      notes.push("High caffeine intake: additive stimulant effect with pseudoephedrine, salbutamol, decongestants — may worsen tremor, palpitations, insomnia.");
    }

    // Diet
    if (lifestyle.diet === "vegan" || lifestyle.diet === "vegetarian") {
      notes.push(`${lifestyle.diet === "vegan" ? "Vegan" : "Vegetarian"} diet: check B12, iron, vitamin D status; some formulations contain gelatin/lactose — offer vegetarian-friendly alternatives.`);
    }
    if (lifestyle.diet === "highSalt" && (conds.has("hypertension") || conds.has("heart_disease") || conds.has("kidney_disease"))) {
      notes.push("High-salt diet with cardiovascular/renal condition: counsel sodium restriction (<2 g/day) — improves BP and diuretic efficacy.");
    }
    if (lifestyle.diet === "lowSodium" && meds.has("lithium")) {
      notes.push("Low-sodium diet + lithium: risk of lithium toxicity — monitor levels.");
    }
    if (lifestyle.diet === "highFat") {
      notes.push("High-fat diet: affects absorption of some drugs (e.g. griseofulvin ↑, atorvastatin unchanged, alendronate ↓). Advise standardised intake around dosing.");
    }

    // Exercise
    if (lifestyle.exercise === "sedentary") {
      notes.push("Sedentary lifestyle: higher VTE, cardiometabolic and constipation risk — counsel activity; review need for prophylaxis if immobile.");
    }
    if (lifestyle.exercise === "active" && (meds.has("warfarin") || meds.has("dabigatran_rivaroxaban"))) {
      notes.push("Active/contact-sport patient on anticoagulant: counsel bleeding/injury risk and protective measures.");
    }

    // Occupation risk
    if (lifestyle.occupationRisk) {
      notes.push("Drives / operates machinery: avoid sedating antihistamines (diphenhydramine, chlorpheniramine), opioids, tramadol, pregabalin, thiocolchicoside during work hours — impaired reaction time.");
    }

    // Sleep
    if (lifestyle.poorSleep) {
      notes.push("Poor sleep: avoid evening pseudoephedrine, caffeine-containing analgesics, and stimulating decongestants. Consider sleep hygiene counselling before hypnotics.");
    }

    // Grapefruit juice
    if (lifestyle.grapefruitJuice) {
      notes.push("Regular grapefruit juice: inhibits CYP3A4 — raises levels of statins (simvastatin, atorvastatin), calcium-channel blockers, some benzodiazepines, ciclosporin. Advise avoidance or drug switch.");
    }

    return notes;
  }, [lifestyle, profile.selectedMedications, effectiveProfile.selectedConditions]);

  const lifestyleActiveCount =
    (lifestyle.smoking !== "never" ? 1 : 0) +
    (lifestyle.alcohol !== "none" ? 1 : 0) +
    (lifestyle.recreationalDrugs ? 1 : 0) +
    (lifestyle.caffeineHigh ? 1 : 0) +
    (lifestyle.diet !== "balanced" ? 1 : 0) +
    (lifestyle.exercise !== "moderate" ? 1 : 0) +
    (lifestyle.occupationRisk ? 1 : 0) +
    (lifestyle.poorSleep ? 1 : 0) +
    (lifestyle.grapefruitJuice ? 1 : 0);


  // Badge counts: chips + ICD items (including record-only ones for display)
  const totalSymptoms = effectiveProfile.selectedSymptoms.length + icdSymptoms.filter((i) => !i.internalId).length;
  const totalConditions = effectiveProfile.selectedConditions.length + icdConditions.filter((i) => !i.internalId).length;
  const totalAllergies = effectiveProfile.selectedAllergies.length + icdAllergies.filter((i) => !i.internalId).length;

  const result = useMemo(() => {
    if (effectiveProfile.selectedSymptoms.length === 0 && effectiveProfile.selectedConditions.length === 0) return null;
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

  // WHO EML therapies driven by the union of chip-selected + ICD-mapped condition IDs
  const whoTherapies = useMemo<Array<{ id: string; therapy: ConditionTherapy; fallback?: boolean; codes?: string[] }>>(() => {
    const ids = new Set<string>([
      ...effectiveProfile.selectedConditions,
      ...icdConditions.map((i) => i.internalId).filter((x): x is string => !!x),
    ]);
    const out: Array<{ id: string; therapy: ConditionTherapy; fallback?: boolean; codes?: string[] }> = [];
    ids.forEach((id) => {
      const t = getTherapyFor(id);
      if (t) out.push({ id, therapy: t });
    });
    // Chapter-level fallback so unmapped ICD codes still get actionable guidance
    const grouped = new Map<string, { therapy: ConditionTherapy; codes: string[] }>();
    [...icdConditions, ...icdSymptoms]
      .filter((i) => !i.internalId)
      .forEach((i) => {
        const t = getFallbackTherapyForIcd(i.code);
        if (!t) return;
        const g = grouped.get(t.label);
        if (g) g.codes.push(i.code);
        else grouped.set(t.label, { therapy: t, codes: [i.code] });
      });
    grouped.forEach(({ therapy, codes }, label) => out.push({ id: `fallback-${label}`, therapy, fallback: true, codes }));
    return out;
  }, [effectiveProfile.selectedConditions, icdConditions, icdSymptoms]);


  // Panel is visible when any clinical data is present — not just when engine matches
  const hasAnyData =
    result !== null ||
    whoTherapies.length > 0 ||
    icdSymptoms.length > 0 ||
    icdConditions.length > 0 ||
    profile.selectedConditions.length > 0 ||
    profile.selectedSymptoms.length > 0;


  const reset = () => {
    setProfile(DEFAULT_PROFILE);
    setSelectedDrugs(DEFAULT_DRUGS);
    setIcdSymptoms([]);
    setIcdConditions([]);
    setIcdAllergies([]);
    setLabValues({});
    setLabPanelOpen(false);
    setLifestyle(DEFAULT_LIFESTYLE);
    setLifestylePanelOpen(false);
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
              <div className="font-bold text-lg leading-tight">PharmacyPal</div>
              <div className="text-xs text-blue-200">Evidence-based clinical rules · UpToDate · BNF · WHO · NICE</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {result && (
              <div className="hidden sm:flex items-center gap-2 text-xs text-blue-200 mr-1">
                <Stethoscope className="w-4 h-4" />
                {recommended.length} recommended · {caution.length} caution · {avoid.length} avoid
              </div>
            )}
            <Link href="/calculators">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <Calculator className="w-4 h-4 mr-1" /> Calculators
              </Button>
            </Link>
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

              {/* Weight & Height → BMI */}
              <div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-xs text-slate-500 block mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      min={1}
                      max={300}
                      placeholder="e.g. 70"
                      value={profile.weight ?? ""}
                      onChange={(e) => {
                        const v = e.target.value === "" ? undefined : parseFloat(e.target.value);
                        setProfile((p) => ({ ...p, weight: v }));
                      }}
                      className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#0B3D91] focus:ring-1 focus:ring-[#0B3D91]/30"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-slate-500 block mb-1">Height (cm)</label>
                    <input
                      type="number"
                      min={30}
                      max={250}
                      placeholder="e.g. 170"
                      value={profile.height ?? ""}
                      onChange={(e) => {
                        const v = e.target.value === "" ? undefined : parseFloat(e.target.value);
                        setProfile((p) => ({ ...p, height: v }));
                      }}
                      className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#0B3D91] focus:ring-1 focus:ring-[#0B3D91]/30"
                    />
                  </div>
                </div>

                {/* BMI display */}
                {profile.weight && profile.height && (() => {
                  const bmi = calcBMI(profile.weight, profile.height);
                  const cat = bmiCategory(bmi);
                  const bmiColor =
                    bmi < 18.5 ? "bg-blue-50 border-blue-200" :
                    bmi < 25   ? "bg-emerald-50 border-emerald-200" :
                    bmi < 30   ? "bg-amber-50 border-amber-200" :
                    bmi < 35   ? "bg-orange-50 border-orange-200" :
                                 "bg-red-50 border-red-200";
                  return (
                    <div className={`mt-2 flex items-center justify-between rounded-lg border px-3 py-2 ${bmiColor}`}>
                      <div className="text-xs text-slate-500">
                        BMI
                        <span className={`ml-1 font-bold text-sm ${cat.color}`}>{bmi.toFixed(1)}</span>
                      </div>
                      <div className={`text-xs font-semibold ${cat.color}`}>{cat.label}</div>
                    </div>
                  );
                })()}
              </div>

              {/* Gender */}
              <div>
                <div className="text-xs text-slate-500 mb-1">Gender</div>
                <div className="flex gap-2">
                  {(["male", "female", "other"] as const).map((g) => (
                    <button
                      key={g}
                      onClick={() => setProfile((p) => ({ ...p, gender: g, isPregnant: g !== "female" ? false : p.isPregnant, isBreastfeeding: g !== "female" ? false : p.isBreastfeeding }))}
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

              {/* Pregnancy + Breastfeeding */}
              {profile.gender === "female" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Baby className="w-4 h-4 text-pink-500" />
                      <span>Pregnant</span>
                    </div>
                    <button
                      onClick={() => setProfile((p) => ({ ...p, isPregnant: !p.isPregnant, isBreastfeeding: !p.isPregnant ? false : p.isBreastfeeding }))}
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
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Baby className="w-4 h-4 text-teal-500" />
                      <span>Breastfeeding</span>
                    </div>
                    <button
                      onClick={() => setProfile((p) => ({ ...p, isBreastfeeding: !p.isBreastfeeding, isPregnant: !p.isBreastfeeding ? false : p.isPregnant }))}
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        profile.isBreastfeeding ? "bg-teal-500" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                          profile.isBreastfeeding ? "translate-x-5" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>
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

          {/* Lifestyle & Social */}
          <Card className="border-slate-200">
            <CardHeader className="pb-2 pt-3 px-4">
              <CardTitle className="text-sm font-bold text-slate-700">
                <button
                  className="flex items-center gap-2 w-full text-left"
                  onClick={() => setLifestylePanelOpen((o) => !o)}
                >
                  <HeartPulse className="w-4 h-4 text-[#0B3D91]" />
                  <span>Lifestyle & Social</span>
                  <div className="flex items-center gap-2 ml-auto">
                    {lifestyleActiveCount > 0 && (
                      <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
                        {lifestyleActiveCount} noted
                      </Badge>
                    )}
                    {lifestylePanelOpen
                      ? <ChevronUp className="w-4 h-4 text-slate-400" />
                      : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </button>
              </CardTitle>
            </CardHeader>
            {lifestylePanelOpen && (
              <CardContent className="px-4 pb-4 space-y-3">
                <p className="text-xs text-slate-400">
                  Social & lifestyle factors that influence medication choice, dose and counseling.
                </p>

                {/* Smoking */}
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Smoking</label>
                  <div className="flex flex-wrap gap-1">
                    {(["never", "former", "light", "heavy"] as const).map((v) => (
                      <button
                        key={v}
                        onClick={() => setLifestyle((p) => ({ ...p, smoking: v }))}
                        className={`px-2.5 py-1 rounded-full text-xs border capitalize ${
                          lifestyle.smoking === v
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {v === "light" ? "≤10/day" : v === "heavy" ? ">10/day" : v}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Alcohol */}
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Alcohol</label>
                  <div className="flex flex-wrap gap-1">
                    {(["none", "occasional", "moderate", "heavy"] as const).map((v) => (
                      <button
                        key={v}
                        onClick={() => setLifestyle((p) => ({ ...p, alcohol: v }))}
                        className={`px-2.5 py-1 rounded-full text-xs border capitalize ${
                          lifestyle.alcohol === v
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Diet */}
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Diet</label>
                  <div className="flex flex-wrap gap-1">
                    {(["balanced", "vegan", "vegetarian", "lowSodium", "highSalt", "highFat"] as const).map((v) => (
                      <button
                        key={v}
                        onClick={() => setLifestyle((p) => ({ ...p, diet: v }))}
                        className={`px-2.5 py-1 rounded-full text-xs border ${
                          lifestyle.diet === v
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {v === "lowSodium" ? "Low sodium" : v === "highSalt" ? "High salt" : v === "highFat" ? "High fat" : v[0].toUpperCase() + v.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Exercise */}
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Physical activity</label>
                  <div className="flex flex-wrap gap-1">
                    {(["sedentary", "moderate", "active"] as const).map((v) => (
                      <button
                        key={v}
                        onClick={() => setLifestyle((p) => ({ ...p, exercise: v }))}
                        className={`px-2.5 py-1 rounded-full text-xs border capitalize ${
                          lifestyle.exercise === v
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Toggles */}
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Other factors</label>
                  <div className="flex flex-wrap gap-1">
                    {([
                      ["recreationalDrugs", "Recreational drugs"],
                      ["caffeineHigh", "High caffeine"],
                      ["occupationRisk", "Drives / machinery"],
                      ["poorSleep", "Poor sleep"],
                      ["grapefruitJuice", "Grapefruit juice"],
                    ] as const).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => setLifestyle((p) => ({ ...p, [key]: !p[key] }))}
                        className={`px-2.5 py-1 rounded-full text-xs border ${
                          lifestyle[key]
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {lifestyleNotes.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 mt-2">
                    <div className="text-xs font-semibold text-amber-800 mb-1 flex items-center gap-1">
                      <Info className="w-3 h-3" /> {lifestyleNotes.length} lifestyle-based note{lifestyleNotes.length > 1 ? "s" : ""} — see Counseling tab
                    </div>
                  </div>
                )}
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
              <div className="text-sm max-w-sm">Search and select symptoms, conditions, or ICD-10 codes on the left to see drug safety screening, medication recommendations, and referral guidance.</div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* ── WHO EML guideline-based therapy card(s) ── */}
              {whoTherapies.length > 0 && (
                <div className="space-y-3">
                  {whoTherapies.map(({ id, therapy }) => (
                    <div key={id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <div className="text-sm font-bold text-slate-800">{therapy.label}</div>
                          <div className="text-[11px] text-slate-500">{therapy.source}</div>
                        </div>
                        <span className="text-[10px] font-semibold uppercase tracking-wide bg-indigo-100 text-indigo-700 rounded px-2 py-0.5 shrink-0">WHO EML</span>
                      </div>
                      <div className="space-y-2 mt-3">
                        {therapy.options.map((opt, i) => (
                          <div key={i} className="border border-slate-100 rounded-lg p-2.5 bg-slate-50/50">
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <div className="text-sm font-semibold text-slate-800">{opt.drug}</div>
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                opt.rx === "OTC" ? "bg-green-100 text-green-700"
                                : opt.rx === "Rx" ? "bg-blue-100 text-blue-700"
                                : "bg-purple-100 text-purple-700"
                              }`}>{opt.rx}</span>
                            </div>
                            <div className="text-[11px] text-slate-500 italic">{opt.drugClass}</div>
                            <div className="text-xs text-slate-700 mt-1"><span className="font-semibold">Adult:</span> {opt.adultDose}</div>
                            {opt.pediatricDose && <div className="text-xs text-slate-700"><span className="font-semibold">Paeds:</span> {opt.pediatricDose}</div>}
                            {opt.note && <div className="text-[11px] text-slate-600 mt-1">💡 {opt.note}</div>}
                            {opt.rx !== "OTC" && (
                              <div className="text-[10px] text-blue-700 mt-1 font-medium">⚕️ Valid prescription required before dispensing.</div>
                            )}
                          </div>
                        ))}
                      </div>
                      {therapy.referralNote && (
                        <div className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 rounded px-2 py-1.5 mt-2">
                          ⚠️ {therapy.referralNote}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* ── ICD-only banner (no engine rules AND no WHO therapies matched) ── */}
              {!result && whoTherapies.length === 0 && hasAnyData && (
                <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-amber-800 text-sm mb-1">No medication rules matched for these codes — physician referral recommended</div>
                    <div className="text-xs text-amber-700 leading-relaxed">
                      The selected ICD codes represent conditions or findings with no matched clinical rules. Apply clinical judgment, consult BNF / MIMS / local formulary, and refer to a physician for assessment and appropriate therapy.
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
                  <div className="text-xs text-red-100 mt-2">⚠️ Do not recommend any medications for the red flag symptoms above without physician evaluation.</div>
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
                </TabsList>

                {/* Recommended */}
                <TabsContent value="recommended" className="mt-3">
                  {recommended.length === 0 ? (
                    <div className="text-center text-slate-400 py-12">
                      <CheckCircle className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                      <div className="text-sm">No fully safe medications found for the selected profile.</div>
                      <div className="text-xs mt-1">Check the "Caution" tab for options requiring monitoring, or refer to a physician.</div>
                    </div>
                  ) : (
                    recommended.map((r) => <MedicationCard key={r.medication.id} result={r} patientAge={profile.age} patientWeight={profile.weight} />)
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
                      {caution.map((r) => <MedicationCard key={r.medication.id} result={r} patientAge={profile.age} patientWeight={profile.weight} />)}
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
                      {avoid.map((r) => <MedicationCard key={r.medication.id} result={r} patientAge={profile.age} patientWeight={profile.weight} />)}
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
                                {cond.otcManageable ? "Self-care / OTC" : "Rx/Referral needed"}
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
                    {/* Lifestyle & social notes */}
                    {lifestyleNotes.length > 0 && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                        <div className="font-bold text-sm text-amber-900 mb-3 flex items-center gap-2">
                          <HeartPulse className="w-4 h-4" /> Lifestyle & Social Considerations
                        </div>
                        {lifestyleNotes.map((pt, i) => (
                          <div key={i} className="flex gap-2 text-sm text-amber-900 mb-2">
                            <span className="text-amber-500 mt-0.5">•</span>
                            <span>{pt}</span>
                          </div>
                        ))}
                      </div>
                    )}

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
