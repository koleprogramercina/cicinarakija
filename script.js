/* ================================================================
   ČIČINA RAKIJA — script.js  v2.0
   Nav, hero parallax, scroll reveal, cart, checkout, lightbox
================================================================ */
'use strict';

/* ──────────────────────────── PRODUCTS DATA ────────────────────── */
const PRODUCTS = [
  { id:'lozovaca', name:'LOZOVAČA',
    desc:'Čista i osvežavajuća rakija od najfinijeg sremskog grožđa. Bakarni kotao garantuje savršen ukus i aromu.',
    img:'lozovaca.png', alc:'19%', method:'Bakarni kotao',
    badge:'Najprodavanije', premium:false,
    prices:{'0.5 L':310,'1 L':575} },
  { id:'sljivovica', name:'ŠLJIVOVICA',
    desc:'Kraljica srpske rakije. Destilisana od najfinijih sremskih šljiva. Bogat ukus sa notama suve šljive.',
    img:'sljivovica.png', alc:'19%', method:'Bakarni kotao',
    badge:null, premium:false,
    prices:{'0.5 L':80,'1 L':575} },
  { id:'sljivovica-prepecena', name:'PREPEČENICA',
    desc:'Dvostruko destilisana šljivovica za one koji cene snagu i karakter. Intenzivna aroma, dugi završetak.',
    img:'', alc:'40%+', method:'Dvostruka destilacija',
    badge:'Premium', premium:true,
    prices:{'1 L':670} },
  { id:'travarica', name:'TRAVARICA',
    desc:'Aromatična rakija sa biljnim dodacima po staroj recepturi. Savršena digestivna rakija sa prepoznatljivim biljnim karakterom.',
    img:'', alc:'40%', method:'Biljni ekstrakt',
    badge:null, premium:false,
    prices:{'0.5 L':85,'1 L':320} },
  { id:'lozovaca-01', name:'LOZOVAČA MINI',
    desc:'Ista vrhunska lozovača u manjoj flašici. Idealna kao poklon ili za kušanje.',
    img:'', alc:'19%', method:'Bakarni kotao',
    badge:null, premium:false,
    prices:{'0.1 L':290} },
  { id:'vodka', name:'ČIČINA VODKA',
    desc:'Domaća vodka vrhunskog kvaliteta. Trostruko filtrirana za kristalnu čistoću i mekan ukus.',
    img:'', alc:'40%', method:'Trostruka filtracija',
    badge:null, premium:false,
    prices:{'0.1 L':1421,'0.5 L':310} },
  { id:'palinkovac', name:'PALINKOVAC',
    desc:'Kajsijevača iz domaćih kajsija. Senzualna aroma i mek ukus koji osvaja na prvom gutljaju.',
    img:'', alc:'40%', method:'Tradicionalna metoda',
    badge:null, premium:false,
    prices:{'0.5 L':380} }
];

/* ──────────────────────────── STATE ────────────────────────────── */
let cart = [];
try { cart = JSON.parse(localStorage.getItem('cr_cart') || '[]'); } catch(e){}
let checkoutStep = 1;
let toastTimer = null;
const galleryImages = [];

/* ──────────────────────────── UTILS ────────────────────────────── */
const $  = id  => document.getElementById(id);
const qs = sel => document.querySelector(sel);
const qsa= sel => document.querySelectorAll(sel);
function fmt(n){ return n.toLocaleString('sr-RS') + ' RSD'; }
function saveCart(){ try{ localStorage.setItem('cr_cart', JSON.stringify(cart)); }catch(e){} }

/* ──────────────────────────── AGE GATE ─────────────────────────── */
(function(){
  const gate = $('ageGate');
  if(!gate) return;
  if(localStorage.getItem('cr_age')==='1'){ gate.classList.add('hidden'); return; }
  const yes = $('ageYes'), no = $('ageNo');
  if(yes) yes.addEventListener('click', () => {
    localStorage.setItem('cr_age','1');
    gate.classList.add('fade-out');
    setTimeout(() => gate.classList.add('hidden'), 700);
  });
  if(no) no.addEventListener('click', () => { window.location.href='https://www.google.com'; });
})();

/* ──────────────────────────── NAV ──────────────────────────────── */
(function(){
  const navbar = $('navbar');
  const progress = $('navProgress');
  const hamburger = $('hamburger');
  const navLinks = $('navLinks');
  if(!navbar) return;

  // Ensure nav overlay exists
  let overlay = qs('.nav-overlay');
  if(!overlay){
    overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);
  }

  function onScroll(){
    navbar.classList.toggle('scrolled', window.scrollY > 55);
    if(progress){
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (max > 0 ? window.scrollY/max*100 : 0) + '%';
    }
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  function openMenu(){
    hamburger && hamburger.classList.add('open');
    navLinks  && navLinks.classList.add('open');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu(){
    hamburger && hamburger.classList.remove('open');
    navLinks  && navLinks.classList.remove('open');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  if(hamburger) hamburger.addEventListener('click', () => {
    navLinks && navLinks.classList.contains('open') ? closeMenu() : openMenu();
  });
  overlay.addEventListener('click', closeMenu);
  qsa('.nav-link').forEach(l => l.addEventListener('click', closeMenu));
})();

/* ──────────────────────────── HERO PARALLAX ────────────────────── */
(function(){
  const heroBg = qs('.hero-parallax');
  if(!heroBg) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if(y < window.innerHeight * 1.5)
      heroBg.style.transform = `translateY(${y * 0.28}px) scale(1.06)`;
  }, {passive:true});
})();

/* ──────────────────────────── HERO REVEAL ──────────────────────── */
(function(){
  qsa('.reveal-hero').forEach(el => {
    const delay = parseInt(el.dataset.delay) || 0;
    setTimeout(() => el.classList.add('visible'), delay + 180);
  });
})();

/* ──────────────────────────── SCROLL REVEAL ────────────────────── */
(function(){
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting){
        const delay = parseInt(e.target.dataset.delay) || 0;
        setTimeout(() => e.target.classList.add('visible'), delay);
        obs.unobserve(e.target);
      }
    });
  }, { threshold:0.09, rootMargin:'0px 0px -40px 0px' });

  const ruleObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting){ e.target.classList.add('visible'); ruleObs.unobserve(e.target); }
    });
  }, { threshold:0.4 });

  qsa('.reveal').forEach(el => obs.observe(el));
  qsa('.sec-rule').forEach(el => ruleObs.observe(el));
})();

/* ──────────────────────────── RENDER PRODUCTS ──────────────────── */
function renderProducts(containerId, filterFn){
  const grid = $(containerId);
  if(!grid) return;
  const list = filterFn ? PRODUCTS.filter(filterFn) : PRODUCTS;

  grid.innerHTML = list.map(p => {
    const sizes = Object.keys(p.prices);
    const firstSize  = sizes[0];
    const firstPrice = p.prices[firstSize];

    const imgHtml = p.img
      ? `<img src="${p.img}" alt="Čičina rakija ${p.name} – domaća rakija Kukujevci Srem" loading="lazy">`
      : `<div class="product-placeholder"><i class="fas fa-wine-bottle"></i><span>Slika uskoro</span></div>`;

    const badgeHtml = p.badge
      ? `<div class="product-badge${p.premium ? ' premium-badge':''}">${p.badge}</div>` : '';

    const sizeBtns = sizes.map((s,i) =>
      `<button class="size-btn${i===0?' active':''}" data-size="${s}" data-price="${p.prices[s]}" data-product="${p.id}"><span>${s}</span></button>`
    ).join('');

    return `<div class="product-card reveal" data-product-id="${p.id}">
  <div class="product-img-wrap">${imgHtml}${badgeHtml}</div>
  <div class="product-info">
    <div class="product-name">${p.name}</div>
    <div class="product-meta">
      <span class="product-alc">${p.alc} alc.</span>
      <span class="product-method">${p.method}</span>
    </div>
    <p class="product-desc">${p.desc}</p>
    <div class="product-sizes">
      <span class="size-label">ODABERITE VELIČINU</span>
      <div class="size-opts">${sizeBtns}</div>
    </div>
    <div class="product-footer">
      <div class="product-price" id="price-${p.id}">${fmt(firstPrice)}</div>
      <button class="btn-add" data-id="${p.id}" data-size="${firstSize}" data-price="${firstPrice}">
        <i class="fas fa-shopping-bag"></i><span>Dodaj</span>
      </button>
    </div>
  </div>
</div>`;
  }).join('');

  // Re-observe newly rendered cards
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold:0.07 });
  qsa(`#${containerId} .product-card.reveal`).forEach(el => obs.observe(el));

  // Delegated click handlers
  grid.addEventListener('click', e => {
    // Size btn
    const sb = e.target.closest('.size-btn');
    if(sb){
      const card = sb.closest('.product-card');
      card.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
      sb.classList.add('active');
      const pid   = sb.dataset.product;
      const price = +sb.dataset.price;
      const size  = sb.dataset.size;
      const priceEl = $('price-'+pid);
      if(priceEl) priceEl.textContent = fmt(price);
      const addBtn = card.querySelector('.btn-add');
      if(addBtn){ addBtn.dataset.size=size; addBtn.dataset.price=price; }
      return;
    }
    // Add to cart
    const ab = e.target.closest('.btn-add');
    if(ab){
      const prod = PRODUCTS.find(p => p.id===ab.dataset.id);
      if(prod) addToCart(prod, ab.dataset.size, +ab.dataset.price);
    }
  });
}

/* ──────────────────────────── CART ─────────────────────────────── */
function addToCart(product, size, price){
  const ex = cart.find(i => i.id===product.id && i.size===size);
  if(ex) ex.qty++;
  else   cart.push({id:product.id, name:product.name, img:product.img, size, price, qty:1});
  saveCart();
  renderCart();

  const cnt = $('cartCount');
  if(cnt){ cnt.classList.remove('bump'); void cnt.offsetWidth; cnt.classList.add('bump'); setTimeout(()=>cnt.classList.remove('bump'),450); }
  showToast(`${product.name} (${size}) dodato u korpu`);
}

function renderCart(){
  const el    = $('cartItemsEl');
  const count = $('cartCount');
  const total = $('cartTotalEl');
  const btn   = $('goCheckout');
  const qty   = cart.reduce((s,i) => s+i.qty, 0);
  const sum   = cart.reduce((s,i) => s+i.price*i.qty, 0);
  if(count) count.textContent = qty;
  if(total) total.textContent = fmt(sum);
  if(btn)   btn.disabled = cart.length===0;
  if(!el)   return;

  if(cart.length===0){
    el.innerHTML = `<div class="cart-empty"><i class="fas fa-shopping-bag"></i><p>Vaša korpa je prazna</p></div>`;
    return;
  }

  el.innerHTML = cart.map(item => `
<div class="cart-item" data-id="${item.id}" data-size="${item.size}">
  <div class="ci-img">${item.img?`<img src="${item.img}" alt="${item.name}">`:
    `<i class="fas fa-wine-bottle" style="font-size:1.8rem;color:rgba(196,137,42,0.25)"></i>`}</div>
  <div class="ci-info">
    <div class="ci-name">${item.name}</div>
    <div class="ci-size">${item.size}</div>
    <div class="ci-controls">
      <button class="ci-qty-btn ci-minus"><i class="fas fa-minus"></i></button>
      <span class="ci-qty">${item.qty}</span>
      <button class="ci-qty-btn ci-plus"><i class="fas fa-plus"></i></button>
      <button class="ci-remove"><i class="fas fa-trash-alt"></i></button>
    </div>
  </div>
  <div class="ci-price">${fmt(item.price*item.qty)}</div>
</div>`).join('');

  el.querySelectorAll('.cart-item').forEach(row => {
    const id   = row.dataset.id;
    const size = row.dataset.size;
    const idx  = () => cart.findIndex(i => i.id===id && i.size===size);
    row.querySelector('.ci-minus').addEventListener('click',  () => { const i=idx(); if(i>-1){ if(cart[i].qty>1) cart[i].qty--; else cart.splice(i,1); saveCart(); renderCart(); } });
    row.querySelector('.ci-plus').addEventListener('click',   () => { const i=idx(); if(i>-1){ cart[i].qty++; saveCart(); renderCart(); } });
    row.querySelector('.ci-remove').addEventListener('click', () => { const i=idx(); if(i>-1){ cart.splice(i,1); saveCart(); renderCart(); } });
  });
}

/* ──────────────────────────── CART SIDEBAR ─────────────────────── */
(function(){
  const sidebar  = $('cartSidebar');
  const overlay  = $('cartOverlay');
  const toggle   = $('cartToggle');
  const close    = $('cartClose');
  const checkout = $('goCheckout');

  function openCart(){
    sidebar && sidebar.classList.add('open');
    overlay && overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeCart(){
    sidebar && sidebar.classList.remove('open');
    overlay && overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if(toggle)   toggle.addEventListener('click', openCart);
  if(close)    close.addEventListener('click', closeCart);
  if(overlay)  overlay.addEventListener('click', e => { if(e.target===overlay) closeCart(); });
  if(checkout) checkout.addEventListener('click', () => { closeCart(); openCheckout(); });

  renderCart();
})();

/* ──────────────────────────── CHECKOUT ─────────────────────────── */
function openCheckout(){
  const modal = $('checkoutModal');
  if(!modal) return;
  checkoutStep = 1; goStep(1);
  modal.classList.add('open');
  const ov = $('checkoutOverlay');
  if(ov) ov.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeCheckout(){
  const modal = $('checkoutModal');
  if(modal) modal.classList.remove('open');
  const ov = $('checkoutOverlay');
  if(ov) ov.classList.remove('active');
  document.body.style.overflow = '';
}
function goStep(n){
  checkoutStep = n;
  qsa('.form-step').forEach(s => s.classList.remove('active'));
  qsa('.step').forEach(s => {
    const sn = +s.dataset.step;
    s.classList.toggle('active', sn===n);
    s.classList.toggle('done', sn<n);
  });
  const stepEl = $('step'+n);
  if(stepEl) stepEl.classList.add('active');
  if(n===4) buildReview();
}

(function(){
  const cc = $('checkoutClose'), ov = $('checkoutOverlay');
  if(cc) cc.addEventListener('click', closeCheckout);
  if(ov) ov.addEventListener('click', e => { if(e.target===ov) closeCheckout(); });
  const ev = (id,fn) => { const el=$(id); if(el) el.addEventListener('click',fn); };
  ev('step1Next', () => goStep(2));
  ev('step2Prev', () => goStep(1));
  ev('step2Next', validateStep2);
  ev('step3Prev', () => goStep(2));
  ev('step3Next', () => goStep(4));
  ev('step4Prev', () => goStep(3));
  ev('submitOrder', submitOrder);
  ev('confirmClose', closeCheckout);

  qsa('input[name="delivery"]').forEach(radio => radio.addEventListener('change', () => {
    const sec = $('addressSection');
    if(sec) sec.style.display = radio.value==='courier' ? '' : 'none';
  }));
})();

function validateStep2(){
  const delivery = (qs('input[name="delivery"]:checked') || {}).value || 'courier';
  const required = ['firstName','lastName','phone','email'];
  if(delivery==='courier') required.push('street','city','postal');
  let ok = true;
  required.forEach(id => {
    const el = $(id), err = $('err-'+id);
    if(!el) return;
    const empty = !el.value.trim();
    el.classList.toggle('invalid', empty);
    if(err) err.classList.toggle('show', empty);
    if(empty) ok = false;
  });
  if(ok) goStep(3);
}

function v(id){ const el=$(id); return el ? el.value.trim() : ''; }

function buildReview(){
  const delivery = (qs('input[name="delivery"]:checked')||{}).value || 'courier';
  const payment  = (qs('input[name="payment"]:checked') ||{}).value || 'cod';
  const dcost    = delivery==='courier' ? 490 : 0;
  const itemSum  = cart.reduce((s,i) => s+i.price*i.qty, 0);
  const dlabels  = {courier:'Kurirska služba', pickup:'Lično preuzimanje'};
  const plabels  = {cod:'Pouzeće', transfer:'Bankovna uplata', card:'Kartica'};

  const si = $('summaryItems');
  if(si) si.innerHTML = cart.map(i =>
    `<div class="os-row"><span>${i.name} (${i.size}) × ${i.qty}</span><span>${fmt(i.price*i.qty)}</span></div>`
  ).join('');

  const set = (id,val) => { const el=$(id); if(el) el.textContent=val; };
  set('summaryDelivery', dcost ? fmt(dcost) : 'Besplatno');
  set('summaryTotal', fmt(itemSum+dcost));
  const addr = delivery==='courier'
    ? `${v('street')}, ${v('postal')} ${v('city')}`
    : 'Lično preuzimanje – Kukujevci';
  set('revName',  `${v('firstName')} ${v('lastName')}`);
  set('revPhone', v('phone'));
  set('revAddr',  addr);
  set('revDel',   dlabels[delivery] + (dcost ? ` (${fmt(dcost)})` : ' – besplatno'));
  set('revPay',   plabels[payment]);
}

function submitOrder(){
  const steps = $('stepsEl');
  if(steps) steps.style.display = 'none';
  qsa('.form-step').forEach(s => s.classList.remove('active'));
  const confirm = $('orderConfirm');
  if(confirm) confirm.classList.add('show');
  const num = $('confirmNum');
  if(num) num.textContent = 'Broj porudžbine: #CR-' + Date.now().toString().slice(-6);
  cart = []; saveCart(); renderCart();
}

/* ──────────────────────────── GALLERY LIGHTBOX ─────────────────── */
(function(){
  const lb     = $('lightbox');
  const lbImg  = $('lightboxImg');
  const lbPrev = $('lightboxPrev');
  const lbNext = $('lightboxNext');
  const lbCnt  = $('lightboxCounter');
  const lbCls  = $('lightboxClose');
  if(!lb) return;

  qsa('.gallery-item').forEach((item, i) => {
    const img = item.querySelector('img');
    if(img) galleryImages.push({src:img.src, alt:img.alt||''});
    item.addEventListener('click', () => { lightboxOpen(i); });
  });

  function lightboxOpen(i){
    if(!galleryImages[i]) return;
    let idx = i;
    lbImg.style.opacity='0';
    setTimeout(()=>{
      lbImg.src = galleryImages[idx].src;
      lbImg.alt = galleryImages[idx].alt;
      lbImg.style.opacity='1';
      if(lbCnt) lbCnt.textContent=(idx+1)+' / '+galleryImages.length;
    },220);
    lb.classList.add('open');
    document.body.style.overflow='hidden';
    lb._idx = idx;
  }
  function lightboxClose(){ lb.classList.remove('open'); document.body.style.overflow=''; }
  function lightboxMove(dir){
    const n = ((lb._idx||0) + dir + galleryImages.length) % galleryImages.length;
    lightboxOpen(n);
    lb._idx = n;
  }

  if(lbCls) lbCls.addEventListener('click', lightboxClose);
  if(lbPrev) lbPrev.addEventListener('click', () => lightboxMove(-1));
  if(lbNext) lbNext.addEventListener('click', () => lightboxMove(1));
  lb.addEventListener('click', e => { if(e.target===lb) lightboxClose(); });
  document.addEventListener('keydown', e => {
    if(!lb.classList.contains('open')) return;
    if(e.key==='Escape')       lightboxClose();
    if(e.key==='ArrowLeft')    lightboxMove(-1);
    if(e.key==='ArrowRight')   lightboxMove(1);
  });
})();

/* ──────────────────────────── TOAST ────────────────────────────── */
function showToast(msg){
  const toast = $('toast'), msgEl = $('toastMsg');
  if(!toast||!msgEl) return;
  msgEl.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}

/* ──────────────────────────── PRODUCT FILTER ───────────────────── */
(function(){
  qsa('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      qsa('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      if(f==='all') renderProducts('productsGrid');
      else renderProducts('productsGrid', p =>
        p.id.toLowerCase().includes(f) || p.name.toLowerCase().includes(f));
    });
  });
})();

/* ──────────────────────────── INIT ─────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  if($('productsGrid'))     renderProducts('productsGrid');
  if($('productsGridHome')) {
    const FEATURED = ['lozovaca','sljivovica','sljivovica-prepecena'];
    renderProducts('productsGridHome', p => FEATURED.includes(p.id));
  }
});
