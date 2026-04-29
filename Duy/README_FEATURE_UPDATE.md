# Feature update: cập nhật countdown khi tải lại hoặc quay lại trang

## Những gì đã được thêm
- Tự tính lại countdown mỗi giây.
- Tự đồng bộ lại countdown khi:
  - tải trang lần đầu,
  - quay lại tab,
  - focus lại cửa sổ,
  - trở lại trang bằng Back/Forward.
- Giao diện mới hiển thị:
  - trạng thái kỳ thi,
  - số ngày / giờ / phút / giây còn lại,
  - thời điểm đồng bộ gần nhất.
- Vẫn giữ tính năng chỉnh sửa kỳ thi.

## Những gì đã được làm sạch
- Bỏ seed dữ liệu trùng lặp trong `ApplicationDbContext`.
- Đổi `Migrate()` sang `EnsureCreated()` để phù hợp project đơn giản chưa có migrations đi kèm.
- Bỏ file không cần thiết: `temp.py`, `examcountdown.db-shm`, `examcountdown.db-wal`.

## File thay đổi chính
- `Program.cs`
- `Data/ApplicationDbContext.cs`
- `wwwroot/index.html`
- `wwwroot/js/exam.js`
- `wwwroot/css/style.css`
