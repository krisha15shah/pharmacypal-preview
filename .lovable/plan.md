Reorder the right panel so the summary bar is always on top

Move the WHO EML guideline cards (the ADHD/Methylphenidate panel shown in the screenshot) so they sit **below** the recommendation summary bar and tabs instead of above it.

## What will change

1. In `src/pages/dashboard.tsx`, relocate the WHO EML therapy card block from its current position above the referral/summary sections to a new dedicated **Guidelines** tab inside the existing tabs component.
2. The new tab order will be:
   - Recommended
   - Caution
   - Avoid
   - Conditions
   - Guidelines (WHO EML / chapter fallback therapy cards)
   - Counseling
   - UAE Prices
3. Keep the summary bar (Recommended · Caution · Avoid · Interactions counts) and the emergency/referral banners exactly where they are, at the top of the results panel.
4. If no WHO EML guidance exists, the Guidelines tab will be disabled or empty with a short note, same as the other tabs.

## Why this fixes the issue

The ADHD card currently appears above the "Recommended / Caution / Avoid / Interactions" summary bar, so it feels disconnected from the main recommendation flow. Putting it in a tab keeps the summary bar as the first actionable result the pharmacist sees, and groups the guideline cards with the other reference content.

## Files to modify

- `src/pages/dashboard.tsx` — move the `whoTherapies.length > 0` block and add a `TabsTrigger` / `TabsContent` for "Guidelines".

## Not in scope

- No changes to the WHO EML therapy data or clinical logic.
- No new routes or backend changes.
- No changes to the left patient-input panel.

## Success check

After the change, selecting ADHD (F90) should show the summary bar at the top of the results panel, and the ADHD WHO EML therapy card should appear inside the "Guidelines" tab, not above the summary bar.
