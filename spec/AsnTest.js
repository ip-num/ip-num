"use strict";
/**
 * Created by daderemi on 31/07/16.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var Asn_1 = require("../src/Asn");
var Validator_1 = require("../src/Validator");
var bigInt = require("big-integer");
describe('ASN', function () {
    it('should instantiate by passing number to static method', function () {
        expect(Asn_1.Asn.of(1234).getValue()).toEqual(bigInt(1234));
    });
    it('should instantiate by passing well string prefixed with AS to static', function () {
        expect(Asn_1.Asn.of("AS1234").getValue()).toEqual(bigInt(1234));
    });
    it('should instantiate by passing AS in asdot+ format', function () {
        expect(Asn_1.Asn.of("1.10").getValue()).toEqual(bigInt(65546));
        expect(Asn_1.Asn.of("0.65526").getValue()).toEqual(bigInt(65526));
    });
    it('should instantiate by passing a number in string to static', function () {
        expect(Asn_1.Asn.of("1234").getValue()).toEqual(bigInt(1234));
    });
    it('should correctly parse to string value', function () {
        expect(Asn_1.Asn.of(1234).toString()).toEqual("AS1234");
    });
    it('should correctly parse to asdotplus', function () {
        expect(Asn_1.Asn.of(65546).toASDotPlus()).toEqual("1.10");
        expect(Asn_1.Asn.of(65526).toASDotPlus()).toEqual("0.65526");
    });
    it('should correctly parse to asdot', function () {
        // when value is less than 65536
        expect(Asn_1.Asn.of(65535).toASDot()).toEqual("65535");
        // when value is exactly 65536
        expect(Asn_1.Asn.of(65536).toASDot()).toEqual("1.0");
        // When value is more than 65536
        expect(Asn_1.Asn.of(65546).toASDot()).toEqual("1.10");
    });
    it('should correctly parse to binary string', function () {
        expect(Asn_1.Asn.of(65546).toBinaryString()).toEqual("10000000000001010");
        expect(Asn_1.Asn.of(745526).toBinaryString()).toEqual("10110110000000110110");
        expect(Asn_1.Asn.of(1).toBinaryString()).toEqual("1");
        expect(Asn_1.Asn.of(2).toBinaryString()).toEqual("10");
    });
    it('should correctly parse to AS plain value', function () {
        expect(Asn_1.Asn.of(1234).toASPlain()).toEqual("1234");
    });
    it('should throw an exception when number greater than valid ASN range is given', function () {
        expect(function () { Asn_1.Asn.of(Math.pow(2, 32)); }).toThrowError(Error, Validator_1.Validator.invalidAsnRangeMessage);
    });
    it('should correctly tell if ASN is 16bit', function () {
        // normal case
        expect(Asn_1.Asn.of(1234).is16Bit()).toEqual(true);
        // edge cases
        expect(Asn_1.Asn.of(Math.pow(2, 16) - 1).is16Bit()).toEqual(true);
        expect(Asn_1.Asn.of(Math.pow(2, 16)).is16Bit()).toEqual(false);
    });
    it('should correctly tell if ASN is 32bit', function () {
        // normal case
        expect(Asn_1.Asn.of(1234).is32Bit()).toEqual(false);
        // edge cases
        expect(Asn_1.Asn.of(Math.pow(2, 32) - 1).is32Bit()).toEqual(true);
    });
    it('should correctly check equality related operations', function () {
        expect(Asn_1.Asn.of(1234).isLessThan(Asn_1.Asn.of(12345))).toEqual(true);
        expect(Asn_1.Asn.of(12345).isLessThan(Asn_1.Asn.of(1234))).toEqual(false);
        expect(Asn_1.Asn.of(12345).isLessThan(Asn_1.Asn.of(12345))).toEqual(false);
        expect(Asn_1.Asn.of(1234).isLessThanOrEquals(Asn_1.Asn.of(12345))).toEqual(true);
        expect(Asn_1.Asn.of(12345).isLessThanOrEquals(Asn_1.Asn.of(1234))).toEqual(false);
        expect(Asn_1.Asn.of(12345).isLessThanOrEquals(Asn_1.Asn.of(12345))).toEqual(true);
        expect(Asn_1.Asn.of(1234).isEquals(Asn_1.Asn.of(1234))).toEqual(true);
        expect(Asn_1.Asn.of(1234).isEquals(Asn_1.Asn.of(12345))).toEqual(false);
        expect(Asn_1.Asn.of(1234).isGreaterThan(Asn_1.Asn.of(12345))).toEqual(false);
        expect(Asn_1.Asn.of(12345).isGreaterThan(Asn_1.Asn.of(1234))).toEqual(true);
        expect(Asn_1.Asn.of(12345).isGreaterThan(Asn_1.Asn.of(12345))).toEqual(false);
        expect(Asn_1.Asn.of(12345).isGreaterThanOrEquals(Asn_1.Asn.of(1234))).toEqual(true);
        expect(Asn_1.Asn.of(1234).isGreaterThanOrEquals(Asn_1.Asn.of(12345))).toEqual(false);
        expect(Asn_1.Asn.of(12345).isGreaterThanOrEquals(Asn_1.Asn.of(12345))).toEqual(true);
    });
    it('should correctly return the next ASN value', function () {
        expect(Asn_1.Asn.of(1234).next().getValue()).toEqual(Asn_1.Asn.of(1235).getValue());
        expect(function () {
            Asn_1.Asn.of(Math.pow(2, 32) - 1).next();
        }).toThrowError(Error, Validator_1.Validator.invalidAsnRangeMessage);
    });
    it('should correctly return the previous ASN value', function () {
        expect(Asn_1.Asn.of(1234).previous().getValue()).toEqual(Asn_1.Asn.of(1233).getValue());
        expect(function () {
            Asn_1.Asn.of(0).previous();
        }).toThrowError(Error, Validator_1.Validator.invalidAsnRangeMessage);
    });
    it('should correctly tell if an ASN has next or previous', function () {
        // next
        expect(Asn_1.Asn.of(1234).hasNext()).toEqual(true);
        expect(Asn_1.Asn.of(Math.pow(2, 32) - 1).hasNext()).toEqual(false);
        // previous
        expect(Asn_1.Asn.of(1).hasPrevious()).toEqual(true);
        expect(Asn_1.Asn.of(0).hasPrevious()).toEqual(false);
    });
});
