// ── AUTH CHECK ────────────────────────────────────────
const token = localStorage.getItem("token");
const user  = JSON.parse(localStorage.getItem("user") || "null");

if (!token || !user) window.location.href = "login.html";

// ── FILL IN REAL USER DATA ────────────────────────────
window.onload = function () {

  // Replace "Student User" with real name
  const nameEl = document.querySelector(".profile-center h2");
  if (nameEl && user) {
    nameEl.textContent = user.first_name + " " + user.last_name;
  }

  // Replace hardcoded admission number
  const admEl = document.querySelector(".profile-center p");
  if (admEl && user) {
    admEl.textContent = "Admission No: " + user.admission_number;
  }

  // Wire up Sign Out button
  const signOutBtn = document.querySelector(".signout");
  if (signOutBtn) {
    signOutBtn.onclick = function () {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("cart");
      localStorage.removeItem("cartData");
      localStorage.removeItem("orders");
      localStorage.removeItem("unseenOrders");
      window.location.href = "login.html";
    };
  }

  // Wire up My Orders item
  const items = document.querySelectorAll(".profile-content .item");
  items.forEach(item => {
    if (item.querySelector("span") &&
        item.querySelector("span").textContent.trim() === "My Orders") {
      item.style.cursor = "pointer";
      item.onclick = () => window.location.href = "orders.html";
    }
  });
};

// ── BACK BUTTON (your original code, untouched) ───────
function goBack() {
  window.history.back();
}