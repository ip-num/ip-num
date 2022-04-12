"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hexadectetNotationToBinaryString = exports.binaryStringToHexadecimalString = exports.colonHexadecimalNotationToBinaryString = exports.hexadecimalStringToHexadecatetString = exports.hexadecimalStringToBinaryString = exports.bigIntToHexadecimalString = void 0;
const IPv6Utils_1 = require("./IPv6Utils");
const BinaryUtils_1 = require("./BinaryUtils");
/**
 * Converts a given bigint number to a hexadecimal string
 * @param num the bigint number
 * @returns {string} the hexadeciaml string
 */
exports.bigIntToHexadecimalString = (num) => {
    return num.toString(16);
};
/**
 * Converts a number in hexadecimal (base 16) to binary string
 * @param {string} hexadecimalString the number in base 16
 * @returns {string} the number converted to base 2
 */
exports.hexadecimalStringToBinaryString = (hexadecimalString) => {
    let inDecimal = BigInt(`0x${hexadecimalString}`);
    return inDecimal.toString(2);
};
/**
 * Converts a number in hexadecimal (base 16) to binary hexadecatet string.
 * This means the bits in the output cannot be more than 16
 *
 * @param hexadecimalString {string} the number converted to binary hexadecatet string
 */
exports.hexadecimalStringToHexadecatetString = (hexadecimalString) => {
    let binaryString = exports.hexadecimalStringToBinaryString(hexadecimalString);
    let length = binaryString.length;
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
exports.colonHexadecimalNotationToBinaryString = (hexadecimalString) => {
    let expandedIPv6 = IPv6Utils_1.expandIPv6Number(hexadecimalString);
    let stringHexadecimal = expandedIPv6.split(":");
    return stringHexadecimal.reduce((binaryAsString, hexidecimal) => {
        return binaryAsString.concat(exports.hexadecimalStringToHexadecatetString(hexidecimal));
    }, '');
};
/**
 * Converts number in binary string to hexadecimal string
 * @param {string} num in binary string
 * @returns {string} num in hexadecimal string
 */
exports.binaryStringToHexadecimalString = (num) => {
    // first convert to binary string to decimal (big Integer)
    let inDecimal = BigInt(`0b${num}`);
    return inDecimal.toString(16);
};
/**
 * Converts a given IPv6 number expressed in the hexadecimal string notation into a 16 bit binary number in string
 * @param {string} hexadectetString the IPv6 number
 * @returns {string} the IPv6 number converted to binary string
 */
exports.hexadectetNotationToBinaryString = (hexadectetString) => {
    let expand = IPv6Utils_1.expandIPv6Number(hexadectetString);
    let hexadecimals = expand.split(":");
    return hexadecimals.reduce((hexadecimalAsString, hexavalue) => {
        return hexadecimalAsString.concat(BinaryUtils_1.leftPadWithZeroBit(exports.hexadecimalStringToBinaryString(hexavalue), 16));
    }, '');
};
//# sourceMappingURL=HexadecimalUtils.js.map