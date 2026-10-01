# Nhà Hán Ngữ — Final release 2026-10-01

## Phạm vi đã xử lý
- Cô lập lỗi từng tab Admin bằng Error Boundary; lỗi một module không còn làm trắng toàn bộ Admin.
- API CMS đọc `data_json` theo cơ chế an toàn để một bản ghi JSON lỗi không làm sập danh sách.
- Hero desktop được thu gọn và cân lại hai cột để tránh tràn/cắt chữ.
- Toàn bộ nhãn người dùng nhìn thấy “Thi thử” được đổi thành “Bài tập luyện HSK”; route `/thi-thu` được giữ để tương thích liên kết cũ.
- Chuẩn nội dung xuất bản đổi thành 300–400 từ cho pages/posts/learning/resources/knowledge/community/partners/contact ở cả Admin và API.
- 50 mục nội dung dựng sẵn đã được kiểm tra lại độ dài: 300–375 từ/mục.
- Loại các cụm từ khó hiểu/không phù hợp như “Không góc khuất”, “nội dung chuyên sâu”, “hệ sinh thái” trong nội dung dựng sẵn; giảm thuật ngữ D1/R2 ở giao diện Admin thông thường.
- Trang HSK hiển thị đúng mô hình production: 9 cấp × 20 bài = 180 bài HSK. Không dùng 260 làm số lượng HSK.
- Giữ các sửa lỗi integrity trước đó: deadline server, ownership attempt, unique answer, RBAC publish, upload/form validation, sanitize CMS.

## Kiểm tra đã chạy
- TypeScript/TSX syntax transpile: PASS, 0 file lỗi cú pháp.
- 23 migrations chạy tuần tự trên SQLite sạch: PASS.
- Seed sau migration: 260 exams tổng, 13.000 questions, 52.000 options.
- HSK published: HSK 1–9 đều 20 bài, tổng 180.
- 50 nội dung dựng sẵn: tất cả 300–400 từ (thực tế 300–375).
- Quét source: không còn “Thi thử/thi thử”, “200–350”, “Không góc khuất”, “Nội dung chuyên sâu”, “260 đề” trong mã giao diện TypeScript.
- Loại JavaScript build cũ trùng route Functions để tránh deploy nhầm phiên bản.

## Giới hạn môi trường kiểm thử
`npm install` từ registry bị timeout trong môi trường kiểm thử nên chưa thể chạy `vite build` production đầy đủ. Trước deploy chính thức vẫn nên chạy `npm install`, `npm run lint`, `npm run build` trong môi trường có kết nối npm ổn định.
