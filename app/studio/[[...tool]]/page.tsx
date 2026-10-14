'use client';

import { useEffect, useState, type ComponentType } from 'react';
import '../studio.css';
import type { Config } from 'sanity';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() || '';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || 'production';

export default function StudioPage() {
  const [Studio, setStudio] = useState<ComponentType<{ config: Config }> | null>(null);
  const [config, setConfig] = useState<Config | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!projectId) return;
    let cancelled = false;
    void Promise.all([import('next-sanity/studio'), import('../../../sanity.config')]).then(
      ([studio, loaded]) => {
        if (cancelled) return;
        setStudio(() => studio.NextStudio as ComponentType<{ config: Config }>);
        setConfig(loaded.default);
      },
      () => {
        if (!cancelled) setFailed(true);
      },
    );
    return () => {
      cancelled = true;
    };
  }, []);

  if (!projectId) {
    return (
      <main className="min-h-screen bg-[#FBF6F8] px-6 py-16 text-[#2C1822]">
        <div className="mx-auto max-w-xl">
          <p className="text-sm uppercase tracking-[0.2em] text-[#7A5564]">Sanity</p>
          <h1 className="mt-3 font-serif text-4xl text-[#2A1520]">Studio još nije povezan</h1>
          <p className="mt-4 leading-relaxed text-[#7A5564]">
            Javni sajt i dalje prikazuje isti tekst, slike i boje iz objavljenog sadržaja. Studio se otvara
            ovde čim u okruženje uđu ID projekta i dataset.
          </p>
          <ol className="mt-6 list-decimal space-y-2 pl-5 leading-relaxed">
            <li>Napravi nalog na sanity.io i novi projekat.</li>
            <li>Dataset: {dataset}.</li>
            <li>CORS origin: http://localhost:3000</li>
            <li>Token za čitanje i token za upis (Editor).</li>
            <li>Ubaci četiri vrednosti u .env.local i javi da mogu da nastavim.</li>
          </ol>
        </div>
      </main>
    );
  }

  if (failed) {
    return (
      <main className="min-h-screen bg-[#FBF6F8] px-6 py-16 text-[#2C1822]">
        <p>Studio se nije učitao. Proveri NEXT_PUBLIC_SANITY_PROJECT_ID i dataset.</p>
      </main>
    );
  }

  if (!Studio || !config) {
    return (
      <main className="min-h-screen bg-[#FBF6F8] px-6 py-16 text-[#2C1822]">
        <p>Studio se učitava…</p>
      </main>
    );
  }

  return <Studio config={config} />;
}
