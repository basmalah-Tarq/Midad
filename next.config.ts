import type { NextConfig } from "next";

// Built as plain static files (HTML/CSS/JS) so it can be hosted anywhere,
// including PHP-only hosts like InfinityFree and GitHub Pages. Book data is
// fetched in the visitor's browser from Gutendex and the Internet Archive.
//
// NEXT_PUBLIC_BASE_PATH serves the site from a sub-folder, e.g. "/Midad" for
// https://basmalah-tarq.github.io/Midad/. Leave it unset for a domain root.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  // /ar/ -> ar/index.html, which static hosts serve as a directory index.
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
