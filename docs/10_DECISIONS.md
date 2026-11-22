# 10 — Quyết định và điểm chưa chốt

## Đã được người dùng yêu cầu
- Tên Educonect+, logo EC+ cung cấp, slogan nguyên văn trong UI_SPEC.
- Phụ huynh không đóng trước; học phí ngoài nền tảng.
- Gia sư mua 300.000đ = 2 Tokens.
- IN_CHAT giữ Token, TRIAL_ACCEPTED dùng Token và mở liên hệ.
- Báo hỏng có bằng chứng và phụ huynh xác nhận; lần đầu hợp lệ hoàn Token; hai lần hỏng liên tiếp khóa nhận mới chờ review.
- Ưu tiên hoàn thiện UI, auth theo role, deploy báo cáo trước; nghiệp vụ khác để sau.

## Lựa chọn triển khai đề xuất cho mốc 1 (có thể đổi nếu source đã có giải pháp tương thích)
React/Vite + JavaScript; Express/Mongoose; Mongo-backed session; same-origin deploy; /demo tách biệt; single agent; admin tạo CLI. Quyết định này phục vụ xây bản đầu, không phải tuyên bố đã có trong code cũ.

## Chưa chốt — không tự suy diễn thành backend thật
| ID | Câu hỏi | Cách hiển thị mốc 1 |
|---|---|---|
| O1 | Lần hỏng thứ 2 có hoàn Token? | Chờ Admin, không tự hoàn |
| O2 | Khi nào reset chuỗi hỏng, ai xác nhận thành công? | Fixture thành công riêng, không reset thực |
| O3 | Phụ huynh không trả lời/tranh chấp xử lý bao lâu? | Chờ xác minh/đối soát |
| O4 | Hạn báo hỏng, hạn hold/chat, hạn đề xuất? | Không tự thu phí khi hết hạn; chưa chạy cron |
| O5 | Buổi 0 phí bao nhiêu/miễn phí? | Do hai bên thỏa thuận |
| O6 | Credit có hết hạn, hồ sơ còn public khi hết credit? | Hết credit chặn kết nối mới trong demo, không xóa hồ sơ |
| O7 | Cùng phụ huynh quay lại sau refund tính thế nào? | Chưa mở luồng re-match có tính phí |
| O8 | Hủy sau accept trước Buổi 0 thì sao? | Báo hỏng chờ xét, không auto release vì đã mở liên hệ |
| O9 | Hai bên ai chủ động Connect? | Theo ví dụ chính: tutor gửi, parent chấp nhận; chiều khác chưa mở thật |
| O10 | Gia sư bị khóa, các đề xuất đang chờ xử lý thế nào? | Giữ lịch sử/chat, disable nhận mới, admin xử lý ngoại lệ |

Không dùng 'đã chốt' cho đề xuất mới. Không tuyên bố loại bỏ hoàn toàn rủi ro pháp lý hoặc triệt tiêu gian lận. Mốc 1 không cần giải quyết tất cả các câu hỏi để làm UI/auth, nhưng payment/credit thật cần chốt trước.
