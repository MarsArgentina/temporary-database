"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.guaranteeBuffer = void 0;
var guaranteeBuffer = function (buffer) {
    if (buffer instanceof ArrayBuffer)
        return Buffer.from(buffer);
    if (typeof buffer === "string") {
        return Buffer.from(buffer.replace(/^data:image\/[a-z]+;base64,/, ""), "base64");
    }
    return buffer;
};
exports.guaranteeBuffer = guaranteeBuffer;
