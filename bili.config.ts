import { Config } from "bili";

const config: Config = {
  input: "src/index.ts",
  output: {
    format: ["cjs-min", "esm-min", "umd-min"],
    moduleName: "Pixela"
  },
  plugins: {
    typescript2: {
      cacheRoot: "./.cache",
      tsconfig: "./tsconfig.build.json"
    }
  },
  externals: ["axios"],
  globals: {
    axios: "axios"
  }
};

export default config;
