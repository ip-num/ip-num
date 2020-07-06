import {IPv4CidrRange, IPv6CidrRange, RangedSet} from "./IPRange";
import {IPv4, IPv6} from "./IPNumber";
import {IPv4Prefix, IPv6Prefix} from "./Prefix";
import * as bigInt from "big-integer";

type RangeType = RangedSet<IPv4> | RangedSet<IPv6>;
/**
 * Represents a collection of IP {@link RangedSet}'s
 */
export class Pool<T extends RangeType> {
    private backingSet: SortedSet = new SortedSet();

    /**
     * Convenient method for creating an instance from arrays of {@link IPv4} or {@link IPv6}
     * @param ipNumbers the arrays of {@link IPv4} or {@link IPv6} that will make up the pool.
     */
    public static fromIPNumbers(ipNumbers: Array<IPv4> | Array<IPv6>): Pool<RangeType> {
        let ranges: Array<RangedSet<IPv4 | IPv6>> = (ipNumbers as Array<IPv4 | IPv6>).map((ip:(IPv4 | IPv6)) => {
            return RangedSet.fromSingleIP(ip);
        });

        return new Pool(ranges);
    }

    /**
     * Convenient method for creating an instance from arrays of {@link RangedSet}.
     *
     * @param ipRanges the arrays of {@link RangedSet}'s that will make up the pool.
     */
    // TODO: TSE: This makes it possible to create an instance containing both Range set of IPv4 and IPv6
    public static fromRangeSet(ipRanges: Array<RangedSet<IPv4 | IPv6>>): Pool<RangeType> {
        return new Pool(ipRanges);
    }

    /**
     * Convenient method for creating an instance from arrays of {@link IPv4CidrRange} or {@link IPv6CidrRange}.
     *
     * @param cidrRanges the arrays of {@link IPv4CidrRange} or {@link IPv6CidrRange} that will make up the pool.
     */
    public static fromCidrRanges(cidrRanges: IPv4CidrRange[] | IPv6CidrRange[]) : Pool<RangeType> {
        let cidr: Array<IPv4CidrRange | IPv6CidrRange> = cidrRanges as (IPv4CidrRange | IPv6CidrRange)[];
        let rangeSet:RangedSet<IPv4 | IPv6>[] = cidr.map((range:IPv4CidrRange | IPv6CidrRange) => {
            return range.toRangeSet();
        })

        return new Pool(rangeSet);
    }

    /**
     * Constructor for an IP pool.
     *
     * Creates a Pool of IP ranges from supplied {@link RangedSet}'s
     *
     * @param ranges the array of IP ranges that would make up the pool.
     */
    constructor(ranges: Array<RangedSet<IPv4 | IPv6>>) {
        ranges.forEach(range => {
            this.backingSet.add(range);
        })
    }

    /**
     * Returns an array of {@link RangedSet}'s that is contained within the pool
     */
    public getRanges(): Array<RangedSet<IPv4 | IPv6>> {
        return this.backingSet.asArray();
    }

    /**
     * Returns an new {@link Pool} with all the IP ranges aggregated
     */
    public aggregate(): Pool<T> {
        let sortedRanges:Array<RangedSet<IPv4 | IPv6>> = this.backingSet.asArray();
        let mergedRanges = sortedRanges.reduce<Array<RangedSet<IPv4 | IPv6>>>
        ((accumulator:Array<RangedSet<IPv4 | IPv6>>, currentRange: RangedSet<IPv4 | IPv6>, currentIndex: number, array: RangedSet<IPv4 | IPv6>[]) => {
            if (accumulator.length == 0) {
                accumulator.push(currentRange);
                return accumulator;
            } else {
                let previous = accumulator.pop()!;
                let previousCidrRange = previous.toCidrRange();
                let currentCidrRange = currentRange.toCidrRange();

                if (previousCidrRange.isCidrMergeable(currentCidrRange)) {
                    let merged = previousCidrRange.merge(currentCidrRange);
                    accumulator.push(merged.toRangeSet());
                    return accumulator;
                } else {
                    if (!previous.contains(currentRange)) {
                        accumulator.push(previous);
                        accumulator.push(currentRange);
                    } else {
                        accumulator.push(previous);
                    }
                    return accumulator;
                }
            }
        }, []);

        let aggregatedPool = Pool.fromRangeSet(mergedRanges);
        if (aggregatedPool.getRanges().length !== this.getRanges().length) {
            return aggregatedPool.aggregate();
        } else {
            return aggregatedPool;
        }
    }

    /**
     * Gets a single range of size of the given prefix from pool.
     * Only returns a range if there is a single range in the pool of same size or greater than given prefix.
     *
     * throws exception if the requested range cannot be got from the pool.
     *
     * @param prefix prefix range to retrieve
     */
    public getSingleCidrRange(prefix: IPv4Prefix | IPv6Prefix): IPv4CidrRange | IPv6CidrRange {
        if (prefix.toRangeSize().gt(this.getSize())) {
            throw new Error(`Not enough IP number in the pool for requested prefix: ${prefix}`);
        }
        let selectedCidrRange: IPv4CidrRange | IPv6CidrRange | undefined;
        let error: Error | undefined;

        loop:
        for (let range of this.getRanges()) {
            for (var offset = bigInt.zero; offset.lesserOrEquals(range.getSize()); offset.plus(bigInt.one)) try {
                let selectedRange = range.takeSubRange(offset, prefix.toRangeSize());
                selectedCidrRange = selectedRange.toCidrRange();
                let remaining = range.difference(selectedRange);
                this.removeExact(range);
                this.add(remaining);
                break loop;
            } catch (e) {
                error = e
            }
        }

        if (selectedCidrRange) {
            return selectedCidrRange;
        } else {
            throw error;
        }
    }

    /**
     * Gets a single or multiple ranges that fulfils the given prefix from the pool.
     *
     * throws exception if the requested range cannot be got from the pool.
     *
     * @param prefix prefix range to retrieve
     */
    public getMultipleCidrRanges(prefix: IPv4Prefix | IPv6Prefix): IPv4CidrRange[] | IPv6CidrRange[]  {
        throw new Error();
    }

    /**
     * Returns the size of IP numbers in the pool
     */
    public getSize():  bigInt.BigInteger {
        return this
            .aggregate()
            .getRanges()
            .reduce((previous, current) => {
            return previous.plus(current.getSize());
        }, bigInt.zero);
    }

    /**
     * Empties the pool and fill it with given ranges
     *
     * @param ipRanges the range to fill the pool with after emptying
     */
    public resetWith(ipRanges: Array<RangedSet<IPv4 | IPv6>>) {
        this.backingSet.clear();
        this.backingSet = this.backingSet.add(ipRanges);
    }

    /**
     * Removes the given range from the pool.
     * It is a Noop, if the given range does not exist in the pool
     * @param rangeToRemove range to remove from ppol
     */
    public removeExact(rangeToRemove: RangedSet<IPv4 | IPv6>) {
        this.backingSet = this.backingSet.removeExact(rangeToRemove);
    }

    public removeOverlapping(rangeToRemove: RangedSet<IPv4 | IPv6>) {
        this.backingSet = this.backingSet.removeOverlapping(rangeToRemove);
    }

    public add(range: Array<RangedSet<IPv4 | IPv6>>) {
        this.backingSet = this.backingSet.add(range);
    }

    public clear() {
        this.backingSet.clear();
    }
}

type T = RangedSet<IPv4 | IPv6>;
class SortedSet {

    public backingArray: Array<T>;

    private sortArray(array: Array<T>): Array<T> {
        array.sort((a:T, b:T) => {
            if (a.isLessThan(b)) {
                return -1;
            }
            if (a.isGreaterThan(b)) {
                return 1;
            }
            return 0;
        });

        return array;
    }

    constructor()
    constructor(array: Array<T>)
    constructor(array?: Array<T>) {
        if (array) {
            this.backingArray = this.sortArray(array);
        } else {
            this.backingArray = new Array<T>()
        }
    }

    public asArray(): Array<T> {
        return this.backingArray;
    }

    public add(item: Array<T>): SortedSet;
    public add(item: T): SortedSet;
    public add(item: T | Array<T>): SortedSet {
        let array = this.backingArray;
        if("push" in item) {
            array = array.concat(item);
        } else {
            array.push(item);
        }
        return new SortedSet(this.sortArray(array));
    }

    public removeExact(items: Array<T>): SortedSet;
    public removeExact(items: T): SortedSet;
    public removeExact(items: T | Array<T>): SortedSet {

        let filtered = this.backingArray
            .filter(currentItem => {
                if ("push" in items) {
                    return items.find(item => item.isEquals(currentItem)) !== undefined;
                } else {
                    return !items.isEquals(currentItem);
                }
            });

        return new SortedSet(this.sortArray(filtered));
    }

    public removeOverlapping(items: Array<T>): SortedSet;
    public removeOverlapping(items: T): SortedSet;
    public removeOverlapping(items: T | Array<T>): SortedSet {

        let filtered:Array<RangedSet<IPv4 | IPv6>> = this.backingArray
            .flatMap(backingItem => {

                if ("push" in items) {

                    return items.flatMap(item => {
                        if (backingItem.contains(item)) {
                            return backingItem.difference(item);
                        } else if (backingItem.inside(item)) {
                            return new Array<RangedSet<IPv4 | IPv6>>();
                        } else if (backingItem.isOverlapping(item)) {
                            return [backingItem.subtract(item)];
                        } else {
                            return [item];
                        }
                    });

                } else {
                    return backingItem.difference(items);
                }
            });

        return new SortedSet(this.sortArray(filtered));
    }

    public clear() {
        this.backingArray = [];
    }
}