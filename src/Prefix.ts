'use strict';

import {Validator} from "./Validator";
import {Subnet} from "./Subnet";
import {binaryToDecimal} from "./BinaryUtils";

/**
 * TODO
 * maybe add a constuctor to create using string...eg IPv4Prefix.of("/24")
 */
class IPv4Prefix {
    value: number;

    static of(rawValue:number):IPv4Prefix {
        return new IPv4Prefix(rawValue);
    };

    constructor(rawValue: number) {
        let isValid: boolean;
        let message: string;
        [isValid, message] = Validator.isValidPrefixValue(rawValue);
        if (!isValid) {
            throw new Error(message);
        }
        this.value = rawValue;
    }

    public getValue(): number {
        return this.value;
    }

    public toString(): string {
        return this.value.toString();
    }

    public toSubnet(): Subnet {
        let onBits = '1'.repeat(this.value);
        let offBits = '0'.repeat(32 - this.value);
        return Subnet.of(this.toDecimalNotation(`${onBits}${offBits}`));
    }

    private toDecimalNotation(bits:string): string {
        return `${binaryToDecimal(bits.substr(0,8))}.${binaryToDecimal(bits.substr(8,8))}.${binaryToDecimal(bits.substr(16,8))}.${binaryToDecimal(bits.substr(24,8))}`
    }
}

export {IPv4Prefix}