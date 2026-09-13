export const siteMenu = [
  {label:'Trang chủ', path:'/'},
  {label:'Về chúng tôi', path:'/ve-chung-toi', children:['Nhà Hán Ngữ là gì?','Câu chuyện hình thành','Vì sao NHN được xây dựng?','Sứ mệnh','Tầm nhìn','Giá trị cốt lõi','Định hướng phát triển','NHN hướng đến ai?','Vai trò trong hệ sinh thái Sky First','Cam kết với cộng đồng']},
  {label:'Học Hán Ngữ', path:'/hoc-han-ngu', children:['HSK','HSKK','CSCA','Tiếng Trung giao tiếp','Từ vựng','Ngữ pháp','Phát âm','Chữ Hán']},
  {label:'Kho học liệu', path:'/kho-hoc-lieu', children:['Tài liệu HSK 1–6','Tài liệu HSKK','Tài liệu CSCA','Đề thi','Bài tập','Flashcard','Tài liệu tham khảo']},
  {label:'Thi thử', path:'/thi-thu', children:['Thi thử HSK','Thi thử HSKK','Nâng cao','Cao cấp','Tiếng Trung giao tiếp','Luyện nghe','Kết quả & đánh giá']},
  {label:'Kiến thức', path:'/kien-thuc', children:['Hán ngữ','Chữ Hán','Văn hóa Trung Hoa','Lịch sử','Thành ngữ','Góc học tập']},
  {label:'Tin tức & Sự kiện', path:'/tin-tuc-su-kien', children:['Tin tức Nhà Hán Ngữ','Hoạt động','Workshop','Cuộc thi','Chương trình cộng đồng']},
  {label:'Cộng đồng', path:'/cong-dong', children:['Tham gia Nhà Hán Ngữ','Cộng tác viên','Tình nguyện viên','Cộng đồng học tiếng Trung','Đăng câu hỏi / chia sẻ']},
  {label:'Đối tác', path:'/doi-tac', children:['Đơn vị đồng hành','Đối tác giáo dục','Đối tác truyền thông','Các dự án phối hợp']},
  {label:'Liên hệ', path:'/lien-he', children:['Thông tin liên hệ','Email','Mạng xã hội','Gửi câu hỏi','Đăng ký hợp tác']}
];

export const examGroups = [
  {id:'hsk', title:'HSK 1–9', description:'180 đề · 20 đề mỗi cấp · 50 câu/đề', accent:'汉'},
  {id:'advanced', title:'Nâng cao', description:'20 đề · 50 câu/đề', accent:'进'},
  {id:'high', title:'Cao cấp', description:'20 đề · 50 câu/đề', accent:'高'},
  {id:'communication', title:'Tiếng Trung giao tiếp', description:'20 đề · 50 câu/đề', accent:'说'},
  {id:'listening', title:'Luyện nghe', description:'20 đề · 50 câu/đề · hỗ trợ audio', accent:'听'}
];

export const learningCards = [
  ['HSK','Lộ trình HSK từ nền tảng đến cấp độ nâng cao, học theo chủ đề và kỹ năng.','汉'],
  ['HSKK','Rèn phản xạ nói, phát âm, diễn đạt và luyện tập theo tình huống.','说'],
  ['CSCA','Không gian tổng hợp kiến thức, tài liệu tham khảo và nội dung định hướng.','学'],
  ['Từ vựng','Học từ theo chủ đề, cấp độ, ví dụ, pinyin và ngữ cảnh sử dụng.','词'],
  ['Ngữ pháp','Hệ thống cấu trúc ngữ pháp, ví dụ và bài tập ứng dụng.','法'],
  ['Chữ Hán','Bộ thủ, số nét, cấu tạo, cách ghi nhớ và ứng dụng trong từ vựng.','字']
];
