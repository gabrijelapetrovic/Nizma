import { clearPhotos, getPhoto } from './imageStore';
import { collectPrivateImageIds, publicPhotoUrl, replacePrivateImageSrcs } from './privateImages';
import { forPublicPublish, type SiteContent } from './store';

type PublishOk = { ok: true; content: SiteContent };
type PublishFail = { ok: false; error: string };
export type PublishProgress = (done: number, total: number) => void;

async function blobToBase64(blob: Blob): Promise<string> {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let binary = '';
  const step = 0x8000;
  for (let i = 0; i < bytes.length; i += step) {
    binary += String.fromCharCode(...bytes.subarray(i, i + step));
  }
  return btoa(binary);
}

async function postPublish(body: Record<string, unknown>): Promise<{ ok: true; json: Record<string, unknown> } | PublishFail> {
  try {
    const response = await fetch('/api/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    let json: { error?: string; detail?: string; sha?: string; path?: string; url?: string } = {};
    try {
      json = (await response.json()) as typeof json;
    } catch {
      json = {};
    }
    if (!response.ok) {
      const code = json.error || `HTTP ${response.status}`;
      return { ok: false, error: json.detail ? `${code}: ${json.detail}` : code };
    }
    return { ok: true, json };
  } catch {
    return { ok: false, error: 'network' };
  }
}

export async function publishToGit(
  pin: string,
  content: SiteContent,
  onProgress?: PublishProgress
): Promise<PublishOk | PublishFail> {
  const ids = collectPrivateImageIds(content);
  const urls: Record<string, string> = {};

  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    onProgress?.(i, ids.length);
    const blob = await getPhoto(id);
    if (!blob) return { ok: false, error: 'missing_photo' };
    const path = publicPhotoUrl(id, blob.type);
    if (!path) return { ok: false, error: 'photo_name' };
    const data = await blobToBase64(blob);
    const uploaded = await postPublish({ pin, blob: { name: id, data } });
    if (!uploaded.ok) return uploaded;
    const remoteUrl = typeof uploaded.json.url === 'string' ? uploaded.json.url : `${path}?v=${Date.now()}`;
    urls[id] = remoteUrl;
  }
  if (ids.length) onProgress?.(ids.length, ids.length);

  const rewritten = replacePrivateImageSrcs(content, urls);
  const payload = forPublicPublish(rewritten);
  const published = await postPublish({ pin, content: payload });
  if (!published.ok) return published;
  await clearPhotos();
  return { ok: true, content: rewritten };
}
