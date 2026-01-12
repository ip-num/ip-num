/**
 * Created by daderemi on 07/11/16.
 */

import {IPv4} from "../src/IPNumber";
import {IPv4CidrRange} from "../src/IPRange";
import {Validator} from "../src";

describe('IPv4: ', () => {
    it('should instantiate by calling constructor', () => {
        expect(new IPv4("111.222.90.45").toString()).toEqual("111.222.90.45");
    });

    it('should instantiate by passing big int value of IPv4 number to constructor', () => {
        expect(IPv4.fromNumber(1876843053n).toString()).toEqual("111.222.90.45");
    });

    it('should instantiate by passing dot-decimal notation to fromDecimalDottedString', () => {
        expect(IPv4.fromDecimalDottedString("111.222.90.45").toString()).toEqual("111.222.90.45");
    });

    it('should instantiate by passing dot-decimal notation to fromString', () => {
        expect(IPv4.fromString("111.222.90.45").toString()).toEqual("111.222.90.45");
    });

    it('should instantiate IPv4 by passing binary string', () => {
        let testIPv4String = "111.222.90.45";
        let createdIPv4 = IPv4.fromBinaryString(new IPv4(testIPv4String).toBinaryString());
        expect(createdIPv4.toString()).toEqual("111.222.90.45");
    });

    it('should not instantiate IPv4 when passed invalid binary string', () => {
        expect(() => {
            IPv4.fromBinaryString("111 10");
        }).toThrowError(Error, 'Binary string should contain only contiguous 1s and 0s');
    });

    it('should correctly check equality related operations', () => {
        expect(IPv4.fromNumber(100n).isLessThan(IPv4.fromNumber(200n))).toEqual(true);
        expect(IPv4.fromNumber(200n).isLessThan(IPv4.fromNumber(100n))).toEqual(false);
        expect(IPv4.fromNumber(200n).isLessThan(IPv4.fromNumber(200n))).toEqual(false);

        expect(IPv4.fromNumber(1234n).isLessThanOrEquals(IPv4.fromNumber(12345n))).toEqual(true);
        expect(IPv4.fromNumber(12345n).isLessThanOrEquals(IPv4.fromNumber(1234n))).toEqual(false);
        expect(IPv4.fromNumber(12345n).isLessThanOrEquals(IPv4.fromNumber(12345n))).toEqual(true);

        expect(IPv4.fromNumber(1234n).isEquals(IPv4.fromNumber(1234n))).toEqual(true);
        expect(IPv4.fromNumber(1234n).isEquals(IPv4.fromNumber(12345n))).toEqual(false);

        expect(IPv4.fromNumber(1234n).isGreaterThan(IPv4.fromNumber(12345n))).toEqual(false);
        expect(IPv4.fromNumber(12345n).isGreaterThan(IPv4.fromNumber(1234n))).toEqual(true);
        expect(IPv4.fromNumber(12345n).isGreaterThan(IPv4.fromNumber(12345n))).toEqual(false);

        expect(IPv4.fromNumber(12345n).isGreaterThanOrEquals(IPv4.fromNumber(1234n))).toEqual(true);
        expect(IPv4.fromNumber(1234n).isGreaterThanOrEquals(IPv4.fromNumber(12345n))).toEqual(false);
        expect(IPv4.fromNumber(12345n).isGreaterThanOrEquals(IPv4.fromNumber(12345n))).toEqual(true);
    });

    it('should correctly get the octets', () => {
        let octets = new IPv4("111.222.90.45").getOctets();
        expect(octets[0].getValue()).toEqual(111);
        expect(octets[1].getValue()).toEqual(222);
        expect(octets[2].getValue()).toEqual(90);
        expect(octets[3].getValue()).toEqual(45);
    });

    it('should correctly get the binary value', () => {
        let value = new IPv4("111.222.90.45").getValue();
        expect(value).toEqual(BigInt("0b01101111110111100101101000101101"))
    });

    it('should throw exception if ip contains invalid number of octets', () => {
        // more than 4
        expect(() => {
            new IPv4("111.222.90.45.10");
        }).toThrowError(Error, Validator.invalidOctetCountMessage);

        // less than 4
        expect(() => {
            new IPv4("111.222.90");
        }).toThrowError(Error, Validator.invalidOctetCountMessage);
    });

    it('should throw exception if ip contains invalid octet number', () => {
        expect(() => {
            new IPv4("111.222.90.645");
        }).toThrowError(Error, Validator.invalidOctetRangeMessage);
    });

    it('should return next IPv4 value', () => {
        let value = new IPv4("111.222.90.255");
        expect(value.nextIPNumber().toString()).toEqual("111.222.91.0");
    });

    it('should correctly tell if there is a next value for an IPv4', () => {
        let value = new IPv4("255.255.255.254");
        expect(value.hasNext()).toBe(true);
        expect(value.nextIPNumber().hasNext()).toBe(false);
    });

    it('should correctly tell if there is a previous value for an IPv4', () => {
        let value = new IPv4("0.0.0.1");
        expect(value.hasPrevious()).toBe(true);
        expect(value.previousIPNumber().hasPrevious()).toBe(false);
    });

    it('should return previous IPv4 value', () => {
        let value = new IPv4("111.222.91.0");
        expect(value.previousIPNumber().toString()).toEqual("111.222.90.255");
    });

    it('should throw exception when calling next leads to an invalid IPv4', () => {
        let value = new IPv4("255.255.255.255");
        expect(() => {
            value.nextIPNumber();
        }).toThrowError(Error, Validator.invalidIPv4NumberMessage);
    });

    it('should correctly return IP number as binary string', () => {
        let value = new IPv4("74.125.43.99");
        expect(value.toBinaryString()).toEqual("01001010011111010010101101100011");
        let lastValue = new IPv4("255.255.255.255");
        expect(lastValue.toBinaryString()).toEqual("11111111111111111111111111111111");
        let firstValue = new IPv4("0.0.0.0");
        expect(firstValue.toBinaryString()).toEqual("00000000000000000000000000000000");
    });

    it('should create IPv4-Mapped IPv6 Address', () => {
        let value = new IPv4("74.125.43.99");
        let iPv6 = value.toIPv4MappedIPv6();
        expect(iPv6.toString()).toEqual('::ffff:4a7d:2b63');

        let value1 = new IPv4("127.0.0.1");
        let iPv61 = value1.toIPv4MappedIPv6();
        expect(iPv61.toString()).toEqual('::ffff:7f00:1');
    });

    describe('isPrivate() - RFC 1918 private address detection', () => {
        describe('10.0.0.0/8 range', () => {
            it('should return true for 10.0.0.0', () => {
                expect(new IPv4("10.0.0.0").isPrivate()).toBe(true);
            });

            it('should return true for 10.255.255.255', () => {
                expect(new IPv4("10.255.255.255").isPrivate()).toBe(true);
            });

            it('should return true for 10.1.1.1', () => {
                expect(new IPv4("10.1.1.1").isPrivate()).toBe(true);
            });

            it('should return true for 10.128.64.32', () => {
                expect(new IPv4("10.128.64.32").isPrivate()).toBe(true);
            });
        });

        describe('172.16.0.0/12 range', () => {
            it('should return true for 172.16.0.0', () => {
                expect(new IPv4("172.16.0.0").isPrivate()).toBe(true);
            });

            it('should return true for 172.31.255.255', () => {
                expect(new IPv4("172.31.255.255").isPrivate()).toBe(true);
            });

            it('should return true for 172.20.1.1', () => {
                expect(new IPv4("172.20.1.1").isPrivate()).toBe(true);
            });

            it('should return true for 172.24.128.64', () => {
                expect(new IPv4("172.24.128.64").isPrivate()).toBe(true);
            });
        });

        describe('192.168.0.0/16 range', () => {
            it('should return true for 192.168.0.0', () => {
                expect(new IPv4("192.168.0.0").isPrivate()).toBe(true);
            });

            it('should return true for 192.168.255.255', () => {
                expect(new IPv4("192.168.255.255").isPrivate()).toBe(true);
            });

            it('should return true for 192.168.1.1', () => {
                expect(new IPv4("192.168.1.1").isPrivate()).toBe(true);
            });

            it('should return true for 192.168.100.50', () => {
                expect(new IPv4("192.168.100.50").isPrivate()).toBe(true);
            });
        });

        describe('public addresses', () => {
            it('should return false for 8.8.8.8', () => {
                expect(new IPv4("8.8.8.8").isPrivate()).toBe(false);
            });

            it('should return false for 1.1.1.1', () => {
                expect(new IPv4("1.1.1.1").isPrivate()).toBe(false);
            });

            it('should return false for 203.0.113.1', () => {
                expect(new IPv4("203.0.113.1").isPrivate()).toBe(false);
            });

            it('should return false for 74.125.43.99', () => {
                expect(new IPv4("74.125.43.99").isPrivate()).toBe(false);
            });
        });

        describe('boundary cases', () => {
            it('should return false for 9.255.255.255 (just before 10.0.0.0/8)', () => {
                expect(new IPv4("9.255.255.255").isPrivate()).toBe(false);
            });

            it('should return false for 11.0.0.0 (just after 10.0.0.0/8)', () => {
                expect(new IPv4("11.0.0.0").isPrivate()).toBe(false);
            });

            it('should return false for 172.15.255.255 (just before 172.16.0.0/12)', () => {
                expect(new IPv4("172.15.255.255").isPrivate()).toBe(false);
            });

            it('should return false for 172.32.0.0 (just after 172.16.0.0/12)', () => {
                expect(new IPv4("172.32.0.0").isPrivate()).toBe(false);
            });

            it('should return false for 192.167.255.255 (just before 192.168.0.0/16)', () => {
                expect(new IPv4("192.167.255.255").isPrivate()).toBe(false);
            });

            it('should return false for 192.169.0.0 (just after 192.168.0.0/16)', () => {
                expect(new IPv4("192.169.0.0").isPrivate()).toBe(false);
            });
        });
    });

    describe('isDocumentation() - RFC 5737 documentation address detection', () => {
        describe('192.0.2.0/24 range (TEST-NET-1)', () => {
            it('should return true for 192.0.2.0', () => {
                expect(new IPv4("192.0.2.0").isDocumentation()).toBe(true);
            });

            it('should return true for 192.0.2.255', () => {
                expect(new IPv4("192.0.2.255").isDocumentation()).toBe(true);
            });

            it('should return true for 192.0.2.1', () => {
                expect(new IPv4("192.0.2.1").isDocumentation()).toBe(true);
            });

            it('should return true for 192.0.2.128', () => {
                expect(new IPv4("192.0.2.128").isDocumentation()).toBe(true);
            });
        });

        describe('198.51.100.0/24 range (TEST-NET-2)', () => {
            it('should return true for 198.51.100.0', () => {
                expect(new IPv4("198.51.100.0").isDocumentation()).toBe(true);
            });

            it('should return true for 198.51.100.255', () => {
                expect(new IPv4("198.51.100.255").isDocumentation()).toBe(true);
            });

            it('should return true for 198.51.100.1', () => {
                expect(new IPv4("198.51.100.1").isDocumentation()).toBe(true);
            });

            it('should return true for 198.51.100.128', () => {
                expect(new IPv4("198.51.100.128").isDocumentation()).toBe(true);
            });
        });

        describe('203.0.113.0/24 range (TEST-NET-3)', () => {
            it('should return true for 203.0.113.0', () => {
                expect(new IPv4("203.0.113.0").isDocumentation()).toBe(true);
            });

            it('should return true for 203.0.113.255', () => {
                expect(new IPv4("203.0.113.255").isDocumentation()).toBe(true);
            });

            it('should return true for 203.0.113.1', () => {
                expect(new IPv4("203.0.113.1").isDocumentation()).toBe(true);
            });

            it('should return true for 203.0.113.128', () => {
                expect(new IPv4("203.0.113.128").isDocumentation()).toBe(true);
            });
        });

        describe('non-documentation addresses', () => {
            it('should return false for 8.8.8.8', () => {
                expect(new IPv4("8.8.8.8").isDocumentation()).toBe(false);
            });

            it('should return false for 1.1.1.1', () => {
                expect(new IPv4("1.1.1.1").isDocumentation()).toBe(false);
            });

            it('should return false for 192.0.1.255 (just before 192.0.2.0/24)', () => {
                expect(new IPv4("192.0.1.255").isDocumentation()).toBe(false);
            });

            it('should return false for 192.0.3.0 (just after 192.0.2.0/24)', () => {
                expect(new IPv4("192.0.3.0").isDocumentation()).toBe(false);
            });

            it('should return false for 198.51.99.255 (just before 198.51.100.0/24)', () => {
                expect(new IPv4("198.51.99.255").isDocumentation()).toBe(false);
            });

            it('should return false for 198.51.101.0 (just after 198.51.100.0/24)', () => {
                expect(new IPv4("198.51.101.0").isDocumentation()).toBe(false);
            });

            it('should return false for 203.0.112.255 (just before 203.0.113.0/24)', () => {
                expect(new IPv4("203.0.112.255").isDocumentation()).toBe(false);
            });

            it('should return false for 203.0.114.0 (just after 203.0.113.0/24)', () => {
                expect(new IPv4("203.0.114.0").isDocumentation()).toBe(false);
            });

            it('should return false for 10.0.0.1', () => {
                expect(new IPv4("10.0.0.1").isDocumentation()).toBe(false);
            });

            it('should return false for 192.168.1.1', () => {
                expect(new IPv4("192.168.1.1").isDocumentation()).toBe(false);
            });
        });

        describe('boundary cases', () => {
            it('should return false for 191.255.255.255 (just before 192.0.2.0/24)', () => {
                expect(new IPv4("191.255.255.255").isDocumentation()).toBe(false);
            });

            it('should return false for 192.0.1.255 (just before 192.0.2.0/24)', () => {
                expect(new IPv4("192.0.1.255").isDocumentation()).toBe(false);
            });

            it('should return false for 192.0.3.0 (just after 192.0.2.0/24)', () => {
                expect(new IPv4("192.0.3.0").isDocumentation()).toBe(false);
            });

            it('should return false for 198.51.99.255 (just before 198.51.100.0/24)', () => {
                expect(new IPv4("198.51.99.255").isDocumentation()).toBe(false);
            });

            it('should return false for 198.51.101.0 (just after 198.51.100.0/24)', () => {
                expect(new IPv4("198.51.101.0").isDocumentation()).toBe(false);
            });

            it('should return false for 203.0.112.255 (just before 203.0.113.0/24)', () => {
                expect(new IPv4("203.0.112.255").isDocumentation()).toBe(false);
            });

            it('should return false for 203.0.114.0 (just after 203.0.113.0/24)', () => {
                expect(new IPv4("203.0.114.0").isDocumentation()).toBe(false);
            });
        });
    });

    describe('isMulticast() - RFC 1112 multicast address detection', () => {
        describe('224.0.0.0/4 range', () => {
            it('should return true for 224.0.0.0', () => {
                expect(new IPv4("224.0.0.0").isMulticast()).toBe(true);
            });

            it('should return true for 239.255.255.255', () => {
                expect(new IPv4("239.255.255.255").isMulticast()).toBe(true);
            });

            it('should return true for 224.0.0.1', () => {
                expect(new IPv4("224.0.0.1").isMulticast()).toBe(true);
            });

            it('should return true for 239.128.64.32', () => {
                expect(new IPv4("239.128.64.32").isMulticast()).toBe(true);
            });
        });

        describe('non-multicast IPv4 addresses', () => {
            it('should return false for 223.255.255.255 (just before multicast range)', () => {
                expect(new IPv4("223.255.255.255").isMulticast()).toBe(false);
            });

            it('should return false for 240.0.0.0 (just after multicast range)', () => {
                expect(new IPv4("240.0.0.0").isMulticast()).toBe(false);
            });

            it('should return false for 8.8.8.8', () => {
                expect(new IPv4("8.8.8.8").isMulticast()).toBe(false);
            });

            it('should return false for 192.168.1.1 (private)', () => {
                expect(new IPv4("192.168.1.1").isMulticast()).toBe(false);
            });

            it('should return false for 127.0.0.1 (loopback)', () => {
                expect(new IPv4("127.0.0.1").isMulticast()).toBe(false);
            });
        });

        describe('boundary cases', () => {
            it('should return false for 223.255.255.255', () => {
                expect(new IPv4("223.255.255.255").isMulticast()).toBe(false);
            });

            it('should return true for 224.0.0.0', () => {
                expect(new IPv4("224.0.0.0").isMulticast()).toBe(true);
            });

            it('should return true for 239.255.255.255', () => {
                expect(new IPv4("239.255.255.255").isMulticast()).toBe(true);
            });

            it('should return false for 240.0.0.0', () => {
                expect(new IPv4("240.0.0.0").isMulticast()).toBe(false);
            });
        });
    });

    describe('isBroadcast() - broadcast address detection', () => {
        describe('limited broadcast (255.255.255.255)', () => {
            it('should return true for 255.255.255.255', () => {
                expect(new IPv4("255.255.255.255").isBroadcast()).toBe(true);
            });

            it('should return false for 255.255.255.254', () => {
                expect(new IPv4("255.255.255.254").isBroadcast()).toBe(false);
            });

            it('should return false for 0.0.0.0', () => {
                expect(new IPv4("0.0.0.0").isBroadcast()).toBe(false);
            });

            it('should return false for regular address 192.168.1.1', () => {
                expect(new IPv4("192.168.1.1").isBroadcast()).toBe(false);
            });
        });

        describe('directed broadcast with subnet', () => {
            it('should return true for 192.168.1.255 in 192.168.1.0/24', () => {
                const subnet = IPv4CidrRange.fromCidr("192.168.1.0/24");
                expect(new IPv4("192.168.1.255").isBroadcast(subnet)).toBe(true);
            });

            it('should return false for 192.168.1.254 in 192.168.1.0/24', () => {
                const subnet = IPv4CidrRange.fromCidr("192.168.1.0/24");
                expect(new IPv4("192.168.1.254").isBroadcast(subnet)).toBe(false);
            });

            it('should return true for 10.0.0.255 in 10.0.0.0/24', () => {
                const subnet = IPv4CidrRange.fromCidr("10.0.0.0/24");
                expect(new IPv4("10.0.0.255").isBroadcast(subnet)).toBe(true);
            });

            it('should return true for 172.16.15.255 in 172.16.0.0/20', () => {
                const subnet = IPv4CidrRange.fromCidr("172.16.0.0/20");
                expect(new IPv4("172.16.15.255").isBroadcast(subnet)).toBe(true);
            });

            it('should return false for 172.16.0.1 in 172.16.0.0/20', () => {
                const subnet = IPv4CidrRange.fromCidr("172.16.0.0/20");
                expect(new IPv4("172.16.0.1").isBroadcast(subnet)).toBe(false);
            });

            it('should return true for 255.255.255.255 in 0.0.0.0/0', () => {
                const subnet = IPv4CidrRange.fromCidr("0.0.0.0/0");
                expect(new IPv4("255.255.255.255").isBroadcast(subnet)).toBe(true);
            });

            it('should return true for single host /32 subnet', () => {
                const subnet = IPv4CidrRange.fromCidr("192.168.1.1/32");
                expect(new IPv4("192.168.1.1").isBroadcast(subnet)).toBe(true);
            });
        });
    });
});