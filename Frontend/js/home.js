const catalogue = {

  stationery:[
    {id:'s1',name:'A4 Notebook',emoji:'📓',price:60,unit:'200 pages',stock:15},
    {id:'s2',name:'Ball Pen Blue',emoji:'🖊️',price:5,unit:'1 piece',stock:42},
    {id:'s3',name:'Pencil Set',emoji:'✏️',price:20,unit:'Pack of 6',stock:8},
    {id:'s4',name:'Geometry Box',emoji:'📐',price:85,unit:'1 set',stock:5},
    {id:'s5',name:'File Folder',emoji:'🗂️',price:25,unit:'A4 size',stock:20},
    {id:'s6',name:'Ruler 30cm',emoji:'📏',price:15,unit:'1 piece',stock:30},
    {id:'s7',name:'Highlighter Set',emoji:'🖍️',price:45,unit:'5 colours',stock:3},
    {id:'s8',name:'Scissors',emoji:'✂️',price:30,unit:'1 piece',stock:0}
  ],

  food:[
    {id:'f1',name:'Masala Chai',emoji:'☕',price:15,unit:'1 cup',stock:50},
    {id:'f2',name:'Veg Sandwich',emoji:'🥪',price:35,unit:'1 piece',stock:12},
    {id:'f3',name:'Veg Noodles',emoji:'🍜',price:45,unit:'1 plate',stock:7},
    {id:'f4',name:'Cold Coffee',emoji:'🧋',price:40,unit:'300ml',stock:9},
    {id:'f5',name:'Samosa',emoji:'🥟',price:10,unit:'1 piece',stock:25},
    {id:'f6',name:'Lays Chips',emoji:'🍿',price:20,unit:'26g pack',stock:0},
    {id:'f7',name:'Fruit Juice',emoji:'🧃',price:30,unit:'200ml pack',stock:18},
    {id:'f8',name:'Mineral Water',emoji:'💧',price:20,unit:'1 litre',stock:40}
  ]
};

let cartCount = 0;

//////////////////////////////////////////////////////////
// STOCK LABEL
//////////////////////////////////////////////////////////

function stockLabel(q){
  if(q === 0) return {text:'❌ Out of stock', cls:'out'};
  if(q <= 5) return {text:`⚠️ Only ${q} left`, cls:'low'};
  return {text:`✅ ${q} in stock`, cls:'ok'};
}

//////////////////////////////////////////////////////////
// BUILD PRODUCT CARD
//////////////////////////////////////////////////////////

function buildCard(p){

  const lbl = stockLabel(p.stock);
  const out = p.stock === 0;

  return `
    <div class="p-card">

      <div class="p-card-img">
        ${p.emoji}

        ${!out ? `
          <button class="p-add-btn"
            onclick="addToCart('${p.id}')">+</button>
        ` : ''}

        ${out ? `<div class="p-out-label">Out of Stock</div>` : ''}

      </div>

      <div class="p-card-info">
        <div class="p-card-name">${p.name}</div>
        <div class="p-card-qty">${p.unit}</div>
        <div class="p-stock ${lbl.cls}">${lbl.text}</div>
        <div class="p-card-price">₹${p.price}</div>
      </div>

    </div>
  `;
}

//////////////////////////////////////////////////////////
// RENDER ALL PRODUCTS
//////////////////////////////////////////////////////////

function renderAll(){

  document.getElementById("scroll-stationery").innerHTML =
    catalogue.stationery.map(buildCard).join("");

  document.getElementById("scroll-food").innerHTML =
    catalogue.food.map(buildCard).join("");
}

//////////////////////////////////////////////////////////
// ADD TO CART FUNCTION
//////////////////////////////////////////////////////////

function addToCart(id){

  const product =
    [...catalogue.stationery, ...catalogue.food]
      .find(p => p.id === id);

  if(product.stock <= 0) return;

  // decrease stock
  product.stock--;

  //////////////////////////////////////////////////
  // ⭐ SAVE TO CART (SAME FORMAT AS CATEGORY PAGE)
  //////////////////////////////////////////////////

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existing = cart.find(item => item.id === product.id);

  if(existing){
    existing.q += 1;
  } else {
    cart.push({
  id: product.id,
  n: product.name,
  p: product.price,
  u: product.unit,
  q: 1,
  emoji: product.emoji   // ⭐ ADD THIS
});
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  //////////////////////////////////////////////////
  // ⭐ UPDATE BADGE
  //////////////////////////////////////////////////

  const totalItems =
    cart.reduce((sum, item) => sum + item.q, 0);

  document.getElementById("cartBadge").textContent = totalItems;

  //////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////

  renderAll();

  const toast = document.getElementById("cartToast");
  toast.textContent = `${product.name} added to cart`;
  toast.classList.add("show");

  setTimeout(() => toast.classList.remove("show"), 2000);
}

//////////////////////////////////////////////////////////

renderAll();
//////////////////////////////////////////////////////////
// ⭐ ORDERS BADGE (UNSEEN ONLY)
//////////////////////////////////////////////////////////

function updateOrdersBadge(){

  const badge = document.getElementById("ordersBadge");
  if(!badge) return;

  const unseen = parseInt(localStorage.getItem("unseenOrders") || "0");

  if(unseen > 0){
    badge.textContent = unseen;
    badge.style.display = "grid";
  }else{
    badge.style.display = "none";
  }
}

updateOrdersBadge();