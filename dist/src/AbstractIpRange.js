"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var bigInt = require("big-integer");
/**
 * Provides the implementation of functionality that are common to {@link IPRange}s
 */
var AbstractIpRange = /** @class */ (function () {
    function AbstractIpRange() {
    }
    AbstractIpRange.prototype.toRangeString = function () {
        return this.getFirst() + "-" + this.getLast();
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
    AbstractIpRange.prototype.toRange = function () {
        return new Range(this.getFirst(), this.getLast());
    };
    /**
     * Returns a lazily evaluated representation of the IP range that produces IP numbers by either:
     *
     * - iterating over using the for of syntax
     * - converting to array using spread syntax
     * - or assigning values to variables using deconstruction
     *
     * @param count the number of IP numbers to lazily evaluate.
     * If none is given, the whole IP range is lazily returned.
     */
    AbstractIpRange.prototype.takeStream = function (count) {
        var computed, returnCount;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    computed = this.getFirst();
                    returnCount = count === undefined ? this.getSize().valueOf() : count;
                    _a.label = 1;
                case 1:
                    if (!(returnCount > 0)) return [3 /*break*/, 3];
                    returnCount--;
                    return [4 /*yield*/, computed];
                case 2:
                    _a.sent();
                    computed = computed.nextIPNumber();
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/];
            }
        });
    };
    AbstractIpRange.prototype[Symbol.iterator] = function () {
        var lastValue, returnValue;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    lastValue = this.getLast();
                    returnValue = this.getFirst();
                    _a.label = 1;
                case 1:
                    if (!returnValue.isLessThanOrEquals(lastValue)) return [3 /*break*/, 3];
                    return [4 /*yield*/, returnValue];
                case 2:
                    _a.sent();
                    returnValue = returnValue.nextIPNumber();
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/];
            }
        });
    };
    return AbstractIpRange;
}());
exports.AbstractIpRange = AbstractIpRange;
var Range = /** @class */ (function (_super) {
    __extends(Range, _super);
    function Range(first, last) {
        var _this = _super.call(this) || this;
        _this.first = first;
        _this.last = last;
        _this.bitValue = bigInt(first.bitSize);
        return _this;
    }
    Range.prototype.getFirst = function () {
        return this.first;
    };
    Range.prototype.getLast = function () {
        return this.last;
    };
    Range.prototype.getSize = function () {
        return this.last.getValue().minus(this.first.getValue());
    };
    Range.prototype.take = function (count) {
        var computed, returnCount;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    computed = this.getFirst();
                    returnCount = count === undefined ? this.getSize().plus(1).valueOf() : count;
                    _a.label = 1;
                case 1:
                    if (!(returnCount > 0)) return [3 /*break*/, 3];
                    returnCount--;
                    return [4 /*yield*/, computed];
                case 2:
                    _a.sent();
                    computed = computed.nextIPNumber();
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/];
            }
        });
    };
    // should there be a intermediate class AbstractCidrRanger where toCiderString can move to?
    Range.prototype.toCidrString = function () {
        return "";
    };
    return Range;
}(AbstractIpRange));
exports.Range = Range;
//# sourceMappingURL=AbstractIpRange.js.map