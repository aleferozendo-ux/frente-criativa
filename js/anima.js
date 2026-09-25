/* ============================================================
   anima.js — animações cinematográficas
   GSAP + ScrollTrigger + Lenis
   ============================================================ */

const temAnimacao = Boolean(window.gsap && window.ScrollTrigger);
if (temAnimacao) gsap.registerPlugin(ScrollTrigger);

const ehToque = window.matchMedia("(pointer: coarse)").matches;
const menosMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---- LENIS (scroll suave) — desativado em toque ---- */
let lenis = null;
if (temAnimacao && !ehToque && !menosMovimento && window.Lenis) {
  lenis = new Lenis({ duration: 1.1, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  window.__lenis = lenis; // deixa o filtro usar pra ancorar a rolagem
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  // links de âncora usam o lenis
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
      const alvo = document.querySelector(a.getAttribute("href"));
      if (alvo) { e.preventDefault(); lenis.scrollTo(alvo, { offset: -80 }); }
    });
  });
}

/* ============================================================
   PRELOADER
   ============================================================ */
function abrirSite() {
  document.getElementById("preloader").style.display = "none";
  document.querySelector(".pre-cortina").style.display = "none";
  iniciarHero();
}

if (!temAnimacao || menosMovimento) {
  abrirSite();
} else if (sessionStorage.getItem("visitou")) {
  // já visitou nesta sessão: pula o preloader
  abrirSite();
} else {
  sessionStorage.setItem("visitou", "1");
  const tl = gsap.timeline();
  tl.to("#preloader .pre-linha span", {
    y: 0, duration: 0.9, ease: "power3.out", stagger: 0.12, delay: 0.2
  })
  .to("#preloader .pre-linha span", {
    y: "-110%", duration: 0.7, ease: "power3.in", stagger: 0.08
  }, "+=0.5")
  .to("#preloader", { yPercent: -100, duration: 0.8, ease: "expo.inOut" }, "-=0.2")
  .to(".pre-cortina", { yPercent: 100, duration: 0.9, ease: "expo.inOut" }, "<")
  // o hero começa a aparecer JUNTO com a cortina abrindo (transição contínua,
  // sem parecer que carregou duas vezes)
  .add(iniciarHero, "-=0.5")
  .set("#preloader", { display: "none" })
  .set(".pre-cortina", { display: "none" });
}

/* ============================================================
   HERO — reveal por palavra + parallax do mouse
   ============================================================ */
let heroJaIniciou = false; // trava: hero anima UMA vez só (evita "carregamento duplo")
function iniciarHero() {
  if (heroJaIniciou) return;
  heroJaIniciou = true;
  if (!temAnimacao || menosMovimento) {
    return;
  }
  const tl = gsap.timeline();
  tl.from(".hero .olho", { y: 20, opacity: 0, duration: 0.6, ease: "power3.out" })
    .from(".titulo-hero .palavra", {
      yPercent: 110, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.06
    }, "-=0.3")
    .from(".hero-sub", { y: 20, opacity: 0, duration: 0.7, ease: "power3.out" }, "-=0.5")
    .from(".hero-botoes", { y: 20, opacity: 0, duration: 0.7, ease: "power3.out" }, "-=0.5");

  // parallax das formas com o mouse
  if (!ehToque) {
    window.addEventListener("mousemove", (e) => {
      const x = (e.clientX / window.innerWidth - 0.5);
      const y = (e.clientY / window.innerHeight - 0.5);
      document.querySelectorAll(".forma").forEach(f => {
        const p = parseFloat(f.dataset.parallax) || 0.2;
        gsap.to(f, { x: x * 60 * p, y: y * 60 * p, duration: 0.8, ease: "power2.out" });
      });
    });
  }
}

/* ============================================================
   MARQUEE (loop infinito)
   ============================================================ */
if (temAnimacao && !menosMovimento) {
  const track = document.getElementById("marquee-track");
  const largura = track.scrollWidth / 3;
  gsap.to(track, { x: -largura, duration: 18, ease: "none", repeat: -1 });
}

/* ============================================================
   REVEAL genérico ao rolar
   ============================================================ */
if (temAnimacao && !menosMovimento) {
  gsap.utils.toArray("[data-reveal]").forEach(el => {
    gsap.from(el, {
      y: 40, opacity: 0, duration: 0.9, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 85%" }
    });
  });

  // títulos de seção
  gsap.utils.toArray(".titulo-secao").forEach(t => {
    gsap.from(t, {
      y: 50, opacity: 0, duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: t, start: "top 88%" }
    });
  });

  // serviços entram um a um
  gsap.from(".servico", {
    y: 30, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.1,
    scrollTrigger: { trigger: ".servicos-lista", start: "top 80%" }
  });
}

/* ============================================================
   PORTFÓLIO — scroll horizontal fixado (pin)
   ============================================================ */
if (temAnimacao && !ehToque && !menosMovimento) {
  const track = document.getElementById("projetos-track");
  const wrap = document.getElementById("pin-wrap");
  let pinTween = null;

  function montarPin() {
    if (wrap.classList.contains("modo-grade")) return; // filtrado: sem pin
    const total = track.scrollWidth - window.innerWidth + 80;
    if (total <= 0) return;
    pinTween = gsap.to(track, {
      x: -total,
      ease: "none",
      scrollTrigger: {
        trigger: "#portfolio",
        start: "top top",
        end: () => "+=" + total,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
      }
    });
  }

  function destruirPin() {
    if (pinTween) {
      pinTween.scrollTrigger && pinTween.scrollTrigger.kill();
      pinTween.kill();
      pinTween = null;
    }
    gsap.set(track, { x: 0 }); // volta os cards pro início
  }

  montarPin();

  // quando o usuário filtra por categoria: desliga o scroll horizontal
  document.addEventListener("portfolio:filtrar", () => {
    destruirPin();
  });
  // quando volta pra "Todos": religa o scroll horizontal
  document.addEventListener("portfolio:todos", () => {
    destruirPin();
    // religa o pin no próximo quadro, depois a ancoragem no render.js reposiciona
    requestAnimationFrame(() => montarPin());
  });
}

/* ============================================================
   CURSOR customizado (desktop)
   ============================================================ */
if (temAnimacao && !ehToque && !menosMovimento) {
  const cursor = document.getElementById("cursor");
  cursor.style.display = "block";
  window.addEventListener("mousemove", e => {
    gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.35, ease: "power2.out" });
  });
  // cresce sobre links; vira "Ver" sobre projetos
  document.querySelectorAll("a, button, .servico, [data-hover]").forEach(el => {
    el.addEventListener("mouseenter", () => cursor.classList.add("grande"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("grande", "ver"));
  });
  document.querySelectorAll("[data-ver]").forEach(el => {
    el.addEventListener("mouseenter", () => cursor.classList.add("grande", "ver"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("grande", "ver"));
  });
}

/* ============================================================
   BOTÃO MAGNÉTICO
   ============================================================ */
if (temAnimacao && !ehToque && !menosMovimento) {
  document.querySelectorAll(".magnetico").forEach(btn => {
    btn.addEventListener("mousemove", e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.4, ease: "power2.out" });
    });
    btn.addEventListener("mouseleave", () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.4)" });
    });
  });
}

/* ============================================================
   HEADER compacto ao rolar
   ============================================================ */
const header = document.getElementById("header");
if (temAnimacao) {
  ScrollTrigger.create({
    start: "top -60",
    onUpdate: (self) => {
      header.classList.toggle("compacto", self.scroll() > 60);
    }
  });
} else {
  window.addEventListener("scroll", () => header.classList.toggle("compacto", window.scrollY > 60), { passive: true });
}

/* ============================================================
   MENU MOBILE
   ============================================================ */
const menuMobile = document.getElementById("menu-mobile");
const menuToggle = document.getElementById("menu-toggle");
const abrirMenu = () => {
  menuMobile.removeAttribute("inert");
  menuMobile.classList.add("aberto");
  menuMobile.setAttribute("aria-hidden", "false");
  menuToggle.setAttribute("aria-expanded", "true");
  document.body.classList.add("menu-aberto");
  document.getElementById("menu-fechar").focus();
};
const fecharMenu = () => {
  menuMobile.classList.remove("aberto");
  menuMobile.setAttribute("inert", "");
  menuMobile.setAttribute("aria-hidden", "true");
  menuToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-aberto");
};
menuToggle.addEventListener("click", abrirMenu);
document.getElementById("menu-fechar").addEventListener("click", fecharMenu);
menuMobile.querySelectorAll("a").forEach(a => a.addEventListener("click", fecharMenu));
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && menuMobile.classList.contains("aberto")) {
    fecharMenu();
    menuToggle.focus();
  }
});

/* ---- refresh depois que tudo carregou ---- */
window.addEventListener("load", () => {
  if (temAnimacao) setTimeout(() => ScrollTrigger.refresh(), 300);
});
