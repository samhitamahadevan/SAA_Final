/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Polyfill Node.js modules
      config.resolve.alias = {
        ...config.resolve.alias,
        net: require.resolve('./lib/browser-polyfills.ts'),
        fs: require.resolve('./lib/browser-polyfills.ts'),
        http2: require.resolve('./lib/browser-polyfills.ts'),
        tls: require.resolve('./lib/browser-polyfills.ts'),
        dns: require.resolve('./lib/browser-polyfills.ts'),
      };
      
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'utf-8-validate': false,
        'bufferutil': false
      };
    }
    // Add externals configuration
    config.externals = [...(config.externals || []), 'net', 'fs', 'http2'];
    return config;
  },
  images: {
    domains: ['img.clerk.com'],
  },
  transpilePackages: ['@vapi-ai/web', 'agent-base'],
};

module.exports = nextConfig; 