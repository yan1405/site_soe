// Estado do carrinho, 100% client-side, em localStorage — sem backend/banco.
// Ver CLAUDE.md, seção "Arquitetura confirmada".

const CHAVE_STORAGE = "soe-carrinho";
const EVENTO_ATUALIZACAO = "soe-carrinho-atualizado";

function lerItens() {
	if (typeof localStorage === "undefined") return [];
	try {
		const bruto = localStorage.getItem(CHAVE_STORAGE);
		return bruto ? JSON.parse(bruto) : [];
	} catch {
		return [];
	}
}

function salvarItens(itens) {
	localStorage.setItem(CHAVE_STORAGE, JSON.stringify(itens));
	window.dispatchEvent(new CustomEvent(EVENTO_ATUALIZACAO));
}

export function adicionarItem(slug, nome, preco, quantidade = 1) {
	const itens = lerItens();
	const existente = itens.find((item) => item.slug === slug);
	if (existente) {
		existente.quantidade += quantidade;
	} else {
		itens.push({ slug, nome, preco, quantidade });
	}
	salvarItens(itens);
}

export function removerItem(slug) {
	salvarItens(lerItens().filter((item) => item.slug !== slug));
}

export function listarItens() {
	return lerItens();
}

export function limparCarrinho() {
	salvarItens([]);
}

// Monta a mensagem de pedido pronta para virar link wa.me (o link em si é
// montado no CartDrawer, que também sabe o número da cliente).
export function gerarMensagemWhatsApp() {
	const itens = listarItens();
	if (itens.length === 0) {
		return "Olá! Gostaria de fazer um pedido.";
	}

	const linhas = itens.map(
		(item) =>
			`${item.quantidade}x ${item.nome} — R$ ${(item.preco * item.quantidade).toFixed(2)}`,
	);
	const total = itens.reduce((soma, item) => soma + item.preco * item.quantidade, 0);

	return [
		"Olá! Gostaria de fazer o seguinte pedido:",
		"",
		...linhas,
		"",
		`Total: R$ ${total.toFixed(2)}`,
	].join("\n");
}
