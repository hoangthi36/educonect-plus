# 04 — Kiến trúc và auth mốc 1

## Cấu trúc đề xuất khi demo hiện tại là HTML thuần
- `reference/legacy-demo/`: bản sao demo gốc index/app/styles và asset cần thiết; không phục vụ public trong production.
- `client/`: React + Vite, JavaScript, router, CSS variables; pages, components, features/auth, features/demo, services, fixtures.
- `server/`: Express, Mongoose; modules/auth, modules/profile, middleware, config, scripts, tests.
- `docs/`, `assets/`, root package.json với npm workspaces, package-lock.json, .env.example, .gitignore.
Nếu đã có React/Express tương thích thì dùng cấu trúc sẵn có, tránh khởi tạo app lồng vào app.

## Triển khai đơn giản
Production trên Vercel: static output `client/dist` và Express Function `/api/*` cùng một domain, kết nối MongoDB Atlas. Dev: Vite proxy `/api` tới Express. Chế độ Node production ngoài Vercel vẫn cho Express phục vụ `client/dist`; không tách frontend/backend sang hai origin.
API 404 phải trả JSON, không rơi vào SPA fallback. SPA fallback chỉ GET HTML route hợp lệ; viết phù hợp phiên bản Express đã khóa. Static chỉ client/dist, tuyệt đối không serve root repo hoặc .env.

## Lệnh Codex cần tạo và kiểm chứng
Root `npm run dev`: chạy client/server.
`npm run build`: build frontend.
`npm start`: production server dùng client/dist.
`npm test`: test tự động trọng yếu.
`npm run lint`: lint.
`npm run seed:admin`: tạo admin an toàn, idempotent.
`npm run test:e2e`: nếu đã thêm runner E2E.
Đây là contract lệnh phải triển khai, chưa khẳng định hiện có. README cuối phải phản ánh đúng script đã chạy được.

## Auth thật
- Dùng email/password để giảm phụ thuộc; đăng ký gồm name, email, password, role parent/tutor. Khách không tạo record riêng. Phone optional riêng tư; không gắn verified khi chưa xác minh.
- Public register allowlist parent/tutor; reject admin, các field tokens/isBlocked/isVerified/permissions do client gửi.
- Admin tạo bằng script cục bộ có quyền server, không public signup, không mật khẩu cứng trong repo. Script đọc env/hidden prompt, không in password, không reset admin đã tồn tại.
- Hash mật khẩu bằng thư viện phù hợp (ưu tiên Argon2id), không lưu plaintext; validate server; unique index email normalized; xử lý race duplicate.
- Session server-side dùng express-session + Mongo store. Cookie HttpOnly, Secure trên HTTPS production, SameSite=Lax, Path=/; host-only. Session TTL và cookie đồng bộ; mặc định đề xuất 8 giờ, cấu hình được. Không dùng MemoryStore production.
- Regenerate session khi đăng nhập; destroy server session khi logout, xóa đúng cookie. /me lấy từ session và DB, không tin role browser. User bị disabled phải bị chặn theo DB.
- Origin validation cho các request thay đổi + CSRF token tied to session, kiểm tra cả login/register/logout/profile; SameSite không phải biện pháp duy nhất. Endpoint lấy CSRF tạo pre-auth session; sau login session rotate thì lấy lại CSRF token.
- Rate limit login/register theo IP và identifier hợp lý; thông báo login sai chung. Không khóa vĩnh viễn vì nhập sai. Không expose hash/session/secrets trong JSON/log.
- Input giới hạn length/type, role enum, lọc update field, tránh đưa request body thẳng vào Mongo query/update. Mật khẩu tối thiểu đề xuất 12 ký tự, không cắt âm thầm; giới hạn body phù hợp.
- Auth có loading trước khi route guard quyết định, tránh nháy UI và vòng lặp redirect. Server là nơi quyết định quyền, ProtectedRoute chỉ là UX.
- Private profile chỉ owner (và admin khi nghiệp vụ cho phép rõ), không suy đoán quyền từ userId URL. /me response allowlist trường cần thiết.

## API contract tối thiểu (đề xuất cho code mới)
| Method/path | Quyền | Hành vi |
|---|---|---|
| GET /api/health | Public | Liveness không lộ config |
| GET /api/ready | Public | 200 khi DB sẵn sàng, 503 nếu chưa; không lộ URI |
| GET /api/auth/csrf | Public | CSRF cho session hiện tại |
| POST /api/auth/register | Public + CSRF | Tạo parent/tutor, 201; sau đó UI tới login |
| POST /api/auth/login | Public + CSRF | Tạo phiên, 200 và user safe fields |
| GET /api/auth/me | Auth | 200 hoặc 401 |
| POST /api/auth/logout | CSRF | Hủy phiên, 204; không mutation qua GET |
| GET /api/me/profile | Auth | Hồ sơ của mình |
| PATCH /api/me/profile | Auth + CSRF | Allowlist field theo role |
| GET /api/admin/summary | Admin | Số lượng tổng hợp cần cho dashboard |

Lỗi: 400 validation, 401 chưa đăng nhập, 403 sai role/CSRF, 409 email trùng, 429 quá số lần. Shape nhất quán `{error:{code,message,fields?}}`; không stack trace production.

## Dữ liệu thật mốc 1
User: name,emailNormalized,passwordHash,role,accountStatus,createdAt,updatedAt.
Profile: basic info theo role, verificationStatus='unverified'. Có thể embed đơn giản.
Session: Mongo session store.
Không seed Token đã trả tiền vào tài khoản thật. Mọi state 2 Tokens nằm fixture /demo. Giai đoạn sau mới thêm CreditOrder, Payment, CreditLedger, MatchRequest, TrialProposal, FailureClaim, Conversation/Message.

## Giao diện nối dữ liệu
AuthProvider dùng auth API thật. Profile service thật. BusinessDemoProvider độc lập chỉ /demo. Account pages không fallback sang persona demo khi API lỗi. Số dư thật chưa có backend phải hiển thị 'Chưa kích hoạt', không bịa 2 Tokens.
API base relative `/api`; credentials dùng cùng origin. Không đưa MONGODB_URI/SESSION_SECRET vào biến VITE_*.

## Env cần tài liệu hóa
NODE_ENV, PORT, MONGODB_URI, SESSION_SECRET, APP_ORIGIN, SESSION_TTL_HOURS.
ADMIN_EMAIL/ADMIN_PASSWORD chỉ cho tác vụ seed; sau seed xóa khỏi môi trường service nếu không dùng.
Không chép giá trị thật vào .env.example. Startup production fail nếu thiếu secret/DB. Trust proxy cấu hình phù hợp host, không mở tùy tiện. Chọn Node LTS tương thích và pin cùng phiên bản local/deploy sau kiểm tra, không đoán phiên bản có trên máy.
