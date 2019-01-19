import * as bigInt from "big-integer";
import {Prefix} from "./Prefix";
import {IPv6} from "./IPv6";
import {IPv6CidrRange} from "./IPv6CidrRange";
import {IPv4CidrRange} from "./IPv4CidrRange";
import {IPv4} from "./IPv4";

/**
 * Provides the implementation of functionality that are common to {@link IPRange}s
 */

export abstract class AbstractIpRange {

    abstract readonly bitValue: bigInt.BigInteger;
    abstract readonly cidrPrefix: Prefix;
    abstract getFirst(): IPv6 | IPv4
    abstract getLast(): IPv6 | IPv4

    public getSize(): bigInt.BigInteger {
        /**
         * Using bitwise shit operation this will be
         * 1 << (this.bitValue - this.prefix.getValue())
         * Since left shift a number by x is equivalent to multiplying the number by the power x raised to 2
         * 2 << 4 = 2 * (2 raised to 4)
         */
        return bigInt(2).pow(this.bitValue.minus(bigInt(this.cidrPrefix.getValue())));
    }

    public inside(otherRange: IPv6CidrRange | IPv4CidrRange): boolean {
        let thisFirst: IPv6 | IPv4 = this.getFirst();
        let thisLast: IPv6 | IPv4 = this.getLast();
        let otherFirst: IPv6 | IPv4 = otherRange.getFirst();
        let otherLast: IPv6 | IPv4 = otherRange.getLast();

        return (otherFirst.isLessThanOrEquals(thisFirst) && otherLast.isGreaterThanOrEquals(thisLast));
    }

    public contains(otherRange: IPv6CidrRange | IPv4CidrRange): boolean {
        let thisFirst: IPv6 | IPv4 = this.getFirst();
        let thisLast: IPv6 | IPv4 = this.getLast();
        let otherFirst: IPv6 | IPv4 = otherRange.getFirst();
        let otherLast: IPv6 | IPv4 = otherRange.getLast();

        return (thisFirst.isLessThanOrEquals(otherFirst) && thisLast.isGreaterThanOrEquals(otherLast));
    }

    public isOverlapping(otherRange: IPv6CidrRange | IPv4CidrRange): boolean {
        let thisFirst: IPv6 | IPv4 = this.getFirst();
        let thisLast: IPv6 | IPv4 = this.getLast();
        let otherFirst: IPv6 | IPv4 = otherRange.getFirst();
        let otherLast: IPv6 | IPv4 = otherRange.getLast();

        return (
            thisLast.isGreaterThan(otherFirst) && thisLast.isLessThanOrEquals(otherLast) && thisFirst.isLessThan(otherFirst)
            ||
            otherLast.isGreaterThan(thisFirst) && otherLast.isLessThanOrEquals(thisLast) && otherFirst.isLessThan(otherFirst)
        );
    }

    public isConsecutive(otherRange: IPv6CidrRange | IPv4CidrRange): boolean {
        let thisFirst: IPv6 | IPv4 = this.getFirst();
        let thisLast: IPv6 | IPv4 = this.getLast();
        let otherFirst: IPv6 | IPv4 = otherRange.getFirst();
        let otherLast: IPv6 | IPv4 = otherRange.getLast();

        return (
            thisLast.hasNext() && thisLast.nextIPNumber().isEquals(otherFirst)
            ||
            otherLast.hasNext() && otherLast.nextIPNumber().isEquals(thisFirst)
        )
    }

    public hasNextRange(): boolean {
        let sizeOfCurrentRange = this.getSize();
        return bigInt(2).pow(this.bitValue)
            .minus(sizeOfCurrentRange)
            .greaterOrEquals(this.getFirst().getValue().plus(sizeOfCurrentRange));
    }

    public hasPreviousRange(): boolean {
        return this.getSize()
            .lesserOrEquals(this.getFirst().getValue())
    }

}