(() => {
  'use strict';
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const googleUrl = 'https://www.google.com/maps/place/Ks+interio/@28.6381113,77.2796251,17z/data=!3m1!4b1!4m6!3m5!1s0x390cfde0ec230715:0x2d5aa878ea6c9447!8m2!3d28.6381113!4d77.2796251!16s%2Fg%2F11tfh7pysh';
  $$('[data-google-link]').forEach(link => { link.href = googleUrl; });
  $('#year').textContent = new Date().getFullYear();

  // One observer, no scroll handlers or continuous animation loops.
  if ('IntersectionObserver' in window && !reducedMotion) {
    document.documentElement.classList.add('motion-ready');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.07, rootMargin: '0px 0px -20px 0px' });
    $$('.reveal').forEach(element => observer.observe(element));
  }

  const menuToggle = $('.menu-toggle');
  const mobileNav = $('#mobile-nav');
  let menuCloseTimer;
  const headerSentinel = document.createElement('span');
  headerSentinel.className = 'header-sentinel';
  headerSentinel.setAttribute('aria-hidden', 'true');
  document.body.prepend(headerSentinel);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      $('#site-header').classList.toggle('is-scrolled', !entry.isIntersecting);
    }).observe(headerSentinel);
  }
  const closeMenu = () => {
    mobileNav.classList.remove('is-open');
    mobileNav.inert = true;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    document.body.classList.remove('menu-open');
    clearTimeout(menuCloseTimer);
    menuCloseTimer = setTimeout(() => { mobileNav.hidden = true; }, reducedMotion ? 0 : 350);
  };
  menuToggle.addEventListener('click', () => {
    const opening = menuToggle.getAttribute('aria-expanded') !== 'true';
    if (!opening) { closeMenu(); return; }
    clearTimeout(menuCloseTimer);
    mobileNav.hidden = false;
    mobileNav.inert = false;
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Close navigation');
    document.body.classList.add('menu-open');
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (menuToggle.getAttribute('aria-expanded') === 'true') mobileNav.classList.add('is-open');
    }));
  });
  $$('a', mobileNav).forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !mobileNav.hidden) { closeMenu(); menuToggle.focus(); }
    if (event.key === 'Tab' && !mobileNav.hidden) {
      const nodes = [$('.site-header .brand'), $('.header-cta'), menuToggle, ...$$('a', mobileNav)].filter(node => node.getClientRects().length);
      if (event.shiftKey && document.activeElement === nodes[0]) { event.preventDefault(); nodes.at(-1).focus(); }
      else if (!event.shiftKey && document.activeElement === nodes.at(-1)) { event.preventDefault(); nodes[0].focus(); }
    }
  });
  window.matchMedia('(min-width: 992px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

  const services = $$('.service-item');
  services.forEach(item => item.addEventListener('toggle', () => {
    if (!item.open) return;
    services.forEach(other => { if (other !== item) other.open = false; });
    $('#service-image').src = `assets/photos/${item.dataset.image}`;
    $('#service-image').alt = item.dataset.alt;
    $('#service-image-label').textContent = item.dataset.label;
    $('#service-image-index').textContent = `KS / ${String(services.indexOf(item) + 1).padStart(2, '0')}`;
  }));

  const filterButtons = $$('.filter');
  const projectCards = $$('.project-card');
  const loadMore = $('#portfolio-load-more');
  const portfolioCount = $('#portfolio-count');
  const initialProjectCount = 8;
  let activeFilter = 'all';
  let portfolioExpanded = false;
  const matchingProjects = () => projectCards.filter(card => activeFilter === 'all' || card.dataset.category === activeFilter);
  function updatePortfolio() {
    const matches = matchingProjects();
    const visible = new Set(portfolioExpanded ? matches : matches.slice(0, initialProjectCount));
    projectCards.forEach(card => {
      card.hidden = !visible.has(card);
      if (!card.hidden) card.classList.add('is-visible');
    });
    $('#portfolio-grid').classList.toggle('is-filtered', activeFilter !== 'all');
    portfolioCount.textContent = `Showing ${visible.size} of ${matches.length} photos`;
    loadMore.hidden = visible.size === matches.length;
    loadMore.setAttribute('aria-expanded', String(portfolioExpanded));
  }
  filterButtons.forEach(button => button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    portfolioExpanded = false;
    filterButtons.forEach(item => {
      item.classList.toggle('active', item === button);
      item.setAttribute('aria-pressed', String(item === button));
    });
    updatePortfolio();
  }));
  loadMore.addEventListener('click', () => {
    const firstNewCard = matchingProjects().find(card => card.hidden);
    portfolioExpanded = true;
    updatePortfolio();
    firstNewCard?.focus({ preventScroll: true });
  });
  updatePortfolio();

  const projects = [
  {
    "title": "Soft curves. A warmer welcome.",
    "category": "RESIDENTIAL / LIVING",
    "filter": "residential",
    "image": "post-DbIIoaOS-m4.webp",
    "alt": "KS Interio living room design with curved wall details, layered lighting and soft neutral seating",
    "description": "A living room design shared by KS Interio. Curved wall details, soft neutral seating and layered lighting create a calm, inviting direction for the space.",
    "status": "DESIGN STUDY",
    "service": "Residential Interiors",
    "post": "p/DbIIoaOS-m4",
    "width": 1200,
    "height": 1123
  },
  {
    "title": "A fresh take on everyday",
    "category": "MODULAR KITCHEN / BLUSH",
    "filter": "kitchen",
    "image": "post-Dc5ODsxEhji.webp",
    "alt": "Blush and charcoal modular kitchen design shared by KS Interio",
    "description": "Blush cabinetry, dark accents and a bright window give this kitchen design its character. The study brings together a clear layout and a playful, contemporary material palette.",
    "status": "DESIGN STUDY",
    "service": "Modular Kitchen",
    "post": "p/Dc5ODsxEhji",
    "width": 1085,
    "height": 814
  },
  {
    "title": "Your own quiet corner",
    "category": "RESIDENTIAL / BEDROOM",
    "filter": "residential",
    "image": "post-DaaXz-2Euvy.webp",
    "alt": "KS Interio bedroom design with nature-inspired wallpaper and soft neutral finishes",
    "description": "A bedroom design with nature-inspired wallpaper, soft neutrals and considered lighting. A restful direction, shared from the studio’s design gallery.",
    "status": "DESIGN STUDY",
    "service": "Residential Interiors",
    "post": "p/DaaXz-2Euvy",
    "width": 1037,
    "height": 672
  },
  {
    "title": "A café, reimagined",
    "category": "COMMERCIAL / CAFÉ",
    "filter": "commercial",
    "image": "post-DaU53_FEgAJ.webp",
    "alt": "Before-and-after café transformation shared by KS Interio",
    "description": "A before-and-after café transformation shared by KS Interio. Timber tones, decorative panels and warm lighting give the counter and seating area a fresh identity.",
    "status": "BEFORE & AFTER",
    "service": "Commercial Design",
    "post": "p/DaU53_FEgAJ",
    "width": 1200,
    "height": 1200
  },
  {
    "title": "Little room. Big possibilities.",
    "category": "RESIDENTIAL / CHILDREN’S ROOM",
    "filter": "residential",
    "image": "post-DahkEtrkkyj.webp",
    "alt": "A compact children’s bedroom with upholstered bed, built-in storage and a study desk",
    "description": "A children’s bedroom study from KS Interio, with a softly upholstered bed, integrated storage and a practical study corner.",
    "status": "DESIGN STUDY",
    "service": "Residential Interiors",
    "post": "p/DahkEtrkkyj",
    "width": 1187,
    "height": 1200
  },
  {
    "title": "A softer kind of luxury",
    "category": "RESIDENTIAL / BEDROOM",
    "filter": "residential",
    "image": "post-DaX0D-Zkou2.webp",
    "alt": "Classic neutral bedroom design with wall mouldings, soft upholstery and pendant lights",
    "description": "A bedroom design exploring crisp wall mouldings, muted neutrals and layered lighting. View the original post for the studio’s full design perspective.",
    "status": "DESIGN STUDY",
    "service": "Residential Interiors",
    "post": "p/DaX0D-Zkou2",
    "width": 997,
    "height": 622
  },
  {
    "title": "A palette with a purpose",
    "category": "RESIDENTIAL / MATERIALS",
    "filter": "residential",
    "image": "post-DdLcCokkhuF.webp",
    "alt": "KS Interio living room material board with marble, warm wood, upholstery and lighting selections",
    "description": "A living room material board bringing warm wood, marble, textured finishes and lighting into one coordinated design direction.",
    "status": "MATERIAL STUDY",
    "service": "Residential Interiors",
    "post": "p/DdLcCokkhuF",
    "width": 1014,
    "height": 664
  },
  {
    "title": "Every detail, considered",
    "category": "MODULAR KITCHEN / PLANNING",
    "filter": "kitchen",
    "image": "post-Dd3E6VMkq8z.webp",
    "alt": "Technical kitchen elevation drawing shared by KS Interio",
    "description": "A kitchen elevation study showing how the layout and cabinetry are planned before work begins. Open the original post to explore the full study.",
    "status": "TECHNICAL DRAWING",
    "service": "Modular Kitchen",
    "post": "p/Dd3E6VMkq8z",
    "width": 933,
    "height": 722
  },
  {
    "title": "Kitchen ideas, gathered",
    "category": "MODULAR KITCHEN",
    "filter": "kitchen",
    "image": "post-DaSJUPiSIcR.webp",
    "alt": "Modular kitchen design presentation — from KS Interio’s Instagram archive",
    "description": "Modular kitchen design presentation. Shared in KS Interio’s Instagram gallery. Open the original post for the full context and any additional images.",
    "status": "INSTAGRAM ARCHIVE",
    "service": "Modular Kitchen",
    "post": "p/DaSJUPiSIcR",
    "width": 1200,
    "height": 1200
  },
  {
    "title": "A vision for home",
    "category": "RESIDENTIAL",
    "filter": "residential",
    "image": "post-DaPp9Ugy_PE.webp",
    "alt": "Home design presentation from the studio — from KS Interio’s Instagram archive",
    "description": "Home design presentation from the studio. Shared in KS Interio’s Instagram gallery. Open the original post for the full context and any additional images.",
    "status": "INSTAGRAM ARCHIVE",
    "service": "Residential Interiors",
    "post": "p/DaPp9Ugy_PE",
    "width": 900,
    "height": 1200
  },
  {
    "title": "From plan to possibility",
    "category": "ARCHITECTURE",
    "filter": "architecture",
    "image": "post-DYCdJ89klzx.webp",
    "alt": "Architectural design presentation with a house and floor plan — from KS Interio’s Instagram archive",
    "description": "Architectural design presentation with a house and floor plan. Shared in KS Interio’s Instagram gallery. Open the original post for the full context and any additional images.",
    "status": "INSTAGRAM ARCHIVE",
    "service": "Residential Interiors",
    "post": "p/DYCdJ89klzx",
    "width": 1024,
    "height": 1024
  },
  {
    "title": "Clean lines. Daily ease.",
    "category": "MODULAR KITCHEN",
    "filter": "kitchen",
    "image": "post-DUf5SM5ktc4.webp",
    "alt": "Modular kitchen with white and dark cabinetry — from KS Interio’s Instagram archive",
    "description": "Modular kitchen with white and dark cabinetry. Shared in KS Interio’s Instagram gallery. Open the original post for the full context and any additional images.",
    "status": "INSTAGRAM ARCHIVE",
    "service": "Modular Kitchen",
    "post": "p/DUf5SM5ktc4",
    "width": 900,
    "height": 1200
  },
  {
    "title": "Warm wood, well planned",
    "category": "MODULAR KITCHEN",
    "filter": "kitchen",
    "image": "post-DRhIWpIEt_t.webp",
    "alt": "Kitchen cabinet elevations in warm timber tones — from KS Interio’s Instagram archive",
    "description": "Kitchen cabinet elevations in warm timber tones. Shared in KS Interio’s Instagram gallery. Open the original post for the full context and any additional images.",
    "status": "INSTAGRAM ARCHIVE",
    "service": "Modular Kitchen",
    "post": "p/DRhIWpIEt_t",
    "width": 1200,
    "height": 1200
  },
  {
    "title": "The people behind the spaces",
    "category": "STUDIO JOURNAL",
    "filter": "journal",
    "image": "post-DQB7P2BkmGN.webp",
    "alt": "A collage of studio and client moments — from KS Interio’s Instagram archive",
    "description": "A collage of studio and client moments. Shared in KS Interio’s Instagram gallery. Open the original post for the full context and any additional images.",
    "status": "STUDIO MOMENT",
    "service": "Residential Interiors",
    "post": "p/DQB7P2BkmGN",
    "width": 1200,
    "height": 1200
  },
  {
    "title": "A moment on site",
    "category": "STUDIO JOURNAL",
    "filter": "journal",
    "image": "post-DNptnYvS6RE.webp",
    "alt": "A studio moment at a commercial space — from KS Interio’s Instagram archive",
    "description": "A studio moment at a commercial space. Shared in KS Interio’s Instagram gallery. Open the original post for the full context and any additional images.",
    "status": "STUDIO MOMENT",
    "service": "Residential Interiors",
    "post": "p/DNptnYvS6RE",
    "width": 1027,
    "height": 1200
  },
  {
    "title": "Light, lines and storage",
    "category": "MODULAR KITCHEN",
    "filter": "kitchen",
    "image": "post-DM_JmkJzHjX.webp",
    "alt": "Neutral modular kitchen with integrated cabinetry — from KS Interio’s Instagram archive",
    "description": "Neutral modular kitchen with integrated cabinetry. Shared in KS Interio’s Instagram gallery. Open the original post for the full context and any additional images.",
    "status": "INSTAGRAM ARCHIVE",
    "service": "Modular Kitchen",
    "post": "p/DM_JmkJzHjX",
    "width": 1200,
    "height": 1075
  },
  {
    "title": "Room to unwind",
    "category": "RESIDENTIAL",
    "filter": "residential",
    "image": "post-DMmRJB9y6aX.webp",
    "alt": "Neutral bedroom and sitting area design — from KS Interio’s Instagram archive",
    "description": "Neutral bedroom and sitting area design. Shared in KS Interio’s Instagram gallery. Open the original post for the full context and any additional images.",
    "status": "INSTAGRAM ARCHIVE",
    "service": "Residential Interiors",
    "post": "p/DMmRJB9y6aX",
    "width": 717,
    "height": 401
  },
  {
    "title": "A space with presence",
    "category": "COMMERCIAL",
    "filter": "commercial",
    "image": "post-DMKtMqqSDTx.webp",
    "alt": "A retail interior with display shelves and curved wall details — from KS Interio’s Instagram archive",
    "description": "A retail interior with display shelves and curved wall details. Shared in KS Interio’s Instagram gallery. Open the original post for the full context and any additional images.",
    "status": "INSTAGRAM ARCHIVE",
    "service": "Commercial Design",
    "post": "p/DMKtMqqSDTx",
    "width": 1200,
    "height": 1200
  },
  {
    "title": "Rest, beautifully framed",
    "category": "RESIDENTIAL",
    "filter": "residential",
    "image": "post-DI5NTmLSfum.webp",
    "alt": "Bedroom design with layered lighting and a feature headboard — from KS Interio’s Instagram archive",
    "description": "Bedroom design with layered lighting and a feature headboard. Shared in KS Interio’s Instagram gallery. Open the original post for the full context and any additional images.",
    "status": "INSTAGRAM ARCHIVE",
    "service": "Residential Interiors",
    "post": "p/DI5NTmLSfum",
    "width": 1200,
    "height": 1028
  },
  {
    "title": "A considered daily ritual",
    "category": "RESIDENTIAL",
    "filter": "residential",
    "image": "post-DI25o2SysrQ.webp",
    "alt": "Bathroom design with timber accents and a floating vanity — from KS Interio’s Instagram archive",
    "description": "Bathroom design with timber accents and a floating vanity. Shared in KS Interio’s Instagram gallery. Open the original post for the full context and any additional images.",
    "status": "INSTAGRAM ARCHIVE",
    "service": "Residential Interiors",
    "post": "p/DI25o2SysrQ",
    "width": 1003,
    "height": 921
  },
  {
    "title": "Made for the everyday",
    "category": "MODULAR KITCHEN",
    "filter": "kitchen",
    "image": "post-DI06qU1S71E.webp",
    "alt": "White and wood modular kitchen design — from KS Interio’s Instagram archive",
    "description": "White and wood modular kitchen design. Shared in KS Interio’s Instagram gallery. Open the original post for the full context and any additional images.",
    "status": "INSTAGRAM ARCHIVE",
    "service": "Modular Kitchen",
    "post": "p/DI06qU1S71E",
    "width": 899,
    "height": 505
  },
  {
    "title": "A new year, new possibilities",
    "category": "STUDIO JOURNAL",
    "filter": "journal",
    "image": "post-DERfazUSQma.webp",
    "alt": "New Year greeting shared by KS Interio — from KS Interio’s Instagram archive",
    "description": "New Year greeting shared by KS Interio. Shared in KS Interio’s Instagram gallery. Open the original post for the full context and any additional images.",
    "status": "STUDIO MOMENT",
    "service": "Residential Interiors",
    "post": "p/DERfazUSQma",
    "width": 1080,
    "height": 1080
  },
  {
    "title": "Warmth in the details",
    "category": "RESIDENTIAL",
    "filter": "residential",
    "image": "post-DEMdF4dShL6.webp",
    "alt": "Warm neutral living room design with decorative wall panels — from KS Interio’s Instagram archive",
    "description": "Warm neutral living room design with decorative wall panels. Shared in KS Interio’s Instagram gallery. Open the original post for the full context and any additional images.",
    "status": "INSTAGRAM ARCHIVE",
    "service": "Residential Interiors",
    "post": "p/DEMdF4dShL6",
    "width": 879,
    "height": 607
  },
  {
    "title": "A little colour, a lot of character",
    "category": "MODULAR KITCHEN",
    "filter": "kitchen",
    "image": "post-DEHrcGPyRga.webp",
    "alt": "Teal and white modular kitchen design — from KS Interio’s Instagram archive",
    "description": "Teal and white modular kitchen design. Shared in KS Interio’s Instagram gallery. Open the original post for the full context and any additional images.",
    "status": "INSTAGRAM ARCHIVE",
    "service": "Modular Kitchen",
    "post": "p/DEHrcGPyRga",
    "width": 1179,
    "height": 1061
  },
  {
    "title": "Good design begins with a plan",
    "category": "MODULAR KITCHEN",
    "filter": "kitchen",
    "image": "post-DEE0amWSZMQ.webp",
    "alt": "Technical kitchen floor plan — from KS Interio’s Instagram archive",
    "description": "Technical kitchen floor plan. Shared in KS Interio’s Instagram gallery. Open the original post for the full context and any additional images.",
    "status": "INSTAGRAM ARCHIVE",
    "service": "Modular Kitchen",
    "post": "p/DEE0amWSZMQ",
    "width": 737,
    "height": 491
  },
  {
    "title": "Light changes everything",
    "category": "RESIDENTIAL",
    "filter": "residential",
    "image": "post-DDTjSS8x1R6.webp",
    "alt": "An interior with a decorative ceiling and accent lighting — from KS Interio’s Instagram archive",
    "description": "An interior with a decorative ceiling and accent lighting. Shared in KS Interio’s Instagram gallery. Open the original post for the full context and any additional images.",
    "status": "INSTAGRAM ARCHIVE",
    "service": "Residential Interiors",
    "post": "p/DDTjSS8x1R6",
    "width": 960,
    "height": 1200
  },
  {
    "title": "A new point of view",
    "category": "ARCHITECTURE",
    "filter": "architecture",
    "image": "post-DC7Kp90BBHD.webp",
    "alt": "Contemporary multi-storey house facade design — from KS Interio’s Instagram archive",
    "description": "Contemporary multi-storey house facade design. Shared in KS Interio’s Instagram gallery. Open the original post for the full context and any additional images.",
    "status": "INSTAGRAM ARCHIVE",
    "service": "Residential Interiors",
    "post": "p/DC7Kp90BBHD",
    "width": 960,
    "height": 1200
  },
  {
    "title": "Ideas for your next kitchen",
    "category": "MODULAR KITCHEN",
    "filter": "kitchen",
    "image": "post-DCO5dkIyRvT.webp",
    "alt": "Kitchen design presentation from the studio — from KS Interio’s Instagram archive",
    "description": "Kitchen design presentation from the studio. Shared in KS Interio’s Instagram gallery. Open the original post for the full context and any additional images.",
    "status": "INSTAGRAM ARCHIVE",
    "service": "Modular Kitchen",
    "post": "p/DCO5dkIyRvT",
    "width": 1199,
    "height": 628
  },
  {
    "title": "Quietly contemporary",
    "category": "MODULAR KITCHEN",
    "filter": "kitchen",
    "image": "post-DCEjgk5TBrp.webp",
    "alt": "Dark neutral kitchen design with a bright window — from KS Interio’s Instagram archive",
    "description": "Dark neutral kitchen design with a bright window. Shared in KS Interio’s Instagram gallery. Open the original post for the full context and any additional images.",
    "status": "INSTAGRAM ARCHIVE",
    "service": "Modular Kitchen",
    "post": "p/DCEjgk5TBrp",
    "width": 1058,
    "height": 1200
  },
  {
    "title": "Designed from the outside in",
    "category": "ARCHITECTURE",
    "filter": "architecture",
    "image": "post-DAtGG2jTvFS.webp",
    "alt": "Compact contemporary facade design — from KS Interio’s Instagram archive",
    "description": "Compact contemporary facade design. Shared in KS Interio’s Instagram gallery. Open the original post for the full context and any additional images.",
    "status": "INSTAGRAM ARCHIVE",
    "service": "Residential Interiors",
    "post": "p/DAtGG2jTvFS",
    "width": 1119,
    "height": 1200
  },
  {
    "title": "The kitchen edit",
    "category": "MODULAR KITCHEN",
    "filter": "kitchen",
    "image": "post-DATFggPSfMd.webp",
    "alt": "Kitchen decoration and material palette presentation — from KS Interio’s Instagram archive",
    "description": "Kitchen decoration and material palette presentation. Shared in KS Interio’s Instagram gallery. Open the original post for the full context and any additional images.",
    "status": "INSTAGRAM ARCHIVE",
    "service": "Modular Kitchen",
    "post": "p/DATFggPSfMd",
    "width": 1004,
    "height": 1004
  },
  {
    "title": "A brighter everyday",
    "category": "MODULAR KITCHEN",
    "filter": "kitchen",
    "image": "post-DAOqtBDzlf0.webp",
    "alt": "Light neutral kitchen with a large window — from KS Interio’s Instagram archive",
    "description": "Light neutral kitchen with a large window. Shared in KS Interio’s Instagram gallery. Open the original post for the full context and any additional images.",
    "status": "INSTAGRAM ARCHIVE",
    "service": "Modular Kitchen",
    "post": "p/DAOqtBDzlf0",
    "width": 1200,
    "height": 900
  },
  {
    "title": "Colour meets function",
    "category": "MODULAR KITCHEN",
    "filter": "kitchen",
    "image": "post-C-snylwS63Z.webp",
    "alt": "Compact teal kitchen with patterned backsplash — from KS Interio’s Instagram archive",
    "description": "Compact teal kitchen with patterned backsplash. Shared in KS Interio’s Instagram gallery. Open the original post for the full context and any additional images.",
    "status": "INSTAGRAM ARCHIVE",
    "service": "Modular Kitchen",
    "post": "p/C-snylwS63Z",
    "width": 960,
    "height": 1200
  },
  {
    "title": "A window into the brand",
    "category": "COMMERCIAL",
    "filter": "commercial",
    "image": "post-C22EfOZPl4M.webp",
    "alt": "Retail storefront design with glazed frontage — from KS Interio’s Instagram archive",
    "description": "Retail storefront design with glazed frontage. Shared in KS Interio’s Instagram gallery. Open the original post for the full context and any additional images.",
    "status": "INSTAGRAM ARCHIVE",
    "service": "Commercial Design",
    "post": "p/C22EfOZPl4M",
    "width": 1200,
    "height": 799
  },
  {
    "title": "Make room for a focal point",
    "category": "RESIDENTIAL",
    "filter": "residential",
    "image": "post-Cjml5XyLjen.webp",
    "alt": "Living room wall design with geometric panels — from KS Interio’s Instagram archive",
    "description": "Living room wall design with geometric panels. Shared in KS Interio’s Instagram gallery. Open the original post for the full context and any additional images.",
    "status": "INSTAGRAM ARCHIVE",
    "service": "Residential Interiors",
    "post": "p/Cjml5XyLjen",
    "width": 961,
    "height": 1200
  },
  {
    "title": "Where the details come together",
    "category": "MODULAR KITCHEN",
    "filter": "kitchen",
    "image": "post-CjAATa-rv2M.webp",
    "alt": "A bright kitchen interior with overhead timber details — from KS Interio’s Instagram archive",
    "description": "A bright kitchen interior with overhead timber details. Shared in KS Interio’s Instagram gallery. Open the original post for the full context and any additional images.",
    "status": "INSTAGRAM ARCHIVE",
    "service": "Modular Kitchen",
    "post": "p/CjAATa-rv2M",
    "width": 960,
    "height": 1200
  },
  {
    "title": "An architectural perspective",
    "category": "ARCHITECTURE",
    "filter": "architecture",
    "image": "post-CeVFgA6Nyuo.webp",
    "alt": "Modern residence design with broad balconies — from KS Interio’s Instagram archive",
    "description": "Modern residence design with broad balconies. Shared in KS Interio’s Instagram gallery. Open the original post for the full context and any additional images.",
    "status": "INSTAGRAM ARCHIVE",
    "service": "Residential Interiors",
    "post": "p/CeVFgA6Nyuo",
    "width": 1200,
    "height": 675
  },
  {
    "title": "A calm place to end the day",
    "category": "RESIDENTIAL",
    "filter": "residential",
    "image": "post-CSTI1BCBW9N.webp",
    "alt": "Bedroom design with soft lighting and a padded bed — from KS Interio’s Instagram archive",
    "description": "Bedroom design with soft lighting and a padded bed. Shared in KS Interio’s Instagram gallery. Open the original post for the full context and any additional images.",
    "status": "INSTAGRAM ARCHIVE",
    "service": "Residential Interiors",
    "post": "p/CSTI1BCBW9N",
    "width": 1080,
    "height": 1080
  },
  {
    "title": "Gather around",
    "category": "RESIDENTIAL",
    "filter": "residential",
    "image": "post-CSRaYEnBeTy.webp",
    "alt": "Dining space design with blue seating and decorative lighting — from KS Interio’s Instagram archive",
    "description": "Dining space design with blue seating and decorative lighting. Shared in KS Interio’s Instagram gallery. Open the original post for the full context and any additional images.",
    "status": "INSTAGRAM ARCHIVE",
    "service": "Residential Interiors",
    "post": "p/CSRaYEnBeTy",
    "width": 1024,
    "height": 1024
  },
  {
    "title": "Living in full colour",
    "category": "RESIDENTIAL",
    "filter": "residential",
    "image": "post-CSRZ-nxBZQs.webp",
    "alt": "Double-height living room design with colourful seating — from KS Interio’s Instagram archive",
    "description": "Double-height living room design with colourful seating. Shared in KS Interio’s Instagram gallery. Open the original post for the full context and any additional images.",
    "status": "INSTAGRAM ARCHIVE",
    "service": "Residential Interiors",
    "post": "p/CSRZ-nxBZQs",
    "width": 1080,
    "height": 1080
  }
];
  const projectDialog = $('#project-dialog');
  const openDialog = dialog => { dialog.showModal(); document.body.classList.add('has-dialog'); };
  $$('dialog').forEach(dialog => {
    $('.dialog-close', dialog).addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      const rect = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
    });
    dialog.addEventListener('close', () => document.body.classList.remove('has-dialog'));
  });
  projectCards.forEach(card => card.addEventListener('click', () => {
    const project = projects[Number(card.dataset.project)];
    $('#dialog-title').textContent = project.title;
    $('#dialog-category').textContent = project.category;
    $('#dialog-image').src = `assets/instagram/${project.image}`;
    $('#dialog-image').alt = project.alt;
    $('#dialog-image').width = project.width;
    $('#dialog-image').height = project.height;
    $('#dialog-description').textContent = project.description;
    $('#dialog-stage').textContent = project.status;
    $('#dialog-source').href = `https://www.instagram.com/ksinterio/${project.post}/`;
    $('#dialog-cta').dataset.interest = project.title;
    $('#dialog-cta').dataset.service = project.service;
    openDialog(projectDialog);
  }));
  const note = $('#project-note');
  const serviceNeeded = $('#service-needed');
  $('#dialog-cta').addEventListener('click', event => {
    serviceNeeded.value = event.currentTarget.dataset.service;
    if (!note.value.trim()) note.value = `I'm inspired by “${event.currentTarget.dataset.interest}” and would love to explore this direction.`;
    projectDialog.close();
    setTimeout(() => $('#client-name').focus({ preventScroll: true }), reducedMotion ? 0 : 450);
  });
  $$('[data-interest]').forEach(link => link.addEventListener('click', () => {
    serviceNeeded.value = link.dataset.interest;
    if (!note.value.trim()) note.value = `I'd like to discuss ${link.dataset.interest.toLowerCase()} for my space.`;
  }));
  $('.privacy-trigger').addEventListener('click', () => openDialog($('#privacy-dialog')));

  const reviews = [
  {
    "name": "Rk editing Vk designs",
    "initial": "R",
    "quote": "Quality work with perfect finishing. Loved the designs.",
    "source": "https://www.google.com/maps/contrib/117225250936772513463?hl=en-IN"
  },
  {
    "name": "Anjali",
    "initial": "A",
    "quote": "Loved their work",
    "source": "https://www.google.com/maps/place/Ks+interio/@28.6381113,77.2796251,17z/data=!4m8!3m7!1s0x390cfde0ec230715:0x2d5aa878ea6c9447!8m2!3d28.6381113!4d77.2796251!9m1!1b1!16s%2Fg%2F11tfh7pysh"
  },
  {
    "name": "Sanjeev Ruhella",
    "initial": "S",
    "quote": "Best service and timely completed project",
    "source": "https://www.google.com/maps/place/Ks+interio/@28.6381113,77.2796251,17z/data=!4m8!3m7!1s0x390cfde0ec230715:0x2d5aa878ea6c9447!8m2!3d28.6381113!4d77.2796251!9m1!1b1!16s%2Fg%2F11tfh7pysh"
  }
];
  let reviewIndex = 0;
  let reviewAnimation;
  const reviewCarousel = $('#review-carousel');
  const reviewDots = $$('.review-dot');
  function showReview(index) {
    reviewIndex = (index + reviews.length) % reviews.length;
    const review = reviews[reviewIndex];
    $('#review-text').textContent = review.quote;
    $('#review-avatar').textContent = review.initial;
    $('#review-author').textContent = review.name;
    $('#review-author').href = review.source;
    $('#review-position').textContent = `${String(reviewIndex + 1).padStart(2, '0')} / ${String(reviews.length).padStart(2, '0')}`;
    reviewDots.forEach((dot, i) => dot.setAttribute('aria-pressed', String(i === reviewIndex)));
    $('#review-announcement').textContent = `Review ${reviewIndex + 1} of ${reviews.length}. ${review.name}: ${review.quote}`;
    if (!reducedMotion && $('#review-text').animate) {
      reviewAnimation?.cancel();
      reviewAnimation = $('#review-text').animate([{ opacity: .25, transform: 'translateY(6px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 250, easing: 'ease-out' });
    }
  }
  $('#review-prev').addEventListener('click', () => showReview(reviewIndex - 1));
  $('#review-next').addEventListener('click', () => showReview(reviewIndex + 1));
  reviewDots.forEach(dot => dot.addEventListener('click', () => showReview(Number(dot.dataset.review))));
  reviewCarousel.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showReview(reviewIndex + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });
  $('.review-controls').hidden = false;

  // Photo tiles remain local; only the two reel buttons load Instagram.
  const reelDialog = $('#reel-dialog');
  let instagramScript;
  let reelObserver;
  const loadInstagram = () => {
    if (window.instgrm?.Embeds) return Promise.resolve();
    if (!instagramScript) instagramScript = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://www.instagram.com/embed.js';
      script.async = true;
      script.onload = resolve;
      script.onerror = () => { script.remove(); instagramScript = null; reject(new Error('Instagram unavailable')); };
      document.body.append(script);
    });
    return instagramScript;
  };
  $$('.instagram-reel').forEach(button => button.addEventListener('click', () => {
    const url = `https://www.instagram.com/reel/${button.dataset.reel}/`;
    const container = $('#reel-embed');
    const status = $('#reel-status');
    reelObserver?.disconnect();
    $('#reel-title').textContent = button.dataset.reelTitle;
    $('#reel-source').href = url;
    status.textContent = 'Loading reel…';
    const blockquote = document.createElement('blockquote');
    blockquote.className = 'instagram-media';
    blockquote.dataset.instgrmPermalink = url;
    blockquote.dataset.instgrmVersion = '14';
    const fallback = document.createElement('a');
    fallback.href = url;
    fallback.textContent = 'Watch this reel on Instagram';
    fallback.target = '_blank';
    fallback.rel = 'noopener noreferrer';
    blockquote.append(fallback);
    container.replaceChildren(blockquote);
    reelObserver = new MutationObserver(() => {
      const frame = $('iframe', container);
      if (frame) {
        frame.title = `KS Interio reel: ${button.dataset.reelTitle}`;
        reelObserver.disconnect();
      }
    });
    reelObserver.observe(container, { childList: true, subtree: true });
    openDialog(reelDialog);
    loadInstagram().then(() => {
      if (!reelDialog.open || $('#reel-source').href !== url) return;
      window.instgrm?.Embeds.process();
      status.textContent = 'Instagram may ask you to sign in. You can also watch using the link below.';
    }).catch(() => { status.textContent = 'The reel could not load here. Use “Watch on Instagram” below.'; });
  }));
  reelDialog.addEventListener('close', () => {
    reelObserver?.disconnect();
    $('#reel-embed').replaceChildren();
  });

  const form = $('#consultation-form');
  const phone = $('#client-phone');
  const name = $('#client-name');
  const location = $('#site-location');
  const email = $('#client-email');
  const fields = $$('input, select, textarea', form);
  const errors = $('#form-errors');
  const renderFieldError = field => {
    let error = $(`#error-${field.id}`);
    const invalid = !field.validity.valid;
    field.setAttribute('aria-invalid', String(invalid));
    if (!error && invalid) {
      error = document.createElement('span');
      error.id = `error-${field.id}`;
      error.className = 'field-error';
      field.after(error);
      field.setAttribute('aria-describedby', [field.getAttribute('aria-describedby'), error.id].filter(Boolean).join(' '));
    }
    if (error) {
      error.hidden = !invalid;
      error.textContent = invalid ? field.validationMessage : '';
    }
  };
  form.noValidate = true;
  const validatePhone = () => phone.setCustomValidity(phone.value && !/^[6-9][0-9]{9}$/.test(phone.value) ? 'Please enter a 10-digit Indian mobile number starting with 6, 7, 8 or 9.' : '');
  fields.forEach(input => input.addEventListener('input', () => {
    input.setCustomValidity('');
    if (input === phone) validatePhone();
    if (input.hasAttribute('aria-invalid')) renderFieldError(input);
    if (fields.every(field => field.validity.valid)) errors.hidden = true;
    $('#form-feedback').hidden = true;
  }));
  phone.addEventListener('invalid', validatePhone);
  form.addEventListener('submit', event => {
    event.preventDefault();
    name.setCustomValidity(name.value.trim().length < 2 ? 'Please enter your name.' : '');
    location.setCustomValidity(location.value.trim().length < 2 ? 'Please enter your site location.' : '');
    validatePhone();
    fields.forEach(renderFieldError);
    const firstInvalid = fields.find(field => !field.validity.valid);
    if (firstInvalid) {
      errors.textContent = 'Please check the highlighted fields so we can prepare your enquiry.';
      errors.hidden = false;
      firstInvalid.focus({ preventScroll: true });
      firstInvalid.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
      return;
    }
    errors.hidden = true;
    const message = [
      'Hi KS Interio! I’d like to discuss my space.', '',
      `Client name: ${name.value.trim()}`,
      `Contact: ${phone.value.trim()}`,
      ...(email.value.trim() ? [`Email: ${email.value.trim()}`] : []),
      `Service needed: ${serviceNeeded.value}`,
      `Site location: ${location.value.trim()}`,
      `Budget: ${$('#budget').value}`,
      ...(note.value.trim() ? ['', `About my space: ${note.value.trim()}`] : []),
      '', 'Sent from the KS Interio website.'
    ].join('\n');
    const whatsappUrl = `https://wa.me/919354393499?text=${encodeURIComponent(message)}`;
    $('#whatsapp-continue').href = whatsappUrl;
    $('#form-feedback').hidden = false;
    // Same-tab navigation works on mobile and is not blocked as a popup.
    window.location.assign(whatsappUrl);
  });
  form.hidden = false;
  $('#form-fallback').hidden = true;
})();
