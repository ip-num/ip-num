import {
    IPv4,
    IPv4CidrRange,
    IPv4Prefix,
    IPv6,
    IPv6CidrRange,
    IPv6Prefix,
    RangedSet
} from "../src";
import {Pool} from "../src";

describe('Pool', () => {
    describe('IPV4', () => {
        it('Should create from IP Numbers', () => {
            let pool = Pool
                .fromIP([IPv4.fromDecimalDottedString("10.0.0.1"), IPv4.fromDecimalDottedString("10.0.0.2")]);
            let ranges = pool.getRanges();
            expect(ranges[0].toCidrRange().toCidrString()).toEqual("10.0.0.1/32")
            expect(ranges[1].toCidrRange().toCidrString()).toEqual("10.0.0.2/32")
        });

        it('Should create from CIDR', () => {
            let pool = Pool
                .fromCidrRanges([IPv4CidrRange.fromCidr("192.168.178.0/24"), IPv4CidrRange.fromCidr("10.0.0.0/24")]);
            let ranges = pool.getRanges();
            expect(ranges[1].toCidrRange().toCidrString()).toBe("192.168.178.0/24")
            expect(ranges[0].toCidrRange().toCidrString()).toBe("10.0.0.0/24")

        });

        it('should fully aggregate', () => {
            let arrays: RangedSet<IPv4>[] = new Array<RangedSet<IPv4>>();

            arrays.push(RangedSet.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.0/26")));
            arrays.push(RangedSet.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.64/26")));
            arrays.push(RangedSet.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.128/27")));
            arrays.push(RangedSet.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.160/27")));
            arrays.push(RangedSet.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.192/26")));

            let pool = Pool.fromRangeSet(arrays);
            let aggregatedPool = pool.aggregate();

            expect(aggregatedPool.getRanges()[0].toRangeString()).toEqual("192.168.0.0-192.168.0.255");
            expect(aggregatedPool.getRanges().length).toEqual(1);
        });

        it('should aggregate with hole', () => {
            let arrays: RangedSet<IPv4>[] = new Array<RangedSet<IPv4>>();

            arrays.push(RangedSet.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.0/26")));
            arrays.push(RangedSet.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.64/26")));
            // arrays.push(Range.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.128/27"))); - hole
            arrays.push(RangedSet.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.160/27")));
            arrays.push(RangedSet.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.192/26")));

            let pool = Pool.fromRangeSet(arrays);
            let aggregatedPool = pool.aggregate();

            // 192.168.0.0/26 with 192.168.0.64/26
            expect(aggregatedPool.getRanges()[0].toRangeString()).toEqual("192.168.0.0-192.168.0.127");
            expect(aggregatedPool.getRanges()[1].toRangeString()).toEqual("192.168.0.160-192.168.0.191");
            expect(aggregatedPool.getRanges()[2].toRangeString()).toEqual("192.168.0.192-192.168.0.255");
            expect(aggregatedPool.getRanges().length).toEqual(3);
        });

        it('should aggregate with the whole space', () => {
            let arrays: RangedSet<IPv4>[] = new Array<RangedSet<IPv4>>();

            arrays.push(RangedSet.fromCidrRange(IPv4CidrRange.fromCidr("0.0.0.0/0")));

            arrays.push(RangedSet.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.0/26")));
            arrays.push(RangedSet.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.64/26")));
            // arrays.push(Range.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.128/27"))); - hole
            arrays.push(RangedSet.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.160/27")));
            arrays.push(RangedSet.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.192/26")));

            let pool = Pool.fromRangeSet(arrays);
            let aggregatedPool = pool.aggregate();

            expect(aggregatedPool.getRanges()[0].toRangeString()).toEqual("0.0.0.0-255.255.255.255");
            expect(aggregatedPool.getRanges().length).toEqual(1);
        });

        it("it should reset pool with given ranges", () => {
            let arrays: RangedSet<IPv4>[] = new Array<RangedSet<IPv4>>();
            arrays.push(RangedSet.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.0/26")));
            let pool = Pool.fromRangeSet(arrays);
            expect(pool.getRanges()[0].toRangeString()).toEqual("192.168.0.0-192.168.0.63");
            pool.resetWith(new Array<RangedSet<IPv4>>(RangedSet.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.160/27"))));
            expect(pool.getRanges()[0].toRangeString()).toEqual("192.168.0.160-192.168.0.191");
        });

        it("it should clear pool", () => {
            let arrays: RangedSet<IPv4>[] = new Array<RangedSet<IPv4>>();
            arrays.push(RangedSet.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.0/26")));
            let pool = Pool.fromRangeSet(arrays);
            expect(pool.getRanges()[0].toRangeString()).toEqual("192.168.0.0-192.168.0.63");
            pool.clear();
            expect(pool.getRanges().length).toEqual(0);
        });

        it("it should remove range from pool", () => {
            let arrays: RangedSet<IPv4>[] = new Array<RangedSet<IPv4>>();

            arrays.push(RangedSet.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.0/26")));
            let rangeToRemove = RangedSet.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.64/26"));
            arrays.push(rangeToRemove);
            let pool = Pool.fromRangeSet(arrays);

            expect(pool.getRanges().length).toEqual(2);
            let isRemoved = pool.removeExact(rangeToRemove);
            expect(isRemoved).toBeTrue();
            expect(pool.getRanges().length).toEqual(1);
            expect(pool.getRanges()[0].toCidrRange().toCidrString()).toEqual("192.168.0.0/26");
        });

        it("it should remove range from pool using removeOverlapping", () => {
            let arrays: RangedSet<IPv4>[] = new Array<RangedSet<IPv4>>();

            arrays.push(RangedSet.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.0/26")));
            let rangeToRemove = RangedSet.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.64/26"));
            arrays.push(rangeToRemove);
            let pool = Pool.fromRangeSet(arrays);

            expect(pool.getRanges().length).toEqual(2);
            let isRemoved = pool.removeOverlapping(rangeToRemove);
            expect(isRemoved).toBeTrue();
            expect(pool.getRanges().length).toEqual(1);
            expect(pool.getRanges()[0].toCidrRange().toCidrString()).toEqual("192.168.0.0/26");
        });

        it("it should not remove range if not in the pool", () => {
            let arrays: RangedSet<IPv4>[] = new Array<RangedSet<IPv4>>();

            arrays.push(RangedSet.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.0/26")));
            arrays.push(RangedSet.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.64/26")));
            // not added to the pool
            let rangeToRemove = RangedSet.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.128/27"));

            let pool = Pool.fromRangeSet(arrays);

            expect(pool.getRanges().length).toEqual(2);
            let isRemoved = pool.removeExact(rangeToRemove);
            expect(isRemoved).toBeFalse();
            expect(pool.getRanges().length).toEqual(2);
            expect(pool.getRanges()[0].toCidrRange().toCidrString()).toEqual("192.168.0.0/26");
            expect(pool.getRanges()[1].toCidrRange().toCidrString()).toEqual("192.168.0.64/26");
        });

        it("it should not remove range if not in the pool using removeOverlapping", () => {
            let arrays: RangedSet<IPv4>[] = new Array<RangedSet<IPv4>>();

            arrays.push(RangedSet.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.0/26")));
            arrays.push(RangedSet.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.64/26")));
            // not added to the pool
            let rangeToRemove = RangedSet.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.128/27"));

            let pool = Pool.fromRangeSet(arrays);

            expect(pool.getRanges().length).toEqual(2);
            let isRemoved = pool.removeOverlapping(rangeToRemove);
            expect(isRemoved).toBeFalse();
            expect(pool.getRanges().length).toEqual(2);
            expect(pool.getRanges()[0].toCidrRange().toCidrString()).toEqual("192.168.0.0/26");
            expect(pool.getRanges()[1].toCidrRange().toCidrString()).toEqual("192.168.0.64/26");
        });

        it("it should not remove range if range is sub range in the pool", () => {
            let arrays: RangedSet<IPv4>[] = new Array<RangedSet<IPv4>>();

            arrays.push(RangedSet.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.0/26")));
            arrays.push(RangedSet.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.64/26")));
            // not added to the pool
            let rangeToRemove = RangedSet.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.96/27"));

            let pool = Pool.fromRangeSet(arrays);

            expect(pool.getRanges().length).toEqual(2);
            let isRemoved = pool.removeExact(rangeToRemove);
            expect(isRemoved).toBeFalse();
            expect(pool.getRanges().length).toEqual(2);
            expect(pool.getRanges()[0].toCidrRange().toCidrString()).toEqual("192.168.0.0/26");
            expect(pool.getRanges()[1].toCidrRange().toCidrString()).toEqual("192.168.0.64/26");
        });

        it("it should remove range if range is sub range in the pool using removeOverlapping", () => {
            let arrays: RangedSet<IPv4>[] = new Array<RangedSet<IPv4>>();

            // 192.168.0.0 - 192.168.0.63
            arrays.push(RangedSet.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.0/26")));
            // 192.168.0.64 - 192.168.0.127
            arrays.push(RangedSet.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.64/26")));
            // not added to the pool
            // 192.168.0.96 - 192.168.0.127
            let rangeToRemove = RangedSet.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.96/27"));

            let pool = Pool.fromRangeSet(arrays);

            expect(pool.getRanges().length).toEqual(2);
            let isRemoved = pool.removeOverlapping(rangeToRemove);
            expect(isRemoved).toBeTrue();
            expect(pool.getRanges().length).toEqual(2);
            expect(pool.getRanges()[0].toCidrRange().toCidrString()).toEqual("192.168.0.0/26");
            expect(pool.getRanges()[1].toCidrRange().toCidrString()).toEqual("192.168.0.64/27");
        });

        it("it should return the size of pool", () => {
            let arrays: RangedSet<IPv4>[] = new Array<RangedSet<IPv4>>();

            arrays.push(RangedSet.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.0/26")));
            arrays.push(RangedSet.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.128/27")));
            arrays.push(RangedSet.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.192/26")));

            let pool = Pool.fromRangeSet(arrays);

            expect(pool.getSize()).toEqual(160n);
        });

        it('it should get range by prefix', () => {
            let arrays: RangedSet<IPv4>[] = new Array<RangedSet<IPv4>>();

            arrays.push(RangedSet.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.0/26")));
            arrays.push(RangedSet.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.128/27")));
            arrays.push(RangedSet.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.192/26")));

            let pool = Pool.fromRangeSet(arrays);
            let range = pool.getCidrRange(IPv4Prefix.fromNumber(26n));
            expect(range.toCidrString()).toEqual("192.168.0.0/26");
            expect(pool.getRanges().length).toEqual(2);
        });

        it('it should through exception: pool big enough, but no range big enough for prefix', () => {
            let arrays: RangedSet<IPv4>[] = new Array<RangedSet<IPv4>>();

            // 192.168.0.0 - 192.168.0.63 - 64
            arrays.push(RangedSet.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.0/26")));
            // 192.168.0.128 - 192.168.0.159 - 32
            arrays.push(RangedSet.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.128/27")));
            // 192.168.0.192 - 192.168.0.255 - 64
            arrays.push(RangedSet.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.192/26")));

            let pool = Pool.fromRangeSet(arrays);

            expect(() => {
                pool.getCidrRange(IPv4Prefix.fromNumber(25n)); //128
            }).toThrowError(Error, "No range big enough in the pool for requested prefix: 25")
        });

        it('it should get sub range by prefix', () => {
            let arrays: RangedSet<IPv4>[] = new Array<RangedSet<IPv4>>();

            arrays.push(RangedSet.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.0/26")));
            arrays.push(RangedSet.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.128/27")));
            arrays.push(RangedSet.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.192/26")));

            let pool = Pool.fromRangeSet(arrays);
            let range = pool.getCidrRange(IPv4Prefix.fromNumber(28n));
            expect(range.toCidrString()).toEqual("192.168.0.0/28");
            expect(pool.getRanges().length).toEqual(3);
            expect(pool.getRanges()[0].toRangeString()).toEqual("192.168.0.16-192.168.0.63");
            expect(pool.getRanges()[1].toCidrRange().toCidrString()).toEqual("192.168.0.128/27");
            expect(pool.getRanges()[2].toCidrRange().toCidrString()).toEqual("192.168.0.192/26");
        });

        it('it should throw an exception if requested prefix is bigger than available', () => {
            let arrays: RangedSet<IPv4>[] = new Array<RangedSet<IPv4>>();

            arrays.push(RangedSet.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.0/26")));
            arrays.push(RangedSet.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.64/26")));

            let pool = Pool.fromRangeSet(arrays);
            expect(() => {
                pool.getCidrRange(IPv4Prefix.fromNumber(24n));
            }).toThrowError(Error, "Not enough IP number in the pool for requested prefix: 24")
        });

        it("should get a single prefix when asking multiple prefixes", () => {
            let arrays: RangedSet<IPv4>[] = new Array<RangedSet<IPv4>>();

            // 192.168.0.128 - 192.168.0.159 - 32
            arrays.push(RangedSet.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.128/27")));

            // // 192.168.0.160 - 192.168.0.191 - 32
            // arrays.push(RangedSet.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.160/27")));

            // 192.168.0.192 - 192.168.0.255 - 32
            arrays.push(RangedSet.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.192/26")));

            let pool = Pool.fromRangeSet(arrays);

            expect(pool.getRanges().length).toEqual(2)

            let cidrRanges = pool.getCidrRanges(IPv4Prefix.fromNumber(26n));

            expect(cidrRanges[0].toCidrString()).toEqual("192.168.0.192/26")
            expect(pool.getRanges().length).toEqual(1)
            expect(pool.getRanges()[0].toCidrRange().toCidrString()).toEqual("192.168.0.128/27")
        });

        it("should get a multiple prefix that adds up to requested prefix", () => {
            let arrays: RangedSet<IPv4>[] = new Array<RangedSet<IPv4>>();


            arrays.push(RangedSet.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.0/27")));
            arrays.push(RangedSet.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.128/27")));
            arrays.push(RangedSet.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.160/27")));
            arrays.push(RangedSet.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.192/27")));

            let pool = Pool.fromRangeSet(arrays);

            expect(pool.getRanges().length).toEqual(4)

            let cidrRanges = pool.getCidrRanges(IPv4Prefix.fromNumber(26n));

            expect(cidrRanges[0].toCidrString()).toEqual("192.168.0.0/27")
            expect(cidrRanges[1].toCidrString()).toEqual("192.168.0.128/27")
            expect(pool.getRanges().length).toEqual(2)
            expect(pool.getRanges()[0].toCidrRange().toCidrString()).toEqual("192.168.0.160/27")
            expect(pool.getRanges()[1].toCidrRange().toCidrString()).toEqual("192.168.0.192/27")
        });

        it("should get a sorted multiple prefix that adds up to requested prefix", () => {
            let arrays: RangedSet<IPv4>[] = new Array<RangedSet<IPv4>>();


            arrays.push(RangedSet.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.0/27"))); // pick this and
            arrays.push(RangedSet.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.160/27")));
            arrays.push(RangedSet.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.128/27"))); // this
            arrays.push(RangedSet.fromCidrRange(IPv4CidrRange.fromCidr("192.168.0.192/27")));

            let pool = Pool.fromRangeSet(arrays);

            expect(pool.getRanges().length).toEqual(4)

            let cidrRanges = pool.getCidrRanges(IPv4Prefix.fromNumber(26n));

            expect(cidrRanges[0].toCidrString()).toEqual("192.168.0.0/27")
            expect(cidrRanges[1].toCidrString()).toEqual("192.168.0.128/27")
            expect(pool.getRanges().length).toEqual(2)
            expect(pool.getRanges()[0].toCidrRange().toCidrString()).toEqual("192.168.0.160/27")
            expect(pool.getRanges()[1].toCidrRange().toCidrString()).toEqual("192.168.0.192/27")
        });
    });

    describe("IPv6", () => {

        it('Should create from IP Numbers', () => {
            let pool = Pool
                .fromIP([IPv6.fromHexadecimalString("2620:0:0:0:0:0:0:0"),
                    IPv6.fromHexadecimalString("2620:0:ffff:ffff:ffff:ffff:ffff:ffff")]);
            let ranges = pool.getRanges();

            expect(ranges[0].toCidrRange().toCidrString()).toEqual("2620:0:0:0:0:0:0:0/128")
            expect(ranges[1].toCidrRange().toCidrString()).toEqual("2620:0:ffff:ffff:ffff:ffff:ffff:ffff/128")
        });

        it('Should create from CIDR', () => {
            let pool = Pool
                .fromCidrRanges([
                    IPv6CidrRange.fromCidr("2620:0:0:0:0:0:0:0/128"),
                    IPv6CidrRange.fromCidr("2620:0:ffff:ffff:ffff:ffff:ffff:ffff/128")
                ]);

            let ranges = pool.getRanges();
            expect(ranges[0].toCidrRange().toCidrString()).toBe("2620:0:0:0:0:0:0:0/128")
            expect(ranges[1].toCidrRange().toCidrString()).toBe("2620:0:ffff:ffff:ffff:ffff:ffff:ffff/128")

        });

        it("it should fully aggregate", () => {
            let arrays: RangedSet<IPv6>[] = new Array<RangedSet<IPv6>>();

            arrays.push(RangedSet.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:0:0:0:0:0:0/48")));
            arrays.push(RangedSet.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:1:0:0:0:0:0/50")));
            arrays.push(RangedSet.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:1:4000:0:0:0:0/50")));
            arrays.push(RangedSet.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:1:8000:0:0:0:0/49")));

            let pool = Pool.fromRangeSet(arrays);
            let aggregatedPool = pool.aggregate();
            expect(aggregatedPool.getRanges()[0].toRangeString()).toEqual("2001:db8:0:0:0:0:0:0-2001:db8:1:ffff:ffff:ffff:ffff:ffff");
            expect(aggregatedPool.getRanges().length).toEqual(1);
        });

        it('should aggregate with hole', () => {
            let arrays: RangedSet<IPv6>[] = new Array<RangedSet<IPv6>>();

            arrays.push(RangedSet.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:0:0:0:0:0:0/48")));
            // arrays.push(Range.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:1:0:0:0:0:0/50"))); - hole
            arrays.push(RangedSet.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:1:4000:0:0:0:0/50")));
            arrays.push(RangedSet.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:1:8000:0:0:0:0/49")));
            arrays.push(RangedSet.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:1:8000:0:0:0:0/49")));

            let pool = Pool.fromRangeSet(arrays);
            let aggregatedPool = pool.aggregate();
            expect(aggregatedPool.getRanges()[0].toRangeString()).toEqual("2001:db8:0:0:0:0:0:0-2001:db8:0:ffff:ffff:ffff:ffff:ffff");
            expect(aggregatedPool.getRanges()[1].toRangeString()).toEqual("2001:db8:1:4000:0:0:0:0-2001:db8:1:7fff:ffff:ffff:ffff:ffff");
            expect(aggregatedPool.getRanges()[2].toRangeString()).toEqual("2001:db8:1:8000:0:0:0:0-2001:db8:1:ffff:ffff:ffff:ffff:ffff");
            expect(aggregatedPool.getRanges().length).toEqual(3);
        });

        it('should aggregate with the whole space', () => {
            let arrays: RangedSet<IPv6>[] = new Array<RangedSet<IPv6>>();

            arrays.push(RangedSet.fromCidrRange(IPv6CidrRange.fromCidr("::0/0")));
            arrays.push(RangedSet.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:0:0:0:0:0:0/48")));
            // arrays.push(Range.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:1:0:0:0:0:0/50"))); - hole
            arrays.push(RangedSet.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:1:4000:0:0:0:0/50")));
            arrays.push(RangedSet.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:1:8000:0:0:0:0/49")));

            let pool = Pool.fromRangeSet(arrays);
            let aggregatedPool = pool.aggregate();
            expect(aggregatedPool.getRanges()[0].toRangeString()).toEqual("::0-ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff");
            expect(aggregatedPool.getRanges().length).toEqual(1);
        });

        it("it should reset pool with given ranges", () => {
            let arrays: RangedSet<IPv6>[] = new Array<RangedSet<IPv6>>();
            arrays.push(RangedSet.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:0:0:0:0:0:0/48")));
            let pool = Pool.fromRangeSet(arrays);
            expect(pool.getRanges()[0].toRangeString()).toEqual("2001:db8:0:0:0:0:0:0-2001:db8:0:ffff:ffff:ffff:ffff:ffff");
            pool.resetWith(new Array<RangedSet<IPv6>>(RangedSet.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:1:4000:0:0:0:0/50"))));
            expect(pool.getRanges()[0].toRangeString()).toEqual("2001:db8:1:4000:0:0:0:0-2001:db8:1:7fff:ffff:ffff:ffff:ffff");
        });

        it("it should clear pool", () => {
            let arrays: RangedSet<IPv6>[] = new Array<RangedSet<IPv6>>();
            arrays.push(RangedSet.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:0:0:0:0:0:0/48")));
            let pool = Pool.fromRangeSet(arrays);
            expect(pool.getRanges()[0].toRangeString()).toEqual("2001:db8:0:0:0:0:0:0-2001:db8:0:ffff:ffff:ffff:ffff:ffff");
            pool.clear();
            expect(pool.getRanges().length).toEqual(0);
        });


        it("it should remove range from pool", () => {
            let arrays: RangedSet<IPv6>[] = new Array<RangedSet<IPv6>>();

            arrays.push(RangedSet.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:0:0:0:0:0:0/48")));
            let rangeToRemove = RangedSet.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:1:0:0:0:0:0/50"));
            arrays.push(rangeToRemove);

            let pool = Pool.fromRangeSet(arrays);

            expect(pool.getRanges().length).toEqual(2);
            let isRemoved = pool.removeExact(rangeToRemove);
            expect(isRemoved).toBeTrue();
            expect(pool.getRanges().length).toEqual(1);
            expect(pool.getRanges()[0].toCidrRange().toCidrString()).toEqual("2001:db8:0:0:0:0:0:0/48");
        });

        it("it should remove range from pool using removeOverlapping", () => {
            let arrays: RangedSet<IPv6>[] = new Array<RangedSet<IPv6>>();

            arrays.push(RangedSet.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:0:0:0:0:0:0/48")));
            let rangeToRemove = RangedSet.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:1:0:0:0:0:0/50"));
            arrays.push(rangeToRemove);

            let pool = Pool.fromRangeSet(arrays);

            expect(pool.getRanges().length).toEqual(2);
            let isRemoved = pool.removeOverlapping(rangeToRemove);
            expect(isRemoved).toBeTrue();
            expect(pool.getRanges().length).toEqual(1);
            expect(pool.getRanges()[0].toCidrRange().toCidrString()).toEqual("2001:db8:0:0:0:0:0:0/48");
        });

        it("it should not remove range if not in the pool", () => {
            let arrays: RangedSet<IPv6>[] = new Array<RangedSet<IPv6>>();

            arrays.push(RangedSet.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:0:0:0:0:0:0/48")));
            arrays.push(RangedSet.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:1:0:0:0:0:0/50")));

            // not added to the pool
            let rangeToRemove = RangedSet.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:1:4000:0:0:0:0/50"));

            let pool = Pool.fromRangeSet(arrays);

            expect(pool.getRanges().length).toEqual(2);
            let isRemoved = pool.removeExact(rangeToRemove);
            expect(isRemoved).toBeFalse();
            expect(pool.getRanges().length).toEqual(2);
            expect(pool.getRanges()[0].toCidrRange().toCidrString()).toEqual("2001:db8:0:0:0:0:0:0/48");
            expect(pool.getRanges()[1].toCidrRange().toCidrString()).toEqual("2001:db8:1:0:0:0:0:0/50");
        });

        it("it should not remove range if not in the pool using removeOverlapping", () => {
            let arrays: RangedSet<IPv6>[] = new Array<RangedSet<IPv6>>();

            arrays.push(RangedSet.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:0:0:0:0:0:0/48")));
            arrays.push(RangedSet.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:1:0:0:0:0:0/50")));

            // not added to the pool
            let rangeToRemove = RangedSet.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:1:4000:0:0:0:0/50"));

            let pool = Pool.fromRangeSet(arrays);

            expect(pool.getRanges().length).toEqual(2);
            let isRemoved = pool.removeOverlapping(rangeToRemove);
            expect(isRemoved).toBeFalse();
            expect(pool.getRanges().length).toEqual(2);
            expect(pool.getRanges()[0].toCidrRange().toCidrString()).toEqual("2001:db8:0:0:0:0:0:0/48");
            expect(pool.getRanges()[1].toCidrRange().toCidrString()).toEqual("2001:db8:1:0:0:0:0:0/50");
        });

        it("it should not remove range if range is sub range in the pool", () => {
            let arrays: RangedSet<IPv6>[] = new Array<RangedSet<IPv6>>();

            arrays.push(RangedSet.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:0:0:0:0:0:0/48")));
            arrays.push(RangedSet.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:1:0:0:0:0:0/50")));

            // sub range of 2001:db8:1:0:0:0:0:0/50
            let rangeToRemove = RangedSet.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:1:0:0:0:0:0/51"));

            let pool = Pool.fromRangeSet(arrays);

            expect(pool.getRanges().length).toEqual(2);
            let isRemoved = pool.removeExact(rangeToRemove);
            expect(isRemoved).toBeFalse();
            expect(pool.getRanges().length).toEqual(2);
        });

        it("it should remove range if range is sub range in the pool using removeOverlapping", () => {
            let arrays: RangedSet<IPv6>[] = new Array<RangedSet<IPv6>>();

            arrays.push(RangedSet.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:0:0:0:0:0:0/48")));
            arrays.push(RangedSet.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:1:0:0:0:0:0/50")));

            // sub range of 2001:db8:1:0:0:0:0:0/50
            let rangeToRemove = RangedSet.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:1:0:0:0:0:0/51"));

            let pool = Pool.fromRangeSet(arrays);

            expect(pool.getRanges().length).toEqual(2);
            let isRemoved = pool.removeOverlapping(rangeToRemove);
            expect(isRemoved).toBeTrue();
            expect(pool.getRanges().length).toEqual(2);
            expect(pool.getRanges()[0].toCidrRange().toCidrString()).toEqual("2001:db8:0:0:0:0:0:0/48");
            expect(pool.getRanges()[1].toCidrRange().toCidrString()).toEqual("2001:db8:1:2000:0:0:0:0/51");
        });

        it("it should return the size of pool", () => {
            let arrays: RangedSet<IPv6>[] = new Array<RangedSet<IPv6>>();

            arrays.push(RangedSet.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:0:0:0:0:0:0/127")));
            arrays.push(RangedSet.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:1:0:0:0:0:0/128")));

            let pool = Pool.fromRangeSet(arrays);

            expect(pool.getSize()).toEqual(3n);
        });


        it('it should get range by prefix', () => {
            let arrays: RangedSet<IPv6>[] = new Array<RangedSet<IPv6>>();

            arrays.push(RangedSet.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:0:0:0:0:0:0/127")));
            arrays.push(RangedSet.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:1:0:0:0:0:0/128")));

            let pool = Pool.fromRangeSet(arrays);

            let range = pool.getCidrRange(IPv6Prefix.fromNumber(127n));
            expect(range.toCidrString()).toEqual("2001:db8:0:0:0:0:0:0/127");
            expect(pool.getRanges().length).toEqual(1);
        });

        it('it should through exception: pool big enough, but no range big enough for prefix', () => {
            let arrays: RangedSet<IPv6>[] = new Array<RangedSet<IPv6>>();

            arrays.push(RangedSet.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:1:8000:0:0:0:0/49")));
            arrays.push(RangedSet.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:1:4000:0:0:0:0/50")));
            arrays.push(RangedSet.fromCidrRange(IPv6CidrRange.fromCidr("2002:db8:1:8000:0:0:0:0/49")));

            let pool = Pool.fromRangeSet(arrays);

            expect(() => {
                pool.getCidrRange(IPv6Prefix.fromNumber(48n));
            }).toThrowError(Error, "No range big enough in the pool for requested prefix: 48")
        });


        it('it should get sub range by prefix', () => {
            let arrays: RangedSet<IPv6>[] = new Array<RangedSet<IPv6>>();

            arrays.push(RangedSet.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:0:0:0:0:0:0/48")));

            arrays.push(RangedSet.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:1:4000:0:0:0:0/50")));
            arrays.push(RangedSet.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:1:8000:0:0:0:0/49")));
            arrays.push(RangedSet.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:1:8000:0:0:0:0/49")));



            let pool = Pool.fromRangeSet(arrays);
            let range = pool.getCidrRange(IPv6Prefix.fromNumber(50n));
            expect(range.toCidrString()).toEqual("2001:db8:0:0:0:0:0:0/50");
            expect(pool.getRanges().length).toEqual(4);
            expect(pool.getRanges()[0].toRangeString()).toEqual("2001:db8:0:4000:0:0:0:0-2001:db8:0:ffff:ffff:ffff:ffff:ffff");
            expect(pool.getRanges()[1].toCidrRange().toCidrString()).toEqual("2001:db8:1:4000:0:0:0:0/50");
            expect(pool.getRanges()[2].toCidrRange().toCidrString()).toEqual("2001:db8:1:8000:0:0:0:0/49");
            expect(pool.getRanges()[3].toCidrRange().toCidrString()).toEqual("2001:db8:1:8000:0:0:0:0/49");
        });

        it('it should throw an exception if requested prefix is bigger than available', () => {
            let arrays: RangedSet<IPv6>[] = new Array<RangedSet<IPv6>>();

            arrays.push(RangedSet.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:0:0:0:0:0:0/48")));
            arrays.push(RangedSet.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:1:0:0:0:0:0/50")));

            let pool = Pool.fromRangeSet(arrays);
            expect(() => {
                pool.getCidrRange(IPv6Prefix.fromNumber(47n));
            }).toThrowError(Error, "Not enough IP number in the pool for requested prefix: 47")
        });


        it("should get a multiple prefix that adds up to requested prefix", () => {
            let arrays: RangedSet<IPv6>[] = new Array<RangedSet<IPv6>>();

            // 2001:db8:0:0:0:0:0:0 - 2001:db8:0:7fff:ffff:ffff:ffff:ffff
            arrays.push(RangedSet.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:0:0:0:0:0:0/49")));
            // 2001:db8:1:0:0:0:0:0 - 2001:db8:1:7fff:ffff:ffff:ffff:ffff
            arrays.push(RangedSet.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:1:0:0:0:0:0/49")));
            arrays.push(RangedSet.fromCidrRange(IPv6CidrRange.fromCidr("2002:db8:0:0:0:0:0:0/49")));
            arrays.push(RangedSet.fromCidrRange(IPv6CidrRange.fromCidr("2002:db8:1:0:0:0:0:0/49")));


            let pool = Pool.fromRangeSet(arrays);

            expect(pool.getRanges().length).toEqual(4)

            let cidrRanges = pool.getCidrRanges(IPv6Prefix.fromNumber(48n));
            expect(cidrRanges[0].toCidrString()).toEqual("2001:db8:0:0:0:0:0:0/49")
            expect(cidrRanges[1].toCidrString()).toEqual("2001:db8:1:0:0:0:0:0/49")
            expect(pool.getRanges().length).toEqual(2);
            expect(pool.getRanges()[0].toCidrRange().toCidrString()).toEqual("2002:db8:0:0:0:0:0:0/49")
            expect(pool.getRanges()[1].toCidrRange().toCidrString()).toEqual("2002:db8:1:0:0:0:0:0/49")
        });

        it("should get a sorted multiple prefix that adds up to requested prefix", () => {
            let arrays: RangedSet<IPv6>[] = new Array<RangedSet<IPv6>>();

            // 2001:db8:0:0:0:0:0:0 - 2001:db8:0:7fff:ffff:ffff:ffff:ffff
            arrays.push(RangedSet.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:0:0:0:0:0:0/49"))); // pick this
            arrays.push(RangedSet.fromCidrRange(IPv6CidrRange.fromCidr("2002:db8:0:0:0:0:0:0/49")));
            // 2001:db8:1:0:0:0:0:0 - 2001:db8:1:7fff:ffff:ffff:ffff:ffff
            arrays.push(RangedSet.fromCidrRange(IPv6CidrRange.fromCidr("2001:db8:1:0:0:0:0:0/49"))); // and this
            arrays.push(RangedSet.fromCidrRange(IPv6CidrRange.fromCidr("2002:db8:1:0:0:0:0:0/49")));


            let pool = Pool.fromRangeSet(arrays);

            expect(pool.getRanges().length).toEqual(4)

            let cidrRanges = pool.getCidrRanges(IPv6Prefix.fromNumber(48n));
            expect(cidrRanges[0].toCidrString()).toEqual("2001:db8:0:0:0:0:0:0/49")
            expect(cidrRanges[1].toCidrString()).toEqual("2001:db8:1:0:0:0:0:0/49")
            expect(pool.getRanges().length).toEqual(2);
            expect(pool.getRanges()[0].toCidrRange().toCidrString()).toEqual("2002:db8:0:0:0:0:0:0/49")
            expect(pool.getRanges()[1].toCidrRange().toCidrString()).toEqual("2002:db8:1:0:0:0:0:0/49")
        });

        it("should not aggregate ranges that can form a bigger range", () => {
            const pool = Pool.fromRangeSet([
                IPv6CidrRange.fromCidr('2aaa:2aaa:1::/48').toRangeSet(),
                IPv6CidrRange.fromCidr('2aaa:2aaa:2::/48').toRangeSet(),
            ]);

            const singleThenSplit = pool
                .aggregate()
                .getRanges()
                .flatMap(entry => {
                    return (entry.toCidrRange() as IPv6CidrRange).splitInto(new IPv6Prefix(48n)).map(entry => {
                        return entry.toCidrString();
                    });
                });

            const direct = pool
                .aggregate()
                .getRanges()
                .map(entry => {
                    return entry.toCidrRange().toCidrString();
                });

            expect(singleThenSplit[0]).toEqual('2aaa:2aaa:1:0:0:0:0:0/48');
            expect(singleThenSplit[1]).toEqual('2aaa:2aaa:2:0:0:0:0:0/48');
            expect(direct[0]).toEqual('2aaa:2aaa:1:0:0:0:0:0/48');
            expect(direct[1]).toEqual('2aaa:2aaa:2:0:0:0:0:0/48');
        })

    });
});