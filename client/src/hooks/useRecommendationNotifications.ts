import { useEffect, useRef } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

interface NotificationPayload {
  activityId: string;
  message: string;
}

/**
 * Subscribes to real-time AI recommendation notifications for a given userId.
 * Calls onNotification when a new recommendation is ready.
 */
export function useRecommendationNotifications(
  userId: string | null,
  onNotification: (payload: NotificationPayload) => void
) {
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!userId) return;

    const wsHost = import.meta.env.VITE_WS_HOST ?? 'http://localhost:8083';

    const client = new Client({
      webSocketFactory: () => new SockJS(`${wsHost}/ws`),
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(
          `/topic/recommendations/${userId}`,
          (msg: IMessage) => {
            try {
              const payload: NotificationPayload = JSON.parse(msg.body);
              onNotification(payload);
            } catch {
              // ignore malformed messages
            }
          }
        );
      },
      onStompError: (frame) => {
        console.warn('STOMP error:', frame.headers['message']);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
      clientRef.current = null;
    };
  }, [userId, onNotification]);
}
