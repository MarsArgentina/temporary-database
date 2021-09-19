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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
exports.UserModel = exports.User = void 0;
var typegoose_1 = require("@typegoose/typegoose");
var agerange_1 = require("../types/agerange");
var invite_1 = require("./invite");
var User = /** @class */ (function () {
    function User() {
    }
    User_1 = User;
    User.prototype.isValidated = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.ageRange && this.ageRange !== agerange_1.AgeRange.unspecified];
            });
        });
    };
    User.prototype.revokeInvite = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var invites, resolved, revoked;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, invite_1.InviteModel.fetchAllInvites(this.resolvedInvites)];
                    case 1:
                        invites = _a.sent();
                        resolved = invites.find(function (invite) { return invite.event === event; });
                        if (!resolved) return [3 /*break*/, 3];
                        return [4 /*yield*/, resolved.revoke({ returnUser: true })];
                    case 2:
                        revoked = _a.sent();
                        if ((revoked === null || revoked === void 0 ? void 0 : revoked._id) !== this._id) {
                            console.error("Probably revoked an erroneous invite\n          - The invite was: " + resolved.toString() + "\n          - The user that got revoked was: " + (revoked === null || revoked === void 0 ? void 0 : revoked.toString()) + "\n          - The user that had to be revoked was: " + this.toString() + "}\n        ");
                        }
                        this.resolvedInvites.splice(this.resolvedInvites.findIndex(function (invite) { return resolved.isEqual(invite); }), 1);
                        return [2 /*return*/, resolved];
                    case 3:
                        this.unresolvedInvites.delete(event);
                        return [2 /*return*/, null];
                }
            });
        });
    };
    User.prototype.forcedResolveInvite = function (invite) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.unresolvedInvites.delete(invite.event);
                this.resolvedInvites.push(invite);
                return [2 /*return*/];
            });
        });
    };
    User.prototype.resolveInvite = function (event, forceRevoke) {
        if (forceRevoke === void 0) { forceRevoke = false; }
        return __awaiter(this, void 0, void 0, function () {
            var email, invite, resolved;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        email = this.unresolvedInvites.get(event);
                        if (!email)
                            return [2 /*return*/, null];
                        return [4 /*yield*/, invite_1.InviteModel.findExact(event, email)];
                    case 1:
                        invite = _a.sent();
                        if (!invite)
                            return [2 /*return*/, null];
                        resolved = invite.resolve(this, forceRevoke);
                        if (!resolved)
                            return [2 /*return*/, null];
                        this.forcedResolveInvite(invite);
                        return [2 /*return*/, invite];
                }
            });
        });
    };
    User.prototype.setInvite = function (event, email) {
        return __awaiter(this, void 0, void 0, function () {
            var revoked, resolved;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.revokeInvite(event)];
                    case 1:
                        revoked = _a.sent();
                        if (!(email && email !== "")) return [3 /*break*/, 3];
                        this.unresolvedInvites.set(event, email);
                        return [4 /*yield*/, this.resolveInvite(event)];
                    case 2:
                        resolved = _a.sent();
                        return [2 /*return*/, [revoked, resolved]];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    User.prototype.getInvite = function (event, unresolved) {
        var _a;
        if (unresolved === void 0) { unresolved = false; }
        return __awaiter(this, void 0, void 0, function () {
            var found;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!unresolved) return [3 /*break*/, 1];
                        return [2 /*return*/, (_a = this.unresolvedInvites.get(event)) !== null && _a !== void 0 ? _a : null];
                    case 1: return [4 /*yield*/, invite_1.InviteModel.fetchAllInvites(this.resolvedInvites)];
                    case 2:
                        found = (_b.sent()).find(function (invite) { return invite.event === event; });
                        return [2 /*return*/, found ? found : null];
                }
            });
        });
    };
    User.createFromDiscord = function (user) {
        return this.create({
            discordId: user.id,
            name: user.displayName,
            inDiscord: true,
        });
    };
    User.startUpdate = function () {
        return this.updateMany({}, { isUpdating: true }, { multi: true }).exec();
    };
    User.finishUpdate = function () {
        return this.updateMany({ isUpdating: true }, { inDiscord: false }, { multi: true }).exec();
    };
    User.findFromDiscord = function (user) {
        return this.findOne({ discordId: user.id });
    };
    User.addFromDiscord = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var found, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.findFromDiscord(user)];
                    case 1:
                        found = _b.sent();
                        if (!(found !== null && found !== void 0)) return [3 /*break*/, 2];
                        _a = found;
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.createFromDiscord(user)];
                    case 3:
                        _a = (_b.sent());
                        _b.label = 4;
                    case 4: return [2 /*return*/, [_a, !!found]];
                }
            });
        });
    };
    User.addUserList = function (event, users, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var opts;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        opts = __assign({ overwriteName: true, overwriteMeta: true }, options);
                        return [4 /*yield*/, Promise.allSettled(users.map(function (info) { return __awaiter(_this, void 0, void 0, function () {
                                var user;
                                var _a, _b;
                                return __generator(this, function (_c) {
                                    switch (_c.label) {
                                        case 0: return [4 /*yield*/, exports.UserModel.addFromDiscord(info)];
                                        case 1:
                                            user = (_c.sent())[0];
                                            user.name = opts.overwriteName ? info.displayName : user.name;
                                            user.meta = opts.overwriteMeta
                                                ? (_a = user.meta) !== null && _a !== void 0 ? _a : info.meta
                                                : (_b = info.meta) !== null && _b !== void 0 ? _b : user.meta;
                                            return [4 /*yield*/, user.setInvite(event, info.invite)];
                                        case 2:
                                            _c.sent();
                                            return [4 /*yield*/, user.save()];
                                        case 3: return [2 /*return*/, _c.sent()];
                                    }
                                });
                            }); }))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    User.fetchUser = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!user)
                            return [2 /*return*/, null];
                        if ((0, typegoose_1.isDocument)(user))
                            return [2 /*return*/, user];
                        return [4 /*yield*/, this.findOne({ _id: user })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    User.findByUnresolvedInvite = function (event, email) {
        var _a;
        return this.findOne((_a = {},
            _a["unresolvedInvites." + event] = email,
            _a)).exec();
    };
    var User_1;
    __decorate([
        (0, typegoose_1.prop)({ required: true, unique: true }),
        __metadata("design:type", String)
    ], User.prototype, "discordId", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: true }),
        __metadata("design:type", String)
    ], User.prototype, "name", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: true, default: false }),
        __metadata("design:type", Boolean)
    ], User.prototype, "inDiscord", void 0);
    __decorate([
        (0, typegoose_1.prop)({ default: false }),
        __metadata("design:type", Boolean)
    ], User.prototype, "isUpdating", void 0);
    __decorate([
        (0, typegoose_1.prop)({ enum: agerange_1.AgeRange, type: Number, default: agerange_1.AgeRange.unspecified }),
        __metadata("design:type", Number)
    ], User.prototype, "ageRange", void 0);
    __decorate([
        (0, typegoose_1.prop)({ type: String, required: true, default: function () { return []; } }),
        __metadata("design:type", Array)
    ], User.prototype, "roles", void 0);
    __decorate([
        (0, typegoose_1.prop)({
            type: String,
            required: true,
            default: function () { return new Map(); },
        }),
        __metadata("design:type", Map)
    ], User.prototype, "unresolvedInvites", void 0);
    __decorate([
        (0, typegoose_1.prop)(),
        __metadata("design:type", String)
    ], User.prototype, "meta", void 0);
    __decorate([
        (0, typegoose_1.prop)({ ref: function () { return "Invite"; }, required: true, default: function () { return []; } }),
        __metadata("design:type", Array)
    ], User.prototype, "resolvedInvites", void 0);
    User = User_1 = __decorate([
        (0, typegoose_1.pre)("remove", function () {
            var _this = this;
            Promise.allSettled(this.resolvedInvites.map(function (invite) { return __awaiter(_this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, invite_1.InviteModel.fetchInvite(invite)];
                        case 1:
                            (_a = (_b.sent())) === null || _a === void 0 ? void 0 : _a.revoke();
                            return [2 /*return*/];
                    }
                });
            }); }));
        })
    ], User);
    return User;
}());
exports.User = User;
exports.UserModel = (0, typegoose_1.getModelForClass)(User);
