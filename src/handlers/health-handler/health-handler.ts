import { healthService } from "../../services/health-service";
import { HandlerResponse } from "../../models/handler-response";
import { Health } from "../../models/health";
import { responseBodyBuilder } from "../../utils/response-body-builder";

const health = (_event: any, _context: any, callback: any) => {
  const health: Health = healthService();
  const response: HandlerResponse = responseBodyBuilder({
    statusCode: 200,
    body: health
  });

  callback(null, response);
};

export { health };
