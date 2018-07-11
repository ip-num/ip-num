'use strict';
import {dottedDecimalNotationToBinaryString} from "./BinaryUtils";
import * as bigInt from "big-integer";
import {IPNumType} from "./IPNumType";
import {hexadectetNotationToBinaryString} from "./IPv6Utils";
import {expandIPv6Number} from "./IPv6Utils";

export class Validator {
    static IPV4_PATTERN: RegExp = new RegExp(/^(0?[0-9]?[0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.(0?[0-9]?[0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.(0?[0-9]?[0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.(0?[0-9]?[0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])$/);
    static IPV4_RANGE_PATTERN: RegExp = new RegExp(/^(0?[0-9]?[0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.(0?[0-9]?[0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.(0?[0-9]?[0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.(0?[0-9]?[0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])(\/)([1-9]|[1-2][0-9]|3[0-2])$/);
    static IPV6_RANGE_PATTERN: RegExp = new RegExp(/^s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:)))(%.+)?s*(\/([0-9]|[1-9][0-9]|1[0-1][0-9]|12[0-8]))?$/);
    static IPV4_SUBNET_MASK_BIT_PATTERN: RegExp = new RegExp(/^(1){0,32}(0){0,32}$/);
    static IPV6_SUBNET_MASK_BIT_PATTERN: RegExp = new RegExp(/^(1){0,128}(0){0,128}$/);

    static EIGHT_BIT_SIZE: bigInt.BigInteger = bigInt("1".repeat(8), 2);
    static SIXTEEN_BIT_SIZE: bigInt.BigInteger = bigInt("1".repeat(16), 2);
    static THIRTY_TWO_BIT_SIZE: bigInt.BigInteger = bigInt("1".repeat(32), 2);
    static ONE_HUNDRED_AND_TWENTY_EIGHT_BIT_SIZE: bigInt.BigInteger = bigInt("1".repeat(128), 2);

    static invalidAsnRangeMessage = "ASN number given less than zero or is greater than 32bit";
    static invalid16BitAsnRangeMessage = "ASN number given less than zero or is greater than 16bit";
    static invalidIPv4NumberMessage = "IPv4 number given less than zero or is greater than 32bit";
    static invalidIPv6NumberMessage = "IPv6 number given less than zero or is greater than 128bit";
    static invalidOctetRangeMessage = "Value given contains an invalid Octet; Value is less than zero or is greater than 8bit";
    static invalidHexadecatetMessage = "The value given is less than zero or is greater than 16bit";
    static invalidOctetCountMessage = "An IP4 number cannot have less or greater than 4 octets";
    static invalidHexadecatetCountMessage = "An IP6 number must have exactly 8 hexadecatet";
    static invalidSubnetMaskMessage = "The Subnet Mask is invalid";
    static invalidPrefixValueMessage = "A Prefix value cannot be less than 0 or greater than 32";
    static invalidIPv4CidrNotationMessage = "Cidr notation should be in the form [ip number]/[range]";
    static invalidIPv6CidrNotationString = "A Cidr notation string should contain an IPv6 number and prefix";
    static takeOutOfRangeSizeMessage = "$count is greater than $size, the size of the range";
    static cannotSplitSingleRangeErrorMessage = "Cannot split an IP range with a single IP number";
    static invalidInetNumType = "Given ipNumType must be either InetNumType.IPv4 or InetNumType.IPv6";

    /**
     * Checks if given ipNumber is in between the given lower and upper bound
     *
     * @param ipNumber ipNumber to check
     * @param lowerBound lower bound
     * @param upperBound upper bound
     * @returns {boolean} true if ipNumber is between lower and upper bound
     */
    private static isWithinRange(ipNumber: bigInt.BigInteger, lowerBound: bigInt.BigInteger, upperBound: bigInt.BigInteger) : boolean {
        return ipNumber.greaterOrEquals(lowerBound) && ipNumber.lesserOrEquals(upperBound);
    }

    /**
     * Checks if the number given is within the value considered valid for an ASN number
     *
     * @param asnNumber the asn number to validate
     * @returns {[boolean , string]} first value is true if valid ASN, false otherwise. Second value contains
     * "valid" or an error message when value is invalid
     */
    static isValidAsnNumber(asnNumber: bigInt.BigInteger): [boolean, string[]] {
        let isValid = this.isWithinRange(asnNumber, bigInt.zero, this.THIRTY_TWO_BIT_SIZE);
        return [isValid, isValid ? []: [Validator.invalidAsnRangeMessage]];
    }

    /**
     * Checks if the given ASN number is a 16bit ASN number
     *
     * @param {bigInt.BigInteger} asnNumber to check if 16bit or not
     * @returns {[boolean , string]} first value is true if valid 16bit ASN, false otherwise. Second value contains
     * "valid" or an error message when value is invalid
     */
    static isValid16BitAsnNumber(asnNumber: bigInt.BigInteger): [boolean, string[]] {
        let isValid = Validator.isWithinRange(asnNumber, bigInt.zero, Validator.SIXTEEN_BIT_SIZE);
        return [isValid, isValid ? []: [Validator.invalid16BitAsnRangeMessage]];
    }

    /**
     * Checks if the number given is within the value considered valid for an IPv4 number
     *
     * @param ipv4Number the asn number to validate
     * @returns {[boolean , string]} first value is true if valid IPv4 number, false otherwise. Second value contains
     * "valid" or an error message when value is invalid
     */
    static isValidIPv4Number(ipv4Number: bigInt.BigInteger): [boolean, string[]]  {
        let isValid = this.isWithinRange(ipv4Number, bigInt.zero, this.THIRTY_TWO_BIT_SIZE);
        return isValid ? [isValid, []]: [isValid, [Validator.invalidIPv4NumberMessage]];
    }

    /**
     * Checks if the number given is within the value considered valid for an IPv6 number
     *
     * @param ipv6Number the asn number to validate
     * @returns {[boolean , string]} first value is true if valid IPv6 number, false otherwise. Second value contains
     * "valid" or an error message when value is invalid
     */
    static isValidIPv6Number(ipv6Number: bigInt.BigInteger): [boolean, string[]] {
        let isValid = this.isWithinRange(ipv6Number, bigInt.zero, this.ONE_HUNDRED_AND_TWENTY_EIGHT_BIT_SIZE);
        return isValid ? [isValid, []]: [isValid, [Validator.invalidIPv6NumberMessage]];
    }

    /**
     * Checks if the number given is valid for an IPv4 octet
     *
     * @param octetNumber the octet value
     * @returns {boolean} true if valid octet, false otherwise
     */
    static isValidIPv4Octet(octetNumber: bigInt.BigInteger): [boolean, string[]] {
        let withinRange = this.isWithinRange(octetNumber, bigInt.zero, this.EIGHT_BIT_SIZE);
        return [withinRange, withinRange ? []: [Validator.invalidOctetRangeMessage]];
    }

    /**
     * Checks if the number given is valid for an IPv6 hexadecatet
     *
     * @param {bigInt.BigInteger} hexadecatetNum the hexadecatet value
     * @returns {[boolean , string]} first value is true if valid hexadecatet, false otherwise. Second value contains
     * "valid" or an error message when value is invalid
     */
    static isValidIPv6Hexadecatet(hexadecatetNum: bigInt.BigInteger): [boolean, string[]] {
        let isValid = this.isWithinRange(hexadecatetNum, bigInt.zero, this.SIXTEEN_BIT_SIZE);
        return isValid ? [isValid, []]: [isValid, [Validator.invalidHexadecatetMessage]];
    }

    /**
     * Checks if given string is a valid IPv4 value.
     *
     * @param {string} ipv4String the IPv4 string to validate
     * @returns {[boolean , string]} result of validation, first value represents if is valid IPv4, second value
     * contains error message if invalid IPv4
     */
    static isValidIPv4String(ipv4String: string): [boolean, string[]] {
        let rawOctets = ipv4String.split(".");

        if (rawOctets.length != 4 || rawOctets.includes('')) {
            return [false, [Validator.invalidOctetCountMessage]];
        }

        let isValid = rawOctets.every(octet => {
            return Validator.isNumeric(octet) ? Validator.isValidIPv4Octet(bigInt(octet))[0] : false;
        });

        return [isValid, isValid ? []: [Validator.invalidOctetRangeMessage]];
    }

    /**
     * Checks if given string is a valid IPv6 value.
     *
     * @param {string} ipv6String the IPv6 string to validate
     * @returns {[boolean , string]} result of validation, first value represents if is valid IPv6, second value
     * contains error message if invalid IPv6
     */
    static isValidIPv6String(ipv6String: string): [boolean, string[]] {
        try {
            let hexadecimals = expandIPv6Number(ipv6String).split(":");
            if (hexadecimals.length != 8 ) {
                return [false, [Validator.invalidHexadecatetCountMessage]]
            }

            let isValid = hexadecimals.every(hexadecimal => {
                return Validator.isHexadecatet(hexadecimal) ?
                    Validator.isValidIPv6Hexadecatet(bigInt(parseInt(hexadecimal, 16)))[0] : false;
            });

            return [isValid, isValid? []: [Validator.invalidHexadecatetMessage]];
        } catch (error) {
            return [false, [error]]
        }
    }

    /**
     * Checks if given value is a valid prefix value
     *
     * @param prefixValue value to check
     * @param ipNumType The type of IP number
     * @returns {(boolean|string)[]} a tuple representing if valid or not and corresponding message
     */
    static isValidPrefixValue(prefixValue: number, ipNumType: IPNumType): [boolean, string[]] {
        if (IPNumType.IPv4 === ipNumType) {
            let withinRange = Validator.isWithinRange(bigInt(prefixValue), bigInt.zero, bigInt(32));
            return [withinRange, withinRange ? []: [Validator.invalidPrefixValueMessage]];
        }
        if (IPNumType.IPv6 === ipNumType) {
            let withinRange = Validator.isWithinRange(bigInt(prefixValue), bigInt.zero, bigInt(128));
            return [withinRange, withinRange ? []: [Validator.invalidPrefixValueMessage]];
        }
        return [false, [Validator.invalidInetNumType]]
    }

    /**
     * Checks if given string is a valid IPv4 subnet mask
     *
     * @param {string} ipv4SubnetMaskString the given IPv4 subnet mask string
     * @returns {[boolean , string]} first value is true if valid IPv4 subnet mask string, false otherwise. Second value
     * contains "valid" or an error message when value is invalid
     */
    static isValidIPv4SubnetMask(ipv4SubnetMaskString: string) : [boolean, string[]] {
        let ipv4InBinary = dottedDecimalNotationToBinaryString(ipv4SubnetMaskString);
        let isValid = Validator.IPV4_SUBNET_MASK_BIT_PATTERN.test(ipv4InBinary);
        return isValid ? [isValid, []]: [isValid, [Validator.invalidSubnetMaskMessage]];
    }

    /**
     * Checks if given string is a valid IPv6 subnet mask
     *
     * @param {string} ipv6SubnetMaskString the given IPv6 subnet mask string
     * @returns {[boolean , string]} first value is true if valid IPv6 subnet mask string, false otherwise. Second value
     * contains "valid" or an error message when value is invalid
     */
    static isValidIPv6SubnetMask(ipv6SubnetMaskString: string) : [boolean, string[]] {
        let ipv6InBinary = hexadectetNotationToBinaryString(ipv6SubnetMaskString);
        let isValid = Validator.IPV6_SUBNET_MASK_BIT_PATTERN.test(ipv6InBinary);
        return isValid ? [isValid, []]: [isValid, [Validator.invalidSubnetMaskMessage]];
    }

    /**
     * Checks if the given string is a valid IPv4 range in Cidr notation
     *
     * @param {string} ipv4RangeAsCidrString the IPv4 range in Cidr notation
     *
     * @returns {[boolean , string[]]} first value is true if valid IPv4 range in Cidr notation, false otherwise. Second
     * value contains "valid" or an error message when value is invalid
     */
    static isValidIPv4CidrNotation(ipv4RangeAsCidrString: string): [boolean, string[]] {
        let cidrComponents = ipv4RangeAsCidrString.split("/");
        if(cidrComponents.length !== 2 || (cidrComponents[0].length === 0 || cidrComponents[1].length === 0)) {
            return [false, [Validator.invalidIPv4CidrNotationMessage]];
        }

        let ip = cidrComponents[0];
        let range = cidrComponents[1];

        if (isNaN(Number(range))) {
            return [false, [Validator.invalidIPv4CidrNotationMessage]];
        }

        let [validIpv4, invalidIpv4Message] = Validator.isValidIPv4String(ip);
        let [validPrefix, invalidPrefixMessage] = Validator.isValidPrefixValue(Number(range), IPNumType.IPv4);

        let isValid = validIpv4 && validPrefix;
        let invalidMessage = invalidIpv4Message.concat(invalidPrefixMessage);

        return isValid ? [isValid, []]: [isValid, invalidMessage];
    }

    /**
     * Checks if the given string is a valid IPv6 range in Cidr notation
     *
     * @param {string} ipv6RangeAsCidrString the IPv6 range in Cidr notation
     *
     * @returns {[boolean , string]} first value is true if valid IPv6 range in Cidr notation, false otherwise.
     * Second value contains "valid" or an error message when value is invalid
     */
    // TODO change to be like isValidIPv4CidrNotation where validation is done on the component of the cidr notation
    // instead of a single regex check
    static isValidIPv6CidrNotation(ipv6RangeAsCidrString: string): [boolean, string[]] {
        let isValid = Validator.IPV6_RANGE_PATTERN.test(ipv6RangeAsCidrString);
        return isValid ? [isValid, []]: [isValid, [Validator.invalidIPv6CidrNotationString]];
    }

    private static isNumeric(value: string): boolean {
        return /^(\d+)$/.test(value)
    }

    private static isHexadecatet(value: string): boolean {
        return /^[0-9A-Fa-f]{4}$/.test(value)
    }

}

