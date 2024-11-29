// next.config.js

module.exports = {
  async rewrites() {
    const ipAddress = process.env.API_IP_ADDRESS; // Read the IP address from the environment variable

    if (!ipAddress) {
      throw new Error("API_IP_ADDRESS environment variable is not set.");
    }

    return [
      {
        source: "/api/:path*",
        destination: `http://${ipAddress}/api/:path*`, // Use the IP address from the environment variable
      },
    ];
  },
};
