"use strict";
/**
 * Created by daderemi on 07/11/16.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var IPv4_1 = require("../src/IPv4");
var Validator_1 = require("../src/Validator");
var bigInt = require("big-integer");
describe('IPv4: ', function () {
    it('should instantiate by calling constructor', function () {
        expect(new IPv4_1.IPv4("111.222.90.45").toString()).toEqual("111.222.90.45");
    });
    it('should instantiate by passing big integer value of IPv4 number to constructor', function () {
        expect(IPv4_1.IPv4.fromBigInteger(bigInt("1876843053")).toString()).toEqual("111.222.90.45");
    });
    it('should instantiate by passing dot-decimal notation', function () {
        expect(IPv4_1.IPv4.fromDecimalDottedString("111.222.90.45").toString()).toEqual("111.222.90.45");
    });
    it('should instantiate IPv4 by passing binary string', function () {
        var testIPv4String = "111.222.90.45";
        var createdIPv4 = IPv4_1.IPv4.fromBinaryString(new IPv4_1.IPv4(testIPv4String).toBinaryString());
        expect(createdIPv4.toString()).toEqual("111.222.90.45");
    });
    it('should not instantiate IPv4 when passed invalid binary string', function () {
        expect(function () {
            IPv4_1.IPv4.fromBinaryString("111 10");
        }).toThrowError(Error, 'Binary string should contain only contiguous 1s and 0s');
    });
    it('should correctly check equality related operations', function () {
        expect(IPv4_1.IPv4.fromBigInteger(bigInt("100")).isLessThan(IPv4_1.IPv4.fromBigInteger(bigInt("200")))).toEqual(true);
        expect(IPv4_1.IPv4.fromBigInteger(bigInt("200")).isLessThan(IPv4_1.IPv4.fromBigInteger(bigInt("100")))).toEqual(false);
        expect(IPv4_1.IPv4.fromBigInteger(bigInt("200")).isLessThan(IPv4_1.IPv4.fromBigInteger(bigInt("200")))).toEqual(false);
        expect(IPv4_1.IPv4.fromBigInteger(bigInt("1234")).isLessThanOrEquals(IPv4_1.IPv4.fromBigInteger(bigInt("12345")))).toEqual(true);
        expect(IPv4_1.IPv4.fromBigInteger(bigInt("12345")).isLessThanOrEquals(IPv4_1.IPv4.fromBigInteger(bigInt("1234")))).toEqual(false);
        expect(IPv4_1.IPv4.fromBigInteger(bigInt("12345")).isLessThanOrEquals(IPv4_1.IPv4.fromBigInteger(bigInt("12345")))).toEqual(true);
        expect(IPv4_1.IPv4.fromBigInteger(bigInt("1234")).isEquals(IPv4_1.IPv4.fromBigInteger(bigInt("1234")))).toEqual(true);
        expect(IPv4_1.IPv4.fromBigInteger(bigInt("1234")).isEquals(IPv4_1.IPv4.fromBigInteger(bigInt("12345")))).toEqual(false);
        expect(IPv4_1.IPv4.fromBigInteger(bigInt("1234")).isGreaterThan(IPv4_1.IPv4.fromBigInteger(bigInt("12345")))).toEqual(false);
        expect(IPv4_1.IPv4.fromBigInteger(bigInt("12345")).isGreaterThan(IPv4_1.IPv4.fromBigInteger(bigInt("1234")))).toEqual(true);
        expect(IPv4_1.IPv4.fromBigInteger(bigInt("12345")).isGreaterThan(IPv4_1.IPv4.fromBigInteger(bigInt("12345")))).toEqual(false);
        expect(IPv4_1.IPv4.fromBigInteger(bigInt("12345")).isGreaterThanOrEquals(IPv4_1.IPv4.fromBigInteger(bigInt("1234")))).toEqual(true);
        expect(IPv4_1.IPv4.fromBigInteger(bigInt("1234")).isGreaterThanOrEquals(IPv4_1.IPv4.fromBigInteger(bigInt("12345")))).toEqual(false);
        expect(IPv4_1.IPv4.fromBigInteger(bigInt("12345")).isGreaterThanOrEquals(IPv4_1.IPv4.fromBigInteger(bigInt("12345")))).toEqual(true);
    });
    it('should correctly get the octets', function () {
        var octets = new IPv4_1.IPv4("111.222.90.45").getOctets();
        expect(octets[0].getValue()).toEqual(111);
        expect(octets[1].getValue()).toEqual(222);
        expect(octets[2].getValue()).toEqual(90);
        expect(octets[3].getValue()).toEqual(45);
    });
    it('should correctly get the binary value', function () {
        var value = new IPv4_1.IPv4("111.222.90.45").getValue();
        expect(value).toEqual(bigInt("01101111110111100101101000101101", 2));
    });
    it('should throw exception if ip contains invalid number of octets', function () {
        // more than 4
        expect(function () {
            new IPv4_1.IPv4("111.222.90.45.10");
        }).toThrowError(Error, Validator_1.Validator.invalidOctetCountMessage);
        // less than 4
        expect(function () {
            new IPv4_1.IPv4("111.222.90");
        }).toThrowError(Error, Validator_1.Validator.invalidOctetCountMessage);
    });
    it('should throw exception if ip contains invalid octet number', function () {
        expect(function () {
            new IPv4_1.IPv4("111.222.90.645");
        }).toThrowError(Error, Validator_1.Validator.invalidOctetRangeMessage);
    });
    it('should return next IPv4 value', function () {
        var value = new IPv4_1.IPv4("111.222.90.255");
        expect(value.nextIPNumber().toString()).toEqual("111.222.91.0");
    });
    it('should correctly tell if there is a next value for an IPv4', function () {
        var value = new IPv4_1.IPv4("255.255.255.254");
        expect(value.hasNext()).toBe(true);
        expect(value.nextIPNumber().hasNext()).toBe(false);
    });
    it('should correctly tell if there is a previous value for an IPv4', function () {
        var value = new IPv4_1.IPv4("0.0.0.1");
        expect(value.hasPrevious()).toBe(true);
        expect(value.previousIPNumber().hasPrevious()).toBe(false);
    });
    it('should return previous IPv4 value', function () {
        var value = new IPv4_1.IPv4("111.222.91.0");
        expect(value.previousIPNumber().toString()).toEqual("111.222.90.255");
    });
    it('should throw exception when calling next leads to an invalid IPv4', function () {
        var value = new IPv4_1.IPv4("255.255.255.255");
        expect(function () {
            value.nextIPNumber();
        }).toThrowError(Error, Validator_1.Validator.invalidIPv4NumberMessage);
    });
    it('should correctly return IP number as binary string', function () {
        var value = new IPv4_1.IPv4("74.125.43.99");
        expect(value.toBinaryString()).toEqual("01001010011111010010101101100011");
        var lastValue = new IPv4_1.IPv4("255.255.255.255");
        expect(lastValue.toBinaryString()).toEqual("11111111111111111111111111111111");
        var firstValue = new IPv4_1.IPv4("0.0.0.0");
        expect(firstValue.toBinaryString()).toEqual("00000000000000000000000000000000");
    });
    it('should create IPv4-Mapped IPv6 Address', function () {
        var value = new IPv4_1.IPv4("74.125.43.99");
        var iPv6 = value.toIPv4MappedIPv6();
        expect(iPv6.toString()).toEqual('::ffff:4a7d:2b63');
        var value1 = new IPv4_1.IPv4("127.0.0.1");
        var iPv61 = value1.toIPv4MappedIPv6();
        expect(iPv61.toString()).toEqual('::ffff:7f00:1');
    });
});
//# sourceMappingURL=IPv4Test.js.map