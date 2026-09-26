import React,{useEffect,useState} from 'react';
import {BadgeCheck,Search,ShieldCheck,AlertTriangle,XCircle} from 'lucide-react';
import {api} from '../lib/api';

export function VerifyPage(){
  const initial=new URLSearchParams(location.search).get('code')||'';
  const [code,setCode]=useState(initial),[result,setResult]=useState<any|null>(null),[msg,setMsg]=useState(''),[loading,setLoading]=useState(false);
  const lookup=async(v=code)=>{const c=v.trim();if(!c){setMsg('Vui lòng nhập mã cần tra cứu.');setResult(null);return}setLoading(true);setMsg('');const r=await api(`/public/verify/${encodeURIComponent(c)}`);setLoading(false);if(r.ok){setResult(r.data);setMsg('');history.replaceState({},'',`/tra-cuu?code=${encodeURIComponent(r.data.code||c)}`)}else{setResult(null);setMsg(r.status===404?'Không tìm thấy mã này trong hệ thống.':r.error||'Không thể tra cứu lúc này.')}};
  useEffect(()=>{if(initial)lookup(initial)},[]);
  const active=result&&result.status!=='revoked'&&result.status!=='invalid';
  return <>
    <section className="page-hero"><div className="container"><span className="kicker">XÁC THỰC THÔNG TIN</span><h1>Tra cứu mã</h1><p>Kiểm tra mã chứng nhận, xác nhận tham gia hoặc mã xác thực do Nhà Hán Ngữ phát hành.</p></div></section>
    <section className="section"><div className="container verify-wrap">
      <section className="verify-search-card"><ShieldCheck size={34}/><h2>Nhập mã cần tra cứu</h2><div className="verify-input"><input value={code} onChange={e=>setCode(e.target.value)} onKeyDown={e=>e.key==='Enter'&&lookup()} placeholder="Ví dụ: NHN-2026-001"/><button className="btn btn-primary" onClick={()=>lookup()} disabled={loading}><Search size={17}/>{loading?'Đang tra…':'Tra cứu'}</button></div><small>Mã không phân biệt chữ hoa/thường và khoảng trắng.</small></section>
      {msg&&<div className="public-alert"><AlertTriangle/><div><b>Không có kết quả</b><span>{msg}</span></div></div>}
      {result&&<section className={`verify-result ${active?'valid':'invalid'}`}><div className="verify-result-head">{active?<BadgeCheck size={42}/>:<XCircle size={42}/>}<div><span>{active?'XÁC THỰC THÀNH CÔNG':'MÃ KHÔNG CÒN HIỆU LỰC'}</span><h2>{result.code}</h2></div></div><dl><div><dt>Người nhận</dt><dd>{result.recipient_name||'—'}</dd></div><div><dt>Nội dung xác nhận</dt><dd>{result.item_name||result.program_name||'—'}</dd></div>{result.program_name&&result.item_name&&<div><dt>Chương trình</dt><dd>{result.program_name}</dd></div>}<div><dt>Ngày cấp</dt><dd>{result.issued_at||'—'}</dd></div>{result.expires_at&&<div><dt>Hết hiệu lực</dt><dd>{result.expires_at}</dd></div>}<div><dt>Đơn vị phát hành</dt><dd>{result.issuer||'Nhà Hán Ngữ'}</dd></div><div><dt>Trạng thái</dt><dd>{active?'Có hiệu lực':result.status}</dd></div></dl>{result.public_note&&<p className="verify-note">{result.public_note}</p>}</section>}
    </div></section>
  </>
}
