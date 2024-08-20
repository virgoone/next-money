/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
// import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";
import { withContentlayer } from "next-contentlayer2";
import withNextIntl from "next-intl/plugin";

import("./env.mjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "meme-static.douni.one",
        port: "",
      },
      {
        protocol: "https",
        hostname: "no-person-static.douni.one",
        port: "",
      },
      {
        protocol: "https",
        hostname: "img.douni.one",
        port: "",
      },
    ],
  },

  experimental: {
    taint: true,
  },

  redirects() {
    return [
      {
        source: "/twitter",
        destination: "https://x.com/koyaguo",
        permanent: true,
      },
      {
        source: "/x",
        destination: "https://x.com/koyaguo",
        permanent: true,
      },
    ];
  },

  rewrites() {
    return [
      {
        source: "/feed",
        destination: "/feed.xml",
      },
      {
        source: "/rss",
        destination: "/feed.xml",
      },
      {
        source: "/rss.xml",
        destination: "/feed.xml",
      },
    ];
  },
  webpack: (config, { webpack }) => {
    // config.plugins.push(
    //   new webpack.IgnorePlugin({
    //     resourceRegExp: /^pg-native$|^cloudflare:sockets$|^onnxruntime-node$/,
    //   }),
    // );
    // config.plugins.push(
    //   new webpack.IgnorePlugin({
    //     resourceRegExp: /^onnxruntime-node$/,
    //     exclude: [/node:/],
    //   }),
    // );

    return config;
  },
};

// if (process.env.NODE_ENV === "development") {
//   await setupDevPlatform();
// }

export default withNextIntl()(withContentlayer(nextConfig));
