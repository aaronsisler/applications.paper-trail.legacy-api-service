import { BaseResponse } from "../../models/base-response";
import { HandlerResponse } from "../../models/handler-response";

const responseBodyBuilder = (baseRsponse: BaseResponse): HandlerResponse => {
  const { statusCode, body } = baseRsponse;

  return { statusCode, body: JSON.stringify(body) };
};

export { responseBodyBuilder };
