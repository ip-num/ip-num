import {Octet} from "./Octet";
import {Validator} from "./Validator";
import {dottedDecimalNotationToBinaryString} from "./BinaryUtils";
import {parseBinaryStringToBigInt} from "./BinaryUtils";
import {leftPadWithZeroBit} from "./BinaryUtils";
import {IPNumType} from "./IPNumType";
import {numberToBinaryString} from "./BinaryUtils";
import {Hexadecatet} from "./Hexadecatet";
import {binaryStringToHexadecimalString} from "./HexadecimalUtils";
import {expandIPv6Number, collapseIPv6Number} from "./IPv6Utils";
import {hexadectetNotationToBinaryString} from "./HexadecimalUtils";
import {IPv4CidrRange} from "./IPRange";
import {IPv6CidrRange} from "./IPRange";
import {IPv6AddressKind} from "./IPv6AddressKind";


/**
 * Provides the implementation of functionality that are common
 * to {@link IPv4}, {@link IPv6}, {@link IPv4Mask} and {@link IPv6Mask}
 */
export abstract class AbstractIPNum {
    /**
     * The decimal value represented by the IP number in BigInt
     */
    abstract readonly value: bigint;
    /**
     * The number of bits needed to represent the value of the IP number
     */
    abstract readonly bitSize: number;
    /**
     * The maximum bit size (i.e. binary value) of the IP number in BigInt
     */
    abstract readonly maximumBitSize: bigint;

    abstract nextIPNumber(): AbstractIPNum;
    abstract previousIPNumber(): AbstractIPNum;

    /**
     * Checks if this IP address is a multicast address.
     * 
     * @returns {boolean} true if this IP address is multicast, false otherwise
     */
    abstract isMulticast(): boolean;

    /**
     * Checks if this IP address is a private address.
     * 
     * @returns {boolean} true if this IP address is private, false otherwise
     */
    abstract isPrivate(): boolean;

    /**
     * Gets the numeric value of an IP number as {@link BigInt}
     *
     * @returns bigInt the numeric value of an IP number.
     */
    public getValue(): bigint {
        return this.value;
    }

    /**
     * Gets the binary string representation of an IP number.
     *
     * @returns {string} the string binary representation.
     */
    public toBinaryString(): string {
        return leftPadWithZeroBit(this.value.toString(2), this.bitSize);
    }

    /**
     * Checks if an IP number has a value greater than the present value
     * @returns {boolean} true, if there is a value greater than the present value. Returns false otherwise.
     */
    hasNext(): boolean {
        return this.value < this.maximumBitSize;
    }

    /**
     * Checks if an IP number has a value lesser than the present value
     * @returns {boolean} true, if there is a value lesser than the present value. Returns false otherwise.
     */
    hasPrevious():boolean {
        return this.value > 0n;
    }

    /**
     * Checks if the given IP number, is equals to the current IP number
     *
     * @param {AbstractIPNum} anotherIPNum the other IP number to compare with
     * @returns {boolean} true if the given IP number is equals
     */
    public isEquals(anotherIPNum: AbstractIPNum): boolean {
        return this.value === anotherIPNum.value;
    }

    /**
     * Checks if the given IP number is lesser than this current IP number
     *
     * @param {AbstractIPNum} anotherIPNum the other IP number to compare with
     * @returns {boolean} true if the given IP number is less than this current one. False otherwise.
     */
    public isLessThan(anotherIPNum: AbstractIPNum): boolean {
        return this.value < anotherIPNum.value;
    }

    /**
     * Checks if the given IP number is greater than this current IP number
     *
     * @param {AbstractIPNum} anotherIPNum the other IP number to compare with
     * @returns {boolean} true if the given IP number is greater than this current one. False otherwise.
     */
    public isGreaterThan(anotherIPNum: AbstractIPNum): boolean {
        return this.value > anotherIPNum.value;
    }

    /**
     * Checks if the given IP number is less than or equals to this current IP number
     *
     * @param {AbstractIPNum} anotherIPNum the other IP number to compare with
     * @returns {boolean} true if the given IP number is less than or equals to this current one. False otherwise.
     */
    public isLessThanOrEquals(anotherIPNum: AbstractIPNum): boolean {
        return this.value <= anotherIPNum.value;
    }

    /**
     * Checks if the given IP number is greater than or equals to this current IP number
     *
     * @param {AbstractIPNum} anotherIPNum the other IP number to compare with
     * @returns {boolean} {boolean} true if the given IP number is greater than or equals to this current one. False
     * otherwise.
     */
    public isGreaterThanOrEquals(anotherIPNum: AbstractIPNum): boolean {
        return this.value >= anotherIPNum.value;
    }
}

/**
 * Represents an IPv4 number. A 32 bit number that is used to uniquely identify a device that is part of a computer
 * network that uses the internet protocol for communication.
 *
 * @see https://en.wikipedia.org/wiki/IPv4
 * @see https://www.rfc-editor.org/info/rfc791
 */
export class IPv4 extends AbstractIPNum {
    /**
     * The decimal value represented by the IPv4 number in BigInt
     */
    readonly value: bigint;
    /**
     * The number of bits needed to represents the value of the IPv4 number
     */
    readonly bitSize: number = 32;

    /**
     * The maximum bit size (i.e. binary value) of the IPv4 number in BigInt
     */
    readonly maximumBitSize: bigint = Validator.THIRTY_TWO_BIT_SIZE;
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
     * RFC 1918 private address ranges. These ranges are constant and reused for performance.
     *
     * @see https://datatracker.ietf.org/doc/html/rfc1918
     */
    private static readonly PRIVATE_RANGES: Array<IPv4CidrRange> = [
        IPv4CidrRange.fromCidr("10.0.0.0/8"),
        IPv4CidrRange.fromCidr("172.16.0.0/12"),
        IPv4CidrRange.fromCidr("192.168.0.0/16")
    ];

    /**
     * RFC 5737 documentation address ranges. These ranges are constant and reused for performance.
     *
     * @see https://datatracker.ietf.org/doc/html/rfc5737
     */
    private static readonly DOCUMENTATION_RANGES: Array<IPv4CidrRange> = [
        IPv4CidrRange.fromCidr("192.0.2.0/24"),
        IPv4CidrRange.fromCidr("198.51.100.0/24"),
        IPv4CidrRange.fromCidr("203.0.113.0/24")
    ];

    /**
     * RFC 1112 multicast address range. This range is constant and reused for performance.
     *
     * Multicast IPv4 address range:
     * - 224.0.0.0/4 (224.0.0.0 to 239.255.255.255)
     *
     * @see https://datatracker.ietf.org/doc/html/rfc1112
     */
    private static readonly MULTICAST_RANGE: IPv4CidrRange = 
        IPv4CidrRange.fromCidr("224.0.0.0/4");

    /**
     * The limited broadcast address (255.255.255.255). This is constant and reused for performance.
     */
    private static readonly LIMITED_BROADCAST: IPv4 = IPv4.fromDecimalDottedString("255.255.255.255");

    /**
     * A convenience method for creating an {@link IPv4} by providing the decimal value of the IP number in BigInt
     *
     * @param {bigint} bigIntValue the decimal value of the IP number in BigInt
     * @returns {IPv4} the IPv4 instance
     */
    static fromNumber(bigIntValue: bigint | number): IPv4 {
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
     * Alias for IPv4.fromDecimalDottedString.
     *
     * @param {string} ipString the IP number in dot-decimal notation
     * @returns {IPv4} the IPv4 instance
     */
    static fromString(ipString: string): IPv4 {
        return IPv4.fromDecimalDottedString(ipString);
    }

    /**
     * A convenience method for creating an {@link IPv4} from binary string
     *
     * @param {string} ipBinaryString the binary string representing the IPv4 number to be created
     * @returns {IPv4} the IPv4 instance
     */
    static fromBinaryString(ipBinaryString: string) : IPv4 {
        let validationResult = Validator.isValidBinaryString(ipBinaryString);
        if (validationResult[0]) {
            return new IPv4(parseBinaryStringToBigInt(ipBinaryString));
        } else {
            throw Error(validationResult[1].join(','))
        }
    }

    /**
     * Constructor for an IPv4 number.
     *
     * @param {string | bigint} ipValue value to construct an IPv4 from. The given value can either be
     * numeric or string. If a string is given then it needs to be in dot-decimal notation
     */
    constructor(ipValue: string | bigint | number) {
        super();
        if (typeof ipValue === "string" ) {
            let [value, octets] = this.constructFromDecimalDottedString(ipValue);
            this.value = value;
            this.octets = octets
        } else {
            let [value, octets] = this.constructFromBigIntValue(ipValue);
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
        return IPv4.fromNumber(this.getValue() + 1n)
    }

    /**
     * Returns the previous IPv4 number
     *
     * @returns {IPv4} the previous IPv4 number
     */
    public previousIPNumber(): IPv4 {
        return IPv4.fromNumber(this.getValue() - 1n)
    }

    /**
     * Checks if this IPv4 address is a private address according to RFC 1918.
     *
     * Private IPv4 address ranges:
     * - 10.0.0.0/8 (10.0.0.0 to 10.255.255.255)
     * - 172.16.0.0/12 (172.16.0.0 to 172.31.255.255)
     * - 192.168.0.0/16 (192.168.0.0 to 192.168.255.255)
     *
     * @see https://datatracker.ietf.org/doc/html/rfc1918
     * @returns {boolean} true if this IPv4 address is private, false otherwise
     */
    public isPrivate(): boolean {
        return IPv4.PRIVATE_RANGES.some(range => range.contains(this));
    }

    /**
     * Checks if this IPv4 address is a documentation address according to RFC 5737.
     *
     * Documentation IPv4 address ranges:
     * - 192.0.2.0/24 (TEST-NET-1)
     * - 198.51.100.0/24 (TEST-NET-2)
     * - 203.0.113.0/24 (TEST-NET-3)
     *
     * @see https://datatracker.ietf.org/doc/html/rfc5737
     * @returns {boolean} true if this IPv4 address is reserved for documentation, false otherwise
     */
    public isDocumentation(): boolean {
        return IPv4.DOCUMENTATION_RANGES.some(range => range.contains(this));
    }

    /**
     * Checks if this IPv4 address is a multicast address according to RFC 1112.
     *
     * Multicast IPv4 address range:
     * - 224.0.0.0/4 (224.0.0.0 to 239.255.255.255)
     *
     * @see https://datatracker.ietf.org/doc/html/rfc1112
     * @returns {boolean} true if this IPv4 address is multicast, false otherwise
     */
    public isMulticast(): boolean {
        return IPv4.MULTICAST_RANGE.contains(this);
    }

    /**
     * Checks if this IPv4 address is a broadcast address.
     *
     * When called without arguments, checks for the limited broadcast address (255.255.255.255).
     * When a subnet is provided, checks if this address is the directed broadcast for that subnet.
     *
     * @param subnet Optional CIDR range to check for directed broadcast
     * @returns {boolean} true if this is a broadcast address, false otherwise
     */
    public isBroadcast(subnet?: IPv4CidrRange): boolean {
        if (subnet) {
            return this.isEquals(subnet.getLast());
        }
        return this.isEquals(IPv4.LIMITED_BROADCAST);
    }

    /**
     * Returns this IPv4 number as a IPv4-Mapped IPv6 Address
     *
     * The IPv4-Mapped IPv6 Address allows an IPv4 number to be embedded within an IPv6 number
     *
     * {@see https://tools.ietf.org/html/rfc4291#section-2.5.5} for more information on the IPv4-Mapped IPv6 Address
     *
     * @returns {IPv6} an IPv6 number with the IPv4 embedded within it
     */
    public toIPv4MappedIPv6(): IPv6 {
        let binary = '1'.repeat(16) + this.toBinaryString();
        return IPv6.fromBinaryString(binary);
    }


    private constructFromDecimalDottedString(ipString: string): [bigint, Array<Octet>] {
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
        value = BigInt(`0b${dottedDecimalNotationToBinaryString(ipString)}`);
        return [value, octets]
    }

    private constructFromBigIntValue(ipv4Number: bigint | number): [bigint, Array<Octet>]  {
        let [isValid, message] = Validator.isValidIPv4Number(ipv4Number);
        if (!isValid) {
            throw new Error(message.filter(msg => {return msg !== '';}).toString());
        }
        let binaryString = numberToBinaryString(ipv4Number);
        ipv4Number = typeof ipv4Number === "bigint" ? ipv4Number : BigInt(ipv4Number);
        return [ipv4Number, this.binaryStringToDecimalOctets(binaryString)]
    }

    private binaryStringToDecimalOctets(ipv4BinaryString: string): Array<Octet> {
        if (ipv4BinaryString.length < 32) {
            ipv4BinaryString = leftPadWithZeroBit(ipv4BinaryString, 32);
        }
        let octets: string[] = ipv4BinaryString.match(/.{1,8}/g)!;
        return octets.map((octet) => {
            return Octet.fromString(parseBinaryStringToBigInt(octet).toString())
        });
    }
}




/**
 * Represents an Autonomous System Number. Which is a number that is used to identify
 * a group of IP addresses with a common, clearly defined routing policy.
 *
 * @see https://en.wikipedia.org/wiki/Autonomous_system_(Internet)
 * @see https://tools.ietf.org/html/rfc5396
 */
export class Asn extends AbstractIPNum {
    /**
     * The decimal value represented by the ASN number in BigInt
     */
    readonly value: bigint;
    /**
     * The number of bits needed to represents the value of the ASN number
     */
    bitSize: number = 32;
    /**
     * The maximum bit size (i.e. binary value) of the ASN number in BigInt
     */
    maximumBitSize: bigint = Validator.THIRTY_TWO_BIT_SIZE;

    type: IPNumType = IPNumType.ASN;
    private static AS_PREFIX = "AS";

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
    static fromString(rawValue:string):Asn {
        return new Asn(rawValue);
    };

    /**
     * A convenience method for creating an instance of {@link Asn} from a numeric value
     *
     * @param {number} rawValue the asn numeric value
     * @returns {Asn} the constructed ASN instance
     */
    static fromNumber(rawValue: number): Asn {
        return new Asn(rawValue);
    };

    /**
     * A convenience method for creating an instance of {@link Asn} from a binary string
     *
     * @param {string} binaryString to create an ASN instance from
     * @returns {Asn} the constructed ASN instance
     */
    static fromBinaryString(binaryString: string): Asn {
        let validationResult = Validator.isValidBinaryString(binaryString);
        if (validationResult[0]) {
            return new Asn(parseInt(binaryString, 2))
        } else {
            throw Error(validationResult[1].join(','))
        }
    }

    /**
     * Constructor for an instance of {@link ASN}
     *
     * @param {string | number} rawValue value to construct an ASN from. The given value can either be numeric or
     * string. If in string then it can be in asplain, asdot or asdot+ string representation format
     */
    constructor(rawValue:string | number | bigint) {
        super();
        if (typeof rawValue === 'string') {
            if (Asn.startWithASPrefix(rawValue)) {
                this.value = BigInt(parseInt(rawValue.substring(2)));
            } else if(rawValue.indexOf(".") != -1) {
                this.value = BigInt(this.parseFromDotNotation(rawValue));
            } else {
                this.value = BigInt(parseInt(rawValue));
            }
        } else {
            let valueAsBigInt = BigInt(rawValue);
            let [isValid, message] = Validator.isValidAsnNumber(valueAsBigInt);
            if (!isValid) {
                throw Error(message.filter(msg => {return msg !== '';}).toString());
            }
            this.value = valueAsBigInt;
        }
    }

    /**
     * A string representation where the asn value is prefixed by "ASN". For example "AS65526"
     *
     * @returns {string} A string representation where the asn value is prefixed by "ASN"
     */
    toString():string {
        let stringValue = this.value.toString();
        return `${Asn.AS_PREFIX}${stringValue}`;
    }

    /**
     * A string representation where the ASN numeric value of is represented as a string. For example "65526"
     *
     * @returns {string} A string representation where the ASN numeric value of is represented as a string
     */
    toASPlain():string {
        return this.value.toString();
    }

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
    toASDot():string {
        if (this.value.valueOf() >= 65536n) {
            return this.toASDotPlus();
        }
        return this.toASPlain();
    }

    /**
     * A string representation where the ASN value is represented using the asdot+ notation
     *
     * @returns {string} A string representation where the ASN value is represented using the asdot+ notation
     *
     */
    toASDotPlus():string {
        let high = this.value.valueOf() / 65535n;
        let low = (this.value.valueOf() % 65535n) - high;
        return `${high}.${low}`;
    }

    /**
     * Converts the ASN value to binary numbers represented with strings
     *
     * @returns {string} a binary string representation of the value of the ASN number
     */
    toBinaryString():string {
        return numberToBinaryString(this.value);
    }

    /**
     * Checks if the ASN value is 16bit
     *
     * @returns {boolean} true if the ASN is a 16bit value. False otherwise.
     */
    is16Bit():boolean {
        let [valid16BitAsnNumber,] = Validator.isValid16BitAsnNumber(this.value);
        return valid16BitAsnNumber;
    }

    /**
     * Checks if the ASN value is 32bit
     *
     * @returns {boolean} true if the ASN is a 32bit value. False otherwise.
     */
    is32Bit():boolean {
        return !this.is16Bit();
    }

    /**
     * Returns the next ASN number
     *
     * @returns {AbstractIPNum} the next ASN number
     */
    nextIPNumber(): AbstractIPNum {
        return new Asn(this.value.valueOf() + 1n);
    }

    /**
     * Returns the previous ASN number
     *
     * @returns {AbstractIPNum} the previous ASN number
     */
    previousIPNumber(): Asn {
        return new Asn(this.value.valueOf() - 1n)
    }

    /**
     * Checks if this ASN is a multicast address.
     * 
     * ASNs are not IP addresses, so this always returns false.
     * 
     * @returns {boolean} always returns false for ASN
     */
    public isMulticast(): boolean {
        return false;
    }

    /**
     * Checks if this ASN is a private address.
     * 
     * ASNs are not IP addresses, so this always returns false.
     * 
     * @returns {boolean} always returns false for ASN
     */
    public isPrivate(): boolean {
        return false;
    }

    private static startWithASPrefix(word:string):boolean {
        return word.indexOf(Asn.AS_PREFIX) === 0;
    }

    private parseFromDotNotation(rawValue: string): number {
        let values: string[] = rawValue.split(".");
        let high = parseInt(values[0]);
        let low = parseInt(values[1]);
        return (high * 65535) + (low + high);
    }
}


/**
 * Represents an IPv6 number. A 128 bit number that is used to uniquely identify a device that is part of a computer
 * network that uses the internet protocol for communication.
 *
 * @see https://en.wikipedia.org/wiki/IPv6
 * @see https://www.rfc-editor.org/info/rfc8200
 */
export class IPv6 extends AbstractIPNum {
    /**
     * The decimal value represented by the IPv6 number in BigInt
     */
    readonly value: bigint;
    /**
     * The number of bits needed to represents the value of the IPv6 number
     */
    readonly bitSize: number = 128;
    /**
     * The maximum bit size (i.e. binary value) of the IPv6 number in BigInt
     */
    readonly maximumBitSize: bigint = Validator.ONE_HUNDRED_AND_TWENTY_EIGHT_BIT_SIZE;
    /**
     * The type of IP number. Value is one of the values of the {@link IPNumType} enum
     * @type {IPNumType} the type of IP number
     */
    readonly type: IPNumType = IPNumType.IPv6;
    /**
     * An array of {@link Hexadecatet}'s
     *
     * @type {Array} the hexadecatet that makes up the IPv6 number
     */
    readonly hexadecatet: Array<Hexadecatet> = [];

    /**
     * The zone identifier of the IPv6 number
     *
     * @type {string} the zone identifier of the IPv6 number
     */
    readonly zoneId: string | undefined;

    /**
     * The string character used to separate the individual hexadecatet when the IPv6 is rendered as strings
     *
     * @type {string} The string character used to separate the individual hexadecatet when rendered as strings
     */
    readonly separator: string = ":";

    /**
     * RFC 4193 private address range (fd00::/8 - Unique Local Addresses). This range is constant and reused for performance.
     *
     * @see https://datatracker.ietf.org/doc/html/rfc4193
     */
    private static readonly PRIVATE_RANGE: IPv6CidrRange = IPv6CidrRange.fromCidr("fd00::/8");

    /**
     * RFC 3849 documentation address range (2001:db8::/32). This range is constant and reused for performance.
     *
     * @see https://datatracker.ietf.org/doc/html/rfc3849
     */
    private static readonly DOCUMENTATION_RANGE: IPv6CidrRange = IPv6CidrRange.fromCidr("2001:db8::/32");

    /**
     * RFC 4291 multicast address range (ff00::/8). This range is constant and reused for performance.
     *
     * Multicast IPv6 address range:
     * - ff00::/8 (ff00:: to ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff)
     *
     * @see https://datatracker.ietf.org/doc/html/rfc4291
     */
    private static readonly MULTICAST_RANGE: IPv6CidrRange = IPv6CidrRange.fromCidr("ff00::/8");

    /**
     * RFC 4291 unspecified address range (::/128). This range is constant and reused for performance.
     *
     * @see https://datatracker.ietf.org/doc/html/rfc4291
     */
    private static readonly UNSPECIFIED_RANGE: IPv6CidrRange = IPv6CidrRange.fromCidr("::/128");

    /**
     * RFC 4291 loopback address range (::1/128). This range is constant and reused for performance.
     *
     * @see https://datatracker.ietf.org/doc/html/rfc4291
     */
    private static readonly LOOPBACK_RANGE: IPv6CidrRange = IPv6CidrRange.fromCidr("::1/128");

    /**
     * RFC 4291 link-local address range (fe80::/10). This range is constant and reused for performance.
     *
     * @see https://datatracker.ietf.org/doc/html/rfc4291
     */
    private static readonly LINK_LOCAL_RANGE: IPv6CidrRange = IPv6CidrRange.fromCidr("fe80::/10");


    /**
     * RFC 6666 discard-only address range (100::/64). This range is constant and reused for performance.
     *
     * @see https://datatracker.ietf.org/doc/html/rfc6666
     */
    private static readonly DISCARD_ONLY_RANGE: IPv6CidrRange = IPv6CidrRange.fromCidr("100::/64");

    /**
     * A convenience method for creating an {@link IPv6} by providing the decimal value of the IP number in BigInt
     *
     * @param {bigint} bigIntValue the decimal value of the IP number in BigInt
     * @returns {IPv6} the IPv6 instance
     */
    static fromBigInt(bigIntValue: bigint): IPv6 {
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
    static fromHexadecatet(ipString: string) : IPv6 {
        return new IPv6(ipString);
    }

    /**
     * Alias for IPv6.fromHexadecimalString
     *
     * @param {string} ipString the IP number in hexadecatet
     * @returns {IPv6} the IPv6 instance
     */
    static fromString(ipString: string) : IPv6 {
        return IPv6.fromHexadecatet(ipString);
    }

    /**
     * A convenience method for creating an {@link IPv6} from binary string
     *
     * @param {string} ipBinaryString the binary string representing the IPv6 number to be created
     * @returns {IPv6} the IPv6 instance
     */
    static fromBinaryString(ipBinaryString: string) : IPv6 {
        let validationResult = Validator.isValidBinaryString(ipBinaryString);
        if (validationResult[0]) {
            let paddedBinaryString = leftPadWithZeroBit(ipBinaryString, 128);
            return new IPv6(parseBinaryStringToBigInt(paddedBinaryString));
        } else {
            throw Error(validationResult[1].join(','))
        }
    }

    /**
     * A convenience method for creating an IPv4-Compatible {@link IPv6} Address from an instance of {@link IPv4}
     *
     * @param {IPv4} ipv4 to create an IPv4-Compatible {@link IPv6} Address
     * @returns {IPv6} the IPv4-Compatible {@link IPv6} Address
     */
    static fromIPv4(ipv4: IPv4): IPv6 {
        return ipv4.toIPv4MappedIPv6();
    }

    /**
     * A convenience method for creating an IPv4-Compatible {@link IPv6} Address from a IPv4 represented in
     * dot-decimal notation i.e. 127.0.0.1
     *
     * @param {IPv4} ip4DotDecimalString string represented in a dot decimal string
     * @returns {IPv6} the IPv4-Compatible {@link IPv6} Address
     */
    static fromIPv4DotDecimalString(ip4DotDecimalString: string): IPv6 {
        return new IPv4(ip4DotDecimalString).toIPv4MappedIPv6();
    }

    /**
     * Constructor for an IPv6 number.
     *
     * @param {string | bigint} ipValue value to construct an IPv6 from. The given value can either be
     * numeric or string. If a string is given then it needs to be in hexadecatet string notation
     */
    constructor(ipValue: string | bigint, zoneId?: string) {
        super();
        if (typeof ipValue === "string" ) {
            let [isValid, message] = Validator.isValidIPv6String(ipValue);
            if (!isValid) {
                throw new Error(message.filter(msg => {return msg !== '';}).toString());
            }

            let [ipv6, zId] = ipValue.split('%');
            this.zoneId = zId ? zId : zoneId;

            let expandedIPv6 = expandIPv6Number(ipv6);
            let [value, hexadecatet] = this.constructFromHexadecimalDottedString(expandedIPv6);
            this.value = value;
            this.hexadecatet = hexadecatet;
        } else {
            let [value, hexadecatet] = this.constructFromBigIntValue(ipValue);
            this.value = value;
            this.hexadecatet = hexadecatet;
            this.zoneId = zoneId;
        }
    }

    /**
     * A string representation of the IPv6 number.
     *
     * @returns {string} The string representation of IPv6
     */
    public toString(): string {
        let ipv6String = this.hexadecatet.map(v => v.toString()).join(":");
        if (this.hexadecatet.length < 8) {
            ipv6String = `::${ipv6String}`;
        }
        if (this.zoneId) {
            ipv6String = `${collapseIPv6Number(ipv6String)}%${this.zoneId}`;
        }
        return ipv6String;
    }

    /**
     * Gets the individual {@link Hexadecatet} that makes up the IPv6 number
     *
     * @returns {Array<Hexadecatet>} The individual {@link Hexadecatet} that makes up the IPv6 number
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
        return IPv6.fromBigInt(this.getValue() + 1n)
    }

    /**
     * Returns the previous IPv6 number
     *
     * @returns {IPv6} the previous IPv6 number
     */
    public previousIPNumber(): IPv6 {
        return IPv6.fromBigInt(this.getValue() - 1n)
    }

    /**
     * Checks if this IPv6 address is a private address according to RFC 4193.
     *
     * Private IPv6 address range:
     * - fd00::/8 (Unique Local Addresses)
     *
     * @see https://datatracker.ietf.org/doc/html/rfc4193
     * @returns {boolean} true if this IPv6 address is private, false otherwise
     */
    public isPrivate(): boolean {
        return IPv6.PRIVATE_RANGE.contains(this);
    }

    /**
     * Checks if this IPv6 address is a documentation address according to RFC 3849.
     *
     * Documentation IPv6 address range:
     * - 2001:db8::/32
     *
     * @see https://datatracker.ietf.org/doc/html/rfc3849
     * @returns {boolean} true if this IPv6 address is reserved for documentation, false otherwise
     */
    public isDocumentation(): boolean {
        return IPv6.DOCUMENTATION_RANGE.contains(this);
    }

    /**
     * Checks if this IPv6 address is a multicast address.
     *
     * Multicast IPv6 address range:
     * - ff00::/8 (ff00:: to ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff)
     *
     * @see https://datatracker.ietf.org/doc/html/rfc4291
     * @returns {boolean} true if this IPv6 address is multicast, false otherwise
     */
    public isMulticast(): boolean {
        return IPv6.MULTICAST_RANGE.contains(this);
    }

    /**
     * Checks if this IPv6 multicast address has an embedded Rendezvous Point (RP).
     * 
     * For an embedded RP to be present, the R, P, and T flags must all be set to 1.
     * The R flag (bit 9) indicates RP embedded, P flag (bit 10) indicates prefix-based,
     * and T flag (bit 11) indicates transient address.
     * 
     * @see https://datatracker.ietf.org/doc/html/rfc3956
     * @returns {boolean} true if embedded RP is present (R, P, T flags all set), false otherwise
     * @throws {Error} if this is not a multicast address
     */
    public hasEmbeddedRP(): boolean {
        if (!this.isMulticast()) {
            throw new Error("Embedded RP can only be checked for multicast addresses");
        }
        
        // Extract second octet (bits 8-15, 0-indexed)
        // Shift right by 112 bits to get bits 8-15, then mask to get second octet
        const secondOctet = Number((this.value >> 112n) & 0xFFn);
        
        // Check R flag (bit 1 of second octet = 0x40)
        // Check P flag (bit 2 of second octet = 0x20)
        // Check T flag (bit 3 of second octet = 0x10)
        // All three flags must be set: (R & P & T) = 0x70
        return (secondOctet & 0x70) === 0x70;
    }

    /**
     * Checks if this IPv6 address is an unspecified address according to RFC 4291.
     *
     * Unspecified IPv6 address:
     * - ::/128 (all zeros)
     *
     * @see https://datatracker.ietf.org/doc/html/rfc4291
     * @returns {boolean} true if this IPv6 address is unspecified, false otherwise
     */
    public isUnspecified(): boolean {
        return this.value === 0n;
    }

    /**
     * Checks if this IPv6 address is a loopback address according to RFC 4291.
     *
     * Loopback IPv6 address:
     * - ::1/128
     *
     * @see https://datatracker.ietf.org/doc/html/rfc4291
     * @returns {boolean} true if this IPv6 address is loopback, false otherwise
     */
    public isLoopback(): boolean {
        return this.value === 1n;
    }

    /**
     * Checks if this IPv6 address is a link-local address according to RFC 4291.
     *
     * Link-local IPv6 address range:
     * - fe80::/10 (fe80:: to febf:ffff:ffff:ffff:ffff:ffff:ffff:ffff)
     *
     * @see https://datatracker.ietf.org/doc/html/rfc4291
     * @returns {boolean} true if this IPv6 address is link-local, false otherwise
     */
    public isLinkLocal(): boolean {
        return IPv6.LINK_LOCAL_RANGE.contains(this);
    }

    /**
     * Checks if this IPv6 address is a global unicast address according to RFC 4291.
     *
     * According to RFC 4291, global unicast addresses are defined as "everything else" -
     * any address that does not match the other specific address types (Unspecified,
     * Loopback, Multicast, Link-Local, IPv4-Mapped, Discard-Only, Documentation, or Private).
     *
     * @see https://datatracker.ietf.org/doc/html/rfc4291
     * @returns {boolean} true if this IPv6 address is global unicast, false otherwise
     */
    public isGlobalUnicast(): boolean {
        // Global Unicast is "everything else" - not any of the other specific types
        return !this.isUnspecified() &&
               !this.isLoopback() &&
               !this.isMulticast() &&
               !this.isLinkLocal() &&
               !this.isIPv4Mapped() &&
               !this.isDiscardOnly() &&
               !this.isDocumentation() &&
               !this.isPrivate();
    }

    /**
     * Checks if this IPv6 address is an IPv4-mapped IPv6 address according to RFC 4291.
     *
     * IPv4-mapped IPv6 addresses have a specific format:
     * - First 80 bits: all zeros
     * - Next 16 bits: 0xffff
     * - Last 32 bits: IPv4 address
     *
     * This corresponds to the format ::ffff:x.x.x.x where x.x.x.x is an IPv4 address.
     *
     * @see https://datatracker.ietf.org/doc/html/rfc4291
     * @returns {boolean} true if this IPv6 address is IPv4-mapped, false otherwise
     */
    public isIPv4Mapped(): boolean {
        // Check if first 5 hexadecatets (80 bits) are all zeros
        // and 6th hexadecatet (16 bits) is ffff
        if (this.hexadecatet.length !== 8) {
            return false;
        }
        
        // First 5 hexadecatets must be 0
        for (let i = 0; i < 5; i++) {
            if (this.hexadecatet[i].getValue() !== 0) {
                return false;
            }
        }
        
        // 6th hexadecatet must be ffff (65535)
        return this.hexadecatet[5].getValue() === 0xffff;
    }

    /**
     * Checks if this IPv6 address is a discard-only address according to RFC 6666.
     *
     * Discard-only IPv6 address range:
     * - 100::/64 (100:: to 100::ffff:ffff:ffff:ffff)
     *
     * @see https://datatracker.ietf.org/doc/html/rfc6666
     * @returns {boolean} true if this IPv6 address is discard-only, false otherwise
     */
    public isDiscardOnly(): boolean {
        return IPv6.DISCARD_ONLY_RANGE.contains(this);
    }

    /**
     * Gets the kind/category of this IPv6 address.
     *
     * Returns the most specific kind that matches this address. The check order ensures
     * correct classification when address ranges overlap:
     * 1. Unspecified (::)
     * 2. Loopback (::1)
     * 3. Multicast (ff00::/8)
     * 4. Documentation (2001:db8::/32)
     * 5. IPv4-Mapped (::ffff:0:0/96)
     * 6. Discard-Only (100::/64)
     * 7. Link-Local (fe80::/10)
     * 8. Unique Local Address/Private (fd00::/8)
     * 9. Global Unicast (everything else, per RFC 4291)
     * 10. Unknown (fallback for reserved/unassigned ranges)
     *
     * According to RFC 4291, Global Unicast addresses are defined as "everything else" -
     * any address that does not match the other specific address types.
     *
     * @see https://datatracker.ietf.org/doc/html/rfc4291
     * @returns {IPv6AddressKind} the kind of this IPv6 address
     */
    public getKind(): IPv6AddressKind {
        // Check in order of specificity (more specific first)
        if (this.isUnspecified()) {
            return IPv6AddressKind.UNSPECIFIED;
        }
        if (this.isLoopback()) {
            return IPv6AddressKind.LOOPBACK;
        }
        if (this.isMulticast()) {
            return IPv6AddressKind.MULTICAST;
        }
        if (this.isDocumentation()) {
            return IPv6AddressKind.DOCUMENTATION;
        }
        if (this.isIPv4Mapped()) {
            return IPv6AddressKind.IPV4_MAPPED;
        }
        if (this.isDiscardOnly()) {
            return IPv6AddressKind.DISCARD_ONLY;
        }
        if (this.isLinkLocal()) {
            return IPv6AddressKind.LINK_LOCAL;
        }
        if (this.isPrivate()) {
            return IPv6AddressKind.UNIQUE_LOCAL;
        }
        if (this.isGlobalUnicast()) {
            return IPv6AddressKind.GLOBAL_UNICAST;
        }
        
        return IPv6AddressKind.UNKNOWN;
    }

    private constructFromBigIntValue(ipv6Number: bigint): [bigint, Array<Hexadecatet>]  {
        let [isValid, message] = Validator.isValidIPv6Number(ipv6Number);
        if (!isValid) {
            throw new Error(message.filter(msg => {return msg !== '';}).toString());
        }

        let binaryString = numberToBinaryString(ipv6Number);
        return [ipv6Number, this.binaryStringToHexadecatets(binaryString)]
    }

    private constructFromHexadecimalDottedString(expandedIPv6: string): [bigint, Array<Hexadecatet>] {
        let [isValid, message] = Validator.isValidIPv6String(expandedIPv6);
        if (!isValid) {
            throw new Error(message.filter(msg => {return msg !== '';}).toString());
        }

        let stringHexadecimals: string[] = expandedIPv6.split(":");
        let hexadecatet: Hexadecatet[]  = stringHexadecimals.map((stringHexadecatet) => {
            return Hexadecatet.fromString(stringHexadecatet);
        });
        let value = BigInt(`0b${hexadectetNotationToBinaryString(expandedIPv6)}`);
        return [value, hexadecatet];
    }

    private binaryStringToHexadecatets(binaryString: string): Hexadecatet[] {
        let hexadecimalString = binaryStringToHexadecimalString(binaryString);
        while (hexadecimalString.length % 4 != 0) {
            hexadecimalString = '0' + hexadecimalString;
        }
        let hexadecimalStrings: string[] = hexadecimalString.match(/.{1,4}/g)!;
        return hexadecimalStrings.map((stringHexadecatet)=> {
            return Hexadecatet.fromString(stringHexadecatet);
        });
    }
}

/**
 * The IPv4Mask can be seen as a specialized IPv4 number where, in a 32 bit number, starting from the left, you
 * have continuous bits turned on (with 1 value) followed by bits turned off (with 0 value). In networking, it is used
 * to demarcate which bits are used to identify a network, and the ones that are used to identify hosts on the network
 */
export class IPv4Mask extends IPv4 {
    /**
     * An array of {@link Octet}'s
     *
     * @type {Array} the octets that makes up the IPv4Mask
     */
    readonly octets: Array<Octet> = [];

    /**
     * The decimal value represented by the IPv4 mask in BigInt
     */
    readonly value: bigint;

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
    static fromDecimalDottedString(rawValue:string):IPv4Mask {
        return new IPv4Mask(rawValue);
    };

    /**
     * Constructor for creating an instance of IPv4Mask.
     * The passed strings need to be a valid IPv4 mask number in dot-decimal notation.
     *
     * @param {string} ipString The passed string in dot-decimal notation
     */
    constructor(ipString: string) {
        super(ipString);
        let isValid: boolean;
        let message: string[];
        [isValid, message] = Validator.isValidIPv4Mask(ipString);

        if (!isValid) {
            throw new Error(message.filter(msg => {return msg !== '';}).toString());
        }

        let stringOctets = ipString.split(".");
        this.octets = stringOctets.map((rawOctet) => {
            return Octet.fromString(rawOctet)
        });

        let binaryString = dottedDecimalNotationToBinaryString(ipString);
        this.prefix  = (binaryString.match(/1/g) || []).length;
        this.value = BigInt(`0b${binaryString}`);
    }
}

/**
 * The IPv6Mask can be seen as a specialized IPv4 number where, in a 128 bit number, starting from the left,
 * you have continuous bits turned on (with 1 value) followed by bits turned off (with 0 value). In networking, it
 * is used to demarcate which bits are used to identify a network, and the ones that are used to identify hosts
 * on the network
 */
export class IPv6Mask extends IPv6 {
    /**
     * An array of {@link Hexadecatet}'s
     *
     * @type {Array} the hexadecatet that makes up the IPv6 number
     */
    readonly hexadecatet: Array<Hexadecatet> = [];

    /**
     * The decimal value represented by the IPv6 number in BigInt
     */
    readonly value: bigint;


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
    static fromHexadecatet(rawValue:string):IPv6Mask {
        return new IPv6Mask(rawValue);
    };

    /**
     * Constructor for creating an instance of IPv6Mask.
     * The passed strings need to be a valid IPv6 mask number in dot-decimal notation
     *
     * @param {string} ipString The passed IPv6 string
     */
    constructor(ipString: string) {
        super(ipString);
        let isValid: boolean;
        let message: string[];
        let expandedIPv6 = expandIPv6Number(ipString);
        [isValid, message] = Validator.isValidIPv6Mask(expandedIPv6);

        if (!isValid) {
            throw new Error(message.filter(msg => {return msg !== '';}).toString());
        }

        let stringHexadecimals = expandedIPv6.split(":");
        this.hexadecatet = stringHexadecimals.map((stringHexadecatet) => {
            return Hexadecatet.fromString(stringHexadecatet)
        });

        let binaryString = hexadectetNotationToBinaryString(expandedIPv6);
        this.prefix  = (binaryString.match(/1/g) || []).length;
        this.value = BigInt(`0b${binaryString}`);

        this.value = BigInt(`0b${hexadectetNotationToBinaryString(expandedIPv6)}`);
    }
}

/**
 * Check is the given IP number is an {@link IPv4} or not
 * @param ip the IP number to check if it is IPv4.
 */
export function isIPv4(ip: AbstractIPNum): ip is IPv4 {
    return ip.bitSize === 32;
}