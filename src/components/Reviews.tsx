import React from 'react';
import { Star, Quote, Heart } from 'lucide-react';
import { TESTIMONIALS } from '../utils/constants';
import { Image } from './Image';
import { IMAGE_SIZES } from '../utils/images';
import { useLang } from '../i18n/useLang';
import { useContent } from '../content/useContent';
import { applyReviewContent } from '../content/store';

export const Reviews: React.FC = () => {
  const { t } = useLang();
  const { content } = useContent();
  const testimonials = applyReviewContent(TESTIMONIALS, content);
  if (!testimonials.length) return null;
  return (
    <section id="reviews" className="py-20 bg-[var(--studio-bg)] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--studio-terracotta-light)] text-[var(--studio-terracotta)] text-xs font-semibold uppercase tracking-wider mb-4">
            <Heart className="w-3.5 h-3.5" />
            <span>{t('reviews.badge')}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--studio-dark)] mb-4">
            {t('reviews.title')}
          </h2>
          <p className="text-[var(--studio-muted)] text-base sm:text-lg">
            {t('reviews.lead')}
          </p>
        </div>

        {/* Rating Summary Banner */}
        <div className="max-w-xl mx-auto mb-12 p-4 min-[360px]:p-6 rounded-3xl bg-[var(--studio-card)] border border-[var(--studio-border)] shadow-sm flex items-center justify-around text-center gap-2 min-w-0">
          <div>
            <div className="font-serif text-3xl sm:text-4xl font-black text-[var(--studio-dark)]">{t('reviews.stat1')}</div>
            <div className="flex items-center justify-center gap-1 my-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
              ))}
            </div>
            <span className="text-xs text-[var(--studio-muted)] font-medium">{t('reviews.stat1l')}</span>
          </div>

          <div className="h-12 w-px bg-[var(--studio-border)]" />

          <div>
            <div className="font-serif text-3xl sm:text-4xl font-black text-[var(--studio-terracotta)]">{t('reviews.stat2')}</div>
            <span className="text-xs text-[var(--studio-muted)] font-medium block mt-1">
              {t('reviews.stat2l')}
            </span>
          </div>

          <div className="h-12 w-px bg-[var(--studio-border)] hidden sm:block" />

          <div className="hidden sm:block">
            <div className="font-serif text-3xl sm:text-4xl font-black text-[var(--studio-sage)]">{t('reviews.stat3')}</div>
            <span className="text-xs text-[var(--studio-muted)] font-medium block mt-1">
              {t('reviews.stat3l')}
            </span>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((review) => (
            <div
              key={review.id}
              className="bg-[var(--studio-card)] rounded-3xl p-7 border border-[var(--studio-border)] shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between relative"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-[var(--studio-sand-dark)]/50 pointer-events-none" />

              <div>
                {/* Stars */}
                <div className="flex items-center gap-1 mb-4 text-amber-500">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-[var(--studio-text)] text-sm sm:text-base leading-relaxed italic mb-6">
                  "{review.comment}"
                </p>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-[var(--studio-border)]/60">
                <Image
                  image={review.avatar}
                  sizes={IMAGE_SIZES.avatar}
                  widths={[150]}
                  quality={60}
                  className="w-11 h-11 rounded-full object-cover border-2 border-[var(--studio-sand-dark)]"
                />
                <div>
                  <h4 className="font-serif font-bold text-sm text-[var(--studio-dark)]">{review.name}</h4>
                  <div className="flex items-center gap-2 text-xs text-[var(--studio-muted)]">
                    <span>{review.role}</span>
                    <span>•</span>
                    <span>{review.date}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
