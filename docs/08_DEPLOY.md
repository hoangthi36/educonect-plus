# 08 — Deploy bản báo cáo

## Phương án mặc định đề xuất
Một Node/Express web service trên Render phục vụ cả React build và API; MongoDB Atlas chứa user/profile/session. Đây là lựa chọn triển khai cho mốc báo cáo, chưa đặt mua host. Không cam kết giá/ưu đãi/free tier; kiểm tra gói và giới hạn trong dashboard tại thời điểm tạo.
Nếu bạn đã có host Node khác, giữ same-origin và thay bước thao tác host. Không bắt buộc Vercel + Render riêng vì auth cookie sẽ phức tạp hơn.

## Trước khi lên host
Codex phải triển khai và chạy thành công các script từ docs/04_ARCHITECTURE_AUTH.md, khóa dependencies, pin Node tương thích. Không dùng lệnh dưới đây nếu package.json thực tế chưa có scripts tương ứng.
```powershell
npm ci
npm run lint
npm test
npm run build
```
Khởi động production cục bộ với env test phù hợp, kiểm tra Express trả frontend và /api. Không dùng npm run dev làm start production.

## MongoDB
Tạo database user riêng cho app, mật khẩu mạnh, quyền tối thiểu với DB app, thiết lập network access cho host. Không dùng tài khoản quản trị Atlas làm database user. Điền connection string vào MONGODB_URI ở host; không gửi URI thật vào chat, Git hoặc frontend. Test database phải khác database báo cáo.

## GitHub
Tạo repo/remote nếu chưa có. Kiểm tra git status, .gitignore, staged diff; không commit .env, node_modules, giấy tờ, credentials, logs. Giữ .env.example chỉ placeholder. Push source và lockfile. Dùng nhánh release/demo nếu cần tách báo cáo.

## Render
1. New > Web Service, kết nối repo/nhánh đã chọn.
2. Runtime Node; Root Directory là root chứa package.json workspaces.
3. Contract dự kiến: Build `npm ci --include=dev && npm run build`; Start `npm start`. Codex phải xác nhận phù hợp source đã tạo, không copy mù.
4. Env: NODE_ENV=production, MONGODB_URI, SESSION_SECRET ngẫu nhiên đủ mạnh, APP_ORIGIN=https://<host-thật>. PORT dùng giá trị host cấp. Chỉ placeholder trong docs.
5. App listen trên 0.0.0.0 và process.env.PORT. Session Mongo store, trust proxy theo host, Secure cookie.
6. Health path phù hợp /api/ready; response không lộ config.
7. Deploy; ghi lại URL thật, thời điểm, commit và trạng thái. Nếu app đang cold start hoặc DB lỗi ghi đúng, không báo đã chạy khi chỉ có build.

## Admin
Tạo admin bằng seed script đã kiểm tra, chạy qua môi trường quản trị có quyền tới DB. Lấy credentials từ env/hidden input. Script không hardcode, không reset admin sẵn có. Xóa biến seed khỏi môi trường lâu dài sau khi xong. Không xây /create-admin public để tiện deploy.

## Kiểm tra URL thật
Logo không 404; deep link refresh; login/register/logout; /me; role forbidden; profile persist sau restart; CSRF; API unknown trả JSON. Kiểm tra cookie HTTPS trên browser. /demo không làm đổi quyền hay credit account thật. Làm checklist docs/06_ACCEPTANCE.md và ghi NOT RUN nếu chưa kiểm tra được.

## Những gì báo cáo
Nêu rõ: auth + profile + phân quyền + deploy thật; business UI mô phỏng. Không kêu phụ huynh/gia sư chuyển tiền thử. Không dùng địa chỉ/SĐT người thật để demo.

## Lỗi thường gặp
- Build thiếu Vite: kiểm tra install devDependencies trong build và workspace command.
- Mongo không kết nối: network access/DB user/URI, không log URI đầy đủ.
- Cookie không lưu: HTTPS, Secure, trust proxy, APP_ORIGIN; kiểm tra request thay vì chuyển token sang localStorage.
- Reload route 404: SPA fallback sau /api/static, đúng Express version.
- Service restart mất login: kiểm tra Mongo session store/secret ổn định, không MemoryStore.
- CORS: mặc định cùng origin; local dùng Vite proxy, không mở '*' kèm credentials.
