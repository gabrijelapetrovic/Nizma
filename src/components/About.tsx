import React from 'react';
import { Sparkles, Heart, Eye, Users } from 'lucide-react';
import { InstagramIcon } from './SocialIcons';
import { SITE_IMAGES } from '../utils/constants';
import { Image } from './Image';
import { IMAGE_SIZES, overlayImage } from '../utils/images';
import { useLang } from '../i18n/useLang';
import { useContent } from '../content/useContent';

export const About: React.FC = () => {
  const { t } = useLang();
  const { content } = useContent();
  return (
    <section id="about" className="py-20 bg-[var(--studio-bg)] relative overflow-hidden">
      {/* Decorative subtle background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--studio-sand)] rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[var(--studio-terracotta-light)] rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Image Collage */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-[var(--studio-sand-dark)]/40 aspect-[4/5]">
                <Image
                  image={overlayImage(SITE_IMAGES.aboutMain, content.images.aboutMain)}
                  sizes={IMAGE_SIZES.about}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--studio-dark)]/70 via-transparent to-transparent" />
                
                {/* Floating overlay badge on image */}
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-white/50 text-[var(--studio-text)] shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--studio-terracotta)] text-white flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-sm text-[var(--studio-dark)]">{t('about.overlayTitle')}</h3>
                      <p className="text-xs text-[var(--studio-muted)]">{t('about.overlayText')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Secondary Floating Image */}
              <div className="absolute -top-6 -right-6 w-36 sm:w-44 aspect-square rounded-2xl overflow-hidden shadow-xl border-4 border-white hidden sm:block">
                <Image
                  image={overlayImage(SITE_IMAGES.aboutNails, content.images.aboutNails)}
                  sizes={IMAGE_SIZES.aboutThumb}
                  widths={[400, 500]}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Decorative Stamp */}
              <div className="absolute -bottom-6 -left-6 bg-[var(--studio-gold)] text-[var(--studio-dark)] w-24 h-24 rounded-full flex flex-col items-center justify-center p-2 text-center shadow-lg font-serif border-2 border-white">
                <span className="text-[10px] tracking-widest uppercase font-bold">{t('about.stamp1')}</span>
                <span className="text-xs font-black">{t('about.stamp2')}</span>
                <span className="text-[9px] tracking-wider">{t('about.stamp3')}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Text & Values */}
          <div className="lg:col-span-7">
            {/* Category Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--studio-terracotta-light)] text-[var(--studio-terracotta)] text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('about.badge')}</span>
            </div>

            {/* Headline */}
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--studio-dark)] leading-tight mb-6">
              {t('about.titleBefore')}
              <span className="text-[var(--studio-terracotta)]">{t('about.titleEm')}</span>
              {t('about.titleAfter')}
            </h2>

            {/* Description */}
            <p className="text-[var(--studio-muted)] text-base sm:text-lg leading-relaxed mb-6">
              {t('about.p1')}
            </p>

            <p className="text-[var(--studio-muted)] text-base leading-relaxed mb-6">
              {t('about.p2')}
            </p>

            <div className="mb-8 rounded-2xl border border-[var(--studio-border)] bg-[var(--studio-sand)]/50 p-4">
              <h3 className="font-serif text-lg font-bold text-[var(--studio-dark)] mb-3">{t('visit.title')}</h3>
              <ul className="space-y-2 text-sm text-[var(--studio-muted)]">
                <li>{t('visit.1')}</li>
                <li>{t('visit.2')}</li>
                <li>{t('visit.3')}</li>
              </ul>
            </div>

            {/* Value Props Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[var(--studio-sand)]/60 border border-[var(--studio-border)]">
                <div className="p-2 rounded-lg bg-[var(--studio-terracotta)]/10 text-[var(--studio-terracotta)] shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-[var(--studio-text)]">{t('about.v1t')}</h4>
                  <p className="text-xs text-[var(--studio-muted)] mt-0.5">{t('about.v1d')}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[var(--studio-sand)]/60 border border-[var(--studio-border)]">
                <div className="p-2 rounded-lg bg-[var(--studio-sage)]/15 text-[var(--studio-sage)] shrink-0">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-[var(--studio-text)]">{t('about.v2t')}</h4>
                  <p className="text-xs text-[var(--studio-muted)] mt-0.5">{t('about.v2d')}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[var(--studio-sand)]/60 border border-[var(--studio-border)]">
                <div className="p-2 rounded-lg bg-[var(--studio-terracotta)]/10 text-[var(--studio-terracotta)] shrink-0">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-[var(--studio-text)]">{t('about.v3t')}</h4>
                  <p className="text-xs text-[var(--studio-muted)] mt-0.5">{t('about.v3d')}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[var(--studio-sand)]/60 border border-[var(--studio-border)]">
                <div className="p-2 rounded-lg bg-orange-100 text-orange-700 shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-[var(--studio-text)]">{t('about.v4t')}</h4>
                  <p className="text-xs text-[var(--studio-muted)] mt-0.5">{t('about.v4d')}</p>
                </div>
              </div>
            </div>

            {/* Instagram Banner Button */}
            <div className="flex items-center gap-4 flex-wrap">
              <a
                href={content.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[var(--studio-dark)] text-white text-sm font-semibold hover:bg-[var(--studio-ink)] transition-all shadow-md hover:shadow-lg"
              >
                <InstagramIcon className="w-4 h-4 text-pink-400" />
                <span>{t('about.ig')} {content.instagramHandle}</span>
              </a>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
