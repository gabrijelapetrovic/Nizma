import { useLang } from '../i18n/useLang';
import { useContent } from '../content/useContent';
import { viberLink, whatsappLink } from '../content/store';
import { InstagramIcon } from './SocialIcons';
import { BUSINESS_INFO } from '../utils/constants';

type ChatReserveProps = {
  compact?: boolean;
  withInstagram?: boolean;
};

export function ChatReserve({ compact = false, withInstagram = false }: ChatReserveProps) {
  const { t } = useLang();
  const { content } = useContent();
  const phone = content.phoneRaw || content.whatsapp || content.phone;
  const wa = whatsappLink(phone);
  const vb = viberLink(phone);
  const igUrl = content.instagramUrl || BUSINESS_INFO.instagram.url;
  const igHandle = content.instagramHandle || BUSINESS_INFO.instagram.handle;

  const btn = compact
    ? 'px-3 py-2 text-xs rounded-full'
    : 'px-4 py-2.5 text-sm rounded-full';

  return (
    <div className={`flex flex-wrap items-center gap-2 ${compact ? '' : 'mt-4 justify-center'}`}>
      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        className={`${btn} bg-[#25D366] hover:bg-[#1ebe5a] text-white font-semibold inline-flex items-center gap-2`}
      >
        <span aria-hidden="true">●</span>
        {t('cta.whatsapp')}
      </a>
      <a
        href={vb}
        className={`${btn} bg-[#7360F2] hover:bg-[#5b4bd4] text-white font-semibold inline-flex items-center gap-2`}
      >
        <span aria-hidden="true">●</span>
        {t('cta.viber')}
      </a>
      {withInstagram && (
        <a
          href={igUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${btn} bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af] hover:opacity-90 text-white font-semibold inline-flex items-center gap-2`}
        >
          <InstagramIcon className="w-3.5 h-3.5" />
          <span>{t('cta.instagram')}</span>
          <span className="font-medium opacity-90">{igHandle}</span>
        </a>
      )}
    </div>
  );
}
