export interface LabDef {
  id: string;
  label: string;
  unit: string;
  low?: number;
  high?: number;
  lowFemale?: number;
  highFemale?: number;
  criticalLow?: number;
  criticalHigh?: number;
  note?: string;
}

export interface LabCategory {
  id: string;
  label: string;
  labs: LabDef[];
}

export const LAB_CATEGORIES: LabCategory[] = [
  {
    id: "electrolytes",
    label: "Electrolytes",
    labs: [
      { id: "na", label: "Sodium", unit: "mEq/L", low: 136, high: 142, criticalLow: 120, criticalHigh: 160 },
      { id: "k", label: "Potassium", unit: "mEq/L", low: 3.5, high: 5.0, criticalLow: 2.5, criticalHigh: 6.5 },
      { id: "cl", label: "Chloride", unit: "mEq/L", low: 96, high: 106 },
      { id: "co2", label: "CO₂ / Bicarbonate", unit: "mEq/L", low: 22, high: 28 },
      { id: "ca_total", label: "Calcium (total)", unit: "mg/dL", low: 8.2, high: 10.2, criticalLow: 6.5, criticalHigh: 13 },
      { id: "ca_ionized", label: "Calcium (ionized)", unit: "mg/dL", low: 4.6, high: 5.1 },
      { id: "mg", label: "Magnesium", unit: "mEq/L", low: 1.3, high: 2.1, criticalLow: 0.5, criticalHigh: 5 },
      { id: "phos", label: "Phosphorus", unit: "mg/dL", low: 2.3, high: 4.7 },
    ],
  },
  {
    id: "renal",
    label: "Renal",
    labs: [
      { id: "bun", label: "BUN", unit: "mg/dL", low: 8, high: 23, criticalHigh: 100 },
      { id: "creatinine", label: "Creatinine (SCr)", unit: "mg/dL", low: 0.6, high: 1.2, lowFemale: 0.5, highFemale: 1.1, criticalHigh: 10 },
      { id: "crcl", label: "CrCl (clearance)", unit: "mL/min/1.73m²", low: 75, high: 125 },
      { id: "osmolality", label: "Osmolality", unit: "mOsm/kg", low: 275, high: 295 },
      { id: "uric_acid", label: "Uric Acid", unit: "mg/dL", low: 4, high: 8 },
    ],
  },
  {
    id: "liver",
    label: "Liver / Hepatic",
    labs: [
      { id: "alt", label: "ALT (SGPT)", unit: "U/L", low: 10, high: 40, criticalHigh: 1000 },
      { id: "ast", label: "AST (SGOT)", unit: "U/L", low: 10, high: 30, criticalHigh: 1000 },
      { id: "alp", label: "ALP", unit: "IU/L", low: 30, high: 120 },
      { id: "ggt", label: "GGT", unit: "U/L", low: 2, high: 30 },
      { id: "bili_total", label: "Bilirubin (total)", unit: "mg/dL", low: 0.3, high: 1.2, criticalHigh: 15 },
      { id: "bili_direct", label: "Bilirubin (direct)", unit: "mg/dL", low: 0.1, high: 0.3 },
      { id: "albumin", label: "Albumin", unit: "g/dL", low: 3.5, high: 5.0, criticalLow: 2.0 },
      { id: "prealbumin", label: "Prealbumin", unit: "mg/dL", low: 19.5, high: 35.8 },
      { id: "ammonia", label: "Ammonia", unit: "mcg/dL", low: 15, high: 45, criticalHigh: 200 },
      { id: "ldh", label: "LDH", unit: "U/L", low: 100, high: 200 },
    ],
  },
  {
    id: "metabolic",
    label: "Metabolic / Glycaemic",
    labs: [
      { id: "glucose", label: "Glucose (serum)", unit: "mg/dL", low: 70, high: 110, criticalLow: 40, criticalHigh: 500 },
      { id: "hba1c", label: "HbA1c", unit: "%", low: 4, high: 7 },
      { id: "ferritin", label: "Ferritin", unit: "ng/mL", low: 15, high: 200 },
      { id: "insulin_f", label: "Insulin (fasting)", unit: "μIU/mL", low: 2, high: 25 },
    ],
  },
  {
    id: "pancreatic",
    label: "Pancreatic",
    labs: [
      { id: "amylase", label: "Amylase", unit: "U/L", low: 27, high: 131 },
      { id: "lipase", label: "Lipase", unit: "U/L", low: 31, high: 186 },
    ],
  },
  {
    id: "cardiac",
    label: "Cardiac / Inflammatory",
    labs: [
      { id: "ck", label: "Creatinine Kinase (CK)", unit: "U/L", low: 40, high: 150 },
      { id: "crp", label: "C-Reactive Protein", unit: "mg/L", low: 0.08, high: 3.1 },
    ],
  },
  {
    id: "lipids",
    label: "Lipids",
    labs: [
      { id: "total_chol", label: "Total Cholesterol", unit: "mg/dL", high: 200, note: "Desirable < 200" },
      { id: "hdl", label: "HDL Cholesterol", unit: "mg/dL", low: 60, lowFemale: 50, note: "Desirable ≥ 60 (men), ≥ 50 (women)" },
      { id: "ldl", label: "LDL Cholesterol", unit: "mg/dL", high: 100, note: "Optimal < 100" },
      { id: "tg", label: "Triglycerides", unit: "mg/dL", high: 150, note: "Desirable < 150" },
    ],
  },
  {
    id: "hematology",
    label: "Hematology (CBC)",
    labs: [
      { id: "wbc", label: "WBC", unit: "×10³/mm³", low: 4.5, high: 11.0, criticalLow: 2.0, criticalHigh: 30 },
      { id: "rbc", label: "RBC", unit: "×10⁶/mm³", low: 4.5, high: 5.9, lowFemale: 4.1, highFemale: 5.1 },
      { id: "hgb", label: "Hemoglobin (Hgb)", unit: "g/dL", low: 14, high: 18, lowFemale: 12, highFemale: 16, criticalLow: 7 },
      { id: "hct", label: "Hematocrit (Hct)", unit: "%", low: 42, high: 50, lowFemale: 36, highFemale: 45 },
      { id: "mcv", label: "MCV", unit: "fL", low: 80, high: 100 },
      { id: "mch", label: "MCH", unit: "pg", low: 26, high: 34 },
      { id: "mchc", label: "MCHC", unit: "g/dL", low: 33, high: 37 },
      { id: "plt", label: "Platelets", unit: "×10³/mm³", low: 150, high: 350, criticalLow: 50, criticalHigh: 1000 },
      { id: "retic", label: "Reticulocytes", unit: "%", low: 0.5, high: 1.5 },
    ],
  },
  {
    id: "coagulation",
    label: "Coagulation",
    labs: [
      { id: "pt", label: "PT", unit: "seconds", low: 10, high: 13, criticalHigh: 40 },
      { id: "ptt", label: "PTT", unit: "seconds", low: 25, high: 40, criticalHigh: 100 },
      { id: "inr", label: "INR", unit: "", low: 0.9, high: 1.1, criticalHigh: 5 },
    ],
  },
  {
    id: "blood_gases",
    label: "Blood Gases (Arterial)",
    labs: [
      { id: "ph_art", label: "pH (arterial)", unit: "", low: 7.35, high: 7.45, criticalLow: 7.2, criticalHigh: 7.6 },
      { id: "pco2", label: "PCO₂", unit: "mmHg", low: 35, high: 45 },
      { id: "po2", label: "PO₂", unit: "mmHg", low: 80, high: 100, criticalLow: 40 },
      { id: "sao2", label: "SaO₂", unit: "%", low: 90, note: "> 90%" },
      { id: "hco3_art", label: "HCO₃ (bicarb)", unit: "mEq/L", low: 22, high: 26 },
    ],
  },
  {
    id: "urinalysis",
    label: "Urinalysis",
    labs: [
      { id: "urine_ph", label: "Urine pH", unit: "", low: 4.5, high: 8.0 },
      { id: "urine_sg", label: "Specific Gravity", unit: "", low: 1.010, high: 1.025 },
    ],
  },
  {
    id: "thyroid",
    label: "Thyroid",
    labs: [
      { id: "tsh", label: "TSH", unit: "mIU/L", low: 0.4, high: 4.0, criticalLow: 0.01, criticalHigh: 100 },
      { id: "ft4", label: "Free T4", unit: "ng/dL", low: 0.8, high: 1.8 },
      { id: "ft3", label: "Free T3", unit: "pg/mL", low: 2.3, high: 4.2 },
      { id: "t4_total", label: "T4 (total)", unit: "mcg/dL", low: 4.5, high: 12.5 },
      { id: "t3_total", label: "T3 (total)", unit: "ng/dL", low: 80, high: 220 },
    ],
  },
  {
    id: "vitamins",
    label: "Vitamins & Minerals",
    labs: [
      { id: "vit_d", label: "Vitamin D (25-OH)", unit: "ng/mL", low: 30, high: 100 },
      { id: "vit_b12", label: "Vitamin B12", unit: "pg/mL", low: 200, high: 900 },
      { id: "folate", label: "Folate (serum)", unit: "ng/mL", low: 3.1, high: 17.5 },
      { id: "iron", label: "Iron (serum)", unit: "mcg/dL", low: 60, high: 170, lowFemale: 50, highFemale: 170 },
      { id: "tibc", label: "TIBC", unit: "mcg/dL", low: 250, high: 370 },
      { id: "transferrin_sat", label: "Transferrin Saturation", unit: "%", low: 20, high: 50 },
    ],
  },
  {
    id: "hormones",
    label: "Hormones",
    labs: [
      { id: "cortisol_am", label: "Cortisol (AM)", unit: "mcg/dL", low: 6, high: 23 },
      { id: "testosterone", label: "Testosterone (total)", unit: "ng/dL", low: 300, high: 1000, lowFemale: 15, highFemale: 70 },
      { id: "prolactin", label: "Prolactin", unit: "ng/mL", high: 20, highFemale: 25 },
      { id: "fsh", label: "FSH", unit: "mIU/mL", low: 1.5, high: 12.4, lowFemale: 3.5, highFemale: 12.5 },
      { id: "lh", label: "LH", unit: "mIU/mL", low: 1.7, high: 8.6, lowFemale: 2.4, highFemale: 12.6 },
      { id: "estradiol", label: "Estradiol", unit: "pg/mL", high: 50, lowFemale: 30, highFemale: 400 },
      { id: "psa", label: "PSA (total)", unit: "ng/mL", high: 4, note: "Men only — < 4 ng/mL" },
      { id: "hcg", label: "β-hCG", unit: "mIU/mL", high: 5, note: "Non-pregnant: < 5" },
      { id: "dhea_s", label: "DHEA-S", unit: "mcg/dL", low: 80, high: 560, lowFemale: 35, highFemale: 430 },
      { id: "aldosterone", label: "Aldosterone (upright)", unit: "ng/dL", low: 7, high: 30 },
      { id: "igf1", label: "IGF-1", unit: "ng/mL", low: 100, high: 300 },
    ],
  },
];

export function getLabStatus(
  def: LabDef,
  value: number,
  gender: string
): "normal" | "high" | "low" | "critical-high" | "critical-low" {
  const low = gender === "female" && def.lowFemale !== undefined ? def.lowFemale : def.low;
  const high = gender === "female" && def.highFemale !== undefined ? def.highFemale : def.high;

  if (def.criticalLow !== undefined && value < def.criticalLow) return "critical-low";
  if (def.criticalHigh !== undefined && value > def.criticalHigh) return "critical-high";
  if (low !== undefined && value < low) return "low";
  if (high !== undefined && value > high) return "high";
  return "normal";
}

export function getRefRangeText(def: LabDef, gender: string): string {
  const low = gender === "female" && def.lowFemale !== undefined ? def.lowFemale : def.low;
  const high = gender === "female" && def.highFemale !== undefined ? def.highFemale : def.high;

  if (low !== undefined && high !== undefined) return `${low}–${high}`;
  if (low !== undefined) return `≥ ${low}`;
  if (high !== undefined) return `< ${high}`;
  return def.note ?? "";
}
