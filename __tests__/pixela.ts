import nock, { Scope } from "nock";

import Pixela from "../src";

beforeAll(() => {
  nock.disableNetConnect();
});

beforeEach(() => {
  if (!nock.isActive()) nock.activate();
});

describe("pixela", () => {
  const PIXELA_DOMAIN = "https://pixe.la";
  const PIXELA_GRAPH_ID = "test-graph";
  const PIXELA_USER_TOKEN = "THIS_IS_SECRET";
  const PIXELA_USER_NAME = "test-user";

  let client: Pixela;

  beforeAll(() => (client = new Pixela(PIXELA_USER_NAME, PIXELA_USER_TOKEN)));

  //#region User

  describe("createUser", () => {
    let scope: Scope;

    // https://docs.pixe.la/entry/post-user
    beforeAll(() => {
      scope = nock(PIXELA_DOMAIN)
        .post("/v1/users", { token: PIXELA_USER_TOKEN, username: PIXELA_USER_NAME, agreeTermsOfService: "yes", notMinor: "yes", thanksCode: "ThisIsThanksCode" })
        .reply(200, { message: "Success.", isSuccess: true });
    });

    it("successful", async () => {
      await client.createUser({ agreeTermsOfService: true, notMinor: true, thanksCode: "ThisIsThanksCode" });
      expect(scope.isDone()).toBe(true);
    });
  });

  describe("updateUser", () => {
    let scope: Scope;

    // https://docs.pixe.la/entry/put-user
    beforeAll(() => {
      scope = nock(PIXELA_DOMAIN)
        .put(`/v1/users/${PIXELA_USER_NAME}`, { newToken: PIXELA_USER_TOKEN, thanksCode: "THIS_IS_THANKS_CODE" })
        .matchHeader("X-USER-TOKEN", PIXELA_USER_TOKEN)
        .reply(200, { message: "Success.", isSuccess: true });
    });

    it("successful", async () => {
      await client.updateUser({ newToken: PIXELA_USER_TOKEN, thanksCode: "THIS_IS_THANKS_CODE" });
      expect(scope.isDone()).toBe(true);
    });
  });

  describe("deleteUser", () => {
    let scope: Scope;

    // https://docs.pixe.la/entry/delete-user
    beforeAll(() => {
      scope = nock(PIXELA_DOMAIN)
        .delete(`/v1/users/${PIXELA_USER_NAME}`)
        .matchHeader("X-USER-TOKEN", PIXELA_USER_TOKEN)
        .reply(200, { message: "Success.", isSuccess: true });
    });

    it("successful", async () => {
      await client.deleteUser();
      expect(scope.isDone()).toBe(true);
    });
  });

  //#endregion

  //#region Channel

  describe("createChannel", () => {
    let scope: Scope;

    // https://docs.pixe.la/entry/post-channel
    beforeAll(() => {
      scope = nock(PIXELA_DOMAIN)
        .post(`/v1/users/${PIXELA_USER_NAME}/channels`, {
          id: "my-channel",
          name: "My slack channel",
          type: "slack",
          detail: { url: "https://hooks.slack.com/services/T035DA4QD/B06LMAV40/xxxx", userName: "Pixela Notification", channelName: "pixela-notify" }
        })
        .matchHeader("X-USER-TOKEN", PIXELA_USER_TOKEN)
        .reply(200, { message: "Success.", isSuccess: true });
    });

    it("successful", async () => {
      await client.createChannel({
        id: "my-channel",
        name: "My slack channel",
        type: "slack",
        detail: { url: "https://hooks.slack.com/services/T035DA4QD/B06LMAV40/xxxx", userName: "Pixela Notification", channelName: "pixela-notify" }
      });
      expect(scope.isDone()).toBe(true);
    });
  });

  describe("getChannels", () => {
    let scope: Scope;

    // https://docs.pixe.la/entry/get-channels
    beforeAll(() => {
      scope = nock(PIXELA_DOMAIN)
        .get(`/v1/users/${PIXELA_USER_NAME}/channels`)
        .matchHeader("X-USER-TOKEN", PIXELA_USER_TOKEN)
        .reply(200, {
          channels: [
            {
              id: "my-channel",
              name: "My slack channel",
              type: "slack",
              detail: { url: "https://hooks.slack.com/services/T035DA4QD/B06LMAV40/xxxx", userName: "Pixela Notification", channelName: "pixela-notify" }
            }
          ]
        });
    });

    it("successful", async () => {
      await client.getChannels();
      expect(scope.isDone()).toBe(true);
    });
  });

  describe("updateChannel", () => {
    let scope: Scope;

    // https://docs.pixe.la/entry/put-channel
    beforeAll(() => {
      scope = nock(PIXELA_DOMAIN)
        .put(`/v1/users/${PIXELA_USER_NAME}/channels/my-channel`, {
          name: "My slack channel",
          type: "slack",
          detail: { url: "https://hooks.slack.com/services/T035DA4QD/B06LMAV40/xxxx", userName: "Pixela Notification", channelName: "pixela-notify" }
        })
        .matchHeader("X-USER-TOKEN", PIXELA_USER_TOKEN)
        .reply(200, { message: "Success.", isSuccess: true });
    });

    it("successful", async () => {
      await client.updateChannel({
        channelId: "my-channel",
        name: "My slack channel",
        type: "slack",
        detail: { url: "https://hooks.slack.com/services/T035DA4QD/B06LMAV40/xxxx", userName: "Pixela Notification", channelName: "pixela-notify" }
      });
      expect(scope.isDone()).toBe(true);
    });
  });

  describe("deleteChannel", () => {
    let scope: Scope;

    // https://docs.pixe.la/entry/delete-channel
    beforeAll(() => {
      scope = nock(PIXELA_DOMAIN)
        .delete(`/v1/users/${PIXELA_USER_NAME}/channels/my-channel`)
        .matchHeader("X-USER-TOKEN", PIXELA_USER_TOKEN)
        .reply(200, { message: "Success.", isSuccess: true });
    });

    it("successful", async () => {
      await client.deleteChannel({ channelId: "my-channel" });
      expect(scope.isDone()).toBe(true);
    });
  });

  //#endregion

  //#region Graph

  describe("createGraph", () => {
    let scope: Scope;

    // https://docs.pixe.la/entry/post-graph
    beforeAll(() => {
      scope = nock(PIXELA_DOMAIN)
        .post(`/v1/users/${PIXELA_USER_NAME}/graphs`, {
          id: PIXELA_GRAPH_ID,
          name: "graph-name",
          unit: "commit",
          type: "int",
          color: "shibafu",
          timezone: "Asia/Tokyo",
          isSecret: true,
          publishOptionalData: true
        })
        .matchHeader("X-USER-TOKEN", PIXELA_USER_TOKEN)
        .reply(200, { message: "Success.", isSuccess: true });
    });

    it("successful", async () => {
      await client.createGraph({
        id: PIXELA_GRAPH_ID,
        name: "graph-name",
        unit: "commit",
        type: "int",
        color: "shibafu",
        timezone: "Asia/Tokyo",
        isSecret: true,
        publishOptionalData: true
      });
      expect(scope.isDone()).toBe(true);
    });
  });

  describe("getGraphs", () => {
    let scope: Scope;

    // https://docs.pixe.la/entry/get-graph
    beforeAll(() => {
      scope = nock(PIXELA_DOMAIN)
        .get(`/v1/users/${PIXELA_USER_NAME}/graphs`)
        .matchHeader("X-USER-TOKEN", PIXELA_USER_TOKEN)
        .reply(200, {
          graphs: [
            {
              id: "${PIXELA_GRAPH_ID}",
              name: "graph-name",
              unit: "commit",
              type: "int",
              color: "shibafu",
              timezone: "Asia/Tokyo",
              purgeCacheURLs: ["https://camo.githubusercontent.com/xxx/xxxx"],
              selfSufficient: "increment",
              isSecret: false,
              publishOptionalData: true
            }
          ]
        });
    });

    it("successful", async () => {
      await client.getGraphs();
      expect(scope.isDone()).toBe(true);
    });
  });

  describe("getGraphSvg", () => {
    let scope: Scope;

    // https://docs.pixe.la/entry/get-svg
    beforeAll(() => {
      scope = nock(PIXELA_DOMAIN)
        .get(`/v1/users/${PIXELA_USER_NAME}/graphs/${PIXELA_GRAPH_ID}`)
        .query({ date: "20180331", mode: "short" })
        .matchHeader("X-USER-TOKEN", PIXELA_USER_TOKEN)
        .reply(200, "");
    });

    it("successful", async () => {
      await client.getGraphSvg({ graphId: PIXELA_GRAPH_ID, date: "20180331", mode: "short" });
      expect(scope.isDone()).toBe(true);
    });
  });

  describe("getStats", () => {
    let scope: Scope;

    // https://docs.pixe.la/entry/get-graph-stats
    beforeAll(() => {
      scope = nock(PIXELA_DOMAIN)
        .get(`/v1/users/${PIXELA_USER_NAME}/graphs/${PIXELA_GRAPH_ID}/stats`)
        .matchHeader("X-USER-TOKEN", PIXELA_USER_TOKEN)
        .reply(200, {
          totalPixelsCount: 4,
          maxQuantity: 7,
          minQuantity: 4,
          totalQuantity: 25,
          avgQuantity: 6.25,
          todaysQuantity: 3
        });
    });

    it("successful", async () => {
      await client.getStats(PIXELA_GRAPH_ID);
      expect(scope.isDone()).toBe(true);
    });
  });

  describe("updateGraph", () => {
    let scope: Scope;

    // https://docs.pixe.la/entry/put-graph
    beforeAll(() => {
      scope = nock(PIXELA_DOMAIN)
        .put(`/v1/users/${PIXELA_USER_NAME}/graphs/${PIXELA_GRAPH_ID}`, {
          name: "graph-name",
          unit: "commit",
          color: "shibafu",
          timezone: "Asia/Tokyo",
          purgeCacheURLs: ["https://camo.githubusercontent.com/xxx/xxxx"],
          publishOptionalData: true
        })
        .matchHeader("X-USER-TOKEN", PIXELA_USER_TOKEN)
        .reply(200, { message: "Success.", isSuccess: true });
    });

    it("successful", async () => {
      await client.updateGraph({
        graphId: PIXELA_GRAPH_ID,
        name: "graph-name",
        unit: "commit",
        color: "shibafu",
        timezone: "Asia/Tokyo",
        purgeCacheURLs: ["https://camo.githubusercontent.com/xxx/xxxx"],
        publishOptionalData: true
      });
      expect(scope.isDone()).toBe(true);
    });
  });

  describe("deleteGraph", () => {
    let scope: Scope;

    // https://docs.pixe.la/entry/delete-graph
    beforeAll(() => {
      scope = nock(PIXELA_DOMAIN)
        .delete(`/v1/users/${PIXELA_USER_NAME}/graphs/${PIXELA_GRAPH_ID}`)
        .matchHeader("X-USER-TOKEN", PIXELA_USER_TOKEN)
        .reply(200, { message: "Success.", isSuccess: true });
    });

    it("successful", async () => {
      await client.deleteGraph(PIXELA_GRAPH_ID);
      expect(scope.isDone()).toBe(true);
    });
  });

  describe("getPixelDates", () => {
    let scope: Scope;

    // https://docs.pixe.la/entry/get-graph-pixels
    beforeAll(() => {
      scope = nock(PIXELA_DOMAIN)
        .get(`/v1/users/${PIXELA_USER_NAME}/graphs/${PIXELA_GRAPH_ID}/pixels`)
        .query({ from: "20180101", to: "20181231" })
        .matchHeader("X-USER-TOKEN", PIXELA_USER_TOKEN)
        .reply(200, { pixels: ["20180101", "20180331", "20180402", "20180505", "20181204"] });
    });

    it("successful", async () => {
      await client.getPixelDates({ graphId: PIXELA_GRAPH_ID, from: "20180101", to: "20181231" });
      expect(scope.isDone()).toBe(true);
    });
  });

  //#endregion

  //#region Pixel

  describe("createPixel", () => {
    let scope: Scope;

    // https://docs.pixe.la/entry/post-pixel
    beforeAll(() => {
      scope = nock(PIXELA_DOMAIN)
        .post(`/v1/users/${PIXELA_USER_NAME}/graphs/${PIXELA_GRAPH_ID}`, { date: "20180915", quantity: "5", optionalData: '{"key":"value"}' })
        .matchHeader("X-USER-TOKEN", PIXELA_USER_TOKEN)
        .reply(200, { message: "Success.", isSuccess: true });
    });

    it("successful", async () => {
      await client.createPixel({ graphId: PIXELA_GRAPH_ID, date: "20180915", quantity: 5, optionalData: { key: "value" } });
      expect(scope.isDone()).toBe(true);
    });
  });

  describe("getPixel", () => {
    let scope: Scope;

    // https://docs.pixe.la/entry/get-pixel
    beforeAll(() => {
      scope = nock(PIXELA_DOMAIN)
        .get(`/v1/users/${PIXELA_USER_NAME}/graphs/${PIXELA_GRAPH_ID}/20180915`)
        .matchHeader("X-USER-TOKEN", PIXELA_USER_TOKEN)
        .reply(200, { quantity: "5", optionalData: '{"key":"value"}' });
    });

    it("successful", async () => {
      await client.getPixel({ graphId: PIXELA_GRAPH_ID, date: "20180915" });
      expect(scope.isDone()).toBe(true);
    });
  });

  describe("updatePixel", () => {
    let scope: Scope;

    // https://docs.pixe.la/entry/put-pixel
    beforeAll(() => {
      scope = nock(PIXELA_DOMAIN)
        .put(`/v1/users/${PIXELA_USER_NAME}/graphs/${PIXELA_GRAPH_ID}/20180915`, { quantity: "7", optionalData: '{"key":"value"}' })
        .matchHeader("X-USER-TOKEN", PIXELA_USER_TOKEN)
        .reply(200, { message: "Success.", isSuccess: true });
    });

    it("successful", async () => {
      await client.updatePixel({ graphId: PIXELA_GRAPH_ID, date: "20180915", quantity: 7, optionalData: { key: "value" } });
      expect(scope.isDone()).toBe(true);
    });
  });

  describe("incrementPixel", () => {
    let scope: Scope;

    // https://docs.pixe.la/entry/increment-pixel
    beforeAll(() => {
      scope = nock(PIXELA_DOMAIN)
        .put(`/v1/users/${PIXELA_USER_NAME}/graphs/${PIXELA_GRAPH_ID}/increment`)
        .matchHeader("X-USER-TOKEN", PIXELA_USER_TOKEN)
        .matchHeader("Content-Length", "0")
        .reply(200, { message: "Success.", isSuccess: true });
    });

    it("successful", async () => {
      await client.incrementPixel(PIXELA_GRAPH_ID);
      expect(scope.isDone()).toBe(true);
    });
  });

  describe("decrementPixel", () => {
    let scope: Scope;

    // https://docs.pixe.la/entry/decrement-pixel
    beforeAll(() => {
      scope = nock(PIXELA_DOMAIN)
        .put(`/v1/users/${PIXELA_USER_NAME}/graphs/${PIXELA_GRAPH_ID}/decrement`)
        .matchHeader("X-USER-TOKEN", PIXELA_USER_TOKEN)
        .matchHeader("Content-Length", "0")
        .reply(200, { message: "Success.", isSuccess: true });
    });

    it("successful", async () => {
      await client.decrementPixel(PIXELA_GRAPH_ID);
      expect(scope.isDone()).toBe(true);
    });
  });

  describe("deletePixel", () => {
    let scope: Scope;

    // https://docs.pixe.la/entry/delete-pixel
    beforeAll(() => {
      scope = nock(PIXELA_DOMAIN)
        .delete(`/v1/users/${PIXELA_USER_NAME}/graphs/${PIXELA_GRAPH_ID}/20180915`)
        .matchHeader("X-USER-TOKEN", PIXELA_USER_TOKEN)
        .reply(200, { message: "Success.", isSuccess: true });
    });

    it("successful", async () => {
      await client.deletePixel({ graphId: PIXELA_GRAPH_ID, date: "20180915" });
      expect(scope.isDone()).toBe(true);
    });
  });

  //#endregion

  //#region Notification

  describe("createNotification", () => {
    let scope: Scope;

    // https://docs.pixe.la/entry/post-notification
    beforeAll(() => {
      scope = nock(PIXELA_DOMAIN)
        .post(`/v1/users/${PIXELA_USER_NAME}/graphs/${PIXELA_GRAPH_ID}/notifications`, {
          id: "my-notification-rule",
          name: "my notification rule",
          target: "quantity",
          condition: ">",
          threshold: "5",
          channelID: "my-channel"
        })
        .matchHeader("X-USER-TOKEN", PIXELA_USER_TOKEN)
        .reply(200, { message: "Success.", isSuccess: true });
    });

    it("successful", async () => {
      await client.createNotification({
        graphId: PIXELA_GRAPH_ID,
        id: "my-notification-rule",
        name: "my notification rule",
        target: "quantity",
        condition: ">",
        threshold: 5,
        channelID: "my-channel"
      });
      expect(scope.isDone()).toBe(true);
    });
  });

  describe("getNotifications", () => {
    let scope: Scope;

    // https://docs.pixe.la/entry/get-notifications
    beforeAll(() => {
      scope = nock(PIXELA_DOMAIN)
        .get(`/v1/users/${PIXELA_USER_NAME}/graphs/${PIXELA_GRAPH_ID}/notifications`)
        .matchHeader("X-USER-TOKEN", PIXELA_USER_TOKEN)
        .reply(200, {
          notifications: [{ id: "my-notify-rule", name: "my notify rule", target: "quantity", condition: ">", threshold: "5", channelID: "my-channel" }]
        });
    });

    it("successful", async () => {
      await client.getNotifications(PIXELA_GRAPH_ID);
      expect(scope.isDone()).toBe(true);
    });
  });

  describe("updateNotification", () => {
    let scope: Scope;

    // https://docs.pixe.la/entry/put-notification
    beforeAll(() => {
      scope = nock(PIXELA_DOMAIN)
        .put(`/v1/users/${PIXELA_USER_NAME}/graphs/${PIXELA_GRAPH_ID}/notifications/my-notify-rule`, {
          name: "my notification rule",
          target: "quantity",
          condition: ">",
          threshold: "5",
          channelID: "my-channel"
        })
        .matchHeader("X-USER-TOKEN", PIXELA_USER_TOKEN)
        .reply(200, { message: "Success.", isSuccess: true });
    });

    it("successful", async () => {
      await client.updateNotification({
        graphId: PIXELA_GRAPH_ID,
        notificationId: "my-notify-rule",
        name: "my notification rule",
        target: "quantity",
        condition: ">",
        threshold: 5,
        channelID: "my-channel"
      });
      expect(scope.isDone()).toBe(true);
    });
  });

  describe("deleteNotification", () => {
    let scope: Scope;

    // https://docs.pixe.la/entry/delete-notification
    beforeAll(() => {
      scope = nock(PIXELA_DOMAIN)
        .delete(`/v1/users/${PIXELA_USER_NAME}/graphs/${PIXELA_GRAPH_ID}/notifications/my-notify-rule`)
        .matchHeader("X-USER-TOKEN", PIXELA_USER_TOKEN)
        .reply(200, { message: "Success.", isSuccess: true });
    });

    it("successful", async () => {
      await client.deleteNotification({ graphId: PIXELA_GRAPH_ID, notificationId: "my-notify-rule" });
      expect(scope.isDone()).toBe(true);
    });
  });

  //#endregion

  //#region Webhook

  describe("createWebhook", () => {
    let scope: Scope;

    // https://docs.pixe.la/entry/post-webhook
    beforeAll(() => {
      scope = nock(PIXELA_DOMAIN)
        .post(`/v1/users/${PIXELA_USER_NAME}/webhooks`, { graphID: PIXELA_GRAPH_ID, type: "increment" })
        .matchHeader("X-USER-TOKEN", PIXELA_USER_TOKEN)
        .reply(200, { webhookHash: "<WebhookHashString>", message: "Success.", isSuccess: true });
    });

    it("successful", async () => {
      await client.createWebhook({ graphID: PIXELA_GRAPH_ID, type: "increment" });
      expect(scope.isDone()).toBe(true);
    });
  });

  describe("getWebhooks", () => {
    let scope: Scope;

    // https://docs.pixe.la/entry/get-webhooks
    beforeAll(() => {
      scope = nock(PIXELA_DOMAIN)
        .get(`/v1/users/${PIXELA_USER_NAME}/webhooks`)
        .matchHeader("X-USER-TOKEN", PIXELA_USER_TOKEN)
        .reply(200, {
          webhooks: [{ webhookHash: "<WebhookHashString>", graphID: "test-graph", type: "increment" }]
        });
    });

    it("successful", async () => {
      await client.getWebhooks();
      expect(scope.isDone()).toBe(true);
    });
  });

  describe("invokeWebhook", () => {
    let scope: Scope;

    // https://docs.pixe.la/entry/invoke-webhook
    beforeAll(() => {
      scope = nock(PIXELA_DOMAIN)
        .post(`/v1/users/${PIXELA_USER_NAME}/webhooks/webhookHash`)
        .matchHeader("X-USER-TOKEN", PIXELA_USER_TOKEN) // FIXME
        .matchHeader("Content-Length", "0")
        .reply(200, { message: "Success.", isSuccess: true });
    });

    it("successful", async () => {
      await client.invokeWebhook("webhookHash");
      expect(scope.isDone()).toBe(true);
    });
  });

  describe("deleteWebhook", () => {
    let scope: Scope;

    // https://docs.pixe.la/entry/delete-webhook
    beforeAll(() => {
      scope = nock(PIXELA_DOMAIN)
        .delete(`/v1/users/${PIXELA_USER_NAME}/webhooks/webhookHash`)
        .matchHeader("X-USER-TOKEN", PIXELA_USER_TOKEN)
        .reply(200, { message: "Success.", isSuccess: true });
    });

    it("successful", async () => {
      await client.deleteWebhook("webhookHash");
      expect(scope.isDone()).toBe(true);
    });
  });

  //#endregion
});
