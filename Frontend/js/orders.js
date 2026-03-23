const API   = "http://localhost:3000/api";
const token = localStorage.getItem("token");
const user  = JSON.parse(localStorage.getItem("user") || "null");

if (!token || !user) window.location.href = "login.html";

window.onload = async function () {

  const container   = document.getElementById("ordersContainer");
  const ordersBadge = document.getElementById("ordersBadge");

  // ── RESET UNSEEN BADGE (your original logic) ──────────
  localStorage.setItem("unseenOrders", "0");
  if (ordersBadge) ordersBadge.style.display = "none";

  // ── FETCH ORDERS FROM DB ──────────────────────────────
  try {
    const res    = await fetch(`${API}/orders/my`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const orders = await res.json();

    if (!res.ok || orders.length === 0) {
      container.innerHTML = "<h3>No orders yet</h3>";
      return;
    }

    // ── Also merge any localStorage orders (pickup code + method)
    // since DB doesn't store those, we read them from localStorage
    const localOrders = JSON.parse(localStorage.getItem("orders")) || [];

    let html = "";

    orders.forEach(order => {

      // Match with localStorage order to get pickupCode + method
      const localMatch = localOrders.find(o =>
        o.orderNum === "QP" + String(order.id).padStart(3, "0")
      );

      const pickupCode = localMatch ? localMatch.pickupCode : "----";
      const method     = localMatch ? localMatch.method     : "💵 Cash";
      const orderNum   = "QP" + String(order.id).padStart(3, "0");
      const dateStr    = new Date(order.order_date).toLocaleDateString("en-IN") + ", " +
                         new Date(order.order_date).toLocaleTimeString("en-IN",
                           { hour: "2-digit", minute: "2-digit" });

      // ── Items HTML (same structure as your original) ──
      let itemsHtml = "";
      order.items.forEach(item => {
        itemsHtml += `
          <div class="item">
            <span>🛒 ${item.product_name} × ${item.quantity}</span>
            <span>₹${(item.price * item.quantity).toFixed(0)}</span>
          </div>
        `;
      });

      // ── Order card (your original HTML structure, untouched) ──
      html += `
        <div class="order-card">

          <div class="order-header">
            <div>
              <div class="order-num">${orderNum}</div>
              <div class="order-date">${dateStr}</div>
            </div>
            <div>${method}</div>
          </div>

          <div class="order-body">

            <div class="pickup-box">
              Pickup Code
              <div class="pickup-code">${pickupCode}</div>
            </div>

            ${itemsHtml}

            <div class="total">
              <span>Total Paid</span>
              <span>₹${parseFloat(order.total_amount).toFixed(0)}</span>
            </div>

          </div>
        </div>
      `;
    });

    container.innerHTML = html;

  } catch (err) {
    container.innerHTML = "<h3>Could not load orders. Is the server running?</h3>";
  }
};