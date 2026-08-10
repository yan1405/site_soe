// Consentimento de cookies — ver CLAUDE.md ("Analytics: GA4/Meta Pixel só
// disparam depois do consentimento no banner de cookies — nunca automático
// no carregamento") e /institucional/privacidade (seção "Cookies").
//
// Categorias: "essenciais" (sempre ativo, não editável), "analise", "marketing".
// Nenhum script real de GA4/Meta Pixel existe neste projeto ainda — este
// módulo é o mecanismo de consentimento em si; quando um script de analytics
// for adicionado, ele deve checar temConsentimento("analise"/"marketing")
// antes de se injetar, ou escutar o evento "soe-consentimento-atualizado".

export interface ConsentimentoCookies {
	essenciais: true;
	analise: boolean;
	marketing: boolean;
	decididoEm: string;
}

type CategoriaCookie = keyof Pick<ConsentimentoCookies, "essenciais" | "analise" | "marketing">;

const CHAVE_STORAGE = "soe-consentimento-cookies";

export function lerConsentimento(): ConsentimentoCookies | null {
	if (typeof localStorage === "undefined") return null;
	try {
		const bruto = localStorage.getItem(CHAVE_STORAGE);
		return bruto ? (JSON.parse(bruto) as ConsentimentoCookies) : null;
	} catch {
		return null;
	}
}

export function salvarConsentimento(preferencias: {
	analise?: boolean;
	marketing?: boolean;
}): ConsentimentoCookies {
	const registro: ConsentimentoCookies = {
		essenciais: true,
		analise: Boolean(preferencias.analise),
		marketing: Boolean(preferencias.marketing),
		decididoEm: new Date().toISOString(),
	};
	localStorage.setItem(CHAVE_STORAGE, JSON.stringify(registro));
	window.dispatchEvent(new CustomEvent("soe-consentimento-atualizado", { detail: registro }));
	return registro;
}

// Categoria "essenciais" é sempre true — não depende de decisão do usuário.
export function temConsentimento(categoria: CategoriaCookie): boolean {
	if (categoria === "essenciais") return true;
	return Boolean(lerConsentimento()?.[categoria]);
}
