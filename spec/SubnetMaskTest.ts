import {IPv4SubnetMask} from "../src/SubnetMask";
import {Validator} from "../src/Validator";
import {IPv4} from "../src/IPv4";
import {IPv6SubnetMask} from "../src/SubnetMask";
import {IPv6} from "../src/IPv6";

describe('Subnet mask test', function() {
    it('should create an instance of IPv4 subnet mask using fromDecimalDottedString', () => {
        let iPv4SubnetMask = IPv4SubnetMask.fromDecimalDottedString("255.0.0.0");
        expect(iPv4SubnetMask.toString()).toEqual("255.0.0.0");
    });

    it('should create an instance using consturctor', () => {
        let iPv4SubnetMask = new IPv4SubnetMask("255.0.0.0");
        expect(iPv4SubnetMask.toString()).toEqual("255.0.0.0");
    });

    it('should create throw an exception when invalid subnet mask string is given', () => {
        expect(() => {
            // Although given string is a valid IPv4 String, it cannot be a subnet mask, since a subnet mask can only
            // be a contiguous on bits (1's) followed by off bits (0's)
            new IPv4SubnetMask("10.255.10.3");
        }).toThrowError(Error, Validator.invalidSubnetMaskMessage);
    });

    it('should return value', () => {
        let iPv4SubnetMask = new IPv4SubnetMask("255.0.0.0");
        expect(iPv4SubnetMask.getValue()).toEqual(new IPv4("255.0.0.0").getValue());
    });

    it('should return octets', () => {
        let iPv4SubnetMask = new IPv4SubnetMask("255.0.0.0");
        expect(iPv4SubnetMask.getOctets()).toEqual(new IPv4("255.0.0.0").getOctets());
    });

// IPv6
    it('should create an instance of IPv6SubnetMask using fromDecimalDottedString', () => {
        let iPv6SubnetMask = IPv6SubnetMask.fromHexadecimalString("ffff:ffff:ffff:ffff:ffff:ffff:0:0");
        expect(iPv6SubnetMask.toString()).toEqual("ffff:ffff:ffff:ffff:ffff:ffff:0:0");
    });

    it('should create an instance using consturctor', () => {
        let iPv6SubnetMask = new IPv6SubnetMask("ffff:ffff:ffff:ffff:ffff:ffff:0:0");
        expect(iPv6SubnetMask.toString()).toEqual("ffff:ffff:ffff:ffff:ffff:ffff:0:0");
    });

    it('should create throw an exception when invalid subnet mask string is given', () => {
        expect(() => {
            // Although given string is a valid IPv6 String, it cannot be a subnet mask, since a subnet mask can only
            // be a contiguous on bits (1's) followed by off bits (0's)
            new IPv6SubnetMask("3ffe:1900:4545:0003:0200:f8ff:fe21:67cf");
        }).toThrowError(Error, Validator.invalidSubnetMaskMessage);
    });

    it('should return value', () => {
        let iPv6Subnet = new IPv6SubnetMask("ffff:ffff:ffff:ffff:ffff:ffff:0:0");
        expect(iPv6Subnet.getValue()).toEqual(new IPv6("ffff:ffff:ffff:ffff:ffff:ffff:0:0").getValue());
    });

    it('should return getHexadecatet', () => {
        let iPv6Subnet = new IPv6SubnetMask("ffff:ffff:ffff:ffff:ffff:ffff:0:0");
        expect(iPv6Subnet.getHexadecatet()).toEqual(new IPv6("ffff:ffff:ffff:ffff:ffff:ffff:0:0").getHexadecatet());
    })
});