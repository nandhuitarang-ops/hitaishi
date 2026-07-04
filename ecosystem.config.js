// PM2 process manager config for the Hostinger VPS deployment.
// See DEPLOY.md for the full runbook.
module.exports = {
  apps: [
    {
      name: "hitaishi-web",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      cwd: "/opt/hitaishi",
      instances: 2,
      exec_mode: "cluster",
      max_memory_restart: "1024M",
      env: { NODE_ENV: "production" },
      error_file: "/var/log/hitaishi/web.err.log",
      out_file: "/var/log/hitaishi/web.out.log",
      merge_logs: true,
    },
    // TODO(phase-2f): re-enable once workers/index.ts ships with BullMQ wiring.
    // {
    //   name: "hitaishi-workers",
    //   script: "workers/index.ts",
    //   interpreter: "node_modules/.bin/tsx",
    //   cwd: "/opt/hitaishi",
    //   instances: 1,
    //   max_memory_restart: "256M",
    //   env: { NODE_ENV: "production" },
    // },
  ],
};
