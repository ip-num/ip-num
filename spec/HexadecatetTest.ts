
import {Validator} from "../src/Validator";
import {Hexadecatet} from "../src/Hexadecatet";

describe('Hexadecatet: ', () => {
    it('should instantiate by calling constructor', () => {
        expect(new Hexadecatet(234).getValue()).toEqual(564);
        expect(new Hexadecatet("234").getValue()).toEqual(564);
    });
    it('should instantiate by passing number or string to static method', () => {
        expect(Hexadecatet.of(234).getValue()).toEqual(564);
        expect(Hexadecatet.of("0234").getValue()).toEqual(564);
    });
    it('should instantiate by passing hexadecimal string to static method', () => {
        expect(Hexadecatet.of("FFFF").getValue()).toEqual(65535);
    });
    it('should correctly display the value as string', () => {
        expect(Hexadecatet.of("FFFF").toString()).toEqual('ffff');
    });
    it('should throw an exception when invalid octet number is given', () => {
        expect(() => {
            Hexadecatet.of(65536);
        }).toThrowError(Error, Validator.invalidHexadecatetMessage);

        expect(() => {
            Hexadecatet.of(-1);
        }).toThrowError(Error, Validator.invalidHexadecatetMessage);
    });
});