import { Octet } from "./Octet";
import { IPNumber } from "./interface/IPNumber";
import * as bigInt from "big-integer";
import { AbstractIPNum } from "./AbstractIPNum";
import { IPNumType } from "./IPNumType";
import { IPv6 } from "./IPv6";
/**
 * Represents an IPv4 number. A 32 bit number that is used to uniquely identify a device that is part of a computer
 * network that uses the internet protocol for communication.
 *
 * @see https://en.wikipedia.org/wiki/IPv4
 * @see https://www.rfc-editor.org/info/rfc791
 */
export declare class IPv4 extends AbstractIPNum implements IPNumber {
    /**
     * The decimal value represented by the IPv4 number in BigInteger
     */
    readonly value: bigInt.BigInteger;
    /**
     * The number of bits needed to represents the value of the IPv4 number
     */
    readonly bitSize: number;
    /**
     * The maximum bit size (i.e. binary value) of the IPv4 number in BigInteger
     */
    readonly maximumBitSize: bigInt.BigInteger;
    /**
     * The type of IP number. Value is one of the values of the {@link IPNumType} enum
     * @type {IPNumType} the type of IP number
     */
    readonly type: IPNumType;
    /**
     * An array of {@link Octet}'s
     *
     * @type {Array} the octets that makes up the IPv4 number
     */
    readonly octets: Array<Octet>;
    /**
     * The string character used to separate the individual octets when the IPv4 is rendered as strings
     *
     * @type {string} The string character used to separate the individual octets when rendered as strings
     */
    readonly separator: string;
    /**
     * A convenience method for creating an {@link IPv4} by providing the decimal value of the IP number in BigInteger
     *
     * @param {bigInt.BigInteger} bigIntValue the decimal value of the IP number in BigInteger
     * @returns {IPv4} the IPv4 instance
     */
    static fromBigInteger(bigIntValue: bigInt.BigInteger): IPv4;
    /**
     * A convenience method for creating an {@link IPv4} by providing the IP number in dot-decimal notation. E.g
     * "10.1.1.10"
     *
     * {@see https://en.wikipedia.org/wiki/Dot-decimal_notation} for more information on dot-decimal notation.
     *
     * @param {string} ipString the IP number in dot-decimal notation
     * @returns {IPv4} the IPv4 instance
     */
    static fromDecimalDottedString(ipString: string): IPv4;
    /**
     * A convenience method for creating an {@link IPv4} from binary string
     *
     * @param {string} ipBinaryString the binary string representing the IPv4 number to be created
     * @returns {IPv4} the IPv4 instance
     */
    static fromBinaryString(ipBinaryString: string): IPv4;
    /**
     * Constructor for an IPv4 number.
     *
     * @param {string | bigInt.BigInteger} ipValue value to construct an IPv4 from. The given value can either be
     * numeric or string. If a string is given then it needs to be in dot-decimal notation
     */
    constructor(ipValue: string | bigInt.BigInteger);
    /**
     * A string representation of the IPv4 number. The string representation is in dot-decimal notation
     *
     * @returns {string} The string representation in dot-decimal notation
     */
    toString(): string;
    /**
     * Gets the individual {@link Octet} that makes up the IPv4 number
     *
     * @returns {Array<Octet>} The individual {@link Octet} that makes up the IPv4 number
     */
    getOctets(): Array<Octet>;
    /**
     * Returns the next IPv4 number
     *
     * @returns {IPv4} the next IPv4 number
     */
    nextIPNumber(): IPv4;
    /**
     * Returns the previous IPv4 number
     *
     * @returns {IPv4} the previous IPv4 number
     */
    previousIPNumber(): IPv4;
    /**
     * Returns this IPv4 number as a IPv4-Mapped IPv6 Address
     *
     * The IPv4-Mapped IPv6 Address allows an IPv4 number to be embedded within an IPv6 number
     *
     * {@see https://tools.ietf.org/html/rfc4291#section-2.5.5} for more information on the IPv4-Mapped IPv6 Address
     *
     * @returns {IPv6} an IPv6 number with the IPv4 embedded within it
     */
    toIPv4MappedIPv6(): IPv6;
    private constructFromDecimalDottedString;
    private constructFromBigIntegerValue;
    private binaryStringToDecimalOctets;
}
