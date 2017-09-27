import {IPv4Subnet} from "../src/Subnet";
import {Validator} from "../src/Validator";
import {IPv4} from "../src/IPv4";
import {IPv6Subnet} from "../src/Subnet";
import {IPv6} from "../src/IPv6";

describe('Subnet test', function() {
    it('should create an instance of IPv4 subnet using fromDecimalDottedString', () => {
        let iPv4Subnet = IPv4Subnet.fromDecimalDottedString("255.0.0.0");
        expect(iPv4Subnet.toString()).toEqual("255.0.0.0");
    });

    it('should create an instance using consturctor', () => {
        let iPv4Subnet = new IPv4Subnet("255.0.0.0");
        expect(iPv4Subnet.toString()).toEqual("255.0.0.0");
    });

    it('should create throw an exception when invalid subnet string is given', () => {
        expect(() => {
            // Although given string is a valid IPv4 String, it cannot be a subnet, since a subnet can only be a
            // contagious on bits (1's) followed by off bits (0's)
            new IPv4Subnet("10.255.10.3");
        }).toThrowError(Error, Validator.invalidSubnetMessage);
    });

    it('should return value', () => {
        let iPv4Subnet = new IPv4Subnet("255.0.0.0");
        expect(iPv4Subnet.getValue()).toEqual(new IPv4("255.0.0.0").getValue());
    });

    it('should return octets', () => {
        let iPv4Subnet = new IPv4Subnet("255.0.0.0");
        expect(iPv4Subnet.getOctets()).toEqual(new IPv4("255.0.0.0").getOctets());
    });

// IPv6
    it('should create an instance of IPv6Subnet using fromDecimalDottedString', () => {
        let iPv6Subnet = IPv6Subnet.fromHexadecimalString("ffff:ffff:ffff:ffff:ffff:ffff:0:0");
        expect(iPv6Subnet.toString()).toEqual("ffff:ffff:ffff:ffff:ffff:ffff:0:0");
    });

    it('should create an instance using consturctor', () => {
        let iPv6Subnet = new IPv6Subnet("ffff:ffff:ffff:ffff:ffff:ffff:0:0");
        expect(iPv6Subnet.toString()).toEqual("ffff:ffff:ffff:ffff:ffff:ffff:0:0");
    });

    it('should create throw an exception when invalid subnet string is given', () => {
        expect(() => {
            // Although given string is a valid IPv6 String, it cannot be a subnet, since a subnet can only be a
            // contagious on bits (1's) followed by off bits (0's)
            new IPv6Subnet("3ffe:1900:4545:0003:0200:f8ff:fe21:67cf");
        }).toThrowError(Error, Validator.invalidSubnetMessage);
    });

    it('should return value', () => {
        let iPv6Subnet = new IPv6Subnet("ffff:ffff:ffff:ffff:ffff:ffff:0:0");
        expect(iPv6Subnet.getValue()).toEqual(new IPv6("ffff:ffff:ffff:ffff:ffff:ffff:0:0").getValue());
    });

    it('should return getHexadecatet', () => {
        let iPv6Subnet = new IPv6Subnet("ffff:ffff:ffff:ffff:ffff:ffff:0:0");
        expect(iPv6Subnet.getHexadecatet()).toEqual(new IPv6("ffff:ffff:ffff:ffff:ffff:ffff:0:0").getHexadecatet());
    })
});