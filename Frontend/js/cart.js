let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart(){
  localStorage.setItem("cart", JSON.stringify(cart));
}

function changeQty(i, delta){
  cart[i].q += delta;

  if(cart[i].q <= 0){
    cart.splice(i,1);
  }

  saveCart();
  renderCart();
}

function removeItem(i){
  cart.splice(i,1);
  saveCart();
  renderCart();
}

//////////////////////////////////////////////////////////
// RENDER CART
//////////////////////////////////////////////////////////

function renderCart(){

  const container = document.getElementById("cartItems");

  if(cart.length === 0){
    container.innerHTML = "<h3>Your cart is empty</h3>";
    updateTotals(0,0);
    updateBadge(0);
    return;
  }

  let html = "";
  let total = 0;
  let items = 0;

  cart.forEach((item,i)=>{

    const itemTotal = item.p * item.q;
    total += itemTotal;
    items += item.q;

    html += `
      <div class="cart-card">

        <!-- LEFT SIDE -->
        <div class="cart-left">

          <div class="cart-img">
                ${item.e || item.emoji || "🛒"}
           </div>

          <div class="cart-info">
            <h3>${item.n}</h3>
            <p>${item.u}</p>
            <div class="cart-price">₹${itemTotal}</div>
          </div>

        </div>

        <!-- RIGHT SIDE -->
        <div class="cart-right">

          <div class="qty-box">
            <button class="qty-btn"
              onclick="changeQty(${i},-1)">−</button>

            <strong>${item.q}</strong>

            <button class="qty-btn"
              onclick="changeQty(${i},1)">+</button>
          </div>

         <div class="remove-btn" onclick="removeItem(${i})">
            🗑 Remove
        </div>
            
        </div>

      </div>
    `;
  });

  container.innerHTML = html;

  updateTotals(items, total);
  updateBadge(items);
}

//////////////////////////////////////////////////////////
// TOTALS
//////////////////////////////////////////////////////////

function updateTotals(items, amount){
  document.getElementById("itemCount").textContent = items;
  document.getElementById("subtotal").textContent = "₹"+amount;
  document.getElementById("totalAmount").textContent = "₹"+amount;
  document.getElementById("payAmount").textContent = "₹"+amount;
}

//////////////////////////////////////////////////////////
// NAV BADGE
//////////////////////////////////////////////////////////

function updateBadge(count){

  const badge = document.getElementById("cartBadge");

  if(!badge) return;

  if(count > 0){
    badge.textContent = count;
    badge.style.display = "grid";
  }else{
    badge.style.display = "none";
  }
}

//////////////////////////////////////////////////////////

function goProfile(){
  window.location.href = "profile.html";
}

renderCart();
function goToPayment() {
  localStorage.setItem("cartData", JSON.stringify(cart));
  window.location.href = "payment.html";
}