import * as bigInt from "big-integer";
import { IPNumType } from "./IPNumType";
export declare class Validator {
    static IPV4_PATTERN: RegExp;
    static IPV4_RANGE_PATTERN: RegExp;
    static IPV6_RANGE_PATTERN: RegExp;
    static IPV4_CONTIGUOUS_MASK_BIT_PATTERN: RegExp;
    static IPV6_CONTIGUOUS_MASK_BIT_PATTERN: RegExp;
    static EIGHT_BIT_SIZE: bigInt.BigInteger;
    static SIXTEEN_BIT_SIZE: bigInt.BigInteger;
    static THIRTY_TWO_BIT_SIZE: bigInt.BigInteger;
    static ONE_HUNDRED_AND_TWENTY_EIGHT_BIT_SIZE: bigInt.BigInteger;
    static IPV4_SIZE: bigInt.BigInteger;
    static IPV6_SIZE: bigInt.BigInteger;
    static invalidAsnRangeMessage: string;
    static invalid16BitAsnRangeMessage: string;
    static invalidIPv4NumberMessage: string;
    static invalidIPv6NumberMessage: string;
    static invalidOctetRangeMessage: string;
    static invalidHexadecatetMessage: string;
    static invalidOctetCountMessage: string;
    static invalidHexadecatetCountMessage: string;
    static invalidMaskMessage: string;
    static invalidPrefixValueMessage: string;
    static invalidIPv4CidrNotationMessage: string;
    static InvalidIPCidrRangeMessage: string;
    static invalidRangeNotationMessage: string;
    static invalidRangeFirstNotGreaterThanLastMessage: string;
    static invalidIPv6CidrNotationString: string;
    static takeOutOfRangeSizeMessage: string;
    static cannotSplitSingleRangeErrorMessage: string;
    static invalidInetNumType: string;
    static invalidBinaryStringErrorMessage: string;
    static invalidIPRangeSizeMessage: string;
    static invalidIPRangeSizeForCidrMessage: string;
    /**
     * Checks if given ipNumber is in between the given lower and upper bound
     *
     * @param ipNumber ipNumber to check
     * @param lowerBound lower bound
     * @param upperBound upper bound
     * @returns {boolean} true if ipNumber is between lower and upper bound
     */
    private static isWithinRange;
    /**
     * Checks if the number given is within the value considered valid for an ASN number
     *
     * @param asnNumber the asn number to validate
     * @returns {[boolean , string]} first value is true if valid ASN, false otherwise. Second value contains
     * "valid" or an error message when value is invalid
     */
    static isValidAsnNumber(asnNumber: bigInt.BigInteger): [boolean, string[]];
    /**
     * Checks if the given ASN number is a 16bit ASN number
     *
     * @param {bigInt.BigInteger} asnNumber to check if 16bit or not
     * @returns {[boolean , string]} first value is true if valid 16bit ASN, false otherwise. Second value contains
     * "valid" or an error message when value is invalid
     */
    static isValid16BitAsnNumber(asnNumber: bigInt.BigInteger): [boolean, string[]];
    /**
     * Checks if the number given is within the value considered valid for an IPv4 number
     *
     * @param ipv4Number the asn number to validate
     * @returns {[boolean , string]} first value is true if valid IPv4 number, false otherwise. Second value contains
     * "valid" or an error message when value is invalid
     */
    static isValidIPv4Number(ipv4Number: bigInt.BigInteger): [boolean, string[]];
    /**
     * Checks if the number given is within the value considered valid for an IPv6 number
     *
     * @param ipv6Number the asn number to validate
     * @returns {[boolean , string]} first value is true if valid IPv6 number, false otherwise. Second value contains
     * "valid" or an error message when value is invalid
     */
    static isValidIPv6Number(ipv6Number: bigInt.BigInteger): [boolean, string[]];
    /**
     * Checks if the number given is valid for an IPv4 octet
     *
     * @param octetNumber the octet value
     * @returns {boolean} true if valid octet, false otherwise
     */
    static isValidIPv4Octet(octetNumber: bigInt.BigInteger): [boolean, string[]];
    /**
     * Checks if the number given is valid for an IPv6 hexadecatet
     *
     * @param {bigInt.BigInteger} hexadecatetNum the hexadecatet value
     * @returns {[boolean , string]} first value is true if valid hexadecatet, false otherwise. Second value contains
     * "valid" or an error message when value is invalid
     */
    static isValidIPv6Hexadecatet(hexadecatetNum: bigInt.BigInteger): [boolean, string[]];
    /**
     * Checks if given string is a valid IPv4 value.
     *
     * @param {string} ipv4String the IPv4 string to validate
     * @returns {[boolean , string]} result of validation, first value represents if is valid IPv4, second value
     * contains error message if invalid IPv4
     */
    static isValidIPv4String(ipv4String: string): [boolean, string[]];
    /**
     * Checks if given string is a valid IPv6 value.
     *
     * @param {string} ipv6String the IPv6 string to validate
     * @returns {[boolean , string]} result of validation, first value represents if is valid IPv6, second value
     * contains error message if invalid IPv6
     */
    static isValidIPv6String(ipv6String: string): [boolean, string[]];
    /**
     * Checks if given value is a valid prefix value
     *
     * @param prefixValue value to check
     * @param ipNumType The type of IP number
     * @returns {(boolean|string)[]} a tuple representing if valid or not and corresponding message
     */
    static isValidPrefixValue(prefixValue: number, ipNumType: IPNumType): [boolean, string[]];
    /**
     * Checks if given string is a valid IPv4 mask
     *
     * @param {string} ipv4MaskString the given IPv4 mask string
     * @returns {[boolean , string]} first value is true if valid IPv4 mask string, false otherwise. Second value
     * contains "valid" or an error message when value is invalid
     */
    static isValidIPv4Mask(ipv4MaskString: string): [boolean, string[]];
    /**
     * Checks if given string is a valid IPv6 mask
     *
     * @param {string} ipv6MaskString the given IPv6 mask string
     * @returns {[boolean , string]} first value is true if valid IPv6 mask string, false otherwise. Second value
     * contains "valid" or an error message when value is invalid
     */
    static isValidIPv6Mask(ipv6MaskString: string): [boolean, string[]];
    /**
     * Checks if the given string is a valid IPv4 range in Cidr notation
     *
     * @param {string} ipv4RangeAsCidrString the IPv4 range in Cidr notation
     *
     * @returns {[boolean , string[]]} first value is true if valid IPv4 range in Cidr notation, false otherwise. Second
     * value contains "valid" or an error message when value is invalid
     */
    static isValidIPv4CidrNotation(ipv4RangeAsCidrString: string): [boolean, string[]];
    /**
     *  Checks if the given string is a valid IPv4 range in Cidr notation, with the ip number in the cidr notation
     *  being the start of the range
     *
     * @param {string}  ipv4CidrNotation the IPv4 range in Cidr notation
     *
     * * @returns {[boolean , string[]]} first value is true if valid Cidr notation, false otherwise. Second
     * value contains [] or an array of error message when invalid
     */
    static isValidIPv4CidrRange(ipv4CidrNotation: string): [boolean, string[]];
    /**
     *  Checks if the given string is a valid IPv6 range in Cidr notation, with the ip number in the cidr notation
     *  being the start of the range
     *
     * @param {string}  ipv6CidrNotation the IPv6 range in Cidr notation
     *
     * * @returns {[boolean , string[]]} first value is true if valid Cidr notation, false otherwise. Second
     * value contains [] or an array of error message when invalid
     */
    static isValidIPv6CidrRange(ipv6CidrNotation: string): [boolean, string[]];
    private static isValidCidrRange;
    static isValidIPv4RangeString(ipv4RangeString: string): [boolean, string[]];
    static isValidIPv6RangeString(ipv6RangeString: string): [boolean, string[]];
    private static isValidRange;
    /**
     * Checks if the given string is a valid IPv6 range in Cidr notation
     *
     * @param {string} ipv6RangeAsCidrString the IPv6 range in Cidr notation
     *
     * @returns {[boolean , string]} first value is true if valid IPv6 range in Cidr notation, false otherwise.
     * Second value contains "valid" or an error message when value is invalid
     */
    static isValidIPv6CidrNotation(ipv6RangeAsCidrString: string): [boolean, string[]];
    /**
     * Checks if the given string is a binary string. That is contains only contiguous 1s and 0s
     *
     * @param {string} binaryString the binary string
     * @returns {(boolean|string)[]} a tuple representing if valid or not and corresponding message
     */
    static isValidBinaryString(binaryString: string): [boolean, string[]];
    private static isNumeric;
    private static isHexadecatet;
}
