const coffeeProducts = [
    {
        id: 1,
        name: "Classic Espresso",
        desc: "Khởi đầu ngày mới mạnh mẽ",
        price: "45.000đ",
        image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?q=80&w=500"
    },
    {
        id: 2,
        name: "Caramel Latte",
        desc: "Ngọt ngào và bồng bềnh",
        price: "55.000đ",
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=500"
    },
    {
        id: 3,
        name: "Cold Brew Nitro",
        desc: "Ủ lạnh 24 giờ tinh khiết",
        price: "65.000đ",
        image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=500"
    },
    {
        id: 4,
        name: "Cappuccino",
        desc: "Lớp bọt sữa nghệ thuật",
        price: "50.000đ",
        image: "https://chefjob.vn/wp-content/uploads/2020/07/cappuccino-cafe-cua-y.jpg"
    },
    {
        id: 5,
        name: "Americano",
        desc: "Cân bằng và thanh tao",
        price: "40.000đ",
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=500"
    },
    {
        id: 6,
        name: "Dark Mocha",
        desc: "Hòa quyện cùng chocolate",
        price: "60.000đ",
        image: "https://images.unsplash.com/photo-1572286258217-40142c1c6a70?q=80&w=500"
    },
    {
        id: 7,
        name: "Macchiato",
        desc: "Điểm nhấn sữa béo ngậy",
        price: "55.000đ",
        image: "https://images.unsplash.com/photo-1498804103079-a6351b050096?q=80&w=500"
    },
    {
        id: 8,
        name: "Cà Phê Phin Đen",
        desc: "Đậm chất truyền thống Việt",
        price: "35.000đ",
        image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=500"
    }
];

function renderProducts() {
    const productContainer = document.getElementById('product-list');
    if (!productContainer) return;

    let htmlContent = '';
    coffeeProducts.forEach(product => {
        htmlContent += `
            <div class="product-card">
                <div class="image-box">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <h3>${product.name}</h3>
                <p>${product.desc}</p>
                <span class="price">${product.price}</span>
            </div>
        `;
    });

    productContainer.innerHTML = htmlContent;
}

document.addEventListener('DOMContentLoaded', renderProducts);
// ... (Giữ nguyên mảng coffeeProducts và hàm renderProducts ở trên) ...

// ==========================================
// XỬ LÝ HIỂN THỊ TÊN NGƯỜI DÙNG LÊN NAVBAR
// ==========================================
function checkLoginState() {
    // Lấy thông tin user đang đăng nhập từ Local Storage
    const currentUserStr = localStorage.getItem('currentUser');
    const navLinks = document.querySelector('.nav-links');

    // Nếu có người đang đăng nhập và tìm thấy Navbar
    if (currentUserStr && navLinks) {
        const currentUser = JSON.parse(currentUserStr);
        
        // Ghi đè lại nội dung của thanh Navbar
        navLinks.innerHTML = `
            <li><a href="index.html">Trang chủ</a></li>
            <li><span style="color: var(--coffee-dark); font-weight: 600; font-size: 1.1rem; border-bottom: 2px solid var(--coffee-medium);">Xin chào, ${currentUser.name}</span></li>
            <li><a href="#" id="logoutBtn" class="btn-outline">Đăng xuất</a></li>
        `;

        // Lắng nghe sự kiện click cho nút Đăng xuất
        document.getElementById('logoutBtn').addEventListener('click', (e) => {
            e.preventDefault(); // Tránh bị nhảy trang
            localStorage.removeItem('currentUser'); // Xóa phiên đăng nhập
            alert("Bạn đã đăng xuất!");
            window.location.reload(); // Tải lại trang để quay về trạng thái ban đầu
        });
    }
}

// Chạy cả 2 hàm khi load xong trang web
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    checkLoginState(); // Gọi hàm kiểm tra đăng nhập
});