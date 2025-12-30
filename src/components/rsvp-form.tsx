import { Loader2, Search, UserCheck } from "lucide-react";
import { useInvitations } from "../hooks/invitations";
import type { IInvitations } from "../interfaces/invitations";
import GuestList from "./guest-list";
import { useState } from "react";

interface Props {
  invitation: IInvitations | null;
  handleSelectInvitation: (invitation: IInvitations) => void;
}

const RSVPform = ({ invitation, handleSelectInvitation }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: searchResults, mutateAsync, isPending } = useInvitations();

  if (invitation) {
    return <GuestList invitation={invitation} />;
  }

  const handleSearch = () => {
    if (searchTerm.trim()) {
      mutateAsync(searchTerm);
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-center text-slate-500 text-sm mb-4">
        Busca tu apellido o familia para confirmar tu asistencia:
      </p>
      
      <div className="relative flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            className="w-full pl-11 pr-4 py-4 border-2 border-primary/10 rounded-2xl focus:border-primary outline-none transition-all text-slate-700"
            placeholder="Ingrese nombres y/o apellidos"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={isPending || !searchTerm}
          className="bg-primary px-6 rounded-2xl text-white font-bold hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center min-w-[100px]"
        >
          {isPending ? <Loader2 className="animate-spin" size={20} /> : "Buscar"}
        </button>
      </div>

      {searchResults && searchResults.length > 0 && (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-4">
          <span className="text-xs font-bold text-slate-400 uppercase ml-2">Selecciona tu invitación:</span>
          {searchResults.map((guest) => (
            <button
              key={guest.id}
              onClick={() => handleSelectInvitation(guest)}
              className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-primary/5 border border-slate-100 hover:border-primary/20 rounded-2xl transition-all group"
            >
              <span className="font-bold text-slate-700 group-hover:text-primary">
                {guest.family_name}
              </span>
              <UserCheck size={18} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      )}

      {searchResults?.length === 0 && !isPending && (
        <p className="text-center text-red-400 text-sm italic">
          No encontramos ninguna invitación con ese nombre.
        </p>
      )}
    </div>
  )

};

export default RSVPform;
