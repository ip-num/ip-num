"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Validator_1 = require("../src/Validator");
var Hexadecatet_1 = require("../src/Hexadecatet");
describe('Hexadecatet: ', function () {
    it('should instantiate by calling constructor', function () {
        expect(new Hexadecatet_1.Hexadecatet(234).getValue()).toEqual(564);
        expect(new Hexadecatet_1.Hexadecatet("234").getValue()).toEqual(564);
    });
    it('should instantiate by passing number or string to static method', function () {
        expect(Hexadecatet_1.Hexadecatet.fromNumber(234).getValue()).toEqual(564);
        expect(Hexadecatet_1.Hexadecatet.fromString("0234").getValue()).toEqual(564);
    });
    it('should instantiate by passing hexadecimal string to static method', function () {
        expect(Hexadecatet_1.Hexadecatet.fromString("FFFF").getValue()).toEqual(65535);
    });
    it('should correctly display the value as string', function () {
        expect(Hexadecatet_1.Hexadecatet.fromString("FFFF").toString()).toEqual('ffff');
    });
    it('should throw an exception when invalid octet number is given', function () {
        expect(function () {
            Hexadecatet_1.Hexadecatet.fromNumber(65536);
        }).toThrowError(Error, Validator_1.Validator.invalidHexadecatetMessage);
        expect(function () {
            Hexadecatet_1.Hexadecatet.fromNumber(-1);
        }).toThrowError(Error, Validator_1.Validator.invalidHexadecatetMessage);
    });
});
//# sourceMappingURL=HexadecatetTest.js.map