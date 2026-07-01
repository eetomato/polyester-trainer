import { useState, useEffect, useRef } from "react";

// ── 사전 (마크 맞춤 단어장) ──────────────────────────────────
const DICT = {
  "fairly": "꽤, 상당히",
  "synthetic": "합성의 — 자연이 아닌 사람이 만든",
  "derived": "~에서 얻어진, 유래된",
  "petroleum": "석유",
  "crude": "정제 안 된, 원래 그대로의",
  "discarded": "버려진, 폐기된",
  "extremely": "극도로, 매우",
  "thick": "두꺼운, 걸쭉한",
  "wondered": "궁금했다",
  "wearing": "입는 것",
  "bad": "나쁜",
  "new": "새로운",
  "fabric": "천, 옷감",
  "simple": "간단한",
  "fiber": "실, 섬유",
  "oil": "기름",
  "bottles": "병들",
  "broken": "부서진",
  "melted": "녹은",
  "liquid": "액체",
  "tiny": "아주 작은",
  "holes": "구멍들",
  "long": "긴",
  "threads": "실",
  "cooled": "식혀진",
  "twisted": "비틀어진",
  "yarn": "실뭉치",
  "color": "색깔",
  "soft": "부드러운",
  "similar": "비슷한",
  "plastic": "플라스틱",
  "absorb": "흡수하다",
  "sweat": "땀",
  "surface": "표면",
  "smell": "냄새",
  "washing": "세탁",
  "impact": "영향",
  "lower": "낮추다",
  "affect": "영향을 주다",
  "cheap": "저렴한",
  "cheaper": "더 저렴한",
  "cost": "비용",
  "great": "훌륭한",
  "hold": "유지하다",
  "well": "잘",
  "stronger": "더 강한",
  "smooth": "부드러운",
  "smoother": "더 부드러운",
  "shell": "껍데기, 겉옷",
  "alone": "혼자, 단독으로",
  "always": "항상",
  "feel": "느낌",
  "tightly": "꽉 짜인",
  "replace": "대신하다",
  "think": "생각하다",
  "place": "자리, 위치",
};

// ── 데이터 ────────────────────────────────────────────────────
const defaultChunks = [
  {
    id: 1, label: "도입 — 폴리에스터란",
    tip: "핵심 흐름: 새로운 소재 → 석유 유래 → 제조 공정 순서",
    slashText: "Have you ever wondered / why wearing polyester / is bad for you? / Polyester is actually / a fairly new fabric / created around the 1940s. / To make it simple, / polyester is a synthetic fiber / derived from petroleum. / The process starts / with crude oil / or discarded plastic bottles, / which are broken down / and melted at extremely high temperatures, / turning them into a thick liquid.",
    text: "Have you ever wondered why wearing polyester is bad for you? Polyester is actually a fairly new fabric created around the 1940s. To make it simple, polyester is a synthetic fiber derived from petroleum. The process starts with crude oil or discarded plastic bottles, which are broken down and melted at extremely high temperatures, turning them into a thick liquid.",
    pattern: { label: "be derived from ~", desc: "~에서 유래되다 / 추출되다", example: "polyester is a synthetic fiber derived from petroleum." },
    keywords: ["1940s","synthetic fiber","petroleum","crude oil","discarded plastic bottles","thick liquid"],
    blanks: [
      { pre:"Polyester is a ", word:"synthetic fiber", post:" derived from petroleum.", opts:["natural fabric","synthetic fiber","thick liquid"] },
      { pre:"The process starts with crude oil or ", word:"discarded plastic bottles", post:".", opts:["recycled cotton","discarded plastic bottles","natural rubber"] },
      { pre:"They are melted into a ", word:"thick liquid", post:".", opts:["thin thread","thick liquid","dry powder"] }
    ],
    puzzleSentences: [
      ["Have you ever wondered","why wearing polyester","is bad for you?"],
      ["polyester is","a synthetic fiber","derived from petroleum."],
      ["The process starts","with crude oil","or discarded plastic bottles."],
    ]
  },
  {
    id: 2, label: "제조 공정",
    tip: "순서 기억: 액체 → 스피너렛 → 실 → 냉각 → 염색",
    slashText: "This liquid / is then pushed / through tiny holes / called spinnerets / to form long plastic threads. / These threads / are then cooled and twisted / into yarn. / Finally, synthetic dyes and chemicals / are added / for color, softness, and stretch — / creating polyester fabric / which looks similar / to many other fabrics, / except it's made from plastic.",
    text: "This liquid is then pushed through tiny holes called spinnerets to form long plastic threads. These threads are then cooled and twisted into yarn. Finally, synthetic dyes and chemicals are added for color, softness, and stretch — creating polyester fabric which looks similar to many other fabrics, except it's made from plastic.",
    pattern: { label: "be + p.p. (수동태)", desc: "주어가 행동을 당하거나 처리될 때 사용", example: "threads are cooled and twisted into yarn." },
    keywords: ["spinnerets","long plastic threads","cooled and twisted","synthetic dyes","made from plastic"],
    blanks: [
      { pre:"The liquid is pushed through tiny holes called ", word:"spinnerets", post:".", opts:["spinnerets","filters","nozzles"] },
      { pre:"Threads are cooled and twisted into ", word:"yarn", post:".", opts:["fabric","yarn","plastic"] },
      { pre:"It looks like fabric, but it's ", word:"made from plastic", post:".", opts:["made from cotton","made from plastic","made from rubber"] }
    ],
    puzzleSentences: [
      ["This liquid","is pushed through","tiny holes called spinnerets."],
      ["These threads","are cooled and twisted","into yarn."],
      ["synthetic dyes","are added","for color, softness, and stretch."],
    ]
  },
  {
    id: 3, label: "3가지 문제점",
    tip: "숫자로 묶어라: ① 수분→냄새 ② 마이크로플라스틱 ③ 호르몬",
    slashText: "First, / it doesn't absorb moisture — / instead, it moves sweat / across the surface, / making it notorious / for odor retention. / Second, / there is constant shedding / of microplastics / throughout the garment's life cycle, / especially when washing. / Third, / some studies suggest / polyester could impact your hormones — / lowering testosterone and sperm counts in men, / and disrupting progesterone in women, / which could affect fertility.",
    text: "First, it doesn't absorb moisture — instead, it moves sweat across the surface, making it notorious for odor retention. Second, there is constant shedding of microplastics throughout the garment's life cycle, especially when washing. Third, some studies suggest polyester could impact your hormones — lowering testosterone and sperm counts in men, and disrupting progesterone in women, which could affect fertility.",
    pattern: { label: "making it + 형용사", desc: "앞 문장의 결과를 이어서 설명하는 분사구문", example: "it moves sweat across the surface, making it notorious for odor retention." },
    keywords: ["moisture","odor retention","microplastics","hormones","testosterone","progesterone","fertility"],
    blanks: [
      { pre:"Polyester doesn't absorb moisture — it's notorious for ", word:"odor retention", post:".", opts:["water resistance","odor retention","color fading"] },
      { pre:"There is constant shedding of ", word:"microplastics", post:" when washing.", opts:["microplastics","natural fibers","synthetic dyes"] },
      { pre:"It may lower ", word:"testosterone", post:" and disrupt progesterone.", opts:["testosterone","progesterone","fertility"] }
    ],
    puzzleSentences: [
      ["it doesn't absorb moisture —","instead, it moves sweat","across the surface."],
      ["there is constant shedding","of microplastics","throughout the garment's life cycle."],
      ["polyester could impact","your hormones,","affecting fertility."],
    ]
  },
  {
    id: 4, label: "사용 이유 ①② — 가격 & 탄성",
    tip: "긍정 전환: 'That doesn't mean...' 을 기억하라",
    slashText: "With all that said, / that doesn't necessarily mean / polyester doesn't have a place / in fashion at all. / First and most obviously, / it's cheaper to produce — / allowing brands to make clothes / at a lower cost. / Second, / polyester has great elastic recovery, / which means / it doesn't crease easily / and holds pleats and folds / really well — / hence why Issey Miyake / uses it for their famous A-POC trousers.",
    text: "With all that said, that doesn't necessarily mean polyester doesn't have a place in fashion at all. First and most obviously, it's cheaper to produce — allowing brands to make clothes at a lower cost. Second, polyester has great elastic recovery, which means it doesn't crease easily and holds pleats and folds really well — hence why Issey Miyake uses it for their famous A-POC trousers.",
    pattern: { label: "which means ~", desc: "앞 내용을 받아 의미·결과를 설명하는 관계절", example: "polyester has great elastic recovery, which means it doesn't crease easily." },
    keywords: ["doesn't necessarily","cheaper to produce","elastic recovery","crease","pleats and folds","Issey Miyake"],
    blanks: [
      { pre:"That doesn't necessarily mean polyester has no place. It's ", word:"cheaper to produce", post:".", opts:["harder to recycle","cheaper to produce","better for skin"] },
      { pre:"It has great ", word:"elastic recovery", post:".", opts:["elastic recovery","color stability","UV resistance"] },
      { pre:"It holds ", word:"pleats and folds", post:" really well.", opts:["pleats and folds","shape and color","water and dirt"] }
    ],
    puzzleSentences: [
      ["that doesn't necessarily mean","polyester doesn't have","a place in fashion."],
      ["it's cheaper to produce —","allowing brands","to make clothes at a lower cost."],
      ["polyester has great elastic recovery,","which means","it doesn't crease easily."],
    ]
  },
  {
    id: 5, label: "사용 이유 ③ — 고품질 & 블렌딩",
    tip: "핵심: '모든 폴리에스터가 같지 않다' → outerwear → blending",
    slashText: "Third, / not all polyester is created equally. / Higher quality polyesters / can be stronger, smoother, / and highly resistant / to abrasion and UV degradation — / performing well / for products like outerwear shells. / And blending polyester / with natural fibers / can offer functional benefits / that you otherwise wouldn't get / from the natural fabric alone.",
    text: "Third, not all polyester is created equally. Higher quality polyesters can be stronger, smoother, and highly resistant to abrasion and UV degradation — performing well for products like outerwear shells. And blending polyester with natural fibers can offer functional benefits that you otherwise wouldn't get from the natural fabric alone.",
    pattern: { label: "not all ~ (부분 부정)", desc: "'모두 ~한 것은 아니다' — 일부는 그렇지 않다는 표현", example: "not all polyester is created equally." },
    keywords: ["not all polyester","abrasion","UV degradation","outerwear shells","blending","functional benefits"],
    blanks: [
      { pre:"Not all polyester is equal — they resist ", word:"abrasion", post:" and UV degradation.", opts:["abrasion","moisture","heat"] },
      { pre:"They perform well for ", word:"outerwear shells", post:".", opts:["outerwear shells","casual shirts","dress trousers"] },
      { pre:"Blending polyester with natural fibers can offer ", word:"functional benefits", post:".", opts:["functional benefits","lower prices","better colors"] }
    ],
    puzzleSentences: [
      ["not all polyester","is created","equally."],
      ["Higher quality polyesters","are highly resistant","to abrasion and UV degradation."],
      ["blending polyester","with natural fibers","can offer functional benefits."],
    ]
  },
  {
    id: 6, label: "결론 — 개인 철학",
    tip: "감성 마무리: 자연 섬유 선호 → The Saints → 질문 던지기",
    slashText: "For everyday staples, / I personally would always / favor natural fibers. / Within my brand, The Saints, / we decided to create clothes / purely from natural fibers / of the highest quality / we can get our hands on. / Nothing can replace / the luxurious feel / of a tightly knit soft merino wool, / or a silky smooth pima cotton. / But what do you think — / does polyester have a place in fashion, / or is there a happy medium?",
    text: "For everyday staples, I personally would always favor natural fibers. Within my brand, The Saints, we decided to create clothes purely from natural fibers of the highest quality we can get our hands on. Nothing can replace the luxurious feel of a tightly knit soft merino wool, or a silky smooth pima cotton. But what do you think — does polyester have a place in fashion, or is there a happy medium?",
    pattern: { label: "Nothing can replace ~", desc: "'~를 대체할 수 있는 것은 없다' — 강조 표현", example: "Nothing can replace the luxurious feel of merino wool." },
    keywords: ["everyday staples","The Saints","merino wool","pima cotton","happy medium"],
    blanks: [
      { pre:"For ", word:"everyday staples", post:", I always favor natural fibers.", opts:["everyday staples","special occasions","formal events"] },
      { pre:"Nothing replaces the feel of soft ", word:"merino wool", post:".", opts:["merino wool","polyester blend","pima cotton"] },
      { pre:"Is there a ", word:"happy medium", post:"?", opts:["happy medium","clear answer","simple solution"] }
    ],
    puzzleSentences: [
      ["For everyday staples,","I would always","favor natural fibers."],
      ["Nothing can replace","the luxurious feel","of merino wool."],
      ["does polyester have","a place in fashion,","or is there a happy medium?"],
    ]
  }
];

const MODES = ["① 읽기","② 키워드","③ 빈칸","④ 퍼즐"];

// ── TTS 음성 재생 ────────────────────────────────────────────
function speak(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US"; u.rate = 0.9;
  window.speechSynthesis.speak(u);
}

// ── 단어 툴팁 ────────────────────────────────────────────────
function Tooltip({ word, onClose }) {
  const clean = word.toLowerCase().replace(/[^a-z]/g,"");
  const key = Object.keys(DICT).find(k => k === clean);
  const meaning = key ? DICT[key] : null;
  useEffect(() => { if (meaning) speak(word); }, []);
  if (!meaning) return null;
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.35)"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:16,padding:"20px 24px",maxWidth:300,width:"90%",boxShadow:"0 8px 32px rgba(0,0,0,0.2)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
          <div style={{fontSize:20,fontWeight:700,color:"#111"}}>{word}</div>
          <button onClick={()=>speak(word)} style={{padding:"4px 10px",borderRadius:8,border:"none",background:"#f0faf6",color:"#1D9E75",fontSize:13,cursor:"pointer"}}>🔊</button>
        </div>
        <div style={{fontSize:15,color:"#444",lineHeight:1.7}}>{meaning}</div>
        <button onClick={onClose} style={{marginTop:14,width:"100%",padding:"9px",borderRadius:8,border:"none",background:"#1D9E75",color:"#fff",fontSize:14,cursor:"pointer"}}>닫기</button>
      </div>
    </div>
  );
}

// ── 읽기 모드 텍스트 (청크 전체 + 문장별 재생) ──────────────
function SlashText({ slashText, text, chunkText }) {
  const [tooltip, setTooltip] = useState(null);
  const [playingIdx, setPlayingIdx] = useState(null); // null=없음, -1=전체, 0~N=문장

  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];

  function playText(t, idx) {
    window.speechSynthesis.cancel();
    setPlayingIdx(idx);
    const u = new SpeechSynthesisUtterance(t);
    u.lang = "en-US"; u.rate = 0.85;
    u.onend = () => setPlayingIdx(null);
    window.speechSynthesis.speak(u);
  }

  function renderSlashLine(slashLine) {
    const parts = slashLine.split(" / ");
    return parts.map((phrase, pi) => (
      <span key={pi}>
        {phrase.split(/(\s+)/).map((w, wi) => {
          const clean = w.replace(/[^a-zA-Z]/g,"").toLowerCase();
          const hasDict = clean && Object.keys(DICT).includes(clean);
          return (
            <span key={wi}
              onClick={hasDict ? (e)=>{ e.stopPropagation(); setTooltip(clean); } : undefined}
              style={hasDict ? {borderBottom:"1.5px dotted #1D9E75",cursor:"pointer",color:"#0a5c3f"} : {}}
            >{w}</span>
          );
        })}
        {pi < parts.length - 1 && <span style={{color:"#1D9E75",fontWeight:700,margin:"0 3px"}}>/</span>}
        {" "}
      </span>
    ));
  }

  return (
    <div style={{fontSize:15,lineHeight:1.9,color:"#222"}}>
      {tooltip && <Tooltip word={tooltip} onClose={()=>setTooltip(null)} />}

      {/* 청크 전체 재생 */}
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14,paddingBottom:10,borderBottom:"1px solid #f0f0f0"}}>
        <button onClick={()=>playText(text, -1)} style={{
          display:"flex",alignItems:"center",gap:5,padding:"6px 14px",borderRadius:20,border:"none",
          background: playingIdx===-1 ? "#1D9E75" : "#e8f7f1",
          color: playingIdx===-1 ? "#fff" : "#1D9E75",
          fontSize:13,cursor:"pointer",fontWeight:500,
        }}>▶ 전체 듣기</button>
      </div>

      {/* 문장별 */}
      {sentences.map((sent, si) => (
        <div key={si} style={{display:"flex",alignItems:"flex-start",gap:8,marginBottom:12}}>
          <button onClick={()=>playText(sent.trim(), si)} style={{
            flexShrink:0,marginTop:3,width:24,height:24,borderRadius:"50%",border:"none",
            background: playingIdx===si ? "#1D9E75" : "#e8f7f1",
            color: playingIdx===si ? "#fff" : "#1D9E75",
            fontSize:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
          }}>▶</button>
          <div style={{flex:1}}>
            {renderSlashLine(slashText.split(" / ").filter(p =>
              sent.toLowerCase().includes(p.replace(/[^a-zA-Z ]/g,"").toLowerCase().trim().slice(0,10))
            ).join(" / ") || sent)}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── 퍼즐 모드 ────────────────────────────────────────────────
function PuzzleMode({ chunk, onDone }) {
  const [sentIdx, setSentIdx] = useState(0);
  const [selected, setSelected] = useState([]);
  const [shuffled, setShuffled] = useState([]);
  const [result, setResult] = useState(null); // "correct" | "wrong"
  const [allDone, setAllDone] = useState(false);

  const sentences = chunk.puzzleSentences;

  useEffect(() => { initSentence(0); }, [chunk]);

  function initSentence(idx) {
    const arr = [...sentences[idx]];
    // Fisher-Yates shuffle
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setShuffled(arr);
    setSelected([]);
    setResult(null);
    setSentIdx(idx);
  }

  function tapCard(card) {
    if (result) return;
    if (selected.includes(card)) {
      setSelected(selected.filter(c => c !== card));
    } else {
      const next = [...selected, card];
      setSelected(next);
      if (next.length === sentences[sentIdx].length) {
        const correct = next.join(" ") === sentences[sentIdx].join(" ");
        setResult(correct ? "correct" : "wrong");
        if (correct) speak(sentences[sentIdx].join(" "));
      }
    }
  }

  function next() {
    if (sentIdx < sentences.length - 1) {
      initSentence(sentIdx + 1);
    } else {
      setAllDone(true);
      onDone();
    }
  }

  function retry() { initSentence(sentIdx); }

  const remaining = shuffled.filter(c => !selected.includes(c));

  return (
    <div>
      <div style={{fontSize:12,color:"#888",marginBottom:10}}>문장 {sentIdx+1} / {sentences.length} — 올바른 순서로 탭하세요</div>

      {/* 선택된 카드 영역 */}
      <div style={{minHeight:52,background:"#f9fdf9",border:"1.5px solid #1D9E75",borderRadius:10,padding:"10px 12px",marginBottom:12,display:"flex",flexWrap:"wrap",gap:6,alignItems:"center"}}>
        {selected.length === 0
          ? <span style={{color:"#bbb",fontSize:13}}>여기에 순서대로 쌓입니다</span>
          : selected.map((c,i) => (
            <span key={i} onClick={()=>{ if(!result) setSelected(selected.filter((_,j)=>j!==i)); }}
              style={{background:"#1D9E75",color:"#fff",padding:"5px 10px",borderRadius:8,fontSize:13,cursor:"pointer"}}>
              {c}
            </span>
          ))
        }
      </div>

      {/* 남은 카드 */}
      <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16}}>
        {remaining.map((c,i) => (
          <span key={i} onClick={()=>tapCard(c)}
            style={{background:"#f0f0f0",color:"#333",padding:"7px 12px",borderRadius:8,fontSize:13,cursor:"pointer",border:"1px solid #ddd"}}>
            {c}
          </span>
        ))}
      </div>

      {result === "correct" && (
        <div style={{background:"#e6f7f1",color:"#085041",padding:"10px 14px",borderRadius:8,fontSize:14,marginBottom:10}}>
          ✓ 정답! 🎉
        </div>
      )}
      {result === "wrong" && (
        <div style={{background:"#fef0ec",color:"#7a2e10",padding:"10px 14px",borderRadius:8,fontSize:14,marginBottom:10}}>
          순서가 틀렸어요. 다시 해봐!
        </div>
      )}

      <div style={{display:"flex",gap:8}}>
        {result === "wrong" && <button onClick={retry} style={{flex:1,padding:"9px",borderRadius:8,border:"1px solid #ddd",background:"#f5f5f5",fontSize:14,cursor:"pointer"}}>다시 시도</button>}
        {result === "correct" && (
          <button onClick={next} style={{flex:1,padding:"9px",borderRadius:8,border:"none",background:"#1D9E75",color:"#fff",fontSize:14,cursor:"pointer"}}>
            {sentIdx < sentences.length - 1 ? "다음 문장 →" : "✓ 완료!"}
          </button>
        )}
      </div>
      {allDone && <div style={{marginTop:8,color:"#1D9E75",fontSize:14,fontWeight:500}}>이 청크 퍼즐 완료!</div>}
    </div>
  );
}

// ── 스크립트 추가 모달 ────────────────────────────────────────
function AddScriptModal({ onClose, onAdd }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    if (!text.trim()) return;
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/generate", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:2000,
          messages:[{ role:"user", content:`아래 영어 스크립트를 암기 학습용으로 분석해줘. JSON만 출력하고 다른 텍스트는 절대 쓰지 마.

형식:
{
  "chunks": [
    {
      "label": "섹션 제목 (한국어, 15자 이내)",
      "tip": "암기 팁 (한국어, 30자 이내)",
      "text": "원문 텍스트",
      "slashText": "끊어읽기 슬래시 포함 텍스트 (/ 로 구분)",
      "pattern": { "label": "패턴명", "desc": "한국어 설명", "example": "예문" },
      "keywords": ["핵심단어1", "핵심단어2"],
      "blanks": [
        {"pre": "앞텍스트", "word": "정답", "post": "뒤텍스트", "opts": ["오답1", "정답", "오답2"]}
      ],
      "puzzleSentences": [
        ["청크1", "청크2", "청크3"]
      ]
    }
  ]
}

규칙:
- 3~6개 청크로 나눠
- slashText는 의미 단위로 / 삽입
- pattern은 구동사, 수동태, 분사구문 등 문법 패턴 1개
- blanks 2~3개, opts는 항상 3개 (정답 포함)
- puzzleSentences는 청크당 2~3문장, 각 문장을 2~4개 덩어리로

스크립트:
${text}` }]
        })
      });
      const data = await res.json();
      const raw = data.content[0].text.replace(/```json|```/g,"").trim();
      const parsed = JSON.parse(raw);
      onAdd(parsed.chunks);
    } catch(e) {
      setError("생성 실패. 다시 시도해줘.");
    }
    setLoading(false);
  }

  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:1000,background:"rgba(0,0,0,0.4)",display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:"20px 20px 0 0",padding:"24px 20px",width:"100%",maxWidth:520}}>
        <div style={{fontSize:16,fontWeight:600,marginBottom:4}}>새 스크립트 추가</div>
        <div style={{fontSize:13,color:"#888",marginBottom:14}}>영어 텍스트를 붙여넣으면 AI가 자동으로 분석해줘.</div>
        <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="스크립트를 여기에 붙여넣어..."
          style={{width:"100%",minHeight:140,padding:"10px 12px",fontSize:14,border:"1px solid #ddd",borderRadius:10,fontFamily:"inherit",resize:"vertical",boxSizing:"border-box"}}
        />
        {error && <div style={{color:"#c0392b",fontSize:13,marginTop:6}}>{error}</div>}
        <div style={{display:"flex",gap:8,marginTop:12}}>
          <button onClick={onClose} style={{flex:1,padding:"10px",borderRadius:8,border:"1px solid #ddd",background:"#f5f5f5",fontSize:14,cursor:"pointer"}}>취소</button>
          <button onClick={generate} disabled={loading||!text.trim()} style={{flex:2,padding:"10px",borderRadius:8,border:"none",background:loading?"#aaa":"#1D9E75",color:"#fff",fontSize:14,cursor:"pointer",fontWeight:500}}>
            {loading ? "AI 분석 중..." : "✦ AI로 생성"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── 메인 ─────────────────────────────────────────────────────
export default function App() {
  const [scripts, setScripts] = useState([{ title:"Polyester", chunks: defaultChunks }]);
  const [scriptIdx, setScriptIdx] = useState(0);
  const [ci, setCi] = useState(0);
  const [mode, setMode] = useState(0);
  const [done, setDone] = useState(new Set());
  const [hidden, setHidden] = useState(new Set());
  const [inputs, setInputs] = useState({});
  const [checked, setChecked] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const chunks = scripts[scriptIdx].chunks;
  const chunk = chunks[ci];
  const progress = Math.round(done.size / chunks.length * 100);

  function goChunk(i) { setCi(i); setMode(0); setHidden(new Set()); setInputs({}); setChecked(false); }
  function goMode(m) { setMode(m); setHidden(new Set()); setInputs({}); setChecked(false); }
  function toggleKw(kw) { setHidden(prev => { const n=new Set(prev); n.has(kw)?n.delete(kw):n.add(kw); return n; }); }

  function isCorrect(i) { return inputs[i] === chunk.blanks[i].word; }

  function checkFill() {
    setChecked(true);
    if (chunk.blanks.every((_,i) => isCorrect(i))) setDone(prev => new Set([...prev, ci]));
  }

  function addScript(newChunks) {
    const numbered = newChunks.map((c,i) => ({...c, id:i+1}));
    const newIdx = scripts.length;
    setScripts(prev => [...prev, { title:`스크립트 ${prev.length+1}`, chunks:numbered }]);
    setScriptIdx(newIdx);
    setCi(0); setMode(0); setDone(new Set()); setHidden(new Set()); setInputs({}); setChecked(false);
    setShowAdd(false);
  }

  const s = {
    wrap:{maxWidth:520,margin:"0 auto",padding:"20px 16px",minHeight:"100vh"},
    progBar:{height:6,background:"#e8e8e8",borderRadius:3,margin:"8px 0 4px"},
    progFill:{height:"100%",background:"#1D9E75",borderRadius:3,transition:"width 0.4s"},
    card:{background:"#fff",border:"1px solid #e8e8e8",borderRadius:12,padding:"16px",marginBottom:14,boxShadow:"0 1px 4px rgba(0,0,0,0.05)"},
    cardLabel:{fontSize:11,fontWeight:600,color:"#1D9E75",letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:10},
    btn:{flex:1,padding:"10px 8px",fontSize:14,borderRadius:8,border:"1px solid #ddd",background:"#f5f5f5",color:"#444",cursor:"pointer"},
    btnGreen:{flex:1,padding:"10px 8px",fontSize:14,borderRadius:8,border:"none",background:"#1D9E75",color:"#fff",cursor:"pointer",fontWeight:500},
    tip:{background:"#f0faf6",borderLeft:"3px solid #1D9E75",padding:"8px 12px",borderRadius:"0 8px 8px 0",fontSize:13,color:"#0F6E56",marginBottom:10,lineHeight:1.6},
    pattern:{background:"#fffbea",borderLeft:"3px solid #f0b429",padding:"8px 12px",borderRadius:"0 8px 8px 0",fontSize:13,color:"#7a4f00",marginBottom:14,lineHeight:1.6},
  };

  return (
    <div style={s.wrap}>
      {showAdd && <AddScriptModal onClose={()=>setShowAdd(false)} onAdd={addScript} />}

      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
        <div style={{fontSize:17,fontWeight:600,color:"#111"}}>Script trainer</div>
        <button onClick={()=>setShowAdd(true)} style={{padding:"5px 12px",fontSize:13,borderRadius:8,border:"none",background:"#1D9E75",color:"#fff",cursor:"pointer"}}>+ 추가</button>
      </div>

      {scripts.length > 1 && (
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>
          {scripts.map((sc,i)=>(
            <button key={i} onClick={()=>{setScriptIdx(i);setCi(0);setMode(0);setDone(new Set());setHidden(new Set());setInputs({});setChecked(false);}} style={{
              padding:"4px 10px",fontSize:12,borderRadius:8,cursor:"pointer",
              border:i===scriptIdx?"none":"1px solid #ddd",
              background:i===scriptIdx?"#111":"#f5f5f5",
              color:i===scriptIdx?"#fff":"#555",
            }}>{sc.title}</button>
          ))}
        </div>
      )}

      <div style={s.progBar}><div style={{...s.progFill,width:progress+"%"}} /></div>
      <div style={{fontSize:12,color:"#888",marginBottom:14}}>{done.size} / {chunks.length} chunks 완료</div>

      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
        {chunks.map((c,i)=>(
          <button key={i} onClick={()=>goChunk(i)} style={{
            padding:"5px 11px",fontSize:13,borderRadius:8,cursor:"pointer",
            border:i===ci?"none":"1px solid #ddd",
            background:i===ci?"#1D9E75":done.has(i)?"#e6f7f1":"#f5f5f5",
            color:i===ci?"#fff":done.has(i)?"#085041":"#555",
            fontWeight:i===ci?600:400,
          }}>{done.has(i)?"✓ ":""}{c.id}</button>
        ))}
      </div>

      <div style={{display:"flex",gap:6,marginBottom:14}}>
        {MODES.map((m,i)=>(
          <button key={i} onClick={()=>goMode(i)} style={{
            ...(mode===i?s.btnGreen:s.btn), flex:1, padding:"7px 4px", fontSize:12,
          }}>{m}</button>
        ))}
      </div>

      <div style={s.tip}>{chunk.tip}</div>
      {chunk.pattern && (
        <div style={s.pattern}>
          <strong>📌 {chunk.pattern.label}</strong><br/>
          {chunk.pattern.desc}<br/>
          <span style={{fontSize:12,opacity:0.8}}>예) {chunk.pattern.example}</span>
        </div>
      )}

      <div style={s.card}>
        <div style={s.cardLabel}>{chunk.id} / {chunks.length} — {chunk.label}</div>

        {/* 읽기 */}
        {mode===0 && <SlashText slashText={chunk.slashText || chunk.text} text={chunk.text} />}

        {/* 키워드 */}
        {mode===1 && (
          <div style={{fontSize:15,lineHeight:1.9,color:"#222"}}>
            {(()=>{
              let parts=[chunk.text];
              chunk.keywords.forEach(kw=>{
                parts=parts.flatMap(part=>{
                  if(typeof part!=="string") return [part];
                  const idx=part.indexOf(kw);
                  if(idx===-1) return [part];
                  return [
                    part.slice(0,idx),
                    <span key={kw} onClick={()=>toggleKw(kw)} style={{
                      background:hidden.has(kw)?"#ccc":"#E1F5EE",
                      color:hidden.has(kw)?"#ccc":"#085041",
                      padding:"1px 6px",borderRadius:4,cursor:"pointer",fontWeight:500,userSelect:"none",
                    }}>{hidden.has(kw)?"\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0":kw}</span>,
                    part.slice(idx+kw.length)
                  ];
                });
              });
              return parts;
            })()}
          </div>
        )}

        {/* 빈칸 — 객관식 */}
        {mode===2 && (
          <div>
            {chunk.blanks.map((b,i)=>(
              <div key={i} style={{marginBottom:18}}>
                <div style={{fontSize:15,lineHeight:1.8,marginBottom:8,color:"#222"}}>
                  {b.pre}<span style={{background:"#e8e8e8",borderRadius:4,padding:"1px 8px",color:"#999"}}>?</span>{b.post}
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {b.opts.map((opt,oi)=>{
                    const isSelected = inputs[i] === opt;
                    const showResult = checked;
                    const isAnswer = opt === b.word;
                    let bg = "#f5f5f5", color = "#333", border = "1px solid #ddd";
                    if (showResult && isAnswer) { bg="#e6f7f1"; color="#085041"; border="1px solid #1D9E75"; }
                    else if (showResult && isSelected && !isAnswer) { bg="#fef0ec"; color="#7a2e10"; border="1px solid #D85A30"; }
                    else if (!showResult && isSelected) { bg="#e8f4ff"; color="#1a5fa8"; border="1px solid #4a9eff"; }
                    return (
                      <button key={oi} onClick={()=>!checked&&setInputs({...inputs,[i]:opt})} style={{
                        padding:"9px 14px",borderRadius:8,border,background:bg,color,fontSize:14,cursor:checked?"default":"pointer",textAlign:"left",
                      }}>{opt}</button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 퍼즐 */}
        {mode===3 && (
          <PuzzleMode chunk={chunk} onDone={()=>setDone(prev=>new Set([...prev,ci]))} />
        )}
      </div>

      {mode===0 && (
        <div style={{display:"flex",gap:8}}>
          <button style={s.btnGreen} onClick={()=>goMode(1)}>→ 키워드 가리기</button>
          {ci<chunks.length-1 && <button style={s.btn} onClick={()=>goChunk(ci+1)}>다음 청크</button>}
        </div>
      )}
      {mode===1 && (
        <div style={{display:"flex",gap:8}}>
          <button style={s.btn} onClick={()=>setHidden(new Set(chunk.keywords))}>전체 가리기</button>
          <button style={s.btn} onClick={()=>setHidden(new Set())}>전체 보기</button>
          <button style={s.btnGreen} onClick={()=>goMode(2)}>→ 빈칸</button>
        </div>
      )}
      {mode===2 && (
        <div>
          <div style={{display:"flex",gap:8,marginBottom:8}}>
            <button style={s.btnGreen} onClick={checkFill}>정답 확인</button>
            <button style={s.btn} onClick={()=>goMode(3)}>→ 퍼즐</button>
          </div>
          {checked && (
            <div style={{padding:"10px 14px",borderRadius:8,fontSize:14,
              background:chunk.blanks.every((_,i)=>isCorrect(i))?"#e6f7f1":"#fef0ec",
              color:chunk.blanks.every((_,i)=>isCorrect(i))?"#085041":"#7a2e10",
            }}>
              {chunk.blanks.every((_,i)=>isCorrect(i))?"완벽해요! 퍼즐로 넘어가세요.":"틀린 보기가 있어요. 다시 확인해봐!"}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
