/**
 * Created by daderemi on 31/07/16.
 */

import {Asn} from "../src/IPNumber";
import {Validator} from "../src/Validator";

import * as bigInt from "big-integer"

describe('ASN', () => {
    it('should instantiate by passing number to static method', () => {
        expect(Asn.fromNumber(1234).getValue()).toEqual(bigInt(1234));
    });
    it('should instantiate by passing well string prefixed with AS to static', () => {
        expect(Asn.fromString("AS1234").getValue()).toEqual(bigInt(1234));
    });
    it('should instantiate by passing AS in asdot+ format', () => {
        expect(Asn.fromString("1.10").getValue()).toEqual(bigInt(65546));
        expect(Asn.fromString("0.65526").getValue()).toEqual(bigInt(65526));
    });
    it('should instantiate by passing a number in string to fromString', () => {
        expect(Asn.fromString("1234").getValue()).toEqual(bigInt(1234));
    });
    it('should instantiate by passing valid binary string to fromBinaryString', () => {
        let maxValue = (Math.pow(2, 32) - 1);
        let minValue = 1;
        let meanValue = (maxValue+minValue)/2;
        expect(Asn.fromBinaryString(maxValue.toString(2)).toBinaryString()).toEqual(maxValue.toString(2));
        expect(Asn.fromBinaryString(minValue.toString(2)).toBinaryString()).toEqual(minValue.toString(2));
        expect(Asn.fromBinaryString(meanValue.toString(2)).toBinaryString()).toEqual(meanValue.toString(2));
    });
    it('should throw an exception when passed a binary string larger than valid value', () => {
        expect(() => {
            let aboveMaxValue = (Math.pow(2, 32)) + 10;
            Asn.fromBinaryString(aboveMaxValue.toString(2));
        }).toThrowError(Error, Validator.invalidAsnRangeMessage);
    });
    it('should throw an exception when passed invalid binary string', () => {
        expect(() => {
            Asn.fromBinaryString("132");
        }).toThrowError(Error, 'Binary string should contain only contiguous 1s and 0s');
        expect(() => {
            Asn.fromBinaryString("1x2");
        }).toThrowError(Error, 'Binary string should contain only contiguous 1s and 0s');
        expect(() => {
            Asn.fromBinaryString(" 10");
        }).toThrowError(Error, 'Binary string should contain only contiguous 1s and 0s');
        expect(() => {
            Asn.fromBinaryString("10 1");
        }).toThrowError(Error, 'Binary string should contain only contiguous 1s and 0s');
    });
    it('should correctly parse to string value', () => {
        expect(Asn.fromNumber(1234).toString()).toEqual("AS1234");
    });
    it('should correctly parse to asdotplus', () => {
        expect(Asn.fromNumber(65546).toASDotPlus()).toEqual("1.10");
        expect(Asn.fromNumber(65526).toASDotPlus()).toEqual("0.65526");
    });
    it('should correctly parse to asdot', () => {
        // when value is less than 65536
        expect(Asn.fromNumber(65535).toASDot()).toEqual("65535");
        // when value is exactly 65536
        expect(Asn.fromNumber(65536).toASDot()).toEqual("1.0");
        // When value is more than 65536
        expect(Asn.fromNumber(65546).toASDot()).toEqual("1.10");
    });
    it('should correctly parse to binary string', () => {
        expect(Asn.fromNumber(65546).toBinaryString()).toEqual("10000000000001010");
        expect(Asn.fromNumber(745526).toBinaryString()).toEqual("10110110000000110110");
        expect(Asn.fromNumber(1).toBinaryString()).toEqual("1");
        expect(Asn.fromNumber(2).toBinaryString()).toEqual("10");
    });
    it('should correctly parse to AS plain value', () => {
        expect(Asn.fromNumber(1234).toASPlain()).toEqual("1234");
    });
    it('should throw an exception when number greater than valid ASN range is given', () => {
        expect(() => {Asn.fromNumber(Math.pow(2, 32));}).toThrowError(Error,Validator.invalidAsnRangeMessage);
    });
    it('should correctly tell if ASN is 16bit', () => {
        // normal case
        expect(Asn.fromNumber(1234).is16Bit()).toEqual(true);
        // edge cases
        expect(Asn.fromNumber(Math.pow(2, 16) - 1).is16Bit()).toEqual(true);
        expect(Asn.fromNumber(Math.pow(2, 16)).is16Bit()).toEqual(false);
    });
    it('should correctly tell if ASN is 32bit', () => {
        // normal case
        expect(Asn.fromNumber(1234).is32Bit()).toEqual(false);
        // edge cases
        expect(Asn.fromNumber(Math.pow(2, 32) - 1).is32Bit()).toEqual(true);
    });
    it('should correctly check equality related operations', () => {

        expect(Asn.fromNumber(1234).isLessThan(Asn.fromNumber(12345))).toEqual(true);
        expect(Asn.fromNumber(12345).isLessThan(Asn.fromNumber(1234))).toEqual(false);
        expect(Asn.fromNumber(12345).isLessThan(Asn.fromNumber(12345))).toEqual(false);

        expect(Asn.fromNumber(1234).isLessThanOrEquals(Asn.fromNumber(12345))).toEqual(true);
        expect(Asn.fromNumber(12345).isLessThanOrEquals(Asn.fromNumber(1234))).toEqual(false);
        expect(Asn.fromNumber(12345).isLessThanOrEquals(Asn.fromNumber(12345))).toEqual(true);

        expect(Asn.fromNumber(1234).isEquals(Asn.fromNumber(1234))).toEqual(true);
        expect(Asn.fromNumber(1234).isEquals(Asn.fromNumber(12345))).toEqual(false);

        expect(Asn.fromNumber(1234).isGreaterThan(Asn.fromNumber(12345))).toEqual(false);
        expect(Asn.fromNumber(12345).isGreaterThan(Asn.fromNumber(1234))).toEqual(true);
        expect(Asn.fromNumber(12345).isGreaterThan(Asn.fromNumber(12345))).toEqual(false);

        expect(Asn.fromNumber(12345).isGreaterThanOrEquals(Asn.fromNumber(1234))).toEqual(true);
        expect(Asn.fromNumber(1234).isGreaterThanOrEquals(Asn.fromNumber(12345))).toEqual(false);
        expect(Asn.fromNumber(12345).isGreaterThanOrEquals(Asn.fromNumber(12345))).toEqual(true);

    });
    it('should correctly return the next ASN value', () => {
        expect(Asn.fromNumber(1234).nextIPNumber().getValue()).toEqual(Asn.fromNumber(1235).getValue());
        expect(() => {
            Asn.fromNumber(Math.pow(2, 32) - 1).nextIPNumber();
        }).toThrowError(Error, Validator.invalidAsnRangeMessage);
    });
    it('should correctly return the previous ASN value', () => {
        expect(Asn.fromNumber(1234).previousIPNumber().getValue()).toEqual(Asn.fromNumber(1233).getValue());
        expect(() => {
            Asn.fromNumber(0).previousIPNumber();
        }).toThrowError(Error, Validator.invalidAsnRangeMessage);
    });
    it('should correctly tell if an ASN has next or previous', () => {
        // next
        expect(Asn.fromNumber(1234).hasNext()).toEqual(true);
        expect(Asn.fromNumber(Math.pow(2, 32) - 1).hasNext()).toEqual(false);
        // previous
        expect(Asn.fromNumber(1).hasPrevious()).toEqual(true);
        expect(Asn.fromNumber(0).hasPrevious()).toEqual(false);
    });
});