/* ── opening loader ── */
(function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) {
    document.body.classList.add('hero-ready');
    return;
  }
  setTimeout(() => document.body.classList.add('hero-ready'), 3500);

  document.body.style.overflow = 'hidden';

  const logoWrap = loader.querySelector('.loader-logo-wrap');
  const ornament = loader.querySelector('.loader-ornament');
  const lwTop    = loader.querySelector('.lw-top');
  const lwBottom = loader.querySelector('.lw-bottom');
  const line     = loader.querySelector('.loader-line');
  const sub      = loader.querySelector('.loader-sub');

  function step(fn, delay) { return new Promise(r => setTimeout(() => { fn(); r(); }, delay)); }

  async function run() {
    await step(() => { logoWrap.style.opacity = '1'; ornament.style.opacity = '1'; }, 200);
    await step(() => {
      lwTop.style.opacity = '1';
      lwBottom.style.opacity = '1';
      lwTop.querySelector('span').style.transform = 'translateY(0)';
      lwBottom.querySelector('span').style.transform = 'translateY(0)';
    }, 500);
    await step(() => { line.classList.add('visible'); }, 800);
    await step(() => { sub.style.opacity = '1'; }, 1000);
    await step(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
      document.body.classList.add('hero-ready');
    }, 2400);
  }

  run();
})();

/* ── cursor glow ── */
const glow = document.getElementById('glow');
document.addEventListener('mousemove', e => {
  glow.style.left = e.clientX + 'px';
  glow.style.top  = e.clientY + 'px';
});

/* ── nav scroll ── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ── mobile nav ── */
const hamburger = document.getElementById('nav-hamburger');
const mobileNav = document.getElementById('mobile-nav');
hamburger?.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', String(isOpen));
  mobileNav.classList.toggle('open', isOpen);
  mobileNav.setAttribute('aria-hidden', String(!isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});
document.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  });
});

/* ── hero parallax ── */
(function initHeroParallax() {
  const heroBg = document.querySelector('.hero-bg-img');
  if (!heroBg) return;
  window.addEventListener('scroll', () => {
    const progress = Math.min(window.scrollY / window.innerHeight, 1);
    heroBg.style.transform = `scale(1.08) translateY(${progress * 12}%)`;
  }, { passive: true });
})();

/* ── 3D Carousel ── */
(function initCarousel() {
  const viewport = document.getElementById('carousel-viewport');
  const dotsEl   = document.getElementById('carousel-dots');
  const prevBtn  = document.getElementById('carousel-prev');
  const nextBtn  = document.getElementById('carousel-next');
  if (!viewport) return;

  const items = [
    { src: 'photos/1.avif',       cat: 'SOURDOUGH · לחמים',     name: 'לחם מחמצת',     desc: 'אפוי לאט, תוסס ועשיר' },
    { src: 'photos/קרקר.avif',    cat: 'CROISSANT · מאפים',     name: 'קרואסון חמאה',  desc: 'שכבות בצק עלים וחמאה' },
    { src: 'photos/הההה.jpeg',    cat: 'PISTACHIO · מאפים',     name: 'מאפה פיסטוק',   desc: 'קרם פיסטוק בבצק פריך' },
    { src: 'photos/6677.jpeg',    cat: 'BOUTIQUE CAKE · עוגות', name: 'עוגת בוטיק',    desc: 'מותאמת אישית לכל אירוע' },
    { src: 'photos/עערע.jpg',     cat: 'ROLLS · לחמים',         name: 'לחמניות',       desc: 'טריות בכל בוקר' },
    { src: 'photos/images.jpeg',  cat: 'COOKIES · עוגות',       name: 'עוגיות ביתיות', desc: 'מתכונים מסבתא' },
    { src: 'photos/ככהר.jpeg',    cat: 'EVENT CAKE · עוגות',    name: 'עוגת אירועים',  desc: 'כי כל רגע מגיע מושלם' },
  ];

  const n = items.length;
  let current = Math.floor(n / 2);
  let autoTimer;

  const slides = items.map((item, i) => {
    const el = document.createElement('div');
    el.className = 'carousel-slide';
    el.innerHTML = `
      <img src="${item.src}" alt="${item.name}" loading="lazy" />
      <div class="carousel-slide-info">
        <p class="carousel-slide-cat">${item.cat}</p>
        <h3 class="carousel-slide-name">${item.name}</h3>
        <div class="carousel-slide-line"></div>
      </div>`;
    el.addEventListener('click', () => goTo(i));
    viewport.appendChild(el);
    return el;
  });

  const dots = items.map((_, i) => {
    const btn = document.createElement('button');
    btn.className = 'carousel-dot';
    btn.setAttribute('aria-label', `מוצר ${i + 1}`);
    btn.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(btn);
    return btn;
  });

  function getOffset(i) {
    let off = i - current;
    const half = Math.floor(n / 2);
    if (off >  half) off -= n;
    if (off < -half) off += n;
    return off;
  }

  function update() {
    slides.forEach((slide, i) => {
      const pos = getOffset(i);
      const isCenter  = pos === 0;
      const isAdjacent = Math.abs(pos) === 1;
      const visible   = Math.abs(pos) <= 1;

      slide.style.visibility = visible ? 'visible' : 'hidden';
      slide.style.zIndex     = isCenter ? 10 : isAdjacent ? 5 : 1;
      slide.classList.toggle('is-active', isCenter);

      const tx      = pos * 110;           // % offset from center
      const scale   = isCenter ? 1 : 0.8;
      const ry      = pos * -12;           // rotateY deg
      const opacity = isCenter ? 1 : isAdjacent ? 0.42 : 0;
      const blur    = isCenter ? 0 : 5;

      slide.style.transform = `translateX(${tx}%) scale(${scale}) rotateY(${ry}deg)`;
      slide.style.opacity   = opacity;
      slide.style.filter    = isCenter ? '' : `blur(${blur}px) brightness(0.6)`;
    });

    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === current));
  }

  function goTo(index) {
    current = ((index % n) + n) % n;
    update();
    resetAuto();
  }

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + 1), 4000);
  }

  prevBtn?.addEventListener('click', () => goTo(current + 1));
  nextBtn?.addEventListener('click', () => goTo(current - 1));

  update();
  resetAuto();
})();

/* ── smooth anchors ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' });
  });
});

/* ── scroll reveal ── */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.07, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ── loyalty popup ── */
(function initLoyaltyPopup() {
  const popup   = document.getElementById('loyalty-popup');
  const closeBtn = document.getElementById('popup-close');
  const form    = document.getElementById('popup-form');
  if (!popup) return;

  const STORAGE_KEY = 'bb_loyalty_closed';
  if (sessionStorage.getItem(STORAGE_KEY)) return;

  let shown = false;

  function showPopup() {
    if (shown) return;
    shown = true;
    popup.classList.add('open');
    popup.setAttribute('aria-hidden', 'false');
  }

  function closePopup() {
    popup.classList.remove('open');
    popup.setAttribute('aria-hidden', 'true');
    sessionStorage.setItem(STORAGE_KEY, '1');
  }

  window.addEventListener('scroll', () => {
    if (shown) return;
    const progress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    if (progress > 0.38) showPopup();
  }, { passive: true });

  closeBtn?.addEventListener('click', closePopup);
  popup.addEventListener('click', e => { if (e.target === popup) closePopup(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && shown) closePopup(); });

  form?.addEventListener('submit', e => {
    e.preventDefault();
    const name = form.querySelector('input[type="text"]').value;
    form.innerHTML = `<div class="popup-success">✓ ברוך/ה הבא/ה למועדון, ${name}!<br />ניצור קשר בקרוב 🍞</div>`;
    setTimeout(closePopup, 3500);
  });
})();

