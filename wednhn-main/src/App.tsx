import React from 'react';
import {Shell} from './components/Shell';
import {Home} from './pages/Home';
import {SectionPage} from './pages/SectionPage';
import {ExamPage} from './pages/ExamPage';
import {AdminApp} from './admin/AdminApp';
import {PublicResourcesPage} from './pages/PublicResourcesPage';
import {VerifyPage} from './pages/VerifyPage';

const path=window.location.pathname.replace(/\/$/,'')||'/';
export default function App(){
 if(path.startsWith('/admin')) return <AdminApp/>;
 let page:React.ReactNode;
 if(path==='/') page=<Home/>;
 else if(path==='/thi-thu') page=<ExamPage/>;
 else if(path==='/kho-hoc-lieu'||path==='/tai-lieu') page=<PublicResourcesPage/>;
 else if(path==='/tra-cuu') page=<VerifyPage/>;
 else page=<SectionPage path={path}/>;
 return <Shell>{page}</Shell>;
}
