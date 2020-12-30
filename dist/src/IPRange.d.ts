import * as bigInt from "big-integer";
import { IPv6, AbstractIPNum } from "./IPNumber";
import { IPv4 } from "./IPNumber";
import { IPv6Prefix } from "./Prefix";
import { IPv4Prefix } from "./Prefix";
export declare type IP<T> = T extends IPv4CidrRange ? IPv4 : IPv6;
/**
 * Represents a continuous segment of either IPv4 or IPv6 numbers
 * without adhering to classless inter-domain routing scheme
 * for allocating IP addresses.
 */
export declare class RangedSet<T extends AbstractIPNum> implements Iterable<AbstractIPNum> {
    readonly bitValue: bigInt.BigInteger;
    private readonly currentValue;
    private readonly first;
    private readonly last;
    /**
     * Convenience method for constructing an instance of {@link RangedSet} from a
     * single IP number.
     *
     * @param ip The IP number, either IPv4 or IPv6 to construct the range from.
     */
    static fromSingleIP<T extends AbstractIPNum>(ip: T): RangedSet<T>;
    /**
     * Convenience method for constructing an instance of {@link RangedSet} from an
     * instance of either {@link IPv4CidrRange} or {@link IPv6CidrRange}
     *
     * @param cidrRange an instance of {@link RangedSet}
     */
    static fromCidrRange<U extends IPv6CidrRange | IPv4CidrRange>(cidrRange: U): RangedSet<IP<U>>;
    /**
     * Convenience method for constructing an instance of {@link RangedSet} from
     * a range string in the form of firstIp-lastIp
     *
     * @param rangeString  string in the form of firstIp-lastIp
     */
    static fromRangeString(rangeString: string): RangedSet<IPv4> | RangedSet<IPv6>;
    /**
     * Constructor for an instance of {@link RangedSet} from an
     * instance of either {@link IPv4CidrRange} or {@link IPv6CidrRange}
     *
     * Throws an exception if first IP number is not less than given last IP number
     *
     * @param first the first IP number of the range
     * @param last the last IP number of the range
     */
    constructor(first: T, last: T);
    /**
     * Returns the first IP number in the range
     */
    getFirst(): T;
    /**
     * Returns the last IP number in the range
     */
    getLast(): T;
    /**
     * Returns the size, which is the number of IP numbers in the range.
     */
    getSize(): bigInt.BigInteger;
    /**
     * Converts to a string representation of the range in the form of:
     * <first-ip>-<last-ip>
     */
    toRangeString(): string;
    /**
     * Checks if this range is inside another range.
     *
     * @param otherRange the other range to check if this range is inside of.
     */
    inside(otherRange: RangedSet<T>): boolean;
    /**
     * Checks if this range contains the given other range.
     *
     * @param otherRange the other range to check if this range contains
     */
    contains(otherRange: RangedSet<T>): boolean;
    /**
     * Check if this range is equal to the given other range.
     *
     * @param otherRange the other range to check if equal to this range.
     */
    isEquals(otherRange: RangedSet<T>): boolean;
    /**
     * Check if this range is less than the given range.
     *
     * @param otherRange the other range to check if less than.
     */
    isLessThan(otherRange: RangedSet<T>): boolean;
    /**
     * Check if this range is greater than the given range.
     *
     * @param otherRange the other range to check if greater than.
     */
    isGreaterThan(otherRange: RangedSet<T>): boolean;
    /**
     * Checks of this range overlaps with a given other range.
     *
     * This means it checks if part of a range is part of another range without
     * being totally contained in the other range. Hence Equal or ranges contained inside one
     * another are not considered as overlapping.
     *
     * @param otherRange the other range to check if it overlaps with this range.
     */
    isOverlapping(otherRange: RangedSet<T>): boolean;
    /**
     * Check if this range can be converted to a CIDR range.
     */
    isCidrAble(): boolean;
    /**
     * Converts an instance of range to an instance of CIDR range
     */
    toCidrRange(): IPv4CidrRange | IPv6CidrRange;
    /**
     * Checks if this range is consecutive with another range.
     *
     * This means if the two ranges can be placed side by side, without any gap. Hence Equal
     * or ranges contained inside one another, or overlapping ranges are not considered as consecutive.
     *
     * @param otherRange the other range to check if this range is consecutive to.
     */
    isConsecutive(otherRange: RangedSet<T>): boolean;
    /**
     * Creates a range that is a union of this range and the given other range.
     *
     * @param otherRange the other range to combine with this range
     */
    union(otherRange: RangedSet<T>): RangedSet<T>;
    /**
     * Prepends given range with this range.
     * The last IP in the given range should be adjacent to the first IP in this range
     *
     * @param otherRange the other range to prepend
     */
    prepend(otherRange: RangedSet<T>): RangedSet<T>;
    /**
     * Appends given range with this range.
     * The last IP in this range should be adjacent to the first IP in range to append
     *
     * @param otherRange the other range to append
     */
    append(otherRange: RangedSet<T>): RangedSet<T>;
    subtract(otherRange: RangedSet<T>): RangedSet<T>;
    /**
     * Returns a sub range of a given size from this range.
     *
     * @param offset offset from this range where the subrange should begin
     * @param size the size of the range
     */
    takeSubRange(offset: bigInt.BigInteger, size: bigInt.BigInteger): RangedSet<AbstractIPNum>;
    /**
     * Performs a subtraction operation, where the passed range is removed from the original range.
     *
     * The return range from the subtraction operation could be a single or multiple ranges
     *
     * @param range
     */
    difference(range: RangedSet<T>): Array<RangedSet<AbstractIPNum>>;
    take(count?: number): Iterable<AbstractIPNum>;
    [Symbol.iterator](): IterableIterator<AbstractIPNum>;
    private toIPv4CidrRange;
    private toIPv6CidrRange;
}
/**
 * Provides the implementation of functionality that are common to {@link IPv4CidrRange} and {@link IPv6CidrRange}
 */
export declare abstract class AbstractIPRange<T extends AbstractIPNum, P extends IPv4Prefix | IPv6Prefix> implements Iterable<AbstractIPNum> {
    abstract readonly bitValue: bigInt.BigInteger;
    protected abstract newInstance(num: T, prefix: IPv4Prefix | IPv6Prefix): IPv4CidrRange | IPv6CidrRange;
    abstract getFirst(): T;
    abstract getLast(): T;
    abstract getPrefix(): P;
    abstract getSize(): bigInt.BigInteger;
    abstract toCidrString(): string | never;
    hasNextRange(): boolean;
    hasPreviousRange(): boolean;
    toRangeSet(): RangedSet<AbstractIPNum>;
    inside(otherRange: IPv6CidrRange | IPv4CidrRange): boolean;
    contains(otherRange: IPv6CidrRange | IPv4CidrRange): boolean;
    toRangeString(): string;
    isOverlapping(otherRange: IPv6CidrRange | IPv4CidrRange): boolean;
    isConsecutive(otherRange: IPv6CidrRange | IPv4CidrRange): boolean;
    isCidrMergeable(otherRange: IPv6CidrRange | IPv4CidrRange): boolean;
    isMergeable(otherRange: IPv6CidrRange | IPv4CidrRange): boolean;
    isEquals(otherRange: IPv6CidrRange | IPv4CidrRange): boolean;
    merge(otherRange: IPv6CidrRange | IPv4CidrRange): IPv6CidrRange | IPv4CidrRange;
    /**
     * Returns a lazily evaluated representation of the IP range that produces IP numbers by either:
     *
     * - iterating over using the for of syntax
     * - converting to array using spread syntax
     * - or assigning values to variables using deconstruction
     *
     * @param count the number of IP numbers to lazily evaluate.
     * If none is given, the whole IP range is lazily returned.
     */
    takeStream(count?: number): Iterable<AbstractIPNum>;
    [Symbol.iterator](): Iterator<AbstractIPNum>;
}
/**
 * Represents a continuous segment of IPv4 numbers following the
 * classless inter-domain routing scheme for allocating IP addresses.
 *
 * @see https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing
 */
export declare class IPv4CidrRange extends AbstractIPRange<IPv4, IPv4Prefix> {
    private readonly ipv4;
    readonly cidrPrefix: IPv4Prefix;
    readonly bitValue: bigInt.BigInteger;
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
    protected newInstance(num: IPv4, prefix: IPv4Prefix): IPv4CidrRange;
    getPrefix(): IPv4Prefix;
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
    /**
     * Returns true if there is an adjacent IPv4 cidr range of exactly the same size next to this range
     */
    hasNextRange(): boolean;
    /**
     * Returns true if there is an adjacent IPv4 cidr range of exactly the same size previous to this range
     */
    hasPreviousRange(): boolean;
    /**
     * Return the next IPv6 cidr range, or undefined if no next range
     */
    nextRange(): IPv4CidrRange | undefined;
    /**
     * Return the previous IPv6 cidr range, or undefined if no next range
     */
    previousRange(): IPv4CidrRange | undefined;
}
/**
 * Represents a continuous segment of IPv6 number following the
 * classless inter-domain routing scheme for allocating IP addresses.
 *
 * @see https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing
 */
export declare class IPv6CidrRange extends AbstractIPRange<IPv6, IPv6Prefix> {
    private readonly ipv6;
    readonly cidrPrefix: IPv6Prefix;
    readonly bitValue: bigInt.BigInteger;
    /**
     * Convenience method for constructing an instance of an IPV6Range from an IP range represented in CIDR notation
     *
     * @param {string} rangeInCidrNotation the range of the IPv6 number in CIDR notation
     * @returns {IPv6CidrRange} the IPV6Range
     */
    static fromCidr(rangeInCidrNotation: string): IPv6CidrRange;
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
    protected newInstance(num: IPv6, prefix: IPv6Prefix): IPv6CidrRange;
    getPrefix(): IPv6Prefix;
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
     * Method that splits an IPv6 cidr range into two halves
     *
     * @returns {Array<IPv6CidrRange>} An array of two {@link IPv6CidrRange}
     */
    split(): Array<IPv6CidrRange>;
    /**
     * Returns true if there is an adjacent IPv6 cidr range of exactly the same size next to this range
     */
    hasNextRange(): boolean;
    /**
     * Returns true if there is an adjacent IPv6 cidr range of exactly the same size previous to this range
     */
    hasPreviousRange(): boolean;
    /**
     * Return the next IPv6 cidr range, or undefined if no next range
     */
    nextRange(): IPv6CidrRange | undefined;
    /**
     * Return the previous IPv6 cidr range, or undefined if no next range
     */
    previousRange(): IPv6CidrRange | undefined;
}
