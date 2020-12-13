"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IPNumber_1 = require("../src/IPNumber");
var Validator_1 = require("../src/Validator");
var IPNumber_2 = require("../src/IPNumber");
var IPNumber_3 = require("../src/IPNumber");
var IPNumber_4 = require("../src/IPNumber");
describe('mask test', function () {
    it('should create an instance of IPv4 mask using fromDecimalDottedString', function () {
        var iPv4Mask = IPNumber_1.IPv4Mask.fromDecimalDottedString("255.0.0.0");
        expect(iPv4Mask.toString()).toEqual("255.0.0.0");
    });
    it('should create an instance using consturctor', function () {
        var iPv4Mask = new IPNumber_1.IPv4Mask("255.0.0.0");
        expect(iPv4Mask.toString()).toEqual("255.0.0.0");
    });
    it('should create throw an exception when invalid mask string is given', function () {
        expect(function () {
            // Although given string is a valid IPv4 String, it cannot be a mask, since a mask can only
            // be a contiguous on bits (1's) followed by off bits (0's)
            new IPNumber_1.IPv4Mask("10.255.10.3");
        }).toThrowError(Error, Validator_1.Validator.invalidMaskMessage);
    });
    it('should return value', function () {
        var iPv4Mask = new IPNumber_1.IPv4Mask("255.0.0.0");
        expect(iPv4Mask.getValue()).toEqual(new IPNumber_2.IPv4("255.0.0.0").getValue());
    });
    it('should return octets', function () {
        var iPv4Mask = new IPNumber_1.IPv4Mask("255.0.0.0");
        expect(iPv4Mask.getOctets()).toEqual(new IPNumber_2.IPv4("255.0.0.0").getOctets());
    });
    it('should return prefix', function () {
        var iPv4Mask = new IPNumber_1.IPv4Mask("255.255.0.0");
        expect(iPv4Mask.prefix).toEqual(16);
    });
    // IPv6
    it('should create an instance of iPv6Mask using fromDecimalDottedString', function () {
        var iPv6Mask = IPNumber_3.IPv6Mask.fromHexadecimalString("ffff:ffff:ffff:ffff:ffff:ffff:0:0");
        expect(iPv6Mask.toString()).toEqual("ffff:ffff:ffff:ffff:ffff:ffff:0:0");
    });
    it('should create an instance using consturctor', function () {
        var iPv6Mask = new IPNumber_3.IPv6Mask("ffff:ffff:ffff:ffff:ffff:ffff:0:0");
        expect(iPv6Mask.toString()).toEqual("ffff:ffff:ffff:ffff:ffff:ffff:0:0");
    });
    it('should create throw an exception when invalid mask string is given', function () {
        expect(function () {
            // Although given string is a valid IPv6 String, it cannot be a mask, since a mask can only
            // be a contiguous on bits (1's) followed by off bits (0's)
            new IPNumber_3.IPv6Mask("3ffe:1900:4545:0003:0200:f8ff:fe21:67cf");
        }).toThrowError(Error, Validator_1.Validator.invalidMaskMessage);
    });
    it('should return value', function () {
        var iPv6Mask = new IPNumber_3.IPv6Mask("ffff:ffff:ffff:ffff:ffff:ffff:0:0");
        expect(iPv6Mask.getValue()).toEqual(new IPNumber_4.IPv6("ffff:ffff:ffff:ffff:ffff:ffff:0:0").getValue());
    });
    it('should return getHexadecatet', function () {
        var iPv6Mask = new IPNumber_3.IPv6Mask("ffff:ffff:ffff:ffff:ffff:ffff:0:0");
        expect(iPv6Mask.getHexadecatet()).toEqual(new IPNumber_4.IPv6("ffff:ffff:ffff:ffff:ffff:ffff:0:0").getHexadecatet());
    });
    it('should return prefix', function () {
        var iPv6Mask = new IPNumber_3.IPv6Mask("ffff:ffff:ffff:ffff:ffff:ffff:0:0");
        expect(iPv6Mask.prefix).toEqual(96);
    });
});
//# sourceMappingURL=MaskTest.js.map