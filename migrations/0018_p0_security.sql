CREATE TABLE IF NOT EXISTS auth_rate_limits(id TEXT PRIMARY KEY,attempts INTEGER NOT NULL DEFAULT 0,window_started_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
UPDATE site_settings SET value='/brand/nhn-logo-2026.png' WHERE key='logo_key' AND value='/brand/nhn-logo.jpg';
