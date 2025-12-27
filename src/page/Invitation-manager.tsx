import React, { useEffect, useState } from 'react';
import { apiClient } from '../services/api';
import type { IInvitations } from "../interfaces/invitations";
import { Plus, Save, Search, Trash2, UserPlus } from 'lucide-react';
import type { IMember } from '../interfaces/member';


export default function InvitationManager() {
  const [invitations, setInvitations] = useState<IInvitations[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchInvitations = async () => {
    setLoading(true);
    try {
      const query = apiClient
        .from('invitations')
        .select('*, members(*)')
        .order('created_at', { ascending: false });

      const { data, error } = searchTerm 
        ? await query.ilike('family_name', `%${searchTerm}%`)
        : await query;

      if (error) {
        console.error('Error fetching invitations:', error);
      } else if (data) {
        setInvitations(data as IInvitations[]);
      }
    } catch (err) {
      console.error('Error fetching invitations:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchInvitations();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const addNewCard = () => {
    const newRow: IInvitations = {
      family_name: '',
      family_name_snake_case: '',
      custom_message: '',
      members: []
    };
    setInvitations([newRow, ...invitations]);
  };

  const handleSave = async (inv: IInvitations, members: IMember[]) => {
    try {

      if (!inv.family_name.trim()) {
        alert("⚠️ El nombre de la familia es requerido");
        return;
      }

    
      const invitationData: any = {
        family_name: inv.family_name.trim(),
        family_name_snake_case: inv.family_name_snake_case,
        custom_message: inv.custom_message || ''
      };

      if (inv.id) {
        invitationData.id = inv.id;
      }

      const { data: savedInv, error: invErr } = await apiClient
        .from('invitations')
        .upsert(invitationData)
        .select()
        .single();

      if (invErr) {
        console.error('Error al guardar invitación:', invErr);
        alert("❌ Error al guardar familia: " + invErr.message);
        return;
      }

      if (!savedInv) {
        alert("❌ Error: No se pudo guardar la invitación");
        return;
      }

      const validMembers = members.filter(m => m.name.trim() !== '');
      
      if (validMembers.length > 0) {
        const membersToSave = validMembers.map(m => {
          const memberData: any = {
            name: m.name.trim(),
            is_attending: m.is_attending,
            is_child: m.is_child,
            invitation_id: savedInv.id
          };
  
          if (m.id) {
            memberData.id = m.id;
          }
          
          return memberData;
        });

        const { error: membersErr } = await apiClient
          .from('members')
          .upsert(membersToSave);

        if (membersErr) {
          console.error('Error al guardar miembros:', membersErr);
          alert("⚠️ Familia guardada pero hubo un error con los miembros: " + membersErr.message);
          return;
        }
      }

      alert("✅ Guardado exitoso");
      fetchInvitations();
    } catch (err: any) {
      console.error('Error inesperado:', err);
      alert("❌ Error inesperado: " + (err.message || 'Desconocido'));
    }
  };

  const handleDeleteInv = async (id?: number) => {
    if (!id) {

      fetchInvitations();
      return;
    }
    
    if (window.confirm("⚠️ ¿Eliminar familia y todos sus miembros?")) {
      try {
        const { error: membersErr } = await apiClient
          .from('members')
          .delete()
          .eq('invitation_id', id);

        if (membersErr) {
          console.error('Error al eliminar miembros:', membersErr);
        }


        const { error: invErr } = await apiClient
          .from('invitations')
          .delete()
          .eq('id', id);

        if (invErr) {
          console.error('Error al eliminar invitación:', invErr);
          alert("❌ Error al eliminar: " + invErr.message);
          return;
        }

        alert("✅ Eliminado correctamente");
        fetchInvitations();
      } catch (err: any) {
        console.error('Error al eliminar:', err);
        alert("❌ Error: " + (err.message || 'Desconocido'));
      }
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-black text-slate-800 mb-4 flex items-center gap-3">
            <span className="text-4xl">🎉</span>
            GUEST MANAGER
          </h1>
          
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nombre de familia..."
                className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none transition"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={addNewCard}
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition flex items-center gap-2 shadow-lg shadow-indigo-500/30"
            >
              <Plus className="w-5 h-5" />
              Nueva Familia
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12 text-slate-400">
              Cargando invitaciones...
            </div>
          ) : invitations.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              No hay invitaciones. ¡Crea una nueva!
            </div>
          ) : (
            invitations.map((inv, idx) => (
              <InvitationCard
                key={inv.id || `new-${idx}`}
                invitation={inv}
                onSave={handleSave}
                onDelete={handleDeleteInv}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

interface InvitationCardProps {
  invitation: IInvitations;
  onSave: (inv: IInvitations, members: IMember[]) => void;
  onDelete: (id?: number) => void;
}

const InvitationCard: React.FC<InvitationCardProps> = ({ invitation, onSave, onDelete }) => {
  const [localInv, setLocalInv] = useState<IInvitations>({ ...invitation });
  const [localMembers, setLocalMembers] = useState<IMember[]>(invitation.members || []);

  const handleTitleChange = (val: string) => {
    const snake = val
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
    
    setLocalInv({
      ...localInv,
      family_name: val,
      family_name_snake_case: snake
    });
  };

  const addMemberRow = () => {
    setLocalMembers([
      ...localMembers,
      { name: '', is_attending: false, is_child: false }
    ]);
  };

  const updateMemberRow = (idx: number, field: keyof IMember, val: any) => {
    const update = [...localMembers];
    update[idx] = { ...update[idx], [field]: val };
    setLocalMembers(update);
  };

  const removeMemberRow = async (idx: number) => {
    const member = localMembers[idx];
  
    if (member.id) {
      if (window.confirm("¿Eliminar este miembro de la base de datos?")) {
        try {
          await apiClient.from('members').delete().eq('id', member.id);
          setLocalMembers(localMembers.filter((_, i) => i !== idx));
        } catch (err) {
          console.error('Error al eliminar miembro:', err);
        }
      }
    } else {
      setLocalMembers(localMembers.filter((_, i) => i !== idx));
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-slate-100 hover:border-indigo-200 transition">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-5 flex items-center justify-between">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Nombre de la familia"
            className="w-full bg-white/20 text-white placeholder-white/60 px-4 py-2 rounded-lg font-bold text-xl outline-none focus:bg-white/30 transition"
            value={localInv.family_name}
            onChange={(e) => handleTitleChange(e.target.value)}
          />
          <div className="text-white/80 text-xs mt-2 font-mono">
            SLUG: {localInv.family_name_snake_case || 'esperando_nombre...'}
          </div>
        </div>
        <button
          onClick={() => onDelete(localInv.id)}
          className="ml-4 text-white/80 hover:text-white p-2 hover:bg-white/20 rounded-lg transition"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>


      <div className="p-6 space-y-5">

        <div className='hidden'>
          <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">
            Mensaje Personalizado
          </label>
          <textarea
            rows={3}
            placeholder="Escribe un mensaje especial para esta familia..."
            className="w-full border-2 border-slate-200 rounded-lg p-3 text-sm focus:border-indigo-500 focus:outline-none transition resize-none"
            value={localInv.custom_message}
            onChange={(e) => setLocalInv({ ...localInv, custom_message: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 mb-3 uppercase tracking-wide">
            Miembros de la Familia ({localMembers.length})
          </label>
          <div className="space-y-2">
            {localMembers.map((m, i) => (
              <div key={i} className="flex items-center gap-2 bg-slate-50 p-3 rounded-lg border-2 border-slate-100 hover:border-slate-200 transition">
                <input
                  className="flex-1 bg-transparent text-sm outline-none font-medium"
                  value={m.name}
                  placeholder="Nombre del invitado"
                  onChange={(e) => updateMemberRow(i, 'name', e.target.value)}
                />
                <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase cursor-pointer">
                  <input
                    type="checkbox"
                    checked={m.is_child ?? false}
                    onChange={(e) => updateMemberRow(i, 'is_child', e.target.checked)}
                    className="w-4 h-4 accent-indigo-600"
                  />
                  Niño
                </label>
                <button
                  onClick={() => removeMemberRow(i)}
                  className="text-slate-400 hover:text-red-500 font-bold px-2 py-1 hover:bg-red-50 rounded transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {localMembers.length === 0 && (
              <div className="text-center py-8 text-slate-400 text-sm">
                No hay miembros. Agrega el primero ↓
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center border-t-2 border-slate-100 pt-5">
          <button
            onClick={addMemberRow}
            className="text-indigo-600 text-sm font-bold hover:text-indigo-800 flex items-center gap-2 hover:bg-indigo-50 px-4 py-2 rounded-lg transition"
          >
            <UserPlus className="w-4 h-4" />
            AGREGAR MIEMBRO
          </button>
          <button
            onClick={() => onSave(localInv, localMembers)}
            className="bg-slate-900 text-white px-6 py-3 rounded-lg text-xs font-black hover:bg-black transition shadow-lg flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            GUARDAR CAMBIOS
          </button>
        </div>
      </div>
    </div>
  );
};