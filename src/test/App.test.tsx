import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HomePage } from '../components/HomePage';
import { Providers } from '../components/Providers';

describe('App Landing Page Integration', () => {
  it('renders all main landing page sections and elements', async () => {
    render(
      <Providers>
        <HomePage />
      </Providers>,
    );

    expect(screen.getAllByText('NOKTI').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/trepavice/i).length).toBeGreaterThan(0);
    expect(await screen.findByText(/Naša priča/i, {}, { timeout: 5000 })).toBeInTheDocument();
    expect(await screen.findByText('Tri stvari, urađene do kraja')).toBeInTheDocument();
    expect(await screen.findByText('Usluge i cene', {}, { timeout: 8000 })).toBeInTheDocument();
    expect(await screen.findByText('Paketi i redovni dolasci', {}, { timeout: 5000 })).toBeInTheDocument();
    expect(await screen.findByText('Galerija detalja')).toBeInTheDocument();
    expect(await screen.findByText('Zakažite svoj dolazak')).toBeInTheDocument();
    expect(await screen.findByText('Kako izgleda termin')).toBeInTheDocument();
    expect(screen.queryByText('Utisci gostiju')).not.toBeInTheDocument();
    expect(await screen.findByText('Gde nas nalazite')).toBeInTheDocument();
    expect(await screen.findByRole('link', { name: /byeMyBrain/i })).toBeInTheDocument();
  });
});
