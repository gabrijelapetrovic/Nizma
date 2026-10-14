import { Suspense, useEffect, useRef, useState, type ReactNode } from 'react';
import { onNeedSection } from '../utils/scrollToSection';
import { isTestMode } from '../utils/publicEnv';

type DeferredSectionProps = {
  id: string;
  children: ReactNode;
};

/** Load a below-fold chunk when it nears the viewport or when a nav link asks for it. */
export function DeferredSection({ id, children }: DeferredSectionProps) {
  const selector = `#${id}`;
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(() => isTestMode());

  useEffect(() => {
    if (ready) return;
    const activate = () => setReady(true);
    if (window.location.hash === selector) activate();
    const stopNeed = onNeedSection((next) => {
      if (next === selector) activate();
    });
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      activate();
      return stopNeed;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          activate();
          io.disconnect();
        }
      },
      {
        rootMargin: window.matchMedia('(min-width: 641px)').matches ? '80px 0px' : '280px 0px',
        threshold: 0.01,
      }
    );
    io.observe(node);
    return () => {
      io.disconnect();
      stopNeed();
    };
  }, [ready, selector]);

  return (
    <div ref={ref} id={ready ? undefined : id}>
      {ready ? <Suspense fallback={null}>{children}</Suspense> : <div className="min-h-[50vh]" aria-hidden />}
    </div>
  );
}
