# Metrics

## North Star metric

**Audits completed per week**

Why: An audit completed means a user entered their real data, saw real recommendations, and got value. It's the moment value is delivered. Everything else (email captures, shares, Credex consultations) is downstream of this. DAU is wrong for a tool people use once a quarter. Revenue is too lagging for early stage. Audits completed is the right leading indicator.

## Three input metrics

**1. Landing page → audit started conversion rate**
Target: >30%. If below 20%, the CTA or value proposition isn't landing. This is a copy and design problem.

**2. Audit started → audit completed rate**
Target: >70%. If below 60%, the form has too much friction. Likely step 2 (adding tools) is causing drop-off. Fix: reduce required fields or add suggested defaults.

**3. Audit completed → email captured rate**
Target: >20%. This measures whether users found enough value to want to save the report. Low rate means the recommendations aren't surprising or useful enough.

## What to instrument first

1. Page views on landing, /audit, /results/:slug — basic funnel visibility
2. Form step completion — which step do users abandon at
3. Audit completion event — with total spend and savings amount
4. Email capture event — conversion milestone
5. Share button clicks — viral coefficient input
6. Credex CTA clicks — revenue funnel entry

All of these can be instrumented with a single Plausible or PostHog instance in one afternoon.

## Pivot trigger

If audit completed → Credex consultation booked rate stays below 0.5% after 500 audits, the tool is generating value for users but not for Credex. At that point: either the savings threshold for showing the Credex CTA is wrong (lower it from $500 to $200), or the consultation CTA copy needs rewriting, or the Credex product-market fit with this audience needs reassessment.

The number that triggers a pivot: 500 audits with fewer than 2 Credex consultations booked.
