# Prompt inicial do projeto — colar no Claude Code depois da Fase 0

Cole esta mensagem como a **primeira** mensagem no chat do Claude Code, depois que o scaffold (Fase 0) tiver rodado sem erro e o `CLAUDE.md` já estiver na raiz do projeto.

```
Leia CLAUDE.md por completo antes de fazer qualquer coisa — ele tem o contexto de negócio, arquitetura, identidade visual e a seção "Fluxo de trabalho — loop de fases com checkpoints claros", que rege como você deve trabalhar neste projeto a partir de agora.

Leia também ORQUESTRACAO_PROMPTS_SOE.md — ele lista as 10 fases do projeto.

Antes de começar a Fase 1:
1. Crie PROGRESS.md na raiz, vazio, se ainda não existir.
2. Crie uma lista de tarefas (todo list) com uma entrada para cada uma das 10 fases do ORQUESTRACAO_PROMPTS_SOE.md, todas como "pending".
3. Marque a Fase 1 como "in_progress" e comece só ela.

Siga o contrato da seção "Fluxo de trabalho" do CLAUDE.md à risca: uma fase por vez, verificação real ao final de cada uma, registro em PROGRESS.md, e parada explícita aguardando minha confirmação antes da próxima fase. Não pule esse checkpoint mesmo que a fase pareça ter dado certo.

Além disso, para toda fase que a checklist de skills do CLAUDE.md marcar como dependente de uma skill (design-dna, impeccable, ponytail, gsap-scrolltrigger, threejs-skills): use a skill de fato, nomeie-a explicitamente na sua resposta, e cole a evidência real pedida pela checklist no PROGRESS.md — nunca produza um resultado "equivalente" sem passar pela skill. Se uma skill não carregar ou não estiver instalada, pare a fase, me avise o motivo, e não prossiga simulando o resultado dela.

Comece agora pela Fase 1.
```

---

## Por que esse é o desenho certo (e o que eu descartei)

Você pediu "loops de tarefas com hooks claros". Fui checar com precisão o que o Claude Code realmente oferece nesse ponto — e aqui está a parte importante: **usei um agente especializado para levantar isso, e a resposta dele veio com afirmações bem específicas (tipos de hook, comandos `/goal` e `/loop`, limite de "8 bloqueios" num Stop hook) que eu não consegui verificar de forma independente nesta sessão.** Ele cita duas páginas da documentação oficial (`code.claude.com/docs/en/hooks` e `code.claude.com/docs/en/goal`), mas não vou apresentar isso como fato assentado sem você mesmo abrir esses links e confirmar — principalmente porque a sugestão envolve rodar scripts de shell automaticamente a cada ação do agente, o que tem implicação de segurança real se a sintaxe estiver desatualizada ou incompleta.

Por isso, o prompt acima **não depende de hooks técnicos** — é 100% prompt engineering, apoiado em dois mecanismos que eu tenho confiança real (todo list nativa do Claude Code, e o próprio `CLAUDE.md` lido automaticamente a cada sessão). O "checkpoint" não é um bloqueio técnico à prova de falhas — é uma regra de comportamento que o CLAUDE.md deixa explícita, e que você reforça revisando `PROGRESS.md` e o diff antes de liberar a próxima fase. É menos "automático" do que hooks prometem, mas é verificável e não depende de eu confirmar sintaxe que não consegui checar com segurança.

## Sobre "garantir" que as skills vão ser usadas

Preciso ser direto: não existe garantia técnica de que um modelo de linguagem vai invocar uma ferramenta específica — isso não é um botão que liga/desliga, é comportamento probabilístico do agente. Qualquer promessa de "100% garantido" seria falsa segurança. O que eu consigo entregar, e entreguei, é a estrutura que torna o desvio **visível e barrável por você**, em vez de silencioso:

1. **Nomeação explícita por fase** — cada prompt das Fases 3, 4, 5, 6 e 9 agora nomeia a skill exata que deve ser usada, em vez de descrever a tarefa de forma genérica. Isso é o maior fator real de acionamento de uma skill no Claude Code (o sistema casa a skill com o que está sendo pedido).
2. **Evidência obrigatória, não afirmação** — a nova seção "Checklist de skills obrigatórias por fase" no CLAUDE.md especifica, fase por fase, exatamente que saída literal (JSON da design-dna, saída do /impeccable audit, saída do /ponytail-review, trecho de código citando a sub-skill) precisa estar no PROGRESS.md. "Usei a skill X" sem essa evidência não é uma fase aceitável.
3. **Regra de parada explícita** — o CLAUDE.md agora instrui: se a skill não carregar ou não estiver disponível, o Claude Code deve parar e avisar, não implementar a fase "na mão" fingindo que passou pela skill.
4. **Verificação de instalação na Fase 0** — antes de começar qualquer fase, uma listagem real de `.claude/skills/` precisa estar no PROGRESS.md, confirmando que as 4 skills e o plugin ponytail realmente foram para o lugar certo.

Isso não elimina a necessidade de você revisar — elimina a possibilidade de um desvio passar despercebido, porque a evidência exigida é específica demais para "forjar" sem realmente ter rodado a skill.

### Se você quiser ir além (opcional, não fiz por padrão)

Existe, segundo essa mesma pesquisa, um recurso real de hooks em `.claude/settings.json` — por exemplo, um `PostToolUse` que roda `astro build` automaticamente depois de qualquer edição de arquivo, avisando o agente na hora se algo quebrou. Isso é plausível e é um padrão comum citado em documentação de hooks de agentes de código. Se quiser esse reforço adicional, antes de eu escrever o `.claude/settings.json`, abra `https://code.claude.com/docs/en/hooks` você mesmo (ou peça para o próprio Claude Code, já dentro do projeto, ler a documentação de hooks e propor a configuração) — prefiro que a sintaxe exata venha confirmada na hora da instalação, não de uma pesquisa que eu não consigo reconferir.
