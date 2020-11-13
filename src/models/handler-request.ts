export interface HandlerRequest {
  headers: {
    [key: string]: string;
  };
  body?: string;
}
