"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bigInt = require("big-integer/BigInteger");
var IPNumType_1 = require("./IPNumType");
/**
 * Converts a decimal number to binary string
 *
 * @param num number to parse
 * @returns {string} the binary string representation of number
 */
exports.decimalNumberToBinaryString = function (num) {
    return Number(num).toString(2);
};
/**
 * Converts a given BigInteger number to a binary string
 * @param num the BigInteger number
 * @returns {string} the binary string
 */
exports.bigIntegerNumberToBinaryString = function (num) {
    return num.toString(2);
};
/**
 * Converts a decimal number to binary octet (8 bit) string. If needed the octet will be padded with zeros
 * to make it up to 8 bits
 *
 * @param {number} num to convert to octet string
 * @returns {string} the octet string representation of given number
 */
exports.decimalNumberToOctetString = function (num) {
    var binaryString = exports.decimalNumberToBinaryString(num);
    var length = binaryString.length;
    if (length > 8) {
        throw new Error("Given decimal in binary contains digits greater than an octet");
    }
    return exports.leftPadWithZeroBit(binaryString, 8);
};
/**
 * Parses number in binary to number in BigInteger
 *
 * @param num binary number in string to parse
 * @returns {number} binary number in BigInteger
 */
exports.parseBinaryStringToBigInteger = function (num) {
    return bigInt(num, 2);
};
/**
 * Given an IPv4 number in dot-decimal notated string, e.g 192.168.0.1 converts it to
 * binary string, e.g. '11000000101010000000000000000001'
 *
 * @param dottedDecimal IPv4 string in dot-decimal notation
 * @returns {string} the binary value of the given ipv4 number in string
 */
exports.dottedDecimalNotationToBinaryString = function (dottedDecimal) {
    var stringOctets = dottedDecimal.split(".");
    return stringOctets.reduce(function (binaryAsString, octet) {
        return binaryAsString.concat(exports.decimalNumberToOctetString(parseInt(octet)));
    }, '');
};
/**
 * Given a binary string, adds a number of zero to the left until string is as long as the given string length
 * @param {string} binaryString the string to pad
 * @param {number} finalStringLength the final length of string after padding
 * @returns {string}
 */
exports.leftPadWithZeroBit = function (binaryString, finalStringLength) {
    if (binaryString.length > finalStringLength) {
        throw new Error("Given string is already longer than given final length after padding: " + finalStringLength);
    }
    return "0".repeat(finalStringLength - binaryString.length).concat(binaryString);
};
/**
 * Given the prefix portion of a cidr notation and the type of IP number, returns the subnet mask in binary string
 *
 * @param {number} cidrPrefix the prefix part of a cidr notation
 * @param {IPNumType.IPv4 | IPNumType.IPv6} ipType the type of the ip number in the range the cidr represents
 */
exports.cidrPrefixToSubnetMaskBinary = function (cidrPrefix, ipType) {
    var cidrUpperValue;
    if (ipType == IPNumType_1.IPNumType.IPv4) {
        cidrUpperValue = 32;
    }
    else {
        cidrUpperValue = 128;
    }
    if (cidrPrefix > cidrUpperValue)
        throw "value is greater than " + cidrUpperValue;
    var onBits = '1'.repeat(cidrPrefix);
    var offBits = '0'.repeat(cidrUpperValue - cidrPrefix);
    return "" + onBits + offBits;
};
//# sourceMappingURL=BinaryUtils.js.map