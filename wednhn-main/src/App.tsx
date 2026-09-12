import React from 'react';
import {Shell} from './components/Shell';
import {Home} from './pages/Home';
import {SectionPage} from './pages/SectionPage';
import {ExamPage} from './pages/ExamPage';
import {AdminApp} from './admin/AdminApp';

const path=window.location.pathname.replace(/\/$/,'')||'/';
export default function App(){
 if(path.startsWith('/admin')) return <AdminApp/>;
 let page:React.ReactNode;
 if(path==='/') page=<Home/>;
 else if(path==='/thi-thu') page=<ExamPage/>;
 else page=<SectionPage path={path}/>;
 return <Shell>{page}</Shell>;
}
