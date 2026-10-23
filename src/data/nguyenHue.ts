import type { LocationData } from './types'
// Ảnh tìm trên Wikimedia Commons theo `query` (chuỗi hoặc danh sách dự phòng: từ khoá nào
// không ra ảnh thì tự chuyển sang từ khoá kế tiếp). Các từ khoá đã được thử nghiệm đều có ảnh.
export const nguyenHue: LocationData = {
  title: 'Đường Nguyễn Huệ',
  milestones: [
    { year: 'Trước đây', text: 'Khu vực đường Nguyễn Huệ là kênh Chợ Vải, nối sông Sài Gòn với khu vực trung tâm Sài Gòn xưa.', visual: 'Kênh rạch Sài Gòn xưa', query: ['Gsell Saigon', 'arroyo Chinois Saigon', 'Saïgon canal'] },
    { year: 'Năm 1887', text: 'Kênh được lấp, hai con đường dọc hai bờ được hợp nhất thành đại lộ Charner dưới thời Pháp thuộc. Tuyến đường dần trở thành khu vực thương mại sầm uất.', visual: 'Đại lộ Charner xưa (ảnh đen trắng)', query: ['Boulevard Charner Saigon', 'rue Charner', 'Boulevard Charner'] },
    { year: 'Năm 1955', text: 'Đại lộ Charner được đổi tên thành đại lộ Nguyễn Huệ, ghi dấu tên tuổi vị anh hùng áo vải Quang Trung trong không gian đô thị Sài Gòn.', visual: 'Ảnh tư liệu', query: ['Nguyen Hue Street in Saigon, Tet, 1975', 'Nguyen Hue street Saigon', 'Nguyễn Huệ street'] },
    { year: 'Năm 2015', text: 'Đường Nguyễn Huệ được cải tạo thành phố đi bộ, khánh thành dịp 30/4/2015. Nơi đây trở thành không gian sinh hoạt cộng đồng, tổ chức lễ hội, biểu diễn nghệ thuật và các sự kiện lớn của thành phố.', visual: 'Phố đi bộ hiện đại', query: ['Nguyễn Huệ pedestrian street Ho Chi Minh City', 'Nguyễn Huệ street'] },
  ],
  figure: { name: 'Quang Trung – Nguyễn Huệ', query: ['Quang Trung Nguyễn Huệ emperor', 'Quang Trung'], lines: [
    '1753 – 16/9/1792, hưởng thọ 39 tuổi',
    '🏡 Quê quán: Thôn Kiên Mỹ, ấp Kiên Thành, huyện Hoài Nhơn, phủ Quy Nhơn (nay thuộc xã Bình An, tỉnh Gia Lai)',
    '👨‍👩‍👦 Gia đình: 3 anh em (Nguyễn Nhạc, Nguyễn Lữ, Nguyễn Huệ)' ] },
}
