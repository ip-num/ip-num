import {IPv4Prefix} from "../src";
import {IPv6Prefix} from "../src";
import {Validator} from "../src";

// TODO expand test with direct testing
describe('Prefix Test: ', () => {
    describe('IPv4Prefix', function() {
        it('should instantiate by calling constructor', () => {
            expect(new IPv4Prefix(24n).toString()).toEqual("24");
            expect(new IPv4Prefix(24n).getValue()).toEqual(24n);
        });

        it('should instantiate by fromNumber convenient method', () => {
            expect(IPv4Prefix.fromNumber(23n).toString()).toEqual("23");
            expect(IPv4Prefix.fromNumber(23n).getValue()).toEqual(23n);
        });

        it('should instantiate by fromRangeSize convenient method', () => {
            expect(IPv4Prefix.fromRangeSize(BigInt(1)).getValue()).toEqual(32n);
            expect(IPv4Prefix.fromRangeSize(BigInt(2)).getValue()).toEqual(31n);
            expect(IPv4Prefix.fromRangeSize(BigInt(4)).getValue()).toEqual(30n);
            expect(IPv4Prefix.fromRangeSize(BigInt(8)).getValue()).toEqual(29n);
            expect(IPv4Prefix.fromRangeSize(BigInt(16)).getValue()).toEqual(28n);
            expect(IPv4Prefix.fromRangeSize(BigInt(32)).getValue()).toEqual(27n);
            expect(IPv4Prefix.fromRangeSize(BigInt(64)).getValue()).toEqual(26n);
            expect(IPv4Prefix.fromRangeSize(BigInt(128)).getValue()).toEqual(25n);
            expect(IPv4Prefix.fromRangeSize(BigInt(256)).getValue()).toEqual(24n);
            expect(IPv4Prefix.fromRangeSize(BigInt(512)).getValue()).toEqual(23n);
        });

        it('should return size of range', () => {
            expect(IPv4Prefix.fromRangeSize(BigInt(1)).toRangeSize()).toEqual(BigInt(1));
            expect(IPv4Prefix.fromRangeSize(BigInt(8)).toRangeSize()).toEqual(BigInt(8));
            expect(IPv4Prefix.fromRangeSize(BigInt(256)).toRangeSize()).toEqual(BigInt(256));
        });

        it('should throw exception when fromRangeSize used with invalid size', () => {
            expect(() => {
                IPv4Prefix.fromRangeSize(BigInt(5));
            }).toThrowError(Error, Validator.invalidIPRangeSizeForCidrMessage);
            expect(() => {
                IPv4Prefix.fromRangeSize(BigInt(6));
            }).toThrowError(Error, Validator.invalidIPRangeSizeForCidrMessage);
            expect(() => {
                IPv4Prefix.fromRangeSize(BigInt(7));
            }).toThrowError(Error, Validator.invalidIPRangeSizeForCidrMessage);
            expect(() => {
                IPv4Prefix.fromRangeSize(BigInt(14));
            }).toThrowError(Error, Validator.invalidIPRangeSizeForCidrMessage);
            expect(() => {
                IPv4Prefix.fromRangeSize(BigInt(24));
            }).toThrowError(Error, Validator.invalidIPRangeSizeForCidrMessage);
            expect(() => {
                IPv4Prefix.fromRangeSize(BigInt(100));
            }).toThrowError(Error, Validator.invalidIPRangeSizeForCidrMessage);
        });

        it('should throw exception if range size is zero or higher than valid value', () => {
            expect(() => {
                IPv4Prefix.fromRangeSize(0n);
            }).toThrowError(Error, Validator.invalidIPRangeSizeMessage.replace("$iptype", "IPv4"));
            expect(() => {
                IPv4Prefix.fromRangeSize(Validator.IPV4_SIZE + 1n);
            }).toThrowError(Error, Validator.invalidIPRangeSizeMessage.replace("$iptype", "IPv4"));
        });

        it('should throw exception if prefix is an invalid number', () => {
            expect(() => {
                new IPv4Prefix(200n);
            }).toThrowError(Error, Validator.invalidPrefixValueMessage);
        });

        it('should convert correctly to subnet', () => {
            // TODO add other subnet
            expect(IPv4Prefix.fromNumber(16n).toMask().toString()).toEqual("255.255.0.0");
            expect(IPv4Prefix.fromNumber(17n).toMask().toString()).toEqual("255.255.128.0");
            expect(IPv4Prefix.fromNumber(18n).toMask().toString()).toEqual("255.255.192.0");
            expect(IPv4Prefix.fromNumber(19n).toMask().toString()).toEqual("255.255.224.0");
            expect(IPv4Prefix.fromNumber(20n).toMask().toString()).toEqual("255.255.240.0");
            expect(IPv4Prefix.fromNumber(21n).toMask().toString()).toEqual("255.255.248.0");
            expect(IPv4Prefix.fromNumber(22n).toMask().toString()).toEqual("255.255.252.0");
            expect(IPv4Prefix.fromNumber(23n).toMask().toString()).toEqual("255.255.254.0");
            expect(IPv4Prefix.fromNumber(24n).toMask().toString()).toEqual("255.255.255.0");
            expect(IPv4Prefix.fromNumber(25n).toMask().toString()).toEqual("255.255.255.128");
            expect(IPv4Prefix.fromNumber(26n).toMask().toString()).toEqual("255.255.255.192");
            expect(IPv4Prefix.fromNumber(27n).toMask().toString()).toEqual("255.255.255.224");
            expect(IPv4Prefix.fromNumber(28n).toMask().toString()).toEqual("255.255.255.240");
            expect(IPv4Prefix.fromNumber(29n).toMask().toString()).toEqual("255.255.255.248");
            expect(IPv4Prefix.fromNumber(30n).toMask().toString()).toEqual("255.255.255.252");
            expect(IPv4Prefix.fromNumber(31n).toMask().toString()).toEqual("255.255.255.254");
            expect(IPv4Prefix.fromNumber(32n).toMask().toString()).toEqual("255.255.255.255");
        });
    });

    describe('IPv6Prefix', function() {
        it('should throw exception if prefix is an invalid number', () => {
            expect(() => {
                new IPv6Prefix(200n);
            }).toThrowError(Error, Validator.invalidPrefixValueMessage);
        });

        it('should instantiate by fromRangeSize convenient method', () => {
            expect(IPv6Prefix.fromRangeSize(BigInt(1)).getValue()).toEqual(128n);
            expect(IPv6Prefix.fromRangeSize(BigInt(2)).getValue()).toEqual(127n);
            expect(IPv6Prefix.fromRangeSize(BigInt(4)).getValue()).toEqual(126n);
            expect(IPv6Prefix.fromRangeSize(BigInt(8)).getValue()).toEqual(125n);
            expect(IPv6Prefix.fromRangeSize(BigInt(16)).getValue()).toEqual(124n);
            expect(IPv6Prefix.fromRangeSize(BigInt(32)).getValue()).toEqual(123n);
            expect(IPv6Prefix.fromRangeSize(BigInt(64)).getValue()).toEqual(122n);
            expect(IPv6Prefix.fromRangeSize(BigInt(128)).getValue()).toEqual(121n);
            expect(IPv6Prefix.fromRangeSize(BigInt(256)).getValue()).toEqual(120n);
            expect(IPv6Prefix.fromRangeSize(BigInt(512)).getValue()).toEqual(119n);
        });

        it('should return size of range', () => {
            expect(IPv6Prefix.fromRangeSize(BigInt(1)).toRangeSize()).toEqual(BigInt(1));
            expect(IPv6Prefix.fromRangeSize(BigInt(8)).toRangeSize()).toEqual(BigInt(8));
            expect(IPv6Prefix.fromRangeSize(BigInt(256)).toRangeSize()).toEqual(BigInt(256));
        });

        it('should throw exception when fromRangeSize used with invalid size', () => {
            expect(() => {
                IPv6Prefix.fromRangeSize(BigInt(5));
            }).toThrowError(Error, Validator.invalidIPRangeSizeForCidrMessage);
            expect(() => {
                IPv6Prefix.fromRangeSize(BigInt(6));
            }).toThrowError(Error, Validator.invalidIPRangeSizeForCidrMessage);
            expect(() => {
                IPv6Prefix.fromRangeSize(BigInt(7));
            }).toThrowError(Error, Validator.invalidIPRangeSizeForCidrMessage);
            expect(() => {
                IPv4Prefix.fromRangeSize(BigInt(14));
            }).toThrowError(Error, Validator.invalidIPRangeSizeForCidrMessage);
            expect(() => {
                IPv6Prefix.fromRangeSize(BigInt(24));
            }).toThrowError(Error, Validator.invalidIPRangeSizeForCidrMessage);
            expect(() => {
                IPv6Prefix.fromRangeSize(BigInt(100));
            }).toThrowError(Error, Validator.invalidIPRangeSizeForCidrMessage);
        });

        it('should throw exception if range size is zero or higher than valid value', () => {
            expect(() => {
                IPv6Prefix.fromRangeSize(0n);
            }).toThrowError(Error, Validator.invalidIPRangeSizeMessage.replace("$iptype", "IPv6"));
            expect(() => {
                IPv6Prefix.fromRangeSize(Validator.IPV6_SIZE + 1n);
            }).toThrowError(Error, Validator.invalidIPRangeSizeMessage.replace("$iptype", "IPv6"));
        });

    });
});