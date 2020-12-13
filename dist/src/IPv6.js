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
exports.IPv6 = void 0;
var Hexadecatet_1 = require("./Hexadecatet");
var Validator_1 = require("./Validator");
var BinaryUtils_1 = require("./BinaryUtils");
var HexadecimalUtils_1 = require("./HexadecimalUtils");
var IPv6Utils_1 = require("./IPv6Utils");
var bigInt = require("big-integer/BigInteger");
var AbstractIPNum_1 = require("./AbstractIPNum");
var IPNumType_1 = require("./IPNumType");
var BinaryUtils_2 = require("./BinaryUtils");
var IPv4_1 = require("./IPv4");
var BinaryUtils_3 = require("./BinaryUtils");
var HexadecimalUtils_2 = require("./HexadecimalUtils");
/**
 * Represents an IPv6 number. A 128 bit number that is used to uniquely identify a device that is part of a computer
 * network that uses the internet protocol for communication.
 *
 * @see https://en.wikipedia.org/wiki/IPv6
 * @see https://www.rfc-editor.org/info/rfc8200
 */
var IPv6 = /** @class */ (function (_super) {
    __extends(IPv6, _super);
    /**
     * Constructor for an IPv6 number.
     *
     * @param {string | bigInt.BigInteger} ipValue value to construct an IPv6 from. The given value can either be
     * numeric or string. If a string is given then it needs to be in hexadecatet string notation
     */
    function IPv6(ipValue) {
        var _this = _super.call(this) || this;
        /**
         * The number of bits needed to represents the value of the IPv6 number
         */
        _this.bitSize = 128;
        /**
         * The maximum bit size (i.e. binary value) of the IPv6 number in BigInteger
         */
        _this.maximumBitSize = Validator_1.Validator.ONE_HUNDRED_AND_TWENTY_EIGHT_BIT_SIZE;
        /**
         * The type of IP number. Value is one of the values of the {@link IPNumType} enum
         * @type {IPNumType} the type of IP number
         */
        _this.type = IPNumType_1.IPNumType.IPv6;
        /**
         * An array of {@link Hexadecatet}'s
         *
         * @type {Array} the hexadecatet that makes up the IPv6 number
         */
        _this.hexadecatet = [];
        /**
         * The string character used to separate the individual hexadecatet when the IPv6 is rendered as strings
         *
         * @type {string} The string character used to separate the individual hexadecatet when rendered as strings
         */
        _this.separator = ":";
        if (typeof ipValue === "string") {
            var expandedIPv6 = IPv6Utils_1.expandIPv6Number(ipValue);
            var _a = __read(_this.constructFromHexadecimalDottedString(expandedIPv6), 2), value = _a[0], hexadecatet = _a[1];
            _this.value = value;
            _this.hexadecatet = hexadecatet;
        }
        else {
            var _b = __read(_this.constructFromBigIntegerValue(ipValue), 2), value = _b[0], hexadecatet = _b[1];
            _this.value = value;
            _this.hexadecatet = hexadecatet;
        }
        return _this;
    }
    /**
     * A convenience method for creating an {@link IPv6} by providing the decimal value of the IP number in BigInteger
     *
     * @param {bigInt.BigInteger} bigIntValue the decimal value of the IP number in BigInteger
     * @returns {IPv6} the IPv6 instance
     */
    IPv6.fromBigInteger = function (bigIntValue) {
        return new IPv6(bigIntValue);
    };
    /**
     * A convenience method for creating an {@link IPv6} by providing the IP number in hexadecatet notation. E.g
     * "2001:800:0:0:0:0:0:2002"
     *
     * {@see https://en.wikipedia.org/wiki/IPv6_address#Representation} for more information on hexadecatet notation.
     *
     * @param {string} ipString the IP number in hexadecatet
     * @returns {IPv6} the IPv6 instance
     */
    IPv6.fromHexadecimalString = function (ipString) {
        return new IPv6(ipString);
    };
    /**
     * A convenience method for creating an {@link IPv6} from binary string
     *
     * @param {string} ipBinaryString the binary string representing the IPv6 number to be created
     * @returns {IPv6} the IPv6 instance
     */
    IPv6.fromBinaryString = function (ipBinaryString) {
        var validationResult = Validator_1.Validator.isValidBinaryString(ipBinaryString);
        if (validationResult[0]) {
            var paddedBinaryString = BinaryUtils_3.leftPadWithZeroBit(ipBinaryString, 128);
            return new IPv6(BinaryUtils_2.parseBinaryStringToBigInteger(paddedBinaryString));
        }
        else {
            throw Error(validationResult[1].join(','));
        }
    };
    /**
     * A convenience method for creating an IPv4-Compatible {@link IPv6} Address from an instance of {@link IPv4}
     *
     * @param {IPv4} ipv4 to create an IPv4-Compatible {@link IPv6} Address
     * @returns {IPv6} the IPv4-Compatible {@link IPv6} Address
     */
    IPv6.fromIPv4 = function (ipv4) {
        return ipv4.toIPv4MappedIPv6();
    };
    /**
     * A convenience method for creating an IPv4-Compatible {@link IPv6} Address from a IPv4 represented in
     * dot-decimal notation i.e. 127.0.0.1
     *
     * @param {IPv4} ip4DotDecimalString string represented in a dot decimal string
     * @returns {IPv6} the IPv4-Compatible {@link IPv6} Address
     */
    IPv6.fromIPv4DotDecimalString = function (ip4DotDecimalString) {
        return new IPv4_1.IPv4(ip4DotDecimalString).toIPv4MappedIPv6();
    };
    /**
     * A string representation of the IPv6 number.
     *
     * @returns {string} The string representation of IPv6
     */
    IPv6.prototype.toString = function () {
        var ipv6String = this.hexadecatet.map(function (value) { return value.toString(); }).join(":");
        if (this.hexadecatet.length < 8) {
            return "::" + ipv6String;
        }
        else {
            return ipv6String;
        }
    };
    /**
     * Gets the individual {@link Hexadecatet} that makes up the IPv6 number
     *
     * @returns {Array<Hexadecatet>} The individual {@link Hexadecatet} that makes up the IPv6 number
     */
    //TODO maybe rename to something like getSegments? so it can be same with getOctet
    IPv6.prototype.getHexadecatet = function () {
        return this.hexadecatet;
    };
    /**
     * Returns the next IPv6 number
     *
     * @returns {IPv6} the next IPv6 number
     */
    IPv6.prototype.nextIPNumber = function () {
        return IPv6.fromBigInteger(this.getValue().add(1));
    };
    /**
     * Returns the previous IPv6 number
     *
     * @returns {IPv6} the previous IPv6 number
     */
    IPv6.prototype.previousIPNumber = function () {
        return IPv6.fromBigInteger(this.getValue().minus(1));
    };
    IPv6.prototype.constructFromBigIntegerValue = function (ipv6Number) {
        var _a = __read(Validator_1.Validator.isValidIPv6Number(ipv6Number), 2), isValid = _a[0], message = _a[1];
        if (!isValid) {
            throw new Error(message.filter(function (msg) { return msg !== ''; }).toString());
        }
        var binaryString = BinaryUtils_1.bigIntegerNumberToBinaryString(ipv6Number);
        return [ipv6Number, this.binaryStringToHexadecatets(binaryString)];
    };
    IPv6.prototype.constructFromHexadecimalDottedString = function (expandedIPv6) {
        var _a = __read(Validator_1.Validator.isValidIPv6String(expandedIPv6), 2), isValid = _a[0], message = _a[1];
        if (!isValid) {
            throw new Error(message.filter(function (msg) { return msg !== ''; }).toString());
        }
        var stringHexadecimals = expandedIPv6.split(":");
        var hexadecatet = stringHexadecimals.map(function (stringHexadecatet) {
            return Hexadecatet_1.Hexadecatet.fromString(stringHexadecatet);
        });
        var value = bigInt(HexadecimalUtils_2.hexadectetNotationToBinaryString(expandedIPv6), 2);
        return [value, hexadecatet];
    };
    IPv6.prototype.binaryStringToHexadecatets = function (binaryString) {
        var hexadecimalString = HexadecimalUtils_1.binaryStringToHexadecimalString(binaryString);
        while (hexadecimalString.length % 4 != 0) {
            hexadecimalString = '0' + hexadecimalString;
        }
        var hexadecimalStrings = hexadecimalString.match(/.{1,4}/g);
        return hexadecimalStrings.map(function (stringHexadecatet) {
            return Hexadecatet_1.Hexadecatet.fromString(stringHexadecatet);
        });
    };
    return IPv6;
}(AbstractIPNum_1.AbstractIPNum));
exports.IPv6 = IPv6;
//# sourceMappingURL=IPv6.js.map