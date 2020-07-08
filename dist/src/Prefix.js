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
exports.IPv6Prefix = exports.IPv4Prefix = void 0;
var Validator_1 = require("./Validator");
var SubnetMask_1 = require("./SubnetMask");
var BinaryUtils_1 = require("./BinaryUtils");
var IPNumType_1 = require("./IPNumType");
var SubnetMask_2 = require("./SubnetMask");
var HexadecimalUtils_1 = require("./HexadecimalUtils");
var Hexadecatet_1 = require("./Hexadecatet");
/**
 * Represents the prefix portion in the CIDR notation for representing IP ranges
 *
 * The IPv4 prefix portion represents the subnet mask. It is the number of continuous bits turned on (with value 1)
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
        var isValid;
        var message;
        _a = __read(Validator_1.Validator.isValidPrefixValue(rawValue, IPNumType_1.IPNumType.IPv4), 2), isValid = _a[0], message = _a[1];
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
     * @returns {string} he decimal value of the IPv4 prefix as string
     */
    IPv4Prefix.prototype.toString = function () {
        return this.value.toString();
    };
    /**
     * Converts the IPv4 prefix to a {@link IPv4SubnetMask}
     *
     * The IPv4 Subnet mask is the representation of the prefix in the dot-decimal notation
     *
     * @returns {IPv4SubnetMask} the subnet mask representation of the prefix
     */
    IPv4Prefix.prototype.toSubnetMask = function () {
        var onBits = '1'.repeat(this.value);
        var offBits = '0'.repeat(32 - this.value);
        return SubnetMask_1.IPv4SubnetMask.fromDecimalDottedString(this.toDecimalNotation("" + onBits + offBits));
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
 * The IPv6 prefix portion represents the subnet mask. It is the number of continuous bits turned on (with value 1)
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
        var isValid;
        var message;
        _a = __read(Validator_1.Validator.isValidPrefixValue(rawValue, IPNumType_1.IPNumType.IPv6), 2), isValid = _a[0], message = _a[1];
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
     * Converts the IPv6 prefix to a {@link IPv6SubnetMask}
     *
     * The IPv6 Subnet mask is the representation of the prefix in 8 groups of 16 bit values represented in hexadecimal
     *
     * @returns {IPv6SubnetMask} the subnet mask representation of the prefix
     */
    IPv6Prefix.prototype.toSubnetMask = function () {
        var onBits = '1'.repeat(this.value);
        var offBits = '0'.repeat(128 - this.value);
        return SubnetMask_2.IPv6SubnetMask.fromHexadecimalString(this.toHexadecatetNotation("" + onBits + offBits));
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
//# sourceMappingURL=Prefix.js.map