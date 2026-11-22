# Educonect+

Kết nối đúng người – Trao gửi niềm tin – Đồng hành cùng tri thức.

Mốc báo cáo hiện có giao diện React, đăng ký/đăng nhập thật bằng Express + MongoDB, hồ sơ riêng tư và RBAC. Token, Connect, chat và Buổi 0 vẫn là dữ liệu hư cấu chỉ trong `/demo`; đăng ký tài khoản không cấp Token.

## Yêu cầu

- Node.js 22.20.x (xem `.nvmrc`).
- Một MongoDB local hoặc MongoDB Atlas database riêng cho môi trường đang chạy.
- Không đưa `MONGODB_URI`, `SESSION_SECRET` hoặc mật khẩu admin vào Git/frontend/chat.

## Chạy local

```powershell
cd "D:\2026.1\CNW\btl\educonect-codex-kit"
npm.cmd install
Copy-Item .env.example .env
```

Sửa `.env` trên máy:

- `MONGODB_URI`: connection string của database development.
- `SESSION_SECRET`: chuỗi ngẫu nhiên ít nhất 32 ký tự.
- `APP_ORIGIN=http://127.0.0.1:5173`.
- Giữ `NODE_ENV=development`.

Có thể tạo secret bằng lệnh sau rồi tự chép vào `.env` (không gửi kết quả cho người khác):

```powershell
node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"
```

Khởi động client và server:

```powershell
npm.cmd run dev
```

Mở `http://127.0.0.1:5173`. Vite proxy `/api` tới Express ở cổng 3000.

## Kiểm tra

```powershell
npm.cmd run lint
npm.cmd test
npm.cmd run build
npm.cmd run test:production
```

`npm test` dùng MongoDB tạm thời riêng, không đọc database báo cáo. `test:production` kiểm tra Express phục vụ React build, deep link, API JSON 404, đường dẫn nhạy cảm và thuộc tính cookie production.

## Tạo admin

Không có API hoặc biểu mẫu đăng ký admin công khai. Chỉ đặt biến trong terminal quản trị có quyền kết nối DB, chạy seed rồi xóa chúng khỏi phiên:

```powershell
$env:ADMIN_EMAIL = "admin@example.invalid"
$env:ADMIN_PASSWORD = Read-Host "Mật khẩu admin"
npm.cmd run seed:admin
Remove-Item Env:ADMIN_EMAIL, Env:ADMIN_PASSWORD
```

Script idempotent: nếu admin đã tồn tại, nó không đổi mật khẩu hoặc quyền.

## Production cùng origin

```powershell
npm.cmd ci --include=dev
npm.cmd run build
npm.cmd start
```

`npm start` chạy Express; Express phục vụ `client/dist` và `/api` trên cùng origin. Production bắt buộc `APP_ORIGIN` là URL HTTPS thật, `NODE_ENV=production`, MongoDB kết nối được và `SESSION_SECRET` ổn định.

## Deploy Render + MongoDB Atlas

Repo có `render.yaml` theo contract trong `docs/08_DEPLOY.md`.

1. Tạo Atlas database user riêng, quyền tối thiểu cho database ứng dụng; thiết lập Network Access cho hạ tầng Render theo hướng dẫn hiện hành của Atlas.
2. Push source và `package-lock.json` lên GitHub/GitLab, bảo đảm `.env` không được commit.
3. Tạo Render Blueprint/Web Service từ repo root. Kiểm tra gói/chi phí trong dashboard trước khi xác nhận.
4. Đặt `MONGODB_URI`, `SESSION_SECRET`, `APP_ORIGIN=https://<host-thật>` trong Render Environment. Không đặt các giá trị này thành biến `VITE_*`.
5. Build command: `npm ci --include=dev && npm run build`; start command: `npm start`; health path: `/api/ready`.
6. Deploy xong, kiểm tra `/api/health`, `/api/ready`, refresh deep link, register/login/logout, cookie Secure/HttpOnly, sai role 403 và `/api/unknown` trả JSON 404.
7. Nếu cần admin, chạy `npm run seed:admin` trong shell/job quản trị với biến tạm, sau đó xóa `ADMIN_EMAIL`/`ADMIN_PASSWORD` khỏi môi trường lâu dài.

Source báo cáo đã được đẩy lên `https://github.com/hoangthi36/educonect-plus.git`. Môi trường làm việc hiện tại chưa có Atlas URI hoặc quyền Render nên chưa có URL deploy thật.
