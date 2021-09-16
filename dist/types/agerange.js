"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidAgeRange = exports.AgeRange = void 0;
var AgeRange;
(function (AgeRange) {
    AgeRange[AgeRange["unspecified"] = 1] = "unspecified";
    AgeRange[AgeRange["from0to10"] = 2] = "from0to10";
    AgeRange[AgeRange["from11to15"] = 3] = "from11to15";
    AgeRange[AgeRange["from16to20"] = 4] = "from16to20";
    AgeRange[AgeRange["from21to30"] = 5] = "from21to30";
    AgeRange[AgeRange["from31to40"] = 6] = "from31to40";
})(AgeRange = exports.AgeRange || (exports.AgeRange = {}));
var isValidAgeRange = function (value) {
    return !!AgeRange[value];
};
exports.isValidAgeRange = isValidAgeRange;
