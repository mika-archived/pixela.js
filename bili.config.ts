import { Config } from "bili";

const config: Config = {
  input: "src/index.ts",
  output: {
    format: ["cjs-min", "esm-min", "umd-min"]
  },
  plugins: {
    typescript2: {
      cacheRoot: "./.cache"
    }
  },
  extendRollupConfig: config => {
    config.outputConfig.name = "Pixela";
    return config;
  }
};

export default config;
