"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = exports.Database = exports.AgeRange = exports.importers = exports.helpers = void 0;
var mongoose = require("mongoose");
exports.helpers = require("./helpers");
exports.importers = require("./import");
__exportStar(require("./models/user"), exports);
__exportStar(require("./models/invite"), exports);
__exportStar(require("./models/group"), exports);
var agerange_1 = require("./types/agerange");
Object.defineProperty(exports, "AgeRange", { enumerable: true, get: function () { return agerange_1.AgeRange; } });
exports.Database = mongoose;
var connect = function (_a) {
    var _b, _c;
    if (_a === void 0) { _a = {}; }
    var host = _a.host, port = _a.port, options = __rest(_a, ["host", "port"]);
    host !== null && host !== void 0 ? host : (host = process.env.MONGODB_HOST);
    port !== null && port !== void 0 ? port : (port = process.env.MONGODB_PORT);
    if (!host)
        throw new Error("A host was not provided");
    var finalPort = port && port.trim() !== "" ? ":" + port.trim() : "";
    console.log(process.env.MONGODB_USERNAME, process.env.MONGODB_PASSWORD);
    return mongoose.connect("mongodb://" + host.trim() + finalPort + "/", __assign({ dbName: "tmsa", authSource: "tmsa", user: (_b = process.env.MONGODB_USERNAME) === null || _b === void 0 ? void 0 : _b.trim(), pass: (_c = process.env.MONGODB_PASSWORD) === null || _c === void 0 ? void 0 : _c.trim(), useNewUrlParser: true, useUnifiedTopology: true }, options));
};
exports.connect = connect;
