import {IPv4Prefix} from "../src/Prefix";
import {IPv6Prefix} from "../src/Prefix";
import {Validator} from "../src/Validator";

// TODO expand test with direct testing
describe('Prefix Test: ', () => {
    describe('IPv4Prefix', function() {
        it('should instantiate by calling constructor', () => {
            expect(new IPv4Prefix(24).toString()).toEqual("24");
            expect(new IPv4Prefix(24).getValue()).toEqual(24);
        });

        it('should instantiate by convenient method', () => {
            expect(IPv4Prefix.fromNumber(23).toString()).toEqual("23");
            expect(IPv4Prefix.fromNumber(23).getValue()).toEqual(23);
        });

        it('should throw exception if prefix is an invalid number', () => {
            expect(() => {
                new IPv4Prefix(200);
            }).toThrowError(Error, Validator.invalidPrefixValueMessage);
        });

        it('should convert correctly to subnet', () => {
            // TODO add other subnet
            expect(IPv4Prefix.fromNumber(16).toSubnet().toString()).toEqual("255.255.0.0");
            expect(IPv4Prefix.fromNumber(17).toSubnet().toString()).toEqual("255.255.128.0");
            expect(IPv4Prefix.fromNumber(18).toSubnet().toString()).toEqual("255.255.192.0");
            expect(IPv4Prefix.fromNumber(19).toSubnet().toString()).toEqual("255.255.224.0");
            expect(IPv4Prefix.fromNumber(20).toSubnet().toString()).toEqual("255.255.240.0");
            expect(IPv4Prefix.fromNumber(21).toSubnet().toString()).toEqual("255.255.248.0");
            expect(IPv4Prefix.fromNumber(22).toSubnet().toString()).toEqual("255.255.252.0");
            expect(IPv4Prefix.fromNumber(23).toSubnet().toString()).toEqual("255.255.254.0");
            expect(IPv4Prefix.fromNumber(24).toSubnet().toString()).toEqual("255.255.255.0");
            expect(IPv4Prefix.fromNumber(25).toSubnet().toString()).toEqual("255.255.255.128");
            expect(IPv4Prefix.fromNumber(26).toSubnet().toString()).toEqual("255.255.255.192");
            expect(IPv4Prefix.fromNumber(27).toSubnet().toString()).toEqual("255.255.255.224");
            expect(IPv4Prefix.fromNumber(28).toSubnet().toString()).toEqual("255.255.255.240");
            expect(IPv4Prefix.fromNumber(29).toSubnet().toString()).toEqual("255.255.255.248");
            expect(IPv4Prefix.fromNumber(30).toSubnet().toString()).toEqual("255.255.255.252");
            expect(IPv4Prefix.fromNumber(31).toSubnet().toString()).toEqual("255.255.255.254");
            expect(IPv4Prefix.fromNumber(32).toSubnet().toString()).toEqual("255.255.255.255");
        });
    });

    describe('IPv6Prefix', function() {
        it('should throw exception if prefix is an invalid number', () => {
            expect(() => {
                new IPv6Prefix(200);
            }).toThrowError(Error, Validator.invalidPrefixValueMessage);
        });
    });
});