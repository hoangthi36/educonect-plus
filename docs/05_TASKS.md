# 05 — Kế hoạch task nhỏ

Mỗi task kết thúc bằng kiểm tra + cập nhật PROGRESS. Không chuyển tới nghiệp vụ giai đoạn 2 trong lượt làm mốc 1.

| ID | Việc | Đầu ra | Điều kiện hoàn thành |
|---|---|---|---|
| M0 | Kiểm kê nguồn và backup | Danh sách file, trạng thái Git, legacy reference | Xác nhận có app.js/styles.css, không mất code |
| M1 | Scaffold React/Vite + CSS/layout + branding | Header/footer/router/home | Logo đúng, slogan đủ, build được |
| M2a | Khách, search, profile, bảng tin | Fixtures/filter/public screens | Responsive, không lộ contact |
| M2b | Parent/tutor/admin layout và demo state | Dashboards, credits, connect/chat/trial | Role-specific UI, persona đổi chỉ /demo |
| M2c | Demo failure/refund/blocked | Kịch bản lần 1/lần 2 | Hold/consume/refund nhất quán, mock có nhãn |
| M3a | Express/Mongo + register/login/logout/me | Backend auth thật | Auth integration tests |
| M3b | Nối React auth/profile + RBAC | Route guards/API checks | Refresh/logout/cross-role kiểm tra |
| M4 | Review và regression | Fix + evidence | Acceptance mốc 1 pass |
| M5 | Deploy + smoke | URL và hướng dẫn báo cáo | DB lưu thật, HTTPS session, deep links |

## Tránh sửa lan
UI tasks không viết payment gateway/OCR. Auth tasks không viết lại homepage khi không liên quan. M5 không đổi business rules. Nếu code cũ trái logic, sửa đúng phạm vi và ghi mapping.

## Giai đoạn 2 (chưa làm)
1. Chốt open decisions và quyền dữ liệu.
2. Gói Token + đơn mua + đối soát/ledger idempotent.
3. Match/hold/release thực.
4. Chat + moderation trước phát tin; bảo vệ media/profile.
5. Trial acceptance/consume/contact unlock nguyên tử.
6. Failure claims, phụ huynh xác nhận, hoàn/khóa/review.
7. Đánh giá phù hợp dữ liệu có thể xác minh.
Chưa thể gọi payment/credit hoàn chỉnh chỉ vì có demo UI.
