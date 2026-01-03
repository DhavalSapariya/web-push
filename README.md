# Web Push & Firebase Topic Notifications API

This API supports standard Web Push and Firebase Cloud Messaging (FCM) Topic Notifications.

## Base URL

Prefix: `/api/web-push` (assuming standard route prefix, adjusted based on `server.ts` if needed, but relative paths documented below).

---

## 1. Subscribe to Topic

**Endpoint:** `POST /subscribe-topic`

Subscribe one or more FCM tokens to a specific topic.

**Request Body:**

```json
{
  "tokens": ["FCM_TOKEN_1", "FCM_TOKEN_2"],
  "topic": "news"
}
```

**Response Body (Success 200):**

```json
{
  "successCount": 2,
  "failureCount": 0,
  "errors": []
}
```

---

## 2. Unsubscribe from Topic

**Endpoint:** `POST /unsubscribe-topic`

Unsubscribe tokens from a topic.

**Request Body:**

```json
{
  "tokens": ["FCM_TOKEN_1"],
  "topic": "news"
}
```

**Response Body (Success 200):**

```json
{
  "successCount": 1,
  "failureCount": 0,
  "errors": []
}
```

---

## 3. Send Topic Notification

**Endpoint:** `POST /send-topic-notification`

Send a notification to all subscribers of a topic.

**Request Body:**

```json
{
  "topic": "news",
  "title": "Breaking News",
  "body": "This is important update!",
  "image": "https://example.com/image.png",
  "url": "https://yourdomain.com/news/123"
}
```

**Response Body (Success 200):**

```json
"projects/your-project-id/messages/1234567890"
```

_(Returns the Message ID string)_

---

## 4. Get Topic Analytics

**Endpoint:** `GET /analytics`

Get subscriber counts for all topics.

**Request Body:** `None`

**Response Body (Success 200):**

```json
[
  {
    "topic": "news",
    "subscribers": 150
  },
  {
    "topic": "promotions",
    "subscribers": 320
  }
]
```
