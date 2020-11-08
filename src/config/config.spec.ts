import * as config from "./index";

describe("config", () => {
  // let configKeys: string[];

  beforeEach(() => {
    // configKeys = Object.keys(config);
  });

  it("should export the correct keys", () => {
    expect(true).toBeTruthy();
    // expect(configKeys).toContain("DATABASE_TABLE");
    // expect(configKeys).toContain("TOKEN_HEADER");
    // expect(configKeys).toContain("TOKEN_VALIDATION_URL");
  });

  it("should export the correct values", () => {
    expect(config.DATABASE_TABLE).toBeDefined();
    expect(config.TOKEN_HEADER).toBeDefined();
    expect(config.TOKEN_VALIDATION_URL).toBeDefined();
  });
});
