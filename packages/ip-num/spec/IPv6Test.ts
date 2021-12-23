
import {Validator} from "../src/Validator";
import * as bigInt from "big-integer";
import {IPv6} from "../src/IPNumber";
import {IPv4} from "../src";

describe('IPv6: ', () => {
    it('should instantiate by calling constructor', () => {
        // with big Integer
        let iPv6 = new IPv6(bigInt("42540650421252671973913748003310542850"));
        expect(iPv6.toString()).toEqual("2001:800:0:0:0:0:0:2002");
        let hexadecatets = iPv6.getHexadecatet();
        expect(hexadecatets[0].toString()).toEqual("2001");
        expect(hexadecatets[1].toString()).toEqual("800");
        expect(hexadecatets[2].toString()).toEqual("0");
        expect(hexadecatets[3].toString()).toEqual("0");
        expect(hexadecatets[4].toString()).toEqual("0");
        expect(hexadecatets[5].toString()).toEqual("0");
        expect(hexadecatets[6].toString()).toEqual("0");
        expect(hexadecatets[7].toString()).toEqual("2002");
        // with hexadecimal string
        let iPv6Value = new IPv6("ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff");
        expect(iPv6Value.toString()).toEqual("ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff");
    });

    it('should instantiate by calling fromBigInteger', () => {
        let bigIntegerValue = bigInt("42540766411282592856903984951653826560");
        let iPv6 = IPv6.fromBigInteger(bigIntegerValue);
        expect(iPv6.toString()).toEqual("2001:db8:0:0:0:0:0:0");
        let hexadecatets = iPv6.getHexadecatet();

        expect(hexadecatets[0].toString()).toEqual("2001");
        expect(hexadecatets[1].toString()).toEqual("db8");
        expect(hexadecatets[2].toString()).toEqual("0");
        expect(hexadecatets[3].toString()).toEqual("0");
        expect(hexadecatets[4].toString()).toEqual("0");
        expect(hexadecatets[5].toString()).toEqual("0");
        expect(hexadecatets[6].toString()).toEqual("0");
        expect(hexadecatets[7].toString()).toEqual("0");

    });

    it('should instantiate by calling fromHexadecimal', () => {
        let iPv6 = IPv6.fromHexadecimalString("3ffe:1900:4545:0003:0200:f8ff:fe21:67cf");
        expect(iPv6.toString()).toEqual("3ffe:1900:4545:3:200:f8ff:fe21:67cf");
        let hexadecatets = iPv6.getHexadecatet();
        expect(hexadecatets[0].toString()).toEqual("3ffe");
        expect(hexadecatets[1].toString()).toEqual("1900");
        expect(hexadecatets[2].toString()).toEqual("4545");
        expect(hexadecatets[3].toString()).toEqual("3");
        expect(hexadecatets[4].toString()).toEqual("200");
        expect(hexadecatets[5].toString()).toEqual("f8ff");
        expect(hexadecatets[6].toString()).toEqual("fe21");
        expect(hexadecatets[7].toString()).toEqual("67cf");
    });

    it('should instantiate by calling fromString', () => {
        let iPv6 = IPv6.fromString("3ffe:1900:4545:0003:0200:f8ff:fe21:67cf");
        expect(iPv6.toString()).toEqual("3ffe:1900:4545:3:200:f8ff:fe21:67cf");
        let hexadecatets = iPv6.getHexadecatet();
        expect(hexadecatets[0].toString()).toEqual("3ffe");
        expect(hexadecatets[1].toString()).toEqual("1900");
        expect(hexadecatets[2].toString()).toEqual("4545");
        expect(hexadecatets[3].toString()).toEqual("3");
        expect(hexadecatets[4].toString()).toEqual("200");
        expect(hexadecatets[5].toString()).toEqual("f8ff");
        expect(hexadecatets[6].toString()).toEqual("fe21");
        expect(hexadecatets[7].toString()).toEqual("67cf");
    });

    it('should instantiate by calling fromIPv4', () => {
        let iPv6 = IPv6.fromIPv4(new IPv4("127.0.0.1"));
        expect(iPv6.toString()).toEqual('::ffff:7f00:1');

        let iPv61 = IPv6.fromIPv4(new IPv4("74.125.43.99"));
        expect(iPv61.toString()).toEqual('::ffff:4a7d:2b63');
    });

    it('should instantiate by calling fromIPv4DotDecimalString', () => {
        let iPv6 = IPv6.fromIPv4DotDecimalString("127.0.0.1");
        expect(iPv6.toString()).toEqual('::ffff:7f00:1');

        let iPv61 = IPv6.fromIPv4DotDecimalString("74.125.43.99");
        expect(iPv61.toString()).toEqual('::ffff:4a7d:2b63');
    });

    it('should instantiate by calling fromBinaryString', () => {
        let IPv6String = "3ffe:1900:4545:0003:0200:f8ff:fe21:67cf";

        let binaryString = IPv6
            .fromHexadecimalString(IPv6String)
            .toBinaryString();

        let iPv6 = IPv6.fromBinaryString(binaryString);

        expect(iPv6.toString()).toEqual("3ffe:1900:4545:3:200:f8ff:fe21:67cf");
        let hexadecatets = iPv6.getHexadecatet();
        expect(hexadecatets[0].toString()).toEqual("3ffe");
        expect(hexadecatets[1].toString()).toEqual("1900");
        expect(hexadecatets[2].toString()).toEqual("4545");
        expect(hexadecatets[3].toString()).toEqual("3");
        expect(hexadecatets[4].toString()).toEqual("200");
        expect(hexadecatets[5].toString()).toEqual("f8ff");
        expect(hexadecatets[6].toString()).toEqual("fe21");
        expect(hexadecatets[7].toString()).toEqual("67cf");
    });

    it('should not instantiate IPv6 when passed invalid binary string', () => {
        expect(() => {
            IPv6.fromBinaryString("111 10");
        }).toThrowError(Error, 'Binary string should contain only contiguous 1s and 0s');
    });

    it('should throw an exception when invalid IPv6 string is used to construct an IPv6 instance', function() {
        expect(() => {
            IPv6.fromHexadecimalString("3ffe:1900:4545:0003:0200");
        }).toThrowError(Error);
    });

    it('should correctly return the right value', () => {
        let bigIntegerValue = bigInt("1".repeat(128), 2);
        let iPv6 = IPv6.fromBigInteger(bigIntegerValue);
        expect(iPv6.getValue()).toEqual(bigIntegerValue);
    });

    it('should pad with :: if ', () => {

    });

    it('should correctly return the next value when nextIPNumber is called', () => {
        let iPv6 = IPv6.fromHexadecimalString("ffff:ffff:ffff:ffff:ffff:ffff:ffff:fffe");
        expect(iPv6.nextIPNumber().toString()).toEqual("ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff");
    });

    it('should correctly return the previous value when previousIPNumber is called', () => {
        let iPv6 = IPv6.fromHexadecimalString("ffff:ffff:ffff:ffff:ffff:ffff:ffff:fffe");
        expect(iPv6.previousIPNumber().toString()).toEqual("ffff:ffff:ffff:ffff:ffff:ffff:ffff:fffd");
    });

    it('should throw exception when calling next leads to an invalid IPv4', () => {
        let value = IPv6.fromHexadecimalString("ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff");
        expect(() => {
            value.nextIPNumber();
        }).toThrowError(Error, Validator.invalidIPv6NumberMessage);
    });

    it('should throw exception when calling previous leads to an invalid IPv4', () => {
        let value = IPv6.fromHexadecimalString("::000");
        expect(() => {
            value.previousIPNumber();
        }).toThrowError(Error, Validator.invalidIPv6NumberMessage);
    });

    it('should correctly tell if there is a next value for an IPv6', () => {
        let value: IPv6 = IPv6.fromHexadecimalString("ffff:ffff:ffff:ffff:ffff:ffff:ffff:fffe");
        expect(value.hasNext()).toBe(true);
        expect(value.nextIPNumber().hasNext()).toBe(false);
    });

    it('should correctly tell if there is a previous value for an IPv6', () => {
        let value = IPv6.fromHexadecimalString("::001");
        expect(value.hasPrevious()).toBe(true);
        expect(value.previousIPNumber().hasPrevious()).toBe(false);
    });

    it('toString should prepend with :: if IPv6 value has leading zeros', () => {
        let iPv6 = new IPv6(bigInt('2130706433'));
        expect(iPv6.toString().startsWith('::')).toBe(true);
    });

    it('should correctly check equality related operations', () => {
        expect(IPv6.fromBigInteger(bigInt("100")).isLessThan(IPv6.fromBigInteger(bigInt("200")))).toEqual(true);
        expect(IPv6.fromBigInteger(bigInt("200")).isLessThan(IPv6.fromBigInteger(bigInt("100")))).toEqual(false);
        expect(IPv6.fromBigInteger(bigInt("200")).isLessThan(IPv6.fromBigInteger(bigInt("200")))).toEqual(false);

        expect(IPv6.fromBigInteger(bigInt("1234")).isLessThanOrEquals(IPv6.fromBigInteger(bigInt("12345")))).toEqual(true);
        expect(IPv6.fromBigInteger(bigInt("12345")).isLessThanOrEquals(IPv6.fromBigInteger(bigInt("1234")))).toEqual(false);
        expect(IPv6.fromBigInteger(bigInt("12345")).isLessThanOrEquals(IPv6.fromBigInteger(bigInt("12345")))).toEqual(true);

        expect(IPv6.fromBigInteger(bigInt("1234")).isEquals(IPv6.fromBigInteger(bigInt("1234")))).toEqual(true);
        expect(IPv6.fromBigInteger(bigInt("1234")).isEquals(IPv6.fromBigInteger(bigInt("12345")))).toEqual(false);

        expect(IPv6.fromBigInteger(bigInt("1234")).isGreaterThan(IPv6.fromBigInteger(bigInt("12345")))).toEqual(false);
        expect(IPv6.fromBigInteger(bigInt("12345")).isGreaterThan(IPv6.fromBigInteger(bigInt("1234")))).toEqual(true);
        expect(IPv6.fromBigInteger(bigInt("12345")).isGreaterThan(IPv6.fromBigInteger(bigInt("12345")))).toEqual(false);

        expect(IPv6.fromBigInteger(bigInt("12345")).isGreaterThanOrEquals(IPv6.fromBigInteger(bigInt("1234")))).toEqual(true);
        expect(IPv6.fromBigInteger(bigInt("1234")).isGreaterThanOrEquals(IPv6.fromBigInteger(bigInt("12345")))).toEqual(false);
        expect(IPv6.fromBigInteger(bigInt("12345")).isGreaterThanOrEquals(IPv6.fromBigInteger(bigInt("12345")))).toEqual(true);
    });

    it('should correctly return IP number as binary string', () => {
        let value = new IPv6("2001:db8::");
        expect(value.toBinaryString()).toEqual("00100000000000010000110110111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000");
        let lastValue = new IPv6("ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff");
        expect(lastValue.toBinaryString()).toEqual("11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111");
        let firstValue = new IPv6("::");
        expect(firstValue.toBinaryString()).toEqual("00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000");
    });

    it('should create right IPv6 address', () => {
        let value = new IPv6(bigInt("65536"));
        expect(value.toString()).toEqual("::1:0")
    });
});
