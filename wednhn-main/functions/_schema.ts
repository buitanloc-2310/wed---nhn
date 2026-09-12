interface RuntimeEnv { DB: D1Database }

let ready: Promise<void> | null = null;

const ddl = [
`CREATE TABLE IF NOT EXISTS admins(
 id TEXT PRIMARY KEY,name TEXT NOT NULL,email TEXT NOT NULL UNIQUE,password_hash TEXT NOT NULL,password_salt TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'active',is_root INTEGER NOT NULL DEFAULT 0,created_at TEXT NOT NULL,updated_at TEXT,
 last_login_at TEXT,created_by TEXT
)`,
`CREATE TABLE IF NOT EXISTS admin_sessions(token TEXT PRIMARY KEY,admin_id TEXT NOT NULL,expires_at TEXT NOT NULL,created_at TEXT NOT NULL,FOREIGN KEY(admin_id) REFERENCES admins(id) ON DELETE CASCADE)`,
`CREATE TABLE IF NOT EXISTS roles(id TEXT PRIMARY KEY,name TEXT NOT NULL UNIQUE,description TEXT,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
`CREATE TABLE IF NOT EXISTS permissions(id TEXT PRIMARY KEY,code TEXT NOT NULL UNIQUE,description TEXT)`,
`CREATE TABLE IF NOT EXISTS admin_roles(admin_id TEXT NOT NULL,role_id TEXT NOT NULL,PRIMARY KEY(admin_id,role_id))`,
`CREATE TABLE IF NOT EXISTS role_permissions(role_id TEXT NOT NULL,permission_id TEXT NOT NULL,PRIMARY KEY(role_id,permission_id))`,
`CREATE TABLE IF NOT EXISTS system_settings(key TEXT PRIMARY KEY,value TEXT,updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
`CREATE TABLE IF NOT EXISTS site_settings(key TEXT PRIMARY KEY,value TEXT,updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
`CREATE TABLE IF NOT EXISTS pages(id TEXT PRIMARY KEY,slug TEXT NOT NULL UNIQUE,title TEXT NOT NULL,excerpt TEXT,body_html TEXT NOT NULL DEFAULT '',status TEXT NOT NULL DEFAULT 'draft',min_words INTEGER NOT NULL DEFAULT 800,seo_title TEXT,seo_description TEXT,og_image_key TEXT,created_by TEXT,updated_by TEXT,published_at TEXT,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
`CREATE TABLE IF NOT EXISTS page_sections(id TEXT PRIMARY KEY,page_id TEXT NOT NULL,section_key TEXT,title TEXT,body_html TEXT NOT NULL DEFAULT '',position INTEGER NOT NULL DEFAULT 0,is_enabled INTEGER NOT NULL DEFAULT 1,min_words INTEGER NOT NULL DEFAULT 800,FOREIGN KEY(page_id) REFERENCES pages(id) ON DELETE CASCADE)`,
`CREATE TABLE IF NOT EXISTS content_versions(id TEXT PRIMARY KEY,entity_type TEXT NOT NULL,entity_id TEXT NOT NULL,data_json TEXT NOT NULL,created_by TEXT,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
`CREATE TABLE IF NOT EXISTS posts(id TEXT PRIMARY KEY,slug TEXT NOT NULL UNIQUE,title TEXT NOT NULL,excerpt TEXT,body_html TEXT NOT NULL DEFAULT '',category TEXT,status TEXT NOT NULL DEFAULT 'draft',cover_key TEXT,seo_title TEXT,seo_description TEXT,scheduled_at TEXT,published_at TEXT,created_by TEXT,updated_by TEXT,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
`CREATE TABLE IF NOT EXISTS menus(id TEXT PRIMARY KEY,location TEXT NOT NULL,label TEXT NOT NULL,path TEXT,parent_id TEXT,position INTEGER NOT NULL DEFAULT 0,is_enabled INTEGER NOT NULL DEFAULT 1)`,
`CREATE TABLE IF NOT EXISTS learning_items(id TEXT PRIMARY KEY,type TEXT NOT NULL,title TEXT NOT NULL,slug TEXT UNIQUE,level TEXT,body_html TEXT NOT NULL DEFAULT '',status TEXT NOT NULL DEFAULT 'draft',cover_key TEXT,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
`CREATE TABLE IF NOT EXISTS resources(id TEXT PRIMARY KEY,title TEXT NOT NULL,type TEXT NOT NULL,level TEXT,description TEXT,file_key TEXT,cover_key TEXT,status TEXT NOT NULL DEFAULT 'draft',created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
`CREATE TABLE IF NOT EXISTS exams(id TEXT PRIMARY KEY,code TEXT NOT NULL UNIQUE,title TEXT NOT NULL,group_key TEXT NOT NULL,level TEXT,duration_minutes INTEGER NOT NULL DEFAULT 60,status TEXT NOT NULL DEFAULT 'draft',require_explanation INTEGER NOT NULL DEFAULT 1,description TEXT DEFAULT '',instructions TEXT DEFAULT '',total_points REAL DEFAULT 50,created_by TEXT,updated_by TEXT,validated_at TEXT,published_at TEXT,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
`CREATE TABLE IF NOT EXISTS questions(id TEXT PRIMARY KEY,exam_id TEXT NOT NULL,position INTEGER NOT NULL,type TEXT NOT NULL DEFAULT 'single_choice',content TEXT NOT NULL,explanation TEXT,audio_key TEXT,image_key TEXT,requires_audio INTEGER NOT NULL DEFAULT 0,points REAL NOT NULL DEFAULT 1,tts_text TEXT,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,FOREIGN KEY(exam_id) REFERENCES exams(id) ON DELETE CASCADE,UNIQUE(exam_id,position))`,
`CREATE TABLE IF NOT EXISTS question_options(id TEXT PRIMARY KEY,question_id TEXT NOT NULL,label TEXT,content TEXT NOT NULL,is_correct INTEGER NOT NULL DEFAULT 0,position INTEGER NOT NULL DEFAULT 0,FOREIGN KEY(question_id) REFERENCES questions(id) ON DELETE CASCADE)`,
`CREATE TABLE IF NOT EXISTS exam_attempts(id TEXT PRIMARY KEY,exam_id TEXT NOT NULL,visitor_id TEXT,visitor_token TEXT,started_at TEXT NOT NULL,submitted_at TEXT,status TEXT DEFAULT 'in_progress',score REAL,correct_count INTEGER,wrong_count INTEGER,blank_count INTEGER,duration_seconds INTEGER,result_json TEXT,FOREIGN KEY(exam_id) REFERENCES exams(id))`,
`CREATE TABLE IF NOT EXISTS exam_answers(id TEXT PRIMARY KEY,attempt_id TEXT NOT NULL,question_id TEXT NOT NULL,answer_json TEXT,is_correct INTEGER,points REAL,updated_at TEXT DEFAULT CURRENT_TIMESTAMP,FOREIGN KEY(attempt_id) REFERENCES exam_attempts(id) ON DELETE CASCADE)`,
`CREATE TABLE IF NOT EXISTS media(id TEXT PRIMARY KEY,r2_key TEXT NOT NULL UNIQUE,filename TEXT NOT NULL,mime_type TEXT,size_bytes INTEGER,alt_text TEXT,caption TEXT,folder TEXT DEFAULT 'uploads',width INTEGER,height INTEGER,uploaded_by TEXT,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,updated_at TEXT DEFAULT CURRENT_TIMESTAMP)`,
`CREATE TABLE IF NOT EXISTS forms(id TEXT PRIMARY KEY,form_key TEXT NOT NULL UNIQUE,title TEXT NOT NULL,schema_json TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'active')`,
`CREATE TABLE IF NOT EXISTS form_submissions(id TEXT PRIMARY KEY,form_id TEXT NOT NULL,data_json TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'new',created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
`CREATE TABLE IF NOT EXISTS partners(id TEXT PRIMARY KEY,name TEXT NOT NULL,type TEXT,logo_key TEXT,website TEXT,description TEXT,status TEXT NOT NULL DEFAULT 'active',position INTEGER NOT NULL DEFAULT 0)`,
`CREATE TABLE IF NOT EXISTS audit_logs(id TEXT PRIMARY KEY,admin_id TEXT,action TEXT NOT NULL,entity TEXT NOT NULL,entity_id TEXT,details_json TEXT,ip TEXT,user_agent TEXT,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
`CREATE TABLE IF NOT EXISTS cms_items(id TEXT PRIMARY KEY,module TEXT NOT NULL,slug TEXT,title TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'draft',position INTEGER NOT NULL DEFAULT 0,data_json TEXT NOT NULL DEFAULT '{}',created_by TEXT,updated_by TEXT,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,UNIQUE(module,slug))`,
`CREATE TABLE IF NOT EXISTS site_revisions(id TEXT PRIMARY KEY,key TEXT NOT NULL,old_value TEXT,new_value TEXT,changed_by TEXT,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
`CREATE TABLE IF NOT EXISTS feature_flags(key TEXT PRIMARY KEY,enabled INTEGER NOT NULL DEFAULT 0,description TEXT,updated_by TEXT,updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
`CREATE TABLE IF NOT EXISTS backups(id TEXT PRIMARY KEY,kind TEXT NOT NULL,status TEXT NOT NULL,r2_key TEXT,note TEXT,created_by TEXT,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
`CREATE INDEX IF NOT EXISTS idx_questions_exam ON questions(exam_id,position)`,
`CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status,published_at)`,
`CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at DESC)`,
`CREATE INDEX IF NOT EXISTS idx_cms_module ON cms_items(module,status,position)`,
`CREATE INDEX IF NOT EXISTS idx_media_created ON media(created_at DESC)`,
`CREATE INDEX IF NOT EXISTS idx_attempt_exam ON exam_attempts(exam_id,started_at DESC)`,
`CREATE INDEX IF NOT EXISTS idx_attempt_visitor ON exam_attempts(visitor_token,started_at DESC)`
];

const seed = [
`INSERT OR IGNORE INTO site_settings(key,value) VALUES
 ('site_name','Nhà Hán Ngữ'),('tagline','Kết nối tri thức • Mở lối tương lai'),('primary_color','#9d1820'),('accent_color','#c59a3d'),
 ('logo_key','/brand/nhn-logo.jpg'),('ctt_url','https://ctt.nhahanngu.io.vn'),('content_min_words','800'),('maintenance_mode','false'),
 ('footer_description','Không gian học tập, chia sẻ và kết nối dành cho cộng đồng quan tâm đến Hán ngữ và tiếng Trung.'),
 ('contact_email','nhahanngu.vn@gmail.com'),('support_email','nhahanngu.info@gmail.com'),('facebook_url',''),('tiktok_url',''),('instagram_url',''),
 ('seo_default_title','Nhà Hán Ngữ'),('seo_default_description','Học Hán ngữ, HSK, HSKK, CSCA, học liệu, thi thử và cộng đồng.'),
 ('homepage_hero_title','Học Hán ngữ theo một hành trình rõ ràng, thực tế và có cộng đồng.'),
 ('homepage_hero_description','Nhà Hán Ngữ xây dựng không gian học tập, học liệu, thi thử và hoạt động cộng đồng dành cho người học tiếng Trung ở nhiều cấp độ.'),
 ('navigation_json','[{"label":"Trang chủ","path":"/"},{"label":"Về chúng tôi","path":"/ve-chung-toi"},{"label":"Học Hán Ngữ","path":"/hoc-han-ngu"},{"label":"Kho học liệu","path":"/kho-hoc-lieu"},{"label":"Thi thử","path":"/thi-thu"},{"label":"Kiến thức","path":"/kien-thuc"},{"label":"Tin tức & Sự kiện","path":"/tin-tuc-su-kien"},{"label":"Cộng đồng","path":"/cong-dong"},{"label":"Đối tác","path":"/doi-tac"},{"label":"Liên hệ","path":"/lien-he"}]'),
 ('homepage_sections_json','["learning","exams","activities","community"]')`,
`INSERT OR IGNORE INTO permissions(id,code,description) VALUES
 ('p-dashboard','dashboard.view','Xem tổng quan'),('p-site-view','site.view','Xem cấu hình website'),('p-site-manage','site.manage','Quản lý giao diện/cài đặt website'),
 ('p-content-view','content.view','Xem nội dung CMS'),('p-content-create','content.create','Tạo nội dung CMS'),('p-content-edit','content.edit','Sửa nội dung CMS'),
 ('p-content-publish','content.publish','Xuất bản nội dung CMS'),('p-content-delete','content.delete','Xóa nội dung CMS'),('p-media-view','media.view','Xem Media Library'),
 ('p-media-manage','media.manage','Upload/sửa/xóa media'),('p-exam-view','exams.view','Xem ngân hàng đề'),('p-exam-edit','exams.edit','Tạo/sửa/import đề'),
 ('p-exam-publish','exams.publish','Validate/xuất bản đề'),('p-exam-delete','exams.delete','Xóa đề'),('p-users-manage','users.manage','Quản lý tài khoản'),
 ('p-roles-manage','roles.manage','Quản lý vai trò và quyền'),('p-logs-view','logs.view','Xem nhật ký'),('p-settings-manage','settings.manage','Quản lý cấu hình hệ thống')`,
`INSERT OR IGNORE INTO roles(id,name,description) VALUES
 ('role-admin','Quản trị viên','Quản trị phần lớn nội dung và vận hành'),('role-secretary','Thư ký','Nội dung hành chính, chương trình và biểu mẫu'),
 ('role-editor','Biên tập viên','Soạn và chỉnh sửa nội dung'),('role-learning','Quản lý học liệu','Quản lý nội dung học và học liệu'),
 ('role-exam','Quản lý khảo thí','Quản lý ngân hàng đề và kết quả'),('role-media','Truyền thông','Quản lý nội dung truyền thông và media'),
 ('role-external','Đối ngoại','Quản lý đối tác và hợp tác'),('role-viewer','Chỉ xem','Chỉ xem dữ liệu được phép')`,
`INSERT OR IGNORE INTO role_permissions(role_id,permission_id) SELECT 'role-admin',id FROM permissions WHERE code NOT IN ('users.manage','roles.manage')`,
`INSERT OR IGNORE INTO role_permissions(role_id,permission_id) SELECT 'role-editor',id FROM permissions WHERE code IN ('dashboard.view','content.view','content.create','content.edit','media.view')`,
`INSERT OR IGNORE INTO role_permissions(role_id,permission_id) SELECT 'role-learning',id FROM permissions WHERE code IN ('dashboard.view','content.view','content.create','content.edit','content.publish','media.view','media.manage')`,
`INSERT OR IGNORE INTO role_permissions(role_id,permission_id) SELECT 'role-exam',id FROM permissions WHERE code IN ('dashboard.view','exams.view','exams.edit','exams.publish','media.view','media.manage')`,
`INSERT OR IGNORE INTO role_permissions(role_id,permission_id) SELECT 'role-viewer',id FROM permissions WHERE code IN ('dashboard.view','content.view','media.view','exams.view')`
];

export function ensureRuntimeSchema(env: RuntimeEnv){
  if (!ready) ready = (async()=>{
    await env.DB.batch(ddl.map(sql=>env.DB.prepare(sql)));
    await env.DB.batch(seed.map(sql=>env.DB.prepare(sql)));
  })().catch(err=>{ready=null; throw err});
  return ready;
}
