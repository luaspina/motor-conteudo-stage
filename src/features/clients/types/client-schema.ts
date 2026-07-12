import { z } from "zod";

export const clientFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(200, "Nome muito longo"),
  segment: z.string().max(300, "Segmento muito longo"),
  instagram: z.string().max(100),
  site: z.string().max(300),
  whatsapp: z.string().max(30),
});

export type ClientFormValues = z.infer<typeof clientFormSchema>;

/** Converts empty strings to null before sending to the repository.
 *  undefined = "don't touch this column" in Supabase JS.
 *  null      = "set this column to NULL" in Supabase JS.
 *  For optional fields that the user may want to clear, null is correct.
 */
export function cleanFormValues(values: ClientFormValues) {
  return {
    name: values.name,
    segment: values.segment || null,
    instagram: values.instagram || null,
    site: values.site || null,
    whatsapp: values.whatsapp || null,
  };
}
