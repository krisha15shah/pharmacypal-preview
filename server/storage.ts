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
import { db } from "./db";
import { eq } from "drizzle-orm";

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

export class DatabaseStorage implements IStorage {
  constructor() {
    // Initialize medications in database on first run
    this.initializeMedications();
  }

  private async initializeMedications() {
    // Check if medications already exist in database
    const existingMeds = await db.select().from(medications).limit(1);
    if (existingMeds.length > 0) {
      return; // Already initialized
    }
    // Real pharmaceutical data from diagnostic tool CSV
    const authenticMedications: InsertMedication[] = [
      {
        name: "Ibuprofen (Brufen)",
        genericName: "ibuprofen",
        category: "analgesis and antiinflammation",
        dosageForm: "600mg tablet",
        strength: "600mg",
        indications: ["pain", "inflammation", "osteoarthritis", "rheumatoid arthritis", "arthritis of the spine", "ankylosing spondylitis", "swollen joints", "frozen shoulder", "bursitis", "muscle pain"],
        contraindications: ["asthma", "urticuria", "angioedema", "peptic ulcer", "stomach ulcer", "acidity", "gastric bleeding"],
        interactions: ["NSAIDs", "blood thinners"],
        sideEffects: ["stomach upset", "gastric bleeding", "ulcers"],
        maxDailyDose: "2400mg",
        pregnancyCategory: "C",
        isOTC: true,
      },
      {
        name: "Ibuprofen Rapid (Brufen)",
        genericName: "ibuprofen",
        category: "analgesis and antiinflammation",
        dosageForm: "400mg softgel capsule",
        strength: "400mg",
        indications: ["headache", "pain management", "period pain", "back pain", "muscular pain", "rheumatoid pain", "fever", "cold and flu symptoms", "arthritis"],
        contraindications: ["pregnancy", "heart attack history", "heart conditions", "diabetes"],
        interactions: ["heart medications", "diabetes medications"],
        sideEffects: ["stomach upset", "cardiovascular effects"],
        maxDailyDose: "1200mg",
        pregnancyCategory: "C",
        isOTC: true,
      },
      {
        name: "Diclofenac Sodium",
        genericName: "diclofenac sodium",
        category: "analgesis and antiinflammation",
        dosageForm: "tablet",
        strength: "50mg",
        indications: ["pain", "inflammation", "arthritis", "muscle pain", "joint pain"],
        contraindications: ["hypertension", "cardiovascular issues", "heart disease", "high blood pressure"],
        interactions: ["blood pressure medications", "heart medications"],
        sideEffects: ["cardiovascular effects", "hypertension"],
        maxDailyDose: "150mg",
        pregnancyCategory: "C",
        isOTC: false,
      },
      {
        name: "Paracetamol",
        genericName: "paracetamol",
        category: "analgesic",
        dosageForm: "tablet",
        strength: "500mg",
        indications: ["pain", "fever", "headache", "muscle aches", "cold symptoms", "flu symptoms"],
        contraindications: ["liver disease", "severe liver impairment"],
        interactions: ["warfarin", "alcohol"],
        sideEffects: ["liver toxicity with overdose"],
        maxDailyDose: "4000mg",
        pregnancyCategory: "B",
        isOTC: true,
      }
    ];

    for (const med of authenticMedications) {
      await db.insert(medications).values(med);
    }
  }

  // Patient operations
  async getPatient(id: number): Promise<Patient | undefined> {
    const [patient] = await db.select().from(patients).where(eq(patients.id, id));
    return patient || undefined;
  }

  async createPatient(insertPatient: InsertPatient): Promise<Patient> {
    const [patient] = await db
      .insert(patients)
      .values(insertPatient)
      .returning();
    return patient;
  }

  async getAllPatients(): Promise<Patient[]> {
    return await db.select().from(patients);
  }

  // Medication operations
  async getMedication(id: number): Promise<Medication | undefined> {
    const [medication] = await db.select().from(medications).where(eq(medications.id, id));
    return medication || undefined;
  }

  async createMedication(insertMedication: InsertMedication): Promise<Medication> {
    const [medication] = await db
      .insert(medications)
      .values(insertMedication)
      .returning();
    return medication;
  }

  async getAllMedications(): Promise<Medication[]> {
    return await db.select().from(medications);
  }

  async searchMedications(query: string): Promise<Medication[]> {
    const allMedications = await this.getAllMedications();
    const lowerQuery = query.toLowerCase();
    return allMedications.filter(med =>
      med.name.toLowerCase().includes(lowerQuery) ||
      med.genericName?.toLowerCase().includes(lowerQuery) ||
      med.category.toLowerCase().includes(lowerQuery) ||
      med.indications?.some(ind => ind.toLowerCase().includes(lowerQuery))
    );
  }

  async getMedicationsByIndication(indication: string): Promise<Medication[]> {
    const allMedications = await this.getAllMedications();
    return allMedications.filter(med =>
      med.indications?.some(ind => ind.toLowerCase().includes(indication.toLowerCase()))
    );
  }

  // Consultation operations
  async getConsultation(id: number): Promise<Consultation | undefined> {
    const [consultation] = await db.select().from(consultations).where(eq(consultations.id, id));
    return consultation || undefined;
  }

  async createConsultation(insertConsultation: InsertConsultation): Promise<Consultation> {
    const [consultation] = await db
      .insert(consultations)
      .values(insertConsultation)
      .returning();
    return consultation;
  }

  async getConsultationsByPatient(patientId: number): Promise<Consultation[]> {
    return await db.select().from(consultations).where(eq(consultations.patientId, patientId));
  }

  async getRecentConsultations(limit: number = 10): Promise<Consultation[]> {
    return await db.select().from(consultations).orderBy(consultations.createdAt).limit(limit);
  }
}

export const storage = new DatabaseStorage();
