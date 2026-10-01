# NHN P3 release checklist
- Run `npm ci`, `npm run lint`, `npm run build` in CI.
- Apply D1 migrations through 0023 before production smoke test.
- Smoke test: home, news list/detail, participation submit, verify, resources, exam, admin login, form builder, media upload, revisions, system health.
- Test widths: 360, 390, 768, 1024, 1440px.
- Verify keyboard focus, skip link, reduced motion, 404, Back/Forward, direct route refresh.
- Verify manifest/service worker and clear prior site data once after first P3 deploy if an old worker persists.
