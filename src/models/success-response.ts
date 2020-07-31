import { BaseResponse } from "./base-response";

export interface SuccessResponse extends BaseResponse {
  statusCode: number;
  body: string;
}
