import { IPNumber } from "./interface/IPNumber";
import * as bigInt from "big-integer";
import { IPNumType } from "./IPNumType";
import { AbstractIPNum } from "./AbstractIPNum";
/**
 * Represents an Autonomous System Number. Which is a number that is used to identify
 * a group of IP addresses with a common, clearly defined routing policy.
 *
 * @see https://en.wikipedia.org/wiki/Autonomous_system_(Internet)
 * @see https://tools.ietf.org/html/rfc5396
 */
export declare class Asn extends AbstractIPNum implements IPNumber {
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
     * @returns {IPNumber} the next ASN number
     */
    nextIPNumber(): IPNumber;
    /**
     * Returns the previous ASN number
     *
     * @returns {IPNumber} the previous ASN number
     */
    previousIPNumber(): IPNumber;
    private static startWithASprefix;
    private parseFromDotNotation;
}
