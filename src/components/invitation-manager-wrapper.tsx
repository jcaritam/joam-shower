import { useState } from "react";
import InvitationManager from "../page/Invitation-manager";

export default function InvitationManagerWrapper() {
  const [email, setEmail] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const AUTHORIZED_EMAIL = 'mery.jka2@gmail.com';

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">

          <h2 className="text-2xl font-bold text-slate-800 mb-2">Acceso Restringido</h2>
          <p className="text-slate-500 mb-6">Ingresa tu correo para gestionar las invitaciones</p>
          <input
            type="email"
            placeholder="correo@ejemplo.com"
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl mb-4 focus:border-indigo-500 outline-none transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            onClick={() => email.toLowerCase().trim() === AUTHORIZED_EMAIL ? setIsAuthorized(true) : alert('No autorizado')}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition"
          >
            Entrar
          </button>
        </div>
      </div>
    );
  }

  return <InvitationManager />;
}