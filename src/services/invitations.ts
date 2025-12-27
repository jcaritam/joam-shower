import type { IInvitations } from "../interfaces/invitations";
import { apiClient } from "./api"

export const getInvitations = async (term: string): Promise<IInvitations[]> => {
  const { data, error } = await apiClient.from('invitations').select('*').ilike('family_name_snake_case',`%${term}%`);

  if (error) {
    return []
  }

  return data;
}