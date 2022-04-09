import {IPv4Mask} from "../src";
import {Validator} from "../src";
import {IPv4} from "../src";
import {IPv6Mask} from "../src";
import {IPv6} from "../src";

describe('mask test', function() {
    it('should create an instance of IPv4 mask using fromDecimalDottedString', () => {
        let iPv4Mask = IPv4Mask.fromDecimalDottedString("255.0.0.0");
        expect(iPv4Mask.toString()).toEqual("255.0.0.0");
    });

    it('should create an instance using consturctor', () => {
        let iPv4Mask = new IPv4Mask("255.0.0.0");
        expect(iPv4Mask.toString()).toEqual("255.0.0.0");
    });

    it('should create throw an exception when invalid mask string is given', () => {
        expect(() => {
            // Although given string is a valid IPv4 String, it cannot be a mask, since a mask can only
            // be a contiguous on bits (1's) followed by off bits (0's)
            new IPv4Mask("10.255.10.3");
        }).toThrowError(Error, Validator.invalidMaskMessage);
    });

    it('should return value', () => {
        let iPv4Mask = new IPv4Mask("255.0.0.0");
        expect(iPv4Mask.getValue()).toEqual(new IPv4("255.0.0.0").getValue());
    });

    it('should return octets', () => {
        let iPv4Mask = new IPv4Mask("255.0.0.0");
        expect(iPv4Mask.getOctets()).toEqual(new IPv4("255.0.0.0").getOctets());
    });

    it('should return prefix', () => {
        let iPv4Mask = new IPv4Mask("255.255.0.0");
        expect(iPv4Mask.prefix).toEqual(16);
    });

// IPv6
    it('should create an instance of iPv6Mask using fromDecimalDottedString', () => {
        let iPv6Mask = IPv6Mask.fromHexadecimalString("ffff:ffff:ffff:ffff:ffff:ffff:0:0");
        expect(iPv6Mask.toString()).toEqual("ffff:ffff:ffff:ffff:ffff:ffff:0:0");
    });

    it('should create an instance using consturctor', () => {
        let iPv6Mask = new IPv6Mask("ffff:ffff:ffff:ffff:ffff:ffff:0:0");
        expect(iPv6Mask.toString()).toEqual("ffff:ffff:ffff:ffff:ffff:ffff:0:0");
    });

    it('should create throw an exception when invalid mask string is given', () => {
        expect(() => {
            // Although given string is a valid IPv6 String, it cannot be a mask, since a mask can only
            // be a contiguous on bits (1's) followed by off bits (0's)
            new IPv6Mask("3ffe:1900:4545:0003:0200:f8ff:fe21:67cf");
        }).toThrowError(Error, Validator.invalidMaskMessage);
    });

    it('should return value', () => {
        let iPv6Mask = new IPv6Mask("ffff:ffff:ffff:ffff:ffff:ffff:0:0");
        expect(iPv6Mask.getValue()).toEqual(new IPv6("ffff:ffff:ffff:ffff:ffff:ffff:0:0").getValue());
    });

    it('should return getHexadecatet', () => {
        let iPv6Mask = new IPv6Mask("ffff:ffff:ffff:ffff:ffff:ffff:0:0");
        expect(iPv6Mask.getHexadecatet()).toEqual(new IPv6("ffff:ffff:ffff:ffff:ffff:ffff:0:0").getHexadecatet());
    });

    it('should return prefix', () => {
        let iPv6Mask = new IPv6Mask("ffff:ffff:ffff:ffff:ffff:ffff:0:0");
        expect(iPv6Mask.prefix).toEqual(96);
    });
});