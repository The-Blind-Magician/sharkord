import { loadOrCreateVapidKeys } from "./vapid";
import webpush from "web-push";
import { logger } from '../logger';

const { publicKey, privateKey } = loadOrCreateVapidKeys();

class NotificationManager {
    
    getPublicKey(): string {
        return publicKey;
    }

    loadVapid() {
        webpush.setVapidDetails(
            "mailto:admin@example.com",
            publicKey,
            privateKey
        );
    }

    async sendNotification(subscription: webpush.PushSubscription, payload: string): Promise<void> {
        try {
            await webpush.sendNotification(subscription, payload);
            logger.info("Notification sent successfully");
        } catch (error) {
            logger.error("Error sending notification:", error);
        }
    }
}

export const notificationManager = new NotificationManager();
