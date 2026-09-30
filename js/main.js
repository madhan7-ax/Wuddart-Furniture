/* Everything below is loaded live from the backend API (server/db.json),
   so edits made in /admin.html appear here after a refresh — no code changes needed. */
let SETTINGS = {}, CATS = [], PRODUCTS = [];

const wa = (t) => `https://wa.me/${SETTINGS.whatsappNumber}?text=${encodeURIComponent(t)}`;
const enquiryMsg = (name) => `Hello Wuddart Furniture, I am interested in ${name}. Please share the details, available designs and quotation.`;

function applySettings() {
  document.querySelectorAll('.wa-link').forEach(a => a.href = wa("Hello Wuddart Furniture, I would like to enquire about your furniture. Please share the details and available designs."));
  document.querySelectorAll('.map-link').forEach(a => a.href = SETTINGS.googleMapsUrl);
  document.querySelectorAll('.ig-link').forEach(a => a.href = SETTINGS.instagramUrl || "https://www.instagram.com/wuddart_furniture/");
  document.querySelectorAll('.fb-link').forEach(a => a.href = SETTINGS.facebookUrl || "https://www.facebook.com/share/19MLnE3qvf/");
  document.querySelectorAll('.call-link').forEach(a => a.href = 'tel:+' + (SETTINGS.phone1 || '9544469369').replace(/\D/g, ''));
  const set = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };
  set('tagline', SETTINGS.tagline);
  set('subtext', SETTINGS.subtext);
  set('contactstrip', `${SETTINGS.phone1} &nbsp;|&nbsp; ${SETTINGS.phone2}`);
  const warH = (SETTINGS.warrantyHeadline || '10 YEARS REPLACEMENT WARRANTY')
    .replace(/\b10\b/, '<span class="war-10">10</span>')
    .replace(/\n/g, '<br>')
    .replace(' REPLACEMENT', '<br>REPLACEMENT');
  set('warH', warH);
  set('warSub', SETTINGS.warrantySubline);
  set('warText', SETTINGS.warrantyText);
  if (SETTINGS.freeDelivery) {
    const dEl = document.getElementById('warDeliveryTxt');
    if (dEl) dEl.textContent = SETTINGS.freeDelivery;
  }
  set('phone1Ct', SETTINGS.phone1); document.getElementById('phone1Ct').href = 'tel:+' + SETTINGS.phone1.replace(/\D/g,'');
  set('phone2Ct', SETTINGS.phone2); document.getElementById('phone2Ct').href = 'tel:+' + SETTINGS.phone2.replace(/\D/g,'');
  set('emailCt', SETTINGS.email); document.getElementById('emailCt').href = 'mailto:' + SETTINGS.email;
  const mapEl = document.getElementById('mapEmbed');
  if (mapEl) mapEl.src = `https://maps.google.com/maps?q=${SETTINGS.googleMapsEmbedLat},${SETTINGS.googleMapsEmbedLng}&z=16&output=embed`;
}

function renderCats() {
  document.getElementById('cats').innerHTML = CATS.map(c =>
    `<a class="cat" href="#collection" data-c="${c.name}"><img src="${c.image}" alt="${c.name}" loading="lazy"><span>${c.name}</span></a>`
  ).join('');
}

let curCat = "All";
function renderChips() {
  const names = ["All", ...CATS.map(c => c.name)];
  document.getElementById('chips').innerHTML = names.map(n =>
    `<button class="chip ${n === curCat ? 'on' : ''}" data-c="${n}">${n}</button>`
  ).join('');
}
function renderGrid() {
  const list = curCat === "All" ? PRODUCTS : PRODUCTS.filter(p => p.category === curCat);
  document.getElementById('grid').innerHTML = list.map(p => {
    const m = wa(enquiryMsg(p.name));
    const status = p.status === 'Out of Stock' ? ' · Out of Stock' : '';
    return `<article class="card"><div class="ph"><img src="${p.image}" alt="${p.name}" loading="lazy"></div><div class="bd"><small>${p.category}${status}</small><h3>${p.name}</h3><p>${p.description || ''}</p><div class="row"><a class="btn b-dark" href="${m}" target="_blank" rel="noopener">View Details</a><a class="btn b-wa" href="${m}" target="_blank" rel="noopener">Enquire Now</a></div></div></article>`;
  }).join('') || '<p style="grid-column:1/-1;color:#6b5648">No products in this category yet.</p>';
}
function setCat(c) { curCat = c; renderChips(); renderGrid(); }

function renderGallery() {
  const pick = PRODUCTS.slice(0, 8);
  document.getElementById('mas').innerHTML = pick.map(p =>
    `<a class="g" href="#collection"><img src="${p.image}" alt="${p.name}" loading="lazy"><span>${p.name}</span></a>`
  ).join('');
}

async function init() {
  const [s, c, p] = await Promise.all([
    fetch('/api/settings').then(r => r.json()),
    fetch('/api/categories').then(r => r.json()),
    fetch('/api/products').then(r => r.json()),
  ]);
  SETTINGS = s; CATS = c; PRODUCTS = p;
  applySettings();
  renderCats();
  renderChips();
  renderGrid();
  renderGallery();
  document.getElementById('chips').addEventListener('click', e => { const b = e.target.closest('.chip'); if (b) setCat(b.dataset.c); });
  document.getElementById('cats').addEventListener('click', e => { const a = e.target.closest('.cat'); if (a) setCat(a.dataset.c); });
}
document.querySelectorAll('nav a').forEach(a => a.addEventListener('click', () => document.getElementById('nav').classList.remove('open')));
init().catch(err => console.error('Failed to load site data from the API:', err));
