/**
 * SANDHRA BAKES – HOMEMADE CAKES, KOTTAYAM
 * Interactive Features, Motion Cursor Animation & Google Form Booking System
 */

document.addEventListener('DOMContentLoaded', () => {
  // Set current year in footer
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Set min date for celebration date input to today
  const eventDateInput = document.getElementById('eventDate');
  if (eventDateInput) {
    const today = new Date().toISOString().split('T')[0];
    eventDateInput.min = today;
  }

  /* ==========================================================================
     1. MOTION CURSOR ANIMATION (SMOOTH LERP & HOVER STATES)
     ========================================================================== */
  const cursorDot = document.getElementById('cursorDot');
  const cursorTrail = document.getElementById('cursorTrail');
  const customCursor = document.getElementById('customCursor');

  // Check if fine pointer device (desktop mouse)
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

      // Dot moves instantly with mouse
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    }, { passive: true });

    // Smooth physics loop for the trailing ring (linear interpolation)
    function animateCursor() {
      // Lerp speed factor
      trailX += (mouseX - trailX) * 0.18;
      trailY += (mouseY - trailY) * 0.18;

      cursorTrail.style.left = `${trailX}px`;
      cursorTrail.style.top = `${trailY}px`;

      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Mouse click reaction
    window.addEventListener('mousedown', () => {
      document.body.classList.add('cursor-clicked');
    });

    window.addEventListener('mouseup', () => {
      document.body.classList.remove('cursor-clicked');
    });

    // Hide cursor when leaving browser viewport
    document.addEventListener('mouseleave', () => {
      if (customCursor) customCursor.style.opacity = '0';
      isVisible = false;
    });

    document.addEventListener('mouseenter', () => {
      if (customCursor) customCursor.style.opacity = '1';
      isVisible = true;
    });

    // Interactive Hover expansion for links, buttons, form inputs and cards
    const interactiveSelectors = [
      'a', 'button', 'input', 'select', 'textarea',
      '.category-card', '.fav-card', '.gallery-card', '.feature-card',
      '.radio-card', '.filter-tab', '.dot', '.slider-btn'
    ];

    document.querySelectorAll(interactiveSelectors.join(', ')).forEach(el => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-active');
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-active');
      });
    });
  }

  /* ==========================================================================
     2. STICKY HEADER & ACTIVE NAV LINK TRACKING
     ========================================================================== */
  const header = document.getElementById('siteHeader');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active link highlighting based on scroll position
    let currentSection = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  /* ==========================================================================
     3. MOBILE NAVIGATION DRAWER
     ========================================================================== */
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function toggleMobileMenu(forceClose = false) {
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

  // Close drawer when link clicked
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleMobileMenu(true);
    });
  });

  // Close drawer when clicking outside
  document.addEventListener('click', (e) => {
    if (mobileDrawer && mobileDrawer.classList.contains('is-open')) {
      if (!mobileDrawer.contains(e.target) && !mobileToggle.contains(e.target)) {
        toggleMobileMenu(true);
      }
    }
  });

  /* ==========================================================================
     4. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  /* ==========================================================================
     5. GALLERY FILTERING (MASONRY)
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
        const itemCategories = item.getAttribute('data-category').split(' ');
        if (filter === 'all' || itemCategories.includes(filter)) {
          item.classList.remove('is-hidden');
          item.style.opacity = '0';
          setTimeout(() => {
            item.style.opacity = '1';
          }, 50);
        } else {
          item.classList.add('is-hidden');
        }
      });
    });
  });

  /* ==========================================================================
     6. LIGHTBOX MODAL WITH KEYBOARD & TOUCH SWIPE
     ========================================================================== */
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
    }, 250);
  }

  function showNextImage() {
    openLightbox(currentImgIndex + 1);
  }

  function showPrevImage() {
    openLightbox(currentImgIndex - 1);
  }

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
    if (!lightbox.classList.contains('is-active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNextImage();
    if (e.key === 'ArrowLeft') showPrevImage();
  });

  // Touch swipe support for lightbox on mobile
  let touchStartX = 0;
  let touchEndX = 0;

  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) showNextImage();
      else showPrevImage();
    }
  }, { passive: true });

  /* ==========================================================================
     7. TESTIMONIALS SLIDER / CAROUSEL
     ========================================================================== */
  const sliderTrack = document.getElementById('sliderTrack');
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  const dots = document.querySelectorAll('.slider-dots .dot');
  let currentSlide = 0;
  let autoplayTimer = null;

  function goToSlide(index) {
    currentSlide = (index + slides.length) % slides.length;
    sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentSlide);
    });
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

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

    let sliderTouchStartX = 0;
    sliderContainer.addEventListener('touchstart', (e) => {
      sliderTouchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    sliderContainer.addEventListener('touchend', (e) => {
      const sliderTouchEndX = e.changedTouches[0].screenX;
      const diff = sliderTouchStartX - sliderTouchEndX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) nextSlide();
        else prevSlide();
        startAutoplay();
      }
    }, { passive: true });
  }

  startAutoplay();

  /* ==========================================================================
     8. PRE-POPULATING BOOKING FORM FROM CAKE CARDS
     ========================================================================== */
  const enquireCardBtns = document.querySelectorAll('.enquire-card-btn');
  const cakeTypeSelect = document.getElementById('cakeType');
  const bookingSection = document.getElementById('booking');

  enquireCardBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cakeType = btn.getAttribute('data-cake');
      if (cakeTypeSelect && cakeType) {
        for (let i = 0; i < cakeTypeSelect.options.length; i++) {
          if (cakeTypeSelect.options[i].value.toLowerCase().includes(cakeType.toLowerCase()) ||
              cakeType.toLowerCase().includes(cakeTypeSelect.options[i].value.toLowerCase())) {
            cakeTypeSelect.selectedIndex = i;
            break;
          }
        }
      }
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ==========================================================================
     9. GOOGLE FORM INTEGRATION & BOOKING HANDLER
     ========================================================================== */
  /**
   * Google Form Configuration
   * You can replace this with your exact Google Form ID and entry IDs.
   * If not modified, the system automatically uses this structure to pre-fill
   * responses and handle online submissions.
   */
  const GOOGLE_FORM_CONFIG = {
    // Replace with your Google Form ID
    formId: "1FAIpQLSc-sandhra-bakes-booking-form-kottayam",
    viewFormUrl: "https://docs.google.com/forms/d/e/1FAIpQLSc-sandhra-bakes-booking-form-kottayam/viewform",
    formActionUrl: "https://docs.google.com/forms/d/e/1FAIpQLSc-sandhra-bakes-booking-form-kottayam/formResponse",
    // Field Entry IDs in Google Form:
    entries: {
      name: "entry.1000001",
      phone: "entry.1000002",
      cakeType: "entry.1000003",
      size: "entry.1000004",
      flavour: "entry.1000005",
      eventDate: "entry.1000006",
      deliveryType: "entry.1000007",
      customDesign: "entry.1000008",
      message: "entry.1000009"
    }
  };

  const bookingForm = document.getElementById('cakeBookingForm');
  const successAlert = document.getElementById('formSuccessAlert');
  const alertDismiss = document.getElementById('alertDismiss');
  const sendWhatsAppBtn = document.getElementById('sendWhatsAppBtn');
  const submitViaGFormBtn = document.getElementById('submitViaGFormBtn');
  const openDirectGFormBtn = document.getElementById('openDirectGFormBtn');

  // Helper to extract current form data
  function getFormData() {
    return {
      name: document.getElementById('customerName')?.value.trim() || '',
      phone: document.getElementById('customerPhone')?.value.trim() || '',
      cakeType: document.getElementById('cakeType')?.value || '',
      size: document.getElementById('cakeSize')?.value || '',
      flavour: document.getElementById('cakeFlavour')?.value || '',
      eventDate: document.getElementById('eventDate')?.value || '',
      deliveryType: document.querySelector('input[name="orderType"]:checked')?.value || 'Home Delivery',
      customDesign: document.getElementById('customDesign')?.value.trim() || '',
      message: document.getElementById('additionalMessage')?.value.trim() || ''
    };
  }

  // Generates a pre-filled Google Form URL with user's choices
  function generateGoogleFormPreFillUrl() {
    const data = getFormData();
    const params = new URLSearchParams();
    params.append('usp', 'pp_url');

    if (data.name) params.append(GOOGLE_FORM_CONFIG.entries.name, data.name);
    if (data.phone) params.append(GOOGLE_FORM_CONFIG.entries.phone, data.phone);
    if (data.cakeType) params.append(GOOGLE_FORM_CONFIG.entries.cakeType, data.cakeType);
    if (data.size) params.append(GOOGLE_FORM_CONFIG.entries.size, data.size);
    if (data.flavour) params.append(GOOGLE_FORM_CONFIG.entries.flavour, data.flavour);
    if (data.eventDate) params.append(GOOGLE_FORM_CONFIG.entries.eventDate, data.eventDate);
    if (data.deliveryType) params.append(GOOGLE_FORM_CONFIG.entries.deliveryType, data.deliveryType);
    if (data.customDesign) params.append(GOOGLE_FORM_CONFIG.entries.customDesign, data.customDesign);
    if (data.message) params.append(GOOGLE_FORM_CONFIG.entries.message, data.message);

    return `${GOOGLE_FORM_CONFIG.viewFormUrl}?${params.toString()}`;
  }

  // Generates WhatsApp message string
  function generateWhatsAppMessage() {
    const data = getFormData();
    let text = `🎂 *CUSTOM CAKE BOOKING – Sandhra Bakes, Kottayam*\n\n`;
    if (data.name) text += `👤 *Customer Name*: ${data.name}\n`;
    if (data.phone) text += `📞 *Phone*: ${data.phone}\n`;
    if (data.cakeType) text += `🍰 *Cake Type*: ${data.cakeType}\n`;
    if (data.size) text += `⚖️ *Estimated Weight/Size*: ${data.size}\n`;
    if (data.flavour) text += `🍯 *Preferred Flavour*: ${data.flavour}\n`;
    if (data.eventDate) text += `📅 *Celebration Date*: ${data.eventDate}\n`;
    text += `🚚 *Order Type*: ${data.deliveryType}\n`;
    if (data.customDesign) text += `🎨 *Design Notes*: ${data.customDesign}\n`;
    if (data.message) text += `✍️ *Text on Cake / Requests*: ${data.message}\n`;
    text += `\n_Price range note: ₹1,000 – ₹1,200 (Exact price on confirmation)_`;

    return encodeURIComponent(text);
  }

  // Form Validation
  function validateForm() {
    let isValid = true;
    const fields = [
      { id: 'customerName', errorId: 'nameError' },
      { id: 'customerPhone', errorId: 'phoneError' },
      { id: 'cakeType', errorId: 'typeError' },
      { id: 'cakeSize', errorId: 'sizeError' },
      { id: 'cakeFlavour', errorId: 'flavourError' },
      { id: 'eventDate', errorId: 'dateError' }
    ];

    fields.forEach(field => {
      const el = document.getElementById(field.id);
      const err = document.getElementById(field.errorId);
      if (!el.value || el.value === '') {
        el.classList.add('has-error');
        if (err) err.classList.add('is-visible');
        isValid = false;
      } else {
        el.classList.remove('has-error');
        if (err) err.classList.remove('is-visible');
      }
    });

    return isValid;
  }

  // Clear errors on typing
  ['customerName', 'customerPhone', 'cakeType', 'cakeSize', 'cakeFlavour', 'eventDate'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => {
        el.classList.remove('has-error');
        const err = el.parentElement.querySelector('.form-error');
        if (err) err.classList.remove('is-visible');
      });
      el.addEventListener('change', () => {
        el.classList.remove('has-error');
        const err = el.parentElement.querySelector('.form-error');
        if (err) err.classList.remove('is-visible');
      });
    }
  });

  // Action 1: "Open in Google Form" Button
  if (submitViaGFormBtn) {
    submitViaGFormBtn.addEventListener('click', () => {
      const gFormUrl = generateGoogleFormPreFillUrl();
      window.open(gFormUrl, '_blank', 'noopener');
    });
  }

  // Action 2: Top direct Google Form badge link
  if (openDirectGFormBtn) {
    openDirectGFormBtn.addEventListener('click', () => {
      const gFormUrl = generateGoogleFormPreFillUrl();
      window.open(gFormUrl, '_blank', 'noopener');
    });
  }

  // Action 3: Send via WhatsApp Button
  if (sendWhatsAppBtn) {
    sendWhatsAppBtn.addEventListener('click', () => {
      const encodedMsg = generateWhatsAppMessage();
      const waUrl = `https://wa.me/917560902165?text=${encodedMsg}`;
      window.open(waUrl, '_blank', 'noopener');
    });
  }

  // Action 4: Form Submit with Google Form Target Sync
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!validateForm()) {
        const firstError = bookingForm.querySelector('.has-error');
        if (firstError) firstError.focus();
        return;
      }

      // Configure Google Form Action dynamically with field names
      bookingForm.action = GOOGLE_FORM_CONFIG.formActionUrl;

      // Create or populate hidden input fields mapped to Google Form entries
      const data = getFormData();
      const entryMap = [
        { entry: GOOGLE_FORM_CONFIG.entries.name, value: data.name },
        { entry: GOOGLE_FORM_CONFIG.entries.phone, value: data.phone },
        { entry: GOOGLE_FORM_CONFIG.entries.cakeType, value: data.cakeType },
        { entry: GOOGLE_FORM_CONFIG.entries.size, value: data.size },
        { entry: GOOGLE_FORM_CONFIG.entries.flavour, value: data.flavour },
        { entry: GOOGLE_FORM_CONFIG.entries.eventDate, value: data.eventDate },
        { entry: GOOGLE_FORM_CONFIG.entries.deliveryType, value: data.deliveryType },
        { entry: GOOGLE_FORM_CONFIG.entries.customDesign, value: data.customDesign },
        { entry: GOOGLE_FORM_CONFIG.entries.message, value: data.message }
      ];

      // Remove existing hidden entry inputs if any
      bookingForm.querySelectorAll('.gform-entry-input').forEach(input => input.remove());

      // Append mapped entry inputs
      entryMap.forEach(item => {
        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.name = item.entry;
        hiddenInput.value = item.value;
        hiddenInput.classList.add('gform-entry-input');
        bookingForm.appendChild(hiddenInput);
      });

      // Submit silently to the hidden iframe target
      HTMLFormElement.prototype.submit.call(bookingForm);

      // Display customer success confirmation alert
      if (successAlert) {
        successAlert.hidden = false;
        successAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      // Trigger Celebration Confetti Particle Shower!
      triggerConfetti();

      // Reset form
      bookingForm.reset();
    });
  }

  if (alertDismiss) {
    alertDismiss.addEventListener('click', () => {
      successAlert.hidden = true;
    });
  }

  /* ==========================================================================
     10. CELEBRATION CONFETTI PARTICLE ANIMATION (EMERALD & GOLD)
     ========================================================================== */
  function triggerConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = [];
    // Botanical Evergreen, Sage, Forest Green, Gold & Champagne palette
    const colors = ['#235F43', '#40916C', '#C99738', '#E5F3EB', '#2ECC71', '#D4A373', '#15412D'];

    for (let i = 0; i < 95; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * -canvas.height * 0.4,
        size: Math.random() * 9 + 4,
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

      if (elapsed < 3500) {
        animationFrame = requestAnimationFrame(renderConfetti);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(animationFrame);
      }
    }

    renderConfetti();
  }
});
