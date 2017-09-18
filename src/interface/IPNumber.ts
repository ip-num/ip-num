import {BigInteger} from "big-integer";
import {IPNumType} from "../IPNumType";

/**
 * Represents the shape of an Internet Protocol number. It describes properties and operations that can be performed
 * on all Internet Protocol numbers.
 */
export interface IPNumber {
    value: BigInteger;
    type: IPNumType;
    getValue():BigInteger;
    toString(): string;
    nextIPNumber(): IPNumber;
    previousIPNumber(): IPNumber;
    hasNext():boolean;
    hasPrevious():boolean;
}

