import { BigInteger } from "big-integer";
import { IPNumType } from "../IPNumType";
/**
 * Represents the shape of an Internet Protocol number. It describes properties and operations that can be performed
 * on all Internet Protocol numbers.
 */
export interface IPNumber {
    /**
     * The decimal value represented by the IP number in BigInteger
     */
    value: BigInteger;
    /**
     * The type of IP number. The value is one of the values of the {@link IPNumType} enum
     */
    type: IPNumType;
    /**
     * Method to return the decimal value represented by the IP number in BigInteger
     * @returns {bigInt.BigInteger} the decimal value represented by the IP number in BigInteger
     */
    getValue(): BigInteger;
    /**
     * Method to return the string representation of the IP number
     * @returns {string}
     */
    toString(): string;
    /**
     * Method to return the next IP number
     * @returns {IPNumber} the next IP number
     */
    nextIPNumber(): IPNumber;
    /**
     * Method to return the previous IP number
     * @returns {IPNumber} the previous IP number
     */
    previousIPNumber(): IPNumber;
    /**
     * Method to check of the IP number is not the maximum IP number value. That it, it has a next value.
     * @returns {boolean} true, if the IP number has next value. False otherwise
     */
    hasNext(): boolean;
    /**
     * Method to check of the IP number is not the minimum IP number value. That it, it has a previous value.
     * @returns {boolean} true, if the IP number has previous value. False otherwise
     */
    hasPrevious(): boolean;
}
