import { handler } from "./index";

const mockHealthServiceResponse = { returned: "value" };

jest.mock("../../services/health-service", () => () =>
  mockHealthServiceResponse
);

describe("healthService index", () => {
  it("should call process with correct arguments", () => {
    const callback = jest.fn();

    handler(undefined, undefined, callback);

    expect(callback).toHaveBeenCalledWith(null, mockHealthServiceResponse);
  });
});
