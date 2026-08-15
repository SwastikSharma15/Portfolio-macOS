/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Allow production builds to successfully complete even if
    // your project has type errors during this migration phase.
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
