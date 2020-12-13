import * as bigInt from "big-integer";
import { Prefix } from "./Prefix";
import { IPv6 } from "./IPv6";
import { IPv6CidrRange } from "./IPv6CidrRange";
import { IPv4CidrRange } from "./IPv4CidrRange";
import { IPv4 } from "./IPv4";
/**
 * Provides the implementation of functionality that are common to {@link IPRange}s
 */
export declare abstract class AbstractIpRange {
    abstract readonly bitValue: bigInt.BigInteger;
    abstract readonly cidrPrefix: Prefix;
    abstract getFirst(): IPv6 | IPv4;
    abstract getLast(): IPv6 | IPv4;
    getSize(): bigInt.BigInteger;
    inside(otherRange: IPv6CidrRange | IPv4CidrRange): boolean;
    contains(otherRange: IPv6CidrRange | IPv4CidrRange): boolean;
    isOverlapping(otherRange: IPv6CidrRange | IPv4CidrRange): boolean;
    isConsecutive(otherRange: IPv6CidrRange | IPv4CidrRange): boolean;
    hasNextRange(): boolean;
    hasPreviousRange(): boolean;
}
