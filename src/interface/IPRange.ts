import {IPNumber} from "./IPNumber";

/**
 * Represents the shape of an Internet Protocol number that can be represents as a range. This means {@link IPv4}
 * and {@link IPv6} numbers. It describes properties and operations that can be performed on a range of IPv4 or IPv6
 * numbers
 */
export interface IPRange {
    getSize(): bigInt.BigInteger;
    toCidrString(): string;
    toRangeString(): string;
    getFirst(): IPNumber;
    getLast(): IPNumber;
    take(count: number): Array<IPNumber>
    split() : Array<IPRange>
}