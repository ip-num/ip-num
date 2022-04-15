"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pool = void 0;
const IPRange_1 = require("./IPRange");
const Prefix_1 = require("./Prefix");
/**
 * Represents a collection of IP {@link RangedSet}'s
 */
class Pool {
    /**
     * Constructor for an IP pool.
     *
     * Creates a Pool of IP ranges from supplied {@link RangedSet}'s
     *
     * @param ranges the array of IP ranges that would make up the pool.
     */
    constructor(ranges) {
        this.backingSet = new SortedSet();
        ranges.forEach(range => {
            this.backingSet.add(range);
        });
    }
    /**
     * Convenient method for creating an instance from arrays of {@link IPv4} or {@link IPv6}
     * @param ipNumbers the arrays of {@link IPv4} or {@link IPv6} that will make up the pool.
     */
    static fromIP(ipNumbers) {
        let ranges = ipNumbers.map((ip) => {
            return IPRange_1.RangedSet.fromSingleIP(ip);
        });
        return new Pool(ranges);
    }
    /**
     * Convenient method for creating an instance from arrays of {@link RangedSet}.
     *
     * @param ipRanges the arrays of {@link RangedSet}'s that will make up the pool.
     */
    // TODO: TSE: This makes it possible to create an instance containing both Range set of IPv4 and IPv6
    static fromRangeSet(ipRanges) {
        return new Pool(ipRanges);
    }
    /**
     * Convenient method for creating an instance from arrays of {@link IPv4CidrRange} or {@link IPv6CidrRange}.
     *
     * @param cidrRanges the arrays of {@link IPv4CidrRange} or {@link IPv6CidrRange} that will make up the pool.
     */
    static fromCidrRanges(cidrRanges) {
        let cidr = cidrRanges;
        let rangeSet = cidr.map((range) => {
            return range.toRangeSet();
        });
        return new Pool(rangeSet);
    }
    /**
     * Returns an array of {@link RangedSet}'s that is contained within the pool
     */
    getRanges() {
        return this.backingSet.asArray();
    }
    /**
     * Returns an new {@link Pool} with all the IP ranges aggregated
     */
    aggregate() {
        let sortedRanges = this.backingSet.asArray();
        let mergedRanges = sortedRanges.reduce((accumulator, currentRange, currentIndex, array) => {
            if (accumulator.length == 0) {
                accumulator.push(currentRange);
                return accumulator;
            }
            else {
                let previous = accumulator.pop();
                let previousCidrRange = previous.toCidrRange();
                let currentCidrRange = currentRange.toCidrRange();
                if (previousCidrRange.isCidrMergeable(currentCidrRange)) {
                    let merged = previousCidrRange.merge(currentCidrRange);
                    accumulator.push(merged.toRangeSet());
                    return accumulator;
                }
                else {
                    if (!previous.contains(currentRange)) {
                        accumulator.push(previous);
                        accumulator.push(currentRange);
                    }
                    else {
                        accumulator.push(previous);
                    }
                    return accumulator;
                }
            }
        }, []);
        let aggregatedPool = Pool.fromRangeSet(mergedRanges);
        if (aggregatedPool.getRanges().length !== this.getRanges().length) {
            return aggregatedPool.aggregate();
        }
        else {
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
     * TODO TSE
     */
    getCidrRange(prefix) {
        if (prefix.toRangeSize() > (this.getSize())) {
            throw new Error(`Not enough IP number in the pool for requested prefix: ${prefix}`);
        }
        let selectedCidrRange;
        let error;
        loop: for (let range of this.getRanges()) {
            for (let offset = 0n; offset + (prefix.toRangeSize()) <= (range.getSize()); offset = offset + 1n)
                try {
                    let selectedRange = range.takeSubRange(offset, prefix.toRangeSize());
                    selectedCidrRange = selectedRange.toCidrRange();
                    let remaining = range.difference(selectedRange);
                    this.removeExact(range);
                    this.add(remaining);
                    break loop;
                }
                catch (e) {
                    if (e instanceof RangeError) {
                        continue loop;
                    }
                    error = e;
                }
        }
        if (selectedCidrRange) {
            return selectedCidrRange;
        }
        else {
            throw (error === undefined ? new Error(`No range big enough in the pool for requested prefix: ${prefix}`) : error);
        }
    }
    /**
     * Gets a single or multiple ranges that fulfils the given prefix from the pool.
     *
     * throws exception if the requested range cannot be got from the pool.
     *
     * @param reqprefix prefix range to retrieve
     */
    getCidrRanges(reqprefix) {
        if (reqprefix.toRangeSize() > (this.getSize())) {
            throw new Error("Prefix greater than pool");
        }
        let go = (reqprefix, prefix, accummulated) => {
            try {
                let singleCidrRange = this.getCidrRange(prefix);
                accummulated.push(singleCidrRange);
                let currentSize = accummulated.reduce((previous, current) => {
                    return previous + (current.getSize());
                }, 0n);
                if (reqprefix.toRangeSize() === (currentSize)) {
                    return accummulated;
                }
                else {
                    return go(reqprefix, prefix, accummulated);
                }
            }
            catch (e) {
                let lowerPrefix = Prefix_1.isIPv4Prefix(prefix) ?
                    Prefix_1.IPv4Prefix.fromNumber(prefix.getValue() + 1n) : Prefix_1.IPv6Prefix.fromNumber(prefix.getValue() + 1n);
                return go(reqprefix, lowerPrefix, accummulated);
            }
        };
        return go(reqprefix, reqprefix, []);
    }
    /**
     * Returns the size of IP numbers in the pool
     */
    getSize() {
        return this
            .aggregate()
            .getRanges()
            .reduce((previous, current) => {
            return previous + current.getSize();
        }, 0n);
    }
    /**
     * Empties the pool and fill it with given ranges
     *
     * @param ipRanges the range to fill the pool with after emptying
     */
    resetWith(ipRanges) {
        this.backingSet.clear();
        this.backingSet = this.backingSet.add(ipRanges);
    }
    /**
     * Removes the given range from the pool. It only removes if the exact range exist in the pool.
     * It is a Noop and returns false, if the given range does not exist in the pool. Returns true otherwise
     *
     * @param rangeToRemove range to remove from ppol
     */
    removeExact(rangeToRemove) {
        let updatedSet = this.backingSet.removeExact(rangeToRemove);
        let isUpdated = !this.backingSet.isEquals(updatedSet);
        this.backingSet = updatedSet;
        return isUpdated;
    }
    /**
     * Removes the given range from the pool. If the given range overlaps, then it removes the overlapping portion.
     * It is a Noop and returns false, if the given range does not exist in the pool. Returns true otherwise
     *
     * @param rangeToRemove range to remove from ppol
     */
    removeOverlapping(rangeToRemove) {
        let updatedSet = this.backingSet.removeOverlapping(rangeToRemove);
        let isUpdated = !this.backingSet.isEquals(updatedSet);
        this.backingSet = updatedSet;
        return isUpdated;
    }
    /**
     * Adds the given range to the pool.
     *
     * @param range to add to pool.
     */
    add(range) {
        this.backingSet = this.backingSet.add(range);
    }
    /**
     * Removes all ranges from pool
     */
    clear() {
        this.backingSet.clear();
    }
}
exports.Pool = Pool;
class SortedSet {
    constructor(array) {
        if (array) {
            this.backingArray = this.sortArray(array);
        }
        else {
            this.backingArray = new Array();
        }
    }
    sortArray(array) {
        array.sort((a, b) => {
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
    asArray() {
        return this.backingArray;
    }
    isEquals(other) {
        if (this.backingArray.length !== other.asArray().length) {
            return false;
        }
        return this.backingArray.every((value, index) => {
            return value.getSize() === (other.asArray()[index].getSize());
        });
    }
    add(item) {
        let array = this.backingArray;
        if ("push" in item) {
            array = array.concat(item);
        }
        else {
            array.push(item);
        }
        return new SortedSet(this.sortArray(array));
    }
    removeExact(items) {
        let filtered = this.backingArray
            .filter(currentItem => {
            if ("push" in items) {
                return items.find(item => item.isEquals(currentItem)) !== undefined;
            }
            else {
                return !items.isEquals(currentItem);
            }
        });
        return new SortedSet(this.sortArray(filtered));
    }
    removeOverlapping(items) {
        let filtered = this.backingArray
            .flatMap(backingItem => {
            if ("push" in items) {
                return items.flatMap(item => {
                    if (backingItem.contains(item)) {
                        return backingItem.difference(item);
                    }
                    else if (backingItem.inside(item)) {
                        return new Array();
                    }
                    else if (backingItem.isOverlapping(item)) {
                        return [backingItem.subtract(item)];
                    }
                    else {
                        return [item];
                    }
                });
            }
            else {
                try {
                    return backingItem.difference(items);
                }
                catch (e) {
                    return backingItem;
                }
            }
        });
        return new SortedSet(this.sortArray(filtered));
    }
    clear() {
        this.backingArray = [];
    }
}
//# sourceMappingURL=IPPool.js.map