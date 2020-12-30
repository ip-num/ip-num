import { IPv4Mask, IPv6Mask } from "./IPNumber";
import * as bigInt from "big-integer";
interface Prefix {
    value: number;
    getValue(): number;
    merge(): Prefix;
    split(): Prefix;
}
/**
 * Represents the prefix portion in the CIDR notation for representing IP ranges
 *
 * The IPv4 prefix portion represents the mask. It is the number of continuous bits turned on (with value 1)
 * counting from the left side of an 8 bit value.
 *
 * {@see https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing} for more information on CIDR
 */
declare class IPv4Prefix implements Prefix {
    type: "IPv4";
    private readonly bitValue;
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
    static fromNumber(rawValue: number): IPv4Prefix;
    static fromRangeSize(rangeSize: bigInt.BigInteger): IPv4Prefix;
    /**
     * Constructor for an instance of IPv4 prefix from a decimal number
     *
     * @param {number} rawValue the decimal value to construct the IPv4 prefix from.
     * @returns {IPv4Prefix} the instance of an IPv4 prefix
     */
    constructor(rawValue: number);
    /**
     * Gets the decimal value of the IPv4 prefix
     *
     * @returns {number} the decimal value of the IPv4 prefix
     */
    getValue(): number;
    /**
     * Gets the decimal value of the IPv4 prefix as string
     * @returns {string} The decimal value of the IPv4 prefix as string
     */
    toString(): string;
    /**
     * Converts the IPv4 prefix to a {@link IPv4Mask}
     *
     * The IPv4 mask is the representation of the prefix in the dot-decimal notation
     *
     * @returns {IPv4Mask} the mask representation of the prefix
     */
    toMask(): IPv4Mask;
    /**
     * Returns the size (number of IP numbers) of range of this prefix
     *
     * @return {BigInteger} the size (number of IP numbers) of range of this prefix
     */
    toRangeSize(): bigInt.BigInteger;
    /**
     * Returns a prefix for when this prefix is merged
     * with another prefix of the same size
     */
    merge(): IPv4Prefix;
    /**
     * Returns a prefix for when this prefix is split
     * into two equal halves
     */
    split(): IPv4Prefix;
    private toDecimalNotation;
}
/**
 * Represents the prefix portion in the CIDR notation for representing IP ranges
 *
 * The IPv6 prefix portion represents the mask. It is the number of continuous bits turned on (with value 1)
 * counting from the left side of an 128 bit value.
 *
 * {@see https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing} for more information on CIDR
 */
declare class IPv6Prefix implements Prefix {
    type: "IPv6";
    private readonly bitValue;
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
    static fromNumber(rawValue: number): IPv6Prefix;
    static fromRangeSize(rangeSize: bigInt.BigInteger): IPv6Prefix;
    /**
     * Constructor for an instance of IPv6 prefix from a decimal number
     *
     * @param {number} rawValue the decimal value to construct the IPv6 prefix from.
     * @returns {IPv4Prefix} the instance of an IPv6 prefix
     */
    constructor(rawValue: number);
    /**
     * Gets the decimal value of the IPv6 prefix
     *
     * @returns {number} the decimal value of the IPv6 prefix
     */
    getValue(): number;
    /**
     * Gets the decimal value of the IPv4 prefix as string
     * @returns {string} he decimal value of the IPv4 prefix as string
     */
    toString(): string;
    /**
     * Converts the IPv6 prefix to a {@link IPv6Mask}
     *
     * The IPv6 mask is the representation of the prefix in 8 groups of 16 bit values represented in hexadecimal
     *
     * @returns {IPv6Mask} the mask representation of the prefix
     */
    toMask(): IPv6Mask;
    /**
     * Returns the size (number of IP numbers) of range of this prefix
     *
     * @return {BigInteger} the size (number of IP numbers) of range of this prefix
     */
    toRangeSize(): bigInt.BigInteger;
    /**
     * Returns a prefix for when this prefix is merged
     * with another prefix of the same size
     */
    merge(): IPv6Prefix;
    /**
     * Returns a prefix for when this prefix is split
     * into two equal halves
     */
    split(): IPv6Prefix;
    private toHexadecatetNotation;
}
/**
 * Check is the given Prefix is an {@link IPv4Prefix} or not
 * @param prefix the IP prefix to check if it is IPv4Prefix.
 */
declare function isIPv4Prefix(prefix: IPv4Prefix | IPv6Prefix): prefix is IPv4Prefix;
export { Prefix, IPv4Prefix, IPv6Prefix, isIPv4Prefix };
