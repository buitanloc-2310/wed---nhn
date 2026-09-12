PRAGMA foreign_keys=ON;
CREATE TABLE IF NOT EXISTS admins(id TEXT PRIMARY KEY,name TEXT NOT NULL,email TEXT NOT NULL UNIQUE,password_hash TEXT NOT NULL,password_salt TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'active',is_root INTEGER NOT NULL DEFAULT 0,created_at TEXT NOT NULL,updated_at TEXT);
CREATE TABLE IF NOT EXISTS admin_sessions(token TEXT PRIMARY KEY,admin_id TEXT NOT NULL,expires_at TEXT NOT NULL,created_at TEXT NOT NULL,FOREIGN KEY(admin_id) REFERENCES admins(id) ON DELETE CASCADE);
CREATE TABLE IF NOT EXISTS roles(id TEXT PRIMARY KEY,name TEXT NOT NULL UNIQUE,description TEXT,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS permissions(id TEXT PRIMARY KEY,code TEXT NOT NULL UNIQUE,description TEXT);
CREATE TABLE IF NOT EXISTS admin_roles(admin_id TEXT NOT NULL,role_id TEXT NOT NULL,PRIMARY KEY(admin_id,role_id));
CREATE TABLE IF NOT EXISTS role_permissions(role_id TEXT NOT NULL,permission_id TEXT NOT NULL,PRIMARY KEY(role_id,permission_id));
CREATE TABLE IF NOT EXISTS system_settings(key TEXT PRIMARY KEY,value TEXT,updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS site_settings(key TEXT PRIMARY KEY,value TEXT,updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS pages(id TEXT PRIMARY KEY,slug TEXT NOT NULL UNIQUE,title TEXT NOT NULL,excerpt TEXT,body_html TEXT NOT NULL DEFAULT '',status TEXT NOT NULL DEFAULT 'draft',min_words INTEGER NOT NULL DEFAULT 800,seo_title TEXT,seo_description TEXT,og_image_key TEXT,created_by TEXT,updated_by TEXT,published_at TEXT,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS page_sections(id TEXT PRIMARY KEY,page_id TEXT NOT NULL,section_key TEXT,title TEXT,body_html TEXT NOT NULL DEFAULT '',position INTEGER NOT NULL DEFAULT 0,is_enabled INTEGER NOT NULL DEFAULT 1,min_words INTEGER NOT NULL DEFAULT 800,FOREIGN KEY(page_id) REFERENCES pages(id) ON DELETE CASCADE);
CREATE TABLE IF NOT EXISTS content_versions(id TEXT PRIMARY KEY,entity_type TEXT NOT NULL,entity_id TEXT NOT NULL,data_json TEXT NOT NULL,created_by TEXT,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS posts(id TEXT PRIMARY KEY,slug TEXT NOT NULL UNIQUE,title TEXT NOT NULL,excerpt TEXT,body_html TEXT NOT NULL DEFAULT '',category TEXT,status TEXT NOT NULL DEFAULT 'draft',cover_key TEXT,seo_title TEXT,seo_description TEXT,scheduled_at TEXT,published_at TEXT,created_by TEXT,updated_by TEXT,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS menus(id TEXT PRIMARY KEY,location TEXT NOT NULL,label TEXT NOT NULL,path TEXT,parent_id TEXT,position INTEGER NOT NULL DEFAULT 0,is_enabled INTEGER NOT NULL DEFAULT 1);
CREATE TABLE IF NOT EXISTS learning_items(id TEXT PRIMARY KEY,type TEXT NOT NULL,title TEXT NOT NULL,slug TEXT UNIQUE,level TEXT,body_html TEXT NOT NULL DEFAULT '',status TEXT NOT NULL DEFAULT 'draft',cover_key TEXT,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS resources(id TEXT PRIMARY KEY,title TEXT NOT NULL,type TEXT NOT NULL,level TEXT,description TEXT,file_key TEXT,cover_key TEXT,status TEXT NOT NULL DEFAULT 'draft',created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS exams(id TEXT PRIMARY KEY,code TEXT NOT NULL UNIQUE,title TEXT NOT NULL,group_key TEXT NOT NULL,level TEXT,duration_minutes INTEGER NOT NULL DEFAULT 60,status TEXT NOT NULL DEFAULT 'draft',require_explanation INTEGER NOT NULL DEFAULT 1,created_by TEXT,validated_at TEXT,published_at TEXT,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS questions(id TEXT PRIMARY KEY,exam_id TEXT NOT NULL,position INTEGER NOT NULL,type TEXT NOT NULL DEFAULT 'single_choice',content TEXT NOT NULL,explanation TEXT,audio_key TEXT,image_key TEXT,requires_audio INTEGER NOT NULL DEFAULT 0,points REAL NOT NULL DEFAULT 1,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,FOREIGN KEY(exam_id) REFERENCES exams(id) ON DELETE CASCADE,UNIQUE(exam_id,position));
CREATE TABLE IF NOT EXISTS question_options(id TEXT PRIMARY KEY,question_id TEXT NOT NULL,label TEXT,content TEXT NOT NULL,is_correct INTEGER NOT NULL DEFAULT 0,position INTEGER NOT NULL DEFAULT 0,FOREIGN KEY(question_id) REFERENCES questions(id) ON DELETE CASCADE);
CREATE TABLE IF NOT EXISTS exam_attempts(id TEXT PRIMARY KEY,exam_id TEXT NOT NULL,visitor_id TEXT,started_at TEXT NOT NULL,submitted_at TEXT,score REAL,correct_count INTEGER,wrong_count INTEGER,blank_count INTEGER,duration_seconds INTEGER,result_json TEXT,FOREIGN KEY(exam_id) REFERENCES exams(id));
CREATE TABLE IF NOT EXISTS exam_answers(id TEXT PRIMARY KEY,attempt_id TEXT NOT NULL,question_id TEXT NOT NULL,answer_json TEXT,is_correct INTEGER,points REAL,FOREIGN KEY(attempt_id) REFERENCES exam_attempts(id) ON DELETE CASCADE);
CREATE TABLE IF NOT EXISTS media(id TEXT PRIMARY KEY,r2_key TEXT NOT NULL UNIQUE,filename TEXT NOT NULL,mime_type TEXT,size_bytes INTEGER,alt_text TEXT,caption TEXT,uploaded_by TEXT,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS forms(id TEXT PRIMARY KEY,form_key TEXT NOT NULL UNIQUE,title TEXT NOT NULL,schema_json TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'active');
CREATE TABLE IF NOT EXISTS form_submissions(id TEXT PRIMARY KEY,form_id TEXT NOT NULL,data_json TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'new',created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS partners(id TEXT PRIMARY KEY,name TEXT NOT NULL,type TEXT,logo_key TEXT,website TEXT,description TEXT,status TEXT NOT NULL DEFAULT 'active',position INTEGER NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS audit_logs(id TEXT PRIMARY KEY,admin_id TEXT,action TEXT NOT NULL,entity TEXT NOT NULL,entity_id TEXT,details_json TEXT,ip TEXT,user_agent TEXT,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE INDEX IF NOT EXISTS idx_questions_exam ON questions(exam_id,position);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status,published_at);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at DESC);
INSERT OR IGNORE INTO site_settings(key,value) VALUES
('site_name','Nhà Hán Ngữ'),('tagline','Kết nối tri thức • Mở lối tương lai'),('primary_color','#9d1820'),('accent_color','#c59a3d'),('logo_key','/brand/nhn-logo.jpg'),('ctt_url','https://ctt.nhahanngu.io.vn'),('content_min_words','800'),('maintenance_mode','false');
CREATE TABLE IF NOT EXISTS cms_items(
  id TEXT PRIMARY KEY,
  module TEXT NOT NULL,
  slug TEXT,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  position INTEGER NOT NULL DEFAULT 0,
  data_json TEXT NOT NULL DEFAULT '{}',
  created_by TEXT,
  updated_by TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(module,slug)
);
CREATE INDEX IF NOT EXISTS idx_cms_module ON cms_items(module,status,position);
