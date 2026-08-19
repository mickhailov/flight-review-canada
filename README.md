# Flight Review Assistant

Step-by-step assistant for the Advanced RPAS Flight Review Assessment (Canada), based on Transport Canada sources.

Unbranded: it is a helper tool for flight reviewers, not the product of any training provider.

## Run

Open `index.html` directly, or serve the folder:

```sh
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Scope

- Candidate eligibility and document fields from page 1
- Every observation and suggested reviewer question from pages 1-3
- One field per step
- Contextual Pass, Minor, Major and Critical criteria for every question
- Transport Canada expected answers or performance evidence for all 54 assessment fields
- Pinpoint citations for all 54 fields, including the CAR article/subsection or TP 15395 Appendix A performance-criterion number
- Deep links to the exact Transport Canada guide section or Canadian Aviation Regulations article
- Interactive animated square, figure-eight and crosswind student demonstrations
- Expandable section navigation with direct access to every assessment question
- Collapsible mobile question drawer that closes automatically after selection
- Final review-and-sign step with reviewer details, typed signatures, comments and applicable failure reasons
- Handoff reminder to the official Transport Canada Drone Management Portal, with submission timing from TP 15395
- Locally saved progress (browser storage only — nothing is uploaded)

No PDF generation and no invoicing: the tool records and grades the review, you file the official report yourself.

This is a training aid, not an official Transport Canada publication. Always use the current TP 15395, Canadian Aviation Regulations, aircraft documentation, and authorizations applicable to the operation.
