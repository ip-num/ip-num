/**
 * Created by daderemi on 07/11/16.
 */

import {IPv4} from "../src/IPNumber";
import {Validator} from "../src";

describe('IPv4: ', () => {
    it('should instantiate by calling constructor', () => {
        expect(new IPv4("111.222.90.45").toString()).toEqual("111.222.90.45");
    });

    it('should instantiate by passing big integer value of IPv4 number to constructor', () => {
        expect(IPv4.fromBigInt(1876843053n).toString()).toEqual("111.222.90.45");
    });

    it('should instantiate by passing dot-decimal notation to fromDecimalDottedString', () => {
        expect(IPv4.fromDecimalDottedString("111.222.90.45").toString()).toEqual("111.222.90.45");
    });

    it('should instantiate by passing dot-decimal notation to fromString', () => {
        expect(IPv4.fromString("111.222.90.45").toString()).toEqual("111.222.90.45");
    });

    it('should instantiate IPv4 by passing binary string', () => {
        let testIPv4String = "111.222.90.45";
        let createdIPv4 = IPv4.fromBinaryString(new IPv4(testIPv4String).toBinaryString());
        expect(createdIPv4.toString()).toEqual("111.222.90.45");
    });

    it('should not instantiate IPv4 when passed invalid binary string', () => {
        expect(() => {
            IPv4.fromBinaryString("111 10");
        }).toThrowError(Error, 'Binary string should contain only contiguous 1s and 0s');
    });

    it('should correctly check equality related operations', () => {
        expect(IPv4.fromBigInt(100n).isLessThan(IPv4.fromBigInt(200n))).toEqual(true);
        expect(IPv4.fromBigInt(200n).isLessThan(IPv4.fromBigInt(100n))).toEqual(false);
        expect(IPv4.fromBigInt(200n).isLessThan(IPv4.fromBigInt(200n))).toEqual(false);

        expect(IPv4.fromBigInt(1234n).isLessThanOrEquals(IPv4.fromBigInt(12345n))).toEqual(true);
        expect(IPv4.fromBigInt(12345n).isLessThanOrEquals(IPv4.fromBigInt(1234n))).toEqual(false);
        expect(IPv4.fromBigInt(12345n).isLessThanOrEquals(IPv4.fromBigInt(12345n))).toEqual(true);

        expect(IPv4.fromBigInt(1234n).isEquals(IPv4.fromBigInt(1234n))).toEqual(true);
        expect(IPv4.fromBigInt(1234n).isEquals(IPv4.fromBigInt(12345n))).toEqual(false);

        expect(IPv4.fromBigInt(1234n).isGreaterThan(IPv4.fromBigInt(12345n))).toEqual(false);
        expect(IPv4.fromBigInt(12345n).isGreaterThan(IPv4.fromBigInt(1234n))).toEqual(true);
        expect(IPv4.fromBigInt(12345n).isGreaterThan(IPv4.fromBigInt(12345n))).toEqual(false);

        expect(IPv4.fromBigInt(12345n).isGreaterThanOrEquals(IPv4.fromBigInt(1234n))).toEqual(true);
        expect(IPv4.fromBigInt(1234n).isGreaterThanOrEquals(IPv4.fromBigInt(12345n))).toEqual(false);
        expect(IPv4.fromBigInt(12345n).isGreaterThanOrEquals(IPv4.fromBigInt(12345n))).toEqual(true);
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
        expect(value).toEqual(BigInt("0b01101111110111100101101000101101"))
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

    it('should create IPv4-Mapped IPv6 Address', () => {
        let value = new IPv4("74.125.43.99");
        let iPv6 = value.toIPv4MappedIPv6();
        expect(iPv6.toString()).toEqual('::ffff:4a7d:2b63');

        let value1 = new IPv4("127.0.0.1");
        let iPv61 = value1.toIPv4MappedIPv6();
        expect(iPv61.toString()).toEqual('::ffff:7f00:1');
    })
});