import * as bigInt from "big-integer/BigInteger";

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
 * Converts number in binary string to hexadecimal string
 * @param {string} num in binary string
 * @returns {string} num in hexadecimal string
 */
export let binaryStringToHexadecimalString = (num: string): string => {
    // first convert to binary string to decimal (big Integer)
    let inDecimal = bigInt(num, 2);
    return inDecimal.toString(16);
};