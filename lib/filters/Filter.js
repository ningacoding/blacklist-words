"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Filter = void 0;
var dictionary_1 = __importDefault(require("../data/dictionary"));
var string_similarity_1 = __importDefault(require("string-similarity"));
var string_similarity_js_1 = require("string-similarity-js");
var Filter = /** @class */ (function () {
    /**
     * similarityPercent: default 50 means 50% similarity
     * @param config
     */
    function Filter(config) {
        var _a, _b, _c, _d, _e;
        var words = [];
        this.similarityPercentage = (config === null || config === void 0 ? void 0 : config.similarityPercentage) || 50;
        this.caseSensitive = (_a = config === null || config === void 0 ? void 0 : config.caseSensitive) !== null && _a !== void 0 ? _a : false;
        this.wordBoundaries = (_b = config === null || config === void 0 ? void 0 : config.wordBoundaries) !== null && _b !== void 0 ? _b : true;
        this.replaceWith = config === null || config === void 0 ? void 0 : config.replaceWith;
        this.severityLevels = (_c = config === null || config === void 0 ? void 0 : config.severityLevels) !== null && _c !== void 0 ? _c : false;
        this.ignoreWords = new Set(((_d = config === null || config === void 0 ? void 0 : config.ignoreWords) === null || _d === void 0 ? void 0 : _d.map(function (word) { return word.toLowerCase(); })) || []);
        this.logProfanity = (_e = config === null || config === void 0 ? void 0 : config.logProfanity) !== null && _e !== void 0 ? _e : false;
        if (config === null || config === void 0 ? void 0 : config.allLanguages) {
            for (var lang in dictionary_1.default) {
                if (dictionary_1.default.hasOwnProperty(lang)) {
                    words = __spreadArray(__spreadArray([], __read(words), false), __read(dictionary_1.default[lang]), false);
                }
            }
        }
        else {
            var languages = (config === null || config === void 0 ? void 0 : config.languages) || ["none"];
            var languagesChecks = new Set(languages);
            if (languagesChecks.size !== 0) {
                languagesChecks.forEach(function (lang) {
                    words = __spreadArray(__spreadArray([], __read(words), false), __read(dictionary_1.default[lang]), false);
                });
            }
        }
        if (config === null || config === void 0 ? void 0 : config.customWords) {
            words = __spreadArray(__spreadArray([], __read(words), false), __read(config.customWords), false);
        }
        this.words = new Map(words.map(function (word) { return [word.toLowerCase(), 1]; })); // Store words in lowercase
    }
    Filter.prototype.getRegex = function (word) {
        var flags = this.caseSensitive ? "g" : "gi";
        var boundary = this.wordBoundaries ? "\\b" : "";
        return new RegExp("".concat(boundary).concat(word.replace(/(\W)/g, "\\$1")).concat(boundary), flags);
    };
    Filter.prototype.isFuzzyMatch = function (word, text) {
        var pattern = "".concat(word.split("").join("[^a-zA-Z]*"));
        var regex = new RegExp(pattern, this.caseSensitive ? "g" : "gi");
        return regex.test(text);
    };
    Filter.prototype.isMergedMatch = function (word, text) {
        var pattern = "".concat(word);
        var regex = new RegExp(pattern, this.caseSensitive ? "g" : "gi");
        return regex.test(text);
    };
    Filter.prototype.evaluateSeverity = function (word, text) {
        if (this.getRegex(word).test(text)) {
            return 1; // Exact match
        }
        else if (this.isFuzzyMatch(word, text)) {
            return 2; // Fuzzy match
        }
        else if (this.isMergedMatch(word, text)) {
            return 3; // Merged word match
        }
        return undefined; // No match or irrelevant match
    };
    Filter.prototype.isProfane = function (value, customWords) {
        if (customWords === void 0) { customWords = []; }
        var result = this.evaluate(value, customWords);
        return result.containsProfanity;
    };
    /**
     * This adds words on the fly,
     * this DOES NOT save/persists words
     * @param customWords
     */
    Filter.prototype.addWords = function (customWords) {
        if (customWords === void 0) { customWords = []; }
        var newWords = __spreadArray(__spreadArray([], __read(Array.from(this.words.keys())), false), __read(customWords), false);
        this.words = new Map(newWords.map(function (word) { return [word.toLowerCase(), 1]; }));
    };
    Filter.prototype.evaluate = function (text, customWords) {
        var e_1, _a, e_2, _b, e_3, _c;
        if (customWords === void 0) { customWords = []; }
        var words = text.split(/\s+/);
        var profaneWords = [];
        var lengthTolerance = 1;
        var similarityPercentTolerance = this.similarityPercentage;
        var chars = {
            "@": "a",
            "4": "a",
            "3": "e",
            "1": "i",
            "0": "o",
        };
        var dictWords = __spreadArray(__spreadArray([], __read(customWords), false), __read(this.words.keys()), false);
        var similarity = [];
        try {
            for (var words_1 = __values(words), words_1_1 = words_1.next(); !words_1_1.done; words_1_1 = words_1.next()) {
                var word = words_1_1.value;
                var replacedNumbersWithLetters = word.replace(/[@4310]/g, function (m) { return chars[m]; });
                var removedTildes = replacedNumbersWithLetters
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "");
                var matching = string_similarity_1.default.findBestMatch(removedTildes, dictWords);
                try {
                    for (var dictWords_1 = (e_2 = void 0, __values(dictWords)), dictWords_1_1 = dictWords_1.next(); !dictWords_1_1.done; dictWords_1_1 = dictWords_1.next()) {
                        var dictWord = dictWords_1_1.value;
                        var similar = (0, string_similarity_js_1.stringSimilarity)(dictWord, removedTildes);
                        if (!this.ignoreWords.has(dictWord.toLowerCase()) &&
                            !!(matching === null || matching === void 0 ? void 0 : matching.bestMatch) &&
                            similar > similarityPercentTolerance / 100 &&
                            (dictWord.length > removedTildes.length - (lengthTolerance + 1) ||
                                dictWord.length < removedTildes.length + (lengthTolerance + 1))) {
                            similarity.push(matching.bestMatch);
                            profaneWords.push(word);
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (dictWords_1_1 && !dictWords_1_1.done && (_b = dictWords_1.return)) _b.call(dictWords_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (words_1_1 && !words_1_1.done && (_a = words_1.return)) _a.call(words_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var processedText = text;
        if (this.replaceWith) {
            try {
                for (var profaneWords_1 = __values(profaneWords), profaneWords_1_1 = profaneWords_1.next(); !profaneWords_1_1.done; profaneWords_1_1 = profaneWords_1.next()) {
                    var word = profaneWords_1_1.value;
                    processedText = processedText.replace(new RegExp(word, "gi"), this.replaceWith);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (profaneWords_1_1 && !profaneWords_1_1.done && (_c = profaneWords_1.return)) _c.call(profaneWords_1);
                }
                finally { if (e_3) throw e_3.error; }
            }
        }
        return {
            percentageUsed: similarityPercentTolerance,
            containsProfanity: profaneWords.length > 0,
            profaneWords: Array.from(new Set(profaneWords)),
            processedText: this.replaceWith ? processedText : undefined,
            severityMap: similarity,
        };
    };
    return Filter;
}());
exports.Filter = Filter;
//# sourceMappingURL=Filter.js.map