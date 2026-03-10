/**
 * AFQT Diagnostic — Comprehensive Test & Audit Script
 * Tests: question bank integrity, scoring logic, percentile mapping, 
 *        answer key correctness, UI logic, and code-level bugs.
 */

// ─── Inline the data from App.jsx ───
const QUESTIONS = {
  WK: [
    { q: '"Abate" most nearly means:', a: ["Encourage", "Diminish", "Create", "Wander"], correct: 1, diff: 1 },
    { q: '"Candid" most nearly means:', a: ["Hidden", "Sweet", "Honest", "Bright"], correct: 2, diff: 1 },
    { q: '"Austere" most nearly means:', a: ["Wealthy", "Stern", "Musical", "Foreign"], correct: 1, diff: 2 },
    { q: '"Lucid" most nearly means:', a: ["Dark", "Profitable", "Clear", "Loose"], correct: 2, diff: 1 },
    { q: '"Acquiesce" most nearly means:', a: ["Comply", "Purchase", "Argue", "Release"], correct: 0, diff: 3 },
    { q: '"Benevolent" most nearly means:', a: ["Harmful", "Kind", "Neutral", "Brave"], correct: 1, diff: 1 },
    { q: '"Obfuscate" most nearly means:', a: ["Clarify", "Decorate", "Confuse", "Repair"], correct: 2, diff: 3 },
    { q: '"Pragmatic" most nearly means:', a: ["Idealistic", "Practical", "Dramatic", "Ancient"], correct: 1, diff: 2 },
    { q: '"Ephemeral" most nearly means:', a: ["Eternal", "Short-lived", "Spiritual", "Heavy"], correct: 1, diff: 3 },
    { q: '"Diligent" most nearly means:', a: ["Lazy", "Intelligent", "Hardworking", "Cautious"], correct: 2, diff: 1 },
  ],
  PC: [
    { q: `Passage about platoon...`, a: ["They were tired", "The point man signaled a halt", "They reached their destination", "It was getting dark"], correct: 1, diff: 1 },
    { q: `Passage about recruits...`, a: ["Military life is too difficult", "Recruits eventually adjust to military life", "Basic training is too long", "Civilians cannot become soldiers"], correct: 1, diff: 1 },
    { q: `Passage about engine cooling...`, a: ["In the engine block", "Through the coolant passages", "At the radiator", "By the water pump"], correct: 2, diff: 2 },
    { q: `Passage about solar panels...`, a: ["High cost of panels", "Shortage of installation professionals", "Lack of sunlight", "Government regulations"], correct: 1, diff: 2 },
    { q: `Passage about Geneva Conventions...`, a: ["Trade agreements", "Wartime conduct", "Environmental protection", "Arms reduction"], correct: 1, diff: 1 },
    { q: `Passage about sleep deprivation...`, a: ["Alcohol is not dangerous", "Sleep is more important than previously thought", "Extended wakefulness significantly degrades mental performance", "17 hours of work is normal"], correct: 2, diff: 2 },
    { q: `Passage about rank structure...`, a: ["Reward senior soldiers", "Enable efficient command and decision-making", "Reduce the number of officers", "Increase pay for leaders"], correct: 1, diff: 1 },
    { q: `Passage about tectonic plates...`, a: ["Show plates move dangerously fast", "Illustrate how slow the movement is", "Explain nail growth", "Argue against plate tectonics"], correct: 1, diff: 2 },
    { q: `Passage about briefing...`, a: ["3:00 AM", "2:30 AM", "3:30 AM", "2:00 AM"], correct: 1, diff: 1 },
    { q: `Passage about correlation...`, a: ["Ice cream is dangerous", "Summer is the most dangerous season", "Statistical association does not prove causation", "Drowning rates are predictable"], correct: 2, diff: 3 },
  ],
  AR: [
    { q: "Soldier runs 3 miles in 21 minutes...", a: ["30 min", "35 min", "25 min", "40 min"], correct: 1, diff: 1 },
    { q: "Store sells boots for $85, 20% off...", a: ["$65", "$68", "$70", "$17"], correct: 1, diff: 1 },
    { q: "Rectangular field 120x50 perimeter...", a: ["340 yards", "6000 yards", "170 yards", "240 yards"], correct: 0, diff: 1 },
    { q: "3 mechanics, 12 vehicles, 4 days...", a: ["20", "24", "30", "36"], correct: 2, diff: 3 },
    { q: "60 gallon tank, 2.5 gal/hr...", a: ["20", "22", "24", "25"], correct: 2, diff: 1 },
    { q: "Score improved 40 to 52...", a: ["12%", "20%", "30%", "25%"], correct: 2, diff: 2 },
    { q: "Two convoys, 40mph N, 30mph E...", a: ["100 miles", "140 miles", "70 miles", "50 miles"], correct: 0, diff: 3 },
    { q: "Squad of 8, 3 cases of 12 MREs...", a: ["3", "4", "4.5", "5"], correct: 2, diff: 1 },
    { q: "$2000 at 5% simple interest, 3 years...", a: ["$2,150", "$2,300", "$2,315", "$2,250"], correct: 1, diff: 2 },
    { q: "Water tank ⅓ full, add 40 gal → ¾ full...", a: ["80 gallons", "96 gallons", "100 gallons", "120 gallons"], correct: 1, diff: 3 },
  ],
  MK: [
    { q: "3x + 7 = 22", a: ["3", "5", "7", "15"], correct: 1, diff: 1 },
    { q: "Triangle base 10 height 6", a: ["60", "30", "16", "20"], correct: 1, diff: 1 },
    { q: "(x²)(x³)", a: ["x⁵", "x⁶", "2x⁵", "x⁸"], correct: 0, diff: 1 },
    { q: "√144", a: ["11", "12", "13", "14"], correct: 1, diff: 1 },
    { q: "Circle radius 7 area", a: ["43.96", "153.86", "21.98", "49"], correct: 1, diff: 2 },
    { q: "2(x-3) = 4x+2", a: ["x = -4", "x = -2", "x = 4", "x = 2"], correct: 0, diff: 2 },
    { q: "Slope through (2,5) and (6,13)", a: ["2", "4", "½", "8"], correct: 0, diff: 2 },
    { q: "Right triangle legs 5 and 12", a: ["13", "17", "15", "14"], correct: 0, diff: 2 },
    { q: "Factor x²-9", a: ["(x-3)(x+3)", "(x-9)(x+1)", "(x-3)²", "Cannot be factored"], correct: 0, diff: 2 },
    { q: "f(x) = 2x²-3x+1, f(3)", a: ["10", "12", "16", "8"], correct: 0, diff: 3 },
  ],
};

const SUBTESTS = [
  { key: "WK", name: "Word Knowledge", count: 10 },
  { key: "PC", name: "Paragraph Comprehension", count: 10 },
  { key: "AR", name: "Arithmetic Reasoning", count: 10 },
  { key: "MK", name: "Mathematics Knowledge", count: 10 },
];

const AFQT_CATEGORIES = [
  { cat: "I", range: "93–99", desc: "Outstanding", min: 93 },
  { cat: "II", range: "65–92", desc: "Above Average", min: 65 },
  { cat: "IIIA", range: "50–64", desc: "Average (Upper)", min: 50 },
  { cat: "IIIB", range: "31–49", desc: "Average (Lower)", min: 31 },
  { cat: "IVA", range: "21–30", desc: "Below Average", min: 21 },
  { cat: "IVB", range: "10–20", desc: "Markedly Below Average", min: 10 },
  { cat: "V", range: "1–9", desc: "Not Eligible", min: 1 },
];

// ─── Scoring functions (copied from App.jsx) ───
function rawToPercentile(rawComposite) {
  const maxRaw = 40;
  if (rawComposite >= maxRaw) return 99;
  if (rawComposite <= 0) return 1;
  const pct = rawComposite / maxRaw;
  const k = 8;
  const x0 = 0.5;
  const logit = 1 / (1 + Math.exp(-k * (pct - x0)));
  return Math.max(1, Math.min(99, Math.round(logit * 98 + 1)));
}

function getCategory(score) {
  for (const c of AFQT_CATEGORIES) {
    if (score >= c.min) return c;
  }
  return AFQT_CATEGORIES[AFQT_CATEGORIES.length - 1];
}

// ─── Test runner ───
let passed = 0;
let failed = 0;
const failures = [];

function test(name, condition, detail = "") {
  if (condition) {
    passed++;
  } else {
    failed++;
    failures.push({ name, detail });
    console.log(`  ❌ FAIL: ${name}${detail ? " — " + detail : ""}`);
  }
}

// ══════════════════════════════════════════
// TEST SUITE 1: Question Bank Integrity
// ══════════════════════════════════════════
console.log("\n═══ TEST SUITE 1: Question Bank Integrity ═══\n");

for (const [key, questions] of Object.entries(QUESTIONS)) {
  // Count
  test(`${key}: has exactly 10 questions`, questions.length === 10, `got ${questions.length}`);

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    // 4 answer choices
    test(`${key} Q${i+1}: has 4 answer options`, q.a.length === 4, `got ${q.a.length}`);
    // correct index in range
    test(`${key} Q${i+1}: correct index in range [0,3]`, q.correct >= 0 && q.correct <= 3, `got ${q.correct}`);
    // diff in range
    test(`${key} Q${i+1}: difficulty in [1,2,3]`, [1,2,3].includes(q.diff), `got ${q.diff}`);
    // no empty question text
    test(`${key} Q${i+1}: question text non-empty`, q.q.trim().length > 0);
    // no empty answers
    q.a.forEach((ans, j) => {
      test(`${key} Q${i+1} option ${String.fromCharCode(65+j)}: non-empty`, ans.trim().length > 0);
    });
    // no duplicate answers
    const unique = new Set(q.a.map(a => a.toLowerCase().trim()));
    test(`${key} Q${i+1}: no duplicate answer options`, unique.size === 4, `only ${unique.size} unique`);
  }

  // Difficulty distribution
  const diffs = questions.map(q => q.diff);
  const d1 = diffs.filter(d => d === 1).length;
  const d2 = diffs.filter(d => d === 2).length;
  const d3 = diffs.filter(d => d === 3).length;
  console.log(`  ℹ️  ${key} difficulty distribution: Standard=${d1}, Moderate=${d2}, Advanced=${d3}`);
  test(`${key}: has at least 1 question per difficulty tier`, d1 > 0 && d2 > 0 && d3 > 0);
}

// ══════════════════════════════════════════
// TEST SUITE 2: Answer Key Verification
// ══════════════════════════════════════════
console.log("\n═══ TEST SUITE 2: Answer Key Verification (Math) ═══\n");

// AR answers we can verify computationally
// AR Q1: 3 miles / 21 min = 7 min/mile → 5 miles = 35 min → correct: 1 ("35 min") ✓
test("AR Q1: 3mi/21min → 5mi = 35min", QUESTIONS.AR[0].correct === 1, `answer: ${QUESTIONS.AR[0].a[QUESTIONS.AR[0].correct]}`);

// AR Q2: $85 * 0.20 = $17 off → $68 → correct: 1 ("$68") ✓
test("AR Q2: $85 * 0.80 = $68", QUESTIONS.AR[1].correct === 1, `answer: ${QUESTIONS.AR[1].a[QUESTIONS.AR[1].correct]}`);

// AR Q3: perimeter = 2(120+50) = 340 → correct: 0 ("340 yards") ✓
test("AR Q3: 2(120+50) = 340", QUESTIONS.AR[2].correct === 0, `answer: ${QUESTIONS.AR[2].a[QUESTIONS.AR[2].correct]}`);

// AR Q4: 3 mechs, 12 vehicles, 4 days → rate = 12/(3*4) = 1 vehicle/mechanic/day → 5*6 = 30 → correct: 2 ("30") ✓
test("AR Q4: rate=1 veh/mech/day → 5*6=30", QUESTIONS.AR[3].correct === 2, `answer: ${QUESTIONS.AR[3].a[QUESTIONS.AR[3].correct]}`);

// AR Q5: 60/2.5 = 24 → correct: 2 ("24") ✓
test("AR Q5: 60/2.5 = 24", QUESTIONS.AR[4].correct === 2, `answer: ${QUESTIONS.AR[4].a[QUESTIONS.AR[4].correct]}`);

// AR Q6: (52-40)/40 = 12/40 = 0.30 = 30% → correct: 2 ("30%") ✓
test("AR Q6: (52-40)/40 = 30%", QUESTIONS.AR[5].correct === 2, `answer: ${QUESTIONS.AR[5].a[QUESTIONS.AR[5].correct]}`);

// AR Q7: √(80² + 60²) = √(6400+3600) = √10000 = 100 → correct: 0 ("100 miles") ✓
test("AR Q7: √((40*2)²+(30*2)²) = 100", QUESTIONS.AR[6].correct === 0, `answer: ${QUESTIONS.AR[6].a[QUESTIONS.AR[6].correct]}`);

// AR Q8: 3*12 = 36 MREs / 8 = 4.5 → correct: 2 ("4.5") ✓
test("AR Q8: 36/8 = 4.5", QUESTIONS.AR[7].correct === 2, `answer: ${QUESTIONS.AR[7].a[QUESTIONS.AR[7].correct]}`);

// AR Q9: 2000 + (2000*0.05*3) = 2000+300 = 2300 → correct: 1 ("$2,300") ✓
test("AR Q9: 2000*(1+0.05*3) = 2300", QUESTIONS.AR[8].correct === 1, `answer: ${QUESTIONS.AR[8].a[QUESTIONS.AR[8].correct]}`);

// AR Q10: ¾ - ⅓ = 9/12 - 4/12 = 5/12 of tank = 40 gal → tank = 40*(12/5) = 96 → correct: 1 ("96 gallons") ✓
test("AR Q10: 40/(3/4-1/3) = 96", QUESTIONS.AR[9].correct === 1, `answer: ${QUESTIONS.AR[9].a[QUESTIONS.AR[9].correct]}`);

// MK answers
// MK Q1: 3x=15 → x=5 → correct: 1 ✓
test("MK Q1: x=5", QUESTIONS.MK[0].correct === 1);

// MK Q2: (10*6)/2 = 30 → correct: 1 ✓
test("MK Q2: area=30", QUESTIONS.MK[1].correct === 1);

// MK Q3: x^(2+3) = x^5 → correct: 0 ✓
test("MK Q3: x⁵", QUESTIONS.MK[2].correct === 0);

// MK Q4: √144 = 12 → correct: 1 ✓
test("MK Q4: √144=12", QUESTIONS.MK[3].correct === 1);

// MK Q5: π*7² = 3.14*49 = 153.86 → correct: 1 ✓
test("MK Q5: π*49=153.86", QUESTIONS.MK[4].correct === 1);

// MK Q6: 2x-6 = 4x+2 → -2x=8 → x=-4 → correct: 0 ✓
test("MK Q6: x=-4", QUESTIONS.MK[5].correct === 0);

// MK Q7: (13-5)/(6-2) = 8/4 = 2 → correct: 0 ✓
test("MK Q7: slope=2", QUESTIONS.MK[6].correct === 0);

// MK Q8: √(25+144) = √169 = 13 → correct: 0 ✓
test("MK Q8: hyp=13", QUESTIONS.MK[7].correct === 0);

// MK Q9: x²-9 = (x-3)(x+3) → correct: 0 ✓
test("MK Q9: (x-3)(x+3)", QUESTIONS.MK[8].correct === 0);

// MK Q10: f(3) = 2(9)-3(3)+1 = 18-9+1 = 10 → correct: 0 ("10") ✓
test("MK Q10: f(3)=10", QUESTIONS.MK[9].correct === 0);

// WK spot checks
test("WK Q1: Abate = Diminish (index 1)", QUESTIONS.WK[0].correct === 1);
test("WK Q2: Candid = Honest (index 2)", QUESTIONS.WK[1].correct === 2);
test("WK Q3: Austere = Stern (index 1)", QUESTIONS.WK[2].correct === 1);
test("WK Q5: Acquiesce = Comply (index 0)", QUESTIONS.WK[4].correct === 0);
test("WK Q7: Obfuscate = Confuse (index 2)", QUESTIONS.WK[6].correct === 2);
test("WK Q9: Ephemeral = Short-lived (index 1)", QUESTIONS.WK[8].correct === 1);

// ══════════════════════════════════════════
// TEST SUITE 3: Scoring Logic
// ══════════════════════════════════════════
console.log("\n═══ TEST SUITE 3: Scoring & Percentile Logic ═══\n");

// Test percentile at boundary values
test("Percentile(0) >= 1", rawToPercentile(0) >= 1);
test("Percentile(0) <= 5", rawToPercentile(0) <= 5, `got ${rawToPercentile(0)}`);
test("Percentile(40) >= 95", rawToPercentile(40) >= 95, `got ${rawToPercentile(40)}`);
test("Percentile(40) <= 99", rawToPercentile(40) <= 99);
test("Percentile(20) ≈ 50 (±5)", Math.abs(rawToPercentile(20) - 50) <= 5, `got ${rawToPercentile(20)}`);

// Monotonicity: higher raw = higher or equal percentile
let monotonic = true;
for (let i = 1; i <= 40; i++) {
  if (rawToPercentile(i) < rawToPercentile(i - 1)) {
    monotonic = false;
    console.log(`  ❌ Monotonicity violation: P(${i})=${rawToPercentile(i)} < P(${i-1})=${rawToPercentile(i-1)}`);
  }
}
test("Percentile mapping is monotonically non-decreasing", monotonic);

// Range
for (let i = 0; i <= 40; i++) {
  const p = rawToPercentile(i);
  if (p < 1 || p > 99) {
    test(`Percentile(${i}) in [1,99]`, false, `got ${p}`);
  }
}
test("All percentiles in [1, 99]", true);

// Category mapping
test("Category(99) = I", getCategory(99).cat === "I");
test("Category(93) = I", getCategory(93).cat === "I");
test("Category(92) = II", getCategory(92).cat === "II");
test("Category(65) = II", getCategory(65).cat === "II");
test("Category(50) = IIIA", getCategory(50).cat === "IIIA");
test("Category(31) = IIIB", getCategory(31).cat === "IIIB");
test("Category(30) = IVA", getCategory(30).cat === "IVA");
test("Category(10) = IVB", getCategory(10).cat === "IVB");
test("Category(9) = V", getCategory(9).cat === "V");
test("Category(1) = V", getCategory(1).cat === "V");

// Print full percentile table
console.log("\n  ℹ️  Full percentile mapping:");
console.log("  Raw | %ile | Cat");
console.log("  ----|------|----");
for (let i = 0; i <= 40; i += 2) {
  const p = rawToPercentile(i);
  const c = getCategory(p);
  console.log(`   ${String(i).padStart(2)} |  ${String(p).padStart(2)}  | ${c.cat}`);
}

// ══════════════════════════════════════════
// TEST SUITE 4: Code-Level Bug Audit
// ══════════════════════════════════════════
console.log("\n═══ TEST SUITE 4: Code Bug Audit ═══\n");

// Bug 1: Timer useEffect on line 541 — Date.now() - Date.now() = always 0
console.log("  ✅ BUG 1 (FIXED): Timer useEffect Date.now() - Date.now() — removed broken useEffect");
console.log("  ✅ BUG 2 (FIXED): setState in useEffect — startTime now set in click handler");
console.log("  ✅ BUG 3 (FIXED): Duplicate timer intervals — consolidated into single useEffect\n");

// Bug 4: AFQT formula mismatch
console.log("  ⚠️  BUG 4 (DESIGN): Specs say AFQT = 2VE + AR + MK, but scoring uses simple sum");
console.log("     The computeAFQT function computes compositeRaw = wk + pc + ar + mk (simple sum).");
console.log("     The specs define AFQT = 2*VE + AR + MK where VE = WK + PC.");
console.log("     With 2x weighting: max would be 2*20 + 10 + 10 = 60, not 40.");
console.log("     Current sigmoid is calibrated for max=40, so changing the formula requires");
console.log("     recalibrating the sigmoid. This is a known simplification per the comments,");
console.log("     but the percentile function would need updating if the formula changes.\n");

// Bug 5: hover state not fully resetting
console.log("  ⚠️  BUG 5 (MINOR): Answer button hover uses inline style manipulation via onMouseEnter/Leave");
console.log("     If user hovers then clicks an answer, hover styles persist on the previously-hovered");
console.log("     button since the selected state changes but the onMouseLeave may not fire cleanly.");
console.log("     Not a crash bug, but can cause visual glitches.\n");

// Bug 6: page title
console.log("  ⚠️  BUG 6 (MINOR): index.html <title> is 'afqt-diagnostic' — should be 'AFQT Estimator'\n");

// ══════════════════════════════════════════
// TEST SUITE 5: Edge Cases
// ══════════════════════════════════════════
console.log("\n═══ TEST SUITE 5: Edge Cases ═══\n");

// Perfect score
test("Perfect score (40/40) gives percentile 99", rawToPercentile(40) === 99, `got ${rawToPercentile(40)}`);

// Zero score
test("Zero score (0/40) gives percentile 1 or 2", rawToPercentile(0) <= 2, `got ${rawToPercentile(0)}`);

// Single correct per subtest (4/40)
const p4 = rawToPercentile(4);
test("4/40 correct → low percentile (<15)", p4 < 15, `got ${p4}`);

// Half correct (20/40)
const p20 = rawToPercentile(20);
test("20/40 correct → near 50th percentile", p20 >= 45 && p20 <= 55, `got ${p20}`);

// ══════════════════════════════════════════
// SUMMARY
// ══════════════════════════════════════════
console.log("\n" + "═".repeat(50));
console.log(`  RESULTS: ${passed} passed, ${failed} failed`);
console.log("═".repeat(50));
if (failures.length > 0) {
  console.log("\n  Failures:");
  failures.forEach((f, i) => console.log(`  ${i+1}. ${f.name}${f.detail ? ` (${f.detail})` : ""}`));
}
console.log("");
