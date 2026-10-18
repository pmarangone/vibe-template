/** NOTE: Next evaluates rewrites() at BUILD time and bakes the destination.
 * Production contract is fixed (web :3000, api 127.0.0.1:4000); the API_PORT
 * override exists only for local parallel runs and MUST be set at build time.
 * @type {import('next').NextConfig} */
const apiPort = process.env.API_PORT ?? "4000";
const nextConfig = {
  // Single public port: every /api/* call rewrites to loopback Hono.
  async rewrites() {
    return [{ source: "/api/:path*", destination: `http://127.0.0.1:${apiPort}/:path*` }];
  },
};
module.exports = nextConfig;
