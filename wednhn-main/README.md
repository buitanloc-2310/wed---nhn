# wednhn-main — Website Nhà Hán Ngữ

Source website chính `nhahanngu.io.vn`, tách biệt với `ctt.nhahanngu.io.vn` nhưng giữ cùng DNA nhận diện.

## Stack
- React 19 + TypeScript + Vite
- Cloudflare Pages / Pages Functions
- Cloudflare D1: `wed-nhn`
- D1 Database ID: `9fa26c74-ad2a-4ae0-8921-2576d3f767ca`
- Cloudflare R2 bucket: `wed-nhn`

## Public site
- Website hoàn chỉnh theo nhận diện đỏ/vàng của Nhà Hán Ngữ.
- Không hiển thị thông tin quản trị/placeholder trên public site.
- 50 mục nội dung nền đã được biên soạn sẵn; mỗi mục tối thiểu 1.860 từ, vượt chuẩn 800 từ và cả mốc 1.500 từ.
- Nếu D1 chưa chạy seed, frontend vẫn có nội dung built-in để tránh trang trắng/placeholder.
- Sau khi chạy migrations, nội dung được lưu D1 và có thể chỉnh toàn bộ từ Admin.
- Font public được harden cho tiếng Việt + chữ Hán, tránh font serif gây tách/gãy chữ.

## Thi thử
- 260 đề được seed sẵn và Published:
  - HSK 1–9: 180 đề (20 đề/cấp)
  - Nâng cao: 20 đề
  - Cao cấp: 20 đề
  - Tiếng Trung giao tiếp: 20 đề
  - Luyện nghe: 20 đề
- Mỗi đề 50 câu.
- Tổng: 13.000 câu hỏi + 52.000 phương án trả lời.
- Tất cả câu có đáp án đúng và giải thích.
- Bài Luyện nghe có 1.000 câu sử dụng `listening_tts`; trình duyệt phát giọng đọc `zh-CN` từ nội dung nghe. Audio do Admin upload vẫn dùng R2 và được Validate tồn tại thật.
- Public exam end-to-end: danh sách đề → bắt đầu → lưu đáp án D1 → nộp → chấm điểm → xem đáp án và giải thích.

> Ngân hàng đề seed là bộ câu hỏi luyện tập do NHN biên soạn cho website, không được mô tả là đề thi chính thức.

## Admin
- `/admin` có Initial Setup. Chỉ tài khoản gốc được tự khởi tạo lần đầu.
- Không có đăng ký tài khoản công khai.
- CMS CRUD cho: Về NHN, Học Hán Ngữ, Kho học liệu, Kiến thức, Tin tức, Cộng đồng, Đối tác, Liên hệ.
- Quy tắc Publish: các mục nội dung công khai phải đạt tối thiểu 800 từ.
- Media Library upload trực tiếp lên R2.
- Website settings, màu, logo, menu, SEO, hero, contact, maintenance trong D1.
- Account / role / permission / audit log.
- Exam Manager: create/edit/import/validate/publish/delete.
- Validate: đúng 50 câu, vị trí 1–50, đúng 1 đáp án/câu, option, điểm, thời gian, giải thích; audio upload phải tồn tại trên R2; `listening_tts` phải có nội dung phát nghe.

## D1 migrations
Có 17 migration, chạy toàn bộ bằng:

```bash
npm run db:migrate:remote
```

Sau khi chạy xong, D1 phải có:
- 50 CMS items
- 260 published exams
- 13.000 questions
- 52.000 question options

Các migration:
- `0001_nhn_core.sql`
- `0002_complete_system.sql`
- `0003_seed_public_content.sql`
- `0004_exam_seed_01.sql` → `0016_exam_seed_13.sql`
- `0017_public_navigation.sql`

## Build Cloudflare Pages
- Framework preset: `None`
- Build command: `npm run build`
- Build output: `dist`
- Root directory: `/` nếu repo mở ra thấy `package.json`
- Production branch: `main`

Bindings:
- `DB` → D1 `wed-nhn`
- `MEDIA` → R2 `wed-nhn`

`wrangler.jsonc` đã khai báo sẵn bindings trên.

## Local
```bash
npm install
npm run lint
npm run build
npm run cf:dev
```

## Lưu ý
- Không commit API token/secret vào source.
- D1 lưu dữ liệu có cấu trúc; R2 lưu ảnh/PDF/audio/file upload.
- Public user không cần tài khoản.
- Tài khoản chỉ dành cho nhân sự nội bộ được cấp từ Admin.

## Khôi phục D1 khi báo `no such table: admins`

Bản này có cơ chế **runtime schema bootstrap** trong Pages Functions: khi API chạy lần đầu, các bảng lõi (bao gồm `admins`) sẽ tự được tạo nếu D1 đang trống. Vì vậy trang `/admin` có thể tạo tài khoản gốc ngay cả trước khi seed toàn bộ dữ liệu.

Để nạp đầy đủ **50 nội dung CMS + 260 đề + 13.000 câu**, vẫn phải chạy toàn bộ migrations trên D1 remote sau khi deploy:

```bash
npm run db:migrate:remote
npm run db:status:remote
npm run db:health:remote
```

Có thể kiểm tra nhanh trên website:

```text
/api/system/health
```

Kết quả hoàn chỉnh phải có tối thiểu:
- `exams: 260`
- `questions: 13000`
- `cms_items: 50`
- `seed_complete: true`

Nếu Admin vào được nhưng Thi thử chưa có đề, nguyên nhân là schema lõi đã tự tạo nhưng **seed migrations chưa được chạy hết**.

## Liên kết ngoài

Mọi liên kết dẫn sang website khác domain (ví dụ Cổng thông tin `ctt.nhahanngu.io.vn`, đối tác, mạng xã hội, tài liệu ngoài) được mở trong **tab mới** và gắn `rel="noopener noreferrer"`. Liên kết nội bộ của `nhahanngu.io.vn` vẫn mở trong cùng tab.
