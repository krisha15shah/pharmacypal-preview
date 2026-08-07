Safety-first dashboard panel

Build a **Patient Safety Check** panel on the dashboard that automatically flags selected medicines and the selected ICD condition against the patient profile (pregnancy, breastfeeding, renal impairment, hepatic impairment, age, BMI, and selected allergies). This turns the existing recommendation engine into a proactive safety screen.

## What it will do

1. Add a new **Safety Check** card/section on the dashboard, visible once a patient has medications, conditions, or age/weight entered.
2. Surface warnings such as:
   - Pregnancy / breastfeeding contraindicated drugs.
   - Renal dose adjustment needed for renally-cleared drugs.
   - Hepatic impairment cautions.
   - Paediatric / elderly Beers-list cautions.
   - Active drug-drug interactions beyond the current pairwise list.
   - Drug-allergy cross-sensitivity alerts (e.g., sulfa, beta-lactam).
3. Use color-coded severity badges (avoid / caution / monitor) and show a short pharmacist-facing action note for each flag.
4. Add a small **Safety score** summary line at the top: e.g., "2 avoid-level issues, 1 caution".
5. Keep all references in the existing data layer (`src/lib/clinical-data.ts` or `src/lib/clinical-engine.ts`) so the UI remains declarative.

## Files to modify

- `src/lib/clinical-data.ts` — add safety metadata to medication rules (pregnancy category, renal adjustment, hepatic caution, allergy cross-sensitivity tags).
- `src/lib/clinical-engine.ts` — add `runSafetyCheck()` that returns a list of safety findings from the patient profile + selected meds + conditions.
- `src/pages/dashboard.tsx` — add the Safety Check card next to the therapy/recommendation panels.

## Not in scope

- No new backend or database changes.
- No new pages or routes; this stays on the dashboard.
- No external API calls.

## Success check

After the change, selecting a pregnant patient with an ACE inhibitor or an NSAID should show a red "Avoid" flag, and the safety card should be readable without scrolling past the therapy list.
