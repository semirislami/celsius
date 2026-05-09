/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.celsius.mk" },
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "*.supabase.in" }
    ]
  },
  async redirects() {
    return [
      { source: "/", destination: "/mk", permanent: false }
    ];
  }
};

export default nextConfig;
