import { Filter } from "./filters/Filter";

const wordFilter = new Filter({
  languages: ["es"],
  replaceWith: "*****",
});

console.log(
  "Processed text: ",
  JSON.stringify(wordFilter.evaluate("chinga tu madre"), null, 2),
);
