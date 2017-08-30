'use strict';
import {IPNumber} from "./IPNumber";

export interface IPRange {
    getSize(): bigInt.BigInteger;
    toCidrString(): string;
    toRangeString(): string;
    getFirst(): IPNumber;
    getLast(): IPNumber;
    take(count: number): Array<IPNumber>
    split() : Array<IPRange>
}