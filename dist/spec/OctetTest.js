"use strict";
/**
 * Created by daderemi on 07/11/16.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var Octet_1 = require("../src/Octet");
var Validator_1 = require("../src/Validator");
describe('Octet', function () {
    it('should instantiate by calling constructor', function () {
        expect(new Octet_1.Octet(234).getValue()).toEqual(234);
        expect(new Octet_1.Octet("234").getValue()).toEqual(234);
    });
    it('should instantiate by passing number or string to static method', function () {
        expect(Octet_1.Octet.fromNumber(234).getValue()).toEqual(234);
        expect(Octet_1.Octet.fromString("234").getValue()).toEqual(234);
    });
    it('should throw an exception when invalid octet number is given', function () {
        expect(function () {
            Octet_1.Octet.fromNumber(256);
        }).toThrowError(Error, Validator_1.Validator.invalidOctetRangeMessage);
        expect(function () {
            Octet_1.Octet.fromNumber(-1);
        }).toThrowError(Error, Validator_1.Validator.invalidOctetRangeMessage);
    });
});
//# sourceMappingURL=OctetTest.js.map