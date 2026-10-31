import type { LocationData } from './types'
import tdnPortrait from '../assets/tran-dai-nghia.jpg'
// Ảnh tìm trên Wikimedia Commons theo `query` (chuỗi hoặc danh sách dự phòng: từ khoá nào
// không ra ảnh thì tự chuyển sang từ khoá kế tiếp). Các từ khoá đã được thử nghiệm đều có ảnh.
export const nguyenDu: LocationData = {
  title: 'Trường THCS và THPT Trần Đại Nghĩa',
  milestones: [
    { year: 'Năm 1874', text: 'Trường thành lập bởi Cha sở Henri De Kerlan, chính thức đi vào hoạt động năm 1875 với tên gọi ban đầu là Trường Lasan Taberd. Mục đích ban đầu: nuôi dưỡng trẻ mồ côi lai Pháp và lai Âu.', visual: 'Trường Taberd xưa', query: ['Taberd Institution Saigon', 'Institution Taberd', 'Taberd school'] },
    { year: 'Năm 1976', text: 'Trường Lasan Taberd được bàn giao lại cho ngành giáo dục TP.HCM. Nơi đây từng được chuyển đổi công năng thành Trường Trung học Sư phạm nhằm đào tạo giáo viên tiểu học cho thành phố.', visual: 'Ảnh tư liệu', query: ['Taberd school', 'Lasan Taberd', 'Institution Taberd'] },
    { year: 'Năm 2000–2002', text: 'Trường THPT Trần Đại Nghĩa được thành lập và chính thức chuyển thành mô hình trường chuyên (Trường THPT Chuyên Trần Đại Nghĩa) đặt tại cơ sở số 53 Nguyễn Du (nay thuộc phường Sài Gòn).', visual: 'Trường chuyên', query: ['Trường THPT chuyên Trần Đại Nghĩa', 'Trường THCS và THPT Trần Đại Nghĩa', 'Trần Đại Nghĩa'] },
    { year: 'Năm 2024', text: 'Tách và tổ chức lại trường chuyên thành hai trường độc lập: Trường THPT Chuyên Trần Đại Nghĩa và Trường THCS và THPT Trần Đại Nghĩa. Trường THCS và THPT Trần Đại Nghĩa hiện tại tiếp tục tiếp quản và vận hành tại cơ sở cổ kính, lịch sử số 53 Nguyễn Du, phường Sài Gòn.', visual: 'Trường hiện tại', query: ['Trường THCS và THPT Trần Đại Nghĩa', 'Trường THPT chuyên Trần Đại Nghĩa', 'Trần Đại Nghĩa'] },
  ],
  figure: { name: 'Trần Đại Nghĩa', image: tdnPortrait, query: ['Trần Đại Nghĩa Phạm Quang Lễ', 'Trần Đại Nghĩa'], lines: [
    'Tên thật: Phạm Quang Lễ · 13/9/1913 – 9/8/1997',
    '🏡 Quê quán: Làng Chánh Hiệp, huyện Tam Bình cũ (nay là xã Hòa Hiệp), tỉnh Vĩnh Long',
    '✏️ Được Chủ tịch Hồ Chí Minh đặt tên "Trần Đại Nghĩa" vào năm 1946',
    '⭐ Kỹ sư, nhà khoa học quân sự xuất sắc của Việt Nam, có nhiều đóng góp quan trọng trong nghiên cứu và chế tạo vũ khí phục vụ kháng chiến bảo vệ đất nước.',
    '⭐ Năm 1946, ông theo Chủ tịch Hồ Chí Minh về nước, tham gia xây dựng nền khoa học kỹ thuật quân sự Việt Nam. Được phong quân hàm Thiếu tướng và danh hiệu Anh hùng Lao động.' ] },
}
