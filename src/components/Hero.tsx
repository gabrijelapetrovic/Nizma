import React from 'react';
import { Sparkles, Calendar, Eye, Heart, ArrowRight } from 'lucide-react';
import { InstagramIcon } from './SocialIcons';
import { SITE_IMAGES } from '../utils/constants';
import { Image } from './Image';
import { IMAGE_SIZES, overlayImage } from '../utils/images';
import { useLang } from '../i18n/useLang';
import { useContent } from '../content/useContent';

interface HeroProps {
  onOpenMenu?: () => void;
  onOpenReservation?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenMenu, onOpenReservation }) => {
  const { t } = useLang();
  const { content } = useContent();
  const heroImage = overlayImage(SITE_IMAGES.hero, content.images.hero);

  const scrollToSection = (selector: string) => {
    const el = document.querySelector(selector);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center pt-24 pb-28 sm:pb-16 overflow-hidden bg-[var(--studio-dark)] text-white">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          image={heroImage}
          priority
          sizes={IMAGE_SIZES.full}
          quality={50}
          className="w-full h-full object-cover object-center opacity-80 scale-105 transform max-[640px]:hidden"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--studio-dark)]/80 via-[var(--studio-dark)]/35 to-[var(--studio-terracotta)]/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--studio-dark)]/45 via-transparent to-[var(--studio-dark)]/30" />
        <div className="hero-atmosphere absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-[420px] sm:h-[420px] bg-[var(--studio-terracotta)]/15 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 min-[360px]:px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center min-w-0 w-full">
        {/* Tagline */}
        <div className="hero-surface inline-flex items-center gap-2 px-3 min-[360px]:px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-stone-200 text-xs sm:text-sm font-medium mb-6 shadow-inner tracking-wide max-w-full">
          <Sparkles className="w-3.5 h-3.5 text-[var(--studio-gold)] shrink-0" />
          <span className="min-w-0 truncate">{t('hero.welcome')}</span>
        </div>

        {/* Main Serif Headline */}
        <h1 className="hero-headline font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white max-w-4xl leading-[0.95] mb-6 px-0.5">
          <span className="block">{t('hero.titleBefore')}</span>
          <span className="block text-[var(--studio-gold)] italic font-normal">{t('hero.titleEm')}</span>
          {t('hero.titleAfter') ? <span className="block">{t('hero.titleAfter')}</span> : null}
        </h1>

        {/* Subtitle */}
        <p className="text-stone-300 text-sm min-[360px]:text-base sm:text-lg md:text-xl max-w-2xl font-light mb-10 leading-relaxed tracking-normal min-[360px]:tracking-wider">
          {t('hero.subtitle')}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 min-[360px]:gap-4 w-full sm:w-auto mb-10 min-[360px]:mb-14 min-w-0">
          <button
            onClick={() => (onOpenReservation ? onOpenReservation() : scrollToSection('#contact'))}
            className="w-full sm:w-auto px-5 min-[360px]:px-8 py-3.5 rounded-full bg-[var(--studio-terracotta)] hover:bg-[var(--studio-terracotta-hover)] text-white font-semibold text-sm min-[360px]:text-base shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Calendar className="w-5 h-5 shrink-0" />
            <span>{t('cta.reserve')}</span>
          </button>

          <button
            onClick={() => (onOpenMenu ? onOpenMenu() : scrollToSection('#menu'))}
            className="hero-surface w-full sm:w-auto px-5 min-[360px]:px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm min-[360px]:text-base border border-white/20 backdrop-blur-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-[var(--studio-gold)] shrink-0" />
            <span>{t('nav.menu')}</span>
          </button>

          <a
            href={content.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hero-surface w-full sm:w-auto px-4 min-[360px]:px-5 py-3.5 rounded-full bg-black/40 hover:bg-black/60 text-stone-300 hover:text-white text-sm font-medium border border-white/10 backdrop-blur-sm transition-all flex items-center justify-center gap-2 min-w-0"
          >
            <InstagramIcon className="w-4 h-4 text-pink-400 shrink-0" />
            <span className="truncate">{content.instagramHandle}</span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </a>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 min-[360px]:gap-3 sm:gap-4 max-w-4xl w-full min-w-0">
          <div className="hero-surface bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-2.5 min-[360px]:p-4 flex flex-col items-center text-center transition-all hover:bg-white/10 min-w-0">
            <div className="w-9 h-9 min-[360px]:w-10 min-[360px]:h-10 rounded-full bg-[var(--studio-gold)]/20 text-[var(--studio-gold)] flex items-center justify-center mb-2">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-serif text-xs min-[360px]:text-sm sm:text-base font-semibold text-white leading-tight">{t('hero.nails')}</span>
            <span className="text-[10px] min-[360px]:text-xs text-stone-400 mt-0.5 leading-snug">{t('hero.nailsHint')}</span>
          </div>

          <div className="hero-surface bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-2.5 min-[360px]:p-4 flex flex-col items-center text-center transition-all hover:bg-white/10 min-w-0">
            <div className="w-9 h-9 min-[360px]:w-10 min-[360px]:h-10 rounded-full bg-[var(--studio-terracotta)]/20 text-[var(--studio-terracotta)] flex items-center justify-center mb-2">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-serif text-xs min-[360px]:text-sm sm:text-base font-semibold text-white leading-tight">{t('hero.lashes')}</span>
            <span className="text-[10px] min-[360px]:text-xs text-stone-400 mt-0.5 leading-snug">{t('hero.lashesHint')}</span>
          </div>

          <div className="hero-surface bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-2.5 min-[360px]:p-4 flex flex-col items-center text-center transition-all hover:bg-white/10 min-w-0">
            <div className="w-9 h-9 min-[360px]:w-10 min-[360px]:h-10 rounded-full bg-[var(--studio-sage)]/20 text-[var(--studio-sage)] flex items-center justify-center mb-2">
              <Heart className="w-5 h-5" />
            </div>
            <span className="font-serif text-xs min-[360px]:text-sm sm:text-base font-semibold text-white leading-tight">{t('hero.care')}</span>
            <span className="text-[10px] min-[360px]:text-xs text-stone-400 mt-0.5 leading-snug">{t('hero.careHint')}</span>
          </div>

          <div className="hero-surface bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-2.5 min-[360px]:p-4 flex flex-col items-center text-center transition-all hover:bg-white/10 min-w-0">
            <div className="w-9 h-9 min-[360px]:w-10 min-[360px]:h-10 rounded-full bg-white/15 text-white flex items-center justify-center mb-2">
              <Eye className="w-5 h-5" />
            </div>
            <span className="font-serif text-xs min-[360px]:text-sm sm:text-base font-semibold text-white leading-tight">{t('hero.studio')}</span>
            <span className="text-[10px] min-[360px]:text-xs text-stone-400 mt-0.5 leading-snug">{t('hero.studioHint')}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
