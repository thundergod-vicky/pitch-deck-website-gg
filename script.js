document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.slideshow-container');
  const slides = document.querySelectorAll('.slide');
  const navItems = document.querySelectorAll('.nav-item');
  const sectorCards = document.querySelectorAll('[data-select-sector]');
  const resetSectorBtn = document.getElementById('reset-sector');
  const bookingForm = document.getElementById('discovery-form');
  const successMsg = document.getElementById('success-message');

  let activeIndex = 0;
  let selectedSector = null;

  // 1. Intersection Observer to detect active slide on scroll
  const observerOptions = {
    root: container,
    threshold: 0.5, // Slide is active when 50% visible
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      // Ignore hidden slides
      if (entry.target.style.display === 'none') return;

      if (entry.isIntersecting) {
        const slideIndex = parseInt(entry.target.getAttribute('data-index'), 10);
        updateActiveSlide(slideIndex);
      }
    });
  }, observerOptions);

  slides.forEach((slide) => observer.observe(slide));

  // 2. Function to synchronize slide active state & sidebar nav items
  function updateActiveSlide(index) {
    activeIndex = index;

    // Toggle active class on slides for entrance animations
    slides.forEach((slide, idx) => {
      if (idx === index) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    // Toggle active class on sidebar nav items
    navItems.forEach((item) => {
      const targetVal = parseInt(item.getAttribute('data-target'), 10);
      if (targetVal === index) {
        item.classList.add('active');
        item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        item.classList.remove('active');
      }
    });
  }

  // 3. Click handler for sidebar navigation items
  navItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      const targetBtn = e.target.closest('.nav-item');
      if (targetBtn) {
        const targetIndex = parseInt(targetBtn.getAttribute('data-target'), 10);
        scrollToSlide(targetIndex);
      }
    });
  });

  // Helper function to scroll container to a specific slide
  function scrollToSlide(index) {
    const targetSlide = document.querySelector(`.slide[data-index="${index}"]`);
    if (targetSlide) {
      targetSlide.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // 4. Sector Selection Logic (Slide 5 Cards)
  sectorCards.forEach((card) => {
    card.addEventListener('click', () => {
      const sector = card.getAttribute('data-select-sector');
      applySectorFilter(sector);
    });
  });

  // Reset sector filter button
  resetSectorBtn.addEventListener('click', () => {
    clearSectorFilter();
  });

  function applySectorFilter(sector) {
    selectedSector = sector;

    // 1. Show matching slides, hide others
    slides.forEach((slide) => {
      const slideSector = slide.getAttribute('data-sector');
      if (slideSector) {
        if (slideSector === sector) {
          slide.style.display = 'flex';
        } else {
          slide.style.display = 'none';
        }
      }
    });

    // 2. Show matching nav links in the sidebar, hide others
    navItems.forEach((item) => {
      const itemSector = item.getAttribute('data-sector');
      if (itemSector) {
        if (itemSector === sector) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      }
    });

    // 3. Show reset button
    resetSectorBtn.style.display = 'block';

    // 4. Update numbering sequence for visual comfort in sidebar
    updateNavNumbers();

    // 5. Scroll to the first slide of the selected sector
    const firstSectorSlide = document.querySelector(`.slide[data-sector="${sector}"]`);
    if (firstSectorSlide) {
      const targetIndex = parseInt(firstSectorSlide.getAttribute('data-index'), 10);
      scrollToSlide(targetIndex);
    }
  }

  function clearSectorFilter() {
    selectedSector = null;

    // 1. Hide all sector slides
    slides.forEach((slide) => {
      if (slide.hasAttribute('data-sector')) {
        slide.style.display = 'none';
      }
    });

    // 2. Hide all sector nav items in the sidebar
    navItems.forEach((item) => {
      if (item.hasAttribute('data-sector')) {
        item.style.display = 'none';
      }
    });

    // 3. Hide reset button
    resetSectorBtn.style.display = 'none';

    // 4. Reset numbering sequence
    resetNavNumbers();

    // 5. Scroll back to the Sector Selector slide
    scrollToSlide(4);
  }

  // Helper to re-index the visible sidebar numbers for clean GitPages visual flow
  function updateNavNumbers() {
    let currentNumber = 1;
    navItems.forEach((item) => {
      if (item.style.display !== 'none') {
        const numLabel = item.querySelector('.nav-item-num');
        if (numLabel) {
          numLabel.textContent = currentNumber.toString().padStart(2, '0');
          currentNumber++;
        }
      }
    });
  }

  function resetNavNumbers() {
    let currentNumber = 1;
    navItems.forEach((item) => {
      // Common items (those without data-sector) plus the CRM and Booking
      if (!item.hasAttribute('data-sector')) {
        const numLabel = item.querySelector('.nav-item-num');
        if (numLabel) {
          numLabel.textContent = currentNumber.toString().padStart(2, '0');
          currentNumber++;
        }
      }
    });
  }

  // 5. Discovery session contact form submission (simulated)
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('client-name').value;
      const email = document.getElementById('client-email').value;
      const company = document.getElementById('client-company').value;
      
      if (name && email) {
        successMsg.textContent = `Success! Discovery Session booked for ${name} (${company}). Details sent to ${email}.`;
        successMsg.style.display = 'block';
        
        setTimeout(() => {
          bookingForm.reset();
          successMsg.style.display = 'none';
        }, 5000);
      }
    });
  }

  // 6. Keyboard navigation (Page Up/Down, Up/Down arrows) supporting hidden elements
  document.addEventListener('keydown', (e) => {
    // Find all visible slides
    const visibleSlides = Array.from(slides).filter(slide => slide.style.display !== 'none');
    const currentVisibleIndex = visibleSlides.findIndex(slide => parseInt(slide.getAttribute('data-index'), 10) === activeIndex);

    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      if (currentVisibleIndex < visibleSlides.length - 1) {
        const nextSlide = visibleSlides[currentVisibleIndex + 1];
        const nextIndex = parseInt(nextSlide.getAttribute('data-index'), 10);
        scrollToSlide(nextIndex);
      }
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      if (currentVisibleIndex > 0) {
        const prevSlide = visibleSlides[currentVisibleIndex - 1];
        const prevIndex = parseInt(prevSlide.getAttribute('data-index'), 10);
        scrollToSlide(prevIndex);
      }
    }
  });

  // Initialize: Call reset numbers to set initial common numbering
  resetNavNumbers();

  // ========================================================
  // EXPORT FUNCTIONALITY — PDF & PPTX
  // ========================================================
  const pdfBtn = document.getElementById('export-pdf-btn');
  const pptxBtn = document.getElementById('export-pptx-btn');
  const exportStatus = document.getElementById('export-status');

  function showExportStatus(msg, isError = false) {
    exportStatus.textContent = msg;
    exportStatus.style.color = isError ? '#E53E3E' : '#10B981';
    exportStatus.style.opacity = '1';
    setTimeout(() => { exportStatus.style.opacity = '0'; }, 4000);
  }

  // --- PDF Export ---
  if (pdfBtn) {
    pdfBtn.addEventListener('click', async () => {
      pdfBtn.classList.add('loading');
      pdfBtn.querySelector('span').textContent = 'Preparing…';
      showExportStatus('Generating PDF…');

      // Temporarily reveal all slides for capture
      const hiddenSlides = Array.from(document.querySelectorAll('.slide[style*="display: none"]'));
      hiddenSlides.forEach(s => s.style.display = 'flex');

      const container = document.querySelector('.slideshow-container');

      const opt = {
        margin:       0,
        filename:     'GrowGlobal-AI-Pitch-Deck.pdf',
        image:        { type: 'jpeg', quality: 0.95 },
        html2canvas:  { scale: 1.5, useCORS: true, logging: false },
        jsPDF:        { unit: 'px', format: [1280, 720], orientation: 'landscape' },
        pagebreak:    { mode: ['css', 'legacy'] }
      };

      try {
        await html2pdf().set(opt).from(container).save();
        showExportStatus('✓ PDF downloaded!');
      } catch (err) {
        showExportStatus('Export failed. Try again.', true);
        console.error('PDF export error:', err);
      } finally {
        // Restore hidden slides
        hiddenSlides.forEach(s => s.style.display = 'none');
        pdfBtn.classList.remove('loading');
        pdfBtn.querySelector('span').textContent = 'PDF';
      }
    });
  }

  // --- PPTX Export ---
  if (pptxBtn) {
    pptxBtn.addEventListener('click', async () => {
      pptxBtn.classList.add('loading');
      pptxBtn.querySelector('span').textContent = 'Building…';
      showExportStatus('Building PPTX slides…');

      try {
        const pptx = new PptxGenJS();
        pptx.layout = 'LAYOUT_WIDE'; // 16:9

        // Brand colours
        const ORANGE  = 'FF7A00';
        const DARK    = '0F172A';
        const MUTED   = '64748B';
        const WHITE   = 'FFFFFF';
        const BG      = 'F8F9FB';

        // Helper – get text content from a selector within a slide el
        const txt = (el, sel) => {
          const node = el.querySelector(sel);
          return node ? node.innerText.trim() : '';
        };

        // Collect all slides (visible + hidden sector slides)
        const allSlideEls = Array.from(document.querySelectorAll('.slide'));

        for (const slideEl of allSlideEls) {
          const eyebrow   = txt(slideEl, '.eyebrow');
          const title     = txt(slideEl, '.slide-title');
          const desc      = txt(slideEl, '.slide-desc');
          const bullets   = Array.from(slideEl.querySelectorAll('.comparison-item, .feature-text strong, .stat-value'))
                                  .map(b => b.innerText.trim())
                                  .filter(Boolean)
                                  .slice(0, 6);

          const pSlide = pptx.addSlide();

          // Background
          pSlide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: '100%', fill: { color: BG } });
          // Orange accent bar
          pSlide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.08, h: '100%', fill: { color: ORANGE } });

          // Eyebrow
          if (eyebrow) {
            pSlide.addText(eyebrow.toUpperCase(), {
              x: 0.35, y: 0.25, w: 8, h: 0.3,
              fontSize: 8, bold: true, color: ORANGE, fontFace: 'Calibri'
            });
          }

          // Title
          if (title) {
            pSlide.addText(title, {
              x: 0.35, y: 0.55, w: 8.5, h: 1.0,
              fontSize: 26, bold: true, color: DARK, fontFace: 'Calibri',
              breakLine: true, wrap: true
            });
          }

          // Description
          if (desc) {
            pSlide.addText(desc, {
              x: 0.35, y: 1.55, w: 5.5, h: 0.6,
              fontSize: 11, color: MUTED, fontFace: 'Calibri', wrap: true
            });
          }

          // Bullet list
          if (bullets.length > 0) {
            const bulletItems = bullets.map(b => ({ text: b, options: { bullet: { code: '25BA' }, color: DARK, fontSize: 11 } }));
            pSlide.addText(bulletItems, {
              x: 0.35, y: 2.2, w: 5.5, h: 3.0,
              fontFace: 'Calibri', paraSpaceAfter: 8
            });
          }

          // GrowGlobal branding watermark (bottom right)
          pSlide.addText('GrowGlobal Strategies', {
            x: 7.2, y: 6.8, w: 2.5, h: 0.25,
            fontSize: 8, color: MUTED, align: 'right', fontFace: 'Calibri'
          });
        }

        await pptx.writeFile({ fileName: 'GrowGlobal-AI-Pitch-Deck.pptx' });
        showExportStatus('✓ PPTX downloaded!');
      } catch (err) {
        showExportStatus('Export failed. Try again.', true);
        console.error('PPTX export error:', err);
      } finally {
        pptxBtn.classList.remove('loading');
        pptxBtn.querySelector('span').textContent = 'PPTX';
      }
    });
  }
});
