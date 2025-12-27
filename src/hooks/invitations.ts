import { useMutation } from "@tanstack/react-query"
import { getInvitations } from "../services/invitations";

export const useInvitations = () => {
  return useMutation({
    mutationKey: ['get-invitations'],
    mutationFn: getInvitations,
  });
}