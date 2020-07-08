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
exports.Asn = void 0;
var Validator_1 = require("./Validator");
var BinaryUtils_1 = require("./BinaryUtils");
var bigInt = require("big-integer");
var IPNumType_1 = require("./IPNumType");
var AbstractIPNum_1 = require("./AbstractIPNum");
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
        _this.type = IPNumType_1.IPNumType.ASN;
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
        return BinaryUtils_1.decimalNumberToBinaryString(this.value.valueOf());
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
     * @returns {IPNumber} the next ASN number
     */
    Asn.prototype.nextIPNumber = function () {
        return new Asn(this.value.valueOf() + 1);
    };
    /**
     * Returns the previous ASN number
     *
     * @returns {IPNumber} the previous ASN number
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
}(AbstractIPNum_1.AbstractIPNum));
exports.Asn = Asn;
//# sourceMappingURL=Asn.js.map