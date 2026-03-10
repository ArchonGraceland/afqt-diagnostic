import { useState, useEffect } from "react";

// ─── Question Bank v2.0 ───
// 10 questions per subtest, calibrated to approximate real ASVAB difficulty spread
// Difficulty distribution per subtest: ~4 Standard, ~3 Moderate, ~3 Advanced
const QUESTIONS = {
  WK: [
    { q: '"Tenacious" most nearly means:', a: ["Gentle", "Persistent", "Fragile", "Humble"], correct: 1, diff: 1 },
    { q: '"Concur" most nearly means:', a: ["Disagree", "Compete", "Agree", "Withdraw"], correct: 2, diff: 1 },
    { q: '"Prudent" most nearly means:', a: ["Reckless", "Wise", "Wealthy", "Timid"], correct: 1, diff: 1 },
    { q: '"Convivial" most nearly means:', a: ["Hostile", "Sociable", "Secretive", "Solemn"], correct: 1, diff: 2 },
    { q: '"Diminish" most nearly means:', a: ["Reduce", "Expand", "Maintain", "Destroy"], correct: 0, diff: 1 },
    { q: '"Capitulate" most nearly means:', a: ["Invest", "Celebrate", "Surrender", "Ascend"], correct: 2, diff: 3 },
    { q: '"Verbose" most nearly means:', a: ["Concise", "Wordy", "Honest", "Violent"], correct: 1, diff: 2 },
    { q: '"Pernicious" most nearly means:', a: ["Beneficial", "Nervous", "Harmful", "Attractive"], correct: 2, diff: 3 },
    { q: '"Alleviate" most nearly means:', a: ["Worsen", "Relieve", "Accuse", "Elevate"], correct: 1, diff: 2 },
    { q: '"Surreptitious" most nearly means:', a: ["Obvious", "Generous", "Stealthy", "Rapid"], correct: 2, diff: 3 },
  ],
  PC: [
    {
      q: `Read the passage and answer the question.\n\n"During the field exercise, the squad leader noticed dark clouds forming on the western horizon. He immediately ordered the team to set up shelters and secure all loose equipment before continuing the patrol."\n\nWhy did the squad leader give these orders?`,
      a: ["He wanted to end the exercise early", "He was preparing for incoming bad weather", "The team needed rest", "Enemy forces were approaching"],
      correct: 1, diff: 1
    },
    {
      q: `"The military commissary offers groceries at cost plus a small surcharge, making prices significantly lower than off-base supermarkets. Active-duty personnel and their dependents are eligible to shop there, providing a meaningful financial benefit for military families."\n\nThe main purpose of the commissary is to:`,
      a: ["Generate revenue for the military", "Provide affordable groceries to service members", "Compete with civilian grocery stores", "Limit what military families can purchase"],
      correct: 1, diff: 1
    },
    {
      q: `"Body armor has evolved significantly since its introduction. Modern ceramic plate inserts can stop rifle rounds that would have penetrated older steel plates, while weighing considerably less. However, the trade-off is that ceramic plates crack upon impact and must be replaced after absorbing a hit."\n\nAccording to the passage, a disadvantage of ceramic plates is:`,
      a: ["They are heavier than steel plates", "They cannot stop rifle rounds", "They must be replaced after being struck", "They are too expensive for standard issue"],
      correct: 2, diff: 2
    },
    {
      q: `"Studies show that sleep deprivation among military personnel leads to measurably slower reaction times, impaired judgment, and reduced situational awareness. Despite this evidence, operational demands frequently require soldiers to function on four hours of sleep or less during extended missions. Some commanders have begun implementing rotating rest schedules to mitigate these effects."\n\nThe passage suggests that rotating rest schedules are intended to:`,
      a: ["Eliminate the need for sleep entirely", "Reduce the negative effects of insufficient sleep", "Allow soldiers to sleep during combat", "Replace traditional training methods"],
      correct: 1, diff: 2
    },
    {
      q: `"The GPS satellite constellation consists of at least 24 satellites orbiting Earth at approximately 20,200 kilometers altitude. Each satellite transmits precise timing signals. A GPS receiver calculates its position by measuring the time delay of signals from at least four satellites and using trilateration to determine its exact location."\n\nThe minimum number of satellites needed for a GPS receiver to determine its position is:`,
      a: ["Two", "Three", "Four", "Six"],
      correct: 2, diff: 1
    },
    {
      q: `"The concept of 'mission command' represents a shift from rigid top-down orders to a philosophy where subordinate leaders are given a clear objective and the freedom to determine how best to achieve it. Proponents argue this approach produces more agile units that can adapt to rapidly changing conditions on the ground. Critics counter that without tight control, units risk acting in ways that conflict with the broader operational plan."\n\nWhich of the following best describes the critics' concern with mission command?`,
      a: ["Subordinate leaders lack the training to make decisions", "Individual unit actions may undermine the overall strategy", "Mission command is too slow for modern warfare", "Soldiers prefer receiving detailed orders"],
      correct: 1, diff: 3
    },
    {
      q: `"Corrosion is the single largest maintenance cost driver for naval vessels. Salt water, humidity, and temperature fluctuations create an environment where exposed metal surfaces deteriorate rapidly. Preventive measures include specialized coatings, cathodic protection systems, and regular inspection cycles, yet corrosion damage still accounts for roughly one-quarter of all unscheduled ship maintenance."\n\nIt can be inferred from the passage that:`,
      a: ["Corrosion is easily prevented with modern coatings", "Naval maintenance costs would be lower in freshwater environments", "Cathodic protection eliminates the need for inspections", "Ships require no maintenance in dry dock"],
      correct: 1, diff: 3
    },
    {
      q: `"When a helicopter enters autorotation, the pilot reduces the engine throttle and allows the upward flow of air through the rotor blades to maintain their rotation. This technique allows the helicopter to descend in a controlled manner even after a complete engine failure."\n\nAutorotation is best described as a method for:`,
      a: ["Increasing a helicopter's speed", "Landing safely without engine power", "Hovering in place during combat", "Refueling while airborne"],
      correct: 1, diff: 1
    },
    {
      q: `"The Geneva Conventions establish that prisoners of war must be treated humanely at all times. They are required only to provide their name, rank, date of birth, and service number when captured. Compelling a prisoner to provide military intelligence through physical or mental coercion is explicitly prohibited under these international agreements."\n\nAccording to the passage, a prisoner of war is obligated to disclose:`,
      a: ["Details about their unit's location and mission", "Only basic personal and service identification", "Information if questioned by a senior officer", "Nothing at all under any circumstances"],
      correct: 1, diff: 2
    },
    {
      q: `"Recent analyses of unmanned aerial vehicle (UAV) operations indicate that while drones dramatically reduce risk to pilots, they introduce new vulnerabilities. Signal jamming can sever the link between the operator and the aircraft, and the latency inherent in satellite communication can delay operator reaction times by several hundred milliseconds — a gap that may prove critical in time-sensitive engagements."\n\nThe passage identifies which of the following as a limitation of drone operations?`,
      a: ["Drones are more expensive than manned aircraft", "Operators cannot see the battlefield clearly", "Communication delays can affect response time", "Drones cannot carry sufficient weaponry"],
      correct: 2, diff: 3
    },
  ],
  AR: [
    {
      q: "A military convoy travels 180 miles in 3 hours. At that rate, how long will it take to travel 300 miles?",
      a: ["4 hours", "5 hours", "6 hours", "4.5 hours"],
      correct: 1, diff: 1
    },
    {
      q: "A recruit scored 72, 85, 68, and 91 on four practice exams. What is the average score?",
      a: ["76", "79", "81", "74"],
      correct: 1, diff: 1
    },
    {
      q: "A supply depot has 1,200 MREs. If each squad of 12 soldiers receives 4 MREs per day, how many squads can be supplied for 5 days?",
      a: ["5 squads", "4 squads", "6 squads", "3 squads"],
      correct: 0, diff: 2
    },
    {
      q: "A fuel tank holds 240 gallons. If a generator uses 15 gallons per hour, how many hours can it run before the tank is empty?",
      a: ["14 hours", "15 hours", "16 hours", "18 hours"],
      correct: 2, diff: 1
    },
    {
      q: "Corporal Davis earns $2,400 per month. He saves 15% of his pay and sends 25% to his family. How much does he have left for other expenses?",
      a: ["$1,200", "$1,440", "$1,560", "$1,380"],
      correct: 1, diff: 2
    },
    {
      q: "A rectangular barracks floor measures 40 feet by 60 feet. If carpet tiles cover 4 square feet each, how many tiles are needed to cover the entire floor?",
      a: ["500", "600", "700", "2,400"],
      correct: 1, diff: 1
    },
    {
      q: "Two helicopters depart from the same base. One flies north at 120 mph, the other flies south at 150 mph. After 2 hours, how far apart are they?",
      a: ["480 miles", "540 miles", "270 miles", "300 miles"],
      correct: 1, diff: 2
    },
    {
      q: "A soldier can complete an obstacle course in 8 minutes. After training, his time improves by 12.5%. What is his new time?",
      a: ["6 minutes", "7 minutes", "7.5 minutes", "6.5 minutes"],
      correct: 1, diff: 3
    },
    {
      q: "A cylindrical water tank has a radius of 3 feet and a height of 7 feet. Using π ≈ 3.14, approximately how many cubic feet of water can it hold?",
      a: ["197.82 cu ft", "131.88 cu ft", "65.94 cu ft", "263.76 cu ft"],
      correct: 0, diff: 3
    },
    {
      q: "A unit of 45 soldiers needs to cross a river using boats that hold 8 soldiers each (plus one operator who is not counted among the 45). What is the minimum number of one-way trips needed to get all 45 soldiers across?",
      a: ["5 trips", "6 trips", "7 trips", "8 trips"],
      correct: 1, diff: 3
    },
  ],
  MK: [
    { q: "Solve for x: 3x + 9 = 24", a: ["5", "7", "3", "8"], correct: 0, diff: 1 },
    { q: "What is 7² − 3²?", a: ["40", "46", "10", "58"], correct: 0, diff: 1 },
    { q: "What is the value of (x³)(x⁴)?", a: ["x⁷", "x¹²", "x¹", "7x"], correct: 0, diff: 1 },
    { q: "What is the area of a triangle with a base of 14 cm and a height of 10 cm?", a: ["140 cm²", "70 cm²", "35 cm²", "100 cm²"], correct: 1, diff: 1 },
    {
      q: "Solve the system: 2x + y = 10 and x − y = 2. What is x?",
      a: ["3", "4", "5", "6"],
      correct: 1, diff: 2
    },
    {
      q: "What is the circumference of a circle with diameter 10? (Use π ≈ 3.14)",
      a: ["31.4", "62.8", "15.7", "78.5"],
      correct: 0, diff: 2
    },
    {
      q: "If the two legs of a right triangle are 9 and 12, what is the length of the hypotenuse?",
      a: ["15", "21", "13", "18"],
      correct: 0, diff: 2
    },
    {
      q: "Simplify: (4x² − 12x) / (4x)",
      a: ["x − 3", "x − 12", "x² − 3x", "4x − 12"],
      correct: 0, diff: 3
    },
    {
      q: "What are the solutions to x² − 5x + 6 = 0?",
      a: ["x = 2 and x = 3", "x = −2 and x = −3", "x = 1 and x = 6", "x = −1 and x = −6"],
      correct: 0, diff: 3
    },
    {
      q: "A line passes through the points (1, 2) and (4, 11). What is its slope?",
      a: ["3", "9", "4", "2"],
      correct: 0, diff: 3
    },
  ],
};

// ─── Config ───
const SUBTESTS = [
  { key: "WK", name: "Word Knowledge", icon: "📝", count: 10, color: "#2E7D32" },
  { key: "PC", name: "Paragraph Comprehension", icon: "📖", count: 10, color: "#1565C0" },
  { key: "AR", name: "Arithmetic Reasoning", icon: "🧮", count: 10, color: "#E65100" },
  { key: "MK", name: "Mathematics Knowledge", icon: "📐", count: 10, color: "#6A1B9A" },
];

const BRANCHES = [
  { name: "Army", min: 31 },
  { name: "Navy", min: 31 },
  { name: "Air Force", min: 31 },
  { name: "Marines", min: 32 },
  { name: "Coast Guard", min: 40 },
  { name: "Space Force", min: 36 },
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

// ─── Scoring ───
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

function computeAFQT(answers) {
  const wk = QUESTIONS.WK.filter((_, i) => answers.WK?.[i] === QUESTIONS.WK[i].correct).length;
  const pc = QUESTIONS.PC.filter((_, i) => answers.PC?.[i] === QUESTIONS.PC[i].correct).length;
  const ar = QUESTIONS.AR.filter((_, i) => answers.AR?.[i] === QUESTIONS.AR[i].correct).length;
  const mk = QUESTIONS.MK.filter((_, i) => answers.MK?.[i] === QUESTIONS.MK[i].correct).length;

  const ve = wk + pc;
  const compositeRaw = wk + pc + ar + mk;
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
              <span style={{
                fontFamily: "'JetBrains Mono', monospace", color: s.color
              }}>
                {s.score}/{s.max}
              </span>
            </div>
            <div style={{
              width: "100%", height: 8, background: "var(--od3)", borderRadius: 4,
              overflow: "hidden"
            }}>
              <div style={{
                width: `${(s.score / s.max) * 100}%`, height: "100%",
                background: s.color, borderRadius: 4,
                transition: "width 0.8s ease", transitionDelay: `${i * 0.15}s`
              }} />
            </div>
          </div>
        ))}

        <div style={{
          marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--od3)",
          display: "flex", justifyContent: "space-between", fontSize: 14
        }}>
          <span style={{ color: "var(--text2)" }}>
            Verbal Expression (VE): <span style={{
              fontFamily: "'JetBrains Mono', monospace", color: "var(--accent)"
            }}>{ve}/20</span>
          </span>
          <span style={{ color: "var(--text2)" }}>
            Total Correct: <span style={{
              fontFamily: "'JetBrains Mono', monospace", color: "var(--accent)"
            }}>{compositeRaw}/40</span>
          </span>
        </div>
      </div>

      {/* Branch Eligibility */}
      <div style={{
        background: "var(--od2)", borderRadius: 12, border: "1px solid var(--od3)",
        padding: 28, marginBottom: 24
      }}>
        <div style={{
          fontFamily: "'Oswald', sans-serif", fontSize: 13, letterSpacing: 3,
          textTransform: "uppercase", color: "var(--text2)", marginBottom: 16
        }}>
          BRANCH ELIGIBILITY (HS DIPLOMA)
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10
        }}>
          {BRANCHES.map((b, i) => {
            const eligible = percentile >= b.min;
            return (
              <div key={i} style={{
                padding: "12px 16px", borderRadius: 8,
                background: eligible ? "var(--accent)" + "15" : "var(--danger)" + "10",
                border: `1px solid ${eligible ? "var(--accent)" + "44" : "var(--danger)" + "33"}`,
                textAlign: "center"
              }}>
                <div style={{
                  fontFamily: "'Oswald', sans-serif", fontSize: 14,
                  color: eligible ? "var(--accent)" : "var(--danger)",
                  letterSpacing: 1
                }}>
                  {b.name}
                </div>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                  color: "var(--text2)", marginTop: 4
                }}>
                  Min: {b.min} {eligible ? "✓" : "✗"}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AFQT Categories */}
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
                padding: "8px 12px", borderRadius: 6,
                background: isYou ? "var(--accent)" + "15" : "transparent",
                border: isYou ? "1px solid var(--accent)" + "44" : "1px solid transparent"
              }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600,
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
                  <span style={{ fontSize: 15, color: "var(--text)" }}>
                    {s.icon} {s.name}
                  </span>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
                    color: s.color
                  }}>
                    {s.count} questions
                  </span>
                </div>
              ))}
            </div>

            <div style={{
              fontSize: 13, color: "var(--text2)", marginBottom: 32
            }}>
              No time limit. Questions range from Standard to Advanced difficulty.
            </div>

            <button
              onClick={() => {
                setStartTime(Date.now());
                setPhase("quiz");
              }}
              style={{
                fontFamily: "'Oswald', sans-serif", fontSize: 18, fontWeight: 600,
                letterSpacing: 4, textTransform: "uppercase",
                padding: "16px 48px", borderRadius: 8, border: "none",
                background: "var(--accent)", color: "var(--od)",
                cursor: "pointer", transition: "all 0.2s"
              }}
              onMouseEnter={e => e.target.style.background = "var(--accent2)"}
              onMouseLeave={e => e.target.style.background = "var(--accent)"}
            >
              BEGIN TEST
            </button>
          </div>
        )}

        {/* Quiz Screen */}
        {phase === "quiz" && (
          <div style={{
            maxWidth: 680, margin: "0 auto", padding: "32px 20px",
            display: "flex", flexDirection: "column", alignItems: "center",
            animation: "fadeSlide 0.3s ease-out"
          }}>
            {/* Subtest tabs */}
            <div style={{
              display: "flex", gap: 6, marginBottom: 24, width: "100%"
            }}>
              {SUBTESTS.map((s, i) => {
                const active = i === currentSubtest;
                const done = i < currentSubtest;
                return (
                  <div key={i} style={{
                    flex: 1, height: 4, borderRadius: 2,
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
