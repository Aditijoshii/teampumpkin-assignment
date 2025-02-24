/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['ui-avatars.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    API_URL: process.env.API_URL || 'http://localhost:5003/api',
    SOCKET_URL: process.env.SOCKET_URL || 'http://localhost:5003',
  },
}

module.exports = nextConfig