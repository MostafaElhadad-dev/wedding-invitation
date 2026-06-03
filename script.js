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
const CELEBRATE_MESSAGES = [
  "✨ لقد بدأت البهجة الحقيقية! ✨",
  "💍 يا رب دوّم فرحتهم وأدم سعادتهم 💍",
  "🌹 الحب الحقيقي لا ينتهي بعد الحفلة بل يبدأ من هناك 🌹",
  "💫 ألف مبروك.. ربنا يكتب لهم حياة تملؤها الأنوار 💫",
  "👑 بدأت الليلة وبقي الحب للأبد 👑",
  "🌸 اللهم اجعل زواجهم بداية لكل خير ونعمة 🌸",
];
let celebrateMsgIndex = 0;
let isShowingMessage  = false;
let celebrateTimeout  = null;
let clickListenerAdded = false;   // ← guard: add click only once after wedding

function initCountdown() {
  const weddingDate   = new Date("August 7, 2026 20:15:00").getTime();
  const countdownCard = document.querySelector('.countdown-card');

  // ── Helper: activate past-mode on the card once ──────────────────────────
  function activatePastMode() {
    if (clickListenerAdded) return;
    clickListenerAdded = true;

    // Update heading & description text
    const heading = document.querySelector('.countdown-card .gold-sub-title');
    if (heading) heading.textContent = 'عدى على الفرح السعيد 🎊';

    const desc = document.querySelector('.countdown-description');
    if (desc) desc.textContent = 'كل يوم يمر يزيد الحب ويترسّخ الوفاق بإذن الله';

    // Update timer labels to past language
    const labels   = countdownTimer.querySelectorAll('.timer-label');
    const pastLbls = ['يوم', 'ساعة', 'دقيقة', 'ثانية'];
    labels.forEach((lbl, i) => lbl.textContent = pastLbls[i]);

    // Enable click only NOW (after wedding)
    if (countdownCard) {
      countdownCard.classList.add('past-mode');   // CSS handles cursor + hint
      countdownCard.addEventListener('click', onCountdownClick);
    }
  }

  // ── Click handler (registered only after wedding) ────────────────────────
  function onCountdownClick(e) {
    createSparkles(e.clientX, e.clientY);

    if (isShowingMessage) {
      clearTimeout(celebrateTimeout);
      hideCelebrateMsg(countdownCard);
    } else {
      showCelebrateMsg(countdownCard);
    }
  }

  // ── Tick function ─────────────────────────────────────────────────────────
  function tick() {
    const now      = new Date().getTime();
    const distance = weddingDate - now;

    if (distance < 0) {
      // Past: count UP (elapsed since wedding)
      const elapsed = Math.abs(distance);
      document.getElementById('days').textContent    = Math.floor(elapsed / 86400000).toString().padStart(2, '0');
      document.getElementById('hours').textContent   = Math.floor((elapsed % 86400000) / 3600000).toString().padStart(2, '0');
      document.getElementById('minutes').textContent = Math.floor((elapsed % 3600000) / 60000).toString().padStart(2, '0');
      document.getElementById('seconds').textContent = Math.floor((elapsed % 60000) / 1000).toString().padStart(2, '0');
      activatePastMode();   // idempotent — runs once
    } else {
      // Future: count DOWN
      document.getElementById('days').textContent    = Math.floor(distance / 86400000).toString().padStart(2, '0');
      document.getElementById('hours').textContent   = Math.floor((distance % 86400000) / 3600000).toString().padStart(2, '0');
      document.getElementById('minutes').textContent = Math.floor((distance % 3600000) / 60000).toString().padStart(2, '0');
      document.getElementById('seconds').textContent = Math.floor((distance % 60000) / 1000).toString().padStart(2, '0');
    }
  }

  tick();
  setInterval(tick, 1000);
}

function showCelebrateMsg(card) {
  isShowingMessage = true;
  const msg = CELEBRATE_MESSAGES[celebrateMsgIndex % CELEBRATE_MESSAGES.length];
  celebrateMsgIndex++;

  const overlay = document.createElement('div');
  overlay.id    = 'celebrateOverlay';
  overlay.innerHTML = `<div class="celebrate-text">${msg}</div>`;
  card.appendChild(overlay);

  requestAnimationFrame(() => overlay.classList.add('celebrate-visible'));  
  celebrateTimeout = setTimeout(() => hideCelebrateMsg(card), 3500);
}

function hideCelebrateMsg(card) {
  const overlay = document.getElementById('celebrateOverlay');
  if (!overlay) return;
  overlay.classList.remove('celebrate-visible');
  setTimeout(() => { overlay.remove(); isShowingMessage = false; }, 500);
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
