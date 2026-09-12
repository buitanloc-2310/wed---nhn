# wednhn-main — Website Nhà Hán Ngữ

Source website chính `nhahanngu.io.vn`, tách biệt với cổng `ctt.nhahanngu.io.vn` nhưng giữ cùng DNA nhận diện.

## Stack
- React 19 + TypeScript + Vite
- Cloudflare Pages / Pages Functions
- Cloudflare D1: `wed-nhn`
- D1 Database ID: `9fa26c74-ad2a-4ae0-8921-2576d3f767ca`
- Cloudflare R2 bucket: `wed-nhn`

## Chức năng đã triển khai
- Public site + giao diện NHN đỏ/vàng, responsive.
- `/admin` với Initial Setup: chỉ tài khoản gốc được tự khởi tạo lần đầu.
- Không có đăng ký tài khoản công khai.
- Role/permission server-side; root bypass quyền, tài khoản khác nhận quyền qua role.
- CMS CRUD thật cho Trang, Bài viết/Tin tức, Học Hán Ngữ, Học liệu, Cộng đồng và Đối tác.
- Trình biên tập rich text dùng `contentEditable`; hỗ trợ heading, bold, italic, list, link, ảnh.
- Quy tắc nội dung: các module nội dung chuyên sâu không được Publish dưới 800 từ.
- Website settings lưu D1: logo, màu, slogan, email, SEO mặc định, hero, maintenance, navigation JSON, homepage sections JSON.
- Menu public đọc `navigation_json` từ D1, có fallback an toàn khi chưa cấu hình.
- Media Library: list/search/upload trực tiếp từ máy lên R2, preview, alt text, xóa R2 + metadata D1.
- Admin tài khoản: tạo tài khoản nội bộ, gán role khi tạo, khóa/mở và thu hồi session.
- Role & Permission: xem và chỉnh permission cho role.
- Audit Log: login/logout, CMS, media, account, role, exam, settings.
- Dashboard lấy số liệu thật từ D1, không dùng số tĩnh.
- Exam Manager: tạo/list/xóa/import JSON, validate, publish.
- Validate đề bắt buộc: đúng 50 câu, vị trí 1–50, 1 đáp án đúng, option, điểm, thời gian, giải thích khi bắt buộc; audio bắt buộc được kiểm tra tồn tại thật trên R2.
- Public exam end-to-end: danh sách đề Published → tải đề → tạo attempt → autosave từng đáp án D1 → submit → chấm điểm → trả kết quả + đáp án đúng + giải thích.
- Mục tiêu dữ liệu: 180 đề HSK 1–9 + 80 đề Nâng cao/Cao cấp/Giao tiếp/Luyện nghe = 260 đề, tối thiểu 13.000 câu. Source không nhét câu hỏi giả; nhập ngân hàng đề NHN có quyền sử dụng qua Admin/import.

## D1 migrations
Chạy theo thứ tự:
```bash
npm run db:migrate:remote
```
Migrations hiện có:
- `0001_nhn_core.sql`
- `0002_complete_system.sql`

## Local / build
```bash
npm install
npm run lint
npm run build
npm run cf:dev
```

> Lưu ý: môi trường tạo gói source không cài xong dependency do giới hạn thời gian mạng, vì vậy cần chạy `npm install && npm run lint && npm run build` trên máy/deployment CI trước khi deploy production.

## Deploy
`wrangler.jsonc` đã bind:
- `DB` → D1 `wed-nhn`
- `MEDIA` → R2 `wed-nhn`

Không commit Cloudflare API token, secret hoặc credential vào source/frontend.

## Import đề
Mẫu payload: `scripts/exam-import-schema.json`.
Mỗi đề phải chứa đúng 50 câu. Sau import đề ở trạng thái `draft`; chỉ được Publish sau khi Validate thành công.

## Nguyên tắc “Admin không góc khuất”
Các cấu hình vận hành thường xuyên phải nằm trong Admin/D1/R2 thay vì sửa code: nhận diện, menu, nội dung, media, học liệu, đề thi, account, role, settings và audit. Các bí mật hạ tầng, rule bảo mật nền tảng và source framework không được đưa vào CMS.
