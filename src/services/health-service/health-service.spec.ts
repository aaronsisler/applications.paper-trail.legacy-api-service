import { healthService } from "./index";
import { Health } from "../../models/health";

describe("healthService", () => {
  let health: Health;

  beforeEach(() => {
    health = healthService();
  });

  it("should return the correct message", () => {
    const { message } = health;

    expect(message).toEqual("Hello! It looks like this service is working.");
  });

  it("should return the correct timestamp", () => {
    const { currentTime } = health;

    expect(currentTime).toContain(":");
  });
});
