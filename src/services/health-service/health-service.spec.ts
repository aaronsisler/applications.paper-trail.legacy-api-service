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

    // 19:22:51 GMT+0000 (Coordinated Universal Time)
    expect(currentTime).toMatch(
      /^[0-9]{2}:[0-9]{2}:[0-9]{2} [A-Z]{3}(\+|-)[0-9]{4} \(\w+ \w+ Time\)$/
    );
  });
});
