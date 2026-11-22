export const subjectOptions = ['Toán', 'Tiếng Anh', 'Vật lý', 'Hóa học', 'Ngữ văn', 'Tiếng Nhật']

export const locationOptions = ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng']

export const priceOptions = [
  { label: 'Không giới hạn', value: '' },
  { label: 'Đến 220.000đ / buổi', value: '220000' },
  { label: 'Đến 250.000đ / buổi', value: '250000' },
  { label: 'Đến 300.000đ / buổi', value: '300000' },
]

export const tutors = [
  {
    id: 'nguyen-thu-ha',
    initials: 'TH',
    accent: 1,
    name: 'Nguyễn Thu Hà',
    headline: 'Gia sư Toán THCS',
    education: 'Thạc sĩ Toán học · Trường Đại học Sư phạm Hà Nội',
    area: 'Cầu Giấy',
    city: 'Hà Nội',
    subjects: ['Toán', 'Toán lớp 9', 'Luyện thi 10'],
    rate: 250000,
    experience: '5 năm kinh nghiệm giảng dạy',
    introduction:
      'Tập trung củng cố kiến thức nền tảng, xây dựng thói quen tự kiểm tra và chuẩn bị kế hoạch ôn tập phù hợp với mục tiêu của học sinh.',
    approach:
      'Khảo sát phần kiến thức còn vướng, giải thích bằng ví dụ gần gũi và dành thời gian để học sinh tự trình bày lại cách làm.',
    availability: ['Tối Thứ 3', 'Tối Thứ 6', 'Sáng Chủ nhật'],
  },
  {
    id: 'tran-minh-quan',
    initials: 'MQ',
    accent: 2,
    name: 'Trần Minh Quân',
    headline: 'Gia sư Vật lý THPT',
    education: 'Sinh viên năm cuối · Trường Đại học Bách khoa Hà Nội',
    area: 'Hai Bà Trưng',
    city: 'Hà Nội',
    subjects: ['Vật lý', 'Toán', 'Luyện thi THPT'],
    rate: 200000,
    experience: '3 năm hỗ trợ học sinh lớp 10–12',
    introduction:
      'Ưu tiên giúp học sinh hiểu bản chất hiện tượng, nhận diện dạng bài và luyện cách trình bày lời giải mạch lạc.',
    approach:
      'Mỗi chủ đề bắt đầu bằng sơ đồ kiến thức ngắn, sau đó luyện bài theo mức độ và tổng kết lỗi thường gặp.',
    availability: ['Tối Thứ 2', 'Tối Thứ 5', 'Chiều Thứ 7'],
  },
  {
    id: 'le-phuong-anh',
    initials: 'PA',
    accent: 3,
    name: 'Lê Phương Anh',
    headline: 'Gia sư Tiếng Anh và IELTS',
    education: 'Cử nhân Ngôn ngữ Anh · Trường Đại học Hà Nội',
    area: 'Đống Đa',
    city: 'Hà Nội',
    subjects: ['Tiếng Anh', 'IELTS', 'Tiếng Anh THCS'],
    rate: 300000,
    experience: '6 năm dạy kèm 1–1',
    introduction:
      'Xây dựng lộ trình theo mục tiêu giao tiếp hoặc học thuật, cân bằng từ vựng, phát âm và kỹ năng làm bài.',
    approach:
      'Sử dụng chủ đề thực tế, phản hồi cụ thể sau từng phần luyện tập và cùng học sinh theo dõi mục tiêu ngắn hạn.',
    availability: ['Tối Thứ 4', 'Tối Thứ 7', 'Chiều Chủ nhật'],
  },
  {
    id: 'pham-duc-long',
    initials: 'DL',
    accent: 4,
    name: 'Phạm Đức Long',
    headline: 'Gia sư Hóa học THPT',
    education: 'Cử nhân Hóa học · Đại học Quốc gia Hà Nội',
    area: 'Thanh Xuân',
    city: 'Hà Nội',
    subjects: ['Hóa học', 'Luyện thi THPT'],
    rate: 220000,
    experience: '4 năm đồng hành cùng học sinh THPT',
    introduction:
      'Hệ thống hóa kiến thức theo chuyên đề và giúp học sinh hình thành quy trình giải bài ổn định.',
    approach:
      'Kết hợp bài tập nền tảng với câu hỏi vận dụng, giải thích rõ điều kiện phản ứng và cách kiểm tra kết quả.',
    availability: ['Tối Thứ 2', 'Tối Thứ 4'],
  },
  {
    id: 'vu-ngoc-mai',
    initials: 'NM',
    accent: 5,
    name: 'Vũ Ngọc Mai',
    headline: 'Gia sư Tiếng Nhật sơ cấp',
    education: 'JLPT N1 · Giáo viên Tiếng Nhật',
    area: 'Nam Từ Liêm',
    city: 'Hà Nội',
    subjects: ['Tiếng Nhật', 'JLPT N5', 'Giao tiếp cơ bản'],
    rate: 280000,
    experience: '4 năm dạy tiếng Nhật sơ cấp',
    introduction:
      'Hỗ trợ người mới bắt đầu xây nền phát âm, chữ viết và phản xạ giao tiếp trong tình huống quen thuộc.',
    approach:
      'Chia nội dung thành bài học ngắn, luyện lặp có ngữ cảnh và tổng ôn định kỳ theo tiến độ cá nhân.',
    availability: ['Tối Thứ 3', 'Tối Thứ 5', 'Sáng Thứ 7'],
  },
  {
    id: 'hoang-khanh-linh',
    initials: 'KL',
    accent: 6,
    name: 'Hoàng Khánh Linh',
    headline: 'Gia sư Ngữ văn THCS',
    education: 'Cử nhân Sư phạm Ngữ văn · Trường Đại học Sư phạm TP. Hồ Chí Minh',
    area: 'Bình Thạnh',
    city: 'TP. Hồ Chí Minh',
    subjects: ['Ngữ văn', 'Ngữ văn THCS', 'Luyện viết'],
    rate: 230000,
    experience: '4 năm hướng dẫn đọc hiểu và viết',
    introduction:
      'Giúp học sinh đọc đề có phương pháp, tìm ý và diễn đạt rõ ràng thay vì học thuộc bài mẫu.',
    approach:
      'Cùng học sinh phân tích văn bản, lập dàn ý và sửa từng đoạn để nhìn thấy tiến bộ qua mỗi buổi.',
    availability: ['Tối Thứ 6', 'Chiều Thứ 7', 'Sáng Chủ nhật'],
  },
  {
    id: 'do-minh-tam',
    initials: 'MT',
    accent: 2,
    name: 'Đỗ Minh Tâm',
    headline: 'Gia sư Toán tiểu học',
    education: 'Sinh viên Sư phạm Tiểu học · Đại học Đà Nẵng',
    area: 'Hải Châu',
    city: 'Đà Nẵng',
    subjects: ['Toán', 'Toán tiểu học'],
    rate: 180000,
    experience: '2 năm hỗ trợ học sinh tiểu học',
    introduction:
      'Tạo không khí học nhẹ nhàng, giúp học sinh nắm chắc phép tính và tự tin giải bài toán có lời văn.',
    approach:
      'Dùng ví dụ trực quan, chia nhỏ yêu cầu và khuyến khích học sinh tự giải thích cách suy nghĩ.',
    availability: ['Tối Thứ 2', 'Tối Thứ 5', 'Sáng Thứ 7'],
  },
]

export const posts = [
  {
    id: 'post-01',
    type: 'Nhu cầu phụ huynh',
    author: 'Phụ huynh mẫu PH-01',
    title: 'Tìm gia sư Toán lớp 9 tại Cầu Giấy',
    area: 'Cầu Giấy, Hà Nội',
    subject: 'Toán lớp 9',
    schedule: 'Tối Thứ 3 và Thứ 6',
    budget: 'Khoảng 220.000–280.000đ / buổi',
    description:
      'Học sinh cần củng cố phần đại số và chuẩn bị cho kỳ thi vào lớp 10. Gia đình mong muốn trao đổi phương pháp trước khi thống nhất buổi dạy thử.',
  },
  {
    id: 'post-02',
    type: 'Giới thiệu gia sư',
    author: 'Gia sư mẫu GS-02',
    title: 'Nhận kèm Tiếng Anh giao tiếp và IELTS',
    area: 'Đống Đa, Hà Nội',
    subject: 'Tiếng Anh',
    schedule: 'Tối Thứ 4 hoặc cuối tuần',
    budget: 'Mức phí do hai bên thỏa thuận',
    description:
      'Hỗ trợ xây nền từ vựng, phát âm và kỹ năng làm bài theo mục tiêu của người học. Chỉ hiển thị khu vực tương đối, không có thông tin liên hệ riêng tư.',
  },
  {
    id: 'post-03',
    type: 'Nhu cầu phụ huynh',
    author: 'Phụ huynh mẫu PH-03',
    title: 'Cần gia sư Ngữ văn lớp 7',
    area: 'Bình Thạnh, TP. Hồ Chí Minh',
    subject: 'Ngữ văn',
    schedule: 'Một buổi cuối tuần',
    budget: 'Khoảng 200.000–250.000đ / buổi',
    description:
      'Mong muốn học sinh cải thiện cách đọc đề, tìm ý và viết đoạn văn. Ưu tiên người có phương pháp khuyến khích học sinh tự diễn đạt.',
  },
  {
    id: 'post-04',
    type: 'Giới thiệu gia sư',
    author: 'Gia sư mẫu GS-04',
    title: 'Hỗ trợ Toán tiểu học khu vực Hải Châu',
    area: 'Hải Châu, Đà Nẵng',
    subject: 'Toán tiểu học',
    schedule: 'Tối trong tuần hoặc sáng Thứ 7',
    budget: 'Mức tham khảo 180.000đ / buổi',
    description:
      'Tập trung xây nền phép tính, đọc hiểu bài toán có lời văn và hình thành thói quen kiểm tra kết quả.',
  },
]
