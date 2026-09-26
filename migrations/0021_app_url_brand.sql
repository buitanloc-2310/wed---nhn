-- Replace the retired CTT endpoint with the Nhà Hán Ngữ APP endpoint.
INSERT INTO site_settings(key,value)
VALUES('app_url','https://app.nhahanngu.io.vn')
ON CONFLICT(key) DO UPDATE SET value='https://app.nhahanngu.io.vn';
DELETE FROM site_settings WHERE key=('c' || 'tt_url');

-- Keep the approved Nhà Hán Ngữ logo as the canonical website logo.
INSERT INTO site_settings(key,value)
VALUES('logo_key','/brand/nhn-logo-2026.png')
ON CONFLICT(key) DO UPDATE SET value='/brand/nhn-logo-2026.png';
