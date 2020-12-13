"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var src_1 = require("../src");
var IPPool_1 = require("../src/IPPool");
var bigInt = require("big-integer");
describe('Pool', function () {
    describe('IPV4', function () {
        it('Should create from IP Numbers', function () {
            var pool = IPPool_1.Pool
                .fromIPNumbers([src_1.IPv4.fromDecimalDottedString("10.0.0.1"), src_1.IPv4.fromDecimalDottedString("10.0.0.2")]);
            var ranges = pool.getRanges();
            expect(ranges[0].toCidrRange().toCidrString()).toEqual("10.0.0.1/32");
            expect(ranges[1].toCidrRange().toCidrString()).toEqual("10.0.0.2/32");
        });
        it('Should create from CIDR', function () {
            var pool = IPPool_1.Pool
                .fromCidrRanges([src_1.IPv4CidrRange.fromCidr("192.168.178.0/24"), src_1.IPv4CidrRange.fromCidr("10.0.0.0/24")]);
            var ranges = pool.getRanges();
            expect(ranges[1].toCidrRange().toCidrString()).toBe("192.168.178.0/24");
            expect(ranges[0].toCidrRange().toCidrString()).toBe("10.0.0.0/24");
        });
        it('should fully aggregate', function () {
            var arrays = new Array();
            arrays.push(src_1.RangedSet.fromCidrRange(src_1.IPv4CidrRange.fromCidr("192.168.0.0/26")));
            arrays.push(src_1.RangedSet.fromCidrRange(src_1.IPv4CidrRange.fromCidr("192.168.0.64/26")));
            arrays.push(src_1.RangedSet.fromCidrRange(src_1.IPv4CidrRange.fromCidr("192.168.0.128/27")));
            arrays.push(src_1.RangedSet.fromCidrRange(src_1.IPv4CidrRange.fromCidr("192.168.0.160/27")));
            arrays.push(src_1.RangedSet.fromCidrRange(src_1.IPv4CidrRange.fromCidr("192.168.0.192/26")));
            var pool = IPPool_1.Pool.fromRangeSet(arrays);
            var aggregatedPool = pool.aggregate();
            expect(aggregatedPool.getRanges()[0].toRangeString()).toEqual("192.168.0.0-192.168.0.255");
            expect(aggregatedPool.getRanges().length).toEqual(1);
        });
        it('should aggregate with hole', function () {
            var arrays = new Array();
            arrays.push(src_1.RangedSet.fromCidrRange(src_1.IPv4CidrRange.fromCidr("192.168.0.0/26")));
            arrays.push(src_1.RangedSet.fromCidrRange(src_1.IPv4CidrRange.fromCidr("192.168.0.64/26")));
            // arrays.push(Range.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.128/27"))); - hole
            arrays.push(src_1.RangedSet.fromCidrRange(src_1.IPv4CidrRange.fromCidr("192.168.0.160/27")));
            arrays.push(src_1.RangedSet.fromCidrRange(src_1.IPv4CidrRange.fromCidr("192.168.0.192/26")));
            var pool = IPPool_1.Pool.fromRangeSet(arrays);
            var aggregatedPool = pool.aggregate();
            // 192.168.0.0/26 with 192.168.0.64/26
            expect(aggregatedPool.getRanges()[0].toRangeString()).toEqual("192.168.0.0-192.168.0.127");
            expect(aggregatedPool.getRanges()[1].toRangeString()).toEqual("192.168.0.160-192.168.0.191");
            expect(aggregatedPool.getRanges()[2].toRangeString()).toEqual("192.168.0.192-192.168.0.255");
            expect(aggregatedPool.getRanges().length).toEqual(3);
        });
        it('should aggregate with the whole space', function () {
            var arrays = new Array();
            arrays.push(src_1.RangedSet.fromCidrRange(src_1.IPv4CidrRange.fromCidr("0.0.0.0/0")));
            arrays.push(src_1.RangedSet.fromCidrRange(src_1.IPv4CidrRange.fromCidr("192.168.0.0/26")));
            arrays.push(src_1.RangedSet.fromCidrRange(src_1.IPv4CidrRange.fromCidr("192.168.0.64/26")));
            // arrays.push(Range.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.128/27"))); - hole
            arrays.push(src_1.RangedSet.fromCidrRange(src_1.IPv4CidrRange.fromCidr("192.168.0.160/27")));
            arrays.push(src_1.RangedSet.fromCidrRange(src_1.IPv4CidrRange.fromCidr("192.168.0.192/26")));
            var pool = IPPool_1.Pool.fromRangeSet(arrays);
            var aggregatedPool = pool.aggregate();
            expect(aggregatedPool.getRanges()[0].toRangeString()).toEqual("0.0.0.0-255.255.255.255");
            expect(aggregatedPool.getRanges().length).toEqual(1);
        });
        it("it should reset pool with given ranges", function () {
            var arrays = new Array();
            arrays.push(src_1.RangedSet.fromCidrRange(src_1.IPv4CidrRange.fromCidr("192.168.0.0/26")));
            var pool = IPPool_1.Pool.fromRangeSet(arrays);
            expect(pool.getRanges()[0].toRangeString()).toEqual("192.168.0.0-192.168.0.63");
            pool.resetWith(new Array(src_1.RangedSet.fromCidrRange(src_1.IPv4CidrRange.fromCidr("192.168.0.160/27"))));
            expect(pool.getRanges()[0].toRangeString()).toEqual("192.168.0.160-192.168.0.191");
        });
        it("it should clear pool", function () {
            var arrays = new Array();
            arrays.push(src_1.RangedSet.fromCidrRange(src_1.IPv4CidrRange.fromCidr("192.168.0.0/26")));
            var pool = IPPool_1.Pool.fromRangeSet(arrays);
            expect(pool.getRanges()[0].toRangeString()).toEqual("192.168.0.0-192.168.0.63");
            pool.clear();
            expect(pool.getRanges().length).toEqual(0);
        });
        it("it should remove range from pool", function () {
            var arrays = new Array();
            arrays.push(src_1.RangedSet.fromCidrRange(src_1.IPv4CidrRange.fromCidr("192.168.0.0/26")));
            var rangeToRemove = src_1.RangedSet.fromCidrRange(src_1.IPv4CidrRange.fromCidr("192.168.0.64/26"));
            arrays.push(rangeToRemove);
            var pool = IPPool_1.Pool.fromRangeSet(arrays);
            expect(pool.getRanges().length).toEqual(2);
            pool.removeExact(rangeToRemove);
            expect(pool.getRanges().length).toEqual(1);
            expect(pool.getRanges()[0].toCidrRange().toCidrString()).toEqual("192.168.0.0/26");
        });
        it("it should not remove range if not in the pool", function () {
            var arrays = new Array();
            arrays.push(src_1.RangedSet.fromCidrRange(src_1.IPv4CidrRange.fromCidr("192.168.0.0/26")));
            arrays.push(src_1.RangedSet.fromCidrRange(src_1.IPv4CidrRange.fromCidr("192.168.0.64/26")));
            // not added to the pool
            var rangeToRemove = src_1.RangedSet.fromCidrRange(src_1.IPv4CidrRange.fromCidr("192.168.0.128/27"));
            var pool = IPPool_1.Pool.fromRangeSet(arrays);
            expect(pool.getRanges().length).toEqual(2);
            pool.removeExact(rangeToRemove);
            expect(pool.getRanges().length).toEqual(2);
            expect(pool.getRanges()[0].toCidrRange().toCidrString()).toEqual("192.168.0.0/26");
            expect(pool.getRanges()[1].toCidrRange().toCidrString()).toEqual("192.168.0.64/26");
        });
        it("it should not remove range if range is sub range in the pool", function () {
            var arrays = new Array();
            arrays.push(src_1.RangedSet.fromCidrRange(src_1.IPv4CidrRange.fromCidr("192.168.0.0/26")));
            arrays.push(src_1.RangedSet.fromCidrRange(src_1.IPv4CidrRange.fromCidr("192.168.0.64/26")));
            // not added to the pool
            var rangeToRemove = src_1.RangedSet.fromCidrRange(src_1.IPv4CidrRange.fromCidr("192.168.0.96/27"));
            var pool = IPPool_1.Pool.fromRangeSet(arrays);
            expect(pool.getRanges().length).toEqual(2);
            pool.removeExact(rangeToRemove);
            expect(pool.getRanges().length).toEqual(2);
            expect(pool.getRanges()[0].toCidrRange().toCidrString()).toEqual("192.168.0.0/26");
            expect(pool.getRanges()[1].toCidrRange().toCidrString()).toEqual("192.168.0.64/26");
        });
        it("it should return the size of pool", function () {
            var arrays = new Array();
            arrays.push(src_1.RangedSet.fromCidrRange(src_1.IPv4CidrRange.fromCidr("192.168.0.0/26")));
            arrays.push(src_1.RangedSet.fromCidrRange(src_1.IPv4CidrRange.fromCidr("192.168.0.128/27")));
            arrays.push(src_1.RangedSet.fromCidrRange(src_1.IPv4CidrRange.fromCidr("192.168.0.192/26")));
            var pool = IPPool_1.Pool.fromRangeSet(arrays);
            expect(pool.getSize()).toEqual(bigInt(160));
        });
        it('it should get range by prefix', function () {
            var arrays = new Array();
            arrays.push(src_1.RangedSet.fromCidrRange(src_1.IPv4CidrRange.fromCidr("192.168.0.0/26")));
            arrays.push(src_1.RangedSet.fromCidrRange(src_1.IPv4CidrRange.fromCidr("192.168.0.128/27")));
            arrays.push(src_1.RangedSet.fromCidrRange(src_1.IPv4CidrRange.fromCidr("192.168.0.192/26")));
            var pool = IPPool_1.Pool.fromRangeSet(arrays);
            var range = pool.getSingleCidrRange(src_1.IPv4Prefix.fromNumber(26));
            expect(range.toCidrString()).toEqual("192.168.0.0/26");
            expect(pool.getRanges().length).toEqual(2);
        });
        it('it should get sub range by prefix', function () {
            var arrays = new Array();
            arrays.push(src_1.RangedSet.fromCidrRange(src_1.IPv4CidrRange.fromCidr("192.168.0.0/26")));
            arrays.push(src_1.RangedSet.fromCidrRange(src_1.IPv4CidrRange.fromCidr("192.168.0.128/27")));
            arrays.push(src_1.RangedSet.fromCidrRange(src_1.IPv4CidrRange.fromCidr("192.168.0.192/26")));
            var pool = IPPool_1.Pool.fromRangeSet(arrays);
            var range = pool.getSingleCidrRange(src_1.IPv4Prefix.fromNumber(28));
            expect(range.toCidrString()).toEqual("192.168.0.0/28");
            expect(pool.getRanges().length).toEqual(3);
            expect(pool.getRanges()[0].toRangeString()).toEqual("192.168.0.16-192.168.0.63");
            expect(pool.getRanges()[1].toCidrRange().toCidrString()).toEqual("192.168.0.128/27");
            expect(pool.getRanges()[2].toCidrRange().toCidrString()).toEqual("192.168.0.192/26");
        });
        it('it should throw an exception if requested prefix is bigger than available', function () {
            var arrays = new Array();
            arrays.push(src_1.RangedSet.fromCidrRange(src_1.IPv4CidrRange.fromCidr("192.168.0.0/26")));
            arrays.push(src_1.RangedSet.fromCidrRange(src_1.IPv4CidrRange.fromCidr("192.168.0.64/26")));
            var pool = IPPool_1.Pool.fromRangeSet(arrays);
            expect(function () {
                pool.getSingleCidrRange(src_1.IPv4Prefix.fromNumber(24));
            }).toThrowError(Error, "Not enough IP number in the pool for requested prefix: 24");
        });
    });
    describe("IPv6", function () {
        it("it should fully aggregate", function () {
            var arrays = new Array();
            arrays.push(src_1.RangedSet.fromCidrRange(src_1.IPv6CidrRange.fromCidr("2001:db8:0:0:0:0:0:0/48")));
            arrays.push(src_1.RangedSet.fromCidrRange(src_1.IPv6CidrRange.fromCidr("2001:db8:1:0:0:0:0:0/50")));
            arrays.push(src_1.RangedSet.fromCidrRange(src_1.IPv6CidrRange.fromCidr("2001:db8:1:4000:0:0:0:0/50")));
            arrays.push(src_1.RangedSet.fromCidrRange(src_1.IPv6CidrRange.fromCidr("2001:db8:1:8000:0:0:0:0/49")));
            var pool = IPPool_1.Pool.fromRangeSet(arrays);
            var aggregatedPool = pool.aggregate();
            expect(aggregatedPool.getRanges()[0].toRangeString()).toEqual("2001:db8:0:0:0:0:0:0-2001:db8:1:ffff:ffff:ffff:ffff:ffff");
            expect(aggregatedPool.getRanges().length).toEqual(1);
        });
        it('should aggregate with hole', function () {
            var arrays = new Array();
            arrays.push(src_1.RangedSet.fromCidrRange(src_1.IPv6CidrRange.fromCidr("2001:db8:0:0:0:0:0:0/48")));
            // arrays.push(Range.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:1:0:0:0:0:0/50"))); - hole
            arrays.push(src_1.RangedSet.fromCidrRange(src_1.IPv6CidrRange.fromCidr("2001:db8:1:4000:0:0:0:0/50")));
            arrays.push(src_1.RangedSet.fromCidrRange(src_1.IPv6CidrRange.fromCidr("2001:db8:1:8000:0:0:0:0/49")));
            arrays.push(src_1.RangedSet.fromCidrRange(src_1.IPv6CidrRange.fromCidr("2001:db8:1:8000:0:0:0:0/49")));
            var pool = IPPool_1.Pool.fromRangeSet(arrays);
            var aggregatedPool = pool.aggregate();
            expect(aggregatedPool.getRanges()[0].toRangeString()).toEqual("2001:db8:0:0:0:0:0:0-2001:db8:0:ffff:ffff:ffff:ffff:ffff");
            expect(aggregatedPool.getRanges()[1].toRangeString()).toEqual("2001:db8:1:4000:0:0:0:0-2001:db8:1:7fff:ffff:ffff:ffff:ffff");
            expect(aggregatedPool.getRanges()[2].toRangeString()).toEqual("2001:db8:1:8000:0:0:0:0-2001:db8:1:ffff:ffff:ffff:ffff:ffff");
            expect(aggregatedPool.getRanges().length).toEqual(3);
        });
        it('should aggregate with the whole space', function () {
            var arrays = new Array();
            arrays.push(src_1.RangedSet.fromCidrRange(src_1.IPv6CidrRange.fromCidr("::0/0")));
            arrays.push(src_1.RangedSet.fromCidrRange(src_1.IPv6CidrRange.fromCidr("2001:db8:0:0:0:0:0:0/48")));
            // arrays.push(Range.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:1:0:0:0:0:0/50"))); - hole
            arrays.push(src_1.RangedSet.fromCidrRange(src_1.IPv6CidrRange.fromCidr("2001:db8:1:4000:0:0:0:0/50")));
            arrays.push(src_1.RangedSet.fromCidrRange(src_1.IPv6CidrRange.fromCidr("2001:db8:1:8000:0:0:0:0/49")));
            var pool = IPPool_1.Pool.fromRangeSet(arrays);
            var aggregatedPool = pool.aggregate();
            expect(aggregatedPool.getRanges()[0].toRangeString()).toEqual("::0-ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff");
            expect(aggregatedPool.getRanges().length).toEqual(1);
        });
        it("it should reset pool with given range", function () {
            var arrays = new Array();
            arrays.push(src_1.RangedSet.fromCidrRange(src_1.IPv6CidrRange.fromCidr("2001:db8:0:0:0:0:0:0/48")));
            var pool = IPPool_1.Pool.fromRangeSet(arrays);
            expect(pool.getRanges()[0].toRangeString()).toEqual("2001:db8:0:0:0:0:0:0-2001:db8:0:ffff:ffff:ffff:ffff:ffff");
            pool.resetWith(new Array(src_1.RangedSet.fromCidrRange(src_1.IPv6CidrRange.fromCidr("2001:db8:1:4000:0:0:0:0/50"))));
            expect(pool.getRanges()[0].toRangeString()).toEqual("2001:db8:1:4000:0:0:0:0-2001:db8:1:7fff:ffff:ffff:ffff:ffff");
        });
        it("it should clear pool", function () {
            var arrays = new Array();
            arrays.push(src_1.RangedSet.fromCidrRange(src_1.IPv6CidrRange.fromCidr("2001:db8:0:0:0:0:0:0/48")));
            var pool = IPPool_1.Pool.fromRangeSet(arrays);
            expect(pool.getRanges()[0].toRangeString()).toEqual("2001:db8:0:0:0:0:0:0-2001:db8:0:ffff:ffff:ffff:ffff:ffff");
            pool.clear();
            expect(pool.getRanges().length).toEqual(0);
        });
        it("it should remove range from pool", function () {
            var arrays = new Array();
            arrays.push(src_1.RangedSet.fromCidrRange(src_1.IPv6CidrRange.fromCidr("2001:db8:0:0:0:0:0:0/48")));
            var rangeToRemove = src_1.RangedSet.fromCidrRange(src_1.IPv6CidrRange.fromCidr("2001:db8:1:0:0:0:0:0/50"));
            arrays.push(rangeToRemove);
            var pool = IPPool_1.Pool.fromRangeSet(arrays);
            expect(pool.getRanges().length).toEqual(2);
            pool.removeExact(rangeToRemove);
            expect(pool.getRanges().length).toEqual(1);
            expect(pool.getRanges()[0].toCidrRange().toCidrString()).toEqual("2001:db8:0:0:0:0:0:0/48");
        });
        it("it should not remove range if not in the pool", function () {
            var arrays = new Array();
            arrays.push(src_1.RangedSet.fromCidrRange(src_1.IPv6CidrRange.fromCidr("2001:db8:0:0:0:0:0:0/48")));
            arrays.push(src_1.RangedSet.fromCidrRange(src_1.IPv6CidrRange.fromCidr("2001:db8:1:0:0:0:0:0/50")));
            // not added to the pool
            var rangeToRemove = src_1.RangedSet.fromCidrRange(src_1.IPv6CidrRange.fromCidr("2001:db8:1:4000:0:0:0:0/50"));
            var pool = IPPool_1.Pool.fromRangeSet(arrays);
            expect(pool.getRanges().length).toEqual(2);
            pool.removeExact(rangeToRemove);
            expect(pool.getRanges().length).toEqual(2);
            expect(pool.getRanges()[0].toCidrRange().toCidrString()).toEqual("2001:db8:0:0:0:0:0:0/48");
            expect(pool.getRanges()[1].toCidrRange().toCidrString()).toEqual("2001:db8:1:0:0:0:0:0/50");
        });
        it("it should not remove range if range is sub range in the pool", function () {
            var arrays = new Array();
            arrays.push(src_1.RangedSet.fromCidrRange(src_1.IPv6CidrRange.fromCidr("2001:db8:0:0:0:0:0:0/48")));
            arrays.push(src_1.RangedSet.fromCidrRange(src_1.IPv6CidrRange.fromCidr("2001:db8:1:0:0:0:0:0/50")));
            // sub range of 2001:db8:1:0:0:0:0:0/50
            var rangeToRemove = src_1.RangedSet.fromCidrRange(src_1.IPv6CidrRange.fromCidr("2001:db8:1:0:0:0:0:0/51"));
            var pool = IPPool_1.Pool.fromRangeSet(arrays);
            expect(pool.getRanges().length).toEqual(2);
            pool.removeExact(rangeToRemove);
            expect(pool.getRanges().length).toEqual(2);
        });
        it("it should return the size of pool", function () {
            var arrays = new Array();
            arrays.push(src_1.RangedSet.fromCidrRange(src_1.IPv6CidrRange.fromCidr("2001:db8:0:0:0:0:0:0/127")));
            arrays.push(src_1.RangedSet.fromCidrRange(src_1.IPv6CidrRange.fromCidr("2001:db8:1:0:0:0:0:0/128")));
            var pool = IPPool_1.Pool.fromRangeSet(arrays);
            expect(pool.getSize()).toEqual(bigInt(3));
        });
        it('it should get range by prefix', function () {
            var arrays = new Array();
            arrays.push(src_1.RangedSet.fromCidrRange(src_1.IPv6CidrRange.fromCidr("2001:db8:0:0:0:0:0:0/127")));
            arrays.push(src_1.RangedSet.fromCidrRange(src_1.IPv6CidrRange.fromCidr("2001:db8:1:0:0:0:0:0/128")));
            var pool = IPPool_1.Pool.fromRangeSet(arrays);
            var range = pool.getSingleCidrRange(src_1.IPv6Prefix.fromNumber(127));
            expect(range.toCidrString()).toEqual("2001:db8:0:0:0:0:0:0/127");
            expect(pool.getRanges().length).toEqual(1);
        });
        it('it should throw an exception if requested prefix is bigger than available', function () {
            var arrays = new Array();
            arrays.push(src_1.RangedSet.fromCidrRange(src_1.IPv6CidrRange.fromCidr("2001:db8:0:0:0:0:0:0/48")));
            arrays.push(src_1.RangedSet.fromCidrRange(src_1.IPv6CidrRange.fromCidr("2001:db8:1:0:0:0:0:0/50")));
            var pool = IPPool_1.Pool.fromRangeSet(arrays);
            expect(function () {
                pool.getSingleCidrRange(src_1.IPv6Prefix.fromNumber(47));
            }).toThrowError(Error, "Not enough IP number in the pool for requested prefix: 47");
        });
    });
});
//# sourceMappingURL=PoolTest.js.map