# 02 — Nghiệp vụ Token và dạy thử

Đây là mô hình người dùng cung cấp; các chi tiết chưa chốt được ghi ở docs/10_DECISIONS.md. Mốc 1 chỉ mô phỏng để thể hiện UI.

## Quy tắc cốt lõi
B01. Phụ huynh không đặt cọc, không nạp học phí. Học phí do hai bên tự thỏa thuận và thanh toán ngoài nền tảng.
B02. Gia sư mua 300.000đ = 2 Tokens. Nhận tiền khi mua gói; tiêu thụ Token ở cột mốc khác.
B03. Connect được phụ huynh chấp nhận mở IN_CHAT thì giữ 1 Token. Chưa tiêu thụ.
B04. Chat không phù hợp trước Buổi 0: đóng phiên và giải phóng hold; không tăng số lần lớp hỏng.
B05. Gia sư đề xuất Buổi 0 (lịch, nội dung, điều kiện phí nếu có). Phụ huynh chấp nhận đúng phiên bản đề xuất: tiêu thụ hold và chuyển TRIAL_ACCEPTED; mở liên hệ cho đúng cặp theo đồng ý chia sẻ.
B06. Buổi 0 chưa được xác định là miễn phí. UI phải ghi 'Chi phí dạy thử do hai bên thỏa thuận'.
B07. Sau dạy thử không quản lý từng buổi, học phí, ví hay rút tiền.
B08. Gia sư báo hỏng kèm bằng chứng; hệ thống yêu cầu phụ huynh xác nhận; không hoàn ngay khi bấm gửi yêu cầu.
B09. Báo hỏng hợp lệ lần đầu liên tiếp: hoàn 1 Token, bộ đếm = 1.
B10. Báo hỏng hợp lệ lần hai liên tiếp: khóa quyền nhận kết nối mới, chờ admin. Việc hoàn lần 2 chưa chốt, không tự động hoàn/tịch thu.
B11. Khóa nhận kết nối không khóa đăng nhập, lịch sử, giải trình. Mua thêm không tự gỡ khóa.
B12. Không chặn việc báo cáo, đăng xuất hoặc hỗ trợ do số dư bằng 0.

## Trạng thái kết nối đề xuất cho UI
REQUESTED → IN_CHAT → TRIAL_PROPOSED → TRIAL_ACCEPTED.
REQUESTED → DECLINED/CANCELLED không biến động Token.
IN_CHAT hoặc TRIAL_PROPOSED → CLOSED_BEFORE_TRIAL trả hold.
TRIAL_PROPOSED → IN_CHAT khi từ chối đề xuất, vẫn giữ hold nếu tiếp tục chat.
TRIAL_ACCEPTED → OUTCOME_PENDING → SUCCESS_CONFIRMED hoặc FAILURE_REVIEW.
FAILURE_REVIEW → FAILURE_CONFIRMED_FIRST (refund) / BLOCKED_PENDING_REVIEW (lần 2) / CLAIM_REJECTED / NEEDS_MORE_INFO.
SUCCESS_CONFIRMED là trạng thái đề xuất; ai xác nhận, thời hạn và reset bộ đếm chưa chốt, không tự động áp dụng trong backend thật.

## Phép tính demo (định nghĩa rõ để không trừ hai lần)
`tokens_remaining` = số khả dụng, KHÔNG bao gồm đang giữ; `tokens_held` = đang giữ.
- Cấp gói: remaining += 2.
- Giữ: kiểm tra remaining >= 1; remaining -= 1; held += 1.
- Hủy trước thử: held -= 1; remaining += 1.
- Chấp nhận thử: held -= 1; consumed += 1; KHÔNG giảm remaining lần nữa.
- Hoàn đã duyệt: remaining += 1; ghi refund của consumption gốc, chỉ một lần.
Mỗi sự kiện có id và connectionId; double click không tạo thêm biến động. Đóng rồi không được dùng đề xuất cũ để mở liên hệ.

## Ledger thật — giai đoạn sau
Số dư hồ sơ không thay thế ledger. Cần sự kiện CREDIT_GRANTED, HELD, RELEASED, CONSUMED, REFUNDED và tham chiếu đơn mua/kết nối. Giao dịch nguyên tử, chống số dư âm, thanh toán/hoàn không lặp. Không dùng chữ 'Token' này cho auth token.

## Kiểm duyệt — giai đoạn sau
Trước TRIAL_ACCEPTED: text normalization + ngữ cảnh + phát hiện liên hệ; ảnh cần OCR và giải mã QR; file/voice/video chưa kiểm tra thì chưa hỗ trợ. Áp dụng cả hồ sơ/bài đăng để tránh rò liên hệ. Kiểm tra trước khi phát tới người nhận, thông báo hoặc URL ảnh. OCR không đảm bảo bắt mọi biến thể; xác nhận SMS không chứng minh không thông đồng.
Mốc 1 chỉ có banner mô tả và demo chặn vài mẫu text nếu cần, nhãn 'Minh họa, chưa phải kiểm duyệt hoàn chỉnh'. Không gửi dữ liệu thật ra nhà cung cấp.

## Quyền liên hệ
Trước mốc mở khóa, backend tương lai phải loại trường private; không chỉ làm mờ CSS. Mốc 1 public fixtures không chứa SĐT/địa chỉ thật. Khi demo mở liên hệ chỉ hiện 'SĐT mô phỏng' và 'Địa chỉ mô phỏng', không dùng thông tin người thật.
