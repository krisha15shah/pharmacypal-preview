import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPatientSchema, insertConsultationSchema } from "@shared/schema";
import { z } from "zod";

const generateRecommendationsSchema = z.object({
  patientId: z.number(),
  pharmacistName: z.string(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Patient routes
  app.post("/api/patients", async (req, res) => {
    try {
      const patientData = insertPatientSchema.parse(req.body);
      const patient = await storage.createPatient(patientData);
      res.json(patient);
    } catch (error) {
      res.status(400).json({ error: "Invalid patient data" });
    }
  });

  app.get("/api/patients", async (req, res) => {
    const patients = await storage.getAllPatients();
    res.json(patients);
  });

  app.get("/api/patients/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const patient = await storage.getPatient(id);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    res.json(patient);
  });

  // Medication routes
  app.get("/api/medications", async (req, res) => {
    const medications = await storage.getAllMedications();
    res.json(medications);
  });

  app.get("/api/medications/search", async (req, res) => {
    const query = req.query.q as string;
    if (!query) {
      return res.status(400).json({ error: "Search query required" });
    }
    const medications = await storage.searchMedications(query);
    res.json(medications);
  });

  app.get("/api/medications/indication/:indication", async (req, res) => {
    const indication = req.params.indication;
    const medications = await storage.getMedicationsByIndication(indication);
    res.json(medications);
  });

  // Consultation routes
  app.post("/api/consultations", async (req, res) => {
    try {
      const consultationData = insertConsultationSchema.parse(req.body);
      const consultation = await storage.createConsultation(consultationData);
      res.json(consultation);
    } catch (error) {
      res.status(400).json({ error: "Invalid consultation data" });
    }
  });

  app.get("/api/consultations/recent", async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const consultations = await storage.getRecentConsultations(limit);
    
    // Populate patient data for each consultation
    const consultationsWithPatients = await Promise.all(
      consultations.map(async (consultation) => {
        const patient = consultation.patientId 
          ? await storage.getPatient(consultation.patientId)
          : null;
        return {
          ...consultation,
          patient,
        };
      })
    );
    
    res.json(consultationsWithPatients);
  });

  // Generate recommendations endpoint
  app.post("/api/recommendations", async (req, res) => {
    try {
      const { patientId, pharmacistName } = generateRecommendationsSchema.parse(req.body);
      const patient = await storage.getPatient(patientId);
      
      if (!patient) {
        return res.status(404).json({ error: "Patient not found" });
      }

      // Generate recommendations based on patient profile
      const recommendations = await generateRecommendations(patient);
      const safetyAlerts = await generateSafetyAlerts(patient);

      // Save consultation
      const consultation = await storage.createConsultation({
        patientId,
        pharmacistName,
        recommendations,
        safetyAlerts,
        status: "completed",
      });

      res.json({
        recommendations,
        safetyAlerts,
        consultationId: consultation.id,
      });
    } catch (error) {
      res.status(400).json({ error: "Invalid request data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Clinical decision support logic
async function generateRecommendations(patient: any) {
  const medications = await storage.getAllMedications();
  const recommendations = [];

  // Extract symptoms and conditions
  const symptoms = patient.symptoms?.toLowerCase() || "";
  const chronicConditions = patient.chronicConditions || [];
  const allergies = patient.allergies?.toLowerCase() || "";
  const currentMeds = patient.currentMedications?.toLowerCase() || "";

  // Rule-based recommendation logic
  for (const med of medications) {
    let isRecommended = false;
    let safetyLevel: "safe" | "caution" | "avoid" = "safe";
    let clinicalNote = "";
    let dosage = "";
    let duration = "";
    let instructions = "";

    // Check if medication is indicated for symptoms or chronic conditions
    const patientConditions = [
      ...(symptoms.split(',').map(s => s.trim().toLowerCase())),
      ...chronicConditions.map(c => c.toLowerCase())
    ].filter(Boolean);

    if (med.indications?.some(indication => 
      patientConditions.some(condition => 
        condition.includes(indication.toLowerCase()) || 
        indication.toLowerCase().includes(condition)
      )
    )) {
      isRecommended = true;
    }

    // Check contraindications
    if (med.contraindications?.some(contraindication =>
      chronicConditions.some(condition => 
        condition.toLowerCase().includes(contraindication.toLowerCase())
      )
    )) {
      safetyLevel = "avoid";
      clinicalNote = `Contraindicated due to ${chronicConditions.join(", ")}`;
      continue;
    }

    // Check allergies
    if (allergies.includes(med.genericName?.toLowerCase() || "") ||
        allergies.includes(med.category.toLowerCase())) {
      safetyLevel = "avoid";
      clinicalNote = "Patient has documented allergy";
      continue;
    }

    // Check drug interactions
    if (med.interactions?.some(interaction =>
      currentMeds.includes(interaction.toLowerCase())
    )) {
      safetyLevel = "caution";
      clinicalNote = "Potential drug interaction with current medications";
    }

    // Special considerations
    if (patient.isPregnant && med.pregnancyCategory === "X") {
      safetyLevel = "avoid";
      clinicalNote = "Contraindicated in pregnancy";
      continue;
    }

    if (patient.isPregnant && ["C", "D"].includes(med.pregnancyCategory || "")) {
      safetyLevel = "caution";
      clinicalNote = "Use with caution in pregnancy";
    }

    // Age-based considerations
    if (patient.age >= 65 && med.name.includes("Diphenhydramine")) {
      safetyLevel = "caution";
      clinicalNote = "Use caution in elderly patients due to anticholinergic effects";
    }

    // Set dosage and instructions based on medication
    if (isRecommended) {
      switch (med.genericName) {
      case "acetaminophen":
        dosage = "500-1000mg every 6-8 hours";
        duration = "3-5 days";
        instructions = "Take with food if stomach upset occurs";
        if (safetyLevel === "safe") {
          clinicalNote = "Safe with hypertension medications. Monitor liver function with prolonged use.";
        }
        break;
      case "ibuprofen":
        const hasArthritis = symptoms.includes("arthritis") || chronicConditions.some(c => c.toLowerCase().includes("arthritis"));
        if (hasArthritis) {
          dosage = "600mg three times daily";
          duration = "7-14 days initially";
          instructions = "Take with food to reduce stomach irritation. For chronic arthritis, long-term use may be needed under medical supervision.";
          if (safetyLevel === "safe") {
            clinicalNote = "Effective anti-inflammatory for arthritis pain and joint inflammation";
          }
        } else {
          dosage = "200-400mg every 6-8 hours";
          duration = "3-5 days";
          instructions = "Take with food to reduce stomach irritation";
        }
        break;
      case "diclofenac sodium":
        const hasArthritis2 = symptoms.includes("arthritis") || chronicConditions.some(c => c.toLowerCase().includes("arthritis"));
        if (hasArthritis2) {
          dosage = "50mg twice daily";
          duration = "7-14 days";
          instructions = "Take with food. Prescription required.";
          if (safetyLevel === "safe") {
            clinicalNote = "Potent NSAID for inflammatory joint conditions";
          }
        } else {
          dosage = "50mg as needed";
          duration = "3-5 days";
          instructions = "Take with food. Prescription required.";
        }
        break;
      case "paracetamol":
        dosage = "500mg-1g every 4-6 hours";
        duration = "As needed";
        instructions = "Do not exceed 4g in 24 hours";
        if (safetyLevel === "safe") {
          clinicalNote = "Safe pain relief option, but limited anti-inflammatory effect for arthritis";
        }
        break;
      case "diphenhydramine":
        dosage = "25-50mg every 6-8 hours";
        duration = "Short-term use only";
        instructions = "May cause drowsiness. Avoid alcohol.";
        break;
      case "guaifenesin":
        dosage = "200-400mg every 4 hours";
        duration = "7-10 days";
        instructions = "Increase fluid intake to help thin mucus";
        if (safetyLevel === "safe") {
          clinicalNote = "Safe with current medications. Increase fluid intake.";
        }
        break;
      case "loratadine":
        dosage = "10mg once daily";
        duration = "As needed for allergies";
        instructions = "Can be taken with or without food";
        break;
      case "omeprazole":
        dosage = "20mg once daily";
        duration = "2-4 weeks";
        instructions = "Take 30 minutes before first meal of the day";
        break;
      }
    }

    if (isRecommended && safetyLevel !== "avoid") {
      recommendations.push({
        medication: med,
        dosage,
        duration,
        instructions,
        safetyLevel,
        clinicalNote,
      });
    }
  }

  return recommendations;
}

async function generateSafetyAlerts(patient: any) {
  const alerts = [];
  const currentMeds = patient.currentMedications?.toLowerCase() || "";
  const allergies = patient.allergies?.toLowerCase() || "";
  const chronicConditions = patient.chronicConditions || [];

  // ACE inhibitor + NSAID interaction
  if (currentMeds.includes("lisinopril") || currentMeds.includes("ace inhibitor")) {
    alerts.push({
      level: "high" as const,
      type: "interaction" as const,
      message: "Patient is taking Lisinopril (ACE inhibitor). Avoid NSAIDs due to increased risk of kidney damage and reduced antihypertensive effect.",
    });
  }

  // Allergy alerts
  if (allergies.includes("penicillin") || allergies.includes("nsaid")) {
    alerts.push({
      level: "medium" as const,
      type: "allergy" as const,
      message: "Patient has documented allergy to Penicillin and NSAIDs. Ensure alternative medications are selected.",
    });
  }

  // Pregnancy alerts
  if (patient.isPregnant) {
    alerts.push({
      level: "medium" as const,
      type: "contraindication" as const,
      message: "Patient is pregnant. Avoid category X medications and use category C/D medications with caution.",
    });
  }

  // Age-related alerts
  if (patient.age >= 65) {
    alerts.push({
      level: "low" as const,
      type: "dosage" as const,
      message: "Elderly patient - consider reduced dosages and monitor for increased sensitivity to medications.",
    });
  }

  return alerts;
}
