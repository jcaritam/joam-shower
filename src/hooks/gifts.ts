import { unassignedGift } from './../services/gifts';
import { useMutation, useQuery } from "@tanstack/react-query"
import { assignGift, getGifts } from "../services/gifts"

export const useGifts = (section: string) => {
  const query = useQuery({
    queryKey: ['get-gifts', section],
    queryFn: () => getGifts(section)
  });

  return query;
}

export const useAssignedGifts = () => {
  return useMutation({
    mutationKey: ['assigned-gift'],
    mutationFn: ({ invitationId, giftId}: {invitationId: number, giftId: number}) => assignGift(invitationId, giftId)
  })
}

export const useUnassignedGift = () => {
  return useMutation({
    mutationKey: ['unassigned-gift'],
    mutationFn: ({ invitationId, giftId }: {invitationId: number, giftId: number}) => unassignedGift(invitationId, giftId)
  })
}