import {Octet} from "./Octet";
import {Validator} from "./Validator";
import * as bigInt from "big-integer"
import {dottedDecimalNotationToBinaryString} from "./BinaryUtils";
import {Hexadecatet} from "./Hexadecatet";
import {IPv4} from "./IPv4";
import {IPv6} from "./IPv6";
import {hexadectetNotationToBinaryString} from "./HexadecimalUtils";

/**
 * The IPv4SubnetMask can be seen as a specialized IPv4 number where, in a 32 bit number, starting from the left, you
 * have continuous bits turned on (with 1 value) followed by bits turned off (with 0 value). In networking, it is used
 * to demarcate which bits are used to identify a network, and the ones that are used to identify hosts on the network
 */
export class IPv4SubnetMask extends IPv4 {
    /**
     * An array of {@link Octet}'s
     *
     * @type {Array} the octets that makes up the IPv4SubnetMask
     */
    readonly octets: Array<Octet> = [];

    /**
     * The decimal value represented by the IPv4 subnet mask in BigInteger
     */
    readonly value: bigInt.BigInteger;

    /**
     * A convenience method for creating an instance of IPv4SubnetMask. The passed strings need to be a valid IPv4
     * number in dot-decimal notation.
     *
     * @param {string} rawValue The passed string in dot-decimal notation
     * @returns {IPv4SubnetMask} the instance of IPv4SubnetMask
     */
    static fromDecimalDottedString(rawValue:string):IPv4SubnetMask {
        return new IPv4SubnetMask(rawValue);
    };

    /**
     * Constructor for creating an instance of IPv4SubnetMask.
     * The passed strings need to be a valid IPv4 subnet mask number in dot-decimal notation.
     *
     * @param {string} ipString The passed string in dot-decimal notation
     */
    constructor(ipString: string) {
        super(ipString);
        let isValid: boolean;
        let message: string[];
        [isValid, message] = Validator.isValidIPv4SubnetMask(ipString);

        if (!isValid) {
            throw new Error(message.filter(msg => {return msg !== '';}).toString());
        }

        let stringOctets = ipString.split(".");
        this.octets = stringOctets.map((rawOctet) => {
            return Octet.fromString(rawOctet)
        });
        this.value = bigInt(dottedDecimalNotationToBinaryString(ipString), 2);
    }
}

/**
 * The IPv6SubnetMask can be seen as a specialized IPv4 number where, in a 128 bit number, starting from the left,
 * you have continuous bits turned on (with 1 value) followed by bits turned off (with 0 value). In networking, it
 * is used to to demarcate which bits are used to identify a network, and the ones that are used to identify hosts
 * on the network
 */
export class IPv6SubnetMask extends IPv6 {
    /**
     * An array of {@link Hexadecatet}'s
     *
     * @type {Array} the hexadecatet that makes up the IPv6 number
     */
    readonly hexadecatet: Array<Hexadecatet> = [];

    /**
     * The decimal value represented by the IPv6 number in BigInteger
     */
    readonly value: bigInt.BigInteger;


    /**
     * A convenience method for creating an instance of IPv6SubnetMask.
     * The passed strings need to be a valid IPv4 subnet mask number in dot-decimal notation.
     *
     * @param {string} rawValue The passed string in textual notation
     * @returns {IPv6SubnetMask} the instance of IPv6SubnetMask
     */
    static fromHexadecimalString(rawValue:string):IPv6SubnetMask {
        return new IPv6SubnetMask(rawValue);
    };

    /**
     * Constructor for creating an instance of IPv6SubnetMask.
     * The passed strings need to be a valid IPv6 subnet mask number in dot-decimal notation
     *
     * @param {string} ipString The passed IPv6 string
     */
    constructor(ipString: string) {
        super(ipString);
        let isValid: boolean;
        let message: string[];
        [isValid, message] = Validator.isValidIPv6SubnetMask(ipString);

        if (!isValid) {
            throw new Error(message.filter(msg => {return msg !== '';}).toString());
        }

        let stringHexadecimals = ipString.split(":");
        this.hexadecatet = stringHexadecimals.map((stringHexadecatet) => {
            return Hexadecatet.fromString(stringHexadecatet)
        });
        this.value = bigInt(hexadectetNotationToBinaryString(ipString), 2);
    }
}