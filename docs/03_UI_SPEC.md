# 03 — Branding và đặc tả giao diện

## Nhận diện
- Tên chính xác: **Educonect+** (giữ cách viết người dùng yêu cầu; không tự đổi thành Educonnect+).
- Slogan chính xác: **Kết nối đúng người – Trao gửi niềm tin – Đồng hành cùng tri thức**.
- Ảnh: assets/educonect-logo.png. Khi chuyển React, copy nguyên bản vào client/public/brand/educonect-logo.png, dùng /brand/educonect-logo.png. Không gọi ảnh like từ Zalo, không vẽ logo thay thế.
- Ảnh nguồn vuông có khoảng trắng: object-fit: contain; nền trắng, khung khoảng 64–80px desktop. Không kéo giãn/cắt mất EC+. Kiểm tra logo có đủ dễ nhận diện; nếu cần bản vector/ít lề xin nguồn khác, không tự tái tạo.
- Kế thừa nền xanh nhạt, navy, teal, CTA vàng và card bo tròn từ screenshot.
- Gợi ý CSS tokens: navy #132B58, teal #008C95, yellow #FFD34D, background #F4F7FC, border #DDE6F4, danger #B42318. Kiểm tra tương phản, không chỉ dùng màu báo lỗi.
- Tên/slogan nằm dưới hoặc cạnh logo; slogan đầy đủ ở desktop và footer, mobile có thể xuống dòng trong brand area/footer để không tràn. Không viết lại slogan.

## Thay nội dung cũ
| Cũ | Mới |
|---|---|
| KèmBạn | Educonect+ |
| Học gần nhà, tiến bộ mỗi ngày | Slogan đã chốt |
| Lớp học | Kết nối của tôi / Dạy thử (đúng ngữ cảnh) |
| Theo từng buổi — Quản lý tiến độ & thanh toán | Kết nối minh bạch — Thỏa thuận trực tiếp |
| Ví học phí/rút tiền/gói buổi học | Token & gói kết nối (chỉ gia sư) |
| Dropdown role trên header | Đăng nhập/đăng ký hoặc menu tài khoản thật |
| Số thông báo '2' cố định | Ẩn hoặc dữ liệu phù hợp; badge demo chỉ trong /demo |

Hero đề xuất: 'Gia sư phù hợp. Kết nối để cùng tiến bộ.'
Mô tả: 'Tìm gia sư dạy trực tiếp 1–1, trao đổi nhu cầu và thống nhất buổi dạy thử. Phụ huynh không đặt cọc qua nền tảng.'
Không quảng cáo đảm bảo 2 lớp thành công, xác minh chưa làm, thanh toán được bảo chứng.

## Màn hình và quyền
| Route đề xuất | Khách | Phụ huynh | Gia sư | Admin |
|---|---|---|---|---|
| /, /tutors, /tutors/:id, /posts | Xem public demo | Xem | Xem | Xem |
| /how-it-works, /support | Xem | Xem | Xem | Xem |
| /login, /register | Form thật | Redirect dashboard nếu đã login | Tương tự | Tương tự |
| /account/profile | Yêu cầu login | Hồ sơ riêng | Hồ sơ riêng | Hồ sơ riêng |
| /parent/dashboard | Không | Có | 403 | 403 |
| /tutor/dashboard, /tutor/credits | Không | 403 | Có | 403 |
| /admin | Không | 403 | 403 | Có |
| /demo | Xem mô phỏng | Xem mô phỏng | Xem mô phỏng | Xem mô phỏng |

Parent/tutor dashboards thật ở mốc 1 hiển thị hồ sơ và empty state; CTA 'Trải nghiệm luồng minh họa' dẫn /demo. Không tạo kết nối thật từ fixtures.

## Khách
Header: Khám phá, Tìm gia sư, Bảng tin, Cách hoạt động, Đăng nhập, Đăng ký.
Trang chủ có hero/search môn+khu vực, nhóm môn, hồ sơ nổi bật, 3 bước kết nối, CTA phụ huynh và gia sư riêng.
Search fixtures lọc được theo môn/khu vực/mức phí dự kiến; không có kết quả phải hiện empty state và reset filter.
Xem profile public không chứa SĐT, địa chỉ cụ thể hay giấy tờ. CTA Connect yêu cầu đăng nhập parent, chưa gọi backend nghiệp vụ. Thông tin học phí ghi 'mức tham khảo/thỏa thuận'.

## Phụ huynh
Header: Tìm gia sư, Bảng tin, Kết nối của tôi, Tin nhắn, Tài khoản. Không có ví/nạp Token/đặt cọc.
Dashboard demo: nhu cầu tìm gia sư, lời mời chờ xử lý, đang trao đổi, đề xuất Buổi 0.
Nhu cầu: môn/cấp học, khu vực tương đối, lịch mong muốn, ngân sách dự kiến, mô tả. Chưa có buổi học chính thức.
Accept Connect → phòng chat mô phỏng, banner giữ kín liên hệ trước dạy thử.
Card Buổi 0: thời gian, nội dung, địa điểm tương đối, phí dạy thử do hai bên thỏa thuận; CTA Chấp nhận/Từ chối/Đề nghị đổi. Chấp nhận có giải thích mở liên hệ + dùng Token của gia sư, không thu tiền phụ huynh.
Khi có báo hỏng: Xác nhận không tiếp tục / Không đồng ý / Cần trao đổi; gửi xong chờ xử lý, không tự kết luận gian lận.

## Gia sư chưa mua
Dashboard: trạng thái hồ sơ (chưa xác minh), 0 Token; card '300.000đ / 2 lượt kết nối'. Nêu Token được giữ khi mở chat, dùng khi phụ huynh nhận Buổi 0. Không cam kết chắc có 2 lớp.
Ở account thật mốc 1 nút mua bị vô hiệu hóa, lý do 'Thanh toán chưa mở trong bản báo cáo'. Nút xem mô phỏng điều hướng /demo. Không có QR nhận tiền thật.

## Gia sư đã mua — trạng thái cần trình diễn đầy đủ
1. Ban đầu: Khả dụng 2 / Đang giữ 0, lịch sử 'Mua gói mô phỏng'.
2. Accept Connect A: Khả dụng 1 / Đang giữ 1. Thông tin PH chỉ khu vực/nhu cầu.
3. Chat + đề xuất Buổi 0; nút được disable khi đề xuất đang chờ. Không trừ thêm.
4. Phụ huynh chấp nhận: Khả dụng 1 / Đang giữ 0, ghi dùng 1. Mở liên hệ giả lập.
5. Báo hỏng: form lý do + bằng chứng demo; trạng thái đang xét, chưa cộng.
6. Fixture xác minh lần đầu hợp lệ: Khả dụng 2 / Đang giữ 0; hiển thị hoàn 1, cảnh báo lịch sử.
7. Fixture lần hỏng thứ hai: banner tạm khóa nhận kết nối, CTA giải trình; không tự hoàn lần 2.
8. Hết khả dụng: trạng thái rõ ràng, xem 2 Token đang giữ nếu có, hướng dẫn đóng phiên không phù hợp hoặc mua thêm khi tính năng ra mắt; không cấm chat đã mở.
9. Blocked: mua thêm không gỡ khóa; vẫn xem lịch sử/hỗ trợ.

## Demo playground riêng
/demo có nhãn cố định 'MÔ PHỎNG NGHIỆP VỤ — KHÔNG THU TIỀN'. Persona: Khách, Phụ huynh, Gia sư chưa mua, Gia sư 2 Tokens, hết Token, khóa nhận kết nối, admin review mẫu. Đây không phải đổi role tài khoản đăng nhập.
Các panel cùng một fixture store để thao tác của PH cập nhật phía gia sư và ngược lại. Dùng memory reducer; reload/reset về seed, thông báo rõ không lưu lâu dài. Không ghi vào User/session/MongoDB. Nếu cần lưu demo local, namespace riêng và tuyệt đối không lưu credentials.
Public demo không có form gửi tài liệu nhạy cảm; upload demo chỉ chọn tên tệp trong bộ fixture, không tải giấy tờ thật.

## Chat
Desktop 2 cột danh sách/phòng chat, mobile quay lại danh sách. Card đề xuất Buổi 0 trong luồng. Banner trạng thái liên hệ trước/sau TRIAL_ACCEPTED. Banner minh bạch chưa có OCR/SMS thực. Nhập văn bản được trong demo, escape nội dung tránh XSS; không render HTML từ người dùng.

## Admin mốc 1
Dashboard bảo vệ thật: xem thống kê tài khoản tổng hợp tối thiểu, trạng thái dịch vụ; liên kết /demo để xem quy trình báo hỏng. Không hiển thị mọi giấy tờ, mật khẩu hay session. Không dựng nút giả 'đã hoàn tiền' trên dữ liệu thật.

## Chất lượng giao diện
Kiểm tra 360, 390, 768, 1440px; menu mobile keyboard, focus rõ, label form, lỗi cạnh field, loading/submitting/empty/error/success, không double submit. Trang 403/404, quay về trang phù hợp role, không redirect loop. Slogan không tràn; ảnh nguồn không méo; title/favicon không còn KèmBạn trong app mới. Giữ tài liệu reference cũ nguyên trạng.
