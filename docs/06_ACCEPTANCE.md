# 06 — Checklist nghiệm thu

Đánh dấu PASS chỉ khi có kết quả thực; dùng NOT RUN khi chưa có môi trường. Không cần test mọi CSS, tập trung lỗi auth/role và số dư demo.

## UI
- Logo EC+ đúng; Educonect+ chính xác; slogan đầy đủ; app mới không còn tên KèmBạn, lớp chính thức, ví học phí/rút tiền.
- Khách có đăng nhập/đăng ký, không menu đổi role thật.
- Search filter chạy, reset được, empty state rõ.
- Parent không có mua Token/đặt cọc. Tutor có khả dụng/đang giữ phân biệt.
- 360/390/768/1440px không tràn ngang, menu/label/focus ổn, đủ loading/error/empty.
- Public profile không chứa phone/address bí mật trong payload.
- 404, 403, refresh deep route, back/forward hoạt động.

## Demo reducer tests
- (2,0) → chat (1,1) → accept trial (1,0); consume chỉ một lần dù click/gửi lại.
- Chat cancel từ (1,1) → (2,0), không tăng failure counter.
- Refund lần đầu chỉ sau fixture approved: +1 đúng một lần.
- Không đủ available thì không hold, số dư không âm.
- Đề xuất cũ sau cancel không consume/unlock.
- Khóa lần 2 chỉ chặn nhận mới, giữ hỗ trợ/lịch sử; không tự refund lần 2.
- Thao tác /demo không đổi /api/auth/me, role hay dữ liệu thật; reset/reload rõ.

## Auth integration (Mongo test DB riêng)
- Register parent/tutor, email trùng, dữ liệu không hợp lệ.
- Đăng ký role admin và inject credit/isVerified bị reject/không được lưu.
- Hash khác password, response/log không có passwordHash.
- Login đúng/sai, CSRF sai, rate limit; session ID thay đổi khi login.
- /me 401 khi guest, đúng role sau login; refresh giữ phiên.
- Parent gọi API admin 403; tutor gọi API admin 403; admin 200.
- PATCH profile không đổi role/accountStatus/credit; không sửa người khác.
- Logout hủy session; dùng cookie cũ không truy cập được.
- Mất Mongo: báo lỗi/503 phù hợp, không báo đăng nhập thành công giả.

## Deploy smoke
- Health/ready, logo/CSS/JS, HTTPS, cookie Secure/HttpOnly, refresh /tutor/dashboard.
- Tạo 2 tài khoản thử khác role, đăng nhập/đăng xuất; hồ sơ còn sau restart service.
- /api/unknown trả JSON 404, không index HTML.
- Truy cập /.env, /server/, /reference/ không lộ source/secrets.
- Không real QR/payment endpoint hoạt động, không seed admin password public.
- Ghi URL/commit, kết quả test và phần chưa làm vào PROGRESS.

## Kịch bản báo cáo 5–7 phút
1. Khách: nhận diện mới, tìm và lọc, hồ sơ public.
2. Đăng ký parent thật, đăng nhập, sửa hồ sơ, refresh.
3. Đăng xuất, đăng nhập tutor thật, chỉ ra quyền khác và trạng thái chưa kích hoạt.
4. Chuyển rõ sang /demo: tutor 2 Tokens → parent đồng ý chat → held → đề xuất Buổi 0 → parent chấp nhận → consumed/mở liên hệ giả.
5. Demo báo hỏng: pending, xác nhận lần 1 hoàn, fixture lần 2 khóa.
6. Giải thích phần đã hoàn thành thật (auth/profile/deploy) và phần mô phỏng (credit/chat/trial/OCR/SMS chưa tích hợp).
7. Thử truy cập admin bằng parent bị chặn.
Không trình diễn dữ liệu cá nhân thật trên màn hình công khai.
