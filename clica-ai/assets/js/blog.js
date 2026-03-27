/* =============================================
   CLICA AI — blog.js
   Carrega e renderiza posts via JSON
   ============================================= */

const CATEGORY_LABELS = {
  tutoriais: 'Tutoriais',
  tendencias: 'Tendências',
  cases: 'Cases',
};

/* --- Formata data para pt-BR --- */
function formatDate(iso) {
  const [y, m, d] = iso.split('-');
  const months = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
  return `${parseInt(d)} ${months[parseInt(m) - 1]}. ${y}`;
}

/* --- Gera HTML de um card de post --- */
function renderPostCard(post, rootPath = '') {
  const label = CATEGORY_LABELS[post.category] || post.category;
  const href = `${rootPath}post.html?slug=${post.slug}`;
  return `
    <article class="blog-card">
      <a href="${href}">
        <img class="blog-card-image"
             src="${rootPath}${post.thumbnail}"
             alt="${post.title}"
             loading="lazy"
             onerror="this.src='${rootPath}../assets/images/blog-placeholder.jpg'">
      </a>
      <div class="blog-card-body">
        <span class="blog-category">${label}</span>
        <h3><a href="${href}">${post.title}</a></h3>
        <p>${post.excerpt}</p>
        <div class="blog-meta">
          <span>📅 ${formatDate(post.date)}</span>
        </div>
        <a href="${href}" class="read-more">Ler artigo →</a>
      </div>
    </article>`;
}

/* ---- PÁGINA DE LISTAGEM (/blog/index.html) ---- */
async function initBlogList() {
  const grid = document.getElementById('blog-grid');
  const filters = document.getElementById('blog-filters');
  if (!grid) return;

  let posts = [];
  let activeCategory = 'all';

  try {
    const res = await fetch('data/posts.json');
    posts = await res.json();
  } catch {
    grid.innerHTML = '<p style="text-align:center;padding:40px 0;">Não foi possível carregar os posts.</p>';
    return;
  }

  function render(list) {
    if (list.length === 0) {
      grid.innerHTML = '<p style="text-align:center;padding:40px 0;color:var(--text-secondary);">Nenhum post nesta categoria ainda.</p>';
      return;
    }
    grid.innerHTML = list.map(p => renderPostCard(p)).join('');
  }

  // Filtros
  filters?.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      filters.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.category;
      const filtered = activeCategory === 'all'
        ? posts
        : posts.filter(p => p.category === activeCategory);
      render(filtered);
    });
  });

  render(posts);
}

/* ---- PÁGINA DE POST INDIVIDUAL (/blog/post.html) ---- */
async function initBlogPost() {
  const container = document.getElementById('post-content');
  if (!container) return;

  const slug = new URLSearchParams(location.search).get('slug');
  if (!slug) {
    container.innerHTML = '<p>Post não encontrado.</p>';
    return;
  }

  try {
    const res = await fetch(`data/posts/${slug}.json`);
    if (!res.ok) throw new Error('Not found');
    const post = await res.json();

    // Atualiza título da aba
    document.title = `${post.title} — Blog Clica AI`;

    // Open Graph dinâmico
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', post.title);
    document.querySelector('meta[name="description"]')?.setAttribute('content', post.excerpt);

    const label = CATEGORY_LABELS[post.category] || post.category;

    container.innerHTML = `
      <div class="post-header" style="margin-bottom:40px;">
        <span class="blog-category">${label}</span>
        <h1 style="margin:12px 0 16px;">${post.title}</h1>
        <p style="font-size:1.1rem;">${post.excerpt}</p>
        <div class="blog-meta" style="margin-top:16px;">
          <span>📅 ${formatDate(post.date)}</span>
        </div>
      </div>
      <div class="post-hero-image" style="margin-bottom:40px;">
        <img src="${post.thumbnail}" alt="${post.title}"
             style="width:100%;border-radius:16px;max-height:480px;object-fit:cover;opacity:0.85;"
             onerror="this.style.display='none'">
      </div>
      <div class="post-body" style="max-width:720px;">
        ${post.content}
      </div>
    `;
  } catch {
    container.innerHTML = '<p style="text-align:center;padding:60px 0;">Post não encontrado ou indisponível.</p>';
  }
}

/* --- Init --- */
document.addEventListener('DOMContentLoaded', () => {
  initBlogList();
  initBlogPost();
});
