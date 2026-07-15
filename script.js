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
  // EXPORT FUNCTIONALITY — PDF & PPTX (with sector picker)
  // ========================================================
  const pdfBtn  = document.getElementById('export-pdf-btn');
  const pptxBtn = document.getElementById('export-pptx-btn');
  const exportStatus = document.getElementById('export-status');

  // --- Modal elements ---
  const exportModal      = document.getElementById('export-modal');
  const exportModalClose = document.getElementById('export-modal-close');
  const exportModalIcon  = document.getElementById('export-modal-icon');
  const exportProgress   = document.getElementById('export-progress');
  const progressBar      = document.getElementById('export-progress-bar');
  const progressTitle    = document.getElementById('export-progress-title');
  const progressLabel    = document.getElementById('export-progress-label');

  let currentExportType = null; // 'pdf' | 'pptx'

  function showExportStatus(msg, isError = false) {
    if (!exportStatus) return;
    exportStatus.textContent = msg;
    exportStatus.style.color = isError ? '#E53E3E' : '#10B981';
    exportStatus.style.opacity = '1';
    setTimeout(() => { exportStatus.style.opacity = '0'; }, 5000);
  }

  // Open modal
  function openExportModal(type) {
    currentExportType = type;
    if (!exportModal) return;

    // Update icon + subtitle based on type
    if (exportModalIcon) {
      exportModalIcon.innerHTML = type === 'pdf'
        ? '<i class="bi bi-file-earmark-pdf-fill"></i>'
        : '<i class="bi bi-file-earmark-slides-fill"></i>';
      exportModalIcon.classList.toggle('pptx-mode', type === 'pptx');
    }

    exportModal.style.display = 'flex';
    requestAnimationFrame(() => exportModal.classList.add('visible'));
  }

  function closeExportModal() {
    if (!exportModal) return;
    exportModal.classList.remove('visible');
    setTimeout(() => { exportModal.style.display = 'none'; }, 300);
  }

  // Progress helpers
  function showProgress(title) {
    if (!exportProgress) return;
    progressTitle.textContent = title;
    progressBar.style.width = '0%';
    progressLabel.textContent = 'Starting…';
    exportProgress.style.display = 'flex';
  }

  function updateProgress(current, total, label) {
    const pct = Math.round((current / total) * 100);
    progressBar.style.width = pct + '%';
    progressLabel.textContent = label;
  }

  function hideProgress() {
    if (!exportProgress) return;
    exportProgress.style.display = 'none';
  }

  // Wire up buttons
  if (pdfBtn)  pdfBtn.addEventListener('click',  () => openExportModal('pdf'));
  if (pptxBtn) pptxBtn.addEventListener('click', () => openExportModal('pptx'));
  if (exportModalClose) exportModalClose.addEventListener('click', closeExportModal);
  if (exportModal) {
    exportModal.addEventListener('click', (e) => {
      if (e.target === exportModal) closeExportModal();
    });
  }

  // Wire up sector cards inside the modal
  document.querySelectorAll('.export-sector-card').forEach(card => {
    card.addEventListener('click', () => {
      const sector = card.getAttribute('data-export-sector');
      closeExportModal();
      setTimeout(() => runExport(currentExportType, sector), 350);
    });
  });

  // -------------------------------------------------------
  // Main export orchestrator
  // -------------------------------------------------------
  async function runExport(type, sector) {
    const allSlideEls = Array.from(document.querySelectorAll('.slide'));

    // Determine which slides to include
    const targetSlides = allSlideEls.filter(slide => {
      const slideSector = slide.getAttribute('data-sector');
      if (!slideSector) return true; // always include common slides
      if (sector === 'common') return false; // common-only: skip all sector slides
      return slideSector === sector;
    });

    if (targetSlides.length === 0) {
      showExportStatus('No slides found for this sector.', true);
      return;
    }

    // --- Enter capture mode ---
    // 1. Save original display states
    const originalDisplays = allSlideEls.map(s => s.style.display);

    // 2. Hide all slides, then show only the ones we need
    allSlideEls.forEach(s => { s.style.display = 'none'; });
    targetSlides.forEach(s => { s.style.display = 'flex'; });

    // 3. Add capture-mode class so CSS unlocks the container
    document.body.classList.add('export-capture-mode');

    // 4. Inject a temporary stylesheet to force remove background pseudo-element balls and blurs
    const tempStyle = document.createElement('style');
    tempStyle.id = 'temp-export-style';
    tempStyle.innerHTML = `
      .slide::before, .slide::after { display: none !important; }
      .slide-content {
        opacity: 1 !important;
        transform: scale(1) !important;
        background: #ffffff !important;
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
      }
      .media-container, .pillar-card, .roadmap-card, .comparison-card, .marketing-flow-card, .sector-card {
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
        background: rgba(255, 255, 255, 0.95) !important;
      }
    `;
    document.head.appendChild(tempStyle);

    // Small delay to let CSS repaint
    await new Promise(r => setTimeout(r, 150));

    try {
      if (type === 'pptx') {
        await captureAndBuildPptx(targetSlides, sector);
      } else {
        await captureAndBuildPdf(targetSlides, sector);
      }
    } finally {
      // --- Restore original display states ---
      document.body.classList.remove('export-capture-mode');
      if (document.getElementById('temp-export-style')) {
        document.getElementById('temp-export-style').remove();
      }
      allSlideEls.forEach((s, i) => { s.style.display = originalDisplays[i]; });
      hideProgress();
    }
  }

  // -------------------------------------------------------
  // PPTX Export — screenshot each slide via html2canvas
  // -------------------------------------------------------
  // -------------------------------------------------------
  // PPTX Export — Programmatic native PowerPoint Slide Generator
  // -------------------------------------------------------
  async function captureAndBuildPptx(slideEls, sector) {
    const sectorLabel = sector === 'common' ? 'Common' :
      sector.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');

    showProgress(`Building PPTX — ${sectorLabel} Sector`);
    if (pptxBtn) { pptxBtn.classList.add('loading'); pptxBtn.querySelector('span').textContent = 'Building…'; }

    try {
      const pptx = new PptxGenJS();
      pptx.layout = 'LAYOUT_WIDE'; // 16:9 layout (13.33" x 7.5")

      // Theme Colors
      const ORANGE = 'FF7A00';
      const DARK   = '0F172A';
      const MUTED  = '64748B';
      const BG     = 'F8F9FB';
      const CARD_BG = 'FFFFFF';

      const total = slideEls.length;

      for (let i = 0; i < total; i++) {
        const slideEl = slideEls[i];
        updateProgress(i, total, `Compiling slide ${i + 1} of ${total}…`);

        // Add a slide
        const pSlide = pptx.addSlide();

        // Background
        pSlide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: '100%', h: '100%', fill: { color: BG } });
        
        // Sidebar accent line (matches brand guide)
        pSlide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 0.15, h: '100%', fill: { color: ORANGE } });

        // Gather slide header content
        let eyebrow = slideEl.querySelector('.eyebrow') ? slideEl.querySelector('.eyebrow').innerText.trim() : '';
        let title = slideEl.querySelector('.slide-title') ? slideEl.querySelector('.slide-title').innerText.trim() : '';
        let desc = slideEl.querySelector('.slide-desc') ? slideEl.querySelector('.slide-desc').innerText.trim() : '';

        // Clean title text of any stray symbols
        title = title.replace(/\s+/g, ' ');

        // Add eyebrow
        if (eyebrow) {
          pSlide.addText(eyebrow.toUpperCase(), {
            x: 0.5, y: 0.4, w: 12, h: 0.3,
            fontSize: 10, bold: true, color: ORANGE, fontFace: 'Calibri', characterSpacing: 1.5
          });
        }

        // Add main slide title
        if (title) {
          pSlide.addText(title, {
            x: 0.5, y: 0.7, w: 12, h: 0.7,
            fontSize: 26, bold: true, color: DARK, fontFace: 'Calibri'
          });
        }

        // Add subtitle/description
        if (desc) {
          pSlide.addText(desc, {
            x: 0.5, y: 1.4, w: 12, h: 0.4,
            fontSize: 11, color: MUTED, fontFace: 'Calibri', italic: true
          });
        }

        // --- Layout Parsing ---
        const imgEl = slideEl.querySelector('.slide-real-img, img');
        const compLayout = slideEl.querySelector('.comparison-layout');
        const timelineLayout = slideEl.querySelector('.progress-timeline, .repair-flow-timeline');
        const gridLayout = slideEl.querySelector('.pillars-grid, .roadmap-grid');
        const featureList = slideEl.querySelector('.feature-list');

        let contentWidth = imgEl ? 6.0 : 12.0;

        if (compLayout) {
          // Render two columns side-by-side
          const compCards = Array.from(compLayout.querySelectorAll('.comparison-card'));
          if (compCards.length >= 2) {
            // Card 1: Today
            const card1 = compCards[0];
            const card1Title = card1.querySelector('.comparison-card-title') ? card1.querySelector('.comparison-card-title').innerText.trim() : 'TODAY';
            const card1Bullets = Array.from(card1.querySelectorAll('.comparison-item')).map(el => el.innerText.trim());

            // Draw Card 1 Background shape
            pSlide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
              x: 0.5, y: 2.0, w: 5.5, h: 4.5,
              fill: { color: CARD_BG },
              line: { color: 'E2E8F0', width: 1.5 }
            });
            pSlide.addText(card1Title, {
              x: 0.8, y: 2.2, w: 4.9, h: 0.4,
              fontSize: 16, bold: true, color: 'E53E3E', fontFace: 'Calibri'
            });
            const textItems1 = card1Bullets.map(b => ({ text: '  ' + b, options: { bullet: { code: '2022' }, color: DARK, fontSize: 12, paraSpaceAfter: 8 } }));
            pSlide.addText(textItems1, {
              x: 0.8, y: 2.8, w: 4.9, h: 3.4,
              fontFace: 'Calibri'
            });

            // Card 2: With AI
            const card2 = compCards[1];
            const card2Title = card2.querySelector('.comparison-card-title') ? card2.querySelector('.comparison-card-title').innerText.trim() : 'WITH AI';
            const card2Bullets = Array.from(card2.querySelectorAll('.comparison-item')).map(el => el.innerText.trim());

            // Draw Card 2 Background shape (with orange border)
            pSlide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
              x: 6.8, y: 2.0, w: 5.5, h: 4.5,
              fill: { color: CARD_BG },
              line: { color: ORANGE, width: 2 }
            });
            pSlide.addText(card2Title, {
              x: 7.1, y: 2.2, w: 4.9, h: 0.4,
              fontSize: 16, bold: true, color: ORANGE, fontFace: 'Calibri'
            });
            const textItems2 = card2Bullets.map(b => ({ text: '  ' + b, options: { bullet: { code: '2713' }, color: DARK, fontSize: 12, paraSpaceAfter: 8 } }));
            pSlide.addText(textItems2, {
              x: 7.1, y: 2.8, w: 4.9, h: 3.4,
              fontFace: 'Calibri'
            });
          }
        }
        else if (timelineLayout) {
          // Horizontal journey timeline (e.g. Dining Flow)
          const steps = Array.from(timelineLayout.querySelectorAll('.progress-step, .repair-flow-step'));
          const count = steps.length;
          if (count > 0) {
            const cardWidth = Math.min(1.8, 11.5 / count);
            const gap = (11.5 - (cardWidth * count)) / (count - 1 || 1);
            
            for (let j = 0; j < count; j++) {
              const step = steps[j];
              const stepTitle = step.querySelector('.progress-title, .repair-flow-title') ? step.querySelector('.progress-title, .repair-flow-title').innerText.trim() : '';
              const stepDesc = step.querySelector('.progress-desc, .repair-flow-desc') ? step.querySelector('.progress-desc, .repair-flow-desc').innerText.trim() : '';
              const stepNum = step.querySelector('.progress-num, .repair-flow-num') ? step.querySelector('.progress-num, .repair-flow-num').innerText.trim() : (j + 1).toString();
              
              const cardX = 0.5 + j * (cardWidth + gap);

              // Draw Step Card shape
              pSlide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
                x: cardX, y: 2.2, w: cardWidth, h: 4.2,
                fill: { color: 'F1F5F9' },
                line: { color: 'CBD5E1', width: 1 }
              });

              // Step number circle representation
              pSlide.addShape(pptx.shapes.OVAL, {
                x: cardX + (cardWidth - 0.6) / 2, y: 2.5, w: 0.6, h: 0.6,
                fill: { color: ORANGE }
              });
              pSlide.addText(stepNum, {
                x: cardX, y: 2.55, w: cardWidth, h: 0.5,
                fontSize: 12, bold: true, color: 'FFFFFF', align: 'center', fontFace: 'Calibri'
              });

              // Step title
              pSlide.addText(stepTitle, {
                x: cardX + 0.1, y: 3.3, w: cardWidth - 0.2, h: 0.8,
                fontSize: 12, bold: true, color: DARK, align: 'center', fontFace: 'Calibri'
              });

              // Step description
              pSlide.addText(stepDesc, {
                x: cardX + 0.1, y: 4.2, w: cardWidth - 0.2, h: 2.0,
                fontSize: 10, color: MUTED, align: 'center', fontFace: 'Calibri'
              });

              // Arrow to next step
              if (j < count - 1) {
                const arrowX = cardX + cardWidth;
                pSlide.addText('→', {
                  x: arrowX, y: 3.8, w: gap, h: 0.4,
                  fontSize: 20, color: ORANGE, align: 'center', fontFace: 'Calibri'
                });
              }
            }
          }
        }
        else if (gridLayout) {
          // Pillars or roadmap grid layout (2 columns, or 3 columns)
          const cards = Array.from(gridLayout.querySelectorAll('.pillar-card, .roadmap-card'));
          const count = cards.length;
          if (count > 0) {
            const isTwoCol = count === 2 || imgEl;
            const colWidth = isTwoCol ? (contentWidth - 0.8) : 3.8;
            
            for (let j = 0; j < count; j++) {
              const card = cards[j];
              const cardTitle = card.querySelector('.pillar-card-title, .roadmap-card-title') ? card.querySelector('.pillar-card-title, .roadmap-card-title').innerText.trim() : '';
              const cardDesc = card.querySelector('.pillar-card-desc, .roadmap-card-desc') ? card.querySelector('.pillar-card-desc, .roadmap-card-desc').innerText.trim() : '';

              let colX = 0.5;
              let colY = 2.0;

              if (isTwoCol) {
                colX = 0.5 + (j % 2) * (colWidth + 0.4);
                colY = 2.0 + Math.floor(j / 2) * 2.3;
              } else {
                colX = 0.5 + (j % 3) * (colWidth + 0.3);
                colY = 2.0 + Math.floor(j / 3) * 2.3;
              }

              pSlide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
                x: colX, y: colY, w: colWidth, h: 2.1,
                fill: { color: CARD_BG },
                line: { color: 'E2E8F0', width: 1 }
              });

              pSlide.addText(cardTitle, {
                x: colX + 0.2, y: colY + 0.15, w: colWidth - 0.4, h: 0.4,
                fontSize: 14, bold: true, color: DARK, fontFace: 'Calibri'
              });

              pSlide.addText(cardDesc, {
                x: colX + 0.2, y: colY + 0.6, w: colWidth - 0.4, h: 1.3,
                fontSize: 11, color: MUTED, fontFace: 'Calibri'
              });
            }
          }
        }
        else if (featureList) {
          // Bullet features list
          const items = Array.from(featureList.querySelectorAll('.feature-item, li'));
          const bulletsData = items.map(item => {
            const strong = item.querySelector('strong') ? item.querySelector('strong').innerText.trim() : '';
            const span = item.querySelector('span') ? item.querySelector('span').innerText.trim() : '';
            const text = item.innerText.trim();
            
            if (strong || span) {
              return `${strong}: ${span}`;
            }
            return text;
          }).filter(Boolean);

          const textItems = bulletsData.map(b => ({ text: '  ' + b, options: { bullet: { code: '25BA' }, color: DARK, fontSize: 13, paraSpaceAfter: 12 } }));
          pSlide.addText(textItems, {
            x: 0.5, y: 2.2, w: contentWidth - 0.5, h: 4.3,
            fontFace: 'Calibri'
          });
        }
        else {
          // Sector picker cards or fallback
          const sectorCards = Array.from(slideEl.querySelectorAll('.sector-card'));
          if (sectorCards.length > 0) {
            const cardWidth = 2.8;
            const gap = 0.2;
            for (let j = 0; j < sectorCards.length; j++) {
              const card = sectorCards[j];
              const name = card.querySelector('.sector-name') ? card.querySelector('.sector-name').innerText.trim() : '';
              const meta = card.querySelector('.sector-meta') ? card.querySelector('.sector-meta').innerText.trim() : '';
              
              const cardX = 0.5 + j * (cardWidth + gap);
              pSlide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
                x: cardX, y: 2.2, w: cardWidth, h: 4.0,
                fill: { color: CARD_BG },
                line: { color: ORANGE, width: 1.5 }
              });
              pSlide.addText(name, {
                x: cardX + 0.1, y: 2.6, w: cardWidth - 0.2, h: 0.6,
                fontSize: 16, bold: true, color: DARK, align: 'center', fontFace: 'Calibri'
              });
              pSlide.addText(meta, {
                x: cardX + 0.1, y: 3.4, w: cardWidth - 0.2, h: 2.4,
                fontSize: 11, color: MUTED, align: 'center', fontFace: 'Calibri'
              });
            }
          } else {
            pSlide.addText("Explore details of GrowGlobal's custom integrated frameworks, modular workflows, and AI solutions.", {
              x: 0.5, y: 2.2, w: contentWidth - 0.5, h: 4.0,
              fontSize: 14, color: DARK, fontFace: 'Calibri'
            });
          }
        }

        // Add native image if slide has an image element (always placed nicely on the right half)
        if (imgEl && imgEl.getAttribute('src')) {
          const imgSrc = imgEl.getAttribute('src');
          pSlide.addImage({
            path: imgSrc,
            x: 7.2,
            y: 1.8,
            w: 5.6,
            h: 4.5,
            sizing: { type: 'contain', w: 5.6, h: 4.5 }
          });
        }

        // Add footer branding on every slide (bottom right)
        pSlide.addText('GrowGlobal Strategies', {
          x: 9.8, y: 7.0, w: 3.0, h: 0.3,
          fontSize: 9, bold: true, color: MUTED, align: 'right', fontFace: 'Calibri'
        });

        updateProgress(i + 1, total, `Slide ${i + 1} compiled ✓`);
      }

      const fileName = `GrowGlobal-${sectorLabel.replace(/\s+/g, '-')}-Pitch-Deck.pptx`;
      await pptx.writeFile({ fileName });
      showExportStatus(`✓ ${fileName} downloaded!`);

    } catch (err) {
      showExportStatus('PPTX export failed. Try again.', true);
      console.error('PPTX export error:', err);
    } finally {
      if (pptxBtn) { pptxBtn.classList.remove('loading'); pptxBtn.querySelector('span').textContent = 'PPTX'; }
    }
  }

  // -------------------------------------------------------
  // PDF Export — html2pdf on the visible slide container
  // -------------------------------------------------------
  async function captureAndBuildPdf(slideEls, sector) {
    const sectorLabel = sector === 'common' ? 'Common' :
      sector.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');

    showProgress(`Generating PDF — ${sectorLabel} Sector`);
    if (pdfBtn) { pdfBtn.classList.add('loading'); pdfBtn.querySelector('span').textContent = 'Preparing…'; }
    updateProgress(10, 100, 'Rendering slides…');

    try {
      const container = document.querySelector('.slideshow-container');
      const fileName  = `GrowGlobal-${sectorLabel.replace(/\s+/g, '-')}-Pitch-Deck.pdf`;

      const opt = {
        margin:      0,
        filename:    fileName,
        image:       { type: 'jpeg', quality: 0.95 },
        html2canvas: { scale: 1.5, useCORS: true, allowTaint: true, logging: false },
        jsPDF:       { unit: 'px', format: [1280, 720], orientation: 'landscape' },
        pagebreak:   { mode: ['css', 'legacy'] }
      };

      updateProgress(50, 100, 'Generating PDF…');
      await html2pdf().set(opt).from(container).save();
      updateProgress(100, 100, 'Done!');
      showExportStatus(`✓ ${fileName} downloaded!`);

    } catch (err) {
      showExportStatus('PDF export failed. Try again.', true);
      console.error('PDF export error:', err);
    } finally {
      if (pdfBtn) { pdfBtn.classList.remove('loading'); pdfBtn.querySelector('span').textContent = 'PDF'; }
    }
  }

});
