# 09 — Tiến độ (Codex cập nhật ngắn sau mỗi mốc)

## Trạng thái hiện tại
- Ngày cập nhật: 23/11/2026.
- P0/M0 — kiểm kê nguồn cục bộ và mapping giao diện: DONE.
- M1 — React/Vite + router + layout + branding + trang chủ responsive: DONE.
- P2a — M2a public screens + phần layout tĩnh M2b (`/demo`): DONE.
- P2b — phần tương tác M2b + luồng báo hỏng M2c trong `/demo`: DONE.
- M3a/M3b — Express/MongoDB auth, hồ sơ, session và RBAC nối React: DONE.
- M4 — kiểm thử auth/regression/build/production smoke: DONE.
- M5 — cấu hình deploy Render + Atlas và hướng dẫn vận hành: READY; deploy thật NOT RUN vì chưa có repo/credentials/Atlas URI.
- Thư mục gốc có npm workspaces `client/` và `server/`; Express phục vụ React build + `/api` cùng origin ở production.
- Demo cũ được giữ nguyên tại `kem-ban-demo/`; thanh toán/Token/chat thật vẫn chưa triển khai và chưa có URL public.

## Kiểm kê nguồn P0
- Đã đọc: `AGENTS.md`, `docs/01_SCOPE.md`, `docs/09_PROGRESS.md`, `kem-ban-demo/index.html`, `kem-ban-demo/app.js`, `kem-ban-demo/styles.css`.
- Demo là ứng dụng tĩnh gồm HTML + JavaScript thuần + CSS; `index.html` gọi tương đối `styles.css` và `app.js`; CSS tải font Be Vietnam Pro từ Google Fonts.
- Route hiện có: `home`, `search`, `tutor/:id`, `posts`, `messages`, `package`, `create-package`, `checkout`, `classes`, `wallet`, `review`, `support`, `dashboard`, `admin`.
- Dữ liệu: 5 gia sư giả lập; tìm kiếm/lọc chạy tại trình duyệt. Trạng thái tương tác nằm trong bộ nhớ; riêng role demo được lưu bằng `localStorage`.
- UI có header/nav/footer, hero/search, thẻ gia sư, bộ lọc, hồ sơ, bảng tin, chat, dashboard theo persona, bảng/lịch, modal/toast và breakpoint responsive 1050px/760px.
- Tệp tham khảo bổ sung trong demo: `mockup.png`, `so_do_giao_dien.drawio`, `README.txt`. Asset thương hiệu mới có tại `assets/educonect-logo.png`.

## Mapping giao diện cũ → logic mốc 1
| Màn hình/khối cũ | Xử lý khi triển khai mới |
|---|---|
| Shell, responsive grid, card, filter, modal/toast | Tái sử dụng ý tưởng bố cục/tokens dưới dạng component React; đổi branding chính xác sang Educonect+ và dùng nguyên asset logo đã cấp. |
| Home, tìm gia sư, hồ sơ gia sư, bảng tin | Giữ làm danh mục dữ liệu giả lập có ghi rõ nguồn demo; bộ lọc vẫn tương tác được. Không dùng badge xác minh giả. |
| Role selector `parent/tutor/admin/guest` và `kb_role` trong `localStorage` | Bỏ khỏi header thật. Khách là trạng thái chưa đăng nhập; role thật do server/session quyết định. Chỉ `/demo` được đổi persona hư cấu. |
| Modal “Tiếp tục với tài khoản demo” | Thay bằng đăng ký/đăng nhập thật; public registration chỉ parent/tutor, admin do CLI bảo vệ tạo. |
| Dashboard parent/tutor/admin | Tách theo RBAC thật. Hồ sơ chính mình lưu trường cơ bản thật; các số liệu nghiệp vụ chưa xây phải ghi “Mô phỏng nghiệp vụ” hoặc trạng thái chưa hỗ trợ. |
| Chat/kết nối, đề xuất gói, chia sẻ liên hệ | Chỉ mô phỏng trong `/demo`: `IN_CHAT` giữ 1 Token; phụ huynh chấp nhận đề xuất dạy thử thì tiêu thụ hold và cho phép chia sẻ liên hệ. Không mô phỏng auth thật. |
| Checkout/QR, phụ huynh trả gói, phí kết nối bị khấu trừ | Không đưa vào tài khoản thật và không dùng QR. Trang thật chỉ giải thích: gia sư mua 2 service Tokens/300.000 VND; phụ huynh không trả trước; thanh toán chưa mở. |
| Lớp học, buổi học, gia hạn, ví, payout/ledger | Ngoài phạm vi mốc 1; không xây như nghiệp vụ thật. Nếu cần trình diễn thì chỉ dùng persona hư cấu trong `/demo`, có nhãn mô phỏng rõ ràng. |
| Đánh giá, khiếu nại, xác minh, admin queue | Chỉ mô phỏng kết quả/trạng thái trong `/demo`; route/API admin thật chỉ bảo vệ auth/RBAC ở mốc 1. |
| Nội dung hỗ trợ về hoàn tiền, dời lịch, đối soát | Gỡ các khẳng định chưa được chốt; hiển thị “đang xây dựng/chính sách đang cập nhật”, không tự đặt chính sách. |

## Sai lệch quan trọng đã ghi nhận
- Demo dùng tên/slogan KèmBạn và icon chữ tự tạo, chưa dùng `assets/educonect-logo.png`.
- Demo coi phụ huynh là bên thanh toán gói học, có ví, buổi học và dòng tiền; trái phạm vi và mô hình Token mới.
- Demo cho đổi role và nâng guest thành parent ngay trong UI; không phải auth/RBAC thật.
- Demo có badge “Đã xác minh”, QR, kiểm tra liên hệ/OCR dạng minh họa và một số chính sách nghiệp vụ chưa được chốt; không được mang nguyên sang bản mới.

## Bảng kiểm
| Mốc | Trạng thái | Bằng chứng |
|---|---|---|
| M0 | DONE | Kiểm kê và mapping P0 trong tài liệu này; demo cũ không bị sửa. |
| M1 | DONE | `client/` React/Vite, router/layout/home, logo EC+ nguyên bản; `npm.cmd run build` PASS. |
| M2a | DONE | Search/filter/reset/empty, profile public, bảng tin fixtures; test 3/3 PASS. |
| M2b | DONE | Store/reducer dùng chung trong `/demo`; Connect → hold → chat → đề xuất/chấp nhận Buổi 0; release/consume có guard và ledger. |
| M2c | DONE | Báo hỏng chờ xác minh; công cụ kịch bản Admin hoàn lần đầu đúng một lần và khóa sau lần hai mà không tự hoàn lần hai. |
| M3a | DONE | Express/Mongoose register/login/logout/me, Argon2id, Mongo session, CSRF/Origin, rate limit và admin CLI. |
| M3b | DONE | AuthProvider/API thật, header theo phiên, profile owner, route guard và dashboard theo role thật. |
| M4 | DONE | Lint, 19 test client/server, production smoke và build đều PASS. |
| M5 | READY — NOT DEPLOYED | `render.yaml`, `.env.example`, scripts start/build và hướng dẫn Atlas/Render đã có; thiếu target/quyền cấu hình nên chưa có URL thật. |

## Báo cáo P0
- Task: kiểm kê demo cũ, mapping sang phạm vi mới và sửa đường dẫn/bối cảnh tiến độ.
- File chính đã đổi: `docs/09_PROGRESS.md`.
- Lệnh kiểm tra và kết quả: `node --check kem-ban-demo/app.js` — PASS; kiểm tra tham chiếu `styles.css`/`app.js` — PASS; xác nhận chưa có `package.json`, `client/`, `server/` — PASS; kiểm thử UI trực quan — NOT RUN.
- Giới hạn/blocker: chưa có mã ứng dụng mới; deploy cần target và quyền truy cập ở mốc sau.
- Việc tiếp theo tại thời điểm P0: thực hiện M1 tại thư mục gốc và không sửa nguồn tham khảo cũ (đã hoàn tất; xem báo cáo M1).
- Commit/URL: không có.

## Báo cáo M1
- Task: scaffold React/Vite, router, public layout, header khách, footer và trang chủ Educonect+; các route chưa làm có trang trạng thái rõ ràng.
- File chính đã đổi/tạo: `package.json`, `package-lock.json`, `.gitignore`, `client/package.json`, `client/index.html`, `client/vite.config.js`, `client/src/**`, `client/public/brand/educonect-logo.png`.
- Lệnh kiểm tra và kết quả: `npm.cmd run build` — PASS; preview HTTP `/`, `/tutors`, `/login`, `/brand/educonect-logo.png` — PASS (200); SHA-256 logo nguồn/bản sao — PASS; npm audit khi cài — 0 lỗ hổng.
- QA trực quan 390px và 1440px: NOT RUN — browser access host không khả dụng; kết nối điều khiển Chrome hết thời gian chờ. CSS responsive có breakpoint 1120/900/680/420px nhưng chưa được xác nhận trực quan.
- Giới hạn/blocker: M1 không có backend, auth, thanh toán hoặc nghiệp vụ Token; preview chỉ chạy cục bộ.
- Chạy xem tại máy (PowerShell): tại thư mục gốc chạy `npm.cmd install`, sau đó `npm.cmd run dev`, mở `http://127.0.0.1:5173/`.
- Việc tiếp theo: dừng sau M1; chỉ thực hiện M2a khi người dùng yêu cầu.
- Commit/URL: không có commit; không có URL deploy.

## Báo cáo P2a
- Task: hoàn thiện public tutor search/profile/posts; dựng layout dashboard parent/tutor/admin và trang Token theo persona hư cấu trong `/demo`.
- File chính đã đổi/tạo: `client/src/App.jsx`, `client/src/pages/{TutorsPage,TutorProfilePage,PostsPage,DemoPage}.jsx`, `client/src/components/{TutorCard,FixtureNotice}.jsx`, `client/src/features/demo/**`, `client/src/fixtures/publicData.js`, `client/src/utils/filterTutors*`, `client/src/styles/pages.css`, package scripts.
- Lệnh kiểm tra và kết quả: `npm.cmd test` — PASS (3/3); `npm.cmd run build` — PASS; preview HTTP các route đại diện và logo — PASS (200); scan fixture công khai không có field contact/phone/email/address — PASS.
- QA trực quan: NOT RUN — browser access host không khả dụng. Không ghi PASS cho 390/1440px; responsive mới chỉ được kiểm tra qua CSS/build.
- Route public: `/`, `/tutors`, `/tutors/:tutorId`, `/posts`, `/demo`.
- Route tài khoản/auth chưa triển khai (hiện trang trạng thái trung thực): `/login`, `/register`, `/account/profile`, `/parent/dashboard`, `/tutor/dashboard`, `/tutor/credits`, `/admin`; `/support` vẫn là trang trạng thái.
- `/demo`: persona Khách, Phụ huynh, Gia sư chưa mua Token, Gia sư có 2 Token, Gia sư hết Token khả dụng, Gia sư bị khóa nhận kết nối, Admin review mẫu. Đổi persona chỉ là React state trong bộ nhớ, không phải auth/RBAC.
- Giới hạn: chưa có backend/auth/thanh toán/OCR/SMS; chưa có giữ/trừ/hoàn Token, chat, dạy thử, lớp chính thức, ví học phí hoặc rút tiền.
- Chạy xem tại máy (PowerShell): `npm.cmd install`, `npm.cmd run dev`, mở `http://127.0.0.1:5173/`.
- Việc tiếp theo: dừng sau P2a; chỉ làm P2b khi người dùng yêu cầu.
- Commit/URL: không có commit; không có URL deploy.

## Báo cáo P2b
- Task: hoàn thiện tương tác M2b và M2c chỉ trong `/demo`, dùng một reducer chung cho các persona; không triển khai backend, API hoặc auth.
- File chính đã đổi/tạo: `client/src/features/demo/{demoReducer.js,demoReducer.test.js,DemoStore.jsx,DemoPanels.jsx,DemoChatPanel.jsx,TokenStatusPanel.jsx,ScenarioTools.jsx,demoPersonas.js}`, `client/src/pages/DemoPage.jsx`, `client/src/App.jsx`, `client/src/styles/pages.css`, `docs/09_PROGRESS.md`.
- State demo nằm trong bộ nhớ của React: đổi persona hoặc rời `/demo` rồi quay lại bằng router không reset; chỉ nút **Đặt lại demo** hoặc tải lại trang tạo state ban đầu. Không dùng `localStorage`, `sessionStorage`, API hay query parameter để cấp Token/đổi quyền.
- Guard đã có: kiểm tra persona và trạng thái trước action; không hold khi thiếu Token; action lặp không hold/release/consume/refund lần hai; đề xuất đã hủy không mở liên hệ; số dư không âm; mọi biến động Token có `connectionId` và tham chiếu sự kiện trong ledger.
- `npm.cmd test` — PASS (13/13), gồm hold/release/consume/refund, action lặp, số dư không âm, đề xuất đã hủy, action sai persona, tin nhắn và đổi persona giữ state.
- `npm.cmd run build` — PASS (Vite, 47 modules). Preview HTTP `/`, `/demo`, `/tutors`, `/parent/dashboard`, `/tutor/dashboard`, `/admin` và logo — PASS (200).
- QA trực quan 390px và 1440px: **NOT RUN** — browser access host không khả dụng. CSS responsive và build đã được kiểm tra, nhưng không ghi PASS cho kiểm tra trực quan.
- Route public: `/`, `/tutors`, `/tutors/:tutorId`, `/posts`, `/demo`.
- Route tài khoản/auth vẫn là trang trạng thái chưa triển khai: `/login`, `/register`, `/account/profile`, `/parent/dashboard`, `/tutor/dashboard`, `/tutor/credits`, `/admin`, `/support`.
- Ranh giới: dữ liệu hư cấu, mất khi reload; chat chỉ ở bộ nhớ; liên hệ mở ra là dữ liệu giả. Không backend/MongoDB, auth/RBAC, thanh toán, SMS, OCR, upload giấy tờ, lớp chính thức, ví học phí hoặc rút tiền. `kem-ban-demo/` được giữ nguyên.

### Kịch bản trình diễn Connect → Buổi 0 → báo hỏng
1. Mở `/demo`; persona mặc định **Gia sư** có 2 Token khả dụng, 0 đang giữ, 0 đã sử dụng. Bấm **Gửi Connect**: số dư chưa đổi.
2. Chọn persona **Phụ huynh**, xác nhận trạng thái Connect vẫn còn rồi bấm **Chấp nhận Connect**: số dư thành 1 khả dụng, 1 đang giữ; chat mở nhưng liên hệ còn ẩn.
3. Nhập tin nhắn và bấm **Gửi tin nhắn**. Đổi sang **Gia sư** để thấy cùng lịch sử chat, có thể gửi câu trả lời.
4. Ở Gia sư bấm **Gửi đề xuất Buổi 0**: Token vẫn 1 khả dụng, 1 đang giữ. Đổi sang Phụ huynh. Có thể bấm **Từ chối, tiếp tục trao đổi** để kiểm tra hold vẫn còn; sau đó đổi sang Gia sư gửi đề xuất mới.
5. Ở Phụ huynh bấm **Chấp nhận Buổi 0**: số dư thành 1 khả dụng, 0 đang giữ, 1 đã sử dụng; lúc này liên hệ giả lập mới mở.
6. Đổi sang **Gia sư**, bấm **Gửi yêu cầu báo hỏng**: trạng thái chỉ chuyển sang chờ xác minh, chưa hoàn Token.
7. Đổi sang **Admin · công cụ kịch bản**, bấm **Xác minh hợp lệ lần đầu**: hoàn đúng 1 Token một lần. Bấm **Chuẩn bị báo hỏng lần hai**, sau đó **Xác minh hợp lệ lần hai**: khóa nhận kết nối mới, không tự hoàn Token lần hai.
8. Đổi lại Gia sư để xem trạng thái bị khóa trong khi lịch sử Token và hỗ trợ vẫn khả dụng. Không có action reset chuỗi hỏng.

### Nhánh kiểm tra đóng trước Buổi 0
1. Bấm **Đặt lại demo**, rồi lặp lại Gửi Connect → Chấp nhận Connect.
2. Trước khi chấp nhận Buổi 0, bấm **Đóng kết nối trước Buổi 0** ở góc nhìn Phụ huynh hoặc Gia sư.
3. Xác nhận số dư trở lại 2 khả dụng, 0 đang giữ; không tăng chuỗi hỏng và đề xuất cũ không thể mở liên hệ.

- Chạy xem tại máy (PowerShell): tại thư mục gốc chạy `npm.cmd install`, sau đó `npm.cmd run dev`, mở `http://127.0.0.1:5173/demo`.
- Việc tiếp theo: dừng sau P2b; chỉ chuyển sang P3 khi người dùng yêu cầu.
- Commit/URL: thư mục hiện không có metadata Git khả dụng; không có URL deploy.

## Báo cáo M3a/M3b/M4 và chuẩn bị M5
- Task: triển khai auth/profile/RBAC thật và chuẩn bị deploy báo cáo; giữ nguyên UI công khai và mô phỏng P2b, không mở rộng nghiệp vụ.
- Backend mới: `server/src/{app.js,server.js,config/**,middleware/**,models/User.js,routes/**,scripts/seedAdmin.js,utils/**}`. API gồm health/ready, CSRF, register/login/logout/me, profile của chính mình và admin summary có RBAC.
- Client auth mới: `client/src/features/auth/**`, `LoginPage.jsx`, `RegisterPage.jsx`, `AccountProfilePage.jsx`, `RealDashboardPage.jsx`, `TutorCreditsPage.jsx`, `ForbiddenPage.jsx`; header dùng phiên thật, không có dropdown đổi role.
- Bảo mật: mật khẩu Argon2id; session lưu MongoDB; cookie `HttpOnly`, `SameSite=Lax`, `Secure` ở production; session rotate khi login và destroy khi logout; CSRF gắn session + kiểm tra Origin; giới hạn login/register theo IP+email; input/update allowlist; public signup chỉ `parent`/`tutor`; admin chỉ tạo bằng CLI idempotent.
- Dữ liệu tài khoản thật không có Token. `/demo` vẫn là reducer/fixture độc lập trong bộ nhớ, không gọi API auth và không đổi role/quyền/số dư tài khoản.
- Deploy prep: root workspaces `client/server`, Vite proxy `/api` trong dev, Express phục vụ `client/dist` + API trong production, `render.yaml`, `.env.example`, `.nvmrc`, `README.md`, scripts `dev/build/start/lint/test/test:production/seed:admin`.

### Kết quả kiểm tra
- `npm.cmd install` — PASS; audit khi cài: 0 lỗ hổng.
- `npm.cmd run lint` — PASS.
- `npm.cmd test` — PASS 19/19: 13 test demo/public cũ + 6 integration auth với MongoDB test riêng.
- Auth integration PASS: parent/tutor register; admin public/field nhạy cảm bị reject; email trùng; hash không lộ; CSRF/Origin; login đúng/sai; session ID rotate; refresh/app restart giữ phiên Mongo; profile allowlist; parent/tutor gọi admin 403; admin 200; logout hủy phiên; rate limit 429.
- `npm.cmd run build` — PASS (Vite, 56 modules).
- `npm.cmd run test:production` — PASS: same-origin static/API, deep link, logo, health/ready, JSON API 404, chặn `.env/server/reference`, cookie production Secure/HttpOnly/SameSite=Lax.
- QA trực quan bằng browser: NOT RUN — browser host không khả dụng và điều khiển Chrome native không xác định được URL hiện tại đủ chắc chắn để tiếp tục an toàn; kiểm thử tự động không thay thế xác nhận layout trực quan.

### Chạy local
1. `npm.cmd install` rồi sao chép `.env.example` thành `.env`.
2. Tự điền `MONGODB_URI`, `SESSION_SECRET` (ít nhất 32 ký tự) và giữ `APP_ORIGIN=http://127.0.0.1:5173`; không gửi giá trị thật vào chat/Git.
3. Chạy `npm.cmd run dev`, mở `http://127.0.0.1:5173`.
4. Chạy kiểm tra: `npm.cmd run lint`, `npm.cmd test`, `npm.cmd run build`, `npm.cmd run test:production`.

### Tình trạng deploy
- Deploy thật: **NOT RUN**; không có URL để kiểm tra.
- Thiếu trong môi trường: Git repository/remote, `MONGODB_URI`, `SESSION_SECRET`, `APP_ORIGIN` production, Render service/API access. Không có `mongod` local; test dùng MongoDB tạm thời riêng.
- Việc người dùng cần làm: tạo/push repo; tạo Atlas DB user quyền tối thiểu và Network Access cho host; tạo Render Blueprint/Web Service từ repo; đặt ba env bí mật trong dashboard; deploy; chạy seed admin bằng env tạm rồi xóa biến seed. Chi tiết chính xác ở `README.md` và `docs/08_DEPLOY.md`.
- Sau khi có URL public, cần chạy checklist thật: HTTPS cookie, register/login/logout/me, role 403, profile qua restart, refresh deep route, API unknown, logo/assets và xác nhận `/demo` không đổi tài khoản.
- Không cần cung cấp secrets qua chat. Chỉ cần URL public/remote hoặc cấp quyền trực tiếp cho môi trường deploy nếu muốn Codex tiếp tục smoke test.
