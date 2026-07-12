import { supabase } from "@/shared/lib";
import type { Pauta, PautaInsert, PautaUpdate } from "../types";

const TABLE = "pautas";

export const pautasRepository = {
  async listByClient(clientId: string): Promise<Pauta[]> {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async createBatch(pautas: PautaInsert[]): Promise<Pauta[]> {
    const { data, error } = await supabase
      .from(TABLE)
      .insert(pautas)
      .select();

    if (error) throw error;
    return data;
  },

  async update(id: string, input: PautaUpdate): Promise<Pauta> {
    const { data, error } = await supabase
      .from(TABLE)
      .update(input)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
