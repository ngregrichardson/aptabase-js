import { AptabaseOptions } from './types';

export { AptabaseOptions };

export function init(appKey: string, options?: AptabaseOptions) {
  globalThis.__APTABASE__ = { appKey, options };
}

// We only need the headers from the request object
type PartialRequest = Pick<Request, 'headers'>;

export async function trackEvent(
  req: PartialRequest,
  eventName: string,
  props?: Record<string, string | number | boolean>,
): Promise<void> {
  const { appKey } = globalThis.__APTABASE__ || {};

  if (!appKey) return Promise.resolve();

  const userAgent = req.headers.get('user-agent') ?? '';

  const body = JSON.stringify({
    timestamp: new Date().toISOString(),
    sessionId: 'CHANGE-THIS',
    eventName: eventName,
    systemProps: {
      isDebug: true,
      locale: 'en',
      appVersion: '',
      sdkVersion: globalThis.__APTABASE_SDK_VERSION__ ?? `aptabase-node@${process.env.PKG_VERSION}`,
    },
    props: props,
  });

  try {
    const response = await fetch('http://localhost:3000/api/v0/event', {
      method: 'POST',
      headers: {
        'User-Agent': userAgent,
        'Content-Type': 'application/json',
        'App-Key': appKey,
      },
      credentials: 'omit',
      body,
    });

    if (response.status >= 300) {
      const responseBody = await response.text();
      console.warn(`Failed to send event "${eventName}": ${response.status} ${responseBody}`);
    }
  } catch (e) {
    console.warn(`Failed to send event "${eventName}": ${e}`);
  }
}