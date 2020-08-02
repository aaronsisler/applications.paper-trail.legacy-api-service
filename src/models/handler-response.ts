import { BaseResponse } from "./base-response";

export interface HandlerResponse extends BaseResponse {
  statusCode: number;
  body: string;
}
