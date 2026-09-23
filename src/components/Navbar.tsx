import React, { useState, useEffect } from 'react';
import { Menu, X, Calendar, Clock, Phone } from 'lucide-react';
import { InstagramIcon } from './SocialIcons';
import { LanguageToggle } from './LanguageToggle';
import { useLang } from '../i18n/useLang';
import { useContent } from '../content/useContent';
import { getVenueStatus } from '../utils/hours';
import { scrollToSection } from '../utils/scrollToSection';

interface NavbarProps {
  onOpenReservation?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenReservation }) => {
  const { t } = useLang();
  const { content } = useContent();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isOpenNow, setIsOpenNow] = useState(true);
  const [todayHours, setTodayHours] = useState('');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkOpenStatus = () => {
      const status = getVenueStatus(content.workingHours);
      setIsOpenNow(status.isOpen);
      setTodayHours(status.hoursLabel);
    };
    checkOpenStatus();
    const interval = setInterval(checkOpenStatus, 30000);
    return () => clearInterval(interval);
  }, [content.workingHours]);

  const navLinks = [
    { name: t('nav.about'), href: '#about' },
    { name: t('nav.menu'), href: '#menu' },
    { name: t('nav.gallery'), href: '#gallery' },
    { name: t('nav.location'), href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    scrollToSection(href);
  };

  const handleReservationClick = () => {
    setMobileMenuOpen(false);
    if (onOpenReservation) onOpenReservation();
    else scrollToSection('#reservation');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[var(--studio-bg)]/90 backdrop-blur-md shadow-sm border-b border-[var(--studio-border)]/60 py-3'
          : 'bg-gradient-to-b from-[var(--studio-dark)]/70 via-[var(--studio-dark)]/30 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 min-[360px]:px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2 min-w-0">
        <a
          href="#"
          className="flex items-center gap-2 min-[360px]:gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--studio-terracotta)] rounded-lg min-w-0"
          aria-label={t('nav.home')}
        >
          <div className="w-9 h-9 min-[360px]:w-10 min-[360px]:h-10 shrink-0 rounded-full bg-[var(--studio-terracotta)] text-white flex items-center justify-center font-serif text-xl font-bold shadow-md transform transition-transform group-hover:scale-105">
            {(content.name || 'N').trim().charAt(0)}
          </div>
          <div className="flex flex-col min-w-0">
            <span
              className={`font-serif text-base min-[360px]:text-lg sm:text-xl font-bold tracking-wider leading-none transition-colors ${
                isScrolled ? 'text-[var(--studio-text)]' : 'text-white'
              }`}
            >
              {(content.name.split(/[\s&]/)[0] || 'Nokti').toUpperCase()}
            </span>
            <span
              className={`hidden min-[360px]:block text-[10px] uppercase tracking-[0.2em] min-[380px]:tracking-[0.25em] font-medium transition-colors ${
                isScrolled ? 'text-[var(--studio-terracotta)]' : 'text-[var(--studio-gold)]'
              }`}
            >
              {t('nav.brandSub')}
            </span>
          </div>
        </a>

        <nav className="hidden lg:flex items-center space-x-7" aria-label={t('nav.aria')}>
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className={`text-sm font-medium transition-colors hover:text-[var(--studio-terracotta)] cursor-pointer focus:outline-none focus:underline ${
                isScrolled ? 'text-[var(--studio-text)]' : 'text-stone-100 hover:text-white'
              }`}
            >
              {link.name}
            </button>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <LanguageToggle light={!isScrolled} />

          <a
            href={`tel:${content.phoneRaw}`}
            className={`inline text-sm font-semibold tracking-wide ${
              isScrolled ? 'text-[var(--studio-text)]' : 'text-white'
            }`}
          >
            {content.phone}
          </a>

          <a
            href={content.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className={`p-2 rounded-full transition-all hover:scale-110 hover:text-[var(--studio-terracotta)] ${
              isScrolled ? 'text-[var(--studio-text)] bg-[var(--studio-sand)]/60' : 'text-white bg-white/10 backdrop-blur-sm'
            }`}
          >
            <InstagramIcon className="w-4 h-4" />
          </a>

          <button
            onClick={handleReservationClick}
            className="flex items-center gap-2 bg-[var(--studio-terracotta)] hover:bg-[var(--studio-terracotta-hover)] text-white text-xs md:text-sm font-semibold px-4 py-2.5 rounded-full shadow-sm hover:shadow-md transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>{t('cta.reserve')}</span>
          </button>
        </div>

        <div className="flex lg:hidden items-center gap-1.5">
          <a
            href={`tel:${content.phoneRaw}`}
            aria-label={content.phone}
            className={`p-2 rounded-lg ${isScrolled ? 'text-[var(--studio-text)]' : 'text-white'}`}
          >
            <Phone className="w-5 h-5" />
          </a>
          <LanguageToggle light={!isScrolled} />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-lg cursor-pointer ${isScrolled ? 'text-[var(--studio-text)]' : 'text-white'}`}
            aria-label={mobileMenuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-[var(--studio-bg)] border-b border-[var(--studio-border)] px-4 pt-3 pb-6 space-y-3 shadow-xl">
          <div className="flex items-center justify-between py-2 border-b border-[var(--studio-border)]/60 text-xs">
            <div className="flex items-center gap-2 text-[var(--studio-muted)]">
              <Clock className="w-3.5 h-3.5 text-[var(--studio-terracotta)]" />
              <span>
                {t('status.today')}: {todayHours}
              </span>
            </div>
            <span
              className={`px-2 py-0.5 rounded-full font-medium ${
                isOpenNow ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-700'
              }`}
            >
              {isOpenNow ? t('status.open') : t('status.closed')}
            </span>
          </div>

          <div className="flex flex-col space-y-2 pt-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-left py-2 px-3 text-[var(--studio-text)] hover:bg-[var(--studio-sand)] rounded-lg font-medium text-sm"
              >
                {link.name}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-[var(--studio-border)] flex flex-col min-[360px]:flex-row items-stretch min-[360px]:items-center justify-between gap-2 min-[360px]:gap-3">
            <a
              href={content.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-semibold text-[var(--studio-text)] bg-[var(--studio-sand)] px-3 py-2 rounded-lg min-w-0"
            >
              <InstagramIcon className="w-4 h-4 text-[var(--studio-terracotta)] shrink-0" />
              <span className="truncate">{content.instagramHandle}</span>
            </a>
            <button
              onClick={handleReservationClick}
              className="min-[360px]:flex-1 bg-[var(--studio-terracotta)] text-white text-xs font-semibold py-2 px-3 rounded-lg"
            >
              {t('cta.reserveNow')}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
