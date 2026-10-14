import { NextResponse } from 'next/server';
import { loadPublishedSiteContent } from '../../../src/content/loadPublished';

export const revalidate = 60;

export async function GET() {
  const content = await loadPublishedSiteContent();
  return NextResponse.json(content);
}
