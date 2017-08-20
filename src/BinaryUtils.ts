import * as bigInt from "big-integer/BigInteger";

'use strict';
/**
 * Converts a decimal number to binary string
 *
 * @param num number to parse
 * @returns {string} the binary string representation of number
 */

export let decimalNumberToBinaryString = (num:number):string => {
    return Number(num).toString(2);
};

/**
 * Converts a given BigInteger number to a binary string
 * @param num the BigInteger number
 * @returns {string} the binary string
 */
export let bigIntegerNumberToBinaryString = (num: bigInt.BigInteger): string => {
    return num.toString(2);
};


/**
 * Converts a decimal number to binary octet (8 bit) string. If needed the octet will be padded with zeros
 * to make it up to 8 bits
 *
 * @param {number} num to convert to octet string
 * @returns {string} the octet string representation of given number
 */
export let decimalNumberToOctetString = (num:number): string => {
    let binaryString = decimalNumberToBinaryString(num);
    let length = binaryString.length;
    if (length > 8) {
        throw new Error("Given decimal in binary contains digits greater than an octet")
    }
    return leftPadWithZeroBit(binaryString, 8);
};

/**
 * Parses number in binary to number in BigInteger
 *
 * @param num binary number in string to parse
 * @returns {number} binary number in BigInteger
 */
export let parseBinaryStringToBigInteger = (num:string): bigInt.BigInteger => {
    return bigInt(num, 2);
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
        throw new Error(`Given string is already longer than ${finalStringLength}`);
    }
    return "0".repeat(finalStringLength - binaryString.length).concat(binaryString);
};
