export default {
    apps: [
      {
        name: "data-cleaning-server",
        script: "npm",
        args: "run start",
        env: {
          NODE_ENV: "production",
          PORT: 80,
        },
      },
    ],
  };
  