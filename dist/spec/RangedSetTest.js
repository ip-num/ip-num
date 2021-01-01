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
Object.defineProperty(exports, "__esModule", { value: true });
var src_1 = require("../src");
var bigInt = require("big-integer");
describe('RangedSet: ', function () {
    it("create from single IPv4", function () {
        var singleton = src_1.RangedSet.fromSingleIP(new src_1.IPv4("0.0.0.254"));
        expect(singleton.getSize().valueOf()).toBe(1);
        expect(singleton.getFirst().toString()).toBe("0.0.0.254");
        expect(singleton.getLast().toString()).toBe("0.0.0.254");
    });
    it("create from range string", function () {
        var rangedSet = src_1.RangedSet.fromRangeString("127.0.0.0-127.0.0.255");
        expect(rangedSet.getFirst().toString()).toEqual("127.0.0.0");
        expect(rangedSet.getLast().toString()).toEqual("127.0.0.255");
    });
    it("create from range string with spaces", function () {
        var rangedSet = src_1.RangedSet.fromRangeString("127.0.0.0 - 127.0.0.255");
        expect(rangedSet.getFirst().toString()).toEqual("127.0.0.0");
        expect(rangedSet.getLast().toString()).toEqual("127.0.0.255");
    });
    it("throw if create string is not well formed I", function () {
        expect(function () {
            var rangedSet = src_1.RangedSet.fromRangeString("127.0.0.0127.0.0.255");
        }).toThrowError(Error, "Argument should be in the format firstip-lastip");
    });
    it("throw if create string is not well formed II", function () {
        expect(function () {
            var rangedSet = src_1.RangedSet.fromRangeString("127.0.0.0--127.0.0.255");
        }).toThrowError(Error, "Argument should be in the format firstip-lastip");
    });
    it("throw if create string is not well formed III", function () {
        expect(function () {
            var rangedSet = src_1.RangedSet.fromRangeString("127.0.0-127.0.0");
        }).toThrowError(Error, "First IP and Last IP should be valid and same type");
    });
    it("throw if create string is not well formed IV", function () {
        expect(function () {
            var rangedSet = src_1.RangedSet.fromRangeString("127.0.0.0-2001:db8:0:ffff:ffff:ffff:ffff:ffff");
        }).toThrowError(Error, "First IP and Last IP should be valid and same type");
    });
    it("create from single IPv6", function () {
        var singleton = src_1.RangedSet.fromSingleIP(new src_1.IPv6("2001:db8:0:ffff:ffff:ffff:ffff:ffff"));
        expect(singleton.getSize().valueOf()).toBe(1);
        expect(singleton.getFirst().toString()).toBe("2001:db8:0:ffff:ffff:ffff:ffff:ffff");
        expect(singleton.getLast().toString()).toBe("2001:db8:0:ffff:ffff:ffff:ffff:ffff");
    });
    it("test for of", function () {
        var e_1, _a;
        var range = new src_1.RangedSet(new src_1.IPv4("0.0.0.254"), new src_1.IPv4("0.0.1.2"));
        var index = 0;
        var expected = ["0.0.0.254", "0.0.0.255", "0.0.1.0", "0.0.1.1", "0.0.1.2"];
        try {
            for (var range_1 = __values(range), range_1_1 = range_1.next(); !range_1_1.done; range_1_1 = range_1.next()) {
                var ip = range_1_1.value;
                expect(ip.toString()).toBe(expected[index]);
                index++;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (range_1_1 && !range_1_1.done && (_a = range_1.return)) _a.call(range_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    });
    it('take without count', function () {
        var e_2, _a;
        var range = new src_1.RangedSet(new src_1.IPv4("0.0.0.254"), new src_1.IPv4("0.0.1.2"));
        var index = 0;
        var expected = ["0.0.0.254", "0.0.0.255", "0.0.1.0", "0.0.1.1", "0.0.1.2"];
        try {
            for (var _b = __values(range.take()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var ip = _c.value;
                expect(ip.toString()).toBe(expected[index]);
                index++;
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
    });
    it('take with count', function () {
        var e_3, _a;
        var range = new src_1.RangedSet(new src_1.IPv4("0.0.0.0"), new src_1.IPv4("255.255.255.255"));
        var index = 0;
        var expected = ["0.0.0.0", "0.0.0.1", "0.0.0.2", "0.0.0.3", "0.0.0.4"];
        try {
            for (var _b = __values(range.take(5)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var ip = _c.value;
                expect(ip.toString()).toBe(expected[index]);
                index++;
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
    });
    it("fromCidr static constructor for IPv4", function () {
        var range = src_1.RangedSet
            .fromCidrRange(new src_1.IPv4CidrRange(src_1.IPv4.fromDecimalDottedString("127.0.0.0"), src_1.IPv4Prefix.fromNumber(24)));
        expect(range.getFirst().toString()).toBe("127.0.0.0");
        expect(range.getLast().toString()).toBe("127.0.0.255");
    });
    it("fromCidr static constructor for IPv6", function () {
        var ipv6CidrRange = new src_1.IPv6CidrRange(new src_1.IPv6("2001:db8::"), new src_1.IPv6Prefix(48));
        var range = src_1.RangedSet
            .fromCidrRange(ipv6CidrRange);
        expect(range.getFirst().toString()).toEqual("2001:db8:0:0:0:0:0:0");
        expect(range.getLast().toString()).toEqual("2001:db8:0:ffff:ffff:ffff:ffff:ffff");
    });
    it("should perform equality check, true", function () {
        var firstRange = new src_1.RangedSet(new src_1.IPv4("0.0.0.254"), new src_1.IPv4("0.0.1.2"));
        var secondRange = new src_1.RangedSet(new src_1.IPv4("0.0.0.254"), new src_1.IPv4("0.0.1.2"));
        expect(firstRange.isEquals(secondRange)).toBe(true);
    });
    it("should perform equality check, false", function () {
        var firstRange = new src_1.RangedSet(new src_1.IPv4("0.0.0.253"), new src_1.IPv4("0.0.1.2"));
        var secondRange = new src_1.RangedSet(new src_1.IPv4("0.0.0.254"), new src_1.IPv4("0.0.1.2"));
        expect(firstRange.isEquals(secondRange)).toBe(false);
    });
    it("should perform union of ranges: equal ranges", function () {
        var firstRange = new src_1.RangedSet(new src_1.IPv4("0.0.0.254"), new src_1.IPv4("0.0.1.2"));
        var secondRange = new src_1.RangedSet(new src_1.IPv4("0.0.0.254"), new src_1.IPv4("0.0.1.2"));
        var union = firstRange.union(secondRange);
        expect(union.isEquals(firstRange)).toBe(true);
    });
    it("should perform union of ranges: overlap range left", function () {
        var firstRange = new src_1.RangedSet(new src_1.IPv4("0.0.0.0"), new src_1.IPv4("0.0.0.2"));
        var secondRange = new src_1.RangedSet(new src_1.IPv4("0.0.0.1"), new src_1.IPv4("0.0.0.3"));
        var expected = new src_1.RangedSet(new src_1.IPv4("0.0.0.0"), new src_1.IPv4("0.0.0.3"));
        var union = firstRange.union(secondRange);
        expect(union.isEquals(expected)).toBe(true);
    });
    it("should perform union of ranges: overlap range right", function () {
        var firstRange = new src_1.RangedSet(new src_1.IPv4("0.0.0.1"), new src_1.IPv4("0.0.0.3"));
        var secondRange = new src_1.RangedSet(new src_1.IPv4("0.0.0.0"), new src_1.IPv4("0.0.0.2"));
        var expected = new src_1.RangedSet(new src_1.IPv4("0.0.0.0"), new src_1.IPv4("0.0.0.3"));
        var union = firstRange.union(secondRange);
        expect(union.isEquals(expected)).toBe(true);
    });
    it("should perform union of ranges: contains the other", function () {
        var firstRange = new src_1.RangedSet(new src_1.IPv4("0.0.0.1"), new src_1.IPv4("0.0.0.5"));
        var secondRange = new src_1.RangedSet(new src_1.IPv4("0.0.0.2"), new src_1.IPv4("0.0.0.4"));
        var expected = new src_1.RangedSet(new src_1.IPv4("0.0.0.1"), new src_1.IPv4("0.0.0.5"));
        var union = firstRange.union(secondRange);
        expect(union.isEquals(expected)).toBe(true);
    });
    it("should perform union of ranges: contains by the other", function () {
        var firstRange = new src_1.RangedSet(new src_1.IPv4("0.0.0.2"), new src_1.IPv4("0.0.0.4"));
        var secondRange = new src_1.RangedSet(new src_1.IPv4("0.0.0.1"), new src_1.IPv4("0.0.0.5"));
        var expected = new src_1.RangedSet(new src_1.IPv4("0.0.0.1"), new src_1.IPv4("0.0.0.5"));
        var union = firstRange.union(secondRange);
        expect(union.isEquals(expected)).toBe(true);
    });
    it("should realise intersecting range does not contains each other", function () {
        var oneToTen = new src_1.RangedSet(new src_1.IPv4("0.0.0.1"), new src_1.IPv4("0.0.0.10"));
        var fiveToFifteen = new src_1.RangedSet(new src_1.IPv4("0.0.0.5"), new src_1.IPv4("0.0.0.15"));
        expect(oneToTen.contains(fiveToFifteen)).toBe(false);
    });
    it("should realise intersecting range are not inside each other", function () {
        var oneToTen = new src_1.RangedSet(new src_1.IPv4("0.0.0.1"), new src_1.IPv4("0.0.0.10"));
        var fiveToFifteen = new src_1.RangedSet(new src_1.IPv4("0.0.0.5"), new src_1.IPv4("0.0.0.15"));
        expect(oneToTen.inside(fiveToFifteen)).toBe(false);
    });
    it("should realise smaller range are inside larger containing  range", function () {
        var oneToTen = new src_1.RangedSet(new src_1.IPv4("0.0.0.1"), new src_1.IPv4("0.0.0.10"));
        var zeroToTwenty = new src_1.RangedSet(new src_1.IPv4("0.0.0.0"), new src_1.IPv4("0.0.0.20"));
        expect(oneToTen.inside(zeroToTwenty)).toBe(true);
    });
    it("should realise larger range contains smaller range", function () {
        var oneToTen = new src_1.RangedSet(new src_1.IPv4("0.0.0.1"), new src_1.IPv4("0.0.0.10"));
        var zeroToTwenty = new src_1.RangedSet(new src_1.IPv4("0.0.0.0"), new src_1.IPv4("0.0.0.20"));
        expect(zeroToTwenty.contains(oneToTen)).toBe(true);
    });
    it("should preprend", function () {
        var firstRange = new src_1.RangedSet(new src_1.IPv4("0.0.0.5"), new src_1.IPv4("0.0.0.10"));
        var secondRange = new src_1.RangedSet(new src_1.IPv4("0.0.0.1"), new src_1.IPv4("0.0.0.4"));
        var extendedRange = firstRange.prepend(secondRange);
        expect(extendedRange.toRangeString()).toEqual("0.0.0.1-0.0.0.10");
    });
    it("should throw if ranges not adjacent when preprending", function () {
        var firstRange = new src_1.RangedSet(new src_1.IPv4("0.0.0.5"), new src_1.IPv4("0.0.0.10"));
        var secondRange = new src_1.RangedSet(new src_1.IPv4("0.0.0.1"), new src_1.IPv4("0.0.0.5"));
        expect(function () {
            var extendedRange = firstRange.prepend(secondRange);
        }).toThrowError(Error);
        var firstRange = new src_1.RangedSet(new src_1.IPv4("0.0.0.7"), new src_1.IPv4("0.0.0.10"));
        var secondRange = new src_1.RangedSet(new src_1.IPv4("0.0.0.1"), new src_1.IPv4("0.0.0.5"));
        expect(function () {
            var extendedRange = firstRange.prepend(secondRange);
        }).toThrowError(Error);
    });
    it("should append", function () {
        var firstRange = new src_1.RangedSet(new src_1.IPv4("0.0.0.1"), new src_1.IPv4("0.0.0.4"));
        var secondRange = new src_1.RangedSet(new src_1.IPv4("0.0.0.5"), new src_1.IPv4("0.0.0.10"));
        var extendedRange = firstRange.append(secondRange);
        expect(extendedRange.toRangeString()).toEqual("0.0.0.1-0.0.0.10");
    });
    it("should throw if ranges not adjacent when appending", function () {
        var firstRange = new src_1.RangedSet(new src_1.IPv4("0.0.0.1"), new src_1.IPv4("0.0.0.5"));
        var secondRange = new src_1.RangedSet(new src_1.IPv4("0.0.0.5"), new src_1.IPv4("0.0.0.10"));
        expect(function () {
            var extendedRange = firstRange.append(secondRange);
        }).toThrowError(Error);
        var firstRange = new src_1.RangedSet(new src_1.IPv4("0.0.0.1"), new src_1.IPv4("0.0.0.3"));
        var secondRange = new src_1.RangedSet(new src_1.IPv4("0.0.0.9"), new src_1.IPv4("0.0.0.10"));
        expect(function () {
            var extendedRange = firstRange.append(secondRange);
        }).toThrowError(Error);
    });
    it('should convert range to Cidr range IPv4', function () {
        var convertedRange = new src_1.RangedSet(src_1.IPv4.fromDecimalDottedString("127.0.0.0"), src_1.IPv4.fromDecimalDottedString("127.0.0.255")).toCidrRange();
        expect(convertedRange.toCidrString()).toEqual("127.0.0.0/24");
    });
    it('should convert range to Cidr range IPv6', function () {
        var convertedRange = new src_1.RangedSet(src_1.IPv6.fromHexadecimalString("2620:0:0:0:0:0:0:0"), src_1.IPv6.fromHexadecimalString("2620:0:ffff:ffff:ffff:ffff:ffff:ffff")).toCidrRange();
        expect(convertedRange.toCidrString()).toEqual("2620:0:0:0:0:0:0:0/32");
    });
    it('should not convert range to IPv4 Cidr range', function () {
        expect(function () {
            new src_1.RangedSet(src_1.IPv4.fromDecimalDottedString("127.0.0.1"), src_1.IPv4.fromDecimalDottedString("127.0.1.0")).toCidrRange();
        }).toThrowError(Error, "Range cannot be converted to CIDR");
    });
    it('should not convert range to IPv6 Cidr range', function () {
        expect(function () {
            new src_1.RangedSet(src_1.IPv6.fromHexadecimalString("2620:0:0:0:0:0:0:1"), src_1.IPv6.fromHexadecimalString("2620:0:0:0:0:0:1:0")).toCidrRange();
        }).toThrowError(Error, "Range cannot be converted to CIDR");
    });
    it('should not convert range to IPv4 Cidr range', function () {
        expect(function () {
            new src_1.RangedSet(src_1.IPv4.fromDecimalDottedString("127.0.0.1"), src_1.IPv4.fromDecimalDottedString("127.0.0.255")).toCidrRange();
        }).toThrowError(Error, "Given size can't be created via cidr prefix");
    });
    it('should not convert range to IPv6 Cidr range', function () {
        expect(function () {
            new src_1.RangedSet(src_1.IPv6.fromHexadecimalString("2620:0:0:0:0:0:0:1"), src_1.IPv6.fromHexadecimalString("2620:0:ffff:ffff:ffff:ffff:ffff:eeee")).toCidrRange();
        }).toThrowError(Error, "Given size can't be created via cidr prefix");
    });
    it("should throw error when constructing with first grater than last", function () {
        expect(function () {
            new src_1.RangedSet(src_1.IPv6.fromHexadecimalString("2620:0:ffff:ffff:ffff:ffff:ffff:eeee"), src_1.IPv6.fromHexadecimalString("2620:0:0:0:0:0:0:1"));
        }).toThrowError(Error);
    });
    describe("Make Range", function () {
        describe("IPv4", function () {
            it("should pick whole range as sub range", function () {
                var originalRange = new src_1.RangedSet(src_1.IPv4.fromDecimalDottedString("127.0.0.0"), src_1.IPv4.fromDecimalDottedString("127.0.0.255"));
                expect(function () {
                    var subRange = originalRange.takeSubRange(bigInt.zero, bigInt(0));
                }).toThrowError(Error, "Sub range cannot be zero");
            });
            it("should pick whole range as sub range", function () {
                var originalRange = new src_1.RangedSet(src_1.IPv4.fromDecimalDottedString("127.0.0.0"), src_1.IPv4.fromDecimalDottedString("127.0.0.255"));
                var subRange = originalRange.takeSubRange(bigInt.zero, bigInt(256));
                expect(subRange.toRangeString()).toEqual("127.0.0.0-127.0.0.255");
            });
            it("should pick whole range with offset 1", function () {
                var originalRange = new src_1.RangedSet(src_1.IPv4.fromDecimalDottedString("127.0.0.0"), src_1.IPv4.fromDecimalDottedString("127.0.0.255"));
                var subRange = originalRange.takeSubRange(bigInt.one, bigInt(255));
                expect(subRange.toRangeString()).toEqual("127.0.0.1-127.0.0.255");
            });
            it("should throw an exception if size is larger than range", function () {
                var originalRange = new src_1.RangedSet(src_1.IPv4.fromDecimalDottedString("127.0.0.0"), src_1.IPv4.fromDecimalDottedString("127.0.0.255"));
                expect(function () {
                    var subRange = originalRange.takeSubRange(bigInt.zero, bigInt(257));
                }).toThrowError(Error, "Requested range is greater than what can be taken");
            });
            it("should throw an exception if size is larger than range due to offset", function () {
                var originalRange = new src_1.RangedSet(src_1.IPv4.fromDecimalDottedString("127.0.0.0"), src_1.IPv4.fromDecimalDottedString("127.0.0.255"));
                expect(function () {
                    var subRange = originalRange.takeSubRange(bigInt(4), bigInt(256));
                }).toThrowError(Error, "Requested range is greater than what can be taken");
            });
        });
        describe("IPv6", function () {
            it("should pick whole range as sub range", function () {
                var originalRange = new src_1.RangedSet(src_1.IPv6.fromHexadecimalString("2001:d00:0:0:0:0:0:0"), src_1.IPv6.fromHexadecimalString("2001:dff:ffff:ffff:ffff:ffff:ffff:ffff"));
                expect(function () {
                    var subRange = originalRange.takeSubRange(bigInt.zero, bigInt(0));
                }).toThrowError(Error, "Sub range cannot be zero");
            });
            it("should pick whole range as sub range", function () {
                var originalRange = new src_1.RangedSet(src_1.IPv6.fromHexadecimalString("2001:d00:0:0:0:0:0:0"), src_1.IPv6.fromHexadecimalString("2001:dff:ffff:ffff:ffff:ffff:ffff:ffff"));
                var subRange = originalRange.takeSubRange(bigInt.zero, bigInt("20282409603651670423947251286016"));
                expect(subRange.toRangeString()).toEqual("2001:d00:0:0:0:0:0:0-2001:dff:ffff:ffff:ffff:ffff:ffff:ffff");
            });
            it("should pick whole range with offset 1", function () {
                var originalRange = new src_1.RangedSet(src_1.IPv6.fromHexadecimalString("2001:d00:0:0:0:0:0:0"), src_1.IPv6.fromHexadecimalString("2001:dff:ffff:ffff:ffff:ffff:ffff:ffff"));
                var subRange = originalRange.takeSubRange(bigInt.one, bigInt("20282409603651670423947251286015"));
                expect(subRange.toRangeString()).toEqual("2001:d00:0:0:0:0:0:1-2001:dff:ffff:ffff:ffff:ffff:ffff:ffff");
            });
            it("should throw an exception if size is larger than range", function () {
                var originalRange = new src_1.RangedSet(src_1.IPv6.fromHexadecimalString("2001:d00:0:0:0:0:0:0"), src_1.IPv6.fromHexadecimalString("2001:dff:ffff:ffff:ffff:ffff:ffff:ffff"));
                expect(function () {
                    var subRange = originalRange.takeSubRange(bigInt.zero, bigInt("20282409603651670423947251286018"));
                }).toThrowError(Error, "Requested range is greater than what can be taken");
            });
            it("should throw an exception if size is larger than range due to offset", function () {
                var originalRange = new src_1.RangedSet(src_1.IPv6.fromHexadecimalString("2001:d00:0:0:0:0:0:0"), src_1.IPv6.fromHexadecimalString("2001:dff:ffff:ffff:ffff:ffff:ffff:ffff"));
                expect(function () {
                    var subRange = originalRange.takeSubRange(bigInt("20282409603651670423947251286018"), bigInt("20282409603651670423947251286018"));
                }).toThrowError(Error, "Requested range is greater than what can be taken");
            });
        });
    });
    describe("Subtract Range", function () {
        describe("IPv4", function () {
            it("it should subtract all", function () {
                var original = new src_1.RangedSet(src_1.IPv4.fromDecimalDottedString("127.0.0.0"), src_1.IPv4.fromDecimalDottedString("127.0.0.255"));
                var toSubtract = new src_1.RangedSet(src_1.IPv4.fromDecimalDottedString("127.0.0.0"), src_1.IPv4.fromDecimalDottedString("127.0.0.255"));
                var result = original.difference(toSubtract);
                expect(result.length).toEqual(0);
            });
            it("it should subtract from beginning", function () {
                var original = new src_1.RangedSet(src_1.IPv4.fromDecimalDottedString("127.0.0.0"), src_1.IPv4.fromDecimalDottedString("127.0.0.255"));
                var toSubtract = new src_1.RangedSet(src_1.IPv4.fromDecimalDottedString("127.0.0.0"), src_1.IPv4.fromDecimalDottedString("127.0.0.3"));
                var result = original.difference(toSubtract);
                expect(result.length).toEqual(1);
                expect(result[0].toRangeString()).toEqual("127.0.0.4-127.0.0.255");
            });
            it("it should subtract up to end", function () {
                var original = new src_1.RangedSet(src_1.IPv4.fromDecimalDottedString("127.0.0.0"), src_1.IPv4.fromDecimalDottedString("127.0.0.255"));
                var toSubtract = new src_1.RangedSet(src_1.IPv4.fromDecimalDottedString("127.0.0.253"), src_1.IPv4.fromDecimalDottedString("127.0.0.255"));
                var result = original.difference(toSubtract);
                expect(result.length).toEqual(1);
                expect(result[0].toRangeString()).toEqual("127.0.0.0-127.0.0.252");
            });
            it("it should subtract from middle", function () {
                var original = new src_1.RangedSet(src_1.IPv4.fromDecimalDottedString("127.0.0.0"), src_1.IPv4.fromDecimalDottedString("127.0.0.255"));
                var toSubtract = new src_1.RangedSet(src_1.IPv4.fromDecimalDottedString("127.0.0.240"), src_1.IPv4.fromDecimalDottedString("127.0.0.250"));
                var result = original.difference(toSubtract);
                expect(result.length).toEqual(2);
                expect(result[0].toRangeString()).toEqual("127.0.0.0-127.0.0.239");
                expect(result[1].toRangeString()).toEqual("127.0.0.251-127.0.0.255");
            });
            describe("Less than test", function () {
                it('should tell if less than if first ip is less', function () {
                    var first = new src_1.RangedSet(src_1.IPv4.fromDecimalDottedString("192.168.0.128"), src_1.IPv4.fromDecimalDottedString("192.168.0.159"));
                    var second = new src_1.RangedSet(src_1.IPv4.fromDecimalDottedString("192.168.0.16"), src_1.IPv4.fromDecimalDottedString("192.168.0.63"));
                    expect(first.isLessThan(second)).toBe(false);
                    expect(second.isLessThan(first)).toBe(true);
                });
                it('should tell if less than based on size if first ip is same', function () {
                    var first = new src_1.RangedSet(src_1.IPv4.fromDecimalDottedString("192.168.0.128"), src_1.IPv4.fromDecimalDottedString("192.168.0.159"));
                    var second = new src_1.RangedSet(src_1.IPv4.fromDecimalDottedString("192.168.0.128"), src_1.IPv4.fromDecimalDottedString("192.168.0.255"));
                    expect(first.isLessThan(second)).toBe(true);
                    expect(second.isLessThan(first)).toBe(false);
                });
                it('should tell if less than when equals', function () {
                    var first = new src_1.RangedSet(src_1.IPv4.fromDecimalDottedString("192.168.0.128"), src_1.IPv4.fromDecimalDottedString("192.168.0.159"));
                    var second = new src_1.RangedSet(src_1.IPv4.fromDecimalDottedString("192.168.0.128"), src_1.IPv4.fromDecimalDottedString("192.168.0.159"));
                    expect(first.isLessThan(second)).toBe(false);
                    expect(second.isLessThan(first)).toBe(false);
                });
            });
            describe("Greater than test", function () {
                it('should tell if less than if first ip is less', function () {
                    var first = new src_1.RangedSet(src_1.IPv4.fromDecimalDottedString("192.168.0.128"), src_1.IPv4.fromDecimalDottedString("192.168.0.159"));
                    var second = new src_1.RangedSet(src_1.IPv4.fromDecimalDottedString("192.168.0.16"), src_1.IPv4.fromDecimalDottedString("192.168.0.63"));
                    expect(first.isGreaterThan(second)).toBe(true);
                    expect(second.isGreaterThan(first)).toBe(false);
                });
                it('should tell if less than based on size if first ip is same', function () {
                    var first = new src_1.RangedSet(src_1.IPv4.fromDecimalDottedString("192.168.0.128"), src_1.IPv4.fromDecimalDottedString("192.168.0.159"));
                    var second = new src_1.RangedSet(src_1.IPv4.fromDecimalDottedString("192.168.0.128"), src_1.IPv4.fromDecimalDottedString("192.168.0.255"));
                    expect(first.isGreaterThan(second)).toBe(false);
                    expect(second.isGreaterThan(first)).toBe(true);
                });
                it('should tell if less than when equals', function () {
                    var first = new src_1.RangedSet(src_1.IPv4.fromDecimalDottedString("192.168.0.128"), src_1.IPv4.fromDecimalDottedString("192.168.0.159"));
                    var second = new src_1.RangedSet(src_1.IPv4.fromDecimalDottedString("192.168.0.128"), src_1.IPv4.fromDecimalDottedString("192.168.0.159"));
                    expect(first.isGreaterThan(second)).toBe(false);
                    expect(second.isGreaterThan(first)).toBe(false);
                });
            });
        });
        describe("IPv6", function () {
            it("create from range string", function () {
                var rangedSet = src_1.RangedSet.fromRangeString("2620:0:0:0:0:0:0:0-2620:0:ffff:ffff:ffff:ffff:ffff:ffff");
                expect(rangedSet.getFirst().toString()).toEqual("2620:0:0:0:0:0:0:0");
                expect(rangedSet.getLast().toString()).toEqual("2620:0:ffff:ffff:ffff:ffff:ffff:ffff");
            });
            it("create from range string with spaces", function () {
                var rangedSet = src_1.RangedSet.fromRangeString("2620:0:0:0:0:0:0:0 - 2620:0:ffff:ffff:ffff:ffff:ffff:ffff");
                expect(rangedSet.getFirst().toString()).toEqual("2620:0:0:0:0:0:0:0");
                expect(rangedSet.getLast().toString()).toEqual("2620:0:ffff:ffff:ffff:ffff:ffff:ffff");
            });
            it("throw if create string is not well formed I", function () {
                expect(function () {
                    var rangedSet = src_1.RangedSet.fromRangeString("2620:0:0:0:0:0:0:02620:0:ffff:ffff:ffff:ffff:ffff:ffff");
                }).toThrowError(Error, "Argument should be in the format firstip-lastip");
            });
            it("throw if create string is not well formed II", function () {
                expect(function () {
                    var rangedSet = src_1.RangedSet.fromRangeString("2620:0:0:0:0:0:0:0 -- 2620:0:ffff:ffff:ffff:ffff:ffff:ffff");
                }).toThrowError(Error, "Argument should be in the format firstip-lastip");
            });
            it("throw if create string is not well formed II", function () {
                expect(function () {
                    var rangedSet = src_1.RangedSet.fromRangeString("2620::::0:0 - 2620:0:ffff:ffff:ffff:ffff:ffff:ffff");
                }).toThrowError(Error, "First IP and Last IP should be valid and same type");
            });
            it("it should subtract all", function () {
                var original = new src_1.RangedSet(src_1.IPv6.fromHexadecimalString("2620:0:0:0:0:0:0:0"), src_1.IPv6.fromHexadecimalString("2620:0:ffff:ffff:ffff:ffff:ffff:ffff"));
                var toSubtract = new src_1.RangedSet(src_1.IPv6.fromHexadecimalString("2620:0:0:0:0:0:0:0"), src_1.IPv6.fromHexadecimalString("2620:0:ffff:ffff:ffff:ffff:ffff:ffff"));
                var result = original.difference(toSubtract);
                expect(result.length).toEqual(0);
            });
            it("it should subtract from beginning", function () {
                var original = new src_1.RangedSet(src_1.IPv6.fromHexadecimalString("2620:0:0:0:0:0:0:0"), src_1.IPv6.fromHexadecimalString("2620:0:ffff:ffff:ffff:ffff:ffff:ffff"));
                var toSubtract = new src_1.RangedSet(src_1.IPv6.fromHexadecimalString("2620:0:0:0:0:0:0:3"), src_1.IPv6.fromHexadecimalString("2620:0:ffff:ffff:ffff:ffff:ffff:ffff"));
                var result = original.difference(toSubtract);
                expect(result.length).toEqual(1);
                expect(result[0].toRangeString()).toEqual("2620:0:0:0:0:0:0:0-2620:0:0:0:0:0:0:2");
            });
            it("it should subtract up to end", function () {
                var original = new src_1.RangedSet(src_1.IPv6.fromHexadecimalString("2620:0:0:0:0:0:0:0"), src_1.IPv6.fromHexadecimalString("2620:0:ffff:ffff:ffff:ffff:ffff:ffff"));
                var toSubtract = new src_1.RangedSet(src_1.IPv6.fromHexadecimalString("2620:0:0:0:0:0:0:bbbb"), src_1.IPv6.fromHexadecimalString("2620:0:ffff:ffff:ffff:ffff:ffff:ffff"));
                var result = original.difference(toSubtract);
                expect(result.length).toEqual(1);
                expect(result[0].toRangeString()).toEqual("2620:0:0:0:0:0:0:0-2620:0:0:0:0:0:0:bbba");
            });
            it("it should subtract from middle", function () {
                var original = new src_1.RangedSet(src_1.IPv6.fromHexadecimalString("2620:0:0:0:0:0:0:0"), src_1.IPv6.fromHexadecimalString("2620:0:ffff:ffff:ffff:ffff:ffff:ffff"));
                var toSubtract = new src_1.RangedSet(src_1.IPv6.fromHexadecimalString("2620:0:0:0:0:0:0:200"), src_1.IPv6.fromHexadecimalString("2620:0:0:0:0:0:0:400"));
                var result = original.difference(toSubtract);
                expect(result.length).toEqual(2);
                expect(result[0].toRangeString()).toEqual("2620:0:0:0:0:0:0:0-2620:0:0:0:0:0:0:1ff");
                expect(result[1].toRangeString()).toEqual("2620:0:0:0:0:0:0:401-2620:0:ffff:ffff:ffff:ffff:ffff:ffff");
            });
            describe("Less than test", function () {
                it('should tell if less than if first ip is less', function () {
                    var first = new src_1.RangedSet(src_1.IPv6.fromHexadecimalString("3620:0:0:0:0:0:0:0"), src_1.IPv6.fromHexadecimalString("3620:0:ffff:ffff:ffff:ffff:ffff:ffff"));
                    var second = new src_1.RangedSet(src_1.IPv6.fromHexadecimalString("2620:0:0:0:0:0:0:0"), src_1.IPv6.fromHexadecimalString("2620:0:ffff:ffff:ffff:ffff:ffff:ffff"));
                    expect(first.isLessThan(second)).toBe(false);
                    expect(second.isLessThan(first)).toBe(true);
                });
                it('should tell if less than based on size if first ip is same', function () {
                    var first = new src_1.RangedSet(src_1.IPv6.fromHexadecimalString("3620:0:0:0:0:0:0:0"), src_1.IPv6.fromHexadecimalString("3620:0:0:0:0:0:0:ffff"));
                    var second = new src_1.RangedSet(src_1.IPv6.fromHexadecimalString("3620:0:0:0:0:0:0:0"), src_1.IPv6.fromHexadecimalString("3620:0:ffff:ffff:ffff:ffff:ffff:ffff"));
                    expect(first.isLessThan(second)).toBe(true);
                    expect(second.isLessThan(first)).toBe(false);
                });
                it('should tell if less than when equals', function () {
                    var first = new src_1.RangedSet(src_1.IPv6.fromHexadecimalString("3620:0:0:0:0:0:0:0"), src_1.IPv6.fromHexadecimalString("3620:0:ffff:ffff:ffff:ffff:ffff:ffff"));
                    var second = new src_1.RangedSet(src_1.IPv6.fromHexadecimalString("3620:0:0:0:0:0:0:0"), src_1.IPv6.fromHexadecimalString("3620:0:ffff:ffff:ffff:ffff:ffff:ffff"));
                    expect(first.isLessThan(second)).toBe(false);
                    expect(second.isLessThan(first)).toBe(false);
                });
            });
            describe("Greater than test", function () {
                it('should tell if less than if first ip is less', function () {
                    var first = new src_1.RangedSet(src_1.IPv6.fromHexadecimalString("3620:0:0:0:0:0:0:0"), src_1.IPv6.fromHexadecimalString("3620:0:ffff:ffff:ffff:ffff:ffff:ffff"));
                    var second = new src_1.RangedSet(src_1.IPv6.fromHexadecimalString("2620:0:0:0:0:0:0:0"), src_1.IPv6.fromHexadecimalString("2620:0:ffff:ffff:ffff:ffff:ffff:ffff"));
                    expect(first.isGreaterThan(second)).toBe(true);
                    expect(second.isGreaterThan(first)).toBe(false);
                });
                it('should tell if less than based on size if first ip is same', function () {
                    var first = new src_1.RangedSet(src_1.IPv6.fromHexadecimalString("3620:0:0:0:0:0:0:0"), src_1.IPv6.fromHexadecimalString("3620:0:0:0:0:0:0:ffff"));
                    var second = new src_1.RangedSet(src_1.IPv6.fromHexadecimalString("3620:0:0:0:0:0:0:0"), src_1.IPv6.fromHexadecimalString("3620:0:ffff:ffff:ffff:ffff:ffff:ffff"));
                    expect(first.isGreaterThan(second)).toBe(false);
                    expect(second.isGreaterThan(first)).toBe(true);
                });
                it('should tell if less than when equals', function () {
                    var first = new src_1.RangedSet(src_1.IPv6.fromHexadecimalString("3620:0:0:0:0:0:0:0"), src_1.IPv6.fromHexadecimalString("3620:0:ffff:ffff:ffff:ffff:ffff:ffff"));
                    var second = new src_1.RangedSet(src_1.IPv6.fromHexadecimalString("3620:0:0:0:0:0:0:0"), src_1.IPv6.fromHexadecimalString("3620:0:ffff:ffff:ffff:ffff:ffff:ffff"));
                    expect(first.isGreaterThan(second)).toBe(false);
                    expect(second.isGreaterThan(first)).toBe(false);
                });
            });
        });
    });
});
//# sourceMappingURL=RangedSetTest.js.map