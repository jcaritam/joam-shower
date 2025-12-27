import {
  Calendar,
  MapPin,
  Gift,
  Sparkles,
  Moon,
  Star,
  CreditCard,
  Check,
  Copy,
  ExternalLink,
  Search,
} from "lucide-react";
import bgImage from "../assets/watercolor-baby-shower-bg.jpg";
import qrCodeImage from "../assets/qr.png";
import { GiftList } from "../components/gift-list";
import RSVPform from "../components/rsvp-form";
import { useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { getInvitations } from "../services/invitations";
import type { IInvitations } from "../interfaces/invitations";

const BabyShower = () => {
  const [searchParams] = useSearchParams();
  const [invitation, setInvitation] = useState<IInvitations | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const familyNameQuery = searchParams.get("family_name");

  useEffect(() => {
    if (!!familyNameQuery?.length) {
      onLoadInvitation();
    }
  }, [familyNameQuery]);

  const onLoadInvitation = async () => {
    if (!familyNameQuery) return;
    const data = await getInvitations(familyNameQuery);
    setInvitation(data[0]);
    localStorage.setItem("invitation", JSON.stringify(data[0]));
  };
  const handleSelectInvitation = (selected: IInvitations) => {
    setInvitation(selected);
    localStorage.setItem("invitation", JSON.stringify(selected));
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };
  const AccountItem = ({
    label,
    value,
    id,
  }: {
    label: string;
    value: string;
    id: string;
  }) => (
    <div className="relative group">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1 text-left ml-1">
        {label}
      </div>
      <div className="flex items-center justify-between p-3 bg-slate-50 border border-primary/5 rounded-xl font-mono text-sm group-hover:border-primary/20 transition-colors">
        <span className="truncate mr-2">{value}</span>
        <button
          onClick={() => copyToClipboard(value, id)}
          className="p-2 hover:bg-primary/10 rounded-lg text-primary transition-colors cursor-pointer"
          title="Copiar"
        >
          {copiedField === id ? (
            <Check size={16} className="text-green-600" />
          ) : (
            <Copy size={16} />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-background selection:bg-primary/20 font-sans">
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none h-32 overflow-hidden opacity-80">
        <div className="flex justify-center gap-1 -translate-y-2">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="w-12 h-16 bg-primary/20 border-x border-b border-primary/30 rounded-b-full shadow-sm"
              style={{
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                transform: `rotate(${Math.sin(i) * 5}deg)`,
                backgroundColor:
                  i % 3 === 0
                    ? "var(--primary)"
                    : i % 3 === 1
                    ? "var(--secondary)"
                    : "white",
                opacity: 0.6 + Math.random() * 0.4,
              }}
            />
          ))}
        </div>
        <div className="absolute top-0 left-0 right-0 h-px bg-primary/20" />
      </div>

      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={bgImage}
            alt="Background"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-background/10 to-background" />
        </div>

        <div className="container relative z-10 px-4 text-center">
          <div className="mb-8 relative inline-flex items-center justify-center">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
            <div className="relative w-24 h-24 bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-2xl flex items-center justify-center text-primary rotate-3 border border-primary/10">
              <Moon size={40} fill="currentColor" />
              <Star
                size={20}
                fill="currentColor"
                className="absolute -top-2 -right-2 animate-pulse text-accent-foreground"
              />
            </div>
          </div>

          <h1 className="text-balance text-6xl md:text-9xl font-serif font-black tracking-tighter text-foreground mb-6 leading-[0.9]">
            Baby Shower <br />
            <span className="text-primary italic font-light drop-shadow-sm">
              de Joam
            </span>
          </h1>
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-primary/10 rounded-full border border-primary/20 text-primary font-medium tracking-wide">
            <Sparkles size={16} />
            <span>CELEBRANDO UN NUEVO COMIENZO</span>
          </div>

          <div className="mt-16 flex flex-col md:flex-row items-center justify-center gap-10 md:gap-24">
            <div className="flex flex-col items-center">
              <span className="text-5xl font-serif font-black text-primary">
                03
              </span>
              <span className="text-xs uppercase tracking-[0.3em] font-bold text-muted-foreground mt-1">
                Enero 2026
              </span>
            </div>
            <div className="h-12 w-px bg-primary/20 hidden md:block" />
            <div className="flex flex-col items-center">
              <span className="text-5xl font-serif font-black text-primary">
                18:00
              </span>
              <span className="text-xs uppercase tracking-[0.3em] font-bold text-muted-foreground mt-1">
                Hora Mágica
              </span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-muted-foreground/60">
          <div className="w-px h-16 bg-gradient-to-b from-primary/50 to-transparent" />
        </div>
      </section>

      <section className="py-24 px-4 bg-white/50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            <div className="bg-white p-10 rounded-xl shadow-sm border border-primary/5 text-center">
              <Calendar className="text-primary w-10 h-10 mx-auto mb-4" />
              <h3 className="text-xl font-serif font-bold mb-2">La Cita</h3>
              <p className="text-muted-foreground">
                Sábado, 03 de Enero
                <br />
                18:00 a 22:00
              </p>
            </div>
            <a
              href="https://maps.app.goo.gl/E4oPAfhcHUTBwEDg7"
              target="_blank"
              className="group bg-white p-8 rounded-2xl shadow-sm border border-primary/10 text-center flex flex-col items-center justify-center transition-all active:scale-[0.97] active:bg-slate-50"
            >
              <MapPin className="text-primary w-10 h-10 mx-auto mb-4" />
              <h3 className="text-xl font-serif font-bold mb-2">El Lugar</h3>
              <p className="text-muted-foreground mb-4">
                Local Las nubes
                <br />
                Las nubes 102, Campo Marte - Paucarpata
              </p>
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest bg-primary/5 px-4 py-2 rounded-full border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all">
                Abrir Maps <ExternalLink size={14} />
              </div>
            </a>
            <a
              href="#gifts"
              className="bg-white p-10 rounded-xl shadow-sm border border-primary/5 text-center"
            >
              <Gift className="text-primary w-10 h-10 mx-auto mb-4" />
              <h3 className="text-xl font-serif font-bold mb-2">Regalos</h3>
              <p className="text-muted-foreground mb-4">
                Lluvia de sobres y<br />
                Mesa de regalos
              </p>
              <div className="text-primary font-bold text-xs uppercase tracking-widest bg-primary/5 px-4 py-2 rounded-full border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all">
                Ver Sugerencias
              </div>
            </a>
          </div>

          <div
            id="rsvp"
            className="max-w-xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="bg-primary p-12 text-center text-white">
              <h2 className="text-3xl font-serif font-bold mb-2">
                {invitation
                  ? `¡Hola Familia ${invitation.family_name}!`
                  : "Confirma tu asistencia"}
              </h2>
            </div>
            <div className="p-8">
              <RSVPform
                invitation={invitation}
                handleSelectInvitation={handleSelectInvitation}
              />
            </div>
          </div>
        </div>
      </section>

      <section
        id="gifts"
        className="py-16 px-4 bg-primary/5 min-h-[400px] flex items-center"
      >
        <div className="container mx-auto max-w-4xl">
          {invitation ? (
            <div className="animate-in fade-in zoom-in duration-700">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-serif font-black mb-3">
                  Sugerencias de Regalos
                </h2>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Elige un regalo de la lista para avisarnos y evitar que se
                  repitan.
                </p>
              </div>
              <div className="space-y-10">
                <GiftList invitation={invitation} />
                <div className="bg-white p-6 md:p-10 rounded-2xl border border-primary/10 text-center space-y-6 max-w-md mx-auto shadow-sm">
                  <CreditCard className="w-10 h-10 text-primary mx-auto mb-1" />
                  <h4 className="text-lg font-bold">Lluvia de Sobres</h4>
                  <p className="text-xs text-muted-foreground italic px-4">
                    Si prefieres hacernos un presente en efectivo:
                  </p>
                  <div className="space-y-3">
                    <AccountItem
                      label="Número de Cuenta"
                      value="21507948107086"
                      id="cuenta"
                    />
                    <AccountItem
                      label="CCI"
                      value="00221510794810708623"
                      id="cci"
                    />
                  </div>
                  <div className="flex items-center gap-4 py-2">
                    <div className="h-px bg-slate-100 flex-1" />
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
                      o vía QR
                    </span>
                    <div className="h-px bg-slate-100 flex-1" />
                  </div>
                  <div className="relative group mx-auto w-48 h-48">
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative bg-white p-3 rounded-2xl border-2 border-primary/5 transition-transform group-hover:scale-105">
                      <img
                        src={qrCodeImage}
                        alt="yape qr"
                        className="w-full h-full object-contain rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 px-6 border-2 border-dashed border-primary/20 rounded-[2.5rem] bg-white/50 max-w-md mx-auto">
              <Gift className="w-12 h-12 text-primary/30 mx-auto mb-4" />
              <h3 className="text-xl font-serif font-bold text-slate-800 mb-2">
                Mesa de Regalos
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                Para ver las sugerencias, primero necesitamos identificarte en
                la lista de invitados.
              </p>
              <a
                href="#rsvp"
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-all"
              >
                <Search size={16} /> Buscar mi invitación
              </a>
            </div>
          )}
        </div>
      </section>
      <footer className="py-12 text-center text-muted-foreground">
        <p className="font-serif italic text-2xl mb-4 text-primary">
          Te esperamos con amor
        </p>
        <p className="text-xs uppercase tracking-widest font-black mb-4">
          Familia Carita Huaman • 2026
        </p>
        <a
          href="www.linkedin.com/in/josephcarita"
          target="_blank"
          className="text-sm text-gray-500"
        >
          Powered by @jcaritam
        </a>
      </footer>
    </main>
  );
};

export default BabyShower;
