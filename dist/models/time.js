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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeModel = exports.Time = void 0;
var typegoose_1 = require("@typegoose/typegoose");
var Time = /** @class */ (function () {
    function Time() {
    }
    Time.getActiveTimes = function (date) {
        date = date !== null && date !== void 0 ? date : Date.now();
        return this.find({ start: { $gte: date }, end: { $lte: date }, hidden: false }, null, { multi: true }).exec();
    };
    __decorate([
        (0, typegoose_1.prop)({ required: true }),
        __metadata("design:type", String)
    ], Time.prototype, "text", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: true, default: function () { return Date.now(); } }),
        __metadata("design:type", Number)
    ], Time.prototype, "start", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: true }),
        __metadata("design:type", Number)
    ], Time.prototype, "end", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: true, default: false }),
        __metadata("design:type", Boolean)
    ], Time.prototype, "hidden", void 0);
    return Time;
}());
exports.Time = Time;
exports.TimeModel = (0, typegoose_1.getModelForClass)(Time);
