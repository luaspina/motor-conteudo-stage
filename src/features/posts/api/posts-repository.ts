import { supabase } from "@/shared/lib";
import type { Post, PostInsert, PostUpdate } from "../types";

const TABLE = "posts";

export const postsRepository = {
  async listByClient(clientId: string): Promise<Post[]> {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async getById(id: string): Promise<Post> {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(input: PostInsert): Promise<Post> {
    const { data, error } = await supabase
      .from(TABLE)
      .insert(input)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, input: PostUpdate): Promise<Post> {
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
