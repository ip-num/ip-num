"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Prefix_1 = require("../src/Prefix");
var Prefix_2 = require("../src/Prefix");
var Validator_1 = require("../src/Validator");
// TODO expand test with direct testing
describe('Prefix Test: ', function () {
    describe('IPv4Prefix', function () {
        it('should instantiate by calling constructor', function () {
            expect(new Prefix_1.IPv4Prefix(24).toString()).toEqual("24");
            expect(new Prefix_1.IPv4Prefix(24).getValue()).toEqual(24);
        });
        it('should instantiate by convenient method', function () {
            expect(Prefix_1.IPv4Prefix.fromNumber(23).toString()).toEqual("23");
            expect(Prefix_1.IPv4Prefix.fromNumber(23).getValue()).toEqual(23);
        });
        it('should throw exception if prefix is an invalid number', function () {
            expect(function () {
                new Prefix_1.IPv4Prefix(200);
            }).toThrowError(Error, Validator_1.Validator.invalidPrefixValueMessage);
        });
        it('should convert correctly to subnet', function () {
            // TODO add other subnet
            expect(Prefix_1.IPv4Prefix.fromNumber(16).toSubnetMask().toString()).toEqual("255.255.0.0");
            expect(Prefix_1.IPv4Prefix.fromNumber(17).toSubnetMask().toString()).toEqual("255.255.128.0");
            expect(Prefix_1.IPv4Prefix.fromNumber(18).toSubnetMask().toString()).toEqual("255.255.192.0");
            expect(Prefix_1.IPv4Prefix.fromNumber(19).toSubnetMask().toString()).toEqual("255.255.224.0");
            expect(Prefix_1.IPv4Prefix.fromNumber(20).toSubnetMask().toString()).toEqual("255.255.240.0");
            expect(Prefix_1.IPv4Prefix.fromNumber(21).toSubnetMask().toString()).toEqual("255.255.248.0");
            expect(Prefix_1.IPv4Prefix.fromNumber(22).toSubnetMask().toString()).toEqual("255.255.252.0");
            expect(Prefix_1.IPv4Prefix.fromNumber(23).toSubnetMask().toString()).toEqual("255.255.254.0");
            expect(Prefix_1.IPv4Prefix.fromNumber(24).toSubnetMask().toString()).toEqual("255.255.255.0");
            expect(Prefix_1.IPv4Prefix.fromNumber(25).toSubnetMask().toString()).toEqual("255.255.255.128");
            expect(Prefix_1.IPv4Prefix.fromNumber(26).toSubnetMask().toString()).toEqual("255.255.255.192");
            expect(Prefix_1.IPv4Prefix.fromNumber(27).toSubnetMask().toString()).toEqual("255.255.255.224");
            expect(Prefix_1.IPv4Prefix.fromNumber(28).toSubnetMask().toString()).toEqual("255.255.255.240");
            expect(Prefix_1.IPv4Prefix.fromNumber(29).toSubnetMask().toString()).toEqual("255.255.255.248");
            expect(Prefix_1.IPv4Prefix.fromNumber(30).toSubnetMask().toString()).toEqual("255.255.255.252");
            expect(Prefix_1.IPv4Prefix.fromNumber(31).toSubnetMask().toString()).toEqual("255.255.255.254");
            expect(Prefix_1.IPv4Prefix.fromNumber(32).toSubnetMask().toString()).toEqual("255.255.255.255");
        });
    });
    describe('IPv6Prefix', function () {
        it('should throw exception if prefix is an invalid number', function () {
            expect(function () {
                new Prefix_2.IPv6Prefix(200);
            }).toThrowError(Error, Validator_1.Validator.invalidPrefixValueMessage);
        });
    });
});
//# sourceMappingURL=PrefixTest.js.map