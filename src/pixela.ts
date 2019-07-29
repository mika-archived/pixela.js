import ky from "ky-universal";

const PIXELA_VERSION = "0.1.0";

type Color = "shibafu" | "momiji" | "sora" | "ichou" | "ajisai" | "kuro";
type Dictionary = { [key: string]: string | number };
type DisplayMode = "short" | "line";
type InvokeType = "increment" | "decrement";
type Pixel = { quantity: number; optionalData: any };
type PixelDates = { pixels: string[] };
type Response = { message: string; isSuccess: boolean };
type SelfSufficient = "increment" | "decrement" | "none";
type Type = "int" | "float";
type Webhooks = { webhooks: WebhookResponse[] };
type WebhookResponse = { webhookHash: string } & Response;

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

type Stats = {
  totalPixelsCount: number;
  maxQuantity: number;
  minQuantity: number;
  totalQuantity: number;
  avgQuantity: number;
  todaysQuantity: number;
};

export class Pixela {
  private readonly headers: {};
  private readonly username: string;
  private readonly token: string;
  private readonly client: typeof ky;

  public constructor(username: string, token: string) {
    this.headers = { "User-Agent": `Pixela.js/${PIXELA_VERSION}`, "X-USER-TOKEN": token };
    this.username = username;
    this.token = token;
    this.client = ky.create({ prefixUrl: "https://pixe.la" });
  }

  private async get<T>(url: string, searchParams?: string | Dictionary): Promise<T> {
    const response = await this.client.get(url, { headers: this.headers, searchParams });
    return (await response.json()) as T;
  }

  private async post<T>(url: string, body?: any): Promise<T> {
    const response = await this.client.post(url, { json: body, headers: this.headers });
    return (await response.json()) as T;
  }

  private async put<T>(url: string, body?: any): Promise<T> {
    const response = await this.client.put(url, { json: body, headers: this.headers });
    return (await response.json()) as T;
  }

  private async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete(url, { headers: this.headers });
    return (await response.json()) as T;
  }

  //#region User

  public async createUser(params: { agreeTermsOfService: boolean; notMinor: boolean; thanksCode?: string }): Promise<Response> {
    return await this.post<Response>("/v1/users", Object.assign({ token: this.token, username: this.username }, params));
  }

  public async updateUser(params: { newToken: string; thanksCode?: string }): Promise<Response> {
    return await this.put<Response>(`/v1/users/${this.username}`, params);
  }

  public async deleteUser(): Promise<Response> {
    return await this.delete<Response>(`/v1/users/${this.username}`);
  }

  //#endregion

  //#region Graph

  // prettier-ignore
  public async createGraph(params: { id: string; name: string; unit: string; type: Type; color: Color; timezone?: string; isSecret?: boolean; publishOptionalData?: boolean }): Promise<Response> {
    return await this.post<Response>(`/v1/users/${this.username}/graphs`, params);
  }

  public async getGraphs(): Promise<Graph[]> {
    return await this.get<Graph[]>(`/v1/users/${this.username}/graphs`);
  }

  public async getGraphSvg({ graphId, ...params }: { graphId: string; date: string; mode: DisplayMode }): Promise<string> {
    const response = await this.client.get(`/v1/users/${this.username}/graphs/${graphId}`, { searchParams: params as any });
    return await response.text();
  }

  // prettier-ignore
  public async updateGraph({ graphId, ...params}: { graphId: string; name?: string; _unit?: string; color?: Color; _timezone?: string; purgeCacheURLs?: string[]; _selfSuffcient?: SelfSufficient; isSecret?: boolean; publishOptionalData?: boolean; }): Promise<Response> {
    return await this.put<Response>(`/v1/users/${this.username}/graphs/${graphId}`, params);
  }

  public async deleteGraph(graphId: string): Promise<Response> {
    return await this.delete<Response>(`/v1/users/${this.username}/graphs/${graphId}`);
  }

  public async getPixelDates({ graphId, ...params }: { graphId: string; from?: string; to?: string }): Promise<PixelDates> {
    return await this.get<PixelDates>(`/v1/users/${this.username}/graphs/${graphId}`, params as any);
  }

  public async getStats(graphId: string): Promise<Stats> {
    return await this.get<Stats>(`/v1/users/${this.username}/graphs/${graphId}/stats`);
  }

  //#endregion

  //#region Pixel

  public async createPixel({ graphId, ...params }: { graphId: string; date: string; quantity: number; optionalData: any }): Promise<Response> {
    return await this.post<Response>(`/v1/users/${this.username}/graphs/${graphId}`, params);
  }

  public async getPixel({ graphId, date }: { graphId: string; date: string }): Promise<Pixel> {
    return await this.get<Pixel>(`/v1/users/${this.username}/graphs/${graphId}/${date}`);
  }

  public async updatePixel({ graphId, date, ...params }: { graphId: string; date: string; quantity: number; optionalData: any }): Promise<Response> {
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

  //#region Webhook

  public async createWebhook(params: { graphId: string; type: InvokeType }): Promise<WebhookResponse> {
    return await this.post<WebhookResponse>(`/v1/users/${this.username}/graphs/webooks`, params);
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
