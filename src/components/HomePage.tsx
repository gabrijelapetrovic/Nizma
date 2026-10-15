'use client';

import { useContent } from '../content/useContent';
import { scrollToSection } from '../utils/scrollToSection';
import { About } from './About';
import { Events } from './Events';
import { Experience } from './Experience';
import { FloatingDock } from './FloatingDock';
import { Footer } from './Footer';
import { Gallery } from './Gallery';
import { Hero } from './Hero';
import { LocationContact } from './LocationContact';
import { Menu } from './Menu';
import { Navbar } from './Navbar';
import { Reviews } from './Reviews';

function ReviewsSection() {
  const { content } = useContent();
  if (!content.reviews.length) return null;
  return <Reviews />;
}

export function HomePage() {
  return (
    <div className="min-h-screen bg-[var(--studio-bg)] text-[var(--studio-text)] flex flex-col selection:bg-[var(--studio-terracotta)] selection:text-white">
      <Navbar />
      <main className="flex-grow">
        <Hero onOpenMenu={() => scrollToSection('#menu')} />
        <About />
        <Experience />
        <Menu />
        <Events />
        <Gallery />
        <ReviewsSection />
        <LocationContact />
      </main>
      <Footer />
      <FloatingDock />
    </div>
  );
}
