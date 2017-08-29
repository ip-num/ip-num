'use strict';
import {BigInteger} from "big-integer";
import {IPNumType} from "../IPNumType";

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

