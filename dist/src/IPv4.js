"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.IPv4 = void 0;
var Octet_1 = require("./Octet");
var Validator_1 = require("./Validator");
var bigInt = require("big-integer");
var BinaryUtils_1 = require("./BinaryUtils");
var BinaryUtils_2 = require("./BinaryUtils");
var BinaryUtils_3 = require("./BinaryUtils");
var BinaryUtils_4 = require("./BinaryUtils");
var AbstractIPNum_1 = require("./AbstractIPNum");
var IPNumType_1 = require("./IPNumType");
var IPv6_1 = require("./IPv6");
/**
 * Represents an IPv4 number. A 32 bit number that is used to uniquely identify a device that is part of a computer
 * network that uses the internet protocol for communication.
 *
 * @see https://en.wikipedia.org/wiki/IPv4
 * @see https://www.rfc-editor.org/info/rfc791
 */
var IPv4 = /** @class */ (function (_super) {
    __extends(IPv4, _super);
    /**
     * Constructor for an IPv4 number.
     *
     * @param {string | bigInt.BigInteger} ipValue value to construct an IPv4 from. The given value can either be
     * numeric or string. If a string is given then it needs to be in dot-decimal notation
     */
    function IPv4(ipValue) {
        var _this = _super.call(this) || this;
        /**
         * The number of bits needed to represents the value of the IPv4 number
         */
        _this.bitSize = 32;
        /**
         * The maximum bit size (i.e. binary value) of the IPv4 number in BigInteger
         */
        _this.maximumBitSize = Validator_1.Validator.THIRTY_TWO_BIT_SIZE;
        /**
         * The type of IP number. Value is one of the values of the {@link IPNumType} enum
         * @type {IPNumType} the type of IP number
         */
        _this.type = IPNumType_1.IPNumType.IPv4;
        /**
         * An array of {@link Octet}'s
         *
         * @type {Array} the octets that makes up the IPv4 number
         */
        _this.octets = [];
        /**
         * The string character used to separate the individual octets when the IPv4 is rendered as strings
         *
         * @type {string} The string character used to separate the individual octets when rendered as strings
         */
        _this.separator = ".";
        if (typeof ipValue === "string") {
            var _a = __read(_this.constructFromDecimalDottedString(ipValue), 2), value = _a[0], octets = _a[1];
            _this.value = value;
            _this.octets = octets;
        }
        else {
            var _b = __read(_this.constructFromBigIntegerValue(ipValue), 2), value = _b[0], octets = _b[1];
            _this.value = value;
            _this.octets = octets;
        }
        return _this;
    }
    /**
     * A convenience method for creating an {@link IPv4} by providing the decimal value of the IP number in BigInteger
     *
     * @param {bigInt.BigInteger} bigIntValue the decimal value of the IP number in BigInteger
     * @returns {IPv4} the IPv4 instance
     */
    IPv4.fromBigInteger = function (bigIntValue) {
        return new IPv4(bigIntValue);
    };
    /**
     * A convenience method for creating an {@link IPv4} by providing the IP number in dot-decimal notation. E.g
     * "10.1.1.10"
     *
     * {@see https://en.wikipedia.org/wiki/Dot-decimal_notation} for more information on dot-decimal notation.
     *
     * @param {string} ipString the IP number in dot-decimal notation
     * @returns {IPv4} the IPv4 instance
     */
    IPv4.fromDecimalDottedString = function (ipString) {
        return new IPv4(ipString);
    };
    /**
     * A convenience method for creating an {@link IPv4} from binary string
     *
     * @param {string} ipBinaryString the binary string representing the IPv4 number to be created
     * @returns {IPv4} the IPv4 instance
     */
    IPv4.fromBinaryString = function (ipBinaryString) {
        var validationResult = Validator_1.Validator.isValidBinaryString(ipBinaryString);
        if (validationResult[0]) {
            return new IPv4(BinaryUtils_3.parseBinaryStringToBigInteger(ipBinaryString));
        }
        else {
            throw Error(validationResult[1].join(','));
        }
    };
    /**
     * A string representation of the IPv4 number. The string representation is in dot-decimal notation
     *
     * @returns {string} The string representation in dot-decimal notation
     */
    IPv4.prototype.toString = function () {
        return this.octets.map(function (value) { return value.toString(); }).join(this.separator);
    };
    /**
     * Gets the individual {@link Octet} that makes up the IPv4 number
     *
     * @returns {Array<Octet>} The individual {@link Octet} that makes up the IPv4 number
     */
    IPv4.prototype.getOctets = function () {
        return this.octets;
    };
    /**
     * Returns the next IPv4 number
     *
     * @returns {IPv4} the next IPv4 number
     */
    IPv4.prototype.nextIPNumber = function () {
        return IPv4.fromBigInteger(this.getValue().add(1));
    };
    /**
     * Returns the previous IPv4 number
     *
     * @returns {IPv4} the previous IPv4 number
     */
    IPv4.prototype.previousIPNumber = function () {
        return IPv4.fromBigInteger(this.getValue().minus(1));
    };
    /**
     * Returns this IPv4 number as a IPv4-Mapped IPv6 Address
     *
     * The IPv4-Mapped IPv6 Address allows an IPv4 number to be embedded within an IPv6 number
     *
     * {@see https://tools.ietf.org/html/rfc4291#section-2.5.5} for more information on the IPv4-Mapped IPv6 Address
     *
     * @returns {IPv6} an IPv6 number with the IPv4 embedded within it
     */
    IPv4.prototype.toIPv4MappedIPv6 = function () {
        var binary = '1'.repeat(16) + this.toBinaryString();
        return IPv6_1.IPv6.fromBinaryString(binary);
    };
    IPv4.prototype.constructFromDecimalDottedString = function (ipString) {
        var octets;
        var value;
        var _a = __read(Validator_1.Validator.isValidIPv4String(ipString), 2), isValid = _a[0], message = _a[1];
        if (!isValid) {
            throw new Error(message.filter(function (msg) { return msg !== ''; }).toString());
        }
        var stringOctets = ipString.split(".");
        octets = stringOctets.map(function (rawOctet) {
            return Octet_1.Octet.fromString(rawOctet);
        });
        value = bigInt(BinaryUtils_1.dottedDecimalNotationToBinaryString(ipString), 2);
        return [value, octets];
    };
    IPv4.prototype.constructFromBigIntegerValue = function (ipv4Number) {
        var _a = __read(Validator_1.Validator.isValidIPv4Number(ipv4Number), 2), isValid = _a[0], message = _a[1];
        if (!isValid) {
            throw new Error(message.filter(function (msg) { return msg !== ''; }).toString());
        }
        var binaryString = BinaryUtils_2.bigIntegerNumberToBinaryString(ipv4Number);
        return [ipv4Number, this.binaryStringToDecimalOctets(binaryString)];
    };
    IPv4.prototype.binaryStringToDecimalOctets = function (ipv4BinaryString) {
        if (ipv4BinaryString.length < 32) {
            ipv4BinaryString = BinaryUtils_4.leftPadWithZeroBit(ipv4BinaryString, 32);
        }
        var octets = ipv4BinaryString.match(/.{1,8}/g);
        return octets.map(function (octet) {
            return Octet_1.Octet.fromString(BinaryUtils_3.parseBinaryStringToBigInteger(octet).toString());
        });
    };
    return IPv4;
}(AbstractIPNum_1.AbstractIPNum));
exports.IPv4 = IPv4;
//# sourceMappingURL=IPv4.js.map