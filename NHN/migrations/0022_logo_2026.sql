INSERT INTO site_settings(key,value,updated_at)
VALUES('logo_key','/brand/nhn-logo-2026.png',datetime('now'))
ON CONFLICT(key) DO UPDATE SET value='/brand/nhn-logo-2026.png',updated_at=datetime('now');
