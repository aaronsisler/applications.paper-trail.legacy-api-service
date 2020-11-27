import { APIGatewayProxyEvent } from "aws-lambda";

const getAuthId = (event: APIGatewayProxyEvent): string =>
  event.requestContext.authorizer.principalId;

export { getAuthId };
