# Cloudflare deployment checklist

## 1. Build
Cloudflare Pages:
- Framework preset: None
- Build command: `npm run build`
- Output directory: `dist`

## 2. Bindings
- D1 binding name: `DB` → `wed-nhn`
- R2 binding name: `MEDIA` → `wed-nhn`

## 3. Chạy D1 đầy đủ
Sau khi source mới đã lên GitHub, chạy từ máy có Wrangler:

```bash
npm install
npx wrangler login
npm run db:migrate:remote
```

Kiểm tra:

```bash
npx wrangler d1 migrations list wed-nhn --remote
```

Phải thấy migrations `0001` đến `0017` đã applied.

## 4. Kiểm tra dữ liệu bằng D1 Console

```sql
SELECT COUNT(*) AS cms_items FROM cms_items;
SELECT COUNT(*) AS exams FROM exams WHERE status='published';
SELECT COUNT(*) AS questions FROM questions;
SELECT COUNT(*) AS options FROM question_options;
SELECT level, COUNT(*) FROM exams WHERE group_key='hsk' GROUP BY level ORDER BY level;
```

Kết quả mong đợi:
- cms_items = 50
- exams = 260
- questions = 13000
- options = 52000
- mỗi HSK 1–9 = 20 đề

## 5. Nếu public vẫn hiện dữ liệu cũ
- Redeploy commit mới nhất.
- Hard refresh / clear cache.
- Kiểm tra Pages project có đúng D1 binding `DB` và R2 binding `MEDIA`.
- Kiểm tra migration list đã applied đủ 0017.
