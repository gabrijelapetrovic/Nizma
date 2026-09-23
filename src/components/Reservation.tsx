import React, { useState } from 'react';
import {
  Calendar,
  Sparkles,
  CheckCircle2,
  Phone,
  RotateCcw,
  AlertCircle,
} from 'lucide-react';
import { type ReservationFormData } from '../types';
import { ChatReserve } from './ChatReserve';
import { InstagramIcon } from './SocialIcons';
import { useLang } from '../i18n/useLang';
import { useContent } from '../content/useContent';
import { bookingSlotsForDate, firstBookableDate } from '../utils/hours';
import {
  hasInjectionPayload,
  isAllowedOption,
  isSafeLength,
  isValidBookingDate,
  isValidEmail,
  isValidPersonName,
  isValidPhone,
  sanitizeForSubmit,
  todayIsoDate,
} from '../utils/security';

export const Reservation: React.FC = () => {
  const { t } = useLang();
  const { content } = useContent();
  const openingDate = firstBookableDate(content.workingHours);
  const [formData, setFormData] = useState<ReservationFormData>({
    fullName: '',
    phone: '',
    email: '',
    date: openingDate,
    time: bookingSlotsForDate(openingDate, content.workingHours)[0] || '10:30',
    guests: 1,
    seatingArea: 'nails',
    specialRequests: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState('');

  const timeSlots = bookingSlotsForDate(formData.date, content.workingHours);

  const seatingOptions = [
    { id: 'any', label: t('zone.any') },
    { id: 'nails', label: t('zone.nails') },
    { id: 'lashes', label: t('zone.lashes') },
    { id: 'both', label: t('zone.both') },
  ] as const;

  const seatingIds = seatingOptions.map((o) => o.id);

  const validate = () => {
    const errs: Record<string, string> = {};

    if (hasInjectionPayload(formData.fullName) || hasInjectionPayload(formData.phone) || hasInjectionPayload(formData.email) || hasInjectionPayload(formData.specialRequests || '')) {
      errs.form = t('reserve.errXss');
    }

    const sanitizedName = sanitizeForSubmit(formData.fullName);
    const sanitizedPhone = sanitizeForSubmit(formData.phone);
    const sanitizedEmail = sanitizeForSubmit(formData.email);
    const sanitizedNotes = sanitizeForSubmit(formData.specialRequests || '');

    if (!sanitizedName) {
      errs.fullName = t('reserve.errName');
    } else if (!isValidPersonName(formData.fullName) || !isSafeLength(sanitizedName, 2, 80)) {
      errs.fullName = t('reserve.errNameFmt');
    }

    if (!sanitizedPhone) {
      errs.phone = t('reserve.errPhone');
    } else if (!isValidPhone(formData.phone)) {
      errs.phone = t('reserve.errPhoneFmt');
    }

    if (sanitizedEmail && !isValidEmail(formData.email)) {
      errs.email = t('reserve.errEmail');
    }

    if (!formData.date || !isValidBookingDate(formData.date)) {
      errs.date = t('reserve.errDate');
    }
    if (!timeSlots.length || !isAllowedOption(formData.time, timeSlots)) {
      errs.time = timeSlots.length ? t('reserve.errTime') : t('reserve.closedDay');
    }
    if (!isAllowedOption(formData.seatingArea, seatingIds)) {
      errs.seatingArea = t('reserve.errZone');
    }
    if (sanitizedNotes && !isSafeLength(sanitizedNotes, 1, 300)) {
      errs.specialRequests = t('reserve.errNotes');
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (honeypot.trim()) {
      setIsSubmitted(true);
      return;
    }

    if (!validate()) return;

    setIsLoading(true);

    const sanitizedFullName = sanitizeForSubmit(formData.fullName);
    const sanitizedPhone = sanitizeForSubmit(formData.phone);
    const sanitizedEmail = formData.email ? sanitizeForSubmit(formData.email).toLowerCase() : '';
    const sanitizedNotes = formData.specialRequests ? sanitizeForSubmit(formData.specialRequests) : '';
    const seatingLabel =
      seatingOptions.find((o) => o.id === formData.seatingArea)?.label || t('zone.any');

    const sanitizedPayload = {
      fullName: sanitizedFullName,
      phone: sanitizedPhone,
      email: sanitizedEmail,
      date: formData.date,
      time: formData.time,
      treatment: seatingLabel,
      specialRequests: sanitizedNotes,
      _subject: `Novi zahtev za termin — ${content.name}`,
    };

    const formspreeEndpoint =
      import.meta.env.VITE_FORMSPREE_ENDPOINT || 'https://formspree.io/f/mqazklow';

    try {
      const response = await fetch(formspreeEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(sanitizedPayload),
      });

      if (response.ok) {
        setFormData((prev) => ({
          ...prev,
          fullName: sanitizedFullName,
          phone: sanitizedPhone,
          email: sanitizedEmail,
          specialRequests: sanitizedNotes,
        }));
        setIsSubmitted(true);
      } else {
        setSubmitError(t('reserve.fail'));
      }
    } catch {
      setSubmitError(t('reserve.offline'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setSubmitError(null);
    setHoneypot('');
    setFormData({
      fullName: '',
      phone: '',
      email: '',
      date: openingDate,
      time: bookingSlotsForDate(openingDate, content.workingHours)[0] || '10:30',
      guests: 1,
      seatingArea: 'nails',
      specialRequests: '',
    });
    setErrors({});
  };

  return (
    <section id="reservation" className="py-20 bg-[var(--studio-sand)] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--studio-sand-dark)] text-[var(--studio-dark)] text-xs font-semibold uppercase tracking-wider mb-4">
              <Calendar className="w-3.5 h-3.5 text-[var(--studio-terracotta)]" />
              <span>{t('reserve.badge')}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--studio-dark)] mb-4">
              {t('reserve.title')}
            </h2>
            <p className="text-[var(--studio-muted)] text-base max-w-xl mx-auto">
              {t('reserve.subtitle')}
            </p>
            <div className="flex justify-center">
              <ChatReserve withInstagram />
            </div>
          </div>

          {/* Main Card */}
          <div className="bg-[var(--studio-card)] rounded-3xl shadow-xl border border-[var(--studio-border)] p-6 sm:p-10">
            {isSubmitted ? (
              /* Success State */
              <div className="text-center py-8 animate-in zoom-in-95 duration-300">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--studio-dark)] mb-2">
                  {t('reserve.successTitle')}
                </h3>
                <p className="text-[var(--studio-muted)] text-sm sm:text-base max-w-lg mx-auto mb-8">
                  {t('reserve.successBody')}
                </p>

                <div className="bg-[var(--studio-sand)]/60 rounded-2xl p-5 max-w-md mx-auto mb-8 text-left text-xs sm:text-sm border border-[var(--studio-border)] space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[var(--studio-muted)]">Ime:</span>
                    <span className="font-semibold text-[var(--studio-dark)]">{formData.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--studio-muted)]">Telefon:</span>
                    <span className="font-semibold text-[var(--studio-dark)]">{formData.phone}</span>
                  </div>
                  {formData.email && (
                    <div className="flex justify-between">
                      <span className="text-[var(--studio-muted)]">E-mail:</span>
                      <span className="font-semibold text-[var(--studio-dark)]">{formData.email}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-[var(--studio-muted)]">{t('reserve.zone')}:</span>
                    <span className="font-semibold text-[var(--studio-dark)]">
                      {seatingOptions.find((o) => o.id === formData.seatingArea)?.label}
                    </span>
                  </div>
                  {formData.specialRequests && (
                    <div className="flex justify-between">
                      <span className="text-[var(--studio-muted)]">Napomena:</span>
                      <span className="font-semibold text-[var(--studio-dark)]">{formData.specialRequests}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={handleReset}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--studio-terracotta)] text-white text-sm font-semibold hover:bg-[var(--studio-terracotta-hover)] transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{t('reserve.new')}</span>
                  </button>
                  <a
                    href={`tel:${content.phoneRaw}`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--studio-sand)] text-[var(--studio-dark)] text-sm font-semibold hover:bg-[var(--studio-sand-dark)] transition-all"
                  >
                    <Phone className="w-4 h-4 text-[var(--studio-terracotta)]" />
                    <span>{t('reserve.call')}: {content.phone}</span>
                  </a>
                  <a
                    href={content.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white text-sm font-semibold hover:opacity-90 transition-all"
                  >
                    <InstagramIcon className="w-4 h-4" />
                    <span>{t('cta.instagram')} {content.instagramHandle}</span>
                  </a>
                </div>
              </div>
            ) : (
              /* Form */
              <form onSubmit={handleSubmit} noValidate className="relative space-y-6">
                <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
                  <label htmlFor="reservation-company-url">Website</label>
                  <input
                    id="reservation-company-url"
                    name="company_url"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>
                {submitError && (
                  <div className="p-4 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2 border border-red-200">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}
                {errors.form && (
                  <div role="alert" className="p-4 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2 border border-red-200">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errors.form}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="fullName" className="block text-xs font-bold uppercase tracking-wider text-[var(--studio-dark)] mb-2">
                      Ime i Prezime *
                    </label>
                    <input
                      id="fullName"
                      name="name"
                      type="text"
                      autoComplete="name"
                      maxLength={80}
                      value={formData.fullName}
                      onChange={(e) => {
                        setFormData({ ...formData, fullName: e.target.value.slice(0, 80) });
                        if (errors.fullName) setErrors({ ...errors, fullName: '' });
                      }}
                      placeholder="npr. Marko Marković"
                      className={`w-full px-4 py-3 rounded-xl bg-[var(--studio-bg)] border text-sm text-[var(--studio-text)] focus:outline-none focus:ring-2 focus:ring-[var(--studio-terracotta)] transition-all ${
                        errors.fullName ? 'border-red-500 bg-red-50/30' : 'border-[var(--studio-border)]'
                      }`}
                    />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-[var(--studio-dark)] mb-2">
                      Broj Telefona *
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      maxLength={30}
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData({ ...formData, phone: e.target.value.slice(0, 30) });
                        if (errors.phone) setErrors({ ...errors, phone: '' });
                      }}
                      placeholder="npr. 069 159 6686"
                      className={`w-full px-4 py-3 rounded-xl bg-[var(--studio-bg)] border text-sm text-[var(--studio-text)] focus:outline-none focus:ring-2 focus:ring-[var(--studio-terracotta)] transition-all ${
                        errors.phone ? 'border-red-500 bg-red-50/30' : 'border-[var(--studio-border)]'
                      }`}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-[var(--studio-dark)] mb-2">
                    E-mail (opciono)
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    spellCheck={false}
                    maxLength={254}
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value.slice(0, 254) });
                      if (errors.email) setErrors({ ...errors, email: '' });
                    }}
                    placeholder="npr. gost@email.com"
                    aria-invalid={Boolean(errors.email)}
                    className={`w-full px-4 py-3 rounded-xl bg-[var(--studio-bg)] border text-sm text-[var(--studio-text)] focus:outline-none focus:ring-2 focus:ring-[var(--studio-terracotta)] transition-all ${
                      errors.email ? 'border-red-500 bg-red-50/30' : 'border-[var(--studio-border)]'
                    }`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Date */}
                  <div>
                    <label htmlFor="date" className="block text-xs font-bold uppercase tracking-wider text-[var(--studio-dark)] mb-2">
                      Datum *
                    </label>
                    <input
                      id="date"
                      name="date"
                      type="date"
                      min={todayIsoDate()}
                      value={formData.date}
                      onChange={(e) => {
                        const date = e.target.value;
                        const nextSlots = bookingSlotsForDate(date, content.workingHours);
                        setFormData({
                          ...formData,
                          date,
                          time: nextSlots.includes(formData.time) ? formData.time : nextSlots[0] || '',
                        });
                      }}
                      className={`w-full px-4 py-3 rounded-xl bg-[var(--studio-bg)] border text-sm text-[var(--studio-text)] focus:outline-none focus:ring-2 focus:ring-[var(--studio-terracotta)] transition-all ${
                        errors.date ? 'border-red-500 bg-red-50/30' : 'border-[var(--studio-border)]'
                      }`}
                    />
                    {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                  </div>

                  {/* Time Slot */}
                  <div>
                    <label htmlFor="time" className="block text-xs font-bold uppercase tracking-wider text-[var(--studio-dark)] mb-2">
                      Vreme *
                    </label>
                    <select
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[var(--studio-bg)] border border-[var(--studio-border)] text-sm text-[var(--studio-text)] focus:outline-none focus:ring-2 focus:ring-[var(--studio-terracotta)] transition-all"
                    >
                      {timeSlots.length ? (
                        timeSlots.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot} h
                          </option>
                        ))
                      ) : (
                        <option value="">{t('reserve.closedDay')}</option>
                      )}
                    </select>
                    {!timeSlots.length && (
                      <p className="text-[var(--studio-muted)] text-xs mt-1">{t('reserve.closedDay')}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--studio-dark)] mb-2">
                    {t('reserve.zone')}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                    {seatingOptions.map((opt) => {
                      const isSelected = formData.seatingArea === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, seatingArea: opt.id as ReservationFormData['seatingArea'] })}
                          className={`p-3 rounded-xl text-xs font-semibold text-center border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[var(--studio-dark)] text-white border-[var(--studio-dark)] shadow'
                              : 'bg-[var(--studio-bg)] text-[var(--studio-muted)] border-[var(--studio-border)] hover:bg-[var(--studio-sand)]'
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <label htmlFor="specialRequests" className="block text-xs font-bold uppercase tracking-wider text-[var(--studio-dark)] mb-2">
                    Posebne Napomene (Opciono)
                  </label>
                  <textarea
                    id="specialRequests"
                    name="specialRequests"
                    rows={3}
                    maxLength={300}
                    value={formData.specialRequests}
                    onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value.slice(0, 300) })}
                    placeholder={t('reserve.notesPh')}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--studio-bg)] border border-[var(--studio-border)] text-sm text-[var(--studio-text)] focus:outline-none focus:ring-2 focus:ring-[var(--studio-terracotta)] transition-all resize-none"
                  />
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 rounded-full bg-[var(--studio-terracotta)] hover:bg-[var(--studio-terracotta-hover)] text-white font-bold text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        <span>{t('reserve.submit')}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Quick Phone Call Footer */}
                <div className="text-center pt-4 border-t border-[var(--studio-border)]/60 text-xs text-[var(--studio-muted)]">
                  <span>{t('reserve.urgent')} </span>
                  <a
                    href={`tel:${content.phoneRaw}`}
                    className="font-bold text-[var(--studio-terracotta)] hover:underline ml-1"
                  >
                    {content.phone}
                  </a>
                  <span className="mx-2">·</span>
                  <a
                    href={content.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-[var(--studio-terracotta)] hover:underline"
                  >
                    {t('cta.instagram')} {content.instagramHandle}
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
