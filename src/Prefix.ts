import {Validator} from "./Validator";
import {IPv4, IPv4Mask, IPv6, IPv6Mask} from "./IPNumber";
import {intLog2, parseBinaryStringToBigInt} from "./BinaryUtils";
import {IPNumType} from "./IPNumType";
import {binaryStringToHexadecimalString} from "./HexadecimalUtils";
import {Hexadecatet} from "./Hexadecatet";


interface Prefix {
    value: bigint;
    getValue(): bigint;
    merge(): Prefix;
    split(): Prefix;
    toString(): string;
    toRangeSize(): bigint
}

/**
 * Represents the prefix portion in the CIDR notation for representing IP ranges
 *
 * The IPv4 prefix portion represents the mask. It is the number of continuous bits turned on (with value 1)
 * counting from the left side of an 8 bit value.
 *
 * {@see https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing} for more information on CIDR
 */
class IPv4Prefix implements Prefix {
    type: "IPv4" = "IPv4"
    private readonly bitValue: bigint = 32n;
    /**
     * The decimal value of the 8bit number representing the prefix
     */
    value: bigint;

    /**
     * Convenience method for constructing an instance of IPv4 prefix from a decimal number
     *
     * @param {number} rawValue the decimal value to construct the IPv4 prefix from.
     * @returns {IPv4Prefix} the instance of an IPv4 prefix
     */
    static fromNumber(rawValue: bigint):IPv4Prefix {
        return new IPv4Prefix(rawValue);
    };

    static fromRangeSize(rangeSize: bigint) {
        let prefixNumber = rangeSize === (1n) ? 32 : 32 - rangeSizeToPrefix(rangeSize, Validator.IPV4_SIZE);
        return IPv4Prefix.fromNumber(BigInt(prefixNumber))
    };

    /**
     * Constructor for an instance of IPv4 prefix from a decimal number
     *
     * @param {number} rawValue the decimal value to construct the IPv4 prefix from.
     * @returns {IPv4Prefix} the instance of an IPv4 prefix
     */
    constructor(rawValue: bigint) {
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
    public getValue(): bigint {
        return this.value;
    }

    /**
     * Gets the decimal value of the IPv4 prefix as string
     * @returns {string} The decimal value of the IPv4 prefix as string
     */
    public toString(): string {
        return this.value.toString();
    }

    /**
     * Converts the IPv4 prefix to a {@link IPv4Mask}
     *
     * The IPv4 mask is the representation of the prefix in the dot-decimal notation
     *
     * @returns {IPv4Mask} the mask representation of the prefix
     */
    public toMask(): IPv4Mask {
        let onBits = '1'.repeat(Number(this.value));
        let offBits = '0'.repeat(Number(32n - this.value));
        return IPv4Mask.fromDecimalDottedString(this.toDecimalNotation(`${onBits}${offBits}`));
    }

    /**
     * Returns the size (number of IP numbers) of range of this prefix
     *
     * @return {BigInteger} the size (number of IP numbers) of range of this prefix
     */
    public toRangeSize(): bigint {
        /**
         * Using bitwise shift operation this will be
         * 1 << (this.bitValue - this.prefix.getValue())
         * Since left shift a number by x is equivalent to multiplying the number by the power x raised to 2
         * 2 << 4 = 2 * (2 raised to 4)
         */
        return BigInt(Math.pow(2, Number(this.bitValue - (this.getValue()))));
        //return bigInt(2).pow(this.bitValue.minus(bigInt(this.getValue())));
    }

    /**
     * Returns a prefix for when this prefix is merged
     * with another prefix of the same size
     */
    merge(): IPv4Prefix {
        return new IPv4Prefix(this.value - 1n);
    }

    /**
     * Returns a prefix for when this prefix is split
     * into two equal halves
     */
    split(): IPv4Prefix {
        return new IPv4Prefix(this.value + 1n);
    }

    private toDecimalNotation(bits:string): string {
        return `${parseBinaryStringToBigInt(bits.substr(0,8))}.${parseBinaryStringToBigInt(bits.substr(8,8))}.${parseBinaryStringToBigInt(bits.substr(16,8))}.${parseBinaryStringToBigInt(bits.substr(24,8))}`
    }
}

/**
 * Represents the prefix portion in the CIDR notation for representing IP ranges
 *
 * The IPv6 prefix portion represents the mask. It is the number of continuous bits turned on (with value 1)
 * counting from the left side of an 128 bit value.
 *
 * {@see https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing} for more information on CIDR
 */
class IPv6Prefix implements Prefix {
    type: "IPv6" = "IPv6"
    private readonly bitValue: bigint = 128n;
    /**
     * The decimal value of the 16bit number representing the prefix
     */
    value: bigint;

    /**
     * Convenience method for constructing an instance of IPv46 prefix from a decimal number
     *
     * @param {number} rawValue the decimal value to construct the IPv6 prefix from.
     * @returns {IPv4Prefix} the instance of an IPv6 prefix
     */
    static fromNumber(rawValue: bigint):IPv6Prefix {
        return new IPv6Prefix(rawValue);
    };

    static fromRangeSize(rangeSize: bigint): IPv6Prefix {
        let prefixNumber = rangeSize === (1n) ? 128 : 128 - rangeSizeToPrefix(rangeSize, Validator.IPV6_SIZE);
        return IPv6Prefix.fromNumber(BigInt(prefixNumber))
    }

    /**
     * Constructor for an instance of IPv6 prefix from a decimal number
     *
     * @param {number} rawValue the decimal value to construct the IPv6 prefix from.
     * @returns {IPv4Prefix} the instance of an IPv6 prefix
     */
    constructor(rawValue: bigint) {
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
    public getValue(): bigint {
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
     * Converts the IPv6 prefix to a {@link IPv6Mask}
     *
     * The IPv6 mask is the representation of the prefix in 8 groups of 16 bit values represented in hexadecimal
     *
     * @returns {IPv6Mask} the mask representation of the prefix
     */
    public toMask(): IPv6Mask {
        let onBits = '1'.repeat(Number(this.value));
        let offBits = '0'.repeat(128 - Number(this.value));
        return IPv6Mask.fromHexadecimalString(this.toHexadecatetNotation(`${onBits}${offBits}`));
    }

    /**
     * Returns the size (number of IP numbers) of range of this prefix
     *
     * @return {BigInteger} the size (number of IP numbers) of range of this prefix
     */
    public toRangeSize(): bigint {
        /**
         * Using bitwise shift operation this will be
         * 1 << (this.bitValue - this.prefix.getValue())
         * Since left shift a number by x is equivalent to multiplying the number by the power x raised to 2
         * 2 << 4 = 2 * (2 raised to 4)
         */
        return BigInt(Math.pow(2, Number(this.bitValue - (this.getValue()))));
        //return bigInt(2).pow(this.bitValue - (this.getValue()));
    }

    /**
     * Returns a prefix for when this prefix is merged
     * with another prefix of the same size
     */
    merge(): IPv6Prefix {
        return new IPv6Prefix(this.value - 1n);
    }

    /**
     * Returns a prefix for when this prefix is split
     * into two equal halves
     */
    split(): IPv6Prefix {
        return new IPv6Prefix(this.value + 1n);
    }

    private toHexadecatetNotation(bits:string): string {
        let binaryStrings: string[] = bits.match(/.{1,16}/g)!;
        let hexadecimalStrings: Hexadecatet[] = binaryStrings.map((binaryString) => {
            return Hexadecatet.fromString(binaryStringToHexadecimalString(binaryString));
        });
        return hexadecimalStrings.map((value) => { return value.toString()}).join(":");
    }
}

function rangeSizeToPrefix(rangeSize: bigint,
                           rangeMaxSize: bigint): number {
    let ipType = rangeMaxSize > (Validator.IPV4_SIZE) ? "IPv6" : "IPv4";
    if (rangeSize > (rangeMaxSize) || rangeSize === (0n)) {
        throw new Error(Validator.invalidIPRangeSizeMessage.replace("$iptype", ipType));
    }

    try {
        return intLog2(rangeSize);
    } catch (e) {
        throw new Error(Validator.invalidIPRangeSizeForCidrMessage);
    }
}


/**
 * Check is the given Prefix is an {@link IPv4Prefix} or not
 * @param prefix the IP prefix to check if it is IPv4Prefix.
 */
function isIPv4Prefix(prefix: IPv4Prefix | IPv6Prefix): prefix is IPv4Prefix {
    return prefix.type === "IPv4";
}

/**
 * Check is the given Prefix is an {@link IPv4Prefix} or not
 * @param prefix the IP prefix to check if it is IPv4Prefix.
 */
function isIPv6Prefix(prefix: IPv4Prefix | IPv6Prefix): prefix is IPv6Prefix {
    return prefix.type === "IPv6";
}

export {Prefix, IPv4Prefix, IPv6Prefix, isIPv4Prefix}
