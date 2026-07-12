import { supabase } from "@/shared/lib";
import type { Derivacao, DerivacaoInsert } from "../types";

const TABLE = "post_derivacoes";

export const derivacoesRepository = {
  async listByPost(postId: string): Promise<Derivacao[]> {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async create(input: DerivacaoInsert): Promise<Derivacao> {
    const { data, error } = await supabase
      .from(TABLE)
      .insert(input)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, conteudo: string): Promise<Derivacao> {
    const { data, error } = await supabase
      .from(TABLE)
      .update({ conteudo })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
