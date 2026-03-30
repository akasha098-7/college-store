//////////////////////////////////////////////////////////
// AUTH GUARD
//////////////////////////////////////////////////////////

const token = localStorage.getItem("token");
const user  = JSON.parse(localStorage.getItem("user") || "null");

if (!token || !user) window.location.href = "login.html";

//////////////////////////////////////////////////////////
// BACKEND URL
//////////////////////////////////////////////////////////

const API = "http://localhost:3000/api";

//////////////////////////////////////////////////////////
// EMOJI MAP
//////////////////////////////////////////////////////////

const categoryEmoji = {
  "Stationary": "✏️",
  "Books":      "📚",
  "Beverages":  "☕",
  "Snacks":     "🍿",
  "Ice Cream":  "🍦",
  "Chocolate":  "🍫",
  "Uniform":    "👕"
};

const stationeryCategories = ["Stationary", "Books"];
const foodCategories       = ["Beverages", "Snacks", "Ice Cream", "Chocolate"];

let allProducts = [];
let searchQuery = ""; // current search text

//////////////////////////////////////////////////////////
// STOCK LABEL  (your original code, untouched)
//////////////////////////////////////////////////////////

function stockLabel(q) {
  if (q === 0)  return { text: "❌ Out of stock",    cls: "out" };
  if (q <= 5)   return { text: `⚠️ Only ${q} left`, cls: "low" };
  return              { text: `✅ ${q} in stock`,    cls: "ok"  };
}

//////////////////////////////////////////////////////////
// BUILD PRODUCT CARD  (your original code, untouched)
//////////////////////////////////////////////////////////

function buildCard(p) {
  const lbl = stockLabel(p.stock);
  const out = p.stock === 0;

  return `
    <div class="p-card">
      <div class="p-card-img">
        ${p.emoji}
        ${!out ? `<button class="p-add-btn" onclick="addToCart(${p.id})">+</button>` : ""}
        ${out  ? `<div class="p-out-label">Out of Stock</div>` : ""}
      </div>
      <div class="p-card-info">
        <div class="p-card-name">${p.name}</div>
        <div class="p-card-qty">${p.unit || ""}</div>
        <div class="p-stock ${lbl.cls}">${lbl.text}</div>
        <div class="p-card-price">₹${p.price}</div>
      </div>
    </div>
  `;
}

//////////////////////////////////////////////////////////
// SEARCH — filters products by name or category
//////////////////////////////////////////////////////////

function setupSearch() {
  const searchInput = document.querySelector(".search-box input");
  if (!searchInput) return;

  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value.trim().toLowerCase();
    renderAll();
  });
}

function filterProducts(products) {
  if (!searchQuery) return products;
  return products.filter(p =>
    p.name.toLowerCase().includes(searchQuery) ||
    p.category.toLowerCase().includes(searchQuery)
  );
}

//////////////////////////////////////////////////////////
// RENDER ALL PRODUCTS
//////////////////////////////////////////////////////////

function renderAll() {
  const stationery = filterProducts(
    allProducts.filter(p => stationeryCategories.includes(p.category))
  );
  const food = filterProducts(
    allProducts.filter(p => foodCategories.includes(p.category))
  );

  // ── If searching, show all results in one section ──
  if (searchQuery) {
    const allResults = filterProducts(allProducts);

    document.getElementById("scroll-stationery").innerHTML =
      allResults.length
        ? allResults.map(buildCard).join("")
        : `<p style="padding:16px;color:#aaa">No products found for "${searchQuery}"</p>`;

    // Hide food section header and show everything in stationery section
    document.getElementById("scroll-food").innerHTML = "";

    // Update section titles
    const heads = document.querySelectorAll(".section-head");
    if (heads[0]) heads[0].querySelector(".section-title").innerHTML =
      `<div class="section-title-bar"></div> 🔍 Results for "${searchQuery}"`;
    if (heads[1]) heads[1].style.display = "none";

  } else {
    // Normal view — restore section titles
    const heads = document.querySelectorAll(".section-head");
    if (heads[0]) heads[0].querySelector(".section-title").innerHTML =
      `<div class="section-title-bar"></div> ✏️ Stationery`;
    if (heads[1]) {
      heads[1].style.display = "block";
      heads[1].querySelector(".section-title").innerHTML =
        `<div class="section-title-bar"></div> 🍽️ Food & Drinks`;
    }

    document.getElementById("scroll-stationery").innerHTML =
      stationery.length
        ? stationery.map(buildCard).join("")
        : `<p style="padding:16px;color:#aaa">No items</p>`;

    document.getElementById("scroll-food").innerHTML =
      food.length
        ? food.map(buildCard).join("")
        : `<p style="padding:16px;color:#aaa">No items</p>`;
  }
}

//////////////////////////////////////////////////////////
// ADD TO CART  (your original logic, untouched)
//////////////////////////////////////////////////////////

function addToCart(id) {
  const product = allProducts.find(p => p.id === id);
  if (!product || product.stock <= 0) return;

  product.stock--;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.q += 1;
  } else {
    cart.push({
      id:    product.id,
      n:     product.name,
      p:     product.price,
      u:     product.unit || "",
      q:     1,
      emoji: product.emoji
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartBadge();
  renderAll();

  const toast = document.getElementById("cartToast");
  toast.textContent = `${product.name} added to cart`;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

//////////////////////////////////////////////////////////
// CART BADGE
//////////////////////////////////////////////////////////

function updateCartBadge() {
  const cart  = JSON.parse(localStorage.getItem("cart")) || [];
  const total = cart.reduce((sum, item) => sum + item.q, 0);
  const badge = document.getElementById("cartBadge");
  if (badge) badge.textContent = total;
}

//////////////////////////////////////////////////////////
// LOAD PRODUCTS FROM BACKEND
//////////////////////////////////////////////////////////

async function loadProducts() {
  try {
    const res  = await fetch(`${API}/products`);
    const data = await res.json();

    allProducts = data.map(p => ({
      ...p,
      price: parseFloat(p.price),
      emoji: categoryEmoji[p.category] || "🛍️"
    }));

    renderAll();
    updateCartBadge();

  } catch (err) {
    document.getElementById("scroll-stationery").innerHTML =
      "<p style='padding:16px;color:#aaa'>Could not load products. Is the server running?</p>";
  }
}

//////////////////////////////////////////////////////////
// ORDERS BADGE  (your original code, untouched)
//////////////////////////////////////////////////////////

function updateOrdersBadge() {
  const badge = document.getElementById("ordersBadge");
  if (!badge) return;
  const unseen = parseInt(localStorage.getItem("unseenOrders") || "0");
  if (unseen > 0) {
    badge.textContent   = unseen;
    badge.style.display = "grid";
  } else {
    badge.style.display = "none";
  }
}

//////////////////////////////////////////////////////////
// INIT
//////////////////////////////////////////////////////////

loadProducts();
setupSearch();  // ← connects search bar
updateOrdersBadge();