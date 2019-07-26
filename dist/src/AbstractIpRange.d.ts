import * as bigInt from "big-integer";
import { IPv6 } from "./IPv6";
import { IPv6CidrRange } from "./IPv6CidrRange";
import { IPv4CidrRange } from "./IPv4CidrRange";
import { IPv4 } from "./IPv4";
/**
 * Provides the implementation of functionality that are common to {@link IPRange}s
 */
export declare abstract class AbstractIpRange<T extends IPv4 | IPv6> implements Iterable<IPv4 | IPv6> {
    readonly abstract bitValue: bigInt.BigInteger;
    abstract getFirst(): T;
    abstract getLast(): T;
    abstract getSize(): bigInt.BigInteger;
    abstract toCidrString(): string | never;
    toRangeString(): string;
    inside(otherRange: IPv6CidrRange | IPv4CidrRange): boolean;
    contains(otherRange: IPv6CidrRange | IPv4CidrRange): boolean;
    isOverlapping(otherRange: IPv6CidrRange | IPv4CidrRange): boolean;
    isConsecutive(otherRange: IPv6CidrRange | IPv4CidrRange): boolean;
    hasNextRange(): boolean;
    hasPreviousRange(): boolean;
    toRange(): Range<IPv4 | IPv6>;
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
    takeStream(count?: number): Iterable<IPv4 | IPv6>;
    [Symbol.iterator](): Iterator<IPv4 | IPv6>;
}
export declare class Range<T extends IPv4 | IPv6> extends AbstractIpRange<T> {
    private first;
    private last;
    readonly bitValue: bigInt.BigInteger;
    constructor(first: T, last: T);
    getFirst(): T;
    getLast(): T;
    getSize(): bigInt.BigInteger;
    take(count?: number): Iterable<IPv4 | IPv6>;
    toCidrString(): string;
}
