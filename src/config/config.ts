import { getEnv } from "../utils/env-util";

// Database
const DATABASE_TABLE_TRANSACTIONS = `PAPER_TRAIL_SERVICE_${getEnv()}_TRANSACTIONS`;
const DATABASE_TABLE_USERS = `PAPER_TRAIL_SERVICE_${getEnv()}_USERS`;

// Auth
// const TOKEN_HEADER = "x-forwarded-google-oauth-token";
const TOKEN_VALIDATION_URL = "https://www.googleapis.com/oauth2/v3/tokeninfo";

export {
  DATABASE_TABLE_TRANSACTIONS,
  DATABASE_TABLE_USERS,
  TOKEN_VALIDATION_URL
};
