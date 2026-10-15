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
  const openContact = () => scrollToSection('#contact');

  return (
    <div className="min-h-screen bg-[var(--studio-bg)] text-[var(--studio-text)] flex flex-col selection:bg-[var(--studio-terracotta)] selection:text-white">
      <Navbar onOpenReservation={openContact} />
      <main className="flex-grow">
        <Hero onOpenMenu={() => scrollToSection('#menu')} onOpenReservation={openContact} />
        <About />
        <Experience />
        <Menu onOpenReservation={openContact} />
        <Events onSelectEvent={() => openContact()} />
        <Gallery />
        <ReviewsSection />
        <LocationContact />
      </main>
      <Footer />
      <FloatingDock onReserve={openContact} />
    </div>
  );
}
