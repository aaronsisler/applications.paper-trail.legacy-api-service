import { errorLogger } from "./index";

describe("utils - Error Logger", () => {
  const mockCaller = "mock-caller";
  const mockErrorMessage = "mock-error-message";
  let consoleWarnSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleWarnSpy = jest
      .spyOn(console, "warn")
      .mockImplementation(() => jest.fn());
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  it("should be a function", () => {
    expect(typeof errorLogger).toEqual("function");
  });

  it("should log correct messages to the console", () => {
    errorLogger(mockCaller, mockErrorMessage);

    expect(console.warn).toHaveBeenCalledWith("ERROR: mock-caller");
    expect(console.warn).toHaveBeenCalledWith("mock-error-message");
  });
});
