import {IPv4, IPv4CidrRange, IPv6, IPv6CidrRange, Range} from "../src";
import {Pool} from "../src/IPPool";

describe('Pool', () => {
    describe('IPV4', () => {
        it('should fully aggregate', () => {
            let arrays: Range<IPv4 | IPv6>[] = new Array<Range<IPv4>>();

            arrays.push(Range.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.0/26")));
            arrays.push(Range.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.64/26")));
            arrays.push(Range.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.128/27")));
            arrays.push(Range.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.160/27")));
            arrays.push(Range.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.192/26")));

            let pool = Pool.fromIPRanges(arrays);
            let aggregatedPool = pool.aggregate();

            expect(aggregatedPool.getRanges()[0].toRangeString()).toEqual("192.168.0.0-192.168.0.255");
            expect(aggregatedPool.getRanges().length).toEqual(1);
        });

        it('should aggregate with hole', () => {
            let arrays: Range<IPv4 | IPv6>[] = new Array<Range<IPv4>>();

            arrays.push(Range.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.0/26")));
            arrays.push(Range.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.64/26")));
            // arrays.push(Range.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.128/27"))); - hole
            arrays.push(Range.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.160/27")));
            arrays.push(Range.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.192/26")));

            let pool = Pool.fromIPRanges(arrays);
            let aggregatedPool = pool.aggregate();

            // 192.168.0.0/26 with 192.168.0.64/26
            expect(aggregatedPool.getRanges()[0].toRangeString()).toEqual("192.168.0.0-192.168.0.127");
            expect(aggregatedPool.getRanges()[1].toRangeString()).toEqual("192.168.0.160-192.168.0.191");
            expect(aggregatedPool.getRanges()[2].toRangeString()).toEqual("192.168.0.192-192.168.0.255");
            expect(aggregatedPool.getRanges().length).toEqual(3);
        });

        it('should aggregate with the whole space', () => {
            let arrays: Range<IPv4 | IPv6>[] = new Array<Range<IPv4>>();

            arrays.push(Range.fromCidrRange(IPv4CidrRange.fromCidr("0.0.0.0/0")));

            arrays.push(Range.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.0/26")));
            arrays.push(Range.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.64/26")));
            // arrays.push(Range.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.128/27"))); - hole
            arrays.push(Range.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.160/27")));
            arrays.push(Range.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.192/26")));

            let pool = Pool.fromIPRanges(arrays);
            let aggregatedPool = pool.aggregate();

            expect(aggregatedPool.getRanges()[0].toRangeString()).toEqual("0.0.0.0-255.255.255.255");
            expect(aggregatedPool.getRanges().length).toEqual(1);
        });

        it("it should reset pool with given ranges", () => {
            let arrays: Range<IPv4 | IPv6>[] = new Array<Range<IPv4>>();
            arrays.push(Range.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.0/26")));
            let pool = Pool.fromIPRanges(arrays);
            expect(pool.getRanges()[0].toRangeString()).toEqual("192.168.0.0-192.168.0.63");
            pool.resetWith(new Array<Range<IPv4|IPv6>>(Range.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.160/27"))));
            expect(pool.getRanges()[0].toRangeString()).toEqual("192.168.0.160-192.168.0.191");
        });

        it("it should clear pool", () => {
            let arrays: Range<IPv4 | IPv6>[] = new Array<Range<IPv4>>();
            arrays.push(Range.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.0/26")));
            let pool = Pool.fromIPRanges(arrays);
            expect(pool.getRanges()[0].toRangeString()).toEqual("192.168.0.0-192.168.0.63");
            pool.clear();
            expect(pool.getRanges().length).toEqual(0);
        });
    });

    describe("IPv6", () => {
        it("it should fully aggregate", () => {
            let arrays: Range<IPv4 | IPv6>[] = new Array<Range<IPv6>>();

            arrays.push(Range.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:0:0:0:0:0:0/48")));
            arrays.push(Range.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:1:0:0:0:0:0/50")));
            arrays.push(Range.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:1:4000:0:0:0:0/50")));
            arrays.push(Range.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:1:8000:0:0:0:0/49")));

            let pool = Pool.fromIPRanges(arrays);
            let aggregatedPool = pool.aggregate();
            expect(aggregatedPool.getRanges()[0].toRangeString()).toEqual("2001:db8:0:0:0:0:0:0-2001:db8:1:ffff:ffff:ffff:ffff:ffff");
            expect(aggregatedPool.getRanges().length).toEqual(1);
        });

        it('should aggregate with hole', () => {
            let arrays: Range<IPv4 | IPv6>[] = new Array<Range<IPv6>>();

            arrays.push(Range.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:0:0:0:0:0:0/48")));
            // arrays.push(Range.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:1:0:0:0:0:0/50"))); - hole
            arrays.push(Range.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:1:4000:0:0:0:0/50")));
            arrays.push(Range.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:1:8000:0:0:0:0/49")));

            let pool = Pool.fromIPRanges(arrays);
            let aggregatedPool = pool.aggregate();
            expect(aggregatedPool.getRanges()[0].toRangeString()).toEqual("2001:db8:0:0:0:0:0:0-2001:db8:0:ffff:ffff:ffff:ffff:ffff");
            expect(aggregatedPool.getRanges()[1].toRangeString()).toEqual("2001:db8:1:4000:0:0:0:0-2001:db8:1:7fff:ffff:ffff:ffff:ffff");
            expect(aggregatedPool.getRanges()[2].toRangeString()).toEqual("2001:db8:1:8000:0:0:0:0-2001:db8:1:ffff:ffff:ffff:ffff:ffff");
            expect(aggregatedPool.getRanges().length).toEqual(3);
        });

        it('should aggregate with the whole space', () => {
            let arrays: Range<IPv4 | IPv6>[] = new Array<Range<IPv6>>();

            arrays.push(Range.fromCidrRange(IPv6CidrRange.fromCidr("::0/0")));
            arrays.push(Range.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:0:0:0:0:0:0/48")));
            // arrays.push(Range.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:1:0:0:0:0:0/50"))); - hole
            arrays.push(Range.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:1:4000:0:0:0:0/50")));
            arrays.push(Range.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:1:8000:0:0:0:0/49")));

            let pool = Pool.fromIPRanges(arrays);
            let aggregatedPool = pool.aggregate();
            expect(aggregatedPool.getRanges()[0].toRangeString()).toEqual("::0-ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff");
            expect(aggregatedPool.getRanges().length).toEqual(1);
        });

        it("it should reset pool with given range", () => {
            let arrays: Range<IPv4 | IPv6>[] = new Array<Range<IPv6>>();
            arrays.push(Range.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:0:0:0:0:0:0/48")));
            let pool = Pool.fromIPRanges(arrays);
            expect(pool.getRanges()[0].toRangeString()).toEqual("2001:db8:0:0:0:0:0:0-2001:db8:0:ffff:ffff:ffff:ffff:ffff");
            pool.resetWith(new Array<Range<IPv4|IPv6>>(Range.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:1:4000:0:0:0:0/50"))));
            expect(pool.getRanges()[0].toRangeString()).toEqual("2001:db8:1:4000:0:0:0:0-2001:db8:1:7fff:ffff:ffff:ffff:ffff");
        });

        it("it should clear pool", () => {
            let arrays: Range<IPv4 | IPv6>[] = new Array<Range<IPv6>>();
            arrays.push(Range.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:0:0:0:0:0:0/48")));
            let pool = Pool.fromIPRanges(arrays);
            expect(pool.getRanges()[0].toRangeString()).toEqual("2001:db8:0:0:0:0:0:0-2001:db8:0:ffff:ffff:ffff:ffff:ffff");
            pool.clear();
            expect(pool.getRanges().length).toEqual(0);
        });

    });
});