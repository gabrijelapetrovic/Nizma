import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Clock,
  ChevronDown,
  Navigation,
} from 'lucide-react';
import { InstagramIcon } from './SocialIcons';
import { useLang } from '../i18n/useLang';
import { useContent } from '../content/useContent';
import { ChatReserve } from './ChatReserve';

export const LocationContact: React.FC = () => {
  const { t } = useLang();
  const { content } = useContent();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [showMap, setShowMap] = useState(false);
  const faqs = [0, 1, 2, 3, 4];

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section id="contact" className="py-20 bg-[var(--studio-sand)] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--studio-sand-dark)] text-[var(--studio-dark)] text-xs font-semibold uppercase tracking-wider mb-4">
            <MapPin className="w-3.5 h-3.5 text-[var(--studio-terracotta)]" />
            <span>{t('contact.badge')}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--studio-dark)] mb-4">
            {t('contact.title')}
          </h2>
          <p className="text-[var(--studio-muted)] text-base sm:text-lg">
            {t('contact.subtitle')}
          </p>
        </div>

        {/* Contact Info & Map Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">

          {/* Left: Contact Info Cards */}
          <div className="lg:col-span-5 space-y-4">
            {/* Address Card */}
            <div className="bg-[var(--studio-card)] rounded-3xl p-6 border border-[var(--studio-border)] shadow-sm">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-[var(--studio-terracotta-light)] text-[var(--studio-terracotta)] shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-[var(--studio-dark)]">{t('contact.address')}</h3>
                  <p className="text-sm text-[var(--studio-muted)] mt-1">{content.addressFull}</p>
                  <a
                    href={content.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--studio-terracotta)] hover:underline mt-3"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>{t('contact.maps')}</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Phone & Direct Reservation */}
            <div className="bg-[var(--studio-card)] rounded-3xl p-6 border border-[var(--studio-border)] shadow-sm">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-700 shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-[var(--studio-dark)]">{t('contact.phone')}</h3>
                  <p className="text-sm text-[var(--studio-muted)] mt-1">{t('contact.phoneHint')}</p>
                  <a
                    href={`tel:${content.phoneRaw}`}
                    className="inline-block text-base font-bold text-[var(--studio-dark)] hover:text-[var(--studio-terracotta)] mt-2"
                  >
                    {content.phone}
                  </a>
                  <ChatReserve compact />
                </div>
              </div>
            </div>

            {/* Working Hours */}
            <div className="bg-[var(--studio-card)] rounded-3xl p-6 border border-[var(--studio-border)] shadow-sm">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-amber-50 text-amber-700 shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-base font-bold text-[var(--studio-dark)] mb-3">{t('contact.hours')}</h3>
                  <div className="space-y-2 text-xs sm:text-sm">
                    {content.workingHours.map((wh) => (
                      <div key={wh.id} className="flex justify-between items-center text-[var(--studio-muted)]">
                        <span>{t(`hours.${wh.id}`)}</span>
                        <span className="font-bold text-[var(--studio-dark)]">{wh.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Instagram Connect */}
            <div className="bg-gradient-to-r from-[var(--studio-dark)] to-[var(--studio-ink)] rounded-3xl p-6 text-white shadow-md flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-pink-500/20 text-pink-400">
                  <InstagramIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm">{t('contact.igTitle')}</h4>
                  <p className="text-xs text-stone-300">{content.instagramHandle}</p>
                </div>
              </div>
              <a
                href={content.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold border border-white/20 transition-all"
              >
                {t('contact.visit')}
              </a>
            </div>
          </div>

          {/* Right: Interactive Map Simulation */}
          <div className="lg:col-span-7 bg-[var(--studio-card)] rounded-3xl overflow-hidden border border-[var(--studio-border)] shadow-sm relative min-h-[240px] sm:min-h-[420px] flex flex-col">
            {showMap ? (
              <iframe
                title={`${content.name} — mapa`}
                src={content.mapsEmbed}
                className="w-full h-full min-h-[240px] sm:min-h-[420px] border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <button
                type="button"
                onClick={() => setShowMap(true)}
                className="w-full h-full min-h-[240px] sm:min-h-[420px] flex flex-col items-center justify-center gap-3 bg-[var(--studio-sand)] text-[var(--studio-dark)]"
              >
                <MapPin className="w-8 h-8 text-[var(--studio-terracotta)]" />
                <span className="text-sm font-semibold">{t('contact.showMap')}</span>
              </button>
            )}

            {/* Overlay badge on map */}
            <div className="absolute top-3 left-3 right-3 sm:right-auto sm:max-w-xs bg-white/95 backdrop-blur-md px-3 min-[360px]:px-4 py-3 rounded-2xl shadow-lg border border-[var(--studio-border)] min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--studio-terracotta)] animate-ping" />
                <h4 className="font-serif font-bold text-xs text-[var(--studio-dark)]">{content.name}</h4>
              </div>
              <p className="text-[11px] text-[var(--studio-muted)]">
                {content.addressFull} • {t('contact.parking')}
              </p>
            </div>
          </div>

        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto pt-8">
          <div className="text-center mb-10">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--studio-dark)] mb-2">
              {t('faq.title')}
            </h3>
            <p className="text-[var(--studio-muted)] text-sm">
              {t('faq.subtitle')}
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-[var(--studio-card)] rounded-2xl border border-[var(--studio-border)] overflow-hidden transition-all shadow-sm"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--studio-terracotta)]"
                    aria-expanded={isOpen}
                  >
                    <span className="font-serif font-bold text-sm sm:text-base text-[var(--studio-dark)]">
                      {t(`faq.q${idx}`)}
                    </span>
                    <span
                      className={`p-1.5 rounded-full bg-[var(--studio-sand)] text-[var(--studio-dark)] transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 bg-[var(--studio-terracotta)] text-white' : ''
                        }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-[var(--studio-muted)] leading-relaxed border-t border-[var(--studio-border)]/60 animate-in fade-in duration-200">
                      {t(`faq.a${idx}`)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
