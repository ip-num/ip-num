'use strict';

import {Validator} from "./Validator"
import bigInt = require("big-integer");
export class Octet {
    private readonly value: number;

    static of(rawValue:string | number):Octet {
        return new Octet(rawValue);
    };

    constructor(givenValue: string | number) {
        let octetValue: number;
        if (typeof givenValue === 'string') {
            octetValue = parseInt(givenValue);
        } else {
            octetValue = givenValue;
        }

        if (!Validator.isValidIPv4Octet(bigInt(octetValue))) {
            throw Error(Validator.invalidOctetRangeMessage);
        }
        this.value = octetValue;
    }

    public getValue():number {
        return this.value;
    }

    public toString(): string {
        return this.value.toString();
    }
}