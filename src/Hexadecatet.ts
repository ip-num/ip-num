import {Validator} from "./Validator";
import * as bigInt from "big-integer"

export class Hexadecatet {
    private readonly value: number;

    static fromString(rawValue:string):Hexadecatet {
        return new Hexadecatet(rawValue);
    };

    static fromNumber(rawValue:number):Hexadecatet {
        return new Hexadecatet(rawValue);
    };

    constructor(givenValue: string | number) {
        let hexadecatetValue: number;
        if (typeof givenValue === 'string') {
            hexadecatetValue = parseInt(givenValue, 16);
        } else {
            hexadecatetValue = parseInt(String(givenValue), 16);
        }

        let [isValid, message] = Validator.isValidIPv6Hexadecatet(bigInt(hexadecatetValue));

        if (!isValid) {
            throw Error(message.filter(msg => {return msg !== '';}).toString());
        }
        this.value = hexadecatetValue;
    }

    public getValue():number {
        return this.value;
    }

    public toString(): string {
        return this.value.toString(16);
    }
}