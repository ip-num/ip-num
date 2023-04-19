import {IPv4CidrRange} from "../src";
import {IPv4} from "../src";
import {IPv4Prefix} from "../src";
import {Validator} from "../src";

describe('IPv4CidrRange: ', () => {
    it('should instantiate by calling constructor with IPv4 and prefix', () => {
        let ipv4CidrRange = new IPv4CidrRange(new IPv4("192.198.0.0"), new IPv4Prefix(24n));
        expect(ipv4CidrRange.toCidrString()).toEqual("192.198.0.0/24");
    });
    it('should instantiate from string in cidr notation', () => {
        let ipv4CidrRange = IPv4CidrRange.fromCidr("192.198.0.0/24");
        expect(ipv4CidrRange.toCidrString()).toEqual("192.198.0.0/24");

        let iPv4CidrRange = IPv4CidrRange.fromCidr("1.2.3.4/5");
        expect(iPv4CidrRange.toCidrString()).toEqual("1.2.3.4/5");
        expect(iPv4CidrRange.getFirst().toString()).toEqual("0.0.0.0");

    });

    it('should throw exception when passed in a malformed range', () => {
        let errorMessages = [Validator.invalidOctetRangeMessage, Validator.invalidPrefixValueMessage];
        let errorMessage = errorMessages.filter(message => {return message !== ''}).join(" and ");
        expect(() => {
            IPv4CidrRange.fromCidr("192.198.333.0/66");

        }).toThrowError(Error, errorMessage);
    });


    it('should return the first IPv4 number in range', () => {
        let ipv4CidrRange = new IPv4CidrRange(new IPv4("192.198.0.0"), new IPv4Prefix(24n));
        expect(ipv4CidrRange.getFirst().toString()).toEqual("192.198.0.0");
    });
    it('should return the last IPv4 number in range', () => {
        let ipv4CidrRange = new IPv4CidrRange(new IPv4("192.198.0.0"), new IPv4Prefix(24n));
        expect(ipv4CidrRange.getLast().toString()).toEqual("192.198.0.255");
    });
    it('should convert to string with range dash format', () => {
        let ipv4CidrRange = new IPv4CidrRange(new IPv4("192.198.0.0"), new IPv4Prefix(24n));
        expect(ipv4CidrRange.toRangeString()).toEqual("192.198.0.0-192.198.0.255");
    });
    it('should return the correct list of IPv4 number when take is called', () => {
        let ipv4CidrRange = new IPv4CidrRange(new IPv4("192.198.0.0"), new IPv4Prefix(24n));
        let take = ipv4CidrRange.take(3n);
        expect(take[0].toString()).toBe("192.198.0.0");
        expect(take[1].toString()).toBe("192.198.0.1");
        expect(take[2].toString()).toBe("192.198.0.2");
    });
    it('should return the correct list of IPv4 numbers when takeStream is called and looped over using for of', () => {
      let ipv4CidrRange = new IPv4CidrRange(new IPv4("0.0.0.0"), new IPv4Prefix(0n));
      let ranges = ipv4CidrRange.toRangeSet().take(3);
      let length = 0;
      for (let iprange of ranges) {
        length++;
        expect(["0.0.0.0", "0.0.0.1", "0.0.0.2"].some(range => iprange.toString() === range)).toBe(true);
      }
      expect(length).toBe(3);
    });

    it('should return the correct list of IPv4 numbers when takeStream is called and assigned to variables', () => {
      let ipv4CidrRange = new IPv4CidrRange(new IPv4("0.0.0.0"), new IPv4Prefix(0n));
      let ranges = ipv4CidrRange.toRangeSet().take(3);
      let [first, second, third] = ranges;

      expect(first.toString()).toBe("0.0.0.0");
      expect(second.toString()).toBe("0.0.0.1");
      expect(third.toString()).toBe("0.0.0.2");
    });

    it('should return all list of IPv4 numbers when takeStream is called without passing in a count', () => {
        let ipv4CidrRange = new IPv4CidrRange(new IPv4("0.0.0.0"), new IPv4Prefix(30n));
        let ranges = ipv4CidrRange.toRangeSet().take();
        let [first, second, third, fourth, fifth] = ranges;

        expect(first.toString()).toBe("0.0.0.0");
        expect(second.toString()).toBe("0.0.0.1");
        expect(third.toString()).toBe("0.0.0.2");
        expect(fourth.toString()).toBe("0.0.0.3");
        expect(fifth).toBeUndefined();
    });

    it('should throw an exception when asked to take a value bigger than the size of range', function() {
        let ipv4CidrRange = new IPv4CidrRange(new IPv4("192.198.0.0"), new IPv4Prefix(24n));
        let errMessage = Validator.takeOutOfRangeSizeMessage
            .replace("$size", ipv4CidrRange.getSize().toString())
            .replace("$count", (ipv4CidrRange.getSize() + 1n).toString());
        expect(() => {
            ipv4CidrRange.take(ipv4CidrRange.getSize() + 1n);
        }).toThrowError(Error, errMessage);
    });
    it('should throw an exception when trying to split a range with on IP number', function(){
        let ipv4CidrRange = new IPv4CidrRange(new IPv4("192.198.0.0"), new IPv4Prefix(32n));
        expect(() => {
            ipv4CidrRange.split();
        }).toThrowError(Error, Validator.cannotSplitSingleRangeErrorMessage);
    });
    it('should correctly tell if ranges are consecutive', () => {
        let firstRange = IPv4CidrRange.fromCidr("192.168.0.0/25");
        let secondRange = IPv4CidrRange.fromCidr("192.168.0.128/25");
        let anotherSecondRange = IPv4CidrRange.fromCidr("192.168.0.127/25");

        expect(firstRange.isConsecutive(secondRange)).toBe(true);
        expect(secondRange.isConsecutive(firstRange)).toBe(true);

        expect(firstRange.isConsecutive(anotherSecondRange)).toBe(false);
        expect(anotherSecondRange.isConsecutive(firstRange)).toBe(false);
    });
    it('should correctly tell if a range contains another range', () => {
        let containerRange = IPv4CidrRange.fromCidr("192.168.0.0/24");
        let firstRange = IPv4CidrRange.fromCidr("192.168.0.0/25");
        let secondRange = IPv4CidrRange.fromCidr("192.168.0.128/25");

        expect(containerRange.contains(firstRange)).toBe(true);
        expect(containerRange.contains(secondRange)).toBe(true);

        expect(firstRange.contains(containerRange)).toBe(false);
        expect(secondRange.contains(containerRange)).toBe(false);
    });
    it('should correctly tell if a range is inside another range', () => {
        let containerRange = IPv4CidrRange.fromCidr("192.168.0.0/24");
        let firstRange = IPv4CidrRange.fromCidr("192.168.0.0/25");
        let secondRange = IPv4CidrRange.fromCidr("192.168.0.128/25");

        expect(containerRange.inside(firstRange)).toBe(false);
        expect(containerRange.inside(secondRange)).toBe(false);

        expect(firstRange.inside(containerRange)).toBe(true);
        expect(secondRange.inside(containerRange)).toBe(true);
    });
    it('should correctly tell if ranges are not overlapping', () => {
        let firstRange = IPv4CidrRange.fromCidr("192.168.0.0/26");
        let secondRange = IPv4CidrRange.fromCidr("192.168.0.64/26");

        expect(firstRange.isOverlapping(secondRange)).toBe(false);
        expect(firstRange.isOverlapping(secondRange)).toBe(false);

    });
    it('should correctly tell that containing ranges are overlapping', () => {
        let containerRange = IPv4CidrRange.fromCidr("192.168.0.0/24");
        let firstRange = IPv4CidrRange.fromCidr("192.168.0.0/25");
        let secondRange = IPv4CidrRange.fromCidr("192.168.0.128/25");

        expect(firstRange.isOverlapping(secondRange)).toBe(false);
        expect(secondRange.isOverlapping(firstRange)).toBe(false);

        expect(containerRange.isOverlapping(firstRange)).toBe(true);
        expect(firstRange.isOverlapping(containerRange)).toBe(true);

    });
    it('should correctly tell if ranges can be merged', () => {
        let firstRange = IPv4CidrRange.fromCidr("192.168.208.0/25");
        let secondRange = IPv4CidrRange.fromCidr("192.168.208.128/25");
        expect(firstRange.isCidrMergeable(secondRange)).toBe(true);
        expect(secondRange.isCidrMergeable(firstRange)).toBe(true);
    });
    it('should correctly tell if ranges cannot be merged', () => {
        let firstRange = IPv4CidrRange.fromCidr("192.168.0.0/8");
        let secondRange = IPv4CidrRange.fromCidr("192.168.0.2/8");
        expect(firstRange.isCidrMergeable(secondRange)).toBe(false);
        expect(secondRange.isCidrMergeable(firstRange)).toBe(false);
    });
    it('should correctly merge mergeable ranges', () => {
        let firstRange = IPv4CidrRange.fromCidr("192.168.208.0/25");
        let secondRange = IPv4CidrRange.fromCidr("192.168.208.128/25");

        expect(firstRange.merge(secondRange).toRangeString()).toBe("192.168.208.0-192.168.208.255");
    });
    it('should correctly tell when ranges are equal', () => {
        let firstRange = IPv4CidrRange.fromCidr("192.168.0.0/25");
        let secondRange = IPv4CidrRange.fromCidr("192.168.0.0/25");

        expect(firstRange.isEquals(secondRange)).toBe(true);
    });
    it('should correctly tell when ranges are not equal', () => {
        let firstRange = IPv4CidrRange.fromCidr("192.168.0.0/25");
        let secondRange = IPv4CidrRange.fromCidr("192.168.0.128/25");

        expect(firstRange.isEquals(secondRange)).toBe(false);
    });
    it('should be able to use for in construct on range', () => {
        let ipv4CidrRange = new IPv4CidrRange(new IPv4("192.198.0.0"), new IPv4Prefix(30n));
        let expectedValue = ipv4CidrRange.take(4n);
        let expectedIndex = 0;
        for (let value of ipv4CidrRange) {
            expect(value.isEquals(expectedValue[expectedIndex])).toBe(true);
            expectedIndex++;
        }
    });
    it('should be able to use spread syntax on range', () => {
        let ipv4CidrRange = new IPv4CidrRange(new IPv4("192.198.0.0"), new IPv4Prefix(30n));
        let expectedValue = ipv4CidrRange.take(4n);

        let iPv4CidrRanges = [... ipv4CidrRange];

        expect(iPv4CidrRanges[0].isEquals(expectedValue[0])).toBe(true);
        expect(iPv4CidrRanges[1].isEquals(expectedValue[1])).toBe(true);
        expect(iPv4CidrRanges[2].isEquals(expectedValue[2])).toBe(true);
        expect(iPv4CidrRanges[3].isEquals(expectedValue[3])).toBe(true);
    });
    it('should split IP range correctly', () => {
        let ipv4CidrRange = IPv4CidrRange.fromCidr("192.168.208.0/24");
        let splitRanges: Array<IPv4CidrRange> = ipv4CidrRange.split();
        let firstRange = splitRanges[0];
        let secondRange = splitRanges[1];
        expect(firstRange.toCidrString()).toBe("192.168.208.0/25");
        expect(secondRange.toCidrString()).toBe("192.168.208.128/25");
    });
    it('should throw on splitInto IP if split range is greater', () => {
        let ipv4CidrRange = IPv4CidrRange.fromCidr("192.168.208.0/24");
        expect(() => {
            ipv4CidrRange.splitInto(IPv4Prefix.fromNumber(23n));
        }).toThrowError(Error);
    });
    it('should split IP range on level correctly using split Into, no ops', () => {
        let ipv4CidrRange = IPv4CidrRange.fromCidr("192.168.208.0/24");
        let splitRanges: Array<IPv4CidrRange> = ipv4CidrRange.splitInto(IPv4Prefix.fromNumber(24n));
        let firstRange = splitRanges[0];
        expect(firstRange.toCidrString()).toBe("192.168.208.0/24");
    });
    it('should split IP range on level correctly using split Into', () => {
        let ipv4CidrRange = IPv4CidrRange.fromCidr("192.168.208.0/24");
        let splitRanges: Array<IPv4CidrRange> = ipv4CidrRange.splitInto(IPv4Prefix.fromNumber(25n));
        let firstRange = splitRanges[0];
        let secondRange = splitRanges[1];
        expect(firstRange.toCidrString()).toBe("192.168.208.0/25");
        expect(secondRange.toCidrString()).toBe("192.168.208.128/25");
    });
    it('should split IP range multiple level correctly using split Into', () => {
        let ipv4CidrRange = IPv4CidrRange.fromCidr("192.168.208.0/24");
        let splitRanges: Array<IPv4CidrRange> = ipv4CidrRange.splitInto(IPv4Prefix.fromNumber(26n));
        let firstRange = splitRanges[0];
        let secondRange = splitRanges[1];
        let thirdRange = splitRanges[2];
        let fourthRange = splitRanges[3];
        expect(firstRange.toCidrString()).toBe("192.168.208.0/26");
        expect(secondRange.toCidrString()).toBe("192.168.208.64/26");
        expect(thirdRange.toCidrString()).toBe("192.168.208.128/26");
        expect(fourthRange.toCidrString()).toBe("192.168.208.192/26");
    });
    it('should tell if there is a next consecutive range', () => {
        let firstRange = new IPv4CidrRange(new IPv4("0.0.0.0"), new IPv4Prefix(1n));
        let secondRange = new IPv4CidrRange(new IPv4("127.255.255.255"), new IPv4Prefix(1n));
        let thirdRange = new IPv4CidrRange(new IPv4("128.0.0.0"), new IPv4Prefix(1n));
        let fourthRange = new IPv4CidrRange(new IPv4("255.255.255.255"), new IPv4Prefix(1n));

        expect(firstRange.hasNextRange()).toBe(true);
        expect(secondRange.hasNextRange()).toBe(true);
        expect(thirdRange.hasNextRange()).toBe(false);
        expect(fourthRange.hasNextRange()).toBe(false);

        expect(IPv4CidrRange.fromCidr("192.168.208.0/24").hasNextRange()).toBe(true);
        expect(IPv4CidrRange.fromCidr("255.255.254.0/24").hasNextRange()).toBe(true);
        expect(IPv4CidrRange.fromCidr("255.255.255.0/24").hasNextRange()).toBe(false);
    });
    it('should tell if there is a next adjacent range', () => {
        let firstRange = new IPv4CidrRange(new IPv4("0.0.0.0"), new IPv4Prefix(1n));
        let secondRange = new IPv4CidrRange(new IPv4("127.255.255.255"), new IPv4Prefix(1n));
        let thirdRange = new IPv4CidrRange(new IPv4("128.0.0.0"), new IPv4Prefix(1n));
        let fourthRange = new IPv4CidrRange(new IPv4("255.255.255.255"), new IPv4Prefix(1n));

        expect(firstRange.hasNextRange()).toBe(true);
        expect(secondRange.hasNextRange()).toBe(true);
        expect(thirdRange.hasNextRange()).toBe(false);
        expect(fourthRange.hasNextRange()).toBe(false);

        expect(IPv4CidrRange.fromCidr("192.168.208.0/24").hasNextRange()).toBe(true);
        expect(IPv4CidrRange.fromCidr("255.255.254.0/24").hasNextRange()).toBe(true);
        expect(IPv4CidrRange.fromCidr("255.255.255.0/24").hasNextRange()).toBe(false);
    });
    it('should tell if there is a previous adjacent range', () => {
        let firstRange = new IPv4CidrRange(new IPv4("0.0.0.0"), new IPv4Prefix(1n));
        let secondRange = new IPv4CidrRange(new IPv4("127.255.255.255"), new IPv4Prefix(1n));
        let thirdRange = new IPv4CidrRange(new IPv4("128.0.0.0"), new IPv4Prefix(1n));
        let fourthRange = new IPv4CidrRange(new IPv4("255.255.255.255"), new IPv4Prefix(1n));

        expect(firstRange.hasPreviousRange()).toBe(false);
        expect(secondRange.hasPreviousRange()).toBe(false);

        expect(thirdRange.hasPreviousRange()).toBe(true);
        expect(fourthRange.hasPreviousRange()).toBe(true);

        expect(IPv4CidrRange.fromCidr("0.0.0.0/24").hasPreviousRange()).toBe(false);
        expect(IPv4CidrRange.fromCidr("192.168.208.0/24").hasPreviousRange()).toBe(true);
        expect(IPv4CidrRange.fromCidr("255.255.254.0/24").hasPreviousRange()).toBe(true);
        expect(IPv4CidrRange.fromCidr("255.255.255.0/24").hasPreviousRange()).toBe(true);
    });
    it('should return the next adjacent range', () => {
      expect(IPv4CidrRange.fromCidr("255.255.254.0/24").nextRange()).toEqual(IPv4CidrRange.fromCidr("255.255.255.0/24"))
    });
    it('should return the previous adjacent range', () => {
      expect(IPv4CidrRange.fromCidr("255.255.255.0/24").previousRange()).toEqual(IPv4CidrRange.fromCidr("255.255.254.0/24"))
    })
    it('should return false for two adjacent ranges that cannot form a single range', () => {
        let firstRange = IPv4CidrRange.fromCidr("10.0.1.0/24");
        let secondRange = IPv4CidrRange.fromCidr("10.0.2.0/24");
        expect(firstRange.isCidrMergeable(secondRange)).toBe(false);
        expect(secondRange.isCidrMergeable(firstRange)).toBe(false);
    })
});
