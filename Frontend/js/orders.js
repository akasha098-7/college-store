window.onload = function(){

  const container = document.getElementById("ordersContainer");

  const orders = JSON.parse(localStorage.getItem("orders")) || [];

  //////////////////////////////////////////////////////
  // ⭐ UPDATE ORDERS BADGE
  //////////////////////////////////////////////////////
  const ordersBadge = document.getElementById("ordersBadge");

  if (ordersBadge){
    if (orders.length > 0){
      ordersBadge.textContent = orders.length;
      ordersBadge.style.display = "grid";
    }else{
      ordersBadge.style.display = "none";
    }
  }

  //////////////////////////////////////////////////////
  // SHOW ORDERS LIST
  //////////////////////////////////////////////////////
  if(orders.length === 0){
    container.innerHTML = "<h3>No orders yet</h3>";
    return;
  }

  let html = "";

  orders.forEach(order => {

    let itemsHtml = "";

    order.items.forEach(item => {
      itemsHtml += `
        <div class="item">
          <span>${item.emoji || "🛒"} ${item.n} × ${item.q}</span>
          <span>₹${item.p * item.q}</span>
        </div>
      `;
    });

    html += `
      <div class="order-card">

        <div class="order-header">
          <div>
            <div class="order-num">${order.orderNum}</div>
            <div class="order-date">${order.date}</div>
          </div>
          <div>${order.method}</div>
        </div>

        <div class="order-body">

          <div class="pickup-box">
            Pickup Code
            <div class="pickup-code">${order.pickupCode}</div>
          </div>

          ${itemsHtml}

          <div class="total">
            <span>Total Paid</span>
            <span>₹${order.total}</span>
          </div>

        </div>
      </div>
    `;
  });

  container.innerHTML = html;
};