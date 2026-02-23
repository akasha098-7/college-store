let method = "cash";

//////////////////////////////////////////////////////
// LOAD CART DATA
//////////////////////////////////////////////////////

window.onload = function () {

  const data = localStorage.getItem("cartData");
  const box = document.getElementById("payOrderSummary");

  if (!data) {
    box.innerHTML = "<p>Your cart is empty</p>";
    return;
  }

  const cart = JSON.parse(data);

  let total = 0;
  box.innerHTML = "";

  cart.forEach(item => {

    const name = item.n;
    const price = item.p;
    const qty = item.q;

    const itemTotal = price * qty;
    total += itemTotal;

    box.innerHTML += `
      <div class="pay-order-row">
        <span>${name} × ${qty}</span>
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
// PAYMENT METHOD
//////////////////////////////////////////////////////

function selectMethod(m){

  method = m;

  document.getElementById("cash").classList.remove("selected");
  document.getElementById("upi").classList.remove("selected");

  document.getElementById(m).classList.add("selected");

  if(m === "upi"){
    document.getElementById("upiBox").style.display = "block";
  } else {
    document.getElementById("upiBox").style.display = "none";
  }
}

//////////////////////////////////////////////////////
// PLACE ORDER
//////////////////////////////////////////////////////

function placeOrder(){
  // ===== SAVE ORDER TO HISTORY =
  // ====

let orders = JSON.parse(localStorage.getItem("orders")) || [];

// Generate order number
let orderNum = "QP" + String(orders.length + 1).padStart(3, "0");

// Generate pickup code
let pickupCode = Math.floor(1000 + Math.random() * 9000);

// Get current date & time
let now = new Date();
let dateStr = now.toLocaleDateString("en-IN") + ", " +
              now.toLocaleTimeString("en-IN", {hour:"2-digit", minute:"2-digit"});

// Get cart data
const cart = JSON.parse(localStorage.getItem("cartData")) || [];

// Calculate total
let total = 0;
cart.forEach(item => total += item.p * item.q);

// Save order object
orders.unshift({
  orderNum,
  pickupCode,
  date: dateStr,
  method: method === "upi" ? "📲 UPI" : "💵 Cash",
  items: cart,
  total
});

localStorage.setItem("orders", JSON.stringify(orders));
// ⭐ INCREASE UNSEEN ORDER COUNT
let unseen = parseInt(localStorage.getItem("unseenOrders") || "0");
unseen++;
localStorage.setItem("unseenOrders", unseen);

  // Validate UPI if selected
  if(method === "upi"){
    let upi = document.getElementById("upiId").value.trim();

    if(!upi){
      alert("Please enter UPI ID");
      return;
    }
  }

  // ❌ Removed alert popup

  // Clear cart
  localStorage.removeItem("cartData");
  localStorage.removeItem("cart");

  // ✅ Go to confirmation page directly
  window.location.href = "confirmation.html";
}
  
//////////////////////////////////////////////////////
// BACK BUTTON
//////////////////////////////////////////////////////

function goBack(){
  window.location.href = "cart.html";
}