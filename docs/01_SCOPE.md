# 01 — Phạm vi mốc báo cáo

## Thứ tự ưu tiên
1. UI/UX đúng logic mới, tận dụng demo cũ.
2. Đăng ký, đăng nhập, đăng xuất, khôi phục phiên và phân quyền thật.
3. Deploy, kiểm thử trên URL thật, chuẩn bị kịch bản báo cáo.
4. Sau mốc báo cáo mới làm nghiệp vụ thanh toán, credit, match, chat và dạy thử thật.

## Ma trận làm thật và mô phỏng
| Thành phần | Mốc 1 | Giai đoạn sau |
|---|---|---|
| Branding/layout/responsive/router | Thật | Tối ưu |
| Đăng ký parent/tutor, đăng nhập các role, đăng xuất, /me | Thật với MongoDB | Email/phone verification, recovery |
| Admin | Tài khoản CLI, route/API bảo vệ thật | Duyệt hồ sơ, xử lý báo hỏng |
| Hồ sơ của chính mình | Lưu các trường cơ bản thật; chưa có upload giấy tờ | Xác minh, upload an toàn |
| Tìm gia sư, bảng tin | Danh mục giả lập, lọc được, ghi nguồn dữ liệu demo | API/dữ liệu thật |
| Gia sư đã mua 2 Tokens | Persona demo riêng, trạng thái UI tương tác | Ledger/đối soát thật |
| Match/chat/Buổi 0 | Mô phỏng trong /demo, không gửi tới người khác | API và realtime |
| Thanh toán 300k | Trang giải thích gói; tài khoản thật hiện 'Chưa mở thanh toán' | QR, webhook/đối soát |
| Báo hỏng/hoàn/khóa | Mô phỏng kết quả đã được duyệt hoặc chờ xử lý | Bằng chứng, xác nhận phụ huynh, admin |
| OCR/QR/Zalo/SMS | Không tích hợp, không tuyên bố đang bảo vệ thật | Kiểm duyệt và nhà cung cấp |
| Quên mật khẩu | Nêu chưa hỗ trợ; không giả gửi email | Token reset hết hạn, một lần |

Khách là trạng thái chưa đăng nhập, không phải role được đăng ký. Role thật: parent, tutor, admin. Không có dropdown đổi role ở header thật.

## Chống mở rộng phạm vi
Không làm microservices, Kubernetes, Docker bắt buộc, event bus, ví, lớp chính thức, quản lý học phí. Không cần tích hợp AI/LLM. Không làm cả app chỉ bằng localStorage rồi gọi đó là MERN/auth thật.

## Kết quả bàn giao của Codex ở mốc 1
Source client/server, lockfile, .env.example, scripts chạy/build/test, bộ test auth, README thực tế, URL deploy khi có quyền truy cập, ghi nhận các phần mock. Một bản giao diện riêng lẻ chưa đủ đạt mốc 1.
