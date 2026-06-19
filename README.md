# RotorReady

Step-by-step implementation of the supplied three-page Advanced RPAS Flight Review Assessment form.

Branded for Volatus Aerospace using the official logo embedded in the supplied company flight-review guide.

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
- Offline filled-PDF generation using the original three-page assessment form
- Candidate and flight reviewer details, typed signatures, comments, and applicable failure reasons on the completed PDF
- Supplemental PDF pages for question-level reviewer notes
- Reviewer notes and locally saved progress
- Section navigation and live assessment summary

This is a training aid, not an official Transport Canada publication. Always use the current TP 15395, Canadian Aviation Regulations, aircraft documentation, and authorizations applicable to the operation.
