import {IPv6Prefix} from "./Prefix";
import {IPv6} from "./IPv6";
import * as bigInt from "big-integer";
import {leftPadWithZeroBit} from "./BinaryUtils";
import {parseBinaryStringToBigInteger} from "./BinaryUtils";
import {Validator} from "./Validator";
import {IPRange} from "./interface/IPRange";

/**
 * Represents a continuous segment of IPv6 number following the
 * classless inter-domain routing scheme for allocating IP addresses.
 *
 * @see https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing
 */
// TODO introduce an abstract class to share some of the logic between IPv4Range and IPv6Range
export class IPv6Range implements IPRange, IterableIterator<IPv6> {
    private readonly bitValue: bigInt.BigInteger = bigInt(128);
    private internalCounterValue: IPv6;

    /**
     * Convenience method for constructing an instance of an IPV6Range from an IP range represented in CIDR notation
     *
     * @param {string} rangeIncidrNotation the range of the IPv6 number in CIDR notation
     * @returns {IPV6Range} the IPV6Range
     */
    static fromCidr(rangeIncidrNotation:string):IPv6Range {
        let [isValid, message] = Validator.isValidIPv6CidrNotation(rangeIncidrNotation);
        if (!isValid) {
            throw new Error(message.filter(msg => {return msg !== '';}).toString());
        }
        let cidrComponents: Array<string> = rangeIncidrNotation.split("/");
        let ipString = cidrComponents[0];
        let prefix = parseInt(cidrComponents[1]);

        return new IPv6Range(IPv6.fromHexadecimalString(ipString), IPv6Prefix.fromNumber(prefix));
    };

    /**
     * Constructor for creating an instance of an IPv6 range.
     *
     * The arguments taken by the constructor is inspired by the CIDR notation which basically consists of the IP
     * number and the prefix.
     *
     * @param {IPv6} IPv6 the IP number used to construct the range. By convention this is the first IP number in
     * the range, but it could also be any IP number within the range
     * @param {IPv6Prefix} cidrPrefix the prefix which is a representation of the number of bits used to mask the
     * given IPv6 number in other to create the range
     */
    constructor(private readonly ipv6: IPv6, private readonly cidrPrefix: IPv6Prefix) {
        this.internalCounterValue = this.getFirst();
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
        return `${this.ipv6.toString()}/${this.cidrPrefix.toString()}`
    }

    /**
     * Method that returns the IPv6 range in string notation where the first IPv6 number and last IPv6 number are
     * separated by an hyphen. eg. "2001:db8:0:0:0:0:0:0-2001:db8:0:ffff:ffff:ffff:ffff:ffff"
     *
     * @returns {string} the range in [first IPv6 number] - [last IPv6 number] format
     */
    public toRangeString(): string {
        return `${this.getFirst()}-${this.getLast()}`
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
     * @param {IPv6Range} otherRange the other IPv6 range to compare with
     * @returns {boolean} true if the two IPv6 ranges are consecutive, false otherwise
     */
    // TODO move this to the IPRange interface?
    public isConsecutive(otherRange: IPv6Range): boolean {
        let thisFirst: IPv6 = this.getFirst();
        let thisLast: IPv6 = this.getLast();
        let otherFirst: IPv6 = otherRange.getFirst();
        let otherLast: IPv6 = otherRange.getLast();

        return (
            thisLast.hasNext() && thisLast.nextIPNumber().isEquals(otherFirst)
            ||
            otherLast.hasNext() && otherLast.nextIPNumber().isEquals(thisFirst)
        )
    }

    /**
     * Indicates if the given IPv6 range is a subset.
     *
     * By a subset range, it means all the values of the given range are contained by this IPv6 range
     *
     * @param {IPv6Range} otherRange the other IPv6 range
     * @returns {boolean} true if the other Ipv6 range is a subset. False otherwise.
     */
    // TODO move this to the IPRange interface?
    public contains(otherRange: IPv6Range): boolean {
        let thisFirst: IPv6 = this.getFirst();
        let thisLast: IPv6 = this.getLast();
        let otherFirst: IPv6 = otherRange.getFirst();
        let otherLast: IPv6 = otherRange.getLast();

        return (thisFirst.isLessThanOrEquals(otherFirst) && thisLast.isGreaterThanOrEquals(otherLast));
    }

    /**
     * Indicate if the given range is a container range.
     *
     * By container range, it means all the IP number in this current range can be found within the given range.
     *
     * @param {IPv6Range} otherRange he other IPv6 range
     * @returns {boolean} true if the other Ipv6 range is a container range. False otherwise.
     */
    // TODO move this to the IPRange interface?
    public inside(otherRange: IPv6Range): boolean {
        let thisFirst: IPv6 = this.getFirst();
        let thisLast: IPv6 = this.getLast();
        let otherFirst: IPv6 = otherRange.getFirst();
        let otherLast: IPv6 = otherRange.getLast();

        return (otherFirst.isLessThanOrEquals(thisFirst) && otherLast.isGreaterThanOrEquals(thisLast));
    }

    /**
     * Checks if two IPv6 ranges overlap
     * @param {IPv6Range} otherRange the other IPv6 range
     * @returns {boolean} true if the ranges overlap, false otherwise
     */
    // TODO or confirm than normal ranges cannot overlap
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

    /**
     * Method that takes IPv6 number from within an IPv6 range, starting from the first IPv6 number
     *
     * @param {number} count the amount of IPv6 number to take from the IPv6 range
     * @returns {Array<IPv6>} an array of IPv6 number, taken from the IPv6 range
     */
    public take(count: number): Array<IPv6> {
        let iPv6s: Array<IPv6>  = [this.getFirst()];
        let iteratingIPv6 = this.getFirst();

        if (bigInt(count).greater(this.getSize())) {
            throw new Error(`${count} is greater than ${this.getSize()}, the size of the range`);
        }

        for (var counter = 0; counter < count - 1; counter++) {
            iPv6s.push(iteratingIPv6.nextIPNumber());
            iteratingIPv6 = iteratingIPv6.nextIPNumber();
        }
        return iPv6s;
    }

    /**
     * Method that splits an IPv6 range into two halves
     *
     * @returns {Array<IPv6Range>} An array of two {@link IPv6Range}
     */
    public split() : Array<IPv6Range> {
        let prefixToSplit = this.cidrPrefix.getValue();
        if (prefixToSplit === 128) {
            throw new Error("Cannot split an IP range with a single IP number");
        }
        let splitCidr = IPv6Prefix.fromNumber(prefixToSplit + 1);
        let firstIPOfFirstRange = this.getFirst();
        let firstRange = new IPv6Range(firstIPOfFirstRange, splitCidr);
        let firstIPOfSecondRange = firstRange.getLast().nextIPNumber();
        let secondRange = new IPv6Range(firstIPOfSecondRange, splitCidr);
        return [firstRange, secondRange];
    }


    next(value?: any): IteratorResult<IPv6>;
    next(value?: any): IteratorResult<IPv6>;
    next(value?: any) {
        let returnValue = this.internalCounterValue;
        this.internalCounterValue = this.internalCounterValue.nextIPNumber();

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

    [Symbol.iterator](): IterableIterator<IPv6> {
        return this;
    }
}