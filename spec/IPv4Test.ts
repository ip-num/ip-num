/**
 * Created by daderemi on 07/11/16.
 */

import {IPv4} from "../src/IPv4";
import {Validator} from "../src/Validator";
import * as bigInt from "big-integer";

describe('IPv4: ', () => {
    it('should instantiate by calling constructor', () => {
        expect(new IPv4("111.222.90.45").toString()).toEqual("111.222.90.45");
    });

    it('should instantiate by passing big integer value of IPv4 number to constructor', () => {
        expect(IPv4.fromBigInteger(bigInt("1876843053")).toString()).toEqual("111.222.90.45");
    });

    it('should instantiate by passing dot-decimal notation', () => {
        expect(IPv4.fromDecimalDottedString("111.222.90.45").toString()).toEqual("111.222.90.45");
    });

    it('should instantiate by passing binary string', () => {
        let testIPv4String = "111.222.90.45";
        let createdIPv4 = IPv4.fromBinaryString(new IPv4(testIPv4String).toBinaryString());
        expect(createdIPv4.toString()).toEqual("111.222.90.45");
    });

    it('should correctly check equality related operations', () => {
        expect(IPv4.fromBigInteger(bigInt("100")).isLessThan(IPv4.fromBigInteger(bigInt("200")))).toEqual(true);
        expect(IPv4.fromBigInteger(bigInt("200")).isLessThan(IPv4.fromBigInteger(bigInt("100")))).toEqual(false);
        expect(IPv4.fromBigInteger(bigInt("200")).isLessThan(IPv4.fromBigInteger(bigInt("200")))).toEqual(false);

        expect(IPv4.fromBigInteger(bigInt("1234")).isLessThanOrEquals(IPv4.fromBigInteger(bigInt("12345")))).toEqual(true);
        expect(IPv4.fromBigInteger(bigInt("12345")).isLessThanOrEquals(IPv4.fromBigInteger(bigInt("1234")))).toEqual(false);
        expect(IPv4.fromBigInteger(bigInt("12345")).isLessThanOrEquals(IPv4.fromBigInteger(bigInt("12345")))).toEqual(true);

        expect(IPv4.fromBigInteger(bigInt("1234")).isEquals(IPv4.fromBigInteger(bigInt("1234")))).toEqual(true);
        expect(IPv4.fromBigInteger(bigInt("1234")).isEquals(IPv4.fromBigInteger(bigInt("12345")))).toEqual(false);

        expect(IPv4.fromBigInteger(bigInt("1234")).isGreaterThan(IPv4.fromBigInteger(bigInt("12345")))).toEqual(false);
        expect(IPv4.fromBigInteger(bigInt("12345")).isGreaterThan(IPv4.fromBigInteger(bigInt("1234")))).toEqual(true);
        expect(IPv4.fromBigInteger(bigInt("12345")).isGreaterThan(IPv4.fromBigInteger(bigInt("12345")))).toEqual(false);

        expect(IPv4.fromBigInteger(bigInt("12345")).isGreaterThanOrEquals(IPv4.fromBigInteger(bigInt("1234")))).toEqual(true);
        expect(IPv4.fromBigInteger(bigInt("1234")).isGreaterThanOrEquals(IPv4.fromBigInteger(bigInt("12345")))).toEqual(false);
        expect(IPv4.fromBigInteger(bigInt("12345")).isGreaterThanOrEquals(IPv4.fromBigInteger(bigInt("12345")))).toEqual(true);
    });

    it('should correctly get the octets', () => {
        let octets = new IPv4("111.222.90.45").getOctets();
        expect(octets[0].getValue()).toEqual(111);
        expect(octets[1].getValue()).toEqual(222);
        expect(octets[2].getValue()).toEqual(90);
        expect(octets[3].getValue()).toEqual(45);
    });

    it('should correctly get the binary value', () => {
        let value = new IPv4("111.222.90.45").getValue();
        expect(value).toEqual(bigInt("01101111110111100101101000101101", 2))
    });

    it('should throw exception if ip contains invalid number of octets', () => {
        // more than 4
        expect(() => {
            new IPv4("111.222.90.45.10");
        }).toThrowError(Error, Validator.invalidOctetCountMessage);

        // less than 4
        expect(() => {
            new IPv4("111.222.90");
        }).toThrowError(Error, Validator.invalidOctetCountMessage);
    });

    it('should throw exception if ip contains invalid octet number', () => {
        expect(() => {
            new IPv4("111.222.90.645");
        }).toThrowError(Error, Validator.invalidOctetRangeMessage);
    });

    it('should return next IPv4 value', () => {
        let value = new IPv4("111.222.90.255");
        expect(value.nextIPNumber().toString()).toEqual("111.222.91.0");
    });

    it('should correctly tell if there is a next value for an IPv4', () => {
        let value = new IPv4("255.255.255.254");
        expect(value.hasNext()).toBe(true);
        expect(value.nextIPNumber().hasNext()).toBe(false);
    });

    it('should correctly tell if there is a previous value for an IPv4', () => {
        let value = new IPv4("0.0.0.1");
        expect(value.hasPrevious()).toBe(true);
        expect(value.previousIPNumber().hasPrevious()).toBe(false);
    });

    it('should return previous IPv4 value', () => {
        let value = new IPv4("111.222.91.0");
        expect(value.previousIPNumber().toString()).toEqual("111.222.90.255");
    });

    it('should throw exception when calling next leads to an invalid IPv4', () => {
        let value = new IPv4("255.255.255.255");
        expect(() => {
            value.nextIPNumber();
        }).toThrowError(Error, Validator.invalidIPv4NumberMessage);
    });

    it('should correctly return IP number as binary string', () => {
        let value = new IPv4("74.125.43.99");
        expect(value.toBinaryString()).toEqual("01001010011111010010101101100011");
        let lastValue = new IPv4("255.255.255.255");
        expect(lastValue.toBinaryString()).toEqual("11111111111111111111111111111111");
        let firstValue = new IPv4("0.0.0.0");
        expect(firstValue.toBinaryString()).toEqual("00000000000000000000000000000000");
    });
});