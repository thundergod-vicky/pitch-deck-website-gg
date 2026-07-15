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
      allSlideEls.forEach((s, i) => { s.style.display = originalDisplays[i]; });
      hideProgress();
    }
  }

  // -------------------------------------------------------
  // PPTX Export — screenshot each slide via html2canvas
  // -------------------------------------------------------
  async function captureAndBuildPptx(slideEls, sector) {
    const sectorLabel = sector === 'common' ? 'Common' :
      sector.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');

    showProgress(`Building PPTX — ${sectorLabel} Sector`);
    if (pptxBtn) { pptxBtn.classList.add('loading'); pptxBtn.querySelector('span').textContent = 'Building…'; }

    try {
      const pptx = new PptxGenJS();
      pptx.layout = 'LAYOUT_WIDE'; // 13.33" × 7.5" — standard 16:9

      const total = slideEls.length;

      for (let i = 0; i < total; i++) {
        const slideEl = slideEls[i];
        updateProgress(i, total, `Capturing slide ${i + 1} of ${total}…`);

        // Scroll element into view within the container so it's composited
        slideEl.scrollIntoView({ block: 'start' });
        await new Promise(r => setTimeout(r, 60));

        // Capture with html2canvas
        const canvas = await html2canvas(slideEl, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
          backgroundColor: '#F8F9FB',
          width:  slideEl.offsetWidth  || 1280,
          height: slideEl.offsetHeight || 720,
          windowWidth:  slideEl.offsetWidth  || 1280,
          windowHeight: slideEl.offsetHeight || 720
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.92);

        // Add as a full-bleed image slide
        const pSlide = pptx.addSlide();
        pSlide.addImage({ data: imgData, x: 0, y: 0, w: '100%', h: '100%' });

        updateProgress(i + 1, total, `Slide ${i + 1} captured ✓`);
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
