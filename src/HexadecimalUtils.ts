import * as bigInt from "big-integer/BigInteger";

'use strict';

/**
 * Converts a given BigInteger number to a hexadecimal string
 * @param num the BigInteger number
 * @returns {string} the hexadeciaml string
 */
export let bigIntegerNumberToHexadecimalString = (num: bigInt.BigInteger): string => {
    return num.toString(16);
};

/**
 * Converts a given IPv6 address expressed in the hexadecimal string notation into a binary number in string
 * @param {string} hexadectetString the IPv6 number
 * @returns {string} the IPv6 number converted to binary string
 */
export let hexadectetNotationToBinaryString = (hexadectetString: string): string => {
    let hexadecimals = hexadectetString.split(":");
    return hexadecimals.reduce((hexadecimalAsString, hexavalue) => {
        return hexadecimalAsString.concat(hexadecimalStringToBinaryString(hexavalue));
    }, '');
};

export let hexadecimalStringToBinaryString = (hexadeciamlString: string) : string => {
    let inDecimal = bigInt(hexadeciamlString, 16);
    return inDecimal.toString(2);
};

export let binaryStringToHexadecimalString = (num: string): string => {
    // first convert to binary string to decimal (big Integer)
    let inDecimal = bigInt(num, 2);
    return inDecimal.toString(16);
};