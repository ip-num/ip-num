"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractIpRange = void 0;
var bigInt = require("big-integer");
/**
 * Provides the implementation of functionality that are common to {@link IPRange}s
 */
var AbstractIpRange = /** @class */ (function () {
    function AbstractIpRange() {
    }
    AbstractIpRange.prototype.getSize = function () {
        /**
         * Using bitwise shit operation this will be
         * 1 << (this.bitValue - this.prefix.getValue())
         * Since left shift a number by x is equivalent to multiplying the number by the power x raised to 2
         * 2 << 4 = 2 * (2 raised to 4)
         */
        return bigInt(2).pow(this.bitValue.minus(bigInt(this.cidrPrefix.getValue())));
    };
    AbstractIpRange.prototype.inside = function (otherRange) {
        var thisFirst = this.getFirst();
        var thisLast = this.getLast();
        var otherFirst = otherRange.getFirst();
        var otherLast = otherRange.getLast();
        return (otherFirst.isLessThanOrEquals(thisFirst) && otherLast.isGreaterThanOrEquals(thisLast));
    };
    AbstractIpRange.prototype.contains = function (otherRange) {
        var thisFirst = this.getFirst();
        var thisLast = this.getLast();
        var otherFirst = otherRange.getFirst();
        var otherLast = otherRange.getLast();
        return (thisFirst.isLessThanOrEquals(otherFirst) && thisLast.isGreaterThanOrEquals(otherLast));
    };
    AbstractIpRange.prototype.isOverlapping = function (otherRange) {
        var thisFirst = this.getFirst();
        var thisLast = this.getLast();
        var otherFirst = otherRange.getFirst();
        var otherLast = otherRange.getLast();
        return (thisLast.isGreaterThan(otherFirst) && thisLast.isLessThanOrEquals(otherLast) && thisFirst.isLessThan(otherFirst)
            ||
                otherLast.isGreaterThan(thisFirst) && otherLast.isLessThanOrEquals(thisLast) && otherFirst.isLessThan(otherFirst));
    };
    AbstractIpRange.prototype.isConsecutive = function (otherRange) {
        var thisFirst = this.getFirst();
        var thisLast = this.getLast();
        var otherFirst = otherRange.getFirst();
        var otherLast = otherRange.getLast();
        return (thisLast.hasNext() && thisLast.nextIPNumber().isEquals(otherFirst)
            ||
                otherLast.hasNext() && otherLast.nextIPNumber().isEquals(thisFirst));
    };
    AbstractIpRange.prototype.hasNextRange = function () {
        var sizeOfCurrentRange = this.getSize();
        return bigInt(2).pow(this.bitValue)
            .minus(sizeOfCurrentRange)
            .greaterOrEquals(this.getFirst().getValue().plus(sizeOfCurrentRange));
    };
    AbstractIpRange.prototype.hasPreviousRange = function () {
        return this.getSize()
            .lesserOrEquals(this.getFirst().getValue());
    };
    return AbstractIpRange;
}());
exports.AbstractIpRange = AbstractIpRange;
//# sourceMappingURL=AbstractIpRange.js.map