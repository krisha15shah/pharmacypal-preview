import { type Medication } from "@shared/schema";

// Clinical decision support utilities for medications
export const getMedicationsBySymptom = (medications: Medication[], symptom: string): Medication[] => {
  return medications.filter(med =>
    med.indications?.some(indication =>
      indication.toLowerCase().includes(symptom.toLowerCase())
    )
  );
};

export const checkDrugInteractions = (
  medication: Medication,
  currentMedications: string[]
): string[] => {
  const interactions: string[] = [];
  
  if (!medication.interactions) return interactions;
  
  for (const interaction of medication.interactions) {
    for (const currentMed of currentMedications) {
      if (currentMed.toLowerCase().includes(interaction.toLowerCase())) {
        interactions.push(interaction);
      }
    }
  }
  
  return interactions;
};

export const checkAllergies = (medication: Medication, allergies: string): boolean => {
  const allergyList = allergies.toLowerCase().split(',').map(a => a.trim());
  
  return allergyList.some(allergy =>
    medication.name.toLowerCase().includes(allergy) ||
    medication.genericName?.toLowerCase().includes(allergy) ||
    medication.category.toLowerCase().includes(allergy)
  );
};

export const checkContraindications = (
  medication: Medication,
  conditions: string[]
): string[] => {
  const contraindications: string[] = [];
  
  if (!medication.contraindications) return contraindications;
  
  for (const contraindication of medication.contraindications) {
    for (const condition of conditions) {
      if (condition.toLowerCase().includes(contraindication.toLowerCase())) {
        contraindications.push(contraindication);
      }
    }
  }
  
  return contraindications;
};

export const isPregnancySafe = (medication: Medication): boolean => {
  return medication.pregnancyCategory === "A" || medication.pregnancyCategory === "B";
};

export const getAgeAdjustedDosage = (
  medication: Medication,
  age: number,
  weight?: number
): string => {
  // Simplified age-based dosage adjustments
  if (age >= 65) {
    return "Reduce initial dose by 25-50% for elderly patients";
  }
  
  if (age < 18) {
    return "Pediatric dosing - consult pediatric guidelines";
  }
  
  return "Standard adult dosing";
};
