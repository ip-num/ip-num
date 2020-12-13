"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.intLog2 = exports.cidrPrefixToMaskBinaryString = exports.leftPadWithZeroBit = exports.dottedDecimalNotationToBinaryString = exports.parseBinaryStringToBigInteger = exports.decimalNumberToOctetString = exports.bigIntegerNumberToBinaryString = exports.decimalNumberToBinaryString = void 0;
var bigInt = require("big-integer/BigInteger");
var IPNumType_1 = require("./IPNumType");
/**
 * Converts a decimal number to binary string
 *
 * @param num number to parse
 * @returns {string} the binary string representation of number
 */
var decimalNumberToBinaryString = function (num) {
    return Number(num).toString(2);
};
exports.decimalNumberToBinaryString = decimalNumberToBinaryString;
/**
 * Converts a given BigInteger number to a binary string
 * @param num the BigInteger number
 * @returns {string} the binary string
 */
var bigIntegerNumberToBinaryString = function (num) {
    return num.toString(2);
};
exports.bigIntegerNumberToBinaryString = bigIntegerNumberToBinaryString;
/**
 * Converts a decimal number to binary octet (8 bit) string. If needed the octet will be padded with zeros
 * to make it up to 8 bits
 *
 * @param {number} num to convert to octet string
 * @returns {string} the octet string representation of given number
 */
var decimalNumberToOctetString = function (num) {
    var binaryString = exports.decimalNumberToBinaryString(num);
    var length = binaryString.length;
    if (length > 8) {
        throw new Error("Given decimal in binary contains digits greater than an octet");
    }
    return exports.leftPadWithZeroBit(binaryString, 8);
};
exports.decimalNumberToOctetString = decimalNumberToOctetString;
/**
 * Parses number in binary to number in BigInteger
 *
 * @param num binary number in string to parse
 * @returns {number} binary number in BigInteger
 */
var parseBinaryStringToBigInteger = function (num) {
    return bigInt(num, 2);
};
exports.parseBinaryStringToBigInteger = parseBinaryStringToBigInteger;
/**
 * Given an IPv4 number in dot-decimal notated string, e.g 192.168.0.1 converts it to
 * binary string, e.g. '11000000101010000000000000000001'
 *
 * @param dottedDecimal IPv4 string in dot-decimal notation
 * @returns {string} the binary value of the given ipv4 number in string
 */
var dottedDecimalNotationToBinaryString = function (dottedDecimal) {
    var stringOctets = dottedDecimal.split(".");
    return stringOctets.reduce(function (binaryAsString, octet) {
        return binaryAsString.concat(exports.decimalNumberToOctetString(parseInt(octet)));
    }, '');
};
exports.dottedDecimalNotationToBinaryString = dottedDecimalNotationToBinaryString;
/**
 * Given a binary string, adds a number of zero to the left until string is as long as the given string length
 * @param {string} binaryString the string to pad
 * @param {number} finalStringLength the final length of string after padding
 * @returns {string}
 */
var leftPadWithZeroBit = function (binaryString, finalStringLength) {
    if (binaryString.length > finalStringLength) {
        throw new Error("Given string is already longer than given final length after padding: " + finalStringLength);
    }
    return "0".repeat(finalStringLength - binaryString.length).concat(binaryString);
};
exports.leftPadWithZeroBit = leftPadWithZeroBit;
/**
 * Given the prefix portion of a cidr notation and the type of IP number, returns the mask in binary string
 *
 * @param {number} cidrPrefix the prefix part of a cidr notation
 * @param {IPNumType.IPv4 | IPNumType.IPv6} ipType the type of the ip number in the range the cidr represents
 */
var cidrPrefixToMaskBinaryString = function (cidrPrefix, ipType) {
    var cidrUpperValue;
    if (ipType == IPNumType_1.IPNumType.IPv4) {
        cidrUpperValue = 32;
    }
    else {
        cidrUpperValue = 128;
    }
    if (cidrPrefix > cidrUpperValue)
        throw Error("Value is greater than " + cidrUpperValue);
    var onBits = '1'.repeat(cidrPrefix);
    var offBits = '0'.repeat(cidrUpperValue - cidrPrefix);
    return "" + onBits + offBits;
};
exports.cidrPrefixToMaskBinaryString = cidrPrefixToMaskBinaryString;
/**
 * Calculates the log, to base 2 of given number.
 *
 * @throws Error if number cannot be converted to log base 2
 * @param givenNumber the number to calculate log base 2
 * @return the log base 2 of given number
 */
var intLog2 = function (givenNumber) {
    var result = 0;
    while (givenNumber.isEven()) {
        if (givenNumber.equals(bigInt(2))) {
            result++;
            break;
        }
        givenNumber = givenNumber.shiftRight(bigInt(1));
        if (givenNumber.isOdd()) {
            result = 0;
            break;
        }
        result++;
    }
    if (result == 0) {
        throw new Error("The value of log2 for " + givenNumber.toString() + " is not an integer");
    }
    return result;
};
exports.intLog2 = intLog2;
//# sourceMappingURL=BinaryUtils.js.map