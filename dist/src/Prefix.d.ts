import { IPv4SubnetMask } from "./SubnetMask";
import { IPv6SubnetMask } from "./SubnetMask";
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
declare class IPv4Prefix implements Prefix {
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
     * @returns {string} he decimal value of the IPv4 prefix as string
     */
    toString(): string;
    /**
     * Converts the IPv4 prefix to a {@link IPv4SubnetMask}
     *
     * The IPv4 Subnet mask is the representation of the prefix in the dot-decimal notation
     *
     * @returns {IPv4SubnetMask} the subnet mask representation of the prefix
     */
    toSubnetMask(): IPv4SubnetMask;
    private toDecimalNotation(bits);
}
/**
 * Represents the prefix portion in the CIDR notation for representing IP ranges
 *
 * The IPv6 prefix portion represents the subnet mask. It is the number of continuous bits turned on (with value 1)
 * counting from the left side of an 128 bit value.
 *
 * {@see https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing} for more information on CIDR
 */
declare class IPv6Prefix implements Prefix {
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
     * Converts the IPv6 prefix to a {@link IPv6SubnetMask}
     *
     * The IPv6 Subnet mask is the representation of the prefix in 8 groups of 16 bit values represented in hexadecimal
     *
     * @returns {IPv6SubnetMask} the subnet mask representation of the prefix
     */
    toSubnetMask(): IPv6SubnetMask;
    private toHexadecatetNotation(bits);
}
export { Prefix, IPv4Prefix, IPv6Prefix };
