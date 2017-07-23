'use strict';

import {IPv4} from "./Ipv4";
import {Ipv4Prefix} from "./Prefix";
import * as bigInt from "big-integer/BigInteger";
import {leftPadWithZeroBit} from "./BinaryUtils";
import {binaryToDecimal} from "./BinaryUtils";
import {Validator} from "./Validator";

/**
 * Represents a continuous segment of Ipv4 addresses
 */
export class IPv4Range implements IterableIterator<IPv4> {
    private readonly bitValue: number = 32;
    private readonly cidrPrefix: Ipv4Prefix;
    private readonly ipv4: IPv4;
    private internalCounterValue: IPv4;

    static of(rangeIncidrNotation:string):IPv4Range {
        let [isValid, message] = Validator.isValidCidrNotation(rangeIncidrNotation);
        if (!isValid) {
            throw new Error(message);
        }
        let cidrComponents: Array<string> = rangeIncidrNotation.split("/");
        let ipString = cidrComponents[0];
        let prefix = parseInt(cidrComponents[1]);
        return new IPv4Range(IPv4.fromDecimalDottedString(ipString), Ipv4Prefix.of(prefix));
    };

    constructor(ipv4: IPv4, prefix: Ipv4Prefix) {
        this.ipv4 = ipv4;
        this.cidrPrefix = prefix;
        this.internalCounterValue = this.getFirst();
    }

    public getSize(): number {
        /**
         * Using bitwise shit operation this will be
         * 1 << (this.bitValue - this.prefix.getValue())
         * Since left shift a number by x is equivalent to multiplying the number by the power x raised to 2
         * 2 << 4 = 2 * (2 raised to 4)
          */
       return Math.pow(2, (this.bitValue - this.cidrPrefix.getValue()));
    }

    public toCidrString(): string {
        return `${this.ipv4.toString()}/${this.cidrPrefix.toString()}`
    }

    public toRangeString(): string {
        return `${this.getFirst()}-${this.getLast()}`
    }

    public getFirst(): IPv4 {
        return IPv4.fromBigInteger(this.ipv4.getValue().and(this.cidrPrefix.toSubnet().getValue()));
    }

    public getLast(): IPv4 {
        let invertedSubnet = leftPadWithZeroBit(this.cidrPrefix.toSubnet().getValue().xor('4294967295').toString(2), 32);
        return IPv4.fromBigInteger(this.ipv4.getValue().or(binaryToDecimal(invertedSubnet)));
    }

    public isConsecutive(otherRange: IPv4Range): boolean {
        let thisFirst: IPv4 = this.getFirst();
        let thisLast: IPv4 = this.getLast();
        let otherFirst: IPv4 = otherRange.getFirst();
        let otherLast: IPv4 = otherRange.getLast();

        return (
            thisLast.hasNext() && thisLast.nextIPv4().isEquals(otherFirst)
            ||
            otherLast.hasNext() && otherLast.nextIPv4().isEquals(thisFirst)
        )
    }

    public contains(otherRange: IPv4Range): boolean {
        let thisFirst: IPv4 = this.getFirst();
        let thisLast: IPv4 = this.getLast();
        let otherFirst: IPv4 = otherRange.getFirst();
        let otherLast: IPv4 = otherRange.getLast();

        return (thisFirst.isLessThanOrEquals(otherFirst) && thisLast.isGreaterThanOrEquals(otherLast));
    }

    public inside(otherRange: IPv4Range): boolean {
        let thisFirst: IPv4 = this.getFirst();
        let thisLast: IPv4 = this.getLast();
        let otherFirst: IPv4 = otherRange.getFirst();
        let otherLast: IPv4 = otherRange.getLast();

        return (otherFirst.isLessThanOrEquals(thisFirst) && otherLast.isGreaterThanOrEquals(thisLast));
    }

    public isOverlapping(otherRange: IPv4Range): boolean {
        let thisFirst: IPv4 = this.getFirst();
        let thisLast: IPv4 = this.getLast();
        let otherFirst: IPv4 = otherRange.getFirst();
        let otherLast: IPv4 = otherRange.getLast();

        return (
            thisLast.isGreaterThan(otherFirst) && thisLast.isLessThanOrEquals(otherLast) && thisFirst.isLessThan(otherFirst)
            ||
            otherLast.isGreaterThan(thisFirst) && otherLast.isLessThanOrEquals(thisLast) && otherFirst.isLessThan(otherFirst)
        );
    }

    public take(count: number): Array<IPv4> {
        let ipv4s: Array<IPv4>  = [this.getFirst()];
        let iteratingIpv4 = this.getFirst();

        if (count > this.getSize()) {
            throw new Error(`${count} is greater than ${this.getSize()}, the size of the range`);
        }

        for (var counter = 0; counter < count - 1; counter++) {
            ipv4s.push(iteratingIpv4.nextIPv4());
            iteratingIpv4 = iteratingIpv4.nextIPv4();
        }
        return ipv4s;
    }

    public split() : Array<IPv4Range> {
        let prefixToSplit = this.cidrPrefix.getValue();
        if (prefixToSplit === 32) {
            throw new Error("Cannot split an IP range with a single Ip address");
        }
        let splitCidr = Ipv4Prefix.of(prefixToSplit + 1);
        let firstIpOfFirstRange = this.getFirst();
        let firstRange = new IPv4Range(firstIpOfFirstRange, splitCidr);
        let firstIpOfSecondRange = firstRange.getLast().nextIPv4();
        let secondRange = new IPv4Range(firstIpOfSecondRange, splitCidr);
        return [firstRange, secondRange];
    }

    next(value?: any): IteratorResult<IPv4>;
    next(value?: any): IteratorResult<IPv4>;
    next(value?: any) {
        let returnValue = this.internalCounterValue;
        this.internalCounterValue = this.internalCounterValue.nextIPv4();

        if (returnValue.isLessThanOrEquals(this.getLast())) {
            return {
                done:false,
                value: returnValue
            }
        } else {
            return {
                done:true
            }
        }
    }

    return?(value?: any): IteratorResult<IPv4> {
        return {
            done:true,
            value: this.internalCounterValue
        }
    }

    throw?(e?: any): IteratorResult<IPv4> {
        throw new Error("Method not implemented.");
    }

    [Symbol.iterator](): IterableIterator<IPv4> {
        return this;
    }
}