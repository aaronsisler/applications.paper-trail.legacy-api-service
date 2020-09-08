# Paper Trail Service

This service is utilized by Paper Trail UI.

## Usage:

TBD

### Endpoints:

- /health
  - GET
  - Verifies the gateway is alive and reachable
- /user
  - GET
  - Retrieves a user's details with auth token's subject Id as the identifier
- /transactions
  - GET
  - Retrieves a user's transactions with auth token's subject Id as the identifier
- /transactions
  - POST
  - Creates a transaction with auth token's subject Id as the identifier

### DynamoDB Model

- userId
  - transactions
  - userDetails
