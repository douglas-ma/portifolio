const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
const brandText = document.querySelector('.brand-text');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (brandText) {
  const phrases = ['Douglas Araújo', 'Desenvolvedor Full-Stack'];
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
    phraseIndex = 0;
    characterCount = [...phrases[0]].length;
    deleting = true;
    brandText.textContent = phrases[0];
    if (!reducedMotion.matches) typingTimer = window.setTimeout(typeNextCharacter, 1900);
  };

  reducedMotion.addEventListener('change', resetTyping);
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
    radius: 0.6 + Math.random() * 0.9,
    speed: 7 + Math.random() * 17,
    drift: (Math.random() - 0.5) * 5,
    opacity: 0.15 + Math.random() * 0.3,
  });

  const paintDots = () => {
    dotsContext.clearRect(0, 0, width, height);
    for (const dot of dots) {
      dotsContext.fillStyle = `rgba(178, 184, 218, ${dot.opacity})`;
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
    dots = Array.from({ length: Math.max(38, Math.min(95, Math.round(width / 14))) }, () => makeDot());
    updateAnimation();
  };

  window.addEventListener('resize', resizeDots);
  document.addEventListener('visibilitychange', updateAnimation);
  reducedMotion.addEventListener('change', updateAnimation);
  resizeDots();
}

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Abrir menu' : 'Fechar menu');
  nav.classList.toggle('is-open', !isOpen);
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Abrir menu');
  });
});

document.querySelector('#year').textContent = new Date().getFullYear();

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
