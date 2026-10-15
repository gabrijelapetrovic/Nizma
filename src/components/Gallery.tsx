import React, { useState, useMemo } from 'react';
import { Sparkles, Eye } from 'lucide-react';
import { InstagramIcon } from './SocialIcons';
import { GALLERY_IMAGES } from '../utils/constants';
import { LightboxModal } from './LightboxModal';
import { Image } from './Image';
import { IMAGE_SIZES } from '../utils/images';
import { useLang } from '../i18n/useLang';
import { useContent } from '../content/useContent';
import { applyGalleryContent } from '../content/store';

export const Gallery: React.FC = () => {
  const { t } = useLang();
  const { content } = useContent();
  const galleryImages = useMemo(() => applyGalleryContent(GALLERY_IMAGES, content), [content]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = [
    { id: 'all', label: t('gallery.all') },
    { id: 'studio', label: t('gallery.studio') },
    { id: 'nails', label: t('gallery.nails') },
    { id: 'lashes', label: t('gallery.lashes') },
    { id: 'details', label: t('gallery.details') },
  ];

  const filteredImages = useMemo(() => {
    if (activeCategory === 'all') return galleryImages;
    return galleryImages.filter((img) => img.category === activeCategory);
  }, [activeCategory, galleryImages]);

  const handleNext = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredImages.length);
    }
  };

  const handlePrev = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredImages.length) % filteredImages.length);
    }
  };

  return (
    <section id="gallery" className="py-20 bg-[var(--studio-bg)] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--studio-terracotta-light)] text-[var(--studio-terracotta)] text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('gallery.badge')}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--studio-dark)] mb-4">
            {t('gallery.title')}
          </h2>
          <p className="text-[var(--studio-muted)] text-base sm:text-lg">
            {t('gallery.subtitle')}
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setLightboxIndex(null);
                }}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[var(--studio-terracotta)] text-white shadow-md'
                    : 'bg-[var(--studio-card)] text-[var(--studio-muted)] hover:bg-[var(--studio-sand)] border border-[var(--studio-border)]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              onClick={() => setLightboxIndex(index)}
              className="group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer aspect-[4/3] bg-[var(--studio-sand)] border border-[var(--studio-border)]"
            >
              <Image
                image={image.image}
                sizes={IMAGE_SIZES.third}
                className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--studio-dark)]/85 via-[var(--studio-dark)]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 flex flex-col justify-end">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--studio-gold)] mb-1">
                  {image.category}
                </span>
                <h3 className="font-serif text-lg font-bold text-white mb-2">
                  {image.title}
                </h3>
                <span className="text-xs text-stone-300 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-[var(--studio-terracotta)]" />
                  <span>{t('gallery.click')}</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Instagram Feed Promo */}
        <div className="mt-14 text-center">
          <a
            href={content.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[var(--studio-card)] hover:bg-[var(--studio-sand)] border border-[var(--studio-border)] text-[var(--studio-dark)] font-semibold text-sm shadow-sm hover:shadow-md transition-all"
          >
            <InstagramIcon className="w-4 h-4 text-pink-500" />
            <span>Više slika i dnevnih storija na {content.instagramHandle}</span>
          </a>
        </div>

      </div>

      {/* Lightbox Modal */}
      <LightboxModal
        images={filteredImages}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </section>
  );
};
