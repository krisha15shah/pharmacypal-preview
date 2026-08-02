import { ClipboardList } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SelectedDrug } from "@/components/medication-search";

/** internal rule-engine id → therapeutic class label + ATC group */
const CLASS_INFO: Record<string, { label: string; atc: string }> = {
  warfarin: { label: "Vitamin K antagonist", atc: "B01AA" },
  dabigatran_rivaroxaban: { label: "DOAC", atc: "B01AE/AF" },
  aspirin_cardio: { label: "Antiplatelet", atc: "B01AC06" },
  clopidogrel: { label: "Antiplatelet", atc: "B01AC" },
  ace_inhibitors: { label: "ACE inhibitor", atc: "C09A" },
  arbs: { label: "ARB", atc: "C09C" },
  beta_blockers: { label: "Beta blocker", atc: "C07" },
  calcium_channel_blockers: { label: "Calcium channel blocker", atc: "C08" },
  diuretics: { label: "Diuretic", atc: "C03" },
  metformin: { label: "Oral antidiabetic", atc: "A10B" },
  insulin: { label: "Insulin", atc: "A10A" },
  ssri: { label: "SSRI", atc: "N06AB" },
  snri: { label: "SNRI", atc: "N06AX" },
  maoi: { label: "MAOI", atc: "N06AF/AG" },
  tricyclics: { label: "Tricyclic antidepressant", atc: "N06AA" },
  corticosteroids: { label: "Corticosteroid", atc: "H02AB" },
  digoxin: { label: "Cardiac glycoside", atc: "C01AA05" },
  lithium: { label: "Mood stabiliser", atc: "N05AN01" },
  methotrexate: { label: "Antimetabolite / DMARD", atc: "L01BA01" },
  antiepileptics: { label: "Antiepileptic", atc: "N03A" },
  azole_antifungals: { label: "Azole antifungal", atc: "J02AC" },
  statins: { label: "Statin", atc: "C10AA" },
  omeprazole_ppi: { label: "Proton pump inhibitor", atc: "A02BC" },
  levothyroxine: { label: "Thyroid hormone", atc: "H03AA01" },
  levodopa: { label: "Anti-Parkinson", atc: "N04BA" },
  theophylline: { label: "Xanthine bronchodilator", atc: "R03DA04" },
  quinolone_antibiotics: { label: "Fluoroquinolone", atc: "J01MA" },
  nsaids: { label: "NSAID", atc: "M01A" },
  paracetamol: { label: "Analgesic / antipyretic", atc: "N02BE01" },
};

const NOISE = /\b(pill|tablet|tablets|capsule|capsules|oral|product|solution|injection|injectable|syrup|suspension|film|coated|extended|release|mg|ml|mcg|units?|\d+)\b/gi;

/** Best-effort active-ingredient extraction from an RxNav display name. */
function activeIngredient(name: string): string {
  const base = name.split(/[\[(]/)[0];
  const cleaned = base.replace(NOISE, " ").replace(/[\/,]+/g, " ").replace(/\s+/g, " ").trim();
  const out = cleaned || base.trim();
  return out.charAt(0).toUpperCase() + out.slice(1);
}

export default function MedicationReconciliation({ drugs }: { drugs: SelectedDrug[] }) {
  if (drugs.length === 0) return null;

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-2 pt-3 px-4">
        <CardTitle className="text-sm font-bold text-slate-700 flex items-center justify-between gap-2">
          <span className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-[#0B3D91]" />
            Medication Reconciliation
          </span>
          <Badge className="bg-slate-100 text-slate-600 border-slate-200 text-[10px] font-semibold shrink-0">
            {drugs.length} entr{drugs.length === 1 ? "y" : "ies"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 space-y-2">
        <p className="text-xs text-slate-400">
          Each medication as entered, resolved to its active ingredient and therapeutic class.
        </p>
        {drugs.map((d) => {
          const info = d.internalId ? CLASS_INFO[d.internalId] : undefined;
          return (
            <div
              key={d.rxcui + d.name}
              className="rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2"
            >
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <span className="text-sm font-semibold text-slate-800 break-words min-w-0">
                  {d.name}
                </span>
                {info ? (
                  <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-[10px] font-medium shrink-0 whitespace-nowrap">
                    {info.label} · {info.atc}
                  </Badge>
                ) : (
                  <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] font-medium shrink-0 whitespace-nowrap">
                    Unclassified
                  </Badge>
                )}
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-600 flex-wrap">
                <span className="text-slate-400">→</span>
                <span className="font-medium">{activeIngredient(d.name)}</span>
                {d.dose && <span className="text-slate-500">· {d.dose}</span>}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
