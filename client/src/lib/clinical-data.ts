export interface Symptom {
  id: string;
  label: string;
  category: string;
  isRedFlag: boolean;
  redFlagMessage?: string;
}

export interface Condition {
  id: string;
  label: string;
}

export interface CurrentMedication {
  id: string;
  label: string;
}

export interface AllergyItem {
  id: string;
  label: string;
}

export interface DrugInteraction {
  withMed: string;
  effect: string;
  severity: "mild" | "moderate" | "severe";
}

export interface MedicationRule {
  id: string;
  name: string;
  brandExamples: string;
  category: string;
  mechanism: string;
  forSymptoms: string[];
  dosage: {
    adult: string;
    pediatric?: string;
    elderly?: string;
    maxDaily: string;
    frequency: string;
    withFood: boolean;
    duration: string;
    notes?: string;
  };
  contraindications: {
    conditions: string[];
    medications: string[];
    allergies: string[];
    pregnancy: "safe" | "caution" | "avoid";
    pregnancyNote?: string;
    breastfeeding?: "safe" | "caution" | "avoid";
    breastfeedingNote?: string;
    minAge: number;
    elderlyRisk: "safe" | "caution" | "avoid";
    elderlyNote?: string;
  };
  interactions: DrugInteraction[];
  counselingPoints: string[];
  patientExplanation: string;
  referralIfNoImprovement: string;
  source: string;
  rxType?: "OTC" | "Prescription" | "Both";
}

export const SYMPTOMS: Symptom[] = [
  // Pain
  { id: "headache", label: "Headache", category: "Pain", isRedFlag: false },
  { id: "body_ache", label: "Body Ache / Myalgia", category: "Pain", isRedFlag: false },
  { id: "joint_pain", label: "Joint Pain / Arthralgia", category: "Pain", isRedFlag: false },
  { id: "back_pain", label: "Back Pain (Mechanical)", category: "Pain", isRedFlag: false },
  { id: "toothache", label: "Toothache", category: "Pain", isRedFlag: false },
  { id: "ear_pain", label: "Ear Pain / Otalgia", category: "Pain", isRedFlag: false },
  { id: "sore_throat", label: "Sore Throat", category: "Pain", isRedFlag: false },
  { id: "menstrual_pain", label: "Menstrual Pain / Dysmenorrhoea", category: "Pain", isRedFlag: false },
  { id: "chest_pain", label: "Chest Pain", category: "Pain", isRedFlag: true, redFlagMessage: "Chest pain may indicate a cardiac emergency. Do NOT self-medicate. Refer to ER immediately or call emergency services." },
  { id: "sudden_severe_headache", label: "Sudden Severe Headache (\"worst of life\")", category: "Pain", isRedFlag: true, redFlagMessage: "Sudden severe headache may indicate subarachnoid haemorrhage. Refer to ER immediately." },

  // Respiratory
  { id: "dry_cough", label: "Dry Cough (non-productive)", category: "Respiratory", isRedFlag: false },
  { id: "productive_cough", label: "Productive Cough (with phlegm)", category: "Respiratory", isRedFlag: false },
  { id: "runny_nose", label: "Runny Nose / Rhinorrhoea", category: "Respiratory", isRedFlag: false },
  { id: "nasal_congestion", label: "Nasal Congestion / Blocked Nose", category: "Respiratory", isRedFlag: false },
  { id: "sneezing", label: "Sneezing (frequent)", category: "Respiratory", isRedFlag: false },
  { id: "shortness_of_breath", label: "Shortness of Breath / Breathlessness", category: "Respiratory", isRedFlag: true, redFlagMessage: "Difficulty breathing is a medical emergency. Refer to ER immediately." },

  // Fever
  { id: "mild_fever", label: "Mild Fever (37.5–38.4°C / 99.5–101°F)", category: "Fever", isRedFlag: false },
  { id: "high_fever", label: "High Fever (≥38.5°C / ≥101.3°F)", category: "Fever", isRedFlag: false },
  { id: "very_high_fever", label: "Very High Fever (≥40°C / ≥104°F)", category: "Fever", isRedFlag: true, redFlagMessage: "Fever ≥40°C requires urgent medical evaluation. Refer to physician/ER today." },

  // Gastrointestinal
  { id: "nausea", label: "Nausea", category: "Gastrointestinal", isRedFlag: false },
  { id: "vomiting", label: "Vomiting", category: "Gastrointestinal", isRedFlag: false },
  { id: "diarrhea", label: "Diarrhea (watery / loose stools)", category: "Gastrointestinal", isRedFlag: false },
  { id: "bloody_diarrhea", label: "Bloody Diarrhea / Blood in Stool", category: "Gastrointestinal", isRedFlag: true, redFlagMessage: "Bloody diarrhea requires physician evaluation. Possible bacterial infection, IBD, or GI bleeding. Do not use antidiarrhoeals." },
  { id: "constipation", label: "Constipation", category: "Gastrointestinal", isRedFlag: false },
  { id: "heartburn", label: "Heartburn / Acidity / GERD symptoms", category: "Gastrointestinal", isRedFlag: false },
  { id: "bloating", label: "Bloating / Flatulence", category: "Gastrointestinal", isRedFlag: false },
  { id: "stomach_cramps", label: "Stomach Cramps / Mild Abdominal Pain", category: "Gastrointestinal", isRedFlag: false },
  { id: "severe_abdominal_pain", label: "Severe Abdominal Pain", category: "Gastrointestinal", isRedFlag: true, redFlagMessage: "Severe abdominal pain may indicate appendicitis, perforation, or other emergency. Refer to ER immediately." },

  // Skin
  { id: "skin_rash", label: "Skin Rash / Urticaria / Hives", category: "Skin", isRedFlag: false },
  { id: "itching", label: "Itching / Pruritus (generalised or localised)", category: "Skin", isRedFlag: false },
  { id: "insect_bite", label: "Insect Bite / Sting", category: "Skin", isRedFlag: false },

  // Eye
  { id: "eye_redness", label: "Eye Redness / Red Eye", category: "Eye", isRedFlag: false },
  { id: "eye_discharge", label: "Eye Discharge / Watery Eyes", category: "Eye", isRedFlag: false },
  { id: "eye_itching", label: "Eye Itching (allergic)", category: "Eye", isRedFlag: false },

  // General
  { id: "fatigue", label: "Fatigue / General Weakness", category: "General", isRedFlag: false },
  { id: "dizziness", label: "Dizziness / Lightheadedness", category: "General", isRedFlag: false },
  { id: "insomnia", label: "Insomnia / Difficulty Sleeping", category: "General", isRedFlag: false },
  { id: "jaundice", label: "Yellowing of Eyes / Skin (Jaundice)", category: "General", isRedFlag: true, redFlagMessage: "Jaundice requires urgent physician evaluation. Possible hepatic, biliary, or haematological pathology." },
  { id: "blood_in_urine", label: "Blood in Urine (Haematuria)", category: "General", isRedFlag: true, redFlagMessage: "Blood in urine requires physician evaluation to rule out UTI, kidney stones, or malignancy." },

  // Urinary / Genitourinary
  { id: "dysuria", label: "Painful Urination / Burning (Dysuria)", category: "Urinary", isRedFlag: false },
  { id: "urinary_frequency", label: "Urinary Frequency / Urgency", category: "Urinary", isRedFlag: false },
  { id: "vaginal_discharge", label: "Vaginal Discharge / Vaginal Itch (Thrush / BV)", category: "Genitourinary", isRedFlag: false },

  // Oral / Dental
  { id: "mouth_ulcer", label: "Mouth Ulcer / Aphthous Ulcer", category: "Oral", isRedFlag: false },
  { id: "oral_thrush", label: "Oral Thrush / White Patches in Mouth", category: "Oral", isRedFlag: false },
  { id: "dental_abscess", label: "Dental Abscess / Dental Infection", category: "Oral", isRedFlag: false },
  { id: "throat_infection", label: "Throat Infection / Tonsillitis (Bacterial)", category: "Respiratory", isRedFlag: false },

  // Skin / Infections
  { id: "fungal_skin", label: "Fungal Skin Infection / Ringworm / Tinea / Athlete's Foot", category: "Skin", isRedFlag: false },
  { id: "wound_infection", label: "Skin Wound Infection / Impetigo / Cellulitis", category: "Skin", isRedFlag: false },
  { id: "acne", label: "Acne / Pimples (Mild–Moderate)", category: "Skin", isRedFlag: false },

  // Respiratory / Musculoskeletal
  { id: "wheeze", label: "Wheeze / Chest Tightness (Asthma / Bronchospasm)", category: "Respiratory", isRedFlag: false },
  { id: "chest_infection", label: "Chest Infection / LRTI / Pneumonia", category: "Respiratory", isRedFlag: false },
  { id: "ear_infection", label: "Ear Infection / Otitis Media / Otitis Externa", category: "Ear", isRedFlag: false },
  { id: "eye_infection", label: "Eye Infection / Bacterial Conjunctivitis", category: "Eye", isRedFlag: false },

  // Pain / Neurological
  { id: "migraine", label: "Migraine (Unilateral Pulsating Headache ± Nausea)", category: "Pain", isRedFlag: false },
  { id: "neuropathic_pain", label: "Nerve Pain / Neuropathic Pain / Burning / Tingling", category: "Pain", isRedFlag: false },
  { id: "muscle_spasm", label: "Muscle Spasm / Cramp / Stiffness", category: "Musculoskeletal", isRedFlag: false },
  { id: "gout_attack", label: "Acute Gout Attack (Hot, Swollen, Severely Painful Joint)", category: "Musculoskeletal", isRedFlag: false },
];

export const CONDITIONS: Condition[] = [
  { id: "hypertension", label: "Hypertension (High Blood Pressure)" },
  { id: "diabetes", label: "Diabetes (Type 1 or 2)" },
  { id: "asthma", label: "Asthma" },
  { id: "copd", label: "COPD (Chronic Obstructive Pulmonary Disease)" },
  { id: "peptic_ulcer", label: "Peptic Ulcer Disease / Gastric Ulcer" },
  { id: "gerd_chronic", label: "GERD (Chronic Acid Reflux)" },
  { id: "heart_disease", label: "Heart Disease (IHD, Angina)" },
  { id: "heart_failure", label: "Heart Failure (CHF)" },
  { id: "kidney_disease", label: "Kidney Disease (CKD / Renal Impairment)" },
  { id: "liver_disease", label: "Liver Disease / Hepatitis / Cirrhosis" },
  { id: "thyroid", label: "Thyroid Disorder (Hypo- or Hyperthyroidism)" },
  { id: "epilepsy", label: "Epilepsy / Seizure Disorder" },
  { id: "depression_anxiety", label: "Depression / Anxiety Disorder" },
  { id: "g6pd", label: "G6PD Deficiency" },
  { id: "glaucoma", label: "Glaucoma" },
  { id: "prostate", label: "Prostate Enlargement (BPH)" },
  { id: "gout", label: "Gout / Hyperuricaemia" },
  { id: "clotting_disorder", label: "Bleeding / Clotting Disorder" },
  { id: "parkinson", label: "Parkinson's Disease" },
  { id: "osteoporosis", label: "Osteoporosis" },
  { id: "atrial_fibrillation", label: "Atrial Fibrillation / Irregular Heart Rhythm" },
];

export const CURRENT_MEDICATIONS: CurrentMedication[] = [
  { id: "warfarin", label: "Warfarin / Acenocoumarol (oral anticoagulants)" },
  { id: "dabigatran_rivaroxaban", label: "DOACs (Dabigatran, Rivaroxaban, Apixaban)" },
  { id: "aspirin_cardio", label: "Low-dose Aspirin (75–100mg, cardioprotective)" },
  { id: "clopidogrel", label: "Clopidogrel / Antiplatelet agents" },
  { id: "ace_inhibitors", label: "ACE Inhibitors (Enalapril, Lisinopril, Ramipril)" },
  { id: "arbs", label: "ARBs (Losartan, Valsartan, Telmisartan)" },
  { id: "beta_blockers", label: "Beta Blockers (Atenolol, Metoprolol, Bisoprolol)" },
  { id: "calcium_channel_blockers", label: "Calcium Channel Blockers (Amlodipine, Nifedipine)" },
  { id: "diuretics", label: "Diuretics (Furosemide, Hydrochlorothiazide, Spironolactone)" },
  { id: "metformin", label: "Metformin / Oral Antidiabetics (Glipizide, Gliclazide)" },
  { id: "insulin", label: "Insulin (any type)" },
  { id: "ssri", label: "SSRIs (Fluoxetine, Sertraline, Escitalopram, Paroxetine)" },
  { id: "snri", label: "SNRIs (Venlafaxine, Duloxetine)" },
  { id: "maoi", label: "MAO Inhibitors (Phenelzine, Tranylcypromine, Moclobemide)" },
  { id: "tricyclics", label: "Tricyclic Antidepressants (Amitriptyline, Imipramine)" },
  { id: "corticosteroids", label: "Corticosteroids (Prednisolone, Dexamethasone, Hydrocortisone)" },
  { id: "digoxin", label: "Digoxin" },
  { id: "lithium", label: "Lithium" },
  { id: "methotrexate", label: "Methotrexate" },
  { id: "antiepileptics", label: "Antiepileptics (Phenytoin, Carbamazepine, Valproate)" },
  { id: "azole_antifungals", label: "Azole Antifungals (Fluconazole, Ketoconazole, Itraconazole)" },
  { id: "statins", label: "Statins (Atorvastatin, Rosuvastatin, Simvastatin)" },
  { id: "omeprazole_ppi", label: "PPIs (Omeprazole, Pantoprazole, Esomeprazole)" },
  { id: "levothyroxine", label: "Levothyroxine (Thyroxine)" },
  { id: "levodopa", label: "Levodopa / Carbidopa (Parkinson's medication)" },
  { id: "theophylline", label: "Theophylline / Aminophylline" },
  { id: "quinolone_antibiotics", label: "Quinolone Antibiotics (Ciprofloxacin, Levofloxacin)" },
];

export const ALLERGIES: AllergyItem[] = [
  { id: "penicillin", label: "Penicillin / Amoxicillin / Beta-lactams" },
  { id: "sulfa", label: "Sulfa Drugs / Sulfonamides" },
  { id: "nsaids_allergy", label: "NSAIDs / Ibuprofen / Diclofenac" },
  { id: "aspirin_allergy", label: "Aspirin" },
  { id: "paracetamol_allergy", label: "Paracetamol / Acetaminophen" },
  { id: "codeine_allergy", label: "Codeine / Opioids" },
  { id: "antihistamine_allergy", label: "Antihistamines" },
  { id: "latex", label: "Latex" },
  { id: "iodine", label: "Iodine / Contrast Dye" },
];

export const MEDICATIONS: MedicationRule[] = [
  // ─── PARACETAMOL ───
  {
    id: "paracetamol",
    name: "Paracetamol (Acetaminophen)",
    brandExamples: "Panadol, Calpol, Tylenol, Dolo 650",
    category: "Analgesic / Antipyretic",
    mechanism: "Central analgesic; inhibits prostaglandin synthesis in CNS",
    forSymptoms: ["headache", "body_ache", "joint_pain", "back_pain", "toothache", "ear_pain", "sore_throat", "menstrual_pain", "mild_fever", "high_fever", "very_high_fever", "fatigue"],
    dosage: {
      adult: "500–1000 mg every 4–6 hours",
      pediatric: "10–15 mg/kg every 4–6 hours (max 5 doses/day)",
      elderly: "500 mg every 6 hours (reduce if frail)",
      maxDaily: "4000 mg/day (adults); 60 mg/kg/day (children)",
      frequency: "Every 4–6 hours",
      withFood: false,
      duration: "Up to 3–5 days for acute symptoms",
      notes: "Reduce max dose to 2g/day in liver disease or chronic alcohol use"
    },
    contraindications: {
      conditions: [],
      medications: [],
      allergies: ["paracetamol_allergy"],
      pregnancy: "safe",
      pregnancyNote: "First-line analgesic/antipyretic in pregnancy at all trimesters",
      breastfeeding: "safe",
      breastfeedingNote: "Compatible with breastfeeding. Excreted in breast milk at very low levels — no known adverse effects on infant at standard therapeutic doses.",
      minAge: 0,
      elderlyRisk: "safe",
      elderlyNote: "Preferred analgesic in elderly; safer than NSAIDs for GI and renal profile"
    },
    interactions: [
      { withMed: "warfarin", effect: "High-dose paracetamol (>2g/day) may modestly enhance anticoagulant effect. Monitor INR.", severity: "mild" },
      { withMed: "methotrexate", effect: "May increase methotrexate toxicity. Use with caution.", severity: "moderate" },
      { withMed: "antiepileptics", effect: "Enzyme-inducing antiepileptics (carbamazepine, phenytoin) may reduce paracetamol effect and increase hepatotoxic metabolite. Avoid high doses.", severity: "moderate" }
    ],
    counselingPoints: [
      "Do not exceed 4 grams (8 standard 500mg tablets) per day",
      "Avoid alcohol while taking paracetamol — risk of liver damage",
      "Check all other medications for hidden paracetamol (many cold/flu combinations contain it)",
      "If liver disease is present, limit to 2 grams/day and consult pharmacist",
      "If fever does not improve after 2–3 days, see a doctor"
    ],
    patientExplanation: "Paracetamol relieves pain and brings down fever. It is safe for most people including pregnant women when taken at the correct dose. Always stay within the daily limit.",
    referralIfNoImprovement: "3 days for fever; 5–7 days for pain",
    source: "UpToDate: Acetaminophen (Paracetamol) — Pharmacology and Use"
  },

  // ─── IBUPROFEN ───
  {
    id: "ibuprofen",
    name: "Ibuprofen",
    brandExamples: "Brufen, Advil, Nurofen, Motrin",
    category: "NSAID (Non-Steroidal Anti-Inflammatory Drug)",
    mechanism: "Non-selective COX-1 and COX-2 inhibitor; reduces prostaglandin synthesis",
    forSymptoms: ["headache", "body_ache", "joint_pain", "back_pain", "toothache", "ear_pain", "sore_throat", "menstrual_pain", "mild_fever", "high_fever", "very_high_fever"],
    dosage: {
      adult: "400–600 mg every 6–8 hours",
      pediatric: "5–10 mg/kg every 6–8 hours (>6 months, >5kg)",
      elderly: "Use lowest effective dose; 200–400 mg every 8 hours. Monitor renal function.",
      maxDaily: "2400 mg/day (OTC); up to 3200 mg/day (Rx)",
      frequency: "Every 6–8 hours",
      withFood: true,
      duration: "Up to 5 days for pain; 3 days for fever",
      notes: "Always take with food or milk to reduce GI upset"
    },
    contraindications: {
      conditions: ["peptic_ulcer", "heart_failure", "kidney_disease", "clotting_disorder", "gerd_chronic", "heart_disease", "atrial_fibrillation"],
      medications: ["warfarin", "dabigatran_rivaroxaban", "aspirin_cardio", "clopidogrel", "ace_inhibitors", "arbs", "diuretics", "lithium", "methotrexate"],
      allergies: ["nsaids_allergy", "aspirin_allergy"],
      pregnancy: "avoid",
      pregnancyNote: "AVOID in 3rd trimester (risk of premature closure of ductus arteriosus and oligohydramnios). Avoid after 20 weeks gestation. Caution in 1st/2nd trimester only under medical supervision.",
      breastfeeding: "safe",
      breastfeedingNote: "Compatible with breastfeeding. Low levels excreted in breast milk; short half-life. Preferred NSAID for breastfeeding mothers. Avoid prolonged high-dose use.",
      minAge: 0.5,
      elderlyRisk: "caution",
      elderlyNote: "Increased risk of GI bleeding, peptic ulcer, renal impairment, and cardiovascular events in elderly. Use lowest dose for shortest duration. Consider gastroprotection (PPI)."
    },
    interactions: [
      { withMed: "warfarin", effect: "Significantly increases bleeding risk. Avoid combination. Use paracetamol instead.", severity: "severe" },
      { withMed: "dabigatran_rivaroxaban", effect: "Increased bleeding risk with DOACs. Avoid.", severity: "severe" },
      { withMed: "aspirin_cardio", effect: "Ibuprofen may block the cardioprotective effect of low-dose aspirin. If both needed, take aspirin 2 hours before ibuprofen.", severity: "moderate" },
      { withMed: "clopidogrel", effect: "Increased GI bleeding risk.", severity: "severe" },
      { withMed: "ace_inhibitors", effect: "NSAIDs reduce antihypertensive effect and increase risk of acute kidney injury. Avoid the 'triple whammy' (NSAID + ACE inhibitor/ARB + diuretic).", severity: "severe" },
      { withMed: "arbs", effect: "Same as ACE inhibitors — increased renal risk and reduced BP control.", severity: "severe" },
      { withMed: "diuretics", effect: "NSAIDs reduce diuretic effectiveness and increase risk of renal impairment.", severity: "moderate" },
      { withMed: "lithium", effect: "NSAIDs increase lithium levels, risking toxicity. Avoid.", severity: "severe" },
      { withMed: "methotrexate", effect: "NSAIDs reduce methotrexate excretion, increasing toxicity risk. Avoid.", severity: "severe" },
      { withMed: "corticosteroids", effect: "Combined use significantly increases risk of GI ulceration and bleeding.", severity: "moderate" },
      { withMed: "ssri", effect: "Increased risk of upper GI bleeding when combined with SSRIs.", severity: "moderate" }
    ],
    counselingPoints: [
      "Always take with food or a full glass of milk to reduce stomach irritation",
      "Do not take if you have stomach ulcers, kidney problems, or heart failure",
      "Avoid if you are in the last 3 months of pregnancy",
      "Do not use for more than 5 days for pain or 3 days for fever without medical review",
      "Avoid alcohol while taking ibuprofen — increases GI bleeding risk",
      "Stop and see a doctor if you notice dark/black stools or stomach pain"
    ],
    patientExplanation: "Ibuprofen reduces pain, fever, and inflammation. It works best for inflammatory pain like joint pain, menstrual cramps, and dental pain. Take it with food to protect your stomach.",
    referralIfNoImprovement: "3 days for fever; 5 days for pain",
    source: "UpToDate: NSAIDs — Pharmacology and adverse effects"
  },

  // ─── DICLOFENAC ───
  {
    id: "diclofenac",
    name: "Diclofenac Sodium",
    brandExamples: "Voltaren, Voveran, Cataflam, Diclomax",
    category: "NSAID (Non-Steroidal Anti-Inflammatory Drug)",
    mechanism: "Preferential COX-2 inhibitor; anti-inflammatory and analgesic",
    forSymptoms: ["joint_pain", "back_pain", "body_ache", "menstrual_pain", "toothache"],
    dosage: {
      adult: "50 mg 2–3 times daily",
      elderly: "50 mg twice daily with food and PPI cover",
      maxDaily: "150 mg/day",
      frequency: "2–3 times daily",
      withFood: true,
      duration: "5–7 days for acute conditions; longer for chronic under physician supervision",
    },
    contraindications: {
      conditions: ["peptic_ulcer", "heart_failure", "kidney_disease", "clotting_disorder", "gerd_chronic", "heart_disease", "liver_disease", "atrial_fibrillation"],
      medications: ["warfarin", "dabigatran_rivaroxaban", "aspirin_cardio", "clopidogrel", "ace_inhibitors", "arbs", "diuretics", "lithium", "methotrexate"],
      allergies: ["nsaids_allergy", "aspirin_allergy"],
      pregnancy: "avoid",
      pregnancyNote: "Contraindicated from 20 weeks gestation onwards. Avoid in all trimesters where possible.",
      breastfeeding: "caution",
      breastfeedingNote: "Small amounts excreted in breast milk. Use with caution — prefer ibuprofen as the NSAID of choice in breastfeeding. Avoid prolonged use.",
      minAge: 14,
      elderlyRisk: "caution",
      elderlyNote: "Higher cardiovascular risk profile than ibuprofen in elderly. Use only if clearly indicated and with gastroprotection."
    },
    interactions: [
      { withMed: "warfarin", effect: "Significantly increases bleeding risk. Avoid.", severity: "severe" },
      { withMed: "lithium", effect: "Increases lithium levels. Avoid.", severity: "severe" },
      { withMed: "methotrexate", effect: "Increases methotrexate toxicity. Avoid.", severity: "severe" },
      { withMed: "ace_inhibitors", effect: "Reduces antihypertensive effect and increases renal risk.", severity: "severe" },
      { withMed: "diuretics", effect: "Reduces diuretic effectiveness; renal risk.", severity: "moderate" },
      { withMed: "digoxin", effect: "NSAIDs may increase digoxin levels.", severity: "moderate" }
    ],
    counselingPoints: [
      "Take with food — never on an empty stomach",
      "Higher cardiovascular risk than ibuprofen; use with caution in heart patients",
      "Stop immediately if chest pain, dark stools, or swollen ankles develop",
      "Requires prescription in many countries — check local regulations"
    ],
    patientExplanation: "Diclofenac is a strong anti-inflammatory medication for joint pain, back pain, and arthritis. Take it with food every time to protect your stomach.",
    referralIfNoImprovement: "5–7 days",
    source: "UpToDate: Diclofenac — Drug information"
  },

  // ─── ASPIRIN (Analgesic dose) ───
  {
    id: "aspirin",
    name: "Aspirin (Analgesic dose)",
    brandExamples: "Disprin, Aspro, Bayer Aspirin (300–500mg)",
    category: "NSAID / Salicylate / Antipyretic",
    mechanism: "Irreversible COX-1 and COX-2 inhibitor; also inhibits platelet aggregation",
    forSymptoms: ["headache", "body_ache", "mild_fever", "high_fever", "sore_throat"],
    dosage: {
      adult: "300–600 mg every 4–6 hours",
      maxDaily: "4000 mg/day",
      frequency: "Every 4–6 hours",
      withFood: true,
      duration: "3–5 days",
      notes: "Not for use in children under 16 due to Reye's syndrome risk"
    },
    contraindications: {
      conditions: ["peptic_ulcer", "clotting_disorder", "asthma", "gout", "kidney_disease"],
      medications: ["warfarin", "dabigatran_rivaroxaban", "clopidogrel", "methotrexate", "ssri"],
      allergies: ["aspirin_allergy", "nsaids_allergy"],
      pregnancy: "avoid",
      pregnancyNote: "Avoid analgesic-dose aspirin in pregnancy. Low-dose (75mg) may be prescribed by physician for specific indications (pre-eclampsia prevention).",
      breastfeeding: "avoid",
      breastfeedingNote: "Avoid analgesic doses while breastfeeding — salicylate transfers to breast milk and is associated with risk of Reye's syndrome and metabolic acidosis in the infant. Low-dose aspirin (75–150 mg/day) prescribed by a physician is generally considered acceptable.",
      minAge: 16,
      elderlyRisk: "caution",
      elderlyNote: "High risk of GI bleeding in elderly; prefer paracetamol"
    },
    interactions: [
      { withMed: "warfarin", effect: "Major bleeding risk. Contraindicated at analgesic doses.", severity: "severe" },
      { withMed: "methotrexate", effect: "Reduces methotrexate clearance; toxicity risk.", severity: "severe" },
      { withMed: "ssri", effect: "Increased GI bleeding risk.", severity: "moderate" },
      { withMed: "diuretics", effect: "May reduce effectiveness of uricosuric diuretics; worsen gout.", severity: "mild" }
    ],
    counselingPoints: [
      "NEVER give aspirin to anyone under 16 years old — risk of Reye's syndrome (rare but fatal brain/liver condition)",
      "Take with food to reduce stomach irritation",
      "Not suitable if you have asthma — can trigger bronchospasm",
      "Avoid if you have a history of stomach ulcers or bleeding disorders",
      "Different from low-dose (75mg) cardioprotective aspirin — do not confuse doses"
    ],
    patientExplanation: "Aspirin relieves mild to moderate pain and fever. It thins the blood slightly, so it must be avoided by people taking anticoagulants, those with ulcers, or anyone under 16.",
    referralIfNoImprovement: "3 days for fever; 5 days for pain",
    source: "UpToDate: Aspirin — Drug information; MHRA guidance on aspirin"
  },

  // ─── CETIRIZINE ───
  {
    id: "cetirizine",
    name: "Cetirizine",
    brandExamples: "Zyrtec, Cetrine, Alerid, Okacet",
    category: "Non-Sedating Antihistamine (2nd Generation)",
    mechanism: "Selective peripheral H1-receptor antagonist; minimal CNS penetration",
    forSymptoms: ["runny_nose", "sneezing", "nasal_congestion", "eye_itching", "eye_discharge", "skin_rash", "itching", "insect_bite"],
    dosage: {
      adult: "10 mg once daily",
      pediatric: "5 mg once daily (2–6 years); 10 mg once daily (>6 years)",
      elderly: "5 mg once daily (risk of sedation)",
      maxDaily: "10 mg/day",
      frequency: "Once daily (preferably at bedtime if sedation occurs)",
      withFood: false,
      duration: "As needed for allergic symptoms; for seasonal allergies, throughout the season"
    },
    contraindications: {
      conditions: ["kidney_disease"],
      medications: [],
      allergies: ["antihistamine_allergy"],
      pregnancy: "caution",
      pregnancyNote: "Loratadine is preferred antihistamine in pregnancy. Cetirizine can be used if loratadine is not available — limited human data but no established teratogenicity.",
      breastfeeding: "safe",
      breastfeedingNote: "Compatible with breastfeeding. Excreted in low levels in breast milk; no adverse effects reported in breastfed infants. Preferred non-sedating antihistamine during breastfeeding.",
      minAge: 2,
      elderlyRisk: "caution",
      elderlyNote: "May cause more sedation in elderly than in younger adults; increased fall risk. Use 5mg dose in elderly."
    },
    interactions: [
      { withMed: "maoi", effect: "Potential increase in anticholinergic effects. Avoid.", severity: "moderate" }
    ],
    counselingPoints: [
      "May cause mild drowsiness in some people — avoid driving if affected",
      "Avoid alcohol as it may worsen sedation",
      "For kidney disease, the dose may need to be reduced — check with pharmacist",
      "For allergic rhinitis, it works best taken regularly throughout the allergy season",
      "Does not treat nasal congestion — consider a nasal decongestant if needed"
    ],
    patientExplanation: "Cetirizine is an antihistamine that relieves sneezing, runny nose, itchy eyes, and skin rashes caused by allergies. It usually causes little or no drowsiness.",
    referralIfNoImprovement: "2–4 weeks; reassess allergy triggers",
    source: "UpToDate: Cetirizine — Drug information; BSACI Rhinitis Guidelines"
  },

  // ─── LORATADINE ───
  {
    id: "loratadine",
    name: "Loratadine",
    brandExamples: "Claritin, Clarityn, Lorfast, Alavert",
    category: "Non-Sedating Antihistamine (2nd Generation)",
    mechanism: "Long-acting selective H1-receptor antagonist; minimal CNS penetration",
    forSymptoms: ["runny_nose", "sneezing", "nasal_congestion", "eye_itching", "eye_discharge", "skin_rash", "itching", "insect_bite"],
    dosage: {
      adult: "10 mg once daily",
      pediatric: "5 mg once daily (2–5 years, >15kg); 10 mg once daily (>5 years)",
      elderly: "10 mg every other day if renal impairment",
      maxDaily: "10 mg/day",
      frequency: "Once daily",
      withFood: false,
      duration: "As needed; throughout allergy season for seasonal allergies"
    },
    contraindications: {
      conditions: [],
      medications: [],
      allergies: ["antihistamine_allergy"],
      pregnancy: "safe",
      pregnancyNote: "Preferred antihistamine in pregnancy based on available safety data. Considered first-line by most guidelines.",
      breastfeeding: "safe",
      breastfeedingNote: "Compatible with breastfeeding. Very low transfer to breast milk. Preferred antihistamine in breastfeeding mothers.",
      minAge: 2,
      elderlyRisk: "safe",
      elderlyNote: "Preferred antihistamine in elderly due to minimal sedation and anticholinergic effects"
    },
    interactions: [
      { withMed: "azole_antifungals", effect: "Azole antifungals may increase loratadine levels. Generally well tolerated but monitor.", severity: "mild" }
    ],
    counselingPoints: [
      "Non-sedating — suitable for daytime use and driving (for most people)",
      "Preferred option during pregnancy",
      "Safe in elderly patients",
      "Takes about 1–3 hours to start working",
      "Can be taken with or without food"
    ],
    patientExplanation: "Loratadine relieves allergy symptoms like sneezing, runny nose, and itchy eyes. It is unlikely to make you drowsy and is safe during pregnancy.",
    referralIfNoImprovement: "2–4 weeks",
    source: "UpToDate: Loratadine — Drug information; BSACI Pregnancy Guidelines"
  },

  // ─── CHLORPHENIRAMINE ───
  {
    id: "chlorpheniramine",
    name: "Chlorpheniramine (Chlorphenamine)",
    brandExamples: "Piriton, CTM, Chlor-Trimeton",
    category: "Sedating Antihistamine (1st Generation)",
    mechanism: "H1-receptor antagonist with significant CNS penetration (sedating)",
    forSymptoms: ["runny_nose", "sneezing", "skin_rash", "itching", "insect_bite", "eye_itching"],
    dosage: {
      adult: "4 mg every 4–6 hours",
      pediatric: "1 mg (1–2 years); 1–2 mg (2–5 years); 2–4 mg (6–12 years) — every 4–6 hours",
      elderly: "Use with extreme caution or avoid — high fall risk",
      maxDaily: "24 mg/day",
      frequency: "Every 4–6 hours",
      withFood: false,
      duration: "Short-term only (acute allergic reactions)"
    },
    contraindications: {
      conditions: ["glaucoma", "prostate", "epilepsy"],
      medications: ["maoi", "tricyclics"],
      allergies: ["antihistamine_allergy"],
      pregnancy: "caution",
      pregnancyNote: "Avoid; prefer loratadine. If needed in an acute emergency, short-term use may be acceptable.",
      breastfeeding: "avoid",
      breastfeedingNote: "Avoid while breastfeeding. Diphenhydramine is excreted in breast milk and can cause sedation, irritability, and feeding difficulties in the infant. May also reduce milk supply. Use cetirizine or loratadine instead.",
      minAge: 1,
      elderlyRisk: "avoid",
      elderlyNote: "Avoid in elderly: anticholinergic effects (confusion, urinary retention, constipation), falls, and sedation. Listed on Beers Criteria as inappropriate for elderly."
    },
    interactions: [
      { withMed: "maoi", effect: "Risk of severe anticholinergic effects and CNS toxicity. Contraindicated.", severity: "severe" },
      { withMed: "tricyclics", effect: "Additive anticholinergic and sedative effects.", severity: "moderate" }
    ],
    counselingPoints: [
      "Causes significant drowsiness — DO NOT drive or operate machinery",
      "Avoid alcohol — severely worsens sedation",
      "Not recommended for elderly patients due to confusion and fall risk",
      "Avoid in patients with glaucoma or prostate problems",
      "Useful for nighttime allergy relief when sedation is acceptable"
    ],
    patientExplanation: "Chlorpheniramine is an antihistamine that relieves allergy symptoms but causes drowsiness. Do not drive after taking it. It can be useful at bedtime for allergy relief.",
    referralIfNoImprovement: "3–5 days",
    source: "UpToDate: Chlorphenamine — Drug information; AGS Beers Criteria 2023"
  },

  // ─── PSEUDOEPHEDRINE ───
  {
    id: "pseudoephedrine",
    name: "Pseudoephedrine",
    brandExamples: "Sudafed, Actifed (combination), Sinutab",
    category: "Oral Nasal Decongestant (Sympathomimetic)",
    mechanism: "Indirect sympathomimetic; stimulates alpha-adrenergic receptors, reducing nasal mucosal swelling",
    forSymptoms: ["nasal_congestion", "runny_nose"],
    dosage: {
      adult: "60 mg every 4–6 hours",
      maxDaily: "240 mg/day",
      frequency: "Every 4–6 hours",
      withFood: false,
      duration: "Maximum 3–5 days to avoid rebound congestion",
      notes: "Available as modified release: 120 mg every 12 hours"
    },
    contraindications: {
      conditions: ["hypertension", "heart_disease", "heart_failure", "thyroid", "glaucoma", "diabetes", "epilepsy"],
      medications: ["maoi", "beta_blockers", "tricyclics"],
      allergies: [],
      pregnancy: "avoid",
      pregnancyNote: "Avoid in first trimester (possible association with gastroschisis). Avoid throughout pregnancy if possible. Use topical decongestants (oxymetazoline) as safer alternative.",
      breastfeeding: "avoid",
      breastfeedingNote: "Avoid while breastfeeding. Pseudoephedrine significantly reduces milk production (prolactin suppression) and is excreted in breast milk, potentially causing infant irritability and disturbed sleep. Use saline nasal spray or steam inhalation instead.",
      minAge: 12,
      elderlyRisk: "avoid",
      elderlyNote: "Avoid in elderly: risk of hypertension, urinary retention, insomnia, and cardiac arrhythmias."
    },
    interactions: [
      { withMed: "maoi", effect: "Risk of hypertensive crisis — potentially life-threatening. Absolutely contraindicated.", severity: "severe" },
      { withMed: "beta_blockers", effect: "Unopposed alpha-adrenergic stimulation may cause severe hypertension.", severity: "severe" },
      { withMed: "tricyclics", effect: "Risk of cardiovascular effects and hypertension.", severity: "moderate" }
    ],
    counselingPoints: [
      "Do not use if you have high blood pressure, heart disease, or thyroid problems",
      "Do not take within 14 days of stopping an MAO inhibitor",
      "May cause insomnia, palpitations, or restlessness — take last dose by early afternoon",
      "Do not use for more than 5 days — rebound congestion can occur",
      "Not suitable for children under 12 years"
    ],
    patientExplanation: "Pseudoephedrine is an oral decongestant that unblocks a stuffy nose. It is not suitable if you have high blood pressure or heart problems.",
    referralIfNoImprovement: "5 days",
    source: "UpToDate: Pseudoephedrine — Drug information; MHRA guidance"
  },

  // ─── OXYMETAZOLINE NASAL SPRAY ───
  {
    id: "oxymetazoline",
    name: "Oxymetazoline Nasal Spray",
    brandExamples: "Afrin, Otrivin (0.05%), Iliadin, Vicks Sinex",
    category: "Topical Nasal Decongestant",
    mechanism: "Alpha-adrenergic agonist; direct vasoconstriction of nasal mucosal vessels",
    forSymptoms: ["nasal_congestion"],
    dosage: {
      adult: "2–3 sprays each nostril twice daily (morning and bedtime)",
      pediatric: "Use 0.025% formulation for children 2–6 years (1 spray each nostril twice daily)",
      maxDaily: "2 applications/day",
      frequency: "Twice daily",
      withFood: false,
      duration: "MAXIMUM 3 consecutive days to prevent rebound congestion (rhinitis medicamentosa)",
      notes: "Topical use minimizes systemic absorption — safer than oral decongestants for hypertension"
    },
    contraindications: {
      conditions: [],
      medications: ["maoi"],
      allergies: [],
      pregnancy: "caution",
      pregnancyNote: "Use with caution; minimal systemic absorption makes it safer than oral pseudoephedrine. Limit to 3 days maximum.",
      minAge: 2,
      elderlyRisk: "safe",
      elderlyNote: "Preferred over oral decongestants in elderly due to minimal systemic absorption"
    },
    interactions: [
      { withMed: "maoi", effect: "Risk of hypertensive response; avoid.", severity: "moderate" }
    ],
    counselingPoints: [
      "NEVER use for more than 3 days — causes rebound worsening of congestion (rhinitis medicamentosa)",
      "Blow nose gently before using",
      "Wait at least 6 hours between doses",
      "Do not share nasal sprays — infection risk",
      "If congestion persists beyond 5 days, see a doctor"
    ],
    patientExplanation: "This nasal spray quickly relieves a blocked nose by shrinking the blood vessels in the nose. It must not be used for more than 3 days or it will make the congestion worse.",
    referralIfNoImprovement: "3 days — assess for sinusitis or allergic rhinitis",
    source: "UpToDate: Oxymetazoline nasal — Drug information; MHRA guidance"
  },

  // ─── DEXTROMETHORPHAN ───
  {
    id: "dextromethorphan",
    name: "Dextromethorphan (DXM)",
    brandExamples: "Robitussin DX, Benylin Dry Cough, Delsym",
    category: "Cough Suppressant (Antitussive)",
    mechanism: "Centrally acting cough suppressant; sigma-1 receptor agonist and NMDA antagonist",
    forSymptoms: ["dry_cough"],
    dosage: {
      adult: "15–30 mg every 4–6 hours",
      pediatric: "Use only on physician advice in children under 6; 6–12 years: 7.5–15 mg every 6–8 hours",
      maxDaily: "120 mg/day",
      frequency: "Every 4–6 hours",
      withFood: false,
      duration: "Up to 7 days for acute cough"
    },
    contraindications: {
      conditions: ["liver_disease"],
      medications: ["maoi", "ssri", "snri"],
      allergies: ["codeine_allergy"],
      pregnancy: "caution",
      pregnancyNote: "Avoid in first trimester. Limited safety data. Use only if clearly needed.",
      minAge: 6,
      elderlyRisk: "caution",
      elderlyNote: "Risk of confusion and dizziness in elderly"
    },
    interactions: [
      { withMed: "maoi", effect: "Risk of serotonin syndrome — potentially fatal. Absolutely contraindicated.", severity: "severe" },
      { withMed: "ssri", effect: "Risk of serotonin syndrome. Avoid combination.", severity: "severe" },
      { withMed: "snri", effect: "Risk of serotonin syndrome. Avoid combination.", severity: "severe" }
    ],
    counselingPoints: [
      "For dry, irritating cough ONLY — not for productive (chesty) cough with phlegm",
      "DO NOT use within 14 days of MAO inhibitors",
      "Not recommended for children under 6 years",
      "If cough persists more than 7 days or is accompanied by fever, see a doctor",
      "Can cause dizziness — avoid driving if affected"
    ],
    patientExplanation: "Dextromethorphan suppresses a dry, tickly cough that keeps you awake or is irritating your throat. It does NOT help with a chesty cough with phlegm.",
    referralIfNoImprovement: "7 days; refer if cough persists, especially if associated with fever or blood",
    source: "UpToDate: Dextromethorphan — Drug information; MHRA guidance on OTC cough preparations"
  },

  // ─── GUAIFENESIN ───
  {
    id: "guaifenesin",
    name: "Guaifenesin (Glyceryl Guaiacolate)",
    brandExamples: "Robitussin Chesty, Actifed Expectorant, Benylin Chesty Cough",
    category: "Expectorant / Mucolytic",
    mechanism: "Increases respiratory tract secretions, reducing mucus viscosity and aiding expectoration",
    forSymptoms: ["productive_cough"],
    dosage: {
      adult: "200–400 mg every 4 hours",
      pediatric: "100–200 mg every 4 hours (>2 years)",
      maxDaily: "2400 mg/day",
      frequency: "Every 4 hours",
      withFood: false,
      duration: "Up to 7 days; drink plenty of water",
      notes: "Increase fluid intake to 2+ litres/day to enhance effectiveness"
    },
    contraindications: {
      conditions: [],
      medications: [],
      allergies: [],
      pregnancy: "safe",
      pregnancyNote: "Generally considered safe for short-term use during pregnancy.",
      minAge: 2,
      elderlyRisk: "safe"
    },
    interactions: [],
    counselingPoints: [
      "Drink plenty of fluids (at least 2 litres of water per day) to help loosen mucus",
      "For productive (chesty) cough ONLY — not for dry cough",
      "If sputum becomes yellow/green and you develop fever, see a doctor for possible infection",
      "If cough persists beyond 7 days, seek medical review",
      "Do not use if cough is accompanied by excessive phlegm without trying to expectorate"
    ],
    patientExplanation: "Guaifenesin helps to loosen and thin the mucus in your chest so you can cough it out more easily. Make sure to drink plenty of water for it to work well.",
    referralIfNoImprovement: "7 days; refer if productive cough with fever, purulent sputum, or haemoptysis",
    source: "UpToDate: Guaifenesin — Drug information"
  },

  // ─── OMEPRAZOLE ───
  {
    id: "omeprazole",
    name: "Omeprazole",
    brandExamples: "Losec, Prilosec, Omez, Omacid",
    category: "Proton Pump Inhibitor (PPI)",
    mechanism: "Irreversible inhibition of H+/K+ ATPase (proton pump) in gastric parietal cells",
    forSymptoms: ["heartburn", "stomach_cramps", "nausea", "bloating"],
    dosage: {
      adult: "20 mg once daily before breakfast (10–20mg OTC; 40mg Rx for GERD/ulcers)",
      elderly: "20 mg once daily; no dose adjustment usually needed",
      maxDaily: "40 mg/day (OTC indication)",
      frequency: "Once daily",
      withFood: false,
      duration: "2–4 weeks for OTC use; longer courses require physician supervision",
      notes: "Take 30–60 minutes BEFORE first meal of the day for maximum effect"
    },
    contraindications: {
      conditions: [],
      medications: ["clopidogrel"],
      allergies: [],
      pregnancy: "caution",
      pregnancyNote: "Avoid in first trimester if possible. Pantoprazole or ranitidine preferred. Antacids are first-line in pregnancy.",
      minAge: 1,
      elderlyRisk: "safe",
      elderlyNote: "Long-term PPI use in elderly associated with increased fracture risk, hypomagnesaemia, and C. diff infection. Use lowest effective dose."
    },
    interactions: [
      { withMed: "clopidogrel", effect: "Omeprazole significantly reduces antiplatelet effect of clopidogrel (CYP2C19 inhibition). Use pantoprazole instead if PPI needed.", severity: "moderate" },
      { withMed: "methotrexate", effect: "PPIs may increase methotrexate levels and toxicity at high doses.", severity: "moderate" },
      { withMed: "levothyroxine", effect: "PPIs may reduce levothyroxine absorption. Separate administration by at least 30 minutes.", severity: "mild" }
    ],
    counselingPoints: [
      "Take 30–60 minutes BEFORE meals — this is crucial for effectiveness",
      "Avoid lying down for at least 30 minutes after eating",
      "Lifestyle changes are equally important: avoid trigger foods, alcohol, coffee, and fatty meals",
      "Lose weight if overweight — reduces acid reflux significantly",
      "Do not use OTC formulation for more than 4 weeks without doctor review",
      "Long-term use (>1 year) may reduce calcium and magnesium absorption — discuss with doctor"
    ],
    patientExplanation: "Omeprazole reduces the acid produced in your stomach. Take it 30–60 minutes before breakfast. Lifestyle changes (avoiding trigger foods, not lying down after meals) will make it work better.",
    referralIfNoImprovement: "2–4 weeks; refer urgently if heartburn with difficulty swallowing, weight loss, or vomiting blood",
    source: "UpToDate: Omeprazole — Drug information; NICE CG17 Dyspepsia guidelines"
  },

  // ─── ANTACIDS ───
  {
    id: "antacids",
    name: "Antacids (Aluminium/Magnesium Hydroxide)",
    brandExamples: "Maalox, Gaviscon, Gelusil, Mylanta, Digene, Eno",
    category: "Antacid",
    mechanism: "Neutralise gastric acid directly; Gaviscon also forms a raft barrier",
    forSymptoms: ["heartburn", "bloating", "stomach_cramps", "nausea"],
    dosage: {
      adult: "5–15 mL (liquid) or 1–2 tablets between meals and at bedtime",
      maxDaily: "As directed on product; typically 4 times daily",
      frequency: "After meals and at bedtime",
      withFood: false,
      duration: "Short-term relief; for chronic symptoms, use PPI",
      notes: "Take 1–2 hours AFTER other medications to avoid absorption interference"
    },
    contraindications: {
      conditions: ["kidney_disease"],
      medications: [],
      allergies: [],
      pregnancy: "safe",
      pregnancyNote: "Preferred first-line treatment for heartburn in pregnancy. Calcium-containing antacids (e.g., Gaviscon) are preferred.",
      minAge: 0,
      elderlyRisk: "caution",
      elderlyNote: "Aluminium-containing antacids may cause constipation; magnesium-containing may cause diarrhoea. Calcium-based preferred in elderly."
    },
    interactions: [
      { withMed: "levothyroxine", effect: "Antacids reduce levothyroxine absorption. Separate by at least 2 hours.", severity: "moderate" },
      { withMed: "quinolone_antibiotics", effect: "Antacids significantly reduce absorption of fluoroquinolones. Separate by at least 2 hours.", severity: "moderate" }
    ],
    counselingPoints: [
      "Take 1–2 hours AFTER other medicines to avoid reducing their absorption",
      "Effective for immediate relief but doesn't treat the underlying cause",
      "Avoid triggers: spicy/fatty foods, caffeine, alcohol, large meals, lying down after eating",
      "Lose weight if overweight — most effective long-term measure for acid reflux",
      "If needing antacids daily for more than 2 weeks, see a doctor"
    ],
    patientExplanation: "Antacids neutralise the acid in your stomach, giving you quick relief from heartburn and indigestion. They work best after meals. If you need them every day, you should see a doctor.",
    referralIfNoImprovement: "2 weeks of daily use requires medical review",
    source: "UpToDate: Antacids — Drug information; NICE Dyspepsia guidelines"
  },

  // ─── DOMPERIDONE ───
  {
    id: "domperidone",
    name: "Domperidone",
    brandExamples: "Motilium, Domstal, Vomistop",
    category: "Antiemetic (Dopamine D2 Antagonist — peripheral)",
    mechanism: "Peripheral D2 receptor antagonist; enhances gastric motility and blocks chemoreceptor trigger zone",
    forSymptoms: ["nausea", "vomiting", "bloating", "heartburn"],
    dosage: {
      adult: "10 mg up to 3 times daily, 15–30 minutes before meals",
      maxDaily: "30 mg/day",
      frequency: "2–3 times daily before meals",
      withFood: false,
      duration: "Shortest effective duration; maximum 1 week for OTC use",
      notes: "Use lowest effective dose for shortest time due to QT prolongation risk"
    },
    contraindications: {
      conditions: ["heart_disease", "liver_disease", "atrial_fibrillation"],
      medications: ["azole_antifungals", "macrolide_antibiotics"],
      allergies: [],
      pregnancy: "caution",
      pregnancyNote: "Limited safety data. Use only if clearly needed and other measures fail. Avoid in first trimester.",
      minAge: 12,
      elderlyRisk: "caution",
      elderlyNote: "Higher QT risk in elderly. Use with caution and only if no alternatives."
    },
    interactions: [
      { withMed: "azole_antifungals", effect: "Azole antifungals significantly increase domperidone levels, markedly increasing QT prolongation risk. Contraindicated.", severity: "severe" }
    ],
    counselingPoints: [
      "Take 15–30 minutes before meals for best effect",
      "Do not take with azole antifungals (e.g., fluconazole) — can affect heart rhythm",
      "If you notice palpitations or irregular heartbeat, stop and seek medical attention",
      "Not recommended for children under 12 years",
      "Do not use for more than 7 days without medical review"
    ],
    patientExplanation: "Domperidone helps stop nausea and vomiting and speeds up the emptying of the stomach. Take it before meals. If you feel your heart racing, stop and see a doctor.",
    referralIfNoImprovement: "If vomiting lasts more than 24 hours, or signs of dehydration, refer to physician",
    source: "UpToDate: Domperidone — Drug information; EMA review 2014"
  },

  // ─── METOCLOPRAMIDE ───
  {
    id: "metoclopramide",
    name: "Metoclopramide",
    brandExamples: "Maxolon, Reglan, Perinorm",
    category: "Antiemetic / Prokinetic (Dopamine Antagonist)",
    mechanism: "Central and peripheral D2 receptor antagonist; prokinetic effect on GI motility",
    forSymptoms: ["nausea", "vomiting", "heartburn"],
    dosage: {
      adult: "10 mg up to 3 times daily",
      maxDaily: "30 mg/day",
      frequency: "3 times daily, 30 minutes before meals",
      withFood: false,
      duration: "Maximum 5 days (due to tardive dyskinesia risk with prolonged use)"
    },
    contraindications: {
      conditions: ["epilepsy", "parkinson"],
      medications: ["maoi", "levodopa"],
      allergies: [],
      pregnancy: "caution",
      pregnancyNote: "Use only if clearly necessary. Domperidone or ondansetron are generally preferred for pregnancy-related nausea.",
      minAge: 18,
      elderlyRisk: "avoid",
      elderlyNote: "High risk of tardive dyskinesia (irreversible involuntary movements) and extrapyramidal effects in elderly. Listed on Beers Criteria. Avoid."
    },
    interactions: [
      { withMed: "maoi", effect: "Risk of hypertensive crisis and serotonin-like effects.", severity: "severe" },
      { withMed: "levodopa", effect: "Metoclopramide is a dopamine antagonist and will oppose the effects of levodopa. Contraindicated in Parkinson's disease.", severity: "severe" }
    ],
    counselingPoints: [
      "Do not use for more than 5 consecutive days",
      "If you notice involuntary movements (face, neck, limbs), stop immediately and seek medical help",
      "Not suitable for patients with Parkinson's disease or epilepsy",
      "Not recommended for adults over 65 years",
      "May cause drowsiness — caution with driving"
    ],
    patientExplanation: "Metoclopramide relieves nausea and vomiting by helping your stomach empty faster. It should not be used for more than 5 days.",
    referralIfNoImprovement: "24–48 hours if vomiting persists; assess for dehydration",
    source: "UpToDate: Metoclopramide — Drug information; EMA 2013 review"
  },

  // ─── LOPERAMIDE ───
  {
    id: "loperamide",
    name: "Loperamide",
    brandExamples: "Imodium, Lopex, Diarrest, Eldoper",
    category: "Antidiarrheal (Opioid Receptor Agonist — peripheral)",
    mechanism: "Activates peripheral gut opioid receptors, reducing intestinal motility and fluid secretion",
    forSymptoms: ["diarrhea"],
    dosage: {
      adult: "4 mg initially, then 2 mg after each loose stool",
      pediatric: "NOT recommended under 2 years. Use ORS. For children 2–5: only under physician guidance.",
      maxDaily: "16 mg/day",
      frequency: "After each loose stool (max 4 doses/day)",
      withFood: false,
      duration: "Maximum 2 days without medical review",
      notes: "ALWAYS use alongside ORS for rehydration"
    },
    contraindications: {
      conditions: ["liver_disease"],
      medications: [],
      allergies: [],
      pregnancy: "caution",
      pregnancyNote: "Avoid if possible, especially in first trimester. ORS is the priority. Use only if diarrhea is severe and dehydration risk is high.",
      minAge: 2,
      elderlyRisk: "caution",
      elderlyNote: "Can cause ileus in elderly; use cautiously"
    },
    interactions: [],
    counselingPoints: [
      "IMPORTANT: Do NOT use if there is blood in the stool or high fever — may worsen bacterial dysentery",
      "Always use Oral Rehydration Salts (ORS) alongside loperamide to prevent dehydration",
      "Stop if symptoms worsen or continue beyond 2 days without improvement",
      "Not for children under 2 years — risk of ileus",
      "If dehydration occurs (very dark urine, extreme thirst, no urination): seek urgent medical help"
    ],
    patientExplanation: "Loperamide slows down the bowel to reduce diarrhea. It is important to also take ORS drinks to replace lost fluids. Do not use if there is blood in your stool.",
    referralIfNoImprovement: "2 days; refer if bloody diarrhea, high fever, or severe dehydration",
    source: "UpToDate: Loperamide — Drug information; WHO Diarrhea Management Guidelines"
  },

  // ─── ORS ───
  {
    id: "ors",
    name: "Oral Rehydration Salts (ORS)",
    brandExamples: "Dioralyte, Electroral, WHO-ORS, Pedialyte",
    category: "Rehydration",
    mechanism: "Glucose-coupled sodium absorption enhances intestinal water uptake; replaces lost electrolytes",
    forSymptoms: ["diarrhea", "vomiting", "fatigue"],
    dosage: {
      adult: "1 sachet (dissolved in 200mL boiled cooled water) after every loose stool",
      pediatric: "Same; for infants: 5–10 mL/kg after each loose stool. Offer frequently.",
      maxDaily: "As needed based on fluid losses",
      frequency: "After every loose stool or episode of vomiting",
      withFood: false,
      duration: "Until diarrhea resolves",
      notes: "Always prepare with correct amount of clean water. Avoid adding sugar or salt separately."
    },
    contraindications: {
      conditions: [],
      medications: [],
      allergies: [],
      pregnancy: "safe",
      pregnancyNote: "Safe and recommended in pregnancy for rehydration.",
      minAge: 0,
      elderlyRisk: "safe"
    },
    interactions: [],
    counselingPoints: [
      "Dissolve one sachet in exactly 200 mL of clean/boiled cooled water — do not add more or less water",
      "Sip slowly and continuously rather than drinking in one go",
      "Can be given to any age including newborns and the elderly",
      "Continue normal feeding/diet — starving does not help diarrhea",
      "Seek urgent help if: cannot keep any ORS down, signs of severe dehydration, child is drowsy/listless",
      "ORS does not stop diarrhea — it prevents dangerous dehydration while diarrhea resolves"
    ],
    patientExplanation: "ORS replaces the salts and fluids lost during diarrhea and vomiting. It is the most important treatment to prevent dehydration, especially in children and elderly people.",
    referralIfNoImprovement: "If unable to tolerate oral fluids: refer for IV rehydration",
    source: "WHO Guidelines for the Treatment of Diarrhoea; UpToDate: ORT in adults"
  },

  // ─── LACTULOSE ───
  {
    id: "lactulose",
    name: "Lactulose Solution",
    brandExamples: "Duphalac, Lactulose BP, Osmolax",
    category: "Osmotic Laxative",
    mechanism: "Non-absorbable disaccharide; osmotically draws water into colon, softening stools",
    forSymptoms: ["constipation"],
    dosage: {
      adult: "15–45 mL daily, adjusted to produce 1–2 soft stools/day",
      pediatric: "5–10 mL twice daily (1 month–5 years); 10–15 mL twice daily (5–18 years)",
      elderly: "15 mL twice daily initially",
      maxDaily: "Titrate to effect",
      frequency: "Once or twice daily",
      withFood: false,
      duration: "Long-term use acceptable; reassess regularly"
    },
    contraindications: {
      conditions: [],
      medications: [],
      allergies: [],
      pregnancy: "safe",
      pregnancyNote: "Considered safe in pregnancy. First-line osmotic laxative.",
      minAge: 0,
      elderlyRisk: "safe"
    },
    interactions: [],
    counselingPoints: [
      "Takes 24–48 hours to work — do not stop early",
      "May cause bloating and flatulence initially — usually improves after a few days",
      "Drink plenty of fluids to aid effectiveness",
      "Increase dietary fibre (fruits, vegetables, whole grains) for long-term management",
      "Do not use stimulant laxatives regularly — lactulose is safer for long-term use",
      "Diabetic patients: lactulose contains small amounts of galactose/lactose — inform your doctor"
    ],
    patientExplanation: "Lactulose softens the stool by drawing water into the bowel. It takes 1–2 days to work. Drink plenty of water and eat more fibre-rich foods alongside it.",
    referralIfNoImprovement: "2 weeks; refer if constipation is new onset, severe, or associated with blood or weight loss",
    source: "UpToDate: Lactulose — Drug information; NICE Constipation Guidelines"
  },

  // ─── BISACODYL ───
  {
    id: "bisacodyl",
    name: "Bisacodyl",
    brandExamples: "Dulcolax, Laxatives (Bisacodyl), Correctol",
    category: "Stimulant Laxative",
    mechanism: "Stimulates colonic nerve plexus; increases peristalsis and intestinal fluid secretion",
    forSymptoms: ["constipation"],
    dosage: {
      adult: "5–10 mg at bedtime (oral); 10 mg suppository",
      pediatric: "5 mg at bedtime (>4 years)",
      maxDaily: "10 mg/day oral",
      frequency: "Once daily at bedtime",
      withFood: false,
      duration: "Short-term only (2–3 days); not for long-term use",
      notes: "Do NOT take within 1 hour of antacids or milk — may dissolve enteric coating prematurely"
    },
    contraindications: {
      conditions: ["severe_abdominal_pain"],
      medications: ["antacids"],
      allergies: [],
      pregnancy: "caution",
      pregnancyNote: "Avoid stimulant laxatives in pregnancy if possible. Osmotic laxatives (lactulose) preferred.",
      minAge: 4,
      elderlyRisk: "caution",
      elderlyNote: "Short-term use only. Risk of dependence and electrolyte disturbances with prolonged use."
    },
    interactions: [
      { withMed: "diuretics", effect: "Both cause electrolyte loss; monitor potassium if used together.", severity: "mild" }
    ],
    counselingPoints: [
      "Take at bedtime — works in 6–12 hours (usually effective next morning)",
      "Do not take within 1 hour of milk or antacids — destroys the enteric coating",
      "For short-term use only — do not use more than 2–3 days without medical review",
      "Drink plenty of fluids",
      "If abdominal pain is severe, do not use — could indicate bowel obstruction"
    ],
    patientExplanation: "Bisacodyl stimulates the bowel to move. Take it at bedtime and it usually works by morning. Only use it for a few days at a time.",
    referralIfNoImprovement: "3 days; refer if constipation with pain, vomiting, or no response",
    source: "UpToDate: Bisacodyl — Drug information"
  },

  // ─── SODIUM CROMOGLICATE EYE DROPS ───
  {
    id: "sodium_cromoglicate_eye",
    name: "Sodium Cromoglicate Eye Drops",
    brandExamples: "Opticrom, Vividrin, Crom-Allergy 2%",
    category: "Mast Cell Stabiliser (Ocular)",
    mechanism: "Stabilises mast cell membranes, preventing histamine release in conjunctiva",
    forSymptoms: ["eye_itching", "eye_redness", "eye_discharge"],
    dosage: {
      adult: "1–2 drops in each eye 4 times daily (every 4–6 hours)",
      pediatric: "Same as adult (>2 years)",
      maxDaily: "4 applications per eye per day",
      frequency: "4 times daily",
      withFood: false,
      duration: "Throughout allergy season; or as needed"
    },
    contraindications: {
      conditions: [],
      medications: [],
      allergies: [],
      pregnancy: "safe",
      pregnancyNote: "Considered safe in pregnancy for allergic conjunctivitis.",
      minAge: 2,
      elderlyRisk: "safe"
    },
    interactions: [],
    counselingPoints: [
      "For allergic eye symptoms only — not for bacterial or viral conjunctivitis",
      "Works preventatively — best started before allergy season begins",
      "Wash hands before instilling drops",
      "If wearing contact lenses, remove before using and wait 15 minutes before reinserting",
      "If discharge is purulent (yellow/green and thick), see a doctor — may be bacterial infection"
    ],
    patientExplanation: "These eye drops prevent allergic reactions in the eyes by stabilising the cells that cause itching and redness. Use them regularly during your allergy season.",
    referralIfNoImprovement: "If eye discharge is thick/yellow or vision is affected, refer to physician for bacterial or viral assessment",
    source: "UpToDate: Sodium cromolyn ophthalmic — Drug information"
  },

  // ─── HYDROCORTISONE 1% CREAM ───
  {
    id: "hydrocortisone_cream",
    name: "Hydrocortisone 1% Cream / Ointment",
    brandExamples: "Cortaid, HC45, Eurax Hydrocortisone, Dermacort",
    category: "Mild Topical Corticosteroid",
    mechanism: "Anti-inflammatory corticosteroid; reduces local inflammatory mediator release",
    forSymptoms: ["skin_rash", "itching", "insect_bite"],
    dosage: {
      adult: "Apply thinly to affected area 1–2 times daily",
      pediatric: "Seek physician advice for prolonged use in children",
      maxDaily: "2 applications/day",
      frequency: "1–2 times daily",
      withFood: false,
      duration: "Maximum 7 days for OTC use without medical advice",
      notes: "Apply sparingly — a fingertip unit covers approx. 2 palm-sized areas"
    },
    contraindications: {
      conditions: [],
      medications: [],
      allergies: [],
      pregnancy: "caution",
      pregnancyNote: "Avoid large areas or prolonged use in pregnancy. Short-term use on small areas generally considered acceptable.",
      minAge: 10,
      elderlyRisk: "caution",
      elderlyNote: "Elderly skin is more susceptible to atrophy with steroid creams. Use sparingly and for minimum duration."
    },
    interactions: [],
    counselingPoints: [
      "Apply VERY THINLY — only a small amount is needed",
      "Do NOT apply to the face, groin, or underarms unless directed by a doctor",
      "Do NOT use on infected skin (bacterial, fungal, or viral infections)",
      "Maximum 7 days of continuous use — do not use longer without medical review",
      "Do not cover with bandages/dressings unless instructed (increases absorption)",
      "If the rash is infected, red, spreading, or not responding — see a doctor"
    ],
    patientExplanation: "This cream reduces skin inflammation, itching, and redness from mild eczema, contact reactions, or insect bites. Use a very small amount and do not use it for more than 7 days.",
    referralIfNoImprovement: "7 days; refer if infection, spreading rash, or no response",
    source: "UpToDate: Hydrocortisone topical — Drug information; NICE Eczema Guidelines"
  },

  // ─── CALAMINE LOTION ───
  {
    id: "calamine",
    name: "Calamine Lotion",
    brandExamples: "Calamine BP, Lacto Calamine",
    category: "Antipruritic / Soothing Agent",
    mechanism: "Zinc oxide and ferrous carbonate; mild astringent and antipruritic by counter-irritation and cooling",
    forSymptoms: ["itching", "skin_rash", "insect_bite"],
    dosage: {
      adult: "Apply liberally to affected area as needed",
      pediatric: "Same",
      maxDaily: "As needed",
      frequency: "As needed (multiple times daily)",
      withFood: false,
      duration: "Until symptoms resolve"
    },
    contraindications: {
      conditions: [],
      medications: [],
      allergies: [],
      pregnancy: "safe",
      pregnancyNote: "Safe to use throughout pregnancy.",
      minAge: 0,
      elderlyRisk: "safe"
    },
    interactions: [],
    counselingPoints: [
      "Shake well before use",
      "Apply to affected area with a clean cloth or cotton wool",
      "Soothing — especially effective for chickenpox, heat rash, and insect bites",
      "Do not apply to broken, weeping, or infected skin",
      "If the rash spreads or is associated with difficulty breathing (anaphylaxis risk), call emergency services"
    ],
    patientExplanation: "Calamine lotion soothes itchy, irritated skin. It is safe for all ages including during pregnancy. Apply it gently and let it dry on the skin.",
    referralIfNoImprovement: "7 days; refer if infection or widespread rash",
    source: "BNF: Calamine — preparations; UpToDate: Pruritus treatment"
  },

  // ─── BENZYDAMINE GARGLE ───
  {
    id: "benzydamine",
    name: "Benzydamine Hydrochloride Gargle / Spray",
    brandExamples: "Difflam, Tantum Verde, Benzydamine Gargle 0.15%",
    category: "Topical NSAID / Analgesic (Oropharyngeal)",
    mechanism: "Topical anti-inflammatory and analgesic; inhibits prostaglandin synthesis locally",
    forSymptoms: ["sore_throat"],
    dosage: {
      adult: "Gargle or rinse 15 mL undiluted every 1.5–3 hours",
      pediatric: "6–12 years: dilute 1:1 with water; >12 years: adult dose",
      maxDaily: "6–8 times daily",
      frequency: "Every 1.5–3 hours",
      withFood: false,
      duration: "Up to 7 days"
    },
    contraindications: {
      conditions: [],
      medications: [],
      allergies: ["nsaids_allergy", "aspirin_allergy"],
      pregnancy: "caution",
      pregnancyNote: "Avoid in first trimester; limited data. Short-term use may be acceptable in 2nd/3rd trimester.",
      minAge: 6,
      elderlyRisk: "safe"
    },
    interactions: [],
    counselingPoints: [
      "Gargle for at least 30 seconds then spit out — do NOT swallow",
      "Can cause temporary numbness or tingling of mouth — this is normal",
      "If sore throat is very severe, has white patches, or is associated with high fever — see a doctor (possible streptococcal tonsillitis needing antibiotics)",
      "Works best when used regularly throughout the day",
      "For children 6–12: dilute with equal volume of water before gargling"
    ],
    patientExplanation: "This gargle reduces inflammation and pain in a sore throat. Gargle for 30 seconds and spit it out — don't swallow it. If your throat has white patches or fever, see a doctor.",
    referralIfNoImprovement: "5 days; refer if fever, white patches/exudate, lymphadenopathy (possible strep throat needing antibiotics)",
    source: "UpToDate: Benzydamine — Drug information; BNF preparations"
  },

  // ─── DIPHENHYDRAMINE (Sleep Aid) ───
  {
    id: "diphenhydramine",
    name: "Diphenhydramine (Sleep Aid)",
    brandExamples: "Nytol, Benadryl (sleep formulation), Sominex",
    category: "Sedating Antihistamine / OTC Sleep Aid",
    mechanism: "H1-receptor antagonist with marked CNS sedation; also anticholinergic",
    forSymptoms: ["insomnia"],
    dosage: {
      adult: "25–50 mg at bedtime",
      maxDaily: "50 mg/day",
      frequency: "Once at bedtime",
      withFood: false,
      duration: "Maximum 2 weeks; for short-term occasional use only"
    },
    contraindications: {
      conditions: ["glaucoma", "prostate", "epilepsy"],
      medications: ["maoi", "tricyclics"],
      allergies: ["antihistamine_allergy"],
      pregnancy: "avoid",
      pregnancyNote: "Avoid in pregnancy, particularly near delivery — risk of neonatal withdrawal and respiratory depression.",
      minAge: 16,
      elderlyRisk: "avoid",
      elderlyNote: "Strongly contraindicated in elderly: high anticholinergic burden, confusion, urinary retention, falls. Listed on AGS Beers Criteria. Avoid in all patients >65 years."
    },
    interactions: [
      { withMed: "maoi", effect: "Risk of severe anticholinergic toxicity and CNS effects. Contraindicated.", severity: "severe" },
      { withMed: "tricyclics", effect: "Additive anticholinergic effects and sedation.", severity: "moderate" }
    ],
    counselingPoints: [
      "For short-term occasional sleeplessness ONLY — tolerance develops quickly",
      "Do NOT drive the next morning — residual sedation can last up to 8 hours",
      "Avoid alcohol — severely worsens sedation",
      "AVOID in elderly (over 65) — risk of confusion, falls, and urinary retention",
      "Avoid in glaucoma and prostate problems",
      "Address the underlying cause of insomnia — sleep hygiene, stress management"
    ],
    patientExplanation: "Diphenhydramine helps you fall asleep when you're having trouble sleeping. Only use it for a few nights at a time. It can make you drowsy the next morning.",
    referralIfNoImprovement: "If insomnia persists >2 weeks, refer for CBT-I or medical assessment",
    source: "UpToDate: Diphenhydramine — Drug information; AGS Beers Criteria 2023"
  },

  // ═══════════════════════════════════════════════════════════════
  // ANTIBIOTICS (Prescription)
  // ═══════════════════════════════════════════════════════════════

  // ─── AMOXICILLIN ───
  {
    id: "amoxicillin",
    name: "Amoxicillin",
    brandExamples: "Amoxil, Trimox, Hiconcil, Mox, Novamox",
    category: "Antibiotic — Aminopenicillin",
    mechanism: "Beta-lactam antibiotic; inhibits bacterial cell wall synthesis",
    rxType: "Prescription",
    forSymptoms: ["sore_throat", "throat_infection", "ear_infection", "chest_infection", "dysuria", "urinary_frequency", "dental_abscess", "productive_cough"],
    dosage: {
      adult: "500 mg every 8 hours (standard); 875 mg every 12 hours (high-dose)",
      pediatric: "25–50 mg/kg/day in 3 divided doses",
      elderly: "500 mg every 8 hours; reduce if eGFR <30",
      maxDaily: "3000 mg/day",
      frequency: "Every 8 hours (standard) or every 12 hours (high-dose)",
      withFood: false,
      duration: "5–7 days (URTI/ear); 3–7 days (UTI); 5 days (dental)",
    },
    contraindications: {
      conditions: ["kidney_disease"],
      medications: [],
      allergies: ["penicillin"],
      pregnancy: "safe",
      pregnancyNote: "Safe in all trimesters. One of the preferred antibiotics in pregnancy.",
      minAge: 0,
      elderlyRisk: "safe",
      elderlyNote: "Reduce dose if severe renal impairment (eGFR <30 mL/min)"
    },
    interactions: [
      { withMed: "warfarin", effect: "Some antibiotics can alter INR. Monitor closely.", severity: "mild" },
      { withMed: "methotrexate", effect: "Amoxicillin may reduce methotrexate excretion — monitor for toxicity.", severity: "moderate" }
    ],
    counselingPoints: [
      "Complete the full course even if symptoms improve — stopping early causes resistance",
      "Can be taken with or without food",
      "If you develop a rash, stop and seek medical advice — could indicate allergy",
      "Diarrhoea is common — take probiotics to reduce GI upset",
      "Not effective for viral infections (colds, flu) — antibiotics do not treat viruses"
    ],
    patientExplanation: "Amoxicillin is a penicillin antibiotic used for throat, ear, chest, and urinary tract infections. Always complete the full course.",
    referralIfNoImprovement: "48–72 hours; consider culture and sensitivity if no improvement",
    source: "UpToDate: Amoxicillin — Drug information; NICE Antimicrobial Guidelines"
  },

  // ─── CO-AMOXICLAV (AUGMENTIN) ───
  {
    id: "co_amoxiclav",
    name: "Co-amoxiclav (Amoxicillin-Clavulanate)",
    brandExamples: "Augmentin, Clavamox, Synulox, Biomox",
    category: "Antibiotic — Beta-lactam + Beta-lactamase Inhibitor",
    mechanism: "Amoxicillin kills bacteria; clavulanate blocks beta-lactamase enzymes that cause resistance",
    rxType: "Prescription",
    forSymptoms: ["dental_abscess", "wound_infection", "chest_infection", "ear_infection", "throat_infection", "sore_throat", "dysuria"],
    dosage: {
      adult: "625 mg (500/125 mg) every 8 hours",
      pediatric: "25–45 mg/kg/day (amoxicillin component) in 2–3 divided doses",
      elderly: "625 mg every 8 hours; monitor LFTs",
      maxDaily: "1875 mg/day",
      frequency: "Every 8 hours",
      withFood: true,
      duration: "5–7 days (most infections); 3–5 days (dental)",
      notes: "Take at the START of a meal to reduce GI upset"
    },
    contraindications: {
      conditions: ["liver_disease"],
      medications: [],
      allergies: ["penicillin"],
      pregnancy: "caution",
      pregnancyNote: "Avoid in preterm labour risk; associated with NEC in premature infants. Use only when clearly indicated.",
      minAge: 0,
      elderlyRisk: "caution",
      elderlyNote: "Risk of cholestatic jaundice, particularly in elderly. Monitor liver function."
    },
    interactions: [
      { withMed: "warfarin", effect: "May enhance anticoagulant effect. Monitor INR.", severity: "moderate" },
      { withMed: "methotrexate", effect: "Reduced methotrexate excretion — toxicity risk.", severity: "moderate" }
    ],
    counselingPoints: [
      "MUST take with food — reduces risk of nausea and diarrhoea significantly",
      "Complete the full course",
      "More likely than plain amoxicillin to cause diarrhoea — probiotics help",
      "Do NOT use if allergic to penicillin",
      "Indicated for resistant or complicated infections — not first-line for simple URTI"
    ],
    patientExplanation: "Co-amoxiclav is a stronger antibiotic combination used when standard amoxicillin may not work, particularly for dental abscesses, skin infections, and complicated chest infections.",
    referralIfNoImprovement: "48–72 hours",
    source: "UpToDate: Amoxicillin-clavulanate — Drug information; NICE guidelines"
  },

  // ─── AZITHROMYCIN ───
  {
    id: "azithromycin",
    name: "Azithromycin",
    brandExamples: "Zithromax, Azee, Azithral, Zady, Z-Pack",
    category: "Antibiotic — Macrolide",
    mechanism: "Inhibits bacterial protein synthesis by binding to 50S ribosomal subunit",
    rxType: "Prescription",
    forSymptoms: ["sore_throat", "throat_infection", "chest_infection", "productive_cough", "dry_cough", "ear_infection"],
    dosage: {
      adult: "500 mg on Day 1, then 250 mg once daily for 4 days (5-day course) OR 500 mg once daily for 3 days",
      pediatric: "10 mg/kg on Day 1 (max 500 mg), then 5 mg/kg for 4 days",
      elderly: "Standard dose; monitor QT interval",
      maxDaily: "500 mg/day",
      frequency: "Once daily",
      withFood: false,
      duration: "3 days (respiratory) or 5 days (standard)",
    },
    contraindications: {
      conditions: ["liver_disease", "heart_disease", "atrial_fibrillation"],
      medications: ["digoxin"],
      allergies: [],
      pregnancy: "caution",
      pregnancyNote: "Use only if clearly indicated; limited data. Erythromycin or amoxicillin preferred in pregnancy.",
      minAge: 0.5,
      elderlyRisk: "caution",
      elderlyNote: "Risk of QT prolongation in elderly, especially with other QT-prolonging drugs. Check baseline ECG if high risk."
    },
    interactions: [
      { withMed: "digoxin", effect: "Azithromycin may increase digoxin levels significantly. Monitor.", severity: "severe" },
      { withMed: "warfarin", effect: "May potentiate anticoagulant effect. Monitor INR.", severity: "moderate" },
      { withMed: "antiepileptics", effect: "May increase carbamazepine and phenytoin levels.", severity: "moderate" }
    ],
    counselingPoints: [
      "Convenient 3- or 5-day course — but effects last longer due to tissue accumulation",
      "Complete the full course even if you feel better after day 1",
      "Can be taken with or without food",
      "Avoid antacids (containing aluminium/magnesium) within 2 hours",
      "Inform doctor of any heart conditions before use — rare risk of cardiac arrhythmia"
    ],
    patientExplanation: "Azithromycin is a short-course antibiotic for chest and throat infections. It works for several days after you finish the course.",
    referralIfNoImprovement: "72 hours; reassess diagnosis",
    source: "UpToDate: Azithromycin — Drug information; BNF; WHO AWaRe list"
  },

  // ─── DOXYCYCLINE ───
  {
    id: "doxycycline",
    name: "Doxycycline",
    brandExamples: "Vibramycin, Doxylin, Doxybio, Microdox",
    category: "Antibiotic — Tetracycline",
    mechanism: "Inhibits bacterial protein synthesis; bacteriostatic against broad spectrum",
    rxType: "Prescription",
    forSymptoms: ["chest_infection", "productive_cough", "acne", "dysuria", "throat_infection"],
    dosage: {
      adult: "200 mg on Day 1, then 100 mg once daily",
      pediatric: "NOT for children <8 years (dental staining risk)",
      elderly: "100 mg once daily — safe",
      maxDaily: "200 mg/day",
      frequency: "Once daily (after loading dose)",
      withFood: true,
      duration: "5–7 days (infection); 12 weeks (acne)",
      notes: "Take with plenty of water and remain upright for 30 minutes to avoid oesophageal irritation"
    },
    contraindications: {
      conditions: ["liver_disease", "kidney_disease"],
      medications: [],
      allergies: [],
      pregnancy: "avoid",
      pregnancyNote: "CONTRAINDICATED in pregnancy — causes fetal tooth discolouration and bone growth inhibition.",
      minAge: 8,
      elderlyRisk: "safe",
      elderlyNote: "Generally well tolerated in elderly at standard doses"
    },
    interactions: [
      { withMed: "warfarin", effect: "May enhance anticoagulant effect. Monitor INR.", severity: "moderate" },
      { withMed: "antiepileptics", effect: "Enzyme-inducing antiepileptics (carbamazepine, phenytoin) reduce doxycycline levels — consider higher dose.", severity: "moderate" }
    ],
    counselingPoints: [
      "NEVER give to children under 8 years old — causes permanent tooth staining",
      "Do NOT take in pregnancy",
      "Take with a full glass of water; sit or stand upright for at least 30 minutes after taking",
      "Avoid dairy products, calcium supplements, iron, and antacids within 2 hours",
      "Use sunscreen — increased sensitivity to sunlight (photosensitivity)"
    ],
    patientExplanation: "Doxycycline treats chest infections, skin infections, and acne. Take it with water and stay upright to prevent throat irritation. Never take it if you are pregnant.",
    referralIfNoImprovement: "72 hours for acute infection; 6–8 weeks for acne assessment",
    source: "UpToDate: Doxycycline — Drug information; BNF; NICE Acne Guidelines"
  },

  // ─── CIPROFLOXACIN ───
  {
    id: "ciprofloxacin",
    name: "Ciprofloxacin",
    brandExamples: "Ciprobay, Cipro, Ciplox, Ciprolet",
    category: "Antibiotic — Fluoroquinolone",
    mechanism: "Inhibits bacterial DNA gyrase and topoisomerase IV — bactericidal",
    rxType: "Prescription",
    forSymptoms: ["dysuria", "urinary_frequency", "diarrhea", "chest_infection"],
    dosage: {
      adult: "500 mg every 12 hours (UTI); 500–750 mg every 12 hours (other infections)",
      elderly: "250–500 mg every 12 hours; reduce if eGFR <30",
      maxDaily: "1500 mg/day",
      frequency: "Every 12 hours",
      withFood: false,
      duration: "3–7 days (uncomplicated UTI); 7–14 days (complicated infection)",
      notes: "Reserve for infections where first-line agents have failed or are not appropriate (WHO AWaRe: Watch list)"
    },
    contraindications: {
      conditions: ["epilepsy", "kidney_disease"],
      medications: ["antiepileptics", "theophylline"],
      allergies: [],
      pregnancy: "avoid",
      pregnancyNote: "Avoid in pregnancy — risk of cartilage damage to fetus.",
      minAge: 18,
      elderlyRisk: "caution",
      elderlyNote: "Risk of tendon rupture (particularly Achilles) in elderly, especially with corticosteroids. QT prolongation risk."
    },
    interactions: [
      { withMed: "warfarin", effect: "Significantly enhances anticoagulant effect. Monitor INR closely.", severity: "severe" },
      { withMed: "theophylline", effect: "Ciprofloxacin markedly increases theophylline levels — toxicity risk (seizures, arrhythmia).", severity: "severe" },
      { withMed: "antiepileptics", effect: "May lower seizure threshold; monitor closely.", severity: "moderate" },
      { withMed: "digoxin", effect: "May increase digoxin levels.", severity: "moderate" }
    ],
    counselingPoints: [
      "Avoid antacids, calcium, iron, zinc within 2 hours — reduces absorption significantly",
      "Stop immediately and seek help if you develop tendon pain (Achilles, shoulder, knee) — rare but serious tendon rupture risk",
      "Avoid in pregnancy and in patients under 18 years (cartilage toxicity concern)",
      "Drink plenty of water to prevent crystalluria",
      "Reserved for when simpler antibiotics are not suitable — avoid overuse to prevent resistance"
    ],
    patientExplanation: "Ciprofloxacin is a strong antibiotic for urinary tract and gut infections. It should only be used when simpler antibiotics are not appropriate.",
    referralIfNoImprovement: "48–72 hours; send urine culture if UTI",
    source: "UpToDate: Ciprofloxacin — Drug information; WHO AWaRe 2023; NICE UTI Guidelines"
  },

  // ─── NITROFURANTOIN ───
  {
    id: "nitrofurantoin",
    name: "Nitrofurantoin",
    brandExamples: "Macrobid, Macrodantin, Uvamin, Nitrofur",
    category: "Antibiotic — Nitrofuran (UTI-specific)",
    mechanism: "Damages bacterial DNA through reactive intermediates; concentrated in urine",
    rxType: "Prescription",
    forSymptoms: ["dysuria", "urinary_frequency"],
    dosage: {
      adult: "100 mg (modified-release) every 12 hours for 5 days OR 50–100 mg every 6 hours for 7 days",
      elderly: "NOT recommended if eGFR <30 mL/min",
      maxDaily: "400 mg/day",
      frequency: "Every 12 hours (MR) or every 6 hours (standard)",
      withFood: true,
      duration: "3–7 days (uncomplicated UTI)",
      notes: "First-line for uncomplicated lower UTI in women. NOT suitable for upper UTI (pyelonephritis)."
    },
    contraindications: {
      conditions: ["kidney_disease"],
      medications: [],
      allergies: [],
      pregnancy: "caution",
      pregnancyNote: "Safe in 1st and 2nd trimester. AVOID at term (38–42 weeks) — risk of neonatal haemolytic anaemia.",
      minAge: 0.25,
      elderlyRisk: "caution",
      elderlyNote: "Avoid if eGFR <30 mL/min — does not achieve therapeutic urinary concentrations and causes systemic toxicity"
    },
    interactions: [
      { withMed: "quinolone_antibiotics", effect: "Antagonistic — do not combine nitrofurantoin with quinolones for UTI.", severity: "moderate" }
    ],
    counselingPoints: [
      "Always take with food or milk to reduce nausea",
      "Urine may turn yellow-brown — this is harmless",
      "Only works for bladder infections — NOT for kidney infections",
      "Do NOT use if kidney function is severely reduced",
      "Complete the full course"
    ],
    patientExplanation: "Nitrofurantoin is a first-line antibiotic specifically for bladder infections (UTI). It works only in the urine and is taken with food.",
    referralIfNoImprovement: "48 hours; send urine MC&S. If fever/loin pain present, suspect pyelonephritis — needs different antibiotic.",
    source: "UpToDate: Nitrofurantoin — Drug information; NICE UTI Guidelines NG112"
  },

  // ─── TRIMETHOPRIM ───
  {
    id: "trimethoprim",
    name: "Trimethoprim",
    brandExamples: "Proloprim, Triprim, Monotrim, Tiempe",
    category: "Antibiotic — Dihydrofolate Reductase Inhibitor (UTI)",
    mechanism: "Inhibits bacterial dihydrofolate reductase — disrupts folate synthesis",
    rxType: "Prescription",
    forSymptoms: ["dysuria", "urinary_frequency"],
    dosage: {
      adult: "200 mg every 12 hours",
      elderly: "100 mg every 12 hours if eGFR <15",
      maxDaily: "400 mg/day",
      frequency: "Every 12 hours",
      withFood: false,
      duration: "7 days (women); 14 days (men); 3 days (young women, uncomplicated)",
    },
    contraindications: {
      conditions: ["kidney_disease"],
      medications: ["methotrexate"],
      allergies: ["sulfa"],
      pregnancy: "caution",
      pregnancyNote: "Avoid in first trimester (folate antagonist — neural tube defect risk). Use only in 2nd/3rd trimester if necessary.",
      minAge: 0,
      elderlyRisk: "caution",
      elderlyNote: "Can cause hyperkalaemia (high potassium), especially combined with ACE inhibitors/ARBs or potassium-sparing diuretics"
    },
    interactions: [
      { withMed: "methotrexate", effect: "Both inhibit folate metabolism — severe toxicity risk. CONTRAINDICATED.", severity: "severe" },
      { withMed: "warfarin", effect: "May enhance anticoagulant effect. Monitor INR.", severity: "moderate" },
      { withMed: "ace_inhibitors", effect: "Increased risk of hyperkalaemia (high potassium). Monitor electrolytes.", severity: "moderate" }
    ],
    counselingPoints: [
      "Complete the full 7-day course even if symptoms resolve after 1–2 days",
      "Avoid in first trimester of pregnancy",
      "Inform prescriber if you are on methotrexate — this combination is dangerous",
      "Drink plenty of fluids to flush the bladder",
      "If symptoms do not improve in 48 hours or you develop fever/back pain — see a doctor immediately"
    ],
    patientExplanation: "Trimethoprim is an antibiotic used for bladder infections. Drink plenty of water and complete the full course.",
    referralIfNoImprovement: "48 hours; send urine culture (resistance is common — ~30% in some regions)",
    source: "UpToDate: Trimethoprim — Drug information; NICE UTI NG112; PHE Antimicrobial Resistance data"
  },

  // ─── METRONIDAZOLE ───
  {
    id: "metronidazole",
    name: "Metronidazole",
    brandExamples: "Flagyl, Metrogyl, Rozex, Metronide",
    category: "Antibiotic / Antiprotozoal — Nitroimidazole",
    mechanism: "Disrupts DNA of anaerobic bacteria and protozoa",
    rxType: "Prescription",
    forSymptoms: ["dental_abscess", "vaginal_discharge", "diarrhea", "stomach_cramps", "nausea", "bloating"],
    dosage: {
      adult: "400–500 mg every 8 hours (most infections); 2g single dose (BV/trichomoniasis)",
      pediatric: "7.5 mg/kg every 8 hours",
      elderly: "400 mg every 8 hours",
      maxDaily: "2400 mg/day (divided doses)",
      frequency: "Every 8 hours",
      withFood: true,
      duration: "5–7 days (dental/anaerobic); 7 days (BV/GI); single dose (trichomoniasis)",
    },
    contraindications: {
      conditions: ["liver_disease", "epilepsy"],
      medications: ["warfarin"],
      allergies: [],
      pregnancy: "caution",
      pregnancyNote: "Avoid in first trimester. Can be used in 2nd/3rd trimester for serious anaerobic infections. Single high dose (2g) preferably avoided in pregnancy.",
      minAge: 0,
      elderlyRisk: "safe",
      elderlyNote: "Use standard doses; peripheral neuropathy risk with prolonged use"
    },
    interactions: [
      { withMed: "warfarin", effect: "Markedly enhances anticoagulant effect — significant INR increase. Reduce warfarin dose and monitor closely.", severity: "severe" },
      { withMed: "lithium", effect: "May increase lithium toxicity.", severity: "moderate" },
      { withMed: "antiepileptics", effect: "May increase phenytoin and carbamazepine levels.", severity: "moderate" }
    ],
    counselingPoints: [
      "AVOID ALCOHOL completely during treatment and for 48 hours after — causes severe nausea, vomiting, flushing (disulfiram-like reaction)",
      "Take with food to reduce nausea",
      "May cause metallic taste in the mouth — this is normal",
      "Urine may turn dark — harmless",
      "Complete the full course; do not stop early even if symptoms improve"
    ],
    patientExplanation: "Metronidazole treats anaerobic bacterial infections (dental, vaginal, gut). The most important rule: NO alcohol during treatment and 48 hours afterwards.",
    referralIfNoImprovement: "72 hours for dental/anaerobic; 1 week for GI/vaginal",
    source: "UpToDate: Metronidazole — Drug information; BNF; WHO Essential Medicines"
  },

  // ─── CEFALEXIN (CEPHALEXIN) ───
  {
    id: "cefalexin",
    name: "Cefalexin (Cephalexin)",
    brandExamples: "Keflex, Ceporex, Cephalexin, Sporidex",
    category: "Antibiotic — First-Generation Cephalosporin",
    mechanism: "Beta-lactam; inhibits bacterial cell wall synthesis",
    rxType: "Prescription",
    forSymptoms: ["wound_infection", "skin_rash", "dysuria", "urinary_frequency", "ear_infection"],
    dosage: {
      adult: "500 mg every 6 hours (skin infection); 500 mg every 12 hours (UTI)",
      pediatric: "25–50 mg/kg/day in 2–4 divided doses",
      elderly: "500 mg every 8–12 hours; reduce if renal impairment",
      maxDaily: "4000 mg/day",
      frequency: "Every 6–12 hours depending on severity",
      withFood: false,
      duration: "5–7 days (skin); 7 days (UTI)",
    },
    contraindications: {
      conditions: ["kidney_disease"],
      medications: [],
      allergies: ["penicillin"],
      pregnancy: "safe",
      pregnancyNote: "Generally considered safe in pregnancy; used for skin and urinary infections.",
      minAge: 0,
      elderlyRisk: "caution",
      elderlyNote: "Reduce dose if eGFR <40 mL/min"
    },
    interactions: [
      { withMed: "warfarin", effect: "May modestly enhance anticoagulant effect. Monitor INR.", severity: "mild" }
    ],
    counselingPoints: [
      "Can be taken with or without food",
      "About 5–10% of patients allergic to penicillin may also react to cephalosporins — inform prescriber of penicillin allergy",
      "Complete the full course",
      "Good choice for skin infections and UTI when penicillin alternatives are needed",
      "Diarrhoea can occur — take probiotics alongside"
    ],
    patientExplanation: "Cefalexin is an antibiotic used for skin infections, wound infections, and bladder infections. Complete the full prescribed course.",
    referralIfNoImprovement: "48–72 hours",
    source: "UpToDate: Cephalexin — Drug information; NICE Antimicrobial Guidance"
  },

  // ─── CLARITHROMYCIN ───
  {
    id: "clarithromycin",
    name: "Clarithromycin",
    brandExamples: "Klacid, Klaricid, Biaxin, Claritek",
    category: "Antibiotic — Macrolide",
    mechanism: "Inhibits bacterial protein synthesis by binding 50S ribosomal subunit",
    rxType: "Prescription",
    forSymptoms: ["chest_infection", "throat_infection", "sore_throat", "productive_cough", "dry_cough"],
    dosage: {
      adult: "500 mg every 12 hours",
      pediatric: "7.5 mg/kg every 12 hours",
      elderly: "250–500 mg every 12 hours; reduce if renal impairment",
      maxDaily: "1000 mg/day",
      frequency: "Every 12 hours",
      withFood: false,
      duration: "7–14 days",
    },
    contraindications: {
      conditions: ["liver_disease", "heart_disease", "atrial_fibrillation", "kidney_disease"],
      medications: ["statins"],
      allergies: [],
      pregnancy: "avoid",
      pregnancyNote: "Avoid — associated with adverse fetal outcomes in animal studies. Use azithromycin if macrolide needed.",
      minAge: 0.5,
      elderlyRisk: "caution",
      elderlyNote: "QT prolongation risk in elderly; avoid with other QT-prolonging drugs. Risk of cardiac arrhythmia."
    },
    interactions: [
      { withMed: "statins", effect: "Markedly increases statin levels (simvastatin, atorvastatin) — high risk of myopathy/rhabdomyolysis. Suspend statin during course.", severity: "severe" },
      { withMed: "warfarin", effect: "Significantly enhances anticoagulant effect. Monitor INR daily.", severity: "severe" },
      { withMed: "digoxin", effect: "Increases digoxin levels — toxicity risk.", severity: "severe" },
      { withMed: "calcium_channel_blockers", effect: "Increases amlodipine/nifedipine levels — hypotension risk.", severity: "moderate" }
    ],
    counselingPoints: [
      "Very important: inform prescriber of ALL other medications — clarithromycin interacts with many drugs",
      "If on a statin (atorvastatin, simvastatin), discuss stopping it temporarily during the course",
      "Can cause metallic or bitter taste",
      "Take with or without food",
      "Complete the full course"
    ],
    patientExplanation: "Clarithromycin is an antibiotic for chest and throat infections. It interacts with many other medications — always tell your pharmacist all the medications you are taking.",
    referralIfNoImprovement: "72 hours",
    source: "UpToDate: Clarithromycin — Drug information; BNF; NICE Pneumonia Guidelines"
  },

  // ═══════════════════════════════════════════════════════════════
  // RESPIRATORY — PRESCRIPTION
  // ═══════════════════════════════════════════════════════════════

  // ─── SALBUTAMOL (ALBUTEROL) INHALER ───
  {
    id: "salbutamol",
    name: "Salbutamol (Albuterol) Inhaler",
    brandExamples: "Ventolin, Salamol, Proventil, Asthalin, Salbetol",
    category: "Bronchodilator — Short-Acting Beta-2 Agonist (SABA)",
    mechanism: "Stimulates beta-2 adrenergic receptors in bronchial smooth muscle — causes bronchodilation",
    rxType: "Prescription",
    forSymptoms: ["wheeze", "shortness_of_breath", "dry_cough", "chest_infection"],
    dosage: {
      adult: "100–200 mcg (1–2 puffs) as needed; 4–8 puffs via spacer for acute attack",
      pediatric: "100 mcg (1 puff) as needed via spacer; 2–4 puffs for acute attack",
      elderly: "100–200 mcg as needed",
      maxDaily: "Not more than 8 puffs per day without reassessment",
      frequency: "As needed (SABA — reliever inhaler)",
      withFood: false,
      duration: "Use as needed; if using >3 times/week, escalate preventative therapy",
      notes: "Use with spacer device for optimal drug delivery"
    },
    contraindications: {
      conditions: [],
      medications: [],
      allergies: [],
      pregnancy: "safe",
      pregnancyNote: "Safe in pregnancy. Treating asthma in pregnancy is essential — uncontrolled asthma is more dangerous than the medication.",
      minAge: 0,
      elderlyRisk: "caution",
      elderlyNote: "May cause tremor, tachycardia, and hypokalaemia — especially at high doses. Use lowest effective dose."
    },
    interactions: [
      { withMed: "beta_blockers", effect: "Beta-blockers block the effect of salbutamol — avoid non-selective beta-blockers in asthma/COPD.", severity: "severe" },
      { withMed: "diuretics", effect: "Combined with high-dose salbutamol, loop diuretics increase risk of hypokalaemia.", severity: "moderate" },
      { withMed: "digoxin", effect: "Hypokalaemia from salbutamol can increase digoxin toxicity risk.", severity: "moderate" }
    ],
    counselingPoints: [
      "This is your RELIEVER inhaler — use it when you have symptoms (wheeze, breathlessness)",
      "If you need it more than 3 times per week, see your doctor — you may need a preventer inhaler",
      "Correct technique is critical: shake, breathe out, inhale slowly and deeply, hold for 10 seconds",
      "A spacer device makes the inhaler much more effective — especially in children and elderly",
      "If an acute attack does not respond to 4–8 puffs within 15 minutes — call emergency services immediately"
    ],
    patientExplanation: "Salbutamol opens your airways during asthma attacks or wheezing. Use it when you feel breathless or tight-chested. If it stops working, seek emergency help.",
    referralIfNoImprovement: "Immediate referral if acute attack not responding. Routine reassessment if using >3×/week.",
    source: "UpToDate: Albuterol (salbutamol) — Drug information; GINA 2024 Asthma Guidelines; BTS/SIGN Asthma Guideline"
  },

  // ─── PREDNISOLONE ───
  {
    id: "prednisolone",
    name: "Prednisolone (Oral)",
    brandExamples: "Prednisolone, Prelone, Decortin, Wysolone",
    category: "Corticosteroid — Anti-inflammatory",
    mechanism: "Binds glucocorticoid receptors; suppresses inflammatory cytokines and immune response",
    rxType: "Prescription",
    forSymptoms: ["wheeze", "skin_rash", "itching", "joint_pain", "body_ache", "chest_infection"],
    dosage: {
      adult: "30–40 mg once daily for 5–7 days (asthma flare); 20–40 mg for severe allergy",
      pediatric: "1–2 mg/kg/day (max 40 mg) for 3–5 days",
      elderly: "20–30 mg/day with gastroprotection (PPI); risk of adrenal suppression and bone effects",
      maxDaily: "60 mg/day (short-term)",
      frequency: "Once daily in the morning",
      withFood: true,
      duration: "3–7 days (acute flare); longer courses only under physician supervision",
      notes: "Short courses (<7 days) can be stopped without tapering. Longer courses require gradual reduction."
    },
    contraindications: {
      conditions: ["diabetes", "peptic_ulcer", "glaucoma", "osteoporosis"],
      medications: ["warfarin", "ssri"],
      allergies: [],
      pregnancy: "caution",
      pregnancyNote: "Can be used for severe asthma flare in pregnancy — uncontrolled severe asthma is more dangerous than short-course corticosteroids.",
      minAge: 0,
      elderlyRisk: "caution",
      elderlyNote: "High risk: adrenal suppression, hyperglycaemia, osteoporosis, hypertension, cataracts, GI bleeding. Always give with PPI and shortest effective course."
    },
    interactions: [
      { withMed: "warfarin", effect: "May alter anticoagulant effect — monitor INR.", severity: "moderate" },
      { withMed: "ssri", effect: "Increased GI bleeding risk combined with SSRIs — give PPI cover.", severity: "moderate" },
      { withMed: "insulin", effect: "Corticosteroids raise blood glucose — increased insulin requirements in diabetics.", severity: "moderate" },
      { withMed: "metformin", effect: "May worsen glycaemic control in diabetics on metformin.", severity: "moderate" }
    ],
    counselingPoints: [
      "Take in the morning with food to reduce stomach upset and insomnia",
      "Short courses (5–7 days) do not need tapering — but do not stop suddenly if on a longer course",
      "Monitor blood glucose closely if diabetic — steroids significantly raise blood sugar",
      "Carry a steroid card if on long-term steroids",
      "Do not take NSAIDs alongside without a PPI — double the GI bleeding risk"
    ],
    patientExplanation: "Prednisolone is a steroid used to quickly reduce inflammation in asthma attacks, allergic reactions, and joint flares. Short courses are generally safe when taken as prescribed.",
    referralIfNoImprovement: "24–48 hours for acute asthma — escalate to hospital if no response.",
    source: "UpToDate: Prednisolone — Drug information; GINA 2024; BNF"
  },

  // ─── AMBROXOL ───
  {
    id: "ambroxol",
    name: "Ambroxol",
    brandExamples: "Mucosolvan, Ambrolite, Ambril, Ambrodil, Ambrocet",
    category: "Mucolytic / Expectorant",
    mechanism: "Stimulates surfactant production and mucociliary clearance; reduces mucus viscosity",
    rxType: "Both",
    forSymptoms: ["productive_cough", "chest_infection", "dry_cough"],
    dosage: {
      adult: "30 mg 3 times daily (or 75 mg extended-release once daily)",
      pediatric: "7.5 mg 2–3 times daily (2–5 years); 15 mg 2–3 times daily (6–12 years)",
      elderly: "30 mg 2–3 times daily",
      maxDaily: "90 mg/day",
      frequency: "3 times daily (standard) or once daily (extended-release)",
      withFood: true,
      duration: "5–7 days for acute cough; up to 4–6 weeks for chronic",
    },
    contraindications: {
      conditions: ["kidney_disease", "liver_disease"],
      medications: [],
      allergies: [],
      pregnancy: "caution",
      pregnancyNote: "Avoid in first trimester. Limited data in 2nd/3rd trimester — use only if clearly needed.",
      minAge: 0.5,
      elderlyRisk: "safe",
      elderlyNote: "Generally well tolerated in elderly at standard doses"
    },
    interactions: [],
    counselingPoints: [
      "Take with food and drink plenty of water — helps thin and clear mucus",
      "Helps loosen phlegm in the chest — more effective with good hydration",
      "Not a cough suppressant — it helps you cough up phlegm more easily",
      "If productive cough persists more than 3 weeks, refer for chest X-ray"
    ],
    patientExplanation: "Ambroxol helps thin and loosen mucus in the airways, making it easier to cough up. Drink plenty of fluids alongside.",
    referralIfNoImprovement: "3 weeks; investigate for TB, pneumonia, or malignancy if cough persists",
    source: "UpToDate: Ambroxol — Drug information; WHO Essential Medicines; MIMS India"
  },

  // ═══════════════════════════════════════════════════════════════
  // PAIN & MUSCULOSKELETAL — PRESCRIPTION
  // ═══════════════════════════════════════════════════════════════

  // ─── NAPROXEN ───
  {
    id: "naproxen",
    name: "Naproxen",
    brandExamples: "Naprosyn, Naprogesic, Xenobid, Aleve, Flogen",
    category: "NSAID — Non-Steroidal Anti-Inflammatory Drug",
    mechanism: "Non-selective COX-1/COX-2 inhibitor; longer-acting than ibuprofen (12-hour dosing)",
    rxType: "Both",
    forSymptoms: ["joint_pain", "back_pain", "body_ache", "menstrual_pain", "gout_attack", "muscle_spasm", "migraine"],
    dosage: {
      adult: "250–500 mg every 12 hours",
      elderly: "Use lowest effective dose; 250 mg every 12 hours with PPI cover",
      maxDaily: "1250 mg on Day 1, then 1000 mg/day",
      frequency: "Every 12 hours (convenient twice-daily dosing)",
      withFood: true,
      duration: "5–7 days (acute pain); as prescribed for chronic conditions",
    },
    contraindications: {
      conditions: ["peptic_ulcer", "heart_failure", "kidney_disease", "gerd_chronic", "heart_disease", "clotting_disorder", "atrial_fibrillation"],
      medications: ["warfarin", "dabigatran_rivaroxaban", "aspirin_cardio", "clopidogrel", "ace_inhibitors", "arbs", "diuretics", "lithium", "methotrexate"],
      allergies: ["nsaids_allergy", "aspirin_allergy"],
      pregnancy: "avoid",
      pregnancyNote: "Avoid from 20 weeks gestation. Contraindicated in 3rd trimester.",
      minAge: 16,
      elderlyRisk: "caution",
      elderlyNote: "Similar risks to other NSAIDs — GI bleeding, renal impairment, cardiovascular events. Use lowest dose with PPI."
    },
    interactions: [
      { withMed: "warfarin", effect: "Significantly increases bleeding risk.", severity: "severe" },
      { withMed: "lithium", effect: "NSAIDs increase lithium levels — toxicity risk.", severity: "severe" },
      { withMed: "methotrexate", effect: "Increases methotrexate toxicity.", severity: "severe" },
      { withMed: "ace_inhibitors", effect: "Reduced BP control and renal risk.", severity: "severe" }
    ],
    counselingPoints: [
      "Take with food every time",
      "Longer-acting than ibuprofen — twice-daily dosing is more convenient",
      "Avoid alcohol — increases GI bleeding risk",
      "Stop and see a doctor if black stools or stomach pain develops",
      "Not suitable in pregnancy from 20 weeks"
    ],
    patientExplanation: "Naproxen is a long-acting anti-inflammatory painkiller, taken twice daily. It works well for joint pain, arthritis, and period pain.",
    referralIfNoImprovement: "7 days; assess for underlying cause",
    source: "UpToDate: Naproxen — Drug information; BNF; EULAR Osteoarthritis Guidelines"
  },

  // ─── CELECOXIB ───
  {
    id: "celecoxib",
    name: "Celecoxib",
    brandExamples: "Celebrex, Celact, Celcoxx, Revibra",
    category: "NSAID — Selective COX-2 Inhibitor",
    mechanism: "Selectively inhibits COX-2 enzyme — anti-inflammatory with reduced GI risk vs. non-selective NSAIDs",
    rxType: "Prescription",
    forSymptoms: ["joint_pain", "back_pain", "body_ache", "gout_attack", "muscle_spasm"],
    dosage: {
      adult: "100–200 mg once or twice daily",
      elderly: "100 mg twice daily; lowest effective dose",
      maxDaily: "400 mg/day",
      frequency: "Once or twice daily",
      withFood: false,
      duration: "As prescribed; avoid prolonged use without reassessment",
    },
    contraindications: {
      conditions: ["heart_failure", "kidney_disease", "heart_disease", "peptic_ulcer", "atrial_fibrillation"],
      medications: ["warfarin", "aspirin_cardio", "lithium"],
      allergies: ["nsaids_allergy", "aspirin_allergy", "sulfa"],
      pregnancy: "avoid",
      pregnancyNote: "Contraindicated — COX-2 inhibitors cause premature closure of ductus arteriosus.",
      minAge: 18,
      elderlyRisk: "caution",
      elderlyNote: "Lower GI risk than non-selective NSAIDs, but cardiovascular risk remains. Prefer in patients with GI risk who need NSAIDs."
    },
    interactions: [
      { withMed: "warfarin", effect: "May enhance anticoagulant effect. Monitor INR.", severity: "moderate" },
      { withMed: "lithium", effect: "Increases lithium levels.", severity: "severe" },
      { withMed: "aspirin_cardio", effect: "Co-administration negates GI safety advantage. Combine only with PPI cover if both needed.", severity: "moderate" }
    ],
    counselingPoints: [
      "Preferred over ibuprofen/naproxen in patients with high GI risk (history of ulcer, elderly, on steroids)",
      "STILL carries cardiovascular risk — avoid in heart failure, IHD, uncontrolled hypertension",
      "Do not use if allergic to sulfonamides",
      "Does not provide cardioprotective benefit (unlike aspirin)",
      "Take regularly as prescribed, not just when in pain"
    ],
    patientExplanation: "Celecoxib is an anti-inflammatory medication that is gentler on the stomach than standard NSAIDs. However, it still carries heart risks.",
    referralIfNoImprovement: "2–4 weeks for chronic pain; 7 days for acute",
    source: "UpToDate: Celecoxib — Drug information; NICE Osteoarthritis Guidelines; BNF"
  },

  // ─── TRAMADOL ───
  {
    id: "tramadol",
    name: "Tramadol",
    brandExamples: "Tramal, Ultram, Zydol, Tramacip, Contramal",
    category: "Opioid Analgesic (Moderate) — Centrally Acting",
    mechanism: "Weak mu-opioid receptor agonist + serotonin/noradrenaline reuptake inhibitor",
    rxType: "Prescription",
    forSymptoms: ["back_pain", "joint_pain", "body_ache", "neuropathic_pain", "migraine"],
    dosage: {
      adult: "50–100 mg every 4–6 hours as needed",
      elderly: "50 mg every 6 hours (start low; titrate carefully)",
      maxDaily: "400 mg/day (200–300 mg/day in elderly)",
      frequency: "Every 4–6 hours",
      withFood: false,
      duration: "Shortest effective duration; reassess after 2–4 weeks",
      notes: "Controlled/scheduled drug in many countries — check local regulations"
    },
    contraindications: {
      conditions: ["epilepsy", "liver_disease", "kidney_disease"],
      medications: ["maoi", "ssri", "snri", "tricyclics"],
      allergies: ["codeine_allergy"],
      pregnancy: "avoid",
      pregnancyNote: "Avoid — neonatal opioid withdrawal syndrome and respiratory depression in newborn.",
      minAge: 12,
      elderlyRisk: "caution",
      elderlyNote: "High risk in elderly: falls, confusion, constipation, respiratory depression. Listed in AGS Beers Criteria. Start with 25–50 mg; use lowest dose for shortest duration."
    },
    interactions: [
      { withMed: "ssri", effect: "Risk of serotonin syndrome (agitation, hyperthermia, clonus). Avoid or use with extreme caution.", severity: "severe" },
      { withMed: "snri", effect: "Risk of serotonin syndrome. Avoid.", severity: "severe" },
      { withMed: "maoi", effect: "CONTRAINDICATED — severe serotonin syndrome risk.", severity: "severe" },
      { withMed: "tricyclics", effect: "Increased serotonin syndrome and seizure risk.", severity: "severe" },
      { withMed: "antiepileptics", effect: "Tramadol lowers seizure threshold — use with extreme caution in epilepsy.", severity: "severe" }
    ],
    counselingPoints: [
      "Can cause drowsiness — do not drive or operate machinery",
      "Avoid alcohol — increases sedation significantly",
      "Do not take with antidepressants (SSRIs, SNRIs, MAOIs) without explicit physician approval — risk of serotonin syndrome",
      "Risk of dependence with prolonged use — use for the shortest possible time",
      "If you have epilepsy, tramadol can trigger seizures — use with caution"
    ],
    patientExplanation: "Tramadol is a prescription painkiller for moderate to severe pain. It can cause drowsiness and should not be taken with alcohol or most antidepressants.",
    referralIfNoImprovement: "Reassess pain management plan if no response in 1–2 weeks; consider specialist referral",
    source: "UpToDate: Tramadol — Drug information; AGS Beers Criteria 2023; WHO Analgesic Ladder"
  },

  // ─── THIOCOLCHICOSIDE (Muscle Relaxant) ───
  {
    id: "thiocolchicoside",
    name: "Thiocolchicoside",
    brandExamples: "Muscoril, Thiocolchicoside, Myoril, Colchicum",
    category: "Muscle Relaxant — GABA-A / Glycine Receptor Modulator",
    mechanism: "GABA-A and glycine receptor agonist — reduces skeletal muscle spasm",
    rxType: "Prescription",
    forSymptoms: ["muscle_spasm", "back_pain", "joint_pain", "body_ache"],
    dosage: {
      adult: "8 mg every 12 hours (oral); or 4 mg every 12 hours (IM/IV)",
      elderly: "4 mg every 12 hours — lower dose",
      maxDaily: "16 mg/day (oral)",
      frequency: "Every 12 hours",
      withFood: false,
      duration: "5–7 days (acute spasm); not recommended beyond 7 days",
    },
    contraindications: {
      conditions: ["epilepsy", "liver_disease"],
      medications: [],
      allergies: [],
      pregnancy: "avoid",
      pregnancyNote: "Contraindicated — teratogenic in animal studies.",
      breastfeeding: "avoid",
      breastfeedingNote: "Avoid while breastfeeding. Tramadol and its active metabolite (O-desmethyltramadol) are excreted in breast milk and can cause CNS depression, respiratory depression, and sedation in the infant. Use paracetamol or ibuprofen instead.",
      minAge: 16,
      elderlyRisk: "caution",
      elderlyNote: "Risk of excessive muscle relaxation and falls in elderly"
    },
    interactions: [
      { withMed: "maoi", effect: "Potential CNS depression interaction.", severity: "moderate" }
    ],
    counselingPoints: [
      "Can cause drowsiness — avoid driving",
      "Do not take for more than 7 days",
      "Do not use in pregnancy",
      "Used alongside NSAIDs or physiotherapy for back pain — not as a standalone",
      "Avoid alcohol during treatment"
    ],
    patientExplanation: "Thiocolchicoside relaxes muscle spasms and is used with painkillers for acute back pain or muscle injuries. Use it for a maximum of one week.",
    referralIfNoImprovement: "7 days; refer for physiotherapy assessment",
    source: "UpToDate: Skeletal muscle relaxants — Overview; MIMS India; EMA Assessment Report"
  },

  // ─── COLCHICINE ───
  {
    id: "colchicine",
    name: "Colchicine",
    brandExamples: "Colcrys, Colchicine, Tolchicine, Goutichine",
    category: "Anti-Gout — Anti-Inflammatory (Microtubule Inhibitor)",
    mechanism: "Inhibits microtubule formation — disrupts neutrophil migration into joints; reduces inflammation",
    rxType: "Prescription",
    forSymptoms: ["gout_attack", "joint_pain"],
    dosage: {
      adult: "1 mg immediately, then 0.5 mg 1 hour later (total 1.5 mg per attack); OR 0.5 mg 2–3 times daily",
      elderly: "0.5 mg once or twice daily — reduce if renal impairment",
      maxDaily: "1.5–2.5 mg/day",
      frequency: "Twice or three times daily for prophylaxis; specific loading for acute attack",
      withFood: false,
      duration: "Acute attack: 2–3 days. Prophylaxis: 3–6 months after starting urate-lowering therapy.",
    },
    contraindications: {
      conditions: ["kidney_disease", "liver_disease"],
      medications: ["statins", "azole_antifungals"],
      allergies: [],
      pregnancy: "avoid",
      pregnancyNote: "Avoid in pregnancy — teratogenic in animal studies.",
      breastfeeding: "avoid",
      breastfeedingNote: "Avoid while breastfeeding — doxycycline is excreted in breast milk and may affect infant bone and tooth development with prolonged exposure. Use amoxicillin or azithromycin as alternative if clinically appropriate.",
      minAge: 16,
      elderlyRisk: "caution",
      elderlyNote: "Dose reduction required in renal or hepatic impairment. Risk of myopathy with statins."
    },
    interactions: [
      { withMed: "statins", effect: "Risk of colchicine-induced myopathy/rhabdomyolysis — especially with simvastatin and atorvastatin.", severity: "severe" },
      { withMed: "azole_antifungals", effect: "Azoles markedly increase colchicine levels (CYP3A4 inhibition) — risk of toxicity.", severity: "severe" },
      { withMed: "clarithromycin", effect: "Clarithromycin inhibits colchicine metabolism — toxicity risk.", severity: "severe" }
    ],
    counselingPoints: [
      "Start as soon as gout attack begins — the sooner the better",
      "Diarrhoea and nausea are common at higher doses — stop if severe GI toxicity",
      "Avoid grapefruit juice during treatment",
      "Stay well hydrated",
      "Do NOT exceed the prescribed dose — colchicine has a narrow therapeutic margin"
    ],
    patientExplanation: "Colchicine reduces the severe inflammation of a gout attack. Start it as early as possible during an attack. Take the exact dose prescribed — too much is toxic.",
    referralIfNoImprovement: "72 hours; consider systemic corticosteroids or joint aspiration",
    source: "UpToDate: Colchicine — Drug information; ACR 2020 Gout Guidelines; BSR Gout Guidelines"
  },

  // ─── ALLOPURINOL ───
  {
    id: "allopurinol",
    name: "Allopurinol",
    brandExamples: "Zyloprim, Zyloric, Allopurin, Lopurin",
    category: "Urate-Lowering Therapy — Xanthine Oxidase Inhibitor",
    mechanism: "Inhibits xanthine oxidase — reduces uric acid production",
    rxType: "Prescription",
    forSymptoms: ["gout_attack"],
    dosage: {
      adult: "Start 100 mg/day; increase by 100 mg every 2–4 weeks; target dose 300 mg/day",
      elderly: "Start 50 mg/day; titrate slowly",
      maxDaily: "900 mg/day (rarely needed)",
      frequency: "Once daily",
      withFood: true,
      duration: "Long-term (lifelong in most patients with recurrent gout)",
      notes: "Do NOT start during an acute gout attack — wait 2–4 weeks until attack fully resolved"
    },
    contraindications: {
      conditions: ["kidney_disease"],
      medications: ["warfarin", "azole_antifungals"],
      allergies: [],
      pregnancy: "avoid",
      pregnancyNote: "Avoid in pregnancy — use only if absolutely necessary.",
      breastfeeding: "avoid",
      breastfeedingNote: "Avoid while breastfeeding — pregabalin is excreted in breast milk at high levels relative to maternal plasma. Potential for CNS depression in infant. Discuss risk-benefit with physician.",
      minAge: 18,
      elderlyRisk: "caution",
      elderlyNote: "Start at very low doses (50–100 mg); titrate based on uric acid levels and renal function"
    },
    interactions: [
      { withMed: "warfarin", effect: "Allopurinol significantly enhances anticoagulant effect. Monitor INR closely.", severity: "severe" },
      { withMed: "azole_antifungals", effect: "May increase allopurinol levels.", severity: "mild" }
    ],
    counselingPoints: [
      "Do NOT start during a gout attack — will make it worse",
      "You may have more gout attacks in the first few months — this is normal as uric acid crystals dissolve",
      "Take with plenty of water",
      "A rash may indicate a serious hypersensitivity reaction (Stevens-Johnson syndrome) — stop immediately and seek medical help",
      "Long-term medication — take every day even when feeling well; gout will return if you stop"
    ],
    patientExplanation: "Allopurinol prevents future gout attacks by lowering uric acid levels. Do not start it during an attack. It is a lifelong medication for most people.",
    referralIfNoImprovement: "Check serum uric acid after 4–6 weeks; titrate dose to target <360 µmol/L",
    source: "UpToDate: Allopurinol — Drug information; ACR 2020 Gout Guidelines; EULAR Gout Guidelines"
  },

  // ─── PREGABALIN ───
  {
    id: "pregabalin",
    name: "Pregabalin",
    brandExamples: "Lyrica, Pregeb, Pregalin, Pregabid",
    category: "Neuropathic Pain Agent — Voltage-Gated Calcium Channel Modulator",
    mechanism: "Binds alpha-2-delta subunit of voltage-gated calcium channels — reduces neuronal excitability and pain signalling",
    rxType: "Prescription",
    forSymptoms: ["neuropathic_pain", "insomnia"],
    dosage: {
      adult: "75 mg twice daily; increase to 150 mg twice daily after 1 week; max 300 mg twice daily",
      elderly: "Start 25–75 mg/day; titrate slowly based on renal function",
      maxDaily: "600 mg/day (divided doses)",
      frequency: "Twice or three times daily",
      withFood: false,
      duration: "Minimum 2–4 weeks to assess efficacy; long-term if effective",
      notes: "Controlled substance in many countries due to misuse potential"
    },
    contraindications: {
      conditions: ["kidney_disease"],
      medications: [],
      allergies: [],
      pregnancy: "avoid",
      pregnancyNote: "Avoid — associated with increased risk of major congenital malformations and spontaneous abortion.",
      breastfeeding: "caution",
      breastfeedingNote: "Metronidazole passes into breast milk. Single high doses (2g stat): temporarily withhold breastfeeding for 12–24 hours and discard milk. Standard short courses (400 mg TDS for 5–7 days): generally considered acceptable — monitor infant for diarrhoea or vomiting.",
      minAge: 18,
      elderlyRisk: "caution",
      elderlyNote: "Risk of falls, dizziness, and cognitive impairment in elderly. Start very low and titrate slowly."
    },
    interactions: [
      { withMed: "maoi", effect: "Enhanced CNS depression.", severity: "moderate" },
      { withMed: "tricyclics", effect: "Additive CNS depression — sedation risk.", severity: "moderate" }
    ],
    counselingPoints: [
      "Can cause dizziness and drowsiness — avoid driving until you know how it affects you",
      "Do not stop suddenly — taper dose gradually to avoid withdrawal",
      "Takes 2–4 weeks to show full effect for nerve pain",
      "Avoid alcohol — increases sedation",
      "Report to prescriber: unexplained muscle pain, blurred vision, or swelling of hands/feet"
    ],
    patientExplanation: "Pregabalin reduces nerve pain (burning, tingling, shooting pain) by calming overactive nerve signals. It may cause drowsiness initially.",
    referralIfNoImprovement: "4–6 weeks at target dose; consider pain specialist referral",
    source: "UpToDate: Pregabalin — Drug information; NICE Neuropathic Pain Guidelines NG173; BNF"
  },

  // ═══════════════════════════════════════════════════════════════
  // GASTROINTESTINAL — PRESCRIPTION
  // ═══════════════════════════════════════════════════════════════

  // ─── ONDANSETRON ───
  {
    id: "ondansetron",
    name: "Ondansetron",
    brandExamples: "Zofran, Emeset, Ondanset, Ondem, Vomikind",
    category: "Antiemetic — 5-HT3 Receptor Antagonist",
    mechanism: "Selectively blocks serotonin 5-HT3 receptors in GI tract and CNS — prevents nausea and vomiting",
    rxType: "Prescription",
    forSymptoms: ["nausea", "vomiting"],
    dosage: {
      adult: "4–8 mg every 8 hours as needed",
      pediatric: "0.15 mg/kg (max 4 mg) every 8 hours",
      elderly: "4 mg every 8 hours",
      maxDaily: "32 mg/day (adult); 12 mg/day (elderly/child)",
      frequency: "Every 8 hours (or as needed)",
      withFood: false,
      duration: "1–2 days for acute nausea; as prescribed for chemotherapy-related",
    },
    contraindications: {
      conditions: ["heart_disease", "atrial_fibrillation"],
      medications: ["ssri", "snri"],
      allergies: [],
      pregnancy: "caution",
      pregnancyNote: "Avoid in first trimester (possible cardiovascular malformation). Can be used in 2nd/3rd trimester for severe hyperemesis under physician supervision.",
      minAge: 0.5,
      elderlyRisk: "caution",
      elderlyNote: "Risk of QT prolongation; use lowest effective dose"
    },
    interactions: [
      { withMed: "ssri", effect: "Increased serotonin syndrome risk and additive QT prolongation.", severity: "severe" },
      { withMed: "snri", effect: "Additive serotonin syndrome risk.", severity: "moderate" }
    ],
    counselingPoints: [
      "Does not treat the cause of vomiting — still need to identify and treat the underlying cause",
      "Can cause headache and constipation — common side effects",
      "Dissolving tablets (ODT) go under the tongue — do not swallow whole",
      "If vomiting is severe or persistent (>24 hours), seek medical attention for IV fluids and further assessment",
      "Inform doctor of any heart conditions before use"
    ],
    patientExplanation: "Ondansetron stops nausea and vomiting by blocking the signal in your brain and gut. It works very well for severe nausea but does not treat the underlying cause.",
    referralIfNoImprovement: "24 hours of severe vomiting — risk of dehydration and electrolyte imbalance",
    source: "UpToDate: Ondansetron — Drug information; BNF; WHO Essential Medicines"
  },

  // ─── HYOSCINE BUTYLBROMIDE (BUSCOPAN) ───
  {
    id: "buscopan",
    name: "Hyoscine Butylbromide (Buscopan)",
    brandExamples: "Buscopan, Buscogast, Hyoscine-N-butylbromide",
    category: "Antispasmodic — Anticholinergic",
    mechanism: "Inhibits muscarinic receptors in smooth muscle — relaxes GI and urinary tract spasms",
    rxType: "Both",
    forSymptoms: ["stomach_cramps", "bloating", "nausea", "dysuria", "urinary_frequency"],
    dosage: {
      adult: "20 mg (2 tablets) 4 times daily as needed",
      pediatric: "10 mg 3 times daily (6–12 years); adult dose for >12 years",
      elderly: "20 mg 3 times daily — caution due to anticholinergic effects",
      maxDaily: "80 mg/day",
      frequency: "Up to 4 times daily",
      withFood: false,
      duration: "As needed for acute spasms; not for long-term use without diagnosis",
    },
    contraindications: {
      conditions: ["glaucoma", "prostate"],
      medications: ["tricyclics"],
      allergies: [],
      pregnancy: "caution",
      pregnancyNote: "Limited data; use only if clearly needed.",
      breastfeeding: "caution",
      breastfeedingNote: "Limited data on ondansetron in breastfeeding. Small amounts may pass into breast milk. Use only if clearly needed and for short duration — monitor infant for any drowsiness or feeding changes.",
      minAge: 6,
      elderlyRisk: "caution",
      elderlyNote: "Anticholinergic effects (dry mouth, urinary retention, confusion) more pronounced in elderly"
    },
    interactions: [
      { withMed: "tricyclics", effect: "Additive anticholinergic effects — dry mouth, constipation, urinary retention, confusion.", severity: "moderate" }
    ],
    counselingPoints: [
      "Good for colicky pain, irritable bowel spasms, and period cramps",
      "May cause dry mouth and blurred vision — this is normal",
      "Do not use if you have glaucoma or prostate enlargement",
      "Does not treat the cause of pain — if persistent, refer for investigation",
      "Different from hyoscine (travel sickness) — this formulation does not cross the blood-brain barrier"
    ],
    patientExplanation: "Buscopan relaxes muscle spasms in the stomach, bowel, and bladder. It works well for colicky abdominal pain and IBS-related cramps.",
    referralIfNoImprovement: "1 week; refer if no diagnosis established or symptoms recur",
    source: "UpToDate: Hyoscine butylbromide — Drug information; BNF; NICE IBS Guidelines"
  },

  // ═══════════════════════════════════════════════════════════════
  // ANTIFUNGALS
  // ═══════════════════════════════════════════════════════════════

  // ─── FLUCONAZOLE (ORAL) ───
  {
    id: "fluconazole",
    name: "Fluconazole (Oral)",
    brandExamples: "Diflucan, Forcan, Flucos, Zocon, Syscan",
    category: "Antifungal — Triazole",
    mechanism: "Inhibits fungal ergosterol synthesis by blocking CYP51 (lanosterol 14α-demethylase)",
    rxType: "Prescription",
    forSymptoms: ["vaginal_discharge", "oral_thrush", "fungal_skin"],
    dosage: {
      adult: "150 mg single dose (vaginal candidiasis); 50–100 mg/day for 7–14 days (oral/oesophageal thrush); 150 mg weekly (recurrent)",
      elderly: "50–100 mg/day; reduce in renal impairment",
      maxDaily: "400 mg/day (systemic infection)",
      frequency: "Single dose (vaginal) or once daily (others)",
      withFood: false,
      duration: "Single dose (uncomplicated vaginal thrush); 7–14 days (oral thrush)",
    },
    contraindications: {
      conditions: ["liver_disease", "kidney_disease", "heart_disease"],
      medications: ["warfarin", "statins"],
      allergies: [],
      pregnancy: "avoid",
      pregnancyNote: "Avoid single high-dose (150 mg) — linked to cardiac defects in fetus. Topical clotrimazole is preferred in pregnancy.",
      breastfeeding: "caution",
      breastfeedingNote: "Fluconazole single dose (150 mg): avoid breastfeeding for 24–48 hours. Prolonged doses (e.g., 200–400 mg/day): avoid breastfeeding. Low single-dose regimes are sometimes considered acceptable — confirm with physician. Topical clotrimazole is the preferred alternative.",
      minAge: 0,
      elderlyRisk: "caution",
      elderlyNote: "Dose reduction required if eGFR <50. QT prolongation risk at higher doses."
    },
    interactions: [
      { withMed: "warfarin", effect: "Markedly enhances anticoagulant effect — significant INR increase. Monitor closely.", severity: "severe" },
      { withMed: "statins", effect: "Inhibits statin metabolism (CYP3A4) — risk of myopathy/rhabdomyolysis. Consider suspending statin.", severity: "severe" },
      { withMed: "antiepileptics", effect: "Increases phenytoin levels — monitor for toxicity.", severity: "moderate" },
      { withMed: "azole_antifungals", effect: "Do not combine multiple azole antifungals.", severity: "moderate" }
    ],
    counselingPoints: [
      "Single 150 mg tablet is effective for uncomplicated vaginal thrush in most women",
      "Symptoms may take 1–3 days to fully resolve after the tablet",
      "Inform pharmacist/doctor of ALL medications — fluconazole interacts with many drugs",
      "Topical clotrimazole cream is preferred during pregnancy",
      "If vaginal thrush recurs >4 times per year, refer for investigation (check for diabetes, immunosuppression)"
    ],
    patientExplanation: "Fluconazole is a single-tablet antifungal treatment for vaginal thrush or oral thrush. Symptoms usually clear within a few days.",
    referralIfNoImprovement: "7 days; consider resistance or underlying condition (diabetes, immunosuppression)",
    source: "UpToDate: Fluconazole — Drug information; BASHH Candidiasis Guidelines; BNF"
  },

  // ─── CLOTRIMAZOLE TOPICAL ───
  {
    id: "clotrimazole_topical",
    name: "Clotrimazole (Topical Cream / Pessary)",
    brandExamples: "Canesten, Clotrimaderm, Lotrimin, Candid, Fungival",
    category: "Antifungal — Azole (Topical)",
    mechanism: "Inhibits fungal ergosterol synthesis — disrupts fungal cell membrane integrity",
    rxType: "OTC",
    forSymptoms: ["fungal_skin", "vaginal_discharge", "itching", "skin_rash"],
    dosage: {
      adult: "Apply 2–3 times daily to affected area (cream); 500 mg pessary once (vaginal) or 100 mg pessary for 6 days",
      pediatric: "Apply 2–3 times daily (cream) — safe in children",
      elderly: "Standard application",
      maxDaily: "Apply as directed",
      frequency: "2–3 times daily (cream); once or as directed (pessary/powder)",
      withFood: false,
      duration: "2–4 weeks for skin; 1–6 days for vaginal pessary",
    },
    contraindications: {
      conditions: [],
      medications: [],
      allergies: [],
      pregnancy: "safe",
      pregnancyNote: "Preferred antifungal in pregnancy for vaginal thrush. Use cream/pessary only — avoid oral fluconazole.",
      breastfeeding: "safe",
      breastfeedingNote: "Topical clotrimazole is considered safe during breastfeeding — minimal systemic absorption. Avoid applying to nipple/areola area; if used there, wipe off gently before each feed.",
      minAge: 0,
      elderlyRisk: "safe",
      elderlyNote: "Safe topical antifungal"
    },
    interactions: [],
    counselingPoints: [
      "Wash and dry area thoroughly before applying",
      "Continue treatment for the full course even if symptoms improve quickly",
      "Avoid tight-fitting clothing and synthetic fabrics — encourages fungal growth",
      "Avoid sharing towels",
      "Pessaries and some vaginal creams can damage latex condoms and diaphragms",
      "Preferred treatment for vaginal thrush in pregnancy"
    ],
    patientExplanation: "Clotrimazole cream or pessary treats fungal infections of the skin, groin, or vagina. Apply to clean dry skin and complete the full course.",
    referralIfNoImprovement: "2 weeks for skin; 7 days for vaginal thrush — consider oral fluconazole or alternate diagnosis",
    source: "UpToDate: Clotrimazole — Drug information; BASHH Candidiasis Guidelines; BNF"
  },

  // ─── TERBINAFINE ───
  {
    id: "terbinafine",
    name: "Terbinafine",
    brandExamples: "Lamisil, Terbicip, Sebifin, Zimig, Terbinex",
    category: "Antifungal — Allylamine (Topical and Oral)",
    mechanism: "Inhibits squalene epoxidase — disrupts ergosterol synthesis and causes fungal cell membrane damage",
    rxType: "Both",
    forSymptoms: ["fungal_skin", "itching", "skin_rash"],
    dosage: {
      adult: "Cream: apply once or twice daily. Oral: 250 mg once daily.",
      elderly: "250 mg/day (oral); standard topical",
      maxDaily: "250 mg/day (oral)",
      frequency: "Once or twice daily (topical); once daily (oral)",
      withFood: false,
      duration: "Cream: 1–2 weeks (athlete's foot), 2–4 weeks (ringworm). Oral: 6 weeks (fingernail fungus), 12 weeks (toenail fungus).",
    },
    contraindications: {
      conditions: ["liver_disease", "kidney_disease"],
      medications: [],
      allergies: [],
      pregnancy: "caution",
      pregnancyNote: "Avoid oral form in pregnancy. Topical cream with caution — limited data.",
      minAge: 12,
      elderlyRisk: "safe",
      elderlyNote: "Standard doses; monitor liver function with prolonged oral use"
    },
    interactions: [
      { withMed: "warfarin", effect: "May alter anticoagulant effect — monitor INR.", severity: "mild" },
      { withMed: "ssri", effect: "Terbinafine inhibits CYP2D6 — may increase levels of some SSRIs.", severity: "mild" }
    ],
    counselingPoints: [
      "Topical terbinafine works faster than other OTC antifungal creams for athlete's foot",
      "Apply to clean dry skin; include a 2 cm margin around the visible infection",
      "Oral form for nail fungus requires a long course (6–12 weeks) and liver function monitoring",
      "Avoid tight shoes and synthetic socks — allows moisture and fungal growth",
      "Do not share nail files or clippers"
    ],
    patientExplanation: "Terbinafine treats fungal skin infections like athlete's foot, ringworm, and nail fungus. The cream works in 1–2 weeks; nail infections need oral tablets for 3 months.",
    referralIfNoImprovement: "4 weeks (topical); reassess diagnosis — consider tinea versicolor or psoriasis if not responding",
    source: "UpToDate: Terbinafine — Drug information; BNF; NICE Fungal Skin Infections Guidance"
  },

  // ─── NYSTATIN ───
  {
    id: "nystatin",
    name: "Nystatin Oral Suspension / Pastilles",
    brandExamples: "Mycostatin, Nilstat, Nystop, Nyderm",
    category: "Antifungal — Polyene (Topical / Oral Candida)",
    mechanism: "Binds to ergosterol in fungal cell membranes — increases permeability and causes cell death",
    rxType: "Prescription",
    forSymptoms: ["oral_thrush", "vaginal_discharge"],
    dosage: {
      adult: "100,000–500,000 units (1–5 mL) 4 times daily, swished in mouth and swallowed",
      pediatric: "100,000 units 4 times daily (neonates/infants); 500,000 units 4 times daily (older children)",
      elderly: "Standard dose — well tolerated",
      maxDaily: "2,000,000 units/day",
      frequency: "4 times daily (after food)",
      withFood: false,
      duration: "7–14 days; continue for 48 hours after symptoms resolve",
    },
    contraindications: {
      conditions: [],
      medications: [],
      allergies: [],
      pregnancy: "safe",
      pregnancyNote: "Safe in all trimesters — minimal systemic absorption.",
      minAge: 0,
      elderlyRisk: "safe",
      elderlyNote: "Minimal side effects; not systemically absorbed"
    },
    interactions: [],
    counselingPoints: [
      "Hold liquid in mouth for as long as possible before swallowing — swish around all areas of the mouth",
      "Take after meals",
      "Remove dentures before use; clean and soak dentures separately",
      "Continue for 48 hours after symptoms resolve to prevent recurrence",
      "Rarely absorbed systemically — very safe, even for newborns and pregnant women"
    ],
    patientExplanation: "Nystatin liquid treats thrush (white patches) in the mouth. Swish it around your mouth thoroughly before swallowing. Safe for babies and during pregnancy.",
    referralIfNoImprovement: "7 days; consider fluconazole for resistant oral candidiasis",
    source: "UpToDate: Nystatin — Drug information; BNF; WHO Essential Medicines"
  },

  // ═══════════════════════════════════════════════════════════════
  // TOPICAL ANTIBACTERIALS / SKIN INFECTIONS
  // ═══════════════════════════════════════════════════════════════

  // ─── MUPIROCIN CREAM ───
  {
    id: "mupirocin",
    name: "Mupirocin 2% Cream / Ointment",
    brandExamples: "Bactroban, Bactoderm, Mupiro, T-Bact",
    category: "Topical Antibiotic — Pseudomonic Acid",
    mechanism: "Inhibits bacterial isoleucyl-tRNA synthetase — stops protein synthesis in Gram-positive bacteria",
    rxType: "Prescription",
    forSymptoms: ["wound_infection", "skin_rash"],
    dosage: {
      adult: "Apply small amount 3 times daily to affected area",
      pediatric: "Apply 3 times daily — safe in children",
      elderly: "Apply 3 times daily",
      maxDaily: "3 applications/day",
      frequency: "3 times daily",
      withFood: false,
      duration: "5–10 days",
      notes: "Cover with sterile dressing if required. Do not use on large body surface areas."
    },
    contraindications: {
      conditions: ["kidney_disease"],
      medications: [],
      allergies: [],
      pregnancy: "safe",
      pregnancyNote: "Minimal systemic absorption; considered safe in pregnancy for localised skin infections.",
      minAge: 0,
      elderlyRisk: "safe",
      elderlyNote: "Safe topical antibiotic"
    },
    interactions: [],
    counselingPoints: [
      "First-line topical antibiotic for impetigo (school sores) and small infected skin lesions",
      "Wash hands before and after applying",
      "Do not use inside the nose unless prescribed for MRSA decolonisation",
      "Do not use on large areas — potential for systemic absorption of the polyethylene glycol base (renal risk)",
      "If no improvement in 3–5 days, send skin swab for culture — consider oral antibiotics"
    ],
    patientExplanation: "Mupirocin cream kills bacteria on the skin. Apply 3 times daily to infected areas for up to 10 days. Keep the area clean and covered.",
    referralIfNoImprovement: "5 days; consider oral antibiotics (cefalexin) for spreading infection",
    source: "UpToDate: Mupirocin — Drug information; NICE Impetigo Guidance; BNF"
  },

  // ─── FUSIDIC ACID CREAM ───
  {
    id: "fusidic_acid",
    name: "Fusidic Acid 2% Cream",
    brandExamples: "Fucidin, Fucibet, Fucithalmic, Fucicort",
    category: "Topical Antibiotic — Fusidane",
    mechanism: "Inhibits bacterial elongation factor G — disrupts protein synthesis in Staphylococcus",
    rxType: "Prescription",
    forSymptoms: ["wound_infection", "skin_rash"],
    dosage: {
      adult: "Apply 3–4 times daily",
      pediatric: "Apply 3 times daily",
      elderly: "Apply 3–4 times daily",
      maxDaily: "4 applications/day",
      frequency: "3–4 times daily",
      withFood: false,
      duration: "5–7 days",
    },
    contraindications: {
      conditions: [],
      medications: [],
      allergies: [],
      pregnancy: "safe",
      pregnancyNote: "Minimal systemic absorption; considered safe for topical use in pregnancy.",
      minAge: 0,
      elderlyRisk: "safe",
      elderlyNote: "Safe topical antibiotic"
    },
    interactions: [],
    counselingPoints: [
      "Effective specifically against Staphylococcus aureus — good for infected eczema and impetigo",
      "Apply to clean skin; wash hands before and after use",
      "Resistance develops quickly — do not use for longer than 7 days without review",
      "Available as combination with corticosteroid (Fucibet) for infected eczema — do not use on uninfected eczema",
      "If infection spreading or not improving in 3 days, oral antibiotics needed"
    ],
    patientExplanation: "Fusidic acid cream treats infected skin, especially infected eczema and impetigo. Apply to clean skin and do not use for more than a week without review.",
    referralIfNoImprovement: "5–7 days; consider oral cefalexin/flucloxacillin",
    source: "UpToDate: Fusidic acid — Drug information; NICE Impetigo Guidelines; BNF"
  },

  // ─── BENZOYL PEROXIDE (Acne) ───
  {
    id: "benzoyl_peroxide",
    name: "Benzoyl Peroxide 2.5–5% Gel / Cream",
    brandExamples: "PanOxyl, Brevoxyl, Acnecide, Oxy, Persol",
    category: "Topical Acne Agent — Antimicrobial / Keratolytic",
    mechanism: "Releases oxygen — kills Cutibacterium acnes; mild keratolytic (unblocks pores)",
    rxType: "OTC",
    forSymptoms: ["acne"],
    dosage: {
      adult: "Apply once or twice daily to clean, dry affected skin",
      pediatric: "Use from 12 years; start with lowest concentration (2.5%)",
      elderly: "N/A — primarily a condition of younger adults",
      maxDaily: "Apply twice daily",
      frequency: "Once or twice daily",
      withFood: false,
      duration: "6–12 weeks for assessment; long-term if effective",
      notes: "Start with 2.5% concentration and increase if tolerated"
    },
    contraindications: {
      conditions: [],
      medications: [],
      allergies: [],
      pregnancy: "caution",
      pregnancyNote: "Limited human data; generally considered safe at low concentrations topically. Prefer topical erythromycin if systemic absorption concerns.",
      minAge: 12,
      elderlyRisk: "safe",
      elderlyNote: "Rarely applicable"
    },
    interactions: [],
    counselingPoints: [
      "Can bleach fabric, hair, and bedding — use white towels and pillowcases",
      "Start with the lowest strength (2.5%) and apply every other day initially — reduces irritation",
      "Apply to the whole affected area, not just individual spots",
      "May cause initial dryness, redness, and peeling — this is normal and settles",
      "Use a non-comedogenic moisturiser to manage dryness; apply sunscreen on exposed areas"
    ],
    patientExplanation: "Benzoyl peroxide kills the bacteria that cause acne and helps unblock pores. It may bleach fabrics — use white bedding. Improvement is visible after 6–8 weeks.",
    referralIfNoImprovement: "12 weeks; consider topical retinoid or antibiotic (clindamycin/doxycycline)",
    source: "UpToDate: Benzoyl peroxide — Drug information; NICE Acne Vulgaris Guidelines NG198; BNF"
  },

  // ═══════════════════════════════════════════════════════════════
  // EYE / EAR INFECTIONS
  // ═══════════════════════════════════════════════════════════════

  // ─── CHLORAMPHENICOL EYE DROPS ───
  {
    id: "chloramphenicol_eye",
    name: "Chloramphenicol 0.5% Eye Drops",
    brandExamples: "Chlorsig, Optrex Infected Eyes, Kemicetine, Fenicol",
    category: "Topical Antibiotic — Eye (Broad Spectrum)",
    mechanism: "Inhibits bacterial protein synthesis by binding 50S ribosomal subunit",
    rxType: "Both",
    forSymptoms: ["eye_infection", "eye_redness", "eye_discharge"],
    dosage: {
      adult: "1–2 drops in affected eye(s) every 2 hours for 2 days, then every 4 hours for 3 days",
      pediatric: "Same as adult from 2 years",
      elderly: "Standard dosing",
      maxDaily: "Hourly in severe infection",
      frequency: "Every 2–4 hours while awake",
      withFood: false,
      duration: "5–7 days",
      notes: "Ointment: apply at night for sustained effect"
    },
    contraindications: {
      conditions: [],
      medications: [],
      allergies: [],
      pregnancy: "caution",
      pregnancyNote: "Generally considered safe topically. Avoid near term due to theoretical grey baby syndrome (minimal risk from eye drops).",
      minAge: 2,
      elderlyRisk: "safe",
      elderlyNote: "Safe topical use"
    },
    interactions: [],
    counselingPoints: [
      "Tilt head back, pull down lower eyelid, apply drops into the pocket — do not touch dropper to eye",
      "Can be used in one or both eyes depending on which are infected",
      "Wash hands before applying; discard drops 4 weeks after opening",
      "Remove contact lenses before use; do not reinsert for at least 15 minutes",
      "If eye pain, visual disturbance, or severe redness — refer immediately (may not be simple conjunctivitis)"
    ],
    patientExplanation: "Chloramphenicol eye drops treat bacterial eye infections (red, sticky eyes). Apply regularly and wash hands thoroughly before and after.",
    referralIfNoImprovement: "48–72 hours; if photophobia, eye pain, or vision change — refer urgently to ophthalmology",
    source: "UpToDate: Chloramphenicol ophthalmic — Drug information; NICE Conjunctivitis Guidance; BNF"
  },

  // ─── ACETIC ACID EAR DROPS (Otitis Externa) ───
  {
    id: "acetic_acid_ear",
    name: "Acetic Acid 2% Ear Drops",
    brandExamples: "EarCalm, Vosol, Acetasol, Otic Domeboro",
    category: "Topical Antiseptic — Ear (Otitis Externa)",
    mechanism: "Restores acidic environment of ear canal — inhibits bacterial and fungal growth",
    rxType: "OTC",
    forSymptoms: ["ear_infection", "ear_pain"],
    dosage: {
      adult: "2–3 drops in affected ear 3–4 times daily",
      pediatric: "2–3 drops 3 times daily (from 12 years)",
      elderly: "Standard dosing",
      maxDaily: "4 applications/day",
      frequency: "3–4 times daily",
      withFood: false,
      duration: "7–14 days",
      notes: "For otitis externa (outer ear canal infection) ONLY — do not use if eardrum is perforated"
    },
    contraindications: {
      conditions: [],
      medications: [],
      allergies: [],
      pregnancy: "safe",
      pregnancyNote: "Safe for topical ear use in pregnancy.",
      minAge: 12,
      elderlyRisk: "safe",
      elderlyNote: "Standard use"
    },
    interactions: [],
    counselingPoints: [
      "For outer ear canal infections only — if you think your eardrum is perforated, do NOT use",
      "Warm the drops to body temperature before instilling (hold bottle in hands for a minute) — reduces dizziness",
      "Lie on your side with affected ear up; stay in position for 5 minutes after instilling",
      "Keep ear dry — no swimming; use cotton wool lightly in ear during showering",
      "If no improvement in 5 days or ear pain is severe — see a doctor (may need antibacterial/steroid drops)"
    ],
    patientExplanation: "Acetic acid ear drops treat swimmer's ear (outer ear infection) by restoring the natural acidic environment that keeps bacteria away. Keep the ear dry during treatment.",
    referralIfNoImprovement: "5 days; if severe pain, spreading redness, or discharge — prescribe ciprofloxacin ear drops",
    source: "UpToDate: Otitis externa — Treatment; NICE Otitis Externa Guidelines; BNF"
  },

  // ─── MIGRAINE TREATMENT: SUMATRIPTAN ───
  {
    id: "sumatriptan",
    name: "Sumatriptan",
    brandExamples: "Imigran, Imitrex, Suminat, Migranil",
    category: "Antimigraine — Triptan (5-HT1B/1D Agonist)",
    mechanism: "Selectively agonises 5-HT1B/1D receptors — causes intracranial vasoconstriction and blocks CGRP release",
    rxType: "Prescription",
    forSymptoms: ["migraine", "headache"],
    dosage: {
      adult: "50–100 mg at onset of migraine; may repeat after 2 hours if partial response. Max 300 mg/day.",
      elderly: "50 mg; use with caution — assess cardiovascular risk first",
      maxDaily: "300 mg/day",
      frequency: "At onset; repeat once only after 2 hours if needed",
      withFood: false,
      duration: "Per attack (not for regular preventive use)",
      notes: "Only use when migraine is established — not for headache prevention"
    },
    contraindications: {
      conditions: ["heart_disease", "hypertension", "atrial_fibrillation"],
      medications: ["maoi", "ssri", "snri"],
      allergies: [],
      pregnancy: "caution",
      pregnancyNote: "Limited data; use only for severe unresponsive migraine in pregnancy. Paracetamol is first-line in pregnancy.",
      breastfeeding: "safe",
      breastfeedingNote: "Compatible with breastfeeding — sumatriptan is excreted in very low levels in breast milk. Discard expressed milk for 12 hours after the dose as an extra precaution, then resume breastfeeding normally.",
      minAge: 18,
      elderlyRisk: "caution",
      elderlyNote: "Cardiovascular risk assessment essential before use in elderly. Avoid if uncontrolled hypertension."
    },
    interactions: [
      { withMed: "maoi", effect: "CONTRAINDICATED — risk of serotonin syndrome and hypertensive crisis.", severity: "severe" },
      { withMed: "ssri", effect: "Risk of serotonin syndrome. Use with caution; monitor closely.", severity: "severe" },
      { withMed: "snri", effect: "Risk of serotonin syndrome.", severity: "moderate" }
    ],
    counselingPoints: [
      "Take at the first sign of a migraine headache — not during aura, and not for regular headache prevention",
      "Can cause chest tightness, tingling, or flushing — usually harmless but stop if severe chest pain",
      "Not suitable if you have heart disease, uncontrolled blood pressure, or have had a stroke",
      "If two doses in 24 hours do not work — this attack is not responding; see a doctor",
      "Avoid overuse (>10 days/month) — can cause medication-overuse headache"
    ],
    patientExplanation: "Sumatriptan specifically treats migraine attacks by constricting the swollen blood vessels in your head. Take it at the start of the headache phase.",
    referralIfNoImprovement: "Consider preventive therapy if migraines occur >4 days/month; refer to neurology",
    source: "UpToDate: Sumatriptan — Drug information; NICE Headache Guidelines NG150; BNF"
  },
];

// ─── RED FLAG REFERRAL RULES ───
export interface ReferralRule {
  triggerSymptoms?: string[];
  triggerConditions?: string[];
  message: string;
  urgency: "emergency" | "urgent" | "routine";
  reason: string;
}

export const REFERRAL_RULES: ReferralRule[] = [
  // Age-specific
  {
    triggerSymptoms: ["mild_fever", "high_fever", "very_high_fever"],
    message: "Fever in a child under 3 months requires IMMEDIATE medical evaluation. Do not treat with OTC antipyretics without physician review first.",
    urgency: "emergency",
    reason: "Neonatal/infant fever: possible serious bacterial infection (sepsis, meningitis)"
  },
  // Cough referral
  {
    triggerSymptoms: ["productive_cough", "dry_cough"],
    message: "Cough lasting more than 3 weeks should be investigated by a physician (possible TB, pneumonia, or malignancy).",
    urgency: "routine",
    reason: "Chronic cough requires investigation per NICE guidelines"
  },
  // Sore throat
  {
    triggerSymptoms: ["sore_throat"],
    message: "Sore throat with white patches/exudate, difficulty swallowing, or high fever may be streptococcal — requires physician assessment for antibiotic treatment.",
    urgency: "urgent",
    reason: "Streptococcal pharyngitis: requires antibiotics; untreated may cause rheumatic fever"
  },
  // Ear pain
  {
    triggerSymptoms: ["ear_pain"],
    message: "Ear pain with discharge, significant hearing loss, or fever may indicate otitis media requiring antibiotic treatment.",
    urgency: "urgent",
    reason: "Otitis media: requires antibiotic assessment (especially in children)"
  },
  // Eye discharge
  {
    triggerSymptoms: ["eye_discharge"],
    message: "Purulent (thick yellow/green) eye discharge may indicate bacterial conjunctivitis requiring antibiotic eye drops. Refer to physician or optometrist.",
    urgency: "urgent",
    reason: "Bacterial conjunctivitis: requires antibiotic eye drops"
  },
  // Diarrhea duration
  {
    triggerSymptoms: ["diarrhea"],
    message: "Diarrhea lasting more than 3 days, or associated with high fever, or in a patient with diabetes/immunosuppression, requires physician review.",
    urgency: "urgent",
    reason: "Persistent diarrhea: may indicate bacterial infection or inflammatory bowel disease"
  },
];

// ─── POSSIBLE CONDITIONS MAP ───
export interface PossibleCondition {
  name: string;
  likelihood: "common" | "possible";
  triggerSymptoms: string[];
  description: string;
  otcManageable: boolean;
  referralNote?: string;
}

export const POSSIBLE_CONDITIONS: PossibleCondition[] = [
  {
    name: "Viral Upper Respiratory Tract Infection (Common Cold)",
    likelihood: "common",
    triggerSymptoms: ["runny_nose", "sneezing", "nasal_congestion", "sore_throat", "dry_cough", "mild_fever"],
    description: "Self-limiting viral infection of the upper respiratory tract. Typically caused by rhinovirus.",
    otcManageable: true
  },
  {
    name: "Influenza (Flu)",
    likelihood: "common",
    triggerSymptoms: ["high_fever", "body_ache", "fatigue", "dry_cough", "headache", "sore_throat"],
    description: "Systemic viral illness with prominent fever and myalgia. More severe than common cold.",
    otcManageable: true,
    referralNote: "High-risk patients (elderly, immunocompromised, pregnancy, heart/lung disease) should be referred for antiviral consideration (oseltamivir)"
  },
  {
    name: "Allergic Rhinitis",
    likelihood: "common",
    triggerSymptoms: ["runny_nose", "sneezing", "nasal_congestion", "eye_itching"],
    description: "IgE-mediated allergic response to inhaled allergens (pollen, dust mites, pet dander).",
    otcManageable: true
  },
  {
    name: "Tension Headache",
    likelihood: "common",
    triggerSymptoms: ["headache", "fatigue"],
    description: "Most common type of headache. Typically bilateral, pressing/tightening quality, mild-moderate severity.",
    otcManageable: true
  },
  {
    name: "Migraine",
    likelihood: "possible",
    triggerSymptoms: ["headache", "nausea", "vomiting"],
    description: "Moderate-severe headache, often unilateral and pulsating, with nausea/vomiting and light/sound sensitivity.",
    otcManageable: true,
    referralNote: "Frequent migraines (>4/month) require physician assessment for preventive therapy"
  },
  {
    name: "Gastroenteritis (Viral)",
    likelihood: "common",
    triggerSymptoms: ["nausea", "vomiting", "diarrhea", "stomach_cramps"],
    description: "Self-limiting viral infection of GI tract. Main risk is dehydration.",
    otcManageable: true
  },
  {
    name: "Food Poisoning / Bacterial Gastroenteritis",
    likelihood: "possible",
    triggerSymptoms: ["vomiting", "diarrhea", "stomach_cramps", "high_fever"],
    description: "Rapid onset nausea/vomiting/diarrhoea after food ingestion. May be caused by Salmonella, E. coli, Staph. aureus.",
    otcManageable: false,
    referralNote: "Severe cases, bloody diarrhea, or high fever require physician assessment for antibiotics and IV fluids"
  },
  {
    name: "GERD / Acid Reflux",
    likelihood: "common",
    triggerSymptoms: ["heartburn", "nausea", "bloating"],
    description: "Reflux of gastric acid into the oesophagus, causing burning retrosternal discomfort, typically after meals.",
    otcManageable: true,
    referralNote: "Refer if: dysphagia, weight loss, vomiting blood, symptoms >4 weeks despite treatment"
  },
  {
    name: "Functional Constipation",
    likelihood: "common",
    triggerSymptoms: ["constipation", "bloating"],
    description: "Infrequent bowel movements or difficult stool passage without organic cause.",
    otcManageable: true
  },
  {
    name: "Urticaria / Allergic Skin Reaction",
    likelihood: "common",
    triggerSymptoms: ["skin_rash", "itching"],
    description: "IgE-mediated mast cell degranulation causing wheals and flare reaction. Can be idiopathic or triggered by food/drug/contact allergens.",
    otcManageable: true,
    referralNote: "If associated with swelling of lips/tongue/throat or difficulty breathing → ANAPHYLAXIS — call emergency services immediately"
  },
  {
    name: "Contact Dermatitis / Eczema Flare",
    likelihood: "possible",
    triggerSymptoms: ["skin_rash", "itching"],
    description: "Inflammatory skin reaction to irritants or allergens (contact dermatitis) or atopic eczema flare.",
    otcManageable: true
  },
  {
    name: "Allergic Conjunctivitis",
    likelihood: "common",
    triggerSymptoms: ["eye_itching", "eye_redness", "eye_discharge", "sneezing"],
    description: "IgE-mediated allergic response in conjunctiva; bilateral itching and watering eyes.",
    otcManageable: true
  },
  {
    name: "Bacterial Conjunctivitis",
    likelihood: "possible",
    triggerSymptoms: ["eye_redness", "eye_discharge"],
    description: "Bacterial infection of conjunctiva; typically unilateral initially, purulent discharge, eye 'stuck' on waking.",
    otcManageable: false,
    referralNote: "Requires antibiotic eye drops (e.g., chloramphenicol). Refer to physician or optometrist."
  },
  {
    name: "Musculoskeletal / Mechanical Back Pain",
    likelihood: "common",
    triggerSymptoms: ["back_pain", "body_ache"],
    description: "Non-specific low back pain from muscle/ligament strain. Most common type of back pain.",
    otcManageable: true,
    referralNote: "Refer if: pain radiating down leg (sciatica), bowel/bladder dysfunction, or following trauma"
  },
  {
    name: "Osteoarthritis",
    likelihood: "possible",
    triggerSymptoms: ["joint_pain", "back_pain"],
    description: "Degenerative joint disease; typically affects weight-bearing joints. Worse with activity, improves with rest.",
    otcManageable: true,
    referralNote: "Refer for physiotherapy assessment. NICE recommends exercise as first-line."
  },
  {
    name: "Acute Viral Pharyngitis (Sore Throat)",
    likelihood: "common",
    triggerSymptoms: ["sore_throat", "mild_fever", "runny_nose"],
    description: "Viral inflammation of pharynx. Self-limiting; usually resolves in 7 days. Does NOT require antibiotics.",
    otcManageable: true
  },
  {
    name: "Streptococcal Tonsillitis / Pharyngitis",
    likelihood: "possible",
    triggerSymptoms: ["sore_throat", "high_fever"],
    description: "Group A Streptococcus pharyngitis; characterised by exudate on tonsils, cervical lymphadenopathy, and high fever. REQUIRES ANTIBIOTICS.",
    otcManageable: false,
    referralNote: "Requires throat swab and/or antibiotics (penicillin V or amoxicillin). Untreated can lead to rheumatic fever."
  },
  {
    name: "Viral Fever",
    likelihood: "common",
    triggerSymptoms: ["mild_fever", "high_fever", "fatigue", "body_ache"],
    description: "Non-specific febrile illness from viral infection. Self-limiting, typically 3–7 days.",
    otcManageable: true,
    referralNote: "Refer if fever persists >3 days without improvement or if >40°C"
  },
  {
    name: "Insomnia (Primary / Short-term)",
    likelihood: "common",
    triggerSymptoms: ["insomnia"],
    description: "Difficulty initiating or maintaining sleep, often stress-related or due to poor sleep hygiene.",
    otcManageable: true,
    referralNote: "Persistent insomnia (>4 weeks) requires medical assessment and CBT for insomnia (CBT-I)"
  },
];

// ─── CONDITION → IMPLIED SYMPTOMS ────────────────────────────────────────────
// Maps internal condition IDs to the symptom IDs whose medications are clinically
// relevant for that condition. Used by the engine to surface Rx recommendations
// even when only a condition (not a symptom) is selected.
export const CONDITION_TO_SYMPTOMS: Record<string, string[]> = {
  asthma:             ["wheeze", "dry_cough", "productive_cough"],
  copd:               ["wheeze", "productive_cough", "dry_cough"],
  gerd:               ["heartburn", "nausea", "stomach_cramps"],
  gerd_chronic:       ["heartburn", "nausea", "stomach_cramps"],
  peptic_ulcer:       ["heartburn", "stomach_cramps"],
  gout:               ["gout_attack", "joint_pain"],
  insomnia:           ["insomnia"],
  urinary_tract_infection: ["dysuria", "urinary_frequency"],
  neuropathic_pain:   ["neuropathic_pain"],
  migraine_chronic:   ["migraine", "headache"],
  depression_anxiety: ["insomnia"],
  anxiety:            ["insomnia"],
  depression:         ["insomnia"],
  thyroid_disease:    [],
  hypertension:       [],
  diabetes_t2:        [],
  heart_failure:      [],
  ckd:                [],
  liver_disease:      [],
  epilepsy:           [],
  glaucoma:           [],
  atrial_fibrillation:[],
  ischemic_heart_disease: [],
  hyperlipidemia:     [],
  bleeding_disorder:  [],
  osteoporosis:       [],
  parkinsons:         [],
};
