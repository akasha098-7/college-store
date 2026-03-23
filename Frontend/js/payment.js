let method = "cash";

//////////////////////////////////////////////////////
// BACKEND URL
//////////////////////////////////////////////////////

const API = "http://localhost:3000/api";

//////////////////////////////////////////////////////
// AUTH CHECK
//////////////////////////////////////////////////////

const token = localStorage.getItem("token");
const user  = JSON.parse(localStorage.getItem("user") || "null");

if (!token || !user) {
  window.location.href = "login.html";
}

//////////////////////////////////////////////////////
// LOAD CART DATA  (your original code, untouched)
//////////////////////////////////////////////////////

window.onload = function () {
  const data = localStorage.getItem("cartData");
  const box  = document.getElementById("payOrderSummary");

  if (!data) {
    box.innerHTML = "<p>Your cart is empty</p>";
    return;
  }

  const cart = JSON.parse(data);
  let total = 0;
  box.innerHTML = "";

  cart.forEach(item => {
    const itemTotal = item.p * item.q;
    total += itemTotal;

    box.innerHTML += `
      <div class="pay-order-row">
        <span>${item.n} × ${item.q}</span>
        <span>₹${itemTotal}</span>
      </div>
    `;
  });

  box.innerHTML += `
    <div class="pay-order-row total">
      <span>Total</span>
      <span>₹${total}</span>
    </div>
  `;
};

//////////////////////////////////////////////////////
// PAYMENT METHOD  (your original code, untouched)
//////////////////////////////////////////////////////

function selectMethod(m) {
  method = m;

  document.getElementById("cash").classList.remove("selected");
  document.getElementById("upi").classList.remove("selected");
  document.getElementById(m).classList.add("selected");

  document.getElementById("upiBox").style.display = m === "upi" ? "block" : "none";
}

//////////////////////////////////////////////////////
// PLACE ORDER
//////////////////////////////////////////////////////

async function placeOrder() {

  // Validate UPI if selected (your original check)
  if (method === "upi") {
    const upi = document.getElementById("upiId").value.trim();
    if (!upi) {
      alert("Please enter UPI ID");
      return;
    }
  }

  const cart = JSON.parse(localStorage.getItem("cartData")) || [];

  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  // ── 1. SAVE TO DATABASE ────────────────────────────────
  try {
    const items = cart.map(item => ({
      product_id: item.id,       // real DB id saved by home.js
      quantity:   item.q,
      price:      item.p
    }));

    const res  = await fetch(`${API}/orders`, {
      method:  "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ items })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Could not place order. Please try again.");
      return;
    }

    // ── 2. YOUR ORIGINAL localStorage ORDER HISTORY ────────
    let orders    = JSON.parse(localStorage.getItem("orders")) || [];
    let orderNum  = data.order_id           // use real DB order id
                    ? "QP" + String(data.order_id).padStart(3, "0")
                    : "QP" + String(orders.length + 1).padStart(3, "0");
    let pickupCode = Math.floor(1000 + Math.random() * 9000);

    let now     = new Date();
    let dateStr = now.toLocaleDateString("en-IN") + ", " +
                  now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

    let total = 0;
    cart.forEach(item => total += item.p * item.q);

    orders.unshift({
      orderNum,
      pickupCode,
      date:   dateStr,
      method: method === "upi" ? "📲 UPI" : "💵 Cash",
      items:  cart,
      total
    });

    localStorage.setItem("orders", JSON.stringify(orders));

    // ── 3. UNSEEN BADGE  (your original code, untouched) ──
    let unseen = parseInt(localStorage.getItem("unseenOrders") || "0");
    unseen++;
    localStorage.setItem("unseenOrders", String(unseen));

    // ── 4. CLEAR CART & REDIRECT  (your original code) ────
    localStorage.removeItem("cartData");
    localStorage.removeItem("cart");

    window.location.href = "confirmation.html";

  } catch (err) {
    alert("Cannot connect to server. Make sure the backend is running.");
  }
}

//////////////////////////////////////////////////////
// BACK BUTTON  (your original code, untouched)
//////////////////////////////////////////////////////

function goBack() {
  window.location.href = "cart.html";
}