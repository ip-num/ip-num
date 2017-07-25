

import {Validator} from "./Validator";
import * as bigInt from "big-integer"
export class Hexadecatet {
    private readonly value: number;

    static of(rawValue:string | number):Hexadecatet {
        return new Hexadecatet(rawValue);
    };

    constructor(givenValue: string | number) {
        let hexadecatetValue: number;
        if (typeof givenValue === 'string') {
            hexadecatetValue = parseInt(givenValue);
        } else {
            hexadecatetValue = givenValue;
        }

        let [isValid, message] = Validator.isValidIPv6Hexadecatet(bigInt(hexadecatetValue));

        if (!isValid) {
            throw Error(message);
        }
        this.value = hexadecatetValue;
    }

    public getValue():number {
        return this.value;
    }

    public toString(): string {
        return this.value.toString();
    }
}