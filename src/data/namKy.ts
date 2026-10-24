import tank1975 from '../assets/tank-1975.jpg'

// Lịch sử đường Nam Kỳ Khởi Nghĩa chia làm 3 phần xem lần lượt (xem scenes/NamKyScene.tsx):
// 1) Nguồn gốc tên đường → 2) Khởi nghĩa Nam Kỳ là gì? → 3) Khi nào con đường được đặt tên
// (kèm ảnh tư liệu về sự kiện) và nút Quay lại.
export const namKy = {
  title: 'Đường Nam Kỳ Khởi Nghĩa',
  origin: 'Con đường này từng mang nhiều tên qua từng thời kỳ: đường số 26 từ thời Pháp quy hoạch đô thị Sài Gòn (thế kỷ 19), đường Impératrice (1865), đường Mac Mahon (1870); năm 1938 được nối dài tới sân bay Tân Sơn Nhất và từ năm 1955 mang tên đường Công Lý. Tên gọi hiện tại — Nam Kỳ Khởi Nghĩa — được chọn để tưởng nhớ cuộc Khởi nghĩa Nam Kỳ bùng nổ ngày 23/11/1940: một trong những cuộc nổi dậy vũ trang lớn nhất của đồng bào Nam Bộ chống thực dân Pháp và phát xít Nhật, do Đảng Cộng sản Đông Dương chủ trương và lãnh đạo.',
  // Ảnh minh hoạ cho từng phần (tìm trên Wikimedia Commons theo danh sách từ khoá dự phòng, như 2 địa điểm kia)
  originImg: { caption: 'Đường Nam Kỳ Khởi Nghĩa (xưa là đường Mac Mahon, đường Công Lý) ở Sài Gòn', query: ['Rue Mac Mahon Saigon', 'rue Mac-Mahon Saïgon', 'Nam Kỳ Khởi Nghĩa street', 'Saigon Nam Ky Khoi Nghia'] },
  factsImg: { caption: 'Tư liệu về Khởi nghĩa Nam Kỳ (1940)', query: ['Khởi nghĩa Nam Kỳ 1940', 'Nam Kỳ khởi nghĩa', 'Cochinchina uprising 1940', 'Nam Ky uprising'] },
  facts: [
    ['Thời gian', 'Đêm 22 rạng sáng ngày 23 tháng 11 năm 1940.'],
    ['Địa bàn', 'Nổ ra đồng loạt tại nhiều tỉnh thuộc Nam Kỳ — như Mỹ Tho, Cần Thơ, Sóc Trăng, Bạc Liêu, Trà Vinh, Gia Định... (Nam Bộ ngày nay).'],
    ['Nguyên nhân', 'Nhân dân bất bình trước chính sách áp bức, bóc lột của thực dân Pháp và phát xít Nhật; phong trào đấu tranh giành độc lập dân tộc dưới sự lãnh đạo của Đảng Cộng sản Đông Dương ngày càng phát triển mạnh mẽ.'],
    ['Diễn biến', 'Theo hiệu lệnh của Xứ ủy Nam Kỳ, lực lượng nổi dậy cùng nhân dân vùng lên tấn công đồn binh, chiếm các cơ sở và đường sá ở nhiều tỉnh. Thực dân Pháp phản kích quyết liệt, cuộc khởi nghĩa dần bị đàn áp, dập tắt.'],
    ['Kết quả', 'Khởi nghĩa thất bại; nhiều lãnh đạo và chiến sĩ hy sinh, trong đó có các đồng chí Nguyễn Văn Cừ, Võ Văn Tần, Nguyễn Thị Minh Khai... Tuy vậy, cuộc khởi nghĩa đã khẳng định ý chí quật cường của nhân dân Nam Bộ, để lại bài học quý cho cuộc Tổng khởi nghĩa Tháng Tám năm 1945.'],
  ],
  naming: {
    heading: 'Khi nào con đường được đặt tên là "Đường Nam Kỳ Khởi Nghĩa"?',
    text: 'Ngày 30/4/1975, miền Nam hoàn toàn giải phóng, đất nước thống nhất. Trong cùng năm 1975, chính quyền Cộng hòa Miền Nam Việt Nam quyết định nhập hai con đường Công Lý và Cách Mạng 1-11 thành một và đặt tên là đường Nam Kỳ Khởi Nghĩa — để ghi mãi cuộc nổi dậy lịch sử ngày 23/11/1940 của đồng bào Nam Bộ. Ngày nay, đường Nam Kỳ Khởi Nghĩa dài khoảng 3,8 km, là trục giao thông huyết mạch nối trung tâm thành phố với sân bay quốc tế Tân Sơn Nhất, đi qua các phường Xuân Hòa, Sài Gòn cùng nhiều phường lân cận.',
    image: tank1975,
    caption: 'Xe tăng tiến qua cổng Dinh Độc Lập bên đường Nam Kỳ Khởi Nghĩa, ngày 30/4/1975 (ảnh tư liệu)',
  },
}
