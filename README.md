# Site da Frente Criativa

Site institucional estático da agência, pronto para abrir localmente ou publicar em uma hospedagem de arquivos estáticos.

## Arquivo principal

Use `index.html`. O arquivo `artifact.html` é uma versão antiga mantida apenas como referência.

Os textos, planos, serviços, portfólio e contatos ficam centralizados em `js/config.js`.

## Abrir localmente

No PowerShell, dentro desta pasta:

```powershell
python -m http.server 4173
```

Depois acesse `http://127.0.0.1:4173`.

## Teste automático

Com o Google Chrome instalado e o servidor local aberto:

```powershell
node tests/site-smoke.mjs $env:TEMP
```

O teste confere desktop e celular, links de contato, menu, FAQ, filtros, formulário, animação de entrada e erros do navegador. Ele não envia mensagens e não abre o WhatsApp.
