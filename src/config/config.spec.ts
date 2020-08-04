import * as config from "./index";

describe("config", () => {
  let configKeys: string[];

  beforeEach(() => {
    configKeys = Object.keys(config);
  });

  it("should export the correct keys", () => {
    expect(configKeys).toContain("DATABASE_TABLE");
  });

  it("should export the correct values", () => {
    expect(config.DATABASE_TABLE).toBeDefined();
  });
});
