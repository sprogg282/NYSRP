import { loadEnv, defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { createReportHandler } from './api/reports.js';

function reportApiPlugin(webhookUrl?: string): Plugin {
  const handleReport = createReportHandler(() => webhookUrl);
  return {
    name: 'nysrp-private-report-api',
    configureServer(server) {
      server.middlewares.use('/api/reports', (request, response, next) => {
        void handleReport(request, response).catch(next);
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const privateEnv = loadEnv(mode, process.cwd(), '');
  return { plugins: [react(), reportApiPlugin(privateEnv.DISCORD_REPORT_WEBHOOK_URL)] };
});
