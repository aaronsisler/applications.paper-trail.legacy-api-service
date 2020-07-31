import { BaseResponse } from "../../models/base-response";
import { SuccessResponse } from "../../models/success-response";

const responseBodyBuilder = (baseRsponse: BaseResponse): SuccessResponse => {
  const { statusCode, body } = baseRsponse;

  return { statusCode, body: JSON.stringify(body) };
};

export { responseBodyBuilder };
