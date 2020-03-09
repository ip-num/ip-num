import {Range} from "./IPRange";
import {IPv4, IPv6} from "./IPNumber";
import {Prefix} from "./Prefix";

/**
 * Represents a collection of IP {@link Range}'s
 */
export class Pool<T extends Range<IPv4 | IPv6>> {
    private backingSet: SortedSet<Range<IPv4 | IPv6>> = new SortedSet();

    /**
     * Convenient method for creating an instance from arrays of {@link IPv4} or {@link IPv6}
     * @param ipNumbers the arrays of {@link IPv4} or {@link IPv6} that will make up the pool.
     */
    public static fromIPNumbers(ipNumbers: Array<IPv4 | IPv6>): Pool<Range<IPv4 | IPv6>> {
        let ranges: Array<Range<IPv4 | IPv6>> = ipNumbers.map((ip:IPv4 | IPv6) => {
            return Range.fromSingleIP(ip);
        });

        return new Pool(ranges);
    }

    /**
     * Convenient method for creating an instance from arrays of {@link Range}.
     *
     * @param ipRanges the arrays of {@link Range}'s that will make up the pool.
     */
    public static fromIPRanges(ipRanges: Array<Range<IPv4 | IPv6>>): Pool<Range<IPv4 | IPv6>> {
        return new Pool(ipRanges);
    }

    /**
     * Constructor for an IP pool.
     *
     * Creates a Pool of IP ranges from supplied {@link Range}'s
     *
     * @param ranges the array of IP ranges that would make up the pool.
     */
    constructor(ranges: Array<Range<IPv4 | IPv6>>) {
        ranges.forEach(range => {
            this.backingSet.add(range);
        })
    }

    /**
     * Returns an array of {@link Range}'s that is contained within the pool
     */
    public getRanges(): Array<Range<IPv4 | IPv6>> {
        return this.backingSet.asArray();
    }

    /**
     * Returns an new {@link Pool} with all the IP ranges aggregated
     */
    public aggregate(): Pool<T> {
        let sortedRanges:Array<Range<IPv4 | IPv6>> = this.backingSet.asArray();
        let mergedRanges = sortedRanges.reduce<Array<Range<IPv4 | IPv6>>>
        ((accumulator:Array<Range<IPv4 | IPv6>>, currentRange: Range<IPv4 | IPv6>, currentIndex: number, array: Range<IPv4 | IPv6>[]) => {
            if (accumulator.length == 0) {
                accumulator.push(currentRange);
                return accumulator;
            } else {
                let previous = accumulator.pop()!;
                let previousCidrRange = previous.toCidrRange();
                let currentCidrRange = currentRange.toCidrRange();

                if (previousCidrRange.isCidrMergeable(currentCidrRange)) {
                    let merged = previousCidrRange.merge(currentCidrRange);
                    accumulator.push(merged.toRange());
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

        let aggregatedPool = Pool.fromIPRanges(mergedRanges);
        if (aggregatedPool.getRanges().length !== this.getRanges().length) {
            return aggregatedPool.aggregate();
        } else {
            return aggregatedPool;
        }
    }

    public resetWith(ipRanges: Array<Range<IPv4 | IPv6>>) {
        this.backingSet.clear();
        this.backingSet = this.backingSet.add(ipRanges);
    }

    public clear() {
        this.backingSet.clear();
    }
}

class SortedSet<T extends Range<IPv4 | IPv6>> {
    private backingArray: Array<T>;

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

    public add(item: Array<T>): SortedSet<T>;
    public add(item: T): SortedSet<T>;
    public add(item: T | Array<T>): SortedSet<T> {
        let array = this.backingArray;
        if("push" in item) {
            array = array.concat(item);
        } else {
            array.push(item);
        }
        return new SortedSet(this.sortArray(array));
    }

    public clear() {
        this.backingArray = [];
    }
}