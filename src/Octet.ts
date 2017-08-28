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
        let [isValid, message] = Validator.isValidIPv4Octet(bigInt(octetValue));
        if (!isValid) {
            throw Error(message.filter(msg => {return msg !== '';}).toString());
        }
        this.value = octetValue;
    }

    public getValue():number {
        return this.value;
    }

    public toString(): string {
        return this.value.toString(10);
    }
}