'use client';

import type { ReactNode } from 'react';
import { ContentProvider } from '../content/ContentContext';
import { type SiteContent } from '../content/store';
import { LanguageProvider } from '../i18n/LanguageContext';

export function Providers({
  children,
  initialContent,
}: {
  children: ReactNode;
  initialContent?: SiteContent;
}) {
  return (
    <ContentProvider initialContent={initialContent}>
      <LanguageProvider>{children}</LanguageProvider>
    </ContentProvider>
  );
}
