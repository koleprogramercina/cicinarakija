/* ================================================================
   ČIČINA RAKIJA — script.js v2.1
   FIX: sve inicijalizacije unutar DOMContentLoaded
================================================================ */
'use strict';

/* ──────────────────────── PRODUCT DATA ─────────────────────────── */
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
    desc:'Aromatična rakija sa biljnim dodacima po staroj recepturi. Savršena digestivna rakija.',
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

/* ──────────────────────── STATE ────────────────────────────────── */
let cart = [];
try { cart = JSON.parse(localStorage.getItem('cr_cart') || '[]'); } catch(e) { cart = []; }
let checkoutStep = 1;
let toastTimer   = null;
const galleryImages = [];

/* ──────────────────────── UTILS ────────────────────────────────── */
const $   = id  => document.getElementById(id);
const qs  = sel => document.querySelector(sel);
const qsa = sel => document.querySelectorAll(sel);
function fmt(n) { return Number(n).toLocaleString('sr-RS') + ' RSD'; }
function val(id) { const el = $(id); return el ? el.value.trim() : ''; }
function saveCart() { try { localStorage.setItem('cr_cart', JSON.stringify(cart)); } catch(e) {} }

/* ──────────────────────── AGE GATE ─────────────────────────────── */
function initAgeGate() {
  const gate = $('ageGate');
  if (!gate) return;

  // Already verified → hide immediately, no flash
  if (localStorage.getItem('cr_age') === '1') {
    gate.style.display = 'none';
    return;
  }

  const yes = $('ageYes');
  const no  = $('ageNo');

  if (yes) {
    yes.addEventListener('click', function() {
      localStorage.setItem('cr_age', '1');
      gate.style.opacity = '0';
      gate.style.transition = 'opacity 0.6s ease';
      setTimeout(() => { gate.style.display = 'none'; }, 650);
    });
  }

  if (no) {
    no.addEventListener('click', function() {
      window.location.href = 'https://www.google.com';
    });
  }
}

/* ──────────────────────── NAVBAR ───────────────────────────────── */
function initNavbar() {
  const navbar    = $('navbar');
  const progress  = $('navProgress');
  const hamburger = $('hamburger');
  const navLinks  = $('navLinks');
  if (!navbar) return;

  // Create overlay if missing
  let overlay = qs('.nav-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);
  }

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 55);
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function openMenu() {
    if (hamburger) hamburger.classList.add('open');
    if (navLinks)  navLinks.classList.add('open');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    if (hamburger) hamburger.classList.remove('open');
    if (navLinks)  navLinks.classList.remove('open');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', function() {
      navLinks && navLinks.classList.contains('open') ? closeMenu() : openMenu();
    });
  }
  overlay.addEventListener('click', closeMenu);
  qsa('.nav-link').forEach(l => l.addEventListener('click', closeMenu));
}

/* ──────────────────────── HERO ─────────────────────────────────── */
function initHero() {
  // Parallax
  const heroBg = qs('.hero-parallax');
  if (heroBg) {
    window.addEventListener('scroll', function() {
      if (window.scrollY < window.innerHeight * 1.5) {
        heroBg.style.transform = 'translateY(' + (window.scrollY * 0.28) + 'px) scale(1.06)';
      }
    }, { passive: true });
  }

  // Staggered reveal
  qsa('.reveal-hero').forEach(function(el) {
    const delay = parseInt(el.dataset.delay) || 0;
    setTimeout(function() { el.classList.add('visible'); }, delay + 200);
  });
}

/* ──────────────────────── SCROLL REVEAL ────────────────────────── */
function initReveal() {
  const obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        const delay = parseInt(e.target.dataset.delay) || 0;
        setTimeout(function() { e.target.classList.add('visible'); }, delay);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.09, rootMargin: '0px 0px -40px 0px' });

  const ruleObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        ruleObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });

  qsa('.reveal').forEach(el => obs.observe(el));
  qsa('.sec-rule').forEach(el => ruleObs.observe(el));
}

/* ──────────────────────── RENDER PRODUCTS ──────────────────────── */
function renderProducts(containerId, filterFn) {
  const grid = $(containerId);
  if (!grid) return;
  const list = filterFn ? PRODUCTS.filter(filterFn) : PRODUCTS;

  grid.innerHTML = list.map(function(p) {
    const sizes      = Object.keys(p.prices);
    const firstSize  = sizes[0];
    const firstPrice = p.prices[firstSize];

    const imgHtml = p.img
      ? '<img src="' + p.img + '" alt="Čičina rakija ' + p.name + ' – domaća rakija Kukujevci Srem" loading="lazy">'
      : '<div class="product-placeholder"><i class="fas fa-wine-bottle"></i><span>Slika uskoro</span></div>';

    const badgeHtml = p.badge
      ? '<div class="product-badge' + (p.premium ? ' premium-badge' : '') + '">' + p.badge + '</div>'
      : '';

    const sizeBtns = sizes.map(function(s, i) {
      return '<button class="size-btn' + (i === 0 ? ' active' : '') + '" data-size="' + s + '" data-price="' + p.prices[s] + '" data-product="' + p.id + '"><span>' + s + '</span></button>';
    }).join('');

    return '<div class="product-card reveal" data-product-id="' + p.id + '">'
      + '<div class="product-img-wrap">' + imgHtml + badgeHtml + '</div>'
      + '<div class="product-info">'
      + '<div class="product-name">' + p.name + '</div>'
      + '<div class="product-meta"><span class="product-alc">' + p.alc + ' alc.</span><span class="product-method">' + p.method + '</span></div>'
      + '<p class="product-desc">' + p.desc + '</p>'
      + '<div class="product-sizes"><span class="size-label">ODABERITE VELIČINU</span><div class="size-opts">' + sizeBtns + '</div></div>'
      + '<div class="product-footer">'
      + '<div class="product-price" id="price-' + p.id + '">' + fmt(firstPrice) + '</div>'
      + '<button class="btn-add" data-id="' + p.id + '" data-size="' + firstSize + '" data-price="' + firstPrice + '"><i class="fas fa-shopping-bag"></i><span>Dodaj</span></button>'
      + '</div></div></div>';
  }).join('');

  // Re-observe new cards
  const obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.07 });
  qsa('#' + containerId + ' .product-card.reveal').forEach(el => obs.observe(el));

  // Delegated events
  grid.addEventListener('click', function(e) {
    const sb = e.target.closest('.size-btn');
    if (sb) {
      const card = sb.closest('.product-card');
      card.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
      sb.classList.add('active');
      const pid   = sb.dataset.product;
      const price = +sb.dataset.price;
      const size  = sb.dataset.size;
      const priceEl = $('price-' + pid);
      if (priceEl) priceEl.textContent = fmt(price);
      const addBtn = card.querySelector('.btn-add');
      if (addBtn) { addBtn.dataset.size = size; addBtn.dataset.price = price; }
      return;
    }
    const ab = e.target.closest('.btn-add');
    if (ab) {
      const prod = PRODUCTS.find(p => p.id === ab.dataset.id);
      if (prod) addToCart(prod, ab.dataset.size, +ab.dataset.price);
    }
  });
}

/* ──────────────────────── CART ─────────────────────────────────── */
function addToCart(product, size, price) {
  cart.push({ id: product.id, name: product.name, img: product.img, size: size, price: price, qty: 1 });
  saveCart();
  renderCart();

  const cnt = $('cartCount');
  if (cnt) {
    cnt.classList.remove('bump');
    void cnt.offsetWidth;
    cnt.classList.add('bump');
    setTimeout(() => cnt.classList.remove('bump'), 450);
  }
  showToast(product.name + ' (' + size + ') dodato u korpu');
}

function renderCart() {
  const el    = $('cartItemsEl');
  const count = $('cartCount');
  const total = $('cartTotalEl');
  const btn   = $('goCheckout');
  const qty   = cart.reduce((s, i) => s + i.qty, 0);
  const sum   = cart.reduce((s, i) => s + i.price * i.qty, 0);
  if (count) count.textContent = qty;
  if (total) total.textContent = fmt(sum);
  if (btn)   btn.disabled = cart.length === 0;
  if (!el)   return;

  if (cart.length === 0) {
    el.innerHTML = '<div class="cart-empty"><i class="fas fa-shopping-bag"></i><p>Vaša korpa je prazna</p></div>';
    return;
  }

  el.innerHTML = cart.map(function(item, index) {
    const imgHtml = item.img
      ? '<img src="' + item.img + '" alt="' + item.name + '">'
      : '<i class="fas fa-wine-bottle" style="font-size:1.8rem;color:rgba(196,137,42,0.25)"></i>';
    return '<div class="cart-item" data-index="' + index + '">'
      + '<div class="ci-img">' + imgHtml + '</div>'
      + '<div class="ci-info">'
      + '<div class="ci-name">' + item.name + '</div>'
      + '<div class="ci-size">' + item.size + '</div>'
      + '<div class="ci-controls">'
      + '<button class="ci-qty-btn ci-minus" data-index="' + index + '"><i class="fas fa-minus"></i></button>'
      + '<span class="ci-qty">' + item.qty + '</span>'
      + '<button class="ci-qty-btn ci-plus" data-index="' + index + '"><i class="fas fa-plus"></i></button>'
      + '<button class="ci-remove" data-index="' + index + '"><i class="fas fa-trash-alt"></i></button>'
      + '</div></div>'
      + '<div class="ci-price">' + fmt(item.price * item.qty) + '</div>'
      + '</div>';
  }).join('');

  el.querySelectorAll('.ci-minus').forEach(function(btn) {
    btn.addEventListener('click', function() {
      const i = +this.dataset.index;
      if (cart[i]) { if (cart[i].qty > 1) cart[i].qty--; else cart.splice(i, 1); saveCart(); renderCart(); }
    });
  });
  el.querySelectorAll('.ci-plus').forEach(function(btn) {
    btn.addEventListener('click', function() {
      const i = +this.dataset.index;
      if (cart[i]) { cart[i].qty++; saveCart(); renderCart(); }
    });
  });
  el.querySelectorAll('.ci-remove').forEach(function(btn) {
    btn.addEventListener('click', function() {
      const i = +this.dataset.index;
      cart.splice(i, 1); saveCart(); renderCart();
    });
  });
}

/* ──────────────────────── CART SIDEBAR ─────────────────────────── */
function initCartSidebar() {
  const sidebar  = $('cartSidebar');
  const overlay  = $('cartOverlay');
  const toggle   = $('cartToggle');
  const close    = $('cartClose');
  const checkout = $('goCheckout');

  function openCart() {
    if (sidebar) sidebar.classList.add('open');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeCart() {
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (toggle)   toggle.addEventListener('click', openCart);
  if (close)    close.addEventListener('click', closeCart);
  if (overlay)  overlay.addEventListener('click', function(e) { if (e.target === overlay) closeCart(); });
  if (checkout) checkout.addEventListener('click', function() { closeCart(); openCheckout(); });

  renderCart();
}

/* ──────────────────────── CHECKOUT ─────────────────────────────── */
function openCheckout() {
  const modal = $('checkoutModal');
  if (!modal) return;
  checkoutStep = 1;
  goStep(1);
  modal.classList.add('open');
  const ov = $('checkoutOverlay');
  if (ov) ov.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeCheckout() {
  const modal = $('checkoutModal');
  if (modal) modal.classList.remove('open');
  const ov = $('checkoutOverlay');
  if (ov) ov.classList.remove('active');
  document.body.style.overflow = '';
}
function goStep(n) {
  checkoutStep = n;
  qsa('.form-step').forEach(s => s.classList.remove('active'));
  qsa('.step').forEach(function(s) {
    const sn = +s.dataset.step;
    s.classList.toggle('active', sn === n);
    s.classList.toggle('done',   sn < n);
  });
  const stepEl = $('step' + n);
  if (stepEl) stepEl.classList.add('active');
  if (n === 4) buildReview();
}

function initCheckout() {
  const cc = $('checkoutClose');
  const ov = $('checkoutOverlay');
  if (cc) cc.addEventListener('click', closeCheckout);
  if (ov) ov.addEventListener('click', function(e) { if (e.target === ov) closeCheckout(); });

  function ev(id, fn) { const el = $(id); if (el) el.addEventListener('click', fn); }
  ev('step1Next',   () => goStep(2));
  ev('step2Prev',   () => goStep(1));
  ev('step2Next',   validateStep2);
  ev('step3Prev',   () => goStep(2));
  ev('step3Next',   () => goStep(4));
  ev('step4Prev',   () => goStep(3));
  ev('submitOrder', submitOrder);
  ev('confirmClose', closeCheckout);

  qsa('input[name="delivery"]').forEach(function(radio) {
    radio.addEventListener('change', function() {
      const sec = $('addressSection');
      if (sec) sec.style.display = this.value === 'courier' ? '' : 'none';
    });
  });
}

function validateStep2() {
  const delivery = (qs('input[name="delivery"]:checked') || {}).value || 'courier';
  const required = ['firstName', 'lastName', 'phone', 'email'];
  if (delivery === 'courier') required.push('street', 'city', 'postal');
  let ok = true;
  required.forEach(function(id) {
    const el  = $(id);
    const err = $('err-' + id);
    if (!el) return;
    const empty = !el.value.trim();
    el.classList.toggle('invalid', empty);
    if (err) err.classList.toggle('show', empty);
    if (empty) ok = false;
  });
  if (ok) goStep(3);
}

function buildReview() {
  const delivery = (qs('input[name="delivery"]:checked') || {}).value || 'courier';
  const payment  = (qs('input[name="payment"]:checked')  || {}).value || 'cod';
  const dcost    = delivery === 'courier' ? 490 : 0;
  const itemSum  = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const dlabels  = { courier: 'Kurirska služba', pickup: 'Lično preuzimanje' };
  const plabels  = { cod: 'Pouzeće', transfer: 'Bankovna uplata', card: 'Kartica' };

  const si = $('summaryItems');
  if (si) si.innerHTML = cart.map(i =>
    '<div class="os-row"><span>' + i.name + ' (' + i.size + ') × ' + i.qty + '</span><span>' + fmt(i.price * i.qty) + '</span></div>'
  ).join('');

  function set(id, v) { const el = $(id); if (el) el.textContent = v; }
  set('summaryDelivery', dcost ? fmt(dcost) : 'Besplatno');
  set('summaryTotal', fmt(itemSum + dcost));
  const addr = delivery === 'courier'
    ? val('street') + ', ' + val('postal') + ' ' + val('city')
    : 'Lično preuzimanje – Kukujevci';
  set('revName',  val('firstName') + ' ' + val('lastName'));
  set('revPhone', val('phone'));
  set('revAddr',  addr);
  set('revDel',   (dlabels[delivery] || delivery) + (dcost ? ' (' + fmt(dcost) + ')' : ' – besplatno'));
  set('revPay',   plabels[payment] || payment);
}

function submitOrder() {
  const orderNum = 'CR-' + Date.now().toString().slice(-6);
  const delivery = (qs('input[name="delivery"]:checked') || {}).value || 'courier';
  const payment  = (qs('input[name="payment"]:checked')  || {}).value || 'cod';
  const dcost    = delivery === 'courier' ? 490 : 0;
  const itemSum  = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const dlabels  = { courier: 'Kurirska služba (490 RSD)', pickup: 'Lično preuzimanje (besplatno)' };
  const plabels  = { cod: 'Pouzeće', transfer: 'Bankovna uplata', card: 'Kartica' };
  const addr     = delivery === 'courier'
    ? val('street') + ', ' + val('postal') + ' ' + val('city')
    : 'Lično preuzimanje – Kukujevci';
  const stavke   = cart.map(i => i.name + ' (' + i.size + ') × ' + i.qty + ' = ' + fmt(i.price * i.qty)).join('\n');

  if (window.emailjs) {
    emailjs.send('cicina_rakija', 'porudzbina_template', {
      order_num:     orderNum,
      customer_name: val('firstName') + ' ' + val('lastName'),
      phone:         val('phone'),
      email:         val('email'),
      address:       addr,
      delivery:      dlabels[delivery] || delivery,
      payment:       plabels[payment]  || payment,
      items:         stavke,
      items_total:   fmt(itemSum),
      delivery_cost: dcost ? fmt(dcost) : 'Besplatno',
      total:         fmt(itemSum + dcost),
      note:          val('note') || '—'
    }).catch(err => console.warn('EmailJS error:', err));
  }

  const steps = $('stepsEl');
  if (steps) steps.style.display = 'none';
  qsa('.form-step').forEach(s => s.classList.remove('active'));
  const confirm = $('orderConfirm');
  if (confirm) confirm.classList.add('show');
  const num = $('confirmNum');
  if (num) num.textContent = 'Broj porudžbine: #' + orderNum;
  cart = []; saveCart(); renderCart();
}

/* ──────────────────────── LIGHTBOX ─────────────────────────────── */
function initLightbox() {
  const lb    = $('lightbox');
  const lbImg = $('lightboxImg');
  const lbCnt = $('lightboxCounter');
  const lbCls = $('lightboxClose');
  const lbPrv = $('lightboxPrev');
  const lbNxt = $('lightboxNext');
  if (!lb) return;

  qsa('.gallery-item').forEach(function(item, i) {
    const img = item.querySelector('img');
    if (img) galleryImages.push({ src: img.src, alt: img.alt || '' });
    item.addEventListener('click', function() { lightboxOpen(i); });
  });

  function lightboxOpen(i) {
    if (!galleryImages[i]) return;
    lb._idx = i;
    lbImg.style.opacity = '0';
    setTimeout(function() {
      lbImg.src = galleryImages[i].src;
      lbImg.alt = galleryImages[i].alt;
      lbImg.style.opacity = '1';
      if (lbCnt) lbCnt.textContent = (i + 1) + ' / ' + galleryImages.length;
    }, 200);
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function lightboxClose() { lb.classList.remove('open'); document.body.style.overflow = ''; }
  function lightboxMove(dir) {
    const n = ((lb._idx || 0) + dir + galleryImages.length) % galleryImages.length;
    lightboxOpen(n);
  }

  if (lbCls) lbCls.addEventListener('click', lightboxClose);
  if (lbPrv) lbPrv.addEventListener('click', function() { lightboxMove(-1); });
  if (lbNxt) lbNxt.addEventListener('click', function() { lightboxMove(1); });
  lb.addEventListener('click', function(e) { if (e.target === lb) lightboxClose(); });
  document.addEventListener('keydown', function(e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')      lightboxClose();
    if (e.key === 'ArrowLeft')   lightboxMove(-1);
    if (e.key === 'ArrowRight')  lightboxMove(1);
  });
}

/* ──────────────────────── TOAST ────────────────────────────────── */
function showToast(msg) {
  const toast = $('toast');
  const msgEl = $('toastMsg');
  if (!toast || !msgEl) return;
  msgEl.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function() { toast.classList.remove('show'); }, 3200);
}

/* ──────────────────────── FILTER ───────────────────────────────── */
function initFilter() {
  qsa('.filter-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      qsa('.filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const f = this.dataset.filter;
      if (f === 'all') renderProducts('productsGrid');
      else renderProducts('productsGrid', p =>
        p.id.toLowerCase().includes(f) || p.name.toLowerCase().includes(f)
      );
    });
  });
}

/* ──────────────────────── CONTACT FORM ─────────────────────────── */
function initContactForm() {
  const btn = $('cf-submit');
  if (!btn) return;
  btn.addEventListener('click', function() {
    const form    = $('contactFormEl');
    const success = $('cfSuccess');
    if (form && success) {
      form.style.display = 'none';
      success.classList.add('show');
    }
  });
}

/* ──────────────────────── MAIN INIT ────────────────────────────── */
document.addEventListener('DOMContentLoaded', function() {
  initAgeGate();
  initNavbar();
  initHero();
  initReveal();
  initCartSidebar();
  initCheckout();
  initLightbox();
  initFilter();
  initContactForm();

  // Render products
  if ($('productsGrid')) {
    renderProducts('productsGrid');
  }
  if ($('productsGridHome')) {
    const FEATURED = ['lozovaca', 'sljivovica', 'sljivovica-prepecena'];
    renderProducts('productsGridHome', p => FEATURED.includes(p.id));
  }
});
