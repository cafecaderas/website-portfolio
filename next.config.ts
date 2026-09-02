import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // TODO: add a remotePatterns entry once the external asset host for
      // large media (photos/video/3D/audio) is chosen — see README §05.
    ],
  },
};

export default nextConfig;
