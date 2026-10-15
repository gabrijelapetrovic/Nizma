import React from 'react';
import { Calendar, Clock, Sparkles } from 'lucide-react';
import { InstagramIcon } from './SocialIcons';
import { EVENTS } from '../utils/constants';
import { Image } from './Image';
import { IMAGE_SIZES } from '../utils/images';
import { useLang } from '../i18n/useLang';
import { useContent } from '../content/useContent';
import { applyEventContent } from '../content/store';
export const Events: React.FC = () => {
  const { t } = useLang();
  const { content } = useContent();
  const events = applyEventContent(EVENTS, content);
  return (
    <section id="events" className="py-20 bg-[var(--studio-dark)] text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-[var(--studio-terracotta)]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--studio-gold)]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-[var(--studio-gold)] text-xs font-semibold uppercase tracking-wider mb-4 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-[var(--studio-terracotta)]" />
              <span>{t('events.badge')}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
              {t('events.title')}
            </h2>
          </div>
          <p className="text-stone-300 text-sm sm:text-base max-w-md">
            {t('events.subtitle')}
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {events.map((event) => (
            <div
              key={event.id}
              className="group bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-3xl overflow-hidden border border-white/10 transition-all duration-300 hover:border-[var(--studio-gold)]/40 flex flex-col sm:flex-row"
            >
              {/* Event Image */}
              <div className="sm:w-2/5 relative aspect-[16/10] sm:aspect-auto overflow-hidden">
                <Image
                  image={event.image}
                  sizes={IMAGE_SIZES.event}
                  className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/70 sm:from-transparent to-transparent" />
                {event.badge && (
                  <span className="absolute top-3 left-3 bg-[var(--studio-terracotta)] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow">
                    {event.badge}
                  </span>
                )}
              </div>

              {/* Event Info */}
              <div className="sm:w-3/5 p-6 flex flex-col justify-between">
                <div>
                  {/* Category */}
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--studio-gold)] mb-2 block">
                    {event.category}
                  </span>

                  <h3 className="font-serif text-xl font-bold text-white mb-3 group-hover:text-[var(--studio-gold)] transition-colors">
                    {event.title}
                  </h3>

                  {/* Date & Time metadata */}
                  <div className="flex flex-col gap-1.5 mb-4 text-xs text-stone-300">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[var(--studio-terracotta)]" />
                      <span className="font-semibold text-white">{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[var(--studio-gold)]" />
                      <span>{event.time}</span>
                    </div>
                  </div>

                  <p className="text-stone-300 text-xs sm:text-sm leading-relaxed mb-6 line-clamp-3">
                    {event.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Instagram Notification Banner */}
        <div className="mt-12 bg-white/5 rounded-2xl border border-white/10 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center shrink-0">
              <InstagramIcon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-white">{t('events.igTitle')}</h4>
              <p className="text-xs text-stone-300">{t('events.igText')}</p>
            </div>
          </div>
          <a
            href={content.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all shrink-0"
          >
            Pogledaj {content.instagramHandle}
          </a>
        </div>

      </div>
    </section>
  );
};
