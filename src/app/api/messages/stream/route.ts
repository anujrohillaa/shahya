import { NextRequest } from 'next/server';
import { realtimeEmitter, RealtimeEvents } from '@/lib/realtime';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection heartbeat
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: 'CONNECTED', time: Date.now() })}\n\n`)
      );

      const onMessage = (msg: any) => {
        try {
          const json = JSON.stringify(msg);
          // Send both named event and default message for 100% listener compatibility
          controller.enqueue(encoder.encode(`event: message\ndata: ${json}\n\n`));
          controller.enqueue(encoder.encode(`data: ${json}\n\n`));
        } catch {
          // Stream closed
        }
      };

      const onNotification = (notif: any) => {
        try {
          const json = JSON.stringify(notif);
          controller.enqueue(encoder.encode(`event: notification\ndata: ${json}\n\n`));
        } catch {
          // Stream closed
        }
      };

      realtimeEmitter.on(RealtimeEvents.NEW_MESSAGE, onMessage);
      realtimeEmitter.on(RealtimeEvents.NEW_NOTIFICATION, onNotification);

      // Heartbeat interval to keep connection alive
      const interval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: ping ${Date.now()}\n\n`));
        } catch {
          clearInterval(interval);
        }
      }, 15000);

      req.signal.addEventListener('abort', () => {
        clearInterval(interval);
        realtimeEmitter.off(RealtimeEvents.NEW_MESSAGE, onMessage);
        realtimeEmitter.off(RealtimeEvents.NEW_NOTIFICATION, onNotification);
        try {
          controller.close();
        } catch {}
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
