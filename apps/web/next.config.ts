import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["textract", "pdf-parse", "mammoth"],
};

export default nextConfig;
