"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var src_1 = require("../src");
var src_2 = require("../src");
var src_3 = require("../src");
var bigInt = require("big-integer");
// TODO expand test with direct testing
describe('Prefix Test: ', function () {
    describe('IPv4Prefix', function () {
        it('should instantiate by calling constructor', function () {
            expect(new src_1.IPv4Prefix(24).toString()).toEqual("24");
            expect(new src_1.IPv4Prefix(24).getValue()).toEqual(24);
        });
        it('should instantiate by fromNumber convenient method', function () {
            expect(src_1.IPv4Prefix.fromNumber(23).toString()).toEqual("23");
            expect(src_1.IPv4Prefix.fromNumber(23).getValue()).toEqual(23);
        });
        it('should instantiate by fromRangeSize convenient method', function () {
            expect(src_1.IPv4Prefix.fromRangeSize(bigInt(1)).getValue()).toEqual(32);
            expect(src_1.IPv4Prefix.fromRangeSize(bigInt(2)).getValue()).toEqual(31);
            expect(src_1.IPv4Prefix.fromRangeSize(bigInt(4)).getValue()).toEqual(30);
            expect(src_1.IPv4Prefix.fromRangeSize(bigInt(8)).getValue()).toEqual(29);
            expect(src_1.IPv4Prefix.fromRangeSize(bigInt(16)).getValue()).toEqual(28);
            expect(src_1.IPv4Prefix.fromRangeSize(bigInt(32)).getValue()).toEqual(27);
            expect(src_1.IPv4Prefix.fromRangeSize(bigInt(64)).getValue()).toEqual(26);
            expect(src_1.IPv4Prefix.fromRangeSize(bigInt(128)).getValue()).toEqual(25);
            expect(src_1.IPv4Prefix.fromRangeSize(bigInt(256)).getValue()).toEqual(24);
            expect(src_1.IPv4Prefix.fromRangeSize(bigInt(512)).getValue()).toEqual(23);
        });
        it('should return size of range', function () {
            expect(src_1.IPv4Prefix.fromRangeSize(bigInt(1)).toRangeSize()).toEqual(bigInt(1));
            expect(src_1.IPv4Prefix.fromRangeSize(bigInt(8)).toRangeSize()).toEqual(bigInt(8));
            expect(src_1.IPv4Prefix.fromRangeSize(bigInt(256)).toRangeSize()).toEqual(bigInt(256));
        });
        it('should throw exception when fromRangeSize used with invalid size', function () {
            expect(function () {
                src_1.IPv4Prefix.fromRangeSize(bigInt(5));
            }).toThrowError(Error, src_3.Validator.invalidIPRangeSizeForCidrMessage);
            expect(function () {
                src_1.IPv4Prefix.fromRangeSize(bigInt(6));
            }).toThrowError(Error, src_3.Validator.invalidIPRangeSizeForCidrMessage);
            expect(function () {
                src_1.IPv4Prefix.fromRangeSize(bigInt(7));
            }).toThrowError(Error, src_3.Validator.invalidIPRangeSizeForCidrMessage);
            expect(function () {
                src_1.IPv4Prefix.fromRangeSize(bigInt(14));
            }).toThrowError(Error, src_3.Validator.invalidIPRangeSizeForCidrMessage);
            expect(function () {
                src_1.IPv4Prefix.fromRangeSize(bigInt(24));
            }).toThrowError(Error, src_3.Validator.invalidIPRangeSizeForCidrMessage);
            expect(function () {
                src_1.IPv4Prefix.fromRangeSize(bigInt(100));
            }).toThrowError(Error, src_3.Validator.invalidIPRangeSizeForCidrMessage);
        });
        it('should throw exception if range size is zero or higher than valid value', function () {
            expect(function () {
                src_1.IPv4Prefix.fromRangeSize(bigInt(0));
            }).toThrowError(Error, src_3.Validator.invalidIPRangeSizeMessage.replace("$iptype", "IPv4"));
            expect(function () {
                src_1.IPv4Prefix.fromRangeSize(src_3.Validator.IPV4_SIZE.plus(1));
            }).toThrowError(Error, src_3.Validator.invalidIPRangeSizeMessage.replace("$iptype", "IPv4"));
        });
        it('should throw exception if prefix is an invalid number', function () {
            expect(function () {
                new src_1.IPv4Prefix(200);
            }).toThrowError(Error, src_3.Validator.invalidPrefixValueMessage);
        });
        it('should convert correctly to subnet', function () {
            // TODO add other subnet
            expect(src_1.IPv4Prefix.fromNumber(16).toMask().toString()).toEqual("255.255.0.0");
            expect(src_1.IPv4Prefix.fromNumber(17).toMask().toString()).toEqual("255.255.128.0");
            expect(src_1.IPv4Prefix.fromNumber(18).toMask().toString()).toEqual("255.255.192.0");
            expect(src_1.IPv4Prefix.fromNumber(19).toMask().toString()).toEqual("255.255.224.0");
            expect(src_1.IPv4Prefix.fromNumber(20).toMask().toString()).toEqual("255.255.240.0");
            expect(src_1.IPv4Prefix.fromNumber(21).toMask().toString()).toEqual("255.255.248.0");
            expect(src_1.IPv4Prefix.fromNumber(22).toMask().toString()).toEqual("255.255.252.0");
            expect(src_1.IPv4Prefix.fromNumber(23).toMask().toString()).toEqual("255.255.254.0");
            expect(src_1.IPv4Prefix.fromNumber(24).toMask().toString()).toEqual("255.255.255.0");
            expect(src_1.IPv4Prefix.fromNumber(25).toMask().toString()).toEqual("255.255.255.128");
            expect(src_1.IPv4Prefix.fromNumber(26).toMask().toString()).toEqual("255.255.255.192");
            expect(src_1.IPv4Prefix.fromNumber(27).toMask().toString()).toEqual("255.255.255.224");
            expect(src_1.IPv4Prefix.fromNumber(28).toMask().toString()).toEqual("255.255.255.240");
            expect(src_1.IPv4Prefix.fromNumber(29).toMask().toString()).toEqual("255.255.255.248");
            expect(src_1.IPv4Prefix.fromNumber(30).toMask().toString()).toEqual("255.255.255.252");
            expect(src_1.IPv4Prefix.fromNumber(31).toMask().toString()).toEqual("255.255.255.254");
            expect(src_1.IPv4Prefix.fromNumber(32).toMask().toString()).toEqual("255.255.255.255");
        });
    });
    describe('IPv6Prefix', function () {
        it('should throw exception if prefix is an invalid number', function () {
            expect(function () {
                new src_2.IPv6Prefix(200);
            }).toThrowError(Error, src_3.Validator.invalidPrefixValueMessage);
        });
        it('should instantiate by fromRangeSize convenient method', function () {
            expect(src_2.IPv6Prefix.fromRangeSize(bigInt(1)).getValue()).toEqual(128);
            expect(src_2.IPv6Prefix.fromRangeSize(bigInt(2)).getValue()).toEqual(127);
            expect(src_2.IPv6Prefix.fromRangeSize(bigInt(4)).getValue()).toEqual(126);
            expect(src_2.IPv6Prefix.fromRangeSize(bigInt(8)).getValue()).toEqual(125);
            expect(src_2.IPv6Prefix.fromRangeSize(bigInt(16)).getValue()).toEqual(124);
            expect(src_2.IPv6Prefix.fromRangeSize(bigInt(32)).getValue()).toEqual(123);
            expect(src_2.IPv6Prefix.fromRangeSize(bigInt(64)).getValue()).toEqual(122);
            expect(src_2.IPv6Prefix.fromRangeSize(bigInt(128)).getValue()).toEqual(121);
            expect(src_2.IPv6Prefix.fromRangeSize(bigInt(256)).getValue()).toEqual(120);
            expect(src_2.IPv6Prefix.fromRangeSize(bigInt(512)).getValue()).toEqual(119);
        });
        it('should return size of range', function () {
            expect(src_2.IPv6Prefix.fromRangeSize(bigInt(1)).toRangeSize()).toEqual(bigInt(1));
            expect(src_2.IPv6Prefix.fromRangeSize(bigInt(8)).toRangeSize()).toEqual(bigInt(8));
            expect(src_2.IPv6Prefix.fromRangeSize(bigInt(256)).toRangeSize()).toEqual(bigInt(256));
        });
        it('should throw exception when fromRangeSize used with invalid size', function () {
            expect(function () {
                src_2.IPv6Prefix.fromRangeSize(bigInt(5));
            }).toThrowError(Error, src_3.Validator.invalidIPRangeSizeForCidrMessage);
            expect(function () {
                src_2.IPv6Prefix.fromRangeSize(bigInt(6));
            }).toThrowError(Error, src_3.Validator.invalidIPRangeSizeForCidrMessage);
            expect(function () {
                src_2.IPv6Prefix.fromRangeSize(bigInt(7));
            }).toThrowError(Error, src_3.Validator.invalidIPRangeSizeForCidrMessage);
            expect(function () {
                src_1.IPv4Prefix.fromRangeSize(bigInt(14));
            }).toThrowError(Error, src_3.Validator.invalidIPRangeSizeForCidrMessage);
            expect(function () {
                src_2.IPv6Prefix.fromRangeSize(bigInt(24));
            }).toThrowError(Error, src_3.Validator.invalidIPRangeSizeForCidrMessage);
            expect(function () {
                src_2.IPv6Prefix.fromRangeSize(bigInt(100));
            }).toThrowError(Error, src_3.Validator.invalidIPRangeSizeForCidrMessage);
        });
        it('should throw exception if range size is zero or higher than valid value', function () {
            expect(function () {
                src_2.IPv6Prefix.fromRangeSize(bigInt(0));
            }).toThrowError(Error, src_3.Validator.invalidIPRangeSizeMessage.replace("$iptype", "IPv6"));
            expect(function () {
                src_2.IPv6Prefix.fromRangeSize(src_3.Validator.IPV6_SIZE.plus(1));
            }).toThrowError(Error, src_3.Validator.invalidIPRangeSizeMessage.replace("$iptype", "IPv6"));
        });
    });
});
//# sourceMappingURL=PrefixTest.js.map