import {IPv4} from "./IPv4";
import {IPv4Prefix} from "./Prefix";
import {leftPadWithZeroBit} from "./BinaryUtils";
import {parseBinaryStringToBigInteger} from "./BinaryUtils";
import {Validator} from "./Validator";
import * as bigInt from "big-integer";
import {IPRange} from "./interface/IPRange";
import {AbstractIpRange} from "./AbstractIpRange";

/**
 * Represents a continuous segment of IPv4 numbers following the
 * classless inter-domain routing scheme for allocating IP addresses.
 *
 * @see https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing
 */
export class IPv4CidrRange extends AbstractIpRange implements IPRange, IterableIterator<IPv4> {
    readonly bitValue: bigInt.BigInteger = bigInt(32);
    private internalCounterValue: IPv4;

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
        this.internalCounterValue = this.getFirst();
    }

    /**
     * Gets the size of IPv4 numbers contained within the IPv4 range
     *
     * @returns {bigInt.BigInteger} the amount of IPv4 numbers in the range
     */
    public getSize(): bigInt.BigInteger {
        return super.getSize();
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
        return `${this.ipv4.toString()}/${this.cidrPrefix.toString()}`
    }

    /**
     * Method that returns the IPv4 range in string notation where the first IPv4 number and last IPv4 number are
     * separated by an hyphen. eg. 192.198.0.0-192.198.0.255
     *
     * @returns {string} the range in [first IPv4 number] - [last IPv4 number] format
     */
    public toRangeString(): string {
        return `${this.getFirst()}-${this.getLast()}`
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
    public take(count: number): Array<IPv4> {
        let ipv4s: Array<IPv4>  = [this.getFirst()];
        let iteratingIPv4 = this.getFirst();

        if (bigInt(count).greater(this.getSize())) {
            let errMessage = Validator.takeOutOfRangeSizeMessage
                .replace("$count", count.toString())
                .replace("$size", this.getSize().toString());
            throw new Error(errMessage);
        }

        for (var counter = 0; counter < count - 1; counter++) {
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

    next(value?: any): IteratorResult<IPv4>;
    next(value?: any): IteratorResult<IPv4>;
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

    [Symbol.iterator](): IterableIterator<IPv4> {
        return this;
    }
}