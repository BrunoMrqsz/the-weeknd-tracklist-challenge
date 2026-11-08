# The Weeknd — Discography Challenge

Quiz cronometrado inspirado no jogo **"Países do Mundo"** do JetPunk: você precisa digitar o nome de **todas as músicas do The Weeknd** antes que o tempo acabe. As faixas ficam separadas por lançamento e vão aparecendo na tracklist na hora em que você acerta — sem precisar apertar Enter.

**152 faixas** em **13 lançamentos**, de *House of Balloons* (2011) a *Hurry Up Tomorrow* (2025).

## Jogar online

O jogo está publicado e funciona em qualquer navegador, sem instalar nada:

**https://theweeknddiscography.netlify.app/**

## Como jogar

- **Escolha um lançamento** (10 minutos cada) ou o **Desafio completo** (todos os lançamentos numa tela só, 40 minutos).
- **Digite os nomes.** Maiúsculas, acentos e pontuação não importam.
- **Acertos seguidos dão bônus:** 100 pontos por faixa +10 por acerto consecutivo, até +50.
- **3 dicas por partida:** revelam o lançamento, a posição da faixa e as iniciais do título. Usar dica zera a sequência.
- **Recorde salvo no navegador** para cada lançamento e para o desafio completo.

## Requisitos

- **Node.js 20.19+ ou 22.12+** ([instalar com nvm](https://github.com/nvm-sh/nvm#installing-and-updating)) — ou **Bun**.
- Nenhuma chave de API, banco de dados ou variável de ambiente: todo o conteúdo do jogo está no próprio repositório.

## Executando o projeto

```sh
git clone <url-do-repositório>
cd <nome-do-repositório>

# com npm
npm install
npm run dev

# ...ou com Bun
bun install
bun run dev
```

Abra a URL que aparece no terminal (normalmente `http://localhost:5173`).

> A versão publicada em **https://theweeknddiscography.netlify.app/** é a mesma versão de produção do jogo, então rodar localmente só é necessário se você quiser estudar ou alterar o código.

### Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor local com recarregamento automático |
| `npm run build` | Build de produção |
| `npm run preview` | Serve o build de produção localmente |
| `npm run test` | Roda os testes |
| `npm run test:watch` | Testes em modo observador |
| `npm run lint` | Lint com ESLint |
| `npm run format` | Formata o código com Prettier |

## Estrutura

```text
src/
├── data/discography.ts     # TODAS as faixas e lançamentos (edite aqui)
├── lib/
│   ├── quiz.ts             # Normalização, comparação de respostas e pontuação
│   └── records.ts          # Recordes salvos no localStorage
├── routes/
│   ├── index.tsx           # Página inicial: lançamentos, como jogar, recordes
│   ├── quiz.$albumId.tsx   # Tela do quiz (um lançamento ou "todas")
│   └── __root.tsx          # Estrutura compartilhada de todas as páginas
├── components/game/        # Vinil, tracklist, cronômetro, input, placar, resultado
└── test/                   # Testes de comparação de respostas e de rota
```

## Editando a tracklist

Tudo vem de `src/data/discography.ts`. Para adicionar uma faixa:

```ts
t("Blinding Lights"),                          // só o título
t("The Zone (feat. Drake)"),                  // feat. não é obrigatório digitar
t("The Birds Pt. 1", "The Birds Part 1"),     // "aliases" = respostas extras aceitas
```

Cada lançamento tem `id`, `title`, `year`, `type` e `hue` (a cor da arte abstrata em forma de vinil). O `id` vira a URL do quiz: `/quiz/after-hours`.

## Como as respostas são comparadas

Antes de comparar, o texto é normalizado: convertido em minúsculas, sem acentos, sem pontuação, com `&` virando `and` e `$` virando `s`, espaços duplicados juntados e o `the` inicial opcional. Por isso `"Starboy"`, `"starboy!"` e `"the starboy"` valem a mesma coisa. Títulos com `(feat. ...)` são aceitos com ou sem o feat., e os `aliases` cobrem variações como `"28"` para `Twenty Eight`.

## Stack

TanStack Start (React 19 + Vite), TanStack Router e Query, Tailwind CSS v4, componentes shadcn/ui, Vitest.

## Observações

- Projeto de fã, sem afiliação com The Weeknd ou XO.
- Os recordes ficam no `localStorage` do navegador (chave `tw-discography-records`), então não sincronizam entre dispositivos.
- As tracklists são as oficiais, mas a ordem e os títulos das faixas de compilações e colaborações podem não bater com toda edição — se encontrar um erro, é só ajustar em `src/data/discography.ts`.

---

Este projeto foi criado com [Lovable](https://lovable.dev). As mudanças feitas no editor são commitadas automaticamente neste repositório, e o que você enviar para o branch conectado volta para o Lovable.
