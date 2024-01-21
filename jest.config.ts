import type { Config } from "jest";

const config: Config = {
  setupFilesAfterEnv: ["<rootDir>/test/setup-jest.ts"],
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/test/$1",
  },
};

export default config;
