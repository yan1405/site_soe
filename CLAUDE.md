# CLAUDE.md — SOE Acessórios

Este arquivo fica na raiz do projeto Astro. O Claude Code lê automaticamente no início de cada sessão local — por isso os prompts de cada fase, no `ORQUESTRACAO_PROMPTS_SOE.md`, não repetem este contexto. Se algo aqui mudar (ex.: confirmação do WhatsApp da cliente), atualize este arquivo antes de continuar as fases.

## Sobre o projeto

Site institucional para a **SOE Acessórios** (Instagram `@soefloripa`), ateliê de acessórios de cabelo artesanais, público feminino, forte apelo emocional família/maternidade.

**O site é vitrine digital, não e-commerce completo:**
- Objetivo primário: converter o visitante para o WhatsApp Business da cliente (o catálogo completo dela vive lá, não no site).
- Objetivo secundário: permitir compra direta apenas dos produtos "carro-chefe" (subconjunto pequeno, curado).
- **Regra fixa, nunca violar:** o site nunca lista o catálogo inteiro — só carros-chefe, em `/catalogo` e na home.

## Identidade visual (Design DNA) — v2, remodelagem completa de 2026-08-10

**Esta seção foi reescrita na Fase 11 (ver "Fluxo de trabalho" abaixo). O `src/styles/design-dna.json` v1 (Fase 3) foi substituído por um v2** que mescla explicitamente duas fontes reais, documentadas campo a campo em `design-dna.json` (`decision_log`):

- **Cor, mood, princípios de composição:** 100% preservados do v1 — amostrados por pixel real das 7 fotos de produto em `analise_acessts/fundo_uniformizado/`. Paleta creme/dourado/terracota/oliva/rosa-suave/carvão/vermelho, RGB(245,240,228) medido como fundo. Nada disso mudou.
- **Tipografia, spacing, grid, sombra, padrões de componente:** informados por `design-dna-atelieno-referencia.json` — extração real (`getComputedStyle` ao vivo, via Claude in Chrome) do site https://www.atelieno.com/, usada só como referência de FORMATO/disciplina estrutural, nunca de cor ou tom de voz. Decisão explícita do Yan: "não quero cópia, quero remodelagem" — o site da referência não foi copiado; só o método de trabalho dela (hierarquia por peso tipográfico, blocos de cor alternados em vez de sombra, carrossel de produtos) foi adaptado ao conteúdo e à identidade já existente da SOE.

**Mudança real de tipografia:** a v1 tinha "script/serifada elegante" marcado como **INFERIDO** (nunca visto em nenhuma foto real, só suposição a partir do tom do Instagram). A extração real da referência mostrou que sites do mesmo território de marca não usam serifa em lugar nenhum — hierarquia vem de peso/escala. **"Work Sans"** (já licenciada e self-hospedada em `public/fonts/`) passou a cobrir heading (700–800) e corpo (300–400) na mesma família. **"Playfair Display"** deixou de ser a fonte de heading padrão e virou acento raríssimo (classe `.acento-citacao`, no máximo 1 uso por página — hoje só em `/nossa-historia`).

**Cantos (border-radius):** mantidos os tokens arredondados da SOE (não os cantos retos medidos na referência) — decisão explícita de manter "nossos tokens", e cantos orgânicos combinam mais com o produto (laço de linho dobrado) do que com joalheria contemporânea.

**Logo aplicada pela primeira vez:** a logo vetorizada (`identidade-visual/`, fleur-de-lis, variante `logo-fleur-de-lis-soe-dourado.svg`, dourado.500) existia desde 2026-08-10 mas nunca tinha sido usada em nenhum componente — ficou pendente até a Fase 11. Agora está em `src/components/layout/Logo.astro` (inline SVG, `fill="currentColor"`), aplicada no Header, Footer, favicon (`favicon-soe-dourado.ico`) e imagem OG (`public/images/og-logo-soe.png`).

Fotografia: still-life em linho branco com flor/espiga seca (fotos de produto); luz dourada natural em cenas de vida real (lifestyle/prova social) — inalterado.

Tom de voz de qualquer copy: caloroso, afetivo, português informal-cuidadoso, ênfase recorrente em "feito à mão" — inalterado; **não adotado** o tom "direto e afirmativo" medido na referência (ela usa imperativo puro tipo "Comprar"; a SOE mantém convite, ex. "Ver no WhatsApp").

## Arquitetura confirmada

- **Stack:** Astro + TypeScript strict + Tailwind + GSAP/ScrollTrigger + Lenis (smooth scroll) + Decap CMS + Netlify. ~~Three.js~~ removido na Fase 9.6 — não faz mais parte do stack.
- **Content Collection** `src/content/produtos/`, schema: `slug`, `nome`, `descricaoCurta`, `preco` (number, valor exato, nunca arredondar), `imagens` (array), `destaqueHome` (boolean), `disponivel` (boolean, controlado pela cliente via Decap CMS).
- **Rotas:** `/`, `/catalogo`, `/produto/[slug]`, `/carrinho`, `/nossa-historia`, `/institucional/privacidade`, `/institucional/termos`, `/institucional/trocas-devolucoes`, `/institucional/contato`. **Revisado na Fase 11:** nenhuma rota foi cortada nem adicionada — as 4 páginas institucionais são exigência legal (LGPD/CDC), `/carrinho` e `/produto/[slug]` são o funil de compra, `/nossa-historia` é a única página de marca. Não há bloat identificável nesse conjunto.
- **Carrinho:** 100% client-side, `localStorage`, sem backend/banco. O checkout consolida os itens numa única mensagem de WhatsApp — **não processa pagamento** até o gateway ser escolhido pela cliente.
- **Hero:** imagem estática do produto, sozinha (LCP) — Hero 3D permanece abandonado (Fase 9.6), decisão reafirmada na Fase 11 (a referência real também não usa nenhum elemento 3D).
- **Home, seções antes vazias, preenchidas na Fase 11:** "Prova social" (vídeo real `prova-social-scrunchies.mp4` + link para @soefloripa — sem depoimentos fabricados, ver "Decisões de conteúdo" abaixo), "Teaser Nossa História" e "CTA final" agora têm conteúdo real.
- **Carros-chefe na Home:** virou carrossel horizontal com scroll-snap (formato emprestado da referência); `/catalogo` continua em grid.
- **Vitrine de vídeos:** GSAP/ScrollTrigger, revelação progressiva no scroll, **sem CTA** — inalterada na lógica (é o bloco que o Yan disse gostar), só ganhou título de contexto e fundo branco (bloco de cor alternado).
- **Acessibilidade:** toda animação respeita `prefers-reduced-motion`; alt text em imagens/vídeos; contraste WCAG AA na paleta creme/dourado.
- **Analytics:** GA4/Meta Pixel só disparam depois do consentimento no banner de cookies — nunca automático no carregamento.

## Decisões de conteúdo — Fase 11 (não inventar dados que pareçam reais)

Ao preencher as seções antes vazias, a prova social **não usa depoimentos de clientes fabricados** (nome + citação fake seria um dado fabricado se lido como avaliação real). Em vez disso, usa o vídeo de bastidor real já existente (`prova-social-scrunchies.mp4`) e um link para o Instagram real (@soefloripa) — prova social honesta, sem inventar quem não existe.

## Skills/plugins instalados em `.claude/` (fora de `src/`)

| Skill/plugin | Uso |
|---|---|
| `impeccable` | Auditoria de design — usar em `/impeccable audit` e `/impeccable critique`. **Fase 11:** rodado via CLI real (`npx impeccable detect`, não o comando `/impeccable` do skill local) numa sessão Cowork sem acesso ao `.claude` global do Yan — ver `PROGRESS.md`, seção Fase 11, para a saída literal (antes: 9 warnings reais incl. 6× kicker-above-heading, 2× all-caps-body; depois das correções: 0 desses, restam 5× line-length não totalmente resolvido, 5× cream-palette e 10× image-hover-transform mantidos por decisão documentada). |
| `gsap-skills` (sub-skill `gsap-scrolltrigger`) | Vitrine de vídeos — lógica preservada sem alteração na Fase 11 |
| `design-dna` | Gera tokens de cor/tipografia/espaçamento a partir das fotos reais. **Fase 11:** skill usada de novo (fase Generate, Phase 3) para mesclar o `design-dna.json` v1 (SOE) com `design-dna-atelieno-referencia.json` — ver `decision_log` dentro do próprio `design-dna.json` v2. |
| `threejs-skills` | Hero 3D abandonado na Fase 9.6, sem uso ativo |
| `ponytail` | Disciplina de código mínimo — aplicar em toda implementação. Comandos ainda não respondem (ver "Exceção registrada" abaixo) — princípios aplicados manualmente na Fase 11 (reaproveitou `cart-store.ts`/`format.ts` sem duplicar, reaproveitou a abertura real de `/nossa-historia` como teaser da Home em vez de escrever texto novo). |
| `strix` | Segurança — **NÃO rodar durante o desenvolvimento**, só pré-deploy e ao redor da integração do gateway de pagamento. |

## Decisões técnicas já testadas empiricamente — não refazer o teste

- **Vídeo:** corte de 8–10s + CRF 26 + H.264/MP4 único. WebM/VP9 testado e descartado (84,4% mais pesado).
- **Correção de fundo de foto de produto:** ajuste de balanço de branco/exposição por canal (numpy/Pillow), não cutout. `rembg` testado e descartado.
- **Tipografia (Fase 11):** o par Work Sans (peso variável) sozinho, em dois extremos de peso, é suficiente pra hierarquia — testado com `impeccable detect`, que confirmou zero achados de tipografia depois da mudança (o achado de "all-caps-body" que existia era do rótulo/kicker, não da fonte em si).

## Placeholders obrigatórios — estado depois da Fase 11

**Mudança de política, pedido explícito do Yan em 2026-08-10:** o site não deve mais mostrar nenhum placeholder visível. Os campos abaixo, que antes apareciam como texto cru `[PENDENTE]`, agora mostram **valores FICTÍCIOS** (não reais, não pesquisados, só plausíveis o bastante para preview) — todos centralizados em `src/lib/config.ts`, com comentário explícito de que são fictícios.

| Campo | Valor fictício atual | Constante em `src/lib/config.ts` |
|---|---|---|
| CNPJ/MEI | `48.163.905/0001-27 (MEI — fictício)` | `CNPJ_FICTICIO` |
| Endereço | `Rua das Orquídeas, 245 — Trindade, Florianópolis/SC — CEP 88036-000` | `ENDERECO_FICTICIO` |
| Cidade/UF (foro) | `Florianópolis/SC` | `CIDADE_UF_FICTICIA` |
| E-mail | `contato@soeacessorios.com.br` | `EMAIL_FICTICIO` |
| WhatsApp | `5511900000000` (decidido na Fase 9.6, mantido) | `NUMERO_WHATSAPP_PENDENTE` |
| Prazo de reembolso | `10 (dez) dias úteis` | `PRAZO_REEMBOLSO_DIAS_FICTICIO` |
| Produtos carro-chefe | As 5 entradas da Fase 2 continuam provisórias — lista final ainda não veio da cliente | — |
| Gateway de pagamento | Não decidido — carrinho funciona sem ele | — |

**Florianópolis/SC foi escolhido por ter alguma base real** (o handle do Instagram já é `@soefloripa`) — todo o resto (número da rua, CEP, CNPJ, e-mail) é inteiramente inventado, não verificado. **Trocar todos os valores acima por dados reais confirmados pela cliente antes do lançamento** — nenhum foi validado (o CNPJ nem tem dígito verificador conferido).

## Fluxo de trabalho — loop de fases com checkpoints claros

Este projeto avança em fases sequenciais, descritas em `ORQUESTRACAO_PROMPTS_SOE.md` (Fases 0–10) mais a **Fase 11 — Remodelagem completa de design** (2026-08-10, fora da numeração original, decisão do Yan de refazer o design depois de ver o resultado da Fase 9.6 com nota baixa). Siga este contrato em toda sessão:

1. No início da sessão, leia `ORQUESTRACAO_PROMPTS_SOE.md` e `PROGRESS.md` para saber quais fases já foram concluídas.
2. Mantenha uma lista de tarefas (todo list) espelhando as fases — uma tarefa por fase, marcada pending/in_progress/completed.
3. Trabalhe **uma fase por vez**. Nunca comece a próxima fase sem que a atual tenha sido explicitamente aceita.
4. Ao terminar uma fase: rode a verificação pedida no próprio prompt da fase (`astro build`, `astro check`, `impeccable detect`, etc.), e só então escreva em `PROGRESS.md` um parágrafo curto com resultado literal da verificação.
5. Depois de registrar em `PROGRESS.md`, **pare e aguarde confirmação explícita do usuário** antes de iniciar a fase seguinte.
6. Se qualquer verificação falhar, não prossiga — relate o erro, proponha a correção, e só marque a fase como concluída depois que a verificação passar de fato.
7. **Se a fase depende de uma skill e você não usou essa skill de fato, não implemente a fase "na mão" simulando o resultado dela.** Pare, diga explicitamente que a skill não foi usada e por quê.

**Nota sobre a Fase 11:** foi executada inteiramente numa sessão Cowork (ambiente de nuvem), não na sessão local Claude Code do Yan — por isso o build/validação usaram um `npm install` limpo dentro do próprio sandbox (Node 22 nativo), não o `node_modules` do Windows. `impeccable` foi rodado via `npx impeccable detect` (o CLI real do pacote, clonado de `github.com/pbakaus/impeccable`), não via comando `/impeccable` do Claude Code local — o sandbox não tem acesso ao `.claude` global do Yan onde o skill está instalado. Isso ainda conta como evidência real (é literalmente o mesmo motor de detecção, os 59 detectores determinísticos que o comando `/impeccable audit`/`critique` usa por baixo), só por um caminho de invocação diferente — registrado aqui com total transparência, não escondido. **A entrega desta fase chegou ao Yan como pacote de arquivos (a ponte com o computador dele caiu no meio da sessão) — os arquivos precisam ser copiados manualmente para `C:\Users\yansi\OneDrive\Documentos\Site_cliente_SOE` antes do próximo `npm install`/`astro build` na sessão local.**

**Exceção registrada — `ponytail`:** o plugin aparece instalado, mas os comandos não respondem (testado em 2026-08-08). Aplicar os princípios manualmente e registrar no PROGRESS.md que o comando não respondeu, sem tratar isso como bloqueio.

## Checklist de skills obrigatórias por fase

Antes de aceitar uma fase, confira se o PROGRESS.md tem a evidência da coluna certa — uma afirmação genérica não conta como evidência.

| Fase | Skill/comando | O que deve aparecer no PROGRESS.md como evidência |
|---|---|---|
| 0 | Instalação de todas as skills | Listagem real de `.claude/skills/` |
| 3 | `design-dna` (fase Analyze) | Trecho real do JSON de tokens gerado pela skill |
| 3, 9 | `impeccable` — `/impeccable audit` | Saída literal do comando |
| 4 | `ponytail` — `/ponytail-review` | Saída literal se responder; se não, registrar tentativa sem bloquear |
| 5 | `gsap-skills`, sub-skill `gsap-scrolltrigger` | Trecho do código citando a API/padrão da sub-skill |
| 6 | `threejs-skills` | Trecho do código citando o módulo usado (histórico — Hero 3D removido na Fase 9.6) |
| 9 | `impeccable` — `/impeccable critique` | Saída literal do comando |
| 10 | `strix` | Confirmação do modo + saída literal |
| **11** | **`design-dna` (fase Generate) + `impeccable detect` (CLI real)** | **`design-dna.json` v2 com `decision_log` real; JSON literal do `impeccable detect` antes/depois, ver `PROGRESS.md`** |

## Aviso sobre o conteúdo jurídico (páginas institucionais)

O texto de Política de Privacidade, Termos de Uso e Trocas/Devoluções é um **rascunho estruturado**, baseado em LGPD (Lei 13.709/2018), CDC (art. 49) e Decreto 7.962/2013 — não é aconselhamento jurídico e precisa de revisão por advogado antes de publicar em produção, especialmente depois que o status de registro da cliente for confirmado. **Não alterado no conteúdo jurídico em si na Fase 11** — só os placeholders de CNPJ/e-mail/prazo viraram valores fictícios (ver tabela acima).
