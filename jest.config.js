module.exports = {
  collectCoverage: false,
  collectCoverageFrom: [
    "<rootDir>/src/**/*.ts",
    "!<rootDir>/src/models/*.ts", // No business logic should reside within models
    "!<rootDir>/src/local-server/*.ts"
  ],
  // A list of reporter names that Jest uses when writing coverage reports
  coverageReporters: ["lcov", "text", "html"],
  // An object that configures minimum threshold enforcement for coverage results
  coverageThreshold: {
    // global: {
    //   branches: 100,
    //   functions: 100,
    //   lines: 100,
    //   statements: 100
    // }
  },
  // The glob patterns Jest uses to detect test files
  testMatch: ["**/?(*.)+(spec).ts"],
  preset: "ts-jest",
  testEnvironment: "node"
};
