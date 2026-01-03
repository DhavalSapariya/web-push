import { body } from "express-validator";
import { handleValidationErrors } from "../index.validators";

const web_url = () =>
  body("web_url")
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage(`web_url is required`)
    .bail()
    .isString()
    .withMessage(`web_url must be a string`);

const web_urls = () =>
  body("web_urls")
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage(`web_urls is required`)
    .bail()
    .isArray()
    .withMessage(`web_urls must be an array`);

const web_object = () =>
  body("web_object")
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage(`web_object is required`)
    .bail()
    .isObject()
    .withMessage(`web_object must be an object`);

const endpoint = () =>
  body("web_object.endpoint")
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage(`endpoint is required`)
    .bail()
    .isString()
    .withMessage(`endpoint must be a string`);

const keys = () =>
  body("web_object.keys")
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage(`keys is required`)
    .bail()
    .isObject()
    .withMessage(`keys must be an object`);

export const SubscriptionValidators = [
  web_url(),
  web_object(),
  endpoint(),
  keys(),
  handleValidationErrors,
];

export const SubscriptionListValidators = [web_urls(), handleValidationErrors];

export const SendNotificationValidators = [web_urls(), handleValidationErrors];

const tokens = () =>
  body("tokens")
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage(`tokens is required`)
    .bail()
    .isArray()
    .withMessage(`tokens must be an array of strings`);

const topic = () =>
  body("topic")
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage(`topic is required`)
    .bail()
    .isString()
    .withMessage(`topic must be a string`);

const title = () =>
  body("title")
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage(`title is required`)
    .bail()
    .isString()
    .withMessage(`title must be a string`);

const notificationBody = () =>
  body("body")
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage(`body is required`)
    .bail()
    .isString()
    .withMessage(`body must be a string`);

const image = () =>
  body("image")
    .optional()
    .isString()
    .withMessage(`image must be a string (URL)`);

const data = () =>
  body("data").optional().isObject().withMessage(`data must be an object`);

const url = () =>
  body("url").optional().isString().withMessage(`url must be a string`);

export const SubscriptionTopicValidators = [
  tokens(),
  topic(),
  handleValidationErrors,
];

export const SendTopicNotificationValidators = [
  topic(),
  title(),
  notificationBody(),
  image(),
  data(),
  url(),
  handleValidationErrors,
];
