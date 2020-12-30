"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hexadectetNotationToBinaryString = exports.binaryStringToHexadecimalString = exports.colonHexadecimalNotationToBinaryString = exports.hexadecimalStringToHexadecatetString = exports.hexadecimalStringToBinaryString = exports.bigIntegerNumberToHexadecimalString = void 0;
var bigInt = require("big-integer/BigInteger");
var IPv6Utils_1 = require("./IPv6Utils");
var BinaryUtils_1 = require("./BinaryUtils");
/**
 * Converts a given BigInteger number to a hexadecimal string
 * @param num the BigInteger number
 * @returns {string} the hexadeciaml string
 */
exports.bigIntegerNumberToHexadecimalString = function (num) {
    return num.toString(16);
};
/**
 * Converts a number in hexadecimal (base 16) to binary string
 * @param {string} hexadecimalString the number in base 16
 * @returns {string} the number converted to base 2
 */
exports.hexadecimalStringToBinaryString = function (hexadecimalString) {
    var inDecimal = bigInt(hexadecimalString, 16);
    return inDecimal.toString(2);
};
/**
 * Converts a number in hexadecimal (base 16) to binary hexadecatet string.
 * This means the bits in the output cannot be more than 16
 *
 * @param hexadecimalString {string} the number converted to binary hexadecatet string
 */
exports.hexadecimalStringToHexadecatetString = function (hexadecimalString) {
    var binaryString = exports.hexadecimalStringToBinaryString(hexadecimalString);
    var length = binaryString.length;
    if (length > 16) {
        throw new Error("Given decimal in binary contains digits greater than an Hexadecatet");
    }
    return BinaryUtils_1.leftPadWithZeroBit(binaryString, 16);
};
/**
 * Given an IPv6 number in hexadecimal notated string, e.g 2001:0db8:0000:0000:0000:0000:0000:0000 converts it to
 * binary string
 *
 * @param hexadecimalString IPv6 string
 * @returns {string} the binary value of the given ipv6 number in string
 */
exports.colonHexadecimalNotationToBinaryString = function (hexadecimalString) {
    var expandedIPv6 = IPv6Utils_1.expandIPv6Number(hexadecimalString);
    var stringHexadecimal = expandedIPv6.split(":");
    return stringHexadecimal.reduce(function (binaryAsString, hexidecimal) {
        return binaryAsString.concat(exports.hexadecimalStringToHexadecatetString(hexidecimal));
    }, '');
};
/**
 * Converts number in binary string to hexadecimal string
 * @param {string} num in binary string
 * @returns {string} num in hexadecimal string
 */
exports.binaryStringToHexadecimalString = function (num) {
    // first convert to binary string to decimal (big Integer)
    var inDecimal = bigInt(num, 2);
    return inDecimal.toString(16);
};
/**
 * Converts a given IPv6 number expressed in the hexadecimal string notation into a 16 bit binary number in string
 * @param {string} hexadectetString the IPv6 number
 * @returns {string} the IPv6 number converted to binary string
 */
exports.hexadectetNotationToBinaryString = function (hexadectetString) {
    var expand = IPv6Utils_1.expandIPv6Number(hexadectetString);
    var hexadecimals = expand.split(":");
    return hexadecimals.reduce(function (hexadecimalAsString, hexavalue) {
        return hexadecimalAsString.concat(BinaryUtils_1.leftPadWithZeroBit(exports.hexadecimalStringToBinaryString(hexavalue), 16));
    }, '');
};
//# sourceMappingURL=HexadecimalUtils.js.map