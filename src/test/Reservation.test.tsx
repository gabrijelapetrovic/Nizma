import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Reservation } from '../components/Reservation';

describe('Reservation Component', () => {
  it('renders reservation form fields and submit button', () => {
    render(<Reservation />);
    expect(screen.getByText('Zakažite svoj dolazak')).toBeInTheDocument();
    expect(screen.getByLabelText(/Ime i Prezime/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Broj Telefona/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Datum/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Vreme/i)).toBeInTheDocument();
    expect(screen.getByText('Željeni tretman')).toBeInTheDocument();
    expect(screen.queryByLabelText(/Broj Osoba/i)).not.toBeInTheDocument();
    const igLinks = screen.getAllByRole('link', { name: /@nokti_trepavice_uzice/i });
    expect(igLinks.length).toBeGreaterThan(0);
    expect(igLinks[0]).toHaveAttribute(
      'href',
      expect.stringContaining('instagram.com/nokti_trepavice_uzice')
    );
  });

  it('shows validation errors when submitted empty', async () => {
    render(<Reservation />);
    const submitBtn = screen.getByRole('button', { name: /Pošalji zahtev za termin/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText('Molimo unesite vaše ime i prezime.')).toBeInTheDocument();
    expect(screen.getByText('Molimo unesite kontakt telefon.')).toBeInTheDocument();
  });

  it('submits successfully when required fields are filled', async () => {
    render(<Reservation />);
    const nameInput = screen.getByLabelText(/Ime i Prezime/i);
    const phoneInput = screen.getByLabelText(/Broj Telefona/i);
    const submitBtn = screen.getByRole('button', { name: /Pošalji zahtev za termin/i });

    fireEvent.change(nameInput, { target: { value: 'Nikola Tesla' } });
    fireEvent.change(phoneInput, { target: { value: '0641234567' } });

    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Zahtev je zabeležen/i)).toBeInTheDocument();
      expect(screen.getAllByText('Nikola Tesla').length).toBeGreaterThanOrEqual(1);
    });

    // Reset flow
    const resetBtn = screen.getByRole('button', { name: /Novi zahtev/i });
    fireEvent.click(resetBtn);

    expect(screen.getByLabelText(/Ime i Prezime/i)).toBeInTheDocument();
  });

  it('sends sanitized values and keeps the form open when Formspree rejects the request', async () => {
    const fetchMock = vi.mocked(globalThis.fetch);
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 422 }));
    render(<Reservation />);

    fireEvent.change(screen.getByLabelText(/Ime i Prezime/i), {
      target: { value: 'Marko Marković' },
    });
    fireEvent.change(screen.getByLabelText(/Broj Telefona/i), { target: { value: '0641234567' } });
    fireEvent.change(screen.getByLabelText(/E-mail/i), { target: { value: 'marko@nokti.rs' } });
    fireEvent.click(screen.getByRole('button', { name: /Pošalji zahtev za termin/i }));

    await waitFor(() => expect(screen.getByText(/Slanje rezervacije nije uspelo/i)).toBeInTheDocument());
    const lastCall = fetchMock.mock.calls[fetchMock.mock.calls.length - 1];
    const requestBody = JSON.parse(String(lastCall?.[1]?.body));
    expect(requestBody.fullName).toBe('Marko Marković');
    expect(requestBody.email).toBe('marko@nokti.rs');
    expect(requestBody.treatment).toBeTruthy();
    expect(requestBody.guests).toBeUndefined();
    expect(requestBody.time).not.toBe('22:30');
    expect(requestBody._subject).not.toContain('<script>');
    expect(screen.getByLabelText(/Ime i Prezime/i)).toBeInTheDocument();
  });

  it('rejects XSS payloads in reservation fields and does not submit', () => {
    const fetchMock = vi.mocked(globalThis.fetch);
    const callsBefore = fetchMock.mock.calls.length;
    render(<Reservation />);

    fireEvent.change(screen.getByLabelText(/Ime i Prezime/i), {
      target: { value: 'Marko<script>alert(1)</script>' },
    });
    fireEvent.change(screen.getByLabelText(/Broj Telefona/i), { target: { value: '0641234567' } });
    fireEvent.click(screen.getByRole('button', { name: /Pošalji zahtev za termin/i }));

    expect(screen.getByText(/nedozvoljene karaktere/i)).toBeInTheDocument();
    expect(fetchMock.mock.calls.length).toBe(callsBefore);
  });

  it('shows an email validation error for injected or malformed addresses', () => {
    render(<Reservation />);
    fireEvent.change(screen.getByLabelText(/Ime i Prezime/i), { target: { value: 'Nikola Tesla' } });
    fireEvent.change(screen.getByLabelText(/Broj Telefona/i), { target: { value: '0641234567' } });
    fireEvent.change(screen.getByLabelText(/E-mail/i), { target: { value: 'not-an-email' } });
    fireEvent.click(screen.getByRole('button', { name: /Pošalji zahtev za termin/i }));

    expect(screen.getByText(/ispravnu e-mail adresu/i)).toBeInTheDocument();
  });
});
