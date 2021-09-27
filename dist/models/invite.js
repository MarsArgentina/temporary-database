"use strict";
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
exports.InviteModel = exports.Invite = void 0;
var typegoose_1 = require("@typegoose/typegoose");
var user_1 = require("./user");
var group_1 = require("./group");
var event_1 = require("./event");
var getResults_1 = require("../helpers/getResults");
var generate_password_1 = require("generate-password");
var Invite = /** @class */ (function () {
    function Invite() {
    }
    Invite_1 = Invite;
    Invite.prototype.assignToGroup = function (group) {
        return __awaiter(this, void 0, void 0, function () {
            var fullGroup, fullGroup;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.group) return [3 /*break*/, 2];
                        return [4 /*yield*/, group_1.GroupModel.fetchGroup(this.group)];
                    case 1:
                        fullGroup = _a.sent();
                        if (fullGroup)
                            fullGroup.removeInvite(this);
                        _a.label = 2;
                    case 2:
                        if (!group) return [3 /*break*/, 4];
                        return [4 /*yield*/, group_1.GroupModel.fetchGroup(group)];
                    case 3:
                        fullGroup = _a.sent();
                        if (!fullGroup)
                            return [2 /*return*/, false];
                        fullGroup.addInvite(this);
                        _a.label = 4;
                    case 4:
                        this.group = group;
                        return [2 /*return*/, true];
                }
            });
        });
    };
    Invite.prototype.revoke = function (options) {
        if (options === void 0) { options = { revokeFromUser: false, returnUser: false }; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, revokeFromUser, _b, returnUser, user, event_2, revoked;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = options.revokeFromUser, revokeFromUser = _a === void 0 ? false : _a, _b = options.returnUser, returnUser = _b === void 0 ? false : _b;
                        if (!this.user)
                            return [2 /*return*/, null];
                        if (!(returnUser || revokeFromUser)) return [3 /*break*/, 2];
                        return [4 /*yield*/, user_1.UserModel.fetchUser(this.user)];
                    case 1:
                        user = _c.sent();
                        _c.label = 2;
                    case 2:
                        this.user = undefined;
                        if (!user)
                            return [2 /*return*/, null];
                        if (!revokeFromUser) return [3 /*break*/, 5];
                        return [4 /*yield*/, event_1.EventModel.fetchEvent(this.event)];
                    case 3:
                        event_2 = _c.sent();
                        if (!event_2)
                            throw new Error("Couldn't find an Event for this invite.");
                        return [4 /*yield*/, user.revokeInvite(event_2)];
                    case 4:
                        revoked = _c.sent();
                        if (exports.InviteModel.getId(this) !== exports.InviteModel.getId(revoked)) {
                            console.error("Probably revoked an erroneous invite\n          - The user was: " + user.toString() + "\n          - The invite that got revoked was: " + (revoked === null || revoked === void 0 ? void 0 : revoked.toString()) + "\n          - The invite that had to be revoked was: " + this.toString() + "}\n        ");
                        }
                        _c.label = 5;
                    case 5: return [2 /*return*/, returnUser ? user : null];
                }
            });
        });
    };
    Invite.prototype.resolve = function (user, forceRevoke) {
        if (forceRevoke === void 0) { forceRevoke = false; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.user && forceRevoke) {
                    this.revoke({ revokeFromUser: true });
                }
                this.user = user;
                return [2 /*return*/];
            });
        });
    };
    Invite.prototype.getAllRoles = function () {
        return __awaiter(this, void 0, void 0, function () {
            var event, roles, group;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, event_1.EventModel.fetchEvent(this.event)];
                    case 1:
                        event = _a.sent();
                        if (!event)
                            throw new Error("The Event this Invite belongs to couldn't be found.");
                        roles = this.roles
                            .map(function (role) {
                            return event.roles.get(role);
                        })
                            .filter(function (role) { return role !== undefined && role !== ""; });
                        if (!this.group) return [3 /*break*/, 3];
                        return [4 /*yield*/, group_1.GroupModel.fetchGroup(this.group)];
                    case 2:
                        group = _a.sent();
                        if (!group)
                            throw new Error("The Group this Invite belongs to couldn't be found.");
                        roles.push(group.role);
                        _a.label = 3;
                    case 3: return [2 /*return*/, roles];
                }
            });
        });
    };
    Invite.prototype.setRole = function (role, add) {
        if (add === void 0) { add = false; }
        return __awaiter(this, void 0, void 0, function () {
            var event;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, event_1.EventModel.fetchEvent(this.event)];
                    case 1:
                        event = _a.sent();
                        if (!event)
                            throw new Error("The Event this Invite belongs to couldn't be found.");
                        if (!event.roles.has(role))
                            throw new Error("The role you are trying to give is not defined for this Event");
                        if (add) {
                            if (!this.roles.includes(role))
                                this.roles.push(role);
                        }
                        else {
                            this.roles.splice(0, this.roles.length);
                            this.roles.push("role");
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Invite.findExact = function (event, email) {
        if (!event)
            return null;
        return this.findOne({ event: event, email: email });
    };
    Invite.fetchAllInvites = function (invites) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = getResults_1.getFulfilledResults;
                        return [4 /*yield*/, Promise.allSettled(invites.map(this.fetchInvite))];
                    case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
                }
            });
        });
    };
    Invite.fetchInvite = function (invite) {
        return __awaiter(this, void 0, void 0, function () {
            var id, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!invite)
                            return [2 /*return*/, null];
                        if (typeof invite !== "string" &&
                            (0, typegoose_1.isDocument)(invite))
                            return [2 /*return*/, invite];
                        if (!(invite instanceof Invite_1)) return [3 /*break*/, 4];
                        id = invite._id;
                        if (!id) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.findById(id)];
                    case 1:
                        _a = _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _a = null;
                        _b.label = 3;
                    case 3: return [2 /*return*/, _a];
                    case 4: return [4 /*yield*/, this.findById(invite)];
                    case 5: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    Invite.getId = function (invite) {
        if (!invite)
            return undefined;
        if (typeof invite !== "string" &&
            (0, typegoose_1.isDocument)(invite))
            return invite._id.toString();
        if (invite instanceof Invite_1) {
            var id = invite._id;
            return id ? id.toString() : undefined;
        }
        return invite.toString();
    };
    var Invite_1;
    __decorate([
        (0, typegoose_1.prop)({ required: true, default: true }),
        __metadata("design:type", Boolean)
    ], Invite.prototype, "active", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: true }),
        __metadata("design:type", String)
    ], Invite.prototype, "email", void 0);
    __decorate([
        (0, typegoose_1.prop)({
            type: String,
            required: true,
            default: function () { return ["participant"]; },
            minlength: 1,
        }),
        __metadata("design:type", Array)
    ], Invite.prototype, "roles", void 0);
    __decorate([
        (0, typegoose_1.prop)({
            required: true,
            unique: true,
            default: function () {
                return (0, generate_password_1.generate)({
                    length: 10,
                    uppercase: true,
                    lowercase: false,
                    numbers: true,
                    symbols: false,
                });
            },
        }),
        __metadata("design:type", String)
    ], Invite.prototype, "certificate", void 0);
    __decorate([
        (0, typegoose_1.prop)({ default: "{}" }),
        __metadata("design:type", String)
    ], Invite.prototype, "meta", void 0);
    __decorate([
        (0, typegoose_1.prop)({ ref: function () { return "Event"; }, required: true }),
        __metadata("design:type", Object)
    ], Invite.prototype, "event", void 0);
    __decorate([
        (0, typegoose_1.prop)({ ref: function () { return "User"; } }),
        __metadata("design:type", Object)
    ], Invite.prototype, "user", void 0);
    __decorate([
        (0, typegoose_1.prop)({ ref: function () { return "Group"; } }),
        __metadata("design:type", Object)
    ], Invite.prototype, "group", void 0);
    Invite = Invite_1 = __decorate([
        (0, typegoose_1.index)({ event: 1, email: 1 }, { unique: true })
    ], Invite);
    return Invite;
}());
exports.Invite = Invite;
exports.InviteModel = (0, typegoose_1.getModelForClass)(Invite);
