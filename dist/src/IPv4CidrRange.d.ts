import { IPv4 } from "./IPv4";
import { IPv4Prefix } from "./Prefix";
import * as bigInt from "big-integer";
import { IPRange } from "./interface/IPRange";
import { AbstractIpRange } from "./AbstractIpRange";
/**
 * Represents a continuous segment of IPv4 numbers following the
 * classless inter-domain routing scheme for allocating IP addresses.
 *
 * @see https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing
 */
export declare class IPv4CidrRange extends AbstractIpRange implements IPRange, IterableIterator<IPv4> {
    private readonly ipv4;
    readonly cidrPrefix: IPv4Prefix;
    readonly bitValue: bigInt.BigInteger;
    private internalCounterValue;
    /**
     * Convenience method for constructing an instance of an IPv4CidrRange from an IP range represented in CIDR notation
     *
     * @param {string} rangeIncidrNotation the range of the IPv4 number in CIDR notation
     * @returns {IPv4CidrRange} the IPv4CidrRange
     */
    static fromCidr(rangeIncidrNotation: string): IPv4CidrRange;
    /**
     * Constructor for creating an instance of an IPv4 range.
     *
     * The arguments taken by the constructor is inspired by the CIDR notation which basically consists of the IP
     * number and the prefix.
     *
     * @param {IPv4} ipv4 the IP number used to construct the range. By convention this is the first IP number in
     * the range, but it could also be any IP number within the range
     * @param {IPv4Prefix} cidrPrefix the prefix which is a representation of the number of bits used to mask the
     * given IP number in other to create the range
     */
    constructor(ipv4: IPv4, cidrPrefix: IPv4Prefix);
    /**
     * Gets the size of IPv4 numbers contained within the IPv4 range
     *
     * @returns {bigInt.BigInteger} the amount of IPv4 numbers in the range
     */
    getSize(): bigInt.BigInteger;
    /**
     * Method that returns the IPv4 range in CIDR (Classless Inter-Domain Routing) notation.
     *
     * See {@link https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing#CIDR_notation} for more information
     * on the Classless Inter-Domain Routing notation
     *
     * @returns {string} the IPv4 range in CIDR (Classless Inter-Domain Routing) notation
     */
    toCidrString(): string;
    /**
     * Method that returns the IPv4 range in string notation where the first IPv4 number and last IPv4 number are
     * separated by an hyphen. eg. 192.198.0.0-192.198.0.255
     *
     * @returns {string} the range in [first IPv4 number] - [last IPv4 number] format
     */
    toRangeString(): string;
    /**
     * Method that returns the first IPv4 number in the IPv4 range
     *
     * @returns {IPv4} the first IPv4 number in the IPv4 range
     */
    getFirst(): IPv4;
    /**
     * Method that returns the last IPv4 number in the IPv4 range
     *
     * @returns {IPv4} the last IPv4 number in the IPv4 range
     */
    getLast(): IPv4;
    /**
     * Indicates whether the given IPv4 range is an adjacent range.
     *
     * An adjacent range being one where the end of the given range, when incremented by one marks the start of the
     * other range. Or where the start of the given range, when decreased by one, marks the end of the other range
     *
     * @param {IPv4CidrRange} otherRange the other IPv4 range to compare with
     * @returns {boolean} true if the two IPv4 ranges are consecutive, false otherwise
     */
    isConsecutive(otherRange: IPv4CidrRange): boolean;
    /**
     * Indicates if the given IPv4 range is a subset.
     *
     * By a subset range, it means all the values of the given range are contained by this IPv4 range
     *
     * @param {IPv4CidrRange} otherRange the other IPv4 range
     * @returns {boolean} true if the other Ipv4 range is a subset. False otherwise.
     */
    contains(otherRange: IPv4CidrRange): boolean;
    /**
     * Indicate if the given range is a container range.
     *
     * By container range, it means all the IP number in this current range can be found within the given range.
     *
     * @param {IPv4CidrRange} otherRange he other IPv4 range
     * @returns {boolean} true if the other Ipv4 range is a container range. False otherwise.
     */
    inside(otherRange: IPv4CidrRange): boolean;
    /**
     * Checks if two IPv4 ranges overlap
     * @param {IPv4CidrRange} otherRange the other IPv4 range
     * @returns {boolean} true if the ranges overlap, false otherwise
     */
    isOverlapping(otherRange: IPv4CidrRange): boolean;
    /**
     * Method that takes IPv4 number from within an IPv4 range, starting from the first IPv4 number
     *
     * @param {number} count the amount of IPv4 number to take from the IPv4 range
     * @returns {Array<IPv4>} an array of IPv4 number, taken from the IPv4 range
     */
    take(count: bigInt.BigInteger): Array<IPv4>;
    /**
     * Method that splits an IPv4 range into two halves
     *
     * @returns {Array<IPv4CidrRange>} An array of two {@link IPv4CidrRange}
     */
    split(): Array<IPv4CidrRange>;
    hasNextRange(): boolean;
    hasPreviousRange(): boolean;
    nextRange(): IPv4CidrRange | undefined;
    previousRange(): IPv4CidrRange | undefined;
    next(value?: any): IteratorResult<IPv4>;
    [Symbol.iterator](): IterableIterator<IPv4>;
}
