import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

import {
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY,
  FIREBASE_PROJECT_ID,
} from "./env.configuration";
import logger from "./logger.configuration";

class Firebase {
  constructor() {
    try {
      if (getApps().length === 0) {
        initializeApp({
          credential: cert({
            projectId: FIREBASE_PROJECT_ID,
            privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
            clientEmail: FIREBASE_CLIENT_EMAIL,
          }),
        });

        logger.info("Firebase initialized successfully");
      }
    } catch (error: any) {
      logger.error(`Error initializing Firebase: ${error.message}`);
    }
  }

  async subscribeToTopic(tokens: string[], topic: string): Promise<any> {
    try {
      const response = await getMessaging().subscribeToTopic(tokens, topic);
      logger.info(`Successfully subscribed to topic: ${response.successCount}`);
      return response;
    } catch (error: any) {
      logger.error(`Error subscribing to topic: ${error.message}`);
      throw error;
    }
  }

  async unsubscribeFromTopic(tokens: string[], topic: string): Promise<any> {
    try {
      const response = await getMessaging().unsubscribeFromTopic(tokens, topic);
      logger.info(
        `Successfully unsubscribed from topic: ${response.successCount}`
      );
      return response;
    } catch (error: any) {
      logger.error(`Error unsubscribing from topic: ${error.message}`);
      throw error;
    }
  }

  async sendToTopic(
    topic: string,
    notification: { title: string; body?: string; imageUrl?: string },
    url?: string
  ): Promise<string> {
    try {
      // Clean up undefined values
      const cleanNotification = Object.fromEntries(
        Object.entries(notification).filter(([_, v]) => v != null)
      );

      const message: any = {
        topic: topic,
        notification: cleanNotification,
      };

      if (url) {
        message.webpush = {
          fcm_options: {
            link: url,
          },
        };
      }

      const response = await getMessaging().send(message);
      logger.info(`Successfully sent message: ${response}`);
      return response;
    } catch (error: any) {
      logger.error(`Error sending message: ${error.message}`);
      throw error;
    }
  }
}

export default new Firebase();
