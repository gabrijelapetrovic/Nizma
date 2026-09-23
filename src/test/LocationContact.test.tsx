import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LocationContact } from '../components/LocationContact';

describe('LocationContact Component', () => {
  it('renders contact details and location title', () => {
    render(<LocationContact />);
    expect(screen.getByText('Gde nas nalazite')).toBeInTheDocument();
    expect(screen.getByText('Adresa')).toBeInTheDocument();
    expect(screen.getByText('Telefon i termini')).toBeInTheDocument();
    expect(screen.getByText('Radno vreme')).toBeInTheDocument();
    expect(screen.getByText('Ponedeljak - Petak')).toBeInTheDocument();
    expect(screen.getByText('Subota')).toBeInTheDocument();
    expect(screen.queryByText('hours.monFri')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Prikaži mapu/i })).toBeInTheDocument();
    expect(screen.queryByTitle('Nokti & Trepavice — mapa')).not.toBeInTheDocument();
  });

  it('renders and toggles FAQ items', () => {
    render(<LocationContact />);
    expect(screen.getByText('Pre dolaska')).toBeInTheDocument();

    expect(screen.getByText(/Studio radi po jednom terminu/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText('Šta ako imam osetljivu kožu ili alergiju?'));
    expect(screen.getByText(/Recite pre tretmana/i)).toBeInTheDocument();
  });
});

