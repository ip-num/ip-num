import {IPv4Prefix} from "../src";
import {IPv6Prefix} from "../src";
import {Validator} from "../src";
import bigInt = require("big-integer");

// TODO expand test with direct testing
describe('Prefix Test: ', () => {
    describe('IPv4Prefix', function() {
        it('should instantiate by calling constructor', () => {
            expect(new IPv4Prefix(24).toString()).toEqual("24");
            expect(new IPv4Prefix(24).getValue()).toEqual(24);
        });

        it('should instantiate by fromNumber convenient method', () => {
            expect(IPv4Prefix.fromNumber(23).toString()).toEqual("23");
            expect(IPv4Prefix.fromNumber(23).getValue()).toEqual(23);
        });

        it('should instantiate by fromRangeSize convenient method', () => {
            expect(IPv4Prefix.fromRangeSize(bigInt(1)).getValue()).toEqual(32);
            expect(IPv4Prefix.fromRangeSize(bigInt(2)).getValue()).toEqual(31);
            expect(IPv4Prefix.fromRangeSize(bigInt(4)).getValue()).toEqual(30);
            expect(IPv4Prefix.fromRangeSize(bigInt(8)).getValue()).toEqual(29);
            expect(IPv4Prefix.fromRangeSize(bigInt(16)).getValue()).toEqual(28);
            expect(IPv4Prefix.fromRangeSize(bigInt(32)).getValue()).toEqual(27);
            expect(IPv4Prefix.fromRangeSize(bigInt(64)).getValue()).toEqual(26);
            expect(IPv4Prefix.fromRangeSize(bigInt(128)).getValue()).toEqual(25);
            expect(IPv4Prefix.fromRangeSize(bigInt(256)).getValue()).toEqual(24);
            expect(IPv4Prefix.fromRangeSize(bigInt(512)).getValue()).toEqual(23);
        });

        it('should return size of range', () => {
            expect(IPv4Prefix.fromRangeSize(bigInt(1)).toRangeSize()).toEqual(bigInt(1));
            expect(IPv4Prefix.fromRangeSize(bigInt(8)).toRangeSize()).toEqual(bigInt(8));
            expect(IPv4Prefix.fromRangeSize(bigInt(256)).toRangeSize()).toEqual(bigInt(256));
        });

        it('should throw exception when fromRangeSize used with invalid size', () => {
            expect(() => {
                IPv4Prefix.fromRangeSize(bigInt(5));
            }).toThrowError(Error, Validator.invalidIPRangeSizeForCidrMessage);
            expect(() => {
                IPv4Prefix.fromRangeSize(bigInt(6));
            }).toThrowError(Error, Validator.invalidIPRangeSizeForCidrMessage);
            expect(() => {
                IPv4Prefix.fromRangeSize(bigInt(7));
            }).toThrowError(Error, Validator.invalidIPRangeSizeForCidrMessage);
            expect(() => {
                IPv4Prefix.fromRangeSize(bigInt(14));
            }).toThrowError(Error, Validator.invalidIPRangeSizeForCidrMessage);
            expect(() => {
                IPv4Prefix.fromRangeSize(bigInt(24));
            }).toThrowError(Error, Validator.invalidIPRangeSizeForCidrMessage);
            expect(() => {
                IPv4Prefix.fromRangeSize(bigInt(100));
            }).toThrowError(Error, Validator.invalidIPRangeSizeForCidrMessage);
        });

        it('should throw exception if range size is zero or higher than valid value', () => {
            expect(() => {
                IPv4Prefix.fromRangeSize(bigInt(0));
            }).toThrowError(Error, Validator.invalidIPRangeSizeMessage.replace("$iptype", "IPv4"));
            expect(() => {
                IPv4Prefix.fromRangeSize(Validator.IPV4_SIZE.plus(1));
            }).toThrowError(Error, Validator.invalidIPRangeSizeMessage.replace("$iptype", "IPv4"));
        });

        it('should throw exception if prefix is an invalid number', () => {
            expect(() => {
                new IPv4Prefix(200);
            }).toThrowError(Error, Validator.invalidPrefixValueMessage);
        });

        it('should convert correctly to subnet', () => {
            // TODO add other subnet
            expect(IPv4Prefix.fromNumber(16).toMask().toString()).toEqual("255.255.0.0");
            expect(IPv4Prefix.fromNumber(17).toMask().toString()).toEqual("255.255.128.0");
            expect(IPv4Prefix.fromNumber(18).toMask().toString()).toEqual("255.255.192.0");
            expect(IPv4Prefix.fromNumber(19).toMask().toString()).toEqual("255.255.224.0");
            expect(IPv4Prefix.fromNumber(20).toMask().toString()).toEqual("255.255.240.0");
            expect(IPv4Prefix.fromNumber(21).toMask().toString()).toEqual("255.255.248.0");
            expect(IPv4Prefix.fromNumber(22).toMask().toString()).toEqual("255.255.252.0");
            expect(IPv4Prefix.fromNumber(23).toMask().toString()).toEqual("255.255.254.0");
            expect(IPv4Prefix.fromNumber(24).toMask().toString()).toEqual("255.255.255.0");
            expect(IPv4Prefix.fromNumber(25).toMask().toString()).toEqual("255.255.255.128");
            expect(IPv4Prefix.fromNumber(26).toMask().toString()).toEqual("255.255.255.192");
            expect(IPv4Prefix.fromNumber(27).toMask().toString()).toEqual("255.255.255.224");
            expect(IPv4Prefix.fromNumber(28).toMask().toString()).toEqual("255.255.255.240");
            expect(IPv4Prefix.fromNumber(29).toMask().toString()).toEqual("255.255.255.248");
            expect(IPv4Prefix.fromNumber(30).toMask().toString()).toEqual("255.255.255.252");
            expect(IPv4Prefix.fromNumber(31).toMask().toString()).toEqual("255.255.255.254");
            expect(IPv4Prefix.fromNumber(32).toMask().toString()).toEqual("255.255.255.255");
        });
    });

    describe('IPv6Prefix', function() {
        it('should throw exception if prefix is an invalid number', () => {
            expect(() => {
                new IPv6Prefix(200);
            }).toThrowError(Error, Validator.invalidPrefixValueMessage);
        });

        it('should instantiate by fromRangeSize convenient method', () => {
            expect(IPv6Prefix.fromRangeSize(bigInt(1)).getValue()).toEqual(128);
            expect(IPv6Prefix.fromRangeSize(bigInt(2)).getValue()).toEqual(127);
            expect(IPv6Prefix.fromRangeSize(bigInt(4)).getValue()).toEqual(126);
            expect(IPv6Prefix.fromRangeSize(bigInt(8)).getValue()).toEqual(125);
            expect(IPv6Prefix.fromRangeSize(bigInt(16)).getValue()).toEqual(124);
            expect(IPv6Prefix.fromRangeSize(bigInt(32)).getValue()).toEqual(123);
            expect(IPv6Prefix.fromRangeSize(bigInt(64)).getValue()).toEqual(122);
            expect(IPv6Prefix.fromRangeSize(bigInt(128)).getValue()).toEqual(121);
            expect(IPv6Prefix.fromRangeSize(bigInt(256)).getValue()).toEqual(120);
            expect(IPv6Prefix.fromRangeSize(bigInt(512)).getValue()).toEqual(119);
        });

        it('should return size of range', () => {
            expect(IPv6Prefix.fromRangeSize(bigInt(1)).toRangeSize()).toEqual(bigInt(1));
            expect(IPv6Prefix.fromRangeSize(bigInt(8)).toRangeSize()).toEqual(bigInt(8));
            expect(IPv6Prefix.fromRangeSize(bigInt(256)).toRangeSize()).toEqual(bigInt(256));
        });

        it('should throw exception when fromRangeSize used with invalid size', () => {
            expect(() => {
                IPv6Prefix.fromRangeSize(bigInt(5));
            }).toThrowError(Error, Validator.invalidIPRangeSizeForCidrMessage);
            expect(() => {
                IPv6Prefix.fromRangeSize(bigInt(6));
            }).toThrowError(Error, Validator.invalidIPRangeSizeForCidrMessage);
            expect(() => {
                IPv6Prefix.fromRangeSize(bigInt(7));
            }).toThrowError(Error, Validator.invalidIPRangeSizeForCidrMessage);
            expect(() => {
                IPv4Prefix.fromRangeSize(bigInt(14));
            }).toThrowError(Error, Validator.invalidIPRangeSizeForCidrMessage);
            expect(() => {
                IPv6Prefix.fromRangeSize(bigInt(24));
            }).toThrowError(Error, Validator.invalidIPRangeSizeForCidrMessage);
            expect(() => {
                IPv6Prefix.fromRangeSize(bigInt(100));
            }).toThrowError(Error, Validator.invalidIPRangeSizeForCidrMessage);
        });

        it('should throw exception if range size is zero or higher than valid value', () => {
            expect(() => {
                IPv6Prefix.fromRangeSize(bigInt(0));
            }).toThrowError(Error, Validator.invalidIPRangeSizeMessage.replace("$iptype", "IPv6"));
            expect(() => {
                IPv6Prefix.fromRangeSize(Validator.IPV6_SIZE.plus(1));
            }).toThrowError(Error, Validator.invalidIPRangeSizeMessage.replace("$iptype", "IPv6"));
        });

    });
});