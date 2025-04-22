/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        fs: false,
        http2: false,
        tls: false,
        dns: false,
        'utf-8-validate': false,
        'bufferutil': false
      };
    }
    return config;
  },
  images: {
    domains: ['img.clerk.com'],
  },
};

module.exports = nextConfig; 