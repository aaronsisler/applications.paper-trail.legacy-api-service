import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Callback,
  Context
} from "aws-lambda";
import { HealthService } from "../../services/health-service";
import { HandlerResponse } from "../../models/handler-response";
import { Health } from "../../models/health";
import { responseBodyBuilder } from "../../utils/response-body-builder";

const health: APIGatewayProxyHandler = (
  _event: APIGatewayProxyEvent,
  _context: Context,
  callback: Callback<APIGatewayProxyResult>
) => {
  const healthStatus: Health = new HealthService().getHealth();
  const response: HandlerResponse = responseBodyBuilder({
    statusCode: 200,
    body: healthStatus
  });

  callback(null, response);
};

export { health };
