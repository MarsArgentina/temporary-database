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
exports.GroupModel = exports.Group = void 0;
var typegoose_1 = require("@typegoose/typegoose");
var invite_1 = require("./invite");
var event_1 = require("./event");
var generate_password_1 = require("generate-password");
var Group = /** @class */ (function () {
    function Group() {
    }
    Group.prototype.getInviteIndex = function (invite) {
        if (!invite)
            return -1;
        if (this.members.length === 0)
            return -1;
        var id = invite_1.InviteModel.getId(invite);
        if (!id)
            return -1;
        return this.members.findIndex(function (found) {
            return invite_1.InviteModel.getId(found) === id;
        });
    };
    Group.prototype.hasInvite = function (invite) {
        return this.getInviteIndex(invite) !== -1;
    };
    Group.prototype.addInvite = function (invite) {
        if (event_1.EventModel.getId(invite.event) !== event_1.EventModel.getId(this.event))
            throw new Error("Tried to add an Invite that belongs to a different Event than this Group.");
        if (this.hasInvite(invite))
            return;
        this.members.push(invite);
    };
    Group.prototype.removeInvite = function (invite) {
        var index = this.getInviteIndex(invite);
        if (index === -1)
            return false;
        this.members.splice(index, 1);
        return true;
    };
    Group.fetchGroup = function (group) {
        return __awaiter(this, void 0, void 0, function () {
            var id, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!group)
                            return [2 /*return*/, null];
                        if (typeof group !== "string" &&
                            (0, typegoose_1.isDocument)(group))
                            return [2 /*return*/, group];
                        if (!(group instanceof Group)) return [3 /*break*/, 4];
                        id = group._id;
                        if (!id) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.findById(id)];
                    case 1:
                        _a = _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _a = null;
                        _b.label = 3;
                    case 3: return [2 /*return*/, _a];
                    case 4: return [4 /*yield*/, this.findById(group)];
                    case 5: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    Group.getId = function (group) {
        if (!group)
            return undefined;
        if (typeof group !== "string" &&
            (0, typegoose_1.isDocument)(group))
            return group._id.toString();
        if (group instanceof Group) {
            var id = group._id;
            return id ? id.toString() : undefined;
        }
        return group.toString();
    };
    __decorate([
        (0, typegoose_1.prop)({ ref: function () { return "Event"; }, required: true }),
        __metadata("design:type", Object)
    ], Group.prototype, "event", void 0);
    __decorate([
        (0, typegoose_1.prop)({ ref: function () { return "Invite"; }, required: true, default: function () { return []; } }),
        __metadata("design:type", Array)
    ], Group.prototype, "members", void 0);
    __decorate([
        (0, typegoose_1.prop)({ type: String, required: true, default: function () { return []; } }),
        __metadata("design:type", Array)
    ], Group.prototype, "channels", void 0);
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
    ], Group.prototype, "accessCode", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: true }),
        __metadata("design:type", String)
    ], Group.prototype, "role", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: true, default: false }),
        __metadata("design:type", Boolean)
    ], Group.prototype, "isOpen", void 0);
    __decorate([
        (0, typegoose_1.prop)(),
        __metadata("design:type", String)
    ], Group.prototype, "meta", void 0);
    return Group;
}());
exports.Group = Group;
exports.GroupModel = (0, typegoose_1.getModelForClass)(Group);
