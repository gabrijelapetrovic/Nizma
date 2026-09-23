import { lazy, Suspense, useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Footer } from './components/Footer';
import { FloatingDock } from './components/FloatingDock';
import { DeferredSection } from './components/DeferredSection';
import { LanguageProvider } from './i18n/LanguageContext';
import { ContentProvider } from './content/ContentContext';
import { type EventItem } from './types';
import { scrollToSection } from './utils/scrollToSection';
import { useContent } from './content/useContent';

const About = lazy(() => import('./components/About').then((m) => ({ default: m.About })));
const Experience = lazy(() => import('./components/Experience').then((m) => ({ default: m.Experience })));
const Menu = lazy(() => import('./components/Menu').then((m) => ({ default: m.Menu })));
const Events = lazy(() => import('./components/Events').then((m) => ({ default: m.Events })));
const Gallery = lazy(() => import('./components/Gallery').then((m) => ({ default: m.Gallery })));
const Reviews = lazy(() => import('./components/Reviews').then((m) => ({ default: m.Reviews })));
const Reservation = lazy(() => import('./components/Reservation').then((m) => ({ default: m.Reservation })));
const LocationContact = lazy(() =>
  import('./components/LocationContact').then((m) => ({ default: m.LocationContact }))
);
const LegalPage = lazy(() => import('./pages/LegalPage').then((m) => ({ default: m.LegalPage })));
const AdminPage = lazy(() => import('./pages/AdminPage'));

function pageFromHash(hash: string) {
  const id = hash.replace('#', '').split('?')[0];
  if (id === 'admin') return 'admin';
  if (id === 'privacy') return 'privacy';
  if (id === 'terms') return 'terms';
  return 'home';
}

function ReviewsSection() {
  const { content } = useContent();
  if (!content.reviews.length) return null;
  return (
    <DeferredSection id="reviews">
      <Reviews />
    </DeferredSection>
  );
}

function HomeApp() {
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

function AppShell() {
  const [page, setPage] = useState(() => pageFromHash(window.location.hash));

  useEffect(() => {
    const onHash = () => setPage(pageFromHash(window.location.hash));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  if (page === 'privacy') {
    return (
      <Suspense fallback={<div className="min-h-screen bg-[var(--studio-sand)]" />}>
        <LegalPage kind="privacy" />
      </Suspense>
    );
  }
  if (page === 'terms') {
    return (
      <Suspense fallback={<div className="min-h-screen bg-[var(--studio-sand)]" />}>
        <LegalPage kind="terms" />
      </Suspense>
    );
  }
  if (page === 'admin') {
    return (
      <Suspense fallback={null}>
        <AdminPage />
      </Suspense>
    );
  }
  return <HomeApp />;
}

export default function App() {
  return (
    <LanguageProvider>
      <ContentProvider>
        <AppShell />
      </ContentProvider>
    </LanguageProvider>
  );
}
