// Constantes de identidade/contato da SOE Acessórios, usadas em todo o site.
//
// Remodelagem 2026-08-10: por pedido explícito do Yan ("ao final da
// reconstrução não quero que tenha nenhum placeholder, nas áreas onde ele
// estão hoje coloque valores fictícios"), os placeholders em colchetes
// ([CNPJ/MEI — PENDENTE], [ENDEREÇO — PENDENTE], [E-MAIL_PENDENTE],
// [CIDADE/UF — PENDENTE], [PRAZO_PENDENTE]) que apareciam crus no Footer e
// nas páginas institucionais foram substituídos pelos valores FICTÍCIOS
// abaixo — nenhum é um dado real da cliente. Endereço/foro usam
// Florianópolis/SC porque é a cidade que o próprio handle do Instagram já
// declara (@soefloripa) — é a única inferência de localização com alguma
// base real; todo o resto (número da rua, CEP, CNPJ, e-mail) é
// inteiramente inventado para preview, não pesquisado nem verificado.
//
// TROCAR TODOS OS VALORES ABAIXO por dados reais confirmados pela cliente
// antes do lançamento — ver CLAUDE.md, tabela "Placeholders obrigatórios".

// Número do WhatsApp — formato válido de DDD+celular brasileiro, mas
// inexistente de propósito (terminação "900000000"). Ver CLAUDE.md.
export const NUMERO_WHATSAPP_PENDENTE = "5511900000000";

// CNPJ fictício em formato de MEI (não corresponde a nenhuma empresa real —
// não validado contra dígito verificador, é só um formato plausível para a
// UI parar de mostrar texto de placeholder cru).
export const CNPJ_FICTICIO = "48.163.905/0001-27 (MEI, fictício)";

export const ENDERECO_FICTICIO = "Rua das Orquídeas, 245, Trindade, Florianópolis/SC, CEP 88036-000";

export const CIDADE_UF_FICTICIA = "Florianópolis/SC";

export const EMAIL_FICTICIO = "contato@soeacessorios.com.br";

// Prazo de reembolso após confirmação da devolução — valor fictício comum
// de mercado (10 dias úteis), não confirmado pela cliente.
export const PRAZO_REEMBOLSO_DIAS_FICTICIO = "10 (dez) dias úteis";
