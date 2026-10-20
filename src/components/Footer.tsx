'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail } from 'lucide-react';
import { InstagramIcon, FacebookIcon } from './SocialIcons';
import { useLang } from '../i18n/useLang';
import { useContent } from '../content/useContent';

export const Footer: React.FC = () => {
  const { t } = useLang();
  const { content } = useContent();

  const navLinks = [
    { name: t('nav.about'), href: '#about' },
    { name: t('nav.menu'), href: '#menu' },
    { name: t('nav.gallery'), href: '#gallery' },
    { name: t('nav.location'), href: '#contact' },
  ];

  return (
    <footer className="bg-[var(--studio-dark)] text-stone-300 relative pt-12 sm:pt-16 pb-24 sm:pb-12 overflow-hidden">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--studio-gold)] via-[var(--studio-terracotta)] to-[var(--studio-gold)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4 Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-10 pb-8 md:pb-12 border-b border-white/10">
          
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-full bg-[var(--studio-terracotta)] text-white flex items-center justify-center font-serif text-xl font-bold shadow-md">
                {(content.name || 'N').trim().charAt(0)}
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-wider text-white block leading-none">
                  {(content.name.split(/[\s&]/)[0] || 'Nokti').toUpperCase()}
                </span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--studio-gold)] font-medium">
                  {t('nav.brandSub')}
                </span>
              </div>
            </div>

            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed mb-5 line-clamp-3 sm:line-clamp-none">
              {content.description}
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a
                href={content.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram profil"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[var(--studio-terracotta)] text-white flex items-center justify-center transition-all hover:scale-110"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href={content.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook stranica"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[var(--studio-terracotta)] text-white flex items-center justify-center transition-all hover:scale-110"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Quick Links */}
          <div className="lg:col-span-3">
            <h3 className="font-serif font-bold text-white text-base mb-4 tracking-wide">
              {t('footer.links')}
            </h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs sm:text-sm md:grid-cols-1 md:gap-y-2">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-stone-400 hover:text-[var(--studio-gold)] transition-colors inline-block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Contact & Hours */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="font-serif font-bold text-white text-base mb-4 tracking-wide">
              {t('footer.contact')}
            </h3>
            <div className="space-y-2.5 text-xs sm:text-sm text-stone-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[var(--studio-terracotta)] shrink-0 mt-0.5" />
                <span>{content.addressFull}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[var(--studio-terracotta)] shrink-0" />
                <a href={`tel:${content.phoneRaw}`} className="hover:text-white transition-colors">
                  {content.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[var(--studio-terracotta)] shrink-0" />
                <a href={`mailto:${content.email}`} className="hover:text-white transition-colors">
                  {content.email}
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar with Built By Ognjen Dabić linked to Portfolio */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-stone-400">
          <p className="leading-relaxed">
            &copy; {new Date().getFullYear()} {content.name}. {t('footer.rights')}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 sm:flex-wrap sm:justify-center sm:mr-20">
            <div className="flex items-center gap-4">
              <Link href="/studio" className="hover:text-[var(--studio-gold)]">
                {t('footer.admin')}
              </Link>
            </div>
            <span className="pr-14 sm:pr-0">
              Built by{' '}
              <a
                href="https://ognjendabic.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[var(--studio-gold)] hover:text-white transition-colors underline decoration-[var(--studio-gold)]/60 hover:decoration-white"
              >
                Ognjen Dabić
              </a>
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
