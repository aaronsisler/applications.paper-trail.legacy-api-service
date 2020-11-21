import { IncomingHttpHeaders } from "http";

export interface HandlerRequest {
  headers: IncomingHttpHeaders;
  body?: string;
}
