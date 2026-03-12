const appName = process.env.APP_NAME || "smartinvesttools";
const cwd = process.env.APP_CWD || "/var/www/smartinvesttools/current";
const port = process.env.PORT || process.env.APP_PORT || "3010";

module.exports = {
  apps: [
    {
      name: appName,
      cwd,
      script: "server.js",
      env: {
        NODE_ENV: "production",
        PORT: port,
      },
    },
  ],
};
