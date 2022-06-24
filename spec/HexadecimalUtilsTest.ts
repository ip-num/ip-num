
import * as HexadecimalUtils from "../src/HexadecimalUtils";
import fc from "fast-check";
import {positiveIntegersAndHex} from "./abitraries/BinaryArbitraries";


describe('Hexadecimal Utils: ', () => {
    it('Should convert big int number to Hexadecimal String', () => {
        fc.assert(fc.property(positiveIntegersAndHex, (value) => {
            expect(HexadecimalUtils.bigIntToHexadecimalString(BigInt(value.value))).toEqual(value.hex);
        }))
    });

    it('Should convert hexadecimal string to binary string', () => {
        fc.assert(fc.property(positiveIntegersAndHex, (value) => {
            expect(HexadecimalUtils.hexadecimalStringToBinaryString(value.hex)).toEqual(value.value.toString(2));
        }))
    });

    it('Should convert binary string To hexadecimal string', () => {
        fc.assert(fc.property(positiveIntegersAndHex, (value) => {
            expect(HexadecimalUtils.binaryStringToHexadecimalString(value.value.toString(2))).toEqual(value.hex);
        }))
    });
});