"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isIPv4 = exports.IPv6Mask = exports.IPv4Mask = exports.IPv6 = exports.Asn = exports.IPv4 = exports.AbstractIPNum = void 0;
const Octet_1 = require("./Octet");
const Validator_1 = require("./Validator");
const BinaryUtils_1 = require("./BinaryUtils");
const BinaryUtils_2 = require("./BinaryUtils");
const BinaryUtils_3 = require("./BinaryUtils");
const BinaryUtils_4 = require("./BinaryUtils");
const Hexadecatet_1 = require("./Hexadecatet");
const HexadecimalUtils_1 = require("./HexadecimalUtils");
const IPv6Utils_1 = require("./IPv6Utils");
const HexadecimalUtils_2 = require("./HexadecimalUtils");
/**
 * Provides the implementation of functionality that are common
 * to {@link IPv4}, {@link IPv6}, {@link IPv4Mask} and {@link IPv6Mask}
 */
class AbstractIPNum {
    /**
     * Gets the numeric value of an IP number as {@link BigInt}
     *
     * @returns bigInt the numeric value of an IP number.
     */
    getValue() {
        return this.value;
    }
    /**
     * Gets the binary string representation of an IP number.
     *
     * @returns {string} the string binary representation.
     */
    toBinaryString() {
        return BinaryUtils_3.leftPadWithZeroBit(this.value.toString(2), this.bitSize);
    }
    /**
     * Checks if an IP number has a value greater than the present value
     * @returns {boolean} true, if there is a value greater than the present value. Returns false otherwise.
     */
    hasNext() {
        return this.value < this.maximumBitSize;
    }
    /**
     * Checks if an IP number has a value lesser than the present value
     * @returns {boolean} true, if there is a value lesser than the present value. Returns false otherwise.
     */
    hasPrevious() {
        return this.value > 0n;
    }
    /**
     * Checks if the given IP number, is equals to the current IP number
     *
     * @param {AbstractIPNum} anotherIPNum the other IP number to compare with
     * @returns {boolean} true if the given IP number is equals
     */
    isEquals(anotherIPNum) {
        return this.value === anotherIPNum.value;
    }
    /**
     * Checks if the given IP number is lesser than this current IP number
     *
     * @param {AbstractIPNum} anotherIPNum the other IP number to compare with
     * @returns {boolean} true if the given IP number is less than this current one. False otherwise.
     */
    isLessThan(anotherIPNum) {
        return this.value < anotherIPNum.value;
    }
    /**
     * Checks if the given IP number is greater than this current IP number
     *
     * @param {AbstractIPNum} anotherIPNum the other IP number to compare with
     * @returns {boolean} true if the given IP number is greater than this current one. False otherwise.
     */
    isGreaterThan(anotherIPNum) {
        return this.value > anotherIPNum.value;
    }
    /**
     * Checks if the given IP number is less than or equals to this current IP number
     *
     * @param {AbstractIPNum} anotherIPNum the other IP number to compare with
     * @returns {boolean} true if the given IP number is less than or equals to this current one. False otherwise.
     */
    isLessThanOrEquals(anotherIPNum) {
        return this.value <= anotherIPNum.value;
    }
    /**
     * Checks if the given IP number is greater than or equals to this current IP number
     *
     * @param {AbstractIPNum} anotherIPNum the other IP number to compare with
     * @returns {boolean} {boolean} true if the given IP number is greater than or equals to this current one. False
     * otherwise.
     */
    isGreaterThanOrEquals(anotherIPNum) {
        return this.value >= anotherIPNum.value;
    }
}
exports.AbstractIPNum = AbstractIPNum;
/**
 * Represents an IPv4 number. A 32 bit number that is used to uniquely identify a device that is part of a computer
 * network that uses the internet protocol for communication.
 *
 * @see https://en.wikipedia.org/wiki/IPv4
 * @see https://www.rfc-editor.org/info/rfc791
 */
class IPv4 extends AbstractIPNum {
    /**
     * Constructor for an IPv4 number.
     *
     * @param {string | bigint} ipValue value to construct an IPv4 from. The given value can either be
     * numeric or string. If a string is given then it needs to be in dot-decimal notation
     */
    constructor(ipValue) {
        super();
        /**
         * The number of bits needed to represents the value of the IPv4 number
         */
        this.bitSize = 32;
        /**
         * The maximum bit size (i.e. binary value) of the IPv4 number in BigInt
         */
        this.maximumBitSize = Validator_1.Validator.THIRTY_TWO_BIT_SIZE;
        /**
         * The type of IP number. Value is one of the values of the {@link IPNumType} enum
         * @type {IPNumType} the type of IP number
         */
        this.type = "IPv4" /* IPv4 */;
        /**
         * An array of {@link Octet}'s
         *
         * @type {Array} the octets that makes up the IPv4 number
         */
        this.octets = [];
        /**
         * The string character used to separate the individual octets when the IPv4 is rendered as strings
         *
         * @type {string} The string character used to separate the individual octets when rendered as strings
         */
        this.separator = ".";
        if (typeof ipValue === "string") {
            let [value, octets] = this.constructFromDecimalDottedString(ipValue);
            this.value = value;
            this.octets = octets;
        }
        else {
            let [value, octets] = this.constructFromBigIntValue(ipValue);
            this.value = value;
            this.octets = octets;
        }
    }
    /**
     * A convenience method for creating an {@link IPv4} by providing the decimal value of the IP number in BigInt
     *
     * @param {bigint} bigIntValue the decimal value of the IP number in BigInt
     * @returns {IPv4} the IPv4 instance
     */
    static fromNumber(bigIntValue) {
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
    static fromDecimalDottedString(ipString) {
        return new IPv4(ipString);
    }
    /**
     * Alias for IPv4.fromDecimalDottedString.
     *
     * @param {string} ipString the IP number in dot-decimal notation
     * @returns {IPv4} the IPv4 instance
     */
    static fromString(ipString) {
        return IPv4.fromDecimalDottedString(ipString);
    }
    /**
     * A convenience method for creating an {@link IPv4} from binary string
     *
     * @param {string} ipBinaryString the binary string representing the IPv4 number to be created
     * @returns {IPv4} the IPv4 instance
     */
    static fromBinaryString(ipBinaryString) {
        let validationResult = Validator_1.Validator.isValidBinaryString(ipBinaryString);
        if (validationResult[0]) {
            return new IPv4(BinaryUtils_2.parseBinaryStringToBigInt(ipBinaryString));
        }
        else {
            throw Error(validationResult[1].join(','));
        }
    }
    /**
     * A string representation of the IPv4 number. The string representation is in dot-decimal notation
     *
     * @returns {string} The string representation in dot-decimal notation
     */
    toString() {
        return this.octets.map((value) => { return value.toString(); }).join(this.separator);
    }
    /**
     * Gets the individual {@link Octet} that makes up the IPv4 number
     *
     * @returns {Array<Octet>} The individual {@link Octet} that makes up the IPv4 number
     */
    getOctets() {
        return this.octets;
    }
    /**
     * Returns the next IPv4 number
     *
     * @returns {IPv4} the next IPv4 number
     */
    nextIPNumber() {
        return IPv4.fromNumber(this.getValue() + 1n);
    }
    /**
     * Returns the previous IPv4 number
     *
     * @returns {IPv4} the previous IPv4 number
     */
    previousIPNumber() {
        return IPv4.fromNumber(this.getValue() - 1n);
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
    toIPv4MappedIPv6() {
        let binary = '1'.repeat(16) + this.toBinaryString();
        return IPv6.fromBinaryString(binary);
    }
    constructFromDecimalDottedString(ipString) {
        let octets;
        let value;
        let [isValid, message] = Validator_1.Validator.isValidIPv4String(ipString);
        if (!isValid) {
            throw new Error(message.filter(msg => { return msg !== ''; }).toString());
        }
        let stringOctets = ipString.split(".");
        octets = stringOctets.map((rawOctet) => {
            return Octet_1.Octet.fromString(rawOctet);
        });
        value = BigInt(`0b${BinaryUtils_1.dottedDecimalNotationToBinaryString(ipString)}`);
        return [value, octets];
    }
    constructFromBigIntValue(ipv4Number) {
        let [isValid, message] = Validator_1.Validator.isValidIPv4Number(ipv4Number);
        if (!isValid) {
            throw new Error(message.filter(msg => { return msg !== ''; }).toString());
        }
        let binaryString = BinaryUtils_4.numberToBinaryString(ipv4Number);
        ipv4Number = typeof ipv4Number === "bigint" ? ipv4Number : BigInt(ipv4Number);
        return [ipv4Number, this.binaryStringToDecimalOctets(binaryString)];
    }
    binaryStringToDecimalOctets(ipv4BinaryString) {
        if (ipv4BinaryString.length < 32) {
            ipv4BinaryString = BinaryUtils_3.leftPadWithZeroBit(ipv4BinaryString, 32);
        }
        let octets = ipv4BinaryString.match(/.{1,8}/g);
        return octets.map((octet) => {
            return Octet_1.Octet.fromString(BinaryUtils_2.parseBinaryStringToBigInt(octet).toString());
        });
    }
}
exports.IPv4 = IPv4;
/**
 * Represents an Autonomous System Number. Which is a number that is used to identify
 * a group of IP addresses with a common, clearly defined routing policy.
 *
 * @see https://en.wikipedia.org/wiki/Autonomous_system_(Internet)
 * @see https://tools.ietf.org/html/rfc5396
 */
class Asn extends AbstractIPNum {
    /**
     * Constructor for an instance of {@link ASN}
     *
     * @param {string | number} rawValue value to construct an ASN from. The given value can either be numeric or
     * string. If in string then it can be in asplain, asdot or asdot+ string representation format
     */
    constructor(rawValue) {
        super();
        /**
         * The number of bits needed to represents the value of the ASN number
         */
        this.bitSize = 32;
        /**
         * The maximum bit size (i.e. binary value) of the ASN number in BigInt
         */
        this.maximumBitSize = Validator_1.Validator.THIRTY_TWO_BIT_SIZE;
        this.type = "ASN" /* ASN */;
        if (typeof rawValue === 'string') {
            if (Asn.startWithASPrefix(rawValue)) {
                this.value = BigInt(parseInt(rawValue.substring(2)));
            }
            else if (rawValue.indexOf(".") != -1) {
                this.value = BigInt(this.parseFromDotNotation(rawValue));
            }
            else {
                this.value = BigInt(parseInt(rawValue));
            }
        }
        else {
            let valueAsBigInt = BigInt(rawValue);
            let [isValid, message] = Validator_1.Validator.isValidAsnNumber(valueAsBigInt);
            if (!isValid) {
                throw Error(message.filter(msg => { return msg !== ''; }).toString());
            }
            this.value = valueAsBigInt;
        }
    }
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
    static fromString(rawValue) {
        return new Asn(rawValue);
    }
    ;
    /**
     * A convenience method for creating an instance of {@link Asn} from a numeric value
     *
     * @param {number} rawValue the asn numeric value
     * @returns {Asn} the constructed ASN instance
     */
    static fromNumber(rawValue) {
        return new Asn(rawValue);
    }
    ;
    /**
     * A convenience method for creating an instance of {@link Asn} from a binary string
     *
     * @param {string} binaryString to create an ASN instance from
     * @returns {Asn} the constructed ASN instance
     */
    static fromBinaryString(binaryString) {
        let validationResult = Validator_1.Validator.isValidBinaryString(binaryString);
        if (validationResult[0]) {
            return new Asn(parseInt(binaryString, 2));
        }
        else {
            throw Error(validationResult[1].join(','));
        }
    }
    /**
     * A string representation where the asn value is prefixed by "ASN". For example "AS65526"
     *
     * @returns {string} A string representation where the asn value is prefixed by "ASN"
     */
    toString() {
        let stringValue = this.value.toString();
        return `${Asn.AS_PREFIX}${stringValue}`;
    }
    /**
     * A string representation where the ASN numeric value of is represented as a string. For example "65526"
     *
     * @returns {string} A string representation where the ASN numeric value of is represented as a string
     */
    toASPlain() {
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
    toASDot() {
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
    toASDotPlus() {
        let high = this.value.valueOf() / 65535n;
        let low = (this.value.valueOf() % 65535n) - high;
        return `${high}.${low}`;
    }
    /**
     * Converts the ASN value to binary numbers represented with strings
     *
     * @returns {string} a binary string representation of the value of the ASN number
     */
    toBinaryString() {
        return BinaryUtils_4.numberToBinaryString(this.value);
    }
    /**
     * Checks if the ASN value is 16bit
     *
     * @returns {boolean} true if the ASN is a 16bit value. False otherwise.
     */
    is16Bit() {
        let [valid16BitAsnNumber,] = Validator_1.Validator.isValid16BitAsnNumber(this.value);
        return valid16BitAsnNumber;
    }
    /**
     * Checks if the ASN value is 32bit
     *
     * @returns {boolean} true if the ASN is a 32bit value. False otherwise.
     */
    is32Bit() {
        return !this.is16Bit();
    }
    /**
     * Returns the next ASN number
     *
     * @returns {AbstractIPNum} the next ASN number
     */
    nextIPNumber() {
        return new Asn(this.value.valueOf() + 1n);
    }
    /**
     * Returns the previous ASN number
     *
     * @returns {AbstractIPNum} the previous ASN number
     */
    previousIPNumber() {
        return new Asn(this.value.valueOf() - 1n);
    }
    static startWithASPrefix(word) {
        return word.indexOf(Asn.AS_PREFIX) === 0;
    }
    parseFromDotNotation(rawValue) {
        let values = rawValue.split(".");
        let high = parseInt(values[0]);
        let low = parseInt(values[1]);
        return (high * 65535) + (low + high);
    }
}
exports.Asn = Asn;
Asn.AS_PREFIX = "AS";
/**
 * Represents an IPv6 number. A 128 bit number that is used to uniquely identify a device that is part of a computer
 * network that uses the internet protocol for communication.
 *
 * @see https://en.wikipedia.org/wiki/IPv6
 * @see https://www.rfc-editor.org/info/rfc8200
 */
class IPv6 extends AbstractIPNum {
    /**
     * Constructor for an IPv6 number.
     *
     * @param {string | bigint} ipValue value to construct an IPv6 from. The given value can either be
     * numeric or string. If a string is given then it needs to be in hexadecatet string notation
     */
    constructor(ipValue) {
        super();
        /**
         * The number of bits needed to represents the value of the IPv6 number
         */
        this.bitSize = 128;
        /**
         * The maximum bit size (i.e. binary value) of the IPv6 number in BigInt
         */
        this.maximumBitSize = Validator_1.Validator.ONE_HUNDRED_AND_TWENTY_EIGHT_BIT_SIZE;
        /**
         * The type of IP number. Value is one of the values of the {@link IPNumType} enum
         * @type {IPNumType} the type of IP number
         */
        this.type = "IPv6" /* IPv6 */;
        /**
         * An array of {@link Hexadecatet}'s
         *
         * @type {Array} the hexadecatet that makes up the IPv6 number
         */
        this.hexadecatet = [];
        /**
         * The string character used to separate the individual hexadecatet when the IPv6 is rendered as strings
         *
         * @type {string} The string character used to separate the individual hexadecatet when rendered as strings
         */
        this.separator = ":";
        if (typeof ipValue === "string") {
            let expandedIPv6 = IPv6Utils_1.expandIPv6Number(ipValue);
            let [value, hexadecatet] = this.constructFromHexadecimalDottedString(expandedIPv6);
            this.value = value;
            this.hexadecatet = hexadecatet;
        }
        else {
            let [value, hexadecatet] = this.constructFromBigIntValue(ipValue);
            this.value = value;
            this.hexadecatet = hexadecatet;
        }
    }
    /**
     * A convenience method for creating an {@link IPv6} by providing the decimal value of the IP number in BigInt
     *
     * @param {bigint} bigIntValue the decimal value of the IP number in BigInt
     * @returns {IPv6} the IPv6 instance
     */
    static fromBigInt(bigIntValue) {
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
    static fromHexadecatet(ipString) {
        return new IPv6(ipString);
    }
    /**
     * Alias for IPv6.fromHexadecimalString
     *
     * @param {string} ipString the IP number in hexadecatet
     * @returns {IPv6} the IPv6 instance
     */
    static fromString(ipString) {
        return IPv6.fromHexadecatet(ipString);
    }
    /**
     * A convenience method for creating an {@link IPv6} from binary string
     *
     * @param {string} ipBinaryString the binary string representing the IPv6 number to be created
     * @returns {IPv6} the IPv6 instance
     */
    static fromBinaryString(ipBinaryString) {
        let validationResult = Validator_1.Validator.isValidBinaryString(ipBinaryString);
        if (validationResult[0]) {
            let paddedBinaryString = BinaryUtils_3.leftPadWithZeroBit(ipBinaryString, 128);
            return new IPv6(BinaryUtils_2.parseBinaryStringToBigInt(paddedBinaryString));
        }
        else {
            throw Error(validationResult[1].join(','));
        }
    }
    /**
     * A convenience method for creating an IPv4-Compatible {@link IPv6} Address from an instance of {@link IPv4}
     *
     * @param {IPv4} ipv4 to create an IPv4-Compatible {@link IPv6} Address
     * @returns {IPv6} the IPv4-Compatible {@link IPv6} Address
     */
    static fromIPv4(ipv4) {
        return ipv4.toIPv4MappedIPv6();
    }
    /**
     * A convenience method for creating an IPv4-Compatible {@link IPv6} Address from a IPv4 represented in
     * dot-decimal notation i.e. 127.0.0.1
     *
     * @param {IPv4} ip4DotDecimalString string represented in a dot decimal string
     * @returns {IPv6} the IPv4-Compatible {@link IPv6} Address
     */
    static fromIPv4DotDecimalString(ip4DotDecimalString) {
        return new IPv4(ip4DotDecimalString).toIPv4MappedIPv6();
    }
    /**
     * A string representation of the IPv6 number.
     *
     * @returns {string} The string representation of IPv6
     */
    toString() {
        let ipv6String = this.hexadecatet.map((value) => { return value.toString(); }).join(":");
        if (this.hexadecatet.length < 8) {
            return "::" + ipv6String;
        }
        else {
            return ipv6String;
        }
    }
    /**
     * Gets the individual {@link Hexadecatet} that makes up the IPv6 number
     *
     * @returns {Array<Hexadecatet>} The individual {@link Hexadecatet} that makes up the IPv6 number
     */
    //TODO maybe rename to something like getSegments? so it can be same with getOctet
    getHexadecatet() {
        return this.hexadecatet;
    }
    /**
     * Returns the next IPv6 number
     *
     * @returns {IPv6} the next IPv6 number
     */
    nextIPNumber() {
        return IPv6.fromBigInt(this.getValue() + 1n);
    }
    /**
     * Returns the previous IPv6 number
     *
     * @returns {IPv6} the previous IPv6 number
     */
    previousIPNumber() {
        return IPv6.fromBigInt(this.getValue() - 1n);
    }
    constructFromBigIntValue(ipv6Number) {
        let [isValid, message] = Validator_1.Validator.isValidIPv6Number(ipv6Number);
        if (!isValid) {
            throw new Error(message.filter(msg => { return msg !== ''; }).toString());
        }
        let binaryString = BinaryUtils_4.numberToBinaryString(ipv6Number);
        return [ipv6Number, this.binaryStringToHexadecatets(binaryString)];
    }
    constructFromHexadecimalDottedString(expandedIPv6) {
        let [isValid, message] = Validator_1.Validator.isValidIPv6String(expandedIPv6);
        if (!isValid) {
            throw new Error(message.filter(msg => { return msg !== ''; }).toString());
        }
        let stringHexadecimals = expandedIPv6.split(":");
        let hexadecatet = stringHexadecimals.map((stringHexadecatet) => {
            return Hexadecatet_1.Hexadecatet.fromString(stringHexadecatet);
        });
        let value = BigInt(`0b${HexadecimalUtils_2.hexadectetNotationToBinaryString(expandedIPv6)}`);
        return [value, hexadecatet];
    }
    binaryStringToHexadecatets(binaryString) {
        let hexadecimalString = HexadecimalUtils_1.binaryStringToHexadecimalString(binaryString);
        while (hexadecimalString.length % 4 != 0) {
            hexadecimalString = '0' + hexadecimalString;
        }
        let hexadecimalStrings = hexadecimalString.match(/.{1,4}/g);
        return hexadecimalStrings.map((stringHexadecatet) => {
            return Hexadecatet_1.Hexadecatet.fromString(stringHexadecatet);
        });
    }
}
exports.IPv6 = IPv6;
/**
 * The IPv4Mask can be seen as a specialized IPv4 number where, in a 32 bit number, starting from the left, you
 * have continuous bits turned on (with 1 value) followed by bits turned off (with 0 value). In networking, it is used
 * to demarcate which bits are used to identify a network, and the ones that are used to identify hosts on the network
 */
class IPv4Mask extends IPv4 {
    /**
     * Constructor for creating an instance of IPv4Mask.
     * The passed strings need to be a valid IPv4 mask number in dot-decimal notation.
     *
     * @param {string} ipString The passed string in dot-decimal notation
     */
    constructor(ipString) {
        super(ipString);
        /**
         * An array of {@link Octet}'s
         *
         * @type {Array} the octets that makes up the IPv4Mask
         */
        this.octets = [];
        let isValid;
        let message;
        [isValid, message] = Validator_1.Validator.isValidIPv4Mask(ipString);
        if (!isValid) {
            throw new Error(message.filter(msg => { return msg !== ''; }).toString());
        }
        let stringOctets = ipString.split(".");
        this.octets = stringOctets.map((rawOctet) => {
            return Octet_1.Octet.fromString(rawOctet);
        });
        let binaryString = BinaryUtils_1.dottedDecimalNotationToBinaryString(ipString);
        this.prefix = (binaryString.match(/1/g) || []).length;
        this.value = BigInt(`0b${binaryString}`);
    }
    /**
     * A convenience method for creating an instance of IPv4Mask. The passed strings need to be a valid IPv4
     * number in dot-decimal notation.
     *
     * @param {string} rawValue The passed string in dot-decimal notation
     * @returns {IPv4Mask} the instance of IPv4Mask
     */
    static fromDecimalDottedString(rawValue) {
        return new IPv4Mask(rawValue);
    }
    ;
}
exports.IPv4Mask = IPv4Mask;
/**
 * The IPv6Mask can be seen as a specialized IPv4 number where, in a 128 bit number, starting from the left,
 * you have continuous bits turned on (with 1 value) followed by bits turned off (with 0 value). In networking, it
 * is used to demarcate which bits are used to identify a network, and the ones that are used to identify hosts
 * on the network
 */
class IPv6Mask extends IPv6 {
    /**
     * Constructor for creating an instance of IPv6Mask.
     * The passed strings need to be a valid IPv6 mask number in dot-decimal notation
     *
     * @param {string} ipString The passed IPv6 string
     */
    constructor(ipString) {
        super(ipString);
        /**
         * An array of {@link Hexadecatet}'s
         *
         * @type {Array} the hexadecatet that makes up the IPv6 number
         */
        this.hexadecatet = [];
        let isValid;
        let message;
        let expandedIPv6 = IPv6Utils_1.expandIPv6Number(ipString);
        [isValid, message] = Validator_1.Validator.isValidIPv6Mask(expandedIPv6);
        if (!isValid) {
            throw new Error(message.filter(msg => { return msg !== ''; }).toString());
        }
        let stringHexadecimals = expandedIPv6.split(":");
        this.hexadecatet = stringHexadecimals.map((stringHexadecatet) => {
            return Hexadecatet_1.Hexadecatet.fromString(stringHexadecatet);
        });
        let binaryString = HexadecimalUtils_2.hexadectetNotationToBinaryString(expandedIPv6);
        this.prefix = (binaryString.match(/1/g) || []).length;
        this.value = BigInt(`0b${binaryString}`);
        this.value = BigInt(`0b${HexadecimalUtils_2.hexadectetNotationToBinaryString(expandedIPv6)}`);
    }
    /**
     * A convenience method for creating an instance of IPv6Mask.
     * The passed strings need to be a valid IPv4 mask number in dot-decimal notation.
     *
     * @param {string} rawValue The passed string in textual notation
     * @returns {IPv6Mask} the instance of IPv6Mask
     */
    static fromHexadecatet(rawValue) {
        return new IPv6Mask(rawValue);
    }
    ;
}
exports.IPv6Mask = IPv6Mask;
/**
 * Check is the given IP number is an {@link IPv4} or not
 * @param ip the IP number to check if it is IPv4.
 */
function isIPv4(ip) {
    return ip.bitSize === 32;
}
exports.isIPv4 = isIPv4;
//# sourceMappingURL=IPNumber.js.map