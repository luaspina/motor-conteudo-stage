import { supabase } from "@/shared/lib";
import type { Client, ClientInsert, ClientUpdate } from "../types";

const TABLE = "clients";

export const clientsRepository = {
  async list(): Promise<Client[]> {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .order("name");

    if (error) throw error;
    return data;
  },

  async getById(id: string): Promise<Client> {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(input: ClientInsert): Promise<Client> {
    const { data, error } = await supabase
      .from(TABLE)
      .insert(input)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, input: ClientUpdate): Promise<Client> {
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
