import {IPNumType} from "./IPNumType";

/**
 * Converts a decimal number to binary string
 *
 * @param num number to parse
 * @returns {string} the binary string representation of number
 */

export let numberToBinaryString = (num: number | bigint): string => {
    return num.toString(2);
};

/**
 * Converts a decimal number to binary octet (8 bit) string. If needed the octet will be padded with zeros
 * to make it up to 8 bits
 *
 * @param {number} num to convert to octet string
 * @returns {string} the octet string representation of given number
 */
export let decimalNumberToOctetString = (num: number | bigint): string => {
    let binaryString = numberToBinaryString(num);
    let length = binaryString.length;
    if (length > 8) {
        throw new Error("Given decimal in binary contains digits greater than an octet")
    }
    return leftPadWithZeroBit(binaryString, 8);
};

/**
 * Parses number in binary to number in BigInt
 *
 * @param num binary number in string to parse
 * @returns {number} binary number in BigInt
 */
export let parseBinaryStringToBigInt = (num: string): bigint => {
    return BigInt(`0b${num}`);
};

/**
 * Given an IPv4 number in dot-decimal notated string, e.g 192.168.0.1 converts it to
 * binary string, e.g. '11000000101010000000000000000001'
 *
 * @param dottedDecimal IPv4 string in dot-decimal notation
 * @returns {string} the binary value of the given ipv4 number in string
 */
export let dottedDecimalNotationToBinaryString = (dottedDecimal: string): string => {
    let stringOctets = dottedDecimal.split(".");
    return stringOctets.reduce((binaryAsString, octet) => {
        return binaryAsString.concat(decimalNumberToOctetString(parseInt(octet)));
    }, '');
};

/**
 * Given a binary string, adds a number of zero to the left until string is as long as the given string length
 * @param {string} binaryString the string to pad
 * @param {number} finalStringLength the final length of string after padding
 * @returns {string}
 */
export let leftPadWithZeroBit = (binaryString: string, finalStringLength: number): string => {
    if (binaryString.length > finalStringLength) {
        throw new Error(`Given string is already longer than given final length after padding: ${finalStringLength}`);
    }
    return "0".repeat(finalStringLength - binaryString.length).concat(binaryString);
};

/**
 * Given the prefix portion of a cidr notation and the type of IP number, returns the mask in binary string
 *
 * @param {number} cidrPrefix the prefix part of a cidr notation
 * @param {IPNumType.IPv4 | IPNumType.IPv6} ipType the type of the ip number in the range the cidr represents
 */
export let cidrPrefixToMaskBinaryString = (cidrPrefix: number, ipType: IPNumType.IPv4 | IPNumType.IPv6): string => {
  let cidrUpperValue;
  if (ipType == IPNumType.IPv4) {
    cidrUpperValue = 32;
  } else {
    cidrUpperValue = 128
  }
  if (cidrPrefix > cidrUpperValue) throw Error(`Value is greater than ${cidrUpperValue}`);

  let onBits = '1'.repeat(cidrPrefix);
  let offBits = '0'.repeat(cidrUpperValue - cidrPrefix);
  return `${onBits}${offBits}`;
};

/**
 * Calculates the log, to base 2 of given number.
 *
 * @throws Error if number cannot be converted to log base 2
 * @param givenNumber the number to calculate log base 2
 * @return the log base 2 of given number
 */
export let intLog2 = (givenNumber: bigint): number => {
    let result = 0;

    while (givenNumber % 2n === 0n) {
        if (givenNumber === 2n) {
            result++;
            break;
        }
        givenNumber = givenNumber >> 1n;
        if (givenNumber % 2n !== 0n) {
            result = 0;
            break;
        }
        result++;
    }

    if (result == 0) {
        throw new Error(`The value of log2 for ${givenNumber.toString()} is not an integer`)
    }
    return result
};

/**
 * Starting from the most significant bit (from left) returns the number of first bits from both string that are equal
 * @param firstBinaryString first binary string
 * @param secondBinaryString second binary string
 */
export let matchingBitCount = (firstBinaryString: string, secondBinaryString: string) : number => {
    let longerString;
    let otherString;

    if (firstBinaryString.length >= secondBinaryString.length) {
        longerString = firstBinaryString;
        otherString = secondBinaryString;
    } else {
        longerString = secondBinaryString;
        otherString = firstBinaryString;
    }

    let count = 0;
    for (;count < longerString.length; count++) {
        if (longerString.charAt(count) === otherString.charAt(count)) {
            continue;
        }
        break;
    }
    return count;
};