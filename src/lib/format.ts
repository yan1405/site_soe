// Formatação de preço em Real — Fase 9.6. Antes, `preco.toFixed(2)` produzia
// "R$ 34.90" (ponto), errado pro formato brasileiro. `Intl.NumberFormat`
// já inclui o "R$" — não concatenar de novo — e resolve separador de
// milhar de graça (R$ 1.234,56) se algum carrinho passar de R$ 1.000.
export function formatarPreco(valor: number): string {
	return new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	}).format(valor);
}
