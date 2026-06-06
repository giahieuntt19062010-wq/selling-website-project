// 1. Khởi tạo danh sách 10 học sinh (lấy An làm mẫu, các bạn khác viết gọn gọn lại)
const students = [
  { name: "An", scores: { Toan: 7.4, NguVan: 8.9, NgoaiNgu: 8.5, VatLy: 9.0, HoaHoc: 3.9, SinhHoc: 5.0, LichSu: 8.3, DiaLy: 9.4, GDCD: 6.6 } },
  { name: "Bình", scores: { Toan: 8.5, NguVan: 7.2, NgoaiNgu: 9.0, VatLy: 8.0, HoaHoc: 7.5, SinhHoc: 8.2, LichSu: 6.5, DiaLy: 7.0, GDCD: 8.0 } },
  { name: "Cường", scores: { Toan: 9.5, NguVan: 8.0, NgoaiNgu: 8.5, VatLy: 9.2, HoaHoc: 9.0, SinhHoc: 8.8, LichSu: 7.5, DiaLy: 8.0, GDCD: 8.5 } },
  { name: "Dũng", scores: { Toan: 5.0, NguVan: 5.5, NgoaiNgu: 6.0, VatLy: 4.5, HoaHoc: 5.2, SinhHoc: 5.8, LichSu: 6.0, DiaLy: 5.5, GDCD: 6.5 } },
  { name: "Hạnh", scores: { Toan: 4.0, NguVan: 4.8, NgoaiNgu: 5.0, VatLy: 3.5, HoaHoc: 4.2, SinhHoc: 4.5, LichSu: 5.0, DiaLy: 5.2, GDCD: 5.5 } },
  { name: "Linh", scores: { Toan: 7.8, NguVan: 8.2, NgoaiNgu: 8.0, VatLy: 7.5, HoaHoc: 7.0, SinhHoc: 7.2, LichSu: 8.5, DiaLy: 8.0, GDCD: 7.8 } },
  { name: "Minh", scores: { Toan: 6.2, NguVan: 6.8, NgoaiNgu: 6.5, VatLy: 5.8, HoaHoc: 6.0, SinhHoc: 6.4, LichSu: 7.0, DiaLy: 6.5, GDCD: 6.2 } },
  { name: "Nam", scores: { Toan: 8.8, NguVan: 7.5, NgoaiNgu: 8.2, VatLy: 8.5, HoaHoc: 8.0, SinhHoc: 7.8, LichSu: 8.0, DiaLy: 8.3, GDCD: 8.5 } },
  { name: "Oanh", scores: { Toan: 9.0, NguVan: 9.2, NgoaiNgu: 9.5, VatLy: 8.8, HoaHoc: 9.0, SinhHoc: 9.2, LichSu: 8.5, DiaLy: 8.8, GDCD: 9.0 } },
  { name: "Phong", scores: { Toan: 5.5, NguVan: 6.2, NgoaiNgu: 5.8, VatLy: 6.0, HoaHoc: 5.5, SinhHoc: 5.2, LichSu: 6.5, DiaLy: 6.0, GDCD: 5.8 } }
];

// Bước 1: Tính TBHK cho từng học sinh và lưu trực tiếp vào object
students.forEach(s => {
  const scoreList = Object.values(s.scores);
  const total = scoreList.reduce((sum, score) => sum + score, 0);
  s.averageScore = Number((total / scoreList.length).toFixed(2)); 
});
console.log("Bước 1 - Danh sách TBHK:", students.map(s => `${s.name}: ${s.averageScore}`));

// Bước 2: Sắp xếp giảm dần và lấy 3 bạn đầu tiên
const top3 = [...students].sort((a, b) => b.averageScore - a.averageScore).slice(0, 3);
console.log("Bước 2 - Top 3 bạn cao nhất:", top3.map(s => `${s.name} (${s.averageScore})`));

// Bước 3: Sắp xếp tăng dần và lấy bạn đầu tiên
const lowest = [...students].sort((a, b) => a.averageScore - b.averageScore)[0];
console.log("Bước 3 - Bạn thấp nhất:", `${lowest.name} (${lowest.averageScore})`);

// Bước 4: Cộng tổng TBHK cả lớp rồi chia đều
const classAvg = students.reduce((sum, s) => sum + s.averageScore, 0) / students.length;
console.log("Bước 4 - Điểm trung bình cả lớp:", Number(classAvg.toFixed(2)));

// Bước 5: Phân loại học lực
const resultXepLoai = students.map(s => {
  let xepLoai = "Yếu";
  if (s.averageScore >= 8.0) xepLoai = "Giỏi";
  else if (s.averageScore >= 6.5) xepLoai = "Khá";
  else if (s.averageScore >= 5.0) xepLoai = "Trung bình";
  return `${s.name}: ${xepLoai}`;
});
console.log("Bước 5 - Phân loại học lực:", resultXepLoai);

// Bước 6: Dùng filter() lọc các bạn có điểm >= 7
const filterStudents = students.filter(s => s.averageScore >= 7).map(s => `${s.name} (${s.averageScore})`);
console.log("Bước 6 - Học sinh có TBHK >= 7:", filterStudents);