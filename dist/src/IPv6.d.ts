import { IPNumber } from "./interface/IPNumber";
import { Hexadecatet } from "./Hexadecatet";
import * as bigInt from "big-integer/BigInteger";
import { AbstractIPNum } from "./AbstractIPNum";
import { IPNumType } from "./IPNumType";
import { IPv4 } from "./IPv4";
/**
 * Represents an IPv6 number. A 128 bit number that is used to uniquely identify a device that is part of a computer
 * network that uses the internet protocol for communication.
 *
 * @see https://en.wikipedia.org/wiki/IPv6
 * @see https://www.rfc-editor.org/info/rfc8200
 */
export declare class IPv6 extends AbstractIPNum implements IPNumber {
    /**
     * The decimal value represented by the IPv6 number in BigInteger
     */
    readonly value: bigInt.BigInteger;
    /**
     * The number of bits needed to represents the value of the IPv6 number
     */
    readonly bitSize: number;
    /**
     * The maximum bit size (i.e. binary value) of the IPv6 number in BigInteger
     */
    readonly maximumBitSize: bigInt.BigInteger;
    /**
     * The type of IP number. Value is one of the values of the {@link IPNumType} enum
     * @type {IPNumType} the type of IP number
     */
    readonly type: IPNumType;
    /**
     * An array of {@link Hexadecatet}'s
     *
     * @type {Array} the hexadecatet that makes up the IPv6 number
     */
    readonly hexadecatet: Array<Hexadecatet>;
    /**
     * The string character used to separate the individual hexadecatet when the IPv6 is rendered as strings
     *
     * @type {string} The string character used to separate the individual hexadecatet when rendered as strings
     */
    readonly separator: string;
    /**
     * A convenience method for creating an {@link IPv6} by providing the decimal value of the IP number in BigInteger
     *
     * @param {bigInt.BigInteger} bigIntValue the decimal value of the IP number in BigInteger
     * @returns {IPv6} the IPv6 instance
     */
    static fromBigInteger(bigIntValue: bigInt.BigInteger): IPv6;
    /**
     * A convenience method for creating an {@link IPv6} by providing the IP number in hexadecatet notation. E.g
     * "2001:800:0:0:0:0:0:2002"
     *
     * {@see https://en.wikipedia.org/wiki/IPv6_address#Representation} for more information on hexadecatet notation.
     *
     * @param {string} ipString the IP number in hexadecatet
     * @returns {IPv6} the IPv6 instance
     */
    static fromHexadecimalString(ipString: string): IPv6;
    /**
     * A convenience method for creating an {@link IPv6} from binary string
     *
     * @param {string} ipBinaryString the binary string representing the IPv6 number to be created
     * @returns {IPv6} the IPv6 instance
     */
    static fromBinaryString(ipBinaryString: string): IPv6;
    /**
     * A convenience method for creating an IPv4-Compatible {@link IPv6} Address from an instance of {@link IPv4}
     *
     * @param {IPv4} ipv4 to create an IPv4-Compatible {@link IPv6} Address
     * @returns {IPv6} the IPv4-Compatible {@link IPv6} Address
     */
    static fromIPv4(ipv4: IPv4): IPv6;
    /**
     * A convenience method for creating an IPv4-Compatible {@link IPv6} Address from a IPv4 represented in
     * dot-decimal notation i.e. 127.0.0.1
     *
     * @param {IPv4} ip4DotDecimalString string represented in a dot decimal string
     * @returns {IPv6} the IPv4-Compatible {@link IPv6} Address
     */
    static fromIPv4DotDecimalString(ip4DotDecimalString: string): IPv6;
    /**
     * Constructor for an IPv6 number.
     *
     * @param {string | bigInt.BigInteger} ipValue value to construct an IPv6 from. The given value can either be
     * numeric or string. If a string is given then it needs to be in hexadecatet string notation
     */
    constructor(ipValue: string | bigInt.BigInteger);
    /**
     * A string representation of the IPv6 number.
     *
     * @returns {string} The string representation of IPv6
     */
    toString(): string;
    /**
     * Gets the individual {@link Hexadecatet} that makes up the IPv6 number
     *
     * @returns {Array<Hexadecatet>} The individual {@link Hexadecatet} that makes up the IPv6 number
     */
    getHexadecatet(): Array<Hexadecatet>;
    /**
     * Returns the next IPv6 number
     *
     * @returns {IPv6} the next IPv6 number
     */
    nextIPNumber(): IPv6;
    /**
     * Returns the previous IPv6 number
     *
     * @returns {IPv6} the previous IPv6 number
     */
    previousIPNumber(): IPv6;
    private constructFromBigIntegerValue;
    private constructFromHexadecimalDottedString;
    private binaryStringToHexadecatets;
}
