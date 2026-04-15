/* ── Navbar scroll effect ── */
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

/* ── Mobile nav toggle ── */
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const icon = navToggle.querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-bars');
      icon.classList.toggle('fa-xmark');
    }
  });

  // Mobile dropdown toggles
  navLinks.querySelectorAll('.dropdown > a').forEach(link => {
    link.addEventListener('click', e => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        link.parentElement.classList.toggle('open');
      }
    });
  });

  // Close on non-dropdown link click
  navLinks.querySelectorAll('a:not(.dropdown > a)').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      const icon = navToggle.querySelector('i');
      if (icon) { icon.classList.add('fa-bars'); icon.classList.remove('fa-xmark'); }
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!navbar.contains(e.target)) {
      navLinks.classList.remove('open');
      const icon = navToggle.querySelector('i');
      if (icon) { icon.classList.add('fa-bars'); icon.classList.remove('fa-xmark'); }
    }
  });
}

/* ── Active nav link ── */
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links > li > a').forEach(a => {
  const href = (a.getAttribute('href') || '').split('#')[0];
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    a.classList.add('active');
  }
});

/* ── Scroll reveal (Intersection Observer) ── */
const revealEls = document.querySelectorAll(
  '.service-card, .specialist-card, .value-card, .spec-card, .conv-card, ' +
  '.section-header, .about-grid, .hero-stats, .stat-item, .location-card, ' +
  '.service-block, .dept-section, .contact-grid, .convenzioni-intro'
);

revealEls.forEach((el, i) => {
  el.classList.add('reveal');
  // Stagger children inside grid containers
  const parent = el.closest('.services-grid, .specialists-grid-4, .values-grid, ' +
    '.specialists-dept-grid, .convenzioni-grid, .stats-grid');
  if (parent) {
    const siblings = Array.from(parent.children);
    const idx = siblings.indexOf(el);
    if (idx < 6) el.classList.add(`reveal-delay-${idx + 1}`);
  }
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => observer.observe(el));

/* ── Contact form ── */
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Invio in corso…';

    setTimeout(() => {
      form.innerHTML = `
        <div style="text-align:center;padding:56px 20px">
          <div style="width:72px;height:72px;background:var(--teal-light);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 24px;font-size:2rem;color:var(--teal)">
            <i class="fa-solid fa-circle-check"></i>
          </div>
          <h3 style="color:var(--primary);margin-bottom:12px;font-family:'Playfair Display',serif">Richiesta inviata!</h3>
          <p style="color:var(--text-muted);font-size:.95rem;line-height:1.7;max-width:360px;margin:0 auto">
            Grazie per averci contattato. Ti risponderemo entro 24 ore lavorative per confermare il tuo appuntamento.
          </p>
        </div>`;
    }, 1400);
  });
}

/* ── Hero image carousel ── */
(function() {
  const wrap = document.getElementById('hero-carousel');
  if (!wrap) return;
  const imgs = wrap.querySelectorAll('img');
  if (imgs.length < 2) return;
  let current = 0;
  setInterval(function() {
    imgs[current].classList.remove('active');
    current = (current + 1) % imgs.length;
    imgs[current].classList.add('active');
  }, 3000);
})();

/* ── Reviews carousel ── */
(function() {
  const carousel = document.getElementById('reviews-carousel');
  const dotsWrap = document.getElementById('reviews-dots');
  if (!carousel || !dotsWrap) return;

  const slides = carousel.querySelectorAll('.review-slide');
  if (slides.length === 0) return;

  let current = 0;
  let timer;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = 'reviews-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = dotsWrap.querySelectorAll('.reviews-dot');

  function goTo(next) {
    if (next === current) return;
    const cur = slides[current];
    const nxt = slides[next];

    // Slide out current
    cur.classList.add('slide-out');
    setTimeout(() => {
      cur.classList.remove('active', 'slide-out');
      cur.style.display = 'none';
      // Show next
      nxt.style.display = 'flex';
      // Force reflow so transition triggers
      void nxt.offsetWidth;
      nxt.classList.add('active');
    }, 400);

    dots[current].classList.remove('active');
    dots[next].classList.add('active');
    current = next;
    resetTimer();
  }

  function advance() {
    goTo((current + 1) % slides.length);
  }

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(advance, 4000);
  }

  resetTimer();
})();

/* ── Smooth anchor scrolling for service page ── */
document.querySelectorAll('a[href*="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const url = new URL(link.href, location.href);
    if (url.pathname === location.pathname && url.hash) {
      const target = document.querySelector(url.hash);
      if (target) {
        e.preventDefault();
        const offset = 90;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  });
});
