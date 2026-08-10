# CLAUDE.md — SOE Acessórios

Este arquivo fica na raiz do projeto Astro. O Claude Code lê automaticamente no início de cada sessão local — por isso os prompts de cada fase, no `ORQUESTRACAO_PROMPTS_SOE.md`, não repetem este contexto. Se algo aqui mudar (ex.: confirmação do WhatsApp da cliente), atualize este arquivo antes de continuar as fases.

## Sobre o projeto

Site institucional para a **SOE Acessórios** (Instagram `@soefloripa`), ateliê de acessórios de cabelo artesanais, público feminino, forte apelo emocional família/maternidade.

**O site é vitrine digital, não e-commerce completo:**
- Objetivo primário: converter o visitante para o WhatsApp Business da cliente (o catálogo completo dela vive lá, não no site).
- Objetivo secundário: permitir compra direta apenas dos produtos "carro-chefe" (subconjunto pequeno, curado).
- **Regra fixa, nunca violar:** o site nunca lista o catálogo inteiro — só carros-chefe, em `/catalogo` e na home.

## Identidade visual (Design DNA)

- Paleta observada no feed: creme/bege, dourado/mostarda, terracota, verde-oliva, rosa suave, com preto/carvão como contraste pontual.
- Cor de fundo alvo medida (não estimada) nas fotos de produto já corrigidas: RGB(245, 240, 228) — creme quente.
- Fotografia: still-life em linho branco com flor/espiga seca (fotos de produto); luz dourada natural em cenas de vida real (lifestyle/prova social).
- Tipografia de marca: script/serifada elegante nos materiais gráficos do Instagram.
- Tom de voz de qualquer copy: caloroso, afetivo, português informal-cuidadoso, ênfase recorrente em "feito à mão".

A formalização definitiva desses tokens em JSON acontece na Fase 3 (skill `design-dna`, lendo as fotos reais em `analise_acessts/fundo_uniformizado/`) — o que está aqui é o input humano validado, não o output final.

## Arquitetura confirmada

- **Stack:** Astro + TypeScript strict + Tailwind + GSAP/ScrollTrigger + Lenis (smooth scroll) + Decap CMS + Netlify. ~~Three.js~~ removido na Fase 9.6 (ver linha "Hero 3D" abaixo) — não faz mais parte do stack.
- **Content Collection** `src/content/produtos/`, schema: `slug`, `nome`, `descricaoCurta`, `preco` (number, valor exato, nunca arredondar), `imagens` (array), `destaqueHome` (boolean), `disponivel` (boolean, controlado pela cliente via Decap CMS).
- **Rotas:** `/`, `/catalogo`, `/produto/[slug]`, `/carrinho`, `/nossa-historia`, `/institucional/privacidade`, `/institucional/termos`, `/institucional/trocas-devolucoes`, `/institucional/contato`.
- **Carrinho:** 100% client-side, `localStorage`, sem backend/banco. O checkout consolida os itens numa única mensagem de WhatsApp — **não processa pagamento** até o gateway ser escolhido pela cliente. Quando o gateway existir, o mesmo botão passa a levar a um checkout real, sem reescrever a estrutura do carrinho.
- **Hero 3D: ABANDONADO (Fase 9.6, 2026-08-10, decisão do Yan).** O canvas Three.js foi implementado na Fase 6, reposicionado na Fase 9.5 (o critique tinha achado que ele cobria a foto do produto) e removido por completo na Fase 9.6 — não é retomar experimentação, é alinhar com o que o próprio `design-dna.json` (Fase 3, extraído das fotos reais) já documentava: `visual_language.focal_strategy: "single hero element"` e `composition.negative_space_role: "protagonista"`. Um segundo elemento visual (mesmo só um medalhão pequeno) contrariava os dois. O Hero hoje é só a imagem estática do produto, sozinha — continua sendo o elemento de LCP, carrega primeiro, sem nenhum canvas depois. Ver PROGRESS.md, seção Fase 9.6, para o histórico completo.
- **Vitrine de vídeos:** GSAP/ScrollTrigger, revelação progressiva no scroll, **sem CTA** — é ilustração visual pura, não elemento de conversão.
- **Acessibilidade:** toda animação respeita `prefers-reduced-motion`; alt text em imagens/vídeos; contraste WCAG AA na paleta creme/dourado. (O requisito de `aria-label` na cena 3D não se aplica mais — não existe mais cena 3D, ver "Hero 3D" acima.)
- **Analytics:** GA4/Meta Pixel só disparam depois do consentimento no banner de cookies — nunca automático no carregamento.

## Skills/plugins instalados em `.claude/` (fora de `src/`)

| Skill/plugin | Uso |
|---|---|
| `impeccable` | Auditoria de design — usar em `/impeccable audit` e `/impeccable critique` |
| `gsap-skills` (sub-skill `gsap-scrolltrigger`) | Vitrine de vídeos |
| `design-dna` | Gera tokens de cor/tipografia/espaçamento a partir das fotos reais |
| `threejs-skills` | Hero 3D — usado na Fase 6; **Hero 3D abandonado na Fase 9.6** (ver "Arquitetura confirmada"), skill não tem mais uso ativo no projeto |
| `ponytail` | Disciplina de código mínimo — aplicar em toda implementação, não só no carrinho |
| `strix` | Segurança — **NÃO rodar durante o desenvolvimento**, só pré-deploy e ao redor da integração do gateway de pagamento. Não é skill modular, é CLI própria (`curl -sSL https://strix.ai/install \| bash`). |

## Decisões técnicas já testadas empiricamente — não refazer o teste

- **Vídeo:** corte de 8–10s + CRF 26 + H.264/MP4 único. WebM/VP9 testado no mesmo recorte e descartado — ficou 84,4% mais pesado que o H.264 equivalente. A duração do corte é a alavanca dominante de tamanho de arquivo, não o codec.
- **Correção de fundo de foto de produto:** ajuste de balanço de branco/exposição por canal (numpy/Pillow), não cutout/remoção de fundo. `rembg` foi testado e descartado — deixava artefatos visíveis nas bordas (ex.: no galho seco das flatlay).

## Placeholders obrigatórios — nunca inventar o valor real

| Placeholder | Motivo |
|---|---|
| `[CNPJ/MEI — PENDENTE]` | Status de registro da cliente ainda não confirmado (CNPJ formal / MEI / informal) |
| `NUMERO_WHATSAPP_PENDENTE` (constante em `src/lib/config.js`) | `w.app/rkoc19` é candidato ao número de produção, ainda não confirmado |
| Produtos carro-chefe | As 5 entradas criadas na Fase 2 são provisórias, baseadas nas fotos já corrigidas — lista final ainda não veio da cliente |
| Gateway de pagamento | Não decidido — carrinho funciona sem ele (consolidação via WhatsApp) |

## Fluxo de trabalho — loop de fases com checkpoints claros

Este projeto avança em 10 fases sequenciais, descritas em `ORQUESTRACAO_PROMPTS_SOE.md`. Siga este contrato em toda sessão:

1. No início da sessão, leia `ORQUESTRACAO_PROMPTS_SOE.md` e `PROGRESS.md` (crie `PROGRESS.md` se não existir) para saber quais fases já foram concluídas.
2. Mantenha uma lista de tarefas (todo list) espelhando as 10 fases — uma tarefa por fase, marcada pending/in_progress/completed.
3. Trabalhe **uma fase por vez**. Nunca comece a próxima fase sem que a atual tenha sido explicitamente aceita.
4. Ao terminar uma fase: rode a verificação pedida no próprio prompt da fase (`astro build`, `astro dev`, `ffprobe`, `/impeccable audit`, etc.), e só then escreva em `PROGRESS.md` um parágrafo curto: data, número da fase, o que foi feito, resultado literal da verificação (não resuma "passou" sem mostrar o output).
5. Depois de registrar em `PROGRESS.md`, **pare e aguarde confirmação explícita do usuário** ("ok, prossiga para a Fase N+1") antes de iniciar a fase seguinte — mesmo que a fase atual pareça ter dado certo. Isso é o checkpoint: não é automático, é uma regra de comportamento que você segue à risca.
6. Se qualquer verificação falhar, não prossiga para a próxima fase — relate o erro, proponha a correção, e só marque a fase como concluída depois que a verificação passar de fato.
7. **Se a fase depende de uma skill (ver checklist abaixo) e você não usou essa skill de fato, não implemente a fase "na mão" simulando o resultado dela.** Pare, diga explicitamente que a skill não foi usada (ou não estava disponível) e por quê, e só prossiga depois de resolver isso — mesmo que você seja tecnicamente capaz de produzir um resultado parecido sem ela. O motivo de cada skill estar no projeto é o Yan poder confiar que aquele resultado específico (auditoria de design, tokens de cor, disciplina de código mínimo, animação, 3D) passou pela ferramenta certa — um resultado "parecido" feito à mão não cumpre isso.

**Exceção registrada — `ponytail`:** o plugin aparece instalado (visível em Installed e Marketplace), mas os comandos (`/ponytail-review`, `/ponytail-help`) não respondem — testado em 2026-08-08, depois de reinstalação e restart do app, sem sucesso. **Causa raiz encontrada:** uma tentativa de reinstalação retornou o erro "Source path does not exist: `C:\Users\yangu\.claude\plugins\marketplaces\ponytail`" — o usuário real da máquina é `yansi` (confirmado repetidamente via `Get-Location` e listagens de pasta ao longo desta sessão), não `yangu`. É um bug de resolução de caminho no instalador do plugin/Claude Code nesta máquina, não algo corrigível escolhendo escopo de instalação diferente. Depois de 4 tentativas de correção, decidimos não bloquear o projeto nisso. Regra específica: na Fase 4, tente `/ponytail-review`; se responder, cole a saída real (regra 7 vale normalmente). **Se não responder, não é motivo para parar** — aplique manualmente os princípios do ponytail (não implementar o que não é necessário, reusar o que já existe no projeto, preferir a solução mais simples que funciona) e registre no PROGRESS.md que o comando não respondeu, sem tratar isso como bloqueio.

Esse fluxo é aplicado por prompt engineering (esta seção), não por um mecanismo automático de bloqueio do Claude Code — não existe garantia técnica nativa de que uma sessão "não consiga" pular uma fase ou uma skill. A disciplina real vem de duas coisas: (a) cada prompt de fase nomeia a skill explicitamente e exige evidência real da invocação no PROGRESS.md, não uma afirmação; (b) você revisa o PROGRESS.md e o diff de cada fase antes de autorizar a próxima, e barra qualquer fase que não tenha a evidência pedida.

## Checklist de skills obrigatórias por fase

Antes de aceitar uma fase, confira se o PROGRESS.md tem a evidência da coluna certa — uma afirmação genérica ("usei a skill X") não conta como evidência.

**Sobre escopo global vs. projeto (fechado em 2026-08-08):** `design-dna` e `impeccable` estão instalados em escopo GLOBAL (`$env:USERPROFILE\.claude\skills\`), não dentro de `.claude\skills\` deste projeto — confirmado que ambos carregam e funcionam normalmente nesta sessão mesmo assim (apareceram na listagem de skills disponíveis; o `impeccable` foi testado de verdade via `scripts/detect.mjs`, saída `[]`/exit 0 real). Decisão: não copiar para escopo local — copiar criaria uma cópia estática que diverge silenciosamente quando a versão global for atualizada, sem ganho funcional nenhum. Escopo global conta como instalação válida para efeito desta checklist, desde que a evidência de funcionamento (item 2 abaixo) esteja presente.

| Fase | Skill/comando | O que deve aparecer no PROGRESS.md como evidência |
|---|---|---|
| 0 | Instalação de todas as skills | Listagem real de `.claude/skills/` (e `.claude/plugins/` se existir) mostrando as pastas de cada uma das 4 skills + o plugin ponytail |
| 3 | `design-dna` (fase Analyze) | Trecho real do JSON de tokens gerado pela skill (não um JSON inventado pelo agente à mão) |
| 3, 9 | `impeccable` — `/impeccable audit` | Saída literal do comando, com os achados listados (não um resumo tipo "passou sem problemas") |
| 4 | `ponytail` — `/ponytail-review` | Saída literal do comando **se ele responder**. Se não responder (caso conhecido, ver "Exceção registrada" acima), registrar a tentativa e seguir sem bloquear a fase — aplicando os princípios do ponytail manualmente. |
| 5 | `gsap-skills`, sub-skill `gsap-scrolltrigger` | Trecho do código gerado citando explicitamente a API/padrão da sub-skill usada (ex.: `ScrollTrigger.create` com os parâmetros que a skill recomenda) |
| 6 | `threejs-skills` | Trecho do código gerado citando o módulo da skill usado (fundamentals/lighting/performance) |
| 9 | `impeccable` — `/impeccable critique` | Saída literal do comando |
| 10 | `strix` | Confirmação de qual modo rodou (varredura local vs. pentest ativo) + saída literal, não um resumo |

## Aviso sobre o conteúdo jurídico (páginas institucionais)

O texto de Política de Privacidade, Termos de Uso e Trocas/Devoluções entregue na Fase 7 é um **rascunho estruturado**, baseado em LGPD (Lei 13.709/2018), CDC (art. 49, direito de arrependimento) e Decreto 7.962/2013 — não é aconselhamento jurídico e precisa de revisão por advogado antes de publicar em produção, especialmente depois que o status de registro da cliente for confirmado.
