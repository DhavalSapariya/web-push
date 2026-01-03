import { exceptions } from "../../config/ApiError";
import { prismaClient } from "../../server";
// @ts-ignore

const { BadRequestException } = exceptions;

class InquiryServices {
  async subscribeToTopic(tokens: string[], topic: string) {
    if (!tokens || tokens.length === 0) {
      throw new BadRequestException("Tokens are required");
    }
    if (!topic) {
      throw new BadRequestException("Topic is required");
    }

    // Persist to DB
    // Use Promise.all to handle multiple tokens concurrently
    await Promise.all(
      tokens.map(async (token) => {
        try {
          await prismaClient.topicSubscription.upsert({
            where: {
              token_topic: {
                token,
                topic,
              },
            },
            update: {}, // No update needed if exists
            create: {
              token,
              topic,
            },
          });
        } catch (error) {
          // Ignore unique constraint errors here if any race conditions occur
          console.error(
            `Error persisting subscription for token ${token}:`,
            error
          );
        }
      })
    );

    // Lazy load firebase to avoid circular dependencies if any, though regular import is fine here
    const firebase = require("../../config/firebase.configuration").default;
    return await firebase.subscribeToTopic(tokens, topic);
  }

  async unsubscribeFromTopic(tokens: string[], topic: string) {
    if (!tokens || tokens.length === 0) {
      throw new BadRequestException("Tokens are required");
    }
    if (!topic) {
      throw new BadRequestException("Topic is required");
    }

    // Remove from DB
    await prismaClient.topicSubscription.deleteMany({
      where: {
        topic: topic,
        token: { in: tokens },
      },
    });

    const firebase = require("../../config/firebase.configuration").default;
    return await firebase.unsubscribeFromTopic(tokens, topic);
  }

  async sendTopicNotification(
    topic: string,
    title: string,
    body?: string,
    image?: string,
    url?: string
  ) {
    if (!topic) {
      throw new BadRequestException("Topic is required");
    }
    const firebase = require("../../config/firebase.configuration").default;
    return await firebase.sendToTopic(
      topic,
      { title, body, imageUrl: image },
      url
    );
  }

  async getTopicAnalytics() {
    const analytics = await prismaClient.topicSubscription.groupBy({
      by: ["topic"],
      _count: {
        token: true,
      },
    });

    return analytics.map((item) => ({
      topic: item.topic,
      subscribers: item._count.token,
    }));
  }

  // Topic CRUD

  async createTopic(name: string, description?: string) {
    if (!name) throw new BadRequestException("Topic name is required");
    // Check if exists
    const existing = await prismaClient.topic.findUnique({
      where: { name },
    });
    if (existing) throw new BadRequestException("Topic already exists");

    return await prismaClient.topic.create({
      data: { name, description },
    });
  }

  async getTopics() {
    return await prismaClient.topic.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async updateTopic(id: string, data: { name?: string; description?: string }) {
    if (!id) throw new BadRequestException("Topic ID is required");
    return await prismaClient.topic.update({
      where: { id },
      data,
    });
  }

  async deleteTopic(id: string) {
    if (!id) throw new BadRequestException("Topic ID is required");
    // Optional: Delete related subscriptions?
    // For now just delete the topic
    return await prismaClient.topic.delete({
      where: { id },
    });
  }
}

export default new InquiryServices();
