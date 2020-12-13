import * as bigInt from "big-integer/BigInteger";
import { IPNumType } from "./IPNumType";
/**
 * Converts a decimal number to binary string
 *
 * @param num number to parse
 * @returns {string} the binary string representation of number
 */
export declare let decimalNumberToBinaryString: (num: number) => string;
/**
 * Converts a given BigInteger number to a binary string
 * @param num the BigInteger number
 * @returns {string} the binary string
 */
export declare let bigIntegerNumberToBinaryString: (num: bigInt.BigInteger) => string;
/**
 * Converts a decimal number to binary octet (8 bit) string. If needed the octet will be padded with zeros
 * to make it up to 8 bits
 *
 * @param {number} num to convert to octet string
 * @returns {string} the octet string representation of given number
 */
export declare let decimalNumberToOctetString: (num: number) => string;
/**
 * Parses number in binary to number in BigInteger
 *
 * @param num binary number in string to parse
 * @returns {number} binary number in BigInteger
 */
export declare let parseBinaryStringToBigInteger: (num: string) => bigInt.BigInteger;
/**
 * Given an IPv4 number in dot-decimal notated string, e.g 192.168.0.1 converts it to
 * binary string, e.g. '11000000101010000000000000000001'
 *
 * @param dottedDecimal IPv4 string in dot-decimal notation
 * @returns {string} the binary value of the given ipv4 number in string
 */
export declare let dottedDecimalNotationToBinaryString: (dottedDecimal: string) => string;
/**
 * Given a binary string, adds a number of zero to the left until string is as long as the given string length
 * @param {string} binaryString the string to pad
 * @param {number} finalStringLength the final length of string after padding
 * @returns {string}
 */
export declare let leftPadWithZeroBit: (binaryString: string, finalStringLength: number) => string;
/**
 * Given the prefix portion of a cidr notation and the type of IP number, returns the mask in binary string
 *
 * @param {number} cidrPrefix the prefix part of a cidr notation
 * @param {IPNumType.IPv4 | IPNumType.IPv6} ipType the type of the ip number in the range the cidr represents
 */
export declare let cidrPrefixToMaskBinaryString: (cidrPrefix: number, ipType: IPNumType.IPv4 | IPNumType.IPv6) => string;
/**
 * Calculates the log, to base 2 of given number.
 *
 * @throws Error if number cannot be converted to log base 2
 * @param givenNumber the number to calculate log base 2
 * @return the log base 2 of given number
 */
export declare let intLog2: (givenNumber: bigInt.BigInteger) => number;
