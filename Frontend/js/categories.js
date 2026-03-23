//////////////////////////////////////////////////////////
// AUTH CHECK
//////////////////////////////////////////////////////////

const token = localStorage.getItem("token");
const user  = JSON.parse(localStorage.getItem("user") || "null");

if (!token || !user) window.location.href = "login.html";

//////////////////////////////////////////////////////////
// BACKEND URL
//////////////////////////////////////////////////////////

const API = "http://localhost:3000/api";

//////////////////////////////////////////////////////////
// EMOJI MAP — matches your DB category names
//////////////////////////////////////////////////////////

const categoryEmoji = {
  "Stationary": { label: "✏️ Stationery", emoji: "✏️" },
  "Books":      { label: "📚 Books",      emoji: "📚" },
  "Beverages":  { label: "☕ Beverage",   emoji: "☕" },
  "Snacks":     { label: "🍿 Snacks",     emoji: "🍿" },
  "Ice Cream":  { label: "🍦 Ice Cream",  emoji: "🍦" },
  "Chocolate":  { label: "🍫 Chocolates", emoji: "🍫" },
  "Uniform":    { label: "👕 Uniform",    emoji: "👕" }
};

//////////////////////////////////////////////////////////
// ALL PRODUCTS (loaded from DB)
//////////////////////////////////////////////////////////

let allProducts = [];

//////////////////////////////////////////////////////////
// CART BADGE  (your original logic, untouched)
//////////////////////////////////////////////////////////

function getCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  return cart.reduce((sum, item) => sum + item.q, 0);
}

//////////////////////////////////////////////////////////
// STOCK LABEL  (your original code, untouched)
//////////////////////////////////////////////////////////

function stockLabel(q) {
  if (q === 0) return { text: "❌ Out of stock", cls: "out" };
  if (q <= 5)  return { text: `⚠️ Only ${q} left`, cls: "low" };
  return             { text: `✅ ${q} in stock`,   cls: "ok"  };
}

//////////////////////////////////////////////////////////
// BUILD CARD  (your original code, untouched)
//////////////////////////////////////////////////////////

function buildCard(p, i) {
  const lbl = stockLabel(p.stock);
  const out = p.stock === 0;

  return `
    <div class="p-card" id="card-${p.id}">
      <div class="p-card-img bg-s${(i % 6) + 1}">
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
// BUILD PAGE  (your original structure, untouched)
//////////////////////////////////////////////////////////

function buildPage() {
  const container = document.getElementById("catScrollBody");

  // Group products by category
  const grouped = {};
  allProducts.forEach(p => {
    if (!grouped[p.category]) grouped[p.category] = [];
    grouped[p.category].push(p);
  });

  const categoryOrder = ["Stationary", "Books", "Beverages", "Snacks", "Ice Cream", "Chocolate", "Uniform"];
  let html = "";

  categoryOrder.forEach((cat, index) => {
    const items = grouped[cat];
    if (!items || items.length === 0) return;

    const catInfo = categoryEmoji[cat] || { label: cat, emoji: "🛍️" };

    html += `
      <div class="section-head">
        <div class="section-title">
          <span class="section-title-bar"></span>
          ${catInfo.label}
        </div>
        <span class="see-all">See All ›</span>
      </div>

      <div class="product-scroll">
        ${items.map((p, i) => buildCard(p, i)).join("")}
      </div>

      ${index < categoryOrder.length - 1 ? `<div class="section-divider"></div>` : ""}
    `;
  });

  container.innerHTML = html;
  document.getElementById("cartBadge").textContent = getCartCount();
}

//////////////////////////////////////////////////////////
// ADD TO CART  (your original logic, uses real DB id)
//////////////////////////////////////////////////////////

function addToCart(id) {
  const product = allProducts.find(p => p.id === id);
  if (!product || product.stock <= 0) return;

  // Decrease local stock so UI updates instantly
  product.stock--;

  // Save to localStorage (same format your cart.html reads)
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
      e:     product.emoji
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  showToast(`✅ ${product.name} (₹${product.price}) added to cart!`);
  buildPage(); // refresh UI to update stock label
}

//////////////////////////////////////////////////////////
// LOAD PRODUCTS FROM BACKEND
//////////////////////////////////////////////////////////

async function loadProducts() {
  try {
    const res  = await fetch(`${API}/products`);
    const data = await res.json();

    // Attach emoji to each product
    allProducts = data.map(p => ({
      ...p,
      price: parseFloat(p.price),
      emoji: categoryEmoji[p.category]?.emoji || "🛍️"
    }));

    buildPage();

  } catch (err) {
    document.getElementById("catScrollBody").innerHTML =
      "<p style='padding:20px;color:#aaa'>Could not load products. Is the server running?</p>";
  }
}

//////////////////////////////////////////////////////////
// NAVIGATION  (your original code, untouched)
//////////////////////////////////////////////////////////

function goProfile() {
  window.location.href = "profile.html";
}

//////////////////////////////////////////////////////////
// TOAST  (your original code, untouched)
//////////////////////////////////////////////////////////

function showToast(text) {
  const t = document.getElementById("toast");
  t.textContent = text;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2000);
}

//////////////////////////////////////////////////////////
// INIT
//////////////////////////////////////////////////////////

loadProducts();