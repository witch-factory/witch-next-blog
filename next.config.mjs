import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';
import bundleAnalyzer from '@next/bundle-analyzer';
const withVanillaExtract = createVanillaExtractPlugin({
  debug: true,
});
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const isDev = process.argv.indexOf('dev') !== -1;
const isBuild = process.argv.indexOf('build') !== -1;
if (!process.env.VELITE_STARTED && (isDev || isBuild)) {
  process.env.VELITE_STARTED = '1';
  const { build } = await import('velite');
  await build({ watch: isDev, clean: !isDev });
}

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
};

export default withBundleAnalyzer(withVanillaExtract(nextConfig));
