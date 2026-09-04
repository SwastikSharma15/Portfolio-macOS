/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Allow production builds to successfully complete even if
    // your project has type errors during this migration phase.
    ignoreBuildErrors: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', '@gsap/react'],
  },
};

export default nextConfig;
