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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.importOldGroups = exports.importGroupInfo = exports.parseOldGroups = void 0;
var xlsx = require("xlsx");
var __1 = require("..");
var helpers_1 = require("../helpers");
var parseOldGroups = function (file) {
    var buffer = (0, helpers_1.guaranteeBuffer)(file);
    if (!buffer) {
        throw new Error("File couldn't be converted to a proper buffer");
    }
    var workbook = xlsx.read(buffer, { type: "buffer", cellDates: true });
    var data = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    var groups = new Map();
    data.forEach(function (item) {
        var _a, _b;
        var name = ((_a = item.Group) !== null && _a !== void 0 ? _a : "").trim();
        if (!name)
            return;
        var group = (_b = groups.get(name.toLowerCase())) !== null && _b !== void 0 ? _b : {
            name: name,
            role: "",
            invites: [],
            channels: [],
            meta: {
                location: item["Event Location"]
            }
        };
        group.invites.push({ email: item.Email });
        groups.set(name.toLowerCase(), group);
    });
    return Array.from(groups.values());
};
exports.parseOldGroups = parseOldGroups;
var importGroupInfo = function (event, info) { return __awaiter(void 0, void 0, void 0, function () {
    var result, final;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Promise.all(info.map(function (_a) {
                    var name = _a.name, mainChannel = _a.mainChannel, channels = _a.channels, role = _a.role, invites = _a.invites, meta = _a.meta;
                    return __awaiter(void 0, void 0, void 0, function () {
                        var group, results, e_1;
                        var _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: return [4 /*yield*/, event.addGroup(name, role, mainChannel, channels)];
                                case 1:
                                    group = _c.sent();
                                    return [4 /*yield*/, Promise.all(invites.map(function (_a) {
                                            var email = _a.email;
                                            return __awaiter(void 0, void 0, void 0, function () {
                                                var invite, e_2;
                                                return __generator(this, function (_b) {
                                                    switch (_b.label) {
                                                        case 0:
                                                            _b.trys.push([0, 2, , 3]);
                                                            return [4 /*yield*/, __1.InviteModel.findOne({ email: email, event: event })];
                                                        case 1:
                                                            invite = _b.sent();
                                                            if (invite) {
                                                                group.addInvite(invite);
                                                                return [2 /*return*/, true];
                                                            }
                                                            return [2 /*return*/, false];
                                                        case 2:
                                                            e_2 = _b.sent();
                                                            console.error(e_2);
                                                            return [2 /*return*/, false];
                                                        case 3: return [2 /*return*/];
                                                    }
                                                });
                                            });
                                        }))];
                                case 2:
                                    results = _c.sent();
                                    group.meta = JSON.stringify(__assign(__assign({}, JSON.parse((_b = group.meta) !== null && _b !== void 0 ? _b : "{}")), meta));
                                    _c.label = 3;
                                case 3:
                                    _c.trys.push([3, 5, , 6]);
                                    return [4 /*yield*/, group.save()];
                                case 4:
                                    _c.sent();
                                    return [2 /*return*/, {
                                            invites: results.length,
                                            success: results.filter(function (value) { return value; }).length,
                                        }];
                                case 5:
                                    e_1 = _c.sent();
                                    console.error(e_1);
                                    return [2 /*return*/, {
                                            invites: results.length,
                                            success: 0,
                                        }];
                                case 6: return [2 /*return*/];
                            }
                        });
                    });
                }))];
            case 1:
                result = _a.sent();
                final = result.reduce(function (prev, next) {
                    return {
                        invites: prev.invites + next.invites,
                        success: prev.success + next.success,
                    };
                });
                console.log("Invites added: " + final.success + "/" + final.invites);
                return [2 /*return*/];
        }
    });
}); };
exports.importGroupInfo = importGroupInfo;
var importOldGroups = function (event, file) { return __awaiter(void 0, void 0, void 0, function () {
    var info;
    return __generator(this, function (_a) {
        info = (0, exports.parseOldGroups)(file);
        return [2 /*return*/, (0, exports.importGroupInfo)(event, info)];
    });
}); };
exports.importOldGroups = importOldGroups;
