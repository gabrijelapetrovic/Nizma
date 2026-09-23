import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Sparkles, Tag, Calendar } from 'lucide-react';
import { type MenuItem } from '../types';
import { Image } from './Image';
import { IMAGE_SIZES } from '../utils/images';
import { useLang } from '../i18n/useLang';

interface MenuItemModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onBookTable?: () => void;
}

export const MenuItemModal: React.FC<MenuItemModalProps> = ({ item, onClose, onBookTable }) => {
  const { t } = useLang();
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (item) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [item, onClose]);

  if (!item) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-item-title"
      className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative bg-[var(--studio-card)] rounded-3xl max-w-lg w-full max-h-[min(90dvh,920px)] overflow-y-auto shadow-2xl border border-[var(--studio-border)] animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label={t('menu.closeDetails')}
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-all cursor-pointer shadow"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Image */}
          <div className="relative aspect-[16/10] overflow-hidden bg-[var(--studio-sand)]">
            <Image image={item.image} sizes={IMAGE_SIZES.lightbox} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Price Badge */}
            <div className="absolute bottom-4 left-4 bg-[var(--studio-terracotta)] text-white px-3.5 py-1.5 rounded-full font-serif font-bold text-lg shadow-md">
              {item.price}
            </div>

            {/* Volume / Weight Badge */}
            {item.volume && (
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm text-[var(--studio-dark)] text-xs font-semibold px-2.5 py-1 rounded-full shadow">
                {item.volume}
              </div>
            )}
          </div>

          {/* Modal Content */}
          <div className="p-6 sm:p-7">
            {/* Tags */}
            <div className="flex flex-wrap items-center gap-1.5 mb-3">
              {item.popular && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--studio-terracotta-light)] text-[var(--studio-terracotta)]">
                  <Sparkles className="w-3 h-3" />
                  <span>{t('menu.house')}</span>
                </span>
              )}
              {item.tags?.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--studio-sand)] text-[var(--studio-text)]"
                >
                  <Tag className="w-2.5 h-2.5 text-[var(--studio-muted)]" />
                  <span>{tag}</span>
                </span>
              ))}
            </div>

            <h3 id="modal-item-title" className="font-serif text-2xl font-bold text-[var(--studio-dark)] mb-3">
              {item.name}
            </h3>

            <p className="text-[var(--studio-muted)] text-sm sm:text-base leading-relaxed mb-6">
              {item.description}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  onClose();
                  if (onBookTable) onBookTable();
                }}
                className="flex-1 py-3 px-4 rounded-full bg-[var(--studio-terracotta)] hover:bg-[var(--studio-terracotta-hover)] text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>{t('menu.bookTry')}</span>
              </button>
              <button
                onClick={onClose}
                className="py-3 px-5 rounded-full bg-[var(--studio-sand)] hover:bg-[var(--studio-sand-dark)] text-[var(--studio-dark)] font-medium text-sm transition-colors cursor-pointer"
              >
                {t('menu.close')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
