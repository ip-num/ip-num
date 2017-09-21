import {IPNumber} from "./IPNumber";
import bigInt = require("big-integer");

/**
 * Represents the shape of an Internet Protocol number that can be represents as a range. This means {@link IPv4}
 * and {@link IPv6} numbers. It describes properties and operations that can be performed on a range of IPv4 or IPv6
 * numbers
 */
export interface IPRange {
    /**
     * Method to return the size of IP numbers contained within an IP range
     *
     * @returns {bigInt.BigInteger} the number of IP numbers in the IP range
     */
    getSize(): bigInt.BigInteger;

    /**
     * Method that returns the range in CIDR (Classless Inter-Domain Routing) notation.
     *
     * See {@link https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing#CIDR_notation} for more information
     * on the Classless Inter-Domain Routing notation
     *
     * @returns {string} the range in CIDR (Classless Inter-Domain Routing) notation
     */
    toCidrString(): string;

    /**
     * Method that returns the range in string notation where the first IP number and last IP number are separated
     * by an hyphen. eg. 192.198.0.0-192.198.0.255
     *
     * @returns {string} the range in [first IP number] - [last IP number] format
     */
    toRangeString(): string;

    /**
     * Method that returns the first IP number in the IP range
     *
     * @returns {IPNumber} the first IP number in the IP range
     */
    getFirst(): IPNumber;

    /**
     * Method that returns the last IP number in the IP range
     *
     * @returns {IPNumber} the last IP number in the IP range
     */
    getLast(): IPNumber;

    /**
     * Method that takes IP number from within an IP range, starting from the first IP number
     * @param {number} count the amount of IP number to take from the IP range
     * @returns {Array<IPNumber>} an array of IP number, taken from the IP range
     */
    take(count: number): Array<IPNumber>

    /**
     * Method that splits an IP range into two halves
     *
     * @returns {Array<IPRange>} An array of two {@link IPRange}
     */
    split() : Array<IPRange>
}