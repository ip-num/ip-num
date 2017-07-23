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
export let binaryToDecimal = (num:string): bigInt.BigInteger => {
    return bigInt(parseInt(Number(num).toString(), 2));
};

/**
 * Given an Ipv4 number in dot-decimal notated string, e.g 192.168.0.1 converts it to
 * binary string, e.g. '11000000101010000000000000000001'
 *
 * @param dottedDecimal Ipv4 string in dot-decimal notation
 * @returns {string} the binary value of the given ipv4 number in string
 */
export let dottedDecimalToBinary = (dottedDecimal: string): string => {
    let stringOctets = dottedDecimal.split(".");
    let binaryStringValue = stringOctets.reduce((binaryAsString, octet) => {
        return binaryAsString.concat(decimalNumberToBinaryOctet(parseInt(octet)));
    }, '');
    return binaryStringValue;
};


export let leftPadWithZeroBit = (binaryString: string, padLength: number): string => {
    if (binaryString.length >= padLength) {
        return binaryString;
    }
    return "0".repeat(padLength - binaryString.length).concat(binaryString);
};
