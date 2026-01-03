import { Router } from "express";
import {
  ANALYTICS,
  SEND_TOPIC_NOTIFICATION,
  SUBSCRIBE_TOPIC,
  TOPIC,
  UNSUBSCRIBE_TOPIC,
} from "../../constants/endpoint.constants";
import inquiryController from "./web.controller";
import {
  SendTopicNotificationValidators,
  SubscriptionTopicValidators,
} from "./web.validators";

class WebRoutes {
  public router: Router = Router();

  constructor() {
    this.routes();
  }

  routes() {
    this.router.post(
      SUBSCRIBE_TOPIC,
      SubscriptionTopicValidators,
      inquiryController.subscribeToTopic
    );

    this.router.post(
      UNSUBSCRIBE_TOPIC,
      SubscriptionTopicValidators,
      inquiryController.unsubscribeFromTopic
    );

    this.router.post(
      SEND_TOPIC_NOTIFICATION,
      SendTopicNotificationValidators,
      inquiryController.sendTopicNotification
    );

    this.router.get(ANALYTICS, inquiryController.getTopicAnalytics);

    // Topic CRUD
    this.router.post(TOPIC, inquiryController.createTopic);
    this.router.get(TOPIC, inquiryController.getTopics);
    this.router.put(`${TOPIC}/:id`, inquiryController.updateTopic);
    this.router.delete(`${TOPIC}/:id`, inquiryController.deleteTopic);
  }
}

export default new WebRoutes().router;
