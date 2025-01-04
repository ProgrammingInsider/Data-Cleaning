  module.exports = {
    apps: [
      {
        name: "data-cleaning-server",
        script: "npm",
        args: "run start", 
        cwd: "/root/Data-Cleaning/server", 
        env: {
          NODE_ENV: "production",
          PORT: 80,
        },
      },
    ],
  };
  