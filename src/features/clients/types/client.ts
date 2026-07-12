/** Matches public.clients table exactly */
export interface Client {
  id: string;
  name: string;
  segment: string | null;
  instagram: string | null;
  site: string | null;
  whatsapp: string | null;
  logo_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/** Fields the user can set when creating a client */
export type ClientInsert = Pick<Client, "name"> &
  Partial<Pick<Client, "segment" | "instagram" | "site" | "whatsapp" | "logo_url">>;

/** Fields the user can update — optional fields can be set to null to clear them */
export type ClientUpdate = Partial<
  Pick<Client, "name" | "segment" | "instagram" | "site" | "whatsapp" | "logo_url" | "is_active">
>;
