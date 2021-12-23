/**
 * Created by daderemi on 07/11/16.
 */

import {Octet} from "../src/Octet";
import {Validator} from "../src/Validator";

describe('Octet', () => {
    it('should instantiate by calling constructor', () => {
        expect(new Octet(234).getValue()).toEqual(234);
        expect(new Octet("234").getValue()).toEqual(234);
    });
    it('should instantiate by passing number or string to static method', () => {
        expect(Octet.fromNumber(234).getValue()).toEqual(234);
        expect(Octet.fromString("234").getValue()).toEqual(234);
    });
    it('should throw an exception when invalid octet number is given', () => {
        expect(() => {
            Octet.fromNumber(256);
        }).toThrowError(Error, Validator.invalidOctetRangeMessage);

        expect(() => {
            Octet.fromNumber(-1);
        }).toThrowError(Error, Validator.invalidOctetRangeMessage);
    });
});