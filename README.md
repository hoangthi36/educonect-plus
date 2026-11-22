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

## Deploy Vercel + MongoDB Atlas

Repo có `vercel.json` và entrypoint `api/index.js`. Vercel phục vụ React build từ CDN và chuyển `/api/*` vào Express Function; frontend và API vẫn dùng cùng domain.

1. Tạo Atlas database user riêng, quyền tối thiểu cho database ứng dụng; cho phép hạ tầng Vercel truy cập trong Atlas Network Access theo chính sách của dự án.
2. Push source và `package-lock.json` lên GitHub, bảo đảm `.env` không được commit.
3. Import repository vào Vercel với cấu hình:
   - Root Directory: để trống hoặc `.` (repository root).
   - Framework Preset: `Other`.
   - Build Command: `npm run build`.
   - Output Directory: `client/dist`.
4. Đặt `MONGODB_URI`, `SESSION_SECRET`, `APP_ORIGIN=https://<domain-production-thật>`, `SESSION_TTL_HOURS`, `LOGIN_RATE_LIMIT_MAX` và `REGISTER_RATE_LIMIT_MAX` trong Vercel Environment Variables. Không đặt secret thành biến `VITE_*`; không cần tự đặt `PORT` trên Vercel.
5. `APP_ORIGIN` phải khớp chính xác origin HTTPS đang dùng. Sau khi biết domain production thật, cập nhật biến này rồi redeploy; preview domain khác origin sẽ không được phép gửi mutation auth.
6. Deploy xong, kiểm tra `/api/health`, `/api/ready`, refresh deep link, register/login/logout, cookie Secure/HttpOnly, sai role 403 và `/api/unknown` trả JSON 404.
7. Nếu cần admin, chạy `npm run seed:admin` từ một môi trường quản trị có quyền kết nối Atlas với biến tạm, sau đó xóa `ADMIN_EMAIL`/`ADMIN_PASSWORD`.

Source báo cáo ở `https://github.com/hoangthi36/educonect-plus.git`. Chưa có quyền dự án Vercel và Atlas hiện từ chối database credentials, nên chưa có URL deploy thật.
