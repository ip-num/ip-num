"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isIPv4Prefix = exports.IPv6Prefix = exports.IPv4Prefix = void 0;
var Validator_1 = require("./Validator");
var IPNumber_1 = require("./IPNumber");
var BinaryUtils_1 = require("./BinaryUtils");
var HexadecimalUtils_1 = require("./HexadecimalUtils");
var Hexadecatet_1 = require("./Hexadecatet");
var bigInt = require("big-integer");
/**
 * Represents the prefix portion in the CIDR notation for representing IP ranges
 *
 * The IPv4 prefix portion represents the mask. It is the number of continuous bits turned on (with value 1)
 * counting from the left side of an 8 bit value.
 *
 * {@see https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing} for more information on CIDR
 */
var IPv4Prefix = /** @class */ (function () {
    /**
     * Constructor for an instance of IPv4 prefix from a decimal number
     *
     * @param {number} rawValue the decimal value to construct the IPv4 prefix from.
     * @returns {IPv4Prefix} the instance of an IPv4 prefix
     */
    function IPv4Prefix(rawValue) {
        var _a;
        this.type = "IPv4";
        this.bitValue = bigInt(32);
        var isValid;
        var message;
        _a = __read(Validator_1.Validator.isValidPrefixValue(rawValue, "IPv4" /* IPv4 */), 2), isValid = _a[0], message = _a[1];
        if (!isValid) {
            throw new Error(message.filter(function (msg) { return msg !== ''; }).toString());
        }
        this.value = rawValue;
    }
    /**
     * Convenience method for constructing an instance of IPv4 prefix from a decimal number
     *
     * @param {number} rawValue the decimal value to construct the IPv4 prefix from.
     * @returns {IPv4Prefix} the instance of an IPv4 prefix
     */
    IPv4Prefix.fromNumber = function (rawValue) {
        return new IPv4Prefix(rawValue);
    };
    ;
    IPv4Prefix.fromRangeSize = function (rangeSize) {
        var prefixNumber = rangeSize.equals(bigInt.one) ? 32 : 32 - rangeSizeToPrefix(rangeSize, Validator_1.Validator.IPV4_SIZE);
        return IPv4Prefix.fromNumber(prefixNumber);
    };
    ;
    /**
     * Gets the decimal value of the IPv4 prefix
     *
     * @returns {number} the decimal value of the IPv4 prefix
     */
    IPv4Prefix.prototype.getValue = function () {
        return this.value;
    };
    /**
     * Gets the decimal value of the IPv4 prefix as string
     * @returns {string} The decimal value of the IPv4 prefix as string
     */
    IPv4Prefix.prototype.toString = function () {
        return this.value.toString();
    };
    /**
     * Converts the IPv4 prefix to a {@link IPv4Mask}
     *
     * The IPv4 mask is the representation of the prefix in the dot-decimal notation
     *
     * @returns {IPv4Mask} the mask representation of the prefix
     */
    IPv4Prefix.prototype.toMask = function () {
        var onBits = '1'.repeat(this.value);
        var offBits = '0'.repeat(32 - this.value);
        return IPNumber_1.IPv4Mask.fromDecimalDottedString(this.toDecimalNotation("" + onBits + offBits));
    };
    /**
     * Returns the size (number of IP numbers) of range of this prefix
     *
     * @return {BigInteger} the size (number of IP numbers) of range of this prefix
     */
    IPv4Prefix.prototype.toRangeSize = function () {
        /**
         * Using bitwise shift operation this will be
         * 1 << (this.bitValue - this.prefix.getValue())
         * Since left shift a number by x is equivalent to multiplying the number by the power x raised to 2
         * 2 << 4 = 2 * (2 raised to 4)
         */
        return bigInt(2).pow(this.bitValue.minus(bigInt(this.getValue())));
    };
    /**
     * Returns a prefix for when this prefix is merged
     * with another prefix of the same size
     */
    IPv4Prefix.prototype.merge = function () {
        return new IPv4Prefix(this.value - 1);
    };
    /**
     * Returns a prefix for when this prefix is split
     * into two equal halves
     */
    IPv4Prefix.prototype.split = function () {
        return new IPv4Prefix(this.value + 1);
    };
    IPv4Prefix.prototype.toDecimalNotation = function (bits) {
        return BinaryUtils_1.parseBinaryStringToBigInteger(bits.substr(0, 8)) + "." + BinaryUtils_1.parseBinaryStringToBigInteger(bits.substr(8, 8)) + "." + BinaryUtils_1.parseBinaryStringToBigInteger(bits.substr(16, 8)) + "." + BinaryUtils_1.parseBinaryStringToBigInteger(bits.substr(24, 8));
    };
    return IPv4Prefix;
}());
exports.IPv4Prefix = IPv4Prefix;
/**
 * Represents the prefix portion in the CIDR notation for representing IP ranges
 *
 * The IPv6 prefix portion represents the mask. It is the number of continuous bits turned on (with value 1)
 * counting from the left side of an 128 bit value.
 *
 * {@see https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing} for more information on CIDR
 */
var IPv6Prefix = /** @class */ (function () {
    /**
     * Constructor for an instance of IPv6 prefix from a decimal number
     *
     * @param {number} rawValue the decimal value to construct the IPv6 prefix from.
     * @returns {IPv4Prefix} the instance of an IPv6 prefix
     */
    function IPv6Prefix(rawValue) {
        var _a;
        this.type = "IPv6";
        this.bitValue = bigInt(128);
        var isValid;
        var message;
        _a = __read(Validator_1.Validator.isValidPrefixValue(rawValue, "IPv6" /* IPv6 */), 2), isValid = _a[0], message = _a[1];
        if (!isValid) {
            throw new Error(message.filter(function (msg) { return msg !== ''; }).toString());
        }
        this.value = rawValue;
    }
    /**
     * Convenience method for constructing an instance of IPv46 prefix from a decimal number
     *
     * @param {number} rawValue the decimal value to construct the IPv6 prefix from.
     * @returns {IPv4Prefix} the instance of an IPv6 prefix
     */
    IPv6Prefix.fromNumber = function (rawValue) {
        return new IPv6Prefix(rawValue);
    };
    ;
    IPv6Prefix.fromRangeSize = function (rangeSize) {
        var prefixNumber = rangeSize.equals(bigInt.one) ? 128 : 128 - rangeSizeToPrefix(rangeSize, Validator_1.Validator.IPV6_SIZE);
        return IPv6Prefix.fromNumber(prefixNumber);
    };
    /**
     * Gets the decimal value of the IPv6 prefix
     *
     * @returns {number} the decimal value of the IPv6 prefix
     */
    IPv6Prefix.prototype.getValue = function () {
        return this.value;
    };
    /**
     * Gets the decimal value of the IPv4 prefix as string
     * @returns {string} he decimal value of the IPv4 prefix as string
     */
    IPv6Prefix.prototype.toString = function () {
        return this.value.toString();
    };
    /**
     * Converts the IPv6 prefix to a {@link IPv6Mask}
     *
     * The IPv6 mask is the representation of the prefix in 8 groups of 16 bit values represented in hexadecimal
     *
     * @returns {IPv6Mask} the mask representation of the prefix
     */
    IPv6Prefix.prototype.toMask = function () {
        var onBits = '1'.repeat(this.value);
        var offBits = '0'.repeat(128 - this.value);
        return IPNumber_1.IPv6Mask.fromHexadecimalString(this.toHexadecatetNotation("" + onBits + offBits));
    };
    /**
     * Returns the size (number of IP numbers) of range of this prefix
     *
     * @return {BigInteger} the size (number of IP numbers) of range of this prefix
     */
    IPv6Prefix.prototype.toRangeSize = function () {
        /**
         * Using bitwise shift operation this will be
         * 1 << (this.bitValue - this.prefix.getValue())
         * Since left shift a number by x is equivalent to multiplying the number by the power x raised to 2
         * 2 << 4 = 2 * (2 raised to 4)
         */
        return bigInt(2).pow(this.bitValue.minus(bigInt(this.getValue())));
    };
    /**
     * Returns a prefix for when this prefix is merged
     * with another prefix of the same size
     */
    IPv6Prefix.prototype.merge = function () {
        return new IPv6Prefix(this.value - 1);
    };
    /**
     * Returns a prefix for when this prefix is split
     * into two equal halves
     */
    IPv6Prefix.prototype.split = function () {
        return new IPv6Prefix(this.value + 1);
    };
    IPv6Prefix.prototype.toHexadecatetNotation = function (bits) {
        var binaryStrings = bits.match(/.{1,16}/g);
        var hexadecimalStrings = binaryStrings.map(function (binaryString) {
            return Hexadecatet_1.Hexadecatet.fromString(HexadecimalUtils_1.binaryStringToHexadecimalString(binaryString));
        });
        return hexadecimalStrings.map(function (value) { return value.toString(); }).join(":");
    };
    return IPv6Prefix;
}());
exports.IPv6Prefix = IPv6Prefix;
function rangeSizeToPrefix(rangeSize, rangeMaxSize) {
    var ipType = rangeMaxSize.greater(Validator_1.Validator.IPV4_SIZE) ? "IPv6" : "IPv4";
    if (rangeSize.greater(rangeMaxSize) || rangeSize.equals(bigInt(0))) {
        throw new Error(Validator_1.Validator.invalidIPRangeSizeMessage.replace("$iptype", ipType));
    }
    try {
        return BinaryUtils_1.intLog2(rangeSize);
    }
    catch (e) {
        throw new Error(Validator_1.Validator.invalidIPRangeSizeForCidrMessage);
    }
}
/**
 * Check is the given Prefix is an {@link IPv4Prefix} or not
 * @param prefix the IP prefix to check if it is IPv4Prefix.
 */
function isIPv4Prefix(prefix) {
    return prefix.type === "IPv4";
}
exports.isIPv4Prefix = isIPv4Prefix;
//# sourceMappingURL=Prefix.js.map