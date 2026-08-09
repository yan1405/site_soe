import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const produtos = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/produtos" }),
	schema: z.object({
		nome: z.string(),
		descricaoCurta: z.string(),
		// Valor exato em reais, sem arredondamento (ex: 49.9, não "49,90" truncado).
		preco: z.number(),
		// Paths para arquivos em src/assets/produtos/.
		imagens: z.array(z.string()),
		// true = também aparece na seção "Carros-chefe" da home; false = só em /catalogo.
		destaqueHome: z.boolean(),
		// Controlado pela cliente via Decap CMS.
		disponivel: z.boolean(),
	}),
});

export const collections = { produtos };
