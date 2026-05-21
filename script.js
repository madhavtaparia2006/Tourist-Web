/* ============================================================
   DISCOVER INDIA — script.js
   Features: Loader · Navbar scroll + mobile menu · Hero slideshow
   · Stat counters · Search + filter · Experience tabs
   · Culture accordion · Gallery lightbox · Testimonial slider
   · Form validation · Scroll reveal · Back to top
   · Destination detail modal · Info modal · Wishlist
   ============================================================ */

'use strict';

/* ─── Utility ─────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);

/* ─── DOM ready ───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  initLoader();
  initNavbar();
  initHeroSlideshow();
  initStatCounters();
  initSearchFilter();
  initExpTabs();
  initAccordion();
  initGallery();
  initTestimonialSlider();
  initContactForm();
  initScrollReveal();
  initBackToTop();
  initWishlist();
  initDestModal();
  initInfoModal();

});

/* ════════════════════════════════════════════════════════════
   1. LOADER
   ════════════════════════════════════════════════════════════ */
function initLoader() {
  const loader = $('#loader');
  if (!loader) return;

  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 600);
  });

  // Fallback — hide after 3s no matter what
  setTimeout(() => loader.classList.add('hidden'), 3000);
}

/* ════════════════════════════════════════════════════════════
   2. NAVBAR — scroll style + mobile menu + active link
   ════════════════════════════════════════════════════════════ */
function initNavbar() {
  const navbar = $('#navbar');
  const toggle = $('#navToggle');
  const menu = $('#navMenu');
  const links = $$('.nav-link');

  // Scroll → add .scrolled class
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    // Show/hide back-to-top
    const btn = $('#backTop');
    if (btn) btn.classList.toggle('show', window.scrollY > 400);
    // Highlight nav link by section
    highlightActiveLink(links);
  };

  on(window, 'scroll', onScroll, { passive: true });

  // Mobile hamburger toggle
  on(toggle, 'click', () => {
    const expanded = toggle.classList.toggle('open');
    menu.classList.toggle('open', expanded);
    toggle.setAttribute('aria-expanded', expanded);
    document.body.style.overflow = expanded ? 'hidden' : '';
  });

  // Close menu on link click (mobile)
  links.forEach(link => {
    on(link, 'click', () => {
      toggle.classList.remove('open');
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close menu clicking outside
  on(document, 'click', e => {
    if (menu.classList.contains('open') &&
      !menu.contains(e.target) &&
      !toggle.contains(e.target)) {
      toggle.classList.remove('open');
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

function highlightActiveLink(links) {
  const sections = $$('section[id], header[id]');
  let current = '';

  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });

  links.forEach(link => {
    link.classList.toggle('active', link.dataset.section === current);
  });
}

/* ════════════════════════════════════════════════════════════
   3. HERO SLIDESHOW + DOTS
   ════════════════════════════════════════════════════════════ */
function initHeroSlideshow() {
  const slides = $$('.hero-slide');
  const dotsWrap = $('#heroSlideDots');
  if (!slides.length || !dotsWrap) return;

  let current = 0;
  let timer = null;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'sdot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    on(dot, 'click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  function goTo(idx) {
    slides[current].classList.remove('active');
    $$('.sdot')[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    $$('.sdot')[current].classList.add('active');
  }

  function next() { goTo(current + 1); }
  const startTimer = () => { timer = setInterval(next, 5000); };
  const stopTimer = () => clearInterval(timer);

  startTimer();

  // Pause on hover
  const heroEl = $('.hero');
  if (heroEl) {
    on(heroEl, 'mouseenter', stopTimer);
    on(heroEl, 'mouseleave', startTimer);
  }

  // Rotating subtitles
  const subtitles = [
    'A land of timeless beauty, vibrant culture, and extraordinary experiences.',
    'Explore over 40 UNESCO World Heritage Sites across 29 states.',
    'From the Himalayas to the backwaters — every corner tells a story.',
    'Taste, see, and feel the soul of the world\'s most diverse nation.',
  ];
  const subEl = $('#heroSubtitle');
  if (subEl) {
    setInterval(() => {
      subEl.style.opacity = '0';
      setTimeout(() => {
        subEl.textContent = subtitles[current % subtitles.length];
        subEl.style.opacity = '1';
        subEl.style.transition = 'opacity .6s ease';
      }, 400);
    }, 5000);
  }
}

/* ════════════════════════════════════════════════════════════
   4. STAT COUNTERS (animate on scroll into view)
   ════════════════════════════════════════════════════════════ */
function initStatCounters() {
  const stats = $$('.stat[data-target]');
  if (!stats.length) return;

  function animateCounter(stat) {
    const target = +stat.dataset.target;
    const numEl = $('.stat-num', stat);
    if (!numEl || numEl.dataset.animated) return;
    numEl.dataset.animated = '1';

    const duration = 1800;
    const startTime = performance.now();

    function update(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      numEl.textContent = Math.floor(ease * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
      else numEl.textContent = target.toLocaleString();
    }
    requestAnimationFrame(update);
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) animateCounter(e.target); });
  }, { threshold: 0.5 });

  stats.forEach(s => io.observe(s));
}

/* ════════════════════════════════════════════════════════════
   5. SEARCH + FILTER
   ════════════════════════════════════════════════════════════ */
function initSearchFilter() {
  const searchInput = $('#destSearch');
  const clearBtn = $('#searchClear');
  const filterBtns = $$('.chip');
  const cards = $$('.dest-card');
  const noResults = $('#noResults');

  if (!searchInput) return;

  let activeFilter = 'all';
  let searchQuery = '';

  function applyFilters() {
    let visible = 0;

    cards.forEach(card => {
      const name = (card.dataset.name || '').toLowerCase();
      const category = card.dataset.category || '';
      const matchQ = !searchQuery || name.includes(searchQuery);
      const matchF = activeFilter === 'all' || category === activeFilter;
      const show = matchQ && matchF;
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    if (noResults) noResults.hidden = visible > 0;
  }

  on(searchInput, 'input', () => {
    searchQuery = searchInput.value.trim().toLowerCase();
    clearBtn.classList.toggle('visible', searchQuery.length > 0);
    applyFilters();
  });

  on(clearBtn, 'click', () => {
    searchInput.value = '';
    searchQuery = '';
    clearBtn.classList.remove('visible');
    searchInput.focus();
    applyFilters();
  });

  filterBtns.forEach(btn => {
    on(btn, 'click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      applyFilters();
    });
  });
}

/* ════════════════════════════════════════════════════════════
   6. EXPERIENCE TABS
   ════════════════════════════════════════════════════════════ */
function initExpTabs() {
  const tabBtns = $$('.tab-btn');
  const panels = $$('.tab-panel');
  if (!tabBtns.length) return;

  function activateTab(tabName) {
    tabBtns.forEach(b => {
      b.classList.toggle('active', b.dataset.tab === tabName);
      b.setAttribute('aria-selected', b.dataset.tab === tabName);
    });
    panels.forEach(p => {
      p.classList.toggle('active', p.dataset.panel === tabName);
    });
  }

  tabBtns.forEach(btn => {
    on(btn, 'click', () => activateTab(btn.dataset.tab));
  });
}

/* ════════════════════════════════════════════════════════════
   7. CULTURE ACCORDION
   ════════════════════════════════════════════════════════════ */
function initAccordion() {
  const items = $$('.acc-item');
  if (!items.length) return;

  items.forEach(item => {
    const header = $('.acc-header', item);
    on(header, 'click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      items.forEach(i => {
        i.classList.remove('open');
        $('.acc-header', i).setAttribute('aria-expanded', 'false');
      });
      // Toggle clicked
      if (!isOpen) {
        item.classList.add('open');
        header.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ════════════════════════════════════════════════════════════
   8. GALLERY LIGHTBOX
   ════════════════════════════════════════════════════════════ */
function initGallery() {
  const items = $$('.gal-item');
  const lightbox = $('#lightbox');
  const backdrop = $('#lbBackdrop');
  const lbImg = $('#lbImg');
  const lbCap = $('#lbCaption');
  const closeBtn = $('#lbClose');
  const prevBtn = $('#lbPrev');
  const nextBtn = $('#lbNext');
  if (!lightbox || !items.length) return;

  let currentIdx = 0;

  function open(idx) {
    currentIdx = (idx + items.length) % items.length;
    const item = items[currentIdx];
    lbImg.src = item.dataset.full || '';
    lbImg.alt = item.dataset.caption || '';
    lbCap.textContent = item.dataset.caption || '';
    lightbox.classList.add('active');
    backdrop.classList.add('active');
    lightbox.hidden = false;
    backdrop.hidden = false;
    document.body.style.overflow = 'hidden';
    lightbox.focus();
  }

  function close() {
    lightbox.classList.remove('active');
    backdrop.classList.remove('active');
    lightbox.hidden = true;
    backdrop.hidden = true;
    document.body.style.overflow = '';
  }

  items.forEach((item, i) => on(item, 'click', () => open(i)));
  on(closeBtn, 'click', close);
  on(backdrop, 'click', close);
  on(prevBtn, 'click', () => open(currentIdx - 1));
  on(nextBtn, 'click', () => open(currentIdx + 1));

  on(document, 'keydown', e => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') open(currentIdx - 1);
    if (e.key === 'ArrowRight') open(currentIdx + 1);
  });
}

/* ════════════════════════════════════════════════════════════
   9. TESTIMONIAL SLIDER
   ════════════════════════════════════════════════════════════ */
function initTestimonialSlider() {
  const slider = $('#testiSlider');
  const prevBtn = $('#testiPrev');
  const nextBtn = $('#testiNext');
  const dotsWrap = $('#testiDots');
  if (!slider) return;

  const cards = $$('.testi-card', slider);
  let currentIdx = 0;
  let perView = getPerView();
  let autoTimer = null;

  function getPerView() {
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 900) return 2;
    return 3;
  }

  function maxIdx() { return Math.max(0, cards.length - perView); }

  // Build dots
  function buildDots() {
    dotsWrap.innerHTML = '';
    const total = maxIdx() + 1;
    for (let i = 0; i < total; i++) {
      const d = document.createElement('button');
      d.className = 'tdot' + (i === currentIdx ? ' active' : '');
      d.setAttribute('aria-label', `Slide ${i + 1}`);
      on(d, 'click', () => goTo(i));
      dotsWrap.appendChild(d);
    }
  }

  function goTo(idx) {
    currentIdx = Math.max(0, Math.min(idx, maxIdx()));
    const cardW = cards[0].offsetWidth + 24; // gap = 1.5rem ≈24px
    slider.style.transform = `translateX(-${currentIdx * cardW}px)`;
    $$('.tdot').forEach((d, i) => d.classList.toggle('active', i === currentIdx));
  }

  const startAuto = () => { autoTimer = setInterval(() => goTo(currentIdx < maxIdx() ? currentIdx + 1 : 0), 4500); };
  const stopAuto = () => clearInterval(autoTimer);

  on(prevBtn, 'click', () => { goTo(currentIdx - 1); stopAuto(); startAuto(); });
  on(nextBtn, 'click', () => { goTo(currentIdx + 1); stopAuto(); startAuto(); });
  on(slider, 'mouseenter', stopAuto);
  on(slider, 'mouseleave', startAuto);

  // Touch swipe support
  let touchStartX = 0;
  on(slider, 'touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  on(slider, 'touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? currentIdx + 1 : currentIdx - 1);
  });

  // Rebuild on resize
  window.addEventListener('resize', debounce(() => {
    perView = getPerView();
    currentIdx = Math.min(currentIdx, maxIdx());
    buildDots();
    goTo(currentIdx);
  }, 300));

  buildDots();
  startAuto();
}

/* ════════════════════════════════════════════════════════════
   10. CONTACT FORM VALIDATION
   ════════════════════════════════════════════════════════════ */
function initContactForm() {
  const form = $('#contactForm');
  const successMsg = $('#formSuccess');
  const resetBtn = $('#resetForm');
  const submitBtn = $('#submitBtn');
  if (!form) return;

  function showError(fieldId, msg) {
    const el = $('#' + fieldId + 'Error');
    if (el) el.textContent = msg;
    const input = $('#' + fieldId);
    if (input) input.style.borderColor = '#e53e3e';
  }

  function clearError(fieldId) {
    const el = $('#' + fieldId + 'Error');
    if (el) el.textContent = '';
    const input = $('#' + fieldId);
    if (input) input.style.borderColor = '';
  }

  function validate() {
    let valid = true;
    const fname = $('#fname').value.trim();
    const femail = $('#femail').value.trim();

    clearError('fname'); clearError('femail');

    if (!fname) {
      showError('fname', 'First name is required.'); valid = false;
    } else if (fname.length < 2) {
      showError('fname', 'Name must be at least 2 characters.'); valid = false;
    }

    if (!femail) {
      showError('femail', 'Email address is required.'); valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(femail)) {
      showError('femail', 'Please enter a valid email.'); valid = false;
    }

    return valid;
  }

  // Live clearing of errors
  on($('#fname'), 'input', () => clearError('fname'));
  on($('#femail'), 'input', () => clearError('femail'));

  on(form, 'submit', e => {
    e.preventDefault();
    if (!validate()) return;

    // Simulate async send
    const btnText = $('.btn-text', submitBtn);
    const btnLoader = $('.btn-loader', submitBtn);
    submitBtn.disabled = true;
    if (btnText) btnText.hidden = true;
    if (btnLoader) btnLoader.hidden = false;

    setTimeout(() => {
      form.hidden = true;
      successMsg.hidden = false;
      submitBtn.disabled = false;
      if (btnText) btnText.hidden = false;
      if (btnLoader) btnLoader.hidden = true;
    }, 1400);
  });

  on(resetBtn, 'click', () => {
    form.reset();
    form.hidden = false;
    successMsg.hidden = true;
  });
}

/* ════════════════════════════════════════════════════════════
   11. SCROLL REVEAL (IntersectionObserver)
   ════════════════════════════════════════════════════════════ */
function initScrollReveal() {
  const els = $$('.reveal, .dest-card, .exp-card, .testi-card');
  if (!els.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        // Staggered delay for grid items
        const delay = e.target.classList.contains('dest-card') ||
          e.target.classList.contains('testi-card')
          ? (Array.from(e.target.parentElement.children).indexOf(e.target) % 3) * 90
          : 0;
        setTimeout(() => {
          e.target.classList.add('visible');
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0)';
        }, delay);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => {
    // Prepare non-.reveal elements too
    if (!el.classList.contains('reveal')) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity .6s ease, transform .6s ease';
    }
    io.observe(el);
  });
}

/* ════════════════════════════════════════════════════════════
   12. BACK TO TOP
   ════════════════════════════════════════════════════════════ */
function initBackToTop() {
  const btn = $('#backTop');
  if (!btn) return;
  on(btn, 'click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ════════════════════════════════════════════════════════════
   13. WISHLIST / HEART TOGGLE
   ════════════════════════════════════════════════════════════ */
function initWishlist() {
  const btns = $$('.wishlist-btn');
  const saved = new Set(JSON.parse(localStorage.getItem('wishlist') || '[]'));

  btns.forEach(btn => {
    const id = btn.dataset.id;
    if (saved.has(id)) {
      btn.textContent = '♥';
      btn.classList.add('active');
    }
    on(btn, 'click', e => {
      e.stopPropagation();
      if (saved.has(id)) {
        saved.delete(id);
        btn.textContent = '♡';
        btn.classList.remove('active');
      } else {
        saved.add(id);
        btn.textContent = '♥';
        btn.classList.add('active');
        // Pulse animation
        btn.style.transform = 'scale(1.4)';
        setTimeout(() => { btn.style.transform = ''; }, 300);
      }
      localStorage.setItem('wishlist', JSON.stringify([...saved]));
    });
  });
}

/* ════════════════════════════════════════════════════════════
   14. DESTINATION DETAIL MODAL
   ════════════════════════════════════════════════════════════ */
function initDestModal() {
  const modal = $('#destModal');
  const backdrop = $('#destModalBackdrop');
  const closeBtn = $('#destModalClose');
  const ctaBtn = $('#destModalCTA');
  if (!modal) return;

  // Full destination data
  const destData = {
    'taj-mahal': {
      title: 'Taj Mahal',
      tag: 'UNESCO Heritage',
      loc: '📍 Agra, Uttar Pradesh',
      rating: '★ 4.9',
      best: 'Oct – Mar',
      duration: '1–2 Days',
      img: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&q=85',
      desc: 'The Taj Mahal is a stunning ivory-white marble mausoleum on the bank of the river Yamuna. It was commissioned in 1632 by the Mughal emperor Shah Jahan to house the tomb of his favourite wife, Mumtaz Mahal. The Taj Mahal is the jewel of Muslim art in India and one of the universally admired masterpieces of the world\'s heritage. It attracts 7-8 million visitors a year.',
      highlights: [
        'Witness the breathtaking sunrise view from the Yamuna bank',
        'Marvel at intricate Pietra Dura marble inlay work',
        'Explore the Mughal gardens and reflecting pools',
        'Visit the nearby Agra Fort — another UNESCO site',
        'Best photographed in early morning golden light'
      ]
    },
    'kerala': {
      title: 'Kerala Backwaters',
      tag: 'Nature Escape',
      loc: '📍 Kerala',
      rating: '★ 4.8',
      best: 'Nov – Feb',
      duration: '3–5 Days',
      img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&q=85',
      desc: 'Kerala\'s backwaters are a network of interconnected canals, rivers, lakes and inlets stretching over 900 km. Cruise on a traditional Kettuvallam (houseboat) through palm-fringed waterways, witnessing daily life unfold on the banks. The serene beauty of Alleppey and Kumarakom is unmatched anywhere on earth.',
      highlights: [
        'Overnight houseboat cruise through Alleppey',
        'Authentic Kerala Sadhya meals onboard',
        'Visit spice plantations in Munnar',
        'Ayurvedic spa treatments in Kovalam',
        'Watch Kathakali performances and snake boat races'
      ]
    },
    'jaipur': {
      title: 'Pink City – Jaipur',
      tag: 'Royal Heritage',
      loc: '📍 Jaipur, Rajasthan',
      rating: '★ 4.8',
      best: 'Nov – Feb',
      duration: '2–3 Days',
      img: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1200&q=85',
      desc: 'Jaipur, the Pink City, is a stunning blend of regal history and vivid culture. Founded in 1727 by Maharaja Sawai Jai Singh II, it is India\'s first planned city. Magnificent forts like Amber tower over the landscape, while the Hawa Mahal\'s honeycomb facade has become an icon of Rajasthani architecture.',
      highlights: [
        'Elephant ride up to the majestic Amber Fort',
        'Photograph the iconic Hawa Mahal at sunset',
        'Shop for gemstones and block-printed textiles',
        'Explore the astronomical marvels of Jantar Mantar',
        'Savour Dal Baati Churma at a rooftop restaurant'
      ]
    },
    'himalayas': {
      title: 'Himalayan Ranges',
      tag: 'Adventure',
      loc: '📍 Himachal, Uttarakhand',
      rating: '★ 4.9',
      best: 'Mar – Jun',
      duration: '5–10 Days',
      img: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=85',
      desc: 'The Indian Himalayas span over 2,500 km across six states, offering some of the world\'s most breathtaking landscapes. From the flower-studded valleys of Uttarakhand to the stark deserts of Ladakh, every trail reveals new wonders. The region is sacred in Hinduism, Buddhism and Jainism, dotted with ashrams and monasteries.',
      highlights: [
        'Trek to Valley of Flowers (UNESCO site)',
        'Camp under stars in Spiti Valley at 14,000 ft',
        'Paraglide over the Kangra Valley from Bir Billing',
        'Visit the Dalai Lama\'s residence in Dharamshala',
        'Witness the mighty Himalayan sunrise from Auli'
      ]
    },
    'goa': {
      title: 'Goa Coastline',
      tag: 'Beach Paradise',
      loc: '📍 Goa',
      rating: '★ 4.7',
      best: 'Nov – Mar',
      duration: '3–5 Days',
      img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&q=85',
      desc: 'Goa is India\'s smallest state but packs an incredible punch. With 105 km of sun-drenched coastline, Portuguese colonial heritage, spice plantations, wildlife sanctuaries, and legendary nightlife, it caters to every type of traveler. From tranquil South Goa to vibrant North Goa — there\'s a beach for everyone.',
      highlights: [
        'Relax on the pristine Palolem and Agonda beaches',
        'Explore the UNESCO Old Goa churches and cathedrals',
        'Try authentic Goan fish curry and Bebinca dessert',
        'Party at the famous beach shacks of Anjuna',
        'Cruise through the Dudhsagar waterfalls'
      ]
    },
    'varanasi': {
      title: 'Varanasi Ghats',
      tag: 'Spiritual',
      loc: '📍 Varanasi, UP',
      rating: '★ 4.9',
      best: 'Oct – Mar',
      duration: '2–3 Days',
      img: 'https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=1200&q=85',
      desc: 'Varanasi, also known as Kashi, is one of the oldest continuously inhabited cities in the world — over 3,000 years old. The sacred city sits on the banks of the Ganges, where pilgrims come to bathe in holy waters and where the famous Ganga Aarti ceremony takes place every evening with fire, chanting, and bells.',
      highlights: [
        'Witness the mesmerizing Ganga Aarti at Dashashwamedh Ghat',
        'Take a sunrise boat ride on the Ganges',
        'Explore the narrow ancient lanes and silk weavers',
        'Visit the Kashi Vishwanath Temple',
        'Experience the spiritual energy of Manikarnika Ghat'
      ]
    },
    'ladakh': {
      title: 'Ladakh Valley',
      tag: 'Adventure',
      loc: '📍 Ladakh, J&K',
      rating: '★ 4.9',
      best: 'Jun – Sep',
      duration: '5–8 Days',
      img: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=1200&q=85',
      desc: 'Known as the "Land of High Passes", Ladakh is a cold desert in the northernmost part of India. With an average elevation of 3,500 m, it offers stark lunar landscapes, crystal-clear turquoise lakes like Pangong Tso, ancient Buddhist monasteries, and some of the most thrilling motorcycle and cycling routes in the world.',
      highlights: [
        'Drive the legendary Manali-Leh Highway',
        'Camp by the turquoise Pangong Tso Lake',
        'Visit the ancient Hemis and Thiksey Monasteries',
        'Experience the magnetic hill optical illusion',
        'Star gaze at one of the clearest night skies on Earth'
      ]
    },
    'ranthambore': {
      title: 'Ranthambore National Park',
      tag: 'Wildlife',
      loc: '📍 Ranthambore, Rajasthan',
      rating: '★ 4.7',
      best: 'Oct – Apr',
      duration: '2–3 Days',
      img: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1200&q=85',
      desc: 'Ranthambore National Park, a former royal hunting ground of the Maharajas of Jaipur, is now one of the best places on Earth to see Bengal tigers in the wild. Spread over 1,334 sq km, it is home to tigers, leopards, sloth bears, crocodiles, and over 300 bird species, all set against the dramatic backdrop of a 10th-century fort.',
      highlights: [
        'Track Bengal tigers on expert-led jeep safaris',
        'Photograph the iconic Ranthambore Fort with tigers',
        'Spot crocodiles at the Rajbagh and Padam lakes',
        'Enjoy a canter safari through the deciduous forest',
        'Visit the Ganesh Temple inside the fort'
      ]
    },
    'hampi': {
      title: 'Hampi Ruins',
      tag: 'UNESCO Heritage',
      loc: '📍 Hampi, Karnataka',
      rating: '★ 4.8',
      best: 'Oct – Feb',
      duration: '2–3 Days',
      img: 'https://images.unsplash.com/photo-1590419690008-905895e8fe0d?w=1200&q=85',
      desc: 'Hampi, a UNESCO World Heritage Site, is the otherworldly capital of the 14th-century Vijayanagara Empire. Enormous boulders scattered across a surreal landscape are interspersed with over 1,600 ruins — temples, palaces, markets, and aqueducts. It is one of the most extraordinary archaeological sites in the world.',
      highlights: [
        'Sunrise from the top of Matanga Hill',
        'Explore the Virupaksha Temple (still in active worship)',
        'See the iconic stone chariot at Vittala Temple',
        'Cross the Tungabhadra river by coracle boat',
        'Rock climb on the famous Hampi boulders'
      ]
    }
  };

  function openModal(destKey) {
    const data = destData[destKey];
    if (!data) return;

    $('#destModalImg').style.backgroundImage = `url('${data.img}')`;
    $('#destModalTag').textContent = data.tag;
    $('#destModalTitle').textContent = data.title;
    $('#destModalLoc').textContent = data.loc;
    $('#destModalDesc').textContent = data.desc;
    $('#destModalBest').textContent = data.best;
    $('#destModalRating').textContent = data.rating;
    $('#destModalDuration').textContent = data.duration;

    const hlList = $('#destModalHighlights');
    hlList.innerHTML = '';
    data.highlights.forEach(h => {
      const li = document.createElement('li');
      li.textContent = h;
      hlList.appendChild(li);
    });

    modal.classList.add('active');
    backdrop.classList.add('active');
    modal.hidden = false;
    backdrop.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    backdrop.classList.remove('active');
    modal.hidden = true;
    backdrop.hidden = true;
    document.body.style.overflow = '';
  }

  // Attach click to all Explore → buttons
  $$('.dest-btn').forEach(btn => {
    on(btn, 'click', e => {
      e.preventDefault();
      e.stopPropagation();
      openModal(btn.dataset.dest);
    });
  });

  on(closeBtn, 'click', closeModal);
  on(backdrop, 'click', closeModal);

  // CTA button in modal — close modal and scroll to contact
  on(ctaBtn, 'click', () => {
    closeModal();
  });

  // Escape key
  on(document, 'keydown', e => {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });
}

/* ════════════════════════════════════════════════════════════
   15. INFO MODAL (Privacy Policy / Terms of Use)
   ════════════════════════════════════════════════════════════ */
function initInfoModal() {
  const modal = $('#infoModal');
  const backdrop = $('#infoModalBackdrop');
  const closeBtn = $('#infoModalClose');
  const title = $('#infoModalTitle');
  const body = $('#infoModalBody');
  if (!modal) return;

  const content = {
    privacy: {
      title: 'Privacy Policy',
      body: `
        <p><strong>Last updated: February 2026</strong></p>
        <p>DiscoverIndia ("we", "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you visit our website.</p>
        <p><strong>Information We Collect:</strong> When you submit a contact form, we collect your name, email address, and travel preferences. We use cookies to improve your browsing experience.</p>
        <p><strong>How We Use Your Information:</strong> We use your information to respond to enquiries, send personalised itineraries, and improve our website experience. We never sell your data to third parties.</p>
        <p><strong>Data Security:</strong> We implement industry-standard security measures to protect your personal information from unauthorised access, alteration, or disclosure.</p>
        <p><strong>Contact Us:</strong> If you have questions about this policy, please reach out through our contact form.</p>
      `
    },
    terms: {
      title: 'Terms of Use',
      body: `
        <p><strong>Last updated: February 2026</strong></p>
        <p>By accessing and using the DiscoverIndia website, you agree to the following terms and conditions.</p>
        <p><strong>Content:</strong> All content on this website, including text, images, and design, is for informational and promotional purposes. While we strive for accuracy, travel details may change. Please verify all bookings independently.</p>
        <p><strong>User Conduct:</strong> You agree not to misuse our website, attempt unauthorised access, or use automated tools to scrape content.</p>
        <p><strong>Intellectual Property:</strong> All branding, design, and content are the property of DiscoverIndia. You may not reproduce or redistribute any materials without prior written consent.</p>
        <p><strong>Disclaimer:</strong> Travel involves inherent risks. DiscoverIndia provides information and planning assistance but is not liable for any incidents during your travel.</p>
        <p><strong>Changes:</strong> We reserve the right to update these terms at any time. Continued use of the website constitutes acceptance of updated terms.</p>
      `
    }
  };

  function openModal(key) {
    const data = content[key];
    if (!data) return;
    title.textContent = data.title;
    body.innerHTML = data.body;
    modal.classList.add('active');
    backdrop.classList.add('active');
    modal.hidden = false;
    backdrop.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    backdrop.classList.remove('active');
    modal.hidden = true;
    backdrop.hidden = true;
    document.body.style.overflow = '';
  }

  $$('.info-link').forEach(link => {
    on(link, 'click', e => {
      e.preventDefault();
      openModal(link.dataset.info);
    });
  });

  on(closeBtn, 'click', closeModal);
  on(backdrop, 'click', closeModal);

  on(document, 'keydown', e => {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });
}

/* ════════════════════════════════════════════════════════════
   HELPERS
   ════════════════════════════════════════════════════════════ */
function debounce(fn, wait) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
}
