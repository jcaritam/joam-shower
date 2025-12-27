import type { IInvitations } from "../interfaces/invitations";
import { useMembers, useUpdateMember } from "../hooks/members";
import { Check, CheckCircle2, Loader2 } from "lucide-react";
import type { IMember } from "../interfaces/member";
import { useState } from "react";

interface Props {
  invitation: IInvitations | null;
}
const GuestList = ({ invitation }: Props) => {
  const { data, refetch } = useMembers(invitation?.id);
  const [selectedTempMember, setSelectedTempMember] = useState<IMember | null>(
    null
  );
  const { mutateAsync, isPending } = useUpdateMember();

  if (!invitation) return;

  const handleConfirmMember = (member: IMember) => {
    setSelectedTempMember(member);
    mutateAsync({
      memberId: member.id,
      isAttending: !member.is_attending
    }, {
      onSuccess: () => {
        setSelectedTempMember(null);
        refetch();
      },
    });
  };

  const countAttending = data?.filter(v => v.is_attending);
  const sortedMembers = data ? [...data].sort((a, b) => Number(a.id) - Number(b.id)) : [];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 relative overflow-hidden text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-primary/20 rounded-full" />
        <p className="text-xs uppercase font-black text-primary/60 mb-2 tracking-[0.2em]">
          Invitación para:
        </p>
        <h4 className="text-2xl font-serif font-black text-slate-800 mb-1">
          Familia - {invitation.family_name}
        </h4>
        <p className="text-slate-500 text-sm">
          {countAttending?.length} confirmados
        </p>
      </div>

      {!!data?.length && data.length >= 2 ? (
        <div className="space-y-3">
          <p className="text-sm font-bold text-slate-400 px-2 uppercase tracking-tight">
            Confirma quiénes asistirán:
          </p>

          {sortedMembers.map((member) => {
            return (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm"
              >
                <span
                  className={`font-medium ${
                    member.is_attending
                      ? "text-slate-400 line-through"
                      : "text-slate-700"
                  }`}
                >
                  {member.name}
                </span>
                <button
                  onClick={() => handleConfirmMember(member)}
                  className={`px-4 py-2 rounded-xl text-sm cursor-pointer font-bold transition-all flex items-center gap-2 ${
                    member.is_attending
                      ? "bg-green-50 text-green-600 border border-green-100"
                      : "bg-primary text-white shadow-md active:scale-95"
                  }`}
                >
                  {isPending && selectedTempMember?.id === member.id ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : member.is_attending ? (
                    <>
                      <Check size={16} /> Confirmado
                    </>
                  ) : (
                    "Confirmar"
                  )}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div>
          <div className="pt-2">
            <button
              onClick={() => handleConfirmMember(data?.[0]!)}
              disabled={!!isPending}
              className="w-full py-5 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-lg"
            >
              {isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <CheckCircle2 size={24} /> Confirmar mi asistencia
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuestList;
