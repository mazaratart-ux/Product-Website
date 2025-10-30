const panels = document.querySelectorAll('.panel');
const navButtons = document.querySelectorAll('.nav__item');
const startDesignBtn = document.getElementById('startDesign');
const themeToggle = document.getElementById('themeToggle');

const switchPanel = (targetId) => {
  panels.forEach((panel) => {
    panel.classList.toggle('active', panel.id === targetId);
  });
  navButtons.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.target === targetId);
  });
  const target = document.getElementById(targetId);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

navButtons.forEach((btn) =>
  btn.addEventListener('click', () => switchPanel(btn.dataset.target))
);

if (startDesignBtn) {
  startDesignBtn.addEventListener('click', () => switchPanel('discover'));
}

document.querySelectorAll('.btn[data-target]').forEach((btn) => {
  btn.addEventListener('click', (event) => {
    const target = event.currentTarget.dataset.target;
    if (target) {
      switchPanel(target);
    }
  });
});

// Theme toggling with persistence
const THEME_KEY = 'polarflow-theme';
const applyTheme = (mode) => {
  document.body.classList.toggle('dark', mode === 'dark');
  if (themeToggle) {
    themeToggle.textContent = mode === 'dark' ? '☼' : '☾';
  }
};

try {
  const storedTheme = localStorage.getItem(THEME_KEY);
  if (storedTheme) {
    applyTheme(storedTheme);
  }
} catch (error) {
  console.warn('Tema tercihi yüklenemedi:', error);
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark');
    const mode = isDark ? 'dark' : 'light';
    themeToggle.textContent = isDark ? '☼' : '☾';
    try {
      localStorage.setItem(THEME_KEY, mode);
    } catch (error) {
      console.warn('Tema tercihi kaydedilemedi:', error);
    }
  });
}

// Configurator interactions
const colorPicker = document.getElementById('colorPicker');
const textureSelect = document.getElementById('textureSelect');
const capRadios = document.querySelectorAll('input[name="cap"]');
const previewBody = document.querySelector('.preview__body');
const previewHalo = document.querySelector('.preview__halo');
const previewName = document.querySelector('.preview__name');
const previewDesc = document.querySelector('.preview__desc');

const textureNames = {
  mat: 'Saten Mat',
  parlak: 'Aurora Parlak',
  dokulu: 'Volkanik Dokulu'
};

const capNames = {
  flip: 'Flip-top',
  twist: 'Twist-lock'
};

const generateName = (colorValue, textureValue) => {
  const colorMap = {
    '#38bdf8': 'Aurora Sky',
    '#e879f9': 'Nebula Bloom',
    '#f97316': 'Solar Ember',
    '#22c55e': 'Verdant Pulse',
    '#6366f1': 'Lunar Slate'
  };
  const normalized = colorValue.toLowerCase();
  if (!colorMap[normalized]) {
    colorMap[normalized] = `Signature ${textureValue}`;
  }
  return colorMap[normalized];
};

const updatePreview = () => {
  const color = colorPicker?.value || '#38bdf8';
  const texture = textureSelect?.value || 'mat';
  const cap = [...capRadios].find((radio) => radio.checked)?.value || 'flip';

  previewBody?.style.setProperty('background', `linear-gradient(180deg, ${color} 0%, ${color}40 100%)`);
  previewHalo?.style.setProperty('background', `${color}99`);
  previewHalo?.style.setProperty('box-shadow', `0 0 30px ${color}66`);
  if (previewName) {
    previewName.textContent = generateName(color, textureNames[texture]);
  }
  if (previewDesc) {
    previewDesc.textContent = `${textureNames[texture]} • ${capNames[cap]}`;
  }
};

colorPicker?.addEventListener('input', updatePreview);
textureSelect?.addEventListener('change', updatePreview);
capRadios.forEach((radio) => radio.addEventListener('change', updatePreview));

const extraColors = ['#e879f9', '#f97316', '#22c55e', '#6366f1'];
let colorIndex = 0;
setInterval(() => {
  colorIndex = (colorIndex + 1) % extraColors.length;
  previewBody?.animate(
    [{ filter: 'brightness(1)' }, { filter: 'brightness(1.2)' }, { filter: 'brightness(1)' }],
    { duration: 1200, easing: 'ease-in-out' }
  );
  previewHalo?.animate(
    [{ opacity: 0.4 }, { opacity: 1 }, { opacity: 0.4 }],
    { duration: 1200, easing: 'ease-in-out' }
  );
}, 4000);

updatePreview();

// Chart animation
const chartObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.chart__bar').forEach((bar) => {
          const value = bar.dataset.value;
          bar.style.setProperty('--progress', `${value}%`);
          bar.style.setProperty(
            'box-shadow',
            `0 12px 24px rgba(14, 165, 233, ${Math.min(value / 180, 0.45)})`
          );
        });
        chartObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.4 }
);

const chartContainer = document.querySelector('.insights .chart');
if (chartContainer) {
  chartObserver.observe(chartContainer);
}

// Accordion behavior
const accordionTriggers = document.querySelectorAll('.accordion__trigger');
accordionTriggers.forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const expanded = trigger.getAttribute('aria-expanded') === 'true';
    accordionTriggers.forEach((btn) => {
      if (btn !== trigger) {
        btn.setAttribute('aria-expanded', 'false');
        btn.nextElementSibling.hidden = true;
      }
    });
    trigger.setAttribute('aria-expanded', String(!expanded));
    trigger.nextElementSibling.hidden = expanded;
  });
});

// Contact form simulation
const contactForm = document.querySelector('.contact-form');
contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const status = contactForm.querySelector('.form-status');
  if (!status) return;
  status.textContent = 'Gönderiliyor...';
  setTimeout(() => {
    status.textContent = 'Teşekkürler! Ekibimiz kısa sürede sizinle iletişime geçecek.';
    contactForm.reset();
    updatePreview();
  }, 1200);
});

// Demo button interaction
const bookDemoBtn = document.getElementById('bookDemo');
bookDemoBtn?.addEventListener('click', () => {
  bookDemoBtn.classList.add('spark');
  const original = bookDemoBtn.textContent;
  bookDemoBtn.textContent = 'Takvim gönderildi!';
  setTimeout(() => {
    bookDemoBtn.classList.remove('spark');
    bookDemoBtn.textContent = original;
  }, 1500);
});

// Canvas animation for hero bottle
const canvas = document.getElementById('bottleCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let size = 0;
  let particles = [];

  const createParticles = () =>
    Array.from({ length: 80 }, (_, i) => ({
      angle: (Math.PI * 2 * i) / 80,
      radius: size * 0.22,
      speed: 0.002 + Math.random() * 0.004,
      amplitude: 18 + Math.random() * 30,
      size: 2 + Math.random() * 3
    }));

  const resizeCanvas = () => {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    size = Math.max(rect.width, rect.height, 1) * dpr;
    canvas.width = size;
    canvas.height = size;
    particles = createParticles();
  };

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const render = (time) => {
    ctx.clearRect(0, 0, size, size);

    const gradient = ctx.createRadialGradient(size / 2, size / 2, size * 0.05, size / 2, size / 2, size * 0.5);
    gradient.addColorStop(0, 'rgba(14, 165, 233, 0.25)');
    gradient.addColorStop(1, 'rgba(14, 165, 233, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    particles.forEach((particle) => {
      const offset = Math.sin(time * particle.speed + particle.angle) * particle.amplitude;
      const x = size / 2 + Math.cos(particle.angle) * (particle.radius + offset);
      const y = size / 2 + Math.sin(particle.angle) * (particle.radius + offset);
      ctx.beginPath();
      ctx.fillStyle = 'rgba(56, 189, 248, 0.8)';
      ctx.arc(x, y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(render);
  };

  requestAnimationFrame(render);
}

// Orbit animation
const orbit = document.querySelector('.hero__orbit');
if (orbit) {
  const orbitItems = orbit.querySelectorAll('span');
  orbitItems.forEach((item, index) => {
    item.animate(
      [
        { transform: 'translateY(0px)', opacity: 0.7 },
        { transform: 'translateY(-10px)', opacity: 1 },
        { transform: 'translateY(0px)', opacity: 0.7 }
      ],
      {
        duration: 3200,
        iterations: Infinity,
        easing: 'ease-in-out',
        delay: index * 200
      }
    );
  });
}

// Category hover events
const categoryCards = document.querySelectorAll('.category-grid .card');
categoryCards.forEach((card) => {
  const title = card.querySelector('h3');
  card.addEventListener('mouseenter', () => {
    title.animate(
      [
        { letterSpacing: '0.04em' },
        { letterSpacing: '0.16em' },
        { letterSpacing: '0.04em' }
      ],
      { duration: 1000, easing: 'ease-out' }
    );
  });
});

// Smooth background movement based on pointer
let pointerX = window.innerWidth / 2;
let pointerY = window.innerHeight / 2;
const backgroundGrid = document.getElementById('background-grid');

window.addEventListener('pointermove', (event) => {
  pointerX = event.clientX;
  pointerY = event.clientY;
  const xPercent = (pointerX / window.innerWidth) * 100;
  const yPercent = (pointerY / window.innerHeight) * 100;
  if (backgroundGrid) {
    backgroundGrid.style.backgroundPosition = `${xPercent}% ${yPercent}%`;
  }
});

// Keep track of nav visibility on scroll
let lastScroll = 0;
const topbar = document.querySelector('.topbar');
window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;
  if (currentScroll > lastScroll && currentScroll > 80) {
    topbar?.classList.add('topbar--hidden');
  } else {
    topbar?.classList.remove('topbar--hidden');
  }
  lastScroll = currentScroll;
});
