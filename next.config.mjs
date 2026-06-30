/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Supabase Storage public buckets (course images)
      { protocol: 'https', hostname: '*.supabase.co' },
      // Unsplash placeholder imagery used in the design before real assets land
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
};

export default nextConfig;
