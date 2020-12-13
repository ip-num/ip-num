import { Octet } from "./Octet";
import * as bigInt from "big-integer";
import { IPNumType } from "./IPNumType";
import { Hexadecatet } from "./Hexadecatet";
/**
 * Provides the implementation of functionality that are common
 * to {@link IPv4}, {@link IPv6}, {@link IPv4Mask} and {@link IPv6Mask}
 */
export declare abstract class AbstractIPNum {
    /**
     * The decimal value represented by the IP number in BigInteger
     */
    abstract readonly value: bigInt.BigInteger;
    /**
     * The number of bits needed to represents the value of the IP number
     */
    abstract readonly bitSize: number;
    /**
     * The maximum bit size (i.e. binary value) of the IP number in BigInteger
     */
    abstract readonly maximumBitSize: bigInt.BigInteger;
    abstract nextIPNumber(): AbstractIPNum;
    abstract previousIPNumber(): AbstractIPNum;
    /**
     * Gets the numeric value of an IP number as {@link BigInteger}
     *
     * @returns {bigInt.BigInteger} the numeric value of an IP number.
     */
    getValue(): bigInt.BigInteger;
    /**
     * Gets the binary string representation of an IP number.
     *
     * @returns {string} the string binary representation.
     */
    toBinaryString(): string;
    /**
     * Checks if an IP number has a value greater than the present value
     * @returns {boolean} true, if there is a value greater than the present value. Returns false otherwise.
     */
    hasNext(): boolean;
    /**
     * Checks if an IP number has a value lesser than the present value
     * @returns {boolean} true, if there is a value lesser than the present value. Returns false otherwise.
     */
    hasPrevious(): boolean;
    /**
     * Checks if the given IP number, is equals to the current IP number
     *
     * @param {AbstractIPNum} anotherIPNum the other IP number to compare with
     * @returns {boolean} true if the given IP number is equals
     */
    isEquals(anotherIPNum: AbstractIPNum): boolean;
    /**
     * Checks if the given IP number is lesser than this current IP number
     *
     * @param {AbstractIPNum} anotherIPNum the other IP number to compare with
     * @returns {boolean} true if the given IP number is less than this current one. False otherwise.
     */
    isLessThan(anotherIPNum: AbstractIPNum): boolean;
    /**
     * Checks if the given IP number is greater than this current IP number
     *
     * @param {AbstractIPNum} anotherIPNum the other IP number to compare with
     * @returns {boolean} true if the given IP number is greater than this current one. False otherwise.
     */
    isGreaterThan(anotherIPNum: AbstractIPNum): boolean;
    /**
     * Checks if the given IP number is less than or equals to this current IP number
     *
     * @param {AbstractIPNum} anotherIPNum the other IP number to compare with
     * @returns {boolean} true if the given IP number is less than or equals to this current one. False otherwise.
     */
    isLessThanOrEquals(anotherIPNum: AbstractIPNum): boolean;
    /**
     * Checks if the given IP number is greater than or equals to this current IP number
     *
     * @param {AbstractIPNum} anotherIPNum the other IP number to compare with
     * @returns {boolean} {boolean} true if the given IP number is greater than or equals to this current one. False
     * otherwise.
     */
    isGreaterThanOrEquals(anotherIPNum: AbstractIPNum): boolean;
}
/**
 * Represents an IPv4 number. A 32 bit number that is used to uniquely identify a device that is part of a computer
 * network that uses the internet protocol for communication.
 *
 * @see https://en.wikipedia.org/wiki/IPv4
 * @see https://www.rfc-editor.org/info/rfc791
 */
export declare class IPv4 extends AbstractIPNum {
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
     * Alias for IPv4.fromDecimalDottedString.
     *
     * @param {string} ipString the IP number in dot-decimal notation
     * @returns {IPv4} the IPv4 instance
     */
    static fromString(ipString: string): IPv4;
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
/**
 * Represents an Autonomous System Number. Which is a number that is used to identify
 * a group of IP addresses with a common, clearly defined routing policy.
 *
 * @see https://en.wikipedia.org/wiki/Autonomous_system_(Internet)
 * @see https://tools.ietf.org/html/rfc5396
 */
export declare class Asn extends AbstractIPNum {
    /**
     * The decimal value represented by the ASN number in BigInteger
     */
    readonly value: bigInt.BigInteger;
    /**
     * The number of bits needed to represents the value of the ASN number
     */
    bitSize: number;
    /**
     * The maximum bit size (i.e. binary value) of the ASN number in BigInteger
     */
    maximumBitSize: bigInt.BigInteger;
    type: IPNumType;
    private static AS_PREFIX;
    /**
     * A convenience method for creating an instance of {@link Asn} from a string
     *
     * The given string can be in asplain, asdot or asdot+ representation format.
     * {@see https://tools.ietf.org/html/rfc5396} for more information on
     * the different ASN string representation
     *
     * @param {string} rawValue the asn string. In either asplain, asdot or asdot+ format
     * @returns {Asn} the constructed ASN instance
     */
    static fromString(rawValue: string): Asn;
    /**
     * A convenience method for creating an instance of {@link Asn} from a numeric value
     *
     * @param {number} rawValue the asn numeric value
     * @returns {Asn} the constructed ASN instance
     */
    static fromNumber(rawValue: number): Asn;
    /**
     * A convenience method for creating an instance of {@link Asn} from a binary string
     *
     * @param {string} binaryString to create an ASN instance from
     * @returns {Asn} the constructed ASN instance
     */
    static fromBinaryString(binaryString: string): Asn;
    /**
     * Constructor for an instance of {@link ASN}
     *
     * @param {string | number} rawValue value to construct an ASN from. The given value can either be numeric or
     * string. If in string then it can be in asplain, asdot or asdot+ string representation format
     */
    constructor(rawValue: string | number);
    /**
     * A string representation where the asn value is prefixed by "ASN". For example "AS65526"
     *
     * @returns {string} A string representation where the asn value is prefixed by "ASN"
     */
    toString(): string;
    /**
     * A string representation where the ASN numeric value of is represented as a string. For example "65526"
     *
     * @returns {string} A string representation where the ASN numeric value of is represented as a string
     */
    toASPlain(): string;
    /**
     * A string representation where the ASN value is represented using the asplain notation if the ASN value is
     * less than 65536 and uses asdot+ notation when the value is greater than 65536.
     *
     * For example 65526 will be represented as "65526" while 65546 will be represented as "1.10"
     *
     *
     * @returns {string} A string representation of the ASN in either asplain or asdot+ notation depending on
     * whether the numeric value of the ASN number is greater than 65526 or not.
     */
    toASDot(): string;
    /**
     * A string representation where the ASN value is represented using the asdot+ notation
     *
     * @returns {string} A string representation where the ASN value is represented using the asdot+ notation
     *
     */
    toASDotPlus(): string;
    /**
     * Converts the ASN value to binary numbers represented with strings
     *
     * @returns {string} a binary string representation of the value of the ASN number
     */
    toBinaryString(): string;
    /**
     * Checks if the ASN value is 16bit
     *
     * @returns {boolean} true if the ASN is a 16bit value. False otherwise.
     */
    is16Bit(): boolean;
    /**
     * Checks if the ASN value is 32bit
     *
     * @returns {boolean} true if the ASN is a 32bit value. False otherwise.
     */
    is32Bit(): boolean;
    /**
     * Returns the next ASN number
     *
     * @returns {AbstractIPNum} the next ASN number
     */
    nextIPNumber(): AbstractIPNum;
    /**
     * Returns the previous ASN number
     *
     * @returns {AbstractIPNum} the previous ASN number
     */
    previousIPNumber(): Asn;
    private static startWithASprefix;
    private parseFromDotNotation;
}
/**
 * Represents an IPv6 number. A 128 bit number that is used to uniquely identify a device that is part of a computer
 * network that uses the internet protocol for communication.
 *
 * @see https://en.wikipedia.org/wiki/IPv6
 * @see https://www.rfc-editor.org/info/rfc8200
 */
export declare class IPv6 extends AbstractIPNum {
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
     * Alias for IPv6.fromHexadecimalString
     *
     * @param {string} ipString the IP number in hexadecatet
     * @returns {IPv6} the IPv6 instance
     */
    static fromString(ipString: string): IPv6;
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
/**
 * The IPv4Mask can be seen as a specialized IPv4 number where, in a 32 bit number, starting from the left, you
 * have continuous bits turned on (with 1 value) followed by bits turned off (with 0 value). In networking, it is used
 * to demarcate which bits are used to identify a network, and the ones that are used to identify hosts on the network
 */
export declare class IPv4Mask extends IPv4 {
    /**
     * An array of {@link Octet}'s
     *
     * @type {Array} the octets that makes up the IPv4Mask
     */
    readonly octets: Array<Octet>;
    /**
     * The decimal value represented by the IPv4 mask in BigInteger
     */
    readonly value: bigInt.BigInteger;
    /**
     * The cidr prefix represented by this mask
     */
    readonly prefix: number;
    /**
     * A convenience method for creating an instance of IPv4Mask. The passed strings need to be a valid IPv4
     * number in dot-decimal notation.
     *
     * @param {string} rawValue The passed string in dot-decimal notation
     * @returns {IPv4Mask} the instance of IPv4Mask
     */
    static fromDecimalDottedString(rawValue: string): IPv4Mask;
    /**
     * Constructor for creating an instance of IPv4Mask.
     * The passed strings need to be a valid IPv4 mask number in dot-decimal notation.
     *
     * @param {string} ipString The passed string in dot-decimal notation
     */
    constructor(ipString: string);
}
/**
 * The IPv6Mask can be seen as a specialized IPv4 number where, in a 128 bit number, starting from the left,
 * you have continuous bits turned on (with 1 value) followed by bits turned off (with 0 value). In networking, it
 * is used to to demarcate which bits are used to identify a network, and the ones that are used to identify hosts
 * on the network
 */
export declare class IPv6Mask extends IPv6 {
    /**
     * An array of {@link Hexadecatet}'s
     *
     * @type {Array} the hexadecatet that makes up the IPv6 number
     */
    readonly hexadecatet: Array<Hexadecatet>;
    /**
     * The decimal value represented by the IPv6 number in BigInteger
     */
    readonly value: bigInt.BigInteger;
    /**
     * The cidr prefix represented by this mask
     */
    readonly prefix: number;
    /**
     * A convenience method for creating an instance of IPv6Mask.
     * The passed strings need to be a valid IPv4 mask number in dot-decimal notation.
     *
     * @param {string} rawValue The passed string in textual notation
     * @returns {IPv6Mask} the instance of IPv6Mask
     */
    static fromHexadecimalString(rawValue: string): IPv6Mask;
    /**
     * Constructor for creating an instance of IPv6Mask.
     * The passed strings need to be a valid IPv6 mask number in dot-decimal notation
     *
     * @param {string} ipString The passed IPv6 string
     */
    constructor(ipString: string);
}
/**
 * Check is the given IP number is an {@link IPv4} or not
 * @param ip the IP number to check if it is IPv4.
 */
export declare function isIPv4(ip: AbstractIPNum): ip is IPv4;
