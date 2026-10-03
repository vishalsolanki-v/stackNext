export const SITE_URL = "https://vishaldevflow.vercel.app";

export const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: "VishalDevFlow",
  url: SITE_URL,
  description:
    "A developer community for asking programming questions, sharing answers, and discovering useful knowledge.",
  publisher: {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "VishalDevFlow",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/images/site-logo.svg`,
    },
    sameAs: ["https://github.com/vishalsolanki-v"],
  },
};

export function serializeJsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
