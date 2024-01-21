import { relative } from "path";

const buildEslintCommand = (filenames) =>
  `eslint --fix ${filenames.map((f) => relative(process.cwd(), f)).join(" ")}`;

export default {
  "*.{js,jsx,ts,tsx}": [buildEslintCommand, "prettier --write"],
  "!(*.ts|*.js|*.tsx|*.jsx)": "prettier --write --ignore-unknown",
};
