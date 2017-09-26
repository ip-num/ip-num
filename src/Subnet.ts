import {Octet} from "./Octet";
import {Validator} from "./Validator";
import * as bigInt from "big-integer"
import {dottedDecimalNotationToBinaryString} from "./BinaryUtils";
import {Hexadecatet} from "./Hexadecatet";
import {hexadectetNotationToBinaryString} from "./IPv6Utils";

/**
 * The IPv4Subnet can be seen as a specialized IPv4 number where, in a 32 bit number, starting from the left, you have
 * continuous bits turned on (with 1 value) followed by bits turned off (with 0 value)
 */
// TODO revisit and perhaps make abstract the two subnets and make them extend IPnumber
export class IPv4Subnet {
    /**
     * An array of {@link Octet}'s
     *
     * @type {Array} the octets that makes up the IPv4Subnet
     */
    readonly octets: Array<Octet> = [];

    /**
     * The decimal value represented by the IPv4 subnet in BigInteger
     */
    readonly value: bigInt.BigInteger;

    /**
     * A convenience method for creating an instance of IPv4Subnet. The passed strings need to be a valid IPv4
     * number in dot-decimal notation.
     *
     * @param {string} rawValue The passed string in dot-decimal notation
     * @returns {IPv4Subnet} the instance of IPv4Subnet
     */
    static fromDecimalDottedString(rawValue:string):IPv4Subnet {
        return new IPv4Subnet(rawValue);
    };

    /**
     * Constructor for creating an instance of IPv4Subnet. The passed strings need to be a valid IPv4
     * number in dot-decimal notation.
     *
     * @param {string} ipString The passed string in dot-decimal notation
     */
    // TODO similar code as in constructor of IPv4, reuse?
    constructor(ipString: string) {
        let isValid: boolean;
        let message: string[];
        [isValid, message] = Validator.isValidIPv4Subnet(ipString);

        if (!isValid) {
            throw new Error(message.filter(msg => {return msg !== '';}).toString());
        }

        let stringOctets = ipString.split(".");

        this.octets = stringOctets.map((rawOctet) => {
            return Octet.fromString(rawOctet)
        });

        this.value = bigInt(dottedDecimalNotationToBinaryString(ipString), 2);
    }

    /**
     * Method to get the decimal numeric value of the IPv4Subnet as BigInteger
     *
     * @returns {bigInt.BigInteger} the decimal numeric value of the IPv4Subnet as BigInteger
     */
    public getValue():bigInt.BigInteger {
        return this.value;
    }

    /**
     * Method that converts the IPv4Subnet to a string representation.
     *
     * The string representation is in dot-decimal notation
     *
     * @returns {string} The string representation of the IPv4Subnet in dot-decimal notation
     */
    public toString(): string {
        return this.octets.map(function(value){ return value.toString()}).join(".");
    }

    /**
     * Gets the individual {@link Octet} that makes up the IPv4 subnet
     *
     * @returns {Array<Octet>} The individual {@link Octet} that makes up the IPv4 subnet
     */
    public getOctets(): Array<Octet> {
        return this.octets;
    }
}

/**
 * The IPv6Subnet can be seen as a specialized IPv4 number where, in a 128 bit number, starting from the left, you have
 * continuous bits turned on (with 1 value) followed by bits turned off (with 0 value)
 */
export class IPv6Subnet {
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
     * A convenience method for creating an instance of IPv6Subnet. The passed strings need to be a valid IPv6
     * number in textual representation.
     *
     * @param {string} rawValue The passed string in textual notation
     * @returns {IPv6Subnet} the instance of IPv6Subnet
     */
    static fromHexadecimalString(rawValue:string):IPv6Subnet {
        return new IPv6Subnet(rawValue);
    };

    /**
     * Constructor for creating an instance of IPv6Subnet. The passed strings need to be a valid IPv6
     * number in textual representation
     *
     * @param {string} ipString The passed IPv6 string
     */
    // TODO similar code as in constructor of IPv4, reuse?
    constructor(ipString: string) {
        let isValid: boolean;
        let message: string[];
        [isValid, message] = Validator.isValidIPv6Subnet(ipString);

        if (!isValid) {
            throw new Error(message.filter(msg => {return msg !== '';}).toString());
        }

        let stringHexadecimals = ipString.split(":");

        this.hexadecatet = stringHexadecimals.map((stringHexadecatet) => {
            return Hexadecatet.fromString(stringHexadecatet)
        });

        this.value = bigInt(hexadectetNotationToBinaryString(ipString), 2);
    }

    /**
     * Method to get the decimal numeric value of the IPv6Subnet as BigInteger
     *
     * @returns {bigInt.BigInteger} the decimal numeric value of the IPv6Subnet as BigInteger
     */
    public getValue():bigInt.BigInteger {
        return this.value;
    }

    /**
     * Method that converts the IPv6Subnet to a string representation.
     *
     *
     * @returns {string} The string representation of the IPv6Subnet
     */
    public toString(): string {
        return this.hexadecatet.map(function(value){ return value.toString()}).join(":");
    }

    /**
     * Gets the individual {@link Hexadecatet} that makes up the IPv6 subnet
     *
     * @returns {Array<Hexadecatet>} The individual {@link Hexadecatet} that makes up the IPv6 subnet
     */
    public getHexadecatet(): Array<Hexadecatet> {
        return this.hexadecatet;
    }
}