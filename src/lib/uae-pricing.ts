export type UaeStatus = "OTC" | "Pharmacist" | "Rx" | "Controlled";

export interface BrandedOption {
  brand: string;
  packSize: string;
  priceAed: number;
}

export interface UaePricing {
  /** Matches MedicationRule.id in clinical-data.ts */
  id: string;
  genericName: string;
  uaeStatus: UaeStatus;
  /** Approximate AED price for the cheapest generic pack available in UAE. null = generic not widely available. */
  genericPriceAed: number | null;
  genericPackSize: string | null;
  brandedOptions: BrandedOption[];
  /** Any UAE-specific notes (formulary, controlled-drug schedule, etc.) */
  note?: string;
}

export const UAE_PRICING: UaePricing[] = [
  // ── Analgesics / Antipyretics ──────────────────────────────────────────────
  {
    id: "paracetamol",
    genericName: "Paracetamol",
    uaeStatus: "OTC",
    genericPriceAed: 5,
    genericPackSize: "20 tabs",
    brandedOptions: [
      { brand: "Panadol 500 mg", packSize: "20 tabs", priceAed: 9 },
      { brand: "Panadol Extra (500/65 mg)", packSize: "24 tabs", priceAed: 14 },
      { brand: "Calpol 120 mg/5 ml (Paeds syrup)", packSize: "100 ml", priceAed: 16 },
    ],
    note: "Freely available OTC. Panadol dominates UAE market.",
  },
  {
    id: "ibuprofen",
    genericName: "Ibuprofen",
    uaeStatus: "OTC",
    genericPriceAed: 8,
    genericPackSize: "20 tabs",
    brandedOptions: [
      { brand: "Brufen 400 mg", packSize: "20 tabs", priceAed: 18 },
      { brand: "Nurofen 200 mg", packSize: "24 tabs", priceAed: 22 },
      { brand: "Advil 200 mg", packSize: "20 tabs", priceAed: 20 },
    ],
    note: "OTC up to 400 mg; higher doses require Rx.",
  },
  {
    id: "diclofenac",
    genericName: "Diclofenac",
    uaeStatus: "Rx",
    genericPriceAed: 14,
    genericPackSize: "20 tabs",
    brandedOptions: [
      { brand: "Voltaren 50 mg", packSize: "20 tabs", priceAed: 28 },
      { brand: "Voltaren Emulgel 1%", packSize: "100 g gel", priceAed: 45 },
      { brand: "Cataflam 50 mg", packSize: "20 tabs", priceAed: 30 },
    ],
    note: "Oral formulations require Rx. Topical gel available OTC.",
  },
  {
    id: "aspirin",
    genericName: "Aspirin",
    uaeStatus: "OTC",
    genericPriceAed: 6,
    genericPackSize: "20 tabs",
    brandedOptions: [
      { brand: "Dispirin 300 mg", packSize: "20 tabs", priceAed: 12 },
      { brand: "Aspirin Cardio 100 mg", packSize: "30 tabs", priceAed: 20 },
      { brand: "Ascard 75 mg (enteric)", packSize: "30 tabs", priceAed: 18 },
    ],
    note: "Low-dose (75–100 mg) cardioprotective forms OTC. Analgesic doses (300–600 mg) OTC.",
  },
  {
    id: "naproxen",
    genericName: "Naproxen",
    uaeStatus: "Rx",
    genericPriceAed: 18,
    genericPackSize: "20 tabs",
    brandedOptions: [
      { brand: "Naprosyn 250 mg", packSize: "20 tabs", priceAed: 30 },
      { brand: "Naprosyn 500 mg", packSize: "20 tabs", priceAed: 38 },
    ],
  },
  {
    id: "celecoxib",
    genericName: "Celecoxib",
    uaeStatus: "Rx",
    genericPriceAed: 35,
    genericPackSize: "20 caps",
    brandedOptions: [
      { brand: "Celebrex 200 mg", packSize: "20 caps", priceAed: 78 },
    ],
  },
  {
    id: "tramadol",
    genericName: "Tramadol",
    uaeStatus: "Controlled",
    genericPriceAed: null,
    genericPackSize: null,
    brandedOptions: [
      { brand: "Tramal 50 mg", packSize: "20 caps", priceAed: 38 },
      { brand: "Ultram 50 mg", packSize: "20 tabs", priceAed: 42 },
    ],
    note: "Schedule IV controlled substance in UAE (Cabinet Resolution 38/2014). Strictly Rx. Pharmacies must record dispensing.",
  },

  // ── Antihistamines / Decongestants ────────────────────────────────────────
  {
    id: "cetirizine",
    genericName: "Cetirizine",
    uaeStatus: "OTC",
    genericPriceAed: 10,
    genericPackSize: "10 tabs",
    brandedOptions: [
      { brand: "Zyrtec 10 mg", packSize: "10 tabs", priceAed: 25 },
      { brand: "Reactine 10 mg", packSize: "10 tabs", priceAed: 22 },
    ],
  },
  {
    id: "loratadine",
    genericName: "Loratadine",
    uaeStatus: "OTC",
    genericPriceAed: 9,
    genericPackSize: "10 tabs",
    brandedOptions: [
      { brand: "Claritin 10 mg", packSize: "10 tabs", priceAed: 24 },
      { brand: "Lorfast 10 mg", packSize: "10 tabs", priceAed: 18 },
    ],
  },
  {
    id: "chlorpheniramine",
    genericName: "Chlorpheniramine",
    uaeStatus: "OTC",
    genericPriceAed: 6,
    genericPackSize: "20 tabs",
    brandedOptions: [
      { brand: "Piriton 4 mg", packSize: "30 tabs", priceAed: 20 },
    ],
  },
  {
    id: "pseudoephedrine",
    genericName: "Pseudoephedrine",
    uaeStatus: "Pharmacist",
    genericPriceAed: null,
    genericPackSize: null,
    brandedOptions: [
      { brand: "Sudafed 60 mg", packSize: "12 tabs", priceAed: 28 },
    ],
    note: "Pharmacist supervision required. Log kept. Not sold to under-18. Cannot be purchased alongside other pseudoephedrine products.",
  },
  {
    id: "oxymetazoline",
    genericName: "Oxymetazoline",
    uaeStatus: "OTC",
    genericPriceAed: 12,
    genericPackSize: "15 ml spray",
    brandedOptions: [
      { brand: "Otrivin 0.1% adult spray", packSize: "10 ml", priceAed: 22 },
      { brand: "Afrin 0.05%", packSize: "15 ml", priceAed: 25 },
    ],
    note: "Max 3–5 days use to avoid rebound congestion.",
  },
  {
    id: "diphenhydramine",
    genericName: "Diphenhydramine",
    uaeStatus: "OTC",
    genericPriceAed: 10,
    genericPackSize: "10 tabs",
    brandedOptions: [
      { brand: "Benadryl 25 mg", packSize: "24 caps", priceAed: 28 },
    ],
  },
  {
    id: "cinnarizine",
    genericName: "Cinnarizine",
    uaeStatus: "OTC",
    genericPriceAed: 12,
    genericPackSize: "20 tabs",
    brandedOptions: [
      { brand: "Stugeron 25 mg", packSize: "15 tabs", priceAed: 24 },
    ],
  },

  // ── Cough / Cold ──────────────────────────────────────────────────────────
  {
    id: "dextromethorphan",
    genericName: "Dextromethorphan",
    uaeStatus: "OTC",
    genericPriceAed: null,
    genericPackSize: null,
    brandedOptions: [
      { brand: "Robitussin DM syrup", packSize: "100 ml", priceAed: 28 },
      { brand: "Delsym 30 mg/5 ml", packSize: "100 ml", priceAed: 32 },
    ],
  },
  {
    id: "guaifenesin",
    genericName: "Guaifenesin",
    uaeStatus: "OTC",
    genericPriceAed: null,
    genericPackSize: null,
    brandedOptions: [
      { brand: "Mucinex 600 mg", packSize: "20 tabs", priceAed: 45 },
      { brand: "Robitussin Chest syrup", packSize: "100 ml", priceAed: 26 },
    ],
  },
  {
    id: "ambroxol",
    genericName: "Ambroxol",
    uaeStatus: "OTC",
    genericPriceAed: 14,
    genericPackSize: "20 tabs / 100 ml",
    brandedOptions: [
      { brand: "Mucosolvan 30 mg tabs", packSize: "20 tabs", priceAed: 28 },
      { brand: "Mucosolvan syrup 15 mg/5 ml", packSize: "100 ml", priceAed: 25 },
    ],
  },

  // ── GI ────────────────────────────────────────────────────────────────────
  {
    id: "omeprazole",
    genericName: "Omeprazole",
    uaeStatus: "OTC",
    genericPriceAed: 15,
    genericPackSize: "14 caps",
    brandedOptions: [
      { brand: "Losec 20 mg", packSize: "14 caps", priceAed: 38 },
      { brand: "Prilosec OTC 20 mg", packSize: "14 tabs", priceAed: 35 },
    ],
    note: "OTC limited to 20 mg/day for max 14 days. Higher doses or longer use → Rx.",
  },
  {
    id: "antacids",
    genericName: "Antacids (Al/Mg hydroxide)",
    uaeStatus: "OTC",
    genericPriceAed: 8,
    genericPackSize: "20 tabs",
    brandedOptions: [
      { brand: "Gaviscon liquid", packSize: "150 ml", priceAed: 32 },
      { brand: "Maalox suspension", packSize: "250 ml", priceAed: 28 },
      { brand: "Rennie chewable tabs", packSize: "36 tabs", priceAed: 24 },
    ],
  },
  {
    id: "domperidone",
    genericName: "Domperidone",
    uaeStatus: "Rx",
    genericPriceAed: 18,
    genericPackSize: "30 tabs",
    brandedOptions: [
      { brand: "Motilium 10 mg", packSize: "30 tabs", priceAed: 32 },
    ],
    note: "Rx required in UAE since 2014 cardiac risk update.",
  },
  {
    id: "metoclopramide",
    genericName: "Metoclopramide",
    uaeStatus: "Rx",
    genericPriceAed: 14,
    genericPackSize: "20 tabs",
    brandedOptions: [
      { brand: "Maxolon 10 mg", packSize: "20 tabs", priceAed: 24 },
      { brand: "Primperan 10 mg", packSize: "30 tabs", priceAed: 28 },
    ],
  },
  {
    id: "loperamide",
    genericName: "Loperamide",
    uaeStatus: "OTC",
    genericPriceAed: 10,
    genericPackSize: "6 caps",
    brandedOptions: [
      { brand: "Imodium 2 mg", packSize: "6 caps", priceAed: 22 },
      { brand: "Lopex 2 mg", packSize: "10 caps", priceAed: 18 },
    ],
  },
  {
    id: "ors",
    genericName: "Oral Rehydration Salts",
    uaeStatus: "OTC",
    genericPriceAed: 5,
    genericPackSize: "Sachet (200 ml)",
    brandedOptions: [
      { brand: "Dioralyte sachets", packSize: "6 sachets", priceAed: 22 },
      { brand: "Rehydrat sachets", packSize: "6 sachets", priceAed: 18 },
      { brand: "Pedialyte liquid", packSize: "500 ml", priceAed: 30 },
    ],
  },
  {
    id: "lactulose",
    genericName: "Lactulose",
    uaeStatus: "OTC",
    genericPriceAed: 18,
    genericPackSize: "200 ml",
    brandedOptions: [
      { brand: "Duphalac 3.35 g/5 ml", packSize: "200 ml", priceAed: 36 },
      { brand: "Lactulose 667 mg/ml", packSize: "200 ml", priceAed: 22 },
    ],
  },
  {
    id: "bisacodyl",
    genericName: "Bisacodyl",
    uaeStatus: "OTC",
    genericPriceAed: 10,
    genericPackSize: "10 tabs",
    brandedOptions: [
      { brand: "Dulcolax 5 mg tabs", packSize: "10 tabs", priceAed: 22 },
      { brand: "Dulcolax 10 mg suppository", packSize: "6 supp", priceAed: 28 },
    ],
  },
  {
    id: "ondansetron",
    genericName: "Ondansetron",
    uaeStatus: "Rx",
    genericPriceAed: 22,
    genericPackSize: "10 tabs",
    brandedOptions: [
      { brand: "Zofran 4 mg", packSize: "10 tabs", priceAed: 48 },
      { brand: "Zofran 8 mg", packSize: "10 tabs", priceAed: 68 },
    ],
  },
  {
    id: "buscopan",
    genericName: "Hyoscine Butylbromide",
    uaeStatus: "OTC",
    genericPriceAed: 12,
    genericPackSize: "10 tabs",
    brandedOptions: [
      { brand: "Buscopan 10 mg", packSize: "20 tabs", priceAed: 30 },
      { brand: "Buscopan Compositum (+ paracetamol)", packSize: "20 tabs", priceAed: 34 },
    ],
  },

  // ── Topical / Skin ────────────────────────────────────────────────────────
  {
    id: "hydrocortisone_cream",
    genericName: "Hydrocortisone Cream 1%",
    uaeStatus: "OTC",
    genericPriceAed: 12,
    genericPackSize: "30 g",
    brandedOptions: [
      { brand: "Cortaid 1%", packSize: "30 g", priceAed: 28 },
      { brand: "HC45 1% cream", packSize: "15 g", priceAed: 22 },
    ],
    note: "OTC for short-term use (≤7 days). Stronger classes require Rx.",
  },
  {
    id: "calamine",
    genericName: "Calamine Lotion",
    uaeStatus: "OTC",
    genericPriceAed: 8,
    genericPackSize: "100 ml",
    brandedOptions: [
      { brand: "Lacto Calamine lotion", packSize: "120 ml", priceAed: 18 },
      { brand: "Calamine BP lotion", packSize: "100 ml", priceAed: 12 },
    ],
  },
  {
    id: "clotrimazole_topical",
    genericName: "Clotrimazole Topical",
    uaeStatus: "OTC",
    genericPriceAed: 14,
    genericPackSize: "20 g cream",
    brandedOptions: [
      { brand: "Canesten 1% cream", packSize: "20 g", priceAed: 28 },
      { brand: "Canesten vaginal pessary 500 mg", packSize: "1 pessary", priceAed: 38 },
    ],
  },
  {
    id: "terbinafine",
    genericName: "Terbinafine",
    uaeStatus: "OTC",
    genericPriceAed: 20,
    genericPackSize: "15 g cream",
    brandedOptions: [
      { brand: "Lamisil AT 1% cream", packSize: "15 g", priceAed: 45 },
      { brand: "Lamisil AT spray", packSize: "30 ml", priceAed: 55 },
    ],
    note: "Oral terbinafine requires Rx.",
  },
  {
    id: "nystatin",
    genericName: "Nystatin",
    uaeStatus: "Rx",
    genericPriceAed: 18,
    genericPackSize: "30 g cream / 30 ml susp",
    brandedOptions: [
      { brand: "Mycostatin cream", packSize: "30 g", priceAed: 28 },
      { brand: "Mycostatin oral suspension", packSize: "30 ml", priceAed: 32 },
    ],
  },
  {
    id: "mupirocin",
    genericName: "Mupirocin",
    uaeStatus: "Rx",
    genericPriceAed: 22,
    genericPackSize: "15 g",
    brandedOptions: [
      { brand: "Bactroban 2% ointment", packSize: "15 g", priceAed: 45 },
      { brand: "Bactroban nasal 2%", packSize: "3 g", priceAed: 38 },
    ],
  },
  {
    id: "fusidic_acid",
    genericName: "Fusidic Acid",
    uaeStatus: "Rx",
    genericPriceAed: 20,
    genericPackSize: "15 g",
    brandedOptions: [
      { brand: "Fucidin 2% cream", packSize: "15 g", priceAed: 36 },
      { brand: "Fucidin H (+ HC)", packSize: "30 g", priceAed: 42 },
    ],
  },
  {
    id: "benzoyl_peroxide",
    genericName: "Benzoyl Peroxide",
    uaeStatus: "OTC",
    genericPriceAed: 20,
    genericPackSize: "50 g",
    brandedOptions: [
      { brand: "PanOxyl 5% wash", packSize: "150 ml", priceAed: 55 },
      { brand: "Benzac AC 5% gel", packSize: "60 g", priceAed: 48 },
    ],
  },

  // ── Eye / Ear ─────────────────────────────────────────────────────────────
  {
    id: "sodium_cromoglicate_eye",
    genericName: "Sodium Cromoglicate Eye Drops 2%",
    uaeStatus: "OTC",
    genericPriceAed: 18,
    genericPackSize: "10 ml",
    brandedOptions: [
      { brand: "Opticrom 2%", packSize: "10 ml", priceAed: 35 },
      { brand: "Hay-Crom 2%", packSize: "13.5 ml", priceAed: 30 },
    ],
  },
  {
    id: "chloramphenicol_eye",
    genericName: "Chloramphenicol Eye Drops 0.5%",
    uaeStatus: "OTC",
    genericPriceAed: 18,
    genericPackSize: "10 ml",
    brandedOptions: [
      { brand: "Chloromycetin eye drops 0.5%", packSize: "10 ml", priceAed: 28 },
      { brand: "Golden Eye 0.5%", packSize: "10 ml", priceAed: 30 },
    ],
    note: "OTC for acute bacterial conjunctivitis in adults. Use within 28 days of opening.",
  },
  {
    id: "acetic_acid_ear",
    genericName: "Acetic Acid Ear Drops",
    uaeStatus: "OTC",
    genericPriceAed: 20,
    genericPackSize: "8 ml",
    brandedOptions: [
      { brand: "EarCalm 2% spray", packSize: "5 ml", priceAed: 38 },
      { brand: "VoSol HC ear drops", packSize: "10 ml", priceAed: 45 },
    ],
  },

  // ── Oral / Throat ─────────────────────────────────────────────────────────
  {
    id: "benzydamine",
    genericName: "Benzydamine",
    uaeStatus: "OTC",
    genericPriceAed: 18,
    genericPackSize: "200 ml mouthwash",
    brandedOptions: [
      { brand: "Difflam 0.15% mouthwash", packSize: "200 ml", priceAed: 38 },
      { brand: "Difflam spray", packSize: "30 ml", priceAed: 32 },
    ],
  },
  {
    id: "chlorhexidine_mouth",
    genericName: "Chlorhexidine Mouthwash",
    uaeStatus: "OTC",
    genericPriceAed: 14,
    genericPackSize: "300 ml",
    brandedOptions: [
      { brand: "Corsodyl 0.2%", packSize: "300 ml", priceAed: 32 },
      { brand: "Perio-Aid 0.12%", packSize: "150 ml", priceAed: 28 },
    ],
  },

  // ── Antibiotics ───────────────────────────────────────────────────────────
  {
    id: "amoxicillin",
    genericName: "Amoxicillin",
    uaeStatus: "Rx",
    genericPriceAed: 16,
    genericPackSize: "14 caps 500 mg",
    brandedOptions: [
      { brand: "Amoxil 500 mg", packSize: "14 caps", priceAed: 28 },
      { brand: "Amoxil 250 mg/5 ml susp", packSize: "100 ml", priceAed: 24 },
    ],
    note: "Strictly Rx in UAE. Antibiotic misuse enforcement increased since 2017.",
  },
  {
    id: "co_amoxiclav",
    genericName: "Co-amoxiclav (Amoxicillin/Clavulanate)",
    uaeStatus: "Rx",
    genericPriceAed: 38,
    genericPackSize: "14 tabs 625 mg",
    brandedOptions: [
      { brand: "Augmentin 625 mg", packSize: "14 tabs", priceAed: 75 },
      { brand: "Augmentin 1 g", packSize: "14 tabs", priceAed: 95 },
      { brand: "Augmentin 457 mg/5 ml susp", packSize: "70 ml", priceAed: 55 },
    ],
  },
  {
    id: "azithromycin",
    genericName: "Azithromycin",
    uaeStatus: "Rx",
    genericPriceAed: 28,
    genericPackSize: "3 tabs 500 mg",
    brandedOptions: [
      { brand: "Zithromax 500 mg", packSize: "3 tabs", priceAed: 55 },
      { brand: "Azithrocin 250 mg", packSize: "6 tabs", priceAed: 48 },
    ],
  },
  {
    id: "doxycycline",
    genericName: "Doxycycline",
    uaeStatus: "Rx",
    genericPriceAed: 22,
    genericPackSize: "14 caps 100 mg",
    brandedOptions: [
      { brand: "Vibramycin 100 mg", packSize: "8 caps", priceAed: 38 },
    ],
  },
  {
    id: "ciprofloxacin",
    genericName: "Ciprofloxacin",
    uaeStatus: "Rx",
    genericPriceAed: 24,
    genericPackSize: "10 tabs 500 mg",
    brandedOptions: [
      { brand: "Ciprobay 500 mg", packSize: "10 tabs", priceAed: 55 },
      { brand: "Ciproxin 500 mg", packSize: "10 tabs", priceAed: 58 },
    ],
  },
  {
    id: "nitrofurantoin",
    genericName: "Nitrofurantoin",
    uaeStatus: "Rx",
    genericPriceAed: 28,
    genericPackSize: "28 caps 100 mg MR",
    brandedOptions: [
      { brand: "Macrobid 100 mg MR", packSize: "14 caps", priceAed: 48 },
    ],
  },
  {
    id: "trimethoprim",
    genericName: "Trimethoprim",
    uaeStatus: "Rx",
    genericPriceAed: 16,
    genericPackSize: "14 tabs 200 mg",
    brandedOptions: [
      { brand: "Monotrim 200 mg", packSize: "14 tabs", priceAed: 28 },
    ],
  },
  {
    id: "metronidazole",
    genericName: "Metronidazole",
    uaeStatus: "Rx",
    genericPriceAed: 14,
    genericPackSize: "21 tabs 400 mg",
    brandedOptions: [
      { brand: "Flagyl 400 mg", packSize: "21 tabs", priceAed: 28 },
      { brand: "Flagyl 200 mg/5 ml susp", packSize: "100 ml", priceAed: 22 },
      { brand: "Zidoval 0.75% vaginal gel", packSize: "40 g", priceAed: 45 },
    ],
  },
  {
    id: "cefalexin",
    genericName: "Cefalexin (Cephalexin)",
    uaeStatus: "Rx",
    genericPriceAed: 22,
    genericPackSize: "20 caps 500 mg",
    brandedOptions: [
      { brand: "Keflex 500 mg", packSize: "20 caps", priceAed: 48 },
    ],
  },
  {
    id: "clarithromycin",
    genericName: "Clarithromycin",
    uaeStatus: "Rx",
    genericPriceAed: 32,
    genericPackSize: "14 tabs 500 mg",
    brandedOptions: [
      { brand: "Klacid 500 mg", packSize: "14 tabs", priceAed: 72 },
      { brand: "Klacid XL 500 mg", packSize: "14 tabs", priceAed: 80 },
    ],
  },
  {
    id: "fluconazole",
    genericName: "Fluconazole",
    uaeStatus: "OTC",
    genericPriceAed: 18,
    genericPackSize: "1 cap 150 mg",
    brandedOptions: [
      { brand: "Diflucan 150 mg", packSize: "1 cap", priceAed: 38 },
      { brand: "Flucoral 150 mg", packSize: "1 cap", priceAed: 28 },
    ],
    note: "Single 150 mg dose for vaginal candidiasis available OTC. Longer courses or systemic use → Rx.",
  },

  // ── Respiratory ───────────────────────────────────────────────────────────
  {
    id: "salbutamol",
    genericName: "Salbutamol (Albuterol)",
    uaeStatus: "Rx",
    genericPriceAed: 22,
    genericPackSize: "200 dose MDI",
    brandedOptions: [
      { brand: "Ventolin 100 mcg MDI", packSize: "200 doses", priceAed: 38 },
      { brand: "Ventolin 2 mg/5 ml syrup", packSize: "150 ml", priceAed: 28 },
    ],
    note: "Inhaler technically Rx in UAE but widely dispensed OTC at pharmacist discretion for known asthmatics.",
  },
  {
    id: "prednisolone",
    genericName: "Prednisolone",
    uaeStatus: "Rx",
    genericPriceAed: 14,
    genericPackSize: "30 tabs 5 mg",
    brandedOptions: [
      { brand: "Prednisolone 5 mg", packSize: "30 tabs", priceAed: 22 },
      { brand: "Predsol 5 mg", packSize: "28 tabs", priceAed: 28 },
    ],
  },
  {
    id: "beclometasone_inhaler",
    genericName: "Beclometasone Inhaled",
    uaeStatus: "Rx",
    genericPriceAed: 45,
    genericPackSize: "200 dose MDI",
    brandedOptions: [
      { brand: "Clenil Modulite 100 mcg", packSize: "200 doses", priceAed: 68 },
      { brand: "Becotide 200 mcg", packSize: "200 doses", priceAed: 72 },
    ],
  },
  {
    id: "montelukast",
    genericName: "Montelukast",
    uaeStatus: "Rx",
    genericPriceAed: 38,
    genericPackSize: "28 tabs 10 mg",
    brandedOptions: [
      { brand: "Singulair 10 mg", packSize: "28 tabs", priceAed: 95 },
      { brand: "Singulair Paeds 5 mg chewable", packSize: "28 tabs", priceAed: 85 },
    ],
  },
  {
    id: "tiotropium",
    genericName: "Tiotropium",
    uaeStatus: "Rx",
    genericPriceAed: null,
    genericPackSize: null,
    brandedOptions: [
      { brand: "Spiriva Respimat 2.5 mcg", packSize: "60 doses", priceAed: 165 },
      { brand: "Spiriva HandiHaler 18 mcg", packSize: "30 caps", priceAed: 148 },
    ],
  },

  // ── Musculoskeletal ───────────────────────────────────────────────────────
  {
    id: "thiocolchicoside",
    genericName: "Thiocolchicoside",
    uaeStatus: "Rx",
    genericPriceAed: 28,
    genericPackSize: "20 tabs 4 mg",
    brandedOptions: [
      { brand: "Muscoril 4 mg", packSize: "20 caps", priceAed: 48 },
    ],
  },
  {
    id: "colchicine",
    genericName: "Colchicine",
    uaeStatus: "Rx",
    genericPriceAed: 30,
    genericPackSize: "30 tabs 500 mcg",
    brandedOptions: [
      { brand: "Colchicine 500 mcg", packSize: "30 tabs", priceAed: 42 },
    ],
    note: "Low therapeutic index — dispensing pharmacist must confirm dose.",
  },
  {
    id: "allopurinol",
    genericName: "Allopurinol",
    uaeStatus: "Rx",
    genericPriceAed: 16,
    genericPackSize: "30 tabs 300 mg",
    brandedOptions: [
      { brand: "Zyloric 300 mg", packSize: "30 tabs", priceAed: 32 },
      { brand: "Allopurinol 100 mg", packSize: "30 tabs", priceAed: 14 },
    ],
  },

  // ── Neuro / Pain specialist ───────────────────────────────────────────────
  {
    id: "pregabalin",
    genericName: "Pregabalin",
    uaeStatus: "Controlled",
    genericPriceAed: null,
    genericPackSize: null,
    brandedOptions: [
      { brand: "Lyrica 75 mg", packSize: "14 caps", priceAed: 95 },
      { brand: "Lyrica 150 mg", packSize: "14 caps", priceAed: 125 },
    ],
    note: "Schedule IV controlled substance in UAE. Rx required. Quantity limits enforced.",
  },
  {
    id: "sumatriptan",
    genericName: "Sumatriptan",
    uaeStatus: "Rx",
    genericPriceAed: 55,
    genericPackSize: "2 tabs 50 mg",
    brandedOptions: [
      { brand: "Imigran 50 mg", packSize: "2 tabs", priceAed: 75 },
      { brand: "Imigran 100 mg", packSize: "2 tabs", priceAed: 88 },
    ],
  },
  {
    id: "levetiracetam",
    genericName: "Levetiracetam",
    uaeStatus: "Rx",
    genericPriceAed: 60,
    genericPackSize: "30 tabs 500 mg",
    brandedOptions: [
      { brand: "Keppra 500 mg", packSize: "30 tabs", priceAed: 145 },
      { brand: "Keppra 250 mg", packSize: "30 tabs", priceAed: 110 },
    ],
  },
  {
    id: "sodium_valproate",
    genericName: "Sodium Valproate",
    uaeStatus: "Rx",
    genericPriceAed: 32,
    genericPackSize: "30 tabs 500 mg",
    brandedOptions: [
      { brand: "Epilim 500 mg CR", packSize: "30 tabs", priceAed: 68 },
      { brand: "Epilim 200 mg/5 ml syrup", packSize: "300 ml", priceAed: 55 },
    ],
  },

  // ── Cardiovascular ────────────────────────────────────────────────────────
  {
    id: "amlodipine",
    genericName: "Amlodipine",
    uaeStatus: "Rx",
    genericPriceAed: 16,
    genericPackSize: "30 tabs 5 mg",
    brandedOptions: [
      { brand: "Norvasc 5 mg", packSize: "30 tabs", priceAed: 42 },
      { brand: "Norvasc 10 mg", packSize: "30 tabs", priceAed: 55 },
    ],
  },
  {
    id: "lisinopril",
    genericName: "Lisinopril",
    uaeStatus: "Rx",
    genericPriceAed: 14,
    genericPackSize: "30 tabs 10 mg",
    brandedOptions: [
      { brand: "Zestril 10 mg", packSize: "28 tabs", priceAed: 38 },
      { brand: "Zestril 20 mg", packSize: "28 tabs", priceAed: 48 },
    ],
  },
  {
    id: "losartan",
    genericName: "Losartan",
    uaeStatus: "Rx",
    genericPriceAed: 18,
    genericPackSize: "30 tabs 50 mg",
    brandedOptions: [
      { brand: "Cozaar 50 mg", packSize: "28 tabs", priceAed: 48 },
      { brand: "Cozaar 100 mg", packSize: "28 tabs", priceAed: 62 },
    ],
  },
  {
    id: "bisoprolol",
    genericName: "Bisoprolol",
    uaeStatus: "Rx",
    genericPriceAed: 14,
    genericPackSize: "30 tabs 5 mg",
    brandedOptions: [
      { brand: "Concor 5 mg", packSize: "30 tabs", priceAed: 38 },
      { brand: "Concor 2.5 mg", packSize: "30 tabs", priceAed: 30 },
    ],
  },
  {
    id: "indapamide",
    genericName: "Indapamide",
    uaeStatus: "Rx",
    genericPriceAed: 16,
    genericPackSize: "30 tabs 1.5 mg SR",
    brandedOptions: [
      { brand: "Natrilix SR 1.5 mg", packSize: "30 tabs", priceAed: 40 },
      { brand: "Natrilix 2.5 mg", packSize: "30 tabs", priceAed: 35 },
    ],
  },
  {
    id: "furosemide",
    genericName: "Furosemide",
    uaeStatus: "Rx",
    genericPriceAed: 10,
    genericPackSize: "30 tabs 40 mg",
    brandedOptions: [
      { brand: "Lasix 40 mg", packSize: "30 tabs", priceAed: 22 },
    ],
  },
  {
    id: "spironolactone",
    genericName: "Spironolactone",
    uaeStatus: "Rx",
    genericPriceAed: 18,
    genericPackSize: "30 tabs 25 mg",
    brandedOptions: [
      { brand: "Aldactone 25 mg", packSize: "30 tabs", priceAed: 35 },
      { brand: "Aldactone 100 mg", packSize: "30 tabs", priceAed: 55 },
    ],
  },
  {
    id: "apixaban",
    genericName: "Apixaban",
    uaeStatus: "Rx",
    genericPriceAed: null,
    genericPackSize: null,
    brandedOptions: [
      { brand: "Eliquis 2.5 mg", packSize: "60 tabs", priceAed: 185 },
      { brand: "Eliquis 5 mg", packSize: "60 tabs", priceAed: 225 },
    ],
  },
  {
    id: "digoxin",
    genericName: "Digoxin",
    uaeStatus: "Rx",
    genericPriceAed: 14,
    genericPackSize: "30 tabs 250 mcg",
    brandedOptions: [
      { brand: "Lanoxin 250 mcg", packSize: "30 tabs", priceAed: 28 },
    ],
    note: "Narrow therapeutic index. Dose requires renal adjustment.",
  },
  {
    id: "atorvastatin",
    genericName: "Atorvastatin",
    uaeStatus: "Rx",
    genericPriceAed: 20,
    genericPackSize: "30 tabs 20 mg",
    brandedOptions: [
      { brand: "Lipitor 20 mg", packSize: "30 tabs", priceAed: 55 },
      { brand: "Lipitor 40 mg", packSize: "30 tabs", priceAed: 72 },
      { brand: "Lipitor 80 mg", packSize: "30 tabs", priceAed: 88 },
    ],
  },

  // ── Diabetes ──────────────────────────────────────────────────────────────
  {
    id: "metformin",
    genericName: "Metformin",
    uaeStatus: "Rx",
    genericPriceAed: 12,
    genericPackSize: "30 tabs 500 mg",
    brandedOptions: [
      { brand: "Glucophage 500 mg", packSize: "30 tabs", priceAed: 22 },
      { brand: "Glucophage 1000 mg", packSize: "30 tabs", priceAed: 32 },
      { brand: "Glucophage XR 500 mg", packSize: "30 tabs", priceAed: 28 },
    ],
  },
  {
    id: "gliclazide",
    genericName: "Gliclazide",
    uaeStatus: "Rx",
    genericPriceAed: 14,
    genericPackSize: "30 tabs 80 mg",
    brandedOptions: [
      { brand: "Diamicron 80 mg", packSize: "30 tabs", priceAed: 32 },
      { brand: "Diamicron MR 30 mg", packSize: "28 tabs", priceAed: 38 },
      { brand: "Diamicron MR 60 mg", packSize: "28 tabs", priceAed: 48 },
    ],
  },
  {
    id: "sitagliptin",
    genericName: "Sitagliptin",
    uaeStatus: "Rx",
    genericPriceAed: null,
    genericPackSize: null,
    brandedOptions: [
      { brand: "Januvia 100 mg", packSize: "28 tabs", priceAed: 168 },
      { brand: "Janumet 50/500 mg", packSize: "28 tabs", priceAed: 175 },
    ],
  },

  // ── Mental Health ─────────────────────────────────────────────────────────
  {
    id: "sertraline",
    genericName: "Sertraline",
    uaeStatus: "Rx",
    genericPriceAed: 28,
    genericPackSize: "28 tabs 50 mg",
    brandedOptions: [
      { brand: "Zoloft 50 mg", packSize: "28 tabs", priceAed: 65 },
      { brand: "Zoloft 100 mg", packSize: "28 tabs", priceAed: 85 },
    ],
  },
  {
    id: "escitalopram",
    genericName: "Escitalopram",
    uaeStatus: "Rx",
    genericPriceAed: 32,
    genericPackSize: "28 tabs 10 mg",
    brandedOptions: [
      { brand: "Lexapro 10 mg", packSize: "28 tabs", priceAed: 78 },
      { brand: "Cipralex 20 mg", packSize: "28 tabs", priceAed: 95 },
    ],
  },

  // ── Thyroid ───────────────────────────────────────────────────────────────
  {
    id: "levothyroxine",
    genericName: "Levothyroxine",
    uaeStatus: "Rx",
    genericPriceAed: 18,
    genericPackSize: "30 tabs 50 mcg",
    brandedOptions: [
      { brand: "Eltroxin 50 mcg", packSize: "28 tabs", priceAed: 28 },
      { brand: "Eltroxin 100 mcg", packSize: "28 tabs", priceAed: 32 },
      { brand: "Synthroid 100 mcg", packSize: "30 tabs", priceAed: 45 },
    ],
    note: "Take 30–60 min before food. Brand switching not recommended — rebrand needs TSH recheck.",
  },
  {
    id: "carbimazole",
    genericName: "Carbimazole",
    uaeStatus: "Rx",
    genericPriceAed: 24,
    genericPackSize: "100 tabs 5 mg",
    brandedOptions: [
      { brand: "Neo-Mercazole 5 mg", packSize: "100 tabs", priceAed: 45 },
      { brand: "Neo-Mercazole 20 mg", packSize: "100 tabs", priceAed: 65 },
    ],
  },

  // ── Bone ─────────────────────────────────────────────────────────────────
  {
    id: "alendronate",
    genericName: "Alendronate",
    uaeStatus: "Rx",
    genericPriceAed: 22,
    genericPackSize: "4 tabs 70 mg",
    brandedOptions: [
      { brand: "Fosamax 70 mg", packSize: "4 tabs", priceAed: 48 },
      { brand: "Fosamax Plus D", packSize: "4 tabs", priceAed: 62 },
    ],
    note: "Take fasting with full glass of water. Sit/stand for 30 min after — oesophageal ulceration risk.",
  },
];

/** Look up UAE pricing by medication ID. Returns undefined if not in database. */
export function getUaePricing(medicationId: string): UaePricing | undefined {
  return UAE_PRICING.find((p) => p.id === medicationId);
}

export const STATUS_CONFIG: Record<UaeStatus, { label: string; color: string; bg: string; border: string }> = {
  OTC: {
    label: "OTC",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  Pharmacist: {
    label: "Pharmacist-only",
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  Rx: {
    label: "Prescription (Rx)",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  Controlled: {
    label: "Controlled Drug",
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
  },
};
