/* Wuddart Furniture — Client Behaviour
   Includes full offline/deployment fallbacks so categories, products, and
   settings ALWAYS display on any deployment platform (Vercel, Netlify,
   GitHub Pages, Render, VPS, or static file hosting).
   When the Express API is live, it automatically syncs fresh updates. */

const DEFAULT_SETTINGS = {
  businessName: "Wuddart Furniture",
  tagline: "Your Dream Space Starts with the Perfect Furniture",
  subtext: "Timeless teakwood furniture that blends tradition, strength, and modern living.",
  whatsappNumber: "919544469369",
  phone1: "9544469369",
  phone2: "9544823302",
  email: "wuddartfurniture@gmail.com",
  address: "Kannan Complex, Eswar Covil Street, Uthukuli, Tirupur – 638752, Tamil Nadu, India",
  googleMapsUrl: "https://www.google.com/maps/place/Wuddart+furniture/@11.1706027,77.4487932,17z/data=!4m7!3m6!1s0x3ba90f9e9d1311ef:0xfe6ebd28b1f62fb0!4b1!8m2!3d11.1706027!4d77.4513681!16s%2Fg%2F11yyhn3d92",
  googleMapsEmbedLat: "11.1706027",
  googleMapsEmbedLng: "77.4513681",
  instagramUrl: "https://www.instagram.com/wuddart_furniture/",
  facebookUrl: "https://www.facebook.com/share/19MLnE3qvf/",
  freeDelivery: "Free Delivery All Over Tamil Nadu",
  warrantyHeadline: "10 YEARS REPLACEMENT WARRANTY",
  warrantySubline: "LIFETIME SERVICE WARRANTY",
  warrantyText: "Designed for generations. Supported for life."
};

const DEFAULT_CATS = [
  { id: "living-room", name: "Living Room Furniture", image: "images/cat-living.jpg" },
  { id: "bedroom", name: "Bedroom Furniture", image: "images/cat-bedroom.jpg" },
  { id: "storage", name: "Storage Solutions", image: "images/cat-storage.jpg" },
  { id: "teak-windows", name: "Teakwood Windows", image: "images/cat-teakwindows.jpg" },
  { id: "louvered-windows", name: "Louvered Windows", image: "images/cat-louvered.jpg" },
  { id: "teak-doors", name: "Teakwood Doors", image: "images/cat-teakdoors.jpg" },
  { id: "french-doors", name: "French Doors", image: "images/cat-french.jpg" },
  { id: "corner-sofas", name: "Corner Sofas", image: "images/cat-corner.jpg" },
  { id: "kitchen", name: "Kitchen Furniture", image: "images/cat-kitchen.jpg" }
];

const DEFAULT_PRODUCTS = [
  { id: "p001", name: "Teakwood Sofa Set with Centre Table", category: "Living Room Furniture", description: "Solid teakwood frame with cushioned seating.", image: "images/p-living3.jpg", status: "Available" },
  { id: "p002", name: "Teakwood Lounge Seating", category: "Living Room Furniture", description: "Warm carved teakwood seating for the living room.", image: "images/p-living2.jpg", status: "Available" },
  { id: "p003", name: "Carved Teakwood Bed", category: "Bedroom Furniture", description: "Panelled headboard and footboard in a rich teak finish.", image: "images/p-bed2.jpg", status: "Available" },
  { id: "p004", name: "Storage Bed with Bedside Tables", category: "Bedroom Furniture", description: "Classic teakwood bed with built-in storage.", image: "images/p-bed4.jpg", status: "Available" },
  { id: "p005", name: "Modern Platform Bed", category: "Bedroom Furniture", description: "Clean low-profile teakwood design.", image: "images/p-bed3.jpg", status: "Available" },
  { id: "p006", name: "Teakwood Bedroom Wardrobe", category: "Bedroom Furniture", description: "Multi-door wardrobe with drawers.", image: "images/p-wardrobe1.jpg", status: "Available" },
  { id: "p007", name: "Sliding Door Wardrobe", category: "Storage Solutions", description: "Full-height sliding wardrobe with open shelves.", image: "images/p-storage2.jpg", status: "Available" },
  { id: "p008", name: "Three-Door Wardrobe", category: "Storage Solutions", description: "Timeless wardrobe with drawers below.", image: "images/p-storage3.jpg", status: "Out of Stock" },
  { id: "p009", name: "Herringbone Teakwood Door", category: "Teakwood Doors", description: "Pattern-laid panel with a long pull handle.", image: "images/p-door2.jpg", status: "Available" },
  { id: "p010", name: "Panelled Main Door", category: "Teakwood Doors", description: "Traditional raised-panel teakwood door.", image: "images/p-door3.jpg", status: "Available" },
  { id: "p011", name: "Louvered Teakwood Shutters", category: "Teakwood Windows", description: "Adjustable louvre shutters in teakwood.", image: "images/p-win1.jpg", status: "Available" },
  { id: "p012", name: "Traditional Kerala Window", category: "Teakwood Windows", description: "Turned balusters and detailed frame.", image: "images/p-win2.jpg", status: "Available" },
  { id: "p013", name: "Glazed Teakwood French Doors", category: "French Doors", description: "Double doors with glass panes.", image: "images/p-french2.jpg", status: "Available" },
  { id: "p014", name: "L-Shaped Corner Sofa", category: "Corner Sofas", description: "Spacious corner seating for family living.", image: "images/p-corner2.jpg", status: "Available" },
  { id: "p015", name: "U-Shaped Sectional Sofa", category: "Corner Sofas", description: "Generous seating with a central coffee table.", image: "images/p-corner3.jpg", status: "Available" },
  { id: "p016", name: "Teakwood Kitchen Cabinets", category: "Kitchen Furniture", description: "Raised-panel cabinetry with glass-front units.", image: "images/p-kit3.jpg", status: "Available" }
];

let SETTINGS = { ...DEFAULT_SETTINGS };
let CATS = [...DEFAULT_CATS];
let PRODUCTS = [...DEFAULT_PRODUCTS];
let curCat = "All";

// Ensure image paths resolve correctly whether hosted at root, subpath, or CDN
function fixImg(src) {
  if (!src) return '';
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) return src;
  return src.replace(/^\/+/, '');
}

const wa = (t) => `https://wa.me/${SETTINGS.whatsappNumber || '919544469369'}?text=${encodeURIComponent(t)}`;
const enquiryMsg = (name) => `Hello Wuddart Furniture, I am interested in ${name}. Please share the details, available designs and quotation.`;

function applySettings() {
  document.querySelectorAll('.wa-link').forEach(a => a.href = wa("Hello Wuddart Furniture, I would like to enquire about your furniture. Please share the details and available designs."));
  document.querySelectorAll('.map-link').forEach(a => a.href = SETTINGS.googleMapsUrl || DEFAULT_SETTINGS.googleMapsUrl);
  document.querySelectorAll('.ig-link').forEach(a => a.href = SETTINGS.instagramUrl || DEFAULT_SETTINGS.instagramUrl);
  document.querySelectorAll('.fb-link').forEach(a => a.href = SETTINGS.facebookUrl || DEFAULT_SETTINGS.facebookUrl);
  document.querySelectorAll('.call-link').forEach(a => a.href = 'tel:+' + (SETTINGS.phone1 || '9544469369').replace(/\D/g, ''));

  const set = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };
  set('tagline', SETTINGS.tagline || DEFAULT_SETTINGS.tagline);
  set('subtext', SETTINGS.subtext || DEFAULT_SETTINGS.subtext);
  set('contactstrip', `${SETTINGS.phone1 || '9544469369'} &nbsp;|&nbsp; ${SETTINGS.phone2 || '9544823302'}`);

  const rawWar = SETTINGS.warrantyHeadline || DEFAULT_SETTINGS.warrantyHeadline;
  const warH = rawWar
    .replace(/\b10\b/, '<span class="war-10">10</span>')
    .replace(/\n/g, '<br>')
    .replace(' REPLACEMENT', '<br>REPLACEMENT');
  set('warH', warH);
  set('warSub', SETTINGS.warrantySubline || DEFAULT_SETTINGS.warrantySubline);
  set('warText', SETTINGS.warrantyText || DEFAULT_SETTINGS.warrantyText);

  const deliveryTxt = SETTINGS.freeDelivery || DEFAULT_SETTINGS.freeDelivery;
  const dEl = document.getElementById('warDeliveryTxt');
  if (dEl) dEl.textContent = deliveryTxt;

  set('phone1Ct', SETTINGS.phone1 || DEFAULT_SETTINGS.phone1);
  const p1El = document.getElementById('phone1Ct');
  if (p1El) p1El.href = 'tel:+' + (SETTINGS.phone1 || '9544469369').replace(/\D/g, '');

  set('phone2Ct', SETTINGS.phone2 || DEFAULT_SETTINGS.phone2);
  const p2El = document.getElementById('phone2Ct');
  if (p2El) p2El.href = 'tel:+' + (SETTINGS.phone2 || '9544823302').replace(/\D/g, '');

  set('emailCt', SETTINGS.email || DEFAULT_SETTINGS.email);
  const emEl = document.getElementById('emailCt');
  if (emEl) emEl.href = 'mailto:' + (SETTINGS.email || DEFAULT_SETTINGS.email);

  const mapEl = document.getElementById('mapEmbed');
  if (mapEl) {
    const lat = SETTINGS.googleMapsEmbedLat || DEFAULT_SETTINGS.googleMapsEmbedLat;
    const lng = SETTINGS.googleMapsEmbedLng || DEFAULT_SETTINGS.googleMapsEmbedLng;
    mapEl.src = `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`;
  }
}

function renderCats() {
  const el = document.getElementById('cats');
  if (!el) return;
  el.innerHTML = CATS.map(c =>
    `<a class="cat" href="#collection" data-c="${c.name}"><img src="${fixImg(c.image)}" alt="${c.name}" loading="lazy"><span>${c.name}</span></a>`
  ).join('');
}

function renderChips() {
  const el = document.getElementById('chips');
  if (!el) return;
  const names = ["All", ...CATS.map(c => c.name)];
  el.innerHTML = names.map(n =>
    `<button class="chip ${n === curCat ? 'on' : ''}" data-c="${n}">${n}</button>`
  ).join('');
}

function renderGrid() {
  const el = document.getElementById('grid');
  if (!el) return;
  const list = curCat === "All" ? PRODUCTS : PRODUCTS.filter(p => p.category === curCat);
  el.innerHTML = list.map(p => {
    const m = wa(enquiryMsg(p.name));
    const status = p.status === 'Out of Stock' ? ' · Out of Stock' : '';
    return `<article class="card"><div class="ph"><img src="${fixImg(p.image)}" alt="${p.name}" loading="lazy"></div><div class="bd"><small>${p.category}${status}</small><h3>${p.name}</h3><p>${p.description || ''}</p><div class="row"><a class="btn b-dark" href="${m}" target="_blank" rel="noopener">View Details</a><a class="btn b-wa" href="${m}" target="_blank" rel="noopener">Enquire Now</a></div></div></article>`;
  }).join('') || '<p style="grid-column:1/-1;color:#6b5648">No products in this category yet.</p>';
}

function setCat(c) {
  curCat = c;
  renderChips();
  renderGrid();
}

function renderGallery() {
  const el = document.getElementById('mas');
  if (!el) return;
  const pick = PRODUCTS.slice(0, 8);
  el.innerHTML = pick.map(p =>
    `<a class="g" href="#collection"><img src="${fixImg(p.image)}" alt="${p.name}" loading="lazy"><span>${p.name}</span></a>`
  ).join('');
}

// Fetch helper with fallback: never crashes on static/serverless deployment
async function fetchSafe(url, fallback) {
  try {
    const res = await fetch(url);
    if (!res.ok) return fallback;
    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) return fallback;
    const data = await res.json();
    return Array.isArray(fallback) && !Array.isArray(data) ? fallback : data;
  } catch (e) {
    return fallback;
  }
}

async function init() {
  // 1. Immediately render fallback data so site is 100% visible on load with zero blank flash
  applySettings();
  renderCats();
  renderChips();
  renderGrid();
  renderGallery();

  // Attach interactive listeners
  const chipsEl = document.getElementById('chips');
  if (chipsEl && !chipsEl._bound) {
    chipsEl._bound = true;
    chipsEl.addEventListener('click', e => {
      const b = e.target.closest('.chip');
      if (b) setCat(b.dataset.c);
    });
  }

  const catsEl = document.getElementById('cats');
  if (catsEl && !catsEl._bound) {
    catsEl._bound = true;
    catsEl.addEventListener('click', e => {
      const a = e.target.closest('.cat');
      if (a) setCat(a.dataset.c);
    });
  }

  // 2. Fetch live data from backend API if available, updating seamlessly
  try {
    const [s, c, p] = await Promise.all([
      fetchSafe('/api/settings', DEFAULT_SETTINGS),
      fetchSafe('/api/categories', DEFAULT_CATS),
      fetchSafe('/api/products', DEFAULT_PRODUCTS)
    ]);
    SETTINGS = { ...DEFAULT_SETTINGS, ...s };
    if (Array.isArray(c) && c.length) CATS = c;
    if (Array.isArray(p) && p.length) PRODUCTS = p;

    // Re-render with any fresh data from the server
    applySettings();
    renderCats();
    renderChips();
    renderGrid();
    renderGallery();
  } catch (err) {
    console.log("Running in static/fallback mode:", err);
  }
}

document.querySelectorAll('nav a').forEach(a => {
  a.addEventListener('click', () => {
    const nav = document.getElementById('nav');
    if (nav) nav.classList.remove('open');
  });
});

init();
