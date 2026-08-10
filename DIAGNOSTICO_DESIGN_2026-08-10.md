# Diagnóstico de design — Site SOE

**Data:** 10/08/2026
**Autor:** Claude, a pedido do Yan
**Base factual:** `PROGRESS.md` (Fase 9, auditorias de 09/08/2026), `ORQUESTRACAO_PROMPTS_SOE.md`, `src/styles/design-dna.json`, `tailwind.config.mjs`, `src/pages/index.astro`, `src/layouts/BaseLayout.astro`

---

## 1. A nota 2/10 tem lastro técnico — não é só percepção

Antes de qualquer opinião minha, os números que o próprio projeto já produziu:

| Auditoria | Nota | Classificação |
|---|---|---|
| `/impeccable audit` — saúde técnica geral (Fase 9, 09/08/2026) | 9/20 | Poor |
| `/impeccable critique` — Design Health Score (10 heurísticas de Nielsen) | 13/36 (36%) | Poor |
| Item "Estética e design minimalista" dentro do critique | 0/4 | "Zero hierarquia visual em qualquer página" |
| Item "Consistência e padrões" | 1/4 | "Sameness plana (sem hierarquia nenhuma), não consistência desenhada" |

A causa raiz confirmada por `grep -r "class=" src/pages` (rodado na própria auditoria): **0% de adoção dos tokens de cor e tipografia** definidos na Fase 3 (`design-dna.json` → `tailwind.config.mjs`) em qualquer página do site. Os tokens existem, estão tecnicamente corretos, têm proveniência rastreável — e nunca chegaram a um template. `index.astro`, por exemplo, hoje tem literalmente três seções da Home (`Prova social`, `Teaser Nossa História`, `CTA final + rodapé`) como comentário HTML vazio, não implementadas.

Isso explica objetivamente os sintomas que você descreveu — blocos genéricos, tipografia ruim, ausência de hierarquia: não é o Tailwind "vazado" por acaso, é o Tailwind default rodando por cima de zero estilização de marca.

### Causa mais profunda: o Design DNA nunca teve uma referência real de site

O `design-dna.json` (Fase 3) foi extraído usando **apenas 7 fotos still-life de produto** (`analise_acessts/fundo_uniformizado/`). O próprio arquivo documenta essa limitação nos comentários de cada campo: tipografia, layout, iconografia e componentes estão explicitamente marcados como **"INFERIDO — não visível nas fotos analisadas"**. Ou seja: cor e textura foram extraídas de evidência real (as fotos de produto), mas a estrutura de UI — tipografia, grid, componentes, ícones — foi inventada por falta de qualquer referência visual de interface. Não existia, até agora, nenhum site real usado como alvo estético. É exatamente esse vão que o passo 4 abaixo fecha.

## 2. O que já funciona — não mexer

Os dois relatórios internos concordam: a Vitrine de Vídeos (Fase 5, GSAP/ScrollTrigger) é o único bloco com achados 100% positivos — pipeline de vídeo medido e otimizado, revelação por scroll funcional, e é também o elemento que você citou como o único que gostou. Vale preservar a lógica de movimento (fade sutil, sem bounce, disparo único ao entrar na viewport) como base de tom para o resto do site na reconstrução.

## 3. Erros de processo — visão crítica e direta

Você pediu para eu ser crítico e imparcial, então vou direto:

1. **Aprovar a extração de Design DNA sem fornecer nenhuma referência de site real.** O próprio JSON avisava, campo por campo, que metade do sistema estava "inferido" por falta de evidência — esse aviso não gerou uma ação corretiva (buscar referência de UI) na hora. Foi aceito como "concluído" mesmo sinalizando lacuna.
2. **Aprovar um plano de 10 fases com um vão lógico não questionado.** O `ORQUESTRACAO_PROMPTS_SOE.md` cria tokens na Fase 3 e só audita na Fase 9 — nenhuma fase no meio tinha como entregável "aplicar os tokens a um componente real". Isso deveria ter sido pego na revisão do plano, antes da Fase 1 começar.
3. **Não abrir o navegador e olhar visualmente entre as Fases 4 e 8.** Toda verificação de "fase concluída" nesse intervalo foi por evidência técnica — git log, build sem erro, PROGRESS.md preenchido — nunca por "isso está bonito?". Rigor técnico não substitui julgamento visual humano; são verificações complementares, não substitutas.
4. **Deixar a auditoria de design (`/impeccable critique`) só para o fim (Fase 9), depois de 8 fases já implementadas.** Se essa auditoria tivesse rodado depois da Fase 4 (Header) ou Fase 6 (Hero), o achado "zero estilização aplicada" teria sido pego com 2 fases de retrabalho, não 8.
5. **Aceitar "página de produto sem CTA de compra" chegar até a Fase 9 sem ser notado antes.** É um problema funcional, não só estético — mas some junto com o P0 de design porque nunca houve checagem intermediária de fluxo de compra ponta a ponta.

## 4. Ideias de correção completa

**A. Fechar o vão de plano, não só o sintoma.** A Fase 9.5 já documentada corrige a aplicação pontual dos tokens — mas o `ORQUESTRACAO_PROMPTS_SOE.md` deveria ganhar uma nota permanente: nenhuma fase futura de UI é aceita como concluída sem uma fase (ou sub-etapa) explícita de "aplicação visual + captura de tela real".

**B. Refazer a extração do Design DNA com uma referência de site real, não só fotos de produto.** É exatamente o passo 4 que você propôs — rodar `/design-dna` com um ou mais sites de referência (lista na seção 5) para preencher com evidência real os campos que hoje estão "inferidos": tipografia, grid, componentes, iconografia, estados de hover.

**C. Instituir um "gate visual" por fase.** Definition of Done de qualquer fase que toque UI passa a exigir: captura de tela real (não descrição em texto) anexada ao PROGRESS.md, revisada por você antes do "OK" que libera a próxima fase. Isso é meramente formalizar o que já devia ter acontecido nas Fases 4–8.

**D. Rodar `/impeccable critique` a cada bloco maior de UI, não só no fechamento.** Um critique leve depois do Header + ProdutoCard (por exemplo) custa uma fração do retrabalho de descobrir o problema só na Fase 9.

**E. Reavaliar o Hero 3D antes de reconstruir.** O canvas 3D cobrindo a foto do produto foi um achado P1 do critique — é um efeito que hoje atrapalha mais do que ajuda a intenção "imagem em primeiro lugar" do próprio `CLAUDE.md`. Vale decidir explicitamente se ele entra na reconstrução ou se é substituído por algo mais simples e testado visualmente cedo.

**F. Depois da reconstrução visual, rodar a auditoria completa de novo e comparar com a baseline.** Isso já está combinado na Fase 9.5 (comparar com 9/20 e 13/36) — reforçando aqui porque é a única forma de saber se a correção realmente resolveu, não só "parece melhor".

## 5. Pesquisa de sites de referência

Você pediu sites que transmitam sofisticação sem luxo, tom de ateliê, acolhedor e bem executado. Separei em três grupos, do mais próximo ao mais aspiracional.

### Concorrente direto (mesmo produto: laços de linho bordado)

- **[Petit Panú](https://www.petitpanu.com.br/acessorios-para-cabelo/lacos-de-linho/linho-bordados/)** — paleta branca/bege/neutra com acentos suaves, tom "produção 100% artesanal, cada peça feita com carinho", depoimentos nominais de clientes, grid de produto limpo sem retoque excessivo. É a referência mais diretamente comparável à SOE porque vende literalmente o mesmo tipo de produto (laços de linho bordado) com o mesmo posicionamento de preço/afeto.
- **[Polyana Formozo Laços](https://polyanaformozolacos.com.br/produto/laco-linho-bordado-unidade/)** — concorrente direto de categoria; vale abrir manualmente para avaliar antes de escolher, não cheguei a inspecionar a estética em detalhe.

### Ateliês brasileiros de acessórios (mesmo tom, categoria adjacente)

- **[Aurore Ateliê](https://www.auroreatelie.com.br/)** — brincos artesanais; tom "acessórios feitos com muito carinho, um a um", sofisticação contida, sem luxo ostensivo, preços acessíveis declarados na home.
- **[Ateliê Nó](https://www.atelieno.com/)** — joalheria contemporânea; se descreve como "despojado e sofisticado", paleta neutra (branco, bege, cinza), nomes poéticos de peça, narrativa sazonal na home.

### Referência internacional (padrão de execução mais alto, mesmo território de marca)

- **[Toast (toa.st)](https://www.toa.st/)** — marca inglesa de slow fashion; tipografia enxuta, paleta preto/branco/neutros, mas o tom vem de conteúdo editorial genuíno (seções sobre artesãos, ofícios, ciclos sazonais — "Harvest Preparations", "corn dolly-making") em vez de linguagem de venda agressiva. É provavelmente a referência de execução mais sofisticada da lista — vale olhar principalmente para a relação entre fotografia, espaço em branco e tipografia, não necessariamente para copiar paleta de cor (a da SOE já está bem definida e amostrada das fotos reais de produto).
- **Christy Dawn (christydawn.com)** — marca americana de vestidos em linho; forte em storytelling visual e fotografia com luz natural quente, território estético próximo ao "still-life de linho com luz de janela" que já está no `design-dna.json` da SOE. Não inspecionei o HTML/estrutura atual em detalhe — vale abrir manualmente antes de usar como input do `/design-dna`.

### Recomendação de uso

Para o passo 4, sugiro rodar `/design-dna` com **Petit Panú como referência primária** (mesma categoria de produto, mesmo público, mesmo tom de preço/afeto — o match mais direto) e **Toast como referência secundária**, só para os campos de tipografia/grid/espaçamento onde a Petit Panú for menos rica — não para paleta de cor, que já tem proveniência real das fotos da SOE e não deveria ser substituída.

---

**Próximo passo:** conforme combinado, você roda `/design-dna` com o(s) site(s) de referência escolhido(s) acima. A partir da saída, reconstruímos o plano juntos antes de tocar em qualquer componente.
