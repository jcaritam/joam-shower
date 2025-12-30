

import { useState } from 'react'
import { useAssignedGifts, useGifts, useUnassignedGift } from '../hooks/gifts';
import { Check, ExternalLink, Heart, Info, Loader2, Users } from 'lucide-react';
import type { IInvitations } from '../interfaces/invitations';
import type { IGift } from '../interfaces/gift';
import { sections } from '../constants/section';

interface Props {
  invitation: IInvitations | null
}

export const GiftList = ({ invitation }: Props) => {
  const [selectedSectionTemp, setSelectedSectionTemp] = useState<string | null>(null);
  const { mutateAsync, isPending } = useAssignedGifts()
  const { mutateAsync: mutateAsyncUnassigned, isPending: isPendingUnassigned} = useUnassignedGift();
  const [selectedTemp, setSelectedTemp] = useState<IGift | null>(null)
  const { data, refetch } = useGifts(selectedSectionTemp ?? '');
  
  const handleAssign = async (gift: IGift) => {
    const isAssignedByMe = gift.assigned_gifts.some(g => g.invitation_id === invitation?.id);
    setSelectedTemp(gift);

    if (!invitation) return;

    if (isAssignedByMe){
      await mutateAsyncUnassigned({ invitationId: invitation.id!, giftId: gift.id }, {
        onSuccess: () => {
          refetch();
        }
      })
      return;
    }
    


    await mutateAsync({ invitationId: invitation.id!, giftId: gift.id }, {
      onSuccess: () => {
        refetch();
        setSelectedTemp(null);
      }
    });

  }

  return (
     <div className="space-y-6">
      <div className="space-y-4">
        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex gap-3 items-start">
          <Heart className="text-primary shrink-0 mt-0.5" size={18} />
          <p className="text-sm text-primary/80 leading-relaxed font-medium">
            "Hemos incluido algunos enlaces como referencia visual y de precios, pero siéntanse en total libertad de
            elegir la tienda o marca de su preferencia. ¡Lo más importante para nosotros es su compañía!"
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-secondary/30 border border-secondary/20 flex gap-3 items-start">
          <Info className="text-secondary-foreground shrink-0 mt-0.5" size={18} />
          <p className="text-sm text-secondary-foreground/80 leading-relaxed italic">
            <strong>Tip:</strong> "Si tienen duda con la talla, les sugerimos elegir Talla 2 o 4 (3 a 6 meses), ¡así
            nuestro bebé podrá lucir sus regalos por mucho más tiempo mientras crece!"
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 mb-6">
        <div className={`flex ${!selectedSectionTemp ? 'flex-col': 'flex-row'} gap-2 overflow-x-auto py-2 no-scrollbar -mx-1 px-1`}>
          {sections.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedSectionTemp(cat)
              }}
              className={`px-3.5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                selectedSectionTemp === cat
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white border border-primary/10 text-primary hover:bg-primary/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {
          isPending && (
            <div>
              <Loader2/>
            </div>
          )
        }
        
        { selectedSectionTemp && !isPending && data?.map((gift) => {
          const isAssignedByMe = gift.assigned_gifts.some(g => g.invitation_id === invitation?.id)
          const isFull = gift.assigned_gifts.length >= gift.max_quantity;
          return (
            <div
              key={gift.id}
              className={`group p-4 rounded-2xl border transition-all duration-300 flex flex-col ${
                isAssignedByMe
                  ? "bg-primary/5 border-primary shadow-sm"
                  : isFull ? "bg-gray-50 border-gray-200 opacity-60":"bg-white border-primary/10 hover:border-primary/30"
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="px-2 py-0.5 bg-secondary text-primary text-[9px] font-black rounded-full uppercase tracking-tight">
                  {gift.section}
                </span>
                <div className="flex items-center gap-1 px-2 py-0.5 bg-muted rounded-full text-[9px] font-black uppercase text-muted-foreground">
                  <Users size={10} />
                  {gift.assigned_gifts.length}
                </div>
              </div>

              <h4 className="text-base font-bold text-foreground mb-0.5 leading-tight">{gift.product_name}</h4>
              <p className="text-xs text-muted-foreground mb-4 line-clamp-2 flex-grow">{gift.description}</p>

              <div className="flex flex-col gap-2.5 mt-auto">
                {
                  gift.reference_link && (
                    <a
                      href={gift.reference_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline ml-1"
                    >
                      Ver referencia <ExternalLink size={12} />
                    </a>
                  )
                }

                <button
                  onClick={() => handleAssign(gift)}
                  disabled={(isFull && !isAssignedByMe) || (selectedTemp?.id === gift.id && (isPending || isPendingUnassigned))}
                  className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    isAssignedByMe
                      ? "bg-primary text-white shadow-md shadow-primary/10"
                      : isFull ? "bg-gray-200 text-gray-500 cursor-not-allowed": "bg-secondary text-primary hover:bg-primary/10"
                  }`}
                >
                  {isAssignedByMe ? (
                    <>
                      <Check size={16} /> Asignado
                    </>
                  ) : isFull ? (
                      "¡Completado!"
                  ) : (
                    "Yo lo llevo"
                  )}
                </button>
              </div>
            </div>
          )
        })}
      </div>


    </div>
  )
}
