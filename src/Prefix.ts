import {Validator} from "./Validator";
import {IPv4SubnetMask} from "./IPNumber";
import {parseBinaryStringToBigInteger} from "./BinaryUtils";
import {IPNumType} from "./IPNumType";
import {IPv6SubnetMask} from "./IPNumber";
import {binaryStringToHexadecimalString} from "./HexadecimalUtils";
import {Hexadecatet} from "./Hexadecatet";


interface Prefix {
    value: number;
    getValue(): number;
}

/**
 * Represents the prefix portion in the CIDR notation for representing IP ranges
 *
 * The IPv4 prefix portion represents the subnet mask. It is the number of continuous bits turned on (with value 1)
 * counting from the left side of an 8 bit value.
 *
 * {@see https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing} for more information on CIDR
 */
class IPv4Prefix implements Prefix {
    /**
     * The decimal value of the 8bit number representing the prefix
     */
    value: number;

    /**
     * Convenience method for constructing an instance of IPv4 prefix from a decimal number
     *
     * @param {number} rawValue the decimal value to construct the IPv4 prefix from.
     * @returns {IPv4Prefix} the instance of an IPv4 prefix
     */
    static fromNumber(rawValue:number):IPv4Prefix {
        return new IPv4Prefix(rawValue);
    };

    /**
     * Constructor for an instance of IPv4 prefix from a decimal number
     *
     * @param {number} rawValue the decimal value to construct the IPv4 prefix from.
     * @returns {IPv4Prefix} the instance of an IPv4 prefix
     */
    constructor(rawValue: number) {
        let isValid: boolean;
        let message: string[];
        [isValid, message] = Validator.isValidPrefixValue(rawValue, IPNumType.IPv4);
        if (!isValid) {
            throw new Error(message.filter(msg => {return msg !== '';}).toString());
        }
        this.value = rawValue;
    }

    /**
     * Gets the decimal value of the IPv4 prefix
     *
     * @returns {number} the decimal value of the IPv4 prefix
     */
    public getValue(): number {
        return this.value;
    }

    /**
     * Gets the decimal value of the IPv4 prefix as string
     * @returns {string} he decimal value of the IPv4 prefix as string
     */
    public toString(): string {
        return this.value.toString();
    }

    /**
     * Converts the IPv4 prefix to a {@link IPv4SubnetMask}
     *
     * The IPv4 Subnet mask is the representation of the prefix in the dot-decimal notation
     *
     * @returns {IPv4SubnetMask} the subnet mask representation of the prefix
     */
    public toSubnetMask(): IPv4SubnetMask {
        let onBits = '1'.repeat(this.value);
        let offBits = '0'.repeat(32 - this.value);
        return IPv4SubnetMask.fromDecimalDottedString(this.toDecimalNotation(`${onBits}${offBits}`));
    }

    private toDecimalNotation(bits:string): string {
        return `${parseBinaryStringToBigInteger(bits.substr(0,8))}.${parseBinaryStringToBigInteger(bits.substr(8,8))}.${parseBinaryStringToBigInteger(bits.substr(16,8))}.${parseBinaryStringToBigInteger(bits.substr(24,8))}`
    }
}

/**
 * Represents the prefix portion in the CIDR notation for representing IP ranges
 *
 * The IPv6 prefix portion represents the subnet mask. It is the number of continuous bits turned on (with value 1)
 * counting from the left side of an 128 bit value.
 *
 * {@see https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing} for more information on CIDR
 */
class IPv6Prefix implements Prefix {
    /**
     * The decimal value of the 16bit number representing the prefix
     */
    value: number;

    /**
     * Convenience method for constructing an instance of IPv46 prefix from a decimal number
     *
     * @param {number} rawValue the decimal value to construct the IPv6 prefix from.
     * @returns {IPv4Prefix} the instance of an IPv6 prefix
     */
    static fromNumber(rawValue:number):IPv6Prefix {
        return new IPv6Prefix(rawValue);
    };

    /**
     * Constructor for an instance of IPv6 prefix from a decimal number
     *
     * @param {number} rawValue the decimal value to construct the IPv6 prefix from.
     * @returns {IPv4Prefix} the instance of an IPv6 prefix
     */
    constructor(rawValue: number) {
        let isValid: boolean;
        let message: string[];
        [isValid, message] = Validator.isValidPrefixValue(rawValue, IPNumType.IPv6);
        if (!isValid) {
            throw new Error(message.filter(msg => {return msg !== '';}).toString());
        }
        this.value = rawValue;
    }

    /**
     * Gets the decimal value of the IPv6 prefix
     *
     * @returns {number} the decimal value of the IPv6 prefix
     */
    public getValue(): number {
        return this.value;
    }

    /**
     * Gets the decimal value of the IPv4 prefix as string
     * @returns {string} he decimal value of the IPv4 prefix as string
     */
    public toString(): string {
        return this.value.toString();
    }

    /**
     * Converts the IPv6 prefix to a {@link IPv6SubnetMask}
     *
     * The IPv6 Subnet mask is the representation of the prefix in 8 groups of 16 bit values represented in hexadecimal
     *
     * @returns {IPv6SubnetMask} the subnet mask representation of the prefix
     */
    public toSubnetMask(): IPv6SubnetMask {
        let onBits = '1'.repeat(this.value);
        let offBits = '0'.repeat(128 - this.value);
        return IPv6SubnetMask.fromHexadecimalString(this.toHexadecatetNotation(`${onBits}${offBits}`));
    }

    private toHexadecatetNotation(bits:string): string {
        let binaryStrings: string[] = bits.match(/.{1,16}/g)!;
        let hexadecimalStrings: Hexadecatet[] = binaryStrings.map((binaryString) => {
            return Hexadecatet.fromString(binaryStringToHexadecimalString(binaryString));
        });
        return hexadecimalStrings.map((value) => { return value.toString()}).join(":");
    }
}

export {Prefix, IPv4Prefix, IPv6Prefix}