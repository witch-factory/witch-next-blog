import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';
import type { NextConfig } from 'next';

const withVanillaExtract = createVanillaExtractPlugin({
  unstable_turbopack: { mode: 'auto' },
});

const isDev = process.argv.includes('dev');
const isBuild = process.argv.includes('build');

if (!process.env.VELITE_STARTED && (isDev || isBuild)) {
  process.env.VELITE_STARTED = '1';
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  import('velite').then((m) => m.build({ watch: isDev, clean: !isDev }));
}

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
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
};

export default withVanillaExtract(nextConfig);
