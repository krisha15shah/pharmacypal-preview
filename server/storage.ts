import { 
  patients, 
  medications, 
  consultations,
  type Patient, 
  type InsertPatient,
  type Medication,
  type InsertMedication,
  type Consultation,
  type InsertConsultation
} from "@shared/schema";

export interface IStorage {
  // Patient operations
  getPatient(id: number): Promise<Patient | undefined>;
  createPatient(patient: InsertPatient): Promise<Patient>;
  getAllPatients(): Promise<Patient[]>;
  
  // Medication operations
  getMedication(id: number): Promise<Medication | undefined>;
  createMedication(medication: InsertMedication): Promise<Medication>;
  getAllMedications(): Promise<Medication[]>;
  searchMedications(query: string): Promise<Medication[]>;
  getMedicationsByIndication(indication: string): Promise<Medication[]>;
  
  // Consultation operations
  getConsultation(id: number): Promise<Consultation | undefined>;
  createConsultation(consultation: InsertConsultation): Promise<Consultation>;
  getConsultationsByPatient(patientId: number): Promise<Consultation[]>;
  getRecentConsultations(limit?: number): Promise<Consultation[]>;
}

export class MemStorage implements IStorage {
  private patients: Map<number, Patient>;
  private medications: Map<number, Medication>;
  private consultations: Map<number, Consultation>;
  private currentPatientId: number;
  private currentMedicationId: number;
  private currentConsultationId: number;

  constructor() {
    this.patients = new Map();
    this.medications = new Map();
    this.consultations = new Map();
    this.currentPatientId = 1;
    this.currentMedicationId = 1;
    this.currentConsultationId = 1;
    
    // Initialize with common medications
    this.initializeMedications();
  }

  private initializeMedications() {
    const commonMedications: InsertMedication[] = [
      // Pain & Fever Management
      {
        name: "Acetaminophen (Tylenol)",
        genericName: "acetaminophen",
        category: "analgesic",
        dosageForm: "tablet",
        strength: "500mg",
        indications: ["pain", "fever", "headache", "muscle aches", "back pain", "arthritis", "cold symptoms"],
        contraindications: ["liver disease", "alcohol dependency"],
        interactions: ["warfarin", "alcohol"],
        sideEffects: ["nausea", "rash"],
        maxDailyDose: "3000mg",
        pregnancyCategory: "B",
        isOTC: true,
      },
      {
        name: "Ibuprofen (Advil)",
        genericName: "ibuprofen",
        category: "NSAID",
        dosageForm: "tablet",
        strength: "200mg",
        indications: ["pain", "inflammation", "fever", "headache", "muscle aches", "back pain", "arthritis", "menstrual cramps"],
        contraindications: ["kidney disease", "heart disease", "stomach ulcers"],
        interactions: ["ACE inhibitors", "warfarin", "lithium"],
        sideEffects: ["stomach upset", "dizziness", "rash"],
        maxDailyDose: "1200mg",
        pregnancyCategory: "C",
        isOTC: true,
      },
      {
        name: "Naproxen (Aleve)",
        genericName: "naproxen",
        category: "NSAID",
        dosageForm: "tablet",
        strength: "220mg",
        indications: ["pain", "inflammation", "fever", "arthritis", "muscle aches", "back pain", "menstrual cramps"],
        contraindications: ["kidney disease", "heart disease", "stomach ulcers"],
        interactions: ["ACE inhibitors", "warfarin", "lithium"],
        sideEffects: ["stomach upset", "dizziness", "headache"],
        maxDailyDose: "660mg",
        pregnancyCategory: "C",
        isOTC: true,
      },
      
      // Allergy & Cold Medications
      {
        name: "Diphenhydramine (Benadryl)",
        genericName: "diphenhydramine",
        category: "antihistamine",
        dosageForm: "capsule",
        strength: "25mg",
        indications: ["allergies", "itching", "sleep aid", "cold symptoms", "runny nose", "sneezing"],
        contraindications: ["narrow-angle glaucoma", "prostate enlargement"],
        interactions: ["sedatives", "alcohol", "MAO inhibitors"],
        sideEffects: ["drowsiness", "dry mouth", "blurred vision"],
        maxDailyDose: "300mg",
        pregnancyCategory: "B",
        isOTC: true,
      },
      {
        name: "Loratadine (Claritin)",
        genericName: "loratadine",
        category: "antihistamine",
        dosageForm: "tablet",
        strength: "10mg",
        indications: ["allergic rhinitis", "urticaria", "allergies", "runny nose", "sneezing", "itchy eyes"],
        contraindications: ["liver disease"],
        interactions: ["ketoconazole", "erythromycin"],
        sideEffects: ["headache", "fatigue", "dry mouth"],
        maxDailyDose: "10mg",
        pregnancyCategory: "B",
        isOTC: true,
      },
      {
        name: "Cetirizine (Zyrtec)",
        genericName: "cetirizine",
        category: "antihistamine",
        dosageForm: "tablet",
        strength: "10mg",
        indications: ["allergies", "allergic rhinitis", "urticaria", "runny nose", "sneezing", "itchy eyes"],
        contraindications: ["kidney disease"],
        interactions: ["alcohol", "sedatives"],
        sideEffects: ["drowsiness", "dry mouth", "fatigue"],
        maxDailyDose: "10mg",
        pregnancyCategory: "B",
        isOTC: true,
      },
      
      // Cough & Cold
      {
        name: "Guaifenesin (Mucinex)",
        genericName: "guaifenesin",
        category: "expectorant",
        dosageForm: "tablet",
        strength: "400mg",
        indications: ["cough", "chest congestion", "cold symptoms", "bronchitis"],
        contraindications: [],
        interactions: [],
        sideEffects: ["nausea", "vomiting", "dizziness"],
        maxDailyDose: "2400mg",
        pregnancyCategory: "C",
        isOTC: true,
      },
      {
        name: "Dextromethorphan (Robitussin DM)",
        genericName: "dextromethorphan",
        category: "cough suppressant",
        dosageForm: "syrup",
        strength: "15mg/5ml",
        indications: ["dry cough", "cold symptoms", "cough"],
        contraindications: ["MAO inhibitors"],
        interactions: ["MAO inhibitors", "SSRIs"],
        sideEffects: ["drowsiness", "nausea", "dizziness"],
        maxDailyDose: "120mg",
        pregnancyCategory: "C",
        isOTC: true,
      },
      {
        name: "Pseudoephedrine (Sudafed)",
        genericName: "pseudoephedrine",
        category: "decongestant",
        dosageForm: "tablet",
        strength: "30mg",
        indications: ["nasal congestion", "sinus congestion", "cold symptoms"],
        contraindications: ["hypertension", "heart disease", "diabetes"],
        interactions: ["MAO inhibitors", "blood pressure medications"],
        sideEffects: ["nervousness", "insomnia", "increased heart rate"],
        maxDailyDose: "240mg",
        pregnancyCategory: "C",
        isOTC: true,
      },
      
      // Digestive Health
      {
        name: "Omeprazole (Prilosec)",
        genericName: "omeprazole",
        category: "PPI",
        dosageForm: "capsule",
        strength: "20mg",
        indications: ["GERD", "peptic ulcer", "heartburn", "acid reflux", "stomach pain"],
        contraindications: [],
        interactions: ["clopidogrel", "warfarin", "digoxin"],
        sideEffects: ["headache", "diarrhea", "abdominal pain"],
        maxDailyDose: "40mg",
        pregnancyCategory: "C",
        isOTC: true,
      },
      {
        name: "Famotidine (Pepcid AC)",
        genericName: "famotidine",
        category: "H2 blocker",
        dosageForm: "tablet",
        strength: "20mg",
        indications: ["heartburn", "acid reflux", "GERD", "stomach pain"],
        contraindications: ["kidney disease"],
        interactions: ["ketoconazole", "digoxin"],
        sideEffects: ["headache", "dizziness", "constipation"],
        maxDailyDose: "40mg",
        pregnancyCategory: "B",
        isOTC: true,
      },
      {
        name: "Simethicone (Gas-X)",
        genericName: "simethicone",
        category: "antiflatulent",
        dosageForm: "tablet",
        strength: "80mg",
        indications: ["gas", "bloating", "stomach discomfort"],
        contraindications: [],
        interactions: [],
        sideEffects: ["minimal"],
        maxDailyDose: "500mg",
        pregnancyCategory: "C",
        isOTC: true,
      },
      {
        name: "Loperamide (Imodium)",
        genericName: "loperamide",
        category: "antidiarrheal",
        dosageForm: "capsule",
        strength: "2mg",
        indications: ["diarrhea", "loose stools"],
        contraindications: ["bacterial infections", "bloody diarrhea"],
        interactions: ["opioids"],
        sideEffects: ["constipation", "dizziness", "nausea"],
        maxDailyDose: "16mg",
        pregnancyCategory: "C",
        isOTC: true,
      },
      
      // Sleep & Anxiety
      {
        name: "Melatonin",
        genericName: "melatonin",
        category: "sleep aid",
        dosageForm: "tablet",
        strength: "3mg",
        indications: ["insomnia", "sleep disorders", "jet lag"],
        contraindications: ["autoimmune disorders"],
        interactions: ["blood thinners", "immunosuppressants"],
        sideEffects: ["drowsiness", "headache", "dizziness"],
        maxDailyDose: "10mg",
        pregnancyCategory: "C",
        isOTC: true,
      },
      
      // Topical Treatments
      {
        name: "Hydrocortisone Cream",
        genericName: "hydrocortisone",
        category: "topical corticosteroid",
        dosageForm: "cream",
        strength: "1%",
        indications: ["rash", "eczema", "itching", "skin irritation", "dermatitis"],
        contraindications: ["viral skin infections", "fungal infections"],
        interactions: [],
        sideEffects: ["skin thinning", "burning sensation"],
        maxDailyDose: "Apply 2-3 times daily",
        pregnancyCategory: "C",
        isOTC: true,
      },
      {
        name: "Calamine Lotion",
        genericName: "calamine",
        category: "topical anti-itch",
        dosageForm: "lotion",
        strength: "8%",
        indications: ["itching", "rash", "poison ivy", "insect bites", "skin irritation"],
        contraindications: [],
        interactions: [],
        sideEffects: ["skin dryness"],
        maxDailyDose: "Apply as needed",
        pregnancyCategory: "C",
        isOTC: true,
      },
      
      // Women's Health
      {
        name: "Miconazole (Monistat)",
        genericName: "miconazole",
        category: "antifungal",
        dosageForm: "cream",
        strength: "2%",
        indications: ["yeast infection", "vaginal itching", "fungal infections"],
        contraindications: [],
        interactions: ["warfarin"],
        sideEffects: ["burning", "irritation"],
        maxDailyDose: "Apply as directed",
        pregnancyCategory: "C",
        isOTC: true,
      },
      
      // Vitamins & Supplements
      {
        name: "Vitamin D3",
        genericName: "cholecalciferol",
        category: "vitamin",
        dosageForm: "tablet",
        strength: "1000 IU",
        indications: ["vitamin D deficiency", "bone health", "immune support"],
        contraindications: ["hypercalcemia"],
        interactions: ["thiazide diuretics"],
        sideEffects: ["nausea", "constipation"],
        maxDailyDose: "4000 IU",
        pregnancyCategory: "C",
        isOTC: true,
      },
      {
        name: "Multivitamin",
        genericName: "multivitamin",
        category: "vitamin",
        dosageForm: "tablet",
        strength: "varies",
        indications: ["nutritional support", "vitamin deficiency", "general health"],
        contraindications: ["iron overload"],
        interactions: ["warfarin", "tetracyclines"],
        sideEffects: ["nausea", "constipation"],
        maxDailyDose: "One daily",
        pregnancyCategory: "A",
        isOTC: true,
      }
    ];

    commonMedications.forEach(med => {
      this.createMedication(med);
    });
  }

  // Patient operations
  async getPatient(id: number): Promise<Patient | undefined> {
    return this.patients.get(id);
  }

  async createPatient(insertPatient: InsertPatient): Promise<Patient> {
    const id = this.currentPatientId++;
    const patient: Patient = {
      ...insertPatient,
      id,
      createdAt: new Date(),
    };
    this.patients.set(id, patient);
    return patient;
  }

  async getAllPatients(): Promise<Patient[]> {
    return Array.from(this.patients.values());
  }

  // Medication operations
  async getMedication(id: number): Promise<Medication | undefined> {
    return this.medications.get(id);
  }

  async createMedication(insertMedication: InsertMedication): Promise<Medication> {
    const id = this.currentMedicationId++;
    const medication: Medication = {
      ...insertMedication,
      id,
    };
    this.medications.set(id, medication);
    return medication;
  }

  async getAllMedications(): Promise<Medication[]> {
    return Array.from(this.medications.values());
  }

  async searchMedications(query: string): Promise<Medication[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.medications.values()).filter(med =>
      med.name.toLowerCase().includes(lowerQuery) ||
      med.genericName?.toLowerCase().includes(lowerQuery) ||
      med.category.toLowerCase().includes(lowerQuery) ||
      med.indications?.some(ind => ind.toLowerCase().includes(lowerQuery))
    );
  }

  async getMedicationsByIndication(indication: string): Promise<Medication[]> {
    return Array.from(this.medications.values()).filter(med =>
      med.indications?.some(ind => ind.toLowerCase().includes(indication.toLowerCase()))
    );
  }

  // Consultation operations
  async getConsultation(id: number): Promise<Consultation | undefined> {
    return this.consultations.get(id);
  }

  async createConsultation(insertConsultation: InsertConsultation): Promise<Consultation> {
    const id = this.currentConsultationId++;
    const consultation: Consultation = {
      ...insertConsultation,
      id,
      createdAt: new Date(),
    };
    this.consultations.set(id, consultation);
    return consultation;
  }

  async getConsultationsByPatient(patientId: number): Promise<Consultation[]> {
    return Array.from(this.consultations.values()).filter(
      consultation => consultation.patientId === patientId
    );
  }

  async getRecentConsultations(limit: number = 10): Promise<Consultation[]> {
    return Array.from(this.consultations.values())
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
