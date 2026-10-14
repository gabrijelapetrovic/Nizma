import React from 'react';
import { Sparkles, Eye, Heart, Clock } from 'lucide-react';
import { scrollToSection } from '../utils/scrollToSection';
import { VIBE_HIGHLIGHTS } from '../utils/constants';
import { Image } from './Image';
import { IMAGE_SIZES, overlayImage } from '../utils/images';
import { useContent } from '../content/useContent';
import { useLang } from '../i18n/useLang';

export const Experience: React.FC = () => {
  const { t } = useLang();
  const { content } = useContent();
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Eye':
        return <Eye className="w-5 h-5 text-[var(--studio-terracotta)]" />;
      case 'Heart':
        return <Heart className="w-5 h-5 text-[var(--studio-terracotta)]" />;
      default:
        return <Sparkles className="w-5 h-5 text-[var(--studio-terracotta)]" />;
    }
  };

  return (
    <section id="vibe" className="py-20 bg-[var(--studio-sand)] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--studio-sand-dark)]/50 text-[var(--studio-dark)] text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[var(--studio-terracotta)]" />
            <span>{t('vibe.badge')}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--studio-dark)] mb-4">
            {t('vibe.title')}
          </h2>
          <p className="text-[var(--studio-muted)] text-base sm:text-lg">
            {t('vibe.subtitle')}
          </p>
        </div>

        {/* 3 Step Day/Night Experience Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {VIBE_HIGHLIGHTS.map((item, idx) => (
            <div
              key={item.title}
              className="group bg-[var(--studio-card)] rounded-3xl overflow-hidden border border-[var(--studio-border)] shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col"
            >
              {/* Image Container with Badge */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  image={overlayImage(item.image, content.images[`vibe${idx}`])}
                  sizes={IMAGE_SIZES.third}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Time Badge */}
                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[var(--studio-dark)] shadow">
                  <Clock className="w-3.5 h-3.5 text-[var(--studio-terracotta)]" />
                  <span>{t(`vibe.c${idx}sub`)}</span>
                </div>

                {/* Tag Badge */}
                <div className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white">
                  {getIcon(item.icon)}
                  <span>{t(`vibe.c${idx}tag`)}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--studio-dark)] mb-3 group-hover:text-[var(--studio-terracotta)] transition-colors">
                    {t(`vibe.c${idx}t`)}
                  </h3>
                  <p className="text-[var(--studio-muted)] text-sm leading-relaxed mb-6">
                    {t(`vibe.c${idx}d`)}
                  </p>
                </div>

                {/* Highlights List */}
                <div className="pt-4 border-t border-[var(--studio-border)]/60 flex items-center justify-between text-xs text-[var(--studio-muted)] font-medium">
                  <span>{idx === 0 ? t('vibe.h0') : idx === 1 ? t('vibe.h1') : t('vibe.h2')}</span>
                  <button
                    type="button"
                    onClick={() => scrollToSection('#menu')}
                    className="text-[var(--studio-terracotta)] font-semibold uppercase tracking-[0.14em] cursor-pointer"
                  >
                    {t('vibe.more')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
