//////////////////////////////////////////////////////////
// AUTH GUARD — redirect to login if not logged in
//////////////////////////////////////////////////////////

const token = localStorage.getItem("token");
const user  = JSON.parse(localStorage.getItem("user") || "null");

if (!token || !user) {
  window.location.href = "login.html";
}

//////////////////////////////////////////////////////////
// BACKEND URL
//////////////////////////////////////////////////////////

const API = "http://localhost:3000/api";

//////////////////////////////////////////////////////////
// STOCK LABEL  (your original code, untouched)
//////////////////////////////////////////////////////////

function stockLabel(q) {
  if (q === 0)  return { text: "❌ Out of stock",      cls: "out" };
  if (q <= 5)   return { text: `⚠️ Only ${q} left`,   cls: "low" };
  return              { text: `✅ ${q} in stock`,      cls: "ok"  };
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
// EMOJI MAP — matches your DB category names
//////////////////////////////////////////////////////////

const categoryEmoji = {
  "Stationary":  "✏️",
  "Books":       "📚",
  "Beverages":   "☕",
  "Snacks":      "🍿",
  "Ice Cream":   "🍦",
  "Chocolate":   "🍫",
  "Uniform":     "👕"
};

// Categories shown on HOME page (stationery + food sections)
const stationeryCategories = ["Stationary", "Books"];
const foodCategories       = ["Beverages", "Snacks", "Ice Cream", "Chocolate"];

//////////////////////////////////////////////////////////
// LOAD PRODUCTS FROM BACKEND
//////////////////////////////////////////////////////////

let allProducts = []; // keep a copy for addToCart lookups

async function loadProducts() {
  try {
    const res  = await fetch(`${API}/products`);
    const data = await res.json();

    // Attach an emoji to each product based on its category
    allProducts = data.map(p => ({
      ...p,
      emoji: categoryEmoji[p.category] || "🛍️"
    }));

    renderAll();
    updateCartBadge();

  } catch (err) {
    console.error("Could not load products:", err);
    document.getElementById("scroll-stationery").innerHTML =
      "<p style='padding:16px;color:#aaa'>Could not load products. Is the server running?</p>";
  }
}

//////////////////////////////////////////////////////////
// RENDER ALL PRODUCTS  (replaces your hardcoded renderAll)
//////////////////////////////////////////////////////////

function renderAll() {
  const stationery = allProducts.filter(p => stationeryCategories.includes(p.category));
  const food       = allProducts.filter(p => foodCategories.includes(p.category));

  document.getElementById("scroll-stationery").innerHTML =
    stationery.length ? stationery.map(buildCard).join("") : "<p style='padding:16px;color:#aaa'>No items</p>";

  document.getElementById("scroll-food").innerHTML =
    food.length ? food.map(buildCard).join("") : "<p style='padding:16px;color:#aaa'>No items</p>";
}

//////////////////////////////////////////////////////////
// ADD TO CART  (your original logic, just uses real DB id)
//////////////////////////////////////////////////////////

function addToCart(id) {
  const product = allProducts.find(p => p.id === id);
  if (!product || product.stock <= 0) return;

  // Decrease local stock so UI updates instantly
  product.stock--;

  // Save to localStorage cart (same format your cart.html expects)
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

  // Update badge
  updateCartBadge();

  // Re-render so stock count updates on screen
  renderAll();

  // Toast
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
// ORDERS BADGE  (your original code, untouched)
//////////////////////////////////////////////////////////

function updateOrdersBadge() {
  const badge = document.getElementById("ordersBadge");
  if (!badge) return;
  const unseen = parseInt(localStorage.getItem("unseenOrders") || "0");
  if (unseen > 0) {
    badge.textContent    = unseen;
    badge.style.display  = "grid";
  } else {
    badge.style.display  = "none";
  }
}

//////////////////////////////////////////////////////////
// INIT
//////////////////////////////////////////////////////////

loadProducts();       // fetch from backend and render
updateOrdersBadge();