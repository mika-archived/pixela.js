import axios, { AxiosInstance, AxiosError } from "axios";

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
    this.client.interceptors.request.use(request => {
      request.headers["User-Agent"] = `Pixela.js/${PIXELA_VERSION}`;
      request.headers["X-USER-TOKEN"] = this.token;

      if ((request.method === "post" || request.method === "put") && !request.data) {
        request.headers["Content-Length"] = "0";
      }

      return request;
    });
  }

  private async get<T>(url: string, params?: Dictionary): Promise<T> {
    const response = await this.client.get<T>(url, { params }).catch((err: AxiosError<T>) => err.response!);
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

  //#region User

  public async createUser(params: { agreeTermsOfService: YesNoBoolean; notMinor: YesNoBoolean; thanksCode?: string }): Promise<Response> {
    if (typeof params.agreeTermsOfService === "boolean") params.agreeTermsOfService = params.agreeTermsOfService ? "yes" : "no";
    if (typeof params.notMinor === "boolean") params.notMinor = params.notMinor ? "yes" : "no";

    return await this.post<Response>("/v1/users", Object.assign({ token: this.token, username: this.username }, params));
  }

  public async updateUser(params: { newToken: string; thanksCode?: string }): Promise<Response> {
    const response = await this.put<Response>(`/v1/users/${this.username}`, params);
    if (response.isSuccess) this.token = params.newToken;

    return response;
  }

  public async deleteUser(): Promise<Response> {
    return await this.delete<Response>(`/v1/users/${this.username}`);
  }

  //#endregion

  //#region Channel

  public async createChannel(params: { id: string; name: string } & SlackChannel): Promise<Response> {
    return await this.post<Response>(`/v1/users/${this.username}/channels`, params);
  }

  public async getChannels(): Promise<Channels> {
    return await this.get<Channels>(`/v1/users/${this.username}/channels`);
  }

  public async updateChannel({ channelId, ...params }: { channelId: string; name?: string } & Partial<SlackChannel>): Promise<Response> {
    return await this.put<Response>(`/v1/users/${this.username}/channels/${channelId}`, params);
  }

  public async deleteChannel({ channelId }: { channelId: string }): Promise<Response> {
    return await this.delete<Response>(`/v1/users/${this.username}/channels/${channelId}`);
  }

  //#endregion

  //#region Graph

  // prettier-ignore
  public async createGraph(params: { id: string; name: string; unit: string; type: Type; color: Color; timezone?: string; selfSufficient?: SelfSufficient; isSecret?: boolean; publishOptionalData?: boolean }): Promise<Response> {
    return await this.post<Response>(`/v1/users/${this.username}/graphs`, params);
  }

  public async getGraphs(): Promise<Graphs> {
    return await this.get<Graphs>(`/v1/users/${this.username}/graphs`);
  }

  public async getGraphSvg({ graphId, ...params }: { graphId: string; date?: string; mode?: DisplayMode }): Promise<string> {
    const response = await this.client.get<string>(`/v1/users/${this.username}/graphs/${graphId}`, { params });
    return response.data;
  }

  // prettier-ignore
  public async updateGraph({ graphId, ...params}: { graphId: string; name?: string; unit?: string; color?: Color; timezone?: string; purgeCacheURLs?: string[]; selfSufficient?: SelfSufficient; isSecret?: boolean; publishOptionalData?: boolean; }): Promise<Response> {
    return await this.put<Response>(`/v1/users/${this.username}/graphs/${graphId}`, params);
  }

  public async deleteGraph(graphId: string): Promise<Response> {
    return await this.delete<Response>(`/v1/users/${this.username}/graphs/${graphId}`);
  }

  public async getPixelDates({ graphId, ...params }: { graphId: string; from?: string; to?: string }): Promise<PixelDates> {
    return await this.get<PixelDates>(`/v1/users/${this.username}/graphs/${graphId}/pixels`, params);
  }

  public async getStats(graphId: string): Promise<Stats> {
    return await this.get<Stats>(`/v1/users/${this.username}/graphs/${graphId}/stats`);
  }

  //#endregion

  //#region Pixel

  public async createPixel({ graphId, ...params }: { graphId: string; date: string; quantity: PixelaNumber; optionalData?: any }): Promise<Response> {
    if (typeof params.quantity === "number") params.quantity = params.quantity.toString();
    if (params.optionalData) params.optionalData = JSON.stringify(params.optionalData);

    return await this.post<Response>(`/v1/users/${this.username}/graphs/${graphId}`, params);
  }

  public async getPixel({ graphId, date }: { graphId: string; date: string }): Promise<Pixel> {
    return await this.get<Pixel>(`/v1/users/${this.username}/graphs/${graphId}/${date}`);
  }

  public async updatePixel({ graphId, date, ...params }: { graphId: string; date: string; quantity: PixelaNumber; optionalData?: any }): Promise<Response> {
    if (typeof params.quantity === "number") params.quantity = params.quantity.toString();
    if (params.optionalData) params.optionalData = JSON.stringify(params.optionalData);

    return await this.put<Response>(`/v1/users/${this.username}/graphs/${graphId}/${date}`, params);
  }

  public async incrementPixel(graphId: string): Promise<Response> {
    return await this.put<Response>(`/v1/users/${this.username}/graphs/${graphId}/increment`);
  }

  public async decrementPixel(graphId: string): Promise<Response> {
    return await this.put<Response>(`/v1/users/${this.username}/graphs/${graphId}/decrement`);
  }

  public async deletePixel({ graphId, date }: { graphId: string; date: string }): Promise<Response> {
    return await this.delete<Response>(`/v1/users/${this.username}/graphs/${graphId}/${date}`);
  }

  //#endregion

  //#region Notification

  // prettier-ignore
  public async createNotification({ graphId, ...params }: { graphId: string; id: string; name: string; target: NotificationTarget; condition: Condition; threshold: PixelaNumber; channelID: string }): Promise<Response> {
    if (typeof params.threshold === "number") params.threshold = params.threshold.toString();

    return await this.post<Response>(`/v1/users/${this.username}/graphs/${graphId}/notifications`, params);
  }

  public async getNotifications(graphId: string): Promise<Notifications> {
    return await this.get<Notifications>(`/v1/users/${this.username}/graphs/${graphId}/notifications`);
  }

  // prettier-ignore
  public async updateNotification({ graphId, notificationId, ...params }: { graphId: string; notificationId: string; name?: string; target?: NotificationTarget; condition?: Condition; threshold?: PixelaNumber; channelID?: string }): Promise<Response> {
    if (typeof params.threshold === "number") params.threshold = params.threshold.toString();

    return await this.put<Response>(`/v1/users/${this.username}/graphs/${graphId}/notifications/${notificationId}`, params);
  }

  public async deleteNotification({ graphId, notificationId }: { graphId: string; notificationId: string }): Promise<Response> {
    return await this.delete<Response>(`/v1/users/${this.username}/graphs/${graphId}/notifications/${notificationId}`);
  }

  //#endregion

  //#region Webhook

  public async createWebhook(params: { graphID: string; type: InvokeType }): Promise<WebhookResponse> {
    return await this.post<WebhookResponse>(`/v1/users/${this.username}/webhooks`, params);
  }

  public async getWebhooks(): Promise<Webhooks> {
    return await this.get<Webhooks>(`/v1/users/${this.username}/webhooks`);
  }

  public async invokeWebhook(webhookHash: string): Promise<Response> {
    return await this.post<Response>(`/v1/users/${this.username}/webhooks/${webhookHash}`);
  }

  public async deleteWebhook(webhookHash: string): Promise<Response> {
    return await this.delete<Response>(`/v1/users/${this.username}/webhooks/${webhookHash}`);
  }

  //#endregion
}
