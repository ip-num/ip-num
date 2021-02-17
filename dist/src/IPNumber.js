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
exports.isIPv4 = exports.IPv6Mask = exports.IPv4Mask = exports.IPv6 = exports.Asn = exports.IPv4 = exports.AbstractIPNum = void 0;
var Octet_1 = require("./Octet");
var Validator_1 = require("./Validator");
var bigInt = require("big-integer");
var BinaryUtils_1 = require("./BinaryUtils");
var BinaryUtils_2 = require("./BinaryUtils");
var BinaryUtils_3 = require("./BinaryUtils");
var BinaryUtils_4 = require("./BinaryUtils");
var BinaryUtils_5 = require("./BinaryUtils");
var Hexadecatet_1 = require("./Hexadecatet");
var HexadecimalUtils_1 = require("./HexadecimalUtils");
var IPv6Utils_1 = require("./IPv6Utils");
var HexadecimalUtils_2 = require("./HexadecimalUtils");
/**
 * Provides the implementation of functionality that are common
 * to {@link IPv4}, {@link IPv6}, {@link IPv4Mask} and {@link IPv6Mask}
 */
var AbstractIPNum = /** @class */ (function () {
    function AbstractIPNum() {
    }
    /**
     * Gets the numeric value of an IP number as {@link BigInteger}
     *
     * @returns {bigInt.BigInteger} the numeric value of an IP number.
     */
    AbstractIPNum.prototype.getValue = function () {
        return this.value;
    };
    /**
     * Gets the binary string representation of an IP number.
     *
     * @returns {string} the string binary representation.
     */
    AbstractIPNum.prototype.toBinaryString = function () {
        return BinaryUtils_4.leftPadWithZeroBit(this.value.toString(2), this.bitSize);
    };
    /**
     * Checks if an IP number has a value greater than the present value
     * @returns {boolean} true, if there is a value greater than the present value. Returns false otherwise.
     */
    AbstractIPNum.prototype.hasNext = function () {
        return this.value.lesser(this.maximumBitSize);
    };
    /**
     * Checks if an IP number has a value lesser than the present value
     * @returns {boolean} true, if there is a value lesser than the present value. Returns false otherwise.
     */
    AbstractIPNum.prototype.hasPrevious = function () {
        return this.value.greater(bigInt.zero);
    };
    /**
     * Checks if the given IP number, is equals to the current IP number
     *
     * @param {AbstractIPNum} anotherIPNum the other IP number to compare with
     * @returns {boolean} true if the given IP number is equals
     */
    AbstractIPNum.prototype.isEquals = function (anotherIPNum) {
        return this.value.equals(anotherIPNum.value);
    };
    /**
     * Checks if the given IP number is lesser than this current IP number
     *
     * @param {AbstractIPNum} anotherIPNum the other IP number to compare with
     * @returns {boolean} true if the given IP number is less than this current one. False otherwise.
     */
    AbstractIPNum.prototype.isLessThan = function (anotherIPNum) {
        return this.value.lt(anotherIPNum.value);
    };
    /**
     * Checks if the given IP number is greater than this current IP number
     *
     * @param {AbstractIPNum} anotherIPNum the other IP number to compare with
     * @returns {boolean} true if the given IP number is greater than this current one. False otherwise.
     */
    AbstractIPNum.prototype.isGreaterThan = function (anotherIPNum) {
        return this.value.gt(anotherIPNum.value);
    };
    /**
     * Checks if the given IP number is less than or equals to this current IP number
     *
     * @param {AbstractIPNum} anotherIPNum the other IP number to compare with
     * @returns {boolean} true if the given IP number is less than or equals to this current one. False otherwise.
     */
    AbstractIPNum.prototype.isLessThanOrEquals = function (anotherIPNum) {
        return this.value.lesserOrEquals(anotherIPNum.value);
    };
    /**
     * Checks if the given IP number is greater than or equals to this current IP number
     *
     * @param {AbstractIPNum} anotherIPNum the other IP number to compare with
     * @returns {boolean} {boolean} true if the given IP number is greater than or equals to this current one. False
     * otherwise.
     */
    AbstractIPNum.prototype.isGreaterThanOrEquals = function (anotherIPNum) {
        return this.value.greaterOrEquals(anotherIPNum.value);
    };
    return AbstractIPNum;
}());
exports.AbstractIPNum = AbstractIPNum;
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
        _this.type = "IPv4" /* IPv4 */;
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
     * Alias for IPv4.fromDecimalDottedString.
     *
     * @param {string} ipString the IP number in dot-decimal notation
     * @returns {IPv4} the IPv4 instance
     */
    IPv4.fromString = function (ipString) {
        return IPv4.fromDecimalDottedString(ipString);
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
        return IPv6.fromBinaryString(binary);
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
}(AbstractIPNum));
exports.IPv4 = IPv4;
/**
 * Represents an Autonomous System Number. Which is a number that is used to identify
 * a group of IP addresses with a common, clearly defined routing policy.
 *
 * @see https://en.wikipedia.org/wiki/Autonomous_system_(Internet)
 * @see https://tools.ietf.org/html/rfc5396
 */
var Asn = /** @class */ (function (_super) {
    __extends(Asn, _super);
    /**
     * Constructor for an instance of {@link ASN}
     *
     * @param {string | number} rawValue value to construct an ASN from. The given value can either be numeric or
     * string. If in string then it can be in asplain, asdot or asdot+ string representation format
     */
    function Asn(rawValue) {
        var _this = _super.call(this) || this;
        /**
         * The number of bits needed to represents the value of the ASN number
         */
        _this.bitSize = 32;
        /**
         * The maximum bit size (i.e. binary value) of the ASN number in BigInteger
         */
        _this.maximumBitSize = Validator_1.Validator.THIRTY_TWO_BIT_SIZE;
        _this.type = "ASN" /* ASN */;
        if (typeof rawValue === 'string') {
            if (Asn.startWithASprefix(rawValue)) {
                _this.value = bigInt(parseInt(rawValue.substring(2)));
            }
            else if (rawValue.indexOf(".") != -1) {
                _this.value = bigInt(_this.parseFromDotNotation(rawValue));
            }
            else {
                _this.value = bigInt(parseInt(rawValue));
            }
        }
        else {
            var valueAsBigInt = bigInt(rawValue);
            var _a = __read(Validator_1.Validator.isValidAsnNumber(valueAsBigInt), 2), isValid = _a[0], message = _a[1];
            if (!isValid) {
                throw Error(message.filter(function (msg) { return msg !== ''; }).toString());
            }
            _this.value = valueAsBigInt;
        }
        return _this;
    }
    /**
     * A convenience method for creating an instance of {@link Asn} from a string
     *
     * The given string can be in asplain, asdot or asdot+ representation format.
     * {@see https://tools.ietf.org/html/rfc5396} for more information on
     * the different ASN string representation
     *
     * @param {string} rawValue the asn string. In either asplain, asdot or asdot+ format
     * @returns {Asn} the constructed ASN instance
     */
    Asn.fromString = function (rawValue) {
        return new Asn(rawValue);
    };
    ;
    /**
     * A convenience method for creating an instance of {@link Asn} from a numeric value
     *
     * @param {number} rawValue the asn numeric value
     * @returns {Asn} the constructed ASN instance
     */
    Asn.fromNumber = function (rawValue) {
        return new Asn(rawValue);
    };
    ;
    /**
     * A convenience method for creating an instance of {@link Asn} from a binary string
     *
     * @param {string} binaryString to create an ASN instance from
     * @returns {Asn} the constructed ASN instance
     */
    Asn.fromBinaryString = function (binaryString) {
        var validationResult = Validator_1.Validator.isValidBinaryString(binaryString);
        if (validationResult[0]) {
            return new Asn(parseInt(binaryString, 2));
        }
        else {
            throw Error(validationResult[1].join(','));
        }
    };
    /**
     * A string representation where the asn value is prefixed by "ASN". For example "AS65526"
     *
     * @returns {string} A string representation where the asn value is prefixed by "ASN"
     */
    Asn.prototype.toString = function () {
        var stringValue = this.value.toString();
        return "" + Asn.AS_PREFIX + stringValue;
    };
    /**
     * A string representation where the ASN numeric value of is represented as a string. For example "65526"
     *
     * @returns {string} A string representation where the ASN numeric value of is represented as a string
     */
    Asn.prototype.toASPlain = function () {
        return this.value.toString();
    };
    /**
     * A string representation where the ASN value is represented using the asplain notation if the ASN value is
     * less than 65536 and uses asdot+ notation when the value is greater than 65536.
     *
     * For example 65526 will be represented as "65526" while 65546 will be represented as "1.10"
     *
     *
     * @returns {string} A string representation of the ASN in either asplain or asdot+ notation depending on
     * whether the numeric value of the ASN number is greater than 65526 or not.
     */
    Asn.prototype.toASDot = function () {
        if (this.value.valueOf() >= 65536) {
            return this.toASDotPlus();
        }
        return this.toASPlain();
    };
    /**
     * A string representation where the ASN value is represented using the asdot+ notation
     *
     * @returns {string} A string representation where the ASN value is represented using the asdot+ notation
     *
     */
    Asn.prototype.toASDotPlus = function () {
        var high = Math.floor(this.value.valueOf() / 65535);
        var low = (this.value.valueOf() % 65535) - high;
        return high + "." + low;
    };
    /**
     * Converts the ASN value to binary numbers represented with strings
     *
     * @returns {string} a binary string representation of the value of the ASN number
     */
    Asn.prototype.toBinaryString = function () {
        return BinaryUtils_5.decimalNumberToBinaryString(this.value.valueOf());
    };
    /**
     * Checks if the ASN value is 16bit
     *
     * @returns {boolean} true if the ASN is a 16bit value. False otherwise.
     */
    Asn.prototype.is16Bit = function () {
        var _a = __read(Validator_1.Validator.isValid16BitAsnNumber(this.value), 1), valid16BitAsnNumber = _a[0];
        return valid16BitAsnNumber;
    };
    /**
     * Checks if the ASN value is 32bit
     *
     * @returns {boolean} true if the ASN is a 32bit value. False otherwise.
     */
    Asn.prototype.is32Bit = function () {
        return !this.is16Bit();
    };
    /**
     * Returns the next ASN number
     *
     * @returns {AbstractIPNum} the next ASN number
     */
    Asn.prototype.nextIPNumber = function () {
        return new Asn(this.value.valueOf() + 1);
    };
    /**
     * Returns the previous ASN number
     *
     * @returns {AbstractIPNum} the previous ASN number
     */
    Asn.prototype.previousIPNumber = function () {
        return new Asn(this.value.valueOf() - 1);
    };
    Asn.startWithASprefix = function (word) {
        return word.indexOf(Asn.AS_PREFIX) === 0;
    };
    Asn.prototype.parseFromDotNotation = function (rawValue) {
        var values = rawValue.split(".");
        var high = parseInt(values[0]);
        var low = parseInt(values[1]);
        return (high * 65535) + (low + high);
    };
    Asn.AS_PREFIX = "AS";
    return Asn;
}(AbstractIPNum));
exports.Asn = Asn;
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
        _this.type = "IPv6" /* IPv6 */;
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
     * Alias for IPv6.fromHexadecimalString
     *
     * @param {string} ipString the IP number in hexadecatet
     * @returns {IPv6} the IPv6 instance
     */
    IPv6.fromString = function (ipString) {
        return IPv6.fromHexadecimalString(ipString);
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
            var paddedBinaryString = BinaryUtils_4.leftPadWithZeroBit(ipBinaryString, 128);
            return new IPv6(BinaryUtils_3.parseBinaryStringToBigInteger(paddedBinaryString));
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
        return new IPv4(ip4DotDecimalString).toIPv4MappedIPv6();
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
        var binaryString = BinaryUtils_2.bigIntegerNumberToBinaryString(ipv6Number);
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
}(AbstractIPNum));
exports.IPv6 = IPv6;
/**
 * The IPv4Mask can be seen as a specialized IPv4 number where, in a 32 bit number, starting from the left, you
 * have continuous bits turned on (with 1 value) followed by bits turned off (with 0 value). In networking, it is used
 * to demarcate which bits are used to identify a network, and the ones that are used to identify hosts on the network
 */
var IPv4Mask = /** @class */ (function (_super) {
    __extends(IPv4Mask, _super);
    /**
     * Constructor for creating an instance of IPv4Mask.
     * The passed strings need to be a valid IPv4 mask number in dot-decimal notation.
     *
     * @param {string} ipString The passed string in dot-decimal notation
     */
    function IPv4Mask(ipString) {
        var _a;
        var _this = _super.call(this, ipString) || this;
        /**
         * An array of {@link Octet}'s
         *
         * @type {Array} the octets that makes up the IPv4Mask
         */
        _this.octets = [];
        var isValid;
        var message;
        _a = __read(Validator_1.Validator.isValidIPv4Mask(ipString), 2), isValid = _a[0], message = _a[1];
        if (!isValid) {
            throw new Error(message.filter(function (msg) { return msg !== ''; }).toString());
        }
        var stringOctets = ipString.split(".");
        _this.octets = stringOctets.map(function (rawOctet) {
            return Octet_1.Octet.fromString(rawOctet);
        });
        var binaryString = BinaryUtils_1.dottedDecimalNotationToBinaryString(ipString);
        _this.prefix = (binaryString.match(/1/g) || []).length;
        _this.value = bigInt(binaryString, 2);
        return _this;
    }
    /**
     * A convenience method for creating an instance of IPv4Mask. The passed strings need to be a valid IPv4
     * number in dot-decimal notation.
     *
     * @param {string} rawValue The passed string in dot-decimal notation
     * @returns {IPv4Mask} the instance of IPv4Mask
     */
    IPv4Mask.fromDecimalDottedString = function (rawValue) {
        return new IPv4Mask(rawValue);
    };
    ;
    return IPv4Mask;
}(IPv4));
exports.IPv4Mask = IPv4Mask;
/**
 * The IPv6Mask can be seen as a specialized IPv4 number where, in a 128 bit number, starting from the left,
 * you have continuous bits turned on (with 1 value) followed by bits turned off (with 0 value). In networking, it
 * is used to to demarcate which bits are used to identify a network, and the ones that are used to identify hosts
 * on the network
 */
var IPv6Mask = /** @class */ (function (_super) {
    __extends(IPv6Mask, _super);
    /**
     * Constructor for creating an instance of IPv6Mask.
     * The passed strings need to be a valid IPv6 mask number in dot-decimal notation
     *
     * @param {string} ipString The passed IPv6 string
     */
    function IPv6Mask(ipString) {
        var _a;
        var _this = _super.call(this, ipString) || this;
        /**
         * An array of {@link Hexadecatet}'s
         *
         * @type {Array} the hexadecatet that makes up the IPv6 number
         */
        _this.hexadecatet = [];
        var isValid;
        var message;
        _a = __read(Validator_1.Validator.isValidIPv6Mask(ipString), 2), isValid = _a[0], message = _a[1];
        if (!isValid) {
            throw new Error(message.filter(function (msg) { return msg !== ''; }).toString());
        }
        var stringHexadecimals = ipString.split(":");
        _this.hexadecatet = stringHexadecimals.map(function (stringHexadecatet) {
            return Hexadecatet_1.Hexadecatet.fromString(stringHexadecatet);
        });
        var binaryString = HexadecimalUtils_2.hexadectetNotationToBinaryString(ipString);
        _this.prefix = (binaryString.match(/1/g) || []).length;
        _this.value = bigInt(binaryString, 2);
        _this.value = bigInt(HexadecimalUtils_2.hexadectetNotationToBinaryString(ipString), 2);
        return _this;
    }
    /**
     * A convenience method for creating an instance of IPv6Mask.
     * The passed strings need to be a valid IPv4 mask number in dot-decimal notation.
     *
     * @param {string} rawValue The passed string in textual notation
     * @returns {IPv6Mask} the instance of IPv6Mask
     */
    IPv6Mask.fromHexadecimalString = function (rawValue) {
        return new IPv6Mask(rawValue);
    };
    ;
    return IPv6Mask;
}(IPv6));
exports.IPv6Mask = IPv6Mask;
/**
 * Check is the given IP number is an {@link IPv4} or not
 * @param ip the IP number to check if it is IPv4.
 */
function isIPv4(ip) {
    return ip.bitSize === 32;
}
exports.isIPv4 = isIPv4;
//# sourceMappingURL=IPNumber.js.map