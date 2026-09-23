import { LanguageToggle } from '../components/LanguageToggle';
import { useLang } from '../i18n/useLang';

export function LegalPage({ kind }: { kind: 'privacy' | 'terms' }) {
  const { t } = useLang();
  const prefix = kind === 'privacy' ? 'privacy' : 'terms';
  const paragraphs = [1, 2, 3, 4, 5, 6, 7].map((n) => `${prefix}.p${n}`);
  if (kind === 'privacy') paragraphs.push('privacy.p8');

  return (
    <main className="min-h-screen bg-[var(--studio-bg)] text-[var(--studio-text)] pt-28 pb-16">
      <article className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <a href="#" className="text-sm text-[var(--studio-terracotta)] font-semibold hover:underline">
            ← {t('legal.back')}
          </a>
          <LanguageToggle />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold mt-6 mb-2 text-[var(--studio-dark)]">
          {t(`${prefix}.title`)}
        </h1>
        <p className="text-xs text-[var(--studio-muted)] mb-8">{t(`${prefix}.updated`)}</p>
        <div className="space-y-4 text-sm sm:text-base leading-relaxed text-[var(--studio-muted)]">
          {paragraphs.map((key) => (
            <p key={key}>{t(key)}</p>
          ))}
        </div>
      </article>
    </main>
  );
}
