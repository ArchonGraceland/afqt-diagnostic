# AFQT Diagnostic Tool — Project Specs

## Overview
A web-based 40-question diagnostic tool that estimates a user's Armed Forces Qualification Test (AFQT) percentile score based on the four ASVAB subtests used in the official AFQT formula. Target user: 17-year-old male considering military enlistment.

**Live URL:** https://afqt-diagnostic.vercel.app/  
**Repo:** https://github.com/ArchonGraceland/afqt-diagnostic  
**Stack:** React + Vite, deployed on Vercel  

---

## Architecture

### Scoring Formula
- **AFQT = 2VE + AR + MK**
- VE (Verbal Expression) = WK (Word Knowledge) + PC (Paragraph Comprehension)
- Raw scores mapped to estimated percentile via logistic approximation against 1997 PAY97 norming distribution (ages 18–23)
- Percentile range: 1–99

### Subtests (4 total, 10 questions each = 40 questions)

| Subtest | Code | Question Type | Difficulty Tiers |
|---------|------|---------------|-----------------|
| Word Knowledge | WK | Vocabulary / "most nearly means" | Standard, Moderate, Advanced |
| Paragraph Comprehension | PC | Reading passage + inference question | Standard, Moderate, Advanced |
| Arithmetic Reasoning | AR | Math word problems | Standard, Moderate, Advanced |
| Mathematics Knowledge | MK | Pure math / algebra / geometry | Standard, Moderate, Advanced |

### Question Bank (Current: v1.0)
- 10 questions per subtest (40 total)
- Fixed order, no randomization
- Difficulty distribution per subtest: ~4 Standard, ~3 Moderate, ~3 Advanced
- Each question: 4 multiple-choice options, 1 correct

### Question Bank (Target: v2.0)
- 30 questions per subtest (120 total)
- Random selection of 10 per subtest each attempt
- Randomized answer order within each question
- Difficulty-stratified sampling: 4 Standard, 3 Moderate, 3 Advanced per attempt
- Questions tagged with difficulty tier (1, 2, 3) and topic subtag

### Scoring Pipeline
1. User completes 40 questions across 4 subtests
2. Raw score per subtest = count of correct answers (0–10)
3. VE = WK_raw + PC_raw (0–20)
4. Composite = WK_raw + PC_raw + AR_raw + MK_raw (0–40)
5. Proportion correct → logistic mapping → estimated percentile (1–99)
6. Percentile → AFQT Category (I through V)
7. Percentile compared against branch minimums for eligibility

### Percentile Mapping (Simplified)
```
percentile = max(1, min(99, round(logistic(k=8, x0=0.5, input=proportion_correct) * 98 + 1)))
```
- This is a simplified approximation. The real CAT-ASVAB uses 3-parameter IRT (difficulty, discrimination, guessing) with equated item pools.

---

## AFQT Categories

| Category | Percentile Range | Description |
|----------|-----------------|-------------|
| I | 93–99 | Outstanding |
| II | 65–92 | Above Average |
| IIIA | 50–64 | Average (Upper) |
| IIIB | 31–49 | Average (Lower) |
| IVA | 21–30 | Below Average |
| IVB | 10–20 | Markedly Below Average |
| V | 1–9 | Not Eligible |

---

## Branch Minimum AFQT Scores (HS Diploma)

| Branch | Minimum AFQT |
|--------|-------------|
| Army | 31 |
| Navy | 31 |
| Air Force | 31 |
| Marines | 32 |
| Coast Guard | 40 |
| Space Force | 36 |

*GED holders generally need a minimum of 50 across all branches.*

---

## UI/UX Specs

### Design System
- **Aesthetic:** Military/tactical dark theme
- **Fonts:** Oswald (display), Source Sans 3 (body), JetBrains Mono (data/scores)
- **Palette:**
  - Background: `#0A0F0D` (deep olive dark)
  - Surface: `#111916`
  - Border: `#1A2420`
  - Accent: `#C8E64A` (lime green)
  - Text primary: `#D4DDD6`
  - Text secondary: `#8A9B8E`
  - Danger: `#FF4444`
  - Gold: `#FFD700`
- **Subtest colors:** WK `#2E7D32`, PC `#1565C0`, AR `#E65100`, MK `#6A1B9A`

### Screens (3 total)

#### 1. Intro Screen
- Title: "AFQT ESTIMATOR"
- Subtitle with tool description
- Test structure breakdown (4 subtests, question counts)
- "BEGIN TEST" CTA button
- No time limit disclaimer

#### 2. Quiz Screen
- Sticky top bar: title, global question counter (N/40), elapsed timer
- Subtest progress tabs (4 colored bars)
- Per-subtest progress bar with icon and count
- Question card:
  - Difficulty badge (Standard / Moderate / Advanced)
  - Question text (supports multi-line for reading passages)
  - 4 answer buttons with letter indicators (A/B/C/D)
  - Selected state: lime accent highlight
- "NEXT QUESTION" / "NEXT: [SUBTEST]" / "FINISH & SCORE" button
- Button disabled until answer selected

#### 3. Results Screen
- Large percentile score (color-coded: green ≥50, gold ≥31, red <31)
- AFQT Category badge
- Subtest breakdown: bar charts for WK, PC, AR, MK (each out of 10)
- VE composite and total correct
- Branch eligibility grid (6 branches, pass/fail with minimums)
- AFQT categories reference table (highlights user's category)
- Disclaimer about estimation vs. official scoring
- "RETAKE DIAGNOSTIC" button

### Animations
- `fadeSlide` on screen transitions (opacity + translateY)
- Progress bar width transitions
- Score bar fill with staggered delays on results

---

## File Structure
```
afqt-diagnostic/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx          # React entry point
│   ├── App.jsx            # Full application (single-file component)
│   ├── App.css            # Cleared (styles inline)
│   └── index.css          # Cleared (styles inline)
├── afqt-diagnostic.jsx    # Original source file
├── AFQT_DIAGNOSTIC_SPECS.md  # This file
└── public/
```

---

## Roadmap

### v1.0 (Current) ✅
- [x] 40-question fixed quiz (10 per subtest)
- [x] AFQT percentile estimation
- [x] Branch eligibility display
- [x] AFQT category classification
- [x] Elapsed timer
- [x] Deployed to Vercel

### v2.0 (Planned)
- [ ] Expand question bank to 30 per subtest (120 total)
- [ ] Random question selection (difficulty-stratified: 4/3/3)
- [ ] Randomize answer order per question
- [ ] Per-subtest time tracking
- [ ] Review/change answers before submitting
- [ ] Local score history (store past attempts)

### v3.0 (Future)
- [ ] Adaptive difficulty (simplified 1PL/Rasch model)
- [ ] Question bank stored in external JSON for easy updates
- [ ] Timed mode matching real CAT-ASVAB constraints
- [ ] Line score estimation (GT, CL, EL, etc.)
- [ ] MOS eligibility suggestions per branch
- [ ] Mobile-optimized layout

---

## Known Limitations
1. **Scoring is approximate.** Real AFQT uses 3-parameter IRT with calibrated item pools; this uses a logistic approximation from proportion correct.
2. **Questions are not official ASVAB items.** They are original questions written to approximate ASVAB content and difficulty.
3. **Norming is simplified.** Official percentiles are based on the 1997 PAY97 study with IRT equating; this tool uses a general sigmoid mapping.
4. **No adaptive difficulty.** Real CAT-ASVAB adjusts question difficulty based on performance; this tool presents fixed-difficulty questions.
5. **AR/MK point weighting not replicated.** On the real CAT-ASVAB, AR and MK questions are worth 1–3 points based on difficulty; here each question is worth 1 point.

---

## Session History
- **Session 1:** Built initial 40-question React quiz, pushed to GitHub, deployed to Vercel via Vite scaffolding.
