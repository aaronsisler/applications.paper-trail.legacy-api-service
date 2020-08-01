import { SuccessResponse } from "../../models/success-response";
import { responseBodyBuilder } from "../../utils/response-body-builder";

const userGet = (_event: any, _context: any, callback: any) => {
  // const params = {
  //   TableName: "PAPER_TRAIL_SERVICE_POC",
  //   Key: {
  //     userId: { S: "123" }
  //   }
  // };

  const response: SuccessResponse = responseBodyBuilder({
    statusCode: 200,
    body: ""
  });

  callback(null, response);
};

export { userGet };
