//////////////////////////////////////////////////////////
// CATEGORY DATA WITH STOCK
//////////////////////////////////////////////////////////

const catData = [

//////////////////// STATIONERY ////////////////////

{
  label:"✏️ Stationery",
  items:[
    {id:'s1',e:'🖊️',n:'Ball Pen Blue',u:'1 piece',p:5,s:37},
    {id:'s2',e:'✏️',n:'Pencil Set',u:'Pack of 6',p:20,s:0},
    {id:'s3',e:'🖍️',n:'Highlighter Set',u:'5 colours',p:45,s:3},
    {id:'s4',e:'📐',n:'Geometry Box',u:'1 set',p:85,s:5},
    {id:'s5',e:'🗂️',n:'File Folder',u:'A4 size',p:25,s:20},
    {id:'s6',e:'📏',n:'Ruler 30cm',u:'1 piece',p:15,s:30},
    {id:'s7',e:'✂️',n:'Scissors',u:'1 piece',p:30,s:0}
  ]
},

//////////////////// BOOKS ////////////////////

{
  label:"📚 Books",
  items:[
    {id:'b1',e:'📘',n:'Engineering Maths',u:'Semester 1',p:320,s:10},
    {id:'b2',e:'📗',n:'Physics Vol. I',u:'Theory+Lab',p:280,s:7},
    {id:'b3',e:'📙',n:'Chemistry Lab',u:'Lab Manual',p:195,s:5},
   
    {id:'b5',e:'📊',n:'Graph Book',u:'60 pages',p:25,s:18},
    
  ]
},

//////////////////// BEVERAGE ////////////////////

{
  label:"☕ Beverage",
  items:[
    {id:'v1',e:'☕',n:'Instant Coffee',u:'1 cup',p:9,s:50},
    {id:'v2',e:'🍵',n:'Cardamom Tea',u:'1 cup',p:9,s:50},
    {id:'v3',e:'🍋',n:'Lemon Tea',u:'1 cup',p:10,s:40},
    {id:'v4',e:'🥤',n:'Smoodh',u:'1 bottle',p:10,s:30},
    {id:'v5',e:'🥭',n:'Frooti',u:'1 bottle',p:10,s:30},
    {id:'v6',e:'🥭',n:'Maaza',u:'1 bottle',p:10,s:30},
    {id:'v7',e:'🫧',n:'Fizz',u:'1 bottle',p:10,s:25},
    {id:'v8',e:'🥤',n:'Sprite',u:'1 bottle',p:20,s:25},
    {id:'v9',e:'🥤',n:'Fanta',u:'1 bottle',p:20,s:25}
  ]
},

//////////////////// SNACKS ////////////////////

{
  label:"🍿 Snacks",
  items:[
    {id:'sn1',e:'🥐',n:'Egg Puffs',u:'1 piece',p:15,s:20},
    {id:'sn2',e:'🥟',n:'Samosa',u:'1 piece',p:10,s:25},
    {id:'sn3',e:'🍪',n:'Nabati Wafer',u:'1 piece',p:10,s:30},
    {id:'sn4',e:'🍿',n:'Too Yum',u:'1 pack',p:20,s:20},
    {id:'sn5',e:'🍪',n:'Good Day',u:'1 pack',p:10,s:25}
  ]
},

//////////////////// ICE CREAM ////////////////////

{
  label:"🍦 Ice Cream",
  items:[
    {id:'i1',e:'🍨',n:'Sundae',u:'1 cup',p:35,s:20},
    {id:'i2',e:'🍫',n:'Choco Bar',u:'1 piece',p:20,s:20},
    {id:'i3',e:'🍦',n:'Chocolate Cone',u:'1 piece',p:45,s:15},
    {id:'i4',e:'🍦',n:'Vanilla Bar',u:'1 piece',p:15,s:25}
  ]
},

//////////////////// CHOCOLATES ////////////////////

{
  label:"🍫 Chocolates",
  items:[
    {id:'c1',e:'🍬',n:'Gems (Small)',u:'1 pack',p:5,s:60},
    {id:'c2',e:'🍬',n:'Gems (Big)',u:'1 pack',p:10,s:40},
    {id:'c3',e:'🍫',n:'Galaxy',u:'1 bar',p:45,s:20},
    {id:'c4',e:'🍫',n:'KitKat',u:'2 fingers',p:10,s:30},
    {id:'c5',e:'🍫',n:'Dairy Milk',u:'1 piece',p:10,s:35},
    {id:'c6',e:'🍫',n:'Snickers',u:'1 bar',p:20,s:25}
  ]
},

//////////////////// UNIFORM ////////////////////

{
  label:"👕 Uniform",
  items:[
    {id:'u1',e:'👔',n:'Uniform',u:'1 set',p:1700,s:5}
  ]
}

];

//////////////////////////////////////////////////////////
// CART BADGE INITIAL VALUE
//////////////////////////////////////////////////////////

function getCartCount(){
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  return cart.reduce((sum,item)=>sum + item.q, 0);
}

//////////////////////////////////////////////////////////
// STOCK LABEL
//////////////////////////////////////////////////////////

function stockLabel(q){
  if(q===0) return {text:'❌ Out of stock',cls:'out'};
  if(q<=5) return {text:`⚠️ Only ${q} left`,cls:'low'};
  return {text:`✅ ${q} in stock`,cls:'ok'};
}

//////////////////////////////////////////////////////////
// BUILD PAGE
//////////////////////////////////////////////////////////

function buildPage(){

  const container = document.getElementById("catScrollBody");
  let html = "";

  catData.forEach((cat,index)=>{

    html += `
      <div class="section-head">
        <div class="section-title">
          <span class="section-title-bar"></span>
          ${cat.label}
        </div>
        <span class="see-all">See All ›</span>
      </div>

      <div class="product-scroll">
        ${cat.items.map((p,i)=>buildCard(p,i)).join("")}
      </div>

      ${index < catData.length-1 ? `<div class="section-divider"></div>`:''}
    `;
  });

  container.innerHTML = html;

  document.getElementById("cartBadge").textContent = getCartCount();
}

//////////////////////////////////////////////////////////
// BUILD CARD
//////////////////////////////////////////////////////////

function buildCard(p,i){

  const lbl = stockLabel(p.s);
  const out = p.s===0;

  return `
  <div class="p-card" id="card-${p.id}">

    <div class="p-card-img bg-s${(i%6)+1}">
      ${p.e}

      ${!out ? `
        <button class="p-add-btn"
          onclick="addToCart('${p.id}')">+</button>
      `:''}

      ${out ? `<div class="p-out-label">Out of Stock</div>`:''}
    </div>

    <div class="p-card-info">
      <div class="p-card-name">${p.n}</div>
      <div class="p-card-qty">${p.u}</div>
      <div class="p-stock ${lbl.cls}">${lbl.text}</div>
      <div class="p-card-price">₹${p.p}</div>
    </div>

  </div>`;
}

//////////////////////////////////////////////////////////
// ADD TO CART (MAIN LOGIC)
//////////////////////////////////////////////////////////

function addToCart(id){

  const product = catData.flatMap(c=>c.items)
                    .find(p=>p.id===id);

  if(product.s<=0) return;

  // decrease stock
  product.s--;



  // ================= CART STORAGE =================

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

const existing = cart.find(item => item.id === product.id);

if(existing){
  existing.q += 1;
} else {
 cart.push({
  id: product.id,
  n: product.n,
  p: product.p,
  u: product.u,
  q: 1,
  e: product.e     // ⭐ ADD THIS LINE
});
}

localStorage.setItem("cart", JSON.stringify(cart));
  // =================================================

  showToast(`✅ ${product.n} (₹${product.p}) added to cart!`);

  buildPage(); // refresh UI
}

//////////////////////////////////////////////////////////
// NAVIGATION
//////////////////////////////////////////////////////////

function goProfile(){
  window.location.href = "profile.html";
}

//////////////////////////////////////////////////////////
// TOAST
//////////////////////////////////////////////////////////

function showToast(text){
  const t = document.getElementById("toast");

  t.textContent = text;
  t.classList.add("show");

  setTimeout(()=>{
    t.classList.remove("show");
  }, 2000);
}

//////////////////////////////////////////////////////////

buildPage();