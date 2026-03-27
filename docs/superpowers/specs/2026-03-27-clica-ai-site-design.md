# Design Spec — Site Clica AI

**Data:** 2026-03-27
**Status:** Aprovado

---

## 1. Visão Geral

Site institucional da **Clica AI**, empresa de soluções em inteligência artificial. O objetivo do site é apresentar os serviços, gerar leads via WhatsApp, publicar conteúdo no blog e converter visitantes em clientes.

---

## 2. Público-Alvo

Público amplo e diverso:
- Pequenas e médias empresas (PMEs) querendo adotar IA
- Grandes corporações buscando consultoria estratégica
- Startups e empreendedores construindo produtos com IA
- Profissionais e autônomos automatizando tarefas

---

## 3. Personalidade da Marca

A Clica AI combina quatro atributos:
- **Técnica e confiável** — especialistas sérios em IA
- **Acessível e didática** — IA para todos, sem complicação
- **Inovadora e arrojada** — visual futurista, referência no setor
- **Parceira e próxima** — tom humano, aliada do cliente

---

## 4. Serviços Principais (Destaque)

1. **Agentes de IA** — protagonista principal
2. **Automação de Processos** — protagonista principal
3. Consultoria em IA — secundário
4. Desenvolvimento de IA — secundário
5. Treinamento em IA — secundário

---

## 5. Páginas do Site (7 páginas)

| Página | Arquivo | Propósito |
|---|---|---|
| Home | `index.html` | Primeira impressão, apresentação e conversão |
| Serviços | `servicos.html` | Detalhamento completo dos serviços |
| Sobre Nós | `sobre.html` | Missão, equipe e história da Clica AI |
| Cases de Sucesso | `cases.html` | Provas sociais e resultados reais |
| Preços | `precos.html` | Tudo sob consulta via WhatsApp |
| Blog | `blog/index.html` | Artigos sobre IA |
| Contato | `contato.html` | Formulário + WhatsApp + localização |

---

## 6. Estrutura da Homepage

Sequência de seções (modelo persuasivo — problema → solução):

1. **Hero** — Headline de impacto + subheadline + 2 CTAs (Falar com especialista / Ver serviços)
2. **Problema** — Seção identificando as dores do cliente ("seu negócio ainda opera no manual?")
3. **Solução** — Apresentação da Clica AI como resposta
4. **Serviços em Destaque** — Cards de Agentes de IA e Automação em destaque + 3 serviços secundários
5. **Cases** — Preview de 3 cases com resultado numérico
6. **Blog** — Preview dos 3 posts mais recentes
7. **CTA Final** — Chamada para WhatsApp
8. **Footer** — Links, redes sociais, contato

---

## 7. Estrutura das Demais Páginas

**Serviços:** Card expandível por serviço com descrição, benefícios, para quem é indicado e CTA WhatsApp.

**Sobre Nós:** Missão e visão → História → Equipe (foto, nome, cargo) → Valores em cards.

**Cases de Sucesso:** Grid de cards com setor, desafio, solução aplicada e resultado mensurável. CTA WhatsApp.

**Preços:** Headline "Cada projeto é único" → Explicação do processo de consultoria → O que está incluído → CTA direto para WhatsApp (+553531959999).

**Blog — Lista:** Filtro por categoria (Tutoriais / Tendências / Cases) + grid de cards + paginação via JS.

**Blog — Post:** Template único (`post.html`) que carrega o artigo via JSON a partir do slug na URL.

**Contato:** Formulário (nome, empresa, mensagem) + botão WhatsApp + endereço/localização. O envio do formulário redireciona para o WhatsApp com a mensagem pré-preenchida (sem backend necessário). Formato: `https://wa.me/553531959999?text=Nome%3A+...`

---

## 8. Arquitetura Técnica

**Stack:** HTML5, CSS3, JavaScript puro (sem frameworks).

**Estrutura de arquivos:**
```
clica-ai/
├── index.html
├── servicos.html
├── sobre.html
├── cases.html
├── precos.html
├── contato.html
├── sitemap.xml
├── robots.txt
├── blog/
│   ├── index.html
│   ├── post.html
│   └── data/
│       ├── posts.json        # Índice de todos os posts
│       └── posts/            # Um .json por artigo
├── assets/
│   ├── css/
│   │   ├── global.css        # Reset, variáveis CSS, tipografia
│   │   └── components.css    # Header, footer, botões, cards
│   ├── js/
│   │   ├── main.js           # Menu, scroll, WhatsApp button
│   │   └── blog.js           # Carrega e renderiza posts do JSON
│   └── images/               # Imagens geradas por IA
```

**Decisões técnicas:**
- Header e footer incluídos via `fetch` + `innerHTML` para evitar repetição entre páginas. **Requer servidor HTTP** (não funciona com `file://`). Em desenvolvimento: usar `npx serve .` ou Live Server do VS Code. Em produção: qualquer servidor estático.
- Blog: `posts.json` lista os artigos; `post.html` lê o slug da URL (`?slug=nome-do-post`) e faz `fetch` do JSON correspondente
- WhatsApp: botão flutuante fixo no canto inferior direito em todas as páginas, com link `https://wa.me/553531959999`
- Hospedagem: compatível com GitHub Pages, Netlify ou qualquer servidor estático

---

## 9. Identidade Visual

**Estilo:** Gradient Bold — escuro com dourado.

**Paleta:**
| Papel | Valor |
|---|---|
| Background | `linear-gradient(135deg, #0f0c29, #302b63)` |
| Cor primária (CTA) | `linear-gradient(135deg, #f7971e, #ffd200)` |
| Texto principal | `#ffffff` |
| Texto secundário | `rgba(255,255,255,0.67)` |
| Cards / Glass | `rgba(255,255,255,0.08)` com `border: 1px solid rgba(255,255,255,0.12)` |

**Tipografia:** Inter (Google Fonts)
- Headings: `font-weight: 700–800`, `letter-spacing: -0.5px`
- Body: `font-weight: 400–500`, `line-height: 1.6`

**Botões:**
- Primário: gradiente dourado, texto escuro, `border-radius: 25px`
- Secundário: borda branca translúcida, texto branco, `border-radius: 25px`

---

## 10. Estratégia de Imagens

Todas as imagens geradas por IA (Midjourney ou Ideogram). Prompt base: *"futuristic AI corporate, dark gradient purple gold, cinematic lighting, photorealistic"*.

| Seção | Estilo |
|---|---|
| Hero (todas as páginas) | Realista futurista — robô humanoide, cidade tech, ambiente corporativo |
| Fundos de seção / separadores | Abstrata — redes neurais, partículas, ondas digitais |
| Cards de serviço | Abstrata temática por serviço |
| Cases de sucesso | Realista — ambiente do setor (indústria, saúde, varejo) |
| Blog — thumbnails | Mix: abstrata para Tendências, realista para Cases, didática para Tutoriais |
| Sobre Nós | Realista — equipe em ambiente tech |

---

## 11. Blog

**Categorias:** Tutoriais práticos / Notícias e Tendências / Cases de Clientes

**Formato de post (JSON):**
```json
{
  "slug": "como-automatizar-atendimento",
  "title": "Como automatizar o atendimento da sua empresa com IA",
  "category": "tutoriais",
  "date": "2026-03-27",
  "thumbnail": "/assets/images/blog/atendimento-ia.jpg",
  "excerpt": "Descubra como agentes de IA podem responder clientes 24/7...",
  "content": "<p>Conteúdo em HTML...</p>"
}
```

**posts.json** — índice com todos os posts (slug, título, categoria, data, thumbnail, excerpt). Usado na listagem e no filtro por categoria.

---

## 12. SEO

- `<title>` e `<meta description>` únicos por página
- H1 único por página, hierarquia correta (H2, H3)
- `sitemap.xml` com todas as URLs
- `robots.txt` permitindo indexação
- Schema markup: `Organization` (site), `Article` (blog posts)
- `alt` text descritivo em todas as imagens
- Open Graph tags em todas as páginas (título, descrição, imagem) para compartilhamento via WhatsApp e redes sociais
- URLs amigáveis no blog: `/blog/post.html?slug=nome-do-post`

---

## 13. Contato via WhatsApp

- Número: **+55 35 3195-9999**
- Botão flutuante presente em todas as páginas
- CTAs adicionais no final de cada seção de serviço e na página de preços
- Link: `https://wa.me/553531959999`

---

## 14. Fora do Escopo

- Backend / servidor de aplicação
- CMS ou painel de administração
- Autenticação de usuários
- E-commerce ou pagamentos
- Analytics (pode ser adicionado posteriormente via Google Tag Manager)
