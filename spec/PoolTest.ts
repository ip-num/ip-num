import {IPv4, IPv4CidrRange, IPv6, Range} from "../src";
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
        });
    });
});