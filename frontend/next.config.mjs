const backendUrl = new URL(process.env.BACKEND_URL || "http://127.0.0.1:3000");
if (!["http:", "https:"].includes(backendUrl.protocol)) {
  throw new Error("BACKEND_URL deve usar http ou https.");
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  async rewrites() {
    return [{
      source: "/api/backend/:path*",
      destination: `${backendUrl.toString().replace(/\/$/, "")}/:path*`,
    }];
  },
};

export default nextConfig;
