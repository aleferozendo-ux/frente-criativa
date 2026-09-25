/* ============================================================
   CONFIGURAÇÃO DO SITE — EDITE AQUI (sem mexer no resto do código)
   ============================================================
   Aqui você troca: número de WhatsApp, textos, preços e projetos.
*/

const CONFIG = {

  // ---- WHATSAPP (troque o número e a mensagem) ----
  whatsapp: {
    numero: "5566996749401", // seu número com DDI (55) + DDD, só dígitos
    mensagem: "Oi! Vim pelo site da Frente Criativa e quero um projeto 🙂",
  },

  // ---- CONTATO E REDES ----
  instagram: "https://instagram.com/frentecriativa.br",
  email: "frentecriativacontato@gmail.com",
  localizacao: "Campo Verde, MT · Atendimento em todo o Brasil",

  // ---- HERO (primeira dobra) ----
  hero: {
    titulo: "Sites que fazem seu negócio ser encontrado e escolhido.",
    subtitulo: "Criação de sites, edição de vídeo, SEO e tráfego pago pra pequenos negócios que querem crescer de verdade.",
  },

  // ---- MARQUEE (faixa rolando) ----
  marquee: ["Sites", "Landing pages", "Edição de vídeo", "SEO", "Tráfego pago", "Identidade visual"],

  // ---- SERVIÇOS (o RESULTADO que entrega, não a ferramenta) ----
  servicos: [
    {
      num: "01",
      nome: "Criação de sites",
      resultado: "Você para de perder o cliente que te procura no Google às 22h e não encontra nada além do seu Instagram.",
    },
    {
      num: "02",
      nome: "Landing pages",
      resultado: "Uma página feita pra uma coisa só: transformar quem clicou no anúncio em contato no seu WhatsApp.",
    },
    {
      num: "03",
      nome: "SEO",
      resultado: "Seu negócio começa a aparecer quando alguém procura pelo seu serviço na sua cidade.",
    },
    {
      num: "04",
      nome: "Edição de vídeo e tráfego",
      resultado: "Conteúdo que prende e anúncios que trazem gente certa, sem queimar dinheiro à toa.",
    },
  ],

  // ---- PROCESSO (4 etapas reais) ----
  processo: [
    { num: "1", titulo: "Conversa", texto: "A gente entende seu negócio e o que você precisa resolver. Sem enrolação." },
    { num: "2", titulo: "Proposta", texto: "Você recebe uma proposta clara com escopo, prazo e valor. Entrada de 50% pra iniciar." },
    { num: "3", titulo: "Criação", texto: "Construímos o projeto com até 2 rodadas de ajuste pra ficar do seu jeito." },
    { num: "4", titulo: "Publicação e suporte", texto: "Site no ar, domínio no seu nome, e a gente continua por perto depois." },
  ],

  // ---- POR QUE A FRENTE CRIATIVA (3 argumentos honestos) ----
  porque: [
    { titulo: "Resposta rápida", texto: "Você fala com gente de verdade e recebe retorno rápido. Nada de sumir depois de fechar." },
    { titulo: "Site que converte", texto: "Não fazemos site só bonito. Fazemos pra virar contato, orçamento e cliente." },
    { titulo: "Suporte depois de publicar", texto: "O projeto não acaba na entrega. A gente segue dando suporte quando você precisa." },
  ],

  // ---- PLANOS (edite os preços, prazos e itens aqui) ----
  planos: [
    {
      nome: "Landing Page",
      preco: "R$ 497",
      selo: "",
      destaque: false,
      descricao: "Página estratégica para apresentar um serviço, produto ou oferta e direcionar visitantes para uma ação.",
      prazo: "3 a 5 dias úteis",
      botao: "Quero minha Landing Page",
      itens: ["Página única profissional", "Design responsivo", "Estrutura focada em conversão", "Botão para WhatsApp", "Formulário de contato", "SEO básico", "Publicação do projeto", "Até 2 rodadas de ajustes"],
    },
    {
      nome: "Site Essencial",
      preco: "R$ 597",
      selo: "Mais acessível",
      destaque: false,
      descricao: "Ideal para empresas que precisam começar sua presença digital com um site profissional.",
      prazo: "4 a 7 dias úteis",
      botao: "Quero meu Site",
      itens: ["Site One Page", "Apresentação da empresa", "Serviços", "Diferenciais", "Depoimentos", "Localização", "Contato + WhatsApp", "Design responsivo", "SEO básico", "Até 2 rodadas de ajustes"],
    },
    {
      nome: "Site Profissional",
      preco: "R$ 797",
      selo: "Mais escolhido",
      destaque: true,
      descricao: "Ideal para empresas que precisam de uma presença digital mais estruturada.",
      prazo: "7 a 10 dias úteis",
      botao: "Escolher Profissional",
      itens: ["Até 3 páginas", "Página inicial", "Serviços", "Contato", "Design personalizado", "Responsividade", "WhatsApp", "Formulário de contato", "Redes sociais", "SEO básico", "Até 2 rodadas de ajustes"],
    },
    {
      nome: "Site Completo",
      preco: "R$ 1.197",
      selo: "",
      destaque: false,
      descricao: "Para empresas que querem uma presença digital mais completa, profissional e preparada para crescer.",
      prazo: "10 a 15 dias úteis",
      botao: "Quero o Site Completo",
      itens: ["Até 5 páginas", "Página inicial", "Sobre", "Serviços", "Portfólio ou projetos", "Contato", "Design profissional", "Responsividade completa", "WhatsApp + Formulários", "Integração com redes sociais", "SEO básico", "Configuração e publicação", "Até 2 rodadas de ajustes"],
    },
  ],

  // ---- FAQ ----
  faq: [
    { p: "Qual o prazo de entrega?", r: "Uma landing page fica pronta em 3 a 5 dias úteis. Um site institucional leva de 7 a 15 dias úteis, contando a partir da entrada e do envio das informações." },
    { p: "O que preciso enviar pra começar?", r: "Logo, fotos, textos e as informações do seu negócio. Se não tiver tudo pronto, a gente te ajuda a organizar." },
    { p: "Como funciona a hospedagem?", r: "O domínio fica no seu nome. Hospedagem e manutenção podem ser mensais — a gente combina antes, sem surpresa." },
    { p: "E se eu quiser mudar algo depois?", r: "Cada projeto inclui até 2 rodadas de ajuste. Mudanças maiores a gente conversa e ajusta o escopo." },
  ],

  // ---- PORTFÓLIO (8 projetos conceituais, cada um com sua identidade) ----
  // Marcados como conceituais — nada de cliente inventado.
  portfolio: [
    { id: "petshop",   nome: "PataFeliz",      segmento: "Pet shop",      categoria: "Varejo",      resultado: "Agendamento de banho e tosa pelo WhatsApp", cor: "#FF7A3C", corTexto: "#3D1B0A" },
    { id: "odonto",    nome: "SorrisoClaro",   segmento: "Odontologia",   categoria: "Saúde",       resultado: "Agendamento e antes/depois", cor: "#2CC6A6", corTexto: "#08312A" },
    { id: "academia",  nome: "Forja",          segmento: "Academia",      categoria: "Saúde",       resultado: "Planos e horários de aulas", cor: "#C6FF3C", corTexto: "#111111", fundoEscuro: true },
    { id: "burger",    nome: "Brasa Burger",   segmento: "Hamburgueria",  categoria: "Alimentação", resultado: "Cardápio digital e pedido no WhatsApp", cor: "#E63946", corTexto: "#2A0A0C" },
    { id: "barbearia", nome: "Navalha & Cia",  segmento: "Barbearia",     categoria: "Beleza",      resultado: "Tabela de serviços e agenda", cor: "#C9A24B", corTexto: "#161616", fundoEscuro: true },
    { id: "advocacia", nome: "Vello Jurídico", segmento: "Advocacia",     categoria: "Serviços",    resultado: "Áreas de atuação e contato direto", cor: "#1B2A4A", corTexto: "#F6F4EE" },
    { id: "loja",      nome: "Âncora Store",   segmento: "Loja de roupas",categoria: "Varejo",      resultado: "Grade de produtos e compra via WhatsApp", cor: "#111111", corTexto: "#F5F5F5", fundoEscuro: true },
    { id: "imobiliaria", nome: "Norte Imóveis",segmento: "Imobiliária",   categoria: "Serviços",    resultado: "Filtro de imóveis e agendamento de visita", cor: "#0E7C66", corTexto: "#F0FBF7" },
  ],
};

// deixa o número do WhatsApp montado pronto pra usar
CONFIG.linkWhatsapp = `https://wa.me/${CONFIG.whatsapp.numero}?text=${encodeURIComponent(CONFIG.whatsapp.mensagem)}`;
