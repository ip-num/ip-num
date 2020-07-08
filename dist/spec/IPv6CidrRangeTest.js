"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var src_1 = require("../src");
var src_2 = require("../src");
var src_3 = require("../src");
var src_4 = require("../src");
var bigInt = require("big-integer");
describe('IPv6CidrRange: ', function () {
    it('should instantiate by calling constructor with IPv4 and prefix', function () {
        var ipv6CidrRange = new src_3.IPv6CidrRange(new src_1.IPv6("::"), new src_2.IPv6Prefix(0));
        expect(ipv6CidrRange.toCidrString()).toEqual("0:0:0:0:0:0:0:0/0");
    });
    it('should instantiate from string in cidr notation', function () {
        var ipv6CidrRange = src_3.IPv6CidrRange.fromCidr("2001:db8::/33");
        expect(ipv6CidrRange.toCidrString()).toEqual("2001:db8:0:0:0:0:0:0/33");
    });
    it('should return the first IPv6 number in range', function () {
        var ipv6CidrRange = new src_3.IPv6CidrRange(new src_1.IPv6("2001:db8::"), new src_2.IPv6Prefix(48));
        expect(ipv6CidrRange.getFirst().toString()).toEqual("2001:db8:0:0:0:0:0:0");
    });
    it('should return the last IPv4 number in range', function () {
        var ipv6CidrRange = new src_3.IPv6CidrRange(new src_1.IPv6("2001:db8::"), new src_2.IPv6Prefix(48));
        expect(ipv6CidrRange.getLast().toString()).toEqual("2001:db8:0:ffff:ffff:ffff:ffff:ffff");
    });
    it('should convert to string with range dash format', function () {
        var ipv6CidrRange = new src_3.IPv6CidrRange(new src_1.IPv6("2001:db8::"), new src_2.IPv6Prefix(48));
        expect(ipv6CidrRange.toRangeString()).toEqual("2001:db8:0:0:0:0:0:0-2001:db8:0:ffff:ffff:ffff:ffff:ffff");
    });
    it('should return the correct list of IPv6 number when take is called', function () {
        var ipv6CidrRange = new src_3.IPv6CidrRange(new src_1.IPv6("2001:db8::"), new src_2.IPv6Prefix(48));
        var take = ipv6CidrRange.take(bigInt(3));
        expect(take[0].toString()).toBe("2001:db8:0:0:0:0:0:0");
        expect(take[1].toString()).toBe("2001:db8:0:0:0:0:0:1");
        expect(take[2].toString()).toBe("2001:db8:0:0:0:0:0:2");
    });
    it('should correctly tell if ranges are consecutive', function () {
        var firstRange = new src_3.IPv6CidrRange(new src_1.IPv6("2001:db8::"), new src_2.IPv6Prefix(48));
        var secondRange = new src_3.IPv6CidrRange(new src_1.IPv6("2001:db8:1::"), new src_2.IPv6Prefix(48));
        var anotherSecondRange = new src_3.IPv6CidrRange(new src_1.IPv6("2001:db8::"), new src_2.IPv6Prefix(105));
        expect(firstRange.isConsecutive(secondRange)).toBe(true);
        expect(secondRange.isConsecutive(firstRange)).toBe(true);
        expect(firstRange.isConsecutive(anotherSecondRange)).toBe(false);
        expect(anotherSecondRange.isConsecutive(firstRange)).toBe(false);
    });
    it('should throw an exception when invalid cidr notation is used to create range', function () {
        expect(function () {
            src_3.IPv6CidrRange.fromCidr("2001:db8:0:0:0:0/300");
        }).toThrowError(Error, src_4.Validator.invalidIPv6CidrNotationString);
    });
    it('should throw an exception when asked to take a value bigger than the size of range', function () {
        var ipv6CidrRange = new src_3.IPv6CidrRange(new src_1.IPv6("2001:db8::"), new src_2.IPv6Prefix(46));
        var errMessage = src_4.Validator.takeOutOfRangeSizeMessage
            .replace("$size", ipv6CidrRange.getSize().toString())
            .replace("$count", (ipv6CidrRange.getSize().plus(1)).toString());
        expect(function () {
            ipv6CidrRange.take(ipv6CidrRange.getSize().plus(1));
        }).toThrowError(Error, errMessage);
    });
    it('should throw an exception when trying to split a range with on IP number', function () {
        var ipv6CidrRange = new src_3.IPv6CidrRange(new src_1.IPv6("2001:db8::"), new src_2.IPv6Prefix(128));
        expect(function () {
            ipv6CidrRange.split();
        }).toThrowError(Error, src_4.Validator.cannotSplitSingleRangeErrorMessage);
    });
    it('should correctly tell if a range contains another range', function () {
        var containerRange = new src_3.IPv6CidrRange(new src_1.IPv6("2001:db8::"), new src_2.IPv6Prefix(47));
        var firstRange = new src_3.IPv6CidrRange(new src_1.IPv6("2001:db8::"), new src_2.IPv6Prefix(48));
        var secondRange = new src_3.IPv6CidrRange(new src_1.IPv6("2001:db8:1::"), new src_2.IPv6Prefix(48));
        expect(containerRange.contains(firstRange)).toBe(true);
        expect(containerRange.contains(secondRange)).toBe(true);
        expect(firstRange.contains(containerRange)).toBe(false);
        expect(secondRange.contains(containerRange)).toBe(false);
    });
    it('should correctly tell if a range is inside another range', function () {
        var containerRange = new src_3.IPv6CidrRange(new src_1.IPv6("2001:db8::"), new src_2.IPv6Prefix(47));
        var firstRange = new src_3.IPv6CidrRange(new src_1.IPv6("2001:db8::"), new src_2.IPv6Prefix(48));
        var secondRange = new src_3.IPv6CidrRange(new src_1.IPv6("2001:db8:1::"), new src_2.IPv6Prefix(48));
        expect(containerRange.inside(firstRange)).toBe(false);
        expect(containerRange.inside(secondRange)).toBe(false);
        expect(firstRange.inside(containerRange)).toBe(true);
        expect(secondRange.inside(containerRange)).toBe(true);
    });
    it('should correctly tell if ranges are not overlapping', function () {
        // Consecutive ranges...
        var firstRange = new src_3.IPv6CidrRange(new src_1.IPv6("2001:db8::"), new src_2.IPv6Prefix(48));
        var secondRange = new src_3.IPv6CidrRange(new src_1.IPv6("2001:db8:1::"), new src_2.IPv6Prefix(48));
        // ...should not be overlapping
        expect(firstRange.isOverlapping(secondRange)).toBe(false);
        expect(firstRange.isOverlapping(secondRange)).toBe(false);
    });
    it('should correctly tell that containing ranges are not overlapping', function () {
        var containerRange = new src_3.IPv6CidrRange(new src_1.IPv6("2001:db8::"), new src_2.IPv6Prefix(47));
        var firstRange = new src_3.IPv6CidrRange(new src_1.IPv6("2001:db8::"), new src_2.IPv6Prefix(48));
        var secondRange = new src_3.IPv6CidrRange(new src_1.IPv6("2001:db8:1::"), new src_2.IPv6Prefix(48));
        expect(firstRange.isOverlapping(secondRange)).toBe(false);
        expect(secondRange.isOverlapping(firstRange)).toBe(false);
        expect(containerRange.isOverlapping(firstRange)).toBe(false);
        expect(firstRange.isOverlapping(containerRange)).toBe(false);
    });
    it('should be able to use for in construct on range', function () {
        var e_1, _a;
        var ipv6CidrRange = new src_3.IPv6CidrRange(new src_1.IPv6("2001:db8::"), new src_2.IPv6Prefix(127));
        var expectedValue = ipv6CidrRange.take(bigInt(2));
        var expectedIndex = 0;
        try {
            for (var ipv6CidrRange_1 = __values(ipv6CidrRange), ipv6CidrRange_1_1 = ipv6CidrRange_1.next(); !ipv6CidrRange_1_1.done; ipv6CidrRange_1_1 = ipv6CidrRange_1.next()) {
                var value = ipv6CidrRange_1_1.value;
                expect(value.isEquals(expectedValue[expectedIndex])).toBe(true);
                expectedIndex++;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (ipv6CidrRange_1_1 && !ipv6CidrRange_1_1.done && (_a = ipv6CidrRange_1.return)) _a.call(ipv6CidrRange_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    });
    it('should be able to use spread syntax on range', function () {
        var ipv6CidrRange = new src_3.IPv6CidrRange(new src_1.IPv6("2001:db8::"), new src_2.IPv6Prefix(127));
        var expectedValue = ipv6CidrRange.take(bigInt(2));
        var iPv6CidrRanges = __spread(ipv6CidrRange);
        expect(iPv6CidrRanges[0].isEquals(expectedValue[0])).toBe(true);
        expect(iPv6CidrRanges[1].isEquals(expectedValue[1])).toBe(true);
    });
    it('should split IP range correctly', function () {
        var ipv6CidrRange = new src_3.IPv6CidrRange(new src_1.IPv6("2001:db8::"), new src_2.IPv6Prefix(47));
        var splitRanges = ipv6CidrRange.split();
        var firstRange = splitRanges[0];
        var secondRange = splitRanges[1];
        expect(firstRange.toCidrString()).toBe("2001:db8:0:0:0:0:0:0/48");
        expect(secondRange.toCidrString()).toBe("2001:db8:1:0:0:0:0:0/48");
    });
    it('should tell if there is a next adjacent range', function () {
        var firstRange = new src_3.IPv6CidrRange(new src_1.IPv6("0:0:0:0:0:0:0:0"), new src_2.IPv6Prefix(1));
        var secondRange = new src_3.IPv6CidrRange(new src_1.IPv6("2001:db8:0:0:0:0:0:0"), new src_2.IPv6Prefix(1));
        var thirdRange = new src_3.IPv6CidrRange(new src_1.IPv6("c000:0:0:0:0:0:0:0"), new src_2.IPv6Prefix(2));
        var fourthRange = new src_3.IPv6CidrRange(new src_1.IPv6("ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff"), new src_2.IPv6Prefix(2));
        expect(firstRange.hasNextRange()).toBe(true);
        expect(secondRange.hasNextRange()).toBe(true);
        expect(thirdRange.hasNextRange()).toBe(false);
        expect(fourthRange.hasNextRange()).toBe(false);
    });
    it('should tell if there is a previous adjacent range', function () {
        var firstRange = new src_3.IPv6CidrRange(new src_1.IPv6("0:0:0:0:0:0:0:0"), new src_2.IPv6Prefix(1));
        var secondRange = new src_3.IPv6CidrRange(new src_1.IPv6("7fff:ffff:ffff:ffff:ffff:ffff:ffff:ffff"), new src_2.IPv6Prefix(1));
        var thirdRange = new src_3.IPv6CidrRange(new src_1.IPv6("8000:0:0:0:0:0:0:0"), new src_2.IPv6Prefix(1));
        var fourthRange = new src_3.IPv6CidrRange(new src_1.IPv6("ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff"), new src_2.IPv6Prefix(1));
        expect(firstRange.hasPreviousRange()).toBe(false);
        expect(secondRange.hasPreviousRange()).toBe(false);
        expect(thirdRange.hasPreviousRange()).toBe(true);
        expect(fourthRange.hasPreviousRange()).toBe(true);
    });
    it('should return the next adjacent range', function () {
        expect(src_3.IPv6CidrRange.fromCidr("c000:0:0:1:0:0:0:0/64").nextRange()).toEqual(src_3.IPv6CidrRange.fromCidr("c000:0:0:2:0:0:0:0/64"));
    });
    it('should return the previous adjacent range', function () {
        expect(src_3.IPv6CidrRange.fromCidr("c000:0:0:2:0:0:0:0/64").previousRange()).toEqual(src_3.IPv6CidrRange.fromCidr("c000:0:0:1:0:0:0:0/64"));
    });
});
//# sourceMappingURL=IPv6CidrRangeTest.js.map