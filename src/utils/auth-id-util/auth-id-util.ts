import { APIGatewayProxyEvent } from "aws-lambda";
import { isStringEmpty } from "../string-utils";

const getAuthId = (event: APIGatewayProxyEvent): string => {
  let principalId: string;
  try {
    principalId = event.requestContext.authorizer.principalId;
  } catch (error) {
    throw new Error("Request is not correct");
  }

  if (isStringEmpty(principalId)) {
    throw new Error("Principal Id is not populated");
  }

  return principalId;
};

export { getAuthId };
