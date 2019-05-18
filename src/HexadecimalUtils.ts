import * as bigInt from "big-integer/BigInteger";
import {expandIPv6Number} from "./IPv6Utils";
import {leftPadWithZeroBit} from "./BinaryUtils";

/**
 * Converts a given BigInteger number to a hexadecimal string
 * @param num the BigInteger number
 * @returns {string} the hexadeciaml string
 */
export let bigIntegerNumberToHexadecimalString = (num: bigInt.BigInteger): string => {
    return num.toString(16);
};

/**
 * Converts a number in hexadecimal (base 16) to binary string
 * @param {string} hexadecimalString the number in base 16
 * @returns {string} the number converted to base 2
 */
export let hexadecimalStringToBinaryString = (hexadecimalString: string) : string => {
    let inDecimal = bigInt(hexadecimalString, 16);
    return inDecimal.toString(2);
};

/**
 * Converts a number in hexadecimal (base 16) to binary hexadecatet string.
 * This means the bits in the output cannot be more than 16
 *
 * @param hexadecimalString {string} the number converted to binary hexadecatet string
 */
export let hexadecimalStringToHexadecatetString = (hexadecimalString: string): string => {
  let binaryString = hexadecimalStringToBinaryString(hexadecimalString);

  let length = binaryString.length;
  if (length > 16) {
    throw new Error("Given decimal in binary contains digits greater than an Hexadecatet")
  }
  return leftPadWithZeroBit(binaryString, 16);
};

/**
 * Given an IPv6 number in hexadecimal notated string, e.g 2001:0db8:0000:0000:0000:0000:0000:0000 converts it to
 * binary string
 *
 * @param hexadecimalString IPv6 string
 * @returns {string} the binary value of the given ipv6 number in string
 */
export let colonHexadecimalNotationToBinaryString = (hexadecimalString: string): string => {
  let expandedIPv6 = expandIPv6Number(hexadecimalString);
  let stringHexadecimal = expandedIPv6.split(":");

  return stringHexadecimal.reduce((binaryAsString, hexidecimal) => {
    return binaryAsString.concat(hexadecimalStringToHexadecatetString(hexidecimal))
  }, '');
};


/**
 * Converts number in binary string to hexadecimal string
 * @param {string} num in binary string
 * @returns {string} num in hexadecimal string
 */
export let binaryStringToHexadecimalString = (num: string): string => {
    // first convert to binary string to decimal (big Integer)
    let inDecimal = bigInt(num, 2);
    return inDecimal.toString(16);
};

/**
 * Converts a given IPv6 number expressed in the hexadecimal string notation into a 16 bit binary number in string
 * @param {string} hexadectetString the IPv6 number
 * @returns {string} the IPv6 number converted to binary string
 */
export let hexadectetNotationToBinaryString = (hexadectetString: string): string => {
  let expand = expandIPv6Number(hexadectetString);
  let hexadecimals = expand.split(":");
  return hexadecimals.reduce((hexadecimalAsString, hexavalue) => {
    return hexadecimalAsString.concat(leftPadWithZeroBit(hexadecimalStringToBinaryString(hexavalue),16));
  }, '');
};