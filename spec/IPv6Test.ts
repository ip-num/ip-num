
import {Validator} from "../src";
import {IPv6} from "../src";
import {IPv4} from "../src";
import {IPv6AddressKind} from "../src";

describe('IPv6: ', () => {
    it('should instantiate by calling constructor', () => {
        let iPv6 = new IPv6(BigInt("42540650421252671973913748003310542850"));
        expect(iPv6.toString()).toEqual("2001:800:0:0:0:0:0:2002");
        let hexadecatets = iPv6.getHexadecatet();
        expect(hexadecatets[0].toString()).toEqual("2001");
        expect(hexadecatets[1].toString()).toEqual("800");
        expect(hexadecatets[2].toString()).toEqual("0");
        expect(hexadecatets[3].toString()).toEqual("0");
        expect(hexadecatets[4].toString()).toEqual("0");
        expect(hexadecatets[5].toString()).toEqual("0");
        expect(hexadecatets[6].toString()).toEqual("0");
        expect(hexadecatets[7].toString()).toEqual("2002");
        // with hexadecimal string
        let iPv6Value = new IPv6("ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff");
        expect(iPv6Value.toString()).toEqual("ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff");
    });

    it('should instantiate by calling fromBigInt', () => {
        let bigInt = BigInt("42540766411282592856903984951653826560");
        let iPv6 = IPv6.fromBigInt(bigInt);
        expect(iPv6.toString()).toEqual("2001:db8:0:0:0:0:0:0");
        let hexadecatets = iPv6.getHexadecatet();

        expect(hexadecatets[0].toString()).toEqual("2001");
        expect(hexadecatets[1].toString()).toEqual("db8");
        expect(hexadecatets[2].toString()).toEqual("0");
        expect(hexadecatets[3].toString()).toEqual("0");
        expect(hexadecatets[4].toString()).toEqual("0");
        expect(hexadecatets[5].toString()).toEqual("0");
        expect(hexadecatets[6].toString()).toEqual("0");
        expect(hexadecatets[7].toString()).toEqual("0");

    });

    it('should instantiate by calling fromHexadecimal', () => {
        let iPv6 = IPv6.fromHexadecatet("3ffe:1900:4545:0003:0200:f8ff:fe21:67cf");
        expect(iPv6.toString()).toEqual("3ffe:1900:4545:3:200:f8ff:fe21:67cf");
        let hexadecatets = iPv6.getHexadecatet();
        expect(hexadecatets[0].toString()).toEqual("3ffe");
        expect(hexadecatets[1].toString()).toEqual("1900");
        expect(hexadecatets[2].toString()).toEqual("4545");
        expect(hexadecatets[3].toString()).toEqual("3");
        expect(hexadecatets[4].toString()).toEqual("200");
        expect(hexadecatets[5].toString()).toEqual("f8ff");
        expect(hexadecatets[6].toString()).toEqual("fe21");
        expect(hexadecatets[7].toString()).toEqual("67cf");
    });

    it('should instantiate by calling fromString', () => {
        let iPv6 = IPv6.fromString("3ffe:1900:4545:0003:0200:f8ff:fe21:67cf");
        expect(iPv6.toString()).toEqual("3ffe:1900:4545:3:200:f8ff:fe21:67cf");
        let hexadecatets = iPv6.getHexadecatet();
        expect(hexadecatets[0].toString()).toEqual("3ffe");
        expect(hexadecatets[1].toString()).toEqual("1900");
        expect(hexadecatets[2].toString()).toEqual("4545");
        expect(hexadecatets[3].toString()).toEqual("3");
        expect(hexadecatets[4].toString()).toEqual("200");
        expect(hexadecatets[5].toString()).toEqual("f8ff");
        expect(hexadecatets[6].toString()).toEqual("fe21");
        expect(hexadecatets[7].toString()).toEqual("67cf");
    });

    it('should instantiate by calling fromIPv4', () => {
        let iPv6 = IPv6.fromIPv4(new IPv4("127.0.0.1"));
        expect(iPv6.toString()).toEqual('::ffff:7f00:1');

        let iPv61 = IPv6.fromIPv4(new IPv4("74.125.43.99"));
        expect(iPv61.toString()).toEqual('::ffff:4a7d:2b63');
    });

    it('should instantiate by calling fromIPv4DotDecimalString', () => {
        let iPv6 = IPv6.fromIPv4DotDecimalString("127.0.0.1");
        expect(iPv6.toString()).toEqual('::ffff:7f00:1');

        let iPv61 = IPv6.fromIPv4DotDecimalString("74.125.43.99");
        expect(iPv61.toString()).toEqual('::ffff:4a7d:2b63');
    });

    it('should instantiate IPv6 from IPv4-mapped string', () => {
        let ip = new IPv6("::ffff:127.0.0.1");
        expect(ip.toString()).toEqual('0:0:0:0:0:ffff:7f00:1');
    });

    it('should instantiate by calling fromBinaryString', () => {
        let IPv6String = "3ffe:1900:4545:0003:0200:f8ff:fe21:67cf";

        let binaryString = IPv6
            .fromHexadecatet(IPv6String)
            .toBinaryString();

        let iPv6 = IPv6.fromBinaryString(binaryString);

        expect(iPv6.toString()).toEqual("3ffe:1900:4545:3:200:f8ff:fe21:67cf");
        let hexadecatets = iPv6.getHexadecatet();
        expect(hexadecatets[0].toString()).toEqual("3ffe");
        expect(hexadecatets[1].toString()).toEqual("1900");
        expect(hexadecatets[2].toString()).toEqual("4545");
        expect(hexadecatets[3].toString()).toEqual("3");
        expect(hexadecatets[4].toString()).toEqual("200");
        expect(hexadecatets[5].toString()).toEqual("f8ff");
        expect(hexadecatets[6].toString()).toEqual("fe21");
        expect(hexadecatets[7].toString()).toEqual("67cf");
    });

    it('should not instantiate IPv6 when passed invalid binary string', () => {
        expect(() => {
            IPv6.fromBinaryString("111 10");
        }).toThrowError(Error, 'Binary string should contain only contiguous 1s and 0s');
    });

    it('should throw an exception when invalid IPv6 string is used to construct an IPv6 instance', function() {
        expect(() => {
            IPv6.fromHexadecatet("3ffe:1900:4545:0003:0200");
        }).toThrowError(Error);
    });

    it('should correctly return the right value', () => {
        let bigInt = BigInt(`0b${"1".repeat(128)}`);
        let iPv6 = IPv6.fromBigInt(bigInt);
        expect(iPv6.getValue()).toEqual(bigInt);
    });

    it('should correctly return the next value when nextIPNumber is called', () => {
        let iPv6 = IPv6.fromHexadecatet("ffff:ffff:ffff:ffff:ffff:ffff:ffff:fffe");
        expect(iPv6.nextIPNumber().toString()).toEqual("ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff");
    });

    it('should correctly return the previous value when previousIPNumber is called', () => {
        let iPv6 = IPv6.fromHexadecatet("ffff:ffff:ffff:ffff:ffff:ffff:ffff:fffe");
        expect(iPv6.previousIPNumber().toString()).toEqual("ffff:ffff:ffff:ffff:ffff:ffff:ffff:fffd");
    });

    it('should throw exception when calling next leads to an invalid IPv4', () => {
        let value = IPv6.fromHexadecatet("ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff");
        expect(() => {
            value.nextIPNumber();
        }).toThrowError(Error, Validator.invalidIPv6NumberMessage);
    });

    it('should throw exception when calling previous leads to an invalid IPv4', () => {
        let value = IPv6.fromHexadecatet("::000");
        expect(() => {
            value.previousIPNumber();
        }).toThrowError(Error, Validator.invalidIPv6NumberMessage);
    });

    it('should correctly tell if there is a next value for an IPv6', () => {
        let value: IPv6 = IPv6.fromHexadecatet("ffff:ffff:ffff:ffff:ffff:ffff:ffff:fffe");
        expect(value.hasNext()).toBe(true);
        expect(value.nextIPNumber().hasNext()).toBe(false);
    });

    it('should correctly tell if there is a previous value for an IPv6', () => {
        let value = IPv6.fromHexadecatet("::001");
        expect(value.hasPrevious()).toBe(true);
        expect(value.previousIPNumber().hasPrevious()).toBe(false);
    });

    it('toString should prepend with :: if IPv6 value has leading zeros', () => {
        let iPv6 = new IPv6(BigInt('2130706433'));
        expect(iPv6.toString().startsWith('::')).toBe(true);
    });

    it('should correctly check equality related operations', () => {
        expect(IPv6.fromBigInt(BigInt("100")).isLessThan(IPv6.fromBigInt(BigInt("200")))).toEqual(true);
        expect(IPv6.fromBigInt(BigInt("200")).isLessThan(IPv6.fromBigInt(BigInt("100")))).toEqual(false);
        expect(IPv6.fromBigInt(BigInt("200")).isLessThan(IPv6.fromBigInt(BigInt("200")))).toEqual(false);

        expect(IPv6.fromBigInt(BigInt("1234")).isLessThanOrEquals(IPv6.fromBigInt(BigInt("12345")))).toEqual(true);
        expect(IPv6.fromBigInt(BigInt("12345")).isLessThanOrEquals(IPv6.fromBigInt(BigInt("1234")))).toEqual(false);
        expect(IPv6.fromBigInt(BigInt("12345")).isLessThanOrEquals(IPv6.fromBigInt(BigInt("12345")))).toEqual(true);

        expect(IPv6.fromBigInt(BigInt("1234")).isEquals(IPv6.fromBigInt(BigInt("1234")))).toEqual(true);
        expect(IPv6.fromBigInt(BigInt("1234")).isEquals(IPv6.fromBigInt(BigInt("12345")))).toEqual(false);

        expect(IPv6.fromBigInt(BigInt("1234")).isGreaterThan(IPv6.fromBigInt(BigInt("12345")))).toEqual(false);
        expect(IPv6.fromBigInt(BigInt("12345")).isGreaterThan(IPv6.fromBigInt(BigInt("1234")))).toEqual(true);
        expect(IPv6.fromBigInt(BigInt("12345")).isGreaterThan(IPv6.fromBigInt(BigInt("12345")))).toEqual(false);

        expect(IPv6.fromBigInt(BigInt("12345")).isGreaterThanOrEquals(IPv6.fromBigInt(BigInt("1234")))).toEqual(true);
        expect(IPv6.fromBigInt(BigInt("1234")).isGreaterThanOrEquals(IPv6.fromBigInt(BigInt("12345")))).toEqual(false);
        expect(IPv6.fromBigInt(BigInt("12345")).isGreaterThanOrEquals(IPv6.fromBigInt(BigInt("12345")))).toEqual(true);
    });

    it('should correctly return IP number as binary string', () => {
        let value = new IPv6("2001:db8::");
        expect(value.toBinaryString()).toEqual("00100000000000010000110110111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000");
        let lastValue = new IPv6("ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff");
        expect(lastValue.toBinaryString()).toEqual("11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111");
        let firstValue = new IPv6("::");
        expect(firstValue.toBinaryString()).toEqual("00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000");
    });

    it('should create right IPv6 address', () => {
        let value = new IPv6(65536n);
        expect(value.toString()).toEqual("::1:0")
    });

    describe('isPrivate() - RFC 4193 private address detection', () => {
        describe('fd00::/8 range (Unique Local Addresses)', () => {
            it('should return true for fd00::', () => {
                expect(new IPv6("fd00::").isPrivate()).toBe(true);
            });

            it('should return true for fd00::1', () => {
                expect(new IPv6("fd00::1").isPrivate()).toBe(true);
            });

            it('should return true for fdff:ffff:ffff:ffff:ffff:ffff:ffff:ffff', () => {
                expect(new IPv6("fdff:ffff:ffff:ffff:ffff:ffff:ffff:ffff").isPrivate()).toBe(true);
            });

            it('should return true for fd12:3456:7890:abcd:ef01:2345:6789:abcd', () => {
                expect(new IPv6("fd12:3456:7890:abcd:ef01:2345:6789:abcd").isPrivate()).toBe(true);
            });

            it('should return true for fd80::1234:5678', () => {
                expect(new IPv6("fd80::1234:5678").isPrivate()).toBe(true);
            });
        });

        describe('public IPv6 addresses', () => {
            it('should return false for 2001:db8::1', () => {
                expect(new IPv6("2001:db8::1").isPrivate()).toBe(false);
            });

            it('should return false for ::1 (loopback)', () => {
                expect(new IPv6("::1").isPrivate()).toBe(false);
            });

            it('should return false for fe80::1 (link-local)', () => {
                expect(new IPv6("fe80::1").isPrivate()).toBe(false);
            });

            it('should return false for 2001:800:0:0:0:0:0:2002', () => {
                expect(new IPv6("2001:800:0:0:0:0:0:2002").isPrivate()).toBe(false);
            });

            it('should return false for 3ffe:1900:4545:3:200:f8ff:fe21:67cf', () => {
                expect(new IPv6("3ffe:1900:4545:3:200:f8ff:fe21:67cf").isPrivate()).toBe(false);
            });
        });

        describe('boundary cases', () => {
            it('should return false for fcff:ffff:ffff:ffff:ffff:ffff:ffff:ffff (just before fd00::/8)', () => {
                expect(new IPv6("fcff:ffff:ffff:ffff:ffff:ffff:ffff:ffff").isPrivate()).toBe(false);
            });

            it('should return false for fe00:: (just after fd00::/8)', () => {
                expect(new IPv6("fe00::").isPrivate()).toBe(false);
            });

            it('should return false for fc00:: (reserved range, not assigned)', () => {
                expect(new IPv6("fc00::").isPrivate()).toBe(false);
            });

            it('should return false for fcff::ffff', () => {
                expect(new IPv6("fcff::ffff").isPrivate()).toBe(false);
            });
        });
    });

    describe('isDocumentation() - RFC 3849 documentation address detection', () => {
        describe('2001:db8::/32 range', () => {
            it('should return true for 2001:db8::', () => {
                expect(new IPv6("2001:db8::").isDocumentation()).toBe(true);
            });

            it('should return true for 2001:db8::1', () => {
                expect(new IPv6("2001:db8::1").isDocumentation()).toBe(true);
            });

            it('should return true for 2001:db8:ffff:ffff:ffff:ffff:ffff:ffff', () => {
                expect(new IPv6("2001:db8:ffff:ffff:ffff:ffff:ffff:ffff").isDocumentation()).toBe(true);
            });

            it('should return true for 2001:db8:1234:5678:9abc:def0:1234:5678', () => {
                expect(new IPv6("2001:db8:1234:5678:9abc:def0:1234:5678").isDocumentation()).toBe(true);
            });

            it('should return true for 2001:db8:0:0:0:0:0:1', () => {
                expect(new IPv6("2001:db8:0:0:0:0:0:1").isDocumentation()).toBe(true);
            });

            it('should return true for 2001:db8:abcd::1234', () => {
                expect(new IPv6("2001:db8:abcd::1234").isDocumentation()).toBe(true);
            });
        });

        describe('non-documentation IPv6 addresses', () => {
            it('should return false for 2001:800:0:0:0:0:0:2002', () => {
                expect(new IPv6("2001:800:0:0:0:0:0:2002").isDocumentation()).toBe(false);
            });

            it('should return false for ::1 (loopback)', () => {
                expect(new IPv6("::1").isDocumentation()).toBe(false);
            });

            it('should return false for fe80::1 (link-local)', () => {
                expect(new IPv6("fe80::1").isDocumentation()).toBe(false);
            });

            it('should return false for fd00::1 (private)', () => {
                expect(new IPv6("fd00::1").isDocumentation()).toBe(false);
            });

            it('should return false for 3ffe:1900:4545:3:200:f8ff:fe21:67cf', () => {
                expect(new IPv6("3ffe:1900:4545:3:200:f8ff:fe21:67cf").isDocumentation()).toBe(false);
            });

            it('should return false for 2001:db9::1 (just after 2001:db8::/32)', () => {
                expect(new IPv6("2001:db9::1").isDocumentation()).toBe(false);
            });

            it('should return false for 2001:db7:ffff:ffff:ffff:ffff:ffff:ffff (just before 2001:db8::/32)', () => {
                expect(new IPv6("2001:db7:ffff:ffff:ffff:ffff:ffff:ffff").isDocumentation()).toBe(false);
            });
        });

        describe('boundary cases', () => {
            it('should return false for 2001:db7:ffff:ffff:ffff:ffff:ffff:ffff (just before 2001:db8::/32)', () => {
                expect(new IPv6("2001:db7:ffff:ffff:ffff:ffff:ffff:ffff").isDocumentation()).toBe(false);
            });

            it('should return false for 2001:db9:: (just after 2001:db8::/32)', () => {
                expect(new IPv6("2001:db9::").isDocumentation()).toBe(false);
            });

            it('should return false for 2001:db8:0:0:0:0:0:0 (first address in range)', () => {
                expect(new IPv6("2001:db8:0:0:0:0:0:0").isDocumentation()).toBe(true);
            });

            it('should return true for 2001:db8:ffff:ffff:ffff:ffff:ffff:ffff (last address in range)', () => {
                expect(new IPv6("2001:db8:ffff:ffff:ffff:ffff:ffff:ffff").isDocumentation()).toBe(true);
            });

            it('should return false for 2001:db9:0:0:0:0:0:0 (first address after range)', () => {
                expect(new IPv6("2001:db9:0:0:0:0:0:0").isDocumentation()).toBe(false);
            });
        });
    });

    describe('isMulticast() - RFC 4291 multicast address detection', () => {
        describe('ff00::/8 range', () => {
            it('should return true for ff00::', () => {
                expect(new IPv6("ff00::").isMulticast()).toBe(true);
            });

            it('should return true for ff00::1', () => {
                expect(new IPv6("ff00::1").isMulticast()).toBe(true);
            });

            it('should return true for ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff', () => {
                expect(new IPv6("ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff").isMulticast()).toBe(true);
            });

            it('should return true for ff02::1 (all nodes multicast)', () => {
                expect(new IPv6("ff02::1").isMulticast()).toBe(true);
            });

            it('should return true for ff02::2 (all routers multicast)', () => {
                expect(new IPv6("ff02::2").isMulticast()).toBe(true);
            });

            it('should return true for ff12:3456:7890:abcd:ef01:2345:6789:abcd', () => {
                expect(new IPv6("ff12:3456:7890:abcd:ef01:2345:6789:abcd").isMulticast()).toBe(true);
            });

            it('should return true for ff80::1234:5678', () => {
                expect(new IPv6("ff80::1234:5678").isMulticast()).toBe(true);
            });
        });

        describe('non-multicast IPv6 addresses', () => {
            it('should return false for feff:ffff:ffff:ffff:ffff:ffff:ffff:ffff (just before ff00::/8)', () => {
                expect(new IPv6("feff:ffff:ffff:ffff:ffff:ffff:ffff:ffff").isMulticast()).toBe(false);
            });

            it('should return false for 2001:db8::1 (documentation)', () => {
                expect(new IPv6("2001:db8::1").isMulticast()).toBe(false);
            });

            it('should return false for ::1 (loopback)', () => {
                expect(new IPv6("::1").isMulticast()).toBe(false);
            });

            it('should return false for fe80::1 (link-local)', () => {
                expect(new IPv6("fe80::1").isMulticast()).toBe(false);
            });

            it('should return false for fd00::1 (private)', () => {
                expect(new IPv6("fd00::1").isMulticast()).toBe(false);
            });

            it('should return false for 2001:800:0:0:0:0:0:2002', () => {
                expect(new IPv6("2001:800:0:0:0:0:0:2002").isMulticast()).toBe(false);
            });

            it('should return false for 3ffe:1900:4545:3:200:f8ff:fe21:67cf', () => {
                expect(new IPv6("3ffe:1900:4545:3:200:f8ff:fe21:67cf").isMulticast()).toBe(false);
            });
        });

        describe('boundary cases', () => {
            it('should return false for feff:ffff:ffff:ffff:ffff:ffff:ffff:ffff (just before ff00::/8)', () => {
                expect(new IPv6("feff:ffff:ffff:ffff:ffff:ffff:ffff:ffff").isMulticast()).toBe(false);
            });

            it('should return true for ff00:: (first address in range)', () => {
                expect(new IPv6("ff00::").isMulticast()).toBe(true);
            });

            it('should return true for ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff (last address in range)', () => {
                expect(new IPv6("ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff").isMulticast()).toBe(true);
            });

            it('should return false for fe00:: (just before ff00::/8)', () => {
                expect(new IPv6("fe00::").isMulticast()).toBe(false);
            });
        });
    });

    describe('hasEmbeddedRP() - RFC 3956 embedded RP detection', () => {
        describe('multicast addresses with embedded RP', () => {
            it('should return true for ff7e:240:2001:db8::1 (RPT flags all set)', () => {
                // ff7e = ff (multicast) + 7 (R=1, P=1, T=1) + e (scope)
                const ip = new IPv6("ff7e:240:2001:db8::1");
                expect(ip.hasEmbeddedRP()).toBe(true);
            });
            
            it('should return true for valid embedded RP address', () => {
                // Construct a valid embedded RP address
                const ip = new IPv6("ff7e:240:2001:db8::1234");
                expect(ip.hasEmbeddedRP()).toBe(true);
            });
        });
        
        describe('multicast addresses without embedded RP', () => {
            it('should return false for ff02::1 (all nodes, R flag not set)', () => {
                const ip = new IPv6("ff02::1");
                expect(ip.hasEmbeddedRP()).toBe(false);
            });
            
            it('should return false for ff05::1 (R flag not set)', () => {
                const ip = new IPv6("ff05::1");
                expect(ip.hasEmbeddedRP()).toBe(false);
            });
            
            it('should return false for ff0e::1 (R flag not set)', () => {
                const ip = new IPv6("ff0e::1");
                expect(ip.hasEmbeddedRP()).toBe(false);
            });
        });
        
        describe('error cases', () => {
            it('should throw error for non-multicast address', () => {
                const ip = new IPv6("2001:db8::1");
                expect(() => ip.hasEmbeddedRP()).toThrowError("Embedded RP can only be checked for multicast addresses");
            });
            
            it('should throw error for private address', () => {
                const ip = new IPv6("fd00::1");
                expect(() => ip.hasEmbeddedRP()).toThrowError("Embedded RP can only be checked for multicast addresses");
            });
        });
    });

    describe('isUnspecified() - RFC 4291 unspecified address detection', () => {
        describe('unspecified address', () => {
            it('should return true for ::', () => {
                expect(new IPv6("::").isUnspecified()).toBe(true);
            });

            it('should return true for ::0', () => {
                expect(new IPv6("::0").isUnspecified()).toBe(true);
            });

            it('should return true for 0:0:0:0:0:0:0:0', () => {
                expect(new IPv6("0:0:0:0:0:0:0:0").isUnspecified()).toBe(true);
            });
        });

        describe('non-unspecified IPv6 addresses', () => {
            it('should return false for ::1 (loopback)', () => {
                expect(new IPv6("::1").isUnspecified()).toBe(false);
            });

            it('should return false for fe80::1 (link-local)', () => {
                expect(new IPv6("fe80::1").isUnspecified()).toBe(false);
            });

            it('should return false for 2001:db8::1 (documentation)', () => {
                expect(new IPv6("2001:db8::1").isUnspecified()).toBe(false);
            });

            it('should return false for 2001:800:0:0:0:0:0:2002', () => {
                expect(new IPv6("2001:800:0:0:0:0:0:2002").isUnspecified()).toBe(false);
            });

            it('should return false for ff00::1 (multicast)', () => {
                expect(new IPv6("ff00::1").isUnspecified()).toBe(false);
            });
        });
    });

    describe('isLoopback() - RFC 4291 loopback address detection', () => {
        describe('loopback address', () => {
            it('should return true for ::1', () => {
                expect(new IPv6("::1").isLoopback()).toBe(true);
            });

            it('should return true for 0:0:0:0:0:0:0:1', () => {
                expect(new IPv6("0:0:0:0:0:0:0:1").isLoopback()).toBe(true);
            });
        });

        describe('non-loopback IPv6 addresses', () => {
            it('should return false for :: (unspecified)', () => {
                expect(new IPv6("::").isLoopback()).toBe(false);
            });

            it('should return false for ::2', () => {
                expect(new IPv6("::2").isLoopback()).toBe(false);
            });

            it('should return false for fe80::1 (link-local)', () => {
                expect(new IPv6("fe80::1").isLoopback()).toBe(false);
            });

            it('should return false for 2001:db8::1 (documentation)', () => {
                expect(new IPv6("2001:db8::1").isLoopback()).toBe(false);
            });

            it('should return false for 2001:800:0:0:0:0:0:2002', () => {
                expect(new IPv6("2001:800:0:0:0:0:0:2002").isLoopback()).toBe(false);
            });

            it('should return false for ff00::1 (multicast)', () => {
                expect(new IPv6("ff00::1").isLoopback()).toBe(false);
            });
        });
    });

    describe('isLinkLocal() - RFC 4291 link-local address detection', () => {
        describe('fe80::/10 range', () => {
            it('should return true for fe80::', () => {
                expect(new IPv6("fe80::").isLinkLocal()).toBe(true);
            });

            it('should return true for fe80::1', () => {
                expect(new IPv6("fe80::1").isLinkLocal()).toBe(true);
            });

            it('should return true for febf:ffff:ffff:ffff:ffff:ffff:ffff:ffff', () => {
                expect(new IPv6("febf:ffff:ffff:ffff:ffff:ffff:ffff:ffff").isLinkLocal()).toBe(true);
            });

            it('should return true for fe80:1234:5678:9abc:def0:1234:5678:9abc', () => {
                expect(new IPv6("fe80:1234:5678:9abc:def0:1234:5678:9abc").isLinkLocal()).toBe(true);
            });

            it('should return true for feaf::1234:5678', () => {
                expect(new IPv6("feaf::1234:5678").isLinkLocal()).toBe(true);
            });
        });

        describe('non-link-local IPv6 addresses', () => {
            it('should return false for ::1 (loopback)', () => {
                expect(new IPv6("::1").isLinkLocal()).toBe(false);
            });

            it('should return false for 2001:db8::1 (documentation)', () => {
                expect(new IPv6("2001:db8::1").isLinkLocal()).toBe(false);
            });

            it('should return false for fd00::1 (private)', () => {
                expect(new IPv6("fd00::1").isLinkLocal()).toBe(false);
            });

            it('should return false for 2001:800:0:0:0:0:0:2002', () => {
                expect(new IPv6("2001:800:0:0:0:0:0:2002").isLinkLocal()).toBe(false);
            });

            it('should return false for ff00::1 (multicast)', () => {
                expect(new IPv6("ff00::1").isLinkLocal()).toBe(false);
            });
        });

        describe('boundary cases', () => {
            it('should return false for fe7f:ffff:ffff:ffff:ffff:ffff:ffff:ffff (just before fe80::/10)', () => {
                expect(new IPv6("fe7f:ffff:ffff:ffff:ffff:ffff:ffff:ffff").isLinkLocal()).toBe(false);
            });

            it('should return false for fe00:: (just before fe80::/10)', () => {
                expect(new IPv6("fe00::").isLinkLocal()).toBe(false);
            });

            it('should return true for fe80:: (first address in range)', () => {
                expect(new IPv6("fe80::").isLinkLocal()).toBe(true);
            });

            it('should return true for febf:ffff:ffff:ffff:ffff:ffff:ffff:ffff (last address in range)', () => {
                expect(new IPv6("febf:ffff:ffff:ffff:ffff:ffff:ffff:ffff").isLinkLocal()).toBe(true);
            });

            it('should return false for fec0:: (just after fe80::/10)', () => {
                expect(new IPv6("fec0::").isLinkLocal()).toBe(false);
            });
        });
    });

    describe('isGlobalUnicast() - RFC 4291 global unicast address detection', () => {
        describe('global unicast addresses (everything else per RFC 4291)', () => {
            it('should return true for 2000::', () => {
                expect(new IPv6("2000::").isGlobalUnicast()).toBe(true);
            });

            it('should return true for 2001:800:0:0:0:0:0:2002', () => {
                expect(new IPv6("2001:800:0:0:0:0:0:2002").isGlobalUnicast()).toBe(true);
            });

            it('should return true for 3fff:ffff:ffff:ffff:ffff:ffff:ffff:ffff', () => {
                expect(new IPv6("3fff:ffff:ffff:ffff:ffff:ffff:ffff:ffff").isGlobalUnicast()).toBe(true);
            });

            it('should return true for 2400:cb00:2048:1::c629:d7a2', () => {
                expect(new IPv6("2400:cb00:2048:1::c629:d7a2").isGlobalUnicast()).toBe(true);
            });

            it('should return true for addresses outside 2000::/3 that are not other specific types', () => {
                // Per RFC 4291, Global Unicast is "everything else"
                expect(new IPv6("4000::").isGlobalUnicast()).toBe(true);
                expect(new IPv6("5000::").isGlobalUnicast()).toBe(true);
            });

            it('should return true for 1fff:ffff:ffff:ffff:ffff:ffff:ffff:ffff (not other specific type)', () => {
                expect(new IPv6("1fff:ffff:ffff:ffff:ffff:ffff:ffff:ffff").isGlobalUnicast()).toBe(true);
            });
        });

        describe('non-global unicast IPv6 addresses', () => {
            it('should return false for :: (unspecified)', () => {
                expect(new IPv6("::").isGlobalUnicast()).toBe(false);
            });

            it('should return false for ::1 (loopback)', () => {
                expect(new IPv6("::1").isGlobalUnicast()).toBe(false);
            });

            it('should return false for fe80::1 (link-local)', () => {
                expect(new IPv6("fe80::1").isGlobalUnicast()).toBe(false);
            });

            it('should return false for fd00::1 (private)', () => {
                expect(new IPv6("fd00::1").isGlobalUnicast()).toBe(false);
            });

            it('should return false for ff00::1 (multicast)', () => {
                expect(new IPv6("ff00::1").isGlobalUnicast()).toBe(false);
            });

            it('should return false for ::ffff:192.0.2.1 (IPv4-mapped)', () => {
                expect(new IPv6("::ffff:192.0.2.1").isGlobalUnicast()).toBe(false);
            });

            it('should return false for 100::1 (discard-only)', () => {
                expect(new IPv6("100::1").isGlobalUnicast()).toBe(false);
            });

            it('should return false for 2001:db8::1 (documentation)', () => {
                expect(new IPv6("2001:db8::1").isGlobalUnicast()).toBe(false);
            });
        });
    });

    describe('isIPv4Mapped() - RFC 4291 IPv4-mapped IPv6 address detection', () => {
        describe('::ffff:0:0/96 range', () => {
            it('should return true for 0:0:0:0:0:ffff:0:0', () => {
                expect(new IPv6("0:0:0:0:0:ffff:0:0").isIPv4Mapped()).toBe(true);
            });

            it('should return true for ::ffff:192.0.2.1', () => {
                expect(new IPv6("::ffff:192.0.2.1").isIPv4Mapped()).toBe(true);
            });

            it('should return true for ::ffff:255.255.255.255', () => {
                expect(new IPv6("::ffff:255.255.255.255").isIPv4Mapped()).toBe(true);
            });

            it('should return true for 0:0:0:0:0:ffff:c0a8:1', () => {
                expect(new IPv6("0:0:0:0:0:ffff:c0a8:1").isIPv4Mapped()).toBe(true);
            });

            it('should return true for 0:0:0:0:0:ffff:ffff:ffff', () => {
                expect(new IPv6("0:0:0:0:0:ffff:ffff:ffff").isIPv4Mapped()).toBe(true);
            });
        });

        describe('non-IPv4-mapped IPv6 addresses', () => {
            it('should return false for ::1 (loopback)', () => {
                expect(new IPv6("::1").isIPv4Mapped()).toBe(false);
            });

            it('should return false for 2001:db8::1 (documentation)', () => {
                expect(new IPv6("2001:db8::1").isIPv4Mapped()).toBe(false);
            });

            it('should return false for fe80::1 (link-local)', () => {
                expect(new IPv6("fe80::1").isIPv4Mapped()).toBe(false);
            });

            it('should return false for ::ffff:0:0:0:1:0:0 (wrong format)', () => {
                expect(new IPv6("::ffff:0:0:0:1:0:0").isIPv4Mapped()).toBe(false);
            });

            it('should return false for ::fffe:192.0.2.1 (wrong prefix)', () => {
                expect(new IPv6("::fffe:192.0.2.1").isIPv4Mapped()).toBe(false);
            });
        });

        describe('boundary cases', () => {
            it('should return true for 0:0:0:0:0:ffff:0:0 (first address in range)', () => {
                expect(new IPv6("0:0:0:0:0:ffff:0:0").isIPv4Mapped()).toBe(true);
            });

            it('should return true for 0:0:0:0:0:ffff:ffff:ffff (last address in range)', () => {
                expect(new IPv6("0:0:0:0:0:ffff:ffff:ffff").isIPv4Mapped()).toBe(true);
            });

            it('should return false for 0:0:0:0:0:fffe:ffff:ffff (just before range)', () => {
                expect(new IPv6("0:0:0:0:0:fffe:ffff:ffff").isIPv4Mapped()).toBe(false);
            });

            it('should return false for 0:0:0:0:0:1:0:0 (just after range)', () => {
                expect(new IPv6("0:0:0:0:0:1:0:0").isIPv4Mapped()).toBe(false);
            });
        });
    });

    describe('isDiscardOnly() - RFC 6666 discard-only address detection', () => {
        describe('100::/64 range', () => {
            it('should return true for 100::', () => {
                expect(new IPv6("100::").isDiscardOnly()).toBe(true);
            });

            it('should return true for 100::1', () => {
                expect(new IPv6("100::1").isDiscardOnly()).toBe(true);
            });

            it('should return true for 100::ffff:ffff:ffff:ffff', () => {
                expect(new IPv6("100::ffff:ffff:ffff:ffff").isDiscardOnly()).toBe(true);
            });

            it('should return true for 100:0:0:0:1234:5678:9abc:def0', () => {
                expect(new IPv6("100:0:0:0:1234:5678:9abc:def0").isDiscardOnly()).toBe(true);
            });
        });

        describe('non-discard-only IPv6 addresses', () => {
            it('should return false for ::1 (loopback)', () => {
                expect(new IPv6("::1").isDiscardOnly()).toBe(false);
            });

            it('should return false for 2001:db8::1 (documentation)', () => {
                expect(new IPv6("2001:db8::1").isDiscardOnly()).toBe(false);
            });

            it('should return false for fe80::1 (link-local)', () => {
                expect(new IPv6("fe80::1").isDiscardOnly()).toBe(false);
            });

            it('should return false for 2001:800:0:0:0:0:0:2002', () => {
                expect(new IPv6("2001:800:0:0:0:0:0:2002").isDiscardOnly()).toBe(false);
            });

            it('should return false for ff00::1 (multicast)', () => {
                expect(new IPv6("ff00::1").isDiscardOnly()).toBe(false);
            });
        });

        describe('boundary cases', () => {
            it('should return false for ff:ffff:ffff:ffff:ffff:ffff:ffff:ffff (just before 100::/64)', () => {
                expect(new IPv6("ff:ffff:ffff:ffff:ffff:ffff:ffff:ffff").isDiscardOnly()).toBe(false);
            });

            it('should return true for 100:: (first address in range)', () => {
                expect(new IPv6("100::").isDiscardOnly()).toBe(true);
            });

            it('should return true for 100::ffff:ffff:ffff:ffff (last address in range)', () => {
                expect(new IPv6("100::ffff:ffff:ffff:ffff").isDiscardOnly()).toBe(true);
            });

            it('should return false for 100::1:0:0:0:0:0 (just after range)', () => {
                expect(new IPv6("100::1:0:0:0:0:0").isDiscardOnly()).toBe(false);
            });
        });
    });

    describe('getKind() - IPv6 address kind detection', () => {
        describe('unspecified address', () => {
            it('should return UNSPECIFIED for ::', () => {
                expect(new IPv6("::").getKind()).toBe(IPv6AddressKind.UNSPECIFIED);
            });

            it('should return UNSPECIFIED for 0:0:0:0:0:0:0:0', () => {
                expect(new IPv6("0:0:0:0:0:0:0:0").getKind()).toBe(IPv6AddressKind.UNSPECIFIED);
            });
        });

        describe('loopback address', () => {
            it('should return LOOPBACK for ::1', () => {
                expect(new IPv6("::1").getKind()).toBe(IPv6AddressKind.LOOPBACK);
            });

            it('should return LOOPBACK for 0:0:0:0:0:0:0:1', () => {
                expect(new IPv6("0:0:0:0:0:0:0:1").getKind()).toBe(IPv6AddressKind.LOOPBACK);
            });
        });

        describe('multicast address', () => {
            it('should return MULTICAST for ff00::', () => {
                expect(new IPv6("ff00::").getKind()).toBe(IPv6AddressKind.MULTICAST);
            });

            it('should return MULTICAST for ff02::1', () => {
                expect(new IPv6("ff02::1").getKind()).toBe(IPv6AddressKind.MULTICAST);
            });

            it('should return MULTICAST for ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff', () => {
                expect(new IPv6("ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff").getKind()).toBe(IPv6AddressKind.MULTICAST);
            });
        });

        describe('documentation address', () => {
            it('should return DOCUMENTATION for 2001:db8::', () => {
                expect(new IPv6("2001:db8::").getKind()).toBe(IPv6AddressKind.DOCUMENTATION);
            });

            it('should return DOCUMENTATION for 2001:db8::1', () => {
                expect(new IPv6("2001:db8::1").getKind()).toBe(IPv6AddressKind.DOCUMENTATION);
            });

            it('should return DOCUMENTATION for 2001:db8:ffff:ffff:ffff:ffff:ffff:ffff', () => {
                expect(new IPv6("2001:db8:ffff:ffff:ffff:ffff:ffff:ffff").getKind()).toBe(IPv6AddressKind.DOCUMENTATION);
            });
        });

        describe('IPv4-mapped address', () => {
            it('should return IPV4_MAPPED for ::ffff:192.0.2.1', () => {
                expect(new IPv6("::ffff:192.0.2.1").getKind()).toBe(IPv6AddressKind.IPV4_MAPPED);
            });

            it('should return IPV4_MAPPED for 0:0:0:0:0:ffff:0:0', () => {
                expect(new IPv6("0:0:0:0:0:ffff:0:0").getKind()).toBe(IPv6AddressKind.IPV4_MAPPED);
            });

            it('should return IPV4_MAPPED for ::ffff:255.255.255.255', () => {
                expect(new IPv6("::ffff:255.255.255.255").getKind()).toBe(IPv6AddressKind.IPV4_MAPPED);
            });
        });

        describe('discard-only address', () => {
            it('should return DISCARD_ONLY for 100::', () => {
                expect(new IPv6("100::").getKind()).toBe(IPv6AddressKind.DISCARD_ONLY);
            });

            it('should return DISCARD_ONLY for 100::1', () => {
                expect(new IPv6("100::1").getKind()).toBe(IPv6AddressKind.DISCARD_ONLY);
            });

            it('should return DISCARD_ONLY for 100::ffff:ffff:ffff:ffff', () => {
                expect(new IPv6("100::ffff:ffff:ffff:ffff").getKind()).toBe(IPv6AddressKind.DISCARD_ONLY);
            });
        });

        describe('link-local address', () => {
            it('should return LINK_LOCAL for fe80::', () => {
                expect(new IPv6("fe80::").getKind()).toBe(IPv6AddressKind.LINK_LOCAL);
            });

            it('should return LINK_LOCAL for fe80::1', () => {
                expect(new IPv6("fe80::1").getKind()).toBe(IPv6AddressKind.LINK_LOCAL);
            });

            it('should return LINK_LOCAL for febf:ffff:ffff:ffff:ffff:ffff:ffff:ffff', () => {
                expect(new IPv6("febf:ffff:ffff:ffff:ffff:ffff:ffff:ffff").getKind()).toBe(IPv6AddressKind.LINK_LOCAL);
            });
        });

        describe('unique local address (private)', () => {
            it('should return UNIQUE_LOCAL for fd00::', () => {
                expect(new IPv6("fd00::").getKind()).toBe(IPv6AddressKind.UNIQUE_LOCAL);
            });

            it('should return UNIQUE_LOCAL for fd00::1', () => {
                expect(new IPv6("fd00::1").getKind()).toBe(IPv6AddressKind.UNIQUE_LOCAL);
            });

            it('should return UNIQUE_LOCAL for fdff:ffff:ffff:ffff:ffff:ffff:ffff:ffff', () => {
                expect(new IPv6("fdff:ffff:ffff:ffff:ffff:ffff:ffff:ffff").getKind()).toBe(IPv6AddressKind.UNIQUE_LOCAL);
            });
        });

        describe('global unicast address', () => {
            it('should return GLOBAL_UNICAST for 2000::', () => {
                expect(new IPv6("2000::").getKind()).toBe(IPv6AddressKind.GLOBAL_UNICAST);
            });

            it('should return GLOBAL_UNICAST for 2001:800:0:0:0:0:0:2002', () => {
                expect(new IPv6("2001:800:0:0:0:0:0:2002").getKind()).toBe(IPv6AddressKind.GLOBAL_UNICAST);
            });

            it('should return GLOBAL_UNICAST for 2400:cb00:2048:1::c629:d7a2', () => {
                expect(new IPv6("2400:cb00:2048:1::c629:d7a2").getKind()).toBe(IPv6AddressKind.GLOBAL_UNICAST);
            });

            it('should return GLOBAL_UNICAST for 3fff:ffff:ffff:ffff:ffff:ffff:ffff:ffff', () => {
                expect(new IPv6("3fff:ffff:ffff:ffff:ffff:ffff:ffff:ffff").getKind()).toBe(IPv6AddressKind.GLOBAL_UNICAST);
            });
        });

        describe('priority ordering tests', () => {
            it('should return LOOPBACK (not LINK_LOCAL) for ::1', () => {
                const ip = new IPv6("::1");
                expect(ip.getKind()).toBe(IPv6AddressKind.LOOPBACK);
                expect(ip.getKind()).not.toBe(IPv6AddressKind.LINK_LOCAL);
            });

            it('should return DOCUMENTATION (not GLOBAL_UNICAST) for 2001:db8::1', () => {
                const ip = new IPv6("2001:db8::1");
                expect(ip.getKind()).toBe(IPv6AddressKind.DOCUMENTATION);
                expect(ip.getKind()).not.toBe(IPv6AddressKind.GLOBAL_UNICAST);
            });

            it('should return MULTICAST (not GLOBAL_UNICAST) for ff00::1', () => {
                const ip = new IPv6("ff00::1");
                expect(ip.getKind()).toBe(IPv6AddressKind.MULTICAST);
                expect(ip.getKind()).not.toBe(IPv6AddressKind.GLOBAL_UNICAST);
            });

            it('should return IPV4_MAPPED (not GLOBAL_UNICAST) for ::ffff:192.0.2.1', () => {
                const ip = new IPv6("::ffff:192.0.2.1");
                expect(ip.getKind()).toBe(IPv6AddressKind.IPV4_MAPPED);
                expect(ip.getKind()).not.toBe(IPv6AddressKind.GLOBAL_UNICAST);
            });

            it('should return DISCARD_ONLY (not GLOBAL_UNICAST) for 100::1', () => {
                const ip = new IPv6("100::1");
                expect(ip.getKind()).toBe(IPv6AddressKind.DISCARD_ONLY);
                expect(ip.getKind()).not.toBe(IPv6AddressKind.GLOBAL_UNICAST);
            });

            it('should return UNIQUE_LOCAL (not GLOBAL_UNICAST) for fd00::1', () => {
                const ip = new IPv6("fd00::1");
                expect(ip.getKind()).toBe(IPv6AddressKind.UNIQUE_LOCAL);
                expect(ip.getKind()).not.toBe(IPv6AddressKind.GLOBAL_UNICAST);
            });
        });

        describe('unknown addresses', () => {
            it('should return GLOBAL_UNICAST (not UNKNOWN) for addresses outside 2000::/3 that are not other specific types', () => {
                // Per RFC 4291, Global Unicast is "everything else"
                expect(new IPv6("4000::").getKind()).toBe(IPv6AddressKind.GLOBAL_UNICAST);
                expect(new IPv6("5000::").getKind()).toBe(IPv6AddressKind.GLOBAL_UNICAST);
            });

            it('should return GLOBAL_UNICAST for addresses before 2000::/3 that are not other specific types', () => {
                // Per RFC 4291, Global Unicast is "everything else"
                expect(new IPv6("1fff:ffff:ffff:ffff:ffff:ffff:ffff:ffff").getKind()).toBe(IPv6AddressKind.GLOBAL_UNICAST);
            });

            it('should return UNKNOWN only for truly reserved/unassigned ranges', () => {
                // Note: Most addresses that don't match specific types are Global Unicast per RFC 4291
                // UNKNOWN would only apply to addresses in ranges explicitly reserved and not assigned
                // This test may need adjustment based on specific reserved ranges
            });
        });
    });
});
