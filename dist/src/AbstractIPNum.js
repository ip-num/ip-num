"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractIPNum = void 0;
var bigInt = require("big-integer");
var BinaryUtils_1 = require("./BinaryUtils");
/**
 * Provides the implementation of functionality that are common to {@link IPNumber}'s
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
        return BinaryUtils_1.leftPadWithZeroBit(this.value.toString(2), this.bitSize);
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
//# sourceMappingURL=AbstractIPNum.js.map