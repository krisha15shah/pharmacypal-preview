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
    minAge: number;
    elderlyRisk: "safe" | "caution" | "avoid";
    elderlyNote?: string;
  };
  interactions: DrugInteraction[];
  counselingPoints: string[];
  patientExplanation: string;
  referralIfNoImprovement: string;
  source: string;
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
