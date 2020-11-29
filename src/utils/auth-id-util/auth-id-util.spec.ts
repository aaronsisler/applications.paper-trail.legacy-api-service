import { getAuthId } from "./index";

describe("Utils/Auth Id Util", () => {
  let event: any;

  it("should be a function", () => {
    expect(typeof getAuthId).toEqual("function");
  });

  describe("when request is correct", () => {
    describe("when principal id is populated correctly", () => {
      it("should return correctly", () => {
        event = {
          requestContext: { authorizer: { principalId: "mock-principal-id" } }
        };
        const resultEnv = getAuthId(event);

        expect(resultEnv).toEqual("mock-principal-id");
      });
    });

    describe("when principal id is NOT populated correctly", () => {
      it("should throw an error", () => {
        expect.assertions(1);
        event = {
          requestContext: { authorizer: { principalId: "" } }
        };

        try {
          getAuthId(event);
        } catch (error) {
          expect(error.message).toEqual("Principal Id is not populated");
        }
      });
    });
  });

  describe("when request is NOT correct", () => {
    it("should throw an error", () => {
      expect.assertions(1);
      event = {
        requestContext: {}
      };

      try {
        getAuthId(event);
      } catch (error) {
        expect(error.message).toEqual("Request is not correct");
      }
    });
  });
});
