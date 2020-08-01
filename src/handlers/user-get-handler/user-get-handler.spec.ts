import { handler } from "./index";
import { responseBodyBuilder } from "../../utils/response-body-builder";

jest.mock("../../utils/response-body-builder", () => {
  return { responseBodyBuilder: jest.fn(() => "body-built-response") };
});

describe("health handler", () => {
  let callback: Function;

  beforeEach(() => {
    callback = jest.fn();
    handler(undefined, undefined, callback);
  });

  it("should call response body builder with correct arguments", () => {
    expect(responseBodyBuilder).toHaveBeenCalledWith({
      statusCode: 200,
      body: ""
    });
  });

  it("should envoke callback with correct arguments", () => {
    expect(callback).toHaveBeenCalledWith(null, "body-built-response");
  });
});
