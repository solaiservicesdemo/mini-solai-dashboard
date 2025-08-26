import { supabase, ClientProfile } from "./supabase";

export interface ClientOption {
  id: string;
  name: string;
  email: string;
  client_id: string;
}

/**
 * Fetch client profiles from Supabase (increased limit for better UX)
 */
export async function fetchClientProfiles(
  limit: number = 200,
): Promise<ClientOption[]> {
  try {
    const { data, error } = await supabase
      .from("client_profiles")
      .select("id, client_id, name, email")
      .not("name", "is", null)
      .not("email", "is", null)
      .order("name", { ascending: true })
      .limit(limit);

    if (error) {
      console.error("Error fetching client profiles:", error);
      throw error;
    }

    return (data || []).map((profile) => ({
      id: profile.id,
      name: profile.name!,
      email: profile.email!,
      client_id: profile.client_id,
    }));
  } catch (error) {
    console.error("Failed to fetch client profiles:", error);
    throw error;
  }
}

/**
 * Search client profiles by name
 */
export async function searchClientProfiles(
  query: string,
): Promise<ClientOption[]> {
  try {
    if (!query.trim()) {
      return await fetchClientProfiles(200); // Get more clients when no search
    }

    const { data, error } = await supabase
      .from("client_profiles")
      .select("id, client_id, name, email")
      .not("name", "is", null)
      .not("email", "is", null)
      .ilike("name", `%${query}%`)
      .order("name", { ascending: true })
      .limit(50);

    if (error) {
      console.error("Error searching client profiles:", error);
      throw error;
    }

    return (data || []).map((profile) => ({
      id: profile.id,
      name: profile.name!,
      email: profile.email!,
      client_id: profile.client_id,
    }));
  } catch (error) {
    console.error("Failed to search client profiles:", error);
    throw error;
  }
}

/**
 * Get a specific client profile by ID
 */
export async function getClientProfile(
  id: string,
): Promise<ClientOption | null> {
  try {
    const { data, error } = await supabase
      .from("client_profiles")
      .select("id, client_id, name, email")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching client profile:", error);
      throw error;
    }

    if (!data || !data.name || !data.email) {
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      client_id: data.client_id,
    };
  } catch (error) {
    console.error("Failed to fetch client profile:", error);
    return null;
  }
}
