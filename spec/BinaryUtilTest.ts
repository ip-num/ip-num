

import * as BinaryUtils from "../src/BinaryUtils";
import * as bigInt from "big-integer/BigInteger";

describe('Binary Utils', () => {
    it('Should correctly convert decimal to binary', () => {
        expect(BinaryUtils.decimalNumberToBinaryString(1234) === '10011010010').toEqual(true);
    });
    it('Should correctly parse binary string to a number in BigInteger', () => {
        expect(BinaryUtils.parseBinaryStringToBigInteger('10011010010')).toEqual(bigInt(1234));
    });
    it('Should correctly convert binary to decimal', () => {
        expect(BinaryUtils.parseBinaryStringToBigInteger('10011010010').valueOf() === 1234).toEqual(true);
    });
    it('Should correctly convert a big integer number to binary string', () => {
        expect(BinaryUtils.bigIntegerNumberToBinaryString(bigInt(1234))).toBe('10011010010');
        expect(BinaryUtils.bigIntegerNumberToBinaryString(bigInt(4294967295))).toBe('11111111111111111111111111111111')
    });
    it('Should correctly convert binary to decimal and back to binary', () => {
        let originalBinary = '10011010010';
        let decimal = BinaryUtils.parseBinaryStringToBigInteger(originalBinary).valueOf();
        let finalBinary = BinaryUtils.decimalNumberToBinaryString(decimal);
        expect(originalBinary.toString() === finalBinary).toEqual(true);
    });
    it('Should correctly convert decimal number to octets', () => {
        let decimalValue = 10;
        let octet = BinaryUtils.decimalNumberToOctetString(decimalValue);
        expect(octet).toEqual('00001010')
    });
    it('Should throw an exception when converting to octet and value is larger than an octet', () => {
        expect(() => {
            BinaryUtils.decimalNumberToOctetString(122222222222);
        }).toThrowError(Error, 'Given decimal in binary contains digits greater than an octet');
    });
    it('Should correctly convert IP number in dotted decimal notation to binary string', () => {
        expect(BinaryUtils.dottedDecimalNotationToBinaryString('2.16.217.69')).toEqual('00000010000100001101100101000101');
        expect(BinaryUtils.dottedDecimalNotationToBinaryString('0.0.0.0')).toEqual('00000000000000000000000000000000');
        expect(BinaryUtils.dottedDecimalNotationToBinaryString('255.255.255.255')).toEqual('11111111111111111111111111111111');
        expect(BinaryUtils.dottedDecimalNotationToBinaryString('254.198.20.255')).toEqual('11111110110001100001010011111111');
    });
    it('Should pad given string with zeros to become given length', () => {
        expect(BinaryUtils.leftPadWithZeroBit('10', 5)).toEqual('00010');
        expect(BinaryUtils.leftPadWithZeroBit('00010', 5)).toEqual('00010');
    });
    it('Should throw an exception if given string is already greater than required final length after padding', () => {
        expect(()=> {
            BinaryUtils.leftPadWithZeroBit('111111110', 5)
        }).toThrowError(Error, 'Given string is already longer than given final length after padding: 5');
    })
});