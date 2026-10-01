import React,{useEffect,useState} from 'react';
import {api} from './lib/api';
import {Shell} from './components/Shell';
import {Home} from './pages/Home';
import {SectionPage} from './pages/SectionPage';
import {ExamPage} from './pages/ExamPage';
import {AdminApp} from './admin/AdminApp';
import {PublicResourcesPage} from './pages/PublicResourcesPage';
import {VerifyPage} from './pages/VerifyPage';
import {NotFoundPage} from './pages/NotFoundPage';
import {NewsPage} from './pages/NewsPage';
import {ParticipatePage} from './pages/ParticipatePage';

const currentPath=()=>window.location.pathname.replace(/\/$/,'')||'/';
const sectionPaths=new Set(['/ve-chung-toi','/hoc-han-ngu','/kien-thuc','/cong-dong','/doi-tac','/lien-he']);
export default function App(){
 const [path,setPath]=useState(currentPath());
 const [cfg,setCfg]=useState<any>({});
 useEffect(()=>{api('/site/config').then(r=>r.ok&&setCfg(r.data||{})).catch(()=>{})},[]);
 useEffect(()=>{
  const titles:Record<string,string>={"/":"Nhà Hán Ngữ","/thi-thu":"Làm bài tập | Nhà Hán Ngữ","/kho-hoc-lieu":"Kho học liệu | Nhà Hán Ngữ","/tai-lieu":"Tài liệu | Nhà Hán Ngữ","/tra-cuu":"Tra cứu | Nhà Hán Ngữ","/tin-tuc-su-kien":"Bảng tin | Nhà Hán Ngữ","/tham-gia":"Tham gia | Nhà Hán Ngữ","/ve-chung-toi":"Về chúng tôi | Nhà Hán Ngữ","/hoc-han-ngu":"Học Hán Ngữ | Nhà Hán Ngữ","/kien-thuc":"Kiến thức | Nhà Hán Ngữ","/cong-dong":"Cộng đồng | Nhà Hán Ngữ","/doi-tac":"Đối tác | Nhà Hán Ngữ","/lien-he":"Liên hệ | Nhà Hán Ngữ"};
  document.title=path==='/'?(cfg.seo_default_title||titles[path]):(titles[path]||cfg.seo_default_title||'Nhà Hán Ngữ');const desc=cfg.seo_default_description||'';let meta=document.querySelector('meta[name=description]') as HTMLMetaElement|null;if(!meta){meta=document.createElement('meta');meta.name='description';document.head.appendChild(meta)}meta.content=desc;
 },[path,cfg.seo_default_title,cfg.seo_default_description]);
 useEffect(()=>{
  const sync=()=>setPath(currentPath());
  const onClick=(e:MouseEvent)=>{
   if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
   const a=(e.target as Element|null)?.closest?.('a[href]') as HTMLAnchorElement|null;
   if(!a||a.target||a.hasAttribute('download'))return;
   const u=new URL(a.href,location.href);
   if(u.origin!==location.origin||!['http:','https:'].includes(u.protocol))return;
   e.preventDefault();
   history.pushState({},'',u.pathname+u.search+u.hash);
   setPath(currentPath());
   window.scrollTo({top:0,behavior:'smooth'});
  };
  addEventListener('popstate',sync);document.addEventListener('click',onClick);
  return()=>{removeEventListener('popstate',sync);document.removeEventListener('click',onClick)};
 },[]);
 if(path.startsWith('/admin')) return <AdminApp/>;
 if(cfg.maintenance_mode==='true') return <main className="maintenance-page"><div><img src={cfg.logo_key||'/brand/nhn-logo-2026.png'} alt="Nhà Hán Ngữ"/><h1>Website đang bảo trì</h1><p>Nhà Hán Ngữ đang cập nhật hệ thống. Vui lòng quay lại sau.</p></div></main>;
 let page:React.ReactNode;
 if(path==='/') page=<Home/>;
 else if(path==='/thi-thu') page=<ExamPage/>;
 else if(path==='/kho-hoc-lieu'||path==='/tai-lieu') page=<PublicResourcesPage/>;
 else if(path==='/tra-cuu') page=<VerifyPage/>;
 else if(path==='/tin-tuc-su-kien') page=<NewsPage/>;
 else if(path==='/tham-gia') page=<ParticipatePage/>;
 else if(sectionPaths.has(path)) page=<SectionPage path={path}/>;
 else page=<NotFoundPage/>;
 return <Shell currentPath={path}>{page}</Shell>;
}
