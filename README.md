# Paper Trail API Service

This service is utilized by Paper Trail.

## Usage:

TBD

### Endpoints:

- /health
  - GET
    - Verifies the gateway is alive and reachable
    - Auth token is NOT required for this endpoint
- /user
  - GET
    - Retrieves a user's details with auth token's subject Id as the identifier
    - Auth token's subject Id is used as the identifier
    - HTTP Status
      - 200 if user was retrieved
      - 204 if user was not retrieved
      - 400 if user is missing required fields
      - 401 if request is unauthorized
  - POST
    - Create user with given user information.
    - Auth token's subject Id is used as the identifier
    - HTTP Status
      - 201 if user was created
      - 400 if user is missing required fields
      - 401 if request is unauthorized
      - 500 if user creation failed
  - PUT
    - Update user with given user information.
    - Auth token's subject Id is used as the identifier
    - HTTP Status
      - 200 if user was updated successfully
      - 400 if user is missing required fields
      - 401 if request is unauthorized
      - 500 if user failed to update
- /transactions
  - GET
    - Retrieves a user's transactions
    - Auth token's subject Id is used as the identifier
    - HTTP Status
      - 200 if transactions were retrieved
      - 204 if failure in retrieving transactions
      - 401 if request is unauthorized
  - POST
    - Create a user's transaction
    - Auth token's subject Id is used as the identifier
    - HTTP Status
      - 201 if transaction was created
      - 401 if request is unauthorized
      - 500 if user creation failed
  - PUT
    - Update a user's transaction
    - Auth token's subject Id is used as the identifier
    - HTTP Status
      - 200 if transaction was updated successfully
      - 401 if request is unauthorized
      - 500 if transaction failed to update
