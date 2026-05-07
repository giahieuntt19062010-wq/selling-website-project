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

// Chạy ngay khi trang web tải xong
document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();

    // Gán sự kiện cho form đăng nhập (nếu đang ở trang login.html)
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

// Chạy hàm kiểm tra ngay khi trang web vừa load xong
document.addEventListener('DOMContentLoaded', function() {
    // 1. Kiểm tra xem có ai đang đăng nhập không để hiện tên
    checkLoginStatus();

    // 2. Lắng nghe sự kiện bấm nút "VÀO CỬA HÀNG" (chỉ chạy nếu đang ở trang login)
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

// HÀM XỬ LÝ ĐĂNG NHẬP
function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('l-user').value.trim();
    const password = document.getElementById('l-pass').value;

    // Lấy danh sách tài khoản (mặc định tạo 1 user admin/123 nếu chưa có ai đăng ký)
    let db = JSON.parse(localStorage.getItem('userDB')) || [{username: 'admin', password: '123'}];
    
    const userFound = db.find(u => u.username === username && u.password === password);

    if (userFound) {
        localStorage.setItem('currentUser', username); // Lưu tên người dùng lại
        alert("Đăng nhập thành công!");
        window.location.href = '../html/index.html'; // Quay lại trang chủ
    } else {
        alert("Sai tài khoản hoặc mật khẩu rồi!");
    }
}

// HÀM KIỂM TRA TRẠNG THÁI ĐĂNG NHẬP (Để hiện/ẩn nút)
function checkLoginStatus() {
    const currentUser = localStorage.getItem('currentUser');
    const guestZone = document.getElementById('guest-zone');
    const userZone = document.getElementById('user-zone');
    const displayName = document.getElementById('user-display-name');

    if (currentUser) {
        // Đã có người đăng nhập: Ẩn nút cũ, hiện vùng Chào mừng
        if (guestZone) guestZone.style.display = 'none';
        if (userZone) userZone.style.display = 'flex';
        if (displayName) displayName.innerText = currentUser;
    } else {
        // Chưa có ai đăng nhập: Hiện nút Đăng nhập/Đăng ký
        if (guestZone) guestZone.style.display = 'block';
        if (userZone) userZone.style.display = 'none';
    }
}

// HÀM ĐĂNG XUẤT
function handleLogout() {
    localStorage.removeItem('currentUser');
    window.location.reload(); // Load lại trang để các nút hiện ra như cũ
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
// 7. CẬP NHẬT GIAO DIỆN GIỎ HÀNG KHI HOVER (Chỉ hiện SL và Tên máy)
function updateCartHoverUI() {
    const activeUser = localStorage.getItem('currentUser');
    const cartDropdown = document.getElementById('cart-dropdown-content');
    
    if (!cartDropdown) return;

    if (!activeUser) {
        cartDropdown.innerHTML = '<div class="empty-msg" style="padding: 15px; text-align: center;">Vui lòng đăng nhập</div>';
        return;
    }

    let db = JSON.parse(localStorage.getItem('userDB')) || [];
    let user = db.find(u => u.username === activeUser);
    
    if (!user || !user.myCart || user.myCart.length === 0) {
        cartDropdown.innerHTML = '<div class="empty-msg" style="padding: 15px; text-align: center;">Giỏ hàng trống</div>';
        return;
    }

    // Nhóm sản phẩm để tính số lượng (qty)
    let summary = {};
    user.myCart.forEach(item => {
        if (!summary[item.productName]) {
            summary[item.productName] = { qty: 1 };
        }
        summary[item.productName].qty++;
    });

    let html = '<div class="cart-scroll-area" style="padding: 5px;">';

    for (let name in summary) {
        let qty = summary[name].qty;
        
        // Giao diện tối giản: [Số lượng]x [Tên dòng máy]
        html += `
            <div class="cart-hover-item" style="padding: 8px 10px; border-bottom: 1px solid #f5f5f5; display: flex; align-items: center; gap: 10px;">
                <span style="font-weight: bold; color: #007bff; min-width: 25px;">${qty}x</span>
                <span style="color: #333; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    ${name}
                </span>
            </div>
        `;
    }

    html += `</div>
        <div class="cart-hover-footer" style="padding: 10px; border-top: 1px solid #eee; margin-top: 5px;">
            <button class="btn-pay" style="width: 100%; background: #007bff; color: white; border: none; padding: 10px; border-radius: 4px; cursor: pointer; font-weight: bold;">
                THANH TOÁN NGAY
            </button>
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
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.product-card');
    const detailPage = document.getElementById('detailPage');

    cards.forEach(card => {
        // Xóa các nút cũ bên trong card nếu còn sót lại để block sạch hoàn toàn


        card.addEventListener('click', () => {
            // Thu thập dữ liệu
            const name = card.querySelector('.p-name').innerText;
            const price = card.querySelector('.price-current').innerText;
            const img = card.querySelector('img').src;
            const specs = card.querySelectorAll('.p-specs li');

            // Hiển thị dữ liệu lên trang chi tiết
            document.getElementById('detailName').innerText = name;
            document.getElementById('detailPrice').innerText = price;
            document.getElementById('detailImg').src = img;
            
            const specsList = document.getElementById('detailSpecsList');
            specsList.innerHTML = '';
            specs.forEach(s => {
                const li = document.createElement('li');
                // Tách thông số để tạo giao diện đẹp hơn (nếu có dấu :)
                li.innerHTML = `<span>${s.innerText}</span> <i class="fas fa-check-circle" style="color: #a8e6cf"></i>`;
                specsList.appendChild(li);
            });

            detailPage.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });
});

function closeDetail() {
    document.getElementById('detailPage').style.display = 'none';
    document.body.style.overflow = 'auto';
}       