// Maps ICD-10-CM codes → internal symptom IDs used by the clinical engine.
// Source: ICD-10-CM 2024 classification chapters.
export function icdToSymptomId(code: string, name?: string): string | null {
  const c = code.toUpperCase().replace(/\s/g, "");

  // ─── PAIN & FEVER ───────────────────────────────────────────────
  if (c.startsWith("R51")) return "headache";
  if (c.startsWith("G43")) return "migraine";
  if (c.startsWith("M54")) return "back_pain";
  if (c.startsWith("M25.5") || c.startsWith("M13") || c.startsWith("M79.6")) return "joint_pain";
  if (c.startsWith("M79.3") || c.startsWith("M79.1") || c.startsWith("R68.89")) return "body_ache";
  if (c.startsWith("R50.0") || c.startsWith("R50.8")) return "high_fever";
  if (c.startsWith("R50.9") || c.startsWith("R50")) return "mild_fever";
  if (c.startsWith("R68.83") || c.startsWith("R68.0")) return "chills"; // chills / rigors
  if (c.startsWith("R07")) return "chest_pain";

  // ─── MUSCULOSKELETAL ────────────────────────────────────────────
  if (c.startsWith("M62.8") || c.startsWith("R25.2") || c.startsWith("M62.3")) return "muscle_spasm";
  if (c.startsWith("M10") || c.startsWith("M1A")) return "gout_attack";

  // ─── NEUROPATHIC PAIN ───────────────────────────────────────────
  if (
    c.startsWith("G54") || c.startsWith("G57") || c.startsWith("G58") ||
    c.startsWith("M79.2") || c.startsWith("G89.2") || c.startsWith("G89.3") ||
    c.startsWith("G62") || c.startsWith("E11.4") || c.startsWith("E10.4")
  ) return "neuropathic_pain";

  // ─── RESPIRATORY ────────────────────────────────────────────────
  if (c.startsWith("J02") || c.startsWith("J06.0")) return "sore_throat";
  if (c.startsWith("J03")) return "throat_infection";
  if (c.startsWith("R05.9") || c.startsWith("R05.1") || (c.startsWith("R05") && !c.startsWith("R05.2") && !c.startsWith("R05.3"))) return "dry_cough";
  if (c.startsWith("R09.3") || c.startsWith("R05.2") || c.startsWith("R05.3")) return "productive_cough";
  if (c.startsWith("R06.2") || c.startsWith("R06.0") || c.startsWith("R06.1")) return "wheeze";
  if (c.startsWith("J45") || c.startsWith("J44")) return "wheeze";
  if (
    c.startsWith("J18") || c.startsWith("J15") || c.startsWith("J22") ||
    c.startsWith("J21") || c.startsWith("J20") || c.startsWith("J17")
  ) return "chest_infection";
  if (c.startsWith("J06.9") || c.startsWith("J00") || c.startsWith("J34")) return "nasal_congestion";
  if (c.startsWith("J30") || c.startsWith("J31") || c.startsWith("R09.89")) return "runny_nose";

  // ─── EAR ────────────────────────────────────────────────────────
  if (
    c.startsWith("H60") || c.startsWith("H62") ||
    c.startsWith("H65") || c.startsWith("H66") || c.startsWith("H67")
  ) return "ear_infection";
  if (c.startsWith("H92")) return "ear_pain";

  // ─── EYE ────────────────────────────────────────────────────────
  if (c.startsWith("H10")) return "eye_infection";
  if (c.startsWith("H52") || c.startsWith("H53") || c.startsWith("H11")) return "eye_redness";

  // ─── URINARY / UTI ──────────────────────────────────────────────
  if (c.startsWith("R30")) return "dysuria";
  if (c.startsWith("R35") || c.startsWith("R39.1")) return "urinary_frequency";
  if (c.startsWith("N30") || c.startsWith("N39.0")) return "dysuria";
  if (c.startsWith("N39") || c.startsWith("N31")) return "urinary_frequency";
  if (c.startsWith("R31")) return "blood_in_urine";

  // ─── GENITOURINARY / VAGINAL ────────────────────────────────────
  if (c.startsWith("B37.3") || c.startsWith("B37.4")) return "vaginal_discharge";
  if (c.startsWith("N76") || c.startsWith("N89") || c.startsWith("N77")) return "vaginal_discharge";

  // ─── GASTROINTESTINAL ───────────────────────────────────────────
  if (c.startsWith("R11")) return "nausea";
  if (c.startsWith("R19.7") || c.startsWith("A09") || c.startsWith("K59.1")) return "diarrhea";
  if (c.startsWith("K59.0")) return "constipation";
  if (c.startsWith("R10")) return "stomach_cramps";
  if (c.startsWith("R14") || c.startsWith("K30")) return "bloating";
  if (c.startsWith("K21")) return "heartburn";
  if (c.startsWith("K08.8") || c.startsWith("K08.9") || c.startsWith("K10")) return "toothache";

  // ─── ORAL / DENTAL ──────────────────────────────────────────────
  if (c.startsWith("K12.0") || c.startsWith("K12.1") || c.startsWith("K12.2")) return "mouth_ulcer";
  if (c.startsWith("K12")) return "mouth_ulcer";
  if (c.startsWith("B37.0") || c.startsWith("B37.83")) return "oral_thrush";
  if (c.startsWith("K04")) return "dental_abscess";
  if (c.startsWith("K05.2") || c.startsWith("K05.3")) return "dental_abscess";

  // ─── SKIN ───────────────────────────────────────────────────────
  if (c.startsWith("L70")) return "acne";
  if (c.startsWith("B35") || c.startsWith("B36") || c.startsWith("B37.2")) return "fungal_skin";
  if (c.startsWith("L01")) return "wound_infection";
  if (c.startsWith("L08") || c.startsWith("L03")) return "wound_infection";
  if (c.startsWith("L30") || c.startsWith("L20") || c.startsWith("L23") || c.startsWith("L50") || c.startsWith("L29")) return "skin_rash";
  if (c.startsWith("L29")) return "itching";

  // ─── MENSTRUAL / WOMEN'S HEALTH ─────────────────────────────────
  if (c.startsWith("N94")) return "menstrual_pain";

  // ─── CARDIOVASCULAR / BLOOD PRESSURE ────────────────────────────
  if (c.startsWith("R03")) return "elevated_bp";
  if (c.startsWith("R00") || c.startsWith("R01")) return "palpitations";
  if (c.startsWith("I47") || c.startsWith("I48") || c.startsWith("I49")) return "palpitations";
  if (c.startsWith("R55") || c.startsWith("T67.0") || c.startsWith("T67.1")) return "syncope_collapse";
  if (c.startsWith("R57")) return "syncope_collapse";
  if (c.startsWith("R60")) return "edema_swelling";
  if (c.startsWith("R17")) return "jaundice";
  if (c.startsWith("R32") || c.startsWith("R33")) return "urinary_retention";
  if (c.startsWith("R04.2")) return "productive_cough";

  // ─── GENERAL ────────────────────────────────────────────────────
  if (c.startsWith("R41.3") || c.startsWith("R41.0")) return "confusion_memory";
  if (c.startsWith("R42") || c.startsWith("H81")) return "dizziness";
  if (c.startsWith("G47")) return "insomnia";
  if (c.startsWith("F41") || c.startsWith("F40")) return "anxiety_symptoms";
  if (c.startsWith("F32") || c.startsWith("F33") || c.startsWith("F34")) return "depression_low_mood";
  if (c.startsWith("R53")) return "fatigue";

  // ─── INFECTIOUS DISEASE (A/B chapter) ───────────────────────────
  if (c.startsWith("B37")) return "oral_thrush"; // candidiasis catch-all
  if (c.startsWith("A06") || c.startsWith("A07")) return "diarrhea"; // amoeba/giardia
  if (c.startsWith("A09")) return "diarrhea";

  // ─── Keyword fallback on ICD description text ───────────────────
  if (name) return icdSymptomByKeyword(name);
  return null;
}

// Keyword-based fallback: maps free-text ICD description → internal symptom ID.
function icdSymptomByKeyword(name: string): string | null {
  const n = name.toLowerCase();

  // Pain & Fever
  if (/migraine/.test(n)) return "migraine";
  if (/headache|cephalgia/.test(n)) return "headache";
  if (/back pain|lumbago|backache|lumbar|dorsalgia/.test(n)) return "back_pain";
  if (/joint pain|arthralgia|arthritis|synovitis|articular|gout/.test(n)) return "joint_pain";
  if (/acute gout|gouty arthritis|gout attack/.test(n)) return "gout_attack";
  if (/myalgia|muscle pain|fibromyalgia|body ache|musculoskeletal pain/.test(n)) return "body_ache";
  if (/muscle.*spasm|spasm.*muscle|muscle cramp|cramp|myospasm/.test(n)) return "muscle_spasm";
  if (/neuropath|neuralgia|nerve pain|burning.*nerve|diabetic.*neuropathy|polyneuropathy/.test(n)) return "neuropathic_pain";
  if (/high fever|hyperpyrexia|fever.*high/.test(n)) return "high_fever";
  if (/fever|pyrexia|febrile/.test(n)) return "mild_fever";
  if (/chills|rigor|shivering/.test(n)) return "chills";

  // Respiratory & Infections
  if (/tonsillitis|tonsillar.*infect|streptococcal.*throat|bacterial.*tonsil/.test(n)) return "throat_infection";
  if (/sore throat|pharyngitis/.test(n)) return "sore_throat";
  if (/wheez|bronchospasm|breathlessness.*asthma|asthmatic/.test(n)) return "wheeze";
  if (/pneumonia|lower.*respiratory|bronchopneumonia|lrti|chest.*infect|lobar pneumon/.test(n)) return "chest_infection";
  if (/productive cough|cough.*sputum|cough.*phlegm|wet cough/.test(n)) return "productive_cough";
  if (/dry cough|cough/.test(n) && !/productive|sputum|phlegm/.test(n)) return "dry_cough";
  if (/runny nose|rhinorrh|nasal discharge/.test(n)) return "runny_nose";
  if (/nasal congestion|stuffy nose|blocked nose|rhinitis/.test(n)) return "nasal_congestion";

  // Ear & Eye
  if (/otitis media|otitis externa|ear.*infect|middle.*ear|swimmer.*ear/.test(n)) return "ear_infection";
  if (/ear pain|otalgia|earache/.test(n)) return "ear_pain";
  if (/conjunctivit|eye.*infect|bacterial.*eye|pink.*eye|infective.*eye/.test(n)) return "eye_infection";
  if (/eye.*red|red.*eye|ocular|visual|ophth/.test(n)) return "eye_redness";

  // Urinary
  if (/dysuria|painful.*urin|burning.*urin|pain.*pass urin/.test(n)) return "dysuria";
  if (/urinary.*freq|frequency.*urin|urgency.*urin|overactive.*bladder|urge incontinence/.test(n)) return "urinary_frequency";
  if (/cystitis|urinary.*tract.*infect|uti|bladder.*infect/.test(n)) return "dysuria";
  if (/blood.*urin|haematuria|hematuria/.test(n)) return "blood_in_urine";

  // Vaginal / Genitourinary
  if (/vaginal.*discharge|vaginal.*itch|vaginit|candida.*vag|thrush.*vag|vaginal.*thrush/.test(n)) return "vaginal_discharge";

  // Oral / Dental
  if (/mouth ulcer|aphthous|aphthae|oral ulcer/.test(n)) return "mouth_ulcer";
  if (/oral thrush|candida.*oral|candida.*mouth|thrush.*mouth|oral.*candida|oral.*candidiasis/.test(n)) return "oral_thrush";
  if (/dental.*abscess|abscess.*tooth|periapical|periodontal.*abscess|tooth.*abscess/.test(n)) return "dental_abscess";
  if (/toothache|dental pain|tooth pain|odontogenic/.test(n)) return "toothache";

  // Skin
  if (/acne|pimple|comedone/.test(n)) return "acne";
  if (/fungal.*skin|tinea|ringworm|athlete.*foot|dermatophyt|onychomycosis/.test(n)) return "fungal_skin";
  if (/wound.*infect|impetigo|cellulitis|infected.*wound|skin.*infect|infected.*skin/.test(n)) return "wound_infection";
  if (/skin rash|rash|urticaria|eczema|dermatitis/.test(n)) return "skin_rash";
  if (/pruritus|itch/.test(n)) return "itching";

  // GI
  if (/nausea|vomiting|emesis/.test(n)) return "nausea";
  if (/diarrhea|diarrhoea|loose stool|gastroenteritis/.test(n)) return "diarrhea";
  if (/constipation|obstipation/.test(n)) return "constipation";
  if (/abdominal.*pain|stomach.*ache|stomachache|belly pain|epigastric|colicky/.test(n)) return "stomach_cramps";
  if (/bloat|flatulence|distension|gas/.test(n)) return "bloating";
  if (/heartburn|acid reflux|reflux|gerd|indigestion/.test(n)) return "heartburn";

  // Women's health
  if (/menstrual pain|dysmenorrh|period pain|pelvic pain/.test(n)) return "menstrual_pain";

  // General
  if (/chest pain|chest tightness|angina|pectoris/.test(n)) return "chest_pain";
  if (/insomnia|sleep.*disturb|difficulty sleep|sleeplessness/.test(n)) return "insomnia";
  if (/anxiety|anxious|panic|nervous/.test(n)) return "anxiety_symptoms";
  if (/dizziness|dizzy|vertigo|lightheaded/.test(n)) return "dizziness";
  if (/confusion|memory|dementia|disorientation|cognitive/.test(n)) return "confusion_memory";
  if (/fatigue|tiredness|weakness|asthenia/.test(n)) return "fatigue";

  // Cardiovascular / BP
  if (/blood.pressure|elevated.*pressure|hypertensive.*read|pressure.*read|high.*bp|bp.*high|raised.*bp/.test(n)) return "elevated_bp";
  if (/palpitation|racing.*heart|irregular.*heart|rapid.*heart|tachycardia|bradycardia|arrhythmia|fast.*heart|heart.*fast/.test(n)) return "palpitations";
  if (/edema|oedema|ankle.*swell|leg.*swell|swelling.*ankle|swelling.*leg|pedal.*oed|bilateral.*swell/.test(n)) return "edema_swelling";
  if (/syncope|blackout|black.out|faint|collapse|loss.*conscious|loss.*conscious|unconscious/.test(n)) return "syncope_collapse";
  if (/jaundice|icterus|yellow.*skin|yellow.*eye|icteric/.test(n)) return "jaundice";
  if (/urinary.*retention|retention.*urin|unable.*pass.*urin|difficulty.*pass.*urin|poor.*stream|weak.*stream/.test(n)) return "urinary_retention";
  if (/depression|low.*mood|depressed|major.*depressive/.test(n)) return "depression_low_mood";

  return null;
}

// Maps ICD-10-CM codes → internal condition IDs used by the clinical engine.
export function icdToConditionId(code: string): string | null {
  const c = code.toUpperCase().replace(/\s/g, "");

  // ─── Cardiovascular ─────────────────────────────────────────────
  if (c === "I10" || c.startsWith("I11") || c.startsWith("I12") || c.startsWith("I13") || c.startsWith("I1A")) return "hypertension";
  if (c.startsWith("I50")) return "heart_failure";
  if (c.startsWith("I48")) return "atrial_fibrillation";
  if (c.startsWith("I20") || c.startsWith("I25") || c.startsWith("I21") || c.startsWith("I22") || c.startsWith("I24")) return "ischemic_heart_disease";
  if (c.startsWith("I63") || c.startsWith("I64") || c.startsWith("I65") || c.startsWith("I66") || c.startsWith("I69") || c.startsWith("G45")) return "stroke_ischemic";
  if (c.startsWith("I80") || c.startsWith("I81") || c.startsWith("I82") || c.startsWith("I26")) return "dvt_pe";
  if (c.startsWith("E78")) return "hyperlipidemia";

  // ─── Endocrine ──────────────────────────────────────────────────
  if (c.startsWith("E11") || c.startsWith("E13")) return "diabetes_t2";
  if (c.startsWith("E10")) return "diabetes_t1";
  if (c.startsWith("E00") || c.startsWith("E01") || c.startsWith("E02") || c.startsWith("E03")) return "hypothyroidism";
  if (c.startsWith("E05")) return "hyperthyroidism";
  if (c.startsWith("E04") || c.startsWith("E06") || c.startsWith("E07")) return "thyroid_disease";

  // ─── Respiratory ────────────────────────────────────────────────
  if (c.startsWith("J45")) return "asthma";
  if (c.startsWith("J44")) return "copd";
  if (c.startsWith("J18") || c.startsWith("J15") || c.startsWith("J13") || c.startsWith("J14") || c.startsWith("J17")) return "pneumonia_cap";
  if (c.startsWith("J01") || c.startsWith("J32")) return "sinusitis";
  if (c.startsWith("J02.0") || c.startsWith("J03")) return "strep_pharyngitis";
  if (c.startsWith("J30") || c.startsWith("J31.0")) return "allergic_rhinitis";

  // ─── ENT / Eye ──────────────────────────────────────────────────
  if (c.startsWith("H65") || c.startsWith("H66") || c.startsWith("H67")) return "otitis_media";
  if (c.startsWith("H40") || c.startsWith("H42")) return "glaucoma";

  // ─── Renal / GU ─────────────────────────────────────────────────
  if (c.startsWith("N18")) return "ckd";
  if (c.startsWith("N30") || c.startsWith("N39.0")) return "uti_lower";
  if (c.startsWith("N10") || c.startsWith("N11") || c.startsWith("N12")) return "pyelonephritis";
  if (c.startsWith("N40")) return "bph";
  if (c.startsWith("N52") || c.startsWith("F52.2")) return "erectile_dysfunction";
  if (c.startsWith("Z30")) return "contraception_needed";

  // ─── Gastrointestinal ───────────────────────────────────────────
  if (c.startsWith("K21")) return "gerd";
  if (c.startsWith("K25") || c.startsWith("K26") || c.startsWith("K27") || c.startsWith("K28")) return "peptic_ulcer";
  if (c.startsWith("K50") || c.startsWith("K51")) return "ibd";
  if (
    c.startsWith("K70") || c.startsWith("K71") || c.startsWith("K72") ||
    c.startsWith("K73") || c.startsWith("K74") || c.startsWith("K75") || c.startsWith("K76")
  ) return "liver_disease";
  if (c.startsWith("B18.1")) return "hepatitis_b";
  if (c.startsWith("B18.2")) return "hepatitis_c";

  // ─── Infections (A/B) ───────────────────────────────────────────
  if (c.startsWith("A15") || c.startsWith("A16") || c.startsWith("A17") || c.startsWith("A18") || c.startsWith("A19")) return "tuberculosis";
  if (c.startsWith("B50") || c.startsWith("B51") || c.startsWith("B52") || c.startsWith("B53") || c.startsWith("B54")) return "malaria";
  if (c.startsWith("B20") || c.startsWith("B24") || c.startsWith("Z21")) return "hiv";
  if (c.startsWith("A56") || c.startsWith("A74")) return "chlamydia";
  if (c.startsWith("A54")) return "gonorrhea";
  if (c.startsWith("A50") || c.startsWith("A51") || c.startsWith("A52") || c.startsWith("A53")) return "syphilis";
  if (c.startsWith("B96.81") || c === "K29.9") return "h_pylori";
  if (c.startsWith("L03") || c.startsWith("L08")) return "cellulitis";
  if (c.startsWith("B86")) return "scabies";
  if (c.startsWith("B35")) return "tinea_infection";

  // ─── Neuro / Psych ──────────────────────────────────────────────
  if (c.startsWith("G40") || c.startsWith("G41")) return "epilepsy";
  if (c.startsWith("G20") || c.startsWith("G21")) return "parkinsons";
  if (c.startsWith("G30") || c.startsWith("F00") || c.startsWith("F01") || c.startsWith("F03")) return "alzheimers";
  if (c.startsWith("G43")) return "migraine_prophylaxis";
  if (c.startsWith("G50") || c.startsWith("G56") || c.startsWith("G57") || c.startsWith("G62") || c.startsWith("G63")) return "neuropathic_pain_chronic";
  if (c.startsWith("F32") || c.startsWith("F33")) return "depression";
  if (c.startsWith("F41") || c.startsWith("F40")) return "anxiety";
  if (c.startsWith("F20") || c.startsWith("F22") || c.startsWith("F23") || c.startsWith("F25") || c.startsWith("F29")) return "schizophrenia";
  if (c.startsWith("F31")) return "bipolar";

  // ─── MSK / Rheum ────────────────────────────────────────────────
  if (c.startsWith("M10") || c.startsWith("M1A")) return "gout";
  if (c.startsWith("M15") || c.startsWith("M16") || c.startsWith("M17") || c.startsWith("M18") || c.startsWith("M19")) return "osteoarthritis";
  if (c.startsWith("M05") || c.startsWith("M06")) return "rheumatoid_arthritis";
  if (c.startsWith("M80") || c.startsWith("M81")) return "osteoporosis";

  // ─── Skin ───────────────────────────────────────────────────────
  if (c.startsWith("L70")) return "acne_moderate";
  if (c.startsWith("L20") || c.startsWith("L30")) return "eczema_atopic";
  if (c.startsWith("L40")) return "psoriasis";

  // ─── Haematology ────────────────────────────────────────────────
  if (c.startsWith("D50")) return "iron_deficiency_anemia";
  if (c.startsWith("D51") || c.startsWith("D52")) return "b12_deficiency";
  if (c.startsWith("D65") || c.startsWith("D66") || c.startsWith("D67") || c.startsWith("D68") || c.startsWith("D69")) return "bleeding_disorder";

  if (c.startsWith("J06") || c.startsWith("J00")) return null;
  return null;
}

// Maps ICD-10-CM Z88 drug allergy codes → internal allergy IDs.
export function icdToAllergyId(code: string): string | null {
  const c = code.toUpperCase().replace(/\s/g, "");
  if (c === "Z88.0") return "penicillin_allergy";
  if (c === "Z88.1") return "penicillin_allergy";
  if (c === "Z88.2") return "sulfonamide_allergy";
  if (c === "Z88.3") return null;
  if (c === "Z88.4") return null;
  if (c === "Z88.5") return "opioid_allergy";
  if (c === "Z88.6") return "nsaid_allergy";
  if (c === "Z88.7") return null;
  if (c === "Z88.8") return "other_drug_allergy";
  if (c === "Z88.9") return "other_drug_allergy";
  if (c.startsWith("Z88")) return "other_drug_allergy";
  if (c.startsWith("T78.1")) return null;
  if (c.startsWith("L23.3") || c.startsWith("L23.4")) return "latex_allergy";
  return null;
}

// Human-readable label for an internal allergy ID
export const ALLERGY_LABELS: Record<string, string> = {
  penicillin_allergy: "Penicillin / Beta-lactam",
  sulfonamide_allergy: "Sulfonamide",
  nsaid_allergy: "NSAIDs / Analgesics",
  opioid_allergy: "Opioids / Narcotics",
  other_drug_allergy: "Other Drug",
  latex_allergy: "Latex",
};

// Clinical chapter badge colours for ICD codes
export function icdChapterColor(code: string): { bg: string; text: string; chapter: string } {
  const c = code.toUpperCase();
  if (c.startsWith("R")) return { bg: "bg-blue-100", text: "text-blue-700", chapter: "Symptoms" };
  if (c.startsWith("Z88")) return { bg: "bg-red-100", text: "text-red-700", chapter: "Drug Allergy" };
  if (c.startsWith("Z")) return { bg: "bg-slate-100", text: "text-slate-600", chapter: "Status / History" };
  if (c.startsWith("I")) return { bg: "bg-red-100", text: "text-red-700", chapter: "Cardiovascular" };
  if (c.startsWith("E")) return { bg: "bg-yellow-100", text: "text-yellow-700", chapter: "Endocrine" };
  if (c.startsWith("J")) return { bg: "bg-sky-100", text: "text-sky-700", chapter: "Respiratory" };
  if (c.startsWith("K")) return { bg: "bg-orange-100", text: "text-orange-700", chapter: "Digestive" };
  if (c.startsWith("N")) return { bg: "bg-purple-100", text: "text-purple-700", chapter: "Genitourinary" };
  if (c.startsWith("M")) return { bg: "bg-amber-100", text: "text-amber-700", chapter: "Musculoskeletal" };
  if (c.startsWith("G") || c.startsWith("F")) return { bg: "bg-violet-100", text: "text-violet-700", chapter: "Neurological/Mental" };
  if (c.startsWith("L")) return { bg: "bg-rose-100", text: "text-rose-700", chapter: "Skin" };
  if (c.startsWith("H")) return { bg: "bg-teal-100", text: "text-teal-700", chapter: "Sensory" };
  if (c.startsWith("D")) return { bg: "bg-pink-100", text: "text-pink-700", chapter: "Blood/Haematology" };
  if (c.startsWith("A") || c.startsWith("B")) return { bg: "bg-lime-100", text: "text-lime-700", chapter: "Infectious" };
  return { bg: "bg-slate-100", text: "text-slate-600", chapter: "Other" };
}
