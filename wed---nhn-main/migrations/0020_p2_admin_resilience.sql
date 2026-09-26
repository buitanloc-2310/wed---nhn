CREATE INDEX IF NOT EXISTS idx_site_revisions_created_at ON site_revisions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_site_revisions_key ON site_revisions(key);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_media_folder_created ON media(folder, created_at DESC);
