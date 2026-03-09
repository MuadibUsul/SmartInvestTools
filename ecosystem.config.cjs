module.exports = {
  apps: [
    {
      name: "smartinvesttools",
      cwd: "/var/www/smartinvesttools",
      script: "npm",
      args: "run start",
      env: {
        NODE_ENV: "production",
        PORT: 3003,
      },
    },
  ],
};
