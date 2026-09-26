# Phân chức năng Admin & giảm phụ thuộc D1

Bản này chia sidebar Admin thành 4 cụm độc lập: Tổng quan, Nội dung website, Dữ liệu & học tập, Quản trị hệ thống.

Nguyên tắc vận hành:
- Website công khai có cấu hình mặc định trong source; lỗi đọc D1 không làm Header/Footer mất nội dung.
- Nội dung chuyên sâu chỉ bắt buộc >= 800 từ ở Pages, Posts, Learning, Knowledge. Resources/Community/Partners/Contact không còn bị chặn vô lý.
- File thật nằm ở R2. Media Library ưu tiên metadata D1 nhưng có thể fallback sang danh sách R2 khi bảng media lỗi.
- Upload file thành công vào R2 vẫn được trả thành công kể cả bước ghi metadata D1 lỗi; response có `storage_mode: r2-only`.
- Auth, phân quyền, audit và dữ liệu động vẫn dùng D1 vì đây là dữ liệu cần tính nhất quán.

Mục tiêu: lỗi một module không kéo sập toàn bộ website/Admin.
