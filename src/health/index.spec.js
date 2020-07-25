const { healthService } = require("./health-service");
const { handler } = require("./index");

jest.mock("./health-service");

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
