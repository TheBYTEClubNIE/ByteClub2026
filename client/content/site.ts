export const SITE_URL = "https://byteclubnie.vercel.app";

export const INSTAGRAM_URL = "https://www.instagram.com/thebyteclubnie";

// Paste the WhatsApp community / Discord invite link here. While it's empty,
// the "Join" and "Get notified" buttons send people to Instagram instead.
export const COMMUNITY_URL = "";

export const JOIN_LINK = COMMUNITY_URL
  ? { href: COMMUNITY_URL, label: "Join the community chat", where: "in the community chat" }
  : { href: INSTAGRAM_URL, label: "Follow us on Instagram", where: "on Instagram" };
