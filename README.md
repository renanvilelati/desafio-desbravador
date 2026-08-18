# GitHub Explorer

Aplicação client-side para buscar usuários do GitHub, visualizar seus dados públicos, listar repositórios ordenados por estrelas e abrir os detalhes de cada repositório.

Esta versão foi construída com **HTML tradicional**, **CSS** e **JavaScript ES Modules**. O JavaScript não monta páginas inteiras como componentes: cada tela possui seu próprio arquivo HTML, enquanto os módulos JS cuidam apenas de comportamento, API, tema, idioma, formatação e conteúdo realmente dinâmico. Essa escolha foi devido ao pedido no escopo do desafio, em não utilizar frameworks, de modo que preferi fazer do modo tradicional. Caso tivesse optado por criar componentizando, mesmo que sem usar framework, eu teria criado uma pasta components e componentizando partes utilizadas em vários locais, como o header e cards.

Também optei por criar alguns diferenciais como escolha do tema light/dark, internacionalização com o i18n e alguns testes simples. Achei interessante o multi-idioma por se tratar (a empresa principal) de uma empresa que desenvolve softwares para hotéis.

## Demo

A aplicação está disponível em:
[Acessar demonstração](https://desafio-desbravador-kappa.vercel.app/)

## Funcionalidades

- Busca por usuário do GitHub
- Perfil com avatar, bio, seguidores, seguindo e e-mail público
- Listagem de todos os repositórios públicos do usuário, com paginação da API (100 por requisição)
- Ordenação por mais/menos estrelas, nome e atualização
- Página de detalhes do repositório
- Rotas amigáveis: `/users/:username` e `/repositories/:owner/:repository`
- Light e dark mode com persistência
- Internacionalização PT/EN sem biblioteca adicional
- Loading skeleton, estados vazios, 404, rate limit e erros de API
- Cache curto em `sessionStorage`
- Cancelamento de requests com `AbortController`
- Testes unitários com Vitest
- Layout responsivo baseado em Bootstrap 5 + CSS próprio

## Tecnologias

- HTML5
- CSS3
- JavaScript ES Modules
- Vite
- Axios
- Bootstrap 5
- Vitest

## Estrutura

```text
github-explorer/
├── index.html
├── user.html
├── repository.html
├── 404.html
├── src/
│   ├── css/
│   │   └── main.css
│   └── js/
│       ├── api/
│       │   └── github-api.js
│       ├── i18n/
│       │   ├── en.js
│       │   ├── i18n.js
│       │   └── pt.js
│       ├── pages/
│       │   ├── home.js
│       │   ├── not-found.js
│       │   ├── repository.js
│       │   └── user.js
│       ├── theme/
│       │   └── theme.js
│       ├── utils/
│       │   ├── cache.js
│       │   ├── formatters.js
│       │   ├── repository-sort.js
│       │   └── routes.js
│       └── common.js
├── tests/
├── package.json
├── vite.config.js
└── vercel.json
```

## Por que HTML tradicional?

O desafio dá preferência a uma solução sem frameworks e informa que JavaScript, HTML e CSS serão avaliados. Por isso, a estrutura das páginas permanece declarativa nos arquivos `.html`, deixando semântica, formulários, acessibilidade e organização fáceis de inspecionar.

O JavaScript fica responsável apenas pelo que é comportamento ou conteúdo dinâmico. A lista de repositórios, por exemplo, precisa ser criada em runtime porque vem da API, mas é montada com `document.createElement()` e `textContent`, evitando inserir conteúdo externo diretamente com `innerHTML`.

## Rotas

- `/` → busca
- `/users/:username` → usuário + repositórios
- `/repositories/:owner/:repository` → detalhes do repositório

Durante o desenvolvimento, um pequeno middleware do Vite reescreve as rotas amigáveis para `user.html` e `repository.html`. Em produção, `vercel.json` faz os mesmos rewrites.

Os HTMLs também aceitam fallback por query string para facilitar inspeção direta:

- `/user.html?username=DesbravadorSoftware`

## Instalação

Requer Node.js 20+.

```bash
npm install
npm run dev
```

Abra `http://localhost:5173`.

## Testes

```bash
npm test
```

## Build

```bash
npm run build
npm run preview
```

## Segurança e performance

- Nenhum token do GitHub é exposto no client
- Conteúdo vindo da API é inserido usando `textContent`
- Links externos usam `rel="noopener noreferrer"`
- Requests podem ser cancelados ao sair da página
- Cache temporário reduz chamadas repetidas
- Repositórios são carregados em páginas de até 100 itens
- Ordenação é feita sobre uma cópia do array, sem mutar o retorno original
- O projeto não inclui dependências para funcionalidades simples que podem ser resolvidas com APIs nativas
