# Orquestração de prompts — Claude Code (VS Code) — Projeto SOE Acessórios

Documento completo, para revisão de fluxo antes da execução. Não é mais preciso repetir contexto de negócio/arquitetura em cada prompt — ele vive em `CLAUDE.md`, que o Claude Code lê automaticamente ao abrir o projeto. Os prompts abaixo ficaram mais enxutos por causa disso; o que cada um contém é só o que é específico daquela fase.

**Regra de execução:** um prompt por vez. Espere o agente terminar, revise o diff, só então cole o próximo. Não pule a revisão — é o ponto inteiro de rodar localmente em vez de nesta sessão cloud.

**Ordem de dependência entre fases:**

```
Fase 0 (setup) 
  → Fase 1 (rotas)
      → Fase 2 (Content Collection)     → Fase 3 (design tokens)
          → Fase 4 (carrinho, depende de 1+3)
          → Fase 5 (vídeos, depende de 1)
          → Fase 6 (hero 3D, depende de 1+3)
          → Fase 7 (páginas legais, depende de 1)
  → Fase 8 (pipeline de vídeo — independente, pode rodar a qualquer momento)
  → Fase 9 (auditoria de design — depois de 1 a 7 aceitas)
  → Fase 10 (segurança — só no pré-deploy ou na integração de pagamento, NÃO agora)
```

---

## Fase 0 — Setup do ambiente

Rodar no terminal do VS Code, dentro de `Site_cliente_SOE`, **antes** de abrir o chat do Claude Code.

### Passo 1 — Colocar o CLAUDE.md

Salve o arquivo `CLAUDE.md` (enviado junto com este documento) na **raiz** do projeto, antes de rodar qualquer comando abaixo. É esse arquivo que carrega o contexto de negócio, identidade visual, arquitetura e placeholders — o Claude Code lê automaticamente.

### Passo 2 — Scaffold

**Correção de diagnóstico (2026-08-08):** na primeira tentativa, os comandos rodaram em `C:\Users\yansi` em vez de dentro do projeto, e o `create-astro` criou um scaffold solto em `C:\Users\yansi\certain-crater`. Isso foi corrigido — mas na segunda tentativa, **já dentro da pasta certa**, o mesmo prompt "Where should we create your new project?" apareceu de novo e criou um scaffold solto em `Site_cliente_SOE\steadfast-star\`. Diagnóstico real, agora confirmado: **o `create-astro` considera QUALQUER pasta não literalmente vazia como "não vazia"** — inclusive uma pasta que só tem os arquivos `.md` deste projeto e a subpasta `analise_acessts`. Não é sobre estar no lugar certo ou errado; é sobre a pasta ter qualquer conteúdo. Corrigi manualmente o resultado da segunda tentativa (via device bridge): movi o conteúdo de `steadfast-star/` para a raiz de `Site_cliente_SOE`, sem sobrescrever o `CLAUDE.md` real (o `create-astro` também gera seu próprio `CLAUDE.md`/`AGENTS.md` — o `AGENTS.md` genérico foi mantido, o `CLAUDE.md` genérico foi isolado em `_to_delete/` para não colidir com o nosso). Um `astro.config.mjs` órfão que tinha sido criado direto na raiz (pelo `astro add tailwind` rodando sem projeto válido) também foi isolado em `_to_delete/`.

**Se você está lendo isso porque já passou por essa recuperação (verifique se existe uma pasta `_to_delete/` na raiz do projeto — se existir, a recuperação já foi feita e você pode pular direto para os comandos abaixo):**

```powershell
cd "C:\Users\yansi\OneDrive\Documentos\Site_cliente_SOE"
Get-Location    # confirme que o caminho acima aparece antes de continuar
node -v         # confirme versão >= 22.12.0 — é o mínimo exigido pelo package.json gerado
npm install
npx astro add tailwind -y
```

Depois, apague a pasta de quarentena (conteúdo já não é mais necessário):

```powershell
Remove-Item -Recurse -Force _to_delete
```

**Se você está fazendo o scaffold do zero (pasta ainda vazia, sem `steadfast-star`/`_to_delete`):** ao rodar `npm create astro@latest . -- --template minimal --typescript strict --no-install`, quando aparecer "Where should we create your new project?", **digite `.` e pressione Enter** em vez de aceitar o nome sugerido — isso força a criação direto na pasta atual em vez de uma subpasta solta. Se mesmo assim ele recusar ou o resultado parecer estranho, pare e me avise antes de continuar — não repita a tentativa sozinho mais de uma vez.

### Passo 3 — Instalação das skills/repositórios

**Resposta direta:** 4 das 5 instalam pelo PowerShell (são comandos de shell/npx de verdade). 1 (`ponytail`) só instala de dentro do chat do Claude Code, porque `/plugin marketplace add` e `/plugin install` são comandos próprios do Claude Code — não existem como programa de linha de comando do Windows, rodar isso no PowerShell só vai dar erro de "comando não reconhecido".

**No PowerShell, ainda na raiz do projeto** (essas 4 primeiro, antes de abrir o Claude Code):

```powershell
npx impeccable install
npx skills add greensock/gsap-skills
npx skills add zanwei/design-dna -a claude-code -g -y
git clone https://github.com/CloudAI-X/threejs-skills.git .threejs-skills-src
Copy-Item -Recurse .threejs-skills-src\skills .claude\skills\threejs-skills
Remove-Item -Recurse -Force .threejs-skills-src
```

(Os três comandos do `threejs-skills` foram corrigidos aqui para sintaxe PowerShell — a versão anterior deste documento tinha `cp -r`/`rm -rf`, que são comandos Bash e não existem assim no PowerShell. Se você já tentou rodar a versão antiga e deu erro, é por isso; use os três comandos `Copy-Item`/`Remove-Item` acima.)

**No chat do Claude Code, depois de abri-lo no projeto** (esta é a única que precisa ser ali):

```
/plugin marketplace add DietrichGebert/ponytail
/plugin install ponytail@ponytail
```

**Aviso (2026-08-08):** essa instalação apresentou problemas nesta sessão — o plugin aparece em "Installed" e "Marketplace" no painel do Claude Code, mas os comandos (`/ponytail-review`, `/ponytail-help`) não respondem, mesmo depois de reinstalar e reiniciar o app. Depois de 4 tentativas, decidimos não bloquear o projeto nisso: se acontecer de novo, siga em frente sem o plugin — a Fase 4 já tem instrução para aplicar os princípios do ponytail manualmente quando o comando não responde. Não é necessário insistir mais nessa instalação.

| Repositório | Onde | Fase que usa |
|---|---|---|
| `pbakaus/impeccable` | PowerShell | 3, 9 |
| `greensock/gsap-skills` | PowerShell | 5 |
| `zanwei/design-dna` | PowerShell | 3 |
| `CloudAI-X/threejs-skills` | PowerShell | 6 |
| `DietrichGebert/ponytail` | Chat do Claude Code | Todas (disciplina de código) |

**`usestrix/strix` NÃO entra nesta fase.** Confirmado no escopo (validação de segurança), mas a instalação e o uso ficam para a Fase 10 — ver o motivo lá.

### Passo 4 — Confirmar que as skills realmente instalaram (evidência, não suposição)

Antes de colar o `PROMPT_INICIAL.md` no Claude Code, rode no PowerShell, dentro da pasta do projeto:

```powershell
Get-ChildItem .claude\skills -Recurse -Directory
Get-ChildItem .claude\plugins -Recurse -Directory -ErrorAction SilentlyContinue
```

Cole a saída disso no `PROGRESS.md`, numa entrada "Fase 0". Isso é o que a checklist de skills do `CLAUDE.md` pede como evidência da Fase 0 — sem essa listagem real, não há como confirmar que `design-dna`, `gsap-skills`, `threejs-skills`, `impeccable` e `ponytail` de fato foram para o lugar certo antes de qualquer fase começar a depender delas.

---

## Fase 1 — Scaffold de estrutura e rotas

```
Leia o CLAUDE.md deste projeto antes de começar.

Crie a estrutura de pastas e o esqueleto de rotas, SEM estilização ainda — só a arquitetura:

- src/layouts/BaseLayout.astro (head, meta tags OG básicas, slot)
- src/pages/index.astro (home, vazia por enquanto, só com comentários marcando as 6 seções: Hero, Vitrine de vídeos, Carros-chefe, Prova social, Teaser história, CTA final + rodapé)
- src/pages/catalogo.astro
- src/pages/produto/[slug].astro (getStaticPaths ainda sem dados — o Content Collection vem na próxima fase)
- src/pages/nossa-historia.astro
- src/pages/carrinho.astro
- src/pages/institucional/privacidade.astro
- src/pages/institucional/termos.astro
- src/pages/institucional/trocas-devolucoes.astro
- src/pages/institucional/contato.astro
- src/pages/404.astro

Cada página, por enquanto, só precisa renderizar um <h1> com o próprio nome dentro do BaseLayout, para eu confirmar que o roteamento funciona antes de entrar com conteúdo real. Rode `astro build` ao final para confirmar que não há erro de tipo.
```

---

## Fase 2 — Content Collection de produtos

Depende da Fase 1.

```
Leia o CLAUDE.md deste projeto antes de começar.

Crie o Content Collection de produtos em src/content/produtos/, com schema Zod em src/content.config.ts (raiz de src/ — não src/content/config.ts; esse caminho antigo foi removido a partir do Astro v6/Content Layer API e o Astro 7.2 instalado rejeita com LegacyContentConfigError, confirmado em execução real em 2026-08-08):

- slug: string (derivado do nome do arquivo)
- nome: string
- descricaoCurta: string
- preco: number (em reais, valor exato, sem arredondamento — ex: 49.9, não 49.90 truncado)
- imagens: array de string (paths para src/assets/produtos/)
- destaqueHome: boolean (true = aparece também na seção Carros-chefe da home; false = só aparece em /catalogo)
- disponivel: boolean (a cliente controla isso depois via Decap CMS)

Crie 5 entradas de PRODUTO PROVISÓRIO baseadas nas 5 fotos flatlay já corrigidas (estão em analise_acessts/fundo_uniformizado/): quadriculado_bege, laco_linho_verde, laco_linho_vermelho, animal_print, laco_linho_bordado_outono. Use os nomes das legendas do Instagram como base do campo "nome" e marque destaqueHome: true nas 5.

IMPORTANTE: essas 5 entradas são dados de teste para validar o schema e a grade — a lista final de produtos carro-chefe ainda não foi confirmada pela cliente (ver placeholder no CLAUDE.md). Adicione um comentário no topo de cada arquivo: "# PROVISÓRIO — confirmar com a cliente".

Copie as 5 imagens de analise_acessts/fundo_uniformizado/ para src/assets/produtos/. Depois, implemente a página /catalogo.astro e /produto/[slug].astro consumindo o Content Collection (getCollection, getStaticPaths). Ainda sem estilização — só a estrutura de dados funcionando.
```

---

## Fase 3 — Tokens de design (design-dna)

Depende da skill `design-dna` instalada na Fase 0. Pode rodar em paralelo à Fase 2.

```
Leia o CLAUDE.md deste projeto antes de começar (seção "Identidade visual" tem o input humano validado — não o output final).

Use a skill design-dna, fase Analyze, para gerar o JSON de Design DNA da marca SOE Acessórios a partir das imagens em analise_acessts/fundo_uniformizado/ (as 7 fotos de produto já com fundo uniformizado).

Gere o JSON de tokens (cor, tipografia, espaçamento, shape, elevação) e converta em tailwind.config.mjs como extensão do tema (cores nomeadas, ex: `creme`, `dourado`, `terracota`, `oliva`, `rosa-suave`, `carvao` — não sobrescreva as cores padrão do Tailwind).

Ao final, rode `/impeccable audit .` (skill impeccable) sobre o tailwind.config.mjs e me mostre o relatório antes de eu aceitar o diff.

Antes de escrever em PROGRESS.md: confirme explicitamente, por nome, que usou a skill design-dna (não gerou os tokens "na mão" com base no que já sabe da paleta) e que rodou /impeccable audit de fato — não um resumo tipo "auditei e está tudo certo". Cole no PROGRESS.md um trecho real do JSON gerado pela design-dna e a saída literal do /impeccable audit. Se a skill design-dna não carregar ou não estiver disponível, pare e me avise antes de prosseguir — não simule o resultado dela.
```

---

## Fase 4 — Header, carrinho e estado client-side

Depende das Fases 1 e 3.

```
Leia o CLAUDE.md deste projeto antes de começar (seção "Arquitetura confirmada" tem o desenho do carrinho — siga exatamente esse desenho, não invente uma alternativa).

Aplique disciplina ponytail (minimal working implementation, sem dependências novas além do que já está no projeto) para implementar:

- src/lib/cart-store.js: estado do carrinho em localStorage. Funções: adicionarItem(slug, nome, preco, quantidade), removerItem(slug), listarItens(), limparCarrinho(), gerarMensagemWhatsApp() — esta última monta uma string formatada com nome + quantidade + preço de cada item e o total, pronta para virar link wa.me.
- src/lib/config.js: constante única NUMERO_WHATSAPP_PENDENTE, centralizando o número usado em todo o site.
- src/components/layout/Header.astro: logo/nome do site, navegação (Home, Catálogo, Nossa História, Contato), e o CartIcon com contador de itens.
- src/components/layout/CartIcon.astro: ícone fixo, sempre visível, abre o CartDrawer ao clicar.
- src/components/layout/CartDrawer.astro: lista os itens do localStorage, botão "Finalizar no WhatsApp" que abre `https://wa.me/[NUMERO_WHATSAPP_PENDENTE]?text=[mensagem codificada]`.

Integre o Header ao BaseLayout. Adicione o botão "Adicionar ao carrinho" nos componentes de produto (crie ProdutoCard.astro se ainda não existir, usado tanto na home quanto em /catalogo).

Rode /ponytail-review no final e me mostre o resultado antes de eu aceitar.

Cole no PROGRESS.md a saída literal do /ponytail-review, se ele responder. Caso conhecido (2026-08-08): o plugin ponytail aparece instalado, mas o comando não responde nesta instalação — se isso acontecer, NÃO pare a fase por causa disso. Registre no PROGRESS.md que o comando não respondeu, aplique manualmente os princípios do ponytail (menor implementação necessária, reusar o que já existe no projeto, preferir a solução mais simples que funciona) na revisão do código do carrinho, e prossiga.
```

---

## Fase 5 — Vitrine de vídeos (GSAP/ScrollTrigger)

Depende da Fase 1 e da skill `gsap-skills` (sub-skill `gsap-scrolltrigger`).

```
Leia o CLAUDE.md deste projeto antes de começar (seção "Arquitetura confirmada": vitrine de vídeos é SEM CTA, é ilustração visual pura).

Use a sub-skill gsap-scrolltrigger para implementar a seção "Vitrine de vídeos" da home (segunda seção).

Os 4 vídeos brutos estão em analise_acessts/ (ainda não processados pelo pipeline de compressão da Fase 8 — trate como placeholder de desenvolvimento, não use os arquivos brutos em produção). Crie o componente src/components/home/VitrineVideos.astro com os vídeos revelados progressivamente conforme o scroll (fade/scale-in via ScrollTrigger), respeitando prefers-reduced-motion (se o usuário tiver essa preferência ativada, os vídeos aparecem sem animação, direto).

Não otimize os vídeos nesta etapa — isso é o pipeline de compressão (Fase 8), separado.

Antes de escrever em PROGRESS.md: confirme explicitamente, por nome, que usou a sub-skill gsap-scrolltrigger (nomeie-a na sua resposta) e cole no PROGRESS.md o trecho de código que usa a API/padrão que essa sub-skill recomenda para scroll reveal — não uma implementação de ScrollTrigger genérica escrita sem consultar a skill. Se a skill não carregar, pare e me avise antes de prosseguir.
```

---

## Fase 6 — Hero com produto em 3D

Depende da Fase 1, Fase 3 e da skill `threejs-skills`.

```
Leia o CLAUDE.md deste projeto antes de começar (seção "Arquitetura confirmada": o requisito de LCP antes do canvas 3D é NÃO NEGOCIÁVEL).

Use a skill threejs-skills (módulos fundamentals + lighting + performance) para implementar o Hero da home:

- A imagem estática do produto precisa carregar e renderizar ANTES do canvas 3D. O canvas entra progressivamente por cima, só depois da hidratação client-side (usar client:idle ou client:visible do Astro, não client:load).
- Estrutura: src/components/home/Hero.astro com header (contém o CartIcon já implementado na Fase 4), título, tagline, e o produto-herói em 3D. Use um modelo simples (geometria + material, não é necessário GLTF externo nesta primeira versão) só para validar a integração — trocar por asset real do produto depois.
- Adicione aria-label descritivo na cena 3D para acessibilidade.

Ao final, rode `astro dev` e me diga manualmente (não precisa de screenshot) se o hero carrega sem bloquear — quero seu diagnóstico textual do timing de LCP vs. canvas.

Antes de escrever em PROGRESS.md: confirme explicitamente, por nome, quais módulos da skill threejs-skills você usou (fundamentals/lighting/performance) e cole no PROGRESS.md o trecho de código que reflete o padrão recomendado por ela — não uma implementação Three.js genérica. Se a skill não carregar, pare e me avise antes de prosseguir.
```

---

## Fase 7 — Páginas legais e institucionais

Depende da Fase 1. Pode rodar em paralelo às Fases 4–6.

**Nota para você, Yan, antes de rodar esta fase:** o texto abaixo é um rascunho estruturado que já preparei (baseado em LGPD, CDC art. 49 e Decreto 7.962/2013), não é aconselhamento jurídico. Precisa de revisão por advogado antes de ir para produção — principalmente depois que o status de registro da cliente for confirmado, porque isso muda a razão social/CNPJ que entra nos textos.

```
Leia o CLAUDE.md deste projeto antes de começar (placeholders obrigatórios: nunca substitua [CNPJ/MEI — PENDENTE], [E-MAIL_PENDENTE], [ENDEREÇO — PENDENTE], [CIDADE/UF — PENDENTE] ou [PRAZO_PENDENTE] por um valor inventado — mantenha o placeholder literal no texto).

Insira o conteúdo abaixo nas páginas institucionais correspondentes, adaptando só a marcação HTML/componentização ao layout do projeto (headings, parágrafos, listas) — não reescreva o conteúdo jurídico.

=== /institucional/privacidade ===

# Política de Privacidade

Última atualização: [use a data de hoje]

A SOE Acessórios, [CNPJ/MEI — PENDENTE], leva a sério a privacidade de quem visita e compra em nosso site. Esta Política explica quais dados coletamos, para que usamos e quais direitos você tem sobre eles, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD).

## 1. Dados que coletamos
Dados de identificação e contato fornecidos voluntariamente (nome, e-mail, telefone/WhatsApp) quando você entra em contato, adiciona itens ao carrinho ou preenche o formulário de contato. Dados de navegação (páginas visitadas, tempo de permanência, dispositivo, origem do acesso), coletados por cookies e ferramentas de análise, somente após seu consentimento no banner de cookies. Não coletamos dados de pagamento diretamente no site — a finalização da compra ocorre via WhatsApp, fora desta plataforma.

## 2. Finalidade do tratamento
Responder contatos e dúvidas; processar e conduzir pedidos de compra iniciados pelo carrinho do site; melhorar a experiência de navegação e o desempenho do site; cumprir obrigações legais e regulatórias.

## 3. Base legal
O tratamento de dados pessoais neste site se baseia em: consentimento do titular, para cookies não essenciais e comunicações de marketing; execução de procedimentos preliminares relacionados a contrato, para o processamento de pedidos; cumprimento de obrigação legal, quando aplicável.

## 4. Compartilhamento de dados
Não vendemos dados pessoais. Podemos compartilhar dados com prestadores de serviço estritamente necessários à operação do site (ex.: hospedagem, ferramentas de análise de tráfego), sempre limitados ao necessário para a finalidade do serviço.

## 5. Seus direitos como titular
Nos termos da LGPD, você pode solicitar a qualquer momento: confirmação da existência de tratamento, acesso aos dados, correção de dados incompletos ou desatualizados, anonimização/bloqueio/eliminação de dados desnecessários, portabilidade, informação sobre compartilhamento, e revogação do consentimento. Para exercer esses direitos, entre em contato pelo e-mail [E-MAIL_PENDENTE] ou pelo WhatsApp indicado no rodapé.

## 6. Cookies
Este site usa cookies. Cookies estritamente necessários ao funcionamento do site são carregados automaticamente; cookies de análise e marketing só são ativados após seu consentimento explícito no banner de cookies, que permite aceitar todos, rejeitar não essenciais, ou configurar por categoria.

## 7. Segurança dos dados
Adotamos medidas técnicas e administrativas razoáveis para proteger os dados pessoais tratados neste site contra acessos não autorizados e situações de destruição, perda, alteração ou vazamento.

## 8. Alterações desta política
Esta política pode ser atualizada para refletir mudanças em nossas práticas ou na legislação aplicável. A data da última atualização estará sempre indicada no topo desta página.

## 9. Contato
Dúvidas sobre esta Política ou sobre o tratamento de seus dados podem ser enviadas para [E-MAIL_PENDENTE] ou pelo WhatsApp [NUMERO_WHATSAPP_PENDENTE].

=== /institucional/termos ===

# Termos de Uso

## 1. Aceitação dos termos
Ao acessar e usar este site, você concorda com estes Termos de Uso. Se não concordar, pedimos que não utilize o site.

## 2. Sobre a SOE Acessórios
Este site é operado por SOE Acessórios, [CNPJ/MEI — PENDENTE], com sede em [ENDEREÇO — PENDENTE].

## 3. Propriedade intelectual
Todo o conteúdo deste site — incluindo fotos, vídeos, textos, identidade visual e marca — pertence à SOE Acessórios ou é usado com autorização. É proibida a reprodução, distribuição ou uso comercial desse conteúdo sem autorização prévia por escrito.

## 4. Uso do site
Você concorda em usar este site apenas para fins lícitos, sem tentar comprometer sua segurança, disponibilidade ou funcionamento.

## 5. Produtos, preços e disponibilidade
Os produtos exibidos no site representam apenas parte do catálogo da SOE Acessórios — o catálogo completo está disponível via WhatsApp. Preços, disponibilidade e características dos produtos podem ser alterados sem aviso prévio. A confirmação final do pedido acontece via WhatsApp.

## 6. Compra e carrinho
O carrinho deste site organiza sua seleção de produtos e gera uma mensagem de pedido para envio via WhatsApp, onde o pagamento e a entrega são combinados diretamente com a SOE Acessórios. O site, por si só, não processa pagamentos.

## 7. Limitação de responsabilidade
A SOE Acessórios não se responsabiliza por danos indiretos decorrentes do uso deste site, exceto nos casos previstos em lei. Nada nestes Termos exclui direitos garantidos pelo Código de Defesa do Consumidor.

## 8. Alterações
Estes Termos podem ser atualizados a qualquer momento. O uso continuado do site após alterações constitui aceitação dos novos termos.

## 9. Foro
Fica eleito o foro da comarca de [CIDADE/UF — PENDENTE] para dirimir eventuais controvérsias decorrentes destes Termos, com renúncia a qualquer outro, por mais privilegiado que seja.

=== /institucional/trocas-devolucoes ===

# Trocas, Devoluções e Direito de Arrependimento

## 1. Direito de arrependimento
Nos termos do art. 49 do Código de Defesa do Consumidor (Lei nº 8.078/1990), você tem o direito de desistir da compra em até 7 (sete) dias corridos, contados da data de recebimento do produto, sem necessidade de justificar o motivo — por se tratar de compra realizada fora do estabelecimento comercial físico.

## 2. Como solicitar
Entre em contato pelo WhatsApp [NUMERO_WHATSAPP_PENDENTE] ou pelo e-mail [E-MAIL_PENDENTE] dentro do prazo de 7 dias corridos, informando o pedido e o motivo da desistência (opcional).

## 3. Condições do produto para devolução
O produto deve ser devolvido em sua embalagem original, sem sinais de uso, acompanhado da nota/comprovante de compra.

## 4. Reembolso
Confirmada a devolução dentro do prazo e condições acima, o reembolso será integral, incluindo o valor do frete de envio original, sem qualquer ônus para você. O reembolso é processado pelo mesmo meio de pagamento utilizado na compra, em até [PRAZO_PENDENTE] dias úteis após o recebimento do produto devolvido.

## 5. Trocas por defeito ou vício
Produtos com defeito de fabricação podem ser trocados ou reembolsados conforme os prazos e condições do Código de Defesa do Consumidor (art. 18 e seguintes), independentemente do prazo de arrependimento acima.

## 6. Frete de devolução
Nas devoluções por direito de arrependimento, o custo do frete de devolução é de responsabilidade da SOE Acessórios.

=== Rodapé (Footer.astro) ===

SOE Acessórios — [CNPJ/MEI — PENDENTE] — [ENDEREÇO — PENDENTE]
Contato: [E-MAIL_PENDENTE] · WhatsApp: [NUMERO_WHATSAPP_PENDENTE]
Links: Política de Privacidade · Termos de Uso · Trocas e Devoluções

=== Banner de cookies (componente separado, ex. CookieBanner.astro) ===

Título: "Usamos cookies"
Texto: "Usamos cookies para melhorar sua experiência neste site. Cookies essenciais ao funcionamento estão sempre ativos; os demais só são usados com sua permissão."
Botões, com o MESMO destaque visual entre "Aceitar todos" e "Rejeitar não essenciais" (nenhum dos dois pode parecer secundário): "Aceitar todos" | "Rejeitar não essenciais" | "Personalizar"
Painel de personalização, sem nenhuma opção pré-marcada exceto a primeira: Essenciais (sempre ativo, não editável) | Análise/Desempenho (opt-in) | Marketing (opt-in)

Implemente o banner com bloqueio prévio de scripts: nenhum script de analytics/pixel deve carregar antes do consentimento.
```

---

## Fase 8 — Pipeline de vídeo (compressão final)

Independente das outras fases — pode rodar a qualquer momento.

```
Leia o CLAUDE.md deste projeto antes de começar (seção "Decisões técnicas já testadas empiricamente" — não repita os testes, já estão validados).

Aplique aos 4 vídeos em analise_acessts/ os parâmetros já testados:

- Corte para 8–10s (o vídeo mais curto, snapinsta-1786132205438.mp4 com 9,4s, já está pronto como está — não recortar).
- CRF 26, H.264 único (sem WebM).
- Resolução mínima 720p nos vídeos em destaque; o Video_by_soefloripa.mp4 está em 360×640, abaixo desse mínimo — use-o só em espaço pequeno na prova social, não na vitrine principal.

Gere os arquivos finais em public/videos/, com nomes descritivos (não os hashes do snapinsta). Rode ffprobe no resultado final e me mostre a tabela de antes/depois (tamanho e duração) para eu confirmar contra os números já medidos.
```

---

## Fase 9 — Auditoria final de design (impeccable)

Rodar por último, depois que as Fases 1–8 estiverem todas aceitas.

```
Rode /impeccable audit . e /impeccable critique . (skill impeccable) sobre o projeto inteiro. Me traga o relatório completo, sem filtrar ou resumir os achados — quero ver tudo que foi encontrado, inclusive itens menores, antes de decidir o que corrigir agora e o que fica para depois.

Cole no PROGRESS.md a saída literal dos dois comandos — não um resumo seu do que eles encontraram.
```

---

## Fase 10 — Auditoria de segurança (Strix)

**Não executar junto com as Fases 1–9.** Strix valida segurança (superfície de ataque, dependências vulneráveis, exposição de dados) — preocupação diferente da Fase 9 (qualidade de design/UI), por isso ficam separadas.

O Strix não é skill modular do Claude Code — é CLI própria: `curl -sSL https://strix.ai/install | bash`, com varredura leve de código local (sem custo) de um lado e pentest ativo (Docker + chave de LLM paga, ex. `STRIX_LLM`/`LLM_API_KEY`) do outro.

**Quando rodar (dois momentos, nenhum deles agora):**
1. Pré-deploy, antes de publicar no Netlify pela primeira vez.
2. Ao redor da integração do gateway de pagamento — maior risco, justifica o pentest ativo mesmo com o custo.

```
Instale o Strix (curl -sSL https://strix.ai/install | bash, confirme o comando atual em strix.ai antes de rodar) e execute uma varredura de segurança sobre este projeto Astro (strix --target .). Antes de rodar, me confirme se essa varredura exige a chave STRIX_LLM/LLM_API_KEY ou se roda em modo local sem custo — não assuma, verifique na documentação do próprio Strix. Me traga o relatório completo sem filtrar, priorizado por severidade.
```

---

## Pendências que continuam fora do código

1. Lista final de produtos carro-chefe — as 5 entradas da Fase 2 são provisórias.
2. Confirmação de `w.app/rkoc19` como WhatsApp de produção — placeholder na Fase 4.
3. Status de registro da cliente (CNPJ/MEI/informal) — placeholder na Fase 7. Revisão jurídica do texto legal recomendada antes de publicar.
4. Gateway de pagamento — não bloqueia nenhuma fase; dispara o segundo momento de execução do Strix quando decidido.
5. Revisão do laço verde-oliva bordado (maior desvio de cor, ganho 1,35×) — independente do código.
6. E-mail de contato oficial da cliente — usado nos textos legais da Fase 7 como [E-MAIL_PENDENTE], ainda não coletado.
7. Endereço da cliente para o rodapé/Termos — [ENDEREÇO — PENDENTE].

## Fontes consultadas (2026-08-07/08)

- [pbakaus/impeccable](https://github.com/pbakaus/impeccable)
- [greensock/gsap-skills](https://github.com/greensock/gsap-skills)
- [zanwei/design-dna](https://github.com/zanwei/design-dna)
- [CloudAI-X/threejs-skills — README](https://github.com/CloudAI-X/threejs-skills/blob/main/README.md)
- [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail)
- [usestrix/strix](https://github.com/usestrix/strix)
- [MPCE — Direito de Arrependimento](https://mpce.mp.br/decon/duvidas/direito-de-arrependimento/)
- [LegalSuite — Cookies e Banners LGPD/ANPD 2026](https://legalsuite.com.br/blog/digital-cookies-banner-lgpd-2026)
