import { useEffect, useState } from 'react';
import { ArrowUp, Calendar } from 'lucide-react';
import { useLang } from '../i18n/useLang';
import { useContent } from '../content/useContent';
import { whatsappLink } from '../content/store';
import { getVenueStatus } from '../utils/hours';

export function FloatingDock({ onReserve }: { onReserve: () => void }) {
  const { t } = useLang();
  const { content } = useContent();
  const [open, setOpen] = useState(() => getVenueStatus(content.workingHours).isOpen);
  const [showTop, setShowTop] = useState(false);
  const phone = content.phoneRaw || content.whatsapp || content.phone;

  useEffect(() => {
    const tick = () => setOpen(getVenueStatus(content.workingHours).isOpen);
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, [content.workingHours]);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const iconBtn =
    'w-11 h-11 rounded-full shadow-lg flex items-center justify-center text-white text-[11px] font-bold shrink-0 pointer-events-auto';

  return (
    <div className="fixed z-40 flex flex-col items-center gap-2 right-2 min-[360px]:right-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))]">
      {showTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label={t('cta.backTop')}
          className={`${iconBtn} bg-[var(--studio-dark)] border border-white/20`}
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
      <a
        href={whatsappLink(phone, t('reserve.waText'))}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t('cta.whatsapp')}
        className={`${iconBtn} bg-[#25D366]`}
      >
        WA
      </a>
      <button
        type="button"
        onClick={onReserve}
        aria-label={t('cta.quickReserve')}
        title={open ? t('status.openTitle') : t('status.closedTitle')}
        className={`${iconBtn} bg-[var(--studio-terracotta)] relative`}
      >
        <span
          className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${
            open ? 'bg-emerald-500' : 'bg-stone-400'
          }`}
        />
        <Calendar className="w-5 h-5" />
      </button>
    </div>
  );
}
