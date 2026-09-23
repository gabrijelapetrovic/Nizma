import { useState } from 'react';
import { compressImageFile, putPhoto } from '../content/imageStore';
import { useDisplaySrc } from '../utils/useDisplaySrc';
import { useLang } from '../i18n/useLang';

type AdminImageFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (src: string) => void;
  hint: string;
  /** Keep URL + upload closed until tapped so long lists scroll smoothly. */
  startClosed?: boolean;
};

export function AdminImageField({
  id,
  label,
  value,
  onChange,
  hint,
  startClosed = false,
}: AdminImageFieldProps) {
  const { t } = useLang();
  const [open, setOpen] = useState(!startClosed);
  const preview = useDisplaySrc(open ? value : '');
  const [error, setError] = useState<string | null>(null);
  const summary = value.startsWith('idb:') ? t('admin.imageOnDevice') : value;

  return (
    <div className="space-y-2">
      {label ? <p className="text-xs font-semibold">{label}</p> : null}
      {startClosed ? (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="text-xs font-semibold text-[var(--studio-terracotta)]"
        >
          {open ? t('admin.imageHide') : t('admin.imageToggle')}
          {!open && summary ? <span className="ml-2 font-normal text-[var(--studio-muted)] truncate max-w-[12rem] inline-block align-bottom">{summary}</span> : null}
        </button>
      ) : null}
      {open ? (
        <>
          {preview ? (
            <img
              src={preview}
              alt=""
              width={112}
              height={80}
              loading="lazy"
              decoding="async"
              className="h-20 w-28 rounded-xl object-cover border border-[var(--studio-border)]"
            />
          ) : null}
          <input
            className="w-full px-3 py-2 rounded-xl border border-[var(--studio-border)] text-xs"
            value={value.startsWith('idb:') ? '' : value}
            placeholder="https://…  ili ostavite prazno i odaberite fajl"
            onChange={(e) => {
              setError(null);
              onChange(e.target.value.trim());
            }}
          />
          <label className="block text-xs text-[var(--studio-terracotta)] font-semibold cursor-pointer">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                e.target.value = '';
                if (!file) return;
                try {
                  const blob = await compressImageFile(file);
                  await putPhoto(id, blob);
                  onChange(`idb:${id}`);
                  setError(null);
                } catch {
                  setError('Slika nije sačuvana. Probajte manji fajl.');
                }
              }}
            />
            {hint}
          </label>
          {error && <p className="text-xs text-red-600">{error}</p>}
        </>
      ) : null}
    </div>
  );
}
