import React,{useEffect,useMemo,useState} from 'react';
import {Download,FileText,Search,AlertTriangle,BookOpen} from 'lucide-react';
import {api} from '../lib/api';
import {bundledLearningResources} from '../data/learningResources';

export function PublicResourcesPage(){
  const [remote,setRemote]=useState<any[]>([]),[q,setQ]=useState(''),[category,setCategory]=useState('Tất cả'),[loading,setLoading]=useState(true),[error,setError]=useState('');
  useEffect(()=>{api('/public/resources').then(r=>{setLoading(false);if(r.ok)setRemote(r.data||[]);else setError(r.error||'Kho tài liệu trực tuyến tạm thời chưa phản hồi.')})},[]);
  const rows=useMemo(()=>[...bundledLearningResources.map(x=>({...x,size_bytes:0})),...remote],[remote]);
  const categories=useMemo(()=>['Tất cả',...Array.from(new Set(rows.map((x:any)=>x.category).filter(Boolean)))],[rows]);
  const filtered=useMemo(()=>{const s=q.trim().toLowerCase();return rows.filter((x:any)=>(category==='Tất cả'||x.category===category)&&(!s||[x.title,x.category,x.description,x.filename].some(v=>String(v||'').toLowerCase().includes(s))))},[rows,q,category]);
  return <>
   <section className="page-hero"><div className="container"><span className="kicker">KHO HỌC LIỆU NHÀ HÁN NGỮ</span><h1>100 bộ học liệu · 5.000 câu luyện tập</h1><p>Mỗi tài liệu gồm 50 câu, chữ Hán không kèm Pinyin, có đáp án cuối file và bản quyền Nhà Hán Ngữ.</p></div></section>
    <section className="section"><div className="container">
      <div className="resource-toolbar"><div className="resource-search"><Search size={18}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Tìm học liệu, chủ đề…"/></div><select className="resource-filter" value={category} onChange={e=>setCategory(e.target.value)}>{categories.map(c=><option key={c}>{c}</option>)}</select><span><b>{filtered.length}</b> tài liệu</span></div>
      {error&&<div className="public-alert"><AlertTriangle/><div><b>Kho tải lên từ quản trị đang tạm thời không phản hồi</b><span>100 học liệu tích hợp sẵn bên dưới vẫn hoạt động bình thường.</span></div></div>}
      {loading&&<div className="resource-loading">Đang đồng bộ thêm tài liệu từ hệ thống…</div>}
      {!filtered.length&&<div className="empty-state">Không tìm thấy học liệu phù hợp.</div>}
      <div className="public-resource-grid">{filtered.map((x:any)=><article className="public-resource-card" key={x.id||x.r2_key}><div className="resource-icon"><BookOpen/></div><div className="resource-body"><span className="resource-category">{x.category||'Tài liệu'}</span><h3>{x.title||x.filename}</h3>{x.description&&<p>{x.description}</p>}<small>{x.questionCount?`${x.questionCount} câu · PDF · Có đáp án`:x.filename||''}</small></div><div className="resource-actions"><a className="btn btn-outline" href={x.url} target="_blank" rel="noopener noreferrer"><FileText size={16}/> Xem PDF</a><a className="btn btn-primary" href={x.url} download><Download size={16}/> Tải xuống</a></div></article>)}</div>
    </div></section>
  </>
}
