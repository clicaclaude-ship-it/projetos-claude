/* =============================================
   CLICA AI — main.js
   Menu, scroll, header, partials
   ============================================= */

const WHATSAPP_URL = 'https://wa.me/553531959999';

/* --- Carrega partials de header e footer --- */
async function loadPartial(selector, url) {
  const el = document.querySelector(selector);
  if (!el) return;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    el.innerHTML = await res.text();
  } catch (e) {
    console.warn(`Partial não carregado: ${url}`, e);
  }
}

async function loadPartials() {
  // Calcula path relativo para a raiz dependendo do nível da página
  // Conta apenas segmentos de diretório (sem extensão), para funcionar tanto
  // com /blog/ quanto com /blog/post.html
  const parts = location.pathname.split('/').filter(Boolean);
  const depth = parts.filter(p => !p.includes('.')).length;
  const root = depth > 0 ? '../'.repeat(depth) : './';

  await Promise.all([
    loadPartial('#header-placeholder', `${root}assets/partials/header.html`),
    loadPartial('#footer-placeholder', `${root}assets/partials/footer.html`),
  ]);

  // afterHeaderLoad chamado UMA VEZ após ambos os partials carregarem
  afterHeaderLoad();
  markActiveNavLink();
}

/* --- Marca link ativo no menu --- */
function markActiveNavLink() {
  const path = location.pathname;
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href') || '';
    const linkPath = href.replace(/^\//, '');
    const currentPath = path.replace(/^\//, '') || 'index.html';
    if (linkPath && currentPath.includes(linkPath.replace('/index.html', ''))) {
      link.classList.add('active');
    }
  });
}

/* --- Header scroll effect --- */
function initScrollHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;
  const update = () => header.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* --- Hamburger menu --- */
function afterHeaderLoad() {
  initScrollHeader();

  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Fecha ao clicar em link
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* --- Fade-in ao entrar na viewport --- */
function initIntersectionObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-up');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
}

/* --- Accordion (serviços) --- */
function initAccordion() {
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.accordion-item');
      const isOpen = item.classList.contains('open');
      // Fecha todos
      document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));
      // Abre o clicado se estava fechado
      if (!isOpen) item.classList.add('open');
    });
  });
}

/* --- Formulário de contato → WhatsApp --- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const nome = form.querySelector('[name="nome"]')?.value.trim() || '';
    const empresa = form.querySelector('[name="empresa"]')?.value.trim() || '';
    const mensagem = form.querySelector('[name="mensagem"]')?.value.trim() || '';

    const text = encodeURIComponent(
      `Olá, Clica AI!\n\nNome: ${nome}\nEmpresa: ${empresa}\n\nMensagem:\n${mensagem}`
    );
    window.open(`${WHATSAPP_URL}?text=${text}`, '_blank', 'noopener');
  });
}

/* --- Init --- */
document.addEventListener('DOMContentLoaded', async () => {
  await loadPartials();
  initIntersectionObserver();
  initAccordion();
  initContactForm();
});
