/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'profile.line-scdn.net', // LINE profile images
      'obs.line-scdn.net',     // LINE LIFF content
      'scdn.line-apps.com'     // LINE app content
    ],
  },
  reactStrictMode: true,
  eslint: {
    // ไม่ตรวจสอบ ESLint ตอน build
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig 