const { healthService } = require("./health-service");

describe("healthService", () => {
  let response;

  beforeEach(() => {
    response = healthService();
  });

  it("should return the correct status code", () => {
    const { statusCode } = response;

    expect(statusCode).toEqual(200);
  });

  it("should return the correct body", () => {
    const { body } = response;
    const expectedPartialResponse =
      '{"message":"Hello, it looks like this service is working.","currentTime":"The current time is';

    expect(body).toContain(expectedPartialResponse);
  });
});
