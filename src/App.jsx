import { useState, useEffect } from "react";

// ─── Question Bank ───
// 10 questions per subtest, calibrated to approximate real ASVAB difficulty spread
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
    {
      q: `Read the passage and answer the question.\n\n"The platoon moved through the dense jungle in single file. Visibility was less than ten meters. The point man raised his fist, and everyone froze."\n\nWhy did everyone stop moving?`,
      a: ["They were tired", "The point man signaled a halt", "They reached their destination", "It was getting dark"],
      correct: 1, diff: 1
    },
    {
      q: `"New recruits often struggle with the transition from civilian to military life. The structured schedule, physical demands, and loss of personal autonomy can be overwhelming at first. However, most adapt within the first few weeks of basic training."\n\nThe main idea of this passage is:`,
      a: ["Military life is too difficult", "Recruits eventually adjust to military life", "Basic training is too long", "Civilians cannot become soldiers"],
      correct: 1, diff: 1
    },
    {
      q: `"The engine's cooling system works by circulating coolant through passages in the engine block. As the coolant absorbs heat, it flows to the radiator where air passing over the fins dissipates the heat."\n\nAccording to the passage, heat is released:`,
      a: ["In the engine block", "Through the coolant passages", "At the radiator", "By the water pump"],
      correct: 2, diff: 2
    },
    {
      q: `"Although solar panels have become significantly cheaper over the past decade, their adoption in rural areas remains limited. The primary barrier is not cost but rather the lack of qualified technicians to install and maintain the systems."\n\nWhat is the main barrier to solar adoption in rural areas?`,
      a: ["High cost of panels", "Shortage of installation professionals", "Lack of sunlight", "Government regulations"],
      correct: 1, diff: 2
    },
    {
      q: `"The Geneva Conventions established rules for the humanitarian treatment of war. They protect wounded soldiers, prisoners of war, and civilians. Nations that violate these agreements may face international sanctions."\n\nThe Geneva Conventions primarily deal with:`,
      a: ["Trade agreements", "Wartime conduct", "Environmental protection", "Arms reduction"],
      correct: 1, diff: 1
    },
    {
      q: `"Studies show that sleep deprivation impairs cognitive function more than moderate alcohol consumption. After 17 hours without sleep, performance is equivalent to a blood alcohol level of 0.05%."\n\nThe passage implies that:`,
      a: ["Alcohol is not dangerous", "Sleep is more important than previously thought", "Extended wakefulness significantly degrades mental performance", "17 hours of work is normal"],
      correct: 2, diff: 2
    },
    {
      q: `"The army uses a rank structure to maintain order and ensure clear chains of command. Each rank carries specific responsibilities, and the system allows for rapid decision-making in combat situations where hesitation can be fatal."\n\nThe rank structure exists primarily to:`,
      a: ["Reward senior soldiers", "Enable efficient command and decision-making", "Reduce the number of officers", "Increase pay for leaders"],
      correct: 1, diff: 1
    },
    {
      q: `"Tectonic plates move at roughly the speed at which fingernails grow — about 2 to 5 centimeters per year. Yet over millions of years, this imperceptible motion has opened oceans, raised mountain ranges, and reshaped entire continents."\n\nThe author uses the fingernail comparison to:`,
      a: ["Show plates move dangerously fast", "Illustrate how slow the movement is", "Explain nail growth", "Argue against plate tectonics"],
      correct: 1, diff: 2
    },
    {
      q: `"The briefing stated that the mission would commence at 0300 hours. All personnel were to assemble at the staging area no later than 0230. Failure to report would result in disciplinary action."\n\nPersonnel must arrive at the staging area by:`,
      a: ["3:00 AM", "2:30 AM", "3:30 AM", "2:00 AM"],
      correct: 1, diff: 1
    },
    {
      q: `"While correlation between two variables indicates they move together, it does not establish that one causes the other. A classic example: ice cream sales and drowning rates both increase in summer, but buying ice cream does not cause drowning."\n\nThe author's main point is that:`,
      a: ["Ice cream is dangerous", "Summer is the most dangerous season", "Statistical association does not prove causation", "Drowning rates are predictable"],
      correct: 2, diff: 3
    },
  ],
  AR: [
    { q: "A soldier runs 3 miles in 21 minutes. At this pace, how long would it take to run 5 miles?", a: ["30 min", "35 min", "25 min", "40 min"], correct: 1, diff: 1 },
    { q: "A store sells boots for $85. If they're on sale for 20% off, what is the sale price?", a: ["$65", "$68", "$70", "$17"], correct: 1, diff: 1 },
    { q: "A rectangular field is 120 yards long and 50 yards wide. What is its perimeter?", a: ["340 yards", "6000 yards", "170 yards", "240 yards"], correct: 0, diff: 1 },
    { q: "If 3 mechanics can repair 12 vehicles in 4 days, how many vehicles can 5 mechanics repair in 6 days?", a: ["20", "24", "30", "36"], correct: 2, diff: 3 },
    { q: "A fuel tank holds 60 gallons. If a generator uses 2.5 gallons per hour, how many hours until the tank is empty?", a: ["20", "22", "24", "25"], correct: 2, diff: 1 },
    { q: "A recruit's score improved from 40 to 52 on a fitness test. What was the percent increase?", a: ["12%", "20%", "30%", "25%"], correct: 2, diff: 2 },
    { q: "Two convoys leave from the same base. One travels north at 40 mph and the other east at 30 mph. After 2 hours, how far apart are they?", a: ["100 miles", "140 miles", "70 miles", "50 miles"], correct: 0, diff: 3 },
    { q: "A squad of 8 splits MREs equally. If they have 3 cases of 12 MREs each, how many does each soldier get?", a: ["3", "4", "4.5", "5"], correct: 2, diff: 1 },
    { q: "If you invest $2,000 at 5% simple annual interest, how much total will you have after 3 years?", a: ["$2,150", "$2,300", "$2,315", "$2,250"], correct: 1, diff: 2 },
    { q: "A water tank is ⅓ full. After adding 40 gallons, it is ¾ full. What is the tank's total capacity?", a: ["80 gallons", "96 gallons", "100 gallons", "120 gallons"], correct: 1, diff: 3 },
  ],
  MK: [
    { q: "What is the value of x if 3x + 7 = 22?", a: ["3", "5", "7", "15"], correct: 1, diff: 1 },
    { q: "What is the area of a triangle with base 10 and height 6?", a: ["60", "30", "16", "20"], correct: 1, diff: 1 },
    { q: "Simplify: (x²)(x³)", a: ["x⁵", "x⁶", "2x⁵", "x⁸"], correct: 0, diff: 1 },
    { q: "What is the value of √144?", a: ["11", "12", "13", "14"], correct: 1, diff: 1 },
    { q: "If a circle has a radius of 7, what is its area? (Use π ≈ 3.14)", a: ["43.96", "153.86", "21.98", "49"], correct: 1, diff: 2 },
    { q: "Solve: 2(x - 3) = 4x + 2", a: ["x = -4", "x = -2", "x = 4", "x = 2"], correct: 0, diff: 2 },
    { q: "What is the slope of the line passing through (2, 5) and (6, 13)?", a: ["2", "4", "½", "8"], correct: 0, diff: 2 },
    { q: "A right triangle has legs of 5 and 12. What is the hypotenuse?", a: ["13", "17", "15", "14"], correct: 0, diff: 2 },
    { q: "Factor: x² - 9", a: ["(x-3)(x+3)", "(x-9)(x+1)", "(x-3)²", "Cannot be factored"], correct: 0, diff: 2 },
    { q: "If f(x) = 2x² - 3x + 1, what is f(3)?", a: ["10", "12", "16", "8"], correct: 0, diff: 3 },
  ],
};

// Subtest metadata
const SUBTESTS = [
  { key: "WK", name: "Word Knowledge", icon: "📖", count: 10, color: "#2E7D32" },
  { key: "PC", name: "Paragraph Comprehension", icon: "📄", count: 10, color: "#1565C0" },
  { key: "AR", name: "Arithmetic Reasoning", icon: "🧮", count: 10, color: "#E65100" },
  { key: "MK", name: "Mathematics Knowledge", icon: "📐", count: 10, color: "#6A1B9A" },
];

// Branch minimums (HS diploma)
const BRANCHES = [
  { name: "Army", min: 31, color: "#4B5320" },
  { name: "Navy", min: 31, color: "#003B6F" },
  { name: "Air Force", min: 31, color: "#00308F" },
  { name: "Marines", min: 32, color: "#8B0000" },
  { name: "Coast Guard", min: 40, color: "#F37021" },
  { name: "Space Force", min: 36, color: "#0B1F3F" },
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

function getCategory(score) {
  for (const c of AFQT_CATEGORIES) {
    if (score >= c.min) return c;
  }
  return AFQT_CATEGORIES[AFQT_CATEGORIES.length - 1];
}

// Rough raw-to-percentile mapping (simplified — real mapping uses IRT/3PL)
// This maps the composite raw score to an estimated percentile
function rawToPercentile(rawComposite) {
  const maxRaw = 40;
  // Clamp extremes: perfect → 99, zero → 1
  if (rawComposite >= maxRaw) return 99;
  if (rawComposite <= 0) return 1;
  const pct = rawComposite / maxRaw;
  const k = 8;
  const x0 = 0.5;
  const logit = 1 / (1 + Math.exp(-k * (pct - x0)));
  return Math.max(1, Math.min(99, Math.round(logit * 98 + 1)));
}

function computeAFQT(answers) {
  const wk = QUESTIONS.WK.filter((_, i) => answers.WK?.[i] === QUESTIONS.WK[i].correct).length;
  const pc = QUESTIONS.PC.filter((_, i) => answers.PC?.[i] === QUESTIONS.PC[i].correct).length;
  const ar = QUESTIONS.AR.filter((_, i) => answers.AR?.[i] === QUESTIONS.AR[i].correct).length;
  const mk = QUESTIONS.MK.filter((_, i) => answers.MK?.[i] === QUESTIONS.MK[i].correct).length;

  // VE = WK + PC (raw out of 20), then scale: VE_scaled = (VE/20)*100 → standard score
  const ve = wk + pc;
  // AFQT composite raw = 2*VE + AR + MK (weighted)
  // For our 10-per-subtest approach: use raw counts, weight VE double
  const compositeRaw = wk + pc + ar + mk; // total correct out of 40
  const percentile = rawToPercentile(compositeRaw);

  return { wk, pc, ar, mk, ve, compositeRaw, percentile };
}

// ─── Styles ───
const fonts = `
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&family=Source+Sans+3:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
`;

const css = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  :root {
    --od: #0A0F0D;
    --od2: #111916;
    --od3: #1A2420;
    --accent: #C8E64A;
    --accent2: #A5D610;
    --danger: #FF4444;
    --text: #D4DDD6;
    --text2: #8A9B8E;
    --gold: #FFD700;
  }
  body {
    background: var(--od);
    color: var(--text);
    font-family: 'Source Sans 3', sans-serif;
    min-height: 100vh;
  }
  .font-display { font-family: 'Oswald', sans-serif; }
  .font-mono { font-family: 'JetBrains Mono', monospace; }
`;

// ─── Components ───

function ProgressBar({ current, total, subtest }) {
  const pct = (current / total) * 100;
  return (
    <div style={{ width: "100%", marginBottom: 24 }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 8, fontFamily: "'Oswald', sans-serif", fontSize: 13,
        letterSpacing: 2, textTransform: "uppercase", color: "var(--text2)"
      }}>
        <span>{subtest.icon} {subtest.name}</span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--accent)" }}>
          {current}/{total}
        </span>
      </div>
      <div style={{
        width: "100%", height: 4, background: "var(--od3)", borderRadius: 2,
        overflow: "hidden"
      }}>
        <div style={{
          width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${subtest.color}, var(--accent))`,
          borderRadius: 2, transition: "width 0.4s ease"
        }} />
      </div>
    </div>
  );
}

function QuestionCard({ question, index, subtest, onAnswer, selectedAnswer }) {
  return (
    <div style={{
      background: "var(--od2)", border: "1px solid var(--od3)", borderRadius: 12,
      padding: "32px 28px", maxWidth: 680, width: "100%",
      animation: "fadeSlide 0.3s ease-out"
    }}>
      <div style={{
        fontFamily: "'Oswald', sans-serif", fontSize: 12, letterSpacing: 3,
        textTransform: "uppercase", color: subtest.color, marginBottom: 16,
        display: "flex", alignItems: "center", gap: 8
      }}>
        <span style={{
          background: subtest.color + "22", padding: "2px 10px", borderRadius: 4,
          color: subtest.color
        }}>
          Q{index + 1}
        </span>
        <span style={{ color: "var(--text2)" }}>
          {question.diff === 1 ? "STANDARD" : question.diff === 2 ? "MODERATE" : "ADVANCED"}
        </span>
      </div>

      <p style={{
        fontSize: 17, lineHeight: 1.7, marginBottom: 28, whiteSpace: "pre-line",
        color: "var(--text)", fontWeight: 400
      }}>
        {question.q}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {question.a.map((ans, i) => {
          const selected = selectedAnswer === i;
          return (
            <button
              key={i}
              onClick={() => onAnswer(i)}
              style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "14px 18px", borderRadius: 8, border: "1px solid",
                borderColor: selected ? "var(--accent)" : "var(--od3)",
                background: selected ? "var(--accent)" + "15" : "var(--od)",
                color: selected ? "var(--accent)" : "var(--text)",
                cursor: "pointer", textAlign: "left", fontSize: 15,
                fontFamily: "'Source Sans 3', sans-serif",
                transition: "all 0.2s ease", width: "100%"
              }}
              onMouseEnter={e => {
                if (!selected) {
                  e.target.style.borderColor = "var(--text2)";
                  e.target.style.background = "var(--od3)";
                }
              }}
              onMouseLeave={e => {
                if (!selected) {
                  e.target.style.borderColor = "var(--od3)";
                  e.target.style.background = "var(--od)";
                }
              }}
            >
              <span style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
                width: 26, height: 26, borderRadius: "50%", display: "flex",
                alignItems: "center", justifyContent: "center", flexShrink: 0,
                background: selected ? "var(--accent)" : "transparent",
                color: selected ? "var(--od)" : "var(--text2)",
                border: selected ? "none" : "1px solid var(--text2)",
                fontWeight: 600
              }}>
                {String.fromCharCode(65 + i)}
              </span>
              {ans}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ResultsScreen({ scores, onRestart }) {
  const { wk, pc, ar, mk, ve, compositeRaw, percentile } = scores;
  const cat = getCategory(percentile);

  const subtestScores = [
    { label: "Word Knowledge", score: wk, max: 10, color: "#2E7D32" },
    { label: "Paragraph Comp.", score: pc, max: 10, color: "#1565C0" },
    { label: "Arithmetic Reasoning", score: ar, max: 10, color: "#E65100" },
    { label: "Math Knowledge", score: mk, max: 10, color: "#6A1B9A" },
  ];

  return (
    <div style={{
      maxWidth: 740, width: "100%", margin: "0 auto", padding: "40px 20px",
      animation: "fadeSlide 0.5s ease-out"
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{
          fontFamily: "'Oswald', sans-serif", fontSize: 12, letterSpacing: 4,
          textTransform: "uppercase", color: "var(--accent)", marginBottom: 12
        }}>
          AFQT DIAGNOSTIC RESULTS
        </div>

        {/* Big score */}
        <div style={{
          fontFamily: "'Oswald', sans-serif", fontSize: 96, fontWeight: 700,
          color: percentile >= 50 ? "var(--accent)" : percentile >= 31 ? "var(--gold)" : "var(--danger)",
          lineHeight: 1, marginBottom: 4
        }}>
          {percentile}
        </div>
        <div style={{
          fontFamily: "'Oswald', sans-serif", fontSize: 16, letterSpacing: 3,
          textTransform: "uppercase", color: "var(--text2)"
        }}>
          ESTIMATED PERCENTILE
        </div>
        <div style={{
          marginTop: 12, display: "inline-block", padding: "4px 16px",
          borderRadius: 4, fontFamily: "'JetBrains Mono', monospace", fontSize: 14,
          background: percentile >= 50 ? "var(--accent)" + "22" : percentile >= 31 ? "#FFD700" + "22" : "#FF4444" + "22",
          color: percentile >= 50 ? "var(--accent)" : percentile >= 31 ? "var(--gold)" : "var(--danger)",
        }}>
          Category {cat.cat} — {cat.desc}
        </div>
      </div>

      {/* Subtest breakdown */}
      <div style={{
        background: "var(--od2)", borderRadius: 12, border: "1px solid var(--od3)",
        padding: 28, marginBottom: 24
      }}>
        <div style={{
          fontFamily: "'Oswald', sans-serif", fontSize: 13, letterSpacing: 3,
          textTransform: "uppercase", color: "var(--text2)", marginBottom: 20
        }}>
          SUBTEST BREAKDOWN
        </div>

        {subtestScores.map((s, i) => (
          <div key={i} style={{ marginBottom: i < 3 ? 20 : 0 }}>
            <div style={{
              display: "flex", justifyContent: "space-between", marginBottom: 6,
              fontSize: 14
            }}>
              <span style={{ color: "var(--text)" }}>{s.label}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", color: s.color }}>
                {s.score}/{s.max}
              </span>
            </div>
            <div style={{
              width: "100%", height: 8, background: "var(--od)", borderRadius: 4,
              overflow: "hidden"
            }}>
              <div style={{
                width: `${(s.score / s.max) * 100}%`, height: "100%",
                background: s.color, borderRadius: 4,
                transition: "width 0.8s ease-out",
                transitionDelay: `${i * 150}ms`
              }} />
            </div>
          </div>
        ))}

        <div style={{
          marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--od3)",
          display: "flex", justifyContent: "space-between", fontSize: 14
        }}>
          <span style={{ color: "var(--text2)" }}>Verbal Expression (VE = WK + PC)</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--accent)" }}>{ve}/20</span>
        </div>
        <div style={{
          display: "flex", justifyContent: "space-between", fontSize: 14, marginTop: 8
        }}>
          <span style={{ color: "var(--text2)" }}>Total Correct</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--accent)" }}>{compositeRaw}/40</span>
        </div>
      </div>

      {/* Branch eligibility */}
      <div style={{
        background: "var(--od2)", borderRadius: 12, border: "1px solid var(--od3)",
        padding: 28, marginBottom: 24
      }}>
        <div style={{
          fontFamily: "'Oswald', sans-serif", fontSize: 13, letterSpacing: 3,
          textTransform: "uppercase", color: "var(--text2)", marginBottom: 20
        }}>
          BRANCH ELIGIBILITY (HS DIPLOMA)
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
          {BRANCHES.map((b, i) => {
            const eligible = percentile >= b.min;
            return (
              <div key={i} style={{
                padding: "14px 16px", borderRadius: 8,
                border: `1px solid ${eligible ? b.color + "88" : "var(--od3)"}`,
                background: eligible ? b.color + "18" : "var(--od)",
                display: "flex", justifyContent: "space-between", alignItems: "center"
              }}>
                <div>
                  <div style={{
                    fontSize: 14, fontWeight: 600,
                    color: eligible ? "#fff" : "var(--text2)"
                  }}>{b.name}</div>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                    color: "var(--text2)", marginTop: 2
                  }}>Min: {b.min}</div>
                </div>
                <div style={{
                  fontSize: 18,
                  filter: eligible ? "none" : "grayscale(1) opacity(0.4)"
                }}>
                  {eligible ? "✅" : "❌"}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AFQT categories reference */}
      <div style={{
        background: "var(--od2)", borderRadius: 12, border: "1px solid var(--od3)",
        padding: 28, marginBottom: 24
      }}>
        <div style={{
          fontFamily: "'Oswald', sans-serif", fontSize: 13, letterSpacing: 3,
          textTransform: "uppercase", color: "var(--text2)", marginBottom: 16
        }}>
          AFQT CATEGORIES
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {AFQT_CATEGORIES.map((c, i) => {
            const isYou = c.cat === cat.cat;
            return (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "8px 12px", borderRadius: 6, fontSize: 13,
                background: isYou ? "var(--accent)" + "15" : "transparent",
                border: isYou ? "1px solid var(--accent)" + "44" : "1px solid transparent"
              }}>
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace", width: 40,
                    color: isYou ? "var(--accent)" : "var(--text2)"
                  }}>{c.cat}</span>
                  <span style={{ color: isYou ? "var(--text)" : "var(--text2)" }}>{c.desc}</span>
                </div>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
                  color: isYou ? "var(--accent)" : "var(--text2)"
                }}>
                  {c.range}{isYou ? " ◄" : ""}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{
        background: "var(--od2)", borderRadius: 12, border: "1px solid #FFD700" + "33",
        padding: 20, marginBottom: 32, fontSize: 13, lineHeight: 1.7, color: "var(--text2)"
      }}>
        <span style={{ color: "var(--gold)", fontWeight: 600 }}>⚠ DISCLAIMER:</span>{" "}
        This is an <em>estimated</em> diagnostic score based on a 40-question sample.
        The actual CAT-ASVAB uses adaptive item selection with 3-parameter IRT scoring,
        and AFQT percentiles are normed against the 1997 Profile of American Youth (ages 18–23).
        This tool cannot replicate official DoD scoring. Visit your local recruiter
        or take the official ASVAB for an accurate assessment.
      </div>

      <div style={{ textAlign: "center" }}>
        <button
          onClick={onRestart}
          style={{
            fontFamily: "'Oswald', sans-serif", fontSize: 16, letterSpacing: 3,
            textTransform: "uppercase", padding: "14px 40px", borderRadius: 8,
            border: "1px solid var(--accent)", background: "transparent",
            color: "var(--accent)", cursor: "pointer", transition: "all 0.2s"
          }}
          onMouseEnter={e => {
            e.target.style.background = "var(--accent)";
            e.target.style.color = "var(--od)";
          }}
          onMouseLeave={e => {
            e.target.style.background = "transparent";
            e.target.style.color = "var(--accent)";
          }}
        >
          RETAKE DIAGNOSTIC
        </button>
      </div>
    </div>
  );
}

// ─── Main App ───
export default function AFQTDiagnostic() {
  const [phase, setPhase] = useState("intro"); // intro | quiz | results
  const [currentSubtest, setCurrentSubtest] = useState(0);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({ WK: {}, PC: {}, AR: {}, MK: {} });
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [scores, setScores] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (phase === "quiz" && startTime) {
      const id = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(id);
    }
  }, [phase, startTime]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const subtest = SUBTESTS[currentSubtest];
  const subtestKey = subtest?.key;
  const questions = subtestKey ? QUESTIONS[subtestKey] : [];
  const totalQ = SUBTESTS.reduce((a, s) => a + s.count, 0);
  const globalQ = SUBTESTS.slice(0, currentSubtest).reduce((a, s) => a + s.count, 0) + currentQ;

  function handleAnswer(ansIdx) {
    setSelectedAnswer(ansIdx);
  }

  function handleNext() {
    if (selectedAnswer === null) return;

    const newAnswers = { ...answers };
    newAnswers[subtestKey] = { ...newAnswers[subtestKey], [currentQ]: selectedAnswer };
    setAnswers(newAnswers);
    setSelectedAnswer(null);

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else if (currentSubtest < SUBTESTS.length - 1) {
      setCurrentSubtest(currentSubtest + 1);
      setCurrentQ(0);
    } else {
      // Compute results
      const finalScores = computeAFQT(newAnswers);
      setScores(finalScores);
      setPhase("results");
    }
  }

  function handleRestart() {
    setPhase("intro");
    setCurrentSubtest(0);
    setCurrentQ(0);
    setAnswers({ WK: {}, PC: {}, AR: {}, MK: {} });
    setSelectedAnswer(null);
    setScores(null);
    setStartTime(null);
    setElapsed(0);
  }

  return (
    <>
      <style>{fonts}{css}{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{
        minHeight: "100vh", background: "var(--od)",
        backgroundImage: "radial-gradient(circle at 50% 0%, #1a2a1e 0%, transparent 50%)"
      }}>
        {/* Top bar */}
        {phase === "quiz" && (
          <div style={{
            position: "sticky", top: 0, zIndex: 10,
            background: "var(--od)" + "ee", backdropFilter: "blur(12px)",
            borderBottom: "1px solid var(--od3)", padding: "12px 24px",
            display: "flex", justifyContent: "space-between", alignItems: "center"
          }}>
            <div style={{
              fontFamily: "'Oswald', sans-serif", fontSize: 13, letterSpacing: 2,
              color: "var(--text2)", textTransform: "uppercase"
            }}>
              AFQT DIAGNOSTIC
            </div>
            <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
                color: "var(--text2)"
              }}>
                {globalQ + 1} / {totalQ}
              </span>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
                color: "var(--accent)", background: "var(--accent)" + "15",
                padding: "2px 10px", borderRadius: 4
              }}>
                {formatTime(elapsed)}
              </span>
            </div>
          </div>
        )}

        {/* Intro Screen */}
        {phase === "intro" && (
          <div style={{
            maxWidth: 600, margin: "0 auto", padding: "80px 24px",
            textAlign: "center", animation: "fadeSlide 0.5s ease-out"
          }}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
              letterSpacing: 4, color: "var(--accent)", marginBottom: 16,
              textTransform: "uppercase"
            }}>
              QUICK DIAGNOSTIC TOOL
            </div>

            <h1 style={{
              fontFamily: "'Oswald', sans-serif", fontSize: 52, fontWeight: 700,
              letterSpacing: 2, lineHeight: 1.1, marginBottom: 8,
              background: "linear-gradient(180deg, #fff 20%, var(--accent))",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
            }}>
              AFQT ESTIMATOR
            </h1>

            <p style={{
              fontSize: 15, lineHeight: 1.7, color: "var(--text2)",
              marginBottom: 40, maxWidth: 480, marginLeft: "auto", marginRight: "auto"
            }}>
              40 questions across the four AFQT subtests — Word Knowledge, Paragraph Comprehension,
              Arithmetic Reasoning, and Mathematics Knowledge. Get an estimated AFQT percentile
              and see which branches you'd qualify for.
            </p>

            <div style={{
              background: "var(--od2)", border: "1px solid var(--od3)", borderRadius: 12,
              padding: 24, marginBottom: 32, textAlign: "left"
            }}>
              <div style={{
                fontFamily: "'Oswald', sans-serif", fontSize: 12, letterSpacing: 3,
                color: "var(--text2)", marginBottom: 16, textTransform: "uppercase"
              }}>
                TEST STRUCTURE
              </div>
              {SUBTESTS.map((s, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "10px 0",
                  borderBottom: i < 3 ? "1px solid var(--od3)" : "none"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span>{s.icon}</span>
                    <span style={{ fontSize: 14, color: "var(--text)" }}>{s.name}</span>
                  </div>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
                    color: s.color
                  }}>
                    {s.count} Qs
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => { setStartTime(Date.now()); setPhase("quiz"); }}
              style={{
                fontFamily: "'Oswald', sans-serif", fontSize: 18, fontWeight: 600,
                letterSpacing: 4, textTransform: "uppercase",
                padding: "16px 48px", borderRadius: 8, border: "none",
                background: "var(--accent)", color: "var(--od)",
                cursor: "pointer", transition: "all 0.2s",
                boxShadow: "0 0 30px var(--accent)" + "33"
              }}
              onMouseEnter={e => e.target.style.transform = "scale(1.03)"}
              onMouseLeave={e => e.target.style.transform = "scale(1)"}
            >
              BEGIN TEST
            </button>

            <p style={{
              fontSize: 12, color: "var(--text2)", marginTop: 24, fontStyle: "italic"
            }}>
              No time limit, but pace yourself — the real CAT-ASVAB is timed.
            </p>
          </div>
        )}

        {/* Quiz Screen */}
        {phase === "quiz" && (
          <div style={{
            maxWidth: 720, margin: "0 auto", padding: "32px 20px",
            display: "flex", flexDirection: "column", alignItems: "center"
          }}>
            {/* Subtest tabs */}
            <div style={{
              display: "flex", gap: 4, marginBottom: 24, width: "100%", maxWidth: 680
            }}>
              {SUBTESTS.map((s, i) => {
                const done = i < currentSubtest;
                const active = i === currentSubtest;
                return (
                  <div key={i} style={{
                    flex: 1, height: 3, borderRadius: 2,
                    background: done ? s.color : active ? s.color + "88" : "var(--od3)",
                    transition: "background 0.3s"
                  }} />
                );
              })}
            </div>

            <ProgressBar current={currentQ + 1} total={questions.length} subtest={subtest} />

            <QuestionCard
              key={`${subtestKey}-${currentQ}`}
              question={questions[currentQ]}
              index={currentQ}
              subtest={subtest}
              onAnswer={handleAnswer}
              selectedAnswer={selectedAnswer}
            />

            <button
              onClick={handleNext}
              disabled={selectedAnswer === null}
              style={{
                marginTop: 24, fontFamily: "'Oswald', sans-serif", fontSize: 15,
                letterSpacing: 3, textTransform: "uppercase",
                padding: "12px 36px", borderRadius: 8, border: "none",
                background: selectedAnswer !== null ? "var(--accent)" : "var(--od3)",
                color: selectedAnswer !== null ? "var(--od)" : "var(--text2)",
                cursor: selectedAnswer !== null ? "pointer" : "default",
                transition: "all 0.2s", fontWeight: 600
              }}
            >
              {currentSubtest === SUBTESTS.length - 1 && currentQ === questions.length - 1
                ? "FINISH & SCORE"
                : currentQ === questions.length - 1
                  ? `NEXT: ${SUBTESTS[currentSubtest + 1]?.name?.toUpperCase()}`
                  : "NEXT QUESTION"
              }
            </button>
          </div>
        )}

        {/* Results Screen */}
        {phase === "results" && (
          <ResultsScreen scores={scores} onRestart={handleRestart} />
        )}
      </div>
    </>
  );
}
