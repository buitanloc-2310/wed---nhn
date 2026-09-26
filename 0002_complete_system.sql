PRAGMA foreign_keys=ON;

CREATE TABLE IF NOT EXISTS site_revisions(
  id TEXT PRIMARY KEY,
  key TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  changed_by TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS feature_flags(
  key TEXT PRIMARY KEY,
  enabled INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  updated_by TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS backups(
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL,
  status TEXT NOT NULL,
  r2_key TEXT,
  note TEXT,
  created_by TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_media_created ON media(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_attempt_exam ON exam_attempts(exam_id,started_at DESC);
CREATE INDEX IF NOT EXISTS idx_attempt_visitor ON exam_attempts(visitor_token,started_at DESC);

INSERT OR IGNORE INTO permissions(id,code,description) VALUES
('p-dashboard','dashboard.view','Xem tổng quan'),
('p-site-view','site.view','Xem cấu hình website'),
('p-site-manage','site.manage','Quản lý giao diện/cài đặt website'),
('p-content-view','content.view','Xem nội dung CMS'),
('p-content-create','content.create','Tạo nội dung CMS'),
('p-content-edit','content.edit','Sửa nội dung CMS'),
('p-content-publish','content.publish','Xuất bản nội dung CMS'),
('p-content-delete','content.delete','Xóa nội dung CMS'),
('p-media-view','media.view','Xem Media Library'),
('p-media-manage','media.manage','Upload/sửa/xóa media'),
('p-exam-view','exams.view','Xem ngân hàng đề'),
('p-exam-edit','exams.edit','Tạo/sửa/import đề'),
('p-exam-publish','exams.publish','Validate/xuất bản đề'),
('p-exam-delete','exams.delete','Xóa đề'),
('p-users-manage','users.manage','Quản lý tài khoản'),
('p-roles-manage','roles.manage','Quản lý vai trò và quyền'),
('p-logs-view','logs.view','Xem nhật ký'),
('p-settings-manage','settings.manage','Quản lý cấu hình hệ thống');

INSERT OR IGNORE INTO roles(id,name,description) VALUES
('role-admin','Quản trị viên','Quản trị phần lớn nội dung và vận hành'),
('role-secretary','Thư ký','Nội dung hành chính, chương trình và biểu mẫu'),
('role-editor','Biên tập viên','Soạn và chỉnh sửa nội dung'),
('role-learning','Quản lý học liệu','Quản lý nội dung học và học liệu'),
('role-exam','Quản lý khảo thí','Quản lý ngân hàng đề và kết quả'),
('role-media','Truyền thông','Quản lý nội dung truyền thông và media'),
('role-external','Đối ngoại','Quản lý đối tác và hợp tác'),
('role-viewer','Chỉ xem','Chỉ xem dữ liệu được phép');

INSERT OR IGNORE INTO role_permissions(role_id,permission_id)
SELECT 'role-admin',id FROM permissions WHERE code NOT IN ('users.manage','roles.manage');
INSERT OR IGNORE INTO role_permissions(role_id,permission_id)
SELECT 'role-editor',id FROM permissions WHERE code IN ('dashboard.view','content.view','content.create','content.edit','media.view');
INSERT OR IGNORE INTO role_permissions(role_id,permission_id)
SELECT 'role-learning',id FROM permissions WHERE code IN ('dashboard.view','content.view','content.create','content.edit','content.publish','media.view','media.manage');
INSERT OR IGNORE INTO role_permissions(role_id,permission_id)
SELECT 'role-exam',id FROM permissions WHERE code IN ('dashboard.view','exams.view','exams.edit','exams.publish','media.view','media.manage');
INSERT OR IGNORE INTO role_permissions(role_id,permission_id)
SELECT 'role-viewer',id FROM permissions WHERE code IN ('dashboard.view','content.view','media.view','exams.view');

INSERT OR IGNORE INTO site_settings(key,value) VALUES
('footer_description','Không gian học tập, chia sẻ và kết nối dành cho cộng đồng quan tâm đến Hán ngữ và tiếng Trung.'),
('contact_email','nhahanngu.vn@gmail.com'),
('support_email','nhahanngu.info@gmail.com'),
('facebook_url',''),('tiktok_url',''),('instagram_url',''),
('seo_default_title','Nhà Hán Ngữ'),('seo_default_description','Học Hán ngữ, HSK, HSKK, CSCA, học liệu, thi thử và cộng đồng.'),
('homepage_hero_title','Học Hán ngữ theo một hành trình rõ ràng, thực tế và có cộng đồng.'),
('homepage_hero_description','Nhà Hán Ngữ xây dựng không gian học tập, học liệu, thi thử và hoạt động cộng đồng dành cho người học tiếng Trung ở nhiều cấp độ.'),
('navigation_json','[{"label":"Trang chủ","path":"/"},{"label":"Về chúng tôi","path":"/ve-chung-toi"},{"label":"Học Hán Ngữ","path":"/hoc-han-ngu"},{"label":"Kho học liệu","path":"/kho-hoc-lieu"},{"label":"Thi thử","path":"/thi-thu"},{"label":"Kiến thức","path":"/kien-thuc"},{"label":"Tin tức & Sự kiện","path":"/tin-tuc-su-kien"},{"label":"Cộng đồng","path":"/cong-dong"},{"label":"Đối tác","path":"/doi-tac"},{"label":"Liên hệ","path":"/lien-he"}]'),
('homepage_sections_json','["learning","exams","activities","community"]');
