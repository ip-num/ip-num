"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BinaryUtils = require("../src/BinaryUtils");
var bigInt = require("big-integer/BigInteger");
describe('Binary Utils', function () {
    it('Should correctly convert decimal to binary', function () {
        expect(BinaryUtils.decimalNumberToBinaryString(1234) === '10011010010').toEqual(true);
    });
    it('Should correctly parse binary string to a number in BigInteger', function () {
        expect(BinaryUtils.parseBinaryStringToBigInteger('10011010010')).toEqual(bigInt(1234));
    });
    it('Should correctly convert binary to decimal', function () {
        expect(BinaryUtils.parseBinaryStringToBigInteger('10011010010').valueOf() === 1234).toEqual(true);
    });
    it('Should correctly convert a big integer number to binary string', function () {
        expect(BinaryUtils.bigIntegerNumberToBinaryString(bigInt(1234))).toBe('10011010010');
        expect(BinaryUtils.bigIntegerNumberToBinaryString(bigInt(4294967295))).toBe('11111111111111111111111111111111');
    });
    it('Should correctly convert binary to decimal and back to binary', function () {
        var originalBinary = '10011010010';
        var decimal = BinaryUtils.parseBinaryStringToBigInteger(originalBinary).valueOf();
        var finalBinary = BinaryUtils.decimalNumberToBinaryString(decimal);
        expect(originalBinary.toString() === finalBinary).toEqual(true);
    });
    it('Should correctly convert decimal number to octets', function () {
        var decimalValue = 10;
        var octet = BinaryUtils.decimalNumberToOctetString(decimalValue);
        expect(octet).toEqual('00001010');
    });
    it('Should throw an exception when converting to octet and value is larger than an octet', function () {
        expect(function () {
            BinaryUtils.decimalNumberToOctetString(122222222222);
        }).toThrowError(Error, 'Given decimal in binary contains digits greater than an octet');
    });
    it('Should correctly convert IP number in dotted decimal notation to binary string', function () {
        expect(BinaryUtils.dottedDecimalNotationToBinaryString('2.16.217.69')).toEqual('00000010000100001101100101000101');
        expect(BinaryUtils.dottedDecimalNotationToBinaryString('0.0.0.0')).toEqual('00000000000000000000000000000000');
        expect(BinaryUtils.dottedDecimalNotationToBinaryString('255.255.255.255')).toEqual('11111111111111111111111111111111');
        expect(BinaryUtils.dottedDecimalNotationToBinaryString('254.198.20.255')).toEqual('11111110110001100001010011111111');
    });
    it('Should pad given string with zeros to become given length', function () {
        expect(BinaryUtils.leftPadWithZeroBit('10', 5)).toEqual('00010');
        expect(BinaryUtils.leftPadWithZeroBit('00010', 5)).toEqual('00010');
    });
    it('Should throw an exception if given string is already greater than required final length after padding', function () {
        expect(function () {
            BinaryUtils.leftPadWithZeroBit('111111110', 5);
        }).toThrowError(Error, 'Given string is already longer than given final length after padding: 5');
    });
});
//# sourceMappingURL=BinaryUtilTest.js.map