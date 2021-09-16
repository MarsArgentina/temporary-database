"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.guaranteeError = void 0;
var guaranteeError = function (error) {
    return error instanceof Error
        ? error
        : new Error(typeof error === "string" ? error : "Unknown error");
};
exports.guaranteeError = guaranteeError;
