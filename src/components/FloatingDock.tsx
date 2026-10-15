import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { useLang } from '../i18n/useLang';
import { useContent } from '../content/useContent';
import { whatsappLink } from '../content/store';

export function FloatingDock() {
  const { t } = useLang();
  const { content } = useContent();
  const [showTop, setShowTop] = useState(false);
  const phone = content.phoneRaw || content.whatsapp || content.phone;

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
      {content.instagramUrl ? (
        <a
          href={content.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t('cta.instagram')}
          className={`${iconBtn} bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af]`}
        >
          IG
        </a>
      ) : null}
      <a
        href={whatsappLink(phone)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t('cta.whatsapp')}
        className={`${iconBtn} bg-[#25D366]`}
      >
        WA
      </a>
    </div>
  );
}
