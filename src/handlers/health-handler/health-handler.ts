import { healthService } from "../../services/health-service";
import { SuccessResponse } from "../../models/success-response";
import { Health } from "../../models/health";
import { responseBodyBuilder } from "../../utils/response-body-builder";

const health = (_event: any, _context: any, callback: any) => {
  const health: Health = healthService();
  const response: SuccessResponse = responseBodyBuilder({
    statusCode: 200,
    body: health
  });

  callback(null, response);
};

export default health;
