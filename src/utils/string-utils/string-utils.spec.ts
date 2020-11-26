import { isStringEmpty } from "./index";

describe("Utils/String Utils", () => {
  describe("isStringEmpty", () => {
    it("should be a function", () => {
      expect(typeof isStringEmpty).toEqual("function");
    });

    describe("when a string is null", () => {
      it("should return correctly", () => {
        expect(isStringEmpty(null)).toBeTruthy();
      });
    });

    describe("when a string is undefined", () => {
      it("should return correctly", () => {
        expect(isStringEmpty(undefined)).toBeTruthy();
      });
    });

    describe("when a string is empty", () => {
      it("should return correctly", () => {
        expect(isStringEmpty("")).toBeTruthy();
      });
    });

    describe("when a string has characters", () => {
      it("should return correctly", () => {
        expect(isStringEmpty("taco")).toBeFalsy();
      });
    });
  });
});
