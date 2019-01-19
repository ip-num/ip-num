import {IPv4CidrRange} from "../src";
import {IPv4} from "../src";
import {IPv4Prefix} from "../src";
import {Validator} from "../src";


describe('IPv4CidrRange: ', () => {
    it('should instantiate by calling constructor with IPv4 and prefix', () => {
        let ipv4CidrRange = new IPv4CidrRange(new IPv4("192.198.0.0"), new IPv4Prefix(24));
        expect(ipv4CidrRange.toCidrString()).toEqual("192.198.0.0/24");
    });
    it('should instantiate from string in cidr notation', () => {
        let ipv4CidrRange = IPv4CidrRange.fromCidr("192.198.0.0/24");
        expect(ipv4CidrRange.toCidrString()).toEqual("192.198.0.0/24");
    });

    it('should throw exception when passed in a malformed range', () => {
        let errorMessages = [Validator.invalidOctetRangeMessage, Validator.invalidPrefixValueMessage];
        let errorMessage = errorMessages.filter(message => {return message !== ''}).join(" and ");
        expect(() => {
            IPv4CidrRange.fromCidr("192.198.333.0/66");

        }).toThrowError(Error, errorMessage);
    });


    it('should return the first IPv4 number in range', () => {
        let ipv4CidrRange = new IPv4CidrRange(new IPv4("192.198.0.0"), new IPv4Prefix(24));
        expect(ipv4CidrRange.getFirst().toString()).toEqual("192.198.0.0");
    });
    it('should return the last IPv4 number in range', () => {
        let ipv4CidrRange = new IPv4CidrRange(new IPv4("192.198.0.0"), new IPv4Prefix(24));
        expect(ipv4CidrRange.getLast().toString()).toEqual("192.198.0.255");
    });
    it('should convert to string with range dash format', () => {
        let ipv4CidrRange = new IPv4CidrRange(new IPv4("192.198.0.0"), new IPv4Prefix(24));
        expect(ipv4CidrRange.toRangeString()).toEqual("192.198.0.0-192.198.0.255");
    });
    it('should return the correct list of IPv4 number when take is called', () => {
        let ipv4CidrRange = new IPv4CidrRange(new IPv4("192.198.0.0"), new IPv4Prefix(24));
        let take = ipv4CidrRange.take(3);
        expect(take[0].toString()).toBe("192.198.0.0");
        expect(take[1].toString()).toBe("192.198.0.1");
        expect(take[2].toString()).toBe("192.198.0.2");
    });
    it('should throw an exception when asked to take a value bigger than the size of range', function() {
        let ipv4CidrRange = new IPv4CidrRange(new IPv4("192.198.0.0"), new IPv4Prefix(24));
        let errMessage = Validator.takeOutOfRangeSizeMessage
            .replace("$size", ipv4CidrRange.getSize().toString())
            .replace("$count", (ipv4CidrRange.getSize().plus(1)).toString());
        expect(() => {
            ipv4CidrRange.take(ipv4CidrRange.getSize().plus(1).valueOf());
        }).toThrowError(Error, errMessage);
    });
    it('should throw an exception when trying to split a range with on IP number', function(){
        let ipv4CidrRange = new IPv4CidrRange(new IPv4("192.198.0.0"), new IPv4Prefix(32));
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
    it('should correctly tell that containing ranges are not overlapping', () => {
        let containerRange = IPv4CidrRange.fromCidr("192.168.0.0/24");
        let firstRange = IPv4CidrRange.fromCidr("192.168.0.0/25");
        let secondRange = IPv4CidrRange.fromCidr("192.168.0.128/25");

        expect(firstRange.isOverlapping(secondRange)).toBe(false);
        expect(secondRange.isOverlapping(firstRange)).toBe(false);

        expect(containerRange.isOverlapping(firstRange)).toBe(false);
        expect(firstRange.isOverlapping(containerRange)).toBe(false);

    });
    it('should be able to use for in construct on range', () => {
        let ipv4CidrRange = new IPv4CidrRange(new IPv4("192.198.0.0"), new IPv4Prefix(30));
        let expectedValue = ipv4CidrRange.take(4);
        let expectedIndex = 0;
        for (let value of ipv4CidrRange) {
            expect(value.isEquals(expectedValue[expectedIndex])).toBe(true);
            expectedIndex++;
        }
    });
    it('should be able to use spread syntax on range', () => {
        let ipv4CidrRange = new IPv4CidrRange(new IPv4("192.198.0.0"), new IPv4Prefix(30));
        let expectedValue = ipv4CidrRange.take(4);

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
    it('should tell if there is a next consecutive range', () => {
        let firstRange = new IPv4CidrRange(new IPv4("0.0.0.0"), new IPv4Prefix(1));
        let secondRange = new IPv4CidrRange(new IPv4("127.255.255.255"), new IPv4Prefix(1));
        let thirdRange = new IPv4CidrRange(new IPv4("128.0.0.0"), new IPv4Prefix(1));
        let fourthRange = new IPv4CidrRange(new IPv4("255.255.255.255"), new IPv4Prefix(1));

        expect(firstRange.hasNextRange()).toBe(true);
        expect(secondRange.hasNextRange()).toBe(true);
        expect(thirdRange.hasNextRange()).toBe(false);
        expect(fourthRange.hasNextRange()).toBe(false);

        expect(IPv4CidrRange.fromCidr("192.168.208.0/24").hasNextRange()).toBe(true);
        expect(IPv4CidrRange.fromCidr("255.255.254.0/24").hasNextRange()).toBe(true);
        expect(IPv4CidrRange.fromCidr("255.255.255.0/24").hasNextRange()).toBe(false);
    });
    it('should tell if there is a next adjacent range', () => {
        let firstRange = new IPv4CidrRange(new IPv4("0.0.0.0"), new IPv4Prefix(1));
        let secondRange = new IPv4CidrRange(new IPv4("127.255.255.255"), new IPv4Prefix(1));
        let thirdRange = new IPv4CidrRange(new IPv4("128.0.0.0"), new IPv4Prefix(1));
        let fourthRange = new IPv4CidrRange(new IPv4("255.255.255.255"), new IPv4Prefix(1));

        expect(firstRange.hasNextRange()).toBe(true);
        expect(secondRange.hasNextRange()).toBe(true);
        expect(thirdRange.hasNextRange()).toBe(false);
        expect(fourthRange.hasNextRange()).toBe(false);

        expect(IPv4CidrRange.fromCidr("192.168.208.0/24").hasNextRange()).toBe(true);
        expect(IPv4CidrRange.fromCidr("255.255.254.0/24").hasNextRange()).toBe(true);
        expect(IPv4CidrRange.fromCidr("255.255.255.0/24").hasNextRange()).toBe(false);
    });
    it('should tell if there is a previous adjacent range', () => {
        let firstRange = new IPv4CidrRange(new IPv4("0.0.0.0"), new IPv4Prefix(1));
        let secondRange = new IPv4CidrRange(new IPv4("127.255.255.255"), new IPv4Prefix(1));
        let thirdRange = new IPv4CidrRange(new IPv4("128.0.0.0"), new IPv4Prefix(1));
        let fourthRange = new IPv4CidrRange(new IPv4("255.255.255.255"), new IPv4Prefix(1));

        expect(firstRange.hasPreviousRange()).toBe(false);
        expect(secondRange.hasPreviousRange()).toBe(false);

        expect(thirdRange.hasPreviousRange()).toBe(true);
        expect(fourthRange.hasPreviousRange()).toBe(true);

        expect(IPv4CidrRange.fromCidr("0.0.0.0/24").hasPreviousRange()).toBe(false);
        expect(IPv4CidrRange.fromCidr("192.168.208.0/24").hasPreviousRange()).toBe(true);
        expect(IPv4CidrRange.fromCidr("255.255.254.0/24").hasPreviousRange()).toBe(true);
        expect(IPv4CidrRange.fromCidr("255.255.255.0/24").hasPreviousRange()).toBe(true);
    })
});