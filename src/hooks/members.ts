import { useMutation, useQuery } from "@tanstack/react-query"
import { getMembersById, updateMember } from "../services/members";

export const useMembers = (invitationId?: number) => {
  return useQuery({
    queryKey: ['get-member-by-id'],
    queryFn: () => getMembersById(invitationId!),
    enabled: !!invitationId
  });
}

export const useUpdateMember = () => {
  return useMutation({
    mutationKey: ['update-member'],
    mutationFn: ({ memberId, isAttending}:{memberId: number, isAttending: boolean}) => updateMember(memberId, isAttending)
  })
}