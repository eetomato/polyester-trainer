import { useState } from "react";

const DICT = {
  "polyester": "폴리에스터 — 석유 기반 합성 섬유",
  "synthetic": "합성의, 인공의",
  "fiber": "섬유",
  "petroleum": "석유",
  "crude oil": "원유",
  "spinnerets": "방사구 — 실을 뽑아내는 작은 구멍",
  "yarn": "실, 방적사",
  "moisture": "수분, 습기",
  "odor": "냄새, 악취",
  "retention": "보유, 유지",
  "microplastics": "미세플라스틱",
  "hormones": "호르몬",
  "testosterone": "테스토스테론 — 남성 호르몬",
  "progesterone": "프로게스테론 — 여성 호르몬",
  "fertility": "생식력, 임신 능력",
  "elastic": "탄성의, 신축성 있는",
  "recovery": "회복",
  "crease": "구김, 주름",
  "pleats": "주름 잡기 (의복)",
  "abrasion": "마모, 닳음",
  "degradation": "열화, 분해",
  "outerwear": "아우터웨어 — 겉옷류",
  "blending": "혼방 — 여러 소재 섞기",
  "merino": "메리노 — 고급 양모 품종",
  "pima": "피마 — 고급 면화 품종",
  "staples": "기본 아이템, 필수품",
  "luxurious": "고급스러운, 사치스러운",
  "notorious": "악명 높은",
  "discarded": "버려진, 폐기된",
  "derived": "유래된, 추출된",
};

const defaultChunks = [
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

function Tooltip({ word, onClose }) {
  const key = Object.keys(DICT).find(k => word.toLowerCase().includes(k) || k.includes(word.toLowerCase()));
  const meaning = key ? DICT[key] : null;
  if (!meaning) return null;
  return (
    <div onClick={onClose} style={{
      position:"fixed", inset:0, zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center",
      background:"rgba(0,0,0,0.35)"
    }}>
      <div onClick={e=>e.stopPropagation()} style={{
        background:"#fff", borderRadius:14, padding:"18px 22px", maxWidth:280, boxShadow:"0 8px 32px rgba(0,0,0,0.18)"
      }}>
        <div style={{fontSize:18, fontWeight:600, color:"#111", marginBottom:6}}>{word}</div>
        <div style={{fontSize:15, color:"#444", lineHeight:1.6}}>{meaning}</div>
        <button onClick={onClose} style={{marginTop:14, width:"100%", padding:"8px", borderRadius:8, border:"none", background:"#1D9E75", color:"#fff", fontSize:14, cursor:"pointer"}}>닫기</button>
      </div>
    </div>
  );
}

function ClickableText({ text }) {
  const [tooltip, setTooltip] = useState(null);
  const words = text.split(/(\s+|[—–,.])/);
  return (
    <span>
      {tooltip && <Tooltip word={tooltip} onClose={() => setTooltip(null)} />}
      {words.map((w, i) => {
        const clean = w.replace(/[^a-zA-Z]/g, "").toLowerCase();
        const hasDict = clean && Object.keys(DICT).some(k => k === clean || k.split(" ")[0] === clean);
        return (
          <span key={i}
            onClick={hasDict ? () => setTooltip(w.trim()) : undefined}
            style={hasDict ? { borderBottom:"1.5px dotted #1D9E75", cursor:"pointer", color:"#0a5c3f" } : {}}
          >{w}</span>
        );
      })}
    </span>
  );
}

function AddScriptModal({ onClose, onAdd }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    if (!text.trim()) return;
    setLoading(true); setError("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          messages:[{
            role:"user",
            content:`아래 영어 스크립트를 암기 학습용으로 분석해줘. 반드시 JSON만 출력하고 다른 텍스트는 절대 쓰지 마.

형식:
{
  "chunks": [
    {
      "label": "섹션 제목 (한국어, 15자 이내)",
      "tip": "암기 팁 (한국어, 30자 이내)",
      "text": "원문 텍스트 그대로",
      "keywords": ["핵심단어1", "핵심단어2"],
      "blanks": [
        {"pre": "앞텍스트", "word": "빈칸단어", "post": "뒤텍스트"}
      ]
    }
  ]
}

규칙:
- 스크립트를 3~6개 청크로 나눠
- 각 청크 keywords는 3~6개
- 각 청크 blanks는 2~3개
- blanks의 pre+word+post를 합치면 완전한 문장이 돼야 함

스크립트:
${text}`
          }]
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
        <div style={{fontSize:13,color:"#888",marginBottom:14}}>영어 텍스트를 붙여넣으면 AI가 자동으로 청크/키워드/빈칸을 만들어줘.</div>
        <textarea
          value={text}
          onChange={e=>setText(e.target.value)}
          placeholder="스크립트를 여기에 붙여넣어..."
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

export default function App() {
  const [scripts, setScripts] = useState([{ title:"Polyester", chunks: defaultChunks }]);
  const [scriptIdx, setScriptIdx] = useState(0);
  const [ci, setCi] = useState(0);
  const [mode, setMode] = useState(0);
  const [done, setDone] = useState(new Set());
  const [hidden, setHidden] = useState(new Set());
  const [inputs, setInputs] = useState({});
  const [checked, setChecked] = useState(false);
  const [shadowText, setShadowText] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const chunks = scripts[scriptIdx].chunks;
  const chunk = chunks[ci];
  const progress = Math.round(done.size / chunks.length * 100);

  function goChunk(i) { setCi(i); setMode(0); setHidden(new Set()); setInputs({}); setChecked(false); setShadowText(""); }
  function goMode(m) { setMode(m); setHidden(new Set()); setInputs({}); setChecked(false); }
  function toggleKw(kw) { setHidden(prev => { const n=new Set(prev); n.has(kw)?n.delete(kw):n.add(kw); return n; }); }

  function isCorrect(i) {
    const val=(inputs[i]||"").toLowerCase().trim();
    const ans=chunk.blanks[i].word.toLowerCase().trim();
    return val===ans||ans.startsWith(val)||val.startsWith(ans.split(" ")[0]);
  }
  function checkFill() {
    setChecked(true);
    if (chunk.blanks.every((_,i)=>isCorrect(i))) setDone(prev=>new Set([...prev,ci]));
  }
  function markDone() {
    setDone(prev=>new Set([...prev,ci]));
    if (ci<chunks.length-1) setTimeout(()=>goChunk(ci+1),600);
  }

  function addScript(newChunks) {
    const numbered = newChunks.map((c,i)=>({...c, id:i+1}));
    setScripts(prev=>[...prev,{title:`스크립트 ${prev.length+1}`, chunks:numbered}]);
    setScriptIdx(scripts.length);
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
    tip:{background:"#f0faf6",borderLeft:"3px solid #1D9E75",padding:"8px 12px",borderRadius:"0 8px 8px 0",fontSize:13,color:"#0F6E56",marginBottom:14,lineHeight:1.6},
  };

  return (
    <div style={s.wrap}>
      {showAdd && <AddScriptModal onClose={()=>setShowAdd(false)} onAdd={addScript} />}

      {/* Header */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
        <div style={{fontSize:17,fontWeight:600,color:"#111"}}>Script trainer</div>
        <button onClick={()=>setShowAdd(true)} style={{padding:"5px 12px",fontSize:13,borderRadius:8,border:"none",background:"#1D9E75",color:"#fff",cursor:"pointer"}}>+ 추가</button>
      </div>

      {/* Script tabs */}
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

      {/* Chunk nav */}
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

      {/* Mode tabs */}
      <div style={{display:"flex",gap:6,marginBottom:14}}>
        {MODES.map((m,i)=>(
          <button key={i} onClick={()=>goMode(i)} style={{
            ...(mode===i?s.btnGreen:s.btn), flex:1, padding:"7px 4px", fontSize:12,
          }}>{m}</button>
        ))}
      </div>

      <div style={s.tip}>{chunk.tip}</div>

      <div style={s.card}>
        <div style={s.cardLabel}>{chunk.id} / {chunks.length} — {chunk.label}</div>

        {mode===0 && <div style={{fontSize:15,lineHeight:1.9,color:"#222"}}><ClickableText text={chunk.text} /></div>}

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
                      padding:"1px 6px",borderRadius:4,cursor:"pointer",
                      fontWeight:500,userSelect:"none",transition:"all 0.15s",
                    }}>{hidden.has(kw)?"\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0":kw}</span>,
                    part.slice(idx+kw.length)
                  ];
                });
              });
              return parts;
            })()}
          </div>
        )}

        {mode===2 && (
          <div>
            {chunk.blanks.map((b,i)=>(
              <div key={i} style={{marginBottom:14,fontSize:15,lineHeight:2.3}}>
                {b.pre}
                <input value={inputs[i]||""} onChange={e=>setInputs({...inputs,[i]:e.target.value})} placeholder="?"
                  style={{
                    border:"none",
                    borderBottom:`2px solid ${!checked?"#1D9E75":isCorrect(i)?"#1D9E75":"#D85A30"}`,
                    background:!checked?"transparent":isCorrect(i)?"#e6f7f1":"#fef0ec",
                    fontSize:15,padding:"0 5px",minWidth:100,outline:"none",
                    fontFamily:"inherit",color:"#222",borderRadius:checked?4:0,
                  }}
                />
                {b.post}
              </div>
            ))}
          </div>
        )}

        {mode===3 && (
          <div>
            <div style={{fontSize:12,color:"#888",marginBottom:8}}>키워드 힌트</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:14}}>
              {chunk.keywords.map(k=>(
                <span key={k} style={{background:"#f5f5f5",border:"1px solid #e0e0e0",padding:"3px 10px",borderRadius:8,fontSize:13,color:"#555"}}>{k}</span>
              ))}
            </div>
            <textarea value={shadowText} onChange={e=>setShadowText(e.target.value)}
              placeholder="기억나는 내용을 자유롭게 적어보세요..."
              style={{width:"100%",minHeight:90,padding:"10px 12px",fontSize:14,border:"1px solid #ddd",borderRadius:8,background:"#fafafa",fontFamily:"inherit",color:"#222",resize:"vertical"}}
            />
          </div>
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
            <button style={s.btn} onClick={()=>goMode(3)}>→ 쉐도잉</button>
          </div>
          {checked && (
            <div style={{padding:"10px 14px",borderRadius:8,fontSize:14,
              background:chunk.blanks.every((_,i)=>isCorrect(i))?"#e6f7f1":"#fef0ec",
              color:chunk.blanks.every((_,i)=>isCorrect(i))?"#085041":"#7a2e10",
            }}>
              {chunk.blanks.every((_,i)=>isCorrect(i))?"완벽해요! 쉐도잉으로 넘어가세요.":"틀린 칸은 빨간색으로 표시됐어요. 다시 읽고 재시도!"}
            </div>
          )}
        </div>
      )}
      {mode===3 && (
        <div>
          <button style={{...s.btnGreen,width:"100%"}} onClick={markDone}>
            ✓ 이 청크 완료{ci<chunks.length-1?" → 다음으로":""}
          </button>
          {done.has(ci) && (
            <div style={{marginTop:8,padding:"10px 14px",borderRadius:8,background:"#e6f7f1",color:"#085041",fontSize:14}}>
              {done.size===chunks.length?"🎉 전체 완료! 처음부터 통암기 도전해봐!":` 완료! (${done.size}/${chunks.length})`}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
