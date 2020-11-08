export default {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // An array of glob patterns indicating a set of files for which
  // coverage information should be collected
  // collectCoverageFrom: undefined,
  collectCoverageFrom: [
    // "<rootDir>/src/**/*.ts",
    "<rootDir>/src/config/*.ts",
    "!<rootDir>/src/models/*.ts", // No business logic should reside within models
    "!<rootDir>/src/local-server/*.ts"
  ],

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // An array of regexp pattern strings used to skip coverage collection
  // coveragePathIgnorePatterns: [
  //   "/node_modules/"
  // ],

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

  // The maximum amount of workers used to run your tests.
  // Can be specified as % or a number.
  // E.g. maxWorkers: 10% will use 10% of your CPU amount + 1 as the maximum worker number.
  maxWorkers: "25%",

  // A preset that is used as a base for Jest's configuration
  preset: "ts-jest",

  // The test environment that will be used for testing
  testEnvironment: "node",

  // The glob patterns Jest uses to detect test files
  testMatch: [
    //   "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec).ts"
  ],

  // An array of regexp pattern strings that are matched against all test paths,
  // matched tests are skipped
  testPathIgnorePatterns: ["/node_modules/"]

  // The regexp pattern or array of patterns that Jest uses to detect test files
  // testRegex: [],

  // This option allows the use of a custom results processor
  // testResultsProcessor: undefined,

  // An array of regexp pattern strings that are matched against
  // all source file paths, matched files will skip transformation
  // transformIgnorePatterns: [
  //   "/node_modules/",
  //   "\\.pnp\\.[^\\/]+$"
  // ],
};
