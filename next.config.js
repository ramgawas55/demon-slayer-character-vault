const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [320, 420, 640, 750, 828, 1080, 1200, 1440, 1920, 2048, 2560, 2880, 3840, 5120],
    imageSizes: [256, 320, 360, 384, 480, 640],
    remotePatterns: [
      { protocol: "https", hostname: "public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "**.public.blob.vercel-storage.com" },
    ],
  },
}

module.exports = nextConfig
