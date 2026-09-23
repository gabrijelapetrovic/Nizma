import { useEffect, useState } from 'react';
import { LanguageToggle } from '../components/LanguageToggle';
import { useLang } from '../i18n/useLang';
import { useContent } from '../content/useContent';
import { formatHoursLabel } from '../utils/hours';
import { defaultSiteContent, fetchPublishedContent, parseStoredContent, type SiteContent } from '../content/store';
import { startAdminSession } from '../utils/adminAuth';
import { publishToGit } from '../content/publish';
import { MENU_CATEGORIES } from '../utils/constants';
import { AdminImageField } from './AdminImageField';
import { AdminThemeTab } from './AdminThemeTab';
import { applySiteTheme, defaultSiteTheme, themeContrastIssues } from '../content/theme';

type Tab = 'info' | 'hours' | 'theme' | 'photos' | 'menu' | 'events' | 'gallery' | 'reviews';

const field = 'w-full px-3 py-2 rounded-xl border border-[var(--studio-border)]';
const iconBtn =
  'w-9 h-9 rounded-full border border-[var(--studio-border)] bg-white text-lg font-semibold leading-none text-[var(--studio-dark)]';

function newRowId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export default function AdminEditor({ onLogout }: { onLogout: () => void }) {
  const { t } = useLang();
  const { content, saveContent, resetContent } = useContent();
  const [draft, setDraft] = useState<SiteContent>(content);
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState<Tab>('info');
  const [publishPin, setPublishPin] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [publishNote, setPublishNote] = useState<string | null>(null);

  const [more, setMore] = useState(false);

  const prepared = (): SiteContent => ({
    ...draft,
    phoneRaw: draft.whatsapp.startsWith('381') ? `+${draft.whatsapp}` : draft.phoneRaw,
    theme: draft.theme || defaultSiteTheme(),
  });

  useEffect(() => {
    applySiteTheme(draft.theme || defaultSiteTheme());
    return () => applySiteTheme(content.theme);
  }, [draft.theme, content.theme]);

  const saveLocal = () => {
    const next = prepared();
    if (themeContrastIssues(next.theme.colors).length) {
      setPublishNote(t('admin.themeContrastFail'));
      return;
    }
    saveContent(next);
    startAdminSession();
    setSaved(true);
    setPublishNote(null);
  };

  const publishLive = async () => {
    const next = prepared();
    if (themeContrastIssues(next.theme.colors).length) {
      setPublishNote(t('admin.themeContrastFail'));
      return;
    }
    saveContent(next);
    setPublishing(true);
    setPublishNote(null);
    const result = await publishToGit(publishPin, next, (done, total) => {
      setPublishNote(`${t('admin.publishingPhotos')} ${done}/${total}`);
    });
    setPublishing(false);
    if (result.ok) {
      setPublishPin('');
      setDraft(result.content);
      saveContent(result.content);
      setPublishNote(t('admin.published'));
      return;
    }
    const map: Record<string, string> = {
      github_not_configured: t('admin.publishNeedGit'),
      pin: t('admin.wrong'),
      missing_photo: t('admin.missingPhoto'),
      photo_name: t('admin.missingPhoto'),
      photo_upload: t('admin.publishFail'),
    };
    setPublishNote(map[result.error] || t('admin.publishFail'));
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sadrzaj-sajta.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJson = async (file: File) => {
    setDraft(parseStoredContent(await file.text()));
  };

  const restoreOriginal = async () => {
    resetContent();
    setDraft(defaultSiteContent());
    setSaved(false);
    setPublishNote(null);
    setDraft(await fetchPublishedContent());
  };

  const ghostBtn =
    'px-3 py-1.5 rounded-lg text-sm font-medium text-[var(--studio-muted)] hover:text-[var(--studio-dark)] hover:bg-white transition-colors';

  const tabs: { id: Tab; label: string }[] = [
    { id: 'info', label: t('admin.contact') },
    { id: 'hours', label: t('admin.hours') },
    { id: 'theme', label: t('admin.theme') },
    { id: 'photos', label: t('admin.photos') },
    { id: 'menu', label: t('admin.menu') },
    { id: 'events', label: t('admin.events') },
    { id: 'gallery', label: t('admin.gallery') },
    { id: 'reviews', label: t('admin.reviews') },
  ];

  return (
    <main className="min-h-screen bg-[var(--studio-sand)] pt-20 px-4 pb-28 sm:pb-24 overflow-x-hidden touch-pan-y">
      <div className="max-w-3xl mx-auto space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--studio-dark)]">{t('admin.title')}</h1>
            <p className="text-sm font-medium text-[var(--studio-dark)] mt-1">{t('admin.lead')}</p>
            <p className="text-xs text-[var(--studio-muted)] mt-2 whitespace-pre-line leading-relaxed">{t('admin.publishHint')}</p>
          </div>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <a href="#" className="text-sm font-semibold text-[var(--studio-terracotta)]">
              {t('legal.back')}
            </a>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto overflow-y-hidden overscroll-x-contain touch-pan-x pb-1 -mx-1 px-1 max-w-full">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold ${
                tab === item.id
                  ? 'bg-[var(--studio-terracotta)] text-white'
                  : 'bg-white border border-[var(--studio-border)] text-[var(--studio-text)]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {tab === 'info' && (
          <div className="space-y-6">
            <section className="bg-white rounded-3xl p-5 sm:p-6 border border-[var(--studio-border)] space-y-3">
              <h2 className="font-serif font-bold text-lg">{t('admin.copy')}</h2>
              <label className="block text-xs font-semibold">{t('admin.name')}</label>
              <input className={field} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
              <label className="block text-xs font-semibold">{t('admin.tagline')}</label>
              <input className={field} value={draft.tagline} onChange={(e) => setDraft({ ...draft, tagline: e.target.value })} />
              <label className="block text-xs font-semibold">{t('admin.description')}</label>
              <textarea
                rows={3}
                className={field}
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              />
            </section>
            <section className="bg-white rounded-3xl p-5 sm:p-6 border border-[var(--studio-border)] space-y-3">
              <h2 className="font-serif font-bold text-lg">{t('admin.contact')}</h2>
              <label className="block text-xs font-semibold">{t('reserve.phone')}</label>
              <input className={field} value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} />
              <label className="block text-xs font-semibold">{t('admin.whatsapp')}</label>
              <input
                className={field}
                value={draft.whatsapp}
                onChange={(e) => setDraft({ ...draft, whatsapp: e.target.value.replace(/\D/g, '') })}
              />
              <label className="block text-xs font-semibold">{t('reserve.email')}</label>
              <input className={field} value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
              <label className="block text-xs font-semibold">{t('contact.address')}</label>
              <input className={field} value={draft.addressFull} onChange={(e) => setDraft({ ...draft, addressFull: e.target.value })} />
              <label className="block text-xs font-semibold">{t('cta.instagram')}</label>
              <input className={field} value={draft.instagramHandle} onChange={(e) => setDraft({ ...draft, instagramHandle: e.target.value })} />
              <input className={field} value={draft.instagramUrl} onChange={(e) => setDraft({ ...draft, instagramUrl: e.target.value })} />
              <label className="block text-xs font-semibold">Facebook</label>
              <input className={field} value={draft.facebookUrl} onChange={(e) => setDraft({ ...draft, facebookUrl: e.target.value })} />
              <label className="block text-xs font-semibold">{t('contact.maps')}</label>
              <input className={field} value={draft.mapsUrl} onChange={(e) => setDraft({ ...draft, mapsUrl: e.target.value })} />
              <input className={field} value={draft.mapsEmbed} onChange={(e) => setDraft({ ...draft, mapsEmbed: e.target.value })} />
            </section>
          </div>
        )}

        {tab === 'hours' && (
          <section className="bg-white rounded-3xl p-5 sm:p-6 border border-[var(--studio-border)] space-y-4">
            {draft.workingHours.map((row, index) => (
              <div key={row.id} className="grid grid-cols-2 gap-2 items-end">
                <p className="col-span-2 text-sm font-medium">{t(`hours.${row.id}`)}</p>
                <label className="text-xs">
                  {t('admin.open')}
                  <input
                    type="time"
                    className={`${field} mt-1`}
                    value={row.openTime}
                    onChange={(e) => {
                      const workingHours = draft.workingHours.map((item, i) =>
                        i === index
                          ? { ...item, openTime: e.target.value, hours: formatHoursLabel(e.target.value, item.closeTime) }
                          : item
                      );
                      setDraft({ ...draft, workingHours });
                    }}
                  />
                </label>
                <label className="text-xs">
                  {t('admin.close')}
                  <input
                    type="time"
                    className={`${field} mt-1`}
                    value={row.closeTime}
                    onChange={(e) => {
                      const workingHours = draft.workingHours.map((item, i) =>
                        i === index
                          ? { ...item, closeTime: e.target.value, hours: formatHoursLabel(item.openTime, e.target.value) }
                          : item
                      );
                      setDraft({ ...draft, workingHours });
                    }}
                  />
                </label>
              </div>
            ))}
          </section>
        )}

        {tab === 'theme' && (
          <AdminThemeTab theme={draft.theme || defaultSiteTheme()} onChange={(theme) => setDraft({ ...draft, theme })} />
        )}

        {tab === 'photos' && (
          <section className="bg-white rounded-3xl p-5 sm:p-6 border border-[var(--studio-border)] space-y-4">
            <p className="text-xs text-[var(--studio-muted)]">{t('admin.photoHint')}</p>
            <AdminImageField
              id="hero"
              label="Hero"
              value={draft.images.hero || ''}
              hint={t('admin.upload')}
              onChange={(src) => setDraft({ ...draft, images: { ...draft.images, hero: src } })}
            />
            <AdminImageField
              id="aboutMain"
              label="About"
              value={draft.images.aboutMain || ''}
              hint={t('admin.upload')}
              onChange={(src) => setDraft({ ...draft, images: { ...draft.images, aboutMain: src } })}
            />
            <AdminImageField
              id="aboutNails"
              label="About 2"
              value={draft.images.aboutNails || ''}
              hint={t('admin.upload')}
              onChange={(src) => setDraft({ ...draft, images: { ...draft.images, aboutNails: src } })}
            />
          </section>
        )}

        {tab === 'menu' && (
          <section className="bg-white rounded-3xl p-5 sm:p-6 border border-[var(--studio-border)] space-y-3 overflow-x-hidden">
            {draft.menu.map((row, index) => (
              <div key={row.id} className="admin-row space-y-2 pb-4 border-b border-[var(--studio-border)] last:border-0">
                <div className="flex gap-2 items-start">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
                    <input
                      className={`sm:col-span-2 ${field}`}
                      value={row.name}
                      onChange={(e) => {
                        const menu = draft.menu.map((item, i) => (i === index ? { ...item, name: e.target.value } : item));
                        setDraft({ ...draft, menu });
                      }}
                    />
                    <input
                      className={field}
                      value={row.price}
                      onChange={(e) => {
                        const menu = draft.menu.map((item, i) => (i === index ? { ...item, price: e.target.value } : item));
                        setDraft({ ...draft, menu });
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    className={iconBtn}
                    aria-label={t('admin.remove')}
                    onClick={() => setDraft({ ...draft, menu: draft.menu.filter((_, i) => i !== index) })}
                  >
                    −
                  </button>
                </div>
                <select
                  className={field}
                  value={row.category}
                  onChange={(e) => {
                    const category = e.target.value as SiteContent['menu'][number]['category'];
                    const menu = draft.menu.map((item, i) => (i === index ? { ...item, category } : item));
                    setDraft({ ...draft, menu });
                  }}
                >
                  {MENU_CATEGORIES.filter((cat) => cat.id !== 'all').map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {t(`menu.cat.${cat.id}`)}
                    </option>
                  ))}
                </select>
                <textarea
                  rows={2}
                  className={`${field} text-sm`}
                  value={row.description}
                  onChange={(e) => {
                    const menu = draft.menu.map((item, i) => (i === index ? { ...item, description: e.target.value } : item));
                    setDraft({ ...draft, menu });
                  }}
                />
                <AdminImageField
                  id={`menu-${row.id}`}
                  label=""
                  value={row.imageSrc}
                  hint={t('admin.upload')}
                  startClosed
                  onChange={(src) => {
                    const menu = draft.menu.map((item, i) => (i === index ? { ...item, imageSrc: src } : item));
                    setDraft({ ...draft, menu });
                  }}
                />
              </div>
            ))}
            <div className="flex gap-2">
              <button
                type="button"
                className={iconBtn}
                aria-label={t('admin.add')}
                onClick={() =>
                  setDraft({
                    ...draft,
                    menu: [
                      ...draft.menu,
                      {
                        id: newRowId('menu'),
                        name: t('admin.newService'),
                        price: '',
                        description: '',
                        imageSrc: '',
                        category: 'nails',
                      },
                    ],
                  })
                }
              >
                +
              </button>
            </div>
          </section>
        )}

        {tab === 'events' && (
          <section className="bg-white rounded-3xl p-5 sm:p-6 border border-[var(--studio-border)] space-y-4 overflow-x-hidden">
            {draft.events.map((row, index) => (
              <div key={row.id} className="admin-row space-y-2 pb-4 border-b border-[var(--studio-border)] last:border-0">
                <div className="flex gap-2 items-start">
                  <input
                    className={`${field} font-medium flex-1`}
                    value={row.title}
                    onChange={(e) => {
                      const events = draft.events.map((item, i) => (i === index ? { ...item, title: e.target.value } : item));
                      setDraft({ ...draft, events });
                    }}
                  />
                  <button
                    type="button"
                    className={iconBtn}
                    aria-label={t('admin.remove')}
                    onClick={() => setDraft({ ...draft, events: draft.events.filter((_, i) => i !== index) })}
                  >
                    −
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    className={`${field} text-sm`}
                    value={row.date}
                    onChange={(e) => {
                      const events = draft.events.map((item, i) => (i === index ? { ...item, date: e.target.value } : item));
                      setDraft({ ...draft, events });
                    }}
                  />
                  <input
                    className={`${field} text-sm`}
                    value={row.time}
                    onChange={(e) => {
                      const events = draft.events.map((item, i) => (i === index ? { ...item, time: e.target.value } : item));
                      setDraft({ ...draft, events });
                    }}
                  />
                </div>
                <textarea
                  rows={2}
                  className={`${field} text-sm`}
                  value={row.description}
                  onChange={(e) => {
                    const events = draft.events.map((item, i) =>
                      i === index ? { ...item, description: e.target.value } : item
                    );
                    setDraft({ ...draft, events });
                  }}
                />
                <AdminImageField
                  id={`event-${row.id}`}
                  label=""
                  value={row.imageSrc}
                  hint={t('admin.upload')}
                  startClosed
                  onChange={(src) => {
                    const events = draft.events.map((item, i) => (i === index ? { ...item, imageSrc: src } : item));
                    setDraft({ ...draft, events });
                  }}
                />
              </div>
            ))}
            <div className="flex gap-2">
              <button
                type="button"
                className={iconBtn}
                aria-label={t('admin.add')}
                onClick={() =>
                  setDraft({
                    ...draft,
                    events: [
                      ...draft.events,
                      {
                        id: newRowId('event'),
                        title: t('admin.newEvent'),
                        date: '',
                        time: '',
                        description: '',
                        imageSrc: '',
                      },
                    ],
                  })
                }
              >
                +
              </button>
            </div>
          </section>
        )}

        {tab === 'gallery' && (
          <section className="bg-white rounded-3xl p-5 sm:p-6 border border-[var(--studio-border)] space-y-4 overflow-x-hidden">
            {draft.gallery.map((row, index) => (
              <div key={row.id} className="admin-row space-y-2 pb-4 border-b border-[var(--studio-border)] last:border-0">
                <div className="flex gap-2 items-start">
                  <input
                    className={`${field} flex-1`}
                    value={row.title}
                    onChange={(e) => {
                      const gallery = draft.gallery.map((item, i) => (i === index ? { ...item, title: e.target.value } : item));
                      setDraft({ ...draft, gallery });
                    }}
                  />
                  <button
                    type="button"
                    className={iconBtn}
                    aria-label={t('admin.remove')}
                    onClick={() => setDraft({ ...draft, gallery: draft.gallery.filter((_, i) => i !== index) })}
                  >
                    −
                  </button>
                </div>
                <select
                  className={field}
                  value={row.category}
                  onChange={(e) => {
                    const category = e.target.value as SiteContent['gallery'][number]['category'];
                    const gallery = draft.gallery.map((item, i) => (i === index ? { ...item, category } : item));
                    setDraft({ ...draft, gallery });
                  }}
                >
                  <option value="studio">{t('gallery.studio')}</option>
                  <option value="nails">{t('gallery.nails')}</option>
                  <option value="lashes">{t('gallery.lashes')}</option>
                  <option value="details">{t('gallery.details')}</option>
                </select>
                <AdminImageField
                  id={`gallery-${row.id}`}
                  label=""
                  value={row.imageSrc}
                  hint={t('admin.upload')}
                  startClosed
                  onChange={(src) => {
                    const gallery = draft.gallery.map((item, i) => (i === index ? { ...item, imageSrc: src } : item));
                    setDraft({ ...draft, gallery });
                  }}
                />
              </div>
            ))}
            <div className="flex gap-2">
              <button
                type="button"
                className={iconBtn}
                aria-label={t('admin.add')}
                onClick={() =>
                  setDraft({
                    ...draft,
                    gallery: [
                      ...draft.gallery,
                      {
                        id: newRowId('gallery'),
                        title: t('admin.newPhoto'),
                        imageSrc: '',
                        category: 'studio',
                      },
                    ],
                  })
                }
              >
                +
              </button>
            </div>
          </section>
        )}

        {tab === 'reviews' && (
          <section className="bg-white rounded-3xl p-5 sm:p-6 border border-[var(--studio-border)] space-y-4">
            {draft.reviews.map((row, index) => (
              <div key={row.id} className="admin-row space-y-2 pb-4 border-b border-[var(--studio-border)] last:border-0">
                <div className="flex gap-2 items-start">
                  <input
                    className={`${field} flex-1`}
                    value={row.name}
                    onChange={(e) => {
                      const reviews = draft.reviews.map((item, i) => (i === index ? { ...item, name: e.target.value } : item));
                      setDraft({ ...draft, reviews });
                    }}
                  />
                  <button
                    type="button"
                    className={iconBtn}
                    aria-label={t('admin.remove')}
                    onClick={() => setDraft({ ...draft, reviews: draft.reviews.filter((_, i) => i !== index) })}
                  >
                    −
                  </button>
                </div>
                <input
                  className={field}
                  value={row.role}
                  onChange={(e) => {
                    const reviews = draft.reviews.map((item, i) => (i === index ? { ...item, role: e.target.value } : item));
                    setDraft({ ...draft, reviews });
                  }}
                />
                <textarea
                  rows={2}
                  className={`${field} text-sm`}
                  value={row.comment}
                  onChange={(e) => {
                    const reviews = draft.reviews.map((item, i) =>
                      i === index ? { ...item, comment: e.target.value } : item
                    );
                    setDraft({ ...draft, reviews });
                  }}
                />
                <AdminImageField
                  id={`review-${row.id}`}
                  label=""
                  value={row.imageSrc}
                  hint={t('admin.upload')}
                  startClosed
                  onChange={(src) => {
                    const reviews = draft.reviews.map((item, i) => (i === index ? { ...item, imageSrc: src } : item));
                    setDraft({ ...draft, reviews });
                  }}
                />
              </div>
            ))}
            <div className="flex gap-2">
              <button
                type="button"
                className={iconBtn}
                aria-label={t('admin.add')}
                onClick={() =>
                  setDraft({
                    ...draft,
                    reviews: [
                      ...draft.reviews,
                      {
                        id: newRowId('review'),
                        name: t('admin.newReview'),
                        role: '',
                        comment: '',
                        imageSrc: '',
                      },
                    ],
                  })
                }
              >
                +
              </button>
            </div>
          </section>
        )}

      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--studio-border)] bg-[var(--studio-sand)] pb-[max(0.5rem,env(safe-area-inset-bottom,0px))] shadow-[0_-8px_24px_rgba(28,20,15,0.08)]">
        <div className="max-w-3xl sm:max-w-5xl mx-auto px-3 py-2 sm:px-4 sm:py-3">
          {(saved || publishNote) && (
            <p className={`text-xs font-medium mb-1.5 sm:mb-2 line-clamp-2 sm:text-right ${publishNote && !publishing && publishNote !== t('admin.published') ? 'text-red-700' : 'text-emerald-700'}`}>
              {publishNote || t('admin.saved')}
            </p>
          )}

          <div className="grid grid-cols-3 gap-1.5 min-[360px]:gap-2 sm:hidden">
            <button
              type="button"
              onClick={saveLocal}
              className="px-2 min-[360px]:px-3 py-2 rounded-full bg-[var(--studio-terracotta)] text-white text-xs min-[360px]:text-sm font-semibold"
            >
              {t('admin.save')}
            </button>
            <button
              type="button"
              disabled={publishing}
              onClick={() => void publishLive()}
              className="px-2 min-[360px]:px-3 py-2 rounded-full bg-[var(--studio-dark)] text-white text-xs min-[360px]:text-sm font-semibold disabled:opacity-60"
            >
              {t('admin.publish')}
            </button>
            <button
              type="button"
              onClick={() => setMore((open) => !open)}
              className="px-2 min-[360px]:px-3 py-2 rounded-full bg-white border border-[var(--studio-border)] text-xs min-[360px]:text-sm font-medium"
            >
              {t('admin.more')}
            </button>
            <input
              type="password"
              value={publishPin}
              onChange={(e) => setPublishPin(e.target.value.slice(0, 64))}
              placeholder={t('admin.publishPin')}
              autoComplete="current-password"
              className="col-span-3 w-full px-3 py-2 rounded-full border border-[var(--studio-border)] bg-white text-sm"
            />
            <div className={`${more ? 'col-span-3 flex flex-wrap gap-2' : 'hidden'}`}>
              <button
                type="button"
                onClick={exportJson}
                className="px-4 py-2 rounded-full bg-white border border-[var(--studio-border)] text-sm font-medium"
              >
                {t('admin.export')}
              </button>
              <label className="px-4 py-2 rounded-full bg-white border border-[var(--studio-border)] text-sm font-medium cursor-pointer">
                {t('admin.import')}
                <input
                  type="file"
                  accept="application/json"
                  className="sr-only"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    e.target.value = '';
                    if (!file) return;
                    await importJson(file);
                  }}
                />
              </label>
              <button
                type="button"
                onClick={() => void restoreOriginal()}
                className="px-4 py-2 rounded-full bg-white border border-[var(--studio-border)] text-sm font-medium"
              >
                {t('admin.reset')}
              </button>
              <button type="button" onClick={onLogout} className="px-4 py-2 rounded-full text-sm text-[var(--studio-muted)]">
                {t('admin.logout')}
              </button>
            </div>
          </div>

          <div className="hidden sm:flex items-center justify-between gap-6">
            <div className="flex items-center gap-0.5">
              <button type="button" onClick={exportJson} className={ghostBtn}>
                {t('admin.export')}
              </button>
              <label className={`${ghostBtn} cursor-pointer`}>
                {t('admin.import')}
                <input
                  type="file"
                  accept="application/json"
                  className="sr-only"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    e.target.value = '';
                    if (!file) return;
                    await importJson(file);
                  }}
                />
              </label>
              <span className="mx-2 h-4 w-px bg-[var(--studio-border)]" aria-hidden />
              <button type="button" onClick={() => void restoreOriginal()} className={ghostBtn}>
                {t('admin.reset')}
              </button>
              <button type="button" onClick={onLogout} className={ghostBtn}>
                {t('admin.logout')}
              </button>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-[var(--studio-border)] bg-white p-1.5 shadow-sm">
              <input
                type="password"
                value={publishPin}
                onChange={(e) => setPublishPin(e.target.value.slice(0, 64))}
                placeholder={t('admin.publishPin')}
                autoComplete="current-password"
                className="w-44 px-3 py-2 rounded-xl bg-[var(--studio-sand)] text-sm border-0 focus:outline-none focus:ring-2 focus:ring-[var(--studio-terracotta)]/25"
              />
              <button
                type="button"
                onClick={saveLocal}
                className="px-5 py-2 rounded-xl bg-[var(--studio-terracotta)] text-white text-sm font-semibold hover:bg-[var(--studio-terracotta-hover)]"
              >
                {t('admin.save')}
              </button>
              <button
                type="button"
                disabled={publishing}
                onClick={() => void publishLive()}
                className="px-5 py-2 rounded-xl bg-[var(--studio-dark)] text-white text-sm font-semibold disabled:opacity-60"
              >
                {t('admin.publish')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
