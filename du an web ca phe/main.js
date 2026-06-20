// Import các hàm cần thiết từ Firebase SDK (Cú pháp Module)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut, 
    updateProfile 
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// ==========================================
// CẤU HÌNH FIREBASE (Thay bằng thông tin từ Project của bạn)
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyDyZU-MJUlhX_DMdGgWU74tWAyn-uXI6nY",
  authDomain: "coffee-management-15a15.firebaseapp.com",
  projectId: "coffee-management-15a15",
  storageBucket: "coffee-management-15a15.firebasestorage.app",
  messagingSenderId: "948114613478",
  appId: "1:948114613478:web:6744fc01253f3cf08d8727",
  measurementId: "G-4V7FMCTPWT"
};
// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ==========================================
// DỮ LIỆU VÀ HIỂN THỊ SẢN PHẨM (Giữ nguyên)
// ==========================================
const coffeeProducts = [
    { id: 1, name: "Classic Espresso", desc: "Khởi đầu ngày mới mạnh mẽ", price: "45.000đ", image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?q=80&w=500" },
    { id: 2, name: "Caramel Latte", desc: "Ngọt ngào và bồng bềnh", price: "55.000đ", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=500" },
    { id: 3, name: "Cold Brew Nitro", desc: "Ủ lạnh 24 giờ tinh khiết", price: "65.000đ", image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=500" },
    { id: 4, name: "Cappuccino", desc: "Lớp bọt sữa nghệ thuật", price: "50.000đ", image: "https://chefjob.vn/wp-content/uploads/2020/07/cappuccino-cafe-cua-y.jpg" },
    { id: 5, name: "Americano", desc: "Cân bằng và thanh tao", price: "40.000đ", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=500" },
    { id: 6, name: "Dark Mocha", desc: "Hòa quyện cùng chocolate", price: "60.000đ", image: "https://images.unsplash.com/photo-1572286258217-40142c1c6a70?q=80&w=500" },
    { id: 7, name: "Macchiato", desc: "Điểm nhấn sữa béo ngậy", price: "55.000đ", image: "https://images.unsplash.com/photo-1498804103079-a6351b050096?q=80&w=500" },
    { id: 8, name: "Cà Phê Phin Đen", desc: "Đậm chất truyền thống Việt", price: "35.000đ", image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=500" }
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

// ==========================================
// XỬ LÝ SỰ KIỆN KHI TRANG ĐÃ LOAD XONG
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();

    // 1. LOGIC XỬ LÝ ĐĂNG KÝ
    const regForm = document.getElementById('registerForm');
    if (regForm) {
        regForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 
            
            const nameInput = document.getElementById('regName');
            const emailInput = document.getElementById('regEmail');
            const passInput = document.getElementById('regPass');

            if (!nameInput || !emailInput || !passInput) return;

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const pass = passInput.value;

            try {
                // Tạo tài khoản Firebase
                const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
                const user = userCredential.user;

                // Cập nhật tên hiển thị (displayName) cho user
                await updateProfile(user, { displayName: name });

                alert(`Đăng ký thành công! Chào mừng ${name}.`);
                window.location.href = "index.html"; 
            } catch (error) {
                // Xử lý lỗi từ Firebase
                if (error.code === 'auth/email-already-in-use') {
                    alert("Email này đã được đăng ký! Vui lòng dùng email khác.");
                } else if (error.code === 'auth/weak-password') {
                    alert("Mật khẩu quá yếu! Hãy chọn mật khẩu từ 6 ký tự trở lên.");
                } else {
                    alert("Lỗi đăng ký: " + error.message);
                }
            }
        });
    }

    // 2. LOGIC XỬ LÝ ĐĂNG NHẬP
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 
            
            const emailInput = document.getElementById('logEmail');
            const passInput = document.getElementById('logPass');

            if (!emailInput || !passInput) return;

            const email = emailInput.value.trim();
            const pass = passInput.value;

            try {
                await signInWithEmailAndPassword(auth, email, pass);
                alert("Đăng nhập thành công!");
                window.location.href = "index.html"; 
            } catch (error) {
                if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                    alert("Sai email hoặc mật khẩu! Vui lòng thử lại.");
                } else {
                    alert("Lỗi đăng nhập: " + error.message);
                }
            }
        });
    }
});

// ==========================================
// 3. THEO DÕI TRẠNG THÁI ĐĂNG NHẬP (LẮNG NGHE REALTIME)
// ==========================================
onAuthStateChanged(auth, (user) => {
    const navLinks = document.querySelector('.nav-links');
    
    if (user && navLinks) {
        // User ĐÃ đăng nhập
        const displayName = user.displayName || user.email.split('@')[0]; // Lấy tên hoặc phần đầu của email
        
        navLinks.innerHTML = `
            <li><a href="index.html">Trang chủ</a></li>
            <li><span style="color: var(--coffee-dark); font-weight: 600; font-size: 1.1rem; border-bottom: 2px solid var(--coffee-medium);">Xin chào, ${displayName}</span></li>
            <li><a href="#" id="logoutBtn" class="btn-outline">Đăng xuất</a></li>
        `;

        // Lắng nghe sự kiện click cho nút Đăng xuất
        document.getElementById('logoutBtn').addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                await signOut(auth);
                alert("Bạn đã đăng xuất!");
                window.location.reload(); 
            } catch (error) {
                console.error("Lỗi đăng xuất:", error);
            }
        });
    } else if (!user && navLinks) {
        // User CHƯA đăng nhập (Có thể setup lại menu mặc định ở đây nếu cần)
        // Ví dụ: hiển thị nút Đăng nhập / Đăng ký
    }
});