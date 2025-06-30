import { type Patient, type Medication, type SafetyAlert } from "@shared/schema";

// Clinical decision support rules engine
export class ClinicalRulesEngine {
  static evaluatePatientSafety(
    patient: Patient,
    medication: Medication
  ): {
    safetyLevel: "safe" | "caution" | "avoid";
    alerts: SafetyAlert[];
    clinicalNote: string;
  } {
    const alerts: SafetyAlert[] = [];
    let safetyLevel: "safe" | "caution" | "avoid" = "safe";
    let clinicalNote = "";

    // Check allergies
    if (this.checkAllergies(patient, medication)) {
      alerts.push({
        level: "high",
        type: "allergy",
        message: `Patient has documented allergy to ${medication.name} or its class`,
        medication: medication.name,
      });
      safetyLevel = "avoid";
    }

    // Check contraindications
    const contraindications = this.checkContraindications(patient, medication);
    if (contraindications.length > 0) {
      alerts.push({
        level: "high",
        type: "contraindication",
        message: `Contraindicated due to: ${contraindications.join(", ")}`,
        medication: medication.name,
      });
      safetyLevel = "avoid";
    }

    // Check drug interactions
    const interactions = this.checkDrugInteractions(patient, medication);
    if (interactions.length > 0) {
      alerts.push({
        level: "medium",
        type: "interaction",
        message: `Potential interactions with: ${interactions.join(", ")}`,
        medication: medication.name,
      });
      if (safetyLevel !== "avoid") safetyLevel = "caution";
    }

    // Pregnancy safety
    if (patient.isPregnant) {
      const pregnancyRisk = this.assessPregnancyRisk(medication);
      if (pregnancyRisk.level === "high") {
        alerts.push(pregnancyRisk.alert);
        safetyLevel = "avoid";
      } else if (pregnancyRisk.level === "medium") {
        alerts.push(pregnancyRisk.alert);
        if (safetyLevel !== "avoid") safetyLevel = "caution";
      }
    }

    // Age-based considerations
    if (patient.age >= 65) {
      const ageAlert = this.assessAgeRisk(patient, medication);
      if (ageAlert) {
        alerts.push(ageAlert);
        if (safetyLevel === "safe") safetyLevel = "caution";
      }
    }

    // Generate clinical note
    clinicalNote = this.generateClinicalNote(patient, medication, safetyLevel);

    return { safetyLevel, alerts, clinicalNote };
  }

  private static checkAllergies(patient: Patient, medication: Medication): boolean {
    if (!patient.allergies) return false;
    
    const allergies = patient.allergies.toLowerCase();
    return (
      allergies.includes(medication.name.toLowerCase()) ||
      allergies.includes(medication.genericName?.toLowerCase() || "") ||
      allergies.includes(medication.category.toLowerCase())
    );
  }

  private static checkContraindications(patient: Patient, medication: Medication): string[] {
    const contraindications: string[] = [];
    
    if (!medication.contraindications || !patient.chronicConditions) {
      return contraindications;
    }

    for (const contraindication of medication.contraindications) {
      for (const condition of patient.chronicConditions) {
        if (condition.toLowerCase().includes(contraindication.toLowerCase())) {
          contraindications.push(contraindication);
        }
      }
    }

    return contraindications;
  }

  private static checkDrugInteractions(patient: Patient, medication: Medication): string[] {
    const interactions: string[] = [];
    
    if (!medication.interactions || !patient.currentMedications) {
      return interactions;
    }

    const currentMeds = patient.currentMedications.toLowerCase();
    
    for (const interaction of medication.interactions) {
      if (currentMeds.includes(interaction.toLowerCase())) {
        interactions.push(interaction);
      }
    }

    return interactions;
  }

  private static assessPregnancyRisk(medication: Medication): {
    level: "low" | "medium" | "high";
    alert: SafetyAlert;
  } {
    switch (medication.pregnancyCategory) {
      case "X":
        return {
          level: "high",
          alert: {
            level: "high",
            type: "contraindication",
            message: "Contraindicated in pregnancy - Category X",
            medication: medication.name,
          },
        };
      case "D":
        return {
          level: "medium",
          alert: {
            level: "medium",
            type: "contraindication",
            message: "Use with extreme caution in pregnancy - Category D",
            medication: medication.name,
          },
        };
      case "C":
        return {
          level: "medium",
          alert: {
            level: "medium",
            type: "contraindication",
            message: "Use with caution in pregnancy - Category C",
            medication: medication.name,
          },
        };
      default:
        return {
          level: "low",
          alert: {
            level: "low",
            type: "dosage",
            message: "Generally safe in pregnancy",
            medication: medication.name,
          },
        };
    }
  }

  private static assessAgeRisk(patient: Patient, medication: Medication): SafetyAlert | null {
    // Special considerations for elderly patients
    if (patient.age >= 65) {
      // Anticholinergic medications
      if (medication.name.toLowerCase().includes("diphenhydramine")) {
        return {
          level: "medium",
          type: "dosage",
          message: "Use caution in elderly - increased risk of falls and confusion",
          medication: medication.name,
        };
      }
      
      // NSAIDs
      if (medication.category.toLowerCase() === "nsaid") {
        return {
          level: "medium",
          type: "dosage",
          message: "Use lowest effective dose in elderly - increased GI and kidney risk",
          medication: medication.name,
        };
      }
    }

    return null;
  }

  private static generateClinicalNote(
    patient: Patient,
    medication: Medication,
    safetyLevel: "safe" | "caution" | "avoid"
  ): string {
    let note = "";

    switch (safetyLevel) {
      case "safe":
        note = `Safe for this patient. `;
        if (patient.chronicConditions?.includes("Hypertension")) {
          note += "Compatible with hypertension management. ";
        }
        if (medication.category === "analgesic") {
          note += "Monitor for effectiveness and side effects.";
        }
        break;
      case "caution":
        note = `Use with caution. `;
        if (patient.age >= 65) {
          note += "Consider dose reduction due to age. ";
        }
        note += "Monitor closely for adverse effects.";
        break;
      case "avoid":
        note = `Not recommended for this patient due to safety concerns.`;
        break;
    }

    return note;
  }
}
