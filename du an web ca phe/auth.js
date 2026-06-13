// Chờ toàn bộ HTML load xong thì mới chạy JS
document.addEventListener('DOMContentLoaded', () => {

    // Hàm lấy danh sách user
    function getUsers() {
        const users = localStorage.getItem('coffeeUsers');
        return users ? JSON.parse(users) : [];
    }

    // ==========================================
    // 1. LOGIC XỬ LÝ ĐĂNG KÝ
    // ==========================================
    const regForm = document.getElementById('registerForm');
    if (regForm) {
        regForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            
            // Tìm chính xác các ô input
            const nameInput = document.getElementById('regName');
            const emailInput = document.getElementById('regEmail');
            const passInput = document.getElementById('regPass');

            // Bắt lỗi nếu HTML và JS bị lệch ID
            if (!nameInput || !emailInput || !passInput) {
                alert("LỖI CODE: Không tìm thấy ô nhập liệu đăng ký. Hãy kiểm tra lại ID trong HTML!");
                return;
            }

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const pass = passInput.value;

            const users = getUsers();
            const userExists = users.some(user => user.email === email);
            
            if (userExists) {
                alert("Email này đã được đăng ký! Vui lòng dùng email khác.");
                return;
            }

            users.push({ name, email, pass });
            localStorage.setItem('coffeeUsers', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify({ name, email, pass }));

            alert(`Đăng ký thành công! Chào mừng ${name}.`);
            window.location.href = "index.html"; 
        });
    }

    // ==========================================
    // 2. LOGIC XỬ LÝ ĐĂNG NHẬP
    // ==========================================
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            
            // Tìm chính xác các ô input
            const emailInput = document.getElementById('logEmail');
            const passInput = document.getElementById('logPass');

            // Bắt lỗi nếu HTML và JS bị lệch ID
            if (!emailInput || !passInput) {
                alert("LỖI CODE: Không tìm thấy ô nhập liệu đăng nhập. Hãy kiểm tra lại ID trong HTML!");
                return;
            }

            const email = emailInput.value.trim();
            const pass = passInput.value;

            const users = getUsers();
            const validUser = users.find(user => user.email === email && user.pass === pass);

            if (validUser) {
                localStorage.setItem('currentUser', JSON.stringify(validUser));
                alert(`Đăng nhập thành công! Chào mừng ${validUser.name}.`);
                window.location.href = "index.html"; 
            } else {
                alert("Sai email hoặc mật khẩu! Vui lòng thử lại.");
            }
        });
    }
});