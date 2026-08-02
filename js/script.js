
// ==========================================
// 1. IMPORT FIREBASE MODULAR SDK
// ==========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCzEWqHxsV3XoVPjH7yxr7zN817Z5w6huU",
  authDomain: "loginfordellwebsite.firebaseapp.com",
  projectId: "loginfordellwebsite",
  storageBucket: "loginfordellwebsite.firebasestorage.app",
  messagingSenderId: "231975201201",
  appId: "1:231975201201:web:d4d32ad9cd97a2ec07b590",
  measurementId: "G-3JWB6JP6LQ",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ==========================================
// 2. HÀM PHỤ TRỢ XỬ LÝ TEXT
// ==========================================
function escapeHtml(value) {
  if (!value) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ==========================================
// 3. SLIDER CHUYỂN ĐỘNG (BANNER)
// ==========================================
let currentIndex = 0;

window.updateCarousel = function () {
  const slides = document.getElementById("slider");
  const dots = document.querySelectorAll(".dot");
  if (!slides) return;

  slides.style.transform = `translateX(-${currentIndex * 100}%)`;
  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentIndex);
  });
};

window.moveSlide = function (direction) {
  const totalSlides = document.querySelectorAll(".slide").length;
  if (totalSlides === 0) return;
  currentIndex = (currentIndex + direction + totalSlides) % totalSlides;
  window.updateCarousel();
};

window.currentSlide = function (index) {
  currentIndex = index;
  window.updateCarousel();
};

// Auto-play Slider mỗi 5 giây
setInterval(() => {
  if (document.getElementById("slider")) window.moveSlide(1);
}, 5000);

// ==========================================
// 4. HIỂN THỊ SẢN PHẨM TỪ FIRESTORE
// ==========================================
async function loadProducts() {
  const productGrid = document.getElementById("product-grid");
  if (!productGrid) return;
  
  productGrid.innerHTML = "<p style='text-align:center; width:100%;'>Đang tải sản phẩm từ hệ thống...</p>";

  try {
    const querySnapshot = await getDocs(collection(db, "laptopdell"));
    
    if (querySnapshot.empty) {
      productGrid.innerHTML = "<p style='text-align:center; width:100%;'>Chưa có sản phẩm nào.</p>";
      return;
    }

    const products = [];
    querySnapshot.forEach((doc) => products.push({ id: doc.id, ...doc.data() }));
    renderProductList(products);
    
  } catch (err) {
    console.error("Lỗi khi tải sản phẩm:", err);
    productGrid.innerHTML = "<p style='text-align:center; width:100%; color:red;'>Không thể tải danh sách sản phẩm.</p>";
  }
}

function renderProductList(products) {
  const productGrid = document.getElementById("product-grid");

  productGrid.innerHTML = products.map((product) => {
    // 1. Khai báo và xử lý dữ liệu
    const priceNum = product.price != null ? product.price : 0;
    const formattedPrice = priceNum === 0 ? 'Liên hệ' : new Intl.NumberFormat('vi-VN').format(priceNum) + ' ₫';
    
    const title = escapeHtml(product.name || "Laptop Dell");
    const imageUrl = product.image || "https://via.placeholder.com/300x150?text=No+Image";
    const description = escapeHtml(product.description || "");

    let specsHtml = '';
    if (product.description) {
        const specArray = product.description.split(','); 
        specArray.forEach(spec => {
            specsHtml += `<li>${escapeHtml(spec.trim())}</li>`;
        });
    }

    // 2. Trả về mã HTML của từng thẻ sản phẩm
    return `
      <div class="product-card">
          <img src="${imageUrl}" alt="${title}" style="width: 100%; height: 153.25px; object-fit: contain;">
          <div class="p-content">
              <h3 class="p-name">${title}</h3>
              <div class="p-rating">
                  <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star-half-alt"></i> 
                  <span>4.5 (30)</span>
              </div>
              <div class="p-price-box">
                  <p class="price-current">${formattedPrice}</p>
              </div>
              <ul class="p-specs">
                  ${specsHtml}
              </ul>
          </div>
          <div class="card-actions">
              <button class="btn-buy" 
                  onclick="handleBuyClick('${title}', '${formattedPrice}', '${imageUrl}', '${description}')">
                  Xem chi tiết
              </button>
          </div>
      </div>
    `;
  }).join(""); // 3. Nối các thẻ sản phẩm lại với nhau
}

// Chạy load sản phẩm ngay lập tức
loadProducts();

// ==========================================
// 5. XỬ LÝ POPUP CHI TIẾT
// ==========================================
window.handleBuyClick = function(name, price, img, description) {
  const detailPage = document.getElementById("detailPage");
  
  if (document.getElementById("detailName")) document.getElementById("detailName").innerHTML = name;
  if (document.getElementById("detailPrice")) document.getElementById("detailPrice").innerText = price;
  if (document.getElementById("detailImg")) document.getElementById("detailImg").src = img;

  const specsList = document.getElementById("detailSpecsList");
  if (specsList && description) {
      specsList.innerHTML = "";
      const specArray = description.split(',');
      specArray.forEach((s) => {
          const li = document.createElement("li");
          li.innerHTML = `<span>${s.trim()}</span> <i class="fas fa-check-circle" style="color: #a8e6cf"></i>`;
          specsList.appendChild(li);
      });
  }

  if (detailPage) {
      detailPage.style.display = "block";
      document.body.style.overflow = "hidden";
      controlChatbot();
  }
};

window.closeDetail = function () {
  const detailPage = document.getElementById("detailPage");
  if (detailPage) detailPage.style.display = "none";
  document.body.style.overflow = "auto";
  controlChatbot();
};

// ==========================================
// 6. CHATBOT CHATBASE
// ==========================================
let flagChatbot = false;

window.openChatbot = function () {
  let chatbot = document.getElementById("chatbot-container");
  if (!chatbot) return;
  if (flagChatbot === false) {
    chatbot.style.display = "block";
    flagChatbot = true;
  } else {
    chatbot.style.display = "none";
    flagChatbot = false;
  }
};

function controlChatbot() {
  const detailPage = document.getElementById("detailPage");
  const chatIcon = document.getElementById("chat-icon");
  const chatContainer = document.getElementById("chatbot-container");
  const isDetailOpen = detailPage && detailPage.style.display !== "none" && detailPage.style.display !== "";

  if (isDetailOpen) {
    if (chatIcon) chatIcon.style.display = "none";
    if (chatContainer) {
      chatContainer.style.display = "none";
      flagChatbot = false;
    }
  } else {
    if (chatIcon) chatIcon.style.display = "block";
  }
}

