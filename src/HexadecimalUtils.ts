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

export let hexadecimalNotationToBinary = (hexadecimalString: string): string => {
    let hexadecimals = hexadecimalString.split(":");
    let binaryStringValue = hexadecimals.reduce((hexidecimalAsString, hexavalue) => {
        return hexidecimalAsString.concat(hexadecimalStringToBinaryString(hexavalue));
    }, '');
    return binaryStringValue;
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