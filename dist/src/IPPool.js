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
exports.Pool = void 0;
var IPRange_1 = require("./IPRange");
var Prefix_1 = require("./Prefix");
var bigInt = require("big-integer");
/**
 * Represents a collection of IP {@link RangedSet}'s
 */
var Pool = /** @class */ (function () {
    /**
     * Constructor for an IP pool.
     *
     * Creates a Pool of IP ranges from supplied {@link RangedSet}'s
     *
     * @param ranges the array of IP ranges that would make up the pool.
     */
    function Pool(ranges) {
        var _this = this;
        this.backingSet = new SortedSet();
        ranges.forEach(function (range) {
            _this.backingSet.add(range);
        });
    }
    /**
     * Convenient method for creating an instance from arrays of {@link IPv4} or {@link IPv6}
     * @param ipNumbers the arrays of {@link IPv4} or {@link IPv6} that will make up the pool.
     */
    Pool.fromIPNumbers = function (ipNumbers) {
        var ranges = ipNumbers.map(function (ip) {
            return IPRange_1.RangedSet.fromSingleIP(ip);
        });
        return new Pool(ranges);
    };
    /**
     * Convenient method for creating an instance from arrays of {@link RangedSet}.
     *
     * @param ipRanges the arrays of {@link RangedSet}'s that will make up the pool.
     */
    // TODO: TSE: This makes it possible to create an instance containing both Range set of IPv4 and IPv6
    Pool.fromRangeSet = function (ipRanges) {
        return new Pool(ipRanges);
    };
    /**
     * Convenient method for creating an instance from arrays of {@link IPv4CidrRange} or {@link IPv6CidrRange}.
     *
     * @param cidrRanges the arrays of {@link IPv4CidrRange} or {@link IPv6CidrRange} that will make up the pool.
     */
    Pool.fromCidrRanges = function (cidrRanges) {
        var cidr = cidrRanges;
        var rangeSet = cidr.map(function (range) {
            return range.toRangeSet();
        });
        return new Pool(rangeSet);
    };
    /**
     * Returns an array of {@link RangedSet}'s that is contained within the pool
     */
    Pool.prototype.getRanges = function () {
        return this.backingSet.asArray();
    };
    /**
     * Returns an new {@link Pool} with all the IP ranges aggregated
     */
    Pool.prototype.aggregate = function () {
        var sortedRanges = this.backingSet.asArray();
        var mergedRanges = sortedRanges.reduce(function (accumulator, currentRange, currentIndex, array) {
            if (accumulator.length == 0) {
                accumulator.push(currentRange);
                return accumulator;
            }
            else {
                var previous = accumulator.pop();
                var previousCidrRange = previous.toCidrRange();
                var currentCidrRange = currentRange.toCidrRange();
                if (previousCidrRange.isCidrMergeable(currentCidrRange)) {
                    var merged = previousCidrRange.merge(currentCidrRange);
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
        var aggregatedPool = Pool.fromRangeSet(mergedRanges);
        if (aggregatedPool.getRanges().length !== this.getRanges().length) {
            return aggregatedPool.aggregate();
        }
        else {
            return aggregatedPool;
        }
    };
    /**
     * Gets a single range of size of the given prefix from pool.
     * Only returns a range if there is a single range in the pool of same size or greater than given prefix.
     *
     * throws exception if the requested range cannot be got from the pool.
     *
     * @param prefix prefix range to retrieve
     * TODO TSE
     */
    Pool.prototype.getCidrRange = function (prefix) {
        var e_1, _a;
        if (prefix.toRangeSize().gt(this.getSize())) {
            throw new Error("Not enough IP number in the pool for requested prefix: " + prefix);
        }
        var selectedCidrRange;
        var error;
        try {
            loop: for (var _b = __values(this.getRanges()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var range = _c.value;
                for (var offset = bigInt.zero; offset.plus(prefix.toRangeSize()).lesserOrEquals(range.getSize()); offset = offset.plus(bigInt.one))
                    try {
                        var selectedRange = range.takeSubRange(offset, prefix.toRangeSize());
                        selectedCidrRange = selectedRange.toCidrRange();
                        var remaining = range.difference(selectedRange);
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
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (selectedCidrRange) {
            return selectedCidrRange;
        }
        else {
            throw (error === undefined ? new Error("No range big enough in the pool for requested prefix: " + prefix) : error);
        }
    };
    /**
     * Gets a single or multiple ranges that fulfils the given prefix from the pool.
     *
     * throws exception if the requested range cannot be got from the pool.
     *
     * @param reqprefix prefix range to retrieve
     */
    Pool.prototype.getCidrRanges = function (reqprefix) {
        var _this = this;
        if (reqprefix.toRangeSize().greater(this.getSize())) {
            throw new Error("Prefix greater than pool");
        }
        var go = function (reqprefix, prefix, accummulated) {
            try {
                var singleCidrRange = _this.getCidrRange(prefix);
                accummulated.push(singleCidrRange);
                var currentSize = accummulated.reduce(function (previous, current) {
                    return previous.plus(current.getSize());
                }, bigInt.zero);
                if (reqprefix.toRangeSize().equals(currentSize)) {
                    return accummulated;
                }
                else {
                    return go(reqprefix, prefix, accummulated);
                }
            }
            catch (e) {
                var lowerPrefix = Prefix_1.isIPv4Prefix(prefix) ?
                    Prefix_1.IPv4Prefix.fromNumber(prefix.getValue() + 1) : Prefix_1.IPv6Prefix.fromNumber(prefix.getValue() + 1);
                return go(reqprefix, lowerPrefix, accummulated);
            }
        };
        return go(reqprefix, reqprefix, []);
    };
    /**
     * Returns the size of IP numbers in the pool
     */
    Pool.prototype.getSize = function () {
        return this
            .aggregate()
            .getRanges()
            .reduce(function (previous, current) {
            return previous.plus(current.getSize());
        }, bigInt.zero);
    };
    /**
     * Empties the pool and fill it with given ranges
     *
     * @param ipRanges the range to fill the pool with after emptying
     */
    Pool.prototype.resetWith = function (ipRanges) {
        this.backingSet.clear();
        this.backingSet = this.backingSet.add(ipRanges);
    };
    /**
     * Removes the given range from the pool. It only removes if the exact range exist in the pool.
     * It is a Noop and returns false, if the given range does not exist in the pool. Returns true otherwise
     *
     * @param rangeToRemove range to remove from ppol
     */
    Pool.prototype.removeExact = function (rangeToRemove) {
        var updatedSet = this.backingSet.removeExact(rangeToRemove);
        var isUpdated = !this.backingSet.isEquals(updatedSet);
        this.backingSet = updatedSet;
        return isUpdated;
    };
    /**
     * Removes the given range from the pool. If the given range overlaps, then it removes the overlapping portion.
     * It is a Noop and returns false, if the given range does not exist in the pool. Returns true otherwise
     *
     * @param rangeToRemove range to remove from ppol
     */
    Pool.prototype.removeOverlapping = function (rangeToRemove) {
        var updatedSet = this.backingSet.removeOverlapping(rangeToRemove);
        var isUpdated = !this.backingSet.isEquals(updatedSet);
        this.backingSet = updatedSet;
        return isUpdated;
    };
    /**
     * Adds the given range to the pool.
     *
     * @param range to add to pool.
     */
    Pool.prototype.add = function (range) {
        this.backingSet = this.backingSet.add(range);
    };
    /**
     * Removes all ranges from pool
     */
    Pool.prototype.clear = function () {
        this.backingSet.clear();
    };
    return Pool;
}());
exports.Pool = Pool;
var SortedSet = /** @class */ (function () {
    function SortedSet(array) {
        if (array) {
            this.backingArray = this.sortArray(array);
        }
        else {
            this.backingArray = new Array();
        }
    }
    SortedSet.prototype.sortArray = function (array) {
        array.sort(function (a, b) {
            if (a.isLessThan(b)) {
                return -1;
            }
            if (a.isGreaterThan(b)) {
                return 1;
            }
            return 0;
        });
        return array;
    };
    SortedSet.prototype.asArray = function () {
        return this.backingArray;
    };
    SortedSet.prototype.isEquals = function (other) {
        if (this.backingArray.length !== other.asArray().length) {
            return false;
        }
        return this.backingArray.every(function (value, index) {
            return value.getSize().equals(other.asArray()[index].getSize());
        });
    };
    SortedSet.prototype.add = function (item) {
        var array = this.backingArray;
        if ("push" in item) {
            array = array.concat(item);
        }
        else {
            array.push(item);
        }
        return new SortedSet(this.sortArray(array));
    };
    SortedSet.prototype.removeExact = function (items) {
        var filtered = this.backingArray
            .filter(function (currentItem) {
            if ("push" in items) {
                return items.find(function (item) { return item.isEquals(currentItem); }) !== undefined;
            }
            else {
                return !items.isEquals(currentItem);
            }
        });
        return new SortedSet(this.sortArray(filtered));
    };
    SortedSet.prototype.removeOverlapping = function (items) {
        var filtered = this.backingArray
            .flatMap(function (backingItem) {
            if ("push" in items) {
                return items.flatMap(function (item) {
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
    };
    SortedSet.prototype.clear = function () {
        this.backingArray = [];
    };
    return SortedSet;
}());
//# sourceMappingURL=IPPool.js.map