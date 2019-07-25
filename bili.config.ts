import { Config } from "bili";

const config: Config = {
  input: "src/index.ts",
  output: {
    format: ["cjs", "es", "umd-min"]
  },
  plugins: {
    typescript2: {
      cacheRoot: "./.cache"
    }
  }
};

export default config;
