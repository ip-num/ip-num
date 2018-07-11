import {Octet} from "./Octet";
import {Validator} from "./Validator";
import {IPNumber} from "./interface/IPNumber";
import * as bigInt from "big-integer"
import {dottedDecimalNotationToBinaryString} from "./BinaryUtils";
import {bigIntegerNumberToBinaryString} from "./BinaryUtils";
import {parseBinaryStringToBigInteger} from "./BinaryUtils";
import {leftPadWithZeroBit} from "./BinaryUtils";
import {AbstractIPNum} from "./AbstractIPNum";
import {IPNumType} from "./IPNumType";
import {IPv6} from "./IPv6";

/**
 * Represents an IPv4 number. A 32 bit number that is used to uniquely identify a device that is part of a computer
 * network that uses the internet protocol for communication.
 *
 * @see https://en.wikipedia.org/wiki/IPv4
 * @see https://www.rfc-editor.org/info/rfc791
 */
export class IPv4 extends AbstractIPNum implements IPNumber {
    /**
     * The decimal value represented by the IPv4 number in BigInteger
     */
    readonly value: bigInt.BigInteger;
    /**
     * The number of bits needed to represents the value of the IPv4 number
     */
    readonly bitSize: number = 32;
    /**
     * The maximum bit size (i.e. binary value) of the IPv4 number in BigInteger
     */
    readonly maximumBitSize: bigInt.BigInteger = Validator.THIRTY_TWO_BIT_SIZE;
    /**
     * The type of IP number. Value is one of the values of the {@link IPNumType} enum
     * @type {IPNumType} the type of IP number
     */
    readonly type: IPNumType = IPNumType.IPv4;
    /**
     * An array of {@link Octet}'s
     *
     * @type {Array} the octets that makes up the IPv4 number
     */
    readonly octets: Array<Octet> = [];

    /**
     * The string character used to separate the individual octets when the IPv4 is rendered as strings
     *
     * @type {string} The string character used to separate the individual octets when rendered as strings
     */
    readonly separator: string = ".";

    /**
     * A convenience method for creating an {@link IPv4} by providing the decimal value of the IP number in BigInteger
     *
     * @param {bigInt.BigInteger} bigIntValue the decimal value of the IP number in BigInteger
     * @returns {IPv4} the IPv4 instance
     */
    static fromBigInteger(bigIntValue: bigInt.BigInteger): IPv4 {
        return new IPv4(bigIntValue);
    }

    /**
     * A convenience method for creating an {@link IPv4} by providing the IP number in dot-decimal notation. E.g
     * "10.1.1.10"
     *
     * {@see https://en.wikipedia.org/wiki/Dot-decimal_notation} for more information on dot-decimal notation.
     *
     * @param {string} ipString the IP number in dot-decimal notation
     * @returns {IPv4} the IPv4 instance
     */
    static fromDecimalDottedString(ipString: string) : IPv4 {
        return new IPv4(ipString);
    }

    /**
     * A convenience method for creating an {@link IPv4} from binary string
     *
     * @param {string} ipBinaryString the binary string representing the IPv4 number to be created
     * @returns {IPv4} the IPv4 instance
     */
    static fromBinaryString(ipBinaryString: string) : IPv4 {
        return new IPv4(parseBinaryStringToBigInteger(ipBinaryString));
    }

    /**
     * Constructor for an IPv4 number.
     *
     * @param {string | bigInt.BigInteger} ipValue value to construct an IPv4 from. The given value can either be
     * numeric or string. If a string is given then it needs to be in dot-decimal notation
     */
    constructor(ipValue: string | bigInt.BigInteger) {
        super();
        if (typeof ipValue === "string" ) {
            let [value, octets] = this.constructFromDecimalDottedString(ipValue);
            this.value = value;
            this.octets = octets
        } else {
            let [value, octets] = this.constructFromBigIntegerValue(ipValue);
            this.value = value;
            this.octets = octets;
        }
    }

    /**
     * A string representation of the IPv4 number. The string representation is in dot-decimal notation
     *
     * @returns {string} The string representation in dot-decimal notation
     */
    public toString(): string {
        return this.octets.map((value) => { return value.toString()}).join(this.separator);
    }

    /**
     * Gets the individual {@link Octet} that makes up the IPv4 number
     *
     * @returns {Array<Octet>} The individual {@link Octet} that makes up the IPv4 number
     */
    public getOctets(): Array<Octet> {
        return this.octets;
    }

    /**
     * Returns the next IPv4 number
     *
     * @returns {IPv4} the next IPv4 number
     */
    public nextIPNumber(): IPv4 {
        return IPv4.fromBigInteger(this.getValue().add(1))
    }

    /**
     * Returns the previous IPv4 number
     *
     * @returns {IPv4} the previous IPv4 number
     */
    public previousIPNumber(): IPv4 {
        return IPv4.fromBigInteger(this.getValue().minus(1))
    }

    private constructFromDecimalDottedString(ipString: string): [bigInt.BigInteger, Array<Octet>] {
        let octets;
        let value;
        let [isValid, message] = Validator.isValidIPv4String(ipString);
        if (!isValid) {
            throw new Error(message.filter(msg => {return msg !== '';}).toString());
        }
        let stringOctets = ipString.split(".");
        octets = stringOctets.map((rawOctet) => {
            return Octet.fromString(rawOctet)
        });
        value = bigInt(dottedDecimalNotationToBinaryString(ipString), 2);
        return [value, octets]
    }

    private constructFromBigIntegerValue(ipv4Number: bigInt.BigInteger): [bigInt.BigInteger, Array<Octet>]  {
        let [isValid, message] = Validator.isValidIPv4Number(ipv4Number);
        if (!isValid) {
            throw new Error(message.filter(msg => {return msg !== '';}).toString());
        }
        let binaryString = bigIntegerNumberToBinaryString(ipv4Number);
        return [ipv4Number, this.binaryStringToDecimalOctets(binaryString)]
    }

    private binaryStringToDecimalOctets(ipv4BinaryString: string): Array<Octet> {
        if (ipv4BinaryString.length < 32) {
            ipv4BinaryString = leftPadWithZeroBit(ipv4BinaryString, 32);
        }
        let octets: string[] = ipv4BinaryString.match(/.{1,8}/g)!;
        return octets.map((octet) => {
            return Octet.fromString(parseBinaryStringToBigInteger(octet).toString())
        });
    }
}