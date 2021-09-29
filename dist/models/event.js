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
exports.EventModel = exports.Event = void 0;
var typegoose_1 = require("@typegoose/typegoose");
var user_1 = require("./user");
var helpers_1 = require("../helpers");
var group_1 = require("./group");
var invite_1 = require("./invite");
var Event = /** @class */ (function () {
    function Event() {
    }
    Event.prototype.addGroup = function (name, role, mainChannel, channels) {
        if (channels === void 0) { channels = []; }
        return __awaiter(this, void 0, void 0, function () {
            var group;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, group_1.GroupModel.create({
                            event: this,
                            name: name,
                            role: role,
                            mainChannel: mainChannel,
                            channels: channels,
                        })];
                    case 1:
                        group = _a.sent();
                        group.save();
                        this.groups.push(group);
                        return [2 /*return*/, group];
                }
            });
        });
    };
    Event.prototype.getInviteIndex = function (invite) {
        if (!invite)
            return -1;
        if (this.invites.length === 0)
            return -1;
        var id = invite_1.InviteModel.getId(invite);
        if (!id)
            return -1;
        return this.invites.findIndex(function (found) {
            return invite_1.InviteModel.getId(found) === id;
        });
    };
    Event.prototype.hasInvite = function (invite) {
        return this.getInviteIndex(invite) !== -1;
    };
    Event.prototype.addInvite = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var found, created, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, invite_1.InviteModel.findExact(this, email)];
                    case 1:
                        found = _a.sent();
                        if (found)
                            return [2 /*return*/, [found, true]];
                        return [4 /*yield*/, invite_1.InviteModel.create({ event: this, email: email })];
                    case 2:
                        created = _a.sent();
                        return [4 /*yield*/, user_1.UserModel.findByUnresolvedInvite(this, email)];
                    case 3:
                        user = _a.sent();
                        if (!user) return [3 /*break*/, 5];
                        user.forcedResolveInvite(this, created);
                        return [4 /*yield*/, user.save()];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/, [created, false]];
                }
            });
        });
    };
    Event.prototype.addInviteList = function (invites, options) {
        var _a;
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var role, opts, result, updated;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        role = (_a = options.role) !== null && _a !== void 0 ? _a : this.roles.keys().next().value;
                        if (!role || !this.roles.has(role))
                            throw new Error("The role required for these invites doesn't exist in this Event. Event: \"" + this.name + "\", Role: \"" + role + "\"");
                        opts = __assign({ role: "", deactivateMissing: false, overwriteRole: true, overwriteMeta: true }, options);
                        result = {
                            found: [],
                            created: [],
                            error: [],
                            deactivated: 0,
                        };
                        if (!opts.deactivateMissing) return [3 /*break*/, 2];
                        return [4 /*yield*/, invite_1.InviteModel.updateMany({ role: role, active: true }, { active: false })];
                    case 1:
                        updated = _b.sent();
                        result.deactivated = updated.nModified;
                        _b.label = 2;
                    case 2: return [4 /*yield*/, Promise.allSettled(invites.map(function (_a) { var _b; return __awaiter(_this, void 0, void 0, function () {
                            var _c, invite, found, oldMeta, error_1;
                            var email = _a.email, item = __rest(_a, ["email"]);
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        _d.trys.push([0, 3, , 4]);
                                        return [4 /*yield*/, this.addInvite(email)];
                                    case 1:
                                        _c = _d.sent(), invite = _c[0], found = _c[1];
                                        if (found) {
                                            result.found.push(invite);
                                        }
                                        else {
                                            result.created.push(invite);
                                        }
                                        oldMeta = JSON.parse(invite.meta);
                                        invite.meta = JSON.stringify(opts.overwriteMeta
                                            ? __assign(__assign({}, oldMeta), item.meta) : __assign(__assign({}, item.meta), oldMeta));
                                        invite.active = true;
                                        invite.setRole((_b = item.role) !== null && _b !== void 0 ? _b : role, opts.overwriteRole);
                                        return [4 /*yield*/, invite.save()];
                                    case 2:
                                        _d.sent();
                                        return [3 /*break*/, 4];
                                    case 3:
                                        error_1 = _d.sent();
                                        result.error.push({ email: email, error: (0, helpers_1.guaranteeError)(error_1) });
                                        return [3 /*break*/, 4];
                                    case 4: return [2 /*return*/, true];
                                }
                            });
                        }); }))];
                    case 3:
                        _b.sent();
                        if (opts.deactivateMissing) {
                            result.deactivated -= result.found.length;
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    Event.fetchEvent = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var id, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!event)
                            return [2 /*return*/, null];
                        if (typeof event !== "string" &&
                            (0, typegoose_1.isDocument)(event))
                            return [2 /*return*/, event];
                        if (!(event instanceof Event)) return [3 /*break*/, 4];
                        id = event._id;
                        if (!id) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.findById(id)];
                    case 1:
                        _a = _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _a = null;
                        _b.label = 3;
                    case 3: return [2 /*return*/, _a];
                    case 4: return [4 /*yield*/, this.findById(event).exec()];
                    case 5: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    Event.getId = function (event) {
        if (!event)
            return undefined;
        if (typeof event !== "string" &&
            (0, typegoose_1.isDocument)(event))
            return event._id.toString();
        if (event instanceof Event) {
            var id = event._id;
            return id ? id.toString() : undefined;
        }
        return event.toString();
    };
    __decorate([
        (0, typegoose_1.prop)({ required: true, unique: true }),
        __metadata("design:type", String)
    ], Event.prototype, "name", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: true, index: true, default: "" }),
        __metadata("design:type", String)
    ], Event.prototype, "category", void 0);
    __decorate([
        (0, typegoose_1.prop)({ ref: function () { return "Invite"; }, required: true, default: function () { return []; } }),
        __metadata("design:type", Array)
    ], Event.prototype, "invites", void 0);
    __decorate([
        (0, typegoose_1.prop)({ ref: function () { return "Group"; }, required: true, default: function () { return []; } }),
        __metadata("design:type", Array)
    ], Event.prototype, "groups", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: true, default: false }),
        __metadata("design:type", Boolean)
    ], Event.prototype, "isHidden", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: true, default: 0 }),
        __metadata("design:type", Number)
    ], Event.prototype, "maxGroupSize", void 0);
    __decorate([
        (0, typegoose_1.prop)({
            type: String,
            required: true,
            default: function () { return new Map(); },
        }),
        __metadata("design:type", Map)
    ], Event.prototype, "roles", void 0);
    __decorate([
        (0, typegoose_1.prop)({ default: "{}" }),
        __metadata("design:type", String)
    ], Event.prototype, "meta", void 0);
    return Event;
}());
exports.Event = Event;
exports.EventModel = (0, typegoose_1.getModelForClass)(Event);
