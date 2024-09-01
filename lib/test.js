"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Filter_1 = require("./filters/Filter");
var all_json_1 = __importDefault(require("./data/all.json"));
var wordFilter = new Filter_1.Filter({
    languages: ["all"],
    similarityPercentage: 75,
    replaceWith: "*****",
});
var all = Object.keys(all_json_1.default)
    .map(function (lang) { return all_json_1.default[lang]; })
    .flat();
wordFilter.addWords(all);
console.log("Processed text: ", JSON.stringify(wordFilter.evaluate("Mándame mensajes anónimos"), null, 2));
//# sourceMappingURL=test.js.map