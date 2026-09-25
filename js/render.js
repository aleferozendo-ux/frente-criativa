/* ============================================================
   render.js — monta as seções a partir do CONFIG
   ============================================================ */

// ---- links de WhatsApp em todos os botões ----
["wpp-header","wpp-mobile","wpp-hero","wpp-cta","wpp-footer","wpp-float"].forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.href = CONFIG.linkWhatsapp;
    el.target = "_blank";
    el.rel = "noopener";
  }
});
const insta = document.getElementById("insta-footer");
if (insta) insta.href = CONFIG.instagram;
document.getElementById("ano").textContent = new Date().getFullYear();

// ---- HERO (título em palavras pra animar) ----
const heroTitulo = document.getElementById("hero-titulo");
heroTitulo.innerHTML = CONFIG.hero.titulo.split(" ")
  .map(p => `<span class="palavra">${p}</span>`).join(" ");
document.getElementById("hero-sub").textContent = CONFIG.hero.subtitulo;

// ---- MARQUEE (duplicado pra loop contínuo) ----
const mt = document.getElementById("marquee-track");
const itens = [...CONFIG.marquee, ...CONFIG.marquee, ...CONFIG.marquee];
mt.innerHTML = itens.map(s => `<span>${s}</span>`).join("");

// ---- SERVIÇOS ----
document.getElementById("servicos-lista").innerHTML = CONFIG.servicos.map(s => `
  <div class="servico" data-hover role="button" tabindex="0" aria-expanded="false">
    <span class="s-num">${s.num}</span>
    <div>
      <div class="s-nome">${s.nome}</div>
      <div class="s-resultado">${s.resultado}</div>
    </div>
  </div>
`).join("");
// acordeão no clique (mobile)
document.querySelectorAll(".servico").forEach(s => {
  const alternar = () => {
    const aberto = s.classList.toggle("aberto");
    s.setAttribute("aria-expanded", String(aberto));
  };
  s.addEventListener("click", alternar);
  s.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      alternar();
    }
  });
});

// ---- PORTFÓLIO: gera um mini-site dentro de cada mockup ----
function miniSite(p) {
  const escuro = p.fundoEscuro;
  const fundo = escuro ? "#161616" : "#ffffff";
  const txt = escuro ? "#ffffff" : "#111111";
  return `
    <div class="mini" style="background:${fundo};color:${txt}">
      <div class="mini-top" style="border-bottom:1px solid ${p.cor}33">
        <span>${p.nome}</span>
        <span style="color:${p.cor}">☰</span>
      </div>
      <div class="mini-hero">
        <div class="mini-h">${p.segmento}<br>que converte</div>
        <span class="mini-btn" style="background:${p.cor};color:${p.corTexto}">${p.resultado.split(" ").slice(0,2).join(" ")}</span>
        <div class="mini-linha" style="background:${p.cor};width:70%"></div>
        <div class="mini-linha" style="background:${p.cor};width:50%"></div>
      </div>
      <div class="mini-grid">
        ${[1,2,3].map(() => `<div class="mini-cel" style="background:${p.cor}22"></div>`).join("")}
      </div>
    </div>`;
}

document.getElementById("projetos-track").innerHTML = CONFIG.portfolio.map(p => `
  <article class="projeto-card" data-cat="${p.categoria}" data-ver data-id="${p.id}" role="link" tabindex="0" aria-label="Ver referência ${p.nome} e conversar pelo WhatsApp">
    <div class="projeto-mock" style="background:${p.cor}18">
      <div class="mock-tela">${miniSite(p)}</div>
    </div>
    <div class="projeto-info">
      <span class="p-seg">${p.segmento}</span>
      <div class="p-nome">${p.nome}</div>
      <div class="p-res">${p.resultado}</div>
    </div>
  </article>
`).join("");

// clicar num projeto abre o WhatsApp citando ele
document.querySelectorAll(".projeto-card").forEach(card => {
  const abrirProjeto = () => {
    const p = CONFIG.portfolio.find(x => x.id === card.dataset.id);
    const msg = `Oi! Vi o projeto ${p.nome} (${p.segmento}) no site e quero um site assim 🙂`;
    window.open(`https://wa.me/${CONFIG.whatsapp.numero}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
  };
  card.addEventListener("click", abrirProjeto);
  card.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      abrirProjeto();
    }
  });
});

// ---- FILTROS ----
const cats = ["Todos", ...new Set(CONFIG.portfolio.map(p => p.categoria))];
document.getElementById("filtros").innerHTML = cats.map((c,i) =>
  `<button class="filtro ${i===0?'ativo':''}" data-cat="${c}">${c}</button>`).join("");
document.querySelectorAll(".filtro").forEach(f => {
  f.addEventListener("click", () => {
    document.querySelectorAll(".filtro").forEach(x => x.classList.remove("ativo"));
    f.classList.add("ativo");
    const cat = f.dataset.cat;
    const wrap = document.getElementById("pin-wrap");

    // guarda onde o portfólio começa na página, pra manter a posição estável
    const portfolio = document.getElementById("portfolio");

    if (cat === "Todos") {
      wrap.classList.remove("modo-grade");
      document.querySelectorAll(".projeto-card").forEach(card => card.style.display = "");
      document.dispatchEvent(new CustomEvent("portfolio:todos"));
    } else {
      wrap.classList.add("modo-grade");
      document.dispatchEvent(new CustomEvent("portfolio:filtrar"));
      document.querySelectorAll(".projeto-card").forEach(card => {
        card.style.display = (card.dataset.cat === cat) ? "" : "none";
      });
    }

    // ANCORA a rolagem no topo do portfólio depois do refresh, pra a página
    // NÃO pular pra cima nem pra baixo (o bug que você viu).
    if (window.ScrollTrigger) {
      setTimeout(() => {
        ScrollTrigger.refresh();
        const y = portfolio.getBoundingClientRect().top + window.pageYOffset - 80;
        if (window.__lenis) {
          window.__lenis.scrollTo(y, { immediate: true });
        } else {
          window.scrollTo({ top: y, behavior: "auto" });
        }
      }, 60);
    }

    // ANIMAÇÃO suave: os cards visíveis fazem fade + sobem de leve (sem "pisca")
    if (window.gsap) {
      const visiveis = [...document.querySelectorAll(".projeto-card")].filter(c => c.style.display !== "none");
      gsap.fromTo(visiveis,
        { opacity: 0, y: 24, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: "power3.out", stagger: 0.06, overwrite: true }
      );
    }
  });
});

// ---- PROCESSO ----
document.getElementById("processo-grid").innerHTML = CONFIG.processo.map(e => `
  <div class="etapa" data-reveal>
    <div class="e-num">${e.num}</div>
    <div class="e-titulo">${e.titulo}</div>
    <div class="e-texto">${e.texto}</div>
  </div>
`).join("");

// ---- POR QUE ----
document.getElementById("porque-grid").innerHTML = CONFIG.porque.map(x => `
  <div class="porque-item" data-reveal>
    <h3>${x.titulo}</h3>
    <p>${x.texto}</p>
  </div>
`).join("");

// ---- PLANOS (cards premium) ----
document.getElementById("planos-grid").innerHTML = CONFIG.planos.map(pl => {
  // mensagem de WhatsApp diferente pra cada plano
  const msg = `Olá! Vi o plano ${pl.nome} da Frente Criativa por ${pl.preco} e gostaria de entender melhor como funciona.`;
  const link = `https://wa.me/${CONFIG.whatsapp.numero}?text=${encodeURIComponent(msg)}`;
  const botao = pl.botao || "Quero esse";
  return `
  <div class="plano ${pl.destaque ? 'destaque' : ''}" data-reveal>
    ${pl.selo ? `<span class="plano-selo ${pl.destaque ? 'selo-destaque' : ''}">${pl.selo}</span>` : ''}
    <h3 class="plano-nome">${pl.nome}</h3>
    <div class="plano-preco"><span class="plano-apartir">a partir de</span>${pl.preco}</div>
    <p class="plano-desc">${pl.descricao}</p>
    <ul class="plano-itens">${pl.itens.map(i => `<li>${i}</li>`).join("")}</ul>
    <div class="plano-prazo"><span>Prazo</span> ${pl.prazo}</div>
    <a class="plano-btn ${pl.destaque ? 'plano-btn-destaque' : ''}" href="${link}" target="_blank" rel="noopener">${botao}</a>
  </div>`;
}).join("");

// ---- FAQ ----
document.getElementById("faq-lista").innerHTML = CONFIG.faq.map((f, i) => `
  <div class="faq-item">
    <button class="faq-p" type="button" aria-expanded="false" aria-controls="faq-r-${i}">${f.p} <span class="mais" aria-hidden="true">+</span></button>
    <div class="faq-r" id="faq-r-${i}"><p>${f.r}</p></div>
  </div>
`).join("");
document.querySelectorAll(".faq-item").forEach(item => {
  const botao = item.querySelector(".faq-p");
  botao.addEventListener("click", () => {
    const aberto = item.classList.toggle("aberto");
    botao.setAttribute("aria-expanded", String(aberto));
  });
});

// ---- FORMULÁRIO envia pro WhatsApp ----
document.getElementById("form-contato").addEventListener("submit", e => {
  e.preventDefault();
  const nome = document.getElementById("f-nome").value.trim();
  const wpp = document.getElementById("f-wpp").value.trim();
  const tipo = document.getElementById("f-tipo").value.trim();
  const msg = document.getElementById("f-msg").value.trim();
  const erro = document.getElementById("form-erro");
  const telefone = wpp.replace(/\D/g, "");
  erro.textContent = "";
  if (nome.length < 2) {
    erro.textContent = "Digite seu nome para continuar.";
    document.getElementById("f-nome").focus();
    return;
  }
  if (telefone.length < 10 || telefone.length > 13) {
    erro.textContent = "Digite um WhatsApp válido com DDD.";
    document.getElementById("f-wpp").focus();
    return;
  }
  const texto = `Oi! Sou ${nome}. Meu WhatsApp: ${wpp}. Negócio: ${tipo}. ${msg}`;
  window.open(`https://wa.me/${CONFIG.whatsapp.numero}?text=${encodeURIComponent(texto)}`, "_blank", "noopener");
});
