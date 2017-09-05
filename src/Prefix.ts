import {Validator} from "./Validator";
import {IPv4Subnet} from "./Subnet";
import {parseBinaryStringToBigInteger} from "./BinaryUtils";
import {IPNumType} from "./IPNumType";
import {IPv6Subnet} from "./Subnet";
import {binaryStringToHexadecimalString} from "./HexadecimalUtils";
import {Hexadecatet} from "./Hexadecatet";

class IPv4Prefix {
    value: number;

    static fromNumber(rawValue:number):IPv4Prefix {
        return new IPv4Prefix(rawValue);
    };

    constructor(rawValue: number) {
        let isValid: boolean;
        let message: string[];
        [isValid, message] = Validator.isValidPrefixValue(rawValue, IPNumType.IPv4);
        if (!isValid) {
            throw new Error(message.filter(msg => {return msg !== '';}).toString());
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
        return IPv4Subnet.fromString(this.toDecimalNotation(`${onBits}${offBits}`));
    }

    private toDecimalNotation(bits:string): string {
        return `${parseBinaryStringToBigInteger(bits.substr(0,8))}.${parseBinaryStringToBigInteger(bits.substr(8,8))}.${parseBinaryStringToBigInteger(bits.substr(16,8))}.${parseBinaryStringToBigInteger(bits.substr(24,8))}`
    }
}

class IPv6Prefix {
    value: number;

    static fromNumber(rawValue:number):IPv6Prefix {
        return new IPv6Prefix(rawValue);
    };

    constructor(rawValue: number) {
        let isValid: boolean;
        let message: string[];
        [isValid, message] = Validator.isValidPrefixValue(rawValue, IPNumType.IPv6);
        if (!isValid) {
            throw new Error(message.filter(msg => {return msg !== '';}).toString());
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
        return IPv6Subnet.fromString(this.toHexadecatetNotation(`${onBits}${offBits}`));
    }

    private toHexadecatetNotation(bits:string): string {
        let binaryStrings: string[] = bits.match(/.{1,16}/g)!;
        let hexadecimalStrings: Hexadecatet[] = binaryStrings.map((binaryString) => {
            return Hexadecatet.fromString(binaryStringToHexadecimalString(binaryString));
        });
        return hexadecimalStrings.map((value) => { return value.toString()}).join(":");
    }
}

export {IPv4Prefix, IPv6Prefix}