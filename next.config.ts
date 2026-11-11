import type { NextConfig } from "next";

// Built as plain static files (HTML/CSS/JS) so it can be hosted anywhere,
// including PHP-only hosts like InfinityFree. Book data is fetched in the
// visitor's browser from Gutendex and the Internet Archive.
const nextConfig: NextConfig = {
  output: "export",
  // /ar/ -> ar/index.html, which Apache serves as a directory index.
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
