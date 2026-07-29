/**
 * UAE Pharmacy Pricing Data
 * Source: UAE Ministry of Health and Prevention — Official Drug Price List, 24 Feb 2025
 * (Ministerial Decree No. 140/2013)
 *
 * Prices shown are the official Public Price (AED) — the maximum retail price
 * pharmacies may charge. Pharmacies may sell below this price.
 *
 * Dispensing Mode (SOR) mapping used:
 *   OTC-G / OTC-P  → "OTC"
 *   Pharmacy Only (P) / Ph-OM  → "Pharmacist"
 *   POM / SCD  → "Rx"
 *   CD / CD-Narcotic  → "Controlled"
 */

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
  /** Official public price for cheapest generic pack. null = generic not separately listed. */
  genericPriceAed: number | null;
  genericPackSize: string | null;
  brandedOptions: BrandedOption[];
  /** UAE-specific dispensing notes */
  note?: string;
}

export const UAE_PRICING: UaePricing[] = [

  // ── Analgesics / Antipyretics ─────────────────────────────────────────────
  {
    id: "paracetamol",
    genericName: "Paracetamol",
    uaeStatus: "OTC",
    genericPriceAed: 7,
    genericPackSize: "20 tabs 500 mg",
    brandedOptions: [
      { brand: "Adol 500 mg tabs", packSize: "20 tabs", priceAed: 7 },
      { brand: "Neomol 500 mg tabs", packSize: "20 tabs", priceAed: 7 },
      { brand: "Neomol 120 mg/5 ml syrup", packSize: "60 ml", priceAed: 3 },
      { brand: "Calpol 125 mg/5 ml paeds", packSize: "60 ml", priceAed: 9 },
    ],
    note: "Widely OTC. Price-regulated by MoHAP. Panadol branded products also available (price may vary).",
  },
  {
    id: "ibuprofen",
    genericName: "Ibuprofen",
    uaeStatus: "OTC",
    genericPriceAed: 3,
    genericPackSize: "10 tabs 200 mg",
    brandedOptions: [
      { brand: "Ibugesic 200 mg", packSize: "20 tabs", priceAed: 5 },
      { brand: "MP-Fen T 400 mg", packSize: "30 tabs", priceAed: 6.5 },
      { brand: "Spedifen 400 mg", packSize: "6 tabs", priceAed: 7 },
    ],
    note: "OTC up to 400 mg/dose; 600–800 mg doses require Rx (POM in MoHAP list).",
  },
  {
    id: "diclofenac",
    genericName: "Diclofenac",
    uaeStatus: "Rx",
    genericPriceAed: 7.5,
    genericPackSize: "20 tabs 25 mg",
    brandedOptions: [
      { brand: "Diclogesic 25 mg tabs", packSize: "20 tabs", priceAed: 7.5 },
      { brand: "Cataflam 50 mg tabs", packSize: "20 tabs", priceAed: 49 },
      { brand: "Rofenac 1% gel", packSize: "30 g tube", priceAed: 9 },
      { brand: "Rheumarene 1% gel", packSize: "20 g tube", priceAed: 6.5 },
    ],
    note: "Oral tablets are POM (Rx required). Topical 1% gel is Pharmacy-only (P).",
  },
  {
    id: "aspirin",
    genericName: "Aspirin (Acetylsalicylic Acid)",
    uaeStatus: "OTC",
    genericPriceAed: 2,
    genericPackSize: "30 tabs 75 mg",
    brandedOptions: [
      { brand: "Aspro Junior 75 mg", packSize: "30 tabs", priceAed: 2 },
    ],
    note: "Low-dose (75–100 mg) cardioprotective aspirin available OTC. Analgesic-dose (300–600 mg) products have limited MoHAP registered pricing; availability at pharmacy discretion.",
  },
  {
    id: "naproxen",
    genericName: "Naproxen",
    uaeStatus: "Rx",
    genericPriceAed: 5,
    genericPackSize: "10 tabs 250 mg",
    brandedOptions: [
      { brand: "Narox 250 mg", packSize: "10 tabs", priceAed: 5 },
      { brand: "Naprosyn 250 mg", packSize: "30 tabs", priceAed: 22 },
      { brand: "Movexen 500 mg", packSize: "20 tabs", priceAed: 17.5 },
    ],
  },
  {
    id: "celecoxib",
    genericName: "Celecoxib",
    uaeStatus: "Rx",
    genericPriceAed: 12.5,
    genericPackSize: "10 caps 200 mg",
    brandedOptions: [
      { brand: "Pedexa 200 mg", packSize: "10 caps", priceAed: 12.5 },
      { brand: "Celebrex 200 mg", packSize: "10 caps", priceAed: 27.5 },
    ],
  },
  {
    id: "tramadol",
    genericName: "Tramadol",
    uaeStatus: "Controlled",
    genericPriceAed: null,
    genericPackSize: null,
    brandedOptions: [
      { brand: "Tramal 50 mg caps", packSize: "10 caps", priceAed: 15.5 },
      { brand: "Zaldiar 37.5 mg/325 mg", packSize: "10 tabs", priceAed: 18.5 },
    ],
    note: "Schedule IV Controlled Drug (CD) — UAE Cabinet Resolution 38/2014. Strict Rx required; dispensing records mandatory. Not dispensed without prescription.",
  },

  // ── Antihistamines / Decongestants ────────────────────────────────────────
  {
    id: "cetirizine",
    genericName: "Cetirizine",
    uaeStatus: "OTC",
    genericPriceAed: 5,
    genericPackSize: "10 tabs 10 mg",
    brandedOptions: [
      { brand: "Antallos 5 mg", packSize: "10 tabs", priceAed: 5 },
      { brand: "Artiz 10 mg", packSize: "10 tabs", priceAed: 9 },
      { brand: "Zyrtec 10 mg", packSize: "10 tabs", priceAed: 25 },
    ],
    note: "OTC; generic versions significantly cheaper than Zyrtec.",
  },
  {
    id: "loratadine",
    genericName: "Loratadine",
    uaeStatus: "OTC",
    genericPriceAed: 7,
    genericPackSize: "10 tabs 10 mg",
    brandedOptions: [
      { brand: "Lorius 5 mg", packSize: "10 tabs", priceAed: 6.5 },
      { brand: "Allerid 10 mg", packSize: "10 tabs", priceAed: 8 },
      { brand: "Claritin 10 mg", packSize: "10 tabs", priceAed: 24 },
    ],
  },
  {
    id: "chlorpheniramine",
    genericName: "Chlorpheniramine",
    uaeStatus: "Pharmacist",
    genericPriceAed: 2.5,
    genericPackSize: "20 tabs 4 mg",
    brandedOptions: [
      { brand: "Alref 4 mg", packSize: "20 tabs", priceAed: 2.5 },
      { brand: "Piriton 4 mg", packSize: "30 tabs", priceAed: 20 },
    ],
    note: "Ph-OM (Pharmacist Only) in MoHAP classification.",
  },
  {
    id: "pseudoephedrine",
    genericName: "Pseudoephedrine",
    uaeStatus: "Pharmacist",
    genericPriceAed: null,
    genericPackSize: null,
    brandedOptions: [
      { brand: "Disophrol (chlorpheniramine/pseudoephedrine)", packSize: "8 tabs", priceAed: 5 },
    ],
    note: "Pharmacist log required. Cannot be sold alongside other pseudoephedrine products. Not dispensed to under-18.",
  },
  {
    id: "oxymetazoline",
    genericName: "Oxymetazoline",
    uaeStatus: "OTC",
    genericPriceAed: 4,
    genericPackSize: "10 ml dropper",
    brandedOptions: [
      { brand: "Oxazoline 0.05% drops", packSize: "10 ml", priceAed: 4 },
      { brand: "Afrin 0.05%", packSize: "30 ml spray", priceAed: 8.5 },
    ],
    note: "Max 3–5 days use. Rebound congestion risk.",
  },
  {
    id: "diphenhydramine",
    genericName: "Diphenhydramine",
    uaeStatus: "OTC",
    genericPriceAed: 10.5,
    genericPackSize: "10 tabs 50 mg",
    brandedOptions: [
      { brand: "Benocten 50 mg", packSize: "10 tabs", priceAed: 10.5 },
      { brand: "Benadryl 25 mg", packSize: "24 caps", priceAed: 28 },
    ],
  },
  {
    id: "cinnarizine",
    genericName: "Cinnarizine",
    uaeStatus: "OTC",
    genericPriceAed: 10.5,
    genericPackSize: "50 tabs 25 mg",
    brandedOptions: [
      { brand: "Stugeron 25 mg", packSize: "50 tabs", priceAed: 10.5 },
    ],
  },

  // ── Cough / Cold ──────────────────────────────────────────────────────────
  {
    id: "dextromethorphan",
    genericName: "Dextromethorphan",
    uaeStatus: "Rx",
    genericPriceAed: 5,
    genericPackSize: "100 ml syrup",
    brandedOptions: [
      { brand: "Protussa syrup (combination)", packSize: "120 ml", priceAed: 5 },
      { brand: "Coldex-D syrup", packSize: "100 ml", priceAed: 6 },
    ],
    note: "SCD (Semi Controlled Drug) — Rx required in UAE. Not available OTC.",
  },
  {
    id: "guaifenesin",
    genericName: "Guaifenesin",
    uaeStatus: "OTC",
    genericPriceAed: 5,
    genericPackSize: "100 ml syrup",
    brandedOptions: [
      { brand: "Guaphan 100 mg/5 ml syrup", packSize: "100 ml", priceAed: 5 },
      { brand: "Pectal Expectorant 100 mg/5 ml", packSize: "120 ml", priceAed: 6 },
    ],
  },
  {
    id: "ambroxol",
    genericName: "Ambroxol",
    uaeStatus: "OTC",
    genericPriceAed: 5,
    genericPackSize: "100 ml syrup 15 mg/5 ml",
    brandedOptions: [
      { brand: "Riabroxol 15 mg/5 ml syrup", packSize: "100 ml", priceAed: 5 },
      { brand: "Mucosolvan 15 mg/5 ml syrup", packSize: "100 ml", priceAed: 11.5 },
    ],
  },

  // ── GI ────────────────────────────────────────────────────────────────────
  {
    id: "omeprazole",
    genericName: "Omeprazole",
    uaeStatus: "Rx",
    genericPriceAed: 16.5,
    genericPackSize: "14 tabs 20 mg",
    brandedOptions: [
      { brand: "Pumpinox 20 mg", packSize: "14 tabs", priceAed: 16.5 },
      { brand: "Esolife 20 mg", packSize: "7 tabs", priceAed: 24.5 },
      { brand: "Gasec 40 mg", packSize: "14 caps", priceAed: 22.5 },
    ],
    note: "POM in UAE. All doses require a prescription. Inform patient to take 30 min before meals.",
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
    note: "Antacid combination products are OTC. MoHAP pricing varies widely by brand.",
  },
  {
    id: "domperidone",
    genericName: "Domperidone",
    uaeStatus: "Rx",
    genericPriceAed: 18,
    genericPackSize: "30 tabs 10 mg",
    brandedOptions: [
      { brand: "Motilium 10 mg", packSize: "30 tabs", priceAed: 32 },
    ],
    note: "Rx required in UAE since 2014 cardiac risk update (EMA restriction adopted).",
  },
  {
    id: "metoclopramide",
    genericName: "Metoclopramide",
    uaeStatus: "Rx",
    genericPriceAed: 14,
    genericPackSize: "20 tabs 10 mg",
    brandedOptions: [
      { brand: "Maxolon 10 mg", packSize: "20 tabs", priceAed: 24 },
      { brand: "Primperan 10 mg", packSize: "30 tabs", priceAed: 28 },
    ],
  },
  {
    id: "loperamide",
    genericName: "Loperamide",
    uaeStatus: "OTC",
    genericPriceAed: 5,
    genericPackSize: "10 caps 2 mg",
    brandedOptions: [
      { brand: "Lopodium 2 mg", packSize: "10 caps", priceAed: 5 },
      { brand: "Imodium 2 mg", packSize: "6 caps", priceAed: 6.5 },
    ],
  },
  {
    id: "ors",
    genericName: "Oral Rehydration Salts",
    uaeStatus: "OTC",
    genericPriceAed: 5,
    genericPackSize: "Sachet",
    brandedOptions: [
      { brand: "Dioralyte sachets", packSize: "6 sachets", priceAed: 22 },
      { brand: "Pedialyte liquid", packSize: "500 ml", priceAed: 30 },
    ],
    note: "Many generic ORS sachets available at pharmacies for ~5 AED/sachet.",
  },
  {
    id: "lactulose",
    genericName: "Lactulose",
    uaeStatus: "Pharmacist",
    genericPriceAed: 6,
    genericPackSize: "100 ml solution",
    brandedOptions: [
      { brand: "Lifulax 667 mg/ml", packSize: "100 ml", priceAed: 6 },
      { brand: "Sedalac 67% oral solution", packSize: "120 ml", priceAed: 6 },
      { brand: "Duphalac 3.35 g/5 ml", packSize: "200 ml", priceAed: 36 },
    ],
    note: "Pharmacy-only (P) classification. Generic brands significantly cheaper than Duphalac.",
  },
  {
    id: "bisacodyl",
    genericName: "Bisacodyl",
    uaeStatus: "OTC",
    genericPriceAed: 5,
    genericPackSize: "20 tabs 5 mg",
    brandedOptions: [
      { brand: "Laxocodyl 5 mg", packSize: "20 tabs", priceAed: 5 },
      { brand: "Dulcolax 5 mg", packSize: "30 tabs", priceAed: 9.5 },
    ],
  },
  {
    id: "ondansetron",
    genericName: "Ondansetron",
    uaeStatus: "Rx",
    genericPriceAed: 65.5,
    genericPackSize: "6 tabs 4 mg ODT",
    brandedOptions: [
      { brand: "Onda-Denk 4 mg ODT", packSize: "6 tabs", priceAed: 65.5 },
      { brand: "Ondanvitae 4 mg", packSize: "10 tabs", priceAed: 91 },
      { brand: "Zofran 4 mg", packSize: "10 tabs", priceAed: 108.5 },
    ],
    note: "POM. Prices are significantly higher than many other antiemetics.",
  },
  {
    id: "buscopan",
    genericName: "Hyoscine Butylbromide",
    uaeStatus: "Rx",
    genericPriceAed: 5.5,
    genericPackSize: "30 tabs 10 mg",
    brandedOptions: [
      { brand: "Buscostat 10 mg", packSize: "30 tabs", priceAed: 5.5 },
      { brand: "Riaspasm 10 mg", packSize: "20 tabs", priceAed: 7 },
    ],
  },

  // ── Topical / Skin ────────────────────────────────────────────────────────
  {
    id: "hydrocortisone_cream",
    genericName: "Hydrocortisone Cream 1%",
    uaeStatus: "Pharmacist",
    genericPriceAed: 4.5,
    genericPackSize: "10 g tube",
    brandedOptions: [
      { brand: "Cortiderm 1%", packSize: "10 g tube", priceAed: 4.5 },
      { brand: "Solucort 1%", packSize: "15 g tube", priceAed: 5.5 },
      { brand: "Derm-Aid 0.5%", packSize: "30 g tube", priceAed: 5.5 },
    ],
    note: "Ph-OM (Pharmacist Only) for short-term use ≤7 days. Stronger topical steroids require Rx.",
  },
  {
    id: "calamine",
    genericName: "Calamine Lotion",
    uaeStatus: "OTC",
    genericPriceAed: 8,
    genericPackSize: "100 ml",
    brandedOptions: [
      { brand: "Calamine BP lotion", packSize: "100 ml", priceAed: 12 },
      { brand: "Lacto Calamine lotion", packSize: "120 ml", priceAed: 18 },
    ],
  },
  {
    id: "clotrimazole_topical",
    genericName: "Clotrimazole Topical",
    uaeStatus: "OTC",
    genericPriceAed: 7.5,
    genericPackSize: "12 g cream 1%",
    brandedOptions: [
      { brand: "Dermatin 1% cream", packSize: "12 g", priceAed: 7.5 },
      { brand: "Opizole 1% cream", packSize: "20 g", priceAed: 9.5 },
      { brand: "Clotrim 500 mg vaginal pessary", packSize: "1 pessary", priceAed: 7 },
      { brand: "Canesten 1% cream", packSize: "20 g", priceAed: 28 },
    ],
    note: "Topical and vaginal formulations OTC. Generic creams significantly cheaper than Canesten.",
  },
  {
    id: "terbinafine",
    genericName: "Terbinafine",
    uaeStatus: "OTC",
    genericPriceAed: 15,
    genericPackSize: "15 g cream 1%",
    brandedOptions: [
      { brand: "Lamifen 1% cream", packSize: "15 g", priceAed: 15 },
      { brand: "Negafen 1% cream", packSize: "15 g", priceAed: 20.5 },
      { brand: "Lamisil AT 1% cream", packSize: "15 g", priceAed: 23 },
    ],
    note: "Topical is OTC. Oral terbinafine tablets require Rx.",
  },
  {
    id: "nystatin",
    genericName: "Nystatin",
    uaeStatus: "Rx",
    genericPriceAed: 6.5,
    genericPackSize: "15 g cream",
    brandedOptions: [
      { brand: "Mikostat 100,000 IU/g cream", packSize: "15 g", priceAed: 6.5 },
      { brand: "Mycosat 100,000 IU/ml oral susp", packSize: "30 ml", priceAed: 9.5 },
    ],
  },
  {
    id: "mupirocin",
    genericName: "Mupirocin",
    uaeStatus: "Rx",
    genericPriceAed: 11,
    genericPackSize: "15 g ointment 2%",
    brandedOptions: [
      { brand: "Sofracin 2% ointment", packSize: "15 g", priceAed: 11 },
      { brand: "Avoban 2% ointment", packSize: "15 g", priceAed: 12 },
      { brand: "Bactroban 2% ointment", packSize: "15 g", priceAed: 45 },
    ],
    note: "Generic mupirocin significantly cheaper than Bactroban.",
  },
  {
    id: "fusidic_acid",
    genericName: "Fusidic Acid",
    uaeStatus: "Rx",
    genericPriceAed: 8.5,
    genericPackSize: "15 g cream 2%",
    brandedOptions: [
      { brand: "Fusilox 2% cream", packSize: "15 g", priceAed: 8.5 },
      { brand: "Dermofucin 2% cream", packSize: "15 g", priceAed: 9 },
      { brand: "Fusiver 2% cream", packSize: "15 g", priceAed: 9 },
    ],
  },
  {
    id: "benzoyl_peroxide",
    genericName: "Benzoyl Peroxide",
    uaeStatus: "Pharmacist",
    genericPriceAed: 7.5,
    genericPackSize: "30 ml wash 5%",
    brandedOptions: [
      { brand: "PanOxyl 5% wash", packSize: "30 ml", priceAed: 7.5 },
      { brand: "Benoxyl 10%", packSize: "1 oz", priceAed: 13 },
      { brand: "Akneroxid 5 gel", packSize: "50 g tube", priceAed: 19 },
    ],
  },

  // ── Eye / Ear ─────────────────────────────────────────────────────────────
  {
    id: "sodium_cromoglicate_eye",
    genericName: "Sodium Cromoglicate Eye Drops 2%",
    uaeStatus: "Rx",
    genericPriceAed: 14.5,
    genericPackSize: "10 ml",
    brandedOptions: [
      { brand: "Apicrom 2%", packSize: "10 ml", priceAed: 14.5 },
      { brand: "Allergo-Comod 2%", packSize: "10 ml", priceAed: 43 },
    ],
    note: "POM in UAE MoHAP list.",
  },
  {
    id: "chloramphenicol_eye",
    genericName: "Chloramphenicol Eye Drops 0.5%",
    uaeStatus: "Rx",
    genericPriceAed: 5.5,
    genericPackSize: "10 ml",
    brandedOptions: [
      { brand: "Colircusi Chloramphenicol 0.5%", packSize: "10 ml", priceAed: 5.5 },
    ],
    note: "POM in UAE. Requires prescription — unlike UK where this is OTC.",
  },
  {
    id: "acetic_acid_ear",
    genericName: "Acetic Acid Ear Drops",
    uaeStatus: "OTC",
    genericPriceAed: 22,
    genericPackSize: "8 ml",
    brandedOptions: [
      { brand: "EarCalm 2% spray", packSize: "5 ml", priceAed: 38 },
    ],
    note: "Limited MoHAP registered products. Availability varies by pharmacy.",
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
    note: "Limited MoHAP fixed pricing; actual pharmacy price may differ.",
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
    note: "Limited MoHAP fixed pricing; price may vary.",
  },

  // ── Antibiotics ───────────────────────────────────────────────────────────
  {
    id: "amoxicillin",
    genericName: "Amoxicillin",
    uaeStatus: "Rx",
    genericPriceAed: 23.5,
    genericPackSize: "12 caps 500 mg",
    brandedOptions: [
      { brand: "Julphamox 500 mg caps", packSize: "12 caps", priceAed: 23.5 },
      { brand: "Ospamox 500 mg/5 ml susp", packSize: "100 ml", priceAed: 19 },
    ],
    note: "Strictly POM. Antibiotic dispensing enforcement strengthened across UAE since 2017.",
  },
  {
    id: "co_amoxiclav",
    genericName: "Co-amoxiclav (Amoxicillin/Clavulanate)",
    uaeStatus: "Rx",
    genericPriceAed: 33.5,
    genericPackSize: "20 tabs 625 mg",
    brandedOptions: [
      { brand: "Comoxlife 625 mg", packSize: "20 tabs", priceAed: 33.5 },
      { brand: "Enhancin 625 mg", packSize: "20 tabs", priceAed: 33.5 },
      { brand: "Augmentin 625 mg", packSize: "14 tabs", priceAed: 75 },
    ],
    note: "Generic co-amoxiclav ~50% cheaper than Augmentin.",
  },
  {
    id: "azithromycin",
    genericName: "Azithromycin",
    uaeStatus: "Rx",
    genericPriceAed: 9,
    genericPackSize: "3 tabs 500 mg",
    brandedOptions: [
      { brand: "Alzyl 500 mg", packSize: "3 tabs", priceAed: 9 },
      { brand: "Aze-Tos 500 mg", packSize: "3 tabs", priceAed: 21 },
      { brand: "Zithromax 500 mg", packSize: "3 tabs", priceAed: 55 },
    ],
    note: "Generic azithromycin significantly cheaper than Zithromax.",
  },
  {
    id: "doxycycline",
    genericName: "Doxycycline",
    uaeStatus: "Rx",
    genericPriceAed: 11,
    genericPackSize: "8 caps 100 mg",
    brandedOptions: [
      { brand: "Doxydar 100 mg", packSize: "8 caps", priceAed: 11 },
      { brand: "Unidox 100 mg", packSize: "10 caps", priceAed: 14 },
    ],
  },
  {
    id: "ciprofloxacin",
    genericName: "Ciprofloxacin",
    uaeStatus: "Rx",
    genericPriceAed: 31,
    genericPackSize: "10 tabs 500 mg",
    brandedOptions: [
      { brand: "Recipro 500 mg", packSize: "10 tabs", priceAed: 31 },
      { brand: "Ciproquin 500 mg", packSize: "10 tabs", priceAed: 33 },
      { brand: "Ciprobay 500 mg", packSize: "10 tabs", priceAed: 55 },
    ],
  },
  {
    id: "nitrofurantoin",
    genericName: "Nitrofurantoin",
    uaeStatus: "Rx",
    genericPriceAed: 10,
    genericPackSize: "28 caps 100 mg MR",
    brandedOptions: [
      { brand: "Urinext 100 mg MR", packSize: "28 caps", priceAed: 10 },
      { brand: "Uvamin Retard 100 mg", packSize: "20 caps", priceAed: 14.5 },
    ],
  },
  {
    id: "trimethoprim",
    genericName: "Trimethoprim",
    uaeStatus: "Rx",
    genericPriceAed: 31,
    genericPackSize: "10 tabs (as co-trimoxazole 800/160 mg)",
    brandedOptions: [
      { brand: "Lidaprim Forte (co-trimoxazole)", packSize: "10 tabs", priceAed: 31 },
    ],
    note: "Trimethoprim alone rarely available as standalone in UAE — typically dispensed as co-trimoxazole (sulfamethoxazole/trimethoprim). Rx required.",
  },
  {
    id: "metronidazole",
    genericName: "Metronidazole",
    uaeStatus: "Rx",
    genericPriceAed: 4.5,
    genericPackSize: "20 tabs 250 mg",
    brandedOptions: [
      { brand: "Metrozole 250 mg", packSize: "20 tabs", priceAed: 4.5 },
      { brand: "Riazole 250 mg", packSize: "20 tabs", priceAed: 6 },
      { brand: "Flagyl 400 mg", packSize: "21 tabs", priceAed: 28 },
    ],
    note: "Counsel: avoid alcohol during treatment and for 48 h after. No generic-branded price difference for basic tablets.",
  },
  {
    id: "cefalexin",
    genericName: "Cefalexin (Cephalexin)",
    uaeStatus: "Rx",
    genericPriceAed: 10.5,
    genericPackSize: "10 caps 500 mg",
    brandedOptions: [
      { brand: "Cephalexin 500 mg caps", packSize: "10 caps", priceAed: 10.5 },
      { brand: "Lexin 250 mg caps", packSize: "20 caps", priceAed: 12 },
    ],
  },
  {
    id: "clarithromycin",
    genericName: "Clarithromycin",
    uaeStatus: "Rx",
    genericPriceAed: 19,
    genericPackSize: "7 tabs 500 mg XL",
    brandedOptions: [
      { brand: "Claridar XL 500 mg", packSize: "7 tabs", priceAed: 19 },
      { brand: "Dynaclar MR 500 mg", packSize: "7 tabs", priceAed: 28.5 },
      { brand: "Klacid 500 mg", packSize: "14 tabs", priceAed: 72 },
    ],
    note: "Generic clarithromycin >70% cheaper than Klacid.",
  },
  {
    id: "fluconazole",
    genericName: "Fluconazole",
    uaeStatus: "Rx",
    genericPriceAed: 15.5,
    genericPackSize: "1 cap 150 mg",
    brandedOptions: [
      { brand: "Flunixir 150 mg", packSize: "1 cap", priceAed: 15.5 },
      { brand: "Treflucan 150 mg", packSize: "1 cap", priceAed: 15.5 },
      { brand: "Candivast 150 mg", packSize: "1 cap", priceAed: 20.5 },
      { brand: "Diflucan 150 mg", packSize: "1 cap", priceAed: 38 },
    ],
    note: "POM in UAE — Rx required for all doses and indications.",
  },

  // ── Respiratory ───────────────────────────────────────────────────────────
  {
    id: "salbutamol",
    genericName: "Salbutamol (Albuterol)",
    uaeStatus: "Rx",
    genericPriceAed: 6,
    genericPackSize: "200 dose MDI 100 mcg",
    brandedOptions: [
      { brand: "Azmasol HFA 100 mcg MDI", packSize: "200 doses", priceAed: 6 },
      { brand: "Rescuwave 100 mcg MDI", packSize: "200 doses", priceAed: 6 },
      { brand: "Ventolin 100 mcg/dose MDI", packSize: "200 doses", priceAed: 15.5 },
    ],
    note: "POM. Generic salbutamol inhalers 60% cheaper than Ventolin.",
  },
  {
    id: "prednisolone",
    genericName: "Prednisolone",
    uaeStatus: "Rx",
    genericPriceAed: 6,
    genericPackSize: "30 tabs 5 mg",
    brandedOptions: [
      { brand: "Predo 5 mg", packSize: "30 tabs", priceAed: 6 },
      { brand: "Gupisone 5 mg", packSize: "20 tabs", priceAed: 8.5 },
      { brand: "Isolone 5 mg", packSize: "30 tabs", priceAed: 12 },
    ],
  },
  {
    id: "beclometasone_inhaler",
    genericName: "Beclometasone Inhaled",
    uaeStatus: "Rx",
    genericPriceAed: 16.5,
    genericPackSize: "200 dose MDI 50 mcg",
    brandedOptions: [
      { brand: "Besocare 50 mcg MDI", packSize: "200 doses", priceAed: 16.5 },
      { brand: "Beclazone 50 mcg CFC-free MDI", packSize: "200 doses", priceAed: 20.5 },
      { brand: "Clenil Modulite 100 mcg", packSize: "200 doses", priceAed: 68 },
    ],
  },
  {
    id: "montelukast",
    genericName: "Montelukast",
    uaeStatus: "Rx",
    genericPriceAed: 52,
    genericPackSize: "20 tabs 10 mg",
    brandedOptions: [
      { brand: "Brekast 10 mg", packSize: "20 tabs", priceAed: 52 },
      { brand: "Broncast 10 mg", packSize: "28 tabs", priceAed: 52 },
      { brand: "Singulair 10 mg", packSize: "28 tabs", priceAed: 95 },
    ],
    note: "Generic montelukast ~45% cheaper than Singulair.",
  },
  {
    id: "tiotropium",
    genericName: "Tiotropium",
    uaeStatus: "Rx",
    genericPriceAed: 112,
    genericPackSize: "30 caps 18 mcg + inhaler device",
    brandedOptions: [
      { brand: "Tiogiva 18 mcg HandiHaler", packSize: "30 caps + device", priceAed: 112 },
      { brand: "Tioresp 10 mcg Respimat", packSize: "30 doses + device", priceAed: 113 },
      { brand: "Spiriva Respimat 2.5 mcg", packSize: "60 doses", priceAed: 165 },
    ],
  },

  // ── Musculoskeletal ───────────────────────────────────────────────────────
  {
    id: "thiocolchicoside",
    genericName: "Thiocolchicoside",
    uaeStatus: "Rx",
    genericPriceAed: 28,
    genericPackSize: "20 caps 4 mg",
    brandedOptions: [
      { brand: "Muscoril 4 mg caps", packSize: "20 caps", priceAed: 48 },
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
    note: "Narrow therapeutic index. Low-dose preferred. Dispensing pharmacist must confirm dose regimen.",
  },
  {
    id: "allopurinol",
    genericName: "Allopurinol",
    uaeStatus: "Rx",
    genericPriceAed: 16,
    genericPackSize: "30 tabs 300 mg",
    brandedOptions: [
      { brand: "Zyloric 300 mg", packSize: "30 tabs", priceAed: 32 },
      { brand: "Allopurinol 100 mg tabs", packSize: "30 tabs", priceAed: 14 },
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
    note: "Schedule IV Controlled Drug — Rx required, quantity limits enforced.",
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
    note: "Generic levetiracetam significantly cheaper than Keppra.",
  },
  {
    id: "sodium_valproate",
    genericName: "Sodium Valproate",
    uaeStatus: "Rx",
    genericPriceAed: 32,
    genericPackSize: "30 tabs 500 mg CR",
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
    genericPriceAed: 27.5,
    genericPackSize: "30 tabs 5 mg",
    brandedOptions: [
      { brand: "Amlocard 5 mg", packSize: "30 tabs", priceAed: 27.5 },
      { brand: "Kardam 5 mg", packSize: "30 tabs", priceAed: 28 },
      { brand: "Norvasc 5 mg", packSize: "30 tabs", priceAed: 42 },
    ],
  },
  {
    id: "lisinopril",
    genericName: "Lisinopril",
    uaeStatus: "Rx",
    genericPriceAed: 11.5,
    genericPackSize: "28 tabs 5 mg",
    brandedOptions: [
      { brand: "Lopace 5 mg", packSize: "28 tabs", priceAed: 11.5 },
      { brand: "Omace 5 mg", packSize: "28 tabs", priceAed: 11.5 },
      { brand: "Zestril 10 mg", packSize: "28 tabs", priceAed: 38 },
    ],
  },
  {
    id: "losartan",
    genericName: "Losartan",
    uaeStatus: "Rx",
    genericPriceAed: 17.5,
    genericPackSize: "28 tabs 25 mg",
    brandedOptions: [
      { brand: "Locardia 25 mg", packSize: "28 tabs", priceAed: 17.5 },
      { brand: "Losart 50 mg", packSize: "30 tabs", priceAed: 35 },
      { brand: "Cozaar 50 mg", packSize: "28 tabs", priceAed: 48 },
    ],
  },
  {
    id: "bisoprolol",
    genericName: "Bisoprolol",
    uaeStatus: "Rx",
    genericPriceAed: 8.5,
    genericPackSize: "28 tabs 2.5 mg",
    brandedOptions: [
      { brand: "Bisopronor 2.5 mg", packSize: "28 tabs", priceAed: 8.5 },
      { brand: "Concolife 2.5 mg", packSize: "28 tabs", priceAed: 8.5 },
      { brand: "Concor 5 mg", packSize: "30 tabs", priceAed: 38 },
    ],
    note: "Generic bisoprolol significantly cheaper than Concor.",
  },
  {
    id: "indapamide",
    genericName: "Indapamide",
    uaeStatus: "Rx",
    genericPriceAed: 19,
    genericPackSize: "30 tabs 1.5 mg SR",
    brandedOptions: [
      { brand: "Swilix SR 1.5 mg", packSize: "30 tabs", priceAed: 19 },
      { brand: "Pharmalix SR 1.5 mg", packSize: "30 tabs", priceAed: 22.5 },
      { brand: "Natrilix SR 1.5 mg", packSize: "30 tabs", priceAed: 38 },
    ],
  },
  {
    id: "furosemide",
    genericName: "Furosemide",
    uaeStatus: "Rx",
    genericPriceAed: 3.5,
    genericPackSize: "12 tabs 40 mg",
    brandedOptions: [
      { brand: "Diusemide 40 mg", packSize: "12 tabs", priceAed: 3.5 },
      { brand: "Fusix 40 mg", packSize: "20 tabs", priceAed: 8 },
      { brand: "Lasix 40 mg", packSize: "30 tabs", priceAed: 22 },
    ],
  },
  {
    id: "spironolactone",
    genericName: "Spironolactone",
    uaeStatus: "Rx",
    genericPriceAed: 7.5,
    genericPackSize: "20 tabs 25 mg",
    brandedOptions: [
      { brand: "Spidac 25 mg", packSize: "20 tabs", priceAed: 7.5 },
      { brand: "Noractone 25 mg", packSize: "30 tabs", priceAed: 8 },
      { brand: "Aldactone 25 mg", packSize: "30 tabs", priceAed: 35 },
    ],
  },
  {
    id: "apixaban",
    genericName: "Apixaban",
    uaeStatus: "Rx",
    genericPriceAed: null,
    genericPackSize: null,
    brandedOptions: [
      { brand: "Eliquis 2.5 mg", packSize: "60 tabs", priceAed: 520 },
    ],
    note: "Only brand-name Eliquis registered in MoHAP list. No generic available in UAE as of Feb 2025.",
  },
  {
    id: "digoxin",
    genericName: "Digoxin",
    uaeStatus: "Rx",
    genericPriceAed: 13,
    genericPackSize: "100 tabs 250 mcg",
    brandedOptions: [
      { brand: "Lanoxin 0.25 mg", packSize: "100 tabs", priceAed: 13 },
      { brand: "Lanoxin PG 62.5 mcg", packSize: "90 tabs", priceAed: 14 },
    ],
    note: "Narrow therapeutic index. Dose requires renal function adjustment.",
  },
  {
    id: "atorvastatin",
    genericName: "Atorvastatin",
    uaeStatus: "Rx",
    genericPriceAed: 26,
    genericPackSize: "30 tabs 10 mg",
    brandedOptions: [
      { brand: "Storvas 10 mg", packSize: "30 tabs", priceAed: 26 },
      { brand: "Atorloc 20 mg", packSize: "30 tabs", priceAed: 34.5 },
      { brand: "Lipitor 20 mg", packSize: "30 tabs", priceAed: 55 },
    ],
    note: "Generic atorvastatin ~50% cheaper than Lipitor.",
  },

  // ── Diabetes ──────────────────────────────────────────────────────────────
  {
    id: "metformin",
    genericName: "Metformin",
    uaeStatus: "Rx",
    genericPriceAed: 3.5,
    genericPackSize: "20 tabs 500 mg",
    brandedOptions: [
      { brand: "Omformin 500 mg", packSize: "20 tabs", priceAed: 3.5 },
      { brand: "Glucophage 500 mg", packSize: "50 tabs", priceAed: 14 },
      { brand: "Glucophage 1000 mg", packSize: "30 tabs", priceAed: 19 },
    ],
    note: "Generic metformin very affordable. Glucophage is the reference brand.",
  },
  {
    id: "gliclazide",
    genericName: "Gliclazide",
    uaeStatus: "Rx",
    genericPriceAed: 13,
    genericPackSize: "20 tabs 80 mg",
    brandedOptions: [
      { brand: "Emicron 80 mg", packSize: "20 tabs", priceAed: 13 },
      { brand: "Glaze 80 mg", packSize: "20 tabs", priceAed: 13.5 },
      { brand: "Diamicron MR 30 mg", packSize: "28 tabs", priceAed: 38 },
    ],
  },
  {
    id: "sitagliptin",
    genericName: "Sitagliptin",
    uaeStatus: "Rx",
    genericPriceAed: 58.5,
    genericPackSize: "30 tabs 100 mg",
    brandedOptions: [
      { brand: "Diasit 100 mg", packSize: "30 tabs", priceAed: 58.5 },
      { brand: "Maysiglu 100 mg", packSize: "28 tabs", priceAed: 74.5 },
      { brand: "Januvia 100 mg", packSize: "28 tabs", priceAed: 168 },
    ],
    note: "Generic sitagliptin ~65% cheaper than Januvia.",
  },

  // ── Mental Health ─────────────────────────────────────────────────────────
  {
    id: "sertraline",
    genericName: "Sertraline",
    uaeStatus: "Rx",
    genericPriceAed: 16.5,
    genericPackSize: "10 tabs 50 mg",
    brandedOptions: [
      { brand: "Sertle 50 mg", packSize: "10 tabs", priceAed: 16.5 },
      { brand: "Setral 50 mg", packSize: "10 tabs", priceAed: 31 },
      { brand: "Zoloft 50 mg", packSize: "28 tabs", priceAed: 65 },
    ],
    note: "SCD (Semi Controlled Drug) — Rx required. Generic sertraline significantly cheaper than Zoloft.",
  },
  {
    id: "escitalopram",
    genericName: "Escitalopram",
    uaeStatus: "Rx",
    genericPriceAed: 15,
    genericPackSize: "10 tabs 10 mg",
    brandedOptions: [
      { brand: "Asitalox 10 mg", packSize: "10 tabs", priceAed: 15 },
      { brand: "Esiplex 10 mg", packSize: "28 tabs", priceAed: 29 },
      { brand: "Cipralex 10 mg", packSize: "28 tabs", priceAed: 142 },
    ],
    note: "SCD — Rx required. Generic escitalopram ~90% cheaper than Cipralex.",
  },

  // ── Thyroid ───────────────────────────────────────────────────────────────
  {
    id: "levothyroxine",
    genericName: "Levothyroxine",
    uaeStatus: "Rx",
    genericPriceAed: 11.5,
    genericPackSize: "100 tabs 100 mcg",
    brandedOptions: [
      { brand: "Levotiron 100 mcg", packSize: "100 tabs", priceAed: 11.5 },
      { brand: "Eltroxin 100 mcg", packSize: "100 tabs", priceAed: 22.5 },
      { brand: "Euthyrox 100 mcg", packSize: "100 tabs", priceAed: 29.5 },
    ],
    note: "Take 30–60 min before food. Brand switching not recommended — requires TSH recheck after any change.",
  },
  {
    id: "carbimazole",
    genericName: "Carbimazole",
    uaeStatus: "Rx",
    genericPriceAed: 10.5,
    genericPackSize: "100 tabs 5 mg",
    brandedOptions: [
      { brand: "Akthyod 5 mg", packSize: "100 tabs", priceAed: 10.5 },
      { brand: "Antithyrox 5 mg", packSize: "100 tabs", priceAed: 12.5 },
      { brand: "Neo-Mercazole 5 mg", packSize: "100 tabs", priceAed: 21 },
    ],
  },

  // ── Bone ─────────────────────────────────────────────────────────────────
  {
    id: "alendronate",
    genericName: "Alendronate",
    uaeStatus: "Rx",
    genericPriceAed: 40,
    genericPackSize: "4 tabs 70 mg (with Vit D)",
    brandedOptions: [
      { brand: "Aclonia 70 mg/5,600 IU", packSize: "4 tabs", priceAed: 40 },
      { brand: "Alenqore 70 mg", packSize: "4 tabs", priceAed: 66.5 },
      { brand: "Fosamax 70 mg", packSize: "4 tabs", priceAed: 48 },
    ],
    note: "Take fasting with full glass of water; sit/stand 30 min after — oesophageal ulceration risk.",
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
