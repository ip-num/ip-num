"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HexadecimalUtils = require("../src/HexadecimalUtils");
var bigInt = require("big-integer");
describe('Hexadecimal Utils: ', function () {
    it('Should convert bigIntegerNumber to Hexadecimal String', function () {
        expect(HexadecimalUtils.bigIntegerNumberToHexadecimalString(bigInt('2323'))).toEqual('913');
        expect(HexadecimalUtils.bigIntegerNumberToHexadecimalString(bigInt('151515'))).toEqual('24fdb');
        expect(HexadecimalUtils.bigIntegerNumberToHexadecimalString(bigInt('9223372036854776'))).toEqual('20c49ba5e353f8');
        expect(HexadecimalUtils.bigIntegerNumberToHexadecimalString(bigInt('92233720368547760000'))).toEqual('50000000000000780');
    });
    it('Should convert hexadecimal string to binary string', function () {
        expect(HexadecimalUtils.hexadecimalStringToBinaryString('2323')).toEqual('10001100100011');
        expect(HexadecimalUtils.hexadecimalStringToBinaryString('24fdb')).toEqual('100100111111011011');
        expect(HexadecimalUtils.hexadecimalStringToBinaryString('20c49ba5e353f8')).toEqual('100000110001001001101110100101111000110101001111111000');
        expect(HexadecimalUtils.hexadecimalStringToBinaryString('50000000000000780')).toEqual('1010000000000000000000000000000000000000000000000000000011110000000');
    });
    it('Should convert binary string To hexadecimal string', function () {
        expect(HexadecimalUtils.binaryStringToHexadecimalString('10001100100011')).toEqual('2323');
        expect(HexadecimalUtils.binaryStringToHexadecimalString('100100111111011011')).toEqual('24fdb');
        expect(HexadecimalUtils.binaryStringToHexadecimalString('100000110001001001101110100101111000110101001111111000')).toEqual('20c49ba5e353f8');
        expect(HexadecimalUtils.binaryStringToHexadecimalString('1010000000000000000000000000000000000000000000000000000011110000000')).toEqual('50000000000000780');
    });
});
//# sourceMappingURL=HexadecimalUtilsTest.js.map