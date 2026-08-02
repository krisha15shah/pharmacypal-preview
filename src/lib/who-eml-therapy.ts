// WHO Essential Medicines List (22nd edition, 2023) — first-line therapy options
// keyed by internal condition IDs used across the clinical engine.
// Source: WHO Model List of Essential Medicines (EML) & WHO treatment guidelines.
// This is an informational reference layer; every entry is flagged Rx unless
// clearly an OTC monograph. Pharmacists still refer to local formulary and
// require a valid prescription for all Rx items.

export type TherapyRx = "OTC" | "Rx" | "Rx / specialist";

export interface TherapyOption {
  /** Generic drug name (INN) */
  drug: string;
  /** Therapeutic class */
  drugClass: string;
  /** Typical adult dose (WHO EML dosing where available) */
  adultDose: string;
  /** Optional paediatric dose (weight-based) */
  pediatricDose?: string;
  /** Route of administration */
  route?: string;
  /** Prescription status */
  rx: TherapyRx;
  /** Brief clinical note — line of therapy, key caveats */
  note?: string;
}

export interface ConditionTherapy {
  /** Human-readable condition name */
  label: string;
  /** WHO / guideline reference */
  source: string;
  /** Ordered list of therapy options (first-line first) */
  options: TherapyOption[];
  /** Short non-drug / referral note */
  referralNote?: string;
}

/**
 * CONDITION_THERAPIES — internal condition ID → guideline-based therapy card.
 * Keys must match IDs produced by `icdToConditionId` in `src/lib/icd-mapping.ts`.
 */
export const CONDITION_THERAPIES: Record<string, ConditionTherapy> = {
  // ═══════════════════════ CARDIOVASCULAR ═══════════════════════
  hypertension: {
    label: "Hypertension (essential)",
    source: "WHO EML 22 · WHO HEARTS · NICE NG136",
    options: [
      { drug: "Amlodipine", drugClass: "Calcium channel blocker", adultDose: "5–10 mg PO once daily", rx: "Rx", note: "First-line, esp. age ≥55 or Black patients. Ankle oedema common." },
      { drug: "Lisinopril / Enalapril", drugClass: "ACE inhibitor", adultDose: "Lisinopril 10–40 mg PO once daily; Enalapril 5–20 mg PO 1–2×/day", rx: "Rx", note: "First-line <55y non-Black. Monitor K⁺/creatinine. Avoid pregnancy." },
      { drug: "Losartan / Telmisartan", drugClass: "ARB", adultDose: "Losartan 50–100 mg PO daily; Telmisartan 40–80 mg PO daily", rx: "Rx", note: "ACEi alternative if cough. Avoid pregnancy." },
      { drug: "Hydrochlorothiazide", drugClass: "Thiazide diuretic", adultDose: "12.5–25 mg PO once daily", rx: "Rx", note: "Add-on. Monitor Na⁺/K⁺, uric acid." },
      { drug: "Bisoprolol / Atenolol", drugClass: "Beta-blocker", adultDose: "Bisoprolol 2.5–10 mg daily; Atenolol 25–100 mg daily", rx: "Rx", note: "Reserve for post-MI, HF, AF, or resistant HTN." },
    ],
    referralNote: "BP ≥180/120 with symptoms → emergency referral.",
  },
  heart_failure: {
    label: "Chronic heart failure (HFrEF)",
    source: "WHO EML 22 · ESC 2021 · NICE NG106",
    options: [
      { drug: "Enalapril / Lisinopril", drugClass: "ACE inhibitor", adultDose: "Titrate to max tolerated (e.g. enalapril 10 mg BID)", rx: "Rx", note: "Foundation therapy. Reduces mortality." },
      { drug: "Bisoprolol / Carvedilol", drugClass: "Beta-blocker", adultDose: "Bisoprolol 1.25 mg daily up-titrated; Carvedilol 3.125 mg BID up-titrated", rx: "Rx", note: "Start low-go-slow after stabilisation." },
      { drug: "Spironolactone", drugClass: "MRA", adultDose: "25–50 mg PO once daily", rx: "Rx", note: "Monitor K⁺ & renal function." },
      { drug: "Furosemide", drugClass: "Loop diuretic", adultDose: "20–80 mg PO daily (or higher, divided)", rx: "Rx", note: "Symptom control for congestion." },
      { drug: "Dapagliflozin / Empagliflozin", drugClass: "SGLT2 inhibitor", adultDose: "10 mg PO once daily", rx: "Rx", note: "Added to quadruple therapy irrespective of diabetes." },
    ],
  },
  ischemic_heart_disease: {
    label: "Ischaemic heart disease / stable angina",
    source: "WHO EML 22 · ESC 2019",
    options: [
      { drug: "Aspirin", drugClass: "Antiplatelet", adultDose: "75–100 mg PO once daily", rx: "Rx", note: "Secondary prevention lifelong unless bleeding risk." },
      { drug: "Atorvastatin", drugClass: "Statin", adultDose: "40–80 mg PO once daily at night", rx: "Rx", note: "High-intensity statin post-MI/angina." },
      { drug: "Bisoprolol / Metoprolol", drugClass: "Beta-blocker", adultDose: "Bisoprolol 2.5–10 mg daily", rx: "Rx", note: "Anti-anginal; reduces reinfarction post-MI." },
      { drug: "Glyceryl trinitrate (GTN) SL", drugClass: "Nitrate", adultDose: "0.3–0.6 mg SL PRN, repeat q5min ×3", rx: "Rx", note: "Acute angina relief. Call ambulance if unrelieved >15 min." },
      { drug: "Ramipril / Perindopril", drugClass: "ACE inhibitor", adultDose: "Ramipril 2.5–10 mg daily", rx: "Rx", note: "Especially if LV dysfunction, diabetes, or HTN." },
    ],
  },
  atrial_fibrillation: {
    label: "Atrial fibrillation",
    source: "WHO EML 22 · ESC 2020",
    options: [
      { drug: "Apixaban / Rivaroxaban / Dabigatran", drugClass: "DOAC", adultDose: "Apixaban 5 mg BID; Rivaroxaban 20 mg daily; Dabigatran 150 mg BID", rx: "Rx", note: "Stroke prevention if CHA₂DS₂-VASc ≥2 (♂) or ≥3 (♀)." },
      { drug: "Warfarin", drugClass: "Vitamin K antagonist", adultDose: "Titrate to INR 2.0–3.0", rx: "Rx", note: "Use in valvular AF or when DOACs unaffordable/unavailable." },
      { drug: "Bisoprolol / Metoprolol", drugClass: "Beta-blocker", adultDose: "Bisoprolol 2.5–10 mg daily", rx: "Rx", note: "Rate control target HR <110." },
      { drug: "Digoxin", drugClass: "Cardiac glycoside", adultDose: "125–250 mcg PO daily", rx: "Rx", note: "Add-on rate control, esp. sedentary or HF." },
    ],
  },
  hyperlipidemia: {
    label: "Dyslipidaemia",
    source: "WHO EML 22 · ESC/EAS 2019",
    options: [
      { drug: "Atorvastatin", drugClass: "Statin (high-intensity)", adultDose: "20–80 mg PO once daily at night", rx: "Rx", note: "First-line for primary/secondary prevention." },
      { drug: "Simvastatin", drugClass: "Statin (moderate)", adultDose: "20–40 mg PO nocte", rx: "Rx", note: "Avoid with strong CYP3A4 inhibitors & grapefruit." },
      { drug: "Rosuvastatin", drugClass: "Statin", adultDose: "10–40 mg PO daily", rx: "Rx" },
      { drug: "Ezetimibe", drugClass: "Cholesterol absorption inhibitor", adultDose: "10 mg PO once daily", rx: "Rx", note: "Add-on if LDL target not met on statin." },
    ],
  },
  stroke_ischemic: {
    label: "Ischaemic stroke — secondary prevention",
    source: "WHO EML 22 · AHA/ASA 2021",
    options: [
      { drug: "Aspirin", drugClass: "Antiplatelet", adultDose: "75–100 mg PO daily", rx: "Rx", note: "Lifelong unless AF (then anticoagulate)." },
      { drug: "Clopidogrel", drugClass: "P2Y12 inhibitor", adultDose: "75 mg PO once daily", rx: "Rx", note: "Alternative to aspirin or for high-risk TIA (DAPT 21–90 days)." },
      { drug: "Atorvastatin", drugClass: "High-intensity statin", adultDose: "40–80 mg PO nocte", rx: "Rx" },
      { drug: "Antihypertensive (per BP)", drugClass: "ACEi / ARB / thiazide", adultDose: "Target BP <130/80", rx: "Rx" },
    ],
  },
  dvt_pe: {
    label: "Deep vein thrombosis / pulmonary embolism",
    source: "WHO EML 22 · ACCP 2021",
    options: [
      { drug: "Apixaban", drugClass: "DOAC", adultDose: "10 mg BID ×7 d, then 5 mg BID ×3–6 mo", rx: "Rx", note: "First-line for most non-cancer VTE." },
      { drug: "Rivaroxaban", drugClass: "DOAC", adultDose: "15 mg BID ×21 d, then 20 mg daily ×3–6 mo", rx: "Rx" },
      { drug: "Enoxaparin", drugClass: "LMWH", adultDose: "1 mg/kg SC BID or 1.5 mg/kg daily", rx: "Rx", note: "Preferred in pregnancy or cancer-associated VTE." },
      { drug: "Warfarin (bridged with LMWH)", drugClass: "VKA", adultDose: "Target INR 2.0–3.0", rx: "Rx", note: "Where DOACs unavailable/contraindicated." },
    ],
  },

  // ═══════════════════════ ENDOCRINE ═══════════════════════
  diabetes_t2: {
    label: "Type 2 diabetes mellitus",
    source: "WHO EML 22 · ADA/EASD 2023",
    options: [
      { drug: "Metformin", drugClass: "Biguanide", adultDose: "500 mg PO OD → 1 g BID with meals (max 2 g/day)", rx: "Rx", note: "First-line unless eGFR <30. Hold in acute illness/dehydration." },
      { drug: "Gliclazide", drugClass: "Sulfonylurea", adultDose: "40–320 mg PO daily (divided if >160 mg)", rx: "Rx", note: "Add-on. Hypoglycaemia risk, esp. in elderly." },
      { drug: "Empagliflozin / Dapagliflozin", drugClass: "SGLT2 inhibitor", adultDose: "10 mg PO once daily", rx: "Rx", note: "Cardio-renal benefit; risk of DKA & genital infection." },
      { drug: "Sitagliptin / Linagliptin", drugClass: "DPP-4 inhibitor", adultDose: "Sitagliptin 100 mg daily; Linagliptin 5 mg daily", rx: "Rx", note: "Weight-neutral; well tolerated." },
      { drug: "Insulin (NPH ± regular / analogue)", drugClass: "Insulin", adultDose: "Individualised; start 0.1–0.2 U/kg/day basal", rx: "Rx", note: "When HbA1c >9% or oral therapy inadequate." },
      { drug: "Liraglutide / Semaglutide", drugClass: "GLP-1 agonist", adultDose: "Titrate weekly (semaglutide 0.25 → 1 mg SC weekly)", rx: "Rx / specialist", note: "Weight loss + CV benefit." },
    ],
  },
  diabetes_t1: {
    label: "Type 1 diabetes mellitus",
    source: "WHO EML 22 · ISPAD 2022",
    options: [
      { drug: "Insulin basal (glargine / detemir / NPH)", drugClass: "Long-acting insulin", adultDose: "0.2–0.4 U/kg/day SC", rx: "Rx", note: "Lifelong; basal-bolus regimen mandatory." },
      { drug: "Insulin bolus (aspart / lispro / regular)", drugClass: "Short-acting insulin", adultDose: "0.5–1 U per 10–15 g carbohydrate", rx: "Rx", note: "With meals. Adjust to CGM/SMBG." },
    ],
    referralNote: "All T1DM patients need endocrinology follow-up and structured education.",
  },
  diabetes_insipidus: {
    label: "Diabetes insipidus (arginine vasopressin deficiency/resistance)",
    source: "WHO EML 22 \u00b7 Endocrine Society",
    options: [
      { drug: "Desmopressin (DDAVP)", drugClass: "Vasopressin analogue", adultDose: "Oral 100\u2013200 mcg 2\u20133\u00d7 daily; intranasal 10\u201320 mcg 1\u20132\u00d7 daily", rx: "Rx", note: "Central DI only. Titrate to urine output; watch for hyponatraemia." },
      { drug: "Hydrochlorothiazide (\u00b1 amiloride)", drugClass: "Thiazide diuretic", adultDose: "25 mg PO daily", rx: "Rx", note: "Nephrogenic DI \u2014 paradoxically reduces urine volume with low-salt diet." },
      { drug: "Indometacin", drugClass: "NSAID", adultDose: "25 mg PO TDS", rx: "Rx", note: "Adjunct in nephrogenic DI; monitor renal function." },
    ],
    referralNote: "Ensure free access to water. Endocrinology review required; confirm central vs nephrogenic type.",
  },
  hypothyroidism: {
    label: "Hypothyroidism",
    source: "WHO EML 22 · ATA 2014",
    options: [
      { drug: "Levothyroxine", drugClass: "Thyroid hormone", adultDose: "1.6 mcg/kg/day PO once daily on empty stomach", rx: "Rx", note: "Start 25–50 mcg in elderly/IHD. Recheck TSH in 6–8 wks." },
    ],
  },
  hyperthyroidism: {
    label: "Hyperthyroidism / Graves' disease",
    source: "WHO EML 22 · ATA 2016",
    options: [
      { drug: "Carbimazole (or methimazole)", drugClass: "Thionamide", adultDose: "Carbimazole 15–40 mg PO daily", rx: "Rx", note: "Warn: sore throat/fever → check WBC (agranulocytosis)." },
      { drug: "Propylthiouracil", drugClass: "Thionamide", adultDose: "100–150 mg PO TID", rx: "Rx", note: "First trimester pregnancy; thyroid storm." },
      { drug: "Propranolol", drugClass: "Non-selective β-blocker", adultDose: "20–40 mg PO TID/QID", rx: "Rx", note: "Symptom control (tremor, tachycardia)." },
    ],
    referralNote: "Endocrinology referral for definitive therapy (RAI/surgery).",
  },
  thyroid_disease: {
    label: "Thyroid disorder",
    source: "WHO EML 22",
    options: [
      { drug: "Levothyroxine (if hypothyroid)", drugClass: "Thyroid hormone", adultDose: "1.6 mcg/kg/day PO", rx: "Rx" },
      { drug: "Carbimazole (if hyperthyroid)", drugClass: "Thionamide", adultDose: "15–40 mg PO daily", rx: "Rx" },
    ],
    referralNote: "Confirm subtype with TFTs before therapy.",
  },

  // ═══════════════════════ RESPIRATORY ═══════════════════════
  asthma: {
    label: "Asthma",
    source: "WHO EML 22 · GINA 2024",
    options: [
      { drug: "Budesonide-formoterol (AIR/MART)", drugClass: "ICS-LABA", adultDose: "160/4.5 mcg 1–2 puffs PRN (Track 1) or BID + PRN", rx: "Rx", note: "GINA preferred for step 1–5. Avoid SABA-only." },
      { drug: "Beclometasone / Budesonide", drugClass: "Inhaled corticosteroid", adultDose: "Low-dose 200–400 mcg/day (beclometasone)", rx: "Rx", note: "Rinse mouth; monitor growth in children." },
      { drug: "Salbutamol", drugClass: "SABA", adultDose: "100–200 mcg inh PRN", rx: "Rx", note: "Reliever only; overuse (>2 canisters/yr) = poor control." },
      { drug: "Prednisolone (exacerbation)", drugClass: "Oral corticosteroid", adultDose: "40–50 mg PO daily ×5–7 days", rx: "Rx" },
      { drug: "Montelukast", drugClass: "LTRA", adultDose: "10 mg PO once daily evening", rx: "Rx", note: "Boxed warning: neuropsychiatric effects." },
    ],
    referralNote: "Peak flow <50% predicted, cyanosis, or exhaustion → emergency.",
  },
  copd: {
    label: "Chronic obstructive pulmonary disease",
    source: "WHO EML 22 · GOLD 2024",
    options: [
      { drug: "Tiotropium", drugClass: "LAMA", adultDose: "18 mcg inh once daily", rx: "Rx", note: "Foundation maintenance therapy." },
      { drug: "Salmeterol / Formoterol", drugClass: "LABA", adultDose: "Salmeterol 50 mcg BID; Formoterol 12 mcg BID", rx: "Rx" },
      { drug: "LABA/LAMA fixed-dose (e.g. tiotropium-olodaterol)", drugClass: "Dual bronchodilator", adultDose: "1 inh once daily", rx: "Rx", note: "Group B/E per GOLD." },
      { drug: "Ipratropium / Salbutamol", drugClass: "Short-acting bronchodilator", adultDose: "PRN inhaler or nebuliser", rx: "Rx" },
      { drug: "Prednisolone (exacerbation)", drugClass: "Oral corticosteroid", adultDose: "30–40 mg PO daily ×5 days", rx: "Rx" },
      { drug: "Amoxicillin / Doxycycline (exacerbation)", drugClass: "Antibiotic", adultDose: "Amoxicillin 500 mg TID or Doxycycline 200 mg then 100 mg daily ×5 d", rx: "Rx", note: "Only if purulent sputum + increased dyspnoea/volume." },
    ],
  },
  allergic_rhinitis: {
    label: "Allergic rhinitis",
    source: "WHO EML 22 · ARIA 2019",
    options: [
      { drug: "Cetirizine / Loratadine / Fexofenadine", drugClass: "2nd-gen antihistamine", adultDose: "Cetirizine 10 mg PO daily; Loratadine 10 mg PO daily", rx: "OTC" },
      { drug: "Mometasone / Fluticasone nasal spray", drugClass: "Intranasal corticosteroid", adultDose: "2 sprays each nostril once daily", rx: "OTC", note: "Most effective single agent for persistent AR." },
      { drug: "Sodium cromoglicate nasal", drugClass: "Mast cell stabiliser", adultDose: "1 spray each nostril 4×/day", rx: "OTC" },
    ],
  },

  // ═══════════════════════ INFECTIONS ═══════════════════════
  pneumonia_cap: {
    label: "Community-acquired pneumonia",
    source: "WHO EML 22 · BTS 2015 · IDSA/ATS 2019",
    options: [
      { drug: "Amoxicillin", drugClass: "Aminopenicillin", adultDose: "500 mg–1 g PO TID ×5 days", pediatricDose: "40–50 mg/kg/day divided TID", rx: "Rx", note: "First-line low-severity CAP." },
      { drug: "Doxycycline", drugClass: "Tetracycline", adultDose: "200 mg PO stat then 100 mg BID ×5 d", rx: "Rx", note: "Penicillin allergy; also covers atypicals." },
      { drug: "Azithromycin / Clarithromycin", drugClass: "Macrolide", adultDose: "Azithromycin 500 mg daily ×3 d; Clarithromycin 500 mg BID ×5 d", rx: "Rx", note: "Atypical cover; add to amoxicillin in moderate CAP." },
      { drug: "Co-amoxiclav + macrolide", drugClass: "Combination", adultDose: "Co-amoxiclav 625 mg TID or 1.2 g IV TID + azithromycin", rx: "Rx", note: "Moderate–severe CAP (CURB-65 ≥2)." },
    ],
    referralNote: "CURB-65 ≥2, SpO₂ <92%, RR >30 → hospital admission.",
  },
  uti_lower: {
    label: "Uncomplicated lower UTI (cystitis)",
    source: "WHO EML 22 · NICE NG109",
    options: [
      { drug: "Nitrofurantoin", drugClass: "Nitrofuran", adultDose: "100 mg PO BID ×3 days (♀) / 7 days (♂)", rx: "Rx", note: "Avoid if eGFR <45." },
      { drug: "Trimethoprim", drugClass: "DHFR inhibitor", adultDose: "200 mg PO BID ×3 days", rx: "Rx", note: "Avoid 1st trimester pregnancy. Rising resistance." },
      { drug: "Fosfomycin", drugClass: "Phosphonic acid", adultDose: "3 g PO single dose", rx: "Rx", note: "Convenient single-dose; ♀ only for uncomplicated cystitis." },
      { drug: "Cefalexin", drugClass: "Cephalosporin", adultDose: "500 mg PO BID ×3–7 days", rx: "Rx", note: "Safe in pregnancy." },
    ],
  },
  pyelonephritis: {
    label: "Acute pyelonephritis",
    source: "WHO EML 22 · IDSA 2011",
    options: [
      { drug: "Ciprofloxacin", drugClass: "Fluoroquinolone", adultDose: "500 mg PO BID ×7 days", rx: "Rx", note: "Avoid in pregnancy/paediatrics; tendon rupture risk." },
      { drug: "Co-trimoxazole", drugClass: "Sulfonamide combination", adultDose: "960 mg PO BID ×14 days", rx: "Rx", note: "Only if susceptibility known." },
      { drug: "Ceftriaxone", drugClass: "3rd-gen cephalosporin", adultDose: "1–2 g IV/IM once daily", rx: "Rx", note: "Severe / hospitalised." },
      { drug: "Gentamicin", drugClass: "Aminoglycoside", adultDose: "5–7 mg/kg IV once daily", rx: "Rx", note: "Monitor renal function & levels." },
    ],
    referralNote: "Sepsis, pregnancy, or vomiting → admit.",
  },
  otitis_media: {
    label: "Acute otitis media",
    source: "WHO EML 22 · AAP 2013",
    options: [
      { drug: "Amoxicillin", drugClass: "Aminopenicillin", adultDose: "500 mg TID ×5 d", pediatricDose: "80–90 mg/kg/day divided BID ×5–10 d", rx: "Rx", note: "First-line when antibiotic indicated." },
      { drug: "Co-amoxiclav", drugClass: "β-lactam/β-lactamase inhibitor", adultDose: "625 mg TID ×5–7 d", pediatricDose: "45–90 mg/kg/day of amoxicillin", rx: "Rx", note: "Recent antibiotics, treatment failure, or severe disease." },
      { drug: "Azithromycin", drugClass: "Macrolide", adultDose: "500 mg daily ×3 d", pediatricDose: "10 mg/kg daily ×3 d", rx: "Rx", note: "Penicillin allergy." },
      { drug: "Paracetamol / ibuprofen", drugClass: "Analgesic", adultDose: "Standard analgesic dosing", rx: "OTC", note: "Symptomatic relief; watchful waiting appropriate in many children >2 y." },
    ],
  },
  strep_pharyngitis: {
    label: "Streptococcal pharyngitis",
    source: "WHO EML 22 · IDSA 2012",
    options: [
      { drug: "Phenoxymethylpenicillin (Pen V)", drugClass: "Penicillin", adultDose: "500 mg PO QID ×10 d", pediatricDose: "250 mg BID/TID ×10 d", rx: "Rx", note: "First-line if Centor/FeverPAIN score high." },
      { drug: "Amoxicillin", drugClass: "Aminopenicillin", adultDose: "500 mg TID or 1 g BID ×10 d", rx: "Rx" },
      { drug: "Clarithromycin", drugClass: "Macrolide", adultDose: "250–500 mg BID ×5 d", rx: "Rx", note: "Penicillin allergy." },
    ],
  },
  sinusitis: {
    label: "Acute bacterial sinusitis",
    source: "WHO EML 22 · IDSA 2012",
    options: [
      { drug: "Amoxicillin ± clavulanate", drugClass: "β-lactam", adultDose: "Amoxicillin 500 mg TID or co-amoxiclav 625 mg TID ×5–10 d", rx: "Rx", note: "Only if symptoms >10 d, worsening, or severe." },
      { drug: "Doxycycline", drugClass: "Tetracycline", adultDose: "200 mg stat then 100 mg BID ×5–10 d", rx: "Rx", note: "Penicillin allergy." },
      { drug: "Intranasal corticosteroid", drugClass: "INCS", adultDose: "2 sprays BID", rx: "OTC", note: "Adjunct for symptom relief." },
    ],
  },
  cellulitis: {
    label: "Cellulitis / skin & soft-tissue infection",
    source: "WHO EML 22 · IDSA 2014",
    options: [
      { drug: "Flucloxacillin", drugClass: "Anti-staphylococcal penicillin", adultDose: "500 mg–1 g PO QID ×5–7 d", rx: "Rx", note: "First-line for non-purulent cellulitis." },
      { drug: "Clindamycin", drugClass: "Lincosamide", adultDose: "300–450 mg PO QID ×5–7 d", rx: "Rx", note: "Penicillin allergy; C. difficile risk." },
      { drug: "Doxycycline / Co-trimoxazole", drugClass: "MRSA cover", adultDose: "Doxycycline 100 mg BID; Co-trimoxazole 960 mg BID", rx: "Rx", note: "If MRSA suspected." },
    ],
    referralNote: "Systemic sepsis, orbital/facial cellulitis, or necrotising fasciitis → emergency.",
  },
  malaria: {
    label: "Malaria (uncomplicated, P. falciparum)",
    source: "WHO Guidelines for Malaria 2023",
    options: [
      { drug: "Artemether–lumefantrine", drugClass: "ACT", adultDose: "4 tabs (80/480 mg) BID ×3 d with fat", rx: "Rx", note: "First-line ACT globally." },
      { drug: "Artesunate–amodiaquine / DHA-piperaquine", drugClass: "ACT", adultDose: "Per weight band ×3 d", rx: "Rx" },
      { drug: "Primaquine (P. vivax/ovale)", drugClass: "8-aminoquinoline", adultDose: "0.25–0.5 mg/kg/day ×14 d", rx: "Rx", note: "Check G6PD status first." },
      { drug: "IV artesunate", drugClass: "Artemisinin", adultDose: "2.4 mg/kg IV at 0, 12, 24 h then daily", rx: "Rx", note: "Severe malaria — inpatient." },
    ],
    referralNote: "Cerebral malaria, jaundice, parasitaemia >2% → emergency admission.",
  },
  tuberculosis: {
    label: "Tuberculosis (drug-susceptible, active)",
    source: "WHO Consolidated TB Guidelines 2022",
    options: [
      { drug: "HRZE regimen", drugClass: "First-line anti-TB", adultDose: "Isoniazid 5 + Rifampicin 10 + Pyrazinamide 25 + Ethambutol 15 mg/kg PO daily ×2 mo, then HR ×4 mo", rx: "Rx / specialist", note: "DOTS. Add pyridoxine 25 mg to prevent INH neuropathy." },
      { drug: "Isoniazid preventive therapy (LTBI)", drugClass: "Monotherapy", adultDose: "300 mg PO daily ×6–9 mo (+ pyridoxine)", rx: "Rx" },
    ],
    referralNote: "Notifiable disease — refer to TB programme immediately.",
  },
  hiv: {
    label: "HIV infection",
    source: "WHO Consolidated ARV Guidelines 2021",
    options: [
      { drug: "Tenofovir + Lamivudine + Dolutegravir (TLD)", drugClass: "1st-line ART", adultDose: "TDF 300 mg + 3TC 300 mg + DTG 50 mg PO once daily", rx: "Rx / specialist", note: "WHO preferred first-line for adults & adolescents." },
      { drug: "Abacavir + Lamivudine + Dolutegravir (paediatric)", drugClass: "1st-line ART paeds", adultDose: "Weight-band dosing", rx: "Rx / specialist" },
      { drug: "Co-trimoxazole prophylaxis", drugClass: "Sulfonamide", adultDose: "960 mg PO once daily", rx: "Rx", note: "If CD4 <350 or WHO stage 3/4." },
    ],
    referralNote: "Start ART on same-day where possible; specialist follow-up mandatory.",
  },
  chlamydia: {
    label: "Chlamydia trachomatis (uncomplicated genital)",
    source: "WHO STI Guidelines 2021",
    options: [
      { drug: "Doxycycline", drugClass: "Tetracycline", adultDose: "100 mg PO BID ×7 d", rx: "Rx", note: "Preferred (higher cure than azithromycin)." },
      { drug: "Azithromycin", drugClass: "Macrolide", adultDose: "1 g PO single dose", rx: "Rx", note: "Alternative; use in pregnancy." },
    ],
    referralNote: "Partner notification & treatment essential.",
  },
  gonorrhea: {
    label: "Gonorrhoea (uncomplicated)",
    source: "WHO STI Guidelines 2021",
    options: [
      { drug: "Ceftriaxone", drugClass: "3rd-gen cephalosporin", adultDose: "500 mg – 1 g IM single dose", rx: "Rx" },
      { drug: "+ Azithromycin (co-treat chlamydia)", drugClass: "Macrolide", adultDose: "1 g PO single dose", rx: "Rx" },
    ],
    referralNote: "Test-of-cure at 2 weeks; partner notification.",
  },
  syphilis: {
    label: "Syphilis (early)",
    source: "WHO STI Guidelines 2021",
    options: [
      { drug: "Benzathine benzylpenicillin", drugClass: "Long-acting penicillin", adultDose: "2.4 million IU IM single dose", rx: "Rx", note: "Latent >1 y: weekly ×3 doses." },
      { drug: "Doxycycline", drugClass: "Tetracycline", adultDose: "100 mg PO BID ×14 d", rx: "Rx", note: "Penicillin allergy, non-pregnant." },
    ],
  },
  hepatitis_b: {
    label: "Chronic hepatitis B",
    source: "WHO HBV Guidelines 2015 · EASL 2017",
    options: [
      { drug: "Tenofovir disoproxil", drugClass: "Nucleotide analogue", adultDose: "300 mg PO once daily", rx: "Rx / specialist", note: "First-line; monitor renal function & bone." },
      { drug: "Entecavir", drugClass: "Nucleoside analogue", adultDose: "0.5 mg PO once daily (empty stomach)", rx: "Rx / specialist" },
    ],
  },
  hepatitis_c: {
    label: "Chronic hepatitis C",
    source: "WHO HCV Guidelines 2022",
    options: [
      { drug: "Sofosbuvir/Velpatasvir", drugClass: "Pangenotypic DAA", adultDose: "400/100 mg PO once daily ×12 wks", rx: "Rx / specialist", note: "Cure rate >95%." },
      { drug: "Glecaprevir/Pibrentasvir", drugClass: "Pangenotypic DAA", adultDose: "300/120 mg PO once daily ×8 wks", rx: "Rx / specialist" },
    ],
  },

  // ═══════════════════════ GASTROINTESTINAL ═══════════════════════
  gerd: {
    label: "Gastro-oesophageal reflux disease",
    source: "WHO EML 22 · ACG 2022",
    options: [
      { drug: "Omeprazole / Pantoprazole / Esomeprazole", drugClass: "PPI", adultDose: "Omeprazole 20 mg PO daily ×4–8 wks", rx: "Rx", note: "Step-up: 40 mg or BID if partial response. Take 30 min before food." },
      { drug: "Ranitidine (where still available) / Famotidine", drugClass: "H2 antagonist", adultDose: "Famotidine 20–40 mg PO BID", rx: "OTC", note: "Ranitidine withdrawn in many jurisdictions." },
      { drug: "Antacid (Al/Mg hydroxide) + alginate", drugClass: "Neutralising / raft", adultDose: "10–20 mL after meals & bedtime", rx: "OTC" },
    ],
  },
  peptic_ulcer: {
    label: "Peptic ulcer disease",
    source: "WHO EML 22 · ACG 2017",
    options: [
      { drug: "PPI (omeprazole 20 mg BID or equivalent)", drugClass: "PPI", adultDose: "×4–8 wks", rx: "Rx" },
      { drug: "H. pylori eradication (triple therapy)", drugClass: "PPI + amoxicillin + clarithromycin", adultDose: "Omeprazole 20 mg BID + Amoxicillin 1 g BID + Clarithromycin 500 mg BID ×14 d", rx: "Rx", note: "Bismuth quadruple if macrolide resistance >15%." },
      { drug: "Stop offending NSAIDs / smoking / alcohol", drugClass: "Non-pharm", adultDose: "—", rx: "OTC" },
    ],
    referralNote: "Melena, haematemesis, weight loss, or age >55 with new dyspepsia → endoscopy.",
  },
  h_pylori: {
    label: "Helicobacter pylori infection",
    source: "WHO EML 22 · Maastricht VI 2022",
    options: [
      { drug: "Bismuth quadruple", drugClass: "PPI + bismuth + metronidazole + tetracycline", adultDose: "Standard PPI BID + bismuth 120 mg QID + metronidazole 500 mg TID + tetracycline 500 mg QID ×14 d", rx: "Rx", note: "Preferred first-line where clarithromycin resistance >15%." },
      { drug: "Concomitant therapy", drugClass: "PPI + amoxicillin + clarithromycin + metronidazole", adultDose: "PPI BID + amoxicillin 1 g BID + clarithromycin 500 mg BID + metronidazole 500 mg BID ×14 d", rx: "Rx" },
    ],
  },
  ibd: {
    label: "Inflammatory bowel disease (UC / Crohn's)",
    source: "WHO EML 22 · ECCO 2022",
    options: [
      { drug: "Mesalazine (5-ASA)", drugClass: "Aminosalicylate", adultDose: "2.4–4.8 g PO daily (UC)", rx: "Rx", note: "First-line for mild-moderate UC." },
      { drug: "Prednisolone (induction)", drugClass: "Corticosteroid", adultDose: "40 mg PO daily, taper over 6–8 wks", rx: "Rx" },
      { drug: "Azathioprine", drugClass: "Immunomodulator", adultDose: "2–2.5 mg/kg PO daily", rx: "Rx / specialist", note: "Check TPMT before starting." },
      { drug: "Infliximab / Adalimumab", drugClass: "Anti-TNF biologic", adultDose: "Weight-based per protocol", rx: "Rx / specialist" },
    ],
  },

  // ═══════════════════════ NEURO / PSYCH ═══════════════════════
  epilepsy: {
    label: "Epilepsy",
    source: "WHO EML 22 · ILAE 2018 · NICE NG217",
    options: [
      { drug: "Levetiracetam", drugClass: "SV2A modulator", adultDose: "500 mg PO BID titrated to 1–1.5 g BID", rx: "Rx", note: "Broad-spectrum; low interaction burden. Watch mood." },
      { drug: "Lamotrigine", drugClass: "Na⁺ channel blocker", adultDose: "Slow titrate: 25 mg daily → 100–200 mg BID", rx: "Rx", note: "Focal & generalised; slow titration for SJS risk." },
      { drug: "Sodium valproate", drugClass: "Broad-spectrum AED", adultDose: "500 mg PO BID → up to 1.5 g BID", rx: "Rx", note: "AVOID in girls/women of childbearing potential (teratogenic)." },
      { drug: "Carbamazepine", drugClass: "Na⁺ channel blocker", adultDose: "100 mg BID titrated to 400 mg BID", rx: "Rx", note: "Focal seizures. HLA-B*1502 test if Asian ancestry." },
    ],
    referralNote: "Status epilepticus (seizure >5 min) → IV lorazepam 4 mg, call emergency.",
  },
  parkinsons: {
    label: "Parkinson's disease",
    source: "WHO EML 22 · NICE NG71",
    options: [
      { drug: "Levodopa/carbidopa", drugClass: "Dopamine precursor", adultDose: "100/25 mg PO TID titrated", rx: "Rx", note: "Most effective symptomatic therapy; motor fluctuations after 5 y." },
      { drug: "Ropinirole / Pramipexole", drugClass: "Dopamine agonist", adultDose: "Titrate weekly", rx: "Rx", note: "Watch impulse control disorders & sleep attacks." },
      { drug: "Rasagiline / Selegiline", drugClass: "MAO-B inhibitor", adultDose: "Rasagiline 1 mg daily", rx: "Rx" },
    ],
  },
  alzheimers: {
    label: "Alzheimer's disease / dementia",
    source: "WHO EML 22 · NICE NG97",
    options: [
      { drug: "Donepezil", drugClass: "Cholinesterase inhibitor", adultDose: "5 mg PO nocte ×4 wks → 10 mg", rx: "Rx", note: "Mild-moderate AD. GI side effects, bradycardia." },
      { drug: "Rivastigmine", drugClass: "Cholinesterase inhibitor", adultDose: "1.5 mg BID titrated; patch 4.6–13.3 mg/24 h", rx: "Rx" },
      { drug: "Memantine", drugClass: "NMDA antagonist", adultDose: "5 mg titrated to 20 mg PO daily", rx: "Rx", note: "Moderate-severe AD." },
    ],
  },
  migraine_prophylaxis: {
    label: "Migraine prophylaxis",
    source: "WHO EML 22 · AHS 2021",
    options: [
      { drug: "Propranolol", drugClass: "Beta-blocker", adultDose: "40 mg PO BID titrated to 80–160 mg/day", rx: "Rx" },
      { drug: "Topiramate", drugClass: "Antiepileptic", adultDose: "25 mg titrated to 50–100 mg BID", rx: "Rx", note: "Teratogenic; contraceptive interaction." },
      { drug: "Amitriptyline", drugClass: "TCA", adultDose: "10–25 mg PO nocte titrated to 50–75 mg", rx: "Rx" },
      { drug: "Sumatriptan (acute)", drugClass: "5-HT₁ agonist", adultDose: "50–100 mg PO at onset; repeat once after 2 h if needed", rx: "Rx", note: "Avoid in IHD, uncontrolled HTN, hemiplegic migraine." },
    ],
  },
  depression: {
    label: "Major depressive disorder",
    source: "WHO EML 22 · NICE NG222",
    options: [
      { drug: "Sertraline", drugClass: "SSRI", adultDose: "50 mg PO daily titrated to 100–200 mg", rx: "Rx", note: "First-line; favourable in cardiac patients." },
      { drug: "Fluoxetine", drugClass: "SSRI", adultDose: "20 mg PO daily", rx: "Rx", note: "First-line in adolescents (≥8 y)." },
      { drug: "Escitalopram", drugClass: "SSRI", adultDose: "10–20 mg PO daily", rx: "Rx", note: "QT prolongation at higher doses." },
      { drug: "Mirtazapine", drugClass: "Noradrenergic/serotonergic", adultDose: "15–45 mg PO nocte", rx: "Rx", note: "Useful with insomnia / weight loss." },
      { drug: "Amitriptyline", drugClass: "TCA", adultDose: "25 mg nocte titrated to 75–150 mg", rx: "Rx", note: "Toxic in overdose; avoid if suicide risk." },
    ],
    referralNote: "Suicidal ideation, psychosis, or bipolar features → urgent mental-health referral.",
  },
  anxiety: {
    label: "Generalised anxiety / panic disorder",
    source: "WHO EML 22 · NICE CG113",
    options: [
      { drug: "Sertraline / Escitalopram", drugClass: "SSRI", adultDose: "Sertraline 25 mg → 50–200 mg daily", rx: "Rx", note: "First-line; onset 4–6 wks." },
      { drug: "Venlafaxine XR", drugClass: "SNRI", adultDose: "75–225 mg PO daily", rx: "Rx", note: "Monitor BP at higher doses." },
      { drug: "Propranolol", drugClass: "Beta-blocker", adultDose: "40 mg PRN performance anxiety", rx: "Rx" },
      { drug: "Diazepam / Lorazepam (short-term)", drugClass: "Benzodiazepine", adultDose: "Diazepam 2–5 mg PO PRN", rx: "Rx", note: "≤2–4 wks only; dependence risk." },
    ],
  },
  schizophrenia: {
    label: "Schizophrenia / psychosis",
    source: "WHO EML 22 · NICE CG178",
    options: [
      { drug: "Risperidone", drugClass: "Atypical antipsychotic", adultDose: "2 mg PO daily titrated to 4–6 mg", rx: "Rx / specialist" },
      { drug: "Olanzapine", drugClass: "Atypical antipsychotic", adultDose: "5–20 mg PO daily", rx: "Rx / specialist", note: "Weight gain, metabolic syndrome." },
      { drug: "Haloperidol", drugClass: "Typical antipsychotic", adultDose: "1.5–10 mg PO daily", rx: "Rx / specialist", note: "EPS risk; long-acting depot available." },
      { drug: "Clozapine", drugClass: "Atypical (treatment-resistant)", adultDose: "12.5 mg titrated slowly", rx: "Rx / specialist", note: "Mandatory FBC monitoring for agranulocytosis." },
    ],
  },
  bipolar: {
    label: "Bipolar disorder",
    source: "WHO EML 22 · NICE CG185",
    options: [
      { drug: "Lithium carbonate", drugClass: "Mood stabiliser", adultDose: "Target level 0.6–1.0 mmol/L", rx: "Rx / specialist", note: "Narrow TI; monitor renal, thyroid, Ca²⁺." },
      { drug: "Sodium valproate", drugClass: "Mood stabiliser", adultDose: "500–1500 mg/day", rx: "Rx / specialist", note: "AVOID in females of childbearing potential." },
      { drug: "Quetiapine", drugClass: "Atypical antipsychotic", adultDose: "300–600 mg/day", rx: "Rx / specialist" },
      { drug: "Lamotrigine", drugClass: "Antiepileptic", adultDose: "Titrate to 200 mg/day", rx: "Rx / specialist", note: "Effective for bipolar depression maintenance." },
    ],
  },
  neuropathic_pain_chronic: {
    label: "Chronic neuropathic pain",
    source: "WHO EML 22 · NICE CG173",
    options: [
      { drug: "Amitriptyline", drugClass: "TCA", adultDose: "10 mg nocte titrated to 75 mg", rx: "Rx" },
      { drug: "Duloxetine", drugClass: "SNRI", adultDose: "30 mg PO daily → 60 mg", rx: "Rx", note: "First-line in painful diabetic neuropathy." },
      { drug: "Gabapentin", drugClass: "Gabapentinoid", adultDose: "300 mg TID titrated to 1200 mg TID", rx: "Rx" },
      { drug: "Pregabalin", drugClass: "Gabapentinoid", adultDose: "75 mg BID titrated to 300 mg BID", rx: "Rx", note: "Controlled substance in many jurisdictions." },
    ],
  },

  // ═══════════════════════ MUSCULOSKELETAL / RHEUM ═══════════════════════
  gout: {
    label: "Gout",
    source: "WHO EML 22 · ACR 2020",
    options: [
      { drug: "NSAID (naproxen / indometacin)", drugClass: "NSAID", adultDose: "Naproxen 500 mg BID ×5–7 d", rx: "OTC", note: "Acute flare; avoid in CKD/HF/PUD." },
      { drug: "Colchicine", drugClass: "Anti-inflammatory", adultDose: "1 mg stat then 500 mcg 1 h later; then 500 mcg BID–TID until resolved", rx: "Rx", note: "Use within 12 h of flare. Diarrhoea common." },
      { drug: "Prednisolone", drugClass: "Corticosteroid", adultDose: "30–40 mg PO daily ×5 d", rx: "Rx", note: "If NSAIDs/colchicine contraindicated." },
      { drug: "Allopurinol", drugClass: "Xanthine oxidase inhibitor", adultDose: "Start 100 mg daily → titrate to urate <360 μmol/L", rx: "Rx", note: "Long-term prevention; cover initial 6 mo with colchicine 500 mcg daily." },
    ],
  },
  osteoarthritis: {
    label: "Osteoarthritis",
    source: "WHO EML 22 · OARSI 2019",
    options: [
      { drug: "Paracetamol", drugClass: "Analgesic", adultDose: "500 mg – 1 g PO QID (max 4 g/day)", rx: "OTC", note: "Modest benefit; watch hepatotoxicity." },
      { drug: "Topical NSAID (diclofenac gel)", drugClass: "NSAID", adultDose: "Apply 2–4 g TID/QID", rx: "OTC", note: "First-line for knee/hand OA." },
      { drug: "Oral NSAID (ibuprofen / naproxen)", drugClass: "NSAID", adultDose: "Ibuprofen 400 mg TID; Naproxen 500 mg BID", rx: "OTC", note: "Add PPI if long-term or GI risk." },
      { drug: "Intra-articular corticosteroid", drugClass: "Injection", adultDose: "Triamcinolone 40 mg IA", rx: "Rx", note: "Short-term flare relief." },
    ],
  },
  rheumatoid_arthritis: {
    label: "Rheumatoid arthritis",
    source: "WHO EML 22 · EULAR 2022",
    options: [
      { drug: "Methotrexate", drugClass: "csDMARD", adultDose: "10–25 mg PO/SC once weekly + folic acid 5 mg weekly", rx: "Rx / specialist", note: "First-line anchor drug." },
      { drug: "Sulfasalazine", drugClass: "csDMARD", adultDose: "500 mg BID titrated to 1 g BID", rx: "Rx" },
      { drug: "Hydroxychloroquine", drugClass: "csDMARD", adultDose: "200–400 mg PO daily (≤5 mg/kg/day)", rx: "Rx", note: "Annual ophthalmology screening." },
      { drug: "Prednisolone (bridge)", drugClass: "Corticosteroid", adultDose: "7.5–15 mg daily, taper", rx: "Rx" },
      { drug: "Anti-TNF (etanercept, adalimumab)", drugClass: "Biologic", adultDose: "Etanercept 50 mg SC weekly", rx: "Rx / specialist", note: "TB screening before start." },
    ],
  },
  osteoporosis: {
    label: "Osteoporosis",
    source: "WHO EML 22 · NOGG 2021",
    options: [
      { drug: "Alendronate", drugClass: "Bisphosphonate", adultDose: "70 mg PO once weekly", rx: "Rx", note: "Take with water, remain upright 30 min, empty stomach." },
      { drug: "Risedronate", drugClass: "Bisphosphonate", adultDose: "35 mg PO once weekly", rx: "Rx" },
      { drug: "Zoledronic acid", drugClass: "IV bisphosphonate", adultDose: "5 mg IV once yearly", rx: "Rx / specialist" },
      { drug: "Denosumab", drugClass: "RANKL inhibitor", adultDose: "60 mg SC every 6 mo", rx: "Rx / specialist" },
      { drug: "Calcium 1000 mg + Vitamin D 800 IU", drugClass: "Supplement", adultDose: "PO daily", rx: "OTC" },
    ],
  },

  // ═══════════════════════ RENAL / GU ═══════════════════════
  ckd: {
    label: "Chronic kidney disease",
    source: "WHO EML 22 · KDIGO 2024",
    options: [
      { drug: "ACE inhibitor / ARB", drugClass: "RAAS blocker", adultDose: "Titrate to max tolerated (e.g. ramipril 10 mg)", rx: "Rx", note: "For albuminuria; monitor K⁺ & creatinine." },
      { drug: "Dapagliflozin / Empagliflozin", drugClass: "SGLT2 inhibitor", adultDose: "10 mg PO daily", rx: "Rx", note: "eGFR ≥20; renoprotective ± diabetes." },
      { drug: "Statin", drugClass: "HMG-CoA reductase inhibitor", adultDose: "Atorvastatin 20 mg daily", rx: "Rx", note: "CV risk reduction." },
      { drug: "Erythropoietin / iron", drugClass: "Anaemia management", adultDose: "Per Hb target 100–120 g/L", rx: "Rx / specialist" },
    ],
    referralNote: "eGFR <30 or rapid decline → nephrology.",
  },
  bph: {
    label: "Benign prostatic hyperplasia",
    source: "WHO EML 22 · EAU 2023",
    options: [
      { drug: "Tamsulosin", drugClass: "α₁-blocker", adultDose: "0.4 mg PO once daily", rx: "Rx", note: "Rapid symptom relief; postural hypotension." },
      { drug: "Finasteride / Dutasteride", drugClass: "5α-reductase inhibitor", adultDose: "Finasteride 5 mg PO daily", rx: "Rx", note: "For prostates >30 mL; 3–6 mo for effect." },
      { drug: "Combination (tamsulosin + dutasteride)", drugClass: "Combination", adultDose: "0.4/0.5 mg PO daily", rx: "Rx" },
    ],
  },
  erectile_dysfunction: {
    label: "Erectile dysfunction",
    source: "WHO EML 22 · EAU 2023",
    options: [
      { drug: "Sildenafil", drugClass: "PDE-5 inhibitor", adultDose: "50 mg PO 1 h before sex (25–100 mg)", rx: "Rx", note: "Contraindicated with nitrates." },
      { drug: "Tadalafil", drugClass: "PDE-5 inhibitor", adultDose: "10–20 mg PRN or 5 mg daily", rx: "Rx" },
    ],
  },

  // ═══════════════════════ HAEMATOLOGY ═══════════════════════
  iron_deficiency_anemia: {
    label: "Iron-deficiency anaemia",
    source: "WHO EML 22 · BSH 2021",
    options: [
      { drug: "Ferrous sulfate / fumarate", drugClass: "Oral iron", adultDose: "Ferrous sulfate 200 mg PO once daily or alternate-day", rx: "OTC", note: "Alternate-day dosing improves absorption & tolerability." },
      { drug: "IV iron (ferric carboxymaltose)", drugClass: "IV iron", adultDose: "Per weight/Hb; single dose up to 1000 mg", rx: "Rx / specialist", note: "Intolerance or malabsorption." },
    ],
    referralNote: "Investigate cause (GI bleeding, menorrhagia, coeliac) in all adults.",
  },
  b12_deficiency: {
    label: "Vitamin B12 deficiency",
    source: "WHO EML 22 · BSH 2014",
    options: [
      { drug: "Hydroxocobalamin IM", drugClass: "B12", adultDose: "1 mg IM alternate days ×2 wks then every 3 mo", rx: "Rx", note: "For pernicious anaemia / neurological involvement." },
      { drug: "Cyanocobalamin PO", drugClass: "B12", adultDose: "1–2 mg PO daily", rx: "OTC", note: "Dietary deficiency only." },
    ],
  },

  // ═══════════════════════ SKIN ═══════════════════════
  acne_moderate: {
    label: "Acne vulgaris (moderate)",
    source: "WHO EML 22 · AAD 2024",
    options: [
      { drug: "Topical benzoyl peroxide", drugClass: "Topical antibacterial", adultDose: "2.5–5% once daily", rx: "OTC" },
      { drug: "Topical adapalene / tretinoin", drugClass: "Topical retinoid", adultDose: "Apply once daily at night", rx: "Rx", note: "Photosensitivity; teratogenic (tretinoin)." },
      { drug: "Topical clindamycin (+ BPO)", drugClass: "Topical antibiotic", adultDose: "Apply BID", rx: "Rx", note: "Always combine with BPO to reduce resistance." },
      { drug: "Doxycycline / Lymecycline", drugClass: "Oral tetracycline", adultDose: "Doxycycline 100 mg PO daily ×3 mo", rx: "Rx", note: "Moderate–severe inflammatory acne." },
      { drug: "Isotretinoin", drugClass: "Oral retinoid", adultDose: "0.5–1 mg/kg/day PO", rx: "Rx / specialist", note: "Severe/nodulocystic; pregnancy prevention programme." },
    ],
  },
  eczema_atopic: {
    label: "Atopic eczema",
    source: "WHO EML 22 · NICE CG57",
    options: [
      { drug: "Emollient (paraffin, cetomacrogol)", drugClass: "Moisturiser", adultDose: "Apply liberally ≥3×/day", rx: "OTC", note: "Foundation of therapy." },
      { drug: "Topical hydrocortisone 1%", drugClass: "Mild TCS", adultDose: "Apply BID ×5–7 d", rx: "OTC", note: "Face/flexures for mild flares." },
      { drug: "Topical betamethasone valerate 0.1%", drugClass: "Potent TCS", adultDose: "Apply once daily ×7–14 d", rx: "Rx", note: "Trunk/limbs, moderate–severe flare." },
      { drug: "Topical tacrolimus 0.1% / pimecrolimus", drugClass: "Calcineurin inhibitor", adultDose: "Apply BID", rx: "Rx", note: "Steroid-sparing, face/eyelids." },
      { drug: "Oral antihistamine (sedating) for pruritus", drugClass: "Antihistamine", adultDose: "Chlorphenamine 4 mg PO nocte", rx: "OTC" },
    ],
  },
  psoriasis: {
    label: "Plaque psoriasis",
    source: "WHO EML 22 · NICE CG153",
    options: [
      { drug: "Topical calcipotriol + betamethasone", drugClass: "Vit D + potent TCS", adultDose: "Apply once daily ×4 wks", rx: "Rx", note: "First-line for plaque psoriasis." },
      { drug: "Topical coal tar / dithranol", drugClass: "Keratolytic", adultDose: "Per product", rx: "OTC" },
      { drug: "Phototherapy (NB-UVB)", drugClass: "Non-drug", adultDose: "Specialist", rx: "Rx / specialist" },
      { drug: "Methotrexate", drugClass: "Systemic csDMARD", adultDose: "10–25 mg weekly", rx: "Rx / specialist" },
      { drug: "Biologic (adalimumab, ustekinumab)", drugClass: "Biologic", adultDose: "Per protocol", rx: "Rx / specialist" },
    ],
  },
  scabies: {
    label: "Scabies",
    source: "WHO EML 22",
    options: [
      { drug: "Permethrin 5% cream", drugClass: "Topical scabicide", adultDose: "Apply whole body (neck down; incl. scalp in children), wash off 8–12 h; repeat after 7 d", rx: "OTC" },
      { drug: "Ivermectin", drugClass: "Oral antiparasitic", adultDose: "200 mcg/kg PO, repeat at 7–14 d", rx: "Rx", note: "Crusted scabies, outbreaks, or when topical impractical." },
    ],
    referralNote: "Treat all household contacts simultaneously.",
  },
  tinea_infection: {
    label: "Tinea (dermatophytosis)",
    source: "WHO EML 22",
    options: [
      { drug: "Terbinafine cream", drugClass: "Topical allylamine", adultDose: "Apply once daily ×1–2 wks", rx: "OTC" },
      { drug: "Clotrimazole / miconazole cream", drugClass: "Topical azole", adultDose: "Apply BID ×2–4 wks", rx: "OTC" },
      { drug: "Terbinafine PO", drugClass: "Oral antifungal", adultDose: "250 mg PO daily ×2–6 wks (tinea corporis 2 wks; onychomycosis 6 wks fingernails / 12 wks toenails)", rx: "Rx", note: "Baseline LFTs." },
      { drug: "Itraconazole PO", drugClass: "Oral azole", adultDose: "100–200 mg PO daily", rx: "Rx" },
    ],
  },

  // ═══════════════════════ EYE ═══════════════════════
  glaucoma: {
    label: "Open-angle glaucoma",
    source: "WHO EML 22 · EGS 2020",
    options: [
      { drug: "Latanoprost / Travoprost", drugClass: "Prostaglandin analogue", adultDose: "1 drop affected eye(s) nocte", rx: "Rx", note: "First-line; iris pigmentation, lash growth." },
      { drug: "Timolol 0.5%", drugClass: "Beta-blocker (topical)", adultDose: "1 drop BID", rx: "Rx", note: "Caution in asthma/COPD/bradycardia." },
      { drug: "Brimonidine / Dorzolamide", drugClass: "α₂ agonist / CAI", adultDose: "1 drop TID (or BID for combination)", rx: "Rx" },
      { drug: "Acetazolamide (acute)", drugClass: "Oral CAI", adultDose: "250–500 mg PO/IV", rx: "Rx", note: "Acute angle-closure — emergency." },
    ],
    referralNote: "Acute red painful eye + halos → same-day ophthalmology.",
  },

  // ═══════════════════════ WOMEN'S HEALTH ═══════════════════════
  contraception_needed: {
    label: "Contraception",
    source: "WHO MEC 2015 · UKMEC 2016",
    options: [
      { drug: "Combined oral contraceptive (ethinylestradiol 30 mcg + levonorgestrel 150 mcg)", drugClass: "COCP", adultDose: "1 tab PO daily ×21 d, 7-d break", rx: "Rx", note: "Avoid if migraine with aura, VTE risk, smoker ≥35 y." },
      { drug: "Progestogen-only pill (desogestrel 75 mcg)", drugClass: "POP", adultDose: "1 tab PO daily continuously", rx: "Rx" },
      { drug: "Depot medroxyprogesterone", drugClass: "Injectable progestogen", adultDose: "150 mg IM every 12 wks", rx: "Rx" },
      { drug: "Copper IUD / Levonorgestrel-IUS", drugClass: "LARC", adultDose: "Insert, effective 5–10 y", rx: "Rx / specialist" },
      { drug: "Levonorgestrel 1.5 mg (emergency)", drugClass: "Emergency contraception", adultDose: "1.5 mg PO within 72 h of UPSI", rx: "OTC" },
    ],
  },

  // ═══════════════════════ EXISTING (referral fallback) ═══════════════════════
  liver_disease: {
    label: "Chronic liver disease",
    source: "WHO EML 22",
    options: [
      { drug: "Address underlying cause (alcohol, HBV, HCV, MASH)", drugClass: "Aetiology-directed", adultDose: "—", rx: "Rx / specialist" },
      { drug: "Spironolactone ± furosemide (ascites)", drugClass: "Diuretic", adultDose: "Spironolactone 100 mg + furosemide 40 mg PO daily", rx: "Rx" },
      { drug: "Lactulose ± rifaximin (HE)", drugClass: "Osmotic laxative / antibiotic", adultDose: "Lactulose 30–45 mL TID; rifaximin 550 mg BID", rx: "Rx" },
      { drug: "Propranolol (variceal prophylaxis)", drugClass: "Non-selective β-blocker", adultDose: "20–40 mg BID titrated", rx: "Rx" },
    ],
    referralNote: "Hepatology follow-up mandatory. Avoid hepatotoxic drugs (paracetamol >2 g/day, NSAIDs).",
  },
  bleeding_disorder: {
    label: "Bleeding disorder",
    source: "WHO EML 22",
    options: [
      { drug: "Tranexamic acid", drugClass: "Antifibrinolytic", adultDose: "1 g PO/IV TID or 15–25 mg/kg", rx: "Rx", note: "Bleeding control; avoid in active thromboembolism." },
      { drug: "Factor concentrates (VIII / IX / vWF)", drugClass: "Clotting factor replacement", adultDose: "Weight-based per bleed severity", rx: "Rx / specialist" },
      { drug: "Desmopressin", drugClass: "Vasopressin analogue", adultDose: "0.3 mcg/kg IV/SC", rx: "Rx", note: "Mild haemophilia A / vWD type 1." },
    ],
    referralNote: "All new bleeding disorders → haematology.",
  },
};

/** Returns the therapy card for an internal condition ID, or null. */
export function getTherapyFor(conditionId: string): ConditionTherapy | null {
  return CONDITION_THERAPIES[conditionId] ?? null;
}

// ═══════════════════════════════════════════════════════════════
// CHAPTER-LEVEL FALLBACK
// Any ICD-10 code that has no specific internal mapping still gets
// class-level, guideline-anchored guidance instead of a dead end.
// ═══════════════════════════════════════════════════════════════

interface ChapterFallback {
  /** Inclusive ICD-10 chapter letter range test */
  test: (code: string) => boolean;
  label: string;
  source: string;
  options: TherapyOption[];
  referralNote: string;
}

const L = (code: string) => code.charAt(0).toUpperCase();
const N = (code: string) => parseInt(code.slice(1, 3), 10) || 0;

const SYMPTOMATIC_CORE: TherapyOption[] = [
  { drug: "Paracetamol (acetaminophen)", drugClass: "Analgesic / antipyretic", adultDose: "500–1000 mg PO q6h, max 4 g/24 h (max 2 g if hepatic impairment / alcohol use)", pediatricDose: "15 mg/kg/dose q6h, max 60 mg/kg/day", rx: "OTC", note: "First-line analgesia across most conditions." },
  { drug: "Ibuprofen", drugClass: "NSAID", adultDose: "200–400 mg PO q6–8h with food, max 1.2 g/24 h OTC", pediatricDose: "5–10 mg/kg/dose q6–8h", rx: "OTC", note: "Avoid in peptic ulcer, CKD, heart failure, 3rd trimester, or on anticoagulants." },
  { drug: "Oral rehydration salts (ORS)", drugClass: "Rehydration", adultDose: "200–400 mL after each loose stool / with fever or vomiting", pediatricDose: "10 mL/kg after each loose stool", rx: "OTC", note: "Supportive care for any febrile or fluid-losing illness." },
];

const CHAPTER_FALLBACKS: ChapterFallback[] = [
  {
    test: (c) => L(c) === "A" || L(c) === "B",
    label: "Infectious / parasitic disease (unspecified)",
    source: "WHO EML 22 · WHO AWaRe antibiotic book 2022",
    options: [
      { drug: "Amoxicillin", drugClass: "Aminopenicillin (AWaRe: Access)", adultDose: "500 mg–1 g PO TID ×5–7 d", pediatricDose: "40–50 mg/kg/day PO divided TID", rx: "Rx", note: "Empiric Access-group first choice for most community bacterial infections." },
      { drug: "Amoxicillin–clavulanate", drugClass: "β-lactam + β-lactamase inhibitor (Access)", adultDose: "500/125 mg PO TID or 875/125 mg BID ×5–7 d", rx: "Rx", note: "Use when resistance or abscess/mixed flora is likely." },
      { drug: "Doxycycline", drugClass: "Tetracycline (Access)", adultDose: "100 mg PO BID ×7 d", rx: "Rx", note: "Penicillin allergy, atypicals, rickettsial disease. Avoid <8 y and in pregnancy." },
      ...SYMPTOMATIC_CORE.slice(0, 1),
      SYMPTOMATIC_CORE[2],
    ],
    referralNote: "Culture/sensitivity where feasible; follow local antimicrobial stewardship. Sepsis features (fever + hypotension, confusion, tachypnoea) → immediate emergency referral.",
  },
  {
    test: (c) => L(c) === "C" || (L(c) === "D" && N(c) <= 48),
    label: "Neoplasm (unspecified)",
    source: "WHO EML 22 — cancer & palliative care",
    options: [
      { drug: "Oncology referral — tissue diagnosis + staging first", drugClass: "Specialist pathway", adultDose: "—", rx: "Rx / specialist", note: "No empiric therapy; chemotherapy is protocol- and stage-driven." },
      { drug: "Morphine (immediate release)", drugClass: "Opioid analgesic — WHO ladder step 3", adultDose: "5–10 mg PO q4h, titrate to effect", rx: "Rx", note: "Cancer pain per WHO analgesic ladder; co-prescribe a laxative." },
      { drug: "Ondansetron", drugClass: "5-HT₃ antagonist", adultDose: "8 mg PO/IV BID", rx: "Rx", note: "Chemotherapy-induced nausea/vomiting." },
      { drug: "Dexamethasone", drugClass: "Corticosteroid", adultDose: "4–8 mg PO daily", rx: "Rx", note: "Adjunct for pain, appetite, raised ICP, CINV." },
    ],
    referralNote: "All suspected or confirmed neoplasms require oncology assessment. Pharmacist role: analgesia, antiemetics, mucositis and interaction screening.",
  },
  {
    test: (c) => L(c) === "D" && N(c) >= 50,
    label: "Blood / immune disorder (unspecified)",
    source: "WHO EML 22",
    options: [
      { drug: "Ferrous sulfate", drugClass: "Oral iron", adultDose: "200 mg (65 mg elemental) PO daily–TID with vitamin C", pediatricDose: "3–6 mg/kg/day elemental iron", rx: "OTC", note: "Confirm iron deficiency with ferritin before long-term use." },
      { drug: "Folic acid", drugClass: "Vitamin", adultDose: "5 mg PO daily", rx: "OTC" },
      { drug: "Vitamin B12 (hydroxocobalamin)", drugClass: "Vitamin", adultDose: "1 mg IM alternate days ×2 wks then 3-monthly", rx: "Rx" },
    ],
    referralNote: "Unexplained cytopenias, pancytopenia or bleeding → haematology. Investigate the cause of any anaemia before iron replacement.",
  },
  {
    test: (c) => L(c) === "E",
    label: "Endocrine / metabolic / nutritional disorder (unspecified)",
    source: "WHO EML 22",
    options: [
      { drug: "Investigate before treating (glucose, HbA1c, TSH, U&E, lipids)", drugClass: "Diagnostic step", adultDose: "—", rx: "Rx / specialist" },
      { drug: "Multivitamin / micronutrient supplement", drugClass: "Nutritional support", adultDose: "1 tab PO daily", rx: "OTC", note: "Nutritional deficiency states; correct the specific deficit where identified." },
      { drug: "Oral rehydration + electrolyte correction", drugClass: "Supportive", adultDose: "Per deficit and serum electrolytes", rx: "OTC" },
    ],
    referralNote: "Endocrine disorders need biochemical confirmation and prescriber-led titration.",
  },
  {
    test: (c) => L(c) === "F",
    label: "Mental / behavioural disorder (unspecified)",
    source: "WHO mhGAP 2023 · WHO EML 22",
    options: [
      { drug: "Psychological / psychosocial intervention first-line", drugClass: "Non-pharmacological", adultDose: "—", rx: "OTC", note: "mhGAP recommends brief psychological intervention before medicines in mild presentations." },
      { drug: "Fluoxetine", drugClass: "SSRI", adultDose: "20 mg PO daily, review at 4–6 wks", rx: "Rx", note: "Monitor for early suicidality in <25 y; serotonin syndrome risk with tramadol/triptans." },
      { drug: "Diazepam (short-term only)", drugClass: "Benzodiazepine", adultDose: "2–5 mg PO up to TID, max 2–4 wks", rx: "Rx", note: "Dependence risk — avoid routine use." },
    ],
    referralNote: "Suicidal ideation, psychosis or self-neglect → urgent mental health referral.",
  },
  {
    test: (c) => L(c) === "G",
    label: "Nervous system disorder (unspecified)",
    source: "WHO EML 22",
    options: [
      ...SYMPTOMATIC_CORE.slice(0, 2),
      { drug: "Amitriptyline", drugClass: "TCA — neuropathic pain", adultDose: "10–25 mg PO nocte, titrate to 75 mg", rx: "Rx", note: "Anticholinergic; avoid in elderly (Beers) where possible." },
      { drug: "Carbamazepine", drugClass: "Anticonvulsant", adultDose: "100–200 mg PO BID titrated", rx: "Rx", note: "Strong CYP3A4 inducer — check interactions; HLA-B*1502 screening in at-risk ancestry." },
    ],
    referralNote: "New seizures, focal deficit, thunderclap headache or progressive weakness → urgent neurology/emergency referral.",
  },
  {
    test: (c) => L(c) === "H" && N(c) <= 59,
    label: "Eye disorder (unspecified)",
    source: "WHO EML 22",
    options: [
      { drug: "Lubricating eye drops (hypromellose / carmellose)", drugClass: "Ocular lubricant", adultDose: "1–2 drops PRN up to 6×/day", rx: "OTC" },
      { drug: "Chloramphenicol 0.5% eye drops", drugClass: "Topical antibiotic", adultDose: "1 drop q2–6h ×5 d", rx: "OTC", note: "Bacterial conjunctivitis only." },
    ],
    referralNote: "Red painful eye, visual loss, photophobia or contact-lens wearer → same-day ophthalmology.",
  },
  {
    test: (c) => L(c) === "H" && N(c) >= 60,
    label: "Ear / mastoid disorder (unspecified)",
    source: "WHO EML 22",
    options: [
      SYMPTOMATIC_CORE[0],
      { drug: "Amoxicillin", drugClass: "Aminopenicillin", adultDose: "500 mg PO TID ×5 d", pediatricDose: "40–50 mg/kg/day divided TID", rx: "Rx", note: "Acute otitis media when systemically unwell or no improvement at 48–72 h." },
    ],
    referralNote: "Mastoid tenderness, facial palsy or sudden hearing loss → urgent ENT.",
  },
  {
    test: (c) => L(c) === "I",
    label: "Cardiovascular disorder (unspecified)",
    source: "WHO EML 22 · WHO HEARTS",
    options: [
      { drug: "Amlodipine", drugClass: "Dihydropyridine CCB", adultDose: "5–10 mg PO daily", rx: "Rx" },
      { drug: "Enalapril / lisinopril", drugClass: "ACE inhibitor", adultDose: "5–20 mg PO daily (titrate)", rx: "Rx", note: "Monitor U&E; contraindicated in pregnancy." },
      { drug: "Atorvastatin", drugClass: "Statin", adultDose: "20–40 mg PO nocte", rx: "Rx", note: "Secondary prevention in established CVD." },
      { drug: "Aspirin 75–100 mg", drugClass: "Antiplatelet", adultDose: "75–100 mg PO daily", rx: "OTC", note: "Secondary prevention only — not routine primary prevention." },
    ],
    referralNote: "Chest pain, syncope, new arrhythmia or acute breathlessness → emergency assessment.",
  },
  {
    test: (c) => L(c) === "J",
    label: "Respiratory disorder (unspecified)",
    source: "WHO EML 22 · GINA/GOLD 2024",
    options: [
      { drug: "Salbutamol inhaler", drugClass: "SABA", adultDose: "100–200 mcg inhaled PRN q4–6h", pediatricDose: "100–200 mcg PRN via spacer", rx: "Rx", note: "Reliever for any wheeze/bronchospasm." },
      { drug: "Beclometasone inhaler", drugClass: "Inhaled corticosteroid", adultDose: "200–400 mcg inhaled BID", rx: "Rx" },
      { drug: "Amoxicillin", drugClass: "Aminopenicillin", adultDose: "500 mg–1 g PO TID ×5 d", rx: "Rx", note: "Community-acquired pneumonia / infective exacerbation." },
      SYMPTOMATIC_CORE[0],
    ],
    referralNote: "SpO₂ <94%, RR >24, confusion or cyanosis → emergency referral.",
  },
  {
    test: (c) => L(c) === "K",
    label: "Digestive system disorder (unspecified)",
    source: "WHO EML 22",
    options: [
      { drug: "Omeprazole", drugClass: "Proton pump inhibitor", adultDose: "20–40 mg PO daily ×4–8 wks", rx: "OTC", note: "Acid-related dyspepsia, GORD, ulcer healing." },
      { drug: "Hyoscine butylbromide", drugClass: "Antispasmodic", adultDose: "10–20 mg PO TID–QID PRN", rx: "OTC", note: "Colic / cramping abdominal pain." },
      { drug: "Metronidazole ± ciprofloxacin", drugClass: "Anti-anaerobe ± fluoroquinolone", adultDose: "Metronidazole 400 mg PO TID ×7 d; ciprofloxacin 500 mg PO BID", rx: "Rx", note: "Intra-abdominal, stoma-site or peri-anal infection — swab first where possible." },
      SYMPTOMATIC_CORE[0],
      SYMPTOMATIC_CORE[2],
    ],
    referralNote: "GI bleeding, persistent vomiting, jaundice, peritonism, or a stoma/device site with spreading cellulitis → same-day medical or surgical review.",
  },
  {
    test: (c) => L(c) === "L",
    label: "Skin / subcutaneous disorder (unspecified)",
    source: "WHO EML 22",
    options: [
      { drug: "Emollient (white soft paraffin / aqueous cream)", drugClass: "Emollient", adultDose: "Apply liberally 2–4×/day", rx: "OTC" },
      { drug: "Hydrocortisone 1% cream", drugClass: "Mild topical corticosteroid", adultDose: "Apply thinly BID ≤7 d", rx: "OTC", note: "Avoid on face/flexures beyond short courses." },
      { drug: "Flucloxacillin", drugClass: "Antistaphylococcal penicillin", adultDose: "500 mg PO QID ×5–7 d", rx: "Rx", note: "Cellulitis / impetigo with systemic features." },
    ],
    referralNote: "Rapidly spreading erythema, blistering, mucosal involvement or systemic upset → urgent referral (consider SJS/TEN, necrotising infection).",
  },
  {
    test: (c) => L(c) === "M",
    label: "Musculoskeletal disorder (unspecified)",
    source: "WHO EML 22",
    options: [
      ...SYMPTOMATIC_CORE.slice(0, 2),
      { drug: "Topical NSAID (diclofenac gel)", drugClass: "Topical NSAID", adultDose: "Apply 2–4 g to affected area TID–QID", rx: "OTC", note: "Preferred over oral NSAIDs in elderly / GI or renal risk." },
      { drug: "Physiotherapy + graded exercise", drugClass: "Non-pharmacological", adultDose: "—", rx: "OTC", note: "Core first-line for most MSK conditions." },
    ],
    referralNote: "Hot swollen joint, trauma with deformity, or new inflammatory back pain → urgent assessment (septic arthritis must be excluded).",
  },
  {
    test: (c) => L(c) === "N",
    label: "Genitourinary disorder (unspecified)",
    source: "WHO EML 22",
    options: [
      { drug: "Nitrofurantoin", drugClass: "Urinary antibacterial (Access)", adultDose: "100 mg MR PO BID ×3 d (women) / ×7 d (men)", rx: "Rx", note: "Avoid if eGFR <45 mL/min." },
      { drug: "Trimethoprim", drugClass: "Folate antagonist", adultDose: "200 mg PO BID ×3 d", rx: "Rx", note: "Avoid first trimester." },
      SYMPTOMATIC_CORE[0],
    ],
    referralNote: "Loin pain + fever, haematuria, or reduced urine output → same-day medical review. Review all renally-cleared drugs against eGFR.",
  },
  {
    test: (c) => L(c) === "O",
    label: "Pregnancy / childbirth-related (unspecified)",
    source: "WHO EML 22 · WHO ANC 2016",
    options: [
      { drug: "Folic acid 400 mcg (+ iron)", drugClass: "Antenatal supplement", adultDose: "400 mcg PO daily preconception–12 wks; iron 30–60 mg elemental daily", rx: "OTC" },
      { drug: "Paracetamol", drugClass: "Analgesic", adultDose: "500–1000 mg PO q6h, max 4 g/day", rx: "OTC", note: "Analgesic of choice in pregnancy; avoid NSAIDs after 20 wks." },
      { drug: "Prescriber-led review of all medicines", drugClass: "Medication safety", adultDose: "—", rx: "Rx / specialist", note: "Screen every drug for teratogenicity and lactation safety." },
    ],
    referralNote: "Bleeding, reduced fetal movements, severe headache/visual change or BP ≥140/90 → immediate obstetric referral.",
  },
  {
    test: (c) => L(c) === "P",
    label: "Perinatal / neonatal condition (unspecified)",
    source: "WHO EML 22 — neonatal care",
    options: [
      { drug: "Neonatal / paediatric specialist assessment", drugClass: "Specialist pathway", adultDose: "—", rx: "Rx / specialist", note: "Neonatal dosing is strictly weight- and postmenstrual-age based." },
    ],
    referralNote: "All neonatal conditions require paediatric prescriber involvement — no OTC self-care.",
  },
  {
    test: (c) => L(c) === "Q",
    label: "Congenital anomaly (unspecified)",
    source: "WHO EML 22",
    options: [
      { drug: "Multidisciplinary specialist management", drugClass: "Specialist pathway", adultDose: "—", rx: "Rx / specialist" },
    ],
    referralNote: "Managed by the relevant specialty; pharmacist role is interaction, dosing and adherence support.",
  },
  {
    test: (c) => L(c) === "R",
    label: "Symptom / abnormal finding (unspecified)",
    source: "WHO EML 22 — symptomatic care",
    options: SYMPTOMATIC_CORE,
    referralNote: "Symptom codes are not a diagnosis. If symptoms persist >7 days, recur, or occur with red flags (weight loss, night sweats, bleeding, severe pain), refer for diagnosis.",
  },
  {
    test: (c) => L(c) === "S" || L(c) === "T",
    label: "Injury / poisoning / drug effect (unspecified)",
    source: "WHO EML 22",
    options: [
      SYMPTOMATIC_CORE[0],
      { drug: "Wound care + tetanus prophylaxis review", drugClass: "Non-pharmacological / immunisation", adultDose: "Td booster if >10 y since last dose (or >5 y for dirty wounds)", rx: "Rx" },
      { drug: "Stop / substitute the causative agent (adverse drug effect)", drugClass: "Medication review", adultDose: "—", rx: "Rx", note: "Report suspected ADRs to the national pharmacovigilance scheme." },
    ],
    referralNote: "Suspected poisoning or overdose → contact poisons centre and refer to emergency care immediately.",
  },
  {
    test: (c) => L(c) === "Z",
    label: "Health status / contact with services",
    source: "WHO EML 22",
    options: [
      { drug: "No pharmacotherapy indicated by this code alone", drugClass: "Administrative / status code", adultDose: "—", rx: "OTC", note: "Use alongside the clinical diagnosis codes for therapy decisions." },
      { drug: "Preventive care: vaccination, screening, lifestyle counselling", drugClass: "Preventive", adultDose: "Per national schedule", rx: "Rx / specialist" },
    ],
    referralNote: "Confirm allergy/status codes against the patient record before dispensing.",
  },
];

/**
 * Chapter-level fallback therapy for any ICD-10 code with no specific mapping.
 * Guarantees the recommendation panel is never a dead end.
 */
export function getFallbackTherapyForIcd(code: string): ConditionTherapy | null {
  const hit = CHAPTER_FALLBACKS.find((f) => f.test(code));
  if (hit) {
    return { label: hit.label, source: hit.source + " · chapter-level guidance", options: hit.options, referralNote: hit.referralNote };
  }

  // External-cause and uncommon extension codes (including V–Y) do not have a
  // medication-specific ICD chapter. Still return a safe clinical pathway so
  // every selectable ICD result produces guidance rather than a dead end.
  return {
    label: "General clinical management",
    source: "WHO EML 22 · general guidance",
    options: [
      { drug: "Paracetamol (acetaminophen)", drugClass: "Analgesic / antipyretic", adultDose: "500–1000 mg PO q6h, max 4 g/24 h (max 2 g with hepatic impairment or heavy alcohol use)", pediatricDose: "15 mg/kg/dose q6h, max 60 mg/kg/day", rx: "OTC", note: "Use only when pain or fever is present and no contraindication applies." },
      { drug: "Medication and diagnosis review", drugClass: "Clinical assessment", adultDose: "Individualise to the confirmed diagnosis and patient factors", rx: "Rx / specialist", note: "This code does not identify a condition-specific medicine pathway by itself." },
    ],
    referralNote: "Confirm the underlying diagnosis and severity before selecting condition-specific treatment; refer urgently when red flags or acute deterioration are present.",
  };
}
