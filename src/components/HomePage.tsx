'use client';

import { lazy } from 'react';
import { type EventItem } from '../types';
import { useContent } from '../content/useContent';
import { scrollToSection } from '../utils/scrollToSection';
import { DeferredSection } from './DeferredSection';
import { FloatingDock } from './FloatingDock';
import { Footer } from './Footer';
import { Hero } from './Hero';
import { Navbar } from './Navbar';

const About = lazy(() => import('./About').then((m) => ({ default: m.About })));
const Experience = lazy(() => import('./Experience').then((m) => ({ default: m.Experience })));

const Menu = lazy(() => import('./Menu').then((m) => ({ default: m.Menu })));
const Events = lazy(() => import('./Events').then((m) => ({ default: m.Events })));
const Gallery = lazy(() => import('./Gallery').then((m) => ({ default: m.Gallery })));
const Reviews = lazy(() => import('./Reviews').then((m) => ({ default: m.Reviews })));
const Reservation = lazy(() => import('./Reservation').then((m) => ({ default: m.Reservation })));
const LocationContact = lazy(() =>
  import('./LocationContact').then((m) => ({ default: m.LocationContact })),
);

function ReviewsSection() {
  const { content } = useContent();
  if (!content.reviews.length) return null;
  return (
    <DeferredSection id="reviews">
      <Reviews />
    </DeferredSection>
  );
}

export function HomePage() {
  const handleSelectEvent = (event: EventItem) => {
    scrollToSection('#reservation');
    const fill = () => {
      const specialReq = document.getElementById('specialRequests') as HTMLTextAreaElement | null;
      if (!specialReq) return false;
      specialReq.value = `${event.title} (${event.date})`;
      specialReq.dispatchEvent(new Event('input', { bubbles: true }));
      return true;
    };
    if (fill()) return;
    const started = Date.now();
    const tick = () => {
      if (fill() || Date.now() - started > 5000) return;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  return (
    <div className="min-h-screen bg-[var(--studio-bg)] text-[var(--studio-text)] flex flex-col selection:bg-[var(--studio-terracotta)] selection:text-white">
      <Navbar onOpenReservation={() => scrollToSection('#reservation')} />
      <main className="flex-grow">
        <Hero onOpenMenu={() => scrollToSection('#menu')} onOpenReservation={() => scrollToSection('#reservation')} />
        <DeferredSection id="about">
          <About />
        </DeferredSection>
        <DeferredSection id="vibe">
          <Experience />
        </DeferredSection>
        <DeferredSection id="menu">
          <Menu onOpenReservation={() => scrollToSection('#reservation')} />
        </DeferredSection>
        <DeferredSection id="events">
          <Events onSelectEvent={handleSelectEvent} />
        </DeferredSection>
        <DeferredSection id="gallery">
          <Gallery />
        </DeferredSection>
        <ReviewsSection />
        <DeferredSection id="reservation">
          <Reservation />
        </DeferredSection>
        <DeferredSection id="contact">
          <LocationContact />
        </DeferredSection>
      </main>
      <Footer />
      <FloatingDock onReserve={() => scrollToSection('#reservation')} />
    </div>
  );
}
