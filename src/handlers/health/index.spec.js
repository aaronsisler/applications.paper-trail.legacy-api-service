const { healthService } = require("../../services/health");
const { handler } = require("./index");

jest.mock("../../services/health");

describe("healthService index", () => {
  const mockHealthServiceResponse = { returned: "value" };

  beforeEach(() => {
    healthService.mockReturnValue(mockHealthServiceResponse);
  });

  it("should call process with correct arguments", () => {
    const callback = jest.fn();

    handler(undefined, undefined, callback);

    expect(callback).toHaveBeenCalledWith(null, mockHealthServiceResponse);
  });
});
