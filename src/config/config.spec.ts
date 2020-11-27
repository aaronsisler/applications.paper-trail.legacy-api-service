import * as config from "./index";

jest.mock("../utils/env-util", () => ({
  getEnv: () => "MOCK_ENV"
}));

describe("config", () => {
  let configKeys: string[];

  beforeEach(() => {
    configKeys = Object.keys(config);
  });

  it("should export the correct keys", () => {
    expect(configKeys).toContain("DATABASE_TABLE_TRANSACTIONS");
    expect(configKeys).toContain("DATABASE_TABLE_USERS");
    expect(configKeys).toContain("TOKEN_VALIDATION_URL");
  });

  it("should export the correct values", () => {
    expect(config.DATABASE_TABLE_TRANSACTIONS).toEqual(
      `PAPER_TRAIL_SERVICE_MOCK_ENV_TRANSACTIONS`
    );

    expect(config.DATABASE_TABLE_USERS).toEqual(
      `PAPER_TRAIL_SERVICE_MOCK_ENV_USERS`
    );

    expect(config.TOKEN_VALIDATION_URL).toBeDefined();
  });
});
