import { useState } from "react";

const waterTypes = [
  { id:"tap", name:"Tap water", emoji:"🚿", tagline:"Convenient & regulated", desc:"Municipally treated water, regulated by authorities. Quality varies by location — urban areas typically add chlorine and fluoride.", pros:["Free or very cheap","Zero packaging waste","Regularly tested & reported"], cons:["May contain chlorine byproducts","Old pipes can leach lead","Hard water common in many areas"], best:"Budget-conscious households in low-risk areas" },
  { id:"filtered", name:"Filtered water", emoji:"🔬", tagline:"Targeted purification", desc:"Tap water passed through a carbon, ceramic, or RO filter. Quality depends heavily on filter type and maintenance.", pros:["Removes chlorine & off-tastes","Cost-effective long term","Reduces key contaminants"], cons:["Filter maintenance required","Quality varies by grade","Some remove beneficial minerals"], best:"Most households — best overall value" },
  { id:"spring", name:"Spring water", emoji:"🌿", tagline:"Naturally occurring minerals", desc:"Collected from underground springs with naturally occurring minerals. Minimally processed compared to purified water.", pros:["Natural mineral balance","Clean fresh taste","No added chemicals"], cons:["Expensive & plastic-heavy","Purity not always guaranteed","Mineral content varies by brand"], best:"Those prioritising mineral intake and taste" },
  { id:"mineral", name:"Mineral water", emoji:"💎", tagline:"Rich in electrolytes", desc:"Bottled at source with a defined, consistent mineral composition — typically higher in calcium, magnesium, and sulfates.", pros:["Consistent mineral profile","Excellent electrolyte replenishment","Good for bone & nerve health"], cons:["Expensive","High plastic waste","Not suitable for low-mineral diets"], best:"Athletes, those with mineral deficiencies" },
  { id:"purified", name:"Purified / RO water", emoji:"⚗️", tagline:"Ultra-clean, mineral-free", desc:"Reverse osmosis or distillation removes virtually everything — contaminants and minerals alike. The purest option available.", pros:["Removes heavy metals & PFAS","Consistent reliable purity","Ideal for sensitive populations"], cons:["Removes beneficial minerals too","Can be slightly acidic","System costs can be high"], best:"Contaminated areas, pregnancy, immune conditions" }
];

const keyFactors = [
  { name:"pH level", ideal:"6.5 – 8.5", icon:"⚖️", desc:"Measures acidity vs alkalinity. Most healthy water falls in a neutral range. Extremely acidic or alkaline water affects taste and over time can impact health." },
  { name:"TDS (dissolved solids)", ideal:"50 – 500 mg/L", icon:"🧪", desc:"Total dissolved solids indicate mineral and salt content. Too low = flat taste and few minerals. Too high = possible contamination or excess salts." },
  { name:"Key minerals", ideal:"Ca, Mg, K balanced", icon:"⚡", desc:"Calcium supports bones, magnesium supports nerves and sleep, potassium supports heart function. Good water contributes meaningfully to your daily intake." },
  { name:"Contaminants to watch", ideal:"Below WHO limits", icon:"⚠️", desc:"Key risks: chlorine byproducts (THMs), lead from old pipes, nitrates from agriculture, PFAS (forever chemicals), and microplastics." }
];

const questions = [
  { id:"goal", text:"What is your primary health goal?", options:[{v:"hydration",l:"General daily hydration"},{v:"athletic",l:"Athletic performance & recovery"},{v:"detox",l:"Reduce toxin exposure"},{v:"condition",l:"Managing a health condition"}] },
  { id:"location", text:"Where do you live?", options:[{v:"urban",l:"Urban city (apartment / older building)"},{v:"suburban",l:"Suburban (newer infrastructure)"},{v:"rural",l:"Rural (well water or older pipes)"},{v:"coastal",l:"Coastal or industrial area"}] },
  { id:"source", text:"What do you currently drink most?", options:[{v:"tap",l:"Straight from the tap"},{v:"bottled",l:"Bottled water"},{v:"filtered",l:"Filtered (pitcher or under-sink)"},{v:"unsure",l:"Not sure / it varies"}] },
  { id:"concern", text:"What concerns you most about water?", options:[{v:"chemicals",l:"Chemicals & contaminants"},{v:"minerals",l:"Getting the right minerals"},{v:"taste",l:"Taste & smell"},{v:"environment",l:"Environmental impact"}] },
  { id:"health", text:"Any special health considerations?", options:[{v:"none",l:"None — generally healthy"},{v:"kidney",l:"Kidney or urinary concerns"},{v:"pregnancy",l:"Pregnant or nursing"},{v:"immune",l:"Compromised immune system"}] }
];

const typeMap = Object.fromEntries(waterTypes.map(t => [t.id, t]));

const riskColors = {
  low:  { bg:"var(--color-background-success)", text:"var(--color-text-success)", label:"Low risk" },
  medium: { bg:"var(--color-background-warning)", text:"var(--color-text-warning)", label:"Moderate risk" },
  high: { bg:"var(--color-background-danger)",  text:"var(--color-text-danger)",  label:"Higher risk" }
};

async function getAIRecommendation(answers) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: `You are a water quality and environmental health expert with deep knowledge of WHO guidelines, EPA standards, and nutritional science. Given a user's health profile, provide a detailed personalised water recommendation.

Respond ONLY with valid JSON — no markdown, no backticks, no preamble:
{
  "recommended": "filtered|tap|spring|mineral|purified",
  "headline": "short punchy 6-10 word headline for their recommendation",
  "why": "2-3 sentences tailored precisely to their specific combination of answers — mention their goal and location specifically",
  "lookFor": ["very specific item 1", "very specific item 2", "very specific item 3"],
  "avoid": ["specific item 1", "specific item 2"],
  "tip": "one very specific actionable pro tip directly relevant to their situation",
  "minerals": { "calcium": 0-100, "magnesium": 0-100, "potassium": 0-100, "sodium": 0-100 },
  "riskLevel": "low|medium|high",
  "riskReason": "one sentence explaining their specific water risk based on location and health"
}

The minerals object represents the IDEAL target range for this person (0 = avoid, 100 = prioritise highly).`,
      messages: [{
        role: "user",
        content: `User profile — Goal: ${answers.goal}, Location: ${answers.location}, Current source: ${answers.source}, Main concern: ${answers.concern}, Health notes: ${answers.health}`
      }]
    })
  });
  const data = await response.json();
  const text = data.content[0].text;
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

function MineralBar({ label, value }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 12, color:"var(--color-text-secondary)" }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 500, color:"var(--color-text-primary)" }}>{Math.round(value)}%</span>
      </div>
      <div style={{ height: 6, background:"var(--color-background-secondary)", borderRadius: 3, overflow:"hidden" }}>
        <div style={{
          height: "100%",
          width: `${value}%`,
          background: value > 66 ? "var(--color-text-success)" : value > 33 ? "var(--color-text-info)" : "var(--color-text-secondary)",
          borderRadius: 3,
          transition: "width 0.8s ease"
        }} />
      </div>
    </div>
  );
}

function WaterCard({ water }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background:"var(--color-background-primary)", border:"0.5px solid var(--color-border-tertiary)", borderRadius:"var(--border-radius-lg)", overflow:"hidden", marginBottom: 10 }}>
      <button onClick={() => setOpen(!open)} style={{ width:"100%", display:"flex", alignItems:"center", gap: 12, padding:"1rem 1.25rem", background:"none", border:"none", cursor:"pointer", textAlign:"left" }}>
        <span style={{ fontSize: 18 }}>{water.emoji}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 500, color:"var(--color-text-primary)" }}>{water.name}</div>
          <div style={{ fontSize: 12, color:"var(--color-text-secondary)" }}>{water.tagline}</div>
        </div>
        <span style={{ fontSize: 10, color:"var(--color-text-tertiary)", display:"inline-block", transform: open ? "rotate(180deg)" : "none", transition:"transform 0.2s" }}>▼</span>
      </button>
      {open && (
        <div style={{ padding:"0 1.25rem 1.25rem", borderTop:"0.5px solid var(--color-border-tertiary)" }}>
          <p style={{ fontSize: 13, lineHeight: 1.6, color:"var(--color-text-secondary)", margin:"1rem 0" }}>{water.desc}</p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap: 12, marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 500, color:"var(--color-text-success)", marginBottom: 6 }}>Pros</div>
              {water.pros.map((p,i) => <div key={i} style={{ fontSize: 12, padding:"2px 0", color:"var(--color-text-primary)" }}>+ {p}</div>)}
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 500, color:"var(--color-text-danger)", marginBottom: 6 }}>Cons</div>
              {water.cons.map((c,i) => <div key={i} style={{ fontSize: 12, padding:"2px 0", color:"var(--color-text-primary)" }}>− {c}</div>)}
            </div>
          </div>
          <div style={{ fontSize: 12, color:"var(--color-text-secondary)" }}>Best for: <strong style={{ fontWeight: 500, color:"var(--color-text-primary)" }}>{water.best}</strong></div>
        </div>
      )}
    </div>
  );
}

export default function WaterLiteracy() {
  const [tab, setTab]       = useState("learn");
  const [step, setStep]     = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState(null);

  async function handleAnswer(qId, val) {
    const newAnswers = { ...answers, [qId]: val };
    setAnswers(newAnswers);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setLoading(true);
      setError(null);
      setTab("result");
      try {
        const rec = await getAIRecommendation(newAnswers);
        setResult(rec);
      } catch (e) {
        setError("Something went wrong generating your recommendation. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  }

  function resetQuiz() {
    setStep(0);
    setAnswers({});
    setResult(null);
    setError(null);
    setLoading(false);
    setTab("quiz");
  }

  const recType = result ? typeMap[result.recommended] : null;
  const tabs = ["learn", "quiz", ...(result || loading ? ["result"] : [])];

  const s = {
    root: { maxWidth: 680, margin:"0 auto", padding:"0 0 3rem", fontSize: 15, color:"var(--color-text-primary)" },
    header: { borderBottom:"0.5px solid var(--color-border-tertiary)", paddingBottom:"1.25rem", marginBottom:"1.5rem" },
    navBar: { display:"flex", gap: 0, borderBottom:"0.5px solid var(--color-border-tertiary)", marginBottom:"2rem" },
    tabBtn: (active) => ({ background:"none", border:"none", borderBottom: active ? "2px solid var(--color-text-primary)" : "2px solid transparent", padding:"0.5rem 1rem", cursor:"pointer", fontSize: 14, fontWeight: active ? 500 : 400, color: active ? "var(--color-text-primary)" : "var(--color-text-secondary)", marginBottom: -1, transition:"color 0.15s" }),
    card: { background:"var(--color-background-primary)", border:"0.5px solid var(--color-border-tertiary)", borderRadius:"var(--border-radius-lg)", padding:"1.25rem", marginBottom: 12 },
    label: { fontSize: 11, fontWeight: 500, color:"var(--color-text-secondary)", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom: 8 },
    primaryBtn: { fontSize: 14, fontWeight: 500, padding:"0.6rem 1.5rem", background:"var(--color-text-primary)", color:"var(--color-background-primary)", border:"none", borderRadius:"var(--border-radius-md)", cursor:"pointer" },
    secondaryBtn: { fontSize: 14, padding:"0.6rem 1.25rem", background:"none", border:"0.5px solid var(--color-border-secondary)", borderRadius:"var(--border-radius-md)", cursor:"pointer", color:"var(--color-text-primary)" },
    optBtn: { width:"100%", textAlign:"left", padding:"0.85rem 1.25rem", background:"var(--color-background-primary)", border:"0.5px solid var(--color-border-secondary)", borderRadius:"var(--border-radius-lg)", cursor:"pointer", fontSize: 15, color:"var(--color-text-primary)", marginBottom: 10, transition:"border-color 0.15s" }
  };

  return (
    <div style={s.root}>
      <div style={s.header}>
        <div style={{ display:"flex", alignItems:"baseline", gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 21, fontWeight: 500 }}>Water Literacy</span>
          <span style={{ fontSize: 11, color:"var(--color-text-tertiary)", background:"var(--color-background-secondary)", padding:"2px 8px", borderRadius: 20, border:"0.5px solid var(--color-border-tertiary)" }}>AI-powered · open source</span>
        </div>
        <p style={{ fontSize: 13, color:"var(--color-text-secondary)", margin: 0 }}>Understand what's in your water — and discover what's best for you.</p>
      </div>

      <div style={s.navBar}>
        {tabs.map(t => (
          <button key={t} style={s.tabBtn(tab === t)} onClick={() => setTab(t)}>
            {t === "result" ? "My result" : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* LEARN TAB */}
      {tab === "learn" && (
        <div>
          <h2 style={{ fontSize: 19, fontWeight: 500, margin:"0 0 0.4rem" }}>Water types</h2>
          <p style={{ fontSize: 13, color:"var(--color-text-secondary)", margin:"0 0 1.25rem" }}>Each source has a different mineral profile, purity level, and cost.</p>
          {waterTypes.map(w => <WaterCard key={w.id} water={w} />)}

          <h2 style={{ fontSize: 19, fontWeight: 500, margin:"1.5rem 0 0.4rem" }}>What actually matters</h2>
          <p style={{ fontSize: 13, color:"var(--color-text-secondary)", margin:"0 0 1.25rem" }}>Four parameters that define water quality.</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(140px, 1fr))", gap: 10, marginBottom:"1.5rem" }}>
            {keyFactors.map(f => (
              <div key={f.name} style={{ ...s.card, marginBottom: 0 }}>
                <div style={{ fontSize: 16, marginBottom: 8 }}>{f.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 3 }}>{f.name}</div>
                <div style={{ fontSize: 11, color:"var(--color-text-info)", fontWeight: 500, marginBottom: 8 }}>{f.ideal}</div>
                <div style={{ fontSize: 12, color:"var(--color-text-secondary)", lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            ))}
          </div>
          <button style={s.primaryBtn} onClick={() => setTab("quiz")}>Find my water →</button>
        </div>
      )}

      {/* QUIZ TAB */}
      {tab === "quiz" && !loading && (
        <div>
          <div style={{ display:"flex", gap: 4, marginBottom:"1.75rem" }}>
            {questions.map((_, i) => (
              <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= step ? "var(--color-text-primary)" : "var(--color-border-tertiary)", transition:"background 0.3s" }} />
            ))}
          </div>
          <div style={{ fontSize: 12, color:"var(--color-text-tertiary)", marginBottom: 8 }}>Question {step + 1} of {questions.length}</div>
          <h2 style={{ fontSize: 20, fontWeight: 500, margin:"0 0 1.5rem", lineHeight: 1.35 }}>{questions[step].text}</h2>
          <div>
            {questions[step].options.map(o => (
              <button key={o.v} style={s.optBtn}
                onMouseEnter={e => e.currentTarget.style.borderColor = "var(--color-border-primary)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "var(--color-border-secondary)"}
                onClick={() => handleAnswer(questions[step].id, o.v)}>
                {o.l}
              </button>
            ))}
          </div>
          {step > 0 && (
            <button onClick={() => setStep(step - 1)} style={{ fontSize: 13, color:"var(--color-text-tertiary)", background:"none", border:"none", cursor:"pointer", marginTop:"1rem", padding: 0 }}>← Back</button>
          )}
        </div>
      )}

      {/* RESULT TAB */}
      {tab === "result" && (
        <div>
          {loading && (
            <div style={{ textAlign:"center", padding:"3rem 0" }}>
              <div style={{ fontSize: 28, marginBottom: 16 }}>💧</div>
              <div style={{ fontSize: 14, color:"var(--color-text-secondary)" }}>Analysing your water profile…</div>
              <div style={{ fontSize: 12, color:"var(--color-text-tertiary)", marginTop: 6 }}>Consulting WHO guidelines, EPA standards & nutritional science</div>
            </div>
          )}

          {error && (
            <div style={{ ...s.card, border:"0.5px solid var(--color-border-danger)" }}>
              <div style={{ fontSize: 14, color:"var(--color-text-danger)", marginBottom: 12 }}>{error}</div>
              <button style={s.secondaryBtn} onClick={resetQuiz}>Try again</button>
            </div>
          )}

          {result && recType && (
            <div>
              <div style={{ marginBottom:"1.5rem" }}>
                <div style={{ fontSize: 11, color:"var(--color-text-tertiary)", marginBottom: 6, textTransform:"uppercase", letterSpacing:"0.06em" }}>Your AI-powered recommendation</div>
                <h2 style={{ fontSize: 24, fontWeight: 500, margin:"0 0 4px" }}>{recType.name} {recType.emoji}</h2>
                <div style={{ fontSize: 14, color:"var(--color-text-secondary)", fontStyle:"italic" }}>{result.headline}</div>
              </div>

              {/* Risk badge */}
              {result.riskLevel && (() => {
                const rc = riskColors[result.riskLevel] || riskColors.low;
                return (
                  <div style={{ display:"flex", alignItems:"flex-start", gap: 10, background: rc.bg, border:`0.5px solid ${rc.text}`, borderRadius:"var(--border-radius-lg)", padding:"0.85rem 1.25rem", marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 500, color: rc.text, marginBottom: 3 }}>{rc.label}</div>
                      <div style={{ fontSize: 13, color:"var(--color-text-primary)", lineHeight: 1.5 }}>{result.riskReason}</div>
                    </div>
                  </div>
                );
              })()}

              {/* Why */}
              <div style={s.card}>
                <div style={s.label}>Why this works for you</div>
                <p style={{ fontSize: 14, lineHeight: 1.7, margin: 0 }}>{result.why}</p>
              </div>

              {/* Look for / Avoid */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 12 }}>
                <div style={{ ...s.card, marginBottom: 0 }}>
                  <div style={{ ...s.label, color:"var(--color-text-success)" }}>Look for</div>
                  {result.lookFor.map((l, i) => (
                    <div key={i} style={{ fontSize: 13, padding:"4px 0", display:"flex", gap: 8, alignItems:"flex-start" }}>
                      <span style={{ color:"var(--color-text-success)", marginTop: 1 }}>✓</span><span>{l}</span>
                    </div>
                  ))}
                </div>
                <div style={{ ...s.card, marginBottom: 0 }}>
                  <div style={{ ...s.label, color:"var(--color-text-danger)" }}>Avoid</div>
                  {result.avoid.map((a, i) => (
                    <div key={i} style={{ fontSize: 13, padding:"4px 0", display:"flex", gap: 8, alignItems:"flex-start" }}>
                      <span style={{ color:"var(--color-text-danger)", marginTop: 1 }}>✕</span><span>{a}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mineral profile */}
              {result.minerals && (
                <div style={{ ...s.card }}>
                  <div style={s.label}>Ideal mineral priorities for you</div>
                  <p style={{ fontSize: 12, color:"var(--color-text-secondary)", margin:"0 0 1rem" }}>How much to prioritise each mineral in your water, based on your health profile.</p>
                  {Object.entries(result.minerals).map(([k, v]) => (
                    <MineralBar key={k} label={k.charAt(0).toUpperCase() + k.slice(1)} value={v} />
                  ))}
                </div>
              )}

              {/* Pro tip */}
              <div style={{ background:"var(--color-background-secondary)", border:"0.5px solid var(--color-border-tertiary)", borderRadius:"var(--border-radius-lg)", padding:"1.25rem", marginBottom:"1.5rem" }}>
                <div style={s.label}>Pro tip</div>
                <p style={{ fontSize: 14, lineHeight: 1.7, margin: 0, fontStyle:"italic" }}>{result.tip}</p>
              </div>

              <div style={{ display:"flex", gap: 10, flexWrap:"wrap" }}>
                <button style={s.secondaryBtn} onClick={resetQuiz}>Retake quiz</button>
                <button style={s.primaryBtn} onClick={() => setTab("learn")}>Explore water types</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
