import { IPv4CidrRange, IPv6CidrRange, RangedSet } from "./IPRange";
import { AbstractIPNum, IPv4, IPv6 } from "./IPNumber";
import { IPv4Prefix, IPv6Prefix } from "./Prefix";
import * as bigInt from "big-integer";
declare type RangeType = RangedSet<IPv4> | RangedSet<IPv6>;
export declare type IPCidrRange<T> = T extends IPv4Prefix ? IPv4CidrRange : IPv6CidrRange;
export declare type IPCidrRangeArray<T> = T extends IPv4Prefix ? Array<IPv4CidrRange> : Array<IPv6CidrRange>;
/**
 * Represents a collection of IP {@link RangedSet}'s
 */
export declare class Pool<T extends RangeType> {
    private backingSet;
    /**
     * Convenient method for creating an instance from arrays of {@link IPv4} or {@link IPv6}
     * @param ipNumbers the arrays of {@link IPv4} or {@link IPv6} that will make up the pool.
     */
    static fromIPNumbers(ipNumbers: Array<IPv4> | Array<IPv6>): Pool<RangeType>;
    /**
     * Convenient method for creating an instance from arrays of {@link RangedSet}.
     *
     * @param ipRanges the arrays of {@link RangedSet}'s that will make up the pool.
     */
    static fromRangeSet(ipRanges: Array<RangedSet<AbstractIPNum>>): Pool<RangeType>;
    /**
     * Convenient method for creating an instance from arrays of {@link IPv4CidrRange} or {@link IPv6CidrRange}.
     *
     * @param cidrRanges the arrays of {@link IPv4CidrRange} or {@link IPv6CidrRange} that will make up the pool.
     */
    static fromCidrRanges(cidrRanges: IPv4CidrRange[] | IPv6CidrRange[]): Pool<RangeType>;
    /**
     * Constructor for an IP pool.
     *
     * Creates a Pool of IP ranges from supplied {@link RangedSet}'s
     *
     * @param ranges the array of IP ranges that would make up the pool.
     */
    constructor(ranges: Array<RangedSet<AbstractIPNum>>);
    /**
     * Returns an array of {@link RangedSet}'s that is contained within the pool
     */
    getRanges(): Array<RangedSet<AbstractIPNum>>;
    /**
     * Returns an new {@link Pool} with all the IP ranges aggregated
     */
    aggregate(): Pool<T>;
    /**
     * Gets a single range of size of the given prefix from pool.
     * Only returns a range if there is a single range in the pool of same size or greater than given prefix.
     *
     * throws exception if the requested range cannot be got from the pool.
     *
     * @param prefix prefix range to retrieve
     * TODO TSE
     */
    getCidrRange<T extends IPv4Prefix | IPv6Prefix>(prefix: T): IPCidrRange<T>;
    /**
     * Gets a single or multiple ranges that fulfils the given prefix from the pool.
     *
     * throws exception if the requested range cannot be got from the pool.
     *
     * @param reqprefix prefix range to retrieve
     */
    getCidrRanges<T extends IPv4Prefix | IPv6Prefix>(reqprefix: T): IPCidrRangeArray<T>;
    /**
     * Returns the size of IP numbers in the pool
     */
    getSize(): bigInt.BigInteger;
    /**
     * Empties the pool and fill it with given ranges
     *
     * @param ipRanges the range to fill the pool with after emptying
     */
    resetWith(ipRanges: Array<RangedSet<IPv4 | IPv6>>): void;
    /**
     * Removes the given range from the pool. It only removes if the exact range exist in the pool.
     * It is a Noop and returns false, if the given range does not exist in the pool. Returns true otherwise
     *
     * @param rangeToRemove range to remove from ppol
     */
    removeExact(rangeToRemove: RangedSet<AbstractIPNum>): boolean;
    /**
     * Removes the given range from the pool. If the given range overlaps, then it removes the overlapping portion.
     * It is a Noop and returns false, if the given range does not exist in the pool. Returns true otherwise
     *
     * @param rangeToRemove range to remove from ppol
     */
    removeOverlapping(rangeToRemove: RangedSet<AbstractIPNum>): boolean;
    /**
     * Adds the given range to the pool.
     *
     * @param range to add to pool.
     */
    add(range: Array<RangedSet<AbstractIPNum>>): void;
    /**
     * Removes all ranges from pool
     */
    clear(): void;
}
export {};
