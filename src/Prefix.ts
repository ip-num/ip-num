'use strict';

import {Validator} from "./Validator";
import {IPv4Subnet} from "./Subnet";
import {parseBinaryStringToBigInteger} from "./BinaryUtils";
import {InetNumType} from "./InetNumType";
import {IPv6Subnet} from "./Subnet";
import {binaryStringToHexadecimalString} from "./HexadecimalUtils";
import {Hexadecatet} from "./Hexadecatet";

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
        [isValid, message] = Validator.isValidPrefixValue(rawValue, InetNumType.IPv4);
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

    public toSubnet(): IPv4Subnet {
        let onBits = '1'.repeat(this.value);
        let offBits = '0'.repeat(32 - this.value);
        return IPv4Subnet.of(this.toDecimalNotation(`${onBits}${offBits}`));
    }

    private toDecimalNotation(bits:string): string {
        return `${parseBinaryStringToBigInteger(bits.substr(0,8))}.${parseBinaryStringToBigInteger(bits.substr(8,8))}.${parseBinaryStringToBigInteger(bits.substr(16,8))}.${parseBinaryStringToBigInteger(bits.substr(24,8))}`
    }
}

class IPv6Prefix {
    value: number;

    static of(rawValue:number):IPv6Prefix {
        return new IPv6Prefix(rawValue);
    };

    constructor(rawValue: number) {
        let isValid: boolean;
        let message: string;
        [isValid, message] = Validator.isValidPrefixValue(rawValue, InetNumType.IPv6);
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

    public toSubnet(): IPv6Subnet {
        let onBits = '1'.repeat(this.value);
        let offBits = '0'.repeat(128 - this.value);
        return IPv6Subnet.of(this.toHexadecatetNotation(`${onBits}${offBits}`));
    }

    private toHexadecatetNotation(bits:string): string {
        let binaryStrings: string[] = bits.match(/.{1,16}/g)!;
        let hexadecimalStrings: Hexadecatet[] = binaryStrings.map((binaryString) => {
            return Hexadecatet.of(binaryStringToHexadecimalString(binaryString));
        });
        return hexadecimalStrings.map((value) => { return value.toString()}).join(":");
    }
}

export {IPv4Prefix, IPv6Prefix}