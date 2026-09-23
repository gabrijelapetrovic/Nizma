import { useEffect, useState } from 'react';
import { useLang } from '../i18n/useLang';
import { useContent } from '../content/useContent';
import { getVenueStatus } from '../utils/hours';

export function OpenNowBadge() {
  const { t } = useLang();
  const { content } = useContent();
  const [isOpenNow, setIsOpenNow] = useState(() => getVenueStatus(content.workingHours).isOpen);

  useEffect(() => {
    const check = () => setIsOpenNow(getVenueStatus(content.workingHours).isOpen);
    check();
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, [content.workingHours]);

  return (
    <div
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium border shadow-sm ${
        isOpenNow
          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
          : 'bg-white text-stone-600 border-stone-200'
      }`}
      title={isOpenNow ? t('status.openTitle') : t('status.closedTitle')}
    >
      <span className={`w-2 h-2 rounded-full ${isOpenNow ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'}`} />
      <span>{isOpenNow ? t('status.open') : t('status.closed')}</span>
    </div>
  );
}
