import { terser } from "rollup-plugin-terser";

export default [
  {
    input: "scripts/init.js",
    output: {
      format: "umd",
      file: "C:/Users/prusz/AppData/Local/FoundryVTT/Data/modules/token-action-hud/scripts/bundle.min.js",
      name: "FVTT-TokenActionHud",
    },
    plugins: [terser({ keep_classnames: true, keep_fnames: true })],
  },
];
