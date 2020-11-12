import { HealthService } from "./index";
import { Health } from "../../models/health";

describe("services/healthService", () => {
  let health: Health;
  let healthService: HealthService;

  beforeEach(() => {
    healthService = new HealthService();
    health = healthService.getHealth();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it("should be a class", () => {
    expect(typeof HealthService).toEqual("function");
    expect(typeof healthService).toEqual("object");
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
