import React,{useEffect,useMemo,useState} from 'react';
import {Clock3,Flag,ChevronLeft,ChevronRight,CheckCircle2,AlertTriangle,Volume2,Play} from 'lucide-react';
import {api} from '../lib/api';
import {examGroups} from '../data/site';

type Mode='catalog'|'exam'|'result';

export function ExamPage(){
 const params=new URLSearchParams(location.search);
 const [mode,setMode]=useState<Mode>('catalog');
 const [catalog,setCatalog]=useState<any[]>([]);
 const [exam,setExam]=useState<any>(null);
 const [questions,setQuestions]=useState<any[]>([]);
 const [q,setQ]=useState(0);
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [marked,setMarked]=useState<string[]>([]);
 const [attempt,setAttempt]=useState('');
 const [result,setResult]=useState<any>(null);
 const [group,setGroup]=useState(params.get('group')||'hsk');
 const [level,setLevel]=useState(params.get('level')||'HSK 1');
 const [seconds,setSeconds]=useState(0);
 const [deadline,setDeadline]=useState('');
 const [submitting,setSubmitting]=useState(false);
 const [loading,setLoading]=useState(false);
 const [catalogError,setCatalogError]=useState('');

 const loadCatalog=()=>{
  const query=new URLSearchParams({group});
  if(group==='hsk'&&level)query.set('level',level);
  setCatalogError('');
  api(`/public/exams?${query.toString()}`).then(r=>{if(r.ok){setCatalog(r.data||[]);setCatalogError('')}else{setCatalog([]);setCatalogError(r.error||'Không thể tải danh sách đề.')}}).catch(()=>{setCatalog([]);setCatalogError('Không thể kết nối API ngân hàng đề.')});
 };
 useEffect(loadCatalog,[group,level]);
 useEffect(()=>{if(mode!=='exam'||!deadline)return;const tick=()=>setSeconds(Math.max(0,Math.ceil((Date.parse(deadline)-Date.now())/1000)));tick();const t=setInterval(tick,1000);return()=>clearInterval(t)},[mode,deadline]);
 useEffect(()=>{if(mode!=='exam'||!deadline||submitting)return;const ms=Date.parse(deadline)-Date.now();if(ms<=0)void submit(true)},[mode,deadline,submitting]);

 const start=async(id:string)=>{
  setLoading(true);
  const d=await api(`/public/exams/${id}`);
  if(!d.ok){setLoading(false);return alert(d.error)}
  const token=localStorage.getItem('nhn_visitor_token')||crypto.randomUUID();
  localStorage.setItem('nhn_visitor_token',token);
  const a=await api('/public/attempts/start',{method:'POST',body:JSON.stringify({exam_id:id,visitor_token:token})});
  if(!a.ok){setLoading(false);return alert(a.error)}
  setAttempt(a.data.attempt_id);setExam(d.data.exam);setQuestions(d.data.questions||[]);setDeadline(a.data.deadline_at||new Date(Date.now()+Number(d.data.exam.duration_minutes||60)*60000).toISOString());setAnswers({});setMarked([]);setQ(0);
  if(a.data.resumed){const rr=await api(`/public/attempts/${a.data.attempt_id}/resume`,{headers:{'x-visitor-token':token}});if(rr.ok)setAnswers(rr.data.answers||{})}
  setMode('exam');setLoading(false);
 };
 const choose=async(questionId:string,optionId:string)=>{setAnswers(x=>({...x,[questionId]:optionId}));const token=localStorage.getItem('nhn_visitor_token')||'';const r=await api(`/public/attempts/${attempt}/answer`,{method:'PUT',headers:{'x-visitor-token':token},body:JSON.stringify({question_id:questionId,answer:optionId})});if(!r.ok)alert(r.error)};
 const submit=async(auto=false)=>{if(submitting)return;if(!auto&&!confirm(`Nộp bài? Bạn đã trả lời ${Object.keys(answers).length}/${questions.length} câu.`))return;setSubmitting(true);const token=localStorage.getItem('nhn_visitor_token')||'';const r=await api(`/public/attempts/${attempt}/submit`,{method:'POST',headers:{'x-visitor-token':token}});setSubmitting(false);if(!r.ok)return alert(r.error);setResult(r.data);setMode('result')};
 const fmt=(n:number)=>`${String(Math.floor(n/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`;
 const speak=(text:string)=>{if(!text)return;window.speechSynthesis?.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='zh-CN';u.rate=.88;window.speechSynthesis?.speak(u)};

 if(mode==='exam'&&questions.length){
  const cur=questions[q];
  return <section className="exam-room">
   <div className="exam-top"><div><strong>{exam.title}</strong><span>{questions.length} câu · {exam.level||exam.group_key}</span></div><div className={`timer ${seconds<=60?'danger':''}`}><Clock3/> {fmt(seconds)}</div></div>
   <div className="exam-layout">
    <aside className="question-nav"><h3>Danh sách câu</h3><div className="q-grid">{questions.map((x:any,i:number)=><button className={`${q===i?'active':''} ${answers[x.id]?'done':''} ${marked.includes(x.id)?'marked':''}`} onClick={()=>setQ(i)} key={x.id}>{x.position}</button>)}</div><div className="legend"><span><i className="lg done"/>Đã làm</span><span><i className="lg marked"/>Đánh dấu</span></div></aside>
    <main className="question-pane"><div className="question-head"><span>Câu {cur.position}/{questions.length}</span><button onClick={()=>setMarked(m=>m.includes(cur.id)?m.filter(x=>x!==cur.id):[...m,cur.id])}><Flag size={17}/> {marked.includes(cur.id)?'Bỏ đánh dấu':'Đánh dấu'}</button></div>
     <div className="question-card">
      {cur.audio_url&&<div className="audio-box"><Volume2/><audio controls preload="none" src={cur.audio_url}/></div>}
      {!cur.audio_url&&cur.tts_text&&<div className="audio-box"><Volume2/><button type="button" onClick={()=>speak(cur.tts_text)}><Play size={16}/> Phát nội dung nghe</button><span>Audio luyện nghe bằng giọng đọc trên thiết bị</span></div>}
      {cur.image_url&&<img src={cur.image_url} alt="Hình câu hỏi" style={{maxWidth:'100%',borderRadius:12}}/>}
      <h2>{cur.content}</h2>
      <div className="choices">{(cur.options||[]).map((o:any)=><label className={answers[cur.id]===o.id?'selected':''} key={o.id}><input type="radio" name={`q-${cur.id}`} checked={answers[cur.id]===o.id} onChange={()=>choose(cur.id,o.id)}/><span><b>{o.label}.</b> {o.content}</span></label>)}</div>
     </div>
     <div className="exam-bottom"><button disabled={q===0} onClick={()=>setQ(x=>Math.max(0,x-1))}><ChevronLeft/> Trước</button>{q<questions.length-1?<button className="primary" onClick={()=>setQ(x=>Math.min(questions.length-1,x+1))}>Tiếp <ChevronRight/></button>:<button className="submit" onClick={()=>submit(false)} disabled={submitting}>Nộp bài <CheckCircle2/></button>}</div>
    </main>
   </div>
  </section>;
 }

 if(mode==='result'&&result)return <section className="section"><div className="container result-card"><CheckCircle2 size={56}/><h1>Kết quả bài làm</h1><div className="result-grid"><div><b>{result.score}</b><span>Điểm</span></div><div><b>{result.correct}</b><span>Đúng</span></div><div><b>{result.wrong}</b><span>Sai</span></div><div><b>{result.blank}</b><span>Bỏ trống</span></div></div><div className="review-list">{(result.review||[]).map((r:any)=><article key={r.question_id} className={r.is_correct?'goodbox':'badbox'}><b>Câu {r.position}: {r.is_correct?'Đúng':'Sai'}</b><span>Đáp án đúng: {r.correct_option?.label}. {r.correct_option?.content}</span>{r.explanation&&<p>{r.explanation}</p>}</article>)}</div><button className="btn btn-primary" onClick={()=>{setMode('catalog');setResult(null);loadCatalog()}}>Quay lại danh sách đề</button></div></section>;

 return <>
  <section className="page-hero"><div className="container"><span className="kicker">LÀM BÀI TẬP TRỰC TUYẾN</span><h1>Ngân hàng đề Nhà Hán Ngữ</h1><p>180 bài tập HSK được chia đều theo HSK 1–9, mỗi cấp có 20 bài luyện. Mỗi đề gồm 50 câu và có giải thích sau khi nộp bài.</p></div></section>
  <section className="section"><div className="container">
   <div className="exam-grid">{examGroups.map(g=><button className={`exam-card tall ${group===g.id?'selected':''}`} onClick={()=>{setGroup(g.id);if(g.id==='hsk'&&!level)setLevel('HSK 1')}} key={g.id}><span className="exam-han">{g.accent}</span><div><h3>{g.title}</h3><p>{g.description}</p></div></button>)}</div>
   {group==='hsk'&&<div className="level-tabs">{Array.from({length:9},(_,i)=>`HSK ${i+1}`).map(x=><button key={x} className={level===x?'active':''} onClick={()=>setLevel(x)}>{x}</button>)}</div>}
   <div className="section-head" style={{marginTop:32}}><div><span className="kicker">ĐỀ LUYỆN</span><h2>{group==='hsk'?level:examGroups.find(x=>x.id===group)?.title}</h2><p>{catalog.length} đề hiện có trong nhóm này.</p></div></div>
   <div className="card-grid">{catalog.map(e=><article className="feature-card" key={e.id}><span className="han-chip">卷</span><h3>{e.title}</h3><p>{e.level||e.group_key} · {e.duration_minutes} phút · 50 câu</p><p>{e.description}</p><button className="btn btn-primary" disabled={loading} onClick={()=>start(e.id)}>Bắt đầu làm bài</button></article>)}</div>
   {!catalog.length&&<div className="notice"><AlertTriangle/><div><b>{catalogError?'Không thể tải ngân hàng đề.':'Chưa có đề được xuất bản trong nhóm này.'}</b><span>{catalogError||'Vui lòng kiểm tra lại sau hoặc chọn nhóm đề khác.'}</span></div></div>}
  </div></section>
 </>;
}
