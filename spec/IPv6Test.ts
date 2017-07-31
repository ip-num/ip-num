/**
 * Created by daderemi on 07/11/16.
 */

import {IPv4} from "../src/IPv4";
import {Validator} from "../src/Validator";
import * as bigInt from "big-integer";
import {bigIntegerNumberToHexadecimalString} from "../src/HexadecimalUtils";
import {bigIntegerNumberToBinaryString} from "../src/BinaryUtils";
import {IPv6} from "../src/IPv6";

describe('IPv6: ', () => {
    it('should instantiate by calling constructor', () => {
        // with big Integer
        let iPv6 = new IPv6(bigInt("1".repeat(128), 2));
        expect(iPv6.toString()).toEqual("ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff");
        iPv6.getHexadecatet().forEach(hexadecatet => {
            expect(hexadecatet.toString()).toEqual("ffff");
        })
        // with hexadecimal string
        let iPv6Value = new IPv6("ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff");
        expect(iPv6Value.toString()).toEqual("ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff");
    });

    it('should instantiate by calling fromBigInteger', () => {
        let bigIntegerValue = bigInt("1".repeat(128), 2);
        let iPv6 = IPv6.fromBigInteger(bigIntegerValue);
        expect(iPv6.toString()).toEqual("ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff");
        iPv6.getHexadecatet().forEach(hexadecatet => {
            expect(hexadecatet.toString()).toEqual("ffff");
        })
    });

    it('should instantiate by calling fromHexadecimal', () => {
        let iPv6 = IPv6.fromHexadecimal("ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff");
        expect(iPv6.toString()).toEqual("ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff");
        iPv6.getHexadecatet().forEach(hexadecatet => {
            expect(hexadecatet.toString()).toEqual("ffff");
        })
    });

    it('should correctly return the right value', () => {
        let bigIntegerValue = bigInt("1".repeat(128), 2);
        let iPv6 = IPv6.fromBigInteger(bigIntegerValue);
        expect(iPv6.getValue()).toEqual(bigIntegerValue);
    });

    it('should correctly return the next value when nextIPAddress is called', () => {
        let iPv6 = IPv6.fromHexadecimal("ffff:ffff:ffff:ffff:ffff:ffff:ffff:fffe");
        expect(iPv6.nextIPAddress().toString()).toEqual("ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff");
    });

    it('should correctly return the previous value when previousIPAddress is called', () => {
        let iPv6 = IPv6.fromHexadecimal("ffff:ffff:ffff:ffff:ffff:ffff:ffff:fffe");
        expect(iPv6.previousIPAddress().toString()).toEqual("ffff:ffff:ffff:ffff:ffff:ffff:ffff:fffd");
    });

    it('should throw exception when calling next leads to an invalid IPv4', () => {
        let value = IPv6.fromHexadecimal("ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff");
        expect(() => {
            value.nextIPAddress();
        }).toThrowError(Error, Validator.invalidIPv6NumberMessage);
    });

    it('should throw exception when calling previous leads to an invalid IPv4', () => {
        let value = IPv6.fromHexadecimal("::000");
        expect(() => {
            value.previousIPAddress();
        }).toThrowError(Error, Validator.invalidIPv6NumberMessage);
    });
});