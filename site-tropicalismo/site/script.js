// ===== Menu mobile =====
const burger = document.querySelector('.burger');
const menu = document.getElementById('menu');
burger.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  menu.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
}));

// ===== Animação de entrada =====
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = (i % 4) * 70 + 'ms';
  io.observe(el);
});

// ===== Link ativo no menu =====
const links = [...menu.querySelectorAll('a')];
const secs = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
const spy = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
secs.forEach(s => spy.observe(s));

// ===== Linha do tempo =====
const tlTexts = [
  'Um Brasil em rápida transformação cultural, política e urbana prepara o terreno para novas linguagens.',
  'Canções como "Alegria, Alegria" e "Domingo no Parque" chegam ao festival e estranham o público com guitarras elétricas.',
  'O álbum-manifesto "Tropicália ou Panis et Circencis" reúne a turma do movimento; no fim do ano, o AI-5 endurece a censura.',
  'A repressão atinge os artistas: Caetano Veloso e Gilberto Gil são presos e deixam o país.',
  'A atitude tropicalista segue influenciando a música, as artes e o comportamento brasileiros.'
];
const tlText = document.getElementById('tl-text');
document.querySelectorAll('.tl-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tl-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    tlText.textContent = tlTexts[+btn.dataset.i];
  });
});

// ===== Modal de artistas =====
const modal = document.getElementById('modal');
const mImg = document.getElementById('m-img');
const mNome = document.getElementById('m-nome');
const mPapel = document.getElementById('m-papel');
let lastFocus = null;

function openModal(btn) {
  lastFocus = btn;
  mImg.src = btn.dataset.img;
  mImg.alt = btn.dataset.nome;
  mNome.textContent = btn.dataset.nome;
  mPapel.innerHTML = btn.dataset.papel;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  document.getElementById('modal-x').focus();
}
function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lastFocus) lastFocus.focus();
}
document.querySelectorAll('.artist').forEach(b => b.addEventListener('click', () => openModal(b)));
document.getElementById('modal-x').addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });


// ======================================================
// FORMAS ANIMADAS — flores, sóis, círculos (SVG + CSS + JS)
// ======================================================
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const INK = '#1a1014';
const PALETTE = ['#ff2d87', '#ffc81e', '#0fa958', '#1f5fff', '#ff6a1a', '#7a2cff', '#fff6e3'];
const stroke = `stroke="${INK}" stroke-width="2.5"`;

function flower(petal, center, n = 8, rx = 10, ry = 20, cy = -27, cr = 13) {
  let s = '';
  for (let i = 0; i < n; i++) {
    s += `<g transform="rotate(${(360 / n) * i})"><ellipse class="petal" style="animation-delay:${(i * 0.18).toFixed(2)}s" cx="0" cy="${cy}" rx="${rx}" ry="${ry}" fill="${petal}" ${stroke}/></g>`;
  }
  return `<svg viewBox="-50 -50 100 100">${s}<circle r="${cr}" fill="${center}" ${stroke}/></svg>`;
}

function ring(c1, c2) {
  const r = [46, 35, 24, 13];
  return `<svg viewBox="-50 -50 100 100">${r.map((v, i) =>
    `<circle class="ring-c" style="animation-delay:${i * 0.25}s" r="${v}" fill="${i % 2 ? c2 : c1}" ${stroke}/>`).join('')}</svg>`;
}
function dot(c) { return `<svg viewBox="-50 -50 100 100"><circle r="40" fill="${c}" ${stroke}/></svg>`; }

const SHAPES = {
  flower: (c) => flower(c[0], c[1]),
  ring: (c) => ring(c[0], c[1]),
  dot: (c) => dot(c[0])
};

// t=tipo, s=tamanho(px), x/y=posição (%), c=cores, a=animação, sp=parallax de scroll, d=parallax do mouse
const DECO = {
  '#inicio': [
    { t: 'flower', s: 130, x: 30, y: 70, c: ['#ff2d87', '#fff6e3'], a: 'spin', sp: -.06, d: -35 },
    { t: 'ring', s: 150, x: 14, y: 14, c: ['#0fa958', '#fff6e3'], a: 'pulse', sp: .05, d: 20 },
    { t: 'dot', s: 64, x: 54, y: 10, c: ['#42e83c'], a: 'bob', sp: .18, d: 50 },
    { t: 'flower', s: 90, x: 70, y: 60, c: ['#0fa958', '#fff6e3'], a: 'sway', sp: .08, d: 30 }
  ],
  '#tropicalismo': [
    { t: 'flower', s: 150, x: 92, y: 3, c: ['#ffc81e', '#ff2d87'], a: 'spin', sp: .07 },
    { t: 'ring', s: 90, x: 94, y: 70, c: ['#1f5fff', '#fff6e3'], a: 'pulse', sp: .06 }
  ],
  '#artistas': [
    { t: 'flower', s: 120, x: -2, y: 55, c: ['#ff2d87', '#ffc81e'], a: 'spin-r', sp: -.06 }
  ],
  '#projetos': [
    { t: 'ring', s: 130, x: -3, y: 6, c: ['#ff2d87', '#ffc81e'], a: 'pulse', sp: .06 },
    { t: 'flower', s: 140, x: 92, y: 68, c: ['#0fa958', '#ffc81e'], a: 'spin', sp: -.05 },
    { t: 'dot', s: 50, x: 50, y: 3, c: ['#ff6a1a'], a: 'bob', sp: .1 }
  ],
  '#musica': [
    { t: 'flower', s: 120, x: 93, y: 4, c: ['#7a2cff', '#ffc81e'], a: 'spin-r', sp: .06 }
  ],
  '#maquete': [
    { t: 'flower', s: 100, x: 2, y: 6, c: ['#1f5fff', '#fff6e3'], a: 'sway', sp: -.05 }
  ],
  '#moda': [
    { t: 'ring', s: 120, x: 92, y: 74, c: ['#ffc81e', '#1a1014'], a: 'pulse', sp: -.05 }
  ],
  '#cartaz': [
    { t: 'flower', s: 130, x: 4, y: 86, c: ['#ff2d87', '#ffc81e'], a: 'spin-r', sp: .05 }
  ],
  '#grupo': [
    { t: 'flower', s: 110, x: -2, y: 60, c: ['#ffc81e', '#ff2d87'], a: 'spin', sp: -.05 },
    { t: 'ring', s: 80, x: 95, y: 88, c: ['#1f5fff', '#fff6e3'], a: 'pulse', sp: .05 }
  ]
};

const decoItems = [];
Object.entries(DECO).forEach(([sel, list]) => {
  const host = document.querySelector(sel);
  if (!host) return;
  const layer = document.createElement('div');
  layer.className = 'deco';
  layer.setAttribute('aria-hidden', 'true');
  list.forEach(o => {
    const el = document.createElement('div');
    el.className = `deco-item a-${o.a}`;
    el.style.cssText = `--s:${o.s};left:${o.x}%;top:${o.y}%`;
    el.innerHTML = SHAPES[o.t](o.c);
    layer.appendChild(el);
    decoItems.push({ el, host, sp: o.sp || 0, d: o.d || 0 });
  });
  host.insertBefore(layer, host.firstChild);
});

// Parallax: scroll move as formas em velocidades diferentes; no topo, o mouse também
let mx = 0, my = 0, ticking = false;
function paralax() {
  ticking = false;
  const vh = innerHeight, rects = new Map();
  decoItems.forEach(it => {
    if (!rects.has(it.host)) rects.set(it.host, it.host.getBoundingClientRect());
    const r = rects.get(it.host);
    if (r.bottom < -200 || r.top > vh + 200) return;
    const off = r.top + r.height / 2 - vh / 2;
    const y = -off * it.sp + my * it.d;
    const x = mx * it.d;
    it.el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;
  });
}
function pedir() { if (!ticking) { ticking = true; requestAnimationFrame(paralax); } }
if (!reduce) {
  addEventListener('scroll', pedir, { passive: true });
  addEventListener('resize', pedir);
  document.getElementById('inicio').addEventListener('mousemove', e => {
    mx = e.clientX / innerWidth - 0.5;
    my = e.clientY / innerHeight - 0.5;
    pedir();
  });
  pedir();
}

// Título do hero: cada letra pula ao passar o mouse
const h1 = document.querySelector('.hero h1');
h1.setAttribute('aria-label', h1.textContent);
h1.innerHTML = [...h1.textContent].map(ch => `<span aria-hidden="true">${ch}</span>`).join('');

// Explosão de flores, sóis e bolinhas ao clicar
function burst(x, y) {
  const tipos = ['flower', 'dot', 'ring'];
  for (let i = 0; i < 8; i++) {
    const t = tipos[Math.floor(Math.random() * tipos.length)];
    const c1 = PALETTE[Math.floor(Math.random() * 6)];
    let c2 = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    if (c2 === c1) c2 = '#fff6e3';
    const el = document.createElement('div');
    const ang = (Math.PI * 2 * i) / 8 + Math.random() * 0.6;
    const dist = 70 + Math.random() * 90;
    el.className = 'burst';
    el.style.cssText = `left:${x}px;top:${y}px;--bs:${26 + Math.random() * 26}px;--dx:${Math.cos(ang) * dist}px;--dy:${Math.sin(ang) * dist}px;--r:${Math.random() * 360 - 180}deg`;
    el.innerHTML = SHAPES[t]([c1, c2]);
    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }
}
if (!reduce) {
  document.addEventListener('click', e => {
    if (e.target.closest('.modal, .burger, .menu')) return;
    burst(e.clientX, e.clientY);
  });
}
