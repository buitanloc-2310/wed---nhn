# R2 Public Modules — 2026-09-13

Hai module công khai mới được tách khỏi D1:

## 1. Tài liệu công khai
- Admin: `Admin > Dữ liệu & học tập > Tài liệu công khai`.
- Public: `/kho-hoc-lieu` và `/tai-lieu`.
- File lưu tại R2 dưới `public-resources/`.
- Danh mục/metadata lưu tại R2 object `system/public-documents.json`.
- `/api/public/resources` chạy không cần D1. Nếu index chưa có, API fallback liệt kê file trong `public-resources/`.

## 2. Mã & xác nhận
- Admin: `Admin > Dữ liệu & học tập > Mã & xác nhận`.
- Public: `/tra-cuu?code=...`.
- Mỗi mã lưu độc lập tại R2: `verification/<CODE>.json`.
- Index quản trị lưu tại `system/verification-index.json`.
- `/api/public/verify/<CODE>` chạy không cần D1.

## Nguyên tắc lỗi độc lập
- D1 lỗi: trang tài liệu và tra cứu mã vẫn có thể chạy nếu R2 hoạt động.
- R2 lỗi: chỉ tài liệu/tra cứu bị ảnh hưởng; website tĩnh vẫn có fallback cấu hình.
- Admin vẫn cần D1 để xác thực tài khoản và quyền.

Không cần migration D1 mới cho hai module này.
