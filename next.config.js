/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['127.0.0.1', 'job.inminternational.uz'],
  },
  env: {
    NEXT_PUBLIC_API_URL: 'https://job.inminternational.uz',
  }
};

module.exports = nextConfig;
