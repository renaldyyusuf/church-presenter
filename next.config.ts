import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // No "standalone" — Vercel handles its own output format
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
}

export default nextConfig
