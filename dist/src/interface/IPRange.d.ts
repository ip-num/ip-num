import { IPNumber } from "./IPNumber";
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
    take(count: bigInt.BigInteger): Array<IPNumber>;
    /**
     * Indicates whether the given IP range is an adjacent range.
     *
     * An adjacent range being one where the end of the given range, when incremented by one marks the start of the
     * other range. Or where the start of the given range, when decreased by one, marks the end of the other range
     *
     * @param {IPRange} otherRange the other IP range to compare with
     * @returns {boolean} true if the two IP ranges are consecutive, false otherwise
     */
    isConsecutive(otherRange: IPRange): boolean;
    /**
     * Indicates if the given IP range is a subset.
     *
     * By a subset range, it means all the values of the given range are contained by this IP range
     *
     * @param {IPRange} otherRange the other IP range
     * @returns {boolean} true if the other Ip range is a subset. False otherwise.
     */
    contains(otherRange: IPRange): boolean;
    /**
     * Indicate if the given range is a container range.
     *
     * By container range, it means all the IP number in this current range can be found within the given range.
     *
     * @param {IPRange} otherRange he other IP range
     * @returns {boolean} true if the other Ip range is a container range. False otherwise.
     */
    inside(otherRange: IPRange): boolean;
    /**
     * Checks if two IP ranges overlap
     * @param {IPRange} otherRange the other IP range
     * @returns {boolean} true if the ranges overlap, false otherwise
     */
    isOverlapping(otherRange: IPRange): boolean;
    /**
     * Method that splits an IP range into two halves
     *
     * @returns {Array<IPRange>} An array of two {@link IPRange}
     */
    split(): Array<IPRange>;
    /**
     * Returns whether there exists a next adjacent range
     *
     * @returns {Boolean} true if adjacent range exists, false otherwise
     */
    hasNextRange(): boolean;
    /**
     * Method that returns the next adjacent range
     *
     * @returns {IPRange} if a next adjacent range exists or {undefined} if not
     */
    nextRange(): undefined | IPRange;
    /**
     * Returns whether there exists a previous adjacent range
     *
     * @returns {Boolean} true if previous adjacent range exists, false otherwise
     */
    hasPreviousRange(): boolean;
    /**
     * Method that returns the previous adjacent range
     *
     * @returns {IPRange} if a previous adjacent range exists or {undefined} if not
     */
    previousRange(): undefined | IPRange;
}
