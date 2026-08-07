# Split the recommendations into two side-by-side columns: Rx and OTC

Instead of stacking the WHO EML guideline card above (or below) the recommendation summary, the results panel will show two columns next to each other:

```text
┌──────────────────────────┬──────────────────────────┐
│  OTC / pharmacy-only     │  Prescription (Rx)       │
│  ─────────────────────   │  ─────────────────────   │
│  paracetamol             │  methylphenidate         │
│  ibuprofen               │  atomoxetine             │
│  ...                     │  ...                     │
└──────────────────────────┴──────────────────────────┘
```

## What will change

1. **New split view on the dashboard results panel** (`src/pages/dashboard.tsx`): a two-column grid where the left column lists everything the pharmacist can hand over without a prescription, and the right column lists everything that needs a doctor's prescription.
2. **Both sources feed the split.** Each medicine card is routed to a column by its dispensing status:
   - `OTC` → OTC column
   - `Rx` and `Rx / specialist` → Prescription column
   The WHO EML guideline options already carry this `rx` field, so no clinical data changes are needed.
3. **Column headers with counts** — e.g. "OTC (3)" in green, "Prescription (4)" in blue — plus the existing per-drug detail (class, adult dose, paediatric dose, patient-specific calculated dose, safety flags, notes).
4. **Empty-column state** — if a condition has no OTC option, that column shows a short line such as "No over-the-counter option for this condition — prescription therapy is required."
5. **Summary bar stays at the top** of the results panel (Recommended · Caution · Avoid · Interactions), directly above the split columns.
6. **Responsive**: on narrow screens the two columns stack (OTC first), so nothing is cut off on smaller windows.
7. The condition header (e.g. "ADHD — WHO EML 22 · NICE NG87") sits above the two columns, and the referral note stays below them.

## Files to modify

- `src/pages/dashboard.tsx` — restructure the WHO EML therapy block into a two-column grid, extract the per-option card into a small local component reused by both columns.

## Not in scope

- No changes to clinical rules, WHO EML data, or dosing logic.
- The existing Recommended / Caution / Avoid / Conditions / Counseling / UAE Prices tabs stay as they are.

## Success check

Selecting ADHD (F90) shows the ADHD header, then two side-by-side columns: prescription stimulants and non-stimulants on the Rx side, and the OTC side showing its empty-state note. Selecting a condition like tension headache shows paracetamol/ibuprofen on the OTC side and prescription options on the Rx side.
