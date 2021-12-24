/**
 * Created by daderemi on 31/07/16.
 */

import {Asn} from "../src/IPNumber";
import {Validator} from "../src/Validator";

import * as bigInt from "big-integer"
import fc from "fast-check"
import {
    asn16BitValues, asn32BitValues,
    asnASStringValues,
    asnDotPlusValues,
    asnPlainValues,
    asnPlainValuesBinary
} from "./Arbitraties";

describe('ASN', () => {
    it('should instantiate by passing number to static method', () => {
        fc.assert(fc.property(asnPlainValues, (value:number) => {
            expect(Asn.fromNumber(value).getValue()).toEqual(bigInt(value));
        }))
    });
    it('should instantiate by passing well string prefixed with AS to static', () => {
        fc.assert(fc.property(asnASStringValues, (value: { intValue: number; stringVal: string }) => {
            expect(Asn.fromString(value.stringVal).getValue()).toEqual(bigInt(value.intValue));
        }))
    });
    it('should instantiate by passing AS in asdot+ format', () => {
        fc.assert(fc.property(asnDotPlusValues, (value: { intValue: number; asnDotPlusValue: string }) => {
            expect(Asn.fromString(value.asnDotPlusValue).getValue()).toEqual(bigInt(value.intValue))
        }))
    });
    it('should instantiate by passing a number in string to fromString', () => {
        fc.assert(fc.property(asnPlainValues.map(value => value.toString()), (value:string) => {
            expect(Asn.fromString(value).getValue()).toEqual(bigInt(value));
        }))
    });
    it('should instantiate by passing valid binary string to fromBinaryString', () => {
        fc.assert(fc.property(asnPlainValuesBinary, (value:string) => {
            expect(Asn.fromBinaryString(value).toBinaryString()).toEqual(value);
        }))
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
        fc.assert(fc.property(asnPlainValues, (value:number) => {
            expect(Asn.fromNumber(value).toString()).toEqual(`AS${value}`);
        }))
    });
    it('should correctly parse to asdotplus', () => {
        fc.assert(fc.property(asnDotPlusValues, (value: { intValue: number; asnDotPlusValue: string }) => {
            expect(Asn.fromNumber(value.intValue).toASDotPlus()).toEqual(value.asnDotPlusValue)
        }))
    });
    it('should correctly parse to asdot', () => {
        // when value is less than 65536
        fc.assert(fc.property(asn16BitValues, (value:number) => {
            expect(Asn.fromNumber(value).toASDot()).toEqual(value.toString());
        }))
        // when value is exactly 65536
        expect(Asn.fromNumber(65536).toASDot()).toEqual("1.0");
        // When value is more than 65536
        fc.assert(fc.property(asnDotPlusValues.filter(value => {
            return value.intValue > 65536
        }), (value: { intValue: number; asnDotPlusValue: string }) => {
            expect(Asn.fromNumber(value.intValue).toASDot()).toEqual(value.asnDotPlusValue);
        }))
    });
    it('should correctly parse to binary string', () => {
        fc.assert(fc.property(asnDotPlusValues, (value) => {
            expect(Asn.fromNumber(value.intValue).toBinaryString()).toEqual(value.binaryValue);
        }));
    });
    it('should correctly parse to AS plain value', () => {
        fc.assert(fc.property(asnPlainValues, (value) => {
            expect(Asn.fromNumber(value).toASPlain()).toEqual(value.toString());
        }));
    });
    it('should throw an exception when number greater than valid ASN range is given', () => {
        expect(() => {Asn.fromNumber(Math.pow(2, 32));}).toThrowError(Error,Validator.invalidAsnRangeMessage);
    });
    it('should correctly tell if ASN is 16bit', () => {
        fc.assert(fc.property(asn16BitValues, (value) => {
            expect(Asn.fromNumber(value).is16Bit()).toEqual(true);
        }));
    });
    it('should correctly tell if ASN is 32bit', () => {
        fc.assert(fc.property(asn32BitValues, (value) => {
            expect(Asn.fromNumber(value).is32Bit()).toEqual(true);
        }));
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