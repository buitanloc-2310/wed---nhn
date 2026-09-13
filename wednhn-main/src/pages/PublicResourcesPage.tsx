import React,{useEffect,useMemo,useState} from 'react';
import {Download,FileText,Search,AlertTriangle} from 'lucide-react';
import {api} from '../lib/api';

export function PublicResourcesPage(){
  const [rows,setRows]=useState<any[]>([]),[q,setQ]=useState(''),[loading,setLoading]=useState(true),[error,setError]=useState('');
  useEffect(()=>{api('/public/resources').then(r=>{setLoading(false);if(r.ok)setRows(r.data||[]);else setError(r.error||'Không thể tải tài liệu.')})},[]);
  const filtered=useMemo(()=>{const s=q.trim().toLowerCase();return !s?rows:rows.filter(x=>[x.title,x.category,x.description,x.filename].some(v=>String(v||'').toLowerCase().includes(s)))},[rows,q]);
  return <>
   <section className="page-hero"><div className="container"><span className="kicker">KHO TÀI LIỆU CÔNG KHAI</span><h1>Tài liệu Nhà Hán Ngữ</h1></div></section>
    <section className="section"><div className="container">
      <div className="resource-toolbar"><div className="resource-search"><Search size={18}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Tìm theo tên, nhóm hoặc mô tả…"/></div><span>{filtered.length} tài liệu</span></div>
      {loading&&<div className="empty-state">Đang tải tài liệu…</div>}
      {error&&<div className="public-alert"><AlertTriangle/><div><b>Chưa thể tải kho tài liệu</b><span>{error}</span></div></div>}
      {!loading&&!error&&!filtered.length&&<div className="empty-state">Tài Liệu Chưa Được Cập Nhập.</div>}
      <div className="public-resource-grid">{filtered.map(x=><article className="public-resource-card" key={x.id||x.r2_key}><div className="resource-icon"><FileText/></div><div className="resource-body"><span className="resource-category">{x.category||'Tài liệu'}</span><h3>{x.title||x.filename}</h3>{x.description&&<p>{x.description}</p>}<small>{x.filename||''}{x.size_bytes?` · ${Math.max(1,Math.round(x.size_bytes/1024))} KB`:''}</small></div><a className="btn btn-primary" href={x.url} target="_blank" rel="noopener noreferrer"><Download size={16}/> Mở tài liệu</a></article>)}</div>
    </div></section>
  </>
}
