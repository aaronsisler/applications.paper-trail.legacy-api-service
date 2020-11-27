/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// Help function to generate an IAM policy
const generateAuthPolicy = (
  principalId: string,
  effect: string,
  resource: any
): any => {
  const authResponse = { principalId, policyDocument: {} };

  authResponse.principalId = principalId;
  if (effect && resource) {
    const statementOne = {
      Action: "execute-api:Invoke",
      Effect: effect,
      Resource: resource
    };
    const policyDocument = {
      Version: "2012-10-17",
      Statement: [statementOne]
    };
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }

  return authResponse;
};

export { generateAuthPolicy };
