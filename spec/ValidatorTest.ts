'use strict';
import {Validator} from "../src";
import {IPNumType} from "../src";

describe('Validator: ', () => {
    describe('isValidIPv4String ', () => {
        it('validate IPv4 strings', () => {
            expect(Validator.isValidIPv4String('123.234.0.1')[0]).toBe(true);
            expect(Validator.isValidIPv4String('123.234.0. 1')[0]).toBe(false);
            expect(Validator.isValidIPv4String('123.234.0 .1')[0]).toBe(false);
            expect(Validator.isValidIPv4String('10.10.10.X')[0]).toBe(false);
            expect(Validator.isValidIPv4String('1.2.3.4xyz')[0]).toBe(false);
            expect(Validator.isValidIPv4String('1. 2.3.4xyz')[0]).toBe(false);
            expect(Validator.isValidIPv4String('1..3.4xyz')[0]).toBe(false);
            expect(Validator.isValidIPv4String('1.2.3.')[0]).toBe(false);
        });
    });

    describe('isValidIPv6String ', () => {
        it('validate IPv6 strings', () => {
            expect(Validator.isValidIPv6String('ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff')[0]).toBe(true);
            expect(Validator.isValidIPv6String('ffff:ffffxyz:ffff:ffff:ffff:ffff:ffff:ffff')[0]).toBe(false);
            expect(Validator.isValidIPv6String(' ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff ')[0]).toBe(false);
            expect(Validator.isValidIPv6String('ffff:ffff:::ffff:ffff:ffff')[0]).toBe(false);
            expect(Validator.isValidIPv6String('ffff:ffff:ffff:ffff:ffff:ffff::ffff:ffff')[0]).toBe(false);
            expect(Validator.isValidIPv6String('ffff:ffff:ffff:ffff:ffff:ffff:ffff: ffff')[0]).toBe(false);
            expect(Validator.isValidIPv6String('ffff:ffff:ffff:ffff:ffff:ffff:ffff :ffff')[0]).toBe(false);
            expect(Validator.isValidIPv6String('ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff')[0]).toBe(false);
            expect(Validator.isValidIPv6String('123.234.10.10')[0]).toBe(false);
        });
    });

    describe('isValidIPv4CidrNotation ', () => {
        it('validate malformed IPv4', () => {
            expect(Validator.isValidIPv4CidrNotation("123.234.334.23")[0]).toBe(false);
            expect(Validator.isValidIPv4CidrNotation("123.234.334.23")[1][0]).toBe(Validator.invalidIPv4CidrNotationMessage);

            expect(Validator.isValidIPv4CidrNotation("123.234.334.0/")[0]).toBe(false);
            expect(Validator.isValidIPv4CidrNotation("123.234.334.0/")[1][0]).toBe(Validator.invalidIPv4CidrNotationMessage);

            expect(Validator.isValidIPv4CidrNotation("123.234.334.0/8")[0]).toBe(false);
            expect(Validator.isValidIPv4CidrNotation("123.234.334.0/8")[1].some(errorMessage => { return errorMessage === Validator.invalidOctetRangeMessage})).toBe(true);

            expect(Validator.isValidIPv4CidrNotation("10.0.0.0/33")[0]).toBe(false);
            expect(Validator.isValidIPv4CidrNotation("10.0.0.0/33")[1].some(errorMessage => {return errorMessage === Validator.invalidPrefixValueMessage})).toBe(true);

            expect(Validator.isValidIPv4CidrNotation("123.234.334.0/34")[0]).toBe(false);
            expect(Validator.isValidIPv4CidrNotation("123.234.334.0/34")[1].some(errorMessage => { return errorMessage === Validator.invalidOctetRangeMessage})).toBe(true);
            expect(Validator.isValidIPv4CidrNotation("123.234.334.0/34")[1].some(errorMessage => {return errorMessage ===Validator.invalidPrefixValueMessage})).toBe(true);

            expect(Validator.isValidIPv4CidrNotation('1.1.1.x/28')[0]).toBe(false);
            expect(Validator.isValidIPv4CidrNotation("123.234.334.0/3x")[0]).toBe(false);
        });
    });

    describe('isValidPrefixValue', () => {
        it('validate invalid IPNumType', () => {
            expect(Validator.isValidPrefixValue(3, IPNumType.ASN)[0]).toBe(false);
            expect(Validator.isValidPrefixValue(3, IPNumType.ASN)[1].some(errorMessage => {return errorMessage === Validator.invalidInetNumType})).toBe(true);
        });
    });


    describe('isValidIPv4RangeString', () => {
        it('validate valid range string', () => {
            expect(Validator.isValidIPv4RangeString("10.0.0.0 - 10.0.0.255")[0]).toBe(true);
            expect(Validator.isValidIPv4RangeString("10.0.0.0-10.0.0.255")[0]).toBe(true);
        });

        it('validate invalid range string', () => {
            expect(Validator.isValidIPv4RangeString("10.0.0.0-10.0.0.0")[0]).toBe(false);
            expect(Validator.isValidIPv4RangeString("10.0.0 - 10.0.0.255")[0]).toBe(false);
            expect(Validator.isValidIPv4RangeString("10.0.0.0-10.0.0.255.0")[0]).toBe(false);
            expect(Validator.isValidIPv4RangeString("10.0.0.0")[0]).toBe(false);
            expect(Validator.isValidIPv4RangeString("10.0.0.255-10.0.0.0")[0]).toBe(false);
        });
    });

    describe('isValidIPv6RangeString', () => {
        it('validate valid range string', () => {
            expect(Validator.isValidIPv6RangeString("2001:db8:: - 3001:db8::")[0]).toBe(true);
            expect(Validator.isValidIPv6RangeString("2001:db8::-3001:db8::")[0]).toBe(true);
        });

        it('validate invalid range string', () => {
            expect(Validator.isValidIPv6RangeString("10.0.0.0 - 10.0.0.255")[0]).toBe(false);
            expect(Validator.isValidIPv6RangeString("10.0.0.0-10.0.0.255")[0]).toBe(false);
            expect(Validator.isValidIPv6RangeString("2001:db8: - 3001:db8::")[0]).toBe(false);
            expect(Validator.isValidIPv6RangeString("2001:db8:: - 3001:db8")[0]).toBe(false);
            expect(Validator.isValidIPv6RangeString("3001:db8")[0]).toBe(false);
            expect(Validator.isValidIPv6RangeString("3001:db8::-2001:db8::")[0]).toBe(false);
        });
    });

    describe('isValidIPv4CidrRange', () => {
      it('validate valid ipv4 cidr range', () => {
        expect(Validator.isValidIPv4CidrRange("10.0.0.0/8")[0]).toBe(true)
      });

      it('validate invalid ipv4 cidr range', () => {
        expect(Validator.isValidIPv4CidrRange("10.0.0.1/8")[0]).toBe(false)
      });
    });

    describe('isValidIPv6CidrRange', () => {
      it('validate valid ipv6 cidr range', () => {
        expect(Validator.isValidIPv6CidrRange("2001:db8:85a3::/64")[0]).toBe(true)
      });

      it('validate invalid ipv6 cidr range', () => {
        expect(Validator.isValidIPv6CidrRange("2001:db8:85a3::8a2e:370:7334/64")[0]).toBe(false)
      });
    })
});