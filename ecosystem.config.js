module.exports = {
  apps: [
    {
      name: "the-ace-tour",
      script: "npm",
      args: "run start:next",
      cwd: "./",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: "8443",
      },
      output: "./logs/out.log",
      error: "./logs/error.log",
      log: "./logs/combined.log",
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
  ],
};
