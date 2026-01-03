import { NextFunction, Request, Response } from "express";
import { exceptions } from "../../config/ApiError";
import IndexUtilities from "../index.utilities";
import inquiryServices from "./web.services";

const { BadRequestException, HttpException } = exceptions;
const { sendResponse } = IndexUtilities;

class InquiryController {
  private async handleRequest(
    req: Request,
    res: Response,
    next: NextFunction,
    serviceFunction: () => Promise<any>,
    successMessage = ""
  ) {
    try {
      const result = await serviceFunction();
      res.status(200).json(sendResponse(200, result, successMessage));
    } catch (error: any) {
      next(new HttpException(error.message, error.statusCode || 500));
    }
  }

  subscribeToTopic = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tokens, topic } = req.body;

    return this.handleRequest(
      req,
      res,
      next,
      () => inquiryServices.subscribeToTopic(tokens, topic),
      "Subscribed to topic successfully"
    );
  };

  unsubscribeFromTopic = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tokens, topic } = req.body;

    return this.handleRequest(
      req,
      res,
      next,
      () => inquiryServices.unsubscribeFromTopic(tokens, topic),
      "Unsubscribed from topic successfully"
    );
  };

  sendTopicNotification = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { topic, title, body, image, data, url } = req.body;

    return this.handleRequest(
      req,
      res,
      next,
      () =>
        inquiryServices.sendTopicNotification(topic, title, body, image, url),
      "Notification sent to topic successfully"
    );
  };

  getTopicAnalytics = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    return this.handleRequest(
      req,
      res,
      next,
      () => inquiryServices.getTopicAnalytics(),
      "Topic analytics fetched successfully"
    );
  };

  createTopic = async (req: Request, res: Response, next: NextFunction) => {
    return this.handleRequest(
      req,
      res,
      next,
      () => inquiryServices.createTopic(req.body.name, req.body.description),
      "Topic created successfully"
    );
  };

  getTopics = async (req: Request, res: Response, next: NextFunction) => {
    return this.handleRequest(
      req,
      res,
      next,
      () => inquiryServices.getTopics(),
      "Topics fetched successfully"
    );
  };

  updateTopic = async (req: Request, res: Response, next: NextFunction) => {
    return this.handleRequest(
      req,
      res,
      next,
      () => inquiryServices.updateTopic(req.params.id, req.body),
      "Topic updated successfully"
    );
  };

  deleteTopic = async (req: Request, res: Response, next: NextFunction) => {
    return this.handleRequest(
      req,
      res,
      next,
      () => inquiryServices.deleteTopic(req.params.id),
      "Topic deleted successfully"
    );
  };
}

export default new InquiryController();
