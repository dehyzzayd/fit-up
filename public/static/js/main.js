// Main JavaScript for Fitup Homepage
document.addEventListener('DOMContentLoaded', () => {
  const topNav = document.getElementById('topNav');
  const menuBtn = document.getElementById('menuBtn');
  const sideMenu = document.getElementById('sideMenu');
  const sideMenuOverlay = document.getElementById('sideMenuOverlay');
  const sideMenuClose = document.getElementById('sideMenuClose');

  // Side Menu Toggle
  function openMenu() {
    sideMenu.classList.add('active');
    sideMenuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    sideMenu.classList.remove('active');
    sideMenuOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (menuBtn) menuBtn.addEventListener('click', openMenu);
  if (sideMenuClose) sideMenuClose.addEventListener('click', closeMenu);
  if (sideMenuOverlay) sideMenuOverlay.addEventListener('click', closeMenu);

  // Close menu on link click
  document.querySelectorAll('.side-menu-link').forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMenu();
    }
  });

  // Scroll behavior for nav and hero CTA button
  const heroCTA = document.querySelector('.hero-cta-btn');
  
  if (topNav) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight * 0.85;
      const switchPoint = window.innerHeight * 0.8;

      // Nav color switch
      if (scrollY > switchPoint) {
        topNav.classList.add('scrolled');
      } else {
        topNav.classList.remove('scrolled');
      }
      
      // Hide CTA button when scrolled past hero section
      if (heroCTA) {
        if (scrollY > heroHeight) {
          heroCTA.classList.add('hidden');
        } else {
          heroCTA.classList.remove('hidden');
        }
      }
    });
  }

  // Expanding cards functionality
  const options = document.querySelectorAll(".option");
  options.forEach(option => {
    option.addEventListener("click", () => {
      options.forEach(opt => opt.classList.remove("active"));
      option.classList.add("active");
    });
  });

  // Initialize FITUP display
  initFitupDisplay();

  // Initialize text animation
  initTextAnimation();

  // Initialize Social Sliders
  new SocialSlideStories("twitter-slide");
  new SocialSlideStories("instagram-slide");

  // Initialize FAQ Accordion
  initFaqAccordion();

  // Initialize Scroll Text Animation
  initScrollTextAnimation();

  console.log("fitup home loaded");
});

// --- FITUP GAME LOGIC (DRAG letters, then win) ---
const TARGET_WORD = 'FITUP';
let tilesOrder = [];
let tileNodes = [];
let hasWon = false;
let dragTile = null;
let dragStartIndex = null;
let dragStartX = 0;
let pointerStartX = 0;

function initFitupDisplay() {
  const slots = document.querySelector('.slots');
  const tiles = document.querySelector('.tiles');
  const gameSvg = document.getElementById('gameSvg');

  if (!slots || !tiles || !gameSvg) return;

  // shuffled starting word
  const shuffled = TARGET_WORD
    .split('')
    .sort(() => Math.random() - 0.5);

  tilesOrder = [...shuffled];
  tileNodes = [];
  hasWon = false;
  dragTile = null;
  dragStartIndex = null;
  gameSvg.classList.remove('clicked');

  // reset UI
  slots.innerHTML = '';
  tiles.innerHTML = '';
  
  // reset messages
  const gameInitialMessage = document.getElementById('gameInitialMessage');
  const winMessage = document.getElementById('winMessage');
  if (gameInitialMessage) gameInitialMessage.style.display = 'block';
  if (winMessage) winMessage.classList.remove('show');

  shuffled.forEach((char, i) => {
    const tile = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const shadow = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    const txt = document.createElementNS("http://www.w3.org/2000/svg", "text");

    tiles.append(tile);
    tile.append(shadow);
    tile.append(bg);
    tile.append(txt);

    // position tile at its slot
    gsap.set(tile, {
      attr: { 
        class: 'tile', 
        'data-index': i,
        'data-letter': char
      },
      transformOrigin: '25 25',
      x: i * 60,
      y: 140
    });

    gsap.set(shadow, {
      transformOrigin: '25 25',
      attr: { class: 'shadow', width: 50, height: 50, opacity: 0.5 }
    });

    gsap.set(bg, {
      attr: { class: 'tileBg', width: 50, height: 50, fill: '#333' }
    });

    gsap.set(txt, {
      innerHTML: char,
      attr: {
        class: 'tileTxt',
        'text-anchor': 'middle',
        'alignment-baseline': 'center',
        fill: '#fff',
        x: 25,
        y: 35
      }
    });

    const slot = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    slots.append(slot);

    gsap.set(slot, {
      attr: {
        class: 'slot',
        fill: '#222',
        width: 52,
        height: 52,
        x: -1,
        y: -1
      },
      x: i * 60,
      y: 140
    });

    tileNodes.push(tile);

    // pointer events for drag
    tile.addEventListener('pointerdown', (e) => startDrag(e, tile));
  });

  gsap.set([tiles, slots], { x: 10 });

  // global pointer listeners
  const svg = document.getElementById('gameSvg');
  svg.addEventListener('pointermove', onDragMove);
  svg.addEventListener('pointerup', endDrag);
  svg.addEventListener('pointerleave', endDrag);
}

function startDrag(e, tile) {
  if (hasWon) return;

  e.preventDefault();
  dragTile = tile;
  dragStartIndex = parseInt(tile.getAttribute('data-index'), 10);
  dragStartX = dragStartIndex * 60;
  pointerStartX = e.clientX;

  // bring this tile visually above others
  dragTile.parentNode.appendChild(dragTile);

  gsap.to(dragTile, { scale: 1.15, duration: 0.15, ease: 'power2.out' });
}

function onDragMove(e) {
  if (!dragTile) return;

  const deltaX = e.clientX - pointerStartX;
  const newX = dragStartX + deltaX;

  gsap.set(dragTile, { x: newX });
}

function endDrag() {
  if (!dragTile) return;

  const gameSvg = document.getElementById('gameSvg');
  const bbox = gameSvg.getBoundingClientRect();

  // current X of the dragged tile in SVG coords
  const transform = dragTile.transform.baseVal.consolidate();
  const currentX = transform ? transform.matrix.e : dragStartX;
  const localX = currentX;

  // snap to nearest slot index
  let targetIndex = Math.round(localX / 60);
  const maxIndex = tilesOrder.length - 1;
  if (targetIndex < 0) targetIndex = 0;
  if (targetIndex > maxIndex) targetIndex = maxIndex;

  // move letter and tile node in arrays
  if (targetIndex !== dragStartIndex) {
    // reorder letters
    const letter = tilesOrder.splice(dragStartIndex, 1)[0];
    tilesOrder.splice(targetIndex, 0, letter);

    // reorder tile nodes
    const tileNode = tileNodes.splice(dragStartIndex, 1)[0];
    tileNodes.splice(targetIndex, 0, tileNode);
  }

  // lay out all tiles according to new order
  tileNodes.forEach((tile, i) => {
    tile.setAttribute('data-index', i);
    gsap.to(tile, { 
      x: i * 60, 
      scale: 1, 
      duration: 0.2, 
      ease: 'power2.out' 
    });
  });

  dragTile = null;
  dragStartIndex = null;

  checkWinCondition();
}

function checkWinCondition() {
  const currentWord = tilesOrder.join('');
  if (currentWord === TARGET_WORD && !hasWon) {
    hasWon = true;
    triggerWinAnimation();
  }
}

function triggerWinAnimation() {
  const gameSvg = document.getElementById('gameSvg');
  gameSvg.classList.add('clicked');

  // disable pointer on tiles after win
  tileNodes.forEach(tile => {
    tile.style.pointerEvents = 'none';
  });

  // Play celebration animation
  gsap.timeline()
    .to('.tileBg', { 
      attr: { fill: '#B8FF5C' }, 
      ease: 'power2.inOut',
      stagger: 0.1
    }, 0)
    .to('.tile', { 
      duration: 0.5, 
      scale: 1.3, 
      ease: 'back.out(2)',
      stagger: 0.1
    }, 0)
    .to('.tile', { 
      duration: 0.3, 
      scale: 1, 
      ease: 'power2.inOut',
      stagger: 0.1
    }, 0.6)
    .to('.tile', {
      duration: 0.4,
      y: 120,
      ease: 'back.out(1.5)',
      stagger: 0.05
    }, 0.9)
    .to('.tileTxt', {
      fill: '#000',
      duration: 0.3
    }, 0)
    .add(() => {
      // Hide initial message, show win message
      const gameInitialMessage = document.getElementById('gameInitialMessage');
      const winMessage = document.getElementById('winMessage');
      if (gameInitialMessage) gameInitialMessage.style.display = 'none';
      if (winMessage) winMessage.classList.add('show');
    }, 1.3);
}

// Social Stories Slider Class
class SocialSlideStories {
  constructor(id) {
    this.slide = document.querySelector(`[data-slide="${id}"]`);
    if (!this.slide) return;
    this.active = 0;
    this.init();
  }

  activeSlide(index) {
    this.active = index;
    this.items.forEach((item) => {
      item.classList.remove("active");
    });
    this.items[index].classList.add("active");
    
    this.thumbItems.forEach((item, i) => {
      item.classList.remove("active");
      item.classList.remove("done");
      if (i < index) {
        item.classList.add("done");
      }
    });
    this.thumbItems[index].classList.add("active");
    this.autoSlide();
  }

  prev() {
    if (this.active > 0) {
      this.activeSlide(this.active - 1);
    } else {
      this.activeSlide(this.items.length - 1);
    }
  }

  next() {
    if (this.active < this.items.length - 1) {
      this.activeSlide(this.active + 1);
    } else {
      this.activeSlide(0);
    }
  }

  addNavigation() {
    const nextBtn = this.slide.querySelector(".social-slide-next");
    const prevBtn = this.slide.querySelector(".social-slide-prev");
    if (nextBtn) nextBtn.addEventListener("click", this.next);
    if (prevBtn) prevBtn.addEventListener("click", this.prev);
  }

  addThumbItems() {
    this.items.forEach(() => (this.thumb.innerHTML += `<span></span>`));
    this.thumbItems = Array.from(this.thumb.children);
  }

  autoSlide() {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(this.next, 5000);
  }

  init() {
    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
    this.items = this.slide.querySelectorAll(".social-slide-items > *");
    this.thumb = this.slide.querySelector(".social-slide-thumb");
    this.addThumbItems();
    this.activeSlide(0);
    this.addNavigation();
  }
}

// FAQ Accordion
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-item-header');
    
    if (header) {
      header.addEventListener('click', () => {
        // Check if this item is already active
        const isActive = item.classList.contains('active');
        
        // Close all items
        faqItems.forEach(faqItem => {
          faqItem.classList.remove('active');
        });
        
        // If it wasn't active, open it
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });
}

// Animation for 20% OFF text
function initTextAnimation() {
  const bg = document.querySelector('.animation-bg');
  const word = document.querySelector('.animation-word');
  
  if (!bg || !word) return;
  
  const nClones = 8;

  for (let i = 0; i < nClones; i++) {
    const clone1 = word.cloneNode(true);
    const clone2 = word.cloneNode(true);
    clone1.classList.add('animation-clone');
    clone2.classList.add('animation-clone');
    bg.prepend(clone1);
    bg.prepend(clone2);

    gsap.timeline({
      repeat: -1,
      onRepeat: () => { bg.append(clone1); bg.append(clone2); }
    }).fromTo([clone1, clone2], {
      position: 'absolute',
      scaleY: 0.7
    }, {
      duration: 4,
      y: (j) => (j % 2) ? 100 : -100,
      scaleY: 1.2,
      ease: 'power3'
    }).play(i / nClones * 4);
  }
}

// ==================== LET'S TALK WIDGET ====================
(function() {
  const letsTalkBtn = document.getElementById('letsTalkBtn');
  const letsTalkDialog = document.getElementById('letsTalkDialog');
  const letsTalkForm = document.getElementById('letsTalkForm');
  const letsTalkSuccess = document.getElementById('letsTalkSuccess');
  
  if (!letsTalkBtn || !letsTalkDialog) return;
  
  // Toggle dialog
  letsTalkBtn.addEventListener('click', () => {
    const isActive = letsTalkDialog.classList.contains('active');
    
    if (isActive) {
      letsTalkDialog.classList.remove('active');
      letsTalkBtn.classList.remove('active');
    } else {
      letsTalkDialog.classList.add('active');
      letsTalkBtn.classList.add('active');
      // Reset form if showing again after success
      if (letsTalkSuccess.style.display !== 'none') {
        letsTalkSuccess.style.display = 'none';
        letsTalkForm.style.display = 'block';
        letsTalkForm.reset();
      }
    }
  });
  
  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!letsTalkBtn.contains(e.target) && !letsTalkDialog.contains(e.target)) {
      letsTalkDialog.classList.remove('active');
      letsTalkBtn.classList.remove('active');
    }
  });
  
  // Form submission
  if (letsTalkForm) {
    letsTalkForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = letsTalkForm.querySelector('.dialog-submit');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Sending...</span>';
      
      const name = document.getElementById('ltName').value.trim();
      const phone = document.getElementById('ltPhone').value.trim();
      const message = document.getElementById('ltMessage').value.trim();
      
      // Split name into first and last
      const nameParts = name.split(' ');
      const firstName = nameParts[0] || name;
      const lastName = nameParts.slice(1).join(' ') || '';
      
      try {
        const response = await fetch('/api/inquiries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            phone: phone,
            email: '',
            message: message || 'Quick inquiry from Let\'s Talk widget',
            source: 'widget'
          })
        });
        
        if (response.ok) {
          // Show success
          letsTalkForm.style.display = 'none';
          letsTalkSuccess.style.display = 'block';
          
          // Auto close after 3 seconds
          setTimeout(() => {
            letsTalkDialog.classList.remove('active');
            letsTalkBtn.classList.remove('active');
            // Reset for next time
            setTimeout(() => {
              letsTalkSuccess.style.display = 'none';
              letsTalkForm.style.display = 'block';
              letsTalkForm.reset();
              submitBtn.disabled = false;
              submitBtn.innerHTML = originalText;
            }, 300);
          }, 3000);
        } else {
          throw new Error('Failed to submit');
        }
      } catch (error) {
        console.error('Error submitting inquiry:', error);
        alert('Failed to send message. Please try again.');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }
})();

// ==================== SCROLL TEXT ANIMATION ====================
function initScrollTextAnimation() {
  const items = document.querySelectorAll('.scroll-text-list li');
  if (!items.length) return;

  // Set first item active initially
  items[0].classList.add('active');

  // Use GSAP ScrollTrigger for smooth animation
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Set initial state
    gsap.set(items, { opacity: (i) => (i === 0 ? 1 : 0.15) });

    // Create timeline for opacity animation
    const dimmer = gsap.timeline()
      .to(items, {
        opacity: 1,
        stagger: 0.5,
      })
      .to(items.slice(0, items.length - 1), {
        opacity: 0.15,
        stagger: 0.5,
      }, 0);

    ScrollTrigger.create({
      trigger: items[0],
      endTrigger: items[items.length - 1],
      start: 'center center',
      end: 'center center',
      animation: dimmer,
      scrub: 0.2,
    });

  } else {
    // Fallback: Use Intersection Observer
    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -40% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          items.forEach(item => item.classList.remove('active'));
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    items.forEach(item => observer.observe(item));
  }
}

// ==================== FIX WIDGET POSITION ====================
// Remove body transforms that break position:fixed for widgets
(function fixWidgetPosition() {
  function applyFix() {
    document.body.style.transform = 'none';
    document.body.style.perspective = 'none';
    document.body.style.backfaceVisibility = 'visible';
  }
  
  // Apply immediately
  applyFix();
  
  // Apply after full load (catches hero.js changes)
  window.addEventListener('load', () => {
    setTimeout(applyFix, 100);
    setTimeout(applyFix, 500);
    setTimeout(applyFix, 2000);
  });
})();
