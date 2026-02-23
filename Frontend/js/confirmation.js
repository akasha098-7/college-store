// ===== ORDER NUMBER (QP001, QP002...) =====

let count = parseInt(localStorage.getItem("qp_order_count") || "0");

count++;

localStorage.setItem("qp_order_count", count);

const orderNo = "QP" + String(count).padStart(3,'0');

document.getElementById("orderNumber").textContent = orderNo;


// ===== RANDOM PICKUP CODE =====

const code = Math.floor(1000 + Math.random() * 9000);

document.getElementById("pickupCode").textContent = code;


// ===== BACK TO HOME =====

function goHome(){
  window.location.href = "home.html";
}