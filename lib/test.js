"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Filter_1 = require("./filters/Filter");
var wordFilter = new Filter_1.Filter({
    languages: ["es"],
    replaceWith: "*****",
});
console.log("Processed text: ", JSON.stringify(wordFilter.evaluate("chinga tu madre"), null, 2));
//# sourceMappingURL=test.js.map