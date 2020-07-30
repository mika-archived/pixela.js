/* eslint-disable import/prefer-default-export */
import type { AxiosInstance, AxiosError } from "axios";
import axios from "axios";

const PIXELA_VERSION = "0.1.2";

type Channels = { channels: Channel[] };
type Color = "shibafu" | "momiji" | "sora" | "ichou" | "ajisai" | "kuro";
type Condition = ">" | "=" | "<" | "multipleOf";
type Dictionary = { [key: string]: any };
type DisplayMode = "short" | "line";
type Graphs = { graphs: Graph[] };
type InvokeType = "increment" | "decrement";
type Notifications = { notifications: Notification };
type NotificationTarget = "quantity";
type Pixel = { quantity: number; optionalData: any };
type PixelDates = { pixels: string[] };
type PixelaNumber = string | number;
type Response = { message: string; isSuccess: boolean };
type SelfSufficient = "increment" | "decrement" | "none";
type Type = "int" | "float";
type Webhooks = { webhooks: WebhookResponse[] };
type WebhookResponse = { webhookHash: string } & Response;
type YesNoBoolean = "yes" | "no" | boolean;

type Channel = {
  id: string;
  name: string;
} & SlackChannel;

type Graph = {
  id: string;
  name: string;
  unit: string;
  type: Type;
  color: Color;
  timezone: string;
  purgeCacheURLs: string[];
  selfSufficient: SelfSufficient;
  isSecret: boolean;
  publishOptionalData: boolean;
};

type Notification = {
  id: string;
  name: string;
  target: NotificationTarget;
  threshold: string;
  channelId: string;
};

type Stats = {
  totalPixelsCount: number;
  maxQuantity: number;
  minQuantity: number;
  totalQuantity: number;
  avgQuantity: number;
  todaysQuantity: number;
};

type SlackChannel = {
  type: "slack";
  detail: { url: string; userName: string; channelName: string };
};

export class Pixela {
  private readonly username: string;

  private readonly client: AxiosInstance;

  private token: string;

  public constructor(username: string, token: string) {
    this.username = username;
    this.token = token;
    this.client = axios.create({ baseURL: "https://pixe.la" });
    this.client.interceptors.request.use((request) => {
      request.headers["User-Agent"] = `Pixela.js/${PIXELA_VERSION}`;
      request.headers["X-USER-TOKEN"] = this.token;

      if ((request.method === "post" || request.method === "put") && !request.data) {
        request.headers["Content-Length"] = "0";
      }

      return request;
    });
  }

  private async get<T>(url: string, params?: Dictionary): Promise<T> {
    const response = await this.client
      .get<T>(url, { params })
      .catch((err: AxiosError<T>) => err.response!);
    return response.data;
  }

  private async post<T>(url: string, params?: any): Promise<T> {
    const response = await this.client.post<T>(url, params).catch((err: AxiosError<T>) => err.response!);
    return response.data;
  }

  private async put<T>(url: string, params?: any): Promise<T> {
    const response = await this.client.put<T>(url, params).catch((err: AxiosError<T>) => err.response!);
    return response.data;
  }

  private async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<T>(url).catch((err: AxiosError<T>) => err.response!);
    return response.data;
  }

  // #region User

  public createUser(params: { agreeTermsOfService: YesNoBoolean; notMinor: YesNoBoolean; thanksCode?: string }): Promise<Response> {
    // eslint-disable-next-line no-param-reassign
    if (typeof params.agreeTermsOfService === "boolean") params.agreeTermsOfService = params.agreeTermsOfService ? "yes" : "no";
    // eslint-disable-next-line no-param-reassign
    if (typeof params.notMinor === "boolean") params.notMinor = params.notMinor ? "yes" : "no";

    return this.post<Response>("/v1/users", { token: this.token, username: this.username, ...params });
  }

  public async updateUser(params: { newToken: string; thanksCode?: string }): Promise<Response> {
    const response = await this.put<Response>(`/v1/users/${this.username}`, params);
    if (response.isSuccess) this.token = params.newToken;

    return response;
  }

  public deleteUser(): Promise<Response> {
    return this.delete<Response>(`/v1/users/${this.username}`);
  }

  // #endregion

  // #region Channel

  public createChannel(params: { id: string; name: string } & SlackChannel): Promise<Response> {
    return this.post<Response>(`/v1/users/${this.username}/channels`, params);
  }

  public getChannels(): Promise<Channels> {
    return this.get<Channels>(`/v1/users/${this.username}/channels`);
  }

  public updateChannel({ channelId, ...params }: { channelId: string; name?: string } & Partial<SlackChannel>): Promise<Response> {
    return this.put<Response>(`/v1/users/${this.username}/channels/${channelId}`, params);
  }

  public deleteChannel({ channelId }: { channelId: string }): Promise<Response> {
    return this.delete<Response>(`/v1/users/${this.username}/channels/${channelId}`);
  }

  // #endregion

  // #region Graph

  // prettier-ignore
  public createGraph(params: { id: string; name: string; unit: string; type: Type; color: Color; timezone?: string; selfSufficient?: SelfSufficient; isSecret?: boolean; publishOptionalData?: boolean }): Promise<Response> {
    return this.post<Response>(`/v1/users/${this.username}/graphs`, params);
  }

  public getGraphs(): Promise<Graphs> {
    return this.get<Graphs>(`/v1/users/${this.username}/graphs`);
  }

  public async getGraphSvg({ graphId, ...params }: { graphId: string; date?: string; mode?: DisplayMode }): Promise<string> {
    const response = await this.client.get<string>(`/v1/users/${this.username}/graphs/${graphId}`, { params });
    return response.data;
  }

  // prettier-ignore
  public updateGraph({ graphId, ...params}: { graphId: string; name?: string; unit?: string; color?: Color; timezone?: string; purgeCacheURLs?: string[]; selfSufficient?: SelfSufficient; isSecret?: boolean; publishOptionalData?: boolean; }): Promise<Response> {
    return this.put<Response>(`/v1/users/${this.username}/graphs/${graphId}`, params);
  }

  public deleteGraph(graphId: string): Promise<Response> {
    return this.delete<Response>(`/v1/users/${this.username}/graphs/${graphId}`);
  }

  public getPixelDates({ graphId, ...params }: { graphId: string; from?: string; to?: string }): Promise<PixelDates> {
    return this.get<PixelDates>(`/v1/users/${this.username}/graphs/${graphId}/pixels`, params);
  }

  public getStats(graphId: string): Promise<Stats> {
    return this.get<Stats>(`/v1/users/${this.username}/graphs/${graphId}/stats`);
  }

  public stopwatch(graphId: string): Promise<Response> {
    return this.post<Response>(`/v1/users/${this.username}/graphs/${graphId}/stopwatch`);
  }

  // #endregion

  // #region Pixel

  public createPixel({ graphId, ...params }: { graphId: string; date: string; quantity: PixelaNumber; optionalData?: any }): Promise<Response> {
    // eslint-disable-next-line no-param-reassign
    if (typeof params.quantity === "number") params.quantity = params.quantity.toString();
    // eslint-disable-next-line no-param-reassign
    if (params.optionalData) params.optionalData = JSON.stringify(params.optionalData);

    return this.post<Response>(`/v1/users/${this.username}/graphs/${graphId}`, params);
  }

  public getPixel({ graphId, date }: { graphId: string; date: string }): Promise<Pixel> {
    return this.get<Pixel>(`/v1/users/${this.username}/graphs/${graphId}/${date}`);
  }

  public updatePixel({ graphId, date, ...params }: { graphId: string; date: string; quantity: PixelaNumber; optionalData?: any }): Promise<Response> {
    // eslint-disable-next-line no-param-reassign
    if (typeof params.quantity === "number") params.quantity = params.quantity.toString();
    // eslint-disable-next-line no-param-reassign
    if (params.optionalData) params.optionalData = JSON.stringify(params.optionalData);

    return this.put<Response>(`/v1/users/${this.username}/graphs/${graphId}/${date}`, params);
  }

  public incrementPixel(graphId: string): Promise<Response> {
    return this.put<Response>(`/v1/users/${this.username}/graphs/${graphId}/increment`);
  }

  public decrementPixel(graphId: string): Promise<Response> {
    return this.put<Response>(`/v1/users/${this.username}/graphs/${graphId}/decrement`);
  }

  public deletePixel({ graphId, date }: { graphId: string; date: string }): Promise<Response> {
    return this.delete<Response>(`/v1/users/${this.username}/graphs/${graphId}/${date}`);
  }

  // #endregion

  // #region Notification

  // prettier-ignore
  public createNotification({ graphId, ...params }: { graphId: string; id: string; name: string; target: NotificationTarget; condition: Condition; threshold: PixelaNumber; channelID: string }): Promise<Response> {
    // eslint-disable-next-line no-param-reassign
    if (typeof params.threshold === "number") params.threshold = params.threshold.toString();

    return this.post<Response>(`/v1/users/${this.username}/graphs/${graphId}/notifications`, params);
  }

  public getNotifications(graphId: string): Promise<Notifications> {
    return this.get<Notifications>(`/v1/users/${this.username}/graphs/${graphId}/notifications`);
  }

  // prettier-ignore
  public updateNotification({ graphId, notificationId, ...params }: { graphId: string; notificationId: string; name?: string; target?: NotificationTarget; condition?: Condition; threshold?: PixelaNumber; channelID?: string }): Promise<Response> {
    // eslint-disable-next-line no-param-reassign
    if (typeof params.threshold === "number") params.threshold = params.threshold.toString();

    return this.put<Response>(`/v1/users/${this.username}/graphs/${graphId}/notifications/${notificationId}`, params);
  }

  public deleteNotification({ graphId, notificationId }: { graphId: string; notificationId: string }): Promise<Response> {
    return this.delete<Response>(`/v1/users/${this.username}/graphs/${graphId}/notifications/${notificationId}`);
  }

  // #endregion

  // #region Webhook

  public createWebhook(params: { graphID: string; type: InvokeType }): Promise<WebhookResponse> {
    return this.post<WebhookResponse>(`/v1/users/${this.username}/webhooks`, params);
  }

  public getWebhooks(): Promise<Webhooks> {
    return this.get<Webhooks>(`/v1/users/${this.username}/webhooks`);
  }

  public invokeWebhook(webhookHash: string): Promise<Response> {
    return this.post<Response>(`/v1/users/${this.username}/webhooks/${webhookHash}`);
  }

  public deleteWebhook(webhookHash: string): Promise<Response> {
    return this.delete<Response>(`/v1/users/${this.username}/webhooks/${webhookHash}`);
  }

  // #endregion
}
