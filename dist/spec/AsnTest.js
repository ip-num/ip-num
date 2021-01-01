"use strict";
/**
 * Created by daderemi on 31/07/16.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var IPNumber_1 = require("../src/IPNumber");
var Validator_1 = require("../src/Validator");
var bigInt = require("big-integer");
describe('ASN', function () {
    it('should instantiate by passing number to static method', function () {
        expect(IPNumber_1.Asn.fromNumber(1234).getValue()).toEqual(bigInt(1234));
    });
    it('should instantiate by passing well string prefixed with AS to static', function () {
        expect(IPNumber_1.Asn.fromString("AS1234").getValue()).toEqual(bigInt(1234));
    });
    it('should instantiate by passing AS in asdot+ format', function () {
        expect(IPNumber_1.Asn.fromString("1.10").getValue()).toEqual(bigInt(65546));
        expect(IPNumber_1.Asn.fromString("0.65526").getValue()).toEqual(bigInt(65526));
    });
    it('should instantiate by passing a number in string to fromString', function () {
        expect(IPNumber_1.Asn.fromString("1234").getValue()).toEqual(bigInt(1234));
    });
    it('should instantiate by passing valid binary string to fromBinaryString', function () {
        var maxValue = (Math.pow(2, 32) - 1);
        var minValue = 1;
        var meanValue = (maxValue + minValue) / 2;
        expect(IPNumber_1.Asn.fromBinaryString(maxValue.toString(2)).toBinaryString()).toEqual(maxValue.toString(2));
        expect(IPNumber_1.Asn.fromBinaryString(minValue.toString(2)).toBinaryString()).toEqual(minValue.toString(2));
        expect(IPNumber_1.Asn.fromBinaryString(meanValue.toString(2)).toBinaryString()).toEqual(meanValue.toString(2));
    });
    it('should throw an exception when passed a binary string larger than valid value', function () {
        expect(function () {
            var aboveMaxValue = (Math.pow(2, 32)) + 10;
            IPNumber_1.Asn.fromBinaryString(aboveMaxValue.toString(2));
        }).toThrowError(Error, Validator_1.Validator.invalidAsnRangeMessage);
    });
    it('should throw an exception when passed invalid binary string', function () {
        expect(function () {
            IPNumber_1.Asn.fromBinaryString("132");
        }).toThrowError(Error, 'Binary string should contain only contiguous 1s and 0s');
        expect(function () {
            IPNumber_1.Asn.fromBinaryString("1x2");
        }).toThrowError(Error, 'Binary string should contain only contiguous 1s and 0s');
        expect(function () {
            IPNumber_1.Asn.fromBinaryString(" 10");
        }).toThrowError(Error, 'Binary string should contain only contiguous 1s and 0s');
        expect(function () {
            IPNumber_1.Asn.fromBinaryString("10 1");
        }).toThrowError(Error, 'Binary string should contain only contiguous 1s and 0s');
    });
    it('should correctly parse to string value', function () {
        expect(IPNumber_1.Asn.fromNumber(1234).toString()).toEqual("AS1234");
    });
    it('should correctly parse to asdotplus', function () {
        expect(IPNumber_1.Asn.fromNumber(65546).toASDotPlus()).toEqual("1.10");
        expect(IPNumber_1.Asn.fromNumber(65526).toASDotPlus()).toEqual("0.65526");
    });
    it('should correctly parse to asdot', function () {
        // when value is less than 65536
        expect(IPNumber_1.Asn.fromNumber(65535).toASDot()).toEqual("65535");
        // when value is exactly 65536
        expect(IPNumber_1.Asn.fromNumber(65536).toASDot()).toEqual("1.0");
        // When value is more than 65536
        expect(IPNumber_1.Asn.fromNumber(65546).toASDot()).toEqual("1.10");
    });
    it('should correctly parse to binary string', function () {
        expect(IPNumber_1.Asn.fromNumber(65546).toBinaryString()).toEqual("10000000000001010");
        expect(IPNumber_1.Asn.fromNumber(745526).toBinaryString()).toEqual("10110110000000110110");
        expect(IPNumber_1.Asn.fromNumber(1).toBinaryString()).toEqual("1");
        expect(IPNumber_1.Asn.fromNumber(2).toBinaryString()).toEqual("10");
    });
    it('should correctly parse to AS plain value', function () {
        expect(IPNumber_1.Asn.fromNumber(1234).toASPlain()).toEqual("1234");
    });
    it('should throw an exception when number greater than valid ASN range is given', function () {
        expect(function () { IPNumber_1.Asn.fromNumber(Math.pow(2, 32)); }).toThrowError(Error, Validator_1.Validator.invalidAsnRangeMessage);
    });
    it('should correctly tell if ASN is 16bit', function () {
        // normal case
        expect(IPNumber_1.Asn.fromNumber(1234).is16Bit()).toEqual(true);
        // edge cases
        expect(IPNumber_1.Asn.fromNumber(Math.pow(2, 16) - 1).is16Bit()).toEqual(true);
        expect(IPNumber_1.Asn.fromNumber(Math.pow(2, 16)).is16Bit()).toEqual(false);
    });
    it('should correctly tell if ASN is 32bit', function () {
        // normal case
        expect(IPNumber_1.Asn.fromNumber(1234).is32Bit()).toEqual(false);
        // edge cases
        expect(IPNumber_1.Asn.fromNumber(Math.pow(2, 32) - 1).is32Bit()).toEqual(true);
    });
    it('should correctly check equality related operations', function () {
        expect(IPNumber_1.Asn.fromNumber(1234).isLessThan(IPNumber_1.Asn.fromNumber(12345))).toEqual(true);
        expect(IPNumber_1.Asn.fromNumber(12345).isLessThan(IPNumber_1.Asn.fromNumber(1234))).toEqual(false);
        expect(IPNumber_1.Asn.fromNumber(12345).isLessThan(IPNumber_1.Asn.fromNumber(12345))).toEqual(false);
        expect(IPNumber_1.Asn.fromNumber(1234).isLessThanOrEquals(IPNumber_1.Asn.fromNumber(12345))).toEqual(true);
        expect(IPNumber_1.Asn.fromNumber(12345).isLessThanOrEquals(IPNumber_1.Asn.fromNumber(1234))).toEqual(false);
        expect(IPNumber_1.Asn.fromNumber(12345).isLessThanOrEquals(IPNumber_1.Asn.fromNumber(12345))).toEqual(true);
        expect(IPNumber_1.Asn.fromNumber(1234).isEquals(IPNumber_1.Asn.fromNumber(1234))).toEqual(true);
        expect(IPNumber_1.Asn.fromNumber(1234).isEquals(IPNumber_1.Asn.fromNumber(12345))).toEqual(false);
        expect(IPNumber_1.Asn.fromNumber(1234).isGreaterThan(IPNumber_1.Asn.fromNumber(12345))).toEqual(false);
        expect(IPNumber_1.Asn.fromNumber(12345).isGreaterThan(IPNumber_1.Asn.fromNumber(1234))).toEqual(true);
        expect(IPNumber_1.Asn.fromNumber(12345).isGreaterThan(IPNumber_1.Asn.fromNumber(12345))).toEqual(false);
        expect(IPNumber_1.Asn.fromNumber(12345).isGreaterThanOrEquals(IPNumber_1.Asn.fromNumber(1234))).toEqual(true);
        expect(IPNumber_1.Asn.fromNumber(1234).isGreaterThanOrEquals(IPNumber_1.Asn.fromNumber(12345))).toEqual(false);
        expect(IPNumber_1.Asn.fromNumber(12345).isGreaterThanOrEquals(IPNumber_1.Asn.fromNumber(12345))).toEqual(true);
    });
    it('should correctly return the next ASN value', function () {
        expect(IPNumber_1.Asn.fromNumber(1234).nextIPNumber().getValue()).toEqual(IPNumber_1.Asn.fromNumber(1235).getValue());
        expect(function () {
            IPNumber_1.Asn.fromNumber(Math.pow(2, 32) - 1).nextIPNumber();
        }).toThrowError(Error, Validator_1.Validator.invalidAsnRangeMessage);
    });
    it('should correctly return the previous ASN value', function () {
        expect(IPNumber_1.Asn.fromNumber(1234).previousIPNumber().getValue()).toEqual(IPNumber_1.Asn.fromNumber(1233).getValue());
        expect(function () {
            IPNumber_1.Asn.fromNumber(0).previousIPNumber();
        }).toThrowError(Error, Validator_1.Validator.invalidAsnRangeMessage);
    });
    it('should correctly tell if an ASN has next or previous', function () {
        // next
        expect(IPNumber_1.Asn.fromNumber(1234).hasNext()).toEqual(true);
        expect(IPNumber_1.Asn.fromNumber(Math.pow(2, 32) - 1).hasNext()).toEqual(false);
        // previous
        expect(IPNumber_1.Asn.fromNumber(1).hasPrevious()).toEqual(true);
        expect(IPNumber_1.Asn.fromNumber(0).hasPrevious()).toEqual(false);
    });
});
//# sourceMappingURL=AsnTest.js.map