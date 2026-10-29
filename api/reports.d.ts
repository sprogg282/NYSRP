declare const handler: (request: any, response: any) => Promise<void>;
export default handler;
export function createReportHandler(getWebhookUrl?: () => string | undefined): typeof handler;
