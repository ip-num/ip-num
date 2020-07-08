import * as bigInt from "big-integer";
/**
 * Provides the implementation of functionality that are common to {@link IPNumber}'s
 */
export declare abstract class AbstractIPNum {
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
    getValue(): bigInt.BigInteger;
    /**
     * Gets the binary string representation of an IP number.
     *
     * @returns {string} the string binary representation.
     */
    toBinaryString(): string;
    /**
     * Checks if an IP number has a value greater than the present value
     * @returns {boolean} true, if there is a value greater than the present value. Returns false otherwise.
     */
    hasNext(): boolean;
    /**
     * Checks if an IP number has a value lesser than the present value
     * @returns {boolean} true, if there is a value lesser than the present value. Returns false otherwise.
     */
    hasPrevious(): boolean;
    /**
     * Checks if the given IP number, is equals to the current IP number
     *
     * @param {AbstractIPNum} anotherIPNum the other IP number to compare with
     * @returns {boolean} true if the given IP number is equals
     */
    isEquals(anotherIPNum: AbstractIPNum): boolean;
    /**
     * Checks if the given IP number is lesser than this current IP number
     *
     * @param {AbstractIPNum} anotherIPNum the other IP number to compare with
     * @returns {boolean} true if the given IP number is less than this current one. False otherwise.
     */
    isLessThan(anotherIPNum: AbstractIPNum): boolean;
    /**
     * Checks if the given IP number is greater than this current IP number
     *
     * @param {AbstractIPNum} anotherIPNum the other IP number to compare with
     * @returns {boolean} true if the given IP number is greater than this current one. False otherwise.
     */
    isGreaterThan(anotherIPNum: AbstractIPNum): boolean;
    /**
     * Checks if the given IP number is less than or equals to this current IP number
     *
     * @param {AbstractIPNum} anotherIPNum the other IP number to compare with
     * @returns {boolean} true if the given IP number is less than or equals to this current one. False otherwise.
     */
    isLessThanOrEquals(anotherIPNum: AbstractIPNum): boolean;
    /**
     * Checks if the given IP number is greater than or equals to this current IP number
     *
     * @param {AbstractIPNum} anotherIPNum the other IP number to compare with
     * @returns {boolean} {boolean} true if the given IP number is greater than or equals to this current one. False
     * otherwise.
     */
    isGreaterThanOrEquals(anotherIPNum: AbstractIPNum): boolean;
}
