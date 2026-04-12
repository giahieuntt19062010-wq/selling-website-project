/**
 * HỆ THỐNG QUẢN LÝ CỬA HÀNG DELL - TỔNG HỢP
 * Chức năng: Auth (Login/Register), LocalStorage DB, Giỏ hàng cá nhân.
 */

// 1. KHỞI TẠO CƠ SỞ DỮ LIỆU (Database Initialization)
const initDB = () => {
    if (!localStorage.getItem('userDB')) {
        localStorage.setItem('userDB', JSON.stringify([]));
    }
};

// 2. ĐIỀU KHIỂN GIAO DIỆN FORM (Auth UI Toggle)
function showForm(type) {
    const loginSection = document.getElementById('login-section');
    const registerSection = document.getElementById('register-section');
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');

    if (!loginSection || !registerSection) return;

    if (type === 'login') {
        loginSection.classList.add('active');
        registerSection.classList.remove('active');
        tabLogin.classList.add('active');
        tabRegister.classList.remove('active');
    } else {
        loginSection.classList.remove('active');
        registerSection.classList.add('active');
        tabLogin.classList.remove('active');
        tabRegister.classList.add('active');
    }
}

// 3. XỬ LÝ ĐĂNG KÝ (Registration Logic)
const handleRegister = (e) => {
    e.preventDefault();
    const username = document.getElementById('r-user').value.trim();
    const email = document.getElementById('r-email').value.trim();
    const password = document.getElementById('r-pass').value;

    let db = JSON.parse(localStorage.getItem('userDB'));

    // Kiểm tra trùng lặp tài khoản hoặc email
    if (db.some(user => user.username === username || user.email === email)) {
        alert("Tên đăng nhập hoặc Email đã tồn tại trong hệ thống!");
        return;
    }

    // Lưu người dùng mới với giỏ hàng trống
    db.push({
        username: username,
        email: email,
        password: password,
        myCart: []
    });

    localStorage.setItem('userDB', JSON.stringify(db));
    alert("Đăng ký thành công! Bạn có thể đăng nhập ngay.");
    showForm('login'); // Chuyển sang form đăng nhập ngay
};

// 4. XỬ LÝ ĐĂNG NHẬP (Login Logic)
const handleLogin = (e) => {
    e.preventDefault();
    const username = document.getElementById('l-user').value.trim();
    const password = document.getElementById('l-pass').value;

    let db = JSON.parse(localStorage.getItem('userDB'));
    const userFound = db.find(u => u.username === username && u.password === password);

    if (userFound) {
        localStorage.setItem('currentUser', username);
        alert(`Chào mừng ${username} quay trở lại!`);
        window.location.href = 'index.html'; // Chuyển về trang chủ
    } else {
        alert("Sai tài khoản hoặc mật khẩu. Vui lòng thử lại!");
    }
};

// 5. XỬ LÝ ĐĂNG XUẤT (Logout)
function handleLogout() {
    localStorage.removeItem('currentUser');
    location.reload();
}

// 6. QUẢN LÝ GIỎ HÀNG (Cart Logic)
function buyProduct(name, price) {
    const activeUser = localStorage.getItem('currentUser');
    
    if (!activeUser) {
        alert("Vui lòng đăng nhập để thực hiện mua sắm!");
        window.location.href = 'auth.html';
        return;
    }

    let db = JSON.parse(localStorage.getItem('userDB'));
    let userIndex = db.findIndex(u => u.username === activeUser);

    if (userIndex !== -1) {
        db[userIndex].myCart.push({ 
            productName: name, 
            productPrice: price,
            addedAt: new Date().getTime()
        });
        localStorage.setItem('userDB', JSON.stringify(db));
        alert(`Đã thêm "${name}" vào giỏ hàng của bạn!`);
        updateCartHoverUI(); // Cập nhật lại UI hover ngay lập tức
    }
}

// 7. CẬP NHẬT GIAO DIỆN GIỎ HÀNG KHI HOVER (Cart Hover UI)
function updateCartHoverUI() {
    const activeUser = localStorage.getItem('currentUser');
    const cartDropdown = document.getElementById('cart-dropdown-content');
    
    if (!cartDropdown) return;

    if (!activeUser) {
        cartDropdown.innerHTML = '<div class="empty-msg">Vui lòng đăng nhập để xem giỏ hàng</div>';
        return;
    }

    let db = JSON.parse(localStorage.getItem('userDB'));
    let user = db.find(u => u.username === activeUser);
    let cart = user.myCart || [];

    if (cart.length === 0) {
        cartDropdown.innerHTML = '<div class="empty-msg">Giỏ hàng của bạn đang trống</div>';
        return;
    }

    // Nhóm sản phẩm và tính tiền
    let summary = {};
    cart.forEach(item => {
        if (!summary[item.productName]) {
            summary[item.productName] = { price: item.productPrice, qty: 0 };
        }
        summary[item.productName].qty++;
    });

    let html = '<div class="cart-scroll-area">';
    let totalAll = 0;

    for (let name in summary) {
        let itemTotal = summary[name].price * summary[name].qty;
        totalAll += itemTotal;
        html += `
            <div class="cart-hover-item">
                <div class="item-meta">
                    <span class="name">${name}</span>
                    <span class="details">SL: ${summary[name].qty} x ${summary[name].price.toLocaleString()}đ</span>
                </div>
                <div class="item-price">${itemTotal.toLocaleString()}đ</div>
            </div>
        `;
    }

    html += `</div>
        <div class="cart-hover-footer">
            <div class="total-bar">
                <span>TỔNG TIỀN:</span>
                <span class="grand-total">${totalAll.toLocaleString()}đ</span>
            </div>
            <button class="btn-pay">THANH TOÁN NGAY</button>
        </div>`;

    cartDropdown.innerHTML = html;
}

// 8. CẬP NHẬT NAVBAR (User Session UI)
function updateNavbar() {
    const activeUser = localStorage.getItem('currentUser');
    const userDisplay = document.getElementById('user-dropdown');
    
    if (userDisplay && activeUser) {
        userDisplay.innerHTML = `
            <div class="user-info-box">
                <p>Xin chào, <b>${activeUser}</b></p>
                <hr>
                <a href="javascript:void(0)" onclick="handleLogout()" class="logout-link">Đăng xuất</a>
            </div>
        `;
    }
}

// 9. LẮNG NGHE SỰ KIỆN KHI TRANG LOAD (Initialization)
document.addEventListener('DOMContentLoaded', () => {
    initDB();
    updateNavbar();
    updateCartHoverUI();

    // Gán sự kiện cho form nếu đang ở trang auth
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (registerForm) registerForm.addEventListener('submit', handleRegister);
});
function loginSimulate() {
    const nickname = "HuuPhuong_Dell"; // Giả sử lấy từ form đăng nhập
    
    // Ẩn nút Đăng nhập/Đăng ký
    document.getElementById('auth-section').style.display = 'none';
    
    // Hiện Nickname và gán tên
    const userSection = document.getElementById('user-section');
    document.getElementById('user-name').innerText = nickname;
    userSection.style.display = 'flex';
}

function logoutSimulate() {
    // Hiện lại nút Đăng nhập/Đăng ký
    document.getElementById('auth-section').style.display = 'flex';
    
    // Ẩn Nickname
    document.getElementById('user-section').style.display = 'none';
}
let totalItems = 0;
let totalPrice = 0;

// Hàm này bạn sẽ gọi khi nhấn nút "Mua ngay" ở các sản phẩm Dell
function addToCart(price) {
    // 1. Cập nhật dữ liệu
    totalItems += 1;
    totalPrice += price;

    // 2. Hiển thị Badge số lượng
    const badge = document.getElementById('cart-count');
    badge.innerText = totalItems;
    badge.style.display = 'block';

    // 3. Cập nhật nội dung bảng Hover
    document.getElementById('cart-content').style.display = 'block';
    document.querySelector('#cart-dropdown p').style.display = 'none'; // Ẩn chữ "Giỏ hàng trống"
    
    document.getElementById('cart-total').innerText = totalPrice.toLocaleString('vi-VN') + 'đ';
    
    // Hiệu ứng rung nhẹ icon giỏ hàng cho sinh động
    const icon = document.getElementById('cart-icon');
    icon.style.transform = 'scale(1.2)';
    setTimeout(() => icon.style.transform = 'scale(1)', 200);
}

// Ví dụ giả lập: Khi nhấn nút mua một con Dell XPS 30 triệu
// <button onclick="addToCart(30000000)">Mua ngay</button>
let flagChatbot = false;
    
    function openChatbot(){
        let chatbot = document.getElementById("chatbot-container");
        
        if (flagChatbot === false) {
            chatbot.style.display = "block";
            flagChatbot = true;
        } else {
            chatbot.style.display = "none";
            flagChatbot = false;
        }
    }
/* --- JS: Xử lý chuyển động --- */
    let currentIndex = 0;
    const slides = document.getElementById('slider');
    const dots = document.querySelectorAll('.dot');
    const totalSlides = document.querySelectorAll('.slide').length;

    function updateCarousel() {
        slides.style.transform = `translateX(-${currentIndex * 100}%)`;
        // Cập nhật trạng thái chấm tròn
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function moveSlide(direction) {
        currentIndex = (currentIndex + direction + totalSlides) % totalSlides;
        updateCarousel();
    }

    function currentSlide(index) {
        currentIndex = index;
        updateCarousel();
    }

    // Tự động chuyển slide sau 5 giây (tùy chọn)
    setInterval(() => moveSlide(1), 5000);