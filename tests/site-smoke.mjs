import { spawn } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const profile = await mkdtemp(join(tmpdir(), "frente-criativa-chrome-"));
const port = 9300 + Math.floor(Math.random() * 500);
const outputDir = process.argv[2] || tmpdir();
const browser = spawn(chrome, [
  "--headless=new",
  "--disable-gpu",
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profile}`,
  "about:blank",
], { stdio: "ignore" });

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function devtools(path = "/json/version", options) {
  for (let tentativa = 0; tentativa < 40; tentativa += 1) {
    try {
      const resposta = await fetch(`http://127.0.0.1:${port}${path}`, options);
      if (resposta.ok) return resposta.json();
    } catch {}
    await sleep(100);
  }
  throw new Error("Chrome DevTools não iniciou.");
}

async function connect(wsUrl) {
  const socket = new WebSocket(wsUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });

  let id = 0;
  const pendentes = new Map();
  const eventos = [];
  socket.addEventListener("message", event => {
    const mensagem = JSON.parse(event.data);
    if (mensagem.id && pendentes.has(mensagem.id)) {
      const { resolve, reject } = pendentes.get(mensagem.id);
      pendentes.delete(mensagem.id);
      if (mensagem.error) reject(new Error(mensagem.error.message));
      else resolve(mensagem.result);
      return;
    }
    eventos.push(mensagem);
  });

  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const currentId = ++id;
    pendentes.set(currentId, { resolve, reject });
    socket.send(JSON.stringify({ id: currentId, method, params }));
  });
  return { socket, send, eventos };
}

async function avaliar(send, expression) {
  const resposta = await send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (resposta.exceptionDetails) {
    throw new Error(resposta.exceptionDetails.text || "Falha ao avaliar a página.");
  }
  return resposta.result.value;
}

async function testarViewport(nome, width, height, mobile) {
  const target = await devtools(`/json/new?${encodeURIComponent("http://127.0.0.1:4173")}`, { method: "PUT" });
  const { socket, send, eventos } = await connect(target.webSocketDebuggerUrl);
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Log.enable");
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile,
  });
  await send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "reduce" }],
  });
  await send("Page.navigate", { url: "http://127.0.0.1:4173" });
  await sleep(1800);

  const base = await avaliar(send, `(() => ({
    titulo: document.title,
    h1: document.querySelector('h1')?.innerText,
    viewport: { innerWidth, innerHeight },
    documento: {
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      scrollHeight: document.documentElement.scrollHeight
    },
    planos: document.querySelectorAll('.plano').length,
    servicos: document.querySelectorAll('.servico').length,
    projetos: document.querySelectorAll('.projeto-card').length,
    whatsapp: document.querySelector('#wpp-header')?.href,
    instagram: document.querySelector('#insta-footer')?.href,
    email: document.querySelector('a[href^="mailto:"]')?.href,
    preloaderOculto: getComputedStyle(document.querySelector('#preloader')).display === 'none',
    menuVisivel: getComputedStyle(document.querySelector('#menu-toggle')).display !== 'none',
    libs: { gsap: Boolean(window.gsap), scrollTrigger: Boolean(window.ScrollTrigger), lenis: Boolean(window.Lenis) }
  }))()`);

  const interacoes = await avaliar(send, `(() => {
    const menu = document.querySelector('#menu-mobile');
    document.querySelector('#menu-toggle').click();
    const menuAbriu = menu.classList.contains('aberto') && menu.getAttribute('aria-hidden') === 'false';
    document.querySelector('#menu-fechar').click();
    const menuFechou = !menu.classList.contains('aberto') && menu.getAttribute('aria-hidden') === 'true';

    const faq = document.querySelector('.faq-item');
    faq.querySelector('button').click();
    const faqAbriu = faq.classList.contains('aberto') && faq.querySelector('button').getAttribute('aria-expanded') === 'true';

    const filtros = [...document.querySelectorAll('.filtro')];
    filtros[1]?.click();
    const cardsVisiveis = [...document.querySelectorAll('.projeto-card')].filter(card => getComputedStyle(card).display !== 'none').length;
    filtros[0]?.click();

    const formulario = document.querySelector('#form-contato');
    formulario.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    const erroNome = document.querySelector('#form-erro').textContent.trim();
    let urlFormulario = '';
    window.open = url => { urlFormulario = url; return null; };
    document.querySelector('#f-nome').value = 'Cliente Teste';
    document.querySelector('#f-wpp').value = '(66) 99999-0000';
    document.querySelector('#f-tipo').value = 'Loja';
    document.querySelector('#f-msg').value = 'Quero um site';
    formulario.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    return { menuAbriu, menuFechou, faqAbriu, cardsVisiveis, erroNome, urlFormulario };
  })()`);

  const captura = await send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: true,
  });
  const screenshot = join(outputDir, `${nome}-pagina-inteira.png`);
  await writeFile(screenshot, Buffer.from(captura.data, "base64"));

  const erros = eventos
    .filter(evento => evento.method === "Runtime.exceptionThrown" || evento.method === "Log.entryAdded")
    .map(evento => evento.params);
  socket.close();
  return { nome, base, interacoes, erros, screenshot };
}

async function testarAnimacaoNormal() {
  const target = await devtools(`/json/new?${encodeURIComponent("http://127.0.0.1:4173")}`, { method: "PUT" });
  const { socket, send, eventos } = await connect(target.webSocketDebuggerUrl);
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Log.enable");
  await send("Page.navigate", { url: "http://127.0.0.1:4173" });
  await sleep(4500);
  const estado = await avaliar(send, `(() => ({
    preloaderOculto: getComputedStyle(document.querySelector('#preloader')).display === 'none',
    cortinaOculta: getComputedStyle(document.querySelector('.pre-cortina')).display === 'none',
    heroVisivel: getComputedStyle(document.querySelector('.titulo-hero')).opacity !== '0',
    lenisAtivo: Boolean(window.__lenis)
  }))()`);
  const erros = eventos
    .filter(evento => evento.method === "Runtime.exceptionThrown" || evento.method === "Log.entryAdded")
    .map(evento => evento.params);
  socket.close();
  return { nome: "animacao-normal", estado, erros };
}

try {
  const resultados = [];
  resultados.push(await testarViewport("desktop", 1440, 1000, false));
  resultados.push(await testarViewport("mobile", 390, 844, true));
  resultados.push(await testarAnimacaoNormal());
  console.log(JSON.stringify(resultados, null, 2));
} finally {
  await new Promise(resolve => {
    const limite = setTimeout(resolve, 2000);
    browser.once("exit", () => {
      clearTimeout(limite);
      resolve();
    });
    browser.kill();
  });
  await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 250 });
}
