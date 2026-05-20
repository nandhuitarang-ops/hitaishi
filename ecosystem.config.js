// PM2 process manager config for the Hostinger VPS deployment.
// See DEPLOY.md for the full runbook.
module.exports = {
  apps: [
    {
      name: "mentoriit-web",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      cwd: "/opt/mentoriit",
      instances: 2,
      exec_mode: "cluster",
      max_memory_restart: "512M",
      env: { NODE_ENV: "production" },
      error_file: "/var/log/mentoriit/web.err.log",
      out_file: "/var/log/mentoriit/web.out.log",
      merge_logs: true,
    },
    // TODO(phase-2f): re-enable once workers/index.ts ships with BullMQ wiring.
    // {
    //   name: "mentoriit-workers",
    //   script: "workers/index.ts",
    //   interpreter: "node_modules/.bin/tsx",
    //   cwd: "/opt/mentoriit",
    //   instances: 1,
    //   max_memory_restart: "256M",
    //   env: { NODE_ENV: "production" },
    // },
  ],
};
