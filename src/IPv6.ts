import {IPNumber} from "./interface/IPNumber";
import {Hexadecatet} from "./Hexadecatet";
import {Validator} from "./Validator";
import {bigIntegerNumberToBinaryString} from "./BinaryUtils";
import {binaryStringToHexadecimalString} from "./HexadecimalUtils";
import {expandIPv6Address} from "./IPv6Utils";
import {hexadectetNotationToBinaryString} from "./IPv6Utils";
import * as bigInt from "big-integer/BigInteger";
import {AbstractIPNum} from "./AbstractIPNum";
import {IPNumType} from "./IPNumType";


/**
 * Represents an IPv6 number. A 128 bit number that is used to uniquely identify a device that is part of a computer
 * network that uses the internet protocol for communication.
 *
 * @see https://en.wikipedia.org/wiki/IPv6
 * @see https://www.rfc-editor.org/info/rfc8200
 */
export class IPv6 extends AbstractIPNum implements IPNumber {
    /**
     * The decimal value represented by the IPv6 number in BigInteger
     */
    readonly value: bigInt.BigInteger;
    /**
     * The number of bits needed to represents the value of the IPv6 number
     */
    readonly bitSize: number = 128;
    /**
     * The maximum bit size (i.e. binary value) of the IPv6 number in BigInteger
     */
    readonly maximumBitSize: bigInt.BigInteger = Validator.ONE_HUNDRED_AND_TWENTY_EIGHT_BIT_SIZE;
    /**
     * The type of IP number. Value is one of the values of the {@link IPNumType} enum
     * @type {IPNumType} the type of IP number
     */
    readonly type: IPNumType = IPNumType.IPv6;
    /**
     * An array of {@link Hexadecatet}'s
     *
     * @type {Array} the hexadecatet that makes up the IPv6 address
     */
    readonly hexadecatet: Array<Hexadecatet> = [];

    /**
     * The string character used to separate the individual hexadecatet when the IPv6 is rendered as strings
     *
     * @type {string} The string character used to separate the individual hexadecatet when rendered as strings
     */
    readonly separator: string = ":";

    /**
     * A convenience method for creating an {@link IPv6} by providing the decimal value of the IP number in BigInteger
     *
     * @param {bigInt.BigInteger} bigIntValue the decimal value of the IP number in BigInteger
     * @returns {IPv6} the IPv6 instance
     */
    static fromBigInteger(bigIntValue: bigInt.BigInteger): IPv6 {
        return new IPv6(bigIntValue);
    }

    /**
     * A convenience method for creating an {@link IPv6} by providing the IP number in hexadecatet notation. E.g
     * "2001:800:0:0:0:0:0:2002"
     *
     * {@see https://en.wikipedia.org/wiki/IPv6_address#Representation} for more information on hexadecatet notation.
     *
     * @param {string} ipString the IP number in hexadecatet
     * @returns {IPv6} the IPv6 instance
     */
    static fromHexadecimalString(ipString: string) : IPv6 {
        return new IPv6(ipString);
    }

    /**
     * Constructor for an IPv6 number.
     *
     * @param {string | bigInt.BigInteger} ipValue value to construct an IPv6 from. The given value can either be
     * numeric or string. If a string is given then it needs to be in hexadecatet string notation
     */
    constructor(ipValue: string | bigInt.BigInteger) {
        super();
        if (typeof ipValue === "string" ) {
            let expandedIPv6 = expandIPv6Address(ipValue);
            let [value, hexadecatet] = this.constructFromHexadecimalDottedString(expandedIPv6);
            this.value = value;
            this.hexadecatet = hexadecatet;

        } else {
            let [value, hexadecatet] = this.constructFromBigIntegerValue(ipValue);
            this.value = value;
            this.hexadecatet = hexadecatet;
        }
    }

    /**
     * A string representation of the IPv6 number.
     *
     * @returns {string} The string representation of IPv6
     */
    public toString(): string {
        return this.hexadecatet.map((value) => { return value.toString()}).join(":");
    }

    /**
     * Gets the individual {@link Hexadecatet} that makes up the IPv6 address
     *
     * @returns {Array<Hexadecatet>} The individual {@link Hexadecatet} that makes up the IPv6 address
     */
    //TODO maybe rename to something like getSegments? so it can be same with getOctet
    public getHexadecatet():Array<Hexadecatet> {
        return this.hexadecatet;
    }

    /**
     * Returns the next IPv6 number
     *
     * @returns {IPv6} the next IPv6 number
     */
    public nextIPNumber(): IPv6 {
        return IPv6.fromBigInteger(this.getValue().add(1))
    }

    /**
     * Returns the previous IPv6 number
     *
     * @returns {IPv6} the previous IPv6 number
     */
    public previousIPNumber(): IPv6 {
        return IPv6.fromBigInteger(this.getValue().minus(1))
    }

    private constructFromBigIntegerValue(ipv6Number: bigInt.BigInteger): [bigInt.BigInteger, Array<Hexadecatet>]  {
        let [isValid, message] = Validator.isValidIPv6Number(ipv6Number);
        if (!isValid) {
            throw new Error(message.filter(msg => {return msg !== '';}).toString());
        }

        let binaryString = bigIntegerNumberToBinaryString(ipv6Number);
        return [ipv6Number, this.binaryStringToHexadecatets(binaryString)]
    }

    private constructFromHexadecimalDottedString(expandedIPv6: string): [bigInt.BigInteger, Array<Hexadecatet>] {
        let [isValid, message] = Validator.isValidIPv6String(expandedIPv6);
        if (!isValid) {
            throw new Error(message.filter(msg => {return msg !== '';}).toString());
        }

        let stringHexadecimals: string[] = expandedIPv6.split(":");
        let hexadecatet: Hexadecatet[]  = stringHexadecimals.map((stringHexadecatet) => {
            return Hexadecatet.fromString(stringHexadecatet);
        });
        let value = bigInt(hexadectetNotationToBinaryString(expandedIPv6), 2);
        return [value, hexadecatet];
    }

    private binaryStringToHexadecatets(binaryString: string): Hexadecatet[] {
        let hexadecimalString = binaryStringToHexadecimalString(binaryString);
        let hexadecimalStrings: string[] = hexadecimalString.match(/.{1,4}/g)!;
        return hexadecimalStrings.map((stringHexadecatet)=> {
            return Hexadecatet.fromString(stringHexadecatet);
        });
    }
}