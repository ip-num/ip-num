import * as bigInt from "big-integer"
import {leftPadWithZeroBit} from "./BinaryUtils";

export abstract class AbstractIPNum {
    abstract readonly value: bigInt.BigInteger;
    abstract readonly bitSize: number;
    abstract readonly validatorBitSize: bigInt.BigInteger;
    public getValue():bigInt.BigInteger {
        return this.value;
    }
    public toBinaryString(): string {
        return leftPadWithZeroBit(this.value.toString(2), this.bitSize);
    }
    hasNext():boolean {
        return this.value.lesser(this.validatorBitSize);
    }
    hasPrevious():boolean {
        return this.value.greater(bigInt.zero);
    }
    public isEquals(anotherIPNum: AbstractIPNum): boolean {
        return this.value.equals(anotherIPNum.value);
    }
    public isLessThan(anotherIPNum: AbstractIPNum): boolean {
        return this.value.lt(anotherIPNum.value);
    }
    public isGreaterThan(anotherIPNum: AbstractIPNum): boolean {
        return this.value.gt(anotherIPNum.value);
    }
    public isLessThanOrEquals(anotherIPNum: AbstractIPNum): boolean {
        return this.value.lesserOrEquals(anotherIPNum.value);
    }
    public isGreaterThanOrEquals(anotherIPNum: AbstractIPNum): boolean {
        return this.value.greaterOrEquals(anotherIPNum.value);
    }
}