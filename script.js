/* ==========================================================================
   ROYAL WEDDING INVITATION - INTERACTION ARCHITECTURE
   ========================================================================== */

// ─── State Management ──────────────────────────────────────────────────────
let envelope1Opened = false;
let envelope2Opened = false;
let musicPlaying    = false;
let curtainRemoved  = false;

// ─── DOM Elements ──────────────────────────────────────────────────────────
const bodyElement         = document.body;
const weddingMusic        = document.getElementById('weddingMusic');
const musicToggleBtn      = document.getElementById('musicToggleBtn');
const heroSection         = document.getElementById('heroSection');
const detailsSection      = document.getElementById('detailsSection');
const countdownTimer      = document.getElementById('countdownTimer');
const wishesWallGrid      = document.getElementById('wishesWallGrid');

// ─── Interactive Welcome Screen (Preloader curtain opener) ────────────────
function enterInvitation() {
  if (curtainRemoved) return;
  curtainRemoved = true;

  const welcomeCurtain = document.getElementById('welcomeCurtain');
  const curtainContent = document.getElementById('curtainContent');
  
  // 1. Fire sparkles in a beautiful circular ring around the button
  const btn = welcomeCurtain.querySelector('.curtain-btn');
  const rect = btn.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  createSparkles(cx, cy);
  
  // 1b. DRAMATIC LIGHT BURST from center screen
  createLightBurst(window.innerWidth / 2, window.innerHeight / 2);

  // 2. Play beautiful background music (Explicit User Interaction allows instant autoplay!)
  autoPlayMusic();

  // 3. Add open status class to initiate split animation in CSS
  welcomeCurtain.classList.add('open');

  // 4. Add body class to trigger staggered reveals of badge, title, and envelopes
  setTimeout(() => {
    bodyElement.classList.add('curtain-opened');
  }, 150);

  // 5. Remove preloader curtain from DOM after transition finishes (1.3s) to save CPU
  setTimeout(() => {
    welcomeCurtain.remove();
  }, 1300);
}

// ─── Dramatic Light Burst Effect ──────────────────────────────────────────
function createLightBurst(x, y) {
  const count = window.innerWidth < 480 ? 12 : 22;
  const chars = ['✦', '✧', '❋', '✺', '✹', '✸', '⭐', '💫', '✨'];

  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      pointer-events: none;
      z-index: 10001;
      font-size: ${0.8 + Math.random() * 1.6}rem;
      opacity: 1;
      transform: translate(-50%, -50%);
    `;
    el.textContent = chars[Math.floor(Math.random() * chars.length)];
    
    const angle = (i / count) * 360;
    const dist  = 80 + Math.random() * 200;
    const dx    = Math.cos((angle * Math.PI) / 180) * dist;
    const dy    = Math.sin((angle * Math.PI) / 180) * dist;
    const dur   = 600 + Math.random() * 500;

    el.animate([
      { transform: `translate(-50%, -50%) scale(1)`, opacity: 1, color: '#fff1d2' },
      { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.1)`, opacity: 0, color: '#dfc07e' }
    ], { duration: dur, easing: 'ease-out', fill: 'forwards' });

    document.body.appendChild(el);
    setTimeout(() => el.remove(), dur + 50);
  }
}

// ─── Petals falling background animation ──────────────────────────────────
const PETAL_EMOJIS = ['🌸', '🌹', '❤️', '✿', '❀', '🌺', '✨'];

function createPetal() {
  const petal = document.createElement('span');
  petal.classList.add('petal');
  petal.textContent = PETAL_EMOJIS[Math.floor(Math.random() * PETAL_EMOJIS.length)];

  const startX     = Math.random() * 105 - 2;   // vw range
  const duration   = 7 + Math.random() * 9;      // seconds speed
  const delay      = Math.random() * -15;       // negative delay for instant stream
  const size       = 0.7 + Math.random() * 0.9;  // rem size

  petal.style.cssText = `
    left: ${startX}vw;
    font-size: ${size}rem;
    animation-duration: ${duration}s;
    animation-delay: ${delay}s;
    opacity: ${0.2 + Math.random() * 0.5};
  `;

  return petal;
}

function initPetals() {
  const container = document.getElementById('petalsContainer');
  container.innerHTML = ''; // clear before render
  const count     = window.innerWidth < 768 ? 12 : 25;

  for (let i = 0; i < count; i++) {
    container.appendChild(createPetal());
  }
}

// ─── Sparkle Cursor / Interaction Effect ───────────────────────────────────
function createSparkles(x, y) {
  const sparkleChars = ['✨', '⭐', '💫', '✦', '❦'];
  const count = window.innerWidth < 480 ? 4 : 8;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.classList.add('sparkle');
    el.textContent = sparkleChars[Math.floor(Math.random() * sparkleChars.length)];

    const angle   = (i / count) * 360;
    const dist    = 40 + Math.random() * 50;
    const dx      = Math.cos((angle * Math.PI) / 180) * dist;
    const dy      = Math.sin((angle * Math.PI) / 180) * dist;

    el.style.cssText = `
      left: ${x}px;
      top: ${y}px;
      --dx: ${dx}px;
      --dy: ${dy}px;
      font-size: ${0.75 + Math.random() * 0.75}rem;
      animation-delay: ${Math.random() * 0.15}s;
    `;

    document.body.appendChild(el);
    setTimeout(() => el.remove(), 750);
  }
}

// Sparkle generator on envelope hover
function enableEnvelopeHoverSparkles(envelopeNum) {
  const container = document.getElementById('envelopeContainer' + envelopeNum);
  if (!container) return;

  container.addEventListener('mousemove', (e) => {
    const isOpened = envelopeNum === 1 ? envelope1Opened : envelope2Opened;
    if (isOpened) return;
    if (Math.random() > 0.94) {
      createSparkles(e.clientX, e.clientY);
    }
  });

  container.addEventListener('touchmove', (e) => {
    const isOpened = envelopeNum === 1 ? envelope1Opened : envelope2Opened;
    if (isOpened) return;
    if (Math.random() > 0.92) {
      const touch = e.touches[0];
      createSparkles(touch.clientX, touch.clientY);
    }
  });
}

// ─── Premium 3D Hover Card Tilt Effect ─────────────────────────────────────
function initEnvelope3DTilt(envelopeNum) {
  const container = document.getElementById('envelopeContainer' + envelopeNum);
  const envelope3D = document.getElementById('envelope3D-' + envelopeNum);
  if (!container || !envelope3D) return;

  container.addEventListener('mousemove', (e) => {
    // Disable tilt once opened
    const isOpened = envelopeNum === 1 ? envelope1Opened : envelope2Opened;
    if (isOpened) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left; // x coordinate within element
    const y = e.clientY - rect.top;  // y coordinate within element
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation angles (Max 15 degrees tilt)
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    // Apply smooth 3D tilt
    envelope3D.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`;
  });

  container.addEventListener('mouseleave', () => {
    const isOpened = envelopeNum === 1 ? envelope1Opened : envelope2Opened;
    if (isOpened) return;
    
    // Smoothly reset tilt on leave
    envelope3D.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
  });
}

// ─── Audio Autoplay & Transitions ─────────────────────────────────────────
function autoPlayMusic() {
  if (musicPlaying) return; // already playing
  
  // Volume starts muted then fades in beautifully
  weddingMusic.volume = 0;
  
  const playPromise = weddingMusic.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      musicPlaying = true;
      musicToggleBtn.classList.add('playing');
      fadeAudio(weddingMusic, 0, 0.45, 1800); // 1.8s fade-in
    }).catch(error => {
      console.log("Autoplay blocked by browser policy. Music will play on first touch.");
    });
  }
}

function toggleMusic() {
  if (musicPlaying) {
    fadeAudio(weddingMusic, weddingMusic.volume, 0, 800, () => {
      weddingMusic.pause();
      musicPlaying = false;
      musicToggleBtn.classList.remove('playing');
    });
  } else {
    weddingMusic.play().then(() => {
      musicPlaying = true;
      musicToggleBtn.classList.add('playing');
      fadeAudio(weddingMusic, 0, 0.45, 800);
    });
  }
}

function fadeAudio(audio, from, to, duration, callback) {
  const steps    = 30;
  const interval = duration / steps;
  const step     = (to - from) / steps;
  let current    = from;
  let count      = 0;

  const timer = setInterval(() => {
    current += step;
    count++;
    
    // Clamp volume bounds
    audio.volume = Math.min(Math.max(current, 0), 1);

    if (count >= steps) {
      clearInterval(timer);
      audio.volume = to;
      if (callback) callback();
    }
  }, interval);
}

// ─── Envelope Trigger Mechanics ───────────────────────────────────────────
function handleEnvelopeClick(envelopeNum) {
  const isOpened = envelopeNum === 1 ? envelope1Opened : envelope2Opened;
  if (isOpened) return;

  if (envelopeNum === 1) envelope1Opened = true;
  if (envelopeNum === 2) envelope2Opened = true;

  const container = document.getElementById('envelopeContainer' + envelopeNum);
  
  // 1. Calculate and launch sparkles from the center of the seal
  const rect = container.getBoundingClientRect();
  const cx   = rect.left + rect.width / 2;
  const cy   = rect.top + rect.height / 2;
  createSparkles(cx, cy);

  // 2. Play music
  autoPlayMusic();

  // 3. Add opened status class directly to specific envelope container
  container.classList.add('opened');

  // 4. Add at-least-one-opened class to hero section to trigger visual shifts
  heroSection.classList.add('at-least-one-opened');

  // 5. Activate detail sections
  detailsSection.classList.add('active');

  // 6. Unlock scroll on body after animations finish
  setTimeout(() => {
    bodyElement.classList.remove('locked');
    
    // Retrigger scroll reveal observer to check initial positions
    initScrollReveal();
  }, 1200);
}

// ─── Countdown Timer Calculation ─────────────────────────────────────────
function initCountdown() {
  // Target: Friday, October 16, 2026, 7:30 PM (19:30:00)
  const weddingDate = new Date("October 20, 2026 19:30:00").getTime();
// if i want to change timer countdown ^
  function updateTimer() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance < 0) {
      clearInterval(timerInterval);
      countdownTimer.innerHTML = "<div class='gold-sub-title' style='width:100%;grid-column:1/-1;'>💍 لقد بدأت الليلة البهيجة! 💍</div>";
      return;
    }

    const d = Math.floor(distance / (1000 * 60 * 60 * 24));
    const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((distance % (1000 * 60)) / 1000);

    // Inject values with padding zero
    document.getElementById('days').textContent    = d.toString().padStart(2, '0');
    document.getElementById('hours').textContent   = h.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = m.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = s.toString().padStart(2, '0');
  }

  updateTimer(); // run once immediately
  const timerInterval = setInterval(updateTimer, 1000);
}

// ─── Scroll Reveal Animation (Intersection Observer) ──────────────────────
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal-on-scroll');
  
  const options = {
    threshold: 0.1,
    rootMargin: "0px 0px -30px 0px"
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, options);

  items.forEach(item => {
    observer.observe(item);
  });
}

// ─── Preset Guest Blessings Board (Du'aas) ──────────────────────────────────
const PRESET_DUAAS = [
  {
    name: "دعاء بالبركة والوفاق 🤲",
    wish: "اللهم بارك لهما وبارك عليهما واجمع بينهما في خير. نسأل الله العظيم أن يرزق عرساننا شيرين وبهاء، وألاء وسامي، حياة مباركة ملؤها المودة والرحمة والاستقرار.",
    relation: "دعاء الأهل"
  },
  {
    name: "دعاء بالسعادة وحلاوة الحياة ✨",
    wish: "اللهم حلي أيامهم واكتب لهم التوفيق والرضا في كل خطوة. مبروك لأجمل عرسان، ربنا يسعدكم ويهنيكم ويبعد عنكم كل سوء ويديم بيوتكم عامرة بالخير والأفراح دايماً.",
    relation: "دعاء محب"
  },
  {
    name: "دعاء بالسكينة وراحة البال 🌸",
    wish: "اللهم صبّ عليهما الخير صباً، واجعل حياتهما الجديدة برداً وسلاماً. ألف مبروك لشيرين وبهاء، وألاء وسامي. تمنياتنا لكما بـعمر طويل وراحة بال وهناء بلا حدود.",
    relation: "تبريكات العائلة"
  },
  {
    name: "دعاء بالخير وتيسير الأمور 💎",
    wish: "يا رب اكتب لعرساننا الأحباء تيسيراً لكل أمورهم، واجعل التفاهم والرحمة والسعادة رفقاء دربهم دايماً، واجعل زواجهم هذا بداية لحياة جميلة كجمال قلوبهم.",
    relation: "أمنية غالية"
  },
  {
    name: "دعاء بالذرية الصالحة والرضا 🌹",
    wish: "ألف مبروك زفافكم السعيد يا أغلى الناس! ربنا يسعد قلوبكم ويجمع شملكم على طاعته، ويرزقكم الذرية الصالحة الطيبة التي تقر بها عيونكم وتكتمل بها فرحتكم.",
    relation: "دعاء الأقارب"
  }
];

function loadWishes() {
  wishesWallGrid.innerHTML = '';
  
  PRESET_DUAAS.forEach(item => {
    const card = document.createElement('div');
    card.classList.add('wish-item-card');
    
    card.innerHTML = `
      <p class="wish-text">" ${item.wish} "</p>
      <div class="wish-meta">
        <span class="wish-author">${item.name}</span>
        <span class="wish-badge">${item.relation}</span>
      </div>
    `;
    wishesWallGrid.appendChild(card);
  });
}

// ─── Initialization on DOM Load ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initPetals();
  enableEnvelopeHoverSparkles(1);
  enableEnvelopeHoverSparkles(2);
  initEnvelope3DTilt(1);
  initEnvelope3DTilt(2);
  initCountdown();
  loadWishes();

  // Create sparkles on document click for high-end micro-interaction
  document.addEventListener('click', (e) => {
    if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'A' && !e.target.closest('.curtain-btn')) {
      if (Math.random() > 0.45) {
        createSparkles(e.clientX, e.clientY);
      }
    }
  });
});

// ─── Resize listener ───────────────────────────────────────────────────────
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    initPetals();
  }, 350);
});
