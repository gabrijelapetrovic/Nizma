export const siteQuery = `*[_type == "site" && _id == "site"][0]{
  name,
  tagline,
  description,
  phone,
  phoneRaw,
  email,
  addressFull,
  instagramUrl,
  instagramHandle,
  facebookUrl,
  mapsUrl,
  mapsEmbed,
  whatsapp,
  "favicon": coalesce(favicon.asset->url, favicon.image.asset->url, favicon.imageUrl),
  workingHours,
  "images": images[]{
    key,
    "src": coalesce(image.asset->url, imageUrl)
  },
  menu[]{
    id,
    name,
    price,
    description,
    category,
    "imageSrc": coalesce(image.asset->url, imageUrl)
  },
  events[]{
    id,
    title,
    date,
    time,
    description,
    badge,
    "imageSrc": coalesce(image.asset->url, imageUrl)
  },
  gallery[]{
    id,
    title,
    category,
    "imageSrc": coalesce(image.asset->url, imageUrl)
  },
  reviews[]{
    id,
    name,
    role,
    comment,
    "imageSrc": coalesce(image.asset->url, imageUrl)
  },
  copy[]{ key, sr, en },
  theme
}`;
