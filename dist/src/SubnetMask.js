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
exports.IPv6SubnetMask = exports.IPv4SubnetMask = void 0;
var Octet_1 = require("./Octet");
var Validator_1 = require("./Validator");
var bigInt = require("big-integer");
var BinaryUtils_1 = require("./BinaryUtils");
var Hexadecatet_1 = require("./Hexadecatet");
var IPv4_1 = require("./IPv4");
var IPv6_1 = require("./IPv6");
var HexadecimalUtils_1 = require("./HexadecimalUtils");
/**
 * The IPv4SubnetMask can be seen as a specialized IPv4 number where, in a 32 bit number, starting from the left, you
 * have continuous bits turned on (with 1 value) followed by bits turned off (with 0 value). In networking, it is used
 * to demarcate which bits are used to identify a network, and the ones that are used to identify hosts on the network
 */
var IPv4SubnetMask = /** @class */ (function (_super) {
    __extends(IPv4SubnetMask, _super);
    /**
     * Constructor for creating an instance of IPv4SubnetMask.
     * The passed strings need to be a valid IPv4 subnet mask number in dot-decimal notation.
     *
     * @param {string} ipString The passed string in dot-decimal notation
     */
    function IPv4SubnetMask(ipString) {
        var _a;
        var _this = _super.call(this, ipString) || this;
        /**
         * An array of {@link Octet}'s
         *
         * @type {Array} the octets that makes up the IPv4SubnetMask
         */
        _this.octets = [];
        var isValid;
        var message;
        _a = __read(Validator_1.Validator.isValidIPv4SubnetMask(ipString), 2), isValid = _a[0], message = _a[1];
        if (!isValid) {
            throw new Error(message.filter(function (msg) { return msg !== ''; }).toString());
        }
        var stringOctets = ipString.split(".");
        _this.octets = stringOctets.map(function (rawOctet) {
            return Octet_1.Octet.fromString(rawOctet);
        });
        _this.value = bigInt(BinaryUtils_1.dottedDecimalNotationToBinaryString(ipString), 2);
        return _this;
    }
    /**
     * A convenience method for creating an instance of IPv4SubnetMask. The passed strings need to be a valid IPv4
     * number in dot-decimal notation.
     *
     * @param {string} rawValue The passed string in dot-decimal notation
     * @returns {IPv4SubnetMask} the instance of IPv4SubnetMask
     */
    IPv4SubnetMask.fromDecimalDottedString = function (rawValue) {
        return new IPv4SubnetMask(rawValue);
    };
    ;
    return IPv4SubnetMask;
}(IPv4_1.IPv4));
exports.IPv4SubnetMask = IPv4SubnetMask;
/**
 * The IPv6SubnetMask can be seen as a specialized IPv4 number where, in a 128 bit number, starting from the left,
 * you have continuous bits turned on (with 1 value) followed by bits turned off (with 0 value). In networking, it
 * is used to to demarcate which bits are used to identify a network, and the ones that are used to identify hosts
 * on the network
 */
var IPv6SubnetMask = /** @class */ (function (_super) {
    __extends(IPv6SubnetMask, _super);
    /**
     * Constructor for creating an instance of IPv6SubnetMask.
     * The passed strings need to be a valid IPv6 subnet mask number in dot-decimal notation
     *
     * @param {string} ipString The passed IPv6 string
     */
    function IPv6SubnetMask(ipString) {
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
        _a = __read(Validator_1.Validator.isValidIPv6SubnetMask(ipString), 2), isValid = _a[0], message = _a[1];
        if (!isValid) {
            throw new Error(message.filter(function (msg) { return msg !== ''; }).toString());
        }
        var stringHexadecimals = ipString.split(":");
        _this.hexadecatet = stringHexadecimals.map(function (stringHexadecatet) {
            return Hexadecatet_1.Hexadecatet.fromString(stringHexadecatet);
        });
        _this.value = bigInt(HexadecimalUtils_1.hexadectetNotationToBinaryString(ipString), 2);
        return _this;
    }
    /**
     * A convenience method for creating an instance of IPv6SubnetMask.
     * The passed strings need to be a valid IPv4 subnet mask number in dot-decimal notation.
     *
     * @param {string} rawValue The passed string in textual notation
     * @returns {IPv6SubnetMask} the instance of IPv6SubnetMask
     */
    IPv6SubnetMask.fromHexadecimalString = function (rawValue) {
        return new IPv6SubnetMask(rawValue);
    };
    ;
    return IPv6SubnetMask;
}(IPv6_1.IPv6));
exports.IPv6SubnetMask = IPv6SubnetMask;
//# sourceMappingURL=SubnetMask.js.map