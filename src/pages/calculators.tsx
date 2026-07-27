import { useState, useMemo } from "react";
import { Link } from "wouter";
import {
  Calculator, Search, ChevronRight, RotateCcw, BookOpen,
  PillBottle, Activity, Heart, Droplets, Wind, FlaskConical,
  Scale, Dna, Utensils, Zap, Brain, ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────
type Category =
  | "Renal"
  | "Body Metrics"
  | "Cardiovascular"
  | "Hepatic"
  | "Electrolytes"
  | "Respiratory"
  | "Endocrine"
  | "Nutrition"
  | "Hematology"
  | "Clinical Scores";

interface CalcMeta {
  id: string;
  name: string;
  shortName: string;
  category: Category;
  description: string;
  reference?: string;
}

interface ResultBand {
  value: string | number;
  label: string;
  color: "green" | "yellow" | "orange" | "red" | "blue" | "slate";
  note?: string;
}

// ─── Calculator registry ──────────────────────────────────────────────────────
const CALCULATORS: CalcMeta[] = [
  // Renal
  { id: "crcl", name: "Creatinine Clearance (Cockcroft-Gault)", shortName: "CrCl (CG)", category: "Renal", description: "Estimates kidney function for drug dosing in adults.", reference: "Cockcroft & Gault, 1976" },
  { id: "ckdepi", name: "eGFR (CKD-EPI 2021)", shortName: "eGFR CKD-EPI", category: "Renal", description: "Most accurate GFR equation for CKD staging (race-free 2021 equation).", reference: "Inker et al., NEJM 2021" },
  { id: "mdrd", name: "eGFR (MDRD 4-variable)", shortName: "eGFR MDRD", category: "Renal", description: "4-variable MDRD equation for CKD staging.", reference: "Levey et al., 1999" },

  // Body Metrics
  { id: "bmi", name: "Body Mass Index (BMI)", shortName: "BMI", category: "Body Metrics", description: "Assesses body fatness relative to height and weight." },
  { id: "bsa", name: "Body Surface Area (BSA)", shortName: "BSA", category: "Body Metrics", description: "Used for chemotherapy and cardiac output calculations.", reference: "Mosteller formula" },
  { id: "ibw", name: "Ideal & Adjusted Body Weight", shortName: "IBW / AdjBW", category: "Body Metrics", description: "Used for drug dosing in obese patients.", reference: "Devine formula" },
  { id: "lbw", name: "Lean Body Weight (Janmahasatian)", shortName: "LBW", category: "Body Metrics", description: "Lean body weight used for aminoglycoside and vancomycin dosing.", reference: "Janmahasatian et al., 2005" },

  // Cardiovascular
  { id: "chadsvasc", name: "CHA₂DS₂-VASc Score", shortName: "CHA₂DS₂-VASc", category: "Cardiovascular", description: "Stroke risk in non-valvular atrial fibrillation.", reference: "ESC 2020 AF Guidelines" },
  { id: "hasbled", name: "HAS-BLED Score", shortName: "HAS-BLED", category: "Cardiovascular", description: "Bleeding risk for anticoagulated AF patients.", reference: "Pisters et al., Chest 2010" },
  { id: "ascvd", name: "ASCVD 10-Year Risk (Pooled Cohort)", shortName: "ASCVD Risk", category: "Cardiovascular", description: "10-year risk of first atherosclerotic cardiovascular event.", reference: "ACC/AHA 2013" },
  { id: "timi_nstemi", name: "TIMI Risk Score (UA/NSTEMI)", shortName: "TIMI NSTEMI", category: "Cardiovascular", description: "Predicts 14-day risk of death/MI/urgent revascularization.", reference: "Antman et al., JAMA 2000" },
  { id: "grace", name: "GRACE Score (simplified)", shortName: "GRACE", category: "Cardiovascular", description: "In-hospital mortality risk for ACS.", reference: "Fox et al., Eur Heart J 2006" },

  // Hepatic
  { id: "childpugh", name: "Child-Pugh Score", shortName: "Child-Pugh", category: "Hepatic", description: "Assesses severity of liver cirrhosis for prognosis and dosing.", reference: "Pugh et al., 1973" },
  { id: "meld", name: "MELD / MELD-Na Score", shortName: "MELD / MELD-Na", category: "Hepatic", description: "Predicts 3-month mortality in end-stage liver disease.", reference: "Malinchoc et al., 2000" },

  // Electrolytes
  { id: "aniongap", name: "Anion Gap (±Corrected)", shortName: "Anion Gap", category: "Electrolytes", description: "Differentiates causes of metabolic acidosis.", reference: "Normal: 8–12 mEq/L" },
  { id: "corr_ca", name: "Corrected Calcium (Albumin)", shortName: "Corrected Ca²⁺", category: "Electrolytes", description: "Adjusts serum calcium for hypoalbuminemia." },
  { id: "corr_na", name: "Corrected Sodium (Hyperglycemia)", shortName: "Corrected Na⁺", category: "Electrolytes", description: "Adjusts serum sodium in the setting of hyperglycemia." },
  { id: "osmolality", name: "Serum Osmolality & Osmol Gap", shortName: "Osmolality", category: "Electrolytes", description: "Calculates serum osmolality and osmol gap to detect unmeasured osmoles." },
  { id: "winters", name: "Winter's Formula (Metabolic Acidosis)", shortName: "Winter's Formula", category: "Electrolytes", description: "Expected pCO₂ in metabolic acidosis to assess for concurrent respiratory disorder." },
  { id: "deltadelta", name: "Delta-Delta Ratio (AG Metabolic Acidosis)", shortName: "Delta-Delta", category: "Electrolytes", description: "Assesses for concurrent metabolic alkalosis or non-AG metabolic acidosis." },

  // Respiratory
  { id: "curb65", name: "CURB-65 (Pneumonia Severity)", shortName: "CURB-65", category: "Respiratory", description: "Guides site-of-care decisions in community-acquired pneumonia.", reference: "BTS 2001" },
  { id: "wells_dvt", name: "Wells Score for DVT", shortName: "Wells DVT", category: "Respiratory", description: "Pre-test probability of deep vein thrombosis.", reference: "Wells et al., Lancet 1997" },
  { id: "wells_pe", name: "Wells Score for PE", shortName: "Wells PE", category: "Respiratory", description: "Pre-test probability of pulmonary embolism.", reference: "Wells et al., Ann Intern Med 2001" },

  // Endocrine
  { id: "hba1c", name: "HbA1c ↔ eAG Converter", shortName: "HbA1c / eAG", category: "Endocrine", description: "Converts HbA1c to estimated average glucose and vice versa.", reference: "ADA / ADAG Study 2008" },
  { id: "homa_ir", name: "HOMA-IR (Insulin Resistance)", shortName: "HOMA-IR", category: "Endocrine", description: "Estimates insulin resistance from fasting glucose and insulin." },

  // Nutrition
  { id: "mifflin", name: "Resting Metabolic Rate (Mifflin-St Jeor)", shortName: "RMR (Mifflin)", category: "Nutrition", description: "Most accurate BMR equation for clinical use." , reference: "Mifflin et al., 1990" },
  { id: "harris", name: "Basal Metabolic Rate (Harris-Benedict)", shortName: "BMR (Harris-Benedict)", category: "Nutrition", description: "Classic BMR equation with activity-adjusted TDEE.", reference: "Harris & Benedict, 1919" },

  // Hematology
  { id: "anc", name: "Absolute Neutrophil Count (ANC)", shortName: "ANC", category: "Hematology", description: "Assesses infection risk and chemotherapy eligibility." },
  { id: "corrected_wbc", name: "Corrected WBC (Nucleated RBCs)", shortName: "Corrected WBC", category: "Hematology", description: "Adjusts WBC count for presence of nucleated red blood cells." },

  // Clinical Scores
  { id: "gcs", name: "Glasgow Coma Scale (GCS)", shortName: "GCS", category: "Clinical Scores", description: "Assesses level of consciousness after brain injury." },
  { id: "sofa", name: "SOFA Score (Organ Failure)", shortName: "SOFA", category: "Clinical Scores", description: "Sequential Organ Failure Assessment for ICU prognosis.", reference: "Vincent et al., Intensive Care Med 1996" },
  { id: "parkland", name: "Parkland Formula (Burns)", shortName: "Parkland Burns", category: "Clinical Scores", description: "IV fluid resuscitation in the first 24h for burn patients.", reference: "Baxter, 1968" },
  { id: "phenytoin", name: "Phenytoin Dose Correction (Albumin)", shortName: "Phenytoin Adj.", category: "Clinical Scores", description: "Adjusts total phenytoin level for hypoalbuminemia / renal failure.", reference: "Winter-Tozer equation" },
];

const CATEGORY_ICONS: Record<Category, React.ReactNode> = {
  "Renal": <Droplets className="w-4 h-4" />,
  "Body Metrics": <Scale className="w-4 h-4" />,
  "Cardiovascular": <Heart className="w-4 h-4" />,
  "Hepatic": <Activity className="w-4 h-4" />,
  "Electrolytes": <FlaskConical className="w-4 h-4" />,
  "Respiratory": <Wind className="w-4 h-4" />,
  "Endocrine": <Zap className="w-4 h-4" />,
  "Nutrition": <Utensils className="w-4 h-4" />,
  "Hematology": <Dna className="w-4 h-4" />,
  "Clinical Scores": <Brain className="w-4 h-4" />,
};

// ─── Small helpers ────────────────────────────────────────────────────────────
const BAND_COLORS: Record<ResultBand["color"], string> = {
  green: "bg-emerald-50 border-emerald-300 text-emerald-800",
  yellow: "bg-yellow-50 border-yellow-300 text-yellow-800",
  orange: "bg-amber-50 border-amber-300 text-amber-800",
  red: "bg-red-50 border-red-300 text-red-800",
  blue: "bg-blue-50 border-blue-300 text-blue-800",
  slate: "bg-slate-50 border-slate-300 text-slate-700",
};

function ResultCard({ band }: { band: ResultBand }) {
  return (
    <div className={cn("border rounded-xl p-4 mt-4", BAND_COLORS[band.color])}>
      <div className="text-3xl font-bold mb-1">{band.value}</div>
      <div className="text-base font-semibold">{band.label}</div>
      {band.note && <div className="text-sm mt-2 opacity-80">{band.note}</div>}
    </div>
  );
}

function Field({ label, unit, value, onChange, min, max, step = "any", placeholder }: {
  label: string; unit?: string; value: string;
  onChange: (v: string) => void; min?: number; max?: number;
  step?: string | number; placeholder?: string;
}) {
  return (
    <div>
      <Label className="text-sm font-medium text-slate-700 mb-1 block">
        {label}{unit && <span className="text-slate-400 font-normal ml-1">({unit})</span>}
      </Label>
      <Input
        type="number"
        value={value}
        onChange={e => onChange(e.target.value)}
        min={min} max={max} step={step}
        placeholder={placeholder ?? ""}
        className="h-9"
      />
    </div>
  );
}

function SexSelector({ value, onChange }: { value: "male" | "female"; onChange: (v: "male" | "female") => void }) {
  return (
    <div>
      <Label className="text-sm font-medium text-slate-700 mb-1 block">Sex</Label>
      <div className="flex gap-2">
        {(["male", "female"] as const).map(s => (
          <button key={s} onClick={() => onChange(s)}
            className={cn("px-4 py-1.5 rounded-lg border text-sm font-medium transition-colors capitalize",
              value === s ? "bg-[#0B3D91] text-white border-[#0B3D91]" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            )}>{s}</button>
        ))}
      </div>
    </div>
  );
}

function BoolRow({ label, value, onChange, sublabel }: { label: string; sublabel?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-slate-100 last:border-0">
      <div>
        <div className="text-sm font-medium text-slate-800">{label}</div>
        {sublabel && <div className="text-xs text-slate-500">{sublabel}</div>}
      </div>
      <div className="flex gap-1 shrink-0">
        {([1, 0] as const).map(v => (
          <button key={v} onClick={() => onChange(v === 1)}
            className={cn("w-8 h-7 rounded text-xs font-bold border transition-colors",
              (v === 1 ? value : !value) ? "bg-[#0B3D91] text-white border-[#0B3D91]" : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
            )}>{v === 1 ? "Yes" : "No"}</button>
        ))}
      </div>
    </div>
  );
}

// ─── Individual calculators ───────────────────────────────────────────────────

function CalcCrCl() {
  const [age, setAge] = useState(""); const [wt, setWt] = useState("");
  const [scr, setScr] = useState(""); const [sex, setSex] = useState<"male"|"female">("male");
  const result = useMemo(() => {
    const a = parseFloat(age), w = parseFloat(wt), s = parseFloat(scr);
    if (!a || !w || !s || a <= 0 || w <= 0 || s <= 0) return null;
    const raw = ((140 - a) * w) / (72 * s) * (sex === "female" ? 0.85 : 1);
    const val = Math.round(raw * 10) / 10;
    let band: ResultBand;
    if (val >= 90) band = { value: `${val} mL/min`, label: "Normal / High (CKD G1–G2)", color: "green", note: "No dose adjustment needed for most renally-cleared drugs." };
    else if (val >= 60) band = { value: `${val} mL/min`, label: "Mildly decreased (CKD G2–G3a)", color: "yellow", note: "Monitor; dose adjustment needed for some drugs." };
    else if (val >= 30) band = { value: `${val} mL/min`, label: "Moderately decreased (CKD G3b–G4)", color: "orange", note: "Dose adjustment required for most renally-cleared medications." };
    else if (val >= 15) band = { value: `${val} mL/min`, label: "Severely decreased (CKD G4–G5)", color: "red", note: "Significant dose reductions required. Avoid nephrotoxic agents." };
    else band = { value: `${val} mL/min`, label: "Kidney failure (CKD G5 / ESRD)", color: "red", note: "Avoid or use with extreme caution. Dialysis may alter drug clearance." };
    return band;
  }, [age, wt, scr, sex]);
  return (
    <div className="grid gap-4">
      <Field label="Age" unit="years" value={age} onChange={setAge} min={1} max={120} />
      <Field label="Weight" unit="kg (use ABW, or IBW if obese)" value={wt} onChange={setWt} min={1} />
      <Field label="Serum Creatinine" unit="mg/dL" value={scr} onChange={setScr} min={0.1} step={0.01} />
      <SexSelector value={sex} onChange={setSex} />
      {result ? <ResultCard band={result} /> : <div className="text-slate-400 text-sm mt-2">Enter all values to calculate.</div>}
      <div className="text-xs text-slate-500 bg-slate-50 rounded p-2 border">Formula: CrCl = [(140−age) × weight] / (72 × SCr) × 0.85 (if female)</div>
    </div>
  );
}

function CalcCkdEpi() {
  const [age, setAge] = useState(""); const [scr, setScr] = useState(""); const [sex, setSex] = useState<"male"|"female">("male");
  const result = useMemo(() => {
    const a = parseFloat(age), s = parseFloat(scr);
    if (!a || !s || a <= 0 || s <= 0) return null;
    const kappa = sex === "female" ? 0.7 : 0.9;
    const alpha = sex === "female" ? -0.241 : -0.302;
    const sexFactor = sex === "female" ? 1.012 : 1.0;
    const ratio = s / kappa;
    const egfr = 142 * Math.pow(Math.min(ratio, 1), alpha) * Math.pow(Math.max(ratio, 1), -1.200) * Math.pow(0.9938, a) * sexFactor;
    const val = Math.round(egfr * 10) / 10;
    const ckdStage = val >= 90 ? { stage: "G1", label: "Normal or High", color: "green" as const }
      : val >= 60 ? { stage: "G2", label: "Mildly decreased", color: "yellow" as const }
      : val >= 45 ? { stage: "G3a", label: "Mild–moderately decreased", color: "yellow" as const }
      : val >= 30 ? { stage: "G3b", label: "Moderate–severely decreased", color: "orange" as const }
      : val >= 15 ? { stage: "G4", label: "Severely decreased", color: "red" as const }
      : { stage: "G5", label: "Kidney failure", color: "red" as const };
    return { value: `${val} mL/min/1.73m²`, label: `CKD Stage ${ckdStage.stage} — ${ckdStage.label}`, color: ckdStage.color, note: "CKD-EPI 2021 (race-free). Use for CKD staging; use CG-CrCl for drug dosing." } as ResultBand;
  }, [age, scr, sex]);
  return (
    <div className="grid gap-4">
      <Field label="Age" unit="years" value={age} onChange={setAge} min={18} max={110} />
      <Field label="Serum Creatinine" unit="mg/dL" value={scr} onChange={setScr} min={0.1} step={0.01} />
      <SexSelector value={sex} onChange={setSex} />
      {result ? <ResultCard band={result} /> : <div className="text-slate-400 text-sm mt-2">Enter all values to calculate.</div>}
    </div>
  );
}

function CalcMdrd() {
  const [age, setAge] = useState(""); const [scr, setScr] = useState(""); const [sex, setSex] = useState<"male"|"female">("male");
  const result = useMemo(() => {
    const a = parseFloat(age), s = parseFloat(scr);
    if (!a || !s) return null;
    const sexF = sex === "female" ? 0.742 : 1.0;
    const egfr = 175 * Math.pow(s, -1.154) * Math.pow(a, -0.203) * sexF;
    const val = Math.round(egfr * 10) / 10;
    const color: ResultBand["color"] = val >= 60 ? "green" : val >= 30 ? "orange" : "red";
    return { value: `${val} mL/min/1.73m²`, label: val >= 60 ? "Adequate (≥G3 threshold)" : val >= 30 ? "CKD G3–G4" : "CKD G4–G5", color } as ResultBand;
  }, [age, scr, sex]);
  return (
    <div className="grid gap-4">
      <Field label="Age" unit="years" value={age} onChange={setAge} />
      <Field label="Serum Creatinine" unit="mg/dL" value={scr} onChange={setScr} min={0.1} step={0.01} />
      <SexSelector value={sex} onChange={setSex} />
      {result ? <ResultCard band={result} /> : <div className="text-slate-400 text-sm mt-2">Enter all values to calculate.</div>}
      <div className="text-xs text-slate-500 bg-slate-50 rounded p-2 border">Note: MDRD is less accurate at higher GFR values. Prefer CKD-EPI for reporting.</div>
    </div>
  );
}

function CalcBmi() {
  const [wt, setWt] = useState(""); const [ht, setHt] = useState("");
  const result = useMemo(() => {
    const w = parseFloat(wt), h = parseFloat(ht);
    if (!w || !h || h <= 0) return null;
    const bmi = w / ((h / 100) ** 2);
    const val = Math.round(bmi * 10) / 10;
    let band: ResultBand;
    if (val < 18.5) band = { value: val, label: "Underweight (<18.5)", color: "yellow", note: "Consider nutritional assessment." };
    else if (val < 25) band = { value: val, label: "Normal weight (18.5–24.9)", color: "green" };
    else if (val < 30) band = { value: val, label: "Overweight (25.0–29.9)", color: "yellow", note: "Increased risk of metabolic disease." };
    else if (val < 35) band = { value: val, label: "Obese Class I (30–34.9)", color: "orange", note: "Use IBW or AdjBW for drug dosing." };
    else if (val < 40) band = { value: val, label: "Obese Class II (35–39.9)", color: "red" };
    else band = { value: val, label: "Obese Class III / Morbid (≥40)", color: "red", note: "Highest risk. Use AdjBW for most drugs." };
    return band;
  }, [wt, ht]);
  return (
    <div className="grid gap-4">
      <Field label="Weight" unit="kg" value={wt} onChange={setWt} min={1} />
      <Field label="Height" unit="cm" value={ht} onChange={setHt} min={50} />
      {result ? <ResultCard band={result} /> : <div className="text-slate-400 text-sm mt-2">Enter weight and height.</div>}
    </div>
  );
}

function CalcBsa() {
  const [wt, setWt] = useState(""); const [ht, setHt] = useState("");
  const result = useMemo(() => {
    const w = parseFloat(wt), h = parseFloat(ht);
    if (!w || !h) return null;
    const bsa = Math.sqrt((h * w) / 3600);
    const val = Math.round(bsa * 100) / 100;
    return { value: `${val} m²`, label: "Body Surface Area (Mosteller)", color: "blue", note: "Average adult BSA ≈ 1.73 m². Used for chemo dosing, cardiac output, and burn area calculations." } as ResultBand;
  }, [wt, ht]);
  return (
    <div className="grid gap-4">
      <Field label="Weight" unit="kg" value={wt} onChange={setWt} min={1} />
      <Field label="Height" unit="cm" value={ht} onChange={setHt} min={50} />
      {result ? <ResultCard band={result} /> : <div className="text-slate-400 text-sm mt-2">Enter weight and height.</div>}
      <div className="text-xs text-slate-500 bg-slate-50 rounded p-2 border">Formula: BSA = √(Height[cm] × Weight[kg] / 3600)</div>
    </div>
  );
}

function CalcIbw() {
  const [ht, setHt] = useState(""); const [wt, setWt] = useState(""); const [sex, setSex] = useState<"male"|"female">("male");
  const result = useMemo(() => {
    const h = parseFloat(ht), w = parseFloat(wt);
    if (!h || h < 100) return null;
    const htIn = h / 2.54;
    const ibw = sex === "male" ? 50 + 2.3 * (htIn - 60) : 45.5 + 2.3 * (htIn - 60);
    const ibwR = Math.round(ibw * 10) / 10;
    let adjNote = "";
    let adjbw: number | null = null;
    if (w) {
      adjbw = ibw + 0.4 * (w - ibw);
      adjNote = w > ibw * 1.3
        ? `AdjBW = ${Math.round(adjbw * 10) / 10} kg (patient is obese; use AdjBW for weight-based dosing)`
        : `Patient weight is within 30% of IBW — use actual body weight for dosing.`;
    }
    return { value: `IBW = ${ibwR} kg`, label: adjNote || "Devine formula", color: "blue", note: adjNote } as ResultBand;
  }, [ht, wt, sex]);
  return (
    <div className="grid gap-4">
      <Field label="Height" unit="cm" value={ht} onChange={setHt} min={100} />
      <Field label="Actual Body Weight" unit="kg (optional, for AdjBW)" value={wt} onChange={setWt} min={1} />
      <SexSelector value={sex} onChange={setSex} />
      {result ? <ResultCard band={result} /> : <div className="text-slate-400 text-sm mt-2">Enter height to calculate.</div>}
      <div className="text-xs text-slate-500 bg-slate-50 rounded p-2 border">IBW (male) = 50 + 2.3×(height_in − 60) | AdjBW = IBW + 0.4×(ABW − IBW) when ABW &gt; 130% IBW</div>
    </div>
  );
}

function CalcLbw() {
  const [wt, setWt] = useState(""); const [ht, setHt] = useState(""); const [sex, setSex] = useState<"male"|"female">("male");
  const result = useMemo(() => {
    const w = parseFloat(wt), h = parseFloat(ht);
    if (!w || !h) return null;
    const bmi = w / ((h / 100) ** 2);
    const lbw = sex === "male"
      ? (9270 * w) / (6680 + 216 * bmi)
      : (9270 * w) / (8780 + 244 * bmi);
    const val = Math.round(lbw * 10) / 10;
    return { value: `${val} kg`, label: "Lean Body Weight (Janmahasatian)", color: "blue", note: "Used for volume of distribution estimates and aminoglycoside / vancomycin AUC dosing." } as ResultBand;
  }, [wt, ht, sex]);
  return (
    <div className="grid gap-4">
      <Field label="Weight" unit="kg" value={wt} onChange={setWt} min={1} />
      <Field label="Height" unit="cm" value={ht} onChange={setHt} min={100} />
      <SexSelector value={sex} onChange={setSex} />
      {result ? <ResultCard band={result} /> : <div className="text-slate-400 text-sm mt-2">Enter all values to calculate.</div>}
    </div>
  );
}

function CalcChadsvasc() {
  const [age, setAge] = useState("");
  const [chf, setChf] = useState(false); const [htn, setHtn] = useState(false);
  const [dm, setDm] = useState(false); const [stroke, setStroke] = useState(false);
  const [vasc, setVasc] = useState(false); const [female, setFemale] = useState(false);
  const result = useMemo(() => {
    const a = parseFloat(age);
    if (!a) return null;
    let score = 0;
    if (chf) score += 1;
    if (htn) score += 1;
    if (a >= 75) score += 2; else if (a >= 65) score += 1;
    if (dm) score += 1;
    if (stroke) score += 2;
    if (vasc) score += 1;
    if (female) score += 1;
    // Annual stroke risk lookup
    const riskMap: Record<number, string> = { 0:"0%",1:"1.3%",2:"2.2%",3:"3.2%",4:"4.0%",5:"6.7%",6:"9.8%",7:"9.6%",8:"12.5%",9:"15.2%" };
    const risk = riskMap[Math.min(score, 9)] ?? ">15%";
    let band: ResultBand;
    if (score === 0) band = { value: `Score: ${score}`, label: "Low risk — anticoagulation not recommended", color: "green", note: `Estimated annual stroke risk: ${risk}` };
    else if (score === 1 && !female) band = { value: `Score: ${score}`, label: "Low–moderate — consider anticoagulation (male)", color: "yellow", note: `Estimated annual stroke risk: ${risk}` };
    else band = { value: `Score: ${score}`, label: "Anticoagulation recommended", color: score >= 4 ? "red" : "orange", note: `Estimated annual stroke risk: ${risk}. Use CHA₂DS₂-VASc ≥ 2 (male) or ≥ 3 (female) as threshold per ESC 2020.` };
    return band;
  }, [age, chf, htn, dm, stroke, vasc, female]);
  return (
    <div className="grid gap-3">
      <Field label="Age" unit="years" value={age} onChange={setAge} min={18} />
      <BoolRow label="CHF / LV dysfunction" value={chf} onChange={setChf} />
      <BoolRow label="Hypertension" sublabel="BP consistently >140/90 or treated" value={htn} onChange={setHtn} />
      <BoolRow label="Diabetes mellitus" value={dm} onChange={setDm} />
      <BoolRow label="Prior stroke, TIA, or thromboembolism" sublabel="+2 points" value={stroke} onChange={setStroke} />
      <BoolRow label="Vascular disease" sublabel="Prior MI, PAD, or aortic plaque" value={vasc} onChange={setVasc} />
      <BoolRow label="Female sex" sublabel="+1 point (only if other risk factors present)" value={female} onChange={setFemale} />
      {result ? <ResultCard band={result} /> : <div className="text-slate-400 text-sm">Enter age to calculate.</div>}
    </div>
  );
}

function CalcHasBled() {
  const [htn, setHtn] = useState(false); const [renal, setRenal] = useState(false);
  const [liver, setLiver] = useState(false); const [stroke, setStroke] = useState(false);
  const [bleeding, setBleeding] = useState(false); const [labile, setLabile] = useState(false);
  const [elderly, setElderly] = useState(false); const [drugs, setDrugs] = useState(false);
  const [alcohol, setAlcohol] = useState(false);
  const result = useMemo(() => {
    const score = [htn, renal, liver, stroke, bleeding, labile, elderly].filter(Boolean).length
      + (drugs ? 1 : 0) + (alcohol ? 1 : 0);
    let band: ResultBand;
    if (score <= 1) band = { value: `Score: ${score}`, label: "Low bleeding risk", color: "green", note: "Anticoagulation is appropriate if CHA₂DS₂-VASc score warrants it." };
    else if (score === 2) band = { value: `Score: ${score}`, label: "Moderate bleeding risk", color: "yellow", note: "Address modifiable risk factors. Do not use to withhold anticoagulation alone." };
    else band = { value: `Score: ${score}`, label: "High bleeding risk (≥3)", color: "red", note: "High risk — review modifiable factors. HAS-BLED should not be used to withhold anticoagulation outright." };
    return band;
  }, [htn, renal, liver, stroke, bleeding, labile, elderly, drugs, alcohol]);
  return (
    <div className="grid gap-1">
      <BoolRow label="Hypertension (uncontrolled)" sublabel="Systolic BP >160 mmHg" value={htn} onChange={setHtn} />
      <BoolRow label="Renal dysfunction" sublabel="Dialysis, transplant, or Cr >2.26 mg/dL" value={renal} onChange={setRenal} />
      <BoolRow label="Liver dysfunction" sublabel="Cirrhosis or bilirubin >2× ULN + AST/ALT >3× ULN" value={liver} onChange={setLiver} />
      <BoolRow label="Stroke history" value={stroke} onChange={setStroke} />
      <BoolRow label="Prior major bleeding or predisposition" value={bleeding} onChange={setBleeding} />
      <BoolRow label="Labile INR (if on warfarin)" sublabel="TTR <60%" value={labile} onChange={setLabile} />
      <BoolRow label="Elderly (age >65)" value={elderly} onChange={setElderly} />
      <BoolRow label="Antiplatelet or NSAID use" value={drugs} onChange={setDrugs} />
      <BoolRow label="Alcohol use (≥8 drinks/week)" value={alcohol} onChange={setAlcohol} />
      {result && <ResultCard band={result} />}
    </div>
  );
}

function CalcAscvd() {
  const [age, setAge] = useState(""); const [tc, setTc] = useState(""); const [hdl, setHdl] = useState("");
  const [sbp, setSbp] = useState(""); const [sex, setSex] = useState<"male"|"female">("male");
  const [bpTx, setBpTx] = useState(false); const [dm, setDm] = useState(false); const [smoker, setSmoker] = useState(false);
  const result = useMemo(() => {
    const a = parseFloat(age), t = parseFloat(tc), h = parseFloat(hdl), s = parseFloat(sbp);
    if (!a || !t || !h || !s) return null;
    // ACC/AHA Pooled Cohort simplified (White/AA equations averaged here as approximation)
    const lnAge = Math.log(a); const lnTc = Math.log(t); const lnHdl = Math.log(h);
    const lnSbp = Math.log(s);
    let sum: number;
    if (sex === "male") {
      sum = 12.344 * lnAge + 11.853 * lnTc - 2.664 * lnAge * lnTc
        - 7.990 * lnHdl + 1.769 * lnAge * lnHdl
        + (bpTx ? 1.797 : 1.764) * lnSbp
        + (smoker ? 7.837 - 1.795 * lnAge : 0)
        + (dm ? 0.661 : 0) - 61.18;
    } else {
      sum = -29.799 * lnAge + 4.884 * lnAge * lnAge + 13.540 * lnTc - 3.114 * lnAge * lnTc
        - 13.578 * lnHdl + 3.149 * lnAge * lnHdl
        + (bpTx ? 2.019 : 1.957) * lnSbp
        + (smoker ? 7.574 - 1.665 * lnAge : 0)
        + (dm ? 0.661 : 0) - (-29.799 * lnAge + 4.884 * lnAge ** 2);
    }
    const risk10 = (1 - (sex === "male" ? 0.9144 : 0.9665) ** Math.exp(sum)) * 100;
    const val = Math.max(0, Math.min(100, Math.round(risk10 * 10) / 10));
    let band: ResultBand;
    if (val < 5) band = { value: `${val}%`, label: "Low 10-year ASCVD risk (<5%)", color: "green", note: "Lifestyle modification; statin generally not recommended unless other factors." };
    else if (val < 7.5) band = { value: `${val}%`, label: "Borderline risk (5–7.4%)", color: "yellow", note: "Consider risk-enhancing factors to guide statin therapy decision." };
    else if (val < 20) band = { value: `${val}%`, label: "Intermediate risk (7.5–19.9%)", color: "orange", note: "Moderate-intensity statin recommended. Discuss risk-benefit." };
    else band = { value: `${val}%`, label: "High risk (≥20%)", color: "red", note: "High-intensity statin recommended (ACC/AHA 2019). Target LDL reduction ≥50%." };
    return band;
  }, [age, tc, hdl, sbp, sex, bpTx, dm, smoker]);
  return (
    <div className="grid gap-3">
      <Field label="Age" unit="years (40–79)" value={age} onChange={setAge} min={40} max={79} />
      <Field label="Total Cholesterol" unit="mg/dL" value={tc} onChange={setTc} />
      <Field label="HDL Cholesterol" unit="mg/dL" value={hdl} onChange={setHdl} />
      <Field label="Systolic BP" unit="mmHg" value={sbp} onChange={setSbp} />
      <SexSelector value={sex} onChange={setSex} />
      <BoolRow label="On BP-lowering medication" value={bpTx} onChange={setBpTx} />
      <BoolRow label="Diabetes mellitus" value={dm} onChange={setDm} />
      <BoolRow label="Current smoker" value={smoker} onChange={setSmoker} />
      {result ? <ResultCard band={result} /> : <div className="text-slate-400 text-sm">Enter all values to calculate.</div>}
      <div className="text-xs text-slate-500 bg-slate-50 rounded p-2 border">ACC/AHA Pooled Cohort Equations. Valid for ages 40–79 without pre-existing ASCVD or statin use.</div>
    </div>
  );
}

function CalcTimi() {
  const [age, setAge] = useState(false); const [cad, setCad] = useState(false);
  const [stChange, setStChange] = useState(false); const [markers, setMarkers] = useState(false);
  const [angina, setAngina] = useState(false); const [asp, setAsp] = useState(false);
  const [rf, setRf] = useState(false);
  const result = useMemo(() => {
    const score = [age, cad, stChange, markers, angina, asp, rf].filter(Boolean).length;
    const riskMap: Record<number, [string, string, ResultBand["color"]]> = {
      0: ["4.7%", "Low risk", "green"], 1: ["4.7%", "Low risk", "green"], 2: ["8.3%", "Low risk", "green"],
      3: ["13.2%", "Intermediate risk", "yellow"], 4: ["19.9%", "Intermediate risk", "orange"],
      5: ["26.2%", "High risk", "red"], 6: ["40.9%", "High risk", "red"], 7: ["40.9%", "High risk", "red"],
    };
    const [risk, label, color] = riskMap[Math.min(score, 7)];
    return { value: `Score: ${score} / 7`, label: `${label} — ${risk} 14-day MACE`, color, note: "MACE = Death, MI, or urgent revascularization at 14 days." } as ResultBand;
  }, [age, cad, stChange, markers, angina, asp, rf]);
  return (
    <div className="grid gap-1">
      <BoolRow label="Age ≥65 years" value={age} onChange={setAge} />
      <BoolRow label="≥3 CAD risk factors" sublabel="Family Hx, HTN, hypercholesterolaemia, DM, active smoker" value={rf} onChange={setRf} />
      <BoolRow label="Known CAD (stenosis ≥50%)" value={cad} onChange={setCad} />
      <BoolRow label="ST deviation on ECG (≥0.5 mm)" value={stChange} onChange={setStChange} />
      <BoolRow label="≥2 anginal events in prior 24h" value={angina} onChange={setAngina} />
      <BoolRow label="Aspirin use in prior 7 days" value={asp} onChange={setAsp} />
      <BoolRow label="Elevated cardiac markers (CK-MB or troponin)" value={markers} onChange={setMarkers} />
      <ResultCard band={result} />
    </div>
  );
}

function CalcGrace() {
  const [age, setAge] = useState(""); const [hr, setHr] = useState(""); const [sbp, setSbp] = useState("");
  const [cr, setCr] = useState(""); const [killip, setKillip] = useState("1");
  const [arrest, setArrest] = useState(false); const [stDev, setStDev] = useState(false); const [elevated, setElevated] = useState(false);
  const result = useMemo(() => {
    const a = parseFloat(age), h = parseFloat(hr), s = parseFloat(sbp), c = parseFloat(cr);
    if (!a || !h || !s || !c) return null;
    let score = 0;
    // Age points
    if (a < 30) score += 0; else if (a < 40) score += 8; else if (a < 50) score += 25; else if (a < 60) score += 41; else if (a < 70) score += 58; else if (a < 80) score += 75; else score += 91;
    // HR points
    if (h < 50) score += 0; else if (h < 70) score += 3; else if (h < 90) score += 9; else if (h < 110) score += 15; else if (h < 150) score += 24; else if (h < 200) score += 38; else score += 46;
    // SBP points
    if (s < 80) score += 58; else if (s < 100) score += 53; else if (s < 120) score += 43; else if (s < 140) score += 34; else if (s < 160) score += 24; else if (s < 200) score += 10; else score += 0;
    // Creatinine
    if (c < 0.4) score += 1; else if (c < 0.8) score += 3; else if (c < 1.2) score += 5; else if (c < 1.6) score += 7; else if (c < 2.0) score += 9; else if (c < 4.0) score += 15; else score += 20;
    // Killip class
    const k = parseInt(killip);
    if (k === 1) score += 0; else if (k === 2) score += 20; else if (k === 3) score += 39; else score += 59;
    if (arrest) score += 39; if (stDev) score += 28; if (elevated) score += 14;
    let band: ResultBand;
    if (score < 109) band = { value: `Score: ${score}`, label: "Low risk (<1% in-hospital mortality)", color: "green" };
    else if (score <= 140) band = { value: `Score: ${score}`, label: "Intermediate risk (1–3%)", color: "yellow" };
    else band = { value: `Score: ${score}`, label: "High risk (>3% in-hospital mortality)", color: "red", note: "Early invasive strategy recommended." };
    return band;
  }, [age, hr, sbp, cr, killip, arrest, stDev, elevated]);
  return (
    <div className="grid gap-3">
      <Field label="Age" unit="years" value={age} onChange={setAge} />
      <Field label="Heart Rate" unit="bpm" value={hr} onChange={setHr} />
      <Field label="Systolic BP" unit="mmHg" value={sbp} onChange={setSbp} />
      <Field label="Serum Creatinine" unit="mg/dL" value={cr} onChange={setCr} step={0.1} />
      <div>
        <Label className="text-sm font-medium text-slate-700 mb-1 block">Killip Class</Label>
        <div className="grid grid-cols-2 gap-1.5">
          {[["1","I — No heart failure"],["2","II — Rales / JVD"],["3","III — Pulmonary oedema"],["4","IV — Cardiogenic shock"]].map(([v,l]) => (
            <button key={v} onClick={() => setKillip(v)} className={cn("text-xs px-2 py-1.5 rounded border text-left transition-colors", killip === v ? "bg-[#0B3D91] text-white border-[#0B3D91]" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50")}>{l}</button>
          ))}
        </div>
      </div>
      <BoolRow label="Cardiac arrest at admission" value={arrest} onChange={setArrest} />
      <BoolRow label="ST-segment deviation" value={stDev} onChange={setStDev} />
      <BoolRow label="Elevated cardiac markers" value={elevated} onChange={setElevated} />
      {result ? <ResultCard band={result} /> : <div className="text-slate-400 text-sm">Enter all values to calculate.</div>}
    </div>
  );
}

function CalcChildPugh() {
  const [bili, setBili] = useState(""); const [alb, setAlb] = useState("");
  const [pt, setPt] = useState(""); const [ascites, setAscites] = useState("1");
  const [enceph, setEnceph] = useState("1");
  const result = useMemo(() => {
    const b = parseFloat(bili), a = parseFloat(alb), p = parseFloat(pt);
    if (!b || !a || !p) return null;
    let score = 0;
    score += b < 2 ? 1 : b <= 3 ? 2 : 3;
    score += a > 3.5 ? 1 : a >= 2.8 ? 2 : 3;
    score += p < 4 ? 1 : p <= 6 ? 2 : 3;
    score += parseInt(ascites); score += parseInt(enceph);
    let band: ResultBand;
    if (score <= 6) band = { value: `Score: ${score} — Class A`, label: "Well-compensated disease", color: "green", note: "1-year survival ~100%. 2-year ~85%. Standard drug dosing usually appropriate." };
    else if (score <= 9) band = { value: `Score: ${score} — Class B`, label: "Significant functional compromise", color: "orange", note: "1-year survival ~80%. 2-year ~60%. Reduce doses of hepatically cleared drugs. Assess for transplant." };
    else band = { value: `Score: ${score} — Class C`, label: "Decompensated disease", color: "red", note: "1-year survival ~45%. 2-year ~35%. Avoid hepatotoxic drugs. Significant dose reductions required." };
    return band;
  }, [bili, alb, pt, ascites, enceph]);
  return (
    <div className="grid gap-3">
      <Field label="Total Bilirubin" unit="mg/dL" value={bili} onChange={setBili} step={0.1} />
      <Field label="Serum Albumin" unit="g/dL" value={alb} onChange={setAlb} step={0.1} />
      <Field label="Prothrombin Time prolongation" unit="seconds above normal" value={pt} onChange={setPt} step={0.5} />
      <div>
        <Label className="text-sm font-medium text-slate-700 mb-1 block">Ascites</Label>
        <div className="flex gap-2">
          {[["1","None"],["2","Mild/controlled"],["3","Moderate–severe / refractory"]].map(([v,l]) => (
            <button key={v} onClick={() => setAscites(v)} className={cn("flex-1 text-xs px-2 py-1.5 rounded border text-center transition-colors", ascites === v ? "bg-[#0B3D91] text-white border-[#0B3D91]" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50")}>{l}</button>
          ))}
        </div>
      </div>
      <div>
        <Label className="text-sm font-medium text-slate-700 mb-1 block">Hepatic Encephalopathy</Label>
        <div className="flex gap-2">
          {[["1","None"],["2","Grade 1–2"],["3","Grade 3–4"]].map(([v,l]) => (
            <button key={v} onClick={() => setEnceph(v)} className={cn("flex-1 text-xs px-2 py-1.5 rounded border text-center transition-colors", enceph === v ? "bg-[#0B3D91] text-white border-[#0B3D91]" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50")}>{l}</button>
          ))}
        </div>
      </div>
      {result ? <ResultCard band={result} /> : <div className="text-slate-400 text-sm">Enter all values to calculate.</div>}
    </div>
  );
}

function CalcMeld() {
  const [cr, setCr] = useState(""); const [bili, setBili] = useState(""); const [inr, setInr] = useState(""); const [na, setNa] = useState("");
  const result = useMemo(() => {
    const c = Math.max(1, Math.min(4, parseFloat(cr) || 0));
    const b = Math.max(1, parseFloat(bili) || 0);
    const i = Math.max(1, parseFloat(inr) || 0);
    if (!c || !b || !i) return null;
    const meld = Math.round(3.78 * Math.log(b) + 11.2 * Math.log(i) + 9.57 * Math.log(c) + 6.43);
    const naVal = parseFloat(na);
    let meldNa: number | null = null;
    let note = "";
    if (naVal) {
      const naC = Math.max(125, Math.min(137, naVal));
      meldNa = Math.round(meld + 1.32 * (137 - naC) - 0.033 * meld * (137 - naC));
      note = `MELD-Na: ${meldNa}`;
    }
    const mort = meld < 10 ? "<5%" : meld < 20 ? "6–20%" : meld < 30 ? "20–50%" : ">50%";
    const color: ResultBand["color"] = meld < 15 ? "yellow" : meld < 25 ? "orange" : "red";
    return { value: `MELD: ${meld}${meldNa ? `  |  MELD-Na: ${meldNa}` : ""}`, label: `Estimated 90-day mortality: ${mort}`, color, note: "MELD ≥15 is the threshold for transplant listing in most centres. Creatinine capped at 4.0 mg/dL." } as ResultBand;
  }, [cr, bili, inr, na]);
  return (
    <div className="grid gap-4">
      <Field label="Serum Creatinine" unit="mg/dL (capped at 4.0)" value={cr} onChange={setCr} min={0.5} step={0.1} />
      <Field label="Total Bilirubin" unit="mg/dL" value={bili} onChange={setBili} min={0.5} step={0.1} />
      <Field label="INR" value={inr} onChange={setInr} min={1} step={0.1} />
      <Field label="Serum Sodium" unit="mEq/L (optional, for MELD-Na)" value={na} onChange={setNa} min={120} max={145} />
      {result ? <ResultCard band={result} /> : <div className="text-slate-400 text-sm">Enter creatinine, bilirubin, and INR to calculate.</div>}
    </div>
  );
}

function CalcAnionGap() {
  const [na, setNa] = useState(""); const [cl, setCl] = useState(""); const [hco3, setHco3] = useState(""); const [alb, setAlb] = useState("");
  const result = useMemo(() => {
    const n = parseFloat(na), c = parseFloat(cl), h = parseFloat(hco3);
    if (!n || !c || !h) return null;
    const ag = n - (c + h);
    const albVal = parseFloat(alb);
    const corrAg = albVal ? ag + 2.5 * (4.0 - albVal) : null;
    const agDisplay = corrAg != null ? `AG: ${ag}  |  Corrected AG: ${corrAg.toFixed(1)}` : `${ag} mEq/L`;
    const useAg = corrAg ?? ag;
    let band: ResultBand;
    if (useAg <= 12) band = { value: agDisplay, label: "Normal anion gap (≤12 mEq/L)", color: "green", note: "Consider non-AG metabolic acidosis: diarrhoea, RTA, carbonic anhydrase inhibitors, saline infusion." };
    else band = { value: agDisplay, label: "Elevated anion gap (>12 mEq/L)", color: "red", note: "MUDPILES: Methanol, Uraemia, DKA, Propylene glycol, Isoniazid/Iron, Lactic acidosis, Ethylene glycol, Salicylates." };
    return band;
  }, [na, cl, hco3, alb]);
  return (
    <div className="grid gap-4">
      <Field label="Sodium" unit="mEq/L" value={na} onChange={setNa} />
      <Field label="Chloride" unit="mEq/L" value={cl} onChange={setCl} />
      <Field label="Bicarbonate (HCO₃⁻)" unit="mEq/L" value={hco3} onChange={setHco3} />
      <Field label="Albumin" unit="g/dL (optional, for correction)" value={alb} onChange={setAlb} step={0.1} />
      {result ? <ResultCard band={result} /> : <div className="text-slate-400 text-sm">Enter Na, Cl, HCO₃ to calculate.</div>}
      <div className="text-xs text-slate-500 bg-slate-50 rounded p-2 border">AG = Na − (Cl + HCO₃) | Corrected AG = AG + 2.5×(4.0−Albumin)</div>
    </div>
  );
}

function CalcCorrCa() {
  const [ca, setCa] = useState(""); const [alb, setAlb] = useState("");
  const result = useMemo(() => {
    const c = parseFloat(ca), a = parseFloat(alb);
    if (!c || !a) return null;
    const corrCa = c + 0.8 * (4.0 - a);
    const val = Math.round(corrCa * 100) / 100;
    let band: ResultBand;
    if (val < 8.5) band = { value: `${val} mg/dL`, label: "Hypocalcaemia (corrected)", color: "red", note: "True hypocalcaemia confirmed. Consider supplementation and investigate cause." };
    else if (val <= 10.5) band = { value: `${val} mg/dL`, label: "Normal corrected calcium (8.5–10.5)", color: "green", note: `Raw calcium ${c} was low due to hypoalbuminaemia (Alb ${a} g/dL).` };
    else band = { value: `${val} mg/dL`, label: "Hypercalcaemia (corrected)", color: "orange", note: "Corrected Ca elevated. Investigate: malignancy, hyperparathyroidism, vitamin D toxicity." };
    return band;
  }, [ca, alb]);
  return (
    <div className="grid gap-4">
      <Field label="Serum Calcium" unit="mg/dL" value={ca} onChange={setCa} step={0.1} />
      <Field label="Serum Albumin" unit="g/dL" value={alb} onChange={setAlb} step={0.1} />
      {result ? <ResultCard band={result} /> : <div className="text-slate-400 text-sm">Enter calcium and albumin to calculate.</div>}
      <div className="text-xs text-slate-500 bg-slate-50 rounded p-2 border">Corrected Ca = Measured Ca + 0.8 × (4.0 − Albumin)</div>
    </div>
  );
}

function CalcCorrNa() {
  const [na, setNa] = useState(""); const [glucose, setGlucose] = useState("");
  const result = useMemo(() => {
    const n = parseFloat(na), g = parseFloat(glucose);
    if (!n || !g) return null;
    const corrNa = n + 0.016 * (g - 100);
    const val = Math.round(corrNa * 10) / 10;
    let band: ResultBand;
    if (val < 135) band = { value: `${val} mEq/L`, label: "Hyponatraemia (corrected)", color: "orange", note: `Measured Na: ${n} mEq/L. True hyponatraemia persists after glucose correction.` };
    else if (val <= 145) band = { value: `${val} mEq/L`, label: "Normal sodium (corrected)", color: "green", note: `Measured Na of ${n} was spuriously low due to hyperglycaemia. True sodium is normal.` };
    else band = { value: `${val} mEq/L`, label: "Hypernatraemia (corrected)", color: "red" };
    return band;
  }, [na, glucose]);
  return (
    <div className="grid gap-4">
      <Field label="Measured Serum Sodium" unit="mEq/L" value={na} onChange={setNa} />
      <Field label="Serum Glucose" unit="mg/dL" value={glucose} onChange={setGlucose} />
      {result ? <ResultCard band={result} /> : <div className="text-slate-400 text-sm">Enter sodium and glucose to calculate.</div>}
      <div className="text-xs text-slate-500 bg-slate-50 rounded p-2 border">Corrected Na = Measured Na + 0.016 × (Glucose − 100) [Katz formula, 1.6 mEq/L per 100 mg/dL rise in glucose]</div>
    </div>
  );
}

function CalcOsmolality() {
  const [na, setNa] = useState(""); const [glucose, setGlucose] = useState(""); const [bun, setBun] = useState(""); const [measured, setMeasured] = useState("");
  const result = useMemo(() => {
    const n = parseFloat(na), g = parseFloat(glucose), b = parseFloat(bun);
    if (!n || !g || !b) return null;
    const calc = 2 * n + g / 18 + b / 2.8;
    const calcR = Math.round(calc * 10) / 10;
    const meas = parseFloat(measured);
    const gapStr = meas ? ` | Osmol Gap: ${Math.round((meas - calc) * 10) / 10} mOsm/kg` : "";
    const gapVal = meas ? meas - calc : null;
    const gapColor: ResultBand["color"] = gapVal && gapVal > 10 ? "red" : "green";
    const note = gapVal && gapVal > 10
      ? `Elevated osmol gap (>${10}) — consider methanol, ethylene glycol, ethanol, mannitol, or contrast media.`
      : meas ? "Normal osmol gap (<10). Unmeasured osmoles unlikely." : "Enter measured osmolality to calculate osmol gap.";
    return { value: `Calculated: ${calcR} mOsm/kg${gapStr}`, label: "Serum Osmolality", color: gapVal && gapVal > 10 ? gapColor : "blue", note } as ResultBand;
  }, [na, glucose, bun, measured]);
  return (
    <div className="grid gap-4">
      <Field label="Sodium" unit="mEq/L" value={na} onChange={setNa} />
      <Field label="Glucose" unit="mg/dL" value={glucose} onChange={setGlucose} />
      <Field label="BUN" unit="mg/dL" value={bun} onChange={setBun} />
      <Field label="Measured Osmolality" unit="mOsm/kg (optional, for osmol gap)" value={measured} onChange={setMeasured} />
      {result ? <ResultCard band={result} /> : <div className="text-slate-400 text-sm">Enter Na, glucose, and BUN to calculate.</div>}
      <div className="text-xs text-slate-500 bg-slate-50 rounded p-2 border">Serum Osm = 2×Na + Glucose/18 + BUN/2.8 | Osmol Gap = Measured − Calculated (normal &lt;10)</div>
    </div>
  );
}

function CalcWinters() {
  const [hco3, setHco3] = useState(""); const [pco2, setPco2] = useState("");
  const result = useMemo(() => {
    const h = parseFloat(hco3);
    if (!h) return null;
    const expectedLow = 1.5 * h + 6;
    const expectedHigh = 1.5 * h + 10;
    const measuredPco2 = parseFloat(pco2);
    let band: ResultBand;
    if (!measuredPco2) {
      band = { value: `Expected pCO₂: ${Math.round(expectedLow)}–${Math.round(expectedHigh)} mmHg`, label: "Winter's Formula", color: "blue", note: "Enter measured pCO₂ to interpret respiratory compensation." };
    } else if (measuredPco2 >= expectedLow - 2 && measuredPco2 <= expectedHigh + 2) {
      band = { value: `pCO₂: ${measuredPco2} mmHg (expected ${Math.round(expectedLow)}–${Math.round(expectedHigh)})`, label: "Appropriate respiratory compensation", color: "green", note: "Simple metabolic acidosis with adequate respiratory compensation." };
    } else if (measuredPco2 > expectedHigh + 2) {
      band = { value: `pCO₂: ${measuredPco2} mmHg (expected ${Math.round(expectedLow)}–${Math.round(expectedHigh)})`, label: "Concurrent respiratory acidosis", color: "red", note: "Respiratory compensation is insufficient. Concurrent respiratory acidosis present." };
    } else {
      band = { value: `pCO₂: ${measuredPco2} mmHg (expected ${Math.round(expectedLow)}–${Math.round(expectedHigh)})`, label: "Concurrent respiratory alkalosis", color: "orange", note: "Over-compensation. Concurrent respiratory alkalosis present." };
    }
    return band;
  }, [hco3, pco2]);
  return (
    <div className="grid gap-4">
      <Field label="Serum Bicarbonate (HCO₃⁻)" unit="mEq/L" value={hco3} onChange={setHco3} />
      <Field label="Measured pCO₂" unit="mmHg (optional, to interpret)" value={pco2} onChange={setPco2} />
      {result ? <ResultCard band={result} /> : <div className="text-slate-400 text-sm">Enter HCO₃⁻ to calculate.</div>}
      <div className="text-xs text-slate-500 bg-slate-50 rounded p-2 border">Expected pCO₂ = 1.5×HCO₃ + 8 ± 2 (Winter's Formula)</div>
    </div>
  );
}

function CalcDeltaDelta() {
  const [na, setNa] = useState(""); const [cl, setCl] = useState(""); const [hco3, setHco3] = useState(""); const [alb, setAlb] = useState("");
  const result = useMemo(() => {
    const n = parseFloat(na), c = parseFloat(cl), h = parseFloat(hco3);
    if (!n || !c || !h) return null;
    const ag = n - c - h;
    const albVal = parseFloat(alb);
    const corrAg = albVal ? ag + 2.5 * (4.0 - albVal) : ag;
    const deltaAg = corrAg - 12;
    const normalHco3 = 24;
    const deltaHco3 = normalHco3 - h;
    const ratio = deltaAg / (deltaHco3 || 1);
    const r = Math.round(ratio * 100) / 100;
    let band: ResultBand;
    if (ratio < 0.4) band = { value: `Δ/Δ = ${r}`, label: "Non-AG metabolic acidosis only (or minimal AG component)", color: "blue" };
    else if (ratio < 1.0) band = { value: `Δ/Δ = ${r}`, label: "Mixed AG + non-AG metabolic acidosis", color: "orange", note: "Both high-AG and non-AG processes are present." };
    else if (ratio <= 2.0) band = { value: `Δ/Δ = ${r}`, label: "Pure AG metabolic acidosis (1–2)", color: "yellow" };
    else band = { value: `Δ/Δ = ${r}`, label: "AG metabolic acidosis + concurrent metabolic alkalosis (>2)", color: "red", note: "The bicarbonate is higher than expected for the AG alone — concurrent metabolic alkalosis." };
    return band;
  }, [na, cl, hco3, alb]);
  return (
    <div className="grid gap-4">
      <Field label="Sodium" unit="mEq/L" value={na} onChange={setNa} />
      <Field label="Chloride" unit="mEq/L" value={cl} onChange={setCl} />
      <Field label="Bicarbonate (HCO₃⁻)" unit="mEq/L" value={hco3} onChange={setHco3} />
      <Field label="Albumin" unit="g/dL (for corrected AG)" value={alb} onChange={setAlb} step={0.1} />
      {result ? <ResultCard band={result} /> : <div className="text-slate-400 text-sm">Enter electrolytes to calculate.</div>}
      <div className="text-xs text-slate-500 bg-slate-50 rounded p-2 border">Δ/Δ = (AG − 12) / (24 − HCO₃) | 0.4–1: mixed; 1–2: pure AG; &gt;2: concurrent metabolic alkalosis</div>
    </div>
  );
}

function CalcCurb65() {
  const [conf, setConf] = useState(false); const [urea, setUrea] = useState(false);
  const [rr, setRr] = useState(false); const [bp, setBp] = useState(false); const [age, setAge] = useState(false);
  const result = useMemo(() => {
    const score = [conf, urea, rr, bp, age].filter(Boolean).length;
    let band: ResultBand;
    if (score <= 1) band = { value: `Score: ${score}`, label: "Low severity — outpatient treatment", color: "green", note: "Mortality <3%. Suitable for home-based care with oral antibiotics." };
    else if (score === 2) band = { value: `Score: ${score}`, label: "Moderate severity — consider short admission", color: "yellow", note: "Mortality 3–15%. Consider supervised outpatient or brief hospitalisation." };
    else band = { value: `Score: ${score}`, label: "High severity — hospitalise (consider ICU if 4–5)", color: "red", note: score >= 4 ? "Mortality >30–40%. Assess for ICU-level care." : "Mortality 15–30%. Inpatient treatment required." };
    return band;
  }, [conf, urea, rr, bp, age]);
  return (
    <div className="grid gap-1">
      <BoolRow label="Confusion" sublabel="New onset disorientation to person, place, or time" value={conf} onChange={setConf} />
      <BoolRow label="Urea >19 mg/dL (BUN >7 mmol/L)" value={urea} onChange={setUrea} />
      <BoolRow label="Respiratory rate ≥30/min" value={rr} onChange={setRr} />
      <BoolRow label="Low BP" sublabel="Systolic <90 mmHg or diastolic ≤60 mmHg" value={bp} onChange={setBp} />
      <BoolRow label="Age ≥65 years" value={age} onChange={setAge} />
      <ResultCard band={result} />
    </div>
  );
}

function CalcWellsDvt() {
  const [paralysis, setParalysis] = useState(false); const [bedrest, setBedrest] = useState(false);
  const [tenderness, setTenderness] = useState(false); const [swelling, setSwelling] = useState(false);
  const [calf, setCalf] = useState(false); const [pit, setPit] = useState(false);
  const [collateral, setCollateral] = useState(false); const [altDx, setAltDx] = useState(false);
  const [prevDvt, setPrevDvt] = useState(false);
  const result = useMemo(() => {
    let score = [paralysis, bedrest, tenderness, swelling, calf, pit, collateral, prevDvt].filter(Boolean).length;
    if (altDx) score -= 2;
    let band: ResultBand;
    if (score <= 0) band = { value: `Score: ${score}`, label: "Low probability DVT (<5%)", color: "green", note: "D-dimer alone may be sufficient to rule out DVT. If negative, no imaging needed." };
    else if (score <= 2) band = { value: `Score: ${score}`, label: "Moderate probability DVT (~17%)", color: "yellow", note: "D-dimer recommended. If elevated, proceed to ultrasound." };
    else band = { value: `Score: ${score}`, label: "High probability DVT (~53%)", color: "red", note: "Proceed directly to compression ultrasound. Anticoagulation may be started empirically." };
    return band;
  }, [paralysis, bedrest, tenderness, swelling, calf, pit, collateral, altDx, prevDvt]);
  return (
    <div className="grid gap-1">
      <BoolRow label="Active cancer (treatment within 6 months or palliative)" value={paralysis} onChange={setParalysis} />
      <BoolRow label="Paralysis / paresis / plaster immobilisation of leg" value={bedrest} onChange={setBedrest} />
      <BoolRow label="Bedridden >3 days OR major surgery within 12 weeks" value={tenderness} onChange={setTenderness} />
      <BoolRow label="Localised tenderness along deep venous system" value={swelling} onChange={setSwelling} />
      <BoolRow label="Entire leg swollen" value={calf} onChange={setCalf} />
      <BoolRow label="Calf swelling >3 cm compared with asymptomatic leg" value={pit} onChange={setPit} />
      <BoolRow label="Pitting oedema (confined to symptomatic leg)" value={collateral} onChange={setCollateral} />
      <BoolRow label="Collateral superficial veins (non-varicose)" value={prevDvt} onChange={setPrevDvt} />
      <BoolRow label="Alternative diagnosis at least as likely as DVT" sublabel="Subtracts 2 points" value={altDx} onChange={setAltDx} />
      <ResultCard band={result} />
    </div>
  );
}

function CalcWellsPe() {
  const [dvtSigns, setDvtSigns] = useState(false); const [altDx, setAltDx] = useState(false);
  const [hr, setHr] = useState(false); const [immob, setImmob] = useState(false);
  const [prevDvtPe, setPrevDvtPe] = useState(false); const [haemoptysis, setHaemoptysis] = useState(false);
  const [malignancy, setMalignancy] = useState(false);
  const result = useMemo(() => {
    let score = 0;
    if (dvtSigns) score += 3; if (altDx) score += 3; if (hr) score += 1.5;
    if (immob) score += 1.5; if (prevDvtPe) score += 1.5; if (haemoptysis) score += 1; if (malignancy) score += 1;
    let band: ResultBand;
    if (score < 2) band = { value: `Score: ${score}`, label: "Low probability PE (<15%)", color: "green", note: "D-dimer (ELISA) can safely rule out PE if negative." };
    else if (score <= 6) band = { value: `Score: ${score}`, label: "Moderate probability PE (~30%)", color: "yellow", note: "D-dimer recommended. If elevated or score >4 in two-level model, proceed to CT-PA." };
    else band = { value: `Score: ${score}`, label: "High probability PE (~65%)", color: "red", note: "CT pulmonary angiography recommended without delay. Empirical anticoagulation may be appropriate." };
    return band;
  }, [dvtSigns, altDx, hr, immob, prevDvtPe, haemoptysis, malignancy]);
  return (
    <div className="grid gap-1">
      <BoolRow label="Clinical signs/symptoms of DVT (+3)" sublabel="Leg swelling and pain on palpation of deep veins" value={dvtSigns} onChange={setDvtSigns} />
      <BoolRow label="PE is #1 diagnosis or equally likely (+3)" value={altDx} onChange={setAltDx} />
      <BoolRow label="Heart rate >100 bpm (+1.5)" value={hr} onChange={setHr} />
      <BoolRow label="Immobilisation ≥3 days or surgery within 4 weeks (+1.5)" value={immob} onChange={setImmob} />
      <BoolRow label="Previous DVT or PE (+1.5)" value={prevDvtPe} onChange={setPrevDvtPe} />
      <BoolRow label="Haemoptysis (+1)" value={haemoptysis} onChange={setHaemoptysis} />
      <BoolRow label="Malignancy (treatment within 6 months or palliative) (+1)" value={malignancy} onChange={setMalignancy} />
      <ResultCard band={result} />
    </div>
  );
}

function CalcHba1c() {
  const [hba1c, setHba1c] = useState(""); const [eag, setEag] = useState("");
  const fromHba1c = useMemo(() => {
    const h = parseFloat(hba1c);
    if (!h) return null;
    const eAgMg = 28.7 * h - 46.7;
    const eAgMmol = ((eAgMg - 2.52) / 18.18);
    return { mgdl: Math.round(eAgMg), mmoll: Math.round(eAgMmol * 10) / 10 };
  }, [hba1c]);
  const fromEag = useMemo(() => {
    const e = parseFloat(eag);
    if (!e) return null;
    const h = (e + 46.7) / 28.7;
    return Math.round(h * 10) / 10;
  }, [eag]);
  return (
    <div className="grid gap-4">
      <div>
        <Label className="text-sm font-semibold text-slate-600 mb-1 block uppercase tracking-wide">HbA1c → eAG</Label>
        <Field label="HbA1c" unit="%" value={hba1c} onChange={setHba1c} min={3} max={20} step={0.1} />
        {fromHba1c && (
          <ResultCard band={{ value: `${fromHba1c.mgdl} mg/dL  (${fromHba1c.mmoll} mmol/L)`, label: "Estimated Average Glucose", color: fromHba1c.mgdl < 154 ? "green" : fromHba1c.mgdl < 240 ? "yellow" : "red", note: `HbA1c ${hba1c}% corresponds to an average glucose of ~${fromHba1c.mgdl} mg/dL over the past 2–3 months.` }} />
        )}
      </div>
      <div className="border-t pt-4">
        <Label className="text-sm font-semibold text-slate-600 mb-1 block uppercase tracking-wide">eAG → HbA1c</Label>
        <Field label="Average Glucose" unit="mg/dL" value={eag} onChange={setEag} min={50} />
        {fromEag && <ResultCard band={{ value: `HbA1c ≈ ${fromEag}%`, label: "Estimated HbA1c", color: fromEag < 7 ? "green" : fromEag < 8 ? "yellow" : "red" }} />}
      </div>
      <div className="text-xs text-slate-500 bg-slate-50 rounded p-2 border">eAG (mg/dL) = 28.7 × HbA1c(%) − 46.7  [ADAG 2008]</div>
    </div>
  );
}

function CalcHomaIr() {
  const [glucose, setGlucose] = useState(""); const [insulin, setInsulin] = useState("");
  const result = useMemo(() => {
    const g = parseFloat(glucose), i = parseFloat(insulin);
    if (!g || !i) return null;
    const gMmol = g / 18;
    const homa = (gMmol * i) / 22.5;
    const val = Math.round(homa * 100) / 100;
    let band: ResultBand;
    if (val < 1) band = { value: val, label: "Normal insulin sensitivity", color: "green" };
    else if (val < 1.9) band = { value: val, label: "Normal–borderline (1.0–1.9)", color: "yellow" };
    else if (val < 2.9) band = { value: val, label: "Early insulin resistance (1.9–2.9)", color: "orange" };
    else band = { value: val, label: "Significant insulin resistance (≥2.9)", color: "red", note: "Associated with metabolic syndrome and T2DM risk." };
    return band;
  }, [glucose, insulin]);
  return (
    <div className="grid gap-4">
      <Field label="Fasting Glucose" unit="mg/dL" value={glucose} onChange={setGlucose} />
      <Field label="Fasting Insulin" unit="μIU/mL" value={insulin} onChange={setInsulin} step={0.1} />
      {result ? <ResultCard band={result} /> : <div className="text-slate-400 text-sm">Enter fasting glucose and insulin.</div>}
      <div className="text-xs text-slate-500 bg-slate-50 rounded p-2 border">HOMA-IR = (Glucose[mmol/L] × Insulin[μIU/mL]) / 22.5</div>
    </div>
  );
}

function CalcMifflin() {
  const [wt, setWt] = useState(""); const [ht, setHt] = useState(""); const [age, setAge] = useState(""); const [sex, setSex] = useState<"male"|"female">("male");
  const [activity, setActivity] = useState("1.55");
  const result = useMemo(() => {
    const w = parseFloat(wt), h = parseFloat(ht), a = parseFloat(age);
    if (!w || !h || !a) return null;
    const rmr = sex === "male" ? 10 * w + 6.25 * h - 5 * a + 5 : 10 * w + 6.25 * h - 5 * a - 161;
    const tdee = rmr * parseFloat(activity);
    return { value: `RMR: ${Math.round(rmr)} kcal/day`, label: `TDEE: ${Math.round(tdee)} kcal/day`, color: "blue", note: "Resting Metabolic Rate (RMR) × activity factor = Total Daily Energy Expenditure." } as ResultBand;
  }, [wt, ht, age, sex, activity]);
  const activityLevels = [["1.2","Sedentary"],["1.375","Light (1–3 days/wk)"],["1.55","Moderate (3–5 days/wk)"],["1.725","Active (6–7 days/wk)"],["1.9","Very active"]];
  return (
    <div className="grid gap-4">
      <Field label="Weight" unit="kg" value={wt} onChange={setWt} min={1} />
      <Field label="Height" unit="cm" value={ht} onChange={setHt} min={50} />
      <Field label="Age" unit="years" value={age} onChange={setAge} min={1} />
      <SexSelector value={sex} onChange={setSex} />
      <div>
        <Label className="text-sm font-medium text-slate-700 mb-1 block">Activity Level</Label>
        <div className="grid grid-cols-1 gap-1">
          {activityLevels.map(([v,l]) => (
            <button key={v} onClick={() => setActivity(v)} className={cn("text-xs px-3 py-1.5 rounded border text-left transition-colors", activity === v ? "bg-[#0B3D91] text-white border-[#0B3D91]" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50")}>{l}</button>
          ))}
        </div>
      </div>
      {result ? <ResultCard band={result} /> : <div className="text-slate-400 text-sm">Enter all values to calculate.</div>}
    </div>
  );
}

function CalcHarris() {
  const [wt, setWt] = useState(""); const [ht, setHt] = useState(""); const [age, setAge] = useState(""); const [sex, setSex] = useState<"male"|"female">("male");
  const result = useMemo(() => {
    const w = parseFloat(wt), h = parseFloat(ht), a = parseFloat(age);
    if (!w || !h || !a) return null;
    const bmr = sex === "male" ? 88.362 + 13.397 * w + 4.799 * h - 5.677 * a : 447.593 + 9.247 * w + 3.098 * h - 4.330 * a;
    return { value: `BMR: ${Math.round(bmr)} kcal/day`, label: "Harris-Benedict BMR", color: "blue", note: "Multiply by activity factor: ×1.2 (sedentary), ×1.375 (light), ×1.55 (moderate), ×1.725 (active)." } as ResultBand;
  }, [wt, ht, age, sex]);
  return (
    <div className="grid gap-4">
      <Field label="Weight" unit="kg" value={wt} onChange={setWt} min={1} />
      <Field label="Height" unit="cm" value={ht} onChange={setHt} min={50} />
      <Field label="Age" unit="years" value={age} onChange={setAge} min={1} />
      <SexSelector value={sex} onChange={setSex} />
      {result ? <ResultCard band={result} /> : <div className="text-slate-400 text-sm">Enter all values to calculate.</div>}
    </div>
  );
}

function CalcAnc() {
  const [wbc, setWbc] = useState(""); const [neut, setNeut] = useState(""); const [bands, setBands] = useState("");
  const result = useMemo(() => {
    const w = parseFloat(wbc), n = parseFloat(neut), b = parseFloat(bands) || 0;
    if (!w || !n) return null;
    const anc = w * (n + b) / 100;
    const val = Math.round(anc * 100) / 100;
    let band: ResultBand;
    if (val >= 1.5) band = { value: `${val} × 10³/µL`, label: "Normal ANC (≥1,500/µL)", color: "green" };
    else if (val >= 1.0) band = { value: `${val} × 10³/µL`, label: "Mild neutropenia (1,000–1,499)", color: "yellow", note: "Increased infection risk. Monitor closely." };
    else if (val >= 0.5) band = { value: `${val} × 10³/µL`, label: "Moderate neutropenia (500–999)", color: "orange", note: "Hold chemotherapy if cycle-related. High infection risk." };
    else band = { value: `${val} × 10³/µL`, label: "Severe neutropenia / agranulocytosis (<500)", color: "red", note: "Febrile neutropenia risk very high. Urgent assessment required. Consider G-CSF and broad-spectrum antibiotics." };
    return band;
  }, [wbc, neut, bands]);
  return (
    <div className="grid gap-4">
      <Field label="WBC" unit="× 10³/µL" value={wbc} onChange={setWbc} step={0.1} />
      <Field label="Neutrophils (Segs)" unit="%" value={neut} onChange={setNeut} max={100} />
      <Field label="Bands" unit="% (optional)" value={bands} onChange={setBands} max={100} />
      {result ? <ResultCard band={result} /> : <div className="text-slate-400 text-sm">Enter WBC and neutrophil % to calculate.</div>}
      <div className="text-xs text-slate-500 bg-slate-50 rounded p-2 border">ANC = WBC × (Neutrophils% + Bands%) / 100</div>
    </div>
  );
}

function CalcCorrectedWbc() {
  const [wbc, setWbc] = useState(""); const [nrbc, setNrbc] = useState("");
  const result = useMemo(() => {
    const w = parseFloat(wbc), n = parseFloat(nrbc);
    if (!w || !n) return null;
    const corrected = (w * 100) / (100 + n);
    const val = Math.round(corrected * 100) / 100;
    return { value: `${val} × 10³/µL`, label: "Corrected WBC", color: "blue", note: `Automated count was ${w} × 10³/µL. Corrected for ${n} NRBCs per 100 WBCs.` } as ResultBand;
  }, [wbc, nrbc]);
  return (
    <div className="grid gap-4">
      <Field label="Reported WBC" unit="× 10³/µL" value={wbc} onChange={setWbc} step={0.1} />
      <Field label="NRBCs" unit="per 100 WBCs" value={nrbc} onChange={setNrbc} />
      {result ? <ResultCard band={result} /> : <div className="text-slate-400 text-sm">Enter WBC and NRBC count.</div>}
      <div className="text-xs text-slate-500 bg-slate-50 rounded p-2 border">Corrected WBC = Reported WBC × 100 / (100 + NRBCs per 100 WBCs)</div>
    </div>
  );
}

function CalcGcs() {
  const [eye, setEye] = useState("4"); const [verbal, setVerbal] = useState("5"); const [motor, setMotor] = useState("6");
  const total = parseInt(eye) + parseInt(verbal) + parseInt(motor);
  const eyeOpts = [["4","4 — Spontaneous"],["3","3 — To voice"],["2","2 — To pain"],["1","1 — None"]];
  const verbalOpts = [["5","5 — Orientated"],["4","4 — Confused"],["3","3 — Words only"],["2","2 — Sounds only"],["1","1 — None"]];
  const motorOpts = [["6","6 — Obeys commands"],["5","5 — Localises pain"],["4","4 — Withdraws"],["3","3 — Abnormal flexion"],["2","2 — Extensor posturing"],["1","1 — None"]];
  let band: ResultBand;
  if (total >= 13) band = { value: `GCS: ${total}/15`, label: "Mild brain injury (13–15)", color: "yellow", note: "Monitor closely. CT head indicated if any loss of consciousness, amnesia, or focal deficits." };
  else if (total >= 9) band = { value: `GCS: ${total}/15`, label: "Moderate brain injury (9–12)", color: "orange", note: "Urgent CT head. Neurosurgical review. Airway protection may be required." };
  else band = { value: `GCS: ${total}/15`, label: "Severe brain injury (≤8) — intubate", color: "red", note: "GCS ≤8 is the traditional threshold for intubation. Urgent neurosurgical consultation." };
  const BtnGroup = ({ label, opts, val, setVal }: { label: string; opts: string[][]; val: string; setVal: (v: string) => void }) => (
    <div>
      <Label className="text-sm font-medium text-slate-700 mb-1 block">{label}</Label>
      <div className="grid grid-cols-1 gap-1">
        {opts.map(([v, l]) => (
          <button key={v} onClick={() => setVal(v)} className={cn("text-xs px-3 py-1.5 rounded border text-left transition-colors", val === v ? "bg-[#0B3D91] text-white border-[#0B3D91]" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50")}>{l}</button>
        ))}
      </div>
    </div>
  );
  return (
    <div className="grid gap-4">
      <BtnGroup label="Eye Opening (E)" opts={eyeOpts} val={eye} setVal={setEye} />
      <BtnGroup label="Verbal Response (V)" opts={verbalOpts} val={verbal} setVal={setVerbal} />
      <BtnGroup label="Motor Response (M)" opts={motorOpts} val={motor} setVal={setMotor} />
      <ResultCard band={band} />
    </div>
  );
}

function CalcSofa() {
  const [resp, setResp] = useState("0"); const [coag, setCoag] = useState("0");
  const [liver, setLiver] = useState("0"); const [cardio, setCardio] = useState("0");
  const [neuro, setNeuro] = useState("0"); const [renal, setRenal] = useState("0");
  const total = [resp, coag, liver, cardio, neuro, renal].reduce((s, v) => s + parseInt(v), 0);
  const mortality = total <= 1 ? "<10%" : total <= 5 ? "~15–20%" : total <= 9 ? "~40%" : total <= 11 ? "~50%" : ">80%";
  const band: ResultBand = { value: `Score: ${total}`, label: `Predicted mortality: ${mortality}`, color: total <= 2 ? "green" : total <= 7 ? "yellow" : total <= 10 ? "orange" : "red", note: "An increase in SOFA score ≥2 points defines organ dysfunction / sepsis (Sepsis-3)." };
  const ScoreRow = ({ label, opts, val, setVal }: { label: string; opts: string[][]; val: string; setVal: (v:string)=>void }) => (
    <div>
      <Label className="text-sm font-medium text-slate-700 mb-1 block">{label}</Label>
      <div className="flex flex-wrap gap-1">
        {opts.map(([v,l]) => (
          <button key={v} onClick={() => setVal(v)} className={cn("text-xs px-2 py-1 rounded border transition-colors", val === v ? "bg-[#0B3D91] text-white border-[#0B3D91]" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50")}>{v}: {l}</button>
        ))}
      </div>
    </div>
  );
  return (
    <div className="grid gap-3">
      <ScoreRow label="Respiration (PaO₂/FiO₂)" opts={[["0",">400"],["1","<400"],["2","<300"],["3","<200+vent"],["4","<100+vent"]]} val={resp} setVal={setResp} />
      <ScoreRow label="Coagulation (Platelets ×10³/µL)" opts={[["0",">150"],["1","<150"],["2","<100"],["3","<50"],["4","<20"]]} val={coag} setVal={setCoag} />
      <ScoreRow label="Liver (Bilirubin mg/dL)" opts={[["0","<1.2"],["1","1.2–1.9"],["2","2.0–5.9"],["3","6.0–11.9"],["4","≥12"]]} val={liver} setVal={setLiver} />
      <ScoreRow label="Cardiovascular (MAP/vasopressors)" opts={[["0","MAP≥70"],["1","MAP<70"],["2","Dopa≤5/Dobuta"],["3","Dopa>5/Epi≤0.1"],["4","Dopa>15/Epi>0.1"]]} val={cardio} setVal={setCardio} />
      <ScoreRow label="Neurological (GCS)" opts={[["0","15"],["1","13–14"],["2","10–12"],["3","6–9"],["4","<6"]]} val={neuro} setVal={setNeuro} />
      <ScoreRow label="Renal (Creatinine mg/dL)" opts={[["0","<1.2"],["1","1.2–1.9"],["2","2.0–3.4"],["3","3.5–4.9"],["4","≥5"]]} val={renal} setVal={setRenal} />
      <ResultCard band={band} />
    </div>
  );
}

function CalcParkland() {
  const [wt, setWt] = useState(""); const [tbsa, setTbsa] = useState("");
  const result = useMemo(() => {
    const w = parseFloat(wt), t = parseFloat(tbsa);
    if (!w || !t) return null;
    const total24h = 4 * w * t;
    const first8h = total24h / 2;
    const next16h = total24h / 2;
    return { value: `${Math.round(total24h)} mL over 24h`, label: "Lactated Ringer's (Parkland Formula)", color: "blue", note: `Give ${Math.round(first8h)} mL in first 8h (from time of burn), then ${Math.round(next16h)} mL over next 16h. Start colloid at 18–24h. Titrate to UO 0.5–1 mL/kg/h.` } as ResultBand;
  }, [wt, tbsa]);
  return (
    <div className="grid gap-4">
      <Field label="Weight" unit="kg" value={wt} onChange={setWt} min={1} />
      <Field label="TBSA burned" unit="% (2nd and 3rd degree only)" value={tbsa} onChange={setTbsa} min={1} max={100} />
      {result ? <ResultCard band={result} /> : <div className="text-slate-400 text-sm">Enter weight and % TBSA burned.</div>}
      <div className="text-xs text-slate-500 bg-slate-50 rounded p-2 border">Parkland formula: 4 mL × weight(kg) × TBSA(%) Lactated Ringer's in 24h. Half in first 8h from time of burn.</div>
    </div>
  );
}

function CalcPhenytoin() {
  const [level, setLevel] = useState(""); const [alb, setAlb] = useState(""); const [esrd, setEsrd] = useState(false);
  const result = useMemo(() => {
    const l = parseFloat(level), a = parseFloat(alb);
    if (!l || !a) return null;
    const divisor = esrd ? (0.1 * a + 0.1) : (0.2 * a + 0.1);
    const corrected = l / divisor;
    const val = Math.round(corrected * 10) / 10;
    let band: ResultBand;
    if (val < 10) band = { value: `${val} µg/mL`, label: "Sub-therapeutic (corrected)", color: "red", note: "Corrected level below therapeutic range (10–20 µg/mL). Consider dose increase." };
    else if (val <= 20) band = { value: `${val} µg/mL`, label: "Therapeutic range (10–20 µg/mL)", color: "green", note: `Reported level of ${l} µg/mL was falsely low due to hypoalbuminaemia.` };
    else band = { value: `${val} µg/mL`, label: "Potentially toxic (>20 µg/mL)", color: "red", note: "Corrected level in toxic range. Monitor for nystagmus, ataxia, mental status changes." };
    return band;
  }, [level, alb, esrd]);
  return (
    <div className="grid gap-4">
      <Field label="Reported Phenytoin Level" unit="µg/mL" value={level} onChange={setLevel} step={0.1} />
      <Field label="Serum Albumin" unit="g/dL" value={alb} onChange={setAlb} step={0.1} />
      <BoolRow label="ESRD / Renal failure" sublabel="Uses modified Winter-Tozer equation for renal patients" value={esrd} onChange={setEsrd} />
      {result ? <ResultCard band={result} /> : <div className="text-slate-400 text-sm">Enter phenytoin level and albumin.</div>}
      <div className="text-xs text-slate-500 bg-slate-50 rounded p-2 border">Standard: Corrected = Level / (0.2 × Alb + 0.1) | ESRD: Corrected = Level / (0.1 × Alb + 0.1)</div>
    </div>
  );
}

// ─── Calculator renderer ──────────────────────────────────────────────────────
const CALC_COMPONENTS: Record<string, React.FC> = {
  crcl: CalcCrCl, ckdepi: CalcCkdEpi, mdrd: CalcMdrd,
  bmi: CalcBmi, bsa: CalcBsa, ibw: CalcIbw, lbw: CalcLbw,
  chadsvasc: CalcChadsvasc, hasbled: CalcHasBled, ascvd: CalcAscvd,
  timi_nstemi: CalcTimi, grace: CalcGrace,
  childpugh: CalcChildPugh, meld: CalcMeld,
  aniongap: CalcAnionGap, corr_ca: CalcCorrCa, corr_na: CalcCorrNa,
  osmolality: CalcOsmolality, winters: CalcWinters, deltadelta: CalcDeltaDelta,
  curb65: CalcCurb65, wells_dvt: CalcWellsDvt, wells_pe: CalcWellsPe,
  hba1c: CalcHba1c, homa_ir: CalcHomaIr,
  mifflin: CalcMifflin, harris: CalcHarris,
  anc: CalcAnc, corrected_wbc: CalcCorrectedWbc,
  gcs: CalcGcs, sofa: CalcSofa, parkland: CalcParkland, phenytoin: CalcPhenytoin,
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Calculators() {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string>("crcl");

  const filtered = useMemo(() => {
    if (!search) return CALCULATORS;
    const q = search.toLowerCase();
    return CALCULATORS.filter(c => c.name.toLowerCase().includes(q) || c.category.toLowerCase().includes(q) || c.shortName.toLowerCase().includes(q));
  }, [search]);

  const grouped = useMemo(() => {
    const map = new Map<Category, CalcMeta[]>();
    filtered.forEach(c => { if (!map.has(c.category)) map.set(c.category, []); map.get(c.category)!.push(c); });
    return map;
  }, [filtered]);

  const selected = CALCULATORS.find(c => c.id === selectedId)!;
  const CalcComponent = CALC_COMPONENTS[selectedId];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-[#0B3D91] text-white shadow-md shrink-0">
        <div className="max-w-screen-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
              <PillBottle className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-lg leading-tight">PharmacyPal</div>
              <div className="text-xs text-blue-200">Medical Calculators</div>
            </div>
          </div>
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <div className="flex flex-1 max-w-screen-2xl mx-auto w-full overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 shrink-0 bg-white border-r border-slate-200 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search calculators…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8 h-9 text-sm"
              />
            </div>
            <div className="text-xs text-slate-400 mt-1.5 pl-1">{filtered.length} calculators</div>
          </div>
          <div className="flex-1 overflow-y-auto py-2">
            {Array.from(grouped.entries()).map(([cat, calcs]) => (
              <div key={cat} className="mb-1">
                <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                  {CATEGORY_ICONS[cat]} {cat}
                </div>
                {calcs.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedId(c.id)}
                    className={cn(
                      "w-full text-left px-4 py-2 text-sm transition-colors flex items-center justify-between gap-2",
                      selectedId === c.id
                        ? "bg-blue-50 text-[#0B3D91] font-semibold border-r-2 border-[#0B3D91]"
                        : "text-slate-700 hover:bg-slate-50"
                    )}
                  >
                    <span className="truncate">{c.shortName}</span>
                    {selectedId === c.id && <ChevronRight className="w-3 h-3 shrink-0" />}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </aside>

        {/* Main area */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-xl">
            {/* Calculator header */}
            <div className="mb-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#0B3D91]/10 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                  <Calculator className="w-5 h-5 text-[#0B3D91]" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900 leading-tight">{selected.name}</h1>
                  <p className="text-sm text-slate-500 mt-0.5">{selected.description}</p>
                  {selected.reference && (
                    <div className="flex items-center gap-1 mt-1">
                      <BookOpen className="w-3 h-3 text-slate-400" />
                      <span className="text-xs text-slate-400">{selected.reference}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Calculator form */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              {CalcComponent ? <CalcComponent /> : <div className="text-slate-400 text-sm">Calculator coming soon.</div>}
            </div>

            {/* Disclaimer */}
            <div className="mt-4 bg-slate-100 border border-slate-200 rounded-lg p-3 text-xs text-slate-500 flex items-start gap-2">
              <BookOpen className="w-3 h-3 mt-0.5 shrink-0" />
              <span>For clinical decision support only. Results do not replace clinical judgment or current guidelines. Always verify calculations in practice.</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
