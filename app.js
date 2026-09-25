/**
 * ============================================================================
 * SANDHRA BAKES – HOMEMADE CAKES, KOTTAYAM
 * Website Interactive Scripts, Motion Cursor, Reviews Carousel & Order Modal
 * ============================================================================
 */

// Central Google Form Configuration URL
const GOOGLE_FORM_URL = "https://forms.gle/xJKgekkCB4yArpEN9";

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Footer Copyright Year
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ==========================================================================
     2. MOTION CURSOR ANIMATION (SMOOTH LERP & HOVER EXPANSION)
     ========================================================================== */
  const cursorDot = document.getElementById('cursorDot');
  const cursorTrail = document.getElementById('cursorTrail');
  const customCursor = document.getElementById('customCursor');

  const isFinePointer = window.matchMedia('(pointer: fine)').matches;

  if (isFinePointer && cursorDot && cursorTrail) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let trailX = mouseX;
    let trailY = mouseY;
    let isVisible = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        if (customCursor) customCursor.style.opacity = '1';
      }

      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    }, { passive: true });

    function animateCursor() {
      trailX += (mouseX - trailX) * 0.18;
      trailY += (mouseY - trailY) * 0.18;

      cursorTrail.style.left = `${trailX}px`;
      cursorTrail.style.top = `${trailY}px`;

      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    window.addEventListener('mousedown', () => {
      document.body.classList.add('cursor-clicked');
    });

    window.addEventListener('mouseup', () => {
      document.body.classList.remove('cursor-clicked');
    });

    document.addEventListener('mouseleave', () => {
      if (customCursor) customCursor.style.opacity = '0';
      isVisible = false;
    });

    document.addEventListener('mouseenter', () => {
      if (customCursor) customCursor.style.opacity = '1';
      isVisible = true;
    });

    const interactiveSelectors = [
      'a', 'button', 'input', 'select', 'textarea',
      '.sig-product-card', '.why-card', '.gallery-card',
      '.filter-tab', '.dot', '.slider-btn', '.order-step-card'
    ];

    document.querySelectorAll(interactiveSelectors.join(', ')).forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-active'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-active'));
    });
  }

  /* ==========================================================================
     3. STICKY HEADER & SCROLLSPY ACTIVE NAV LINK HIGHLIGHTING
     ========================================================================== */
  const header = document.getElementById('siteHeader');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    let currentSection = 'hero';
    const scrollPos = window.scrollY + 160;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    if (currentSection) {
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          link.classList.toggle('active', href === `#${currentSection}`);
        }
      });
      mobileNavLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          link.classList.toggle('active', href === `#${currentSection}`);
        }
      });
    }
  }, { passive: true });

  // In-Page Smooth Scrolling with Header Offset
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerEl = document.getElementById('siteHeader');
        const headerHeight = headerEl ? headerEl.offsetHeight : 70;
        const targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight - 10;

        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });

        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === targetId));
        mobileNavLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === targetId));
      }
    });
  });

  /* ==========================================================================
     4. MOBILE NAVIGATION DRAWER
     ========================================================================== */
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');

  function toggleMobileMenu(forceClose = false) {
    if (!mobileDrawer || !mobileToggle) return;
    const isOpen = forceClose ? false : !mobileDrawer.classList.contains('is-open');
    mobileToggle.classList.toggle('is-active', isOpen);
    mobileDrawer.classList.toggle('is-open', isOpen);
    mobileToggle.setAttribute('aria-expanded', isOpen);
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });
  }

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => toggleMobileMenu(true));
  });

  document.addEventListener('click', (e) => {
    if (mobileDrawer && mobileDrawer.classList.contains('is-open')) {
      if (!mobileDrawer.contains(e.target) && !mobileToggle.contains(e.target)) {
        toggleMobileMenu(true);
      }
    }
  });

  /* ==========================================================================
     5. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal');

  function revealVisibleElements() {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < vh + 80) {
        el.classList.add('is-revealed');
      }
    });
  }

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '40px 0px 40px 0px',
      threshold: 0.05
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  revealVisibleElements();
  window.addEventListener('load', revealVisibleElements);
  window.addEventListener('resize', revealVisibleElements, { passive: true });

  // Failsafe timer: guarantee all elements are visible after 350ms
  setTimeout(() => {
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }, 350);

  /* ==========================================================================
     6. CELEBRATION CONFETTI PARTICLE ANIMATION
     ========================================================================== */
  function triggerConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = [];
    const colors = ['#0B3D2E', '#C89B3C', '#E8C882', '#FFF8F0', '#25D366', '#164E3D'];

    for (let i = 0; i < 90; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * -canvas.height * 0.4,
        size: Math.random() * 8 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: (Math.random() - 0.5) * 4,
        speedY: Math.random() * 4 + 3,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8
      });
    }

    let animationFrame;
    const startTime = Date.now();

    function renderConfetti() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const elapsed = Date.now() - startTime;

      pieces.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });

      if (elapsed < 3200) {
        animationFrame = requestAnimationFrame(renderConfetti);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(animationFrame);
      }
    }

    renderConfetti();
  }
  window.triggerConfetti = triggerConfetti;

  /* ==========================================================================
     7. PREMIUM INTERACTIVE ORDER MODAL (Google Form Automation)
     ========================================================================== */
  const orderModal = document.getElementById('orderModal');
  const orderModalClose = document.getElementById('orderModalClose');
  const orderModalBackdrop = document.getElementById('orderModalBackdrop');
  const cakeOrderForm = document.getElementById('cakeOrderForm');
  const orderModalFormState = document.getElementById('orderModalFormState');
  const orderModalSuccessState = document.getElementById('orderModalSuccessState');
  const orderSuccessCloseBtn = document.getElementById('orderSuccessCloseBtn');
  const whatsappOrderBtn = document.getElementById('whatsappOrderBtn');
  const orderCakeTypeSelect = document.getElementById('orderCakeType');
  const orderDeliveryDateInput = document.getElementById('orderDeliveryDate');

  // Set min date to tomorrow
  if (orderDeliveryDateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    orderDeliveryDateInput.min = tomorrow.toISOString().split('T')[0];
  }

  function openOrderModal(cakeType = null) {
    if (!orderModal) return;
    if (cakeType && orderCakeTypeSelect) {
      orderCakeTypeSelect.value = cakeType;
    }
    // Reset to form view
    if (orderModalFormState) orderModalFormState.hidden = false;
    if (orderModalSuccessState) orderModalSuccessState.hidden = true;

    orderModal.hidden = false;
    requestAnimationFrame(() => {
      orderModal.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    });
  }

  function closeOrderModal() {
    if (!orderModal) return;
    orderModal.classList.remove('is-active');
    setTimeout(() => {
      orderModal.hidden = true;
      document.body.style.overflow = '';
    }, 280);
  }

  // Bind all buttons with .open-order-modal-btn
  document.querySelectorAll('.open-order-modal-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const cakeType = btn.getAttribute('data-cake') || null;
      openOrderModal(cakeType);
    });
  });

  if (orderModalClose) orderModalClose.addEventListener('click', closeOrderModal);
  if (orderModalBackdrop) orderModalBackdrop.addEventListener('click', closeOrderModal);
  if (orderSuccessCloseBtn) orderSuccessCloseBtn.addEventListener('click', closeOrderModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && orderModal && orderModal.classList.contains('is-active')) {
      closeOrderModal();
    }
  });

  // Handle Form Submission -> Google Form + Success Animation
  if (cakeOrderForm) {
    cakeOrderForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Open Google Form in new window/tab
      window.open(GOOGLE_FORM_URL, '_blank', 'noopener,noreferrer');

      // Trigger Confetti Celebration
      triggerConfetti();

      // Switch to success view
      if (orderModalFormState) orderModalFormState.hidden = true;
      if (orderModalSuccessState) orderModalSuccessState.hidden = false;
    });
  }

  // Handle WhatsApp Order Button
  if (whatsappOrderBtn) {
    whatsappOrderBtn.addEventListener('click', () => {
      const name = document.getElementById('orderFullName')?.value || '';
      const phone = document.getElementById('orderPhone')?.value || '';
      const cake = orderCakeTypeSelect?.value || 'Custom Cake';
      const weight = document.getElementById('orderWeight')?.value || '1 kg';
      const flavor = document.getElementById('orderFlavor')?.value || 'Chocolate';
      const occasion = document.getElementById('orderOccasion')?.value || 'Celebration';
      const date = orderDeliveryDateInput?.value || '';
      const message = document.getElementById('orderMessage')?.value || '';

      const lines = [
        "Hello Sandhra Bakes, I would like to order a homemade cake:",
        name ? `• Name: ${name}` : null,
        phone ? `• Phone: ${phone}` : null,
        `• Cake: ${cake}`,
        `• Weight: ${weight}`,
        `• Flavor: ${flavor}`,
        `• Occasion: ${occasion}`,
        date ? `• Date Required: ${date}` : null,
        message ? `• Message on Cake / Notes: ${message}` : null
      ].filter(Boolean);

      const waText = encodeURIComponent(lines.join('\n'));
      window.open(`https://wa.me/917560902165?text=${waText}`, '_blank', 'noopener,noreferrer');
      triggerConfetti();
    });
  }

  /* ==========================================================================
     8. CUSTOMER REVIEWS HORIZONTAL CAROUSEL (SLIDER)
     ========================================================================== */
  const sliderTrack = document.getElementById('sliderTrack');
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  const dots = document.querySelectorAll('.slider-dots .dot');
  let currentSlide = 0;
  let autoplayTimer = null;

  function goToSlide(index) {
    if (!sliderTrack || slides.length === 0) return;
    currentSlide = (index + slides.length) % slides.length;
    sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentSlide);
    });
  }

  function nextSlide() { goToSlide(currentSlide + 1); }
  function prevSlide() { goToSlide(currentSlide - 1); }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(nextSlide, 5000);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); startAutoplay(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); startAutoplay(); });

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-index'), 10);
      goToSlide(idx);
      startAutoplay();
    });
  });

  const sliderContainer = document.getElementById('testimonialsSlider');
  if (sliderContainer) {
    sliderContainer.addEventListener('mouseenter', stopAutoplay);
    sliderContainer.addEventListener('mouseleave', startAutoplay);

    let touchStartX = 0;
    sliderContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    sliderContainer.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) nextSlide();
        else prevSlide();
        startAutoplay();
      }
    }, { passive: true });
  }

  startAutoplay();

  /* ==========================================================================
     9. PINTEREST-STYLE GALLERY FILTERING & LIGHTBOX
     ========================================================================== */
  const filterTabs = document.querySelectorAll('.filter-tab');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const filter = tab.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCat = item.getAttribute('data-category') || '';
        if (filter === 'all' || itemCat.includes(filter)) {
          item.classList.remove('is-hidden');
          item.style.opacity = '0';
          setTimeout(() => { item.style.opacity = '1'; }, 40);
        } else {
          item.classList.add('is-hidden');
        }
      });
    });
  });

  // Lightbox Modal
  const lightbox = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let activeGalleryItems = [];
  let currentImgIndex = 0;

  function updateActiveGalleryItems() {
    activeGalleryItems = Array.from(galleryItems).filter(item => !item.classList.contains('is-hidden'));
  }

  function openLightbox(index) {
    updateActiveGalleryItems();
    if (activeGalleryItems.length === 0) return;

    currentImgIndex = (index + activeGalleryItems.length) % activeGalleryItems.length;
    const item = activeGalleryItems[currentImgIndex];
    const highResUrl = item.getAttribute('data-src');
    const caption = item.getAttribute('data-caption');

    lightboxImg.src = highResUrl;
    lightboxImg.alt = caption;
    lightboxCaption.textContent = caption;
    lightboxCounter.textContent = `${currentImgIndex + 1} / ${activeGalleryItems.length}`;

    lightbox.hidden = false;
    requestAnimationFrame(() => {
      lightbox.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    });
  }

  function closeLightbox() {
    lightbox.classList.remove('is-active');
    setTimeout(() => {
      lightbox.hidden = true;
      lightboxImg.src = '';
      document.body.style.overflow = '';
    }, 240);
  }

  function showNextImage() { openLightbox(currentImgIndex + 1); }
  function showPrevImage() { openLightbox(currentImgIndex - 1); }

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      updateActiveGalleryItems();
      const index = activeGalleryItems.indexOf(item);
      openLightbox(index !== -1 ? index : 0);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); showNextImage(); });
  if (lightboxPrev) lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); showPrevImage(); });

  window.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('is-active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNextImage();
    if (e.key === 'ArrowLeft') showPrevImage();
  });

  // Touch swipe support for lightbox on mobile
  let lbTouchStartX = 0;
  if (lightbox) {
    lightbox.addEventListener('touchstart', (e) => {
      lbTouchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
      const lbTouchEndX = e.changedTouches[0].screenX;
      const diff = lbTouchStartX - lbTouchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) showNextImage();
        else showPrevImage();
      }
    }, { passive: true });
  }

  /* ==========================================================================
     10. FLOATING BACK TO TOP BUTTON WITH CIRCULAR PROGRESS RING
     ========================================================================== */
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  const scrollRingProgress = document.getElementById('scrollProgressCircle');

  if (scrollTopBtn) {
    const ringCircumference = 163.36; // 2 * PI * 26

    window.addEventListener('scroll', () => {
      const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;

      if (currentScroll > 300) {
        scrollTopBtn.classList.add('is-visible');
      } else {
        scrollTopBtn.classList.remove('is-visible');
      }

      if (scrollRingProgress && scrollTotal > 0) {
        const scrollFraction = Math.min(Math.max(currentScroll / scrollTotal, 0), 1);
        const dashOffset = ringCircumference * (1 - scrollFraction);
        scrollRingProgress.style.strokeDashoffset = dashOffset;
      }
    }, { passive: true });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
