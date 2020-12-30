"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
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
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
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
exports.IPv6CidrRange = exports.IPv4CidrRange = exports.AbstractIPRange = exports.RangedSet = void 0;
var bigInt = require("big-integer");
var IPNumber_1 = require("./IPNumber");
var IPNumber_2 = require("./IPNumber");
var Prefix_1 = require("./Prefix");
var BinaryUtils_1 = require("./BinaryUtils");
var BinaryUtils_2 = require("./BinaryUtils");
var Validator_1 = require("./Validator");
var Prefix_2 = require("./Prefix");
/**
 * Represents a continuous segment of either IPv4 or IPv6 numbers
 * without adhering to classless inter-domain routing scheme
 * for allocating IP addresses.
 */
var RangedSet = /** @class */ (function () {
    /**
     * Constructor for an instance of {@link RangedSet} from an
     * instance of either {@link IPv4CidrRange} or {@link IPv6CidrRange}
     *
     * Throws an exception if first IP number is not less than given last IP number
     *
     * @param first the first IP number of the range
     * @param last the last IP number of the range
     */
    function RangedSet(first, last) {
        this.first = first;
        this.last = last;
        if (first.isGreaterThan(last)) {
            throw new Error(first.toString() + " should be lower than " + last.toString());
        }
        this.currentValue = first;
        this.bitValue = bigInt(first.bitSize);
    }
    /**
     * Convenience method for constructing an instance of {@link RangedSet} from a
     * single IP number.
     *
     * @param ip The IP number, either IPv4 or IPv6 to construct the range from.
     */
    RangedSet.fromSingleIP = function (ip) {
        return new RangedSet(ip, ip);
    };
    /**
     * Convenience method for constructing an instance of {@link RangedSet} from an
     * instance of either {@link IPv4CidrRange} or {@link IPv6CidrRange}
     *
     * @param cidrRange an instance of {@link RangedSet}
     */
    RangedSet.fromCidrRange = function (cidrRange) {
        return new RangedSet(cidrRange.getFirst(), cidrRange.getLast());
    };
    /**
     * Convenience method for constructing an instance of {@link RangedSet} from
     * a range string in the form of firstIp-lastIp
     *
     * @param rangeString  string in the form of firstIp-lastIp
     */
    RangedSet.fromRangeString = function (rangeString) {
        var ips = rangeString.split("-").map(function (ip) { return ip.trim(); });
        if (ips.length !== 2) {
            throw new Error("Argument should be in the format firstip-lastip");
        }
        var _a = __read(ips, 2), firstIPString = _a[0], lastIPString = _a[1];
        var _b = __read(Validator_1.Validator.isValidIPv4String(firstIPString), 1), isValidFirstIPv4 = _b[0];
        var _c = __read(Validator_1.Validator.isValidIPv4String(lastIPString), 1), isValidSecondIPv4 = _c[0];
        var _d = __read(Validator_1.Validator.isValidIPv6String(firstIPString), 1), isValidFirstIPv6 = _d[0];
        var _e = __read(Validator_1.Validator.isValidIPv6String(lastIPString), 1), isValidLastIPv6 = _e[0];
        if (isValidFirstIPv4 && isValidSecondIPv4) {
            return new RangedSet(IPNumber_2.IPv4.fromDecimalDottedString(firstIPString), IPNumber_2.IPv4.fromDecimalDottedString(lastIPString));
        }
        else if (isValidFirstIPv6 && isValidLastIPv6) {
            return new RangedSet(IPNumber_1.IPv6.fromHexadecimalString(firstIPString), IPNumber_1.IPv6.fromHexadecimalString(lastIPString));
        }
        else {
            throw new Error("First IP and Last IP should be valid and same type");
        }
    };
    /**
     * Returns the first IP number in the range
     */
    RangedSet.prototype.getFirst = function () {
        return this.first;
    };
    /**
     * Returns the last IP number in the range
     */
    RangedSet.prototype.getLast = function () {
        return this.last;
    };
    /**
     * Returns the size, which is the number of IP numbers in the range.
     */
    RangedSet.prototype.getSize = function () {
        return this.last.getValue().minus(this.first.getValue()).plus(bigInt.one);
    };
    /**
     * Converts to a string representation of the range in the form of:
     * <first-ip>-<last-ip>
     */
    RangedSet.prototype.toRangeString = function () {
        return this.getFirst() + "-" + this.getLast();
    };
    /**
     * Checks if this range is inside another range.
     *
     * @param otherRange the other range to check if this range is inside of.
     */
    RangedSet.prototype.inside = function (otherRange) {
        return otherRange.contains(this);
    };
    /**
     * Checks if this range contains the given other range.
     *
     * @param otherRange the other range to check if this range contains
     */
    RangedSet.prototype.contains = function (otherRange) {
        var thisFirst = this.getFirst();
        var thisLast = this.getLast();
        var otherFirst = otherRange.getFirst();
        var otherLast = otherRange.getLast();
        return (thisFirst.isLessThanOrEquals(otherFirst) && thisLast.isGreaterThanOrEquals(otherLast));
    };
    /**
     * Check if this range is equal to the given other range.
     *
     * @param otherRange the other range to check if equal to this range.
     */
    RangedSet.prototype.isEquals = function (otherRange) {
        return this.getFirst().isEquals(otherRange.getFirst())
            && this.getLast().isEquals(otherRange.getLast());
    };
    ;
    /**
     * Check if this range is less than the given range.
     *
     * @param otherRange the other range to check if less than.
     */
    RangedSet.prototype.isLessThan = function (otherRange) {
        if (this.isEquals(otherRange)) {
            return false;
        }
        else {
            if (this.getFirst().isEquals(otherRange.getFirst())) {
                return this.getSize().lesser(otherRange.getSize());
            }
            return this.getFirst().isLessThan(otherRange.getFirst());
        }
    };
    /**
     * Check if this range is greater than the given range.
     *
     * @param otherRange the other range to check if greater than.
     */
    RangedSet.prototype.isGreaterThan = function (otherRange) {
        if (this.isEquals(otherRange)) {
            return false;
        }
        else {
            if (this.getFirst().isEquals(otherRange.getFirst())) {
                return this.getSize().greater(otherRange.getSize());
            }
            return this.getFirst().isGreaterThan(otherRange.getFirst());
        }
    };
    /**
     * Checks of this range overlaps with a given other range.
     *
     * This means it checks if part of a range is part of another range without
     * being totally contained in the other range. Hence Equal or ranges contained inside one
     * another are not considered as overlapping.
     *
     * @param otherRange the other range to check if it overlaps with this range.
     */
    RangedSet.prototype.isOverlapping = function (otherRange) {
        var thisFirst = this.getFirst();
        var thisLast = this.getLast();
        var otherFirst = otherRange.getFirst();
        var otherLast = otherRange.getLast();
        return (thisLast.isGreaterThan(otherFirst) && thisLast.isLessThanOrEquals(otherLast) && thisFirst.isLessThan(otherFirst)
            ||
                otherLast.isGreaterThan(thisFirst) && otherLast.isLessThanOrEquals(thisLast) && otherFirst.isLessThan(thisFirst));
    };
    /**
     * Check if this range can be converted to a CIDR range.
     */
    RangedSet.prototype.isCidrAble = function () {
        try {
            BinaryUtils_1.intLog2(this.getSize());
            return true;
        }
        catch (e) {
            return false;
        }
    };
    /**
     * Converts an instance of range to an instance of CIDR range
     */
    RangedSet.prototype.toCidrRange = function () {
        if (IPNumber_1.isIPv4(this.currentValue)) {
            return this.toIPv4CidrRange();
        }
        else {
            return this.toIPv6CidrRange();
        }
    };
    ;
    /**
     * Checks if this range is consecutive with another range.
     *
     * This means if the two ranges can be placed side by side, without any gap. Hence Equal
     * or ranges contained inside one another, or overlapping ranges are not considered as consecutive.
     *
     * @param otherRange the other range to check if this range is consecutive to.
     */
    RangedSet.prototype.isConsecutive = function (otherRange) {
        var thisFirst = this.getFirst();
        var thisLast = this.getLast();
        var otherFirst = otherRange.getFirst();
        var otherLast = otherRange.getLast();
        return (thisLast.hasNext() && thisLast.nextIPNumber().isEquals(otherFirst)
            ||
                otherLast.hasNext() && otherLast.nextIPNumber().isEquals(thisFirst));
    };
    /**
     * Creates a range that is a union of this range and the given other range.
     *
     * @param otherRange the other range to combine with this range
     */
    RangedSet.prototype.union = function (otherRange) {
        if (this.isEquals(otherRange)) {
            return new RangedSet(otherRange.getFirst(), otherRange.getLast());
        }
        if (this.isOverlapping(otherRange)) {
            if (this.getFirst().isLessThan(otherRange.getFirst())) {
                return new RangedSet(this.getFirst(), otherRange.getLast());
            }
            else {
                return new RangedSet(otherRange.getFirst(), this.getLast());
            }
        }
        if (this.contains(otherRange)) {
            return new RangedSet(this.getFirst(), this.getLast());
        }
        else if (otherRange.contains(this)) {
            return new RangedSet(otherRange.getFirst(), otherRange.getLast());
        }
        throw new Error("Ranges do not overlap nor are equal");
    };
    /**
     * Prepends given range with this range.
     * The last IP in the given range should be adjacent to the first IP in this range
     *
     * @param otherRange the other range to prepend
     */
    RangedSet.prototype.prepend = function (otherRange) {
        if (otherRange.getLast().nextIPNumber().isEquals(this.getFirst())) {
            return new RangedSet(otherRange.getFirst(), this.getLast());
        }
        else {
            throw new Error("Range to prepend must be adjacent");
        }
    };
    /**
     * Appends given range with this range.
     * The last IP in this range should be adjacent to the first IP in range to append
     *
     * @param otherRange the other range to append
     */
    RangedSet.prototype.append = function (otherRange) {
        if (this.getLast().nextIPNumber().isEquals(otherRange.getFirst())) {
            return new RangedSet(this.getFirst(), otherRange.getLast());
        }
        else {
            throw new Error("Range to append must be adjacent");
        }
    };
    RangedSet.prototype.subtract = function (otherRange) {
        if (!this.isOverlapping(otherRange)) {
            throw new Error("Cannot subtract ranges that are not overlapping");
        }
        if (!this.isLessThan(otherRange)) {
            throw new Error("Cannot subtract a larger range from this range");
        }
        return new RangedSet(this.getFirst(), otherRange.getLast());
    };
    /**
     * Returns a sub range of a given size from this range.
     *
     * @param offset offset from this range where the subrange should begin
     * @param size the size of the range
     */
    RangedSet.prototype.takeSubRange = function (offset, size) {
        if (offset.plus(size).gt(this.getSize())) {
            throw new RangeError("Requested range is greater than what can be taken");
        }
        if (size.eq(bigInt(0))) {
            throw new Error("Sub range cannot be zero");
        }
        var valueOfFirstIp = this.getFirst().value.plus(offset);
        var firstIp = IPNumber_1.isIPv4(this.getFirst()) ?
            IPNumber_2.IPv4.fromBigInteger(valueOfFirstIp) : IPNumber_1.IPv6.fromBigInteger(valueOfFirstIp);
        var valueOfLastIp = firstIp.value.plus(size.minus(bigInt.one));
        var lastIp = IPNumber_1.isIPv4(firstIp) ? IPNumber_2.IPv4.fromBigInteger(valueOfLastIp) : IPNumber_1.IPv6.fromBigInteger(valueOfLastIp);
        return new RangedSet(firstIp, lastIp);
    };
    /**
     * Performs a subtraction operation, where the passed range is removed from the original range.
     *
     * The return range from the subtraction operation could be a single or multiple ranges
     *
     * @param range
     */
    RangedSet.prototype.difference = function (range) {
        if (range.getSize().gt(this.getSize())) {
            throw new Error("Range is greater than range to be subtracted from");
        }
        if (!this.contains(range)) {
            throw new Error("Range to subtract is not contained in this range");
        }
        var reminders = [];
        try {
            reminders.push(new RangedSet(this.getFirst(), range.getFirst().previousIPNumber()));
        }
        catch (e) { }
        try {
            reminders.push(new RangedSet(range.getLast().nextIPNumber(), this.getLast()));
        }
        catch (e) { }
        return reminders;
    };
    RangedSet.prototype.take = function (count) {
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
    RangedSet.prototype[Symbol.iterator] = function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [5 /*yield**/, __values(this.take())];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    };
    RangedSet.prototype.toIPv4CidrRange = function () {
        var candidateRange = new IPv4CidrRange(IPNumber_2.IPv4.fromBigInteger(this.getFirst().getValue()), Prefix_2.IPv4Prefix.fromRangeSize(this.getSize()));
        if (candidateRange.getFirst().isEquals(this.getFirst())) {
            return candidateRange;
        }
        else {
            throw new Error("Range cannot be converted to CIDR");
        }
    };
    RangedSet.prototype.toIPv6CidrRange = function () {
        var candidateRange = new IPv6CidrRange(IPNumber_1.IPv6.fromBigInteger(this.getFirst().getValue()), Prefix_1.IPv6Prefix.fromRangeSize(this.getSize()));
        if (candidateRange.getFirst().isEquals(this.getFirst())) {
            return candidateRange;
        }
        else {
            throw new Error("Range cannot be converted to CIDR");
        }
    };
    return RangedSet;
}());
exports.RangedSet = RangedSet;
/**
 * Provides the implementation of functionality that are common to {@link IPv4CidrRange} and {@link IPv6CidrRange}
 */
var AbstractIPRange = /** @class */ (function () {
    function AbstractIPRange() {
    }
    AbstractIPRange.prototype.hasNextRange = function () {
        var sizeOfCurrentRange = this.getSize();
        return bigInt(2).pow(this.bitValue)
            .minus(sizeOfCurrentRange)
            .greaterOrEquals(this.getFirst().getValue().plus(sizeOfCurrentRange));
    };
    AbstractIPRange.prototype.hasPreviousRange = function () {
        return this.getSize()
            .lesserOrEquals(this.getFirst().getValue());
    };
    AbstractIPRange.prototype.toRangeSet = function () {
        return new RangedSet(this.getFirst(), this.getLast());
    };
    AbstractIPRange.prototype.inside = function (otherRange) {
        return this.toRangeSet().inside(otherRange.toRangeSet());
    };
    AbstractIPRange.prototype.contains = function (otherRange) {
        return this.toRangeSet().contains(otherRange.toRangeSet());
    };
    AbstractIPRange.prototype.toRangeString = function () {
        return this.toRangeSet().toRangeString();
    };
    AbstractIPRange.prototype.isOverlapping = function (otherRange) {
        return this.toRangeSet().isOverlapping(otherRange.toRangeSet());
    };
    AbstractIPRange.prototype.isConsecutive = function (otherRange) {
        return this.toRangeSet().isConsecutive(otherRange.toRangeSet());
    };
    AbstractIPRange.prototype.isCidrMergeable = function (otherRange) {
        return this.isConsecutive(otherRange) && this.getSize().equals(otherRange.getSize());
    };
    AbstractIPRange.prototype.isMergeable = function (otherRange) {
        return this.isCidrMergeable(otherRange)
            || this.contains(otherRange)
            || this.inside(otherRange);
    };
    AbstractIPRange.prototype.isEquals = function (otherRange) {
        return this.toRangeSet().isEquals(otherRange.toRangeSet());
    };
    AbstractIPRange.prototype.merge = function (otherRange) {
        if (!this.isCidrMergeable(otherRange)) {
            throw new Error("Cannot merge. Ranges (" + this.toRangeString() + "," + otherRange.toRangeString() + ") are not consecutive and/or of same size");
        }
        return this.newInstance(this.getFirst(), this.getPrefix().merge());
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
    AbstractIPRange.prototype.takeStream = function (count) {
        return __generator(this, function (_a) {
            return [2 /*return*/, this.toRangeSet().take(count)];
        });
    };
    AbstractIPRange.prototype[Symbol.iterator] = function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [5 /*yield**/, __values(this.toRangeSet())];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    };
    return AbstractIPRange;
}());
exports.AbstractIPRange = AbstractIPRange;
/**
 * Represents a continuous segment of IPv4 numbers following the
 * classless inter-domain routing scheme for allocating IP addresses.
 *
 * @see https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing
 */
var IPv4CidrRange = /** @class */ (function (_super) {
    __extends(IPv4CidrRange, _super);
    /**
     * Constructor for creating an instance of an IPv4 range.
     *
     * The arguments taken by the constructor is inspired by the CIDR notation which basically consists of the IP
     * number and the prefix.
     *
     * @param {IPv4} ipv4 the IP number used to construct the range. By convention this is the first IP number in
     * the range, but it could also be any IP number within the range
     * @param {IPv4Prefix} cidrPrefix the prefix which is a representation of the number of bits used to mask the
     * given IP number in other to create the range
     */
    function IPv4CidrRange(ipv4, cidrPrefix) {
        var _this = _super.call(this) || this;
        _this.ipv4 = ipv4;
        _this.cidrPrefix = cidrPrefix;
        _this.bitValue = bigInt(32);
        return _this;
    }
    /**
     * Convenience method for constructing an instance of an IPv4CidrRange from an IP range represented in CIDR notation
     *
     * @param {string} rangeIncidrNotation the range of the IPv4 number in CIDR notation
     * @returns {IPv4CidrRange} the IPv4CidrRange
     */
    IPv4CidrRange.fromCidr = function (rangeIncidrNotation) {
        var _a = __read(Validator_1.Validator.isValidIPv4CidrNotation(rangeIncidrNotation), 2), isValid = _a[0], errorMessages = _a[1];
        if (!isValid) {
            var messages = errorMessages.filter(function (message) { return message !== ''; });
            throw new Error(messages.join(' and '));
        }
        var cidrComponents = rangeIncidrNotation.split("/");
        var ipString = cidrComponents[0];
        var prefix = parseInt(cidrComponents[1]);
        return new IPv4CidrRange(IPNumber_2.IPv4.fromDecimalDottedString(ipString), Prefix_2.IPv4Prefix.fromNumber(prefix));
    };
    /**
     * Gets the size of IPv4 numbers contained within the IPv4 range
     *
     * @returns {bigInt.BigInteger} the amount of IPv4 numbers in the range
     */
    IPv4CidrRange.prototype.getSize = function () {
        return this.cidrPrefix.toRangeSize();
    };
    /**
     * Method that returns the IPv4 range in CIDR (Classless Inter-Domain Routing) notation.
     *
     * See {@link https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing#CIDR_notation} for more information
     * on the Classless Inter-Domain Routing notation
     *
     * @returns {string} the IPv4 range in CIDR (Classless Inter-Domain Routing) notation
     */
    IPv4CidrRange.prototype.toCidrString = function () {
        var first = this.getFirst();
        return first.toString() + "/" + this.cidrPrefix.toString();
    };
    /**
     * Method that returns the IPv4 range in string notation where the first IPv4 number and last IPv4 number are
     * separated by an hyphen. eg. 192.198.0.0-192.198.0.255
     *
     * @returns {string} the range in [first IPv4 number] - [last IPv4 number] format
     */
    IPv4CidrRange.prototype.toRangeString = function () {
        return _super.prototype.toRangeString.call(this);
    };
    /**
     * Method that returns the first IPv4 number in the IPv4 range
     *
     * @returns {IPv4} the first IPv4 number in the IPv4 range
     */
    IPv4CidrRange.prototype.getFirst = function () {
        return IPNumber_2.IPv4.fromBigInteger(this.ipv4.getValue().and(this.cidrPrefix.toMask().getValue()));
    };
    /**
     * Method that returns the last IPv4 number in the IPv4 range
     *
     * @returns {IPv4} the last IPv4 number in the IPv4 range
     */
    IPv4CidrRange.prototype.getLast = function () {
        var onMask = bigInt("1".repeat(32), 2);
        var subnetAsBigInteger = this.cidrPrefix.toMask().getValue();
        var invertedMask = BinaryUtils_1.leftPadWithZeroBit(subnetAsBigInteger.xor(onMask).toString(2), 32);
        return IPNumber_2.IPv4.fromBigInteger(this.ipv4.getValue().or(BinaryUtils_2.parseBinaryStringToBigInteger(invertedMask)));
    };
    IPv4CidrRange.prototype.newInstance = function (num, prefix) {
        return new IPv4CidrRange(num, prefix);
    };
    IPv4CidrRange.prototype.getPrefix = function () {
        return this.cidrPrefix;
    };
    /**
     * Indicates whether the given IPv4 range is an adjacent range.
     *
     * An adjacent range being one where the end of the given range, when incremented by one marks the start of the
     * other range. Or where the start of the given range, when decreased by one, marks the end of the other range
     *
     * @param {IPv4CidrRange} otherRange the other IPv4 range to compare with
     * @returns {boolean} true if the two IPv4 ranges are consecutive, false otherwise
     */
    IPv4CidrRange.prototype.isConsecutive = function (otherRange) {
        return _super.prototype.isConsecutive.call(this, otherRange);
    };
    /**
     * Indicates if the given IPv4 range is a subset.
     *
     * By a subset range, it means all the values of the given range are contained by this IPv4 range
     *
     * @param {IPv4CidrRange} otherRange the other IPv4 range
     * @returns {boolean} true if the other Ipv4 range is a subset. False otherwise.
     */
    IPv4CidrRange.prototype.contains = function (otherRange) {
        return _super.prototype.contains.call(this, otherRange);
    };
    /**
     * Indicate if the given range is a container range.
     *
     * By container range, it means all the IP number in this current range can be found within the given range.
     *
     * @param {IPv4CidrRange} otherRange he other IPv4 range
     * @returns {boolean} true if the other Ipv4 range is a container range. False otherwise.
     */
    IPv4CidrRange.prototype.inside = function (otherRange) {
        return _super.prototype.inside.call(this, otherRange);
    };
    /**
     * Checks if two IPv4 ranges overlap
     * @param {IPv4CidrRange} otherRange the other IPv4 range
     * @returns {boolean} true if the ranges overlap, false otherwise
     */
    IPv4CidrRange.prototype.isOverlapping = function (otherRange) {
        return _super.prototype.isOverlapping.call(this, otherRange);
    };
    /**
     * Method that takes IPv4 number from within an IPv4 range, starting from the first IPv4 number
     *
     * @param {number} count the amount of IPv4 number to take from the IPv4 range
     * @returns {Array<IPv4>} an array of IPv4 number, taken from the IPv4 range
     */
    IPv4CidrRange.prototype.take = function (count) {
        var ipv4s = [this.getFirst()];
        var iteratingIPv4 = this.getFirst();
        if (bigInt(count).greater(this.getSize())) {
            var errMessage = Validator_1.Validator.takeOutOfRangeSizeMessage
                .replace("$count", count.toString())
                .replace("$size", this.getSize().toString());
            throw new Error(errMessage);
        }
        for (var counter = 0; counter < count.minus(1).valueOf(); counter++) {
            ipv4s.push(iteratingIPv4.nextIPNumber());
            iteratingIPv4 = iteratingIPv4.nextIPNumber();
        }
        return ipv4s;
    };
    /**
     * Method that splits an IPv4 range into two halves
     *
     * @returns {Array<IPv4CidrRange>} An array of two {@link IPv4CidrRange}
     */
    IPv4CidrRange.prototype.split = function () {
        var prefixToSplit = this.cidrPrefix.getValue();
        if (prefixToSplit === 32) {
            throw new Error("Cannot split an IP range with a single IP number");
        }
        var splitCidr = Prefix_2.IPv4Prefix.fromNumber(prefixToSplit + 1);
        var firstIPOfFirstRange = this.getFirst();
        var firstRange = new IPv4CidrRange(firstIPOfFirstRange, splitCidr);
        var firstIPOfSecondRange = firstRange.getLast().nextIPNumber();
        var secondRange = new IPv4CidrRange(firstIPOfSecondRange, splitCidr);
        return [firstRange, secondRange];
    };
    /**
     * Returns true if there is an adjacent IPv4 cidr range of exactly the same size next to this range
     */
    IPv4CidrRange.prototype.hasNextRange = function () {
        return _super.prototype.hasNextRange.call(this);
    };
    /**
     * Returns true if there is an adjacent IPv4 cidr range of exactly the same size previous to this range
     */
    IPv4CidrRange.prototype.hasPreviousRange = function () {
        return _super.prototype.hasPreviousRange.call(this);
    };
    /**
     * Return the next IPv6 cidr range, or undefined if no next range
     */
    IPv4CidrRange.prototype.nextRange = function () {
        if (this.hasNextRange()) {
            var sizeOfCurrentRange = this.getSize();
            var startOfNextRange = this.getFirst().getValue().plus(sizeOfCurrentRange);
            return new IPv4CidrRange(new IPNumber_2.IPv4(startOfNextRange), this.cidrPrefix);
        }
        return;
    };
    /**
     * Return the previous IPv6 cidr range, or undefined if no next range
     */
    IPv4CidrRange.prototype.previousRange = function () {
        if (this.hasPreviousRange()) {
            var sizeOfCurrentRange = this.getSize();
            var startOfPreviousRange = this.getFirst().getValue().minus(sizeOfCurrentRange);
            return new IPv4CidrRange(new IPNumber_2.IPv4(startOfPreviousRange), this.cidrPrefix);
        }
        return;
    };
    return IPv4CidrRange;
}(AbstractIPRange));
exports.IPv4CidrRange = IPv4CidrRange;
/**
 * Represents a continuous segment of IPv6 number following the
 * classless inter-domain routing scheme for allocating IP addresses.
 *
 * @see https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing
 */
var IPv6CidrRange = /** @class */ (function (_super) {
    __extends(IPv6CidrRange, _super);
    /**
     * Constructor for creating an instance of an IPv6 range.
     *
     * The arguments taken by the constructor is inspired by the CIDR notation which basically consists of the IP
     * number and the prefix.
     *
     * @param {IPv6} ipv6 the IP number used to construct the range. By convention this is the first IP number in
     * the range, but it could also be any IP number within the range
     * @param {IPv6Prefix} cidrPrefix the prefix which is a representation of the number of bits used to mask the
     * given IPv6 number in other to create the range
     */
    function IPv6CidrRange(ipv6, cidrPrefix) {
        var _this = _super.call(this) || this;
        _this.ipv6 = ipv6;
        _this.cidrPrefix = cidrPrefix;
        _this.bitValue = bigInt(128);
        return _this;
    }
    /**
     * Convenience method for constructing an instance of an IPV6Range from an IP range represented in CIDR notation
     *
     * @param {string} rangeInCidrNotation the range of the IPv6 number in CIDR notation
     * @returns {IPv6CidrRange} the IPV6Range
     */
    IPv6CidrRange.fromCidr = function (rangeInCidrNotation) {
        var _a = __read(Validator_1.Validator.isValidIPv6CidrNotation(rangeInCidrNotation), 2), isValid = _a[0], message = _a[1];
        if (!isValid) {
            throw new Error(message.filter(function (msg) { return msg !== ''; }).toString());
        }
        var cidrComponents = rangeInCidrNotation.split("/");
        var ipString = cidrComponents[0];
        var prefix = parseInt(cidrComponents[1]);
        return new IPv6CidrRange(IPNumber_1.IPv6.fromHexadecimalString(ipString), Prefix_1.IPv6Prefix.fromNumber(prefix));
    };
    ;
    /**
     * Gets the size of IPv6 numbers contained within the IPv6 range
     *
     * @returns {bigInt.BigInteger} the amount of IPv6 numbers in the range
     */
    IPv6CidrRange.prototype.getSize = function () {
        return this.cidrPrefix.toRangeSize();
    };
    /**
     * Method that returns the IPv6 range in CIDR (Classless Inter-Domain Routing) notation.
     *
     * See {@link https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing#CIDR_notation} for more information
     * on the Classless Inter-Domain Routing notation
     *
     * @returns {string} the IPv6 range in CIDR (Classless Inter-Domain Routing) notation
     */
    IPv6CidrRange.prototype.toCidrString = function () {
        var first = this.getFirst();
        return first.toString() + "/" + this.cidrPrefix.toString();
    };
    /**
     * Method that returns the IPv6 range in string notation where the first IPv6 number and last IPv6 number are
     * separated by an hyphen. eg. "2001:db8:0:0:0:0:0:0-2001:db8:0:ffff:ffff:ffff:ffff:ffff"
     *
     * @returns {string} the range in [first IPv6 number] - [last IPv6 number] format
     */
    IPv6CidrRange.prototype.toRangeString = function () {
        return _super.prototype.toRangeString.call(this);
    };
    /**
     * Method that returns the first IPv6 number in the IPv6 range
     *
     * @returns {IPv6} the first IPv6 number in the IPv6 range
     */
    IPv6CidrRange.prototype.getFirst = function () {
        return IPNumber_1.IPv6.fromBigInteger(this.ipv6.getValue().and(this.cidrPrefix.toMask().getValue()));
    };
    /**
     * Method that returns the last IPv6 number in the IPv6 range
     *
     * @returns {IPv6} the last IPv6 number in the IPv6 range
     */
    IPv6CidrRange.prototype.getLast = function () {
        var onMask = bigInt("1".repeat(128), 2);
        var maskAsBigInteger = this.cidrPrefix.toMask().getValue();
        var invertedMask = BinaryUtils_1.leftPadWithZeroBit(maskAsBigInteger.xor(onMask).toString(2), 128);
        return IPNumber_1.IPv6.fromBigInteger(this.ipv6.getValue().or(BinaryUtils_2.parseBinaryStringToBigInteger(invertedMask)));
    };
    IPv6CidrRange.prototype.newInstance = function (num, prefix) {
        return new IPv6CidrRange(num, prefix);
    };
    IPv6CidrRange.prototype.getPrefix = function () {
        return this.cidrPrefix;
    };
    /**
     * Indicates whether the given IPv6 range is an adjacent range.
     *
     * An adjacent range being one where the end of the given range, when incremented by one marks the start of the
     * other range. Or where the start of the given range, when decreased by one, marks the end of the other range
     *
     * @param {IPv6CidrRange} otherRange the other IPv6 range to compare with
     * @returns {boolean} true if the two IPv6 ranges are consecutive, false otherwise
     */
    IPv6CidrRange.prototype.isConsecutive = function (otherRange) {
        return _super.prototype.isConsecutive.call(this, otherRange);
    };
    /**
     * Indicates if the given IPv6 range is a subset.
     *
     * By a subset range, it means all the values of the given range are contained by this IPv6 range
     *
     * @param {IPv6CidrRange} otherRange the other IPv6 range
     * @returns {boolean} true if the other Ipv6 range is a subset. False otherwise.
     */
    IPv6CidrRange.prototype.contains = function (otherRange) {
        return _super.prototype.contains.call(this, otherRange);
    };
    /**
     * Indicate if the given range is a container range.
     *
     * By container range, it means all the IP number in this current range can be found within the given range.
     *
     * @param {IPv6CidrRange} otherRange he other IPv6 range
     * @returns {boolean} true if the other Ipv6 range is a container range. False otherwise.
     */
    IPv6CidrRange.prototype.inside = function (otherRange) {
        return _super.prototype.inside.call(this, otherRange);
    };
    /**
     * Checks if two IPv6 ranges overlap
     * @param {IPv6CidrRange} otherRange the other IPv6 range
     * @returns {boolean} true if the ranges overlap, false otherwise
     */
    IPv6CidrRange.prototype.isOverlapping = function (otherRange) {
        return _super.prototype.isOverlapping.call(this, otherRange);
    };
    /**
     * Method that takes IPv6 number from within an IPv6 range, starting from the first IPv6 number
     *
     * @param {number} count the amount of IPv6 number to take from the IPv6 range
     * @returns {Array<IPv6>} an array of IPv6 number, taken from the IPv6 range
     */
    IPv6CidrRange.prototype.take = function (count) {
        var iPv6s = [this.getFirst()];
        var iteratingIPv6 = this.getFirst();
        if (count.greater(this.getSize())) {
            throw new Error(count.toString() + " is greater than " + this.getSize().toString() + ", the size of the range");
        }
        for (var counter = 0; counter < count.minus(1).valueOf(); counter++) {
            iPv6s.push(iteratingIPv6.nextIPNumber());
            iteratingIPv6 = iteratingIPv6.nextIPNumber();
        }
        return iPv6s;
    };
    /**
     * Method that splits an IPv6 cidr range into two halves
     *
     * @returns {Array<IPv6CidrRange>} An array of two {@link IPv6CidrRange}
     */
    IPv6CidrRange.prototype.split = function () {
        var prefixToSplit = this.cidrPrefix.getValue();
        if (prefixToSplit === 128) {
            throw new Error("Cannot split an IP range with a single IP number");
        }
        var splitCidr = Prefix_1.IPv6Prefix.fromNumber(prefixToSplit + 1);
        var firstIPOfFirstRange = this.getFirst();
        var firstRange = new IPv6CidrRange(firstIPOfFirstRange, splitCidr);
        var firstIPOfSecondRange = firstRange.getLast().nextIPNumber();
        var secondRange = new IPv6CidrRange(firstIPOfSecondRange, splitCidr);
        return [firstRange, secondRange];
    };
    /**
     * Returns true if there is an adjacent IPv6 cidr range of exactly the same size next to this range
     */
    IPv6CidrRange.prototype.hasNextRange = function () {
        return _super.prototype.hasNextRange.call(this);
    };
    /**
     * Returns true if there is an adjacent IPv6 cidr range of exactly the same size previous to this range
     */
    IPv6CidrRange.prototype.hasPreviousRange = function () {
        return _super.prototype.hasPreviousRange.call(this);
    };
    /**
     * Return the next IPv6 cidr range, or undefined if no next range
     */
    IPv6CidrRange.prototype.nextRange = function () {
        if (this.hasNextRange()) {
            var sizeOfCurrentRange = this.getSize();
            var startOfNextRange = this.getFirst().getValue().plus(sizeOfCurrentRange);
            return new IPv6CidrRange(new IPNumber_1.IPv6(startOfNextRange), this.cidrPrefix);
        }
        return;
    };
    /**
     * Return the previous IPv6 cidr range, or undefined if no next range
     */
    IPv6CidrRange.prototype.previousRange = function () {
        if (this.hasPreviousRange()) {
            var sizeOfCurrentRange = this.getSize();
            var startOfPreviousRange = this.getFirst().getValue().minus(sizeOfCurrentRange);
            return new IPv6CidrRange(new IPNumber_1.IPv6(startOfPreviousRange), this.cidrPrefix);
        }
        return;
    };
    return IPv6CidrRange;
}(AbstractIPRange));
exports.IPv6CidrRange = IPv6CidrRange;
//# sourceMappingURL=IPRange.js.map