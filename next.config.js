const {
  createVanillaExtractPlugin,
  // eslint-disable-next-line
} = require('@vanilla-extract/next-plugin');
const withVanillaExtract = createVanillaExtractPlugin({ short: true });

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
      },
    ],
    unoptimized: false,
    imageSizes: [64, 384],
    deviceSizes: [768, 1920],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  reactStrictMode: true,
  webpack: (config) => {
    config.plugins.push(new VeliteWebpackPlugin());
    return config;
  },
};

module.exports = withVanillaExtract(nextConfig);

class VeliteWebpackPlugin {
  static started = false;
  apply(/** @type {import('webpack').Compiler} */ compiler) {
    // executed three times in nextjs
    // twice for the server (nodejs / edge runtime) and once for the client
    compiler.hooks.beforeCompile.tapPromise('VeliteWebpackPlugin', async () => {
      if (VeliteWebpackPlugin.started) return;
      VeliteWebpackPlugin.started = true;
      const dev = compiler.options.mode === 'development';
      const { build } = await import('velite');
      await build({ watch: dev, clean: !dev });
    });
  }
}
