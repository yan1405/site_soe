# Logo SOE — vetorização e variantes de cor

**Data:** 10/08/2026
**Origem:** imagem de referência colada no chat (PNG, 100×67px, sem transparência) — a única fonte de logo disponível hoje, já que não existe pasta de arquivos de marca no projeto.

## O que foi feito, com rigor sobre o que é medido e o que é reconstruído

1. **Extração de cor por amostragem de pixel real** (não estimativa visual): segmentei os pixels do fleur-de-lis contra o fundo e agrupei por cor (k-means, 3 clusters). O tom dominante medido é `#C57B1A`, com variação de `#DFC29F` (realce/luz) a `#B06A12` (sombra) — é essa variação real que virou o gradiente da variante "original-gradiente".
2. **Vetorização por tracing (potrace)**, não recriação livre — parti da máscara binária real da imagem, limpei ruído de compressão (abertura/fechamento morfológico) e tracei para curvas Bézier suaves.
3. **Reconstrução honesta dos dois pontos cortados:** a imagem de origem corta o topo e a base do fleur-de-lis (confirmado pixel a pixel: a cor do desenho já toca a borda da imagem na primeira e na última linha). Completei os dois com base na inclinação real do traço nas linhas visíveis antes do corte — é extrapolação linear simples, não invenção de forma nova.
4. **Limite real de qualidade:** a fonte tem só 100×67px. Isso é suficiente para uma silhueta limpa e usável (o resultado abaixo já está pronto pra produção), mas detalhes muito finos do desenho original (a curva exata dos pequenos enrolamentos na base) foram suavizados pelo potrace, não são um traçado pixel a pixel do original. Se a cliente tiver um arquivo de logo em resolução maior (Illustrator, PDF, ou até um PNG grande), vale re-vetorizar a partir dele depois — o resultado vai ficar mais fiel ainda.

## Variantes entregues

| Arquivo | Cor | Uso sugerido |
|---|---|---|
| `logo-fleur-de-lis-original.svg` | `#C57B1A` sólido — tom dominante medido da imagem original | Referência neutra, não necessariamente a versão final |
| `logo-fleur-de-lis-original-gradiente.svg` | Gradiente `#E8C98F → #CB9A5A → #B06A12` — replica a variação de luz real medida na imagem original | Mais fiel à imagem que você colou |
| `logo-fleur-de-lis-soe-dourado.svg` | `#BC9A4E` sólido — **token `dourado.500` já existente no design system real da SOE** (`tailwind.config.mjs`, amostrado das fotos de produto) | **Recomendada** — alinha a marca ao dourado que já é usado no resto do site, em vez de introduzir um terceiro tom de ouro só para a logo |
| `logo-fleur-de-lis-soe-dourado-gradiente.svg` | Gradiente `dourado.300 → dourado.700` (`#D9BD82 → #8F7233`) | Alternativa com profundidade, mesma família de tokens |
| `logo-fleur-de-lis-carvao.svg` | `#2E2A24` (token `carvao.900`) | Versão monocromática — favicon pequeno, impressão 1 cor, marca d'água |
| `logo-fleur-de-lis-branco.svg` | `#FFFFFF` | Para fundo escuro/terracota (rodapé, CTA, header com fundo colorido) |
| `favicon-soe-dourado.ico` | Multi-tamanho (16/32/48/64px) | Pronto pra usar em `public/favicon.ico`, mas ainda não substitui o atual — ver decisão pendente abaixo |
| `preview-todas-as-variantes.png` | — | Contact sheet com as 6 cores lado a lado |

Todos os SVGs usam o mesmo `viewBox="0 0 69.80 73.00"` e o mesmo `<path>` — só a cor/preenchimento muda entre eles, então são intercambiáveis em qualquer componente.

## Decisão que fica com você

A recomendação técnica é `logo-fleur-de-lis-soe-dourado.svg` como versão principal, porque usa a cor que **já é medida e real** no resto do site (fotos de produto), em vez de estabelecer um dourado novo e ligeiramente diferente só para a marca (o `#C57B1A` extraído da imagem da logo é mais alaranjado/escuro que o `dourado.500` da SOE — as duas leituras de "dourado" não são idênticas). Se você preferir manter o tom exato que já usava antes (`#C57B1A`), a variante `original`/`original-gradiente` está pronta também.

## Próximo passo (não feito ainda, por decisão sua)

Não apliquei nenhuma dessas versões no `Header.astro`, no favicon do projeto ou no OG image — isso depende da decisão de cor acima e do plano de reconstrução visual mais amplo que ainda está em aberto (Ateliê Nó vs. Petit Panú como referência). Quando a paleta estiver fechada, é um passo pequeno: trocar o texto "SOE Acessórios" do header (se for o caso) ou o ícone do favicon atual por um destes arquivos.
