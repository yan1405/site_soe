// Cores extraídas do Design DNA (src/styles/design-dna.json), gerado pela skill
// design-dna a partir das 7 fotos em analise_acessts/fundo_uniformizado/.
// Extensão do tema — não sobrescreve as cores padrão do Tailwind.
//
// Remodelagem 2026-08-10 (design-dna.json v2, ver decision_log): tipografia
// deixou de usar Playfair Display como fonte de heading padrão, com base na
// extração de Design DNA de um site de referência real
// (design-dna-atelieno-referencia.json). "Work Sans" cobriu heading e corpo
// na mesma família até 2026-08-14.
//
// Remodelagem 2026-08-14 (pedido direto do Yan, não inferido): "quero uma
// fonte muito mais elegante" reabre essa decisão — agora por escolha
// explícita do cliente, que tem prioridade sobre a leitura da referência.
// Duas rodadas na mesma sessão: heading foi pra "Fraunces" primeiro, mas o
// `impeccable detect` (mesma verificação real da Fase 11) acusou
// 'overused-font' — Fraunces está hardcoded na lista de fontes que "cada
// nova leva de UI gerada por IA converge". Trocado antes de entregar pra
// "Playfair Display" (não está na lista, já self-hospedada no projeto desde
// a Fase 9.5). Work Sans continua no corpo. Ver decision_log em
// design-dna.json pro raciocínio completo, incluindo um bug incidental
// corrigido de graça no arquivo de fonte itálico.
/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	theme: {
		extend: {
			fontFamily: {
				heading: ['"Playfair Display Variable"', "Georgia", "serif"],
				body: ['"Work Sans"', "-apple-system", "Segoe UI", "sans-serif"],
				// Acento decorativo raríssimo (citação, olho do Hero) — nunca heading
				// padrão nem corpo de texto. Mesma família do heading agora
				// (Playfair Display itálico). Ver decision_log.
				acento: ['"Playfair Display Variable"', "Georgia", "serif"],
			},
			// Sombras com o mesmo rgba tingido de carvão do design-dna.json —
			// nunca preto puro genérico. Uso rebaixado a elementos flutuantes
			// reais (drawer, hover de card) — seções usam blocos de cor
			// alternados como separador primário, não sombra (ver design-dna.json
			// v2: a referência mediu 0 box-shadow em qualquer elemento do site).
			boxShadow: {
				low: "0 1px 2px rgba(46,42,36,0.06)",
				medium: "0 4px 12px rgba(46,42,36,0.10)",
				high: "0 12px 32px rgba(46,42,36,0.14)",
			},
			colors: {
				// Fundo/superfície — #F5F0E4 é o valor medido (não estimado) do
				// still-life de produto, registrado no CLAUDE.md.
				creme: {
					50: "#FBF9F3",
					100: "#F5F0E4",
					DEFAULT: "#F5F0E4",
					300: "#EAE0C9",
					500: "#DCCBA0",
					700: "#B9A06A",
					900: "#8B7548",
				},
				// Cor primária de identidade — amostrada do fio de bordado dourado
				// e das espigas de trigo seco (presentes em quase todas as flatlays).
				dourado: {
					50: "#F7F0DE",
					100: "#EDE0BD",
					300: "#D9BD82",
					500: "#BC9A4E",
					DEFAULT: "#BC9A4E",
					700: "#8F7233",
					900: "#5F4B22",
				},
				// Amostrada das espigas secas e do bordado outono (laco_linho_bordado_outono.jpg).
				terracota: {
					50: "#F5E6DC",
					100: "#E9C8B3",
					300: "#CC9166",
					500: "#A85D35",
					DEFAULT: "#A85D35",
					700: "#7C4326",
					900: "#522C19",
				},
				// Cor secundária — amostrada do laço de linho verde-escuro (laco_linho_verde.jpg).
				oliva: {
					50: "#E4E8DF",
					100: "#C3CDB9",
					300: "#8A9877",
					500: "#4B5842",
					DEFAULT: "#4B5842",
					700: "#333D2D",
					900: "#1F251B",
				},
				// Amostrada do scrunchie xadrez rosa em apaixonada_e_pouco.jpg.
				"rosa-suave": {
					50: "#FBF4F3",
					100: "#F4E3E1",
					300: "#EAD1CD",
					500: "#E3C6C2",
					DEFAULT: "#E3C6C2",
					700: "#C99C96",
					900: "#A66D64",
				},
				// Contraste pontual (texto/ícones) — sombras mais escuras observadas nas fotos.
				carvao: {
					100: "#E4E1DB",
					300: "#A79C89",
					500: "#6B6152",
					700: "#443D33",
					900: "#2E2A24",
					DEFAULT: "#2E2A24",
				},
				// Cor de acento — amostrada dos laços vermelhos (laco_linho_vermelho.jpg,
				// tres_tamanhos.jpg). Não estava na lista de exemplo do pedido, mas é o
				// tom mais saturado extraído do design DNA (papel de accent/CTA).
				vermelho: {
					50: "#F7E3E3",
					100: "#EFC2C3",
					300: "#D97376",
					500: "#B7272B",
					DEFAULT: "#B7272B",
					700: "#8A1D20",
					900: "#5C1315",
				},
			},
		},
	},
};
