import { responseBodyBuilder } from "./index";
import { BaseResponse } from "../../models/base-response";
import { SuccessResponse } from "../../models/success-response";

describe("utils - Response Body Builder", () => {
  let successResponse: SuccessResponse;
  const mockBody = { returned: "value" };
  const baseResponse: BaseResponse = {
    statusCode: 200,
    body: mockBody
  };

  beforeEach(() => {
    successResponse = responseBodyBuilder(baseResponse);
  });

  it("should return the status code", () => {
    const { statusCode } = successResponse;

    expect(statusCode).toEqual(200);
  });

  it("should return the correct response body", () => {
    const { body } = successResponse;

    expect(body).toEqual(JSON.stringify(mockBody));
  });
});
