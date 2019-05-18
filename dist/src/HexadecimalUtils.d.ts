import * as bigInt from "big-integer/BigInteger";
/**
 * Converts a given BigInteger number to a hexadecimal string
 * @param num the BigInteger number
 * @returns {string} the hexadeciaml string
 */
export declare let bigIntegerNumberToHexadecimalString: (num: bigInt.BigInteger) => string;
/**
 * Converts a number in hexadecimal (base 16) to binary string
 * @param {string} hexadecimalString the number in base 16
 * @returns {string} the number converted to base 2
 */
export declare let hexadecimalStringToBinaryString: (hexadecimalString: string) => string;
/**
 * Converts a number in hexadecimal (base 16) to binary hexadecatet string.
 * This means the bits in the output cannot be more than 16
 *
 * @param hexadecimalString {string} the number converted to binary hexadecatet string
 */
export declare let hexadecimalStringToHexadecatetString: (hexadecimalString: string) => string;
/**
 * Given an IPv6 number in hexadecimal notated string, e.g 2001:0db8:0000:0000:0000:0000:0000:0000 converts it to
 * binary string
 *
 * @param hexadecimalString IPv6 string
 * @returns {string} the binary value of the given ipv6 number in string
 */
export declare let colonHexadecimalNotationToBinaryString: (hexadecimalString: string) => string;
/**
 * Converts number in binary string to hexadecimal string
 * @param {string} num in binary string
 * @returns {string} num in hexadecimal string
 */
export declare let binaryStringToHexadecimalString: (num: string) => string;
/**
 * Converts a given IPv6 number expressed in the hexadecimal string notation into a 16 bit binary number in string
 * @param {string} hexadectetString the IPv6 number
 * @returns {string} the IPv6 number converted to binary string
 */
export declare let hexadectetNotationToBinaryString: (hexadectetString: string) => string;
