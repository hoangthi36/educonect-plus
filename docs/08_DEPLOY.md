# 08 — Deploy bản báo cáo trên Vercel

## Kiến trúc triển khai

Một Vercel project lấy source từ repository root. `npm run build` tạo React tại `client/dist`; Vercel phục vụ các file này từ static output/CDN. `api/index.js` export Express handler cho `/api/*`. Rewrite trong `vercel.json` giữ frontend và API cùng domain, đồng thời fallback route React về `index.html`.

Express Function không dùng `express.static()` trên Vercel. Code khởi tạo app với `serveClient: false`; session vẫn nằm trong MongoDB qua `connect-mongo`, không nằm trong bộ nhớ function. Chế độ Node production chạy bằng `npm start` ngoài Vercel vẫn có thể phục vụ `client/dist` như trước.

## Trước khi deploy

```powershell
npm.cmd ci --include=dev
npm.cmd run lint
npm.cmd test
npm.cmd run build
npm.cmd run test:production
```

Không dùng `npm run dev` làm lệnh production. `.env` ở root chỉ dùng local và bị Git bỏ qua. Loader nạp đúng file này bất kể workspace chạy từ `server/`, nhưng `override: false` nên biến do Vercel cung cấp luôn được ưu tiên.

## MongoDB Atlas

Tạo database user riêng cho ứng dụng, mật khẩu mạnh và quyền tối thiểu trên database ứng dụng. Không dùng tài khoản đăng nhập Atlas làm database user. Cho phép hạ tầng Vercel truy cập theo chính sách Network Access của dự án. Không đưa connection string vào Git, frontend, log hoặc chat.

Nếu Atlas báo `bad auth : authentication failed`, kiểm tra/reset database user, chép lại driver URI và URL-encode ký tự đặc biệt trong username/password. Nếu báo server selection timeout thì mới kiểm tra Network Access/IP allowlist và trạng thái cluster.

## Import project vào Vercel

Kết nối repository `hoangthi36/educonect-plus`, chọn nhánh `main`, rồi đặt:

| Trường | Giá trị |
|---|---|
| Root Directory | để trống hoặc `.` |
| Framework Preset | `Other` |
| Build Command | `npm run build` |
| Output Directory | `client/dist` |
| Install Command | để Vercel tự dùng lockfile (`npm install`) |
| Node.js | 22.x, theo `package.json` |

`vercel.json` khai báo cùng build/output, API Function và rewrite. Không đặt Root Directory là `client`, vì API entrypoint và workspaces nằm tại repository root.

## Environment Variables

Nhập trong Vercel project settings, ít nhất cho Production:

- `NODE_ENV=production`: bật cookie `Secure` và kiểm tra origin production trong code.
- `MONGODB_URI`: Atlas URI thật.
- `SESSION_SECRET`: secret ổn định, ngẫu nhiên, ít nhất 32 ký tự.
- `APP_ORIGIN`: origin HTTPS production thật, không có path hoặc dấu `/` cuối.
- `SESSION_TTL_HOURS=8`.
- `LOGIN_RATE_LIMIT_MAX=10`.
- `REGISTER_RATE_LIMIT_MAX=5`.

Không cần tự đặt `PORT`. Không tạo biến `VITE_MONGODB_URI` hay `VITE_SESSION_SECRET`. Sau khi Vercel cấp domain production, điền domain thật vào `APP_ORIGIN` rồi redeploy. Mutation auth trên preview domain chỉ hoạt động nếu deployment đó có `APP_ORIGIN` khớp chính xác preview origin.

## Deploy và smoke test

1. Deploy commit trên `main`; chỉ ghi nhận thành công khi cả build và function khởi tạo được với Atlas.
2. Mở `/api/health` và `/api/ready`; response không được lộ cấu hình.
3. Đăng ký parent/tutor, đăng nhập, reload để kiểm tra phiên, gọi `/me`, đăng xuất và xác nhận route riêng mất quyền.
4. Kiểm tra sai role trả 403, `/api/unknown` trả JSON 404, cookie có `HttpOnly`, `Secure`, `SameSite=Lax`.
5. Refresh `/login`, dashboard được phép và các route public để kiểm tra SPA fallback; logo/assets không 404.
6. Xác nhận `/demo` vẫn chỉ là mô phỏng và không đổi role/credit tài khoản thật.

Chưa có quyền Vercel hoặc Atlas hợp lệ thì ghi **NOT RUN**, không bịa URL.

## Admin

Không có API đăng ký admin công khai. Chạy `npm run seed:admin` từ máy/job quản trị có quyền tới Atlas, dùng `ADMIN_EMAIL` và `ADMIN_PASSWORD` tạm thời, rồi xóa chúng khỏi môi trường. Không lưu hai biến này lâu dài trên Vercel vì Function không dùng chúng.

## Lỗi thường gặp

- Build thiếu Vite: giữ install devDependencies và chạy build ở repository root.
- API thành trang HTML: kiểm tra rewrite `/api/:path*` đứng trước SPA fallback.
- Mongo không kết nối: phân biệt lỗi database credentials với timeout/Network Access; không log URI đầy đủ.
- Cookie không lưu hoặc POST bị 403: kiểm tra HTTPS, `APP_ORIGIN` chính xác và request cùng origin; không chuyển auth sang localStorage.
- Service restart mất login: kiểm tra Mongo session store và `SESSION_SECRET` ổn định.
- Preview auth POST bị từ chối: preview host khác `APP_ORIGIN`; dùng production domain hoặc cấu hình origin riêng cho preview rồi redeploy.
