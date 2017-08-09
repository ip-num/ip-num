import * as bigInt from "big-integer/BigInteger";

'use strict';
/**
 * Converts a number to binary string
 *
 * @param num number to parse
 * @returns {string} the binary string representation of number
 */

export let decimalNumberToBinaryString = (num:number):string => {
    return Number(num).toString(2);
};

export let decimalNumberToBinaryOctet = (num:number): string => {
    let binaryString = decimalNumberToBinaryString(num);
    let length = binaryString.length;
    if (length > 8) {
        throw new Error("Given decimal in binary contains digits greater than an octet")
    }
    return leftPadWithZeroBit(binaryString, 8);
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
 * Converts a string binary number to number in BigInteger
 *
 * @param num binary number in string to convert
 * @returns {number}
 */
export let binaryToBigInteger = (num:string): bigInt.BigInteger => {
    return bigInt(parseInt(Number(num).toString(), 2));
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
        return binaryAsString.concat(decimalNumberToBinaryOctet(parseInt(octet)));
    }, '');
};

/**
 * Given a binary string, adds a number of zero to the left until string is as long as the given string length
 * @param {string} binaryString the string to pad
 * @param {number} finalStringLength the final length of string after padding
 * @returns {string}
 */
export let leftPadWithZeroBit = (binaryString: string, finalStringLength: number): string => {
    if (binaryString.length >= finalStringLength) {
        return binaryString;
    }
    return "0".repeat(finalStringLength - binaryString.length).concat(binaryString);
};
