import * as bigInt from "big-integer";
import {Prefix} from "./Prefix";
import {IPv6} from "./IPv6";
import {IPv6CidrRange} from "./IPv6CidrRange";
import {IPv4CidrRange} from "./IPv4CidrRange";
import {IPv4} from "./IPv4";

/**
 * Provides the implementation of functionality that are common to {@link IPRange}s
 */

export abstract class AbstractIpRange implements Iterable<IPv4 | IPv6> {

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


    public toRangeString(): string {
        return `${this.getFirst()}-${this.getLast()}`
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

    /**
     * Method that returns the IPv4 range in CIDR (Classless Inter-Domain Routing) notation.
     *
     * See {@link https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing#CIDR_notation} for more information
     * on the Classless Inter-Domain Routing notation
     *
     * @returns {string} the IPv4 range in CIDR (Classless Inter-Domain Routing) notation
     */
    public toCidrString(): string {
        let first = this.getFirst();
        return `${first.toString()}/${this.cidrPrefix.toString()}`
    }


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
    public *takeStream(count?: number): Iterable<IPv4 | IPv6> {
      let computed = this.getFirst();
      let returnCount = count === undefined ? this.getSize().valueOf() : count;
      while(returnCount > 0) {
          returnCount--;
          yield computed;
          computed = computed.nextIPNumber();
      }
    }

  *[Symbol.iterator](): Iterator<IPv4 | IPv6> {
        let lastValue = this.getLast();
        let returnValue = this.getFirst();
        while(returnValue.isLessThanOrEquals(lastValue)) {
            yield returnValue;
            returnValue = returnValue.nextIPNumber();
        }
    }
}