'use strict';

import {IPv4} from "./IPv4";
import {IPv4Prefix} from "./Prefix";
import {leftPadWithZeroBit} from "./BinaryUtils";
import {parseBinaryStringToBigInteger} from "./BinaryUtils";
import {Validator} from "./Validator";
//TODO why these two
import {BigInteger} from "big-integer";
import bigInt = require("big-integer");

/**
 * Represents a continuous segment of IPv4 addresses
 */
export class IPv4Range implements IterableIterator<IPv4> {
    private readonly bitValue: BigInteger = bigInt(32);
    private internalCounterValue: IPv4;

    static of(rangeIncidrNotation:string):IPv4Range {
        let [isValid, errorMessages] = Validator.isValidIPv4CidrNotation(rangeIncidrNotation);
        if (!isValid) {
            let messages = errorMessages.filter(message => {return message !== ''});
            throw new Error(messages.join(' and '));
        }
        let cidrComponents: Array<string> = rangeIncidrNotation.split("/");
        let ipString = cidrComponents[0];
        let prefix = parseInt(cidrComponents[1]);
        return new IPv4Range(IPv4.fromDecimalDottedString(ipString), IPv4Prefix.of(prefix));
    };

    constructor(private readonly ipv4: IPv4, private readonly cidrPrefix: IPv4Prefix) {
        this.internalCounterValue = this.getFirst();
    }

    public getSize(): BigInteger {
        /**
         * Using bitwise shit operation this will be
         * 1 << (this.bitValue - this.prefix.getValue())
         * Since left shift a number by x is equivalent to multiplying the number by the power x raised to 2
         * 2 << 4 = 2 * (2 raised to 4)
          */
        return bigInt(2).pow(this.bitValue.minus(bigInt(this.cidrPrefix.getValue())));
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
        let onMask = bigInt("1".repeat(32), 2);
        let subnetAsBigInteger = this.cidrPrefix.toSubnet().getValue();
        let invertedSubnet = leftPadWithZeroBit(subnetAsBigInteger.xor(onMask).toString(2), 32);
        return IPv4.fromBigInteger(this.ipv4.getValue().or(parseBinaryStringToBigInteger(invertedSubnet)));
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
        let iteratingIPv4 = this.getFirst();

        if (bigInt(count).greater(this.getSize())) {
            throw new Error(`${count} is greater than ${this.getSize()}, the size of the range`);
        }

        for (var counter = 0; counter < count - 1; counter++) {
            ipv4s.push(iteratingIPv4.nextIPv4());
            iteratingIPv4 = iteratingIPv4.nextIPv4();
        }
        return ipv4s;
    }

    public split() : Array<IPv4Range> {
        let prefixToSplit = this.cidrPrefix.getValue();
        if (prefixToSplit === 32) {
            throw new Error("Cannot split an IP range with a single IP address");
        }
        let splitCidr = IPv4Prefix.of(prefixToSplit + 1);
        let firstIPOfFirstRange = this.getFirst();
        let firstRange = new IPv4Range(firstIPOfFirstRange, splitCidr);
        let firstIPOfSecondRange = firstRange.getLast().nextIPv4();
        let secondRange = new IPv4Range(firstIPOfSecondRange, splitCidr);
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

    // TODO read up on what this method does and decide to implement or remove
    throw?(e?: any): IteratorResult<IPv4> {
        throw new Error("Method not implemented.");
    }

    [Symbol.iterator](): IterableIterator<IPv4> {
        return this;
    }
}