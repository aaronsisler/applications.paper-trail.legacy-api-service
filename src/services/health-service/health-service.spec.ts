import healthService, { HealthServiceResponse } from "./index";

describe("healthService", () => {
  let response: HealthServiceResponse;

  beforeEach(() => {
    response = healthService();
  });

  it("should return the correct status code", () => {
    const { statusCode } = response;

    expect(statusCode).toEqual(200);
  });
  describe("when body is returned", () => {
    let body: HealthServiceResponse["body"];

    beforeEach(() => {
      body = response.body;
    });

    it("should return the correct message", () => {
      const { message } = body;

      expect(message).toEqual("Hello, it looks like this service is working.");
    });

    it("should return the correct timestamp", () => {
      const { currentTime } = body;

      expect(currentTime).toContain("The current time is ");
    });
  });
});
