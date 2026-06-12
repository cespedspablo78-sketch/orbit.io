/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  async redirects() {
    return [
      // the mock app was removed — old tabs/links land on the waitlist
      { source: "/app", destination: "/launch", permanent: false },
      { source: "/app/:path*", destination: "/launch", permanent: false },
    ];
  },
};
