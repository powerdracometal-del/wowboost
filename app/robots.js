// app/robots.js
export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: 'https://www.wowboost.lat/sitemap.xml',
    host: 'https://www.wowboost.lat',
  };
}
