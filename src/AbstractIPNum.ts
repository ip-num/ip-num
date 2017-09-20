import * as bigInt from "big-integer"
import {leftPadWithZeroBit} from "./BinaryUtils";

/**
 * Provides the implementation of functionality that are common to {@link IPNumber}'s
 */
export abstract class AbstractIPNum {
    /**
     * The decimal value represented by the IP number in BigInteger
     */
    abstract readonly value: bigInt.BigInteger;
    /**
     * The number of bits needed to represents the value of the IP number
     */
    abstract readonly bitSize: number;
    /**
     * The maximum bit size (i.e. binary value) of the IP number in BigInteger
     */
    abstract readonly maximumBitSize: bigInt.BigInteger;

    /**
     * Gets the numeric value of an IP number as {@link BigInteger}
     *
     * @returns {bigInt.BigInteger} the numeric value of an IP number.
     */
    public getValue():bigInt.BigInteger {
        return this.value;
    }

    /**
     * Gets the binary string representation of an IP number.
     *
     * @returns {string} the string binary representation.
     */
    public toBinaryString(): string {
        return leftPadWithZeroBit(this.value.toString(2), this.bitSize);
    }

    /**
     * Checks if an IP number has a value greater than the present value
     * @returns {boolean} true, if there is a value greater than the present value. Returns false otherwise.
     */
    hasNext():boolean {
        return this.value.lesser(this.maximumBitSize);
    }

    /**
     * Checks if an IP number has a value lesser than the present value
     * @returns {boolean} true, if there is a value lesser than the present value. Returns false otherwise.
     */
    hasPrevious():boolean {
        return this.value.greater(bigInt.zero);
    }

    /**
     * Checks if the given IP number, is equals to the current IP number
     *
     * @param {AbstractIPNum} anotherIPNum the other IP number to compare with
     * @returns {boolean} true if the given IP number is equals
     */
    public isEquals(anotherIPNum: AbstractIPNum): boolean {
        return this.value.equals(anotherIPNum.value);
    }

    /**
     * Checks if the given IP number is lesser than this current IP number
     *
     * @param {AbstractIPNum} anotherIPNum the other IP number to compare with
     * @returns {boolean} true if the given IP number is less than this current one. False otherwise.
     */
    public isLessThan(anotherIPNum: AbstractIPNum): boolean {
        return this.value.lt(anotherIPNum.value);
    }

    /**
     * Checks if the given IP number is greater than this current IP number
     *
     * @param {AbstractIPNum} anotherIPNum the other IP number to compare with
     * @returns {boolean} true if the given IP number is greater than this current one. False otherwise.
     */
    public isGreaterThan(anotherIPNum: AbstractIPNum): boolean {
        return this.value.gt(anotherIPNum.value);
    }

    /**
     * Checks if the given IP number is less than or equals to this current IP number
     *
     * @param {AbstractIPNum} anotherIPNum the other IP number to compare with
     * @returns {boolean} true if the given IP number is less than or equals to this current one. False otherwise.
     */
    public isLessThanOrEquals(anotherIPNum: AbstractIPNum): boolean {
        return this.value.lesserOrEquals(anotherIPNum.value);
    }

    /**
     * Checks if the given IP number is greater than or equals to this current IP number
     *
     * @param {AbstractIPNum} anotherIPNum the other IP number to compare with
     * @returns {boolean} {boolean} true if the given IP number is greater than or equals to this current one. False
     * otherwise.
     */
    public isGreaterThanOrEquals(anotherIPNum: AbstractIPNum): boolean {
        return this.value.greaterOrEquals(anotherIPNum.value);
    }
}