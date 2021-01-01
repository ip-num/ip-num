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
exports.Hexadecatet = void 0;
var Validator_1 = require("./Validator");
var bigInt = require("big-integer");
/**
 * A base 16 (hexadecimal) representation of a 16 bit value.
 *
 * It consists of four (base 16) number. ie FFFF
 *
 * It is used to represents the components of an IPv6 address
 */
var Hexadecatet = /** @class */ (function () {
    /**
     * Constructor for creating an instance of {@link Hexadecatet}
     *
     * @param {string | number} givenValue a string or numeric value. If given value is a string then it should be a
     * four (base 16) number representation of a 16bit value. If it is a number, then it should be a decimal number
     * representation of a 16 bit value
     */
    function Hexadecatet(givenValue) {
        var hexadecatetValue;
        if (typeof givenValue === 'string') {
            hexadecatetValue = parseInt(givenValue, 16);
        }
        else {
            hexadecatetValue = parseInt(String(givenValue), 16);
        }
        var _a = __read(Validator_1.Validator.isValidIPv6Hexadecatet(bigInt(hexadecatetValue)), 2), isValid = _a[0], message = _a[1];
        if (!isValid) {
            throw Error(message.filter(function (msg) { return msg !== ''; }).toString());
        }
        this.value = hexadecatetValue;
    }
    /**
     * A convenience method for constructing an instance of {@link Hexadecatet} from a four (base 16) number
     * representation of a 16bit value.
     *
     * @param {string} rawValue the four (base 16) number
     * @returns {Hexadecatet} an instance of {@link Hexadecatet}
     */
    Hexadecatet.fromString = function (rawValue) {
        return new Hexadecatet(rawValue);
    };
    ;
    /**
     * A convenience method for constructing an instance of {@link Hexadecatet} from a decimal number representation
     * of a 16 bit value
     *
     * @param {number} rawValue decimal number representation of a 16 bit value
     * @returns {Hexadecatet} an instance of {@link Hexadecatet}
     */
    Hexadecatet.fromNumber = function (rawValue) {
        return new Hexadecatet(rawValue);
    };
    ;
    /**
     * Returns the numeric value in base 10 (ie decimal)
     *
     * @returns {number} the numeric value in base 10 (ie decimal)
     */
    Hexadecatet.prototype.getValue = function () {
        return this.value;
    };
    /**
     * Returns the string representation of the base 16 representation of the value
     * @returns {string} the string representation of the base 16 representation of the value
     */
    // TODO pad with a zero if digit is less than 4
    Hexadecatet.prototype.toString = function () {
        return this.value.toString(16);
    };
    return Hexadecatet;
}());
exports.Hexadecatet = Hexadecatet;
//# sourceMappingURL=Hexadecatet.js.map