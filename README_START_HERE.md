# Educonect+ — Bộ hướng dẫn Codex triển khai mốc báo cáo

Ngày: 22/11/2026. Đây là bộ đặc tả và prompt để Codex triển khai trong thư mục dự án trên máy bạn; chưa phải ứng dụng MERN đã xây dựng hoặc đã deploy.

## Mục tiêu mốc 1
Hoàn thiện giao diện theo mô hình mới, đăng ký/đăng nhập/phân quyền thật, triển khai một bản demo có thể gửi link báo cáo. Các tính năng thanh toán Token, match, chat, dạy thử, báo hỏng là tương tác mô phỏng có nhãn. Không xử lý tiền thật ở mốc này.

## Bạn đã có gì?
Ảnh thư mục cho thấy `D:\2026.1\CNW\CongNgheWEB\kem-ban-demo` có index.html, app.js, styles.css và tài liệu cũ. File index đính kèm chỉ là shell, gọi styles.css và app.js; chưa có hai file này trong bộ tài liệu được kiểm tra. Codex trên máy bạn phải đọc nguồn thực tế trước khi chuyển đổi. Không kết luận đã kiểm tra app.js/styles.css.

## Cách đặt file — không ghi đè demo cũ
1. Sao lưu thư mục hiện tại hoặc tạo commit Git trước khi sửa.
2. Giải nén ZIP này vào một chỗ tạm.
3. Chép `AGENTS.md`, thư mục `docs`, `assets`, `reference` và file hướng dẫn này vào THƯ MỤC GỐC `kem-ban-demo` (cùng cấp với index.html hiện có).
4. Nếu đã có AGENTS.md/docs/assets, cho Codex hợp nhất, không ghi đè nội dung riêng của bạn.
5. `assets/educonect-logo.png` là ảnh EC+ nguyên gốc bạn cung cấp. Không phải link ảnh biểu tượng like Zalo.
6. Mở toàn bộ thư mục bằng VS Code, dùng Codex extension. Có thể dùng terminal chạy `codex` ngay tại thư mục đó nếu đã cài CLI.

PowerShell (đường dẫn theo ảnh, sửa nếu máy bạn khác):
```powershell
Set-Location 'D:\2026.1\CNW\CongNgheWEB\kem-ban-demo'
code .
```
Nếu `code` không được nhận diện, mở VS Code > Open Folder và chọn thư mục này.

## Dùng prompt nào?
Mở `docs/07_CODEX_PROMPTS.md`, gửi từng prompt P0 → P1 → P2 → P3 → P4 → P5. Không dán tất cả cùng lúc. P0 kiểm kê, P1 nền giao diện, P2 các role, P3 auth thật, P4 review, P5 deploy. Sau mỗi mốc đọc kết quả và kiểm tra; nếu sai thì sửa ngay trước mốc sau.

## Tài liệu đọc theo nhiệm vụ
| File | Dùng khi |
|---|---|
| AGENTS.md | Quy tắc ngắn để Codex áp dụng |
| docs/01_SCOPE.md | Xác định làm thật/mô phỏng/để sau |
| docs/02_BUSINESS_RULES.md | Token, Buổi 0, hoàn và khóa |
| docs/03_UI_SPEC.md | Branding, màn hình, trạng thái từng role |
| docs/04_ARCHITECTURE_AUTH.md | MERN, auth, dữ liệu và phân quyền |
| docs/05_TASKS.md | Danh sách việc theo mốc |
| docs/06_ACCEPTANCE.md | Nghiệm thu và kịch bản báo cáo |
| docs/07_CODEX_PROMPTS.md | Prompt copy-paste theo thứ tự |
| docs/08_DEPLOY.md | Deploy cùng origin, cấu hình và kiểm tra |
| docs/09_PROGRESS.md | Nhật ký ngắn giúp tiếp tục ở chat mới |
| docs/10_DECISIONS.md | Quyết định đã có và câu hỏi còn mở |
| docs/11_SOURCES.md | Tài liệu chính thức đã tham khảo |

Không cần gửi lại toàn bộ đặc tả mỗi lần. Yêu cầu Codex đọc AGENTS.md + PROGRESS + đúng file của nhiệm vụ. Auth, token và thanh toán là ba thứ khác nhau: token dịch vụ Educonect+ không phải token xác thực và không phải token AI.
