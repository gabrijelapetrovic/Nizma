import { createHash, timingSafeEqual } from 'crypto';

const CONTENT_PATH = 'public/site-content.json';
const FALLBACK_PIN_HASH = '13b1f7ec5beaefc781e43a3b344371cd49923a8a05edd71844b92f56f6a08d38';

function header(req, name) {
  const value = req.headers?.[name] ?? req.headers?.[name.toLowerCase()];
  if (Array.isArray(value)) return value[0] || '';
  return value || '';
}

function isAllowedOrigin(req) {
  const origin = header(req, 'origin');
  if (!origin) return false;
  try {
    const host = new URL(origin).hostname;
    const vercel = (process.env.VERCEL_URL || '').replace(/^https?:\/\//, '');
    return (
      host === 'localhost' ||
      (Boolean(vercel) && host === vercel) ||
      host.endsWith('.vercel.app')
    );
  } catch {
    return false;
  }
}

function isSafeAdminPin(pin) {
  if (!pin || pin.length > 64) return false;
  return /^[\p{L}\p{N}!@#$%^&*._\-+=?]+$/u.test(pin);
}

function sha256Hex(value) {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}

function pinMatches(pin, expectedHex) {
  const incoming = Buffer.from(sha256Hex(pin), 'utf8');
  const expected = Buffer.from(String(expectedHex).toLowerCase(), 'utf8');
  if (incoming.length !== expected.length) return false;
  return timingSafeEqual(incoming, expected);
}

function readBody(req) {
  const raw = req.body;
  if (Buffer.isBuffer(raw)) {
    try {
      return JSON.parse(raw.toString('utf8'));
    } catch {
      return {};
    }
  }
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  }
  if (raw && typeof raw === 'object') return raw;
  return {};
}

function isPrivateSrc(src) {
  return typeof src === 'string' && (src.startsWith('idb:') || src.startsWith('blob:'));
}

function looksUnsafe(value) {
  return (
    /<[^>]*>/.test(value) ||
    /\bon[a-z]+\s*=/i.test(value) ||
    /(?:javascript|vbscript|data|file|blob)\s*:/i.test(value) ||
    /[\u0000]/.test(value)
  );
}

function sanitizeValue(value) {
  if (typeof value === 'string') {
    if (isPrivateSrc(value) || looksUnsafe(value)) return '';
    return value.slice(0, 4000);
  }
  if (Array.isArray(value)) return value.map(sanitizeValue);
  if (value && typeof value === 'object') {
    const out = {};
    for (const [key, child] of Object.entries(value)) {
      if (!/^[a-zA-Z0-9_-]+$/.test(key)) continue;
      out[key] = sanitizeValue(child);
    }
    return out;
  }
  if (typeof value === 'number' || typeof value === 'boolean') return value;
  return '';
}

function parseRepo(input) {
  const trimmed = String(input || '')
    .trim()
    .replace(/\.git$/i, '');
  const fromUrl = trimmed.match(/github\.com[/:]([^/]+)\/([^/]+)/i);
  if (fromUrl) return { owner: fromUrl[1], name: fromUrl[2] };
  const [owner, name] = trimmed.split('/');
  if (!owner || !name || trimmed.split('/').length !== 2) return null;
  return { owner, name };
}

function githubMessage(json) {
  if (!json || typeof json !== 'object') return '';
  const message = typeof json.message === 'string' ? json.message : '';
  return message.slice(0, 180);
}

async function githubJson(url, token, init) {
  const response = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'venue-cms',
      ...(init && init.headers ? init.headers : {}),
    },
  });
  const text = await response.text();
  let json;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { message: text };
  }
  return { ok: response.ok, status: response.status, json };
}

const MAX_PHOTO_BYTES = 1_200_000;

function sanitizePhotoName(name) {
  const base = String(name || '')
    .replace(/^idb:/i, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
  return base || null;
}

function sniffImage(buf) {
  if (
    buf.length >= 12 &&
    buf[0] === 0x52 &&
    buf[1] === 0x49 &&
    buf[2] === 0x46 &&
    buf[3] === 0x46 &&
    buf[8] === 0x57 &&
    buf[9] === 0x45 &&
    buf[10] === 0x42 &&
    buf[11] === 0x50
  ) {
    return { ext: 'webp', type: 'image/webp' };
  }
  if (buf.length >= 2 && buf[0] === 0xff && buf[1] === 0xd8) {
    return { ext: 'jpg', type: 'image/jpeg' };
  }
  if (buf.length >= 8 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
    return { ext: 'png', type: 'image/png' };
  }
  return null;
}

function decodePhoto(data) {
  if (typeof data !== 'string' || data.length > Math.ceil(MAX_PHOTO_BYTES * 1.4) + 32) return null;
  let buf;
  try {
    buf = Buffer.from(data, 'base64');
  } catch {
    return null;
  }
  if (!buf.length || buf.length > MAX_PHOTO_BYTES) return null;
  const kind = sniffImage(buf);
  if (!kind) return null;
  return { buf, kind };
}

async function putContentsFile(token, owner, name, branch, path, contentBase64, message) {
  const api = `https://api.github.com/repos/${owner}/${name}/contents/${path}`;
  const existing = await githubJson(`${api}?ref=${encodeURIComponent(branch)}`, token);
  const sha =
    existing.ok && existing.json && typeof existing.json === 'object' && existing.json.sha
      ? String(existing.json.sha)
      : undefined;
  return githubJson(api, token, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      content: contentBase64,
      branch,
      ...(sha ? { sha } : {}),
    }),
  });
}

async function listPhotoDir(token, owner, name, branch, dir) {
  const listed = await githubJson(
    `https://api.github.com/repos/${owner}/${name}/contents/${dir}?ref=${encodeURIComponent(branch)}`,
    token
  );
  if (!listed.ok || !Array.isArray(listed.json)) return [];
  return listed.json
    .filter((item) => item && item.type === 'file' && typeof item.path === 'string' && typeof item.sha === 'string')
    .map((item) => ({ path: String(item.path), sha: String(item.sha), name: String(item.name || '') }));
}

async function listPhotoFiles(token, owner, name, branch) {
  const current = await listPhotoDir(token, owner, name, branch, 'src/assets/photos');
  const legacy = await listPhotoDir(token, owner, name, branch, 'public/photos');
  return [...current, ...legacy];
}

function usedPhotoPaths(value, out) {
  if (typeof value === 'string') {
    const path = value.split('?')[0];
    const match = path.match(/^\/(?:assets\/)?photos\/([a-zA-Z0-9._-]+)$/);
    if (match) out.add(`src/assets/photos/${match[1]}`);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((child) => usedPhotoPaths(child, out));
    return;
  }
  if (value && typeof value === 'object') {
    Object.values(value).forEach((child) => usedPhotoPaths(child, out));
  }
}

async function deleteUnusedPhotos(token, owner, name, branch, published) {
  const used = new Set();
  usedPhotoPaths(published, used);
  const files = await listPhotoFiles(token, owner, name, branch);
  let removed = 0;
  for (const file of files) {
    if (removed >= 12) break;
    if (file.name === '.gitkeep' || used.has(file.path)) continue;
    if (file.path.startsWith('public/photos/') && used.has(`src/assets/photos/${file.name}`)) continue;
    const encoded = file.path
      .split('/')
      .map((part) => encodeURIComponent(part))
      .join('/');
    const del = await githubJson(`https://api.github.com/repos/${owner}/${name}/contents/${encoded}`, token, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `content: remove unused photo ${file.name}`,
        sha: file.sha,
        branch,
      }),
    });
    if (del.ok) removed += 1;
  }
  return removed;
}

function githubFail(res, result) {
  res.status(502).json({
    error: 'github_commit_failed',
    detail: githubMessage(result.json) || `GitHub ${result.status}`,
  });
}

export default async function handler(req, res) {
  try {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');
    res.setHeader('Allow', 'POST');

    if (req.method !== 'POST') {
      res.status(405).json({ error: 'method' });
      return;
    }
    if (!isAllowedOrigin(req)) {
      res.status(403).json({ error: 'origin' });
      return;
    }

    const token = (process.env.CMS_GITHUB_TOKEN || process.env.GITHUB_TOKEN || '').trim();
    const parsedRepo = parseRepo(process.env.GITHUB_REPO || '');
    if (!token || !parsedRepo) {
      res.status(503).json({ error: 'github_not_configured' });
      return;
    }

    const body = readBody(req);
    const pin = body.pin;
    if (typeof pin !== 'string' || !isSafeAdminPin(pin)) {
      res.status(401).json({ error: 'pin' });
      return;
    }

    const expected =
      (process.env.ADMIN_PIN_HASH || process.env.VITE_ADMIN_PIN_HASH || FALLBACK_PIN_HASH).trim().toLowerCase();
    if (!/^[a-f0-9]{64}$/.test(expected) || !pinMatches(pin, expected)) {
      res.status(401).json({ error: 'pin' });
      return;
    }

    const { owner, name } = parsedRepo;
    const repoInfo = await githubJson(`https://api.github.com/repos/${owner}/${name}`, token);
    if (!repoInfo.ok) {
      res.status(502).json({
        error: 'github_commit_failed',
        detail:
          githubMessage(repoInfo.json) ||
          `GitHub ${repoInfo.status}: token ne vidi ${owner}/${name}. Fine-grained PAT mora biti za TAJ repo (Contents Read and write + Metadata Read).`,
      });
      return;
    }
    const branch =
      (process.env.GITHUB_BRANCH || '').trim() ||
      (typeof repoInfo.json.default_branch === 'string' ? repoInfo.json.default_branch : 'master');

    if (body.blob && typeof body.blob === 'object') {
      const photoName = sanitizePhotoName(body.blob.name);
      const decoded = decodePhoto(body.blob.data);
      if (!photoName || !decoded) {
        res.status(400).json({ error: 'photo' });
        return;
      }
      const file = `${photoName}.${decoded.kind.ext}`;
      const path = `src/assets/photos/${file}`;
      const putPhoto = await putContentsFile(
        token,
        owner,
        name,
        branch,
        path,
        decoded.buf.toString('base64'),
        `content: photo ${file}`
      );
      if (!putPhoto.ok) {
        githubFail(res, putPhoto);
        return;
      }
      res.status(200).json({
        ok: true,
        path,
        url: `/assets/photos/${file}?v=${Date.now()}`,
      });
      return;
    }

    const published = sanitizeValue(body.content ?? {});
    const file = `${JSON.stringify(published, null, 2)}\n`;
    if (file.length > 400_000) {
      res.status(413).json({ error: 'too_large' });
      return;
    }

    const apiFile = `https://api.github.com/repos/${owner}/${name}/contents/${CONTENT_PATH}`;
    const existing = await githubJson(`${apiFile}?ref=${encodeURIComponent(branch)}`, token);
    if (existing.status === 401 || existing.status === 403) {
      res.status(502).json({
        error: 'github_commit_failed',
        detail: githubMessage(existing.json) || `GitHub ${existing.status}: token nema Contents Read and write na ${owner}/${name}`,
      });
      return;
    }

    const sha =
      existing.ok && existing.json && typeof existing.json === 'object' && 'sha' in existing.json
        ? String(existing.json.sha)
        : undefined;

    const put = await githubJson(apiFile, token, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'content: publish from admin panel',
        content: Buffer.from(file, 'utf8').toString('base64'),
        branch,
        ...(sha ? { sha } : {}),
      }),
    });

    if (!put.ok) {
      res.status(502).json({
        error: 'github_commit_failed',
        detail: githubMessage(put.json) || `GitHub ${put.status} na grani ${branch}`,
      });
      return;
    }

    await deleteUnusedPhotos(token, owner, name, branch, published);
    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(502).json({
      error: 'github_commit_failed',
      detail: err instanceof Error ? err.message.slice(0, 180) : 'handler',
    });
  }
};
