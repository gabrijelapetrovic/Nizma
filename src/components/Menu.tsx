import React, { useState, useMemo } from 'react';
import {
  Coffee,
  GlassWater,
  Flame,
  Citrus,
  Wine,
  Sparkles,
  Search,
  X,
  Eye,
  Heart,
  Gem,
} from 'lucide-react';
import { MENU_CATEGORIES, MENU_ITEMS } from '../utils/constants';
import { type MenuItem } from '../types';
import { MenuItemModal } from './MenuItemModal';
import { cleanPlainText } from '../utils/security';
import { Image } from './Image';
import { IMAGE_SIZES } from '../utils/images';
import { useLang } from '../i18n/useLang';
import { useContent } from '../content/useContent';
import { applyMenuContent } from '../content/store';

export const Menu: React.FC = () => {
  const { t } = useLang();
  const { content } = useContent();
  const menuItems = useMemo(() => applyMenuContent(MENU_ITEMS, content), [content]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  // Icon mapping helper
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Eye':
        return <Eye className="w-4 h-4" />;
      case 'Heart':
        return <Heart className="w-4 h-4" />;
      case 'Gem':
        return <Gem className="w-4 h-4" />;
      case 'Coffee':
        return <Coffee className="w-4 h-4" />;
      case 'GlassWater':
        return <GlassWater className="w-4 h-4" />;
      case 'Flame':
        return <Flame className="w-4 h-4" />;
      case 'Citrus':
        return <Citrus className="w-4 h-4" />;
      case 'Wine':
        return <Wine className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  // Filter items with sanitized search query
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Category match
      const categoryMatch = activeCategory === 'all' || item.category === activeCategory;
      // Sanitized search match
      const query = cleanPlainText(searchQuery).toLowerCase();
      const searchMatch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.tags?.some((t) => t.toLowerCase().includes(query));
      // Tag match
      const tagMatch = !selectedTag || item.tags?.includes(selectedTag);

      return categoryMatch && searchMatch && tagMatch;
    });
  }, [menuItems, activeCategory, searchQuery, selectedTag]);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    menuItems.forEach((i) => i.tags?.forEach((tag) => tags.add(tag)));
    return Array.from(tags);
  }, [menuItems]);

  return (
    <section id="menu" className="py-20 bg-[var(--studio-bg)] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--studio-terracotta-light)] text-[var(--studio-terracotta)] text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('menu.badge')}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--studio-dark)] mb-4">
            {t('menu.title')}
          </h2>
          <p className="text-[var(--studio-muted)] text-base sm:text-lg">
            {t('menu.subtitle')}
          </p>
        </div>

        {/* Search & Tag Filter Bar */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--studio-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('menu.search')}
              className="w-full pl-12 pr-10 py-3.5 rounded-full bg-[var(--studio-card)] border border-[var(--studio-border)] text-[var(--studio-text)] text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--studio-terracotta)] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--studio-muted)] hover:text-[var(--studio-dark)]"
                aria-label="Obriši pretragu"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Filter Tags */}
          <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
            <span className="text-xs text-[var(--studio-muted)] font-medium">{t('menu.tags')}</span>
            {allTags.map((tag) => {
              const isSelected = selectedTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(isSelected ? null : tag)}
                  className={`px-2.5 py-1 rounded-full text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--studio-terracotta)] text-white font-medium'
                      : 'bg-[var(--studio-sand)] text-[var(--studio-muted)] hover:bg-[var(--studio-sand-dark)]'
                  }`}
                >
                  #{tag}
                </button>
              );
            })}
            {selectedTag && (
              <button
                onClick={() => setSelectedTag(null)}
                className="text-xs text-[var(--studio-terracotta)] hover:underline ml-1"
              >
                {t('menu.clearTag')}
              </button>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {MENU_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[var(--studio-dark)] text-white shadow-md'
                    : 'bg-[var(--studio-card)] text-[var(--studio-muted)] hover:bg-[var(--studio-sand)] border border-[var(--studio-border)]'
                }`}
              >
                <span className={isActive ? 'text-[var(--studio-gold)]' : 'text-[var(--studio-terracotta)]'}>
                  {getCategoryIcon(cat.iconName)}
                </span>
                <span>{t(`menu.cat.${cat.id}`)}</span>
              </button>
            );
          })}
        </div>

        {/* Menu Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-[var(--studio-card)] rounded-3xl border border-[var(--studio-border)] p-8 max-w-lg mx-auto">
            <Coffee className="w-12 h-12 text-[var(--studio-terracotta)] mx-auto mb-4 opacity-70" />
            <h3 className="font-serif text-xl font-bold text-[var(--studio-dark)] mb-2">
              {t('menu.emptyTitle')}
            </h3>
            <p className="text-[var(--studio-muted)] text-sm mb-6">
              {t('menu.emptyText')}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
                setSelectedTag(null);
              }}
              className="px-5 py-2.5 rounded-full bg-[var(--studio-terracotta)] text-white text-xs font-semibold shadow"
            >
              {t('menu.showAll')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="group bg-[var(--studio-card)] rounded-3xl overflow-hidden border border-[var(--studio-border)] shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
              >
                {/* Image Section */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[var(--studio-sand)]">
                  <Image
                    image={item.image}
                    sizes={IMAGE_SIZES.third}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-white text-xs font-medium flex items-center gap-1 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full">
                      <Eye className="w-3.5 h-3.5 text-[var(--studio-gold)]" />
                      <span>{t('menu.details')}</span>
                    </span>
                  </div>

                  {/* Price Tag */}
                  <div className="absolute top-3 right-3 bg-[var(--studio-dark)]/90 backdrop-blur-md text-[var(--studio-gold)] font-serif font-bold text-sm px-3 py-1 rounded-full shadow">
                    {item.price}
                  </div>

                  {/* Popular Badge */}
                  {item.popular && (
                    <div className="absolute top-3 left-3 bg-[var(--studio-terracotta)] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>{t('menu.hit')}</span>
                    </div>
                  )}
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {item.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] uppercase font-semibold text-[var(--studio-terracotta)] bg-[var(--studio-terracotta-light)] px-2 py-0.5 rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <h3 className="font-serif text-lg font-bold text-[var(--studio-dark)] mb-2 group-hover:text-[var(--studio-terracotta)] transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-[var(--studio-muted)] text-xs leading-relaxed line-clamp-2 mb-4">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[var(--studio-border)]/60 flex items-center justify-between text-xs text-[var(--studio-muted)]">
                    <span>{item.volume || t('menu.choice')}</span>
                    <span className="text-[var(--studio-terracotta)] font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      {t('menu.details')} &rarr;
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Item Detail Modal */}
      <MenuItemModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </section>
  );
};
