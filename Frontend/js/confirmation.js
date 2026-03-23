// ===== READ REAL ORDER DATA FROM LOCALSTORAGE =====
// payment.js saves the latest order as the first item in "orders"

const orders = JSON.parse(localStorage.getItem("orders")) || [];

if (orders.length > 0) {
  const latest = orders[0]; // most recent order is always first

  document.getElementById("orderNumber").textContent = latest.orderNum;
  document.getElementById("pickupCode").textContent  = latest.pickupCode;

} else {
  // Fallback if somehow orders is empty
  document.getElementById("orderNumber").textContent = "QP???";
  document.getElementById("pickupCode").textContent  = "----";
}

// ===== BACK TO HOME =====

function goHome() {
  window.location.href = "home.html";
}