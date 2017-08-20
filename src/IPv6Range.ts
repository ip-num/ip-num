import {IPv6Prefix} from "./Prefix";
import {IPv6} from "./IPv6";
import {BigInteger} from "big-integer";
import bigInt = require("big-integer");
import {leftPadWithZeroBit} from "./BinaryUtils";
import {parseBinaryStringToBigInteger} from "./BinaryUtils";
import {Validator} from "./Validator";
import {bigIntegerNumberToBinaryString} from "./BinaryUtils";
import {hexadecimalStringToBinaryString} from "./HexadecimalUtils";
import {hexadectetNotationToBinaryString} from "./HexadecimalUtils";

export class IPv6Range implements IterableIterator<IPv6> {
    private readonly bitValue: BigInteger = bigInt(128);
    private internalCounterValue: IPv6;

    static of(rangeIncidrNotation:string):IPv6Range {
        let [isValid, message] = Validator.isValidIPv6CidrNotation(rangeIncidrNotation);
        if (!isValid) {
            throw new Error(message);
        }
        let cidrComponents: Array<string> = rangeIncidrNotation.split("/");
        let ipString = cidrComponents[0];
        let prefix = parseInt(cidrComponents[1]);

        return new IPv6Range(IPv6.fromHexadecimalString(ipString), IPv6Prefix.of(prefix));
    };

    constructor(private readonly ipv6: IPv6, private readonly cidrPrefix: IPv6Prefix) {
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
        return `${this.ipv6.toString()}/${this.cidrPrefix.toString()}`
    }

    public toRangeString(): string {
        return `${this.getFirst()}-${this.getLast()}`
    }

    public getFirst(): IPv6 {
        return IPv6.fromBigInteger(this.ipv6.getValue().and(this.cidrPrefix.toSubnet().getValue()));
    }

    public getLast(): IPv6 {
        let onMask = bigInt("1".repeat(128), 2);
        let subnetAsBigInteger = this.cidrPrefix.toSubnet().getValue();
        let invertedSubnet = leftPadWithZeroBit(subnetAsBigInteger.xor(onMask).toString(2), 128);
        return IPv6.fromBigInteger(this.ipv6.getValue().or(parseBinaryStringToBigInteger(invertedSubnet)));
    }

    public isConsecutive(otherRange: IPv6Range): boolean {
        let thisFirst: IPv6 = this.getFirst();
        let thisLast: IPv6 = this.getLast();
        let otherFirst: IPv6 = otherRange.getFirst();
        let otherLast: IPv6 = otherRange.getLast();

        return (
            thisLast.hasNext() && thisLast.nextIPAddress().isEquals(otherFirst)
            ||
            otherLast.hasNext() && otherLast.nextIPAddress().isEquals(thisFirst)
        )
    }

    public contains(otherRange: IPv6Range): boolean {
        let thisFirst: IPv6 = this.getFirst();
        let thisLast: IPv6 = this.getLast();
        let otherFirst: IPv6 = otherRange.getFirst();
        let otherLast: IPv6 = otherRange.getLast();

        return (thisFirst.isLessThanOrEquals(otherFirst) && thisLast.isGreaterThanOrEquals(otherLast));
    }

    public inside(otherRange: IPv6Range): boolean {
        let thisFirst: IPv6 = this.getFirst();
        let thisLast: IPv6 = this.getLast();
        let otherFirst: IPv6 = otherRange.getFirst();
        let otherLast: IPv6 = otherRange.getLast();

        return (otherFirst.isLessThanOrEquals(thisFirst) && otherLast.isGreaterThanOrEquals(thisLast));
    }

    public isOverlapping(otherRange: IPv6Range): boolean {
        let thisFirst: IPv6 = this.getFirst();
        let thisLast: IPv6 = this.getLast();
        let otherFirst: IPv6 = otherRange.getFirst();
        let otherLast: IPv6 = otherRange.getLast();

        return (
            thisLast.isGreaterThan(otherFirst) && thisLast.isLessThanOrEquals(otherLast) && thisFirst.isLessThan(otherFirst)
            ||
            otherLast.isGreaterThan(thisFirst) && otherLast.isLessThanOrEquals(thisLast) && otherFirst.isLessThan(otherFirst)
        );
    }

    public take(count: number): Array<IPv6> {
        let iPv6s: Array<IPv6>  = [this.getFirst()];
        let iteratingIPv6 = this.getFirst();

        if (bigInt(count).greater(this.getSize())) {
            throw new Error(`${count} is greater than ${this.getSize()}, the size of the range`);
        }

        for (var counter = 0; counter < count - 1; counter++) {
            iPv6s.push(iteratingIPv6.nextIPAddress());
            iteratingIPv6 = iteratingIPv6.nextIPAddress();
        }
        return iPv6s;
    }

    public split() : Array<IPv6Range> {
        let prefixToSplit = this.cidrPrefix.getValue();
        if (prefixToSplit === 128) {
            throw new Error("Cannot split an IP range with a single IP address");
        }
        let splitCidr = IPv6Prefix.of(prefixToSplit + 1);
        let firstIPOfFirstRange = this.getFirst();
        let firstRange = new IPv6Range(firstIPOfFirstRange, splitCidr);
        let firstIPOfSecondRange = firstRange.getLast().nextIPAddress();
        let secondRange = new IPv6Range(firstIPOfSecondRange, splitCidr);
        return [firstRange, secondRange];
    }


    next(value?: any): IteratorResult<IPv6>;
    next(value?: any): IteratorResult<IPv6>;
    next(value?: any) {
        let returnValue = this.internalCounterValue;
        this.internalCounterValue = this.internalCounterValue.nextIPAddress();

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

    return?(value?: any): IteratorResult<IPv6> {
        return {
            done:true,
            value: this.internalCounterValue
        }
    }

    // TODO read up on what this method does and decide to implement or remove
    throw?(e?: any): IteratorResult<IPv6> {
        throw new Error("Method not implemented.");
    }

    [Symbol.iterator](): IterableIterator<IPv6> {
        return this;
    }
}