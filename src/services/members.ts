import type { IMember } from "../interfaces/member";
import { apiClient } from "./api"

export const getMembersById = async (invitationId: number): Promise<IMember[]> => {
  const { data, error } = await apiClient.from('members').select('*').eq('invitation_id', invitationId);

  if (error) {
    return []
  }

  return data;
}

export const updateMember = async (memberId: number, isAttending: boolean) => {

  const { data, error} = await apiClient.from('members')
    .update({ is_attending: isAttending })
    .eq('id', memberId)
    .select()

  if (error) {
    throw new Error('nose pudo actualizar ')
  }
  return data;
}
