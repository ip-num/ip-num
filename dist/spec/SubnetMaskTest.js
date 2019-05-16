"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SubnetMask_1 = require("../src/SubnetMask");
var Validator_1 = require("../src/Validator");
var IPv4_1 = require("../src/IPv4");
var SubnetMask_2 = require("../src/SubnetMask");
var IPv6_1 = require("../src/IPv6");
describe('Subnet mask test', function () {
    it('should create an instance of IPv4 subnet mask using fromDecimalDottedString', function () {
        var iPv4SubnetMask = SubnetMask_1.IPv4SubnetMask.fromDecimalDottedString("255.0.0.0");
        expect(iPv4SubnetMask.toString()).toEqual("255.0.0.0");
    });
    it('should create an instance using consturctor', function () {
        var iPv4SubnetMask = new SubnetMask_1.IPv4SubnetMask("255.0.0.0");
        expect(iPv4SubnetMask.toString()).toEqual("255.0.0.0");
    });
    it('should create throw an exception when invalid subnet mask string is given', function () {
        expect(function () {
            // Although given string is a valid IPv4 String, it cannot be a subnet mask, since a subnet mask can only
            // be a contiguous on bits (1's) followed by off bits (0's)
            new SubnetMask_1.IPv4SubnetMask("10.255.10.3");
        }).toThrowError(Error, Validator_1.Validator.invalidSubnetMaskMessage);
    });
    it('should return value', function () {
        var iPv4SubnetMask = new SubnetMask_1.IPv4SubnetMask("255.0.0.0");
        expect(iPv4SubnetMask.getValue()).toEqual(new IPv4_1.IPv4("255.0.0.0").getValue());
    });
    it('should return octets', function () {
        var iPv4SubnetMask = new SubnetMask_1.IPv4SubnetMask("255.0.0.0");
        expect(iPv4SubnetMask.getOctets()).toEqual(new IPv4_1.IPv4("255.0.0.0").getOctets());
    });
    // IPv6
    it('should create an instance of IPv6SubnetMask using fromDecimalDottedString', function () {
        var iPv6SubnetMask = SubnetMask_2.IPv6SubnetMask.fromHexadecimalString("ffff:ffff:ffff:ffff:ffff:ffff:0:0");
        expect(iPv6SubnetMask.toString()).toEqual("ffff:ffff:ffff:ffff:ffff:ffff:0:0");
    });
    it('should create an instance using consturctor', function () {
        var iPv6SubnetMask = new SubnetMask_2.IPv6SubnetMask("ffff:ffff:ffff:ffff:ffff:ffff:0:0");
        expect(iPv6SubnetMask.toString()).toEqual("ffff:ffff:ffff:ffff:ffff:ffff:0:0");
    });
    it('should create throw an exception when invalid subnet mask string is given', function () {
        expect(function () {
            // Although given string is a valid IPv6 String, it cannot be a subnet mask, since a subnet mask can only
            // be a contiguous on bits (1's) followed by off bits (0's)
            new SubnetMask_2.IPv6SubnetMask("3ffe:1900:4545:0003:0200:f8ff:fe21:67cf");
        }).toThrowError(Error, Validator_1.Validator.invalidSubnetMaskMessage);
    });
    it('should return value', function () {
        var iPv6Subnet = new SubnetMask_2.IPv6SubnetMask("ffff:ffff:ffff:ffff:ffff:ffff:0:0");
        expect(iPv6Subnet.getValue()).toEqual(new IPv6_1.IPv6("ffff:ffff:ffff:ffff:ffff:ffff:0:0").getValue());
    });
    it('should return getHexadecatet', function () {
        var iPv6Subnet = new SubnetMask_2.IPv6SubnetMask("ffff:ffff:ffff:ffff:ffff:ffff:0:0");
        expect(iPv6Subnet.getHexadecatet()).toEqual(new IPv6_1.IPv6("ffff:ffff:ffff:ffff:ffff:ffff:0:0").getHexadecatet());
    });
});
//# sourceMappingURL=SubnetMaskTest.js.map