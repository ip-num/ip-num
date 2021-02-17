'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var src_1 = require("../src");
describe('Validator: ', function () {
    describe('isValidIPv4String ', function () {
        it('validate IPv4 strings', function () {
            expect(src_1.Validator.isValidIPv4String('123.234.0.1')[0]).toBe(true);
            expect(src_1.Validator.isValidIPv4String('123.234.0. 1')[0]).toBe(false);
            expect(src_1.Validator.isValidIPv4String('123.234.0 .1')[0]).toBe(false);
            expect(src_1.Validator.isValidIPv4String('10.10.10.X')[0]).toBe(false);
            expect(src_1.Validator.isValidIPv4String('1.2.3.4xyz')[0]).toBe(false);
            expect(src_1.Validator.isValidIPv4String('1. 2.3.4xyz')[0]).toBe(false);
            expect(src_1.Validator.isValidIPv4String('1..3.4xyz')[0]).toBe(false);
            expect(src_1.Validator.isValidIPv4String('1.2.3.')[0]).toBe(false);
        });
    });
    describe('isValidIPv6String ', function () {
        it('validate IPv6 strings', function () {
            expect(src_1.Validator.isValidIPv6String('ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff')[0]).toBe(true);
            expect(src_1.Validator.isValidIPv6String('ffff:ffffxyz:ffff:ffff:ffff:ffff:ffff:ffff')[0]).toBe(false);
            expect(src_1.Validator.isValidIPv6String(' ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff ')[0]).toBe(false);
            expect(src_1.Validator.isValidIPv6String('ffff:ffff:::ffff:ffff:ffff')[0]).toBe(false);
            expect(src_1.Validator.isValidIPv6String('ffff:ffff:ffff:ffff:ffff:ffff::ffff:ffff')[0]).toBe(false);
            expect(src_1.Validator.isValidIPv6String('ffff:ffff:ffff:ffff:ffff:ffff:ffff: ffff')[0]).toBe(false);
            expect(src_1.Validator.isValidIPv6String('ffff:ffff:ffff:ffff:ffff:ffff:ffff :ffff')[0]).toBe(false);
            expect(src_1.Validator.isValidIPv6String('ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff')[0]).toBe(false);
            expect(src_1.Validator.isValidIPv6String('123.234.10.10')[0]).toBe(false);
        });
    });
    describe('isValidIPv4CidrNotation ', function () {
        it('validate malformed IPv4', function () {
            expect(src_1.Validator.isValidIPv4CidrNotation("123.234.334.23")[0]).toBe(false);
            expect(src_1.Validator.isValidIPv4CidrNotation("123.234.334.23")[1][0]).toBe(src_1.Validator.invalidIPv4CidrNotationMessage);
            expect(src_1.Validator.isValidIPv4CidrNotation("123.234.334.0/")[0]).toBe(false);
            expect(src_1.Validator.isValidIPv4CidrNotation("123.234.334.0/")[1][0]).toBe(src_1.Validator.invalidIPv4CidrNotationMessage);
            expect(src_1.Validator.isValidIPv4CidrNotation("123.234.334.0/8")[0]).toBe(false);
            expect(src_1.Validator.isValidIPv4CidrNotation("123.234.334.0/8")[1].some(function (errorMessage) { return errorMessage === src_1.Validator.invalidOctetRangeMessage; })).toBe(true);
            expect(src_1.Validator.isValidIPv4CidrNotation("10.0.0.0/33")[0]).toBe(false);
            expect(src_1.Validator.isValidIPv4CidrNotation("10.0.0.0/33")[1].some(function (errorMessage) { return errorMessage === src_1.Validator.invalidPrefixValueMessage; })).toBe(true);
            expect(src_1.Validator.isValidIPv4CidrNotation("123.234.334.0/34")[0]).toBe(false);
            expect(src_1.Validator.isValidIPv4CidrNotation("123.234.334.0/34")[1].some(function (errorMessage) { return errorMessage === src_1.Validator.invalidOctetRangeMessage; })).toBe(true);
            expect(src_1.Validator.isValidIPv4CidrNotation("123.234.334.0/34")[1].some(function (errorMessage) { return errorMessage === src_1.Validator.invalidPrefixValueMessage; })).toBe(true);
            expect(src_1.Validator.isValidIPv4CidrNotation('1.1.1.x/28')[0]).toBe(false);
            expect(src_1.Validator.isValidIPv4CidrNotation("123.234.334.0/3x")[0]).toBe(false);
        });
    });
    describe('isValidPrefixValue', function () {
        it('validate invalid IPNumType', function () {
            expect(src_1.Validator.isValidPrefixValue(3, "ASN" /* ASN */)[0]).toBe(false);
            expect(src_1.Validator.isValidPrefixValue(3, "ASN" /* ASN */)[1].some(function (errorMessage) { return errorMessage === src_1.Validator.invalidInetNumType; })).toBe(true);
        });
    });
    describe('isValidIPv4RangeString', function () {
        it('validate valid range string', function () {
            expect(src_1.Validator.isValidIPv4RangeString("10.0.0.0 - 10.0.0.255")[0]).toBe(true);
            expect(src_1.Validator.isValidIPv4RangeString("10.0.0.0-10.0.0.255")[0]).toBe(true);
        });
        it('validate invalid range string', function () {
            expect(src_1.Validator.isValidIPv4RangeString("10.0.0.0-10.0.0.0")[0]).toBe(false);
            expect(src_1.Validator.isValidIPv4RangeString("10.0.0 - 10.0.0.255")[0]).toBe(false);
            expect(src_1.Validator.isValidIPv4RangeString("10.0.0.0-10.0.0.255.0")[0]).toBe(false);
            expect(src_1.Validator.isValidIPv4RangeString("10.0.0.0")[0]).toBe(false);
            expect(src_1.Validator.isValidIPv4RangeString("10.0.0.255-10.0.0.0")[0]).toBe(false);
        });
    });
    describe('isValidIPv6RangeString', function () {
        it('validate valid range string', function () {
            expect(src_1.Validator.isValidIPv6RangeString("2001:db8:: - 3001:db8::")[0]).toBe(true);
            expect(src_1.Validator.isValidIPv6RangeString("2001:db8::-3001:db8::")[0]).toBe(true);
        });
        it('validate invalid range string', function () {
            expect(src_1.Validator.isValidIPv6RangeString("10.0.0.0 - 10.0.0.255")[0]).toBe(false);
            expect(src_1.Validator.isValidIPv6RangeString("10.0.0.0-10.0.0.255")[0]).toBe(false);
            expect(src_1.Validator.isValidIPv6RangeString("2001:db8: - 3001:db8::")[0]).toBe(false);
            expect(src_1.Validator.isValidIPv6RangeString("2001:db8:: - 3001:db8")[0]).toBe(false);
            expect(src_1.Validator.isValidIPv6RangeString("3001:db8")[0]).toBe(false);
            expect(src_1.Validator.isValidIPv6RangeString("3001:db8::-2001:db8::")[0]).toBe(false);
        });
    });
    describe('isValidIPv4CidrRange', function () {
        it('validate valid ipv4 cidr range', function () {
            expect(src_1.Validator.isValidIPv4CidrRange("10.0.0.0/8")[0]).toBe(true);
        });
        it('validate invalid ipv4 cidr range', function () {
            expect(src_1.Validator.isValidIPv4CidrRange("10.0.0.1/8")[0]).toBe(false);
        });
        it('validate invalid ipv4 cidr notation', function () {
            expect(src_1.Validator.isValidIPv4CidrRange("10.0.0.18")[0]).toBe(false);
        });
    });
    describe('isValidIPv6CidrRange', function () {
        it('validate valid ipv6 cidr range', function () {
            expect(src_1.Validator.isValidIPv6CidrRange("2001:db8:85a3::/64")[0]).toBe(true);
        });
        it('validate invalid ipv6 cidr range', function () {
            expect(src_1.Validator.isValidIPv6CidrRange("2001:db8:85a3::8a2e:370:7334/64")[0]).toBe(false);
        });
        it('validate invalid ipv6 cidr notation', function () {
            expect(src_1.Validator.isValidIPv6CidrRange("2001:8a2e:370Q:733464")[0]).toBe(false);
        });
    });
});
//# sourceMappingURL=ValidatorTest.js.map