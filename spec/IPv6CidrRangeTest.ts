import {IPv6} from "../src";
import {IPv6Prefix} from "../src";
import {IPv6CidrRange} from "../src";
import {Validator} from "../src";


describe('IPv6CidrRange: ', () => {
    it('should instantiate by calling constructor with IPv4 and prefix', () => {
        let ipv6CidrRange = new IPv6CidrRange(new IPv6("::"), new IPv6Prefix(0));
        expect(ipv6CidrRange.toCidrString()).toEqual("::0/0");
    });
    it('should instantiate from string in cidr notation', () => {
         let ipv6CidrRange = IPv6CidrRange.fromCidr("2001:db8::/33");
         expect(ipv6CidrRange.toCidrString()).toEqual("2001:db8:0:0:0:0:0:0/33");
    });
    it('should return the first IPv6 number in range', () => {
        let ipv6CidrRange = new IPv6CidrRange(new IPv6("2001:db8::"), new IPv6Prefix(48));
        expect(ipv6CidrRange.getFirst().toString()).toEqual("2001:db8:0:0:0:0:0:0");
    });
    it('should return the last IPv4 number in range', () => {
        let ipv6CidrRange = new IPv6CidrRange(new IPv6("2001:db8::"), new IPv6Prefix(48));
        expect(ipv6CidrRange.getLast().toString()).toEqual("2001:db8:0:ffff:ffff:ffff:ffff:ffff");
    });
    it('should convert to string with range dash format', () => {
        let ipv6CidrRange = new IPv6CidrRange(new IPv6("2001:db8::"), new IPv6Prefix(48));
        expect(ipv6CidrRange.toRangeString()).toEqual("2001:db8:0:0:0:0:0:0-2001:db8:0:ffff:ffff:ffff:ffff:ffff");
    });
    it('should return the correct list of IPv6 number when take is called', () => {
        let ipv6CidrRange = new IPv6CidrRange(new IPv6("2001:db8::"), new IPv6Prefix(48));
        let take = ipv6CidrRange.take(3);
        expect(take[0].toString()).toBe("2001:db8:0:0:0:0:0:0");
        expect(take[1].toString()).toBe("2001:db8:0:0:0:0:0:1");
        expect(take[2].toString()).toBe("2001:db8:0:0:0:0:0:2");
    });
    it('should return the correct list of IPv6 numbers when takeStream is called and looped over using for of', () => {
      let ipv6CidrRange = new IPv6CidrRange(new IPv6("2001:db8::"), new IPv6Prefix(48));
      let ranges = ipv6CidrRange.take(3);
      let length = 0;
      for (let iprange of ranges) {
        length++;
        expect(["2001:db8:0:0:0:0:0:0", "2001:db8:0:0:0:0:0:1", "2001:db8:0:0:0:0:0:2"].some(range => iprange.toString() === range))
          .toBe(true);
      }

      expect(length).toBe(3);
    });

    it('should return the correct list of IPv6 numbers when takeStream is called and assigned to variables', () => {
      let ipv6CidrRange = new IPv6CidrRange(new IPv6("2001:db8::"), new IPv6Prefix(48));
      let ranges = ipv6CidrRange.takeStream(3);
      let [first, second, third] = ranges;

      expect(first.toString()).toBe("2001:db8:0:0:0:0:0:0");
      expect(second.toString()).toBe("2001:db8:0:0:0:0:0:1");
      expect(third.toString()).toBe("2001:db8:0:0:0:0:0:2");
    });

    it('should return all list of IPv6 number when takeStream is called without passing in a count', () => {
        let ipv6CidrRange = new IPv6CidrRange(new IPv6("2001:db8::"), new IPv6Prefix(126));
        let ranges = ipv6CidrRange.takeStream();

        let [first, second, third, fourth, fifth] = ranges;

        expect(first.toString()).toBe("2001:db8:0:0:0:0:0:0");
        expect(second.toString()).toBe("2001:db8:0:0:0:0:0:1");
        expect(third.toString()).toBe("2001:db8:0:0:0:0:0:2");
        expect(fourth.toString()).toBe("2001:db8:0:0:0:0:0:3");
        expect(fifth).toBeUndefined();
    });

    it('should correctly tell if ranges are consecutive', () => {
        let firstRange = new IPv6CidrRange(new IPv6("2001:db8::"), new IPv6Prefix(48));
        let secondRange = new IPv6CidrRange(new IPv6("2001:db8:1::"), new IPv6Prefix(48));
        let anotherSecondRange = new IPv6CidrRange(new IPv6("2001:db8::"), new IPv6Prefix(105));
        expect(firstRange.isConsecutive(secondRange)).toBe(true);
        expect(secondRange.isConsecutive(firstRange)).toBe(true);

        expect(firstRange.isConsecutive(anotherSecondRange)).toBe(false);
        expect(anotherSecondRange.isConsecutive(firstRange)).toBe(false);
    });
    it('should throw an exception when invalid cidr notation is used to create range', function() {
        expect(() => {
            IPv6CidrRange.fromCidr("2001:db8:0:0:0:0/300");
        }).toThrowError(Error, Validator.invalidIPv6CidrNotationString);
    });

    it('should throw an exception when asked to take a value bigger than the size of range', function() {
        let ipv6CidrRange = new IPv6CidrRange(new IPv6("2001:db8::"), new IPv6Prefix(46));
        let errMessage = Validator.takeOutOfRangeSizeMessage
            .replace("$size", ipv6CidrRange.getSize().toString())
            .replace("$count", (ipv6CidrRange.getSize().plus(1)).valueOf().toString());
        expect(() => {
            ipv6CidrRange.take(ipv6CidrRange.getSize().plus(1).valueOf());
        }).toThrowError(Error, errMessage);
    });
    it('should throw an exception when trying to split a range with on IP number', function(){
        let ipv6CidrRange = new IPv6CidrRange(new IPv6("2001:db8::"), new IPv6Prefix(128));
        expect(() => {
            ipv6CidrRange.split();
        }).toThrowError(Error, Validator.cannotSplitSingleRangeErrorMessage);
    });
    it('should correctly tell if a range contains another range', () => {
        let containerRange = new IPv6CidrRange(new IPv6("2001:db8::"), new IPv6Prefix(47));
        let firstRange = new IPv6CidrRange(new IPv6("2001:db8::"), new IPv6Prefix(48));
        let secondRange = new IPv6CidrRange(new IPv6("2001:db8:1::"), new IPv6Prefix(48));

        expect(containerRange.contains(firstRange)).toBe(true);
        expect(containerRange.contains(secondRange)).toBe(true);

        expect(firstRange.contains(containerRange)).toBe(false);
        expect(secondRange.contains(containerRange)).toBe(false);
    });
    it('should correctly tell if a range is inside another range', () => {
        let containerRange = new IPv6CidrRange(new IPv6("2001:db8::"), new IPv6Prefix(47));
        let firstRange = new IPv6CidrRange(new IPv6("2001:db8::"), new IPv6Prefix(48));
        let secondRange = new IPv6CidrRange(new IPv6("2001:db8:1::"), new IPv6Prefix(48));

        expect(containerRange.inside(firstRange)).toBe(false);
        expect(containerRange.inside(secondRange)).toBe(false);

        expect(firstRange.inside(containerRange)).toBe(true);
        expect(secondRange.inside(containerRange)).toBe(true);
    });
    it('should correctly tell if ranges are not overlapping', () => {
        // Consecutive ranges...
        let firstRange = new IPv6CidrRange(new IPv6("2001:db8::"), new IPv6Prefix(48));
        let secondRange = new IPv6CidrRange(new IPv6("2001:db8:1::"), new IPv6Prefix(48));
        // ...should not be overlapping
        expect(firstRange.isOverlapping(secondRange)).toBe(false);
        expect(firstRange.isOverlapping(secondRange)).toBe(false);

    });
    it('should correctly tell that containing ranges are not overlapping', () => {
        let containerRange = new IPv6CidrRange(new IPv6("2001:db8::"), new IPv6Prefix(47));
        let firstRange = new IPv6CidrRange(new IPv6("2001:db8::"), new IPv6Prefix(48));
        let secondRange = new IPv6CidrRange(new IPv6("2001:db8:1::"), new IPv6Prefix(48));

        expect(firstRange.isOverlapping(secondRange)).toBe(false);
        expect(secondRange.isOverlapping(firstRange)).toBe(false);

        expect(containerRange.isOverlapping(firstRange)).toBe(false);
        expect(firstRange.isOverlapping(containerRange)).toBe(false);

    });
    it('should be able to use for in construct on range', () => {
        let ipv6CidrRange = new IPv6CidrRange(new IPv6("2001:db8::"), new IPv6Prefix(127));
        let expectedValue = ipv6CidrRange.take(2);
        let expectedIndex = 0;
        for (let value of ipv6CidrRange) {
            expect(value.isEquals(expectedValue[expectedIndex])).toBe(true);
            expectedIndex++;
        }
    });
    it('should be able to use spread syntax on range', () => {
        let ipv6CidrRange = new IPv6CidrRange(new IPv6("2001:db8::"), new IPv6Prefix(127));
        let expectedValue = ipv6CidrRange.take(2);

        let iPv6CidrRanges = [... ipv6CidrRange];
        expect(iPv6CidrRanges[0].isEquals(expectedValue[0])).toBe(true);
        expect(iPv6CidrRanges[1].isEquals(expectedValue[1])).toBe(true);
    });
    it('should split IP range correctly', () => {
        let ipv6CidrRange = new IPv6CidrRange(new IPv6("2001:db8::"), new IPv6Prefix(47));
        let splitRanges: Array<IPv6CidrRange> = ipv6CidrRange.split();
        let firstRange = splitRanges[0];
        let secondRange = splitRanges[1];

        expect(firstRange.toCidrString()).toBe("2001:db8:0:0:0:0:0:0/48");
        expect(secondRange.toCidrString()).toBe("2001:db8:1:0:0:0:0:0/48");
    });
    it('should tell if there is a next adjacent range', () => {
        let firstRange = new IPv6CidrRange(new IPv6("0:0:0:0:0:0:0:0"), new IPv6Prefix(1));
        let secondRange = new IPv6CidrRange(new IPv6("2001:db8:0:0:0:0:0:0"), new IPv6Prefix(1));
        let thirdRange = new IPv6CidrRange(new IPv6("c000:0:0:0:0:0:0:0"), new IPv6Prefix(2));
        let fourthRange = new IPv6CidrRange(new IPv6("ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff"), new IPv6Prefix(2));

        expect(firstRange.hasNextRange()).toBe(true);
        expect(secondRange.hasNextRange()).toBe(true);
        expect(thirdRange.hasNextRange()).toBe(false);
        expect(fourthRange.hasNextRange()).toBe(false);
    });
    it('should tell if there is a previous adjacent range', () => {
        let firstRange = new IPv6CidrRange(new IPv6("0:0:0:0:0:0:0:0"), new IPv6Prefix(1));
        let secondRange = new IPv6CidrRange(new IPv6("7fff:ffff:ffff:ffff:ffff:ffff:ffff:ffff"), new IPv6Prefix(1));
        let thirdRange = new IPv6CidrRange(new IPv6("8000:0:0:0:0:0:0:0"), new IPv6Prefix(1));
        let fourthRange = new IPv6CidrRange(new IPv6("ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff"), new IPv6Prefix(1));

        expect(firstRange.hasPreviousRange()).toBe(false);
        expect(secondRange.hasPreviousRange()).toBe(false);
        expect(thirdRange.hasPreviousRange()).toBe(true);
        expect(fourthRange.hasPreviousRange()).toBe(true);
    });
    it('should return the next adjacent range', () => {
      expect(IPv6CidrRange.fromCidr("c000:0:0:1:0:0:0:0/64").nextRange()).toEqual(IPv6CidrRange.fromCidr("c000:0:0:2:0:0:0:0/64"))
    });
    it('should return the previous adjacent range', () => {
      expect(IPv6CidrRange.fromCidr("c000:0:0:2:0:0:0:0/64").previousRange()).toEqual(IPv6CidrRange.fromCidr("c000:0:0:1:0:0:0:0/64"))
    })
});