"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepClone = void 0;
var v8_1 = require("v8");
var deepClone = function (obj) {
    return (0, v8_1.deserialize)((0, v8_1.serialize)(obj));
};
exports.deepClone = deepClone;
