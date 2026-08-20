import { NextRequest } from 'next/server';
import { realtimeEmitter, RealtimeEvents } from '@/lib/realtime';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Send initial heartbeat
      controller.enqueue(encoder.encode(`event: ping\ndata: ${JSON.stringify({ time: Date.now() })}\n\n`));

      const onMessage = (msg: any) => {
        try {
          controller.enqueue(encoder.encode(`event: message\ndata: ${JSON.stringify(msg)}\n\n`));
        } catch (e) {
          // Stream closed
        }
      };

      const onNotification = (notif: any) => {
        try {
          controller.enqueue(encoder.encode(`event: notification\ndata: ${JSON.stringify(notif)}\n\n`));
        } catch (e) {
          // Stream closed
        }
      };

      realtimeEmitter.on(RealtimeEvents.NEW_MESSAGE, onMessage);
      realtimeEmitter.on(RealtimeEvents.NEW_NOTIFICATION, onNotification);

      // Heartbeat interval
      const interval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`event: ping\ndata: ${Date.now()}\n\n`));
        } catch (e) {
          clearInterval(interval);
        }
      }, 25000);

      req.signal.addEventListener('abort', () => {
        clearInterval(interval);
        realtimeEmitter.off(RealtimeEvents.NEW_MESSAGE, onMessage);
        realtimeEmitter.off(RealtimeEvents.NEW_NOTIFICATION, onNotification);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}
