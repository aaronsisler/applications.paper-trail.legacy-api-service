import { RequestVerificationService } from "./index";

describe("services/RequestVerificationService", () => {
  let requestVerificationService: RequestVerificationService;

  beforeEach(() => {
    requestVerificationService = new RequestVerificationService();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it("should be a class", () => {
    expect(typeof RequestVerificationService).toEqual("function");
    expect(typeof requestVerificationService).toEqual("object");
  });
});
