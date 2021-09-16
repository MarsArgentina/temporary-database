"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFulfilledResults = void 0;
var getFulfilledResults = function (results) {
    return results
        .map(function (result) {
        if (result.status === "fulfilled") {
            return result.value;
        }
        return undefined;
    })
        .filter(function (value) { return value !== undefined; });
};
exports.getFulfilledResults = getFulfilledResults;
