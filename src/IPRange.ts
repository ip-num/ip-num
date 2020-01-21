import * as bigInt from "big-integer";
import {IPv6} from "./IPNumber";
import {IPv4} from "./IPNumber";
import {IPv6Prefix} from "./Prefix";
import {leftPadWithZeroBit} from "./BinaryUtils";
import {parseBinaryStringToBigInteger} from "./BinaryUtils";
import {Validator} from "./Validator";
import {IPv4Prefix} from "./Prefix";



export class Range<T extends IPv4 | IPv6>  {

    readonly bitValue: bigInt.BigInteger;

    constructor(private first: T, private last: T) {
        this.bitValue = bigInt(first.bitSize);
    }

    getFirst(): T {
        return this.first;
    }

    getLast(): T {
        return this.last;
    }

    getSize(): bigInt.BigInteger {
        return this.last.getValue().minus(this.first.getValue());
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

    public *take(count?: number): Iterable<IPv4 | IPv6> {
        let computed: IPv6 | IPv4 = this.getFirst();
        let returnCount = count === undefined ? this.getSize().plus(1).valueOf() : count;
        while(returnCount > 0) {
            returnCount--;
            yield computed;
            computed = computed.nextIPNumber();
        }
    }
}

/**
 * Provides the implementation of functionality that are common to {@link IPRange}s
 */

export abstract class IPRange<T extends IPv4 | IPv6>  implements Iterable<IPv4 | IPv6> {

    abstract readonly bitValue: bigInt.BigInteger;
    abstract getFirst(): T
    abstract getLast(): T
    abstract getSize(): bigInt.BigInteger;
    abstract toCidrString(): string | never

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


    public toRange(): Range<IPv4 | IPv6> {
        return new Range(this.getFirst(), this.getLast());
    }

    public inside(otherRange: IPv6CidrRange | IPv4CidrRange): boolean {
        return this.toRange().inside(otherRange)
    }

    public contains(otherRange: IPv6CidrRange | IPv4CidrRange): boolean {
        return this.toRange().contains(otherRange);
    }

    public isOverlapping(otherRange: IPv6CidrRange | IPv4CidrRange): boolean {
        return this.toRange().isOverlapping(otherRange);
    }

    public isConsecutive(otherRange: IPv6CidrRange | IPv4CidrRange): boolean {
        return this.toRange().isConsecutive(otherRange);
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
        return this.toRange().take(count);
    }

    *[Symbol.iterator](): Iterator<IPv4 | IPv6> {
        let lastValue: IPv6 | IPv4 = this.getLast();
        let returnValue: IPv6 | IPv4 = this.getFirst();
        while(returnValue.isLessThanOrEquals(lastValue)) {
            yield returnValue;
            returnValue = returnValue.nextIPNumber();
        }
    }
}

/**
 * Represents a continuous segment of IPv4 numbers following the
 * classless inter-domain routing scheme for allocating IP addresses.
 *
 * @see https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing
 */
export class IPv4CidrRange extends IPRange<IPv4> {
    readonly bitValue: bigInt.BigInteger = bigInt(32);

    /**
     * Convenience method for constructing an instance of an IPv4CidrRange from an IP range represented in CIDR notation
     *
     * @param {string} rangeIncidrNotation the range of the IPv4 number in CIDR notation
     * @returns {IPv4CidrRange} the IPv4CidrRange
     */
    static fromCidr(rangeIncidrNotation:string):IPv4CidrRange {
        let [isValid, errorMessages] = Validator.isValidIPv4CidrNotation(rangeIncidrNotation);
        if (!isValid) {
            let messages = errorMessages.filter(message => {return message !== ''});
            throw new Error(messages.join(' and '));
        }
        let cidrComponents: Array<string> = rangeIncidrNotation.split("/");
        let ipString = cidrComponents[0];
        let prefix = parseInt(cidrComponents[1]);
        return new IPv4CidrRange(IPv4.fromDecimalDottedString(ipString), IPv4Prefix.fromNumber(prefix));
    };

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
    constructor(private readonly ipv4: IPv4, readonly cidrPrefix: IPv4Prefix) {
        super();
    }

    /**
     * Gets the size of IPv4 numbers contained within the IPv4 range
     *
     * @returns {bigInt.BigInteger} the amount of IPv4 numbers in the range
     */
    public getSize(): bigInt.BigInteger {
        /**
         * Using bitwise shit operation this will be
         * 1 << (this.bitValue - this.prefix.getValue())
         * Since left shift a number by x is equivalent to multiplying the number by the power x raised to 2
         * 2 << 4 = 2 * (2 raised to 4)
         */
        return bigInt(2).pow(this.bitValue.minus(bigInt(this.cidrPrefix.getValue())));
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
     * Method that returns the IPv4 range in string notation where the first IPv4 number and last IPv4 number are
     * separated by an hyphen. eg. 192.198.0.0-192.198.0.255
     *
     * @returns {string} the range in [first IPv4 number] - [last IPv4 number] format
     */
    public toRangeString(): string {
        return super.toRange().toRangeString();
    }


    /**
     * Method that returns the first IPv4 number in the IPv4 range
     *
     * @returns {IPv4} the first IPv4 number in the IPv4 range
     */
    public getFirst(): IPv4 {
        return IPv4.fromBigInteger(this.ipv4.getValue().and(this.cidrPrefix.toSubnetMask().getValue()));
    }

    /**
     * Method that returns the last IPv4 number in the IPv4 range
     *
     * @returns {IPv4} the last IPv4 number in the IPv4 range
     */
    public getLast(): IPv4 {
        let onMask = bigInt("1".repeat(32), 2);
        let subnetAsBigInteger = this.cidrPrefix.toSubnetMask().getValue();
        let invertedSubnet = leftPadWithZeroBit(subnetAsBigInteger.xor(onMask).toString(2), 32);
        return IPv4.fromBigInteger(this.ipv4.getValue().or(parseBinaryStringToBigInteger(invertedSubnet)));
    }

    /**
     * Indicates whether the given IPv4 range is an adjacent range.
     *
     * An adjacent range being one where the end of the given range, when incremented by one marks the start of the
     * other range. Or where the start of the given range, when decreased by one, marks the end of the other range
     *
     * @param {IPv4CidrRange} otherRange the other IPv4 range to compare with
     * @returns {boolean} true if the two IPv4 ranges are consecutive, false otherwise
     */
    public isConsecutive(otherRange: IPv4CidrRange): boolean {
        return super.isConsecutive(otherRange);
    }

    /**
     * Indicates if the given IPv4 range is a subset.
     *
     * By a subset range, it means all the values of the given range are contained by this IPv4 range
     *
     * @param {IPv4CidrRange} otherRange the other IPv4 range
     * @returns {boolean} true if the other Ipv4 range is a subset. False otherwise.
     */
    public contains(otherRange: IPv4CidrRange): boolean {
        return super.contains(otherRange);
    }

    /**
     * Indicate if the given range is a container range.
     *
     * By container range, it means all the IP number in this current range can be found within the given range.
     *
     * @param {IPv4CidrRange} otherRange he other IPv4 range
     * @returns {boolean} true if the other Ipv4 range is a container range. False otherwise.
     */
    public inside(otherRange: IPv4CidrRange): boolean {
        return super.inside(otherRange);
    }

    /**
     * Checks if two IPv4 ranges overlap
     * @param {IPv4CidrRange} otherRange the other IPv4 range
     * @returns {boolean} true if the ranges overlap, false otherwise
     */
    public isOverlapping(otherRange: IPv4CidrRange): boolean {
        return super.isOverlapping(otherRange);
    }

    /**
     * Method that takes IPv4 number from within an IPv4 range, starting from the first IPv4 number
     *
     * @param {number} count the amount of IPv4 number to take from the IPv4 range
     * @returns {Array<IPv4>} an array of IPv4 number, taken from the IPv4 range
     */
    public take(count: bigInt.BigInteger): Array<IPv4> {
        let ipv4s: Array<IPv4>  = [this.getFirst()];
        let iteratingIPv4 = this.getFirst();

        if (bigInt(count).greater(this.getSize())) {
            let errMessage = Validator.takeOutOfRangeSizeMessage
                .replace("$count", count.toString())
                .replace("$size", this.getSize().toString());
            throw new Error(errMessage);
        }

        for (var counter = 0; counter < count.minus(1).valueOf(); counter++) {
            ipv4s.push(iteratingIPv4.nextIPNumber());
            iteratingIPv4 = iteratingIPv4.nextIPNumber();
        }
        return ipv4s;
    }

    /**
     * Method that splits an IPv4 range into two halves
     *
     * @returns {Array<IPv4CidrRange>} An array of two {@link IPv4CidrRange}
     */
    public split() : Array<IPv4CidrRange> {
        let prefixToSplit = this.cidrPrefix.getValue();
        if (prefixToSplit === 32) {
            throw new Error("Cannot split an IP range with a single IP number");
        }
        let splitCidr = IPv4Prefix.fromNumber(prefixToSplit + 1);
        let firstIPOfFirstRange = this.getFirst();
        let firstRange = new IPv4CidrRange(firstIPOfFirstRange, splitCidr);
        let firstIPOfSecondRange = firstRange.getLast().nextIPNumber();
        let secondRange = new IPv4CidrRange(firstIPOfSecondRange, splitCidr);
        return [firstRange, secondRange];
    }

    public hasNextRange(): boolean {
        return super.hasNextRange();
    }

    public hasPreviousRange(): boolean {
        return super.hasPreviousRange();
    }

    public nextRange(): IPv4CidrRange | undefined {
        if (this.hasNextRange()) {
            let sizeOfCurrentRange = this.getSize();
            let startOfNextRange = this.getFirst().getValue().plus(sizeOfCurrentRange);
            return new IPv4CidrRange(new IPv4(startOfNextRange), this.cidrPrefix)
        }

        return;
    }

    public previousRange(): IPv4CidrRange | undefined {
        if (this.hasPreviousRange()) {
            let sizeOfCurrentRange = this.getSize();
            let startOfPreviousRange = this.getFirst().getValue().minus(sizeOfCurrentRange);
            return new IPv4CidrRange(new IPv4(startOfPreviousRange), this.cidrPrefix)
        }

        return;
    }
}


/**
 * Represents a continuous segment of IPv6 number following the
 * classless inter-domain routing scheme for allocating IP addresses.
 *
 * @see https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing
 */
export class IPv6CidrRange extends IPRange<IPv6> {
    readonly bitValue: bigInt.BigInteger = bigInt(128);

    /**
     * Convenience method for constructing an instance of an IPV6Range from an IP range represented in CIDR notation
     *
     * @param {string} rangeInCidrNotation the range of the IPv6 number in CIDR notation
     * @returns {IPv6CidrRange} the IPV6Range
     */
    static fromCidr(rangeInCidrNotation:string):IPv6CidrRange {
        let [isValid, message] = Validator.isValidIPv6CidrNotation(rangeInCidrNotation);
        if (!isValid) {
            throw new Error(message.filter(msg => {return msg !== '';}).toString());
        }
        let cidrComponents: Array<string> = rangeInCidrNotation.split("/");
        let ipString = cidrComponents[0];
        let prefix = parseInt(cidrComponents[1]);

        return new IPv6CidrRange(IPv6.fromHexadecimalString(ipString), IPv6Prefix.fromNumber(prefix));
    };

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
    constructor(private readonly ipv6: IPv6, readonly cidrPrefix: IPv6Prefix) {
        super();
    }

    /**
     * Gets the size of IPv6 numbers contained within the IPv6 range
     *
     * @returns {bigInt.BigInteger} the amount of IPv6 numbers in the range
     */
    public getSize(): bigInt.BigInteger {
        /**
         * Using bitwise shit operation this will be
         * 1 << (this.bitValue - this.prefix.getValue())
         * Since left shift a number by x is equivalent to multiplying the number by the power x raised to 2
         * 2 << 4 = 2 * (2 raised to 4)
         */
        return bigInt(2).pow(this.bitValue.minus(bigInt(this.cidrPrefix.getValue())));
    }

    /**
     * Method that returns the IPv6 range in CIDR (Classless Inter-Domain Routing) notation.
     *
     * See {@link https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing#CIDR_notation} for more information
     * on the Classless Inter-Domain Routing notation
     *
     * @returns {string} the IPv6 range in CIDR (Classless Inter-Domain Routing) notation
     */
    public toCidrString(): string {
        let first = this.getFirst();
        return `${first.toString()}/${this.cidrPrefix.toString()}`
    }

    /**
     * Method that returns the IPv6 range in string notation where the first IPv6 number and last IPv6 number are
     * separated by an hyphen. eg. "2001:db8:0:0:0:0:0:0-2001:db8:0:ffff:ffff:ffff:ffff:ffff"
     *
     * @returns {string} the range in [first IPv6 number] - [last IPv6 number] format
     */
    public toRangeString(): string {
        return super.toRange().toRangeString();
    }

    /**
     * Method that returns the first IPv6 number in the IPv6 range
     *
     * @returns {IPv6} the first IPv6 number in the IPv6 range
     */
    public getFirst(): IPv6 {
        return IPv6.fromBigInteger(this.ipv6.getValue().and(this.cidrPrefix.toSubnetMask().getValue()));
    }

    /**
     * Method that returns the last IPv6 number in the IPv6 range
     *
     * @returns {IPv6} the last IPv6 number in the IPv6 range
     */
    public getLast(): IPv6 {
        let onMask = bigInt("1".repeat(128), 2);
        let subnetMaskAsBigInteger = this.cidrPrefix.toSubnetMask().getValue();
        let invertedSubnetMask = leftPadWithZeroBit(subnetMaskAsBigInteger.xor(onMask).toString(2), 128);
        return IPv6.fromBigInteger(this.ipv6.getValue().or(parseBinaryStringToBigInteger(invertedSubnetMask)));
    }

    /**
     * Indicates whether the given IPv6 range is an adjacent range.
     *
     * An adjacent range being one where the end of the given range, when incremented by one marks the start of the
     * other range. Or where the start of the given range, when decreased by one, marks the end of the other range
     *
     * @param {IPv6CidrRange} otherRange the other IPv6 range to compare with
     * @returns {boolean} true if the two IPv6 ranges are consecutive, false otherwise
     */
    public isConsecutive(otherRange: IPv6CidrRange): boolean {
        return super.isConsecutive(otherRange);
    }

    /**
     * Indicates if the given IPv6 range is a subset.
     *
     * By a subset range, it means all the values of the given range are contained by this IPv6 range
     *
     * @param {IPv6CidrRange} otherRange the other IPv6 range
     * @returns {boolean} true if the other Ipv6 range is a subset. False otherwise.
     */
    public contains(otherRange: IPv6CidrRange): boolean {
        return super.contains(otherRange);
    }

    /**
     * Indicate if the given range is a container range.
     *
     * By container range, it means all the IP number in this current range can be found within the given range.
     *
     * @param {IPv6CidrRange} otherRange he other IPv6 range
     * @returns {boolean} true if the other Ipv6 range is a container range. False otherwise.
     */
    public inside(otherRange: IPv6CidrRange): boolean {
        return super.inside(otherRange);
    }

    /**
     * Checks if two IPv6 ranges overlap
     * @param {IPv6CidrRange} otherRange the other IPv6 range
     * @returns {boolean} true if the ranges overlap, false otherwise
     */
    public isOverlapping(otherRange: IPv6CidrRange): boolean {
        return super.isOverlapping(otherRange);
    }

    /**
     * Method that takes IPv6 number from within an IPv6 range, starting from the first IPv6 number
     *
     * @param {number} count the amount of IPv6 number to take from the IPv6 range
     * @returns {Array<IPv6>} an array of IPv6 number, taken from the IPv6 range
     */
    public take(count: bigInt.BigInteger): Array<IPv6> {
        let iPv6s: Array<IPv6>  = [this.getFirst()];
        let iteratingIPv6 = this.getFirst();

        if (count.greater(this.getSize())) {
            throw new Error(`${count.toString()} is greater than ${this.getSize().toString()}, the size of the range`);
        }

        for (var counter = 0; counter < count.minus(1).valueOf(); counter++) {
            iPv6s.push(iteratingIPv6.nextIPNumber());
            iteratingIPv6 = iteratingIPv6.nextIPNumber();
        }
        return iPv6s;
    }

    /**
     * Method that splits an IPv6 range into two halves
     *
     * @returns {Array<IPv6CidrRange>} An array of two {@link IPv6CidrRange}
     */
    public split() : Array<IPv6CidrRange> {
        let prefixToSplit = this.cidrPrefix.getValue();
        if (prefixToSplit === 128) {
            throw new Error("Cannot split an IP range with a single IP number");
        }
        let splitCidr = IPv6Prefix.fromNumber(prefixToSplit + 1);
        let firstIPOfFirstRange = this.getFirst();
        let firstRange = new IPv6CidrRange(firstIPOfFirstRange, splitCidr);
        let firstIPOfSecondRange = firstRange.getLast().nextIPNumber();
        let secondRange = new IPv6CidrRange(firstIPOfSecondRange, splitCidr);
        return [firstRange, secondRange];
    }

    public hasNextRange(): boolean {
        return super.hasNextRange();
    }

    public hasPreviousRange(): boolean {
        return super.hasPreviousRange();
    }

    public nextRange(): IPv6CidrRange | undefined {
        if (this.hasNextRange()) {
            let sizeOfCurrentRange = this.getSize();
            let startOfNextRange = this.getFirst().getValue().plus(sizeOfCurrentRange);
            return new IPv6CidrRange(new IPv6(startOfNextRange), this.cidrPrefix)
        }
        return;
    }

    public previousRange(): IPv6CidrRange | undefined {
        if (this.hasPreviousRange()) {
            let sizeOfCurrentRange = this.getSize();
            let startOfPreviousRange = this.getFirst().getValue().minus(sizeOfCurrentRange);
            return new IPv6CidrRange(new IPv6(startOfPreviousRange), this.cidrPrefix)
        }
        return;
    }
}