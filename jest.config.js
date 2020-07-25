// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,
  collectCoverageFrom: ["<rootDir>/src/**/*.js"],

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: ["<rootDir>/node_modules/"],

  // A list of reporter names that Jest uses when writing coverage reports
  coverageReporters: ["lcov", "text", "html"],

  // An object that configures minimum threshold enforcement for coverage results
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  },

  // An array of directory names to be searched recursively up from the requiring module's location
  moduleDirectories: ["node_modules", "src"],

  // The test environment that will be used for testing
  testEnvironment: "node",

  // The glob patterns Jest uses to detect test files
  testMatch: ["**/?(*.)+(spec).js"],

  // An array of regexp pattern strings that are matched against all test paths
  // Matched tests are skipped
  testPathIgnorePatterns: ["/node_modules/"]
};
