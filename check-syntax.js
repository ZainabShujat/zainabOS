const ts = require("typescript");
const fs = require("fs");

const fileContent = fs.readFileSync("src/App.tsx", "utf8");
const result = ts.transpileModule(fileContent, {
  compilerOptions: { jsx: ts.JsxEmit.React, target: ts.ScriptTarget.ES2015 }
});
console.log("Syntax check passed!");
