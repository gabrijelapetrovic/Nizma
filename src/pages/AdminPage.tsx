import { lazy, Suspense, useState, type FormEvent } from 'react';
import { LanguageToggle } from '../components/LanguageToggle';
import { useLang } from '../i18n/useLang';
import {
  clearAdminSession,
  clearLockout,
  hasValidAdminSession,
  isLockedOut,
  isSafeAdminPin,
  recordFailedPin,
  startAdminSession,
  verifyAdminPin,
} from '../utils/adminAuth';

const AdminEditor = lazy(() => import('./AdminEditor'));

export default function AdminPage() {
  const { t } = useLang();
  const [unlocked, setUnlocked] = useState(() => hasValidAdminSession());
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const unlock = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    if (isLockedOut()) {
      setError(t('admin.locked'));
      return;
    }
    setBusy(true);
    await new Promise((resolve) => setTimeout(resolve, 120));
    if (!isSafeAdminPin(pin)) {
      setBusy(false);
      const left = recordFailedPin();
      setError(left <= 0 ? t('admin.locked') : t('admin.xss'));
      return;
    }
    const ok = await verifyAdminPin(pin);
    setBusy(false);
    if (ok) {
      clearLockout();
      startAdminSession();
      setUnlocked(true);
      setPin('');
      setError(null);
      return;
    }
    const left = recordFailedPin();
    setError(left <= 0 ? t('admin.locked') : `${t('admin.wrong')} (${left})`);
  };

  if (!unlocked) {
    return (
      <main className="min-h-screen bg-[var(--studio-sand)] pt-28 pb-16 px-4">
        <form onSubmit={unlock} className="max-w-sm mx-auto bg-white rounded-3xl p-8 border border-[var(--studio-border)] shadow-sm">
          <div className="flex justify-end mb-4">
            <LanguageToggle />
          </div>
          <h1 className="font-serif text-2xl font-bold text-[var(--studio-dark)] mb-2">{t('admin.title')}</h1>
          <p className="text-sm text-[var(--studio-muted)] mb-6">{t('admin.lead')}</p>
          <label className="block text-xs font-bold uppercase mb-2" htmlFor="admin-pin">
            {t('admin.pin')}
          </label>
          <input
            id="admin-pin"
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value.slice(0, 64))}
            className="w-full px-4 py-3 rounded-xl border border-[var(--studio-border)] mb-4"
            autoComplete="current-password"
            spellCheck={false}
          />
          {error && <p className="text-red-600 text-xs mb-3">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full py-3 rounded-full bg-[var(--studio-terracotta)] text-white font-semibold disabled:opacity-60"
          >
            {t('admin.enter')}
          </button>
          <a href="#" className="block text-center text-sm mt-4 text-[var(--studio-terracotta)]">
            {t('legal.back')}
          </a>
        </form>
      </main>
    );
  }

  return (
    <Suspense fallback={null}>
      <AdminEditor
        onLogout={() => {
          clearAdminSession();
          setUnlocked(false);
        }}
      />
    </Suspense>
  );
}
