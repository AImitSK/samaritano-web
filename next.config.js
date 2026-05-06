/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  async redirects() {
    return [
      // Alte Pfade von samaritano.de → neue Struktur
      { source: '/magazin/faq', destination: '/faq', permanent: true },
    ]
  },
}

module.exports = nextConfig
