/* ── PAGE NAVIGATION ── */
function showPage(name, el) {
  document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
  document.querySelectorAll('.sb-item').forEach(function(b) { b.classList.remove('active'); });
  document.getElementById('page-' + name).classList.add('active');
  if (el) el.classList.add('active');
  var titles = {
    dashboard:'Dashboard', products:'Products', orders:'Orders',
    users:'Users', categories:'Categories', payments:'Payments',
    reports:'Reports & Analytics', notifications:'Alerts & Notifications',
    profile:'Admin Profile', walkin:'Walk-in Orders'
  };
  document.getElementById('pageTitle').textContent = titles[name] || name;
  // Clear notification badges when page is visited
  if (name === 'orders') {
    var ob = document.getElementById('ordersBadge');
    if (ob) ob.style.display = 'none';
  }
  if (name === 'notifications') {
    var ab = document.getElementById('alertBadge');
    if (ab) ab.style.display = 'none';
  }

  if (name === 'walkin') {
    buildWalkinCatalogue();
    if (!document.querySelectorAll('.walkin-row').length) addWalkinRow();
  }
  if (name === 'reports') {
    initCalendar();
  }
}

/* ── MODALS ── */
function openModal(id)  { document.getElementById('modal-' + id).classList.add('show'); }
function closeModal(id) { document.getElementById('modal-' + id).classList.remove('show'); }

/* ── TOAST ── */
var toastTimer;
function showToast(msg, icon) {
  var t = document.getElementById('toast');
  document.getElementById('toastMsg').textContent  = msg;
  document.getElementById('toastIcon').textContent = icon || 'ok';
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function() { t.classList.remove('show'); }, 2800);
}

/* ── ADD PRODUCT ── */
var prodCounter = 9;
function addProduct() {
  var name  = document.getElementById('newProdName').value.trim();
  var emoji = document.getElementById('newProdEmoji').value.trim() || '';
  var cat   = document.getElementById('newProdCat').value;
  var price = document.getElementById('newProdPrice').value || '0';
  var stock = document.getElementById('newProdStock').value || '0';
  if (!name) { showToast('Enter product name!'); return; }
  var id = 'P' + String(prodCounter++).padStart(3,'0');
  var stockNum = parseInt(stock);
  var statusBadge = stockNum === 0
    ? '<span class="badge badge-red">Out of Stock</span>'
    : stockNum <= 5
      ? '<span class="badge badge-yellow">Low Stock</span>'
      : '<span class="badge badge-green">In Stock</span>';
  var display = (emoji ? emoji + ' ' : '') + name;
  var row = '<tr><td>' + id + '</td><td>' + display + '</td><td>' + cat + '</td><td>Rs.' + price + '</td><td>' + stock + '</td><td>' + statusBadge + '</td><td><div class="action-btns"><button class="act-edit" onclick="editProduct(\'' + name + '\')">Edit</button><button class="act-del" onclick="delProduct(this)">Delete</button></div></td></tr>';
  document.getElementById('productTable').insertAdjacentHTML('afterbegin', row);
  closeModal('addProduct');
  ['newProdName','newProdEmoji','newProdPrice','newProdStock','newProdUnit'].forEach(function(id){ document.getElementById(id).value = ''; });
  showToast('Product added!');
  buildWalkinCatalogue();
}

/* ── DELETE ── */
function delProduct(btn) {
  if (!confirm('Delete this product?')) return;
  btn.closest('tr').remove();
  showToast('Product deleted');
  buildWalkinCatalogue();
}
function delUser(btn) {
  if (!confirm('Delete this user?')) return;
  btn.closest('tr').remove();
  showToast('User removed');
}
function delRow(btn) {
  if (!confirm('Delete this category?')) return;
  btn.closest('tr').remove();
  showToast('Category deleted');
}

/* ── EDIT ── */
function editProduct(name) {
  // Find the row in product table
  var rows = document.querySelectorAll('#productTable tr');
  var targetRow = null;
  rows.forEach(function(row) {
    var cells = row.querySelectorAll('td');
    if (cells.length > 1) {
      var rawName = cells[1].textContent.replace(/^[^\w\s]+\s*/u,'').trim();
      if (rawName === name) targetRow = row;
    }
  });
  if (!targetRow) { showToast('Product not found!'); return; }

  var cells = targetRow.querySelectorAll('td');
  document.getElementById('editProdName').value  = cells[1].textContent.replace(/^[^\w\s]+\s*/u,'').trim();
  document.getElementById('editProdCat').value   = cells[2].textContent.trim();
  document.getElementById('editProdPrice').value = cells[3].textContent.replace(/[^\d]/g,'');
  document.getElementById('editProdStock').value = cells[4].textContent.trim();
  document.getElementById('editProdUnit').value  = '';

  // Store row reference via index
  var allRows = Array.from(document.querySelectorAll('#productTable tr'));
  document.getElementById('editProdRow').value = allRows.indexOf(targetRow);

  openModal('editProduct');
}

function saveEditProduct() {
  var idx   = parseInt(document.getElementById('editProdRow').value);
  var name  = document.getElementById('editProdName').value.trim();
  var cat   = document.getElementById('editProdCat').value;
  var price = document.getElementById('editProdPrice').value || '0';
  var stock = document.getElementById('editProdStock').value || '0';
  if (!name) { showToast('Enter product name!'); return; }

  var row   = document.querySelectorAll('#productTable tr')[idx];
  var cells = row.querySelectorAll('td');
  // Keep existing emoji if any
  var existingRaw = cells[1].textContent.trim();
  var emojiMatch  = existingRaw.match(/^([^\w\s]+)\s*/u);
  var emoji = emojiMatch ? emojiMatch[1] : '';

  cells[1].textContent = emoji ? emoji + ' ' + name : name;
  cells[2].textContent = cat;
  cells[3].textContent = 'Rs.' + price;
  cells[4].textContent = stock;

  var stockNum = parseInt(stock);
  var badge    = cells[5].querySelector('.badge');
  if (stockNum === 0)     { badge.className='badge badge-red';    badge.textContent='Out of Stock'; }
  else if(stockNum <= 5)  { badge.className='badge badge-yellow'; badge.textContent='Low Stock'; }
  else                    { badge.className='badge badge-green';  badge.textContent='In Stock'; }

  // Update edit button with new name
  var editBtn = cells[6].querySelector('.act-edit');
  if (editBtn) editBtn.setAttribute('onclick', "editProduct('" + name.replace(/'/g,"\\'") + "')");

  closeModal('editProduct');
  showToast('Product updated!');
  buildWalkinCatalogue();
}
function editCat(name) {
  // Find the row in categories table
  var rows = document.querySelectorAll('#page-categories .table-wrap tbody tr');
  var targetRow = null;
  rows.forEach(function(row) {
    var cells = row.querySelectorAll('td');
    if (cells.length > 1 && cells[1].textContent.trim() === name) targetRow = row;
  });
  if (!targetRow) { showToast('Category not found!'); return; }

  var cells = targetRow.querySelectorAll('td');
  document.getElementById('editCatIcon').value = cells[0].textContent.trim();
  document.getElementById('editCatName').value = cells[1].textContent.trim();

  var allRows = Array.from(document.querySelectorAll('#page-categories .table-wrap tbody tr'));
  document.getElementById('editCatRow').value = allRows.indexOf(targetRow);

  openModal('editCat');
}

function saveEditCat() {
  var idx  = parseInt(document.getElementById('editCatRow').value);
  var icon = document.getElementById('editCatIcon').value.trim();
  var name = document.getElementById('editCatName').value.trim();
  if (!name) { showToast('Enter category name!'); return; }

  var row   = document.querySelectorAll('#page-categories .table-wrap tbody tr')[idx];
  var cells = row.querySelectorAll('td');
  cells[0].textContent = icon;
  cells[1].innerHTML   = '<b>' + name + '</b>';

  // Update edit button with new name
  var editBtn = cells[4] ? cells[4].querySelector('.act-edit') : null;
  if (editBtn) editBtn.setAttribute('onclick', "editCat('" + name.replace(/'/g,"\\'") + "')");

  closeModal('editCat');
  showToast('Category updated!');
}

/* ── BLOCK / UNBLOCK ── */
function toggleBlock(btn) {
  var row   = btn.closest('tr');
  var badge = row.querySelector('.badge');
  if (btn.textContent === 'Block') {
    btn.textContent = 'Unblock';
    btn.style.background = '#e8f8ef';
    btn.style.color = '#27ae60';
    badge.className = 'badge badge-red';
    badge.textContent = 'Blocked';
    showToast('User blocked');
  } else {
    btn.textContent = 'Block';
    btn.style.background = '';
    btn.style.color = '';
    badge.className = 'badge badge-green';
    badge.textContent = 'Active';
    showToast('User unblocked');
  }
}

/* ── ORDER STATUS ── */
function updateStatus(sel) {
  var row   = sel.closest('tr');
  var badge = row.querySelector('.badge');
  var val   = sel.value;
  var map   = {
    'Pending':   ['badge badge-yellow', 'Pending'],
    'Delivered': ['badge badge-green',  'Delivered'],
    'Cancelled': ['badge badge-red',    'Cancelled']
  };
  badge.className   = map[val][0];
  badge.textContent = map[val][1];
  showToast('Order updated to ' + val);
}

/* ── FILTER ORDERS ── */
function filterOrders(val) {
  document.querySelectorAll('#ordersTable tr').forEach(function(row) {
    row.style.display = (val === 'all' || row.dataset.status === val) ? '' : 'none';
  });
}

/* ── ADD CATEGORY ── */
function addCategory() {
  var name = document.getElementById('newCatName').value.trim();
  var icon = document.getElementById('newCatIcon').value.trim() || '';
  if (!name) { showToast('Enter category name!'); return; }
  var row = '<tr><td>' + icon + '</td><td><b>' + name + '</b></td><td>0 products</td><td><span class="badge badge-green">Active</span></td><td><div class="action-btns"><button class="act-edit" onclick="editCat(\'' + name + '\')">Edit</button><button class="act-del" onclick="delRow(this)">Delete</button></div></td></tr>';
  document.querySelector('#page-categories .table-wrap tbody').insertAdjacentHTML('afterbegin', row);
  closeModal('addCategory');
  document.getElementById('newCatName').value = '';
  document.getElementById('newCatIcon').value = '';
  showToast('Category added!');
}

/* ── CLEAR ALERTS ── */
function clearAlerts() {
  document.getElementById('alertsList').innerHTML = '<div class="empty"><div class="empty-icon">ok</div><div class="empty-txt">No new alerts</div></div>';
  document.getElementById('alertBadge').style.display = 'none';
  showToast('All alerts cleared');
}

/* ── LOGOUT ── */
function doLogout()      { openModal('logout'); }
function confirmLogout() { window.location.href = 'login.html'; }

/* ── CLOSE MODALS ON OVERLAY CLICK ── */
document.querySelectorAll('.modal-overlay').forEach(function(overlay) {
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) overlay.classList.remove('show');
  });
});

/* ══════════════════════════════════
   WALK-IN ORDERS
══════════════════════════════════ */
var DUMMY_PRICES = {
  'ball pen blue':5,'pencil set':20,'instant coffee':9,'scissors':30,
  'maaza':10,'egg puffs':15,'sundae':35,'galaxy':45,'cardamom tea':9,
  'lemon tea':10,'smooto':10,'frooti':10,'fizz':10,'sprite':20,'fanta':20,
  'samosa':10,'nabati wafer':10,'too yum':20,'good day':10,'choco bar':20,
  'chocolate cone':45,'vanilla bar':15,'gems (small)':5,'gems (big)':10,
  'kitkat':10,'dairy milk':10,'snickers':20,'graph book':25,
  'engineering maths':320,'physics vol. i':280,'chemistry lab':195,
  'highlighter set':45,'geometry box':85,'file folder':25,'ruler 30cm':15,'uniform':1700
};

var walkinCatalogue  = [];
var walkinPayMethod  = 'cash';
var walkinOrderCount = 0;
var walkinDayTotal   = 0;
var walkinRowCount   = 0;

function buildWalkinCatalogue() {
  walkinCatalogue = [];
  document.querySelectorAll('#productTable tr').forEach(function(row) {
    var cells = row.querySelectorAll('td');
    if (cells.length < 5) return;
    var id    = cells[0].textContent.trim();
    var raw   = cells[1].textContent.trim();
    var name  = raw.replace(/^[^\w\s]+\s*/u, '').trim();
    var price = parseInt(cells[3].textContent.replace(/[^\d]/g,'')) || 0;
    if (!price) price = DUMMY_PRICES[name.toLowerCase()] || 0;
    var stock = parseInt(cells[4].textContent.trim()) || 0;
    var cat   = cells[2].textContent.trim();
    if (name) walkinCatalogue.push({ id:id, name:name, price:price, stock:stock, cat:cat });
  });
}

function addWalkinRow() {
  var rowId = ++walkinRowCount;
  var div   = document.createElement('div');
  div.className = 'walkin-row';
  div.id        = 'wrow-' + rowId;
  div.innerHTML =
    '<div class="walkin-input-wrap">' +
      '<input class="walkin-input" id="witem-' + rowId + '" placeholder="Search item name..." autocomplete="off" ' +
        'oninput="renderWalkinDrop(' + rowId + ')" onkeydown="onWalkinKey(event,' + rowId + ')" onfocus="renderWalkinDrop(' + rowId + ')">' +
      '<div class="ac-dropdown" id="wdrop-' + rowId + '"></div>' +
    '</div>' +
    '<input class="walkin-qty" id="wqty-' + rowId + '" type="number" min="1" value="1" oninput="onQtyChange(' + rowId + ')">' +
    '<input class="walkin-price" id="wprice-' + rowId + '" type="text" value="Rs.0" readonly tabindex="-1">' +
    '<button class="walkin-del-btn" onclick="removeWalkinRow(' + rowId + ')">X</button>';
  document.getElementById('walkinRows').appendChild(div);
  updateBill();
  document.getElementById('witem-' + rowId).focus();
}

function removeWalkinRow(rowId) {
  var el = document.getElementById('wrow-' + rowId);
  if (el) el.remove();
  updateBill();
  if (!document.querySelectorAll('.walkin-row').length) addWalkinRow();
}

function renderWalkinDrop(rowId) {
  buildWalkinCatalogue();
  var input   = document.getElementById('witem-' + rowId);
  var drop    = document.getElementById('wdrop-' + rowId);
  var q       = input.value.trim().toLowerCase();
  var matches = walkinCatalogue.filter(function(p) {
    return q === '' || p.name.toLowerCase().indexOf(q) !== -1 || p.cat.toLowerCase().indexOf(q) !== -1;
  });
  if (!matches.length) {
    drop.innerHTML = '<div class="ac-no-result">No item found</div>';
    drop.classList.add('open');
    return;
  }
  drop.innerHTML = matches.map(function(p) {
    var stk = p.stock === 0
      ? '<span class="ac-item-stock out">Out of stock</span>'
      : p.stock <= 5
        ? '<span class="ac-item-stock low">Only ' + p.stock + ' left</span>'
        : '<span class="ac-item-stock">' + p.stock + ' in stock</span>';
    var safe = p.name.replace(/'/g, "\\'");
    return '<div class="ac-item" onmousedown="selectItem(' + rowId + ',\'' + safe + '\',' + p.price + ',' + p.stock + ',\'' + p.id + '\')">' +
      '<span class="ac-item-name">' + p.name + '</span>' +
      '<span class="ac-item-meta"><span class="ac-item-price">Rs.' + p.price + '</span>' + stk + '</span>' +
      '</div>';
  }).join('');
  drop.classList.add('open');
}

function onWalkinKey(e, rowId) {
  var drop  = document.getElementById('wdrop-' + rowId);
  var items = drop.querySelectorAll('.ac-item');
  var cur   = drop.querySelector('.highlighted');
  if (!drop.classList.contains('open')) return;
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (!cur) { if (items[0]) items[0].classList.add('highlighted'); }
    else { cur.classList.remove('highlighted'); var nxt = cur.nextElementSibling || items[0]; if (nxt) nxt.classList.add('highlighted'); }
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (cur) { cur.classList.remove('highlighted'); var prv = cur.previousElementSibling || items[items.length-1]; if (prv) prv.classList.add('highlighted'); }
  } else if (e.key === 'Enter') {
    e.preventDefault();
    if (cur) cur.dispatchEvent(new MouseEvent('mousedown'));
  } else if (e.key === 'Escape') {
    drop.classList.remove('open');
  }
}

function selectItem(rowId, name, price, stock, prodId) {
  document.getElementById('witem-'  + rowId).value = name;
  document.getElementById('witem-'  + rowId).classList.add('filled');
  document.getElementById('wdrop-'  + rowId).classList.remove('open');
  document.getElementById('wqty-'   + rowId).max   = stock > 0 ? stock : 9999;
  document.getElementById('wqty-'   + rowId).value = 1;
  document.getElementById('wprice-' + rowId).value = 'Rs.' + price;
  var row = document.getElementById('wrow-' + rowId);
  row.dataset.name   = name;
  row.dataset.price  = price;
  row.dataset.stock  = stock;
  row.dataset.prodId = prodId;
  updateBill();
  document.getElementById('wqty-' + rowId).select();
}

function onQtyChange(rowId) {
  var row     = document.getElementById('wrow-'   + rowId);
  var qtyEl   = document.getElementById('wqty-'   + rowId);
  var priceEl = document.getElementById('wprice-' + rowId);
  var p       = parseFloat(row.dataset.price) || 0;
  var stock   = parseInt(row.dataset.stock)   || 0;
  var q = parseInt(qtyEl.value) || 1;
  if (stock > 0 && q > stock) { q = stock; qtyEl.value = q; showToast('Only ' + stock + ' in stock!'); }
  if (q < 1) { q = 1; qtyEl.value = 1; }
  priceEl.value = p > 0 ? 'Rs.' + (p * q) : 'Rs.0';
  updateBill();
}

function updateBill() {
  var total = 0, html = '';
  document.querySelectorAll('.walkin-row').forEach(function(row) {
    var name  = row.dataset.name;
    var price = parseFloat(row.dataset.price) || 0;
    if (!name || !price) return;
    var rowId = row.id.replace('wrow-', '');
    var qtyEl = document.getElementById('wqty-' + rowId);
    var qty   = qtyEl ? (parseInt(qtyEl.value) || 1) : 1;
    var line  = price * qty;
    total += line;
    html += '<div class="bill-row"><span class="bill-row-name">' + name + ' x ' + qty + '</span><span class="bill-row-price">Rs.' + line + '</span></div>';
  });
  document.getElementById('walkinSummary').innerHTML = html ||
    '<div style="color:var(--muted);font-size:13px;font-weight:600;text-align:center;padding:16px 0;">No items added yet</div>';
  document.getElementById('walkinTotal').textContent = 'Rs.' + total;
}

function setPayMethod(method) {
  walkinPayMethod = method;
  document.getElementById('pmCash').className = (method === 'cash' ? 'btn btn-yellow' : 'btn btn-ghost') + ' btn-sm';
  document.getElementById('pmUpi').className  = (method === 'upi'  ? 'btn btn-yellow' : 'btn btn-ghost') + ' btn-sm';
  ['pmCash','pmUpi'].forEach(function(id) {
    document.getElementById(id).style.flex = '1';
    document.getElementById(id).style.justifyContent = 'center';
  });
}

function confirmWalkin() {
  buildWalkinCatalogue();
  var items = [];
  document.querySelectorAll('.walkin-row').forEach(function(row) {
    var name  = row.dataset.name;
    var price = parseFloat(row.dataset.price) || 0;
    if (!name || !price) return;
    var rowId = row.id.replace('wrow-', '');
    var qtyEl = document.getElementById('wqty-' + rowId);
    var qty   = qtyEl ? (parseInt(qtyEl.value) || 1) : 1;
    items.push({ name:name, qty:qty, price:price, prodId:row.dataset.prodId, stock:parseInt(row.dataset.stock)||0 });
  });
  if (!items.length) { showToast('Add at least one item!'); return; }
  for (var i = 0; i < items.length; i++) {
    if (items[i].stock > 0 && items[i].qty > items[i].stock) { showToast('Not enough stock for ' + items[i].name + '!'); return; }
  }
  var total   = items.reduce(function(s,i){ return s + i.price * i.qty; }, 0);
  var now     = new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });
  var method  = walkinPayMethod === 'cash' ? 'Cash' : 'UPI';
  var itemStr = items.map(function(i){ return i.name + ' x' + i.qty; }).join(', ');

  /* Deduct stock */
  items.forEach(function(item) {
    document.querySelectorAll('#productTable tr').forEach(function(pRow) {
      var cells = pRow.querySelectorAll('td');
      if (!cells[0] || cells[0].textContent.trim() !== item.prodId) return;
      var newStock = Math.max(0, parseInt(cells[4].textContent) - item.qty);
      cells[4].textContent = newStock;
      var badge = cells[5] ? cells[5].querySelector('.badge') : null;
      if (badge) {
        if (newStock === 0)     { badge.className='badge badge-red';    badge.textContent='Out of Stock'; }
        else if(newStock <= 5)  { badge.className='badge badge-yellow'; badge.textContent='Low Stock'; }
        else                    { badge.className='badge badge-green';  badge.textContent='In Stock'; }
      }
    });
  });

  /* Add to walk-in history */
  var tbody = document.getElementById('walkinHistoryTable');
  if (tbody.querySelector('td[colspan]')) tbody.innerHTML = '';
  var tr = document.createElement('tr');
  tr.innerHTML = '<td>' + itemStr + '</td><td>Rs.' + total + '</td><td>' + method + '</td><td>' + now + '</td>';
  tbody.insertBefore(tr, tbody.firstChild);

  /* Update counters */
  walkinOrderCount++;
  walkinDayTotal += total;
  document.getElementById('walkinCount').textContent = walkinOrderCount + ' order' + (walkinOrderCount > 1 ? 's' : '') + ' today';
  document.getElementById('walkinDayTotal').textContent = 'Rs. ' + walkinDayTotal;

  /* Record to calendar */
  recordSaleToCalendar(items);

  showToast('Walk-in order saved! Stock updated.');

  /* Reset form */
  document.getElementById('walkinRows').innerHTML = '';
  walkinRowCount  = 0;
  walkinPayMethod = 'cash';
  setPayMethod('cash');
  updateBill();
  addWalkinRow();
}

/* Close dropdowns on outside click */
document.addEventListener('click', function(e) {
  document.querySelectorAll('.ac-dropdown.open').forEach(function(drop) {
    if (!drop.parentElement.contains(e.target)) drop.classList.remove('open');
  });
});

/* ══════════════════════════════════════════════════
   SALES CALENDAR  —  Google Calendar style
   3 views: day grid → month grid → year grid
   salesData["YYYY-MM-DD"] = [{name,qty,price,src}]
══════════════════════════════════════════════════ */
var salesData = {};
var calYear   = new Date().getFullYear();
var calMonth  = new Date().getMonth();
var calView   = 'day';
var calSelKey = null;

var MN  = ['January','February','March','April','May','June',
           'July','August','September','October','November','December'];
var MNS = ['Jan','Feb','Mar','Apr','May','Jun',
           'Jul','Aug','Sep','Oct','Nov','Dec'];

function initCalendar() {
  calYear  = new Date().getFullYear();
  calMonth = new Date().getMonth();
  calView  = 'day';
  renderCalendar();
  initMonthCal();
  initYearCal();
}

function calNav(dir) {
  if      (calView === 'day')   { calMonth += dir; if (calMonth > 11) { calMonth=0; calYear++; } else if (calMonth < 0) { calMonth=11; calYear--; } }
  else if (calView === 'month') { calYear  += dir; }
  else                          { calYear  += dir * 12; }
  renderCalendar();
}

function calHeaderClick() {
  if      (calView === 'day')   calView = 'month';
  else if (calView === 'month') calView = 'year';
  renderCalendar();
}

function renderCalendar() {
  if      (calView === 'day')   renderDayView();
  else if (calView === 'month') renderMonthView();
  else                          renderYearView();
}

/* ── DAY VIEW ── */
function renderDayView() {
  var hdr = document.getElementById('calMonthYear');
  hdr.innerHTML = '<span onclick="calHeaderClick()" style="cursor:pointer;text-decoration:underline;text-underline-offset:4px;">' + MN[calMonth] + ' ' + calYear + '</span>';

  /* show day-of-week headers */
  var dayHdrs = document.getElementById('calDayHeaders');
  if (dayHdrs) dayHdrs.style.display = 'grid';

  var grid    = document.getElementById('calGrid');
  var today   = new Date();
  var todayK  = dKey(today.getFullYear(), today.getMonth(), today.getDate());

  /* calculate cells */
  var first = new Date(calYear, calMonth, 1).getDay();
  first = (first === 0) ? 6 : first - 1;
  var daysInMo   = new Date(calYear, calMonth + 1, 0).getDate();
  var daysInPrev = new Date(calYear, calMonth, 0).getDate();

  var cells = [];
  for (var i = first - 1; i >= 0; i--) cells.push({ day: daysInPrev - i, cur: false });
  for (var d = 1; d <= daysInMo; d++)  cells.push({ day: d, cur: true });
  var rem = cells.length % 7;
  if (rem) for (var n = 1; n <= 7 - rem; n++) cells.push({ day: n, cur: false });

  grid.innerHTML = '';
  grid.style.gridTemplateColumns = 'repeat(7,1fr)';
  grid.style.gridAutoRows = '42px';

  cells.forEach(function(cell) {
    var div = document.createElement('div');
    div.className = 'cal-day';
    div.textContent = cell.day;
    if (!cell.cur) {
      div.classList.add('other-month');
      grid.appendChild(div);
      return;
    }
    var k = dKey(calYear, calMonth, cell.day);
    if (k === todayK)  div.classList.add('today');
    if (k === calSelKey) div.classList.add('selected');
    if (salesData[k] && salesData[k].length) div.classList.add('has-sales');
    div.onclick = (function(key) { return function() { calSelKey = key; renderCalendar(); showSalesDetail('day', key); }; })(k);
    grid.appendChild(div);
  });
}

/* ── MONTH VIEW ── */
function renderMonthView() {
  var hdr = document.getElementById('calMonthYear');
  hdr.innerHTML = '<span onclick="calHeaderClick()" style="cursor:pointer;text-decoration:underline;text-underline-offset:4px;">' + calYear + '</span>';

  var dayHdrs = document.getElementById('calDayHeaders');
  if (dayHdrs) dayHdrs.style.display = 'none';

  var grid  = document.getElementById('calGrid');
  grid.innerHTML = '';
  grid.style.gridTemplateColumns = 'repeat(4,1fr)';
  grid.style.gridAutoRows = '64px';

  var today = new Date();
  for (var m = 0; m < 12; m++) {
    (function(month) {
      var div = document.createElement('div');
      div.className = 'cal-day cal-month-cell';
      div.textContent = MNS[month];
      var k = calYear + '-' + String(month + 1).padStart(2,'0');
      if (calYear === today.getFullYear() && month === today.getMonth()) div.classList.add('today');
      if (k === calSelKey) div.classList.add('selected');
      var hasSales = Object.keys(salesData).some(function(x){ return x.startsWith(k); });
      if (hasSales) div.classList.add('has-sales');
      div.onclick = function() {
        calSelKey = k; calMonth = month; calView = 'day';
        renderCalendar();
        showSalesDetail('month', k);
      };
      grid.appendChild(div);
    })(m);
  }
}

/* ── YEAR VIEW ── */
function renderYearView() {
  var startYear = Math.floor(calYear / 12) * 12;
  var hdr = document.getElementById('calMonthYear');
  hdr.textContent = startYear + ' - ' + (startYear + 11);

  var dayHdrs = document.getElementById('calDayHeaders');
  if (dayHdrs) dayHdrs.style.display = 'none';

  var grid = document.getElementById('calGrid');
  grid.innerHTML = '';
  grid.style.gridTemplateColumns = 'repeat(4,1fr)';
  grid.style.gridAutoRows = '64px';

  var today = new Date();
  var years = [];
  for (var y = startYear - 2; y <= startYear + 13; y++) years.push(y);

  years.forEach(function(yr) {
    var div = document.createElement('div');
    div.className = 'cal-day cal-year-cell';
    div.textContent = yr;
    if (yr < startYear || yr > startYear + 11) div.classList.add('other-month');
    if (yr === today.getFullYear()) div.classList.add('today');
    if (String(yr) === calSelKey) div.classList.add('selected');
    var hasSales = Object.keys(salesData).some(function(x){ return x.startsWith(String(yr) + '-'); });
    if (hasSales) div.classList.add('has-sales');
    div.onclick = function() {
      calSelKey = String(yr); calYear = yr; calView = 'month';
      renderCalendar();
      showSalesDetail('year', String(yr));
    };
    grid.appendChild(div);
  });
}

/* ── DETAIL PANEL ── */
function showSalesDetail(type, key) {
  var label   = '';
  var entries = [];

  if (type === 'day') {
    var p = key.split('-');
    label = parseInt(p[2]) + ' ' + MN[parseInt(p[1]) - 1] + ' ' + p[0];
    entries = salesData[key] || [];
  } else if (type === 'month') {
    var p = key.split('-');
    label = MN[parseInt(p[1]) - 1] + ' ' + p[0];
    Object.keys(salesData).forEach(function(k){ if (k.startsWith(key)) entries = entries.concat(salesData[k]); });
  } else {
    label = key;
    Object.keys(salesData).forEach(function(k){ if (k.startsWith(key + '-')) entries = entries.concat(salesData[k]); });
  }

  document.getElementById('calDetailDate').textContent = label;

  if (!entries.length) {
    document.getElementById('calDetailSub').textContent = 'No sales recorded';
    document.getElementById('calDetailBody').innerHTML =
      '<div style="text-align:center;padding:32px 0;color:var(--muted);font-size:13px;font-weight:700;">No sales for this period</div>';
    document.getElementById('calDetailTotal').style.display = 'none';
    return;
  }

  /* aggregate by product */
  var aggr = {};
  entries.forEach(function(e) {
    if (!aggr[e.name]) aggr[e.name] = { qty:0, price:e.price, total:0 };
    aggr[e.name].qty   += e.qty;
    aggr[e.name].total += e.price * e.qty;
  });

  var names = Object.keys(aggr);
  document.getElementById('calDetailSub').textContent = names.length + ' product' + (names.length > 1 ? 's' : '') + ' sold';

  /* header row */
  var rows =
    '<div style="display:grid;grid-template-columns:1fr 60px 80px;gap:8px;padding:4px 12px 8px;border-bottom:1px solid var(--border);margin-bottom:8px;">' +
      '<span style="font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:0.8px;color:var(--muted);">Item</span>' +
      '<span style="font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:0.8px;color:var(--muted);text-align:center;">Qty</span>' +
      '<span style="font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:0.8px;color:var(--muted);text-align:right;">Earned</span>' +
    '</div>';

  var grandTotal = 0;
  names.forEach(function(name) {
    var a = aggr[name];
    grandTotal += a.total;
    rows +=
      '<div class="cal-product-row">' +
        '<span class="cal-product-name">' + name + '</span>' +
        '<span class="cal-product-qty">' + a.qty + '</span>' +
        '<span class="cal-product-amt">Rs. ' + a.total + '</span>' +
      '</div>';
  });

  document.getElementById('calDetailBody').innerHTML = rows;
  document.getElementById('calTotalAmt').textContent = 'Rs. ' + grandTotal;
  document.getElementById('calDetailTotal').style.display = 'flex';
}

/* ── HELPERS ── */
function dKey(y, m, d) {
  return y + '-' + String(m + 1).padStart(2,'0') + '-' + String(d).padStart(2,'0');
}

function recordSaleToCalendar(items) {
  var today = new Date();
  var key   = dKey(today.getFullYear(), today.getMonth(), today.getDate());
  if (!salesData[key]) salesData[key] = [];
  items.forEach(function(item) {
    salesData[key].push({ name:item.name, qty:item.qty, price:item.price, src:'walkin' });
  });
  if (document.getElementById('calGrid') && document.getElementById('calGrid').children.length) {
    renderCalendar();
    if (calSelKey === key) showSalesDetail('day', key);
  }
}

function recordOnlineOrder(items, dateStr) {
  var key = dateStr || dKey(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
  if (!salesData[key]) salesData[key] = [];
  items.forEach(function(item) {
    salesData[key].push({ name:item.name, qty:item.qty, price:item.price, src:'online' });
  });
  if (document.getElementById('calGrid') && document.getElementById('calGrid').children.length) {
    renderCalendar();
    if (calSelKey === key) showSalesDetail('day', key);
  }
}

/* ══════════════════════════════════════════
   MONTH CALENDAR — independent, never drills down
══════════════════════════════════════════ */
var mCalYear   = new Date().getFullYear();
var mCalSelKey = null;

function initMonthCal() {
  mCalYear = new Date().getFullYear();
  renderMonthCal();
}

function mCalNav(dir) {
  mCalYear += dir;
  renderMonthCal();
}

function renderMonthCal() {
  document.getElementById('mCalYear').textContent = mCalYear;
  var grid  = document.getElementById('mCalGrid');
  var today = new Date();
  grid.innerHTML = '';

  for (var m = 0; m < 12; m++) {
    (function(month) {
      var div = document.createElement('div');
      div.className = 'cal-day cal-month-cell';
      div.textContent = MNS[month];
      var k = mCalYear + '-' + String(month + 1).padStart(2,'0');
      if (mCalYear === today.getFullYear() && month === today.getMonth()) div.classList.add('today');
      if (k === mCalSelKey) div.classList.add('selected');
      var hasSales = Object.keys(salesData).some(function(x) { return x.startsWith(k); });
      if (hasSales) div.classList.add('has-sales');
      div.onclick = function() {
        mCalSelKey = k;
        renderMonthCal();
        showMonthDetail(k, month);
      };
      grid.appendChild(div);
    })(m);
  }
}

function showMonthDetail(key, month) {
  var label   = MN[month] + ' ' + mCalYear;
  var entries = [];
  Object.keys(salesData).forEach(function(k) {
    if (k.startsWith(key)) entries = entries.concat(salesData[k]);
  });
  document.getElementById('mCalDetailDate').textContent = label;
  if (!entries.length) {
    document.getElementById('mCalDetailSub').textContent  = 'No sales recorded';
    document.getElementById('mCalDetailBody').innerHTML   =
      '<div style="text-align:center;padding:32px 0;color:var(--muted);font-size:13px;font-weight:700;">No sales this month</div>';
    document.getElementById('mCalDetailTotal').style.display = 'none';
    return;
  }
  var aggr = {};
  entries.forEach(function(e) {
    if (!aggr[e.name]) aggr[e.name] = { qty:0, total:0 };
    aggr[e.name].qty   += e.qty;
    aggr[e.name].total += e.price * e.qty;
  });
  var names = Object.keys(aggr);
  document.getElementById('mCalDetailSub').textContent = names.length + ' product' + (names.length > 1 ? 's' : '') + ' sold';
  var rows =
    '<div style="display:grid;grid-template-columns:1fr 60px 80px;gap:8px;padding:4px 12px 8px;border-bottom:1px solid var(--border);margin-bottom:8px;">' +
      '<span style="font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:0.8px;color:var(--muted);">Item</span>' +
      '<span style="font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:0.8px;color:var(--muted);text-align:center;">Qty</span>' +
      '<span style="font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:0.8px;color:var(--muted);text-align:right;">Earned</span>' +
    '</div>';
  var grand = 0;
  names.forEach(function(name) {
    var a = aggr[name]; grand += a.total;
    rows += '<div class="cal-product-row"><span class="cal-product-name">' + name + '</span><span class="cal-product-qty">' + a.qty + '</span><span class="cal-product-amt">Rs. ' + a.total + '</span></div>';
  });
  document.getElementById('mCalDetailBody').innerHTML = rows;
  document.getElementById('mCalTotalAmt').textContent = 'Rs. ' + grand;
  document.getElementById('mCalDetailTotal').style.display = 'flex';
}

/* ══════════════════════════════════════════
   YEAR CALENDAR — independent, never drills down
══════════════════════════════════════════ */
var yCalStart  = Math.floor(new Date().getFullYear() / 12) * 12;
var yCalSelKey = null;

function initYearCal() {
  yCalStart = Math.floor(new Date().getFullYear() / 12) * 12;
  renderYearCal();
}

function yCalNav(dir) {
  yCalStart += dir * 12;
  renderYearCal();
}

function renderYearCal() {
  document.getElementById('yCalRange').textContent = yCalStart + ' - ' + (yCalStart + 11);
  var grid  = document.getElementById('yCalGrid');
  var today = new Date();
  grid.innerHTML = '';

  var years = [];
  for (var y = yCalStart - 2; y <= yCalStart + 13; y++) years.push(y);

  years.forEach(function(yr) {
    var div = document.createElement('div');
    div.className = 'cal-day cal-year-cell';
    div.textContent = yr;
    var inRange = (yr >= yCalStart && yr <= yCalStart + 11);
    if (!inRange) div.classList.add('other-month');
    if (yr === today.getFullYear()) div.classList.add('today');
    if (String(yr) === yCalSelKey) div.classList.add('selected');
    var hasSales = Object.keys(salesData).some(function(k) { return k.startsWith(String(yr) + '-'); });
    if (hasSales) div.classList.add('has-sales');
    div.onclick = function() {
      yCalSelKey = String(yr);
      renderYearCal();
      showYearDetail(String(yr));
    };
    grid.appendChild(div);
  });
}

function showYearDetail(year) {
  var entries = [];
  Object.keys(salesData).forEach(function(k) {
    if (k.startsWith(year + '-')) entries = entries.concat(salesData[k]);
  });
  document.getElementById('yCalDetailDate').textContent = year;
  if (!entries.length) {
    document.getElementById('yCalDetailSub').textContent  = 'No sales recorded';
    document.getElementById('yCalDetailBody').innerHTML   =
      '<div style="text-align:center;padding:32px 0;color:var(--muted);font-size:13px;font-weight:700;">No sales this year</div>';
    document.getElementById('yCalDetailTotal').style.display = 'none';
    return;
  }
  var aggr = {};
  entries.forEach(function(e) {
    if (!aggr[e.name]) aggr[e.name] = { qty:0, total:0 };
    aggr[e.name].qty   += e.qty;
    aggr[e.name].total += e.price * e.qty;
  });
  var names = Object.keys(aggr);
  document.getElementById('yCalDetailSub').textContent = names.length + ' product' + (names.length > 1 ? 's' : '') + ' sold';
  var rows =
    '<div style="display:grid;grid-template-columns:1fr 60px 80px;gap:8px;padding:4px 12px 8px;border-bottom:1px solid var(--border);margin-bottom:8px;">' +
      '<span style="font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:0.8px;color:var(--muted);">Item</span>' +
      '<span style="font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:0.8px;color:var(--muted);text-align:center;">Qty</span>' +
      '<span style="font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:0.8px;color:var(--muted);text-align:right;">Earned</span>' +
    '</div>';
  var grand = 0;
  names.forEach(function(name) {
    var a = aggr[name]; grand += a.total;
    rows += '<div class="cal-product-row"><span class="cal-product-name">' + name + '</span><span class="cal-product-qty">' + a.qty + '</span><span class="cal-product-amt">Rs. ' + a.total + '</span></div>';
  });
  document.getElementById('yCalDetailBody').innerHTML = rows;
  document.getElementById('yCalTotalAmt').textContent = 'Rs. ' + grand;
  document.getElementById('yCalDetailTotal').style.display = 'flex';
}