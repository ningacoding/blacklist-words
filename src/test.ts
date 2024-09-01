import { Filter } from "./filters/Filter";
import AllBadWords from './data/all.json';

const wordFilter = new Filter({
  similarityPercentage: 75,
  replaceWith: "*****",
});

const all = Object.keys(AllBadWords)
.map((lang) => AllBadWords[lang])
.flat();
wordFilter.addWords(all);


console.log(
  "Processed text: ",
  JSON.stringify(wordFilter.evaluate("Mándame mensajes anónimos"), null, 2),
);
