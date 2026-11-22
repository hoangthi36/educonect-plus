# 07 — Prompt theo từng lượt

Gửi từng prompt. Sau mỗi mốc xem app, kiểm tra kết quả, rồi mới gửi mốc tiếp. Không bắt Codex đọc lại toàn repo ở mỗi lượt.

## P0 — Kiểm kê và chuẩn bị
```text
Đọc AGENTS.md, docs/01_SCOPE.md và docs/09_PROGRESS.md. Tôi đang ở thư mục demo cũ, muốn triển khai mốc 1 Educonect+. Kiểm tra index.html, app.js, styles.css, package.json nếu có và Git status; chưa được suy đoán file thiếu. Sao lưu demo kèm dependencies vào reference/legacy-demo, không ghi đè nguồn hay xóa thay đổi của tôi. Lập mapping các màn hình cũ sang logic mới, ghi kết quả vào docs/09_PROGRESS.md. Nếu chưa có MERN, đề xuất cấu trúc client/server theo docs/04_ARCHITECTURE_AUTH.md. Hoàn thành kiểm kê, chưa code nghiệp vụ hoặc tích hợp dịch vụ trả phí. Chỉ hỏi khi có thông tin thật sự thiếu để tiếp tục.
```

## P1 — Nền giao diện, branding
```text
Thực hiện M1 trong docs/05_TASKS.md. Đọc docs/03_UI_SPEC.md và phần kiến trúc cần thiết. Tận dụng bố cục/CSS demo cũ, chuyển thành React/Vite nếu nguồn đang HTML thuần. Xây layout, router, homepage, header/footer và CSS tokens; dùng ảnh EC+ đã cung cấp, tên Educonect+ và slogan nguyên văn. Không tạo role switch thật. Tạo script dev/build đúng cấu trúc hiện có; kiểm tra build và responsive 390/1440. Chưa triển khai backend nghiệp vụ. Cập nhật PROGRESS với lệnh đã chạy và phần còn thiếu.
```

## P2a — Khách và màn hình theo role
```text
Tiếp tục M2a và phần layout M2b. Đọc docs/03_UI_SPEC.md, chỉ xem code liên quan. Hoàn thiện public search/profile/posts, dashboard parent/tutor/admin và trang credits. Dùng fixtures ghi rõ demo. Account routes mới chưa có auth phải hiển thị trạng thái đang phát triển, không giả đăng nhập thành công. Dành /demo riêng cho chuyển persona. Không có lớp chính thức, ví học phí, rút tiền. Kiểm tra UI, build và cập nhật PROGRESS. Chưa làm auth trong lượt này.
```

## P2b — Demo tương tác nghiệp vụ
```text
Đọc docs/02_BUSINESS_RULES.md, phần demo của docs/03_UI_SPEC.md và docs/06_ACCEPTANCE.md. Hoàn thành /demo dùng một reducer/fixture store riêng: tutor 2 Tokens, parent accept Connect giữ 1, chat/đề xuất Buổi 0, parent accept dùng hold và mở liên hệ giả; cancel trả hold, báo hỏng pending, fixture approved lần 1 hoàn, fixture lần 2 khóa nhận mới chờ review. Không sửa auth, không gọi SMS/OCR/ngân hàng, không dùng dữ liệu cá nhân thật. Chính sách còn mở giữ pending, không tự quyết. Viết test cho double action, nonnegative, release/consume/refund và isolation. Chạy test/build, cập nhật PROGRESS.
```

## P3 — Auth và profile thật
```text
Thực hiện M3a/M3b theo docs/04_ARCHITECTURE_AUTH.md và auth checklist docs/06_ACCEPTANCE.md. Tạo Express/Mongo auth thật với session Mongo + cookie HttpOnly, CSRF, rate limit, register parent/tutor, login/logout/me, profile self-only, admin tạo CLI. Nối React, role guards server và client; /demo hoàn toàn tách khỏi quyền thật. Không dùng localStorage để xác thực. Tạo .env.example và hướng dẫn tôi điền bí mật cục bộ, không yêu cầu gửi mật khẩu vào chat. Chạy integration tests bằng test DB riêng, build và cập nhật PROGRESS. Nếu Mongo chưa cấu hình, hoàn thành code/check có thể chạy, ghi rõ test chưa chạy và hướng dẫn tôi bật DB, không báo PASS giả.
```

## P4 — Review trước deploy
```text
Đọc PROGRESS và docs/06_ACCEPTANCE.md. Review diff và chạy các kiểm tra cần cho mốc 1: role escalation, CSRF/session/logout, profile ownership, secrets/static serving, demo isolation, Token reducer, brand, responsive/deep links. Sửa lỗi trong phạm vi mốc 1 rồi kiểm tra lại phần ảnh hưởng. Không viết lại toàn bộ project, không thêm nghiệp vụ giai đoạn 2. Liệt kê ngắn lỗi đã sửa, kết quả thực và blocker. Cập nhật PROGRESS/README.
```

## P5 — Chuẩn bị và triển khai báo cáo
```text
Thực hiện M5 theo docs/08_DEPLOY.md. Dùng Express serve React build cùng origin, MongoDB deploy riêng. Kiểm tra scripts build/start, cấu hình env không lộ bí mật, health/ready, SPA fallback đúng Express version. Chuẩn bị cấu hình và hướng dẫn Render từ source thật. Nếu tôi đã cấp quyền/kết nối và chọn host thì deploy; nếu chưa có quyền hãy hoàn tất cấu hình, báo chính xác thao tác tôi cần làm, không bịa URL. Sau deploy chạy smoke test và cập nhật PROGRESS với URL, commit, checklist; không bật thanh toán/chat thật hoặc mua dịch vụ mới.
```

## Tiếp tục trong chat mới
```text
Đọc AGENTS.md và docs/09_PROGRESS.md. Tiếp tục đúng mục 'Việc tiếp theo', chỉ mở tài liệu/code liên quan. Không làm lại phần đã PASS trừ khi có thay đổi ảnh hưởng hoặc lỗi mới. Hoàn thành task, kiểm tra và cập nhật PROGRESS.
```

## Khi có lỗi
```text
Đây là bước tái hiện và log lỗi (tôi đã bỏ thông tin bí mật): [dán log]. Đọc PROGRESS và file liên quan, tìm nguyên nhân, sửa tối thiểu, kiểm tra lại đúng luồng. Không cài lại toàn bộ project hoặc đổi kiến trúc để né lỗi. Ghi kết quả kiểm tra thực.
```

## Tiết kiệm token đúng cách
Một lượt một mốc nhỏ; dùng đường dẫn file thay vì dán toàn bộ đặc tả. Sau thay đổi lớn lưu tiến độ rồi mới mở chat mới. Không ép AI bỏ kiểm tra auth để tiết kiệm. Không yêu cầu multi-agent hoặc tái review toàn repo mỗi khi sửa chữ. Không dùng 'làm hết mọi thứ' vì sẽ kéo thanh toán/OCR vào mốc báo cáo.
