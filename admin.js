let KEY = localStorage.getItem('wuddart_admin_key') || '';
let CATS = [], PRODUCTS = [];

function headers(json) { const h = { 'x-admin-key': KEY }; if (json) h['Content-Type'] = 'application/json'; return h; }

async function signIn() {
  KEY = document.getElementById('keyInput').value.trim();
  // verify the key with a no-op settings update (server checks x-admin-key before writing anything)
  const check = await fetch('/api/settings', { method: 'PUT', headers: headers(true), body: '{}' });
  if (check.status === 401) { document.getElementById('gateMsg').textContent = 'Incorrect admin key.'; return; }
  localStorage.setItem('wuddart_admin_key', KEY);
  document.getElementById('gate').style.display = 'none';
  document.getElementById('app').style.display = 'block';
  boot();
}
function signOut() { localStorage.removeItem('wuddart_admin_key'); location.reload(); }
if (KEY) { document.getElementById('gate').style.display = 'none'; document.getElementById('app').style.display = 'block'; boot(); }

document.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => {
  document.querySelectorAll('.tab').forEach(x => x.classList.remove('on'));
  document.querySelectorAll('.panel').forEach(x => x.classList.remove('on'));
  t.classList.add('on');
  document.getElementById('panel-' + t.dataset.tab).classList.add('on');
}));

function closeModal() { document.getElementById('modalBg').classList.remove('on'); document.getElementById('modalBody').innerHTML = ''; }

// ---------- Products ----------
async function loadProducts() {
  PRODUCTS = await fetch('/api/products').then(r => r.json());
  document.getElementById('productsBody').innerHTML = PRODUCTS.map(p => `
    <tr><td><img src="${p.image}"></td><td>${p.name}</td><td>${p.category}</td><td>${p.status}</td>
    <td class="row-actions"><button class="btn secondary" onclick='openProductModal(${JSON.stringify(p).replace(/'/g,"&apos;")})'>Edit</button>
    <button class="btn danger" onclick="deleteProduct('${p.id}')">Delete</button></td></tr>`).join('');
}
function openProductModal(p) {
  const catOpts = CATS.map(c => `<option ${p && p.category === c.name ? 'selected' : ''}>${c.name}</option>`).join('');
  document.getElementById('modalBody').innerHTML = `
    <h3>${p ? 'Edit Product' : 'Add Product'}</h3>
    <form id="pForm">
      <div class="field"><label>Name</label><input name="name" required value="${p ? p.name : ''}"></div>
      <div class="field"><label>Category</label><select name="category">${catOpts}</select></div>
      <div class="field"><label>Description</label><textarea name="description">${p ? p.description || '' : ''}</textarea></div>
      <div class="field"><label>Status</label><select name="status"><option ${!p || p.status==='Available'?'selected':''}>Available</option><option ${p && p.status==='Out of Stock'?'selected':''}>Out of Stock</option></select></div>
      <div class="field"><label>Photo${p ? ' (leave empty to keep current)' : ''}</label><input type="file" name="image" accept="image/*"></div>
      <div class="actions"><button type="button" class="btn secondary" onclick="closeModal()">Cancel</button><button class="btn">${p ? 'Save' : 'Add'}</button></div>
    </form>`;
  document.getElementById('modalBg').classList.add('on');
  document.getElementById('pForm').onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const url = p ? `/api/products/${p.id}` : '/api/products';
    await fetch(url, { method: p ? 'PUT' : 'POST', headers: headers(false), body: fd });
    closeModal(); loadProducts();
  };
}
async function deleteProduct(id) {
  if (!confirm('Delete this product?')) return;
  await fetch(`/api/products/${id}`, { method: 'DELETE', headers: headers(false) });
  loadProducts();
}

// ---------- Categories ----------
async function loadCategories() {
  CATS = await fetch('/api/categories').then(r => r.json());
  document.getElementById('categoriesBody').innerHTML = CATS.map(c => `
    <tr><td><img src="${c.image}"></td><td>${c.name}</td>
    <td class="row-actions"><button class="btn secondary" onclick='openCategoryModal(${JSON.stringify(c).replace(/'/g,"&apos;")})'>Edit</button>
    <button class="btn danger" onclick="deleteCategory('${c.id}')">Delete</button></td></tr>`).join('');
}
function openCategoryModal(c) {
  document.getElementById('modalBody').innerHTML = `
    <h3>${c ? 'Edit Category' : 'Add Category'}</h3>
    <form id="cForm">
      <div class="field"><label>Name</label><input name="name" required value="${c ? c.name : ''}"></div>
      <div class="field"><label>Photo${c ? ' (leave empty to keep current)' : ''}</label><input type="file" name="image" accept="image/*"></div>
      <div class="actions"><button type="button" class="btn secondary" onclick="closeModal()">Cancel</button><button class="btn">${c ? 'Save' : 'Add'}</button></div>
    </form>`;
  document.getElementById('modalBg').classList.add('on');
  document.getElementById('cForm').onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const url = c ? `/api/categories/${c.id}` : '/api/categories';
    await fetch(url, { method: c ? 'PUT' : 'POST', headers: headers(false), body: fd });
    closeModal(); loadCategories(); loadProducts();
  };
}
async function deleteCategory(id) {
  if (!confirm('Delete this category? Products already assigned to it will keep their category label.')) return;
  await fetch(`/api/categories/${id}`, { method: 'DELETE', headers: headers(false) });
  loadCategories();
}

// ---------- Settings ----------
const SETTINGS_FIELDS = [
  ['businessName', 'Business Name'], ['tagline', 'Homepage Tagline'], ['subtext', 'Homepage Subtext'],
  ['whatsappNumber', 'WhatsApp Number (with country code, digits only)'],
  ['phone1', 'Phone 1'], ['phone2', 'Phone 2'], ['email', 'Email'],
  ['address', 'Address', true], ['googleMapsUrl', 'Google Maps URL', true],
  ['instagramUrl', 'Instagram URL'],
  ['facebookUrl', 'Facebook URL'],
  ['freeDelivery', 'Delivery Offer (e.g. Free Delivery All Over Tamil Nadu)'],
  ['warrantyHeadline', 'Warranty Headline'], ['warrantySubline', 'Warranty Subline'], ['warrantyText', 'Warranty Supporting Text', true],
];
let SETTINGS = {};
async function loadSettings() {
  SETTINGS = await fetch('/api/settings').then(r => r.json());
  document.getElementById('settingsForm').innerHTML = SETTINGS_FIELDS.map(([key, label, full]) =>
    `<div class="field ${full ? 'full' : ''}"><label>${label}</label><input data-key="${key}" value="${(SETTINGS[key] || '').toString().replace(/"/g,'&quot;')}"></div>`
  ).join('');
}
async function saveSettings() {
  const body = {};
  document.querySelectorAll('#settingsForm [data-key]').forEach(i => body[i.dataset.key] = i.value);
  const res = await fetch('/api/settings', { method: 'PUT', headers: headers(true), body: JSON.stringify(body) });
  const msg = document.getElementById('settingsMsg');
  if (res.ok) { msg.textContent = 'Saved. Refresh the live site to see the changes.'; msg.className = 'msg ok'; }
  else { msg.textContent = 'Could not save settings.'; msg.className = 'msg err'; }
}

function boot() { loadCategories().then(loadProducts); loadSettings(); }
