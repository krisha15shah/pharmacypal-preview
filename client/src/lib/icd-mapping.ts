// Maps ICD-10-CM codes → internal symptom IDs used by the clinical engine.
// Source: ICD-10-CM 2024 classification chapters.
export function icdToSymptomId(code: string): string | null {
  const c = code.toUpperCase().replace(/\s/g, "");
  if (c.startsWith("R51")) return "headache";
  if (c.startsWith("M54")) return "back_pain";
  if (c.startsWith("M25.5") || c.startsWith("M13") || c.startsWith("M79.6")) return "joint_pain";
  if (c.startsWith("M79.3") || c.startsWith("M79.1") || c.startsWith("R68.89")) return "body_ache";
  if (c.startsWith("R50.0") || c.startsWith("R50.8")) return "high_fever";
  if (c.startsWith("R50.9") || c.startsWith("R50")) return "mild_fever";
  if (c.startsWith("J02") || c.startsWith("J06.0")) return "sore_throat";
  if (c.startsWith("R05")) return "dry_cough";
  if (c.startsWith("R09.3")) return "productive_cough";
  if (c.startsWith("R11")) return "nausea_vomiting";
  if (c.startsWith("R19.7") || c.startsWith("A09") || c.startsWith("K59.1")) return "diarrhea";
  if (c.startsWith("K59.0")) return "constipation";
  if (c.startsWith("R10")) return "abdominal_pain";
  if (c.startsWith("L30") || c.startsWith("L20") || c.startsWith("L23") || c.startsWith("L50") || c.startsWith("L29")) return "skin_rash";
  if (c.startsWith("J30") || c.startsWith("J31") || c.startsWith("R09.89")) return "runny_nose";
  if (c.startsWith("J06.9") || c.startsWith("J34")) return "nasal_congestion";
  if (c.startsWith("H92")) return "ear_pain";
  if (c.startsWith("K08.8") || c.startsWith("K08.9") || c.startsWith("K10")) return "toothache";
  if (c.startsWith("N94")) return "menstrual_pain";
  if (c.startsWith("R07")) return "chest_pain";
  if (c.startsWith("G47")) return "difficulty_sleeping";
  if (c.startsWith("F41")) return "anxiety_symptoms";
  if (c.startsWith("R30") || c.startsWith("R31") || c.startsWith("R35")) return "urinary_symptoms";
  if (c.startsWith("R42") || c.startsWith("H81")) return "dizziness";
  if (c.startsWith("H52") || c.startsWith("H53")) return "eye_symptoms";
  if (c.startsWith("R41.3") || c.startsWith("R41.0")) return "confusion_memory";
  return null;
}

// Maps ICD-10-CM codes → internal condition IDs used by the clinical engine.
export function icdToConditionId(code: string): string | null {
  const c = code.toUpperCase().replace(/\s/g, "");
  if (c === "I10" || c.startsWith("I11") || c.startsWith("I12") || c.startsWith("I13") || c.startsWith("I1A")) return "hypertension";
  if (c.startsWith("E11")) return "diabetes_t2";
  if (c.startsWith("E10")) return "diabetes_t2"; // same drug-safety rules apply
  if (c.startsWith("E13")) return "diabetes_t2"; // other specified diabetes
  if (c.startsWith("J45")) return "asthma";
  if (c.startsWith("J44")) return "copd";
  if (c.startsWith("I50")) return "heart_failure";
  if (c.startsWith("N18")) return "ckd";
  if (
    c.startsWith("K70") || c.startsWith("K71") || c.startsWith("K72") ||
    c.startsWith("K73") || c.startsWith("K74") || c.startsWith("K75") || c.startsWith("K76")
  ) return "liver_disease";
  if (c.startsWith("K25") || c.startsWith("K26") || c.startsWith("K27") || c.startsWith("K28")) return "peptic_ulcer";
  if (c.startsWith("K21")) return "gerd";
  if (c.startsWith("G40") || c.startsWith("G41")) return "epilepsy";
  if (c.startsWith("H40") || c.startsWith("H42")) return "glaucoma";
  if (
    c.startsWith("E00") || c.startsWith("E01") || c.startsWith("E02") ||
    c.startsWith("E03") || c.startsWith("E04") || c.startsWith("E05") ||
    c.startsWith("E06") || c.startsWith("E07")
  ) return "thyroid_disease";
  if (c.startsWith("M10") || c.startsWith("M1A")) return "gout";
  if (c.startsWith("F32") || c.startsWith("F33")) return "depression";
  if (c.startsWith("F41")) return "anxiety";
  if (c.startsWith("G20") || c.startsWith("G21")) return "parkinsons";
  if (c.startsWith("M80") || c.startsWith("M81")) return "osteoporosis";
  if (c.startsWith("D65") || c.startsWith("D66") || c.startsWith("D67") || c.startsWith("D68") || c.startsWith("D69")) return "bleeding_disorder";
  if (c.startsWith("I48")) return "atrial_fibrillation";
  if (c.startsWith("I20") || c.startsWith("I25")) return "ischemic_heart_disease";
  if (c.startsWith("E78")) return "hyperlipidemia";
  if (c.startsWith("J06") || c.startsWith("J00")) return null; // common cold — symptom not condition
  return null;
}

// Maps ICD-10-CM Z88 drug allergy codes → internal allergy IDs.
// Z88 chapter: "Allergy status to drugs, medicaments and biological substances"
export function icdToAllergyId(code: string): string | null {
  const c = code.toUpperCase().replace(/\s/g, "");
  if (c === "Z88.0") return "penicillin_allergy";
  if (c === "Z88.1") return "penicillin_allergy"; // cephalosporins — cross-reactivity risk
  if (c === "Z88.2") return "sulfonamide_allergy";
  if (c === "Z88.3") return null; // other antibiotics — no specific rule but record
  if (c === "Z88.4") return null; // anesthetic — no specific rule
  if (c === "Z88.5") return "opioid_allergy";
  if (c === "Z88.6") return "nsaid_allergy"; // analgesic agent = NSAIDs
  if (c === "Z88.7") return null; // serum / vaccine
  if (c === "Z88.8") return "other_drug_allergy";
  if (c === "Z88.9") return "other_drug_allergy";
  if (c.startsWith("Z88")) return "other_drug_allergy";
  if (c.startsWith("T78.1")) return null; // food allergy — not applicable to drug rules
  if (c.startsWith("L23.3") || c.startsWith("L23.4")) return "latex_allergy";
  return null;
}

// Human-readable label for an internal allergy ID
export const ALLERGY_LABELS: Record<string, string> = {
  penicillin_allergy: "Penicillin / Beta-lactam",
  sulfonamide_allergy: "Sulfonamide",
  nsaid_allergy: "NSAIDs / Analgesics",
  opioid_allergy: "Opioids / Narcotics",
  other_drug_allergy: "Other Drug",
  latex_allergy: "Latex",
};

// Clinical chapter badge colours for ICD codes
export function icdChapterColor(code: string): { bg: string; text: string; chapter: string } {
  const c = code.toUpperCase();
  if (c.startsWith("R")) return { bg: "bg-blue-100", text: "text-blue-700", chapter: "Symptoms" };
  if (c.startsWith("Z88")) return { bg: "bg-red-100", text: "text-red-700", chapter: "Drug Allergy" };
  if (c.startsWith("Z")) return { bg: "bg-slate-100", text: "text-slate-600", chapter: "Status / History" };
  if (c.startsWith("I")) return { bg: "bg-red-100", text: "text-red-700", chapter: "Cardiovascular" };
  if (c.startsWith("E")) return { bg: "bg-yellow-100", text: "text-yellow-700", chapter: "Endocrine" };
  if (c.startsWith("J")) return { bg: "bg-sky-100", text: "text-sky-700", chapter: "Respiratory" };
  if (c.startsWith("K")) return { bg: "bg-orange-100", text: "text-orange-700", chapter: "Digestive" };
  if (c.startsWith("N")) return { bg: "bg-purple-100", text: "text-purple-700", chapter: "Genitourinary" };
  if (c.startsWith("M")) return { bg: "bg-amber-100", text: "text-amber-700", chapter: "Musculoskeletal" };
  if (c.startsWith("G") || c.startsWith("F")) return { bg: "bg-violet-100", text: "text-violet-700", chapter: "Neurological/Mental" };
  if (c.startsWith("L")) return { bg: "bg-rose-100", text: "text-rose-700", chapter: "Skin" };
  if (c.startsWith("H")) return { bg: "bg-teal-100", text: "text-teal-700", chapter: "Sensory" };
  if (c.startsWith("D")) return { bg: "bg-pink-100", text: "text-pink-700", chapter: "Blood/Haematology" };
  if (c.startsWith("A") || c.startsWith("B")) return { bg: "bg-lime-100", text: "text-lime-700", chapter: "Infectious" };
  return { bg: "bg-slate-100", text: "text-slate-600", chapter: "Other" };
}
