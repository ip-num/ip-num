/**
 * Created by daderemi on 06/11/16.
 */

import * as BinaryUtils from "../src/BinaryUtils";
import * as bigInt from "big-integer/BigInteger";

describe('Binary Utils', () => {
    it('Should correctly convert decimal to binary', () => {
        expect(BinaryUtils.decimalNumberToBinaryString(1234) === '10011010010').toEqual(true);
    });
    it('Should correctly convert binary to decimal', () => {
        expect(BinaryUtils.binaryToDecimal('10011010010').valueOf() === 1234).toEqual(true);
    });
    it('Should correctly convert a big integer number to binary string', () => {
        expect(BinaryUtils.bigIntegerNumberToBinaryString(bigInt(1234))).toBe('10011010010');
        expect(BinaryUtils.bigIntegerNumberToBinaryString(bigInt(4294967295))).toBe('11111111111111111111111111111111')
    });
    it('Should correctly convert binary to decimal and back to binary', () => {
        let originalBinary = '10011010010';
        let decimal = BinaryUtils.binaryToDecimal(originalBinary).valueOf();
        let finalBinary = BinaryUtils.decimalNumberToBinaryString(decimal);
        expect(originalBinary.toString() === finalBinary).toEqual(true);
    });
});