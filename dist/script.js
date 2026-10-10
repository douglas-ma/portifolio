const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
const brandText = document.querySelector('.brand-text');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const themeToggle = document.querySelector('.theme-toggle');
const language = window.portfolioLanguage;
const t = (text) => language.t(text);

document.querySelectorAll('.language-switch button').forEach((button) => {
  button.addEventListener('click', () => language.applyLanguage(button.dataset.lang, true));
});

const applyTheme = (theme, savePreference = false) => {
  const isLight = theme === 'light';
  document.documentElement.dataset.theme = isLight ? 'light' : 'dark';
  themeToggle?.setAttribute('aria-pressed', String(isLight));
  themeToggle?.setAttribute('aria-label', t(isLight ? 'Ativar modo escuro' : 'Ativar modo claro'));
  themeToggle?.setAttribute('title', t(isLight ? 'Ativar modo escuro' : 'Ativar modo claro'));
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', isLight ? '#f5f4ef' : '#111a23');
  document.dispatchEvent(new Event('portfolio-themechange'));
  if (savePreference) {
    try { localStorage.setItem('portfolio-theme', isLight ? 'light' : 'dark'); } catch { /* A escolha permanece ativa nesta visita. */ }
  }
};

applyTheme(document.documentElement.dataset.theme);
themeToggle?.addEventListener('click', () => {
  applyTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light', true);
});

window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (event) => {
  try {
    if (localStorage.getItem('portfolio-theme')) return;
  } catch { /* Sem armazenamento, acompanhar o sistema. */ }
  applyTheme(event.matches ? 'light' : 'dark');
});

let resetBrandTyping = () => {};
if (brandText) {
  let phrases = ['Douglas Araújo', t('Desenvolvedor Full-Stack')];
  let phraseIndex = 0;
  let characterCount = [...phrases[0]].length;
  let deleting = true;
  let typingTimer;

  const typeNextCharacter = () => {
    if (reducedMotion.matches) return;

    const characters = [...phrases[phraseIndex]];
    characterCount += deleting ? -1 : 1;
    brandText.textContent = characters.slice(0, characterCount).join('');

    let delay;
    if (deleting && characterCount === 0) {
      phraseIndex = (phraseIndex + 1) % phrases.length;
      deleting = false;
      delay = 320;
    } else if (!deleting && characterCount === characters.length) {
      deleting = true;
      delay = 1900;
    } else {
      delay = deleting ? 52 : 85;
    }

    typingTimer = window.setTimeout(typeNextCharacter, delay);
  };

  const resetTyping = () => {
    window.clearTimeout(typingTimer);
    phrases = ['Douglas Araújo', t('Desenvolvedor Full-Stack')];
    phraseIndex = 0;
    characterCount = [...phrases[0]].length;
    deleting = true;
    brandText.textContent = phrases[0];
    if (!reducedMotion.matches) typingTimer = window.setTimeout(typeNextCharacter, 1900);
  };

  reducedMotion.addEventListener('change', resetTyping);
  resetBrandTyping = resetTyping;
  resetTyping();
}

const dotsCanvas = document.querySelector('#falling-dots');
const dotsContext = dotsCanvas?.getContext('2d');

if (dotsCanvas && dotsContext) {
  let dots = [];
  let width = 0;
  let height = 0;
  let animationFrame;
  let lastFrameTime = 0;

  const makeDot = (startAnywhere = true) => ({
    x: Math.random() * width,
    y: startAnywhere ? Math.random() * height : -4,
    radius: 0.5 + Math.random() * 0.8,
    speed: 8 + Math.random() * 14,
    drift: (Math.random() - 0.5) * 4,
    opacity: 0.1 + Math.random() * 0.18,
  });

  const paintDots = () => {
    dotsContext.clearRect(0, 0, width, height);
    const dotColor = document.documentElement.dataset.theme === 'light' ? '25, 74, 150' : '163, 190, 225';
    for (const dot of dots) {
      dotsContext.fillStyle = `rgba(${dotColor}, ${dot.opacity})`;
      dotsContext.beginPath();
      dotsContext.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
      dotsContext.fill();
    }
  };

  const animateDots = (time) => {
    const elapsed = lastFrameTime ? Math.min((time - lastFrameTime) / 1000, 0.05) : 0;
    lastFrameTime = time;
    for (let index = 0; index < dots.length; index += 1) {
      const dot = dots[index];
      dot.y += dot.speed * elapsed;
      dot.x += dot.drift * elapsed;
      if (dot.y > height + 4 || dot.x < -4 || dot.x > width + 4) dots[index] = makeDot(false);
    }
    paintDots();
    animationFrame = window.requestAnimationFrame(animateDots);
  };

  const updateAnimation = () => {
    window.cancelAnimationFrame(animationFrame);
    lastFrameTime = 0;
    paintDots();
    if (!reducedMotion.matches && !document.hidden) {
      animationFrame = window.requestAnimationFrame(animateDots);
    }
  };

  const resizeDots = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    dotsCanvas.width = Math.round(width * pixelRatio);
    dotsCanvas.height = Math.round(height * pixelRatio);
    dotsContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    dots = Array.from({ length: Math.max(22, Math.min(58, Math.round(width / 24))) }, () => makeDot());
    updateAnimation();
  };

  window.addEventListener('resize', resizeDots);
  document.addEventListener('visibilitychange', updateAnimation);
  document.addEventListener('portfolio-themechange', paintDots);
  reducedMotion.addEventListener('change', updateAnimation);
  resizeDots();
}

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', t(isOpen ? 'Abrir menu' : 'Fechar menu'));
  nav.classList.toggle('is-open', !isOpen);
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', t('Abrir menu'));
  });
});

document.querySelector('#year').textContent = new Date().getFullYear();

const previewDialog = document.querySelector('#project-preview');
const previewImage = document.querySelector('#preview-image');
const previewFrame = document.querySelector('#preview-frame');
const previewTitle = document.querySelector('#preview-title');
const previewCaption = document.querySelector('#preview-caption-text');
const previewControls = document.querySelector('.preview-controls');
const previewCounter = document.querySelector('#preview-counter');
const previewToggle = document.querySelector('.preview-toggle');
const previewGalleries = {
  encurta: [
    { src: 'assets/previews/encurta-link.png', caption: 'Encurtamento de links e personalização do endereço' },
    { src: 'assets/previews/encurta-qrcode.png', caption: 'Geração de QR Code com opções de personalização' },
  ],
  'entre-nos': [
    { src: 'assets/previews/entre-nos-inicio.png', caption: 'Tela inicial do projeto' },
    { src: 'assets/previews/entre-nos-sala.png', caption: 'Configuração inicial da sala' },
    { src: 'assets/previews/entre-nos-participantes.png', caption: 'Lista de participantes' },
    { src: 'assets/previews/entre-nos-exclusoes.png', caption: 'Regras de exclusão do sorteio' },
    { src: 'assets/previews/entre-nos-convites.png', caption: 'Sala com convites individuais' },
  ],
  streak: [
    { src: 'assets/previews/streak-inicio.png', caption: 'Tela inicial e modos de jogo' },
    { src: 'assets/previews/streak-draft.png', caption: 'Montagem do elenco no draft' },
    { src: 'assets/previews/streak-partida.png', caption: 'Simulação de uma partida' },
  ],
  propeg: [
    { src: 'assets/previews/propeg-acesso.png', caption: 'Página de acesso à plataforma' },
    { src: 'assets/previews/propeg-painel.png', caption: 'Painel com indicadores e projetos recentes' },
    { src: 'assets/previews/propeg-projetos.png', caption: 'Organização dos projetos por situação' },
    { src: 'assets/previews/propeg-criacao.png', caption: 'Etapas de criação de um projeto' },
  ],
  tate: [
    { src: 'assets/previews/tate-inicio.png', caption: 'Página inicial do sistema de acórdãos' },
    { src: 'assets/previews/tate-busca.png', caption: 'Busca e filtros de acórdãos' },
  ],
};
let previewSlides = [];
let previewIndex = 0;
let previewPlaying = false;
let previewTimer;
let activePreviewTitle = '';
let activePreviewSource = '';

function syncPreviewTimer() {
  window.clearInterval(previewTimer);
  if (previewPlaying && previewDialog?.open && !document.hidden && previewSlides.length > 1) {
    previewTimer = window.setInterval(() => showPreviewSlide(previewIndex + 1), 5500);
  }
  if (previewToggle) {
    previewToggle.textContent = t(previewPlaying ? 'Pausar' : 'Reproduzir');
    previewToggle.setAttribute('aria-label', t(previewPlaying ? 'Pausar sequência' : 'Reproduzir sequência'));
  }
}

function showPreviewSlide(index) {
  if (!previewImage || !previewSlides.length) return;
  previewIndex = (index + previewSlides.length) % previewSlides.length;
  const slide = previewSlides[previewIndex];
  previewImage.src = slide.src;
  previewImage.alt = language.language === 'en'
    ? `${t(slide.caption)} — ${t(activePreviewTitle)}`
    : `${slide.caption} do projeto ${activePreviewTitle}`;
  if (previewCaption) previewCaption.textContent = t(slide.caption);
  if (previewCounter) previewCounter.textContent = `${String(previewIndex + 1).padStart(2, '0')} / ${String(previewSlides.length).padStart(2, '0')}`;
  if (previewDialog?.open && !reducedMotion.matches) {
    previewImage.animate([{ opacity: 0.35 }, { opacity: 1 }], { duration: 300, easing: 'ease-out' });
  }
}

if (new URLSearchParams(window.location.search).has('embedded')) {
  document.documentElement.dataset.embedded = 'true';
}

document.querySelectorAll('.preview-trigger').forEach((button) => {
  button.addEventListener('click', () => {
    const source = button.dataset.previewSrc;
    const url = button.dataset.previewUrl;
    const gallery = previewGalleries[button.dataset.previewGallery];
    const title = button.dataset.previewTitle;
    if ((!source && !url && !gallery) || !title || !previewDialog || !previewImage || !previewFrame || !previewTitle) return;
    previewSlides = gallery || [];
    activePreviewTitle = title;
    activePreviewSource = gallery ? 'gallery' : source ? 'image' : 'frame';
    previewTitle.textContent = t(title);
    previewImage.hidden = !source && !gallery;
    previewFrame.hidden = !url;
    if (gallery) {
      gallery.forEach((slide) => { new Image().src = slide.src; });
      showPreviewSlide(0);
    } else if (source) {
      previewImage.src = source;
      previewImage.alt = language.language === 'en' ? `Featured screen — ${t(title)}` : `Tela em destaque do projeto ${title}`;
      if (previewCaption) previewCaption.textContent = language.language === 'en' ? `Featured screen · ${t(title)}` : `Tela em destaque · ${title}`;
    } else {
      previewFrame.src = url;
      previewFrame.title = language.language === 'en' ? `Home screen — ${t(title)}` : `Tela principal do projeto ${title}`;
      previewImage.removeAttribute('src');
      if (previewCaption) previewCaption.textContent = language.language === 'en' ? `Featured screen · ${t(title)}` : `Tela em destaque · ${title}`;
    }
    if (!url) previewFrame.removeAttribute('src');
    if (previewControls) previewControls.hidden = !gallery;
    previewDialog.showModal();
    previewPlaying = Boolean(gallery) && !reducedMotion.matches;
    syncPreviewTimer();
  });
});

previewDialog?.querySelector('.preview-previous')?.addEventListener('click', () => {
  showPreviewSlide(previewIndex - 1);
  syncPreviewTimer();
});
previewDialog?.querySelector('.preview-next')?.addEventListener('click', () => {
  showPreviewSlide(previewIndex + 1);
  syncPreviewTimer();
});
previewToggle?.addEventListener('click', () => {
  previewPlaying = !previewPlaying;
  syncPreviewTimer();
});
previewDialog?.querySelector('.preview-close')?.addEventListener('click', () => previewDialog.close());
previewDialog?.addEventListener('click', (event) => {
  if (event.target === previewDialog) previewDialog.close();
});
previewDialog?.addEventListener('close', () => {
  previewPlaying = false;
  syncPreviewTimer();
  previewSlides = [];
  activePreviewTitle = '';
  activePreviewSource = '';
  previewImage?.removeAttribute('src');
  previewFrame?.removeAttribute('src');
  if (previewImage) previewImage.hidden = true;
  if (previewFrame) previewFrame.hidden = true;
});
document.addEventListener('visibilitychange', syncPreviewTimer);
reducedMotion.addEventListener('change', (event) => {
  if (event.matches) {
    previewPlaying = false;
    syncPreviewTimer();
  }
});

const syncSkillLabels = () => {
  document.querySelectorAll('.skill-group a[data-skill-name]').forEach((link) => {
    const skill = t(link.dataset.skillName);
    link.setAttribute('aria-label', language.language === 'en'
      ? `${skill} — opens the official website in a new tab`
      : `${skill} — abre o site oficial em uma nova aba`);
  });
};
syncSkillLabels();

document.addEventListener('portfolio-languagechange', () => {
  applyTheme(document.documentElement.dataset.theme);
  resetBrandTyping();
  if (menuButton) menuButton.setAttribute('aria-label', t(menuButton.getAttribute('aria-expanded') === 'true' ? 'Fechar menu' : 'Abrir menu'));
  syncSkillLabels();
  if (previewDialog?.open) {
    previewTitle.textContent = t(activePreviewTitle);
    if (activePreviewSource === 'gallery') showPreviewSlide(previewIndex);
    else if (activePreviewSource === 'image') {
      previewImage.alt = language.language === 'en' ? `Featured screen — ${t(activePreviewTitle)}` : `Tela em destaque do projeto ${activePreviewTitle}`;
      previewCaption.textContent = language.language === 'en' ? `Featured screen · ${t(activePreviewTitle)}` : `Tela em destaque · ${activePreviewTitle}`;
    } else if (activePreviewSource === 'frame') {
      previewFrame.title = language.language === 'en' ? `Home screen — ${t(activePreviewTitle)}` : `Tela principal do projeto ${activePreviewTitle}`;
      previewCaption.textContent = language.language === 'en' ? `Featured screen · ${t(activePreviewTitle)}` : `Tela em destaque · ${activePreviewTitle}`;
    }
    syncPreviewTimer();
  }
});

const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.site-nav a');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        const active = link.getAttribute('href') === `#${entry.target.id}`;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-22% 0px -68% 0px' });
  sections.forEach((section) => observer.observe(section));
}
