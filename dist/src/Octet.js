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
exports.Octet = void 0;
var Validator_1 = require("./Validator");
var bigInt = require("big-integer");
/**
 * A binary representation of a 8 bit value.
 *
 * {@see https://en.wikipedia.org/wiki/Octet_(computing)} for more information on Octets
 *
 * An octet is used in the textual representation of an {@link IPv4} number, where the IP number value is divided
 * into 4 octets
 */
var Octet = /** @class */ (function () {
    /**
     * Constructor for creating an instance of an Octet.
     *
     * The constructor parameter given could either be a string or number.
     *
     * If a string, it is the string representation of the numeric value of the octet
     * If a number, it is the numeric representation of the value of the octet
     *
     * @param {string | number} givenValue value of the octet to be created.
     */
    function Octet(givenValue) {
        var octetValue;
        if (typeof givenValue === 'string') {
            octetValue = parseInt(givenValue);
        }
        else {
            octetValue = givenValue;
        }
        var _a = __read(Validator_1.Validator.isValidIPv4Octet(bigInt(octetValue)), 2), isValid = _a[0], message = _a[1];
        if (!isValid) {
            throw Error(message.filter(function (msg) { return msg !== ''; }).toString());
        }
        this.value = octetValue;
    }
    /**
     * Convenience method for creating an Octet out of a string value representing the value of the octet
     *
     * @param {string} rawValue the octet value in string
     * @returns {Octet} the Octet instance
     */
    Octet.fromString = function (rawValue) {
        return new Octet(rawValue);
    };
    ;
    /**
     * Convenience method for creating an Octet out of a numeric value representing the value of the octet
     *
     * @param {number} rawValue the octet value in number
     * @returns {Octet} the Octet instance
     */
    Octet.fromNumber = function (rawValue) {
        return new Octet(rawValue);
    };
    ;
    /**
     * Method to get the numeric value of the octet
     *
     * @returns {number} the numeric value of the octet
     */
    Octet.prototype.getValue = function () {
        return this.value;
    };
    /**
     * Returns a decimal representation of the value of the octet in string
     *
     * @returns {string} a decimal representation of the value of the octet in string
     */
    Octet.prototype.toString = function () {
        return this.value.toString(10);
    };
    return Octet;
}());
exports.Octet = Octet;
//# sourceMappingURL=Octet.js.map