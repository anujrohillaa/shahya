import { EventEmitter } from 'events';

// Global event bus for real-time messages and notifications
const globalForEvents = globalThis as unknown as {
  realtimeEmitter: EventEmitter | undefined;
};

export const realtimeEmitter = globalForEvents.realtimeEmitter ?? new EventEmitter();
realtimeEmitter.setMaxListeners(200);

if (process.env.NODE_ENV !== 'production') globalForEvents.realtimeEmitter = realtimeEmitter;

export const RealtimeEvents = {
  NEW_MESSAGE: 'NEW_MESSAGE',
  NEW_NOTIFICATION: 'NEW_NOTIFICATION',
  TYPING_STATUS: 'TYPING_STATUS',
};

export function broadcastNewMessage(message: any) {
  realtimeEmitter.emit(RealtimeEvents.NEW_MESSAGE, message);
}

export function broadcastNotification(notification: any) {
  realtimeEmitter.emit(RealtimeEvents.NEW_NOTIFICATION, notification);
}
