import {LayoutDashboard,PanelsTopLeft,FileText,Newspaper,BookOpen,Library,ClipboardCheck,Image,Users,ShieldCheck,History,Settings,Handshake,MessageSquare,BadgeCheck,FolderOpen,Activity,RotateCcw} from 'lucide-react';

export type AdminTabId='dashboard'|'website'|'pages'|'learning'|'resources'|'knowledge'|'posts'|'community'|'forms'|'partners'|'contact'|'exams'|'documents'|'verification'|'media'|'accounts'|'roles'|'logs'|'revisions'|'system'|'settings';

export const adminGroups=[
  {label:'Tổng quan',items:[
    ['dashboard','Tổng quan',LayoutDashboard],
  ]},
  {label:'Nội dung website',items:[
    ['website','Website & giao diện',PanelsTopLeft],
    ['pages','Trang & nội dung',FileText],
    ['learning','Học Hán Ngữ',BookOpen],
    ['resources','Kho học liệu',Library],
    ['knowledge','Kiến thức',BookOpen],
    ['posts','Bài viết & tin tức',Newspaper],
    ['community','Cộng đồng',MessageSquare],
    ['forms','Biểu mẫu & hồ sơ',ClipboardCheck],
    ['partners','Đối tác',Handshake],
    ['contact','Liên hệ',MessageSquare],
  ]},
  {label:'Dữ liệu & học tập',items:[
    ['exams','Làm bài tập & ngân hàng đề',ClipboardCheck],
    ['documents','Tài liệu công khai',FolderOpen],
    ['verification','Mã & xác nhận',BadgeCheck],
    ['media','Media Library',Image],
  ]},
  {label:'Quản trị hệ thống',items:[
    ['accounts','Tài khoản',Users],
    ['roles','Vai trò & quyền',ShieldCheck],
    ['logs','Nhật ký',History],
    ['revisions','Lịch sử chỉnh sửa',RotateCcw],
    ['system','Trung tâm hệ thống',Activity],
    ['settings','Cài đặt hệ thống',Settings],
  ]},
] as const;

export const adminTabs=adminGroups.flatMap(g=>g.items) as readonly (readonly [AdminTabId,string,any])[];
