import {IPv6} from "../src/IPv6";
import {IPv6Prefix} from "../src/Prefix";
import {IPv6Range} from "../src/IPv6Range";
import {hexadectetNotationToBinaryString} from "../src/HexadecimalUtils";


describe('IPv6Range: ', () => {
    it('should instantiate by calling constructor with IPv4 and prefix', () => {
        let ipv6Range = new IPv6Range(new IPv6("::"), new IPv6Prefix(0));
        expect(ipv6Range.toCidrString()).toEqual("0:0:0:0:0:0:0:0/0");
    });
    it('should instantiate from string in cidr notation', () => {
         let ipv6Range = IPv6Range.of("2001:db8::/33");
         expect(ipv6Range.toCidrString()).toEqual("2001:db8:0:0:0:0:0:0/33");
    });
    it('should return the first IPv6 address in range', () => {
        let ipv6Range = new IPv6Range(new IPv6("2001:db8::"), new IPv6Prefix(48));
        expect(ipv6Range.getFirst().toString()).toEqual("2001:db8:0:0:0:0:0:0");
    });
    it('should return the last IPv4 address in range', () => {
        let ipv6Range = new IPv6Range(new IPv6("2001:db8::"), new IPv6Prefix(48));
        expect(ipv6Range.getLast().toString()).toEqual("2001:db8:0:ffff:ffff:ffff:ffff:ffff");
    });
    it('should convert to string with range dash format', () => {
        let ipv6Range = new IPv6Range(new IPv6("2001:db8::"), new IPv6Prefix(48));
        expect(ipv6Range.toRangeString()).toEqual("2001:db8:0:0:0:0:0:0-2001:db8:0:ffff:ffff:ffff:ffff:ffff");
    });
    // it('should return the correct list of IPv4 address when take is called', () => {
    //     let ipv4Range = new IPv4Range(new IPv4("192.198.0.0"), new IPv4Prefix(24));
    //     let take = ipv4Range.take(3);
    //     expect(take[0].toString()).toBe("192.198.0.0");
    //     expect(take[1].toString()).toBe("192.198.0.1");
    //     expect(take[2].toString()).toBe("192.198.0.2");
    // });
    // it('should correctly tell if ranges are consecutive', () => {
    //     let firstRange = IPv4Range.of("192.168.0.0/25");
    //     let secondRange = IPv4Range.of("192.168.0.128/25");
    //     let anotherSecondRange = IPv4Range.of("192.168.0.127/25");

    //     expect(firstRange.isConsecutive(secondRange)).toBe(true);
    //     expect(secondRange.isConsecutive(firstRange)).toBe(true);

    //     expect(firstRange.isConsecutive(anotherSecondRange)).toBe(false);
    //     expect(anotherSecondRange.isConsecutive(firstRange)).toBe(false);
    // });
    // xit('should correctly tell if ranges are overlapping', () => {
    //     // TODO find a way to create overlapping ranges.
    //     // TODO or confirm than normal ranges cannot overlap

    // });
    // it('should correctly tell if a range contains another range', () => {
    //     let containerRange = IPv4Range.of("192.168.0.0/24");
    //     let firstRange = IPv4Range.of("192.168.0.0/25");
    //     let secondRange = IPv4Range.of("192.168.0.128/25");

    //     expect(containerRange.contains(firstRange)).toBe(true);
    //     expect(containerRange.contains(secondRange)).toBe(true);

    //     expect(firstRange.contains(containerRange)).toBe(false);
    //     expect(secondRange.contains(containerRange)).toBe(false);
    // });
    // it('should correctly tell if a range is inside another range', () => {
    //     let containerRange = IPv4Range.of("192.168.0.0/24");
    //     let firstRange = IPv4Range.of("192.168.0.0/25");
    //     let secondRange = IPv4Range.of("192.168.0.128/25");

    //     expect(containerRange.inside(firstRange)).toBe(false);
    //     expect(containerRange.inside(secondRange)).toBe(false);

    //     expect(firstRange.inside(containerRange)).toBe(true);
    //     expect(secondRange.inside(containerRange)).toBe(true);
    // });
    // it('should correctly tell if ranges are not overlapping', () => {
    //     let firstRange = IPv4Range.of("192.168.0.0/26");
    //     let secondRange = IPv4Range.of("192.168.0.64/26");

    //     expect(firstRange.isOverlapping(secondRange)).toBe(false);
    //     expect(firstRange.isOverlapping(secondRange)).toBe(false);

    // });
    // it('should correctly tell that containing ranges are not overlapping', () => {
    //     let containerRange = IPv4Range.of("192.168.0.0/24");
    //     let firstRange = IPv4Range.of("192.168.0.0/25");
    //     let secondRange = IPv4Range.of("192.168.0.128/25");

    //     expect(firstRange.isOverlapping(secondRange)).toBe(false);
    //     expect(secondRange.isOverlapping(firstRange)).toBe(false);

    //     expect(containerRange.isOverlapping(firstRange)).toBe(false);
    //     expect(firstRange.isOverlapping(containerRange)).toBe(false);

    // });
    // it('should be able to use for in construct on range', () => {
    //     let ipv4Range = new IPv4Range(new IPv4("192.198.0.0"), new IPv4Prefix(30));
    //     let expectedValue = ipv4Range.take(4);
    //     let expectedIndex = 0;
    //     for (let value of ipv4Range) {
    //         expect(value.isEquals(expectedValue[expectedIndex])).toBe(true);
    //         expectedIndex++;
    //     }
    // });
    // it('should split IP range correctly', () => {
    //     let ipv4Range = IPv4Range.of("192.168.0.0/24");
    //     let splitRanges: Array<IPv4Range> = ipv4Range.split();
    //     let firstRange = splitRanges[0];
    //     let secondRange = splitRanges[1];
    //     expect(firstRange.toCidrString()).toBe("192.168.0.0/25");
    //     expect(secondRange.toCidrString()).toBe("192.168.0.128/25");
    // })
});