import {IPv4, IPv4CidrRange, IPv4Prefix, IPv6, IPv6CidrRange, IPv6Prefix, Range} from "../src";
import bigInt = require("big-integer");


describe('Range: ', () => {

    it("create from single IPv4", () => {
        let singleton = Range.fromSingleIP(new IPv4("0.0.0.254"));
        expect(singleton.getSize().valueOf()).toBe(1);
        expect(singleton.getFirst().toString()).toBe("0.0.0.254");
        expect(singleton.getLast().toString()).toBe("0.0.0.254");
    });

    it("create from single IPv6", () => {
        let singleton = Range.fromSingleIP(new IPv6("2001:db8:0:ffff:ffff:ffff:ffff:ffff"));
        expect(singleton.getSize().valueOf()).toBe(1);
        expect(singleton.getFirst().toString()).toBe("2001:db8:0:ffff:ffff:ffff:ffff:ffff");
        expect(singleton.getLast().toString()).toBe("2001:db8:0:ffff:ffff:ffff:ffff:ffff");
    });

    it("test for of", () => {
        let range = new Range(new IPv4("0.0.0.254"), new IPv4("0.0.1.2"));
        let index = 0;
        let expected = ["0.0.0.254","0.0.0.255", "0.0.1.0", "0.0.1.1", "0.0.1.2"];
        for (let ip of range) {
            expect(ip.toString()).toBe(expected[index]);
            index++;
        }
    });

    it('take without count', () => {
        let range = new Range(new IPv4("0.0.0.254"), new IPv4("0.0.1.2"));
        let index = 0;
        let expected = ["0.0.0.254","0.0.0.255", "0.0.1.0", "0.0.1.1", "0.0.1.2"];
        for (let ip of range.take()) {
            expect(ip.toString()).toBe(expected[index]);
            index++;
        }
    });

    it('take with count', () => {
        let range = new Range(new IPv4("0.0.0.0"), new IPv4("255.255.255.255"));
        let index = 0;
        let expected = ["0.0.0.0","0.0.0.1", "0.0.0.2", "0.0.0.3", "0.0.0.4"];
        for (let ip of range.take(5)) {
            expect(ip.toString()).toBe(expected[index]);
            index++;
        }
    });

    it("fromCidr static constructor for IPv4", () => {
        let range = Range
            .fromCidrRange(
                new IPv4CidrRange(IPv4.fromDecimalDottedString("127.0.0.0"), IPv4Prefix.fromNumber(24))
            );
        expect(range.getFirst().toString()).toBe("127.0.0.0");
        expect(range.getLast().toString()).toBe("127.0.0.255");
    });

    it("fromCidr static constructor for IPv6", () => {
        let ipv6CidrRange = new IPv6CidrRange(new IPv6("2001:db8::"), new IPv6Prefix(48));
        let range = Range
            .fromCidrRange(ipv6CidrRange);

        expect(range.getFirst().toString()).toEqual("2001:db8:0:0:0:0:0:0");
        expect(range.getLast().toString()).toEqual("2001:db8:0:ffff:ffff:ffff:ffff:ffff");
    });
    it("should perform equality check, true", () => {
        let firstRange = new Range(new IPv4("0.0.0.254"), new IPv4("0.0.1.2"));
        let secondRange = new Range(new IPv4("0.0.0.254"), new IPv4("0.0.1.2"));
        expect(firstRange.isEquals(secondRange)).toBe(true);
    });
    it("should perform equality check, false", () => {
        let firstRange = new Range(new IPv4("0.0.0.253"), new IPv4("0.0.1.2"));
        let secondRange = new Range(new IPv4("0.0.0.254"), new IPv4("0.0.1.2"));
        expect(firstRange.isEquals(secondRange)).toBe(false);
    });
    it("should perform union of ranges: equal ranges", () => {
        let firstRange = new Range(new IPv4("0.0.0.254"), new IPv4("0.0.1.2"));
        let secondRange = new Range(new IPv4("0.0.0.254"), new IPv4("0.0.1.2"));
        let union = firstRange.union(secondRange);
        expect(union.isEquals(firstRange)).toBe(true);
    });
    it("should perform union of ranges: overlap range left", () => {
        let firstRange = new Range(new IPv4("0.0.0.0"), new IPv4("0.0.0.2"));
        let secondRange = new Range(new IPv4("0.0.0.1"), new IPv4("0.0.0.3"));

        let expected = new Range(new IPv4("0.0.0.0"), new IPv4("0.0.0.3"));

        let union = firstRange.union(secondRange);

        expect(union.isEquals(expected)).toBe(true);
    });
    it("should perform union of ranges: overlap range right", () => {
        let firstRange = new Range(new IPv4("0.0.0.1"), new IPv4("0.0.0.3"));
        let secondRange = new Range(new IPv4("0.0.0.0"), new IPv4("0.0.0.2"));

        let expected = new Range(new IPv4("0.0.0.0"), new IPv4("0.0.0.3"));

        let union = firstRange.union(secondRange);

        expect(union.isEquals(expected)).toBe(true);
    });

    it("should perform union of ranges: contains the other", () => {
        let firstRange = new Range(new IPv4("0.0.0.1"), new IPv4("0.0.0.5"));
        let secondRange = new Range(new IPv4("0.0.0.2"), new IPv4("0.0.0.4"));
        let expected = new Range(new IPv4("0.0.0.1"), new IPv4("0.0.0.5"));
        let union = firstRange.union(secondRange);
        expect(union.isEquals(expected)).toBe(true);
    });

    it("should perform union of ranges: contains by the other", () => {
        let firstRange = new Range(new IPv4("0.0.0.2"), new IPv4("0.0.0.4"));
        let secondRange = new Range(new IPv4("0.0.0.1"), new IPv4("0.0.0.5"));
        let expected = new Range(new IPv4("0.0.0.1"), new IPv4("0.0.0.5"));
        let union = firstRange.union(secondRange);
        expect(union.isEquals(expected)).toBe(true);
    });

    it('should convert range to Cidr range IPv4', () => {
        let convertedRange = new Range(
            IPv4.fromDecimalDottedString("127.0.0.0"),
            IPv4.fromDecimalDottedString("127.0.0.255")
            ).toCidrRange();

        expect(convertedRange.toCidrString()).toEqual("127.0.0.0/24")
    });

    it('should convert range to Cidr range IPv6', () => {
        let convertedRange = new Range(
            IPv6.fromHexadecimalString("2620:0:0:0:0:0:0:0"),
            IPv6.fromHexadecimalString("2620:0:ffff:ffff:ffff:ffff:ffff:ffff")
        ).toCidrRange();

        expect(convertedRange.toCidrString()).toEqual("2620:0:0:0:0:0:0:0/32")
    });

    it('should not convert range to IPv4 Cidr range', () => {
        expect(() => {
            new Range(
                IPv4.fromDecimalDottedString("127.0.0.1"),
                IPv4.fromDecimalDottedString("127.0.1.0")
            ).toCidrRange();
        }).toThrowError(Error, "Range cannot be converted to CIDR");
    });

    it('should not convert range to IPv6 Cidr range', () => {
        expect(() => {
            new Range(
                IPv6.fromHexadecimalString("2620:0:0:0:0:0:0:1"),
                IPv6.fromHexadecimalString("2620:0:0:0:0:0:1:0"),
            ).toCidrRange();
        }).toThrowError(Error, "Range cannot be converted to CIDR");
    });

    it('should not convert range to IPv4 Cidr range', () => {
        expect(() => {
            new Range(
                IPv4.fromDecimalDottedString("127.0.0.1"),
                IPv4.fromDecimalDottedString("127.0.0.255")
            ).toCidrRange();
        }).toThrowError(Error, "Given size can't be created via cidr prefix");
    });

    it('should not convert range to IPv6 Cidr range', () => {
        expect(() => {
            new Range(
                IPv6.fromHexadecimalString("2620:0:0:0:0:0:0:1"),
                IPv6.fromHexadecimalString("2620:0:ffff:ffff:ffff:ffff:ffff:eeee")
            ).toCidrRange();
        }).toThrowError(Error, "Given size can't be created via cidr prefix");
    });

    it("should throw error when constructing with first grater than last", () => {
        expect(() => {
            new Range(
                IPv6.fromHexadecimalString("2620:0:ffff:ffff:ffff:ffff:ffff:eeee"),
                IPv6.fromHexadecimalString("2620:0:0:0:0:0:0:1")
            )
        }).toThrowError(Error);
    })
});