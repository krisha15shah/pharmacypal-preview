import {
  SYMPTOMS,
  CONDITIONS,
  CURRENT_MEDICATIONS,
  ALLERGIES,
  MEDICATIONS,
  POSSIBLE_CONDITIONS,
  REFERRAL_RULES,
  CONDITION_TO_SYMPTOMS,
  type MedicationRule,
  type PossibleCondition,
  type ReferralRule,
} from "./clinical-data";

export interface PatientProfile {
  age: number;
  gender: "male" | "female" | "other";
  isPregnant: boolean;
  isBreastfeeding: boolean;
  selectedSymptoms: string[];
  selectedConditions: string[];
  selectedMedications: string[];
  selectedAllergies: string[];
  weight?: number; // kg
  height?: number; // cm
}

export function calcBMI(weight: number, height: number): number {
  const hm = height / 100;
  return weight / (hm * hm);
}

export function bmiCategory(bmi: number): { label: string; color: string } {
  if (bmi < 18.5) return { label: "Underweight", color: "text-blue-600" };
  if (bmi < 25)   return { label: "Normal weight", color: "text-emerald-600" };
  if (bmi < 30)   return { label: "Overweight", color: "text-amber-600" };
  if (bmi < 35)   return { label: "Obese (Class I)", color: "text-orange-600" };
  return            { label: "Obese (Class II+)", color: "text-red-600" };
}

/** Parse a dose string containing mg/kg (e.g. "25–50 mg/kg/day") and return
 *  the calculated dose for a given weight. Returns null if no mg/kg found. */
export function calcWeightDose(doseStr: string, weightKg: number): string | null {
  const range = doseStr.match(/(\d+(?:\.\d+)?)\s*[–\-]\s*(\d+(?:\.\d+)?)\s*mg\/kg/i);
  if (range) {
    const lo = Math.round(parseFloat(range[1]) * weightKg);
    const hi = Math.round(parseFloat(range[2]) * weightKg);
    return `${lo}–${hi} mg  (for ${weightKg} kg)`;
  }
  const single = doseStr.match(/(\d+(?:\.\d+)?)\s*mg\/kg/i);
  if (single) {
    const dose = Math.round(parseFloat(single[1]) * weightKg);
    return `${dose} mg  (for ${weightKg} kg)`;
  }
  return null;
}

export interface MedicationResult {
  medication: MedicationRule;
  safetyLevel: "recommended" | "caution" | "avoid";
  avoidReasons: string[];
  cautionReasons: string[];
  activeInteractions: Array<{ drug: string; effect: string; severity: "mild" | "moderate" | "severe" }>;
}

export interface EngineResult {
  redFlags: Array<{ symptom: string; message: string }>;
  referralAdvice: Array<{ message: string; urgency: "emergency" | "urgent" | "routine"; reason: string }>;
  possibleConditions: PossibleCondition[];
  medicationResults: MedicationResult[];
  generalCounseling: string[];
}

export function runClinicalEngine(patient: PatientProfile): EngineResult {
  const redFlags: EngineResult["redFlags"] = [];
  const referralAdvice: EngineResult["referralAdvice"] = [];
  const possibleConditions: PossibleCondition[] = [];
  const medicationResults: MedicationResult[] = [];
  const generalCounseling: string[] = [];

  // ─── 1. RED FLAGS ───
  for (const symId of patient.selectedSymptoms) {
    const sym = SYMPTOMS.find((s) => s.id === symId);
    if (sym?.isRedFlag && sym.redFlagMessage) {
      redFlags.push({ symptom: sym.label, message: sym.redFlagMessage });
    }
  }

  // ─── 2. AGE-SPECIFIC RED FLAGS ───
  const hasFever = patient.selectedSymptoms.some((s) =>
    ["mild_fever", "high_fever", "very_high_fever"].includes(s)
  );
  if (hasFever && patient.age < 1) {
    referralAdvice.push({
      message: "Any fever in a child under 12 months (especially under 3 months) requires IMMEDIATE medical evaluation — do not self-treat.",
      urgency: "emergency",
      reason: "Infant fever: rule out serious bacterial infection (meningitis, sepsis)"
    });
  }

  // ─── 3. REFERRAL RULES ───
  for (const rule of REFERRAL_RULES) {
    const hasSymptomTrigger =
      !rule.triggerSymptoms ||
      rule.triggerSymptoms.some((s) => patient.selectedSymptoms.includes(s));
    const hasConditionTrigger =
      !rule.triggerConditions ||
      rule.triggerConditions.some((c) => patient.selectedConditions.includes(c));
    if (hasSymptomTrigger && hasConditionTrigger) {
      referralAdvice.push({
        message: rule.message,
        urgency: rule.urgency,
        reason: rule.reason
      });
    }
  }

  // ─── 4. POSSIBLE CONDITIONS ───
  for (const condition of POSSIBLE_CONDITIONS) {
    const matchCount = condition.triggerSymptoms.filter((s) =>
      patient.selectedSymptoms.includes(s)
    ).length;
    const minMatch = Math.ceil(condition.triggerSymptoms.length * 0.4);
    if (matchCount >= minMatch && matchCount >= 1) {
      possibleConditions.push(condition);
    }
  }
  // Sort by match count descending
  possibleConditions.sort((a, b) => {
    const aMatch = a.triggerSymptoms.filter((s) => patient.selectedSymptoms.includes(s)).length;
    const bMatch = b.triggerSymptoms.filter((s) => patient.selectedSymptoms.includes(s)).length;
    return bMatch - aMatch;
  });

  // ─── 5. MEDICATION FILTERING ───
  // Expand symptoms to include any implied by selected conditions
  const expandedSymptoms = new Set(patient.selectedSymptoms);
  for (const condId of patient.selectedConditions) {
    const implied = CONDITION_TO_SYMPTOMS[condId] ?? [];
    implied.forEach((s) => expandedSymptoms.add(s));
  }
  const activeSymptoms = Array.from(expandedSymptoms);

  for (const med of MEDICATIONS) {
    // Skip medications that don't address any active symptom (direct + condition-implied)
    const treatsSymptom = med.forSymptoms.some((s) => activeSymptoms.includes(s));
    if (!treatsSymptom) continue;

    const avoidReasons: string[] = [];
    const cautionReasons: string[] = [];
    const activeInteractions: MedicationResult["activeInteractions"] = [];

    // ─ Allergy check ─
    for (const allergyId of patient.selectedAllergies) {
      if (med.contraindications.allergies.includes(allergyId)) {
        const allergyLabel = ALLERGIES.find((a) => a.id === allergyId)?.label ?? allergyId;
        avoidReasons.push(`⚠️ Allergy: Patient has documented allergy to ${allergyLabel}`);
      }
    }

    // ─ Contraindicated conditions ─
    for (const condId of patient.selectedConditions) {
      if (med.contraindications.conditions.includes(condId)) {
        const condLabel = CONDITIONS.find((c) => c.id === condId)?.label ?? condId;
        avoidReasons.push(`Contraindicated in: ${condLabel}`);
      }
    }

    // ─ Contraindicated current medications ─
    for (const curMedId of patient.selectedMedications) {
      if (med.contraindications.medications.includes(curMedId)) {
        const curMedLabel =
          CURRENT_MEDICATIONS.find((m) => m.id === curMedId)?.label ?? curMedId;
        avoidReasons.push(`Contraindicated with current medication: ${curMedLabel}`);
      }
    }

    // ─ Pregnancy checks ─
    if (patient.isPregnant) {
      if (med.contraindications.pregnancy === "avoid") {
        avoidReasons.push(
          `Contraindicated in pregnancy. ${med.contraindications.pregnancyNote ?? ""}`
        );
      } else if (med.contraindications.pregnancy === "caution") {
        cautionReasons.push(
          `Use with caution in pregnancy. ${med.contraindications.pregnancyNote ?? ""}`
        );
      }
    }

    // ─ Breastfeeding checks ─
    if (patient.isBreastfeeding) {
      if (med.contraindications.breastfeeding === "avoid") {
        avoidReasons.push(
          `Avoid while breastfeeding. ${med.contraindications.breastfeedingNote ?? "Risk of harm to infant via breast milk."}`
        );
      } else if (med.contraindications.breastfeeding === "caution") {
        cautionReasons.push(
          `Caution while breastfeeding. ${med.contraindications.breastfeedingNote ?? "Monitor infant for any adverse effects."}`
        );
      } else if (med.contraindications.breastfeeding === "safe") {
        // safe — no warning needed, but note it in counseling (handled below)
      } else {
        // No breastfeeding data — add a generic caution
        cautionReasons.push(
          `Breastfeeding safety data limited for this medication. Consult physician before use.`
        );
      }
    }

    // ─ Age checks ─
    if (patient.age < med.contraindications.minAge) {
      avoidReasons.push(
        `Not suitable for this age group (minimum age: ${med.contraindications.minAge === 0.5 ? "6 months" : `${med.contraindications.minAge} years`})`
      );
    }

    // ─ Elderly checks ─
    if (patient.age >= 65) {
      if (med.contraindications.elderlyRisk === "avoid") {
        avoidReasons.push(
          `Avoid in elderly (≥65 years). ${med.contraindications.elderlyNote ?? ""}`
        );
      } else if (med.contraindications.elderlyRisk === "caution") {
        cautionReasons.push(
          `Caution in elderly: ${med.contraindications.elderlyNote ?? "Use lower doses and monitor closely."}`
        );
      }
    }

    // ─ BMI / Weight-based safety checks ─
    if (patient.weight && patient.height) {
      const bmi = calcBMI(patient.weight, patient.height);
      const cat = bmiCategory(bmi).label;
      const isObese = bmi >= 30;
      const isUnderweight = bmi < 18.5;
      const isLowWeight = patient.weight < 45;

      // NSAIDs + obesity → higher CV and GI risk
      if (med.category.toLowerCase().includes("nsaid") && isObese) {
        cautionReasons.push(
          `Obesity (BMI ${bmi.toFixed(1)} — ${cat}): significantly increases cardiovascular and GI bleeding risk with NSAIDs. Use lowest dose, shortest duration, with PPI cover.`
        );
      }

      // Tramadol + obesity → use ideal body weight
      if (med.id === "tramadol" && isObese) {
        cautionReasons.push(
          `Obese patient (BMI ${bmi.toFixed(1)}): dose tramadol on Ideal Body Weight, not actual weight — avoids accumulation and respiratory depression risk.`
        );
      }

      // CNS-active drugs + underweight / very low weight
      const cnsActive = ["tramadol", "pregabalin", "diphenhydramine", "thiocolchicoside"].includes(med.id);
      if (cnsActive && (isUnderweight || isLowWeight)) {
        cautionReasons.push(
          `Low body weight (${patient.weight} kg, BMI ${bmi.toFixed(1)} — ${cat}): start at the lowest dose and titrate slowly — increased sensitivity to CNS-active medications.`
        );
      }

      // Corticosteroids + obesity
      if (med.id === "prednisolone" && isObese) {
        cautionReasons.push(
          `Obesity (BMI ${bmi.toFixed(1)}): higher risk of hyperglycaemia, hypertension, and fluid retention with systemic corticosteroids. Monitor BP and glucose closely.`
        );
      }

      // Antibiotics with weight-based paediatric dosing — add note for low-weight adults
      const hasWeightDosing = /mg\/kg/i.test(med.dosage.adult + " " + (med.dosage.pediatric ?? ""));
      if (hasWeightDosing && patient.age >= 16 && isLowWeight) {
        cautionReasons.push(
          `Low body weight (${patient.weight} kg): standard adult fixed dose may be relatively high — consider weight-adjusted dosing and confirm with prescriber.`
        );
      }
    }

    // ─ Gender checks ─
    if (patient.gender === "male" && med.forSymptoms.includes("menstrual_pain")) {
      // menstrual pain medications are still listed as they treat general pain
      // no gender restriction in drug rules
    }

    // ─ Drug interactions ─
    for (const interaction of med.interactions) {
      if (patient.selectedMedications.includes(interaction.withMed)) {
        const curMedLabel =
          CURRENT_MEDICATIONS.find((m) => m.id === interaction.withMed)?.label ??
          interaction.withMed;
        activeInteractions.push({
          drug: curMedLabel,
          effect: interaction.effect,
          severity: interaction.severity
        });
        if (interaction.severity === "severe") {
          avoidReasons.push(
            `Severe drug interaction with ${curMedLabel}: ${interaction.effect}`
          );
        } else if (interaction.severity === "moderate") {
          cautionReasons.push(
            `Moderate interaction with ${curMedLabel}: ${interaction.effect}`
          );
        }
      }
    }

    // ─ Determine safety level ─
    let safetyLevel: MedicationResult["safetyLevel"];
    if (avoidReasons.length > 0) {
      safetyLevel = "avoid";
    } else if (cautionReasons.length > 0) {
      safetyLevel = "caution";
    } else {
      safetyLevel = "recommended";
    }

    medicationResults.push({
      medication: med,
      safetyLevel,
      avoidReasons,
      cautionReasons,
      activeInteractions
    });
  }

  // Sort: recommended first, then caution, then avoid
  medicationResults.sort((a, b) => {
    const order = { recommended: 0, caution: 1, avoid: 2 };
    return order[a.safetyLevel] - order[b.safetyLevel];
  });

  // ─── 6. GENERAL COUNSELING ───
  if (patient.selectedSymptoms.includes("diarrhea") || patient.selectedSymptoms.includes("vomiting")) {
    generalCounseling.push("Hydration is the priority — ensure adequate fluid and electrolyte intake. Use ORS.");
  }
  if (patient.isPregnant) {
    generalCounseling.push("Always consult your physician or obstetrician before taking any medication during pregnancy.");
    generalCounseling.push("Paracetamol is the preferred analgesic/antipyretic in pregnancy.");
  }
  if (patient.isBreastfeeding) {
    generalCounseling.push("Always consult your physician before taking any medication while breastfeeding — many drugs pass into breast milk.");
    generalCounseling.push("Paracetamol and ibuprofen are generally considered safe during breastfeeding at standard doses.");
    generalCounseling.push("Timing medication doses immediately after a feed or just before the infant's longest sleep period can minimise infant exposure.");
  }
  if (patient.age >= 65) {
    generalCounseling.push("Elderly patients are more sensitive to medication side effects. Use the lowest effective dose.");
    generalCounseling.push("Avoid anticholinergic medications in elderly patients — risk of confusion, falls, and urinary retention (Beers Criteria).");
  }
  if (
    patient.selectedSymptoms.includes("mild_fever") ||
    patient.selectedSymptoms.includes("high_fever")
  ) {
    generalCounseling.push("Stay well-hydrated and rest. Fever is a natural immune response; treat if causing discomfort or above 38.5°C.");
  }
  if (
    patient.selectedConditions.includes("hypertension") ||
    patient.selectedConditions.includes("heart_disease")
  ) {
    generalCounseling.push("Avoid NSAIDs (ibuprofen, diclofenac, aspirin analgesic dose) — they raise blood pressure and reduce antihypertensive effectiveness.");
  }
  if (patient.selectedConditions.includes("peptic_ulcer") || patient.selectedConditions.includes("gerd_chronic")) {
    generalCounseling.push("Avoid NSAIDs and aspirin (analgesic dose) — they damage the stomach lining and worsen ulcers.");
  }
  if (patient.selectedConditions.includes("kidney_disease")) {
    generalCounseling.push("NSAIDs are contraindicated in kidney disease — they reduce renal blood flow and can worsen kidney function.");
    generalCounseling.push("Many medications require dose adjustment in renal impairment — always check with a pharmacist or physician.");
  }
  if (patient.selectedConditions.includes("liver_disease")) {
    generalCounseling.push("Paracetamol dose should be reduced to maximum 2g/day in liver disease. Avoid NSAIDs.");
  }
  if (patient.selectedMedications.includes("warfarin") || patient.selectedMedications.includes("dabigatran_rivaroxaban")) {
    generalCounseling.push("Patient is on anticoagulants — avoid all NSAIDs (ibuprofen, diclofenac, aspirin, naproxen). Risk of serious bleeding.");
  }

  return { redFlags, referralAdvice, possibleConditions, medicationResults, generalCounseling };
}
