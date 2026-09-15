# Marcela Costa Fitwear — Landing Page

Site estático (HTML/CSS/JS puro) para a Marcela Costa Fitwear (@marcelafitwear). Sem build, sem dependências instaláveis — só um servidor estático.

## Rodar localmente

```bash
npx serve .
```

Depois abra o endereço que aparecer no terminal (normalmente `http://localhost:3000`).

## Publicar no GitHub Pages

1. Neste repositório: **Settings → Pages → Source** → escolha a branch `main` e a pasta `/ (root)` → **Save**.
2. Em alguns minutos o site fica no ar em `https://vicentteeneto.github.io/marcelafitwear/`.

Qualquer atualização futura é só editar os arquivos e commitar — o GitHub Pages republica sozinho.

## Dependências externas

- **GSAP 3.12.5 + ScrollTrigger**, carregados via CDN (`cdnjs.cloudflare.com`) nas últimas linhas do `index.html`. Se o CDN falhar ou o JavaScript estiver desligado, o site continua funcional: a seção de coleções aparece como uma pilha vertical normal (ver comentários em `styles.css` e `app.js`).
- **Google Fonts** (Playfair Display + Inter), também via CDN.

## O que ainda é placeholder / pendente

- **Preço "A partir de R$ 79,90"**: valor herdado/padrão, ainda não confirmado como preço real por categoria. Sinalizado no próprio painel (nota "valor herdado do catálogo atual — a confirmar").
- **Política de troca** ("Não fazemos devolução, somente trocas", seção `#info`): precisa de revisão por responsável jurídico frente ao art. 49 do CDC (direito de arrependimento de 7 dias em vendas fora do estabelecimento). Não foi reescrita aqui — decisão de conteúdo legal não deve ser tomada automaticamente.
- **Menu mobile acessível** (toggle nomeado, estado aberto/fechado, navegável por teclado) ainda não existe — a navegação atual é uma lista fixa de links.
- **Cor de destaque roxa** (`--accent` em `styles.css`): derivada de uma foto real do conjunto roxo da marca (`assets/feed/roxo.jpg`), ajustada para contraste de acessibilidade. Não é um hex oficial de marca — se a marca já tiver um definido, é só trocar essa variável.
- **Redesign completo das coleções (Shorts, Conjuntos, Macaquinhos)**: só o painel "Leggings" recebeu o tratamento visual novo (fundo neutro, vídeo maior, nota de preço, link de WhatsApp por peça), como amostra para aprovação antes de estender aos outros três.
- **Provador virtual**: só faz preview local da foto no navegador (`URL.createObjectURL`) — não há simulação por IA nem envio a servidor. Isso é proposital, sinalizado na própria seção como "em breve".
- **Assets (imagens e vídeos)**: ainda precisam ser enviados a este repositório — este commit trouxe só o código (`index.html`, `styles.css`, `app.js`). Ver seção "Estrutura" abaixo para os caminhos esperados.

## Estrutura

```
index.html
styles.css
app.js
assets/
  feed/       fotos do Instagram e da campanha
  videos/     clipes dos Stories usados nos painéis de coleção
  logo-*.png / logo-icon.svg
```
