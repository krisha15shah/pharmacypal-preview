import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  age: integer("age").notNull(),
  weight: integer("weight"), // in kg
  gender: text("gender").notNull(),
  symptoms: text("symptoms"),
  chronicConditions: text("chronic_conditions").array(),
  allergies: text("allergies"),
  currentMedications: text("current_medications"),
  isPregnant: boolean("is_pregnant").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const medications = pgTable("medications", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  genericName: text("generic_name"),
  category: text("category").notNull(),
  dosageForm: text("dosage_form").notNull(),
  strength: text("strength"),
  indications: text("indications").array(),
  contraindications: text("contraindications").array(),
  interactions: text("interactions").array(),
  sideEffects: text("side_effects").array(),
  maxDailyDose: text("max_daily_dose"),
  pregnancyCategory: text("pregnancy_category"),
  isOTC: boolean("is_otc").default(true),
});

export const consultations = pgTable("consultations", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => patients.id),
  pharmacistName: text("pharmacist_name").notNull(),
  recommendations: jsonb("recommendations"),
  safetyAlerts: jsonb("safety_alerts"),
  status: text("status").default("completed"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPatientSchema = createInsertSchema(patients).omit({
  id: true,
  createdAt: true,
});

export const insertMedicationSchema = createInsertSchema(medications).omit({
  id: true,
});

export const insertConsultationSchema = createInsertSchema(consultations).omit({
  id: true,
  createdAt: true,
});

export type Patient = typeof patients.$inferSelect;
export type InsertPatient = z.infer<typeof insertPatientSchema>;
export type Medication = typeof medications.$inferSelect;
export type InsertMedication = z.infer<typeof insertMedicationSchema>;
export type Consultation = typeof consultations.$inferSelect;
export type InsertConsultation = z.infer<typeof insertConsultationSchema>;

export type SafetyAlert = {
  level: "high" | "medium" | "low";
  type: "interaction" | "allergy" | "contraindication" | "dosage";
  message: string;
  medication?: string;
};

export type MedicationRecommendation = {
  medication: Medication;
  dosage: string;
  duration: string;
  instructions: string;
  safetyLevel: "safe" | "caution" | "avoid";
  clinicalNote: string;
};
