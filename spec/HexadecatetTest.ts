
import {Validator} from "../src";
import {Hexadecatet} from "../src";
import fc from "fast-check";
import {hexadecatetValue} from "./abitraries/BinaryArbitraries";

describe('Hexadecatet: ', () => {
    it('should instantiate by calling constructor', () => {
        fc.assert(fc.property(hexadecatetValue, (value) => {
            expect(new Hexadecatet(value.value).getValue()).toEqual(value.decimalValue);
        }))
    });
    it('should instantiate by passing number or string to static method', () => {
        fc.assert(fc.property(hexadecatetValue, (value) => {
            expect(Hexadecatet.fromNumber(value.decimalValue).getValue()).toEqual(value.decimalValue);
        }))
    });
    it('should instantiate by passing hexadecimal string to static method', () => {
        fc.assert(fc.property(hexadecatetValue, (value) => {
            expect(Hexadecatet.fromString(value.value).getValue()).toEqual(value.decimalValue);
        }))
    });
    it('should correctly display the value as string', () => {
        fc.assert(fc.property(hexadecatetValue, (value) => {
            expect(Hexadecatet.fromString(value.value).toString()).toEqual(value.value.toLowerCase());
        }))
    });
    it('should throw an exception when invalid octet number is given', () => {
        fc.assert(fc.property(fc.integer({min:65536}), (value) => {
            try {
                Hexadecatet.fromNumber(value);
                return false;
            } catch (e) {
                return true
            }
        }));

        fc.assert(fc.property(fc.integer({min:0}), (value) => {
            try {
                Hexadecatet.fromNumber((value + 1) * -1);
                return false;
            } catch (e) {
                return true
            }
        }));
    });
});