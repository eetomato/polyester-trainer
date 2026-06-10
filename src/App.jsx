import { useState } from "react";

const chunks = [
  {
    id: 1, label: "도입 — 폴리에스터란",
    tip: "핵심 흐름: 새로운 소재 → 석유 유래 → 제조 공정 순서",
    text: "Have you ever wondered why wearing polyester is bad for you? Polyester is actually a fairly new fabric created around the 1940s. To make it simple, polyester is a synthetic fiber derived from petroleum. The process starts with crude oil or discarded plastic bottles, which are broken down and melted at extremely high temperatures, turning them into a thick liquid.",
    keywords: ["1940s","synthetic fiber","petroleum","crude oil","discarded plastic bottles","thick liquid"],
    blanks: [
      { pre:"Polyester is a ", word:"synthetic fiber", post:" derived from petroleum." },
      { pre:"The process starts with crude oil or ", word:"discarded plastic bottles", post:", melted into a thick liquid." },
      { pre:"They are melted at extremely high temperatures into a ", word:"thick liquid", post:"." }
    ]
  },
  {
    id: 2, label: "제조 공정",
    tip: "순서 기억: 액체 → 스피너렛 → 실 → 냉각 → 염색",
    text: "This liquid is then pushed through tiny holes called spinnerets to form long plastic threads. These threads are then cooled and twisted into yarn. Finally, synthetic dyes and chemicals are added for color, softness, and stretch — creating polyester fabric which looks similar to other fabrics, except it's made from plastic.",
    keywords: ["spinnerets","long plastic threads","cooled and twisted","synthetic dyes","made from plastic"],
    blanks: [
      { pre:"The liquid is pushed through tiny holes called ", word:"spinnerets", post:" to form threads." },
      { pre:"Threads are cooled and twisted into yarn, then ", word:"synthetic dyes", post:" are added." },
      { pre:"It looks like fabric, but it's ", word:"made from plastic", post:"." }
    ]
  },
  {
    id: 3, label: "3가지 문제점",
    tip: "숫자로 묶어라: ① 수분→냄새 ② 마이크로플라스틱 ③ 호르몬",
    text: "First, it doesn't absorb moisture — instead, it moves sweat across the surface, making it notorious for odor retention. Second, there is constant shedding of microplastics throughout the garment's life cycle, especially when washing. Third, some studies suggest polyester could impact your hormones — lowering testosterone and sperm counts in men, and disrupting progesterone in women, which could affect fertility.",
    keywords: ["moisture","odor retention","microplastics","hormones","testosterone","progesterone","fertility"],
    blanks: [
      { pre:"Polyester doesn't absorb moisture — it's notorious for ", word:"odor retention", post:"." },
      { pre:"There is constant shedding of ", word:"microplastics", post:" especially when washing." },
      { pre:"It may lower ", word:"testosterone", post:" and disrupt progesterone, affecting fertility." }
    ]
  },
  {
    id: 4, label: "사용 이유 ①② — 가격 & 탄성",
    tip: "긍정 전환: 'That doesn't mean...' 을 기억하라",
    text: "With all that said, that doesn't necessarily mean polyester doesn't have a place in fashion. First and most obviously, it's cheaper to produce — allowing brands to make clothes at a lower cost. Second, polyester has great elastic recovery, which means it doesn't crease easily and holds pleats and folds really well — hence why Issey Miyake uses it for their famous A-POC trousers.",
    keywords: ["doesn't necessarily","cheaper to produce","elastic recovery","crease","pleats and folds","Issey Miyake"],
    blanks: [
      { pre:"Polyester doesn't necessarily mean it has no place in fashion. It's ", word:"cheaper to produce", post:"." },
      { pre:"It has great ", word:"elastic recovery", post:" — it doesn't crease." },
      { pre:"It holds ", word:"pleats and folds", post:" well, like Issey Miyake's A-POC trousers." }
    ]
  },
  {
    id: 5, label: "사용 이유 ③ — 고품질 & 블렌딩",
    tip: "핵심: '모든 폴리에스터가 같지 않다' → outerwear → blending",
    text: "Third, not all polyester is created equally. Higher quality polyesters can be stronger, smoother, and highly resistant to abrasion and UV degradation — performing well for products like outerwear shells. And blending polyester with natural fibers can offer functional benefits that you otherwise wouldn't get from the natural fabric alone.",
    keywords: ["not all polyester","abrasion","UV degradation","outerwear shells","blending","functional benefits"],
    blanks: [
      { pre:"Not all polyester is equal — high quality ones resist ", word:"abrasion", post:" and UV degradation." },
      { pre:"They perform well for ", word:"outerwear shells", post:"." },
      { pre:"", word:"Blending", post:" polyester with natural fibers can offer functional benefits." }
    ]
  },
  {
    id: 6, label: "결론 — 개인 철학",
    tip: "감성 마무리: 자연 섬유 선호 → The Saints → 질문 던지기",
    text: "For everyday staples, I personally would always favor natural fibers. Within my brand, The Saints, we decided to create clothes purely from natural fibers of the highest quality we can get our hands on. Nothing can replace the luxurious feel of a tightly knit soft merino wool, or a silky smooth pima cotton. But what do you think — does polyester have a place in fashion, or is there a happy medium?",
    keywords: ["everyday staples","The Saints","merino wool","pima cotton","happy medium"],
    blanks: [
      { pre:"For ", word:"everyday staples", post:", I always favor natural fibers." },
      { pre:"Nothing replaces the feel of soft ", word:"merino wool", post:" or silky smooth pima cotton." },
      { pre:"Is there a ", word:"happy medium", post:"?" }
    ]
  }
];

const MODES = ["① 읽기","② 키워드","③ 빈칸","④ 쉐도잉"];

export default function App() {
  const [ci, setCi] = useState(0);
  const [mode, setMode] = useState(0);
  const [done, setDone] = useState(new Set());
  const [hidden, setHidden] = useState(new Set());
  const [inputs, setInputs] = useState({});
  const [checked, setChecked] = useState(false);
  const [shadowText, setShadowText] = useState("");

  const chunk = chunks[ci];
  const progress = Math.round(done.size / chunks.length * 100);

  function goChunk(i) {
    setCi(i); setMode(0); setHidden(new Set()); setInputs({}); setChecked(false); setShadowText("");
  }
  function goMode(m) {
    setMode(m); setHidden(new Set()); setInputs({}); setChecked(false);
  }
  function toggleKw(kw) {
    setHidden(prev => { const n = new Set(prev); n.has(kw) ? n.delete(kw) : n.add(kw); return n; });
  }

  function isCorrect(i) {
    const val = (inputs[i] || "").toLowerCase().trim();
    const ans = chunk.blanks[i].word.toLowerCase().trim();
    return val === ans || ans.startsWith(val) || val.startsWith(ans.split(" ")[0]);
  }

  function checkFill() {
    setChecked(true);
    if (chunk.blanks.every((_, i) => isCorrect(i))) {
      setDone(prev => new Set([...prev, ci]));
    }
  }

  function markDone() {
    setDone(prev => new Set([...prev, ci]));
    if (ci < chunks.length - 1) setTimeout(() => goChunk(ci + 1), 600);
  }

  const s = {
    wrap: { maxWidth: 520, margin: "0 auto", padding: "20px 16px", minHeight: "100vh" },
    title: { fontSize: 18, fontWeight: 600, color: "#111", marginBottom: 4 },
    progBar: { height: 6, background: "#e8e8e8", borderRadius: 3, margin: "8px 0 4px" },
    progFill: { height: "100%", background: "#1D9E75", borderRadius: 3, transition: "width 0.4s" },
    progLabel: { fontSize: 12, color: "#888", marginBottom: 16 },
    navWrap: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 },
    modeWrap: { display: "flex", gap: 6, marginBottom: 14 },
    tip: { background: "#f0faf6", borderLeft: "3px solid #1D9E75", padding: "8px 12px", borderRadius: "0 8px 8px 0", fontSize: 13, color: "#0F6E56", marginBottom: 14, lineHeight: 1.6 },
    card: { background: "#fff", border: "1px solid #e8e8e8", borderRadius: 12, padding: "16px", marginBottom: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" },
    cardLabel: { fontSize: 11, fontWeight: 600, color: "#1D9E75", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 },
    scriptText: { fontSize: 15, lineHeight: 1.9, color: "#222" },
    btn: { flex: 1, padding: "10px 8px", fontSize: 14, borderRadius: 8, border: "1px solid #ddd", background: "#f5f5f5", color: "#444", cursor: "pointer" },
    btnGreen: { flex: 1, padding: "10px 8px", fontSize: 14, borderRadius: 8, border: "none", background: "#1D9E75", color: "#fff", cursor: "pointer", fontWeight: 500 },
    textarea: { width: "100%", minHeight: 90, padding: "10px 12px", fontSize: 14, border: "1px solid #ddd", borderRadius: 8, background: "#fafafa", fontFamily: "inherit", color: "#222", resize: "vertical" },
  };

  return (
    <div style={s.wrap}>
      <div style={s.title}>Polyester script trainer</div>
      <div style={s.progBar}><div style={{...s.progFill, width: progress + "%"}} /></div>
      <div style={s.progLabel}>{done.size} / {chunks.length} chunks 완료</div>

      {/* Chunk nav */}
      <div style={s.navWrap}>
        {chunks.map((c, i) => (
          <button key={i} onClick={() => goChunk(i)} style={{
            padding: "5px 11px", fontSize: 13, borderRadius: 8, cursor: "pointer",
            border: i === ci ? "none" : "1px solid #ddd",
            background: i === ci ? "#1D9E75" : done.has(i) ? "#e6f7f1" : "#f5f5f5",
            color: i === ci ? "#fff" : done.has(i) ? "#085041" : "#555",
            fontWeight: i === ci ? 600 : 400,
          }}>
            {done.has(i) ? "✓ " : ""}{c.id}
          </button>
        ))}
      </div>

      {/* Mode tabs */}
      <div style={s.modeWrap}>
        {MODES.map((m, i) => (
          <button key={i} onClick={() => goMode(i)} style={{
            ...( mode === i ? s.btnGreen : s.btn ),
            flex: 1, padding: "7px 4px", fontSize: 12,
          }}>{m}</button>
        ))}
      </div>

      <div style={s.tip}>{chunk.tip}</div>

      <div style={s.card}>
        <div style={s.cardLabel}>{chunk.id} / 6 — {chunk.label}</div>

        {/* READ */}
        {mode === 0 && <div style={s.scriptText}>{chunk.text}</div>}

        {/* KEYWORDS */}
        {mode === 1 && (
          <div style={s.scriptText}>
            {(() => {
              let parts = [chunk.text];
              chunk.keywords.forEach(kw => {
                parts = parts.flatMap(part => {
                  if (typeof part !== "string") return [part];
                  const idx = part.indexOf(kw);
                  if (idx === -1) return [part];
                  return [
                    part.slice(0, idx),
                    <span key={kw} onClick={() => toggleKw(kw)} style={{
                      background: hidden.has(kw) ? "#ccc" : "#E1F5EE",
                      color: hidden.has(kw) ? "#ccc" : "#085041",
                      padding: "1px 6px", borderRadius: 4, cursor: "pointer",
                      fontWeight: 500, userSelect: "none", transition: "all 0.15s",
                    }}>{hidden.has(kw) ? "\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0" : kw}</span>,
                    part.slice(idx + kw.length)
                  ];
                });
              });
              return parts;
            })()}
          </div>
        )}

        {/* FILL */}
        {mode === 2 && (
          <div>
            {chunk.blanks.map((b, i) => (
              <div key={i} style={{ marginBottom: 14, fontSize: 15, lineHeight: 2.3 }}>
                {b.pre}
                <input
                  value={inputs[i] || ""}
                  onChange={e => setInputs({ ...inputs, [i]: e.target.value })}
                  placeholder="?"
                  style={{
                    border: "none",
                    borderBottom: `2px solid ${!checked ? "#1D9E75" : isCorrect(i) ? "#1D9E75" : "#D85A30"}`,
                    background: !checked ? "transparent" : isCorrect(i) ? "#e6f7f1" : "#fef0ec",
                    fontSize: 15, padding: "0 5px", minWidth: 100, outline: "none",
                    fontFamily: "inherit", color: "#222",
                    borderRadius: checked ? 4 : 0,
                  }}
                />
                {b.post}
              </div>
            ))}
          </div>
        )}

        {/* SHADOW */}
        {mode === 3 && (
          <div>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>키워드 힌트</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
              {chunk.keywords.map(k => (
                <span key={k} style={{ background: "#f5f5f5", border: "1px solid #e0e0e0", padding: "3px 10px", borderRadius: 8, fontSize: 13, color: "#555" }}>{k}</span>
              ))}
            </div>
            <textarea
              value={shadowText}
              onChange={e => setShadowText(e.target.value)}
              placeholder="기억나는 내용을 자유롭게 적어보세요..."
              style={s.textarea}
            />
          </div>
        )}
      </div>

      {/* Buttons */}
      {mode === 0 && (
        <div style={{ display: "flex", gap: 8 }}>
          <button style={s.btnGreen} onClick={() => goMode(1)}>→ 키워드 가리기</button>
          {ci < chunks.length - 1 && <button style={s.btn} onClick={() => goChunk(ci + 1)}>다음 청크</button>}
        </div>
      )}
      {mode === 1 && (
        <div style={{ display: "flex", gap: 8 }}>
          <button style={s.btn} onClick={() => setHidden(new Set(chunk.keywords))}>전체 가리기</button>
          <button style={s.btn} onClick={() => setHidden(new Set())}>전체 보기</button>
          <button style={s.btnGreen} onClick={() => goMode(2)}>→ 빈칸</button>
        </div>
      )}
      {mode === 2 && (
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <button style={s.btnGreen} onClick={checkFill}>정답 확인</button>
            <button style={s.btn} onClick={() => goMode(3)}>→ 쉐도잉</button>
          </div>
          {checked && (
            <div style={{
              padding: "10px 14px", borderRadius: 8, fontSize: 14,
              background: chunk.blanks.every((_, i) => isCorrect(i)) ? "#e6f7f1" : "#fef0ec",
              color: chunk.blanks.every((_, i) => isCorrect(i)) ? "#085041" : "#7a2e10",
            }}>
              {chunk.blanks.every((_, i) => isCorrect(i))
                ? "완벽해요! 쉐도잉으로 넘어가세요."
                : "틀린 칸은 빨간색으로 표시됐어요. 다시 읽고 재시도!"}
            </div>
          )}
        </div>
      )}
      {mode === 3 && (
        <div>
          <button style={{ ...s.btnGreen, width: "100%" }} onClick={markDone}>
            ✓ 이 청크 완료{ci < chunks.length - 1 ? " → 다음으로" : ""}
          </button>
          {done.has(ci) && (
            <div style={{ marginTop: 8, padding: "10px 14px", borderRadius: 8, background: "#e6f7f1", color: "#085041", fontSize: 14 }}>
              {done.size === chunks.length ? "🎉 전체 완료! 처음부터 통암기 도전해봐!" : `완료! (${done.size}/6)`}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
