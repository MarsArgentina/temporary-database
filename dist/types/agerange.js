"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringAsAgeRange = exports.ageRangeToString = exports.dateToAgeRange = exports.isValidAgeRange = exports.AgeRange = void 0;
var AgeRange;
(function (AgeRange) {
    AgeRange[AgeRange["unspecified"] = 1] = "unspecified";
    AgeRange[AgeRange["from0to10"] = 2] = "from0to10";
    AgeRange[AgeRange["from11to15"] = 3] = "from11to15";
    AgeRange[AgeRange["from16to20"] = 4] = "from16to20";
    AgeRange[AgeRange["from21to30"] = 5] = "from21to30";
    AgeRange[AgeRange["from31to40"] = 6] = "from31to40";
    AgeRange[AgeRange["from40"] = 7] = "from40";
})(AgeRange = exports.AgeRange || (exports.AgeRange = {}));
var isValidAgeRange = function (value) {
    return (value >= AgeRange.unspecified &&
        value <= AgeRange.from40 &&
        !!AgeRange[value]);
};
exports.isValidAgeRange = isValidAgeRange;
var AGE_RANGE = [
    "No especificado",
    "0 - 10",
    "11 - 15",
    "16 - 20",
    "21 - 30",
    "31 - 40",
    "40+",
];
var MIN_AGES = [0, 11, 16, 21, 31, 40];
var dateToAgeRange = function (date) {
    var ageDifMs = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.now();
    var ageDate = new Date(ageDifMs);
    var age = Math.abs(ageDate.getUTCFullYear() - 1970);
    var range = 7 - MIN_AGES.reverse().findIndex(function (min) { return age > min; });
    if ((0, exports.isValidAgeRange)(range))
        return range;
    return AgeRange.unspecified;
};
exports.dateToAgeRange = dateToAgeRange;
var ageRangeToString = function (range) {
    if ((0, exports.isValidAgeRange)(range)) {
        return AGE_RANGE[range - 1];
    }
    else {
        return "No especificado";
    }
};
exports.ageRangeToString = ageRangeToString;
var stringAsAgeRange = function (range) {
    var num = Number(range);
    if (!isNaN(num) && (0, exports.isValidAgeRange)(num = Math.floor(num)))
        return num;
    return AgeRange.unspecified;
};
exports.stringAsAgeRange = stringAsAgeRange;
