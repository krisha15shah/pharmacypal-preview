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
      {
        name: "Acetaminophen (Tylenol)",
        genericName: "acetaminophen",
        category: "analgesic",
        dosageForm: "tablet",
        strength: "500mg",
        indications: ["pain", "fever", "headache"],
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
        indications: ["pain", "inflammation", "fever"],
        contraindications: ["kidney disease", "heart disease", "stomach ulcers"],
        interactions: ["ACE inhibitors", "warfarin", "lithium"],
        sideEffects: ["stomach upset", "dizziness", "rash"],
        maxDailyDose: "1200mg",
        pregnancyCategory: "C",
        isOTC: true,
      },
      {
        name: "Diphenhydramine (Benadryl)",
        genericName: "diphenhydramine",
        category: "antihistamine",
        dosageForm: "capsule",
        strength: "25mg",
        indications: ["allergies", "itching", "sleep aid"],
        contraindications: ["narrow-angle glaucoma", "prostate enlargement"],
        interactions: ["sedatives", "alcohol", "MAO inhibitors"],
        sideEffects: ["drowsiness", "dry mouth", "blurred vision"],
        maxDailyDose: "300mg",
        pregnancyCategory: "B",
        isOTC: true,
      },
      {
        name: "Guaifenesin (Mucinex)",
        genericName: "guaifenesin",
        category: "expectorant",
        dosageForm: "tablet",
        strength: "400mg",
        indications: ["cough", "chest congestion"],
        contraindications: [],
        interactions: [],
        sideEffects: ["nausea", "vomiting", "dizziness"],
        maxDailyDose: "2400mg",
        pregnancyCategory: "C",
        isOTC: true,
      },
      {
        name: "Loratadine (Claritin)",
        genericName: "loratadine",
        category: "antihistamine",
        dosageForm: "tablet",
        strength: "10mg",
        indications: ["allergic rhinitis", "urticaria"],
        contraindications: ["liver disease"],
        interactions: ["ketoconazole", "erythromycin"],
        sideEffects: ["headache", "fatigue", "dry mouth"],
        maxDailyDose: "10mg",
        pregnancyCategory: "B",
        isOTC: true,
      },
      {
        name: "Omeprazole (Prilosec)",
        genericName: "omeprazole",
        category: "PPI",
        dosageForm: "capsule",
        strength: "20mg",
        indications: ["GERD", "peptic ulcer", "heartburn"],
        contraindications: [],
        interactions: ["clopidogrel", "warfarin", "digoxin"],
        sideEffects: ["headache", "diarrhea", "abdominal pain"],
        maxDailyDose: "40mg",
        pregnancyCategory: "C",
        isOTC: true,
      },
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
