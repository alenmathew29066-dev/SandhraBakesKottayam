/**
 * ============================================================================
 * SANDHRA BAKES – HOMEMADE CAKES, KOTTAYAM
 * Website Interactive Scripts, Motion Cursor & Google Form Booking System
 * ============================================================================
 * [CONFIG] CENTRAL GOOGLE FORM CONFIGURATION:
 * 
 * Replace the placeholder below with your published Google Form share URL.
 * Once replaced, EVERY "Order Now", "Book a Cake", and booking button across 
 * the entire website will automatically open your Google Form in a new tab!
 * 
 * Example:
 * const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSc.../viewform";
 * 
 * If left as "PASTE_GOOGLE_FORM_LINK_HERE", clicking any booking button will
 * politely open the helpful setup guidance modal with instructions and a link to forms.new.
 */
const GOOGLE_FORM_URL = "https://forms.gle/xJKgekkCB4yArpEN9";

document.addEventListener('DOMContentLoaded', () => {
  // Set current year in footer dynamically
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ==========================================================================
     1. MOTION CURSOR ANIMATION (SMOOTH LERP & HOVER EXPANSION)
     ========================================================================== */
  const cursorDot = document.getElementById('cursorDot');
  const cursorTrail = document.getElementById('cursorTrail');
  const customCursor = document.getElementById('customCursor');

  // Check if pointer device supports fine movement (mouse on desktop)
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

      // Dot follows cursor coordinates directly
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    }, { passive: true });

    // Smooth physics loop for the trailing ring (linear interpolation - lerp)
    function animateCursor() {
      trailX += (mouseX - trailX) * 0.18;
      trailY += (mouseY - trailY) * 0.18;

      cursorTrail.style.left = `${trailX}px`;
      cursorTrail.style.top = `${trailY}px`;

      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Mouse click depression animation
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

    // Interactive Hover expansion for links, buttons, cards and clickable elements
    const interactiveSelectors = [
      'a', 'button', 'input', 'select', 'textarea',
      '.category-card', '.fav-card', '.gallery-card', '.feature-card',
      '.filter-tab', '.dot', '.slider-btn', '.accordion-trigger', '.field-chip'
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

    // Active link highlighting based on current scroll position for single-page sections
    let currentSection = 'hero';
    const scrollPos = window.scrollY + 140;

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
      document.querySelectorAll('.mobile-nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          link.classList.toggle('active', href === `#${currentSection}`);
        }
      });
    }
  }, { passive: true });

  // Single-Page Smooth Scrolling for in-page anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
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

        // Ensure active nav link state updates immediately on click
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === targetId));
        document.querySelectorAll('.mobile-nav-link').forEach(l => l.classList.toggle('active', l.getAttribute('href') === targetId));
      }
    });
  });

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

  // Close drawer when any navigation link is tapped
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

  // Immediately reveal elements that are already in or near the viewport on load
  function revealVisibleElements() {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < vh + 100) {
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
      rootMargin: '50px 0px 50px 0px',
      threshold: 0.05
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  // Trigger immediate visibility check on script execution & load events
  revealVisibleElements();
  window.addEventListener('load', revealVisibleElements);
  window.addEventListener('resize', revealVisibleElements, { passive: true });

  // Failsafe timer: guarantee all elements are visible after 350ms
  setTimeout(() => {
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }, 350);

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
     6. FULLSCREEN LIGHTBOX MODAL WITH TOUCH SWIPE & KEYBOARD
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
    if (!sliderTrack || slides.length === 0) return;
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
     8. ONLINE CAKE BOOKING & GOOGLE FORM SYSTEM
     ========================================================================== */
  const placeholderModal = document.getElementById('gformPlaceholderModal');
  const modalCloseBtn = document.getElementById('gformModalClose');
  const modalDismissBtn = document.getElementById('gformModalDismiss');
  const modalBackdrop = document.getElementById('gformModalBackdrop');
  const googleFormButtons = document.querySelectorAll('.google-form-btn');
  const isPlaceholderActive = !GOOGLE_FORM_URL || GOOGLE_FORM_URL === "PASTE_GOOGLE_FORM_LINK_HERE" || GOOGLE_FORM_URL.trim() === "";

  function openSetupModal() {
    if (placeholderModal) {
      placeholderModal.classList.add('is-active');
      placeholderModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeSetupModal() {
    if (placeholderModal) {
      placeholderModal.classList.remove('is-active');
      placeholderModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  // Wire up every booking button across the entire website
  googleFormButtons.forEach(btn => {
    if (isPlaceholderActive) {
      // If placeholder has not yet been replaced with real link, display guidance modal
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openSetupModal();
      });
    } else {
      // Update link href directly to the client's published Google Form
      btn.setAttribute('href', GOOGLE_FORM_URL);
      btn.setAttribute('target', '_blank');
      btn.setAttribute('rel', 'noopener noreferrer');
    }
  });

  // Modal dismiss handlers
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeSetupModal);
  if (modalDismissBtn) modalDismissBtn.addEventListener('click', closeSetupModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeSetupModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && placeholderModal && placeholderModal.classList.contains('is-active')) {
      closeSetupModal();
    }
  });

  /* ==========================================================================
     9. 17-FIELD CHECKLIST PREVIEW ACCORDION
     ========================================================================== */
  const accordionTrigger = document.getElementById('checklistAccordionTrigger');
  const accordionContent = document.getElementById('checklistAccordionContent');

  if (accordionTrigger && accordionContent) {
    accordionTrigger.addEventListener('click', () => {
      const isExpanded = accordionTrigger.classList.toggle('is-open');
      accordionContent.classList.toggle('is-open', isExpanded);
      accordionTrigger.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
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
    // Botanical Evergreen, Forest Green, Sage, Gold & Champagne palette
    const colors = ['#235F43', '#40916C', '#C99738', '#E5F3EB', '#2ECC71', '#D4A373', '#15412D'];

    for (let i = 0; i < 90; i++) {
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

      if (elapsed < 3200) {
        animationFrame = requestAnimationFrame(renderConfetti);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(animationFrame);
      }
    }

    renderConfetti();
  }

  // Make triggerConfetti globally accessible if needed for interactive demo
  window.triggerConfetti = triggerConfetti;

  /* ==========================================================================
     SCROLL UP ANIMATION & FLOATING BACK TO TOP BUTTON
     ========================================================================== */
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  const scrollRingProgress = document.getElementById('scrollProgressCircle');

  if (scrollTopBtn) {
    const ringCircumference = 163.36; // 2 * PI * 26

    window.addEventListener('scroll', () => {
      const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;

      if (currentScroll > 320) {
        scrollTopBtn.classList.add('is-visible');
      } else {
        scrollTopBtn.classList.remove('is-visible');
      }

      // Update progress ring offset
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

  /* ==========================================================================
     GALLERY CATEGORY FILTER TABS (FOR DEDICATED GALLERY PAGE)
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.gallery-filter-bar .filter-btn');
  const galleryCardElements = document.querySelectorAll('.gallery-card[data-category]');

  if (filterBtns.length > 0 && galleryCardElements.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        galleryCardElements.forEach(item => {
          const category = item.getAttribute('data-category');
          if (filter === 'all' || category === filter || (category && category.includes(filter))) {
            item.style.display = '';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            }, 20);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'translateY(15px)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 250);
          }
        });
      });
    });
  }

  /* ==========================================================================
     TOP ANNOUNCEMENT BAR ENTRANCE ANIMATION (LEFT-TO-RIGHT STAGGER)
     ========================================================================== */
  const announcementBar = document.getElementById('announcementBar') || document.querySelector('.announcement-bar');
  if (announcementBar) {
    const triggerAnnouncement = () => {
      announcementBar.classList.add('is-animated');
    };

    if ('IntersectionObserver' in window) {
      const announceObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            triggerAnnouncement();
            announceObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.05 });
      announceObserver.observe(announcementBar);
    } else {
      triggerAnnouncement();
    }

    // Immediate triggers to guarantee animation plays on first load
    triggerAnnouncement();
    setTimeout(triggerAnnouncement, 60);
  }

  /* ==========================================================================
     FEATURE CARDS SECTION ENTRANCE ANIMATION (LEFT-TO-RIGHT STAGGER)
     ========================================================================== */
  const highlightStrip = document.getElementById('highlightStrip') || document.querySelector('.highlight-strip');
  if (highlightStrip) {
    const triggerStrip = () => {
      highlightStrip.classList.add('strip-animated');
    };

    if ('IntersectionObserver' in window) {
      const stripObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            triggerStrip();
            stripObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.05, rootMargin: '50px 0px 50px 0px' });
      stripObserver.observe(highlightStrip);
    } else {
      triggerStrip();
    }

    // Check if highlight strip is already in or near viewport
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const stripRect = highlightStrip.getBoundingClientRect();
    if (stripRect.top < vh + 100) {
      triggerStrip();
    }

    // Failsafe timer: guarantee cards animate into view
    setTimeout(triggerStrip, 350);
  }
});
