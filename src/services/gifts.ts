import type { IGift } from "../interfaces/gift";
import { apiClient } from "./api"

export const getGifts = async (section: string): Promise<IGift[]> => {
  const { data, error } = await apiClient
    .from('gifts')
    .select(`
      *,
      assigned_gifts (
        id,
        invitation_id,
        gift_id
      )
    `)
    .ilike('section',`%${section}%`);

  if (error) {
    console.error("Error fetching gifts:", error.message);
    return [];
  }
  console.log({ data })
  return data;
};

export const assignGift = async (invitationId: number, giftId: number) => {
  const { data, error } = await apiClient.from('assigned_gifts')
    .insert([
      { invitation_id: invitationId, gift_id: giftId,  }
    ])
    .select()


  if (error) {
    throw new Error('no se pudo assignar');
  }

  return data
}

export const unassignedGift = async (invitationId: number, giftId: number) => {
  const { data, error } = await apiClient.from('assigned_gifts')
    .delete()
    .eq('invitation_id', invitationId)
    .eq('gift_id', giftId);


  if (error) {
    throw new Error('no se pudo assignar');
  }

  return data

}