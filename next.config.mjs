/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // ✅ Ignore TypeScript build errors
    ignoreBuildErrors: true,
  },
  eslint: {
    // ✅ Ignore ESLint errors during builds
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
