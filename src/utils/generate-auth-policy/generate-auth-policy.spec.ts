import { generateAuthPolicy } from "./index";

describe("Utils/Generate Auth Policy", () => {
  it("should be a function", () => {
    expect(typeof generateAuthPolicy).toEqual("function");
  });

  const principalId = "mock-principal-id";
  const effect = "Allow";
  const resource = { mock: "attribute" };

  const expectedResult = {
    principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: resource
        }
      ]
    }
  };

  it("should return correctly", () => {
    const resultEnv = generateAuthPolicy(principalId, effect, resource);

    expect(resultEnv).toEqual(expectedResult);
  });
});
