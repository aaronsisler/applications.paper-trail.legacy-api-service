import { envUtil } from "./index";

describe("Utils/Env Utils", () => {
  it("should be a function", () => {
    expect(typeof envUtil).toEqual("function");
  });

  it("should return correctly", () => {
    process.env.NODE_ENV = "MOCK_ENV";

    const resultEnv = envUtil();

    expect(resultEnv).toEqual("MOCK_ENV");

    // Clearing out the environment variable
    delete process.env.NODE_ENV;
    expect(process.env.NODE_ENV).toBeUndefined();
  });
});
