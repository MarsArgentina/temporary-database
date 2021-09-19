"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRejectedResults = exports.getFulfilledResults = void 0;
var guaranteeError_1 = require("./guaranteeError");
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
var getRejectedResults = function (results) {
    return results
        .map(function (result) {
        if (result.status === "rejected") {
            return (0, guaranteeError_1.guaranteeError)(result.reason);
        }
        return undefined;
    })
        .filter(function (value) { return value !== undefined; });
};
exports.getRejectedResults = getRejectedResults;
