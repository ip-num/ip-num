import { IPv6Prefix } from "./Prefix";
import { IPv6 } from "./IPv6";
import * as bigInt from "big-integer";
import { IPRange } from "./interface/IPRange";
import { AbstractIpRange } from "./AbstractIpRange";
/**
 * Represents a continuous segment of IPv6 number following the
 * classless inter-domain routing scheme for allocating IP addresses.
 *
 * @see https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing
 */
export declare class IPv6CidrRange extends AbstractIpRange implements IPRange, IterableIterator<IPv6> {
    private readonly ipv6;
    readonly cidrPrefix: IPv6Prefix;
    readonly bitValue: bigInt.BigInteger;
    private internalCounterValue;
    /**
     * Convenience method for constructing an instance of an IPV6Range from an IP range represented in CIDR notation
     *
     * @param {string} rangeIncidrNotation the range of the IPv6 number in CIDR notation
     * @returns {IPV6Range} the IPV6Range
     */
    static fromCidr(rangeIncidrNotation: string): IPv6CidrRange;
    /**
     * Constructor for creating an instance of an IPv6 range.
     *
     * The arguments taken by the constructor is inspired by the CIDR notation which basically consists of the IP
     * number and the prefix.
     *
     * @param {IPv6} ipv6 the IP number used to construct the range. By convention this is the first IP number in
     * the range, but it could also be any IP number within the range
     * @param {IPv6Prefix} cidrPrefix the prefix which is a representation of the number of bits used to mask the
     * given IPv6 number in other to create the range
     */
    constructor(ipv6: IPv6, cidrPrefix: IPv6Prefix);
    /**
     * Gets the size of IPv6 numbers contained within the IPv6 range
     *
     * @returns {bigInt.BigInteger} the amount of IPv6 numbers in the range
     */
    getSize(): bigInt.BigInteger;
    /**
     * Method that returns the IPv6 range in CIDR (Classless Inter-Domain Routing) notation.
     *
     * See {@link https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing#CIDR_notation} for more information
     * on the Classless Inter-Domain Routing notation
     *
     * @returns {string} the IPv6 range in CIDR (Classless Inter-Domain Routing) notation
     */
    toCidrString(): string;
    /**
     * Method that returns the IPv6 range in string notation where the first IPv6 number and last IPv6 number are
     * separated by an hyphen. eg. "2001:db8:0:0:0:0:0:0-2001:db8:0:ffff:ffff:ffff:ffff:ffff"
     *
     * @returns {string} the range in [first IPv6 number] - [last IPv6 number] format
     */
    toRangeString(): string;
    /**
     * Method that returns the first IPv6 number in the IPv6 range
     *
     * @returns {IPv6} the first IPv6 number in the IPv6 range
     */
    getFirst(): IPv6;
    /**
     * Method that returns the last IPv6 number in the IPv6 range
     *
     * @returns {IPv6} the last IPv6 number in the IPv6 range
     */
    getLast(): IPv6;
    /**
     * Indicates whether the given IPv6 range is an adjacent range.
     *
     * An adjacent range being one where the end of the given range, when incremented by one marks the start of the
     * other range. Or where the start of the given range, when decreased by one, marks the end of the other range
     *
     * @param {IPv6CidrRange} otherRange the other IPv6 range to compare with
     * @returns {boolean} true if the two IPv6 ranges are consecutive, false otherwise
     */
    isConsecutive(otherRange: IPv6CidrRange): boolean;
    /**
     * Indicates if the given IPv6 range is a subset.
     *
     * By a subset range, it means all the values of the given range are contained by this IPv6 range
     *
     * @param {IPv6CidrRange} otherRange the other IPv6 range
     * @returns {boolean} true if the other Ipv6 range is a subset. False otherwise.
     */
    contains(otherRange: IPv6CidrRange): boolean;
    /**
     * Indicate if the given range is a container range.
     *
     * By container range, it means all the IP number in this current range can be found within the given range.
     *
     * @param {IPv6CidrRange} otherRange he other IPv6 range
     * @returns {boolean} true if the other Ipv6 range is a container range. False otherwise.
     */
    inside(otherRange: IPv6CidrRange): boolean;
    /**
     * Checks if two IPv6 ranges overlap
     * @param {IPv6CidrRange} otherRange the other IPv6 range
     * @returns {boolean} true if the ranges overlap, false otherwise
     */
    isOverlapping(otherRange: IPv6CidrRange): boolean;
    /**
     * Method that takes IPv6 number from within an IPv6 range, starting from the first IPv6 number
     *
     * @param {number} count the amount of IPv6 number to take from the IPv6 range
     * @returns {Array<IPv6>} an array of IPv6 number, taken from the IPv6 range
     */
    take(count: bigInt.BigInteger): Array<IPv6>;
    /**
     * Method that splits an IPv6 range into two halves
     *
     * @returns {Array<IPv6CidrRange>} An array of two {@link IPv6CidrRange}
     */
    split(): Array<IPv6CidrRange>;
    hasNextRange(): boolean;
    hasPreviousRange(): boolean;
    nextRange(): IPv6CidrRange | undefined;
    previousRange(): IPv6CidrRange | undefined;
    next(value?: any): IteratorResult<IPv6>;
    [Symbol.iterator](): IterableIterator<IPv6>;
}
