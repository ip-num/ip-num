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
Object.defineProperty(exports, "__esModule", { value: true });
exports.IPv4CidrRange = void 0;
var IPv4_1 = require("./IPv4");
var Prefix_1 = require("./Prefix");
var BinaryUtils_1 = require("./BinaryUtils");
var BinaryUtils_2 = require("./BinaryUtils");
var Validator_1 = require("./Validator");
var bigInt = require("big-integer");
var AbstractIpRange_1 = require("./AbstractIpRange");
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
        _this.internalCounterValue = _this.getFirst();
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
        return new IPv4CidrRange(IPv4_1.IPv4.fromDecimalDottedString(ipString), Prefix_1.IPv4Prefix.fromNumber(prefix));
    };
    ;
    /**
     * Gets the size of IPv4 numbers contained within the IPv4 range
     *
     * @returns {bigInt.BigInteger} the amount of IPv4 numbers in the range
     */
    IPv4CidrRange.prototype.getSize = function () {
        return _super.prototype.getSize.call(this);
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
        return this.ipv4.toString() + "/" + this.cidrPrefix.toString();
    };
    /**
     * Method that returns the IPv4 range in string notation where the first IPv4 number and last IPv4 number are
     * separated by an hyphen. eg. 192.198.0.0-192.198.0.255
     *
     * @returns {string} the range in [first IPv4 number] - [last IPv4 number] format
     */
    IPv4CidrRange.prototype.toRangeString = function () {
        return this.getFirst() + "-" + this.getLast();
    };
    /**
     * Method that returns the first IPv4 number in the IPv4 range
     *
     * @returns {IPv4} the first IPv4 number in the IPv4 range
     */
    IPv4CidrRange.prototype.getFirst = function () {
        return IPv4_1.IPv4.fromBigInteger(this.ipv4.getValue().and(this.cidrPrefix.toSubnetMask().getValue()));
    };
    /**
     * Method that returns the last IPv4 number in the IPv4 range
     *
     * @returns {IPv4} the last IPv4 number in the IPv4 range
     */
    IPv4CidrRange.prototype.getLast = function () {
        var onMask = bigInt("1".repeat(32), 2);
        var subnetAsBigInteger = this.cidrPrefix.toSubnetMask().getValue();
        var invertedSubnet = BinaryUtils_1.leftPadWithZeroBit(subnetAsBigInteger.xor(onMask).toString(2), 32);
        return IPv4_1.IPv4.fromBigInteger(this.ipv4.getValue().or(BinaryUtils_2.parseBinaryStringToBigInteger(invertedSubnet)));
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
        var splitCidr = Prefix_1.IPv4Prefix.fromNumber(prefixToSplit + 1);
        var firstIPOfFirstRange = this.getFirst();
        var firstRange = new IPv4CidrRange(firstIPOfFirstRange, splitCidr);
        var firstIPOfSecondRange = firstRange.getLast().nextIPNumber();
        var secondRange = new IPv4CidrRange(firstIPOfSecondRange, splitCidr);
        return [firstRange, secondRange];
    };
    IPv4CidrRange.prototype.hasNextRange = function () {
        return _super.prototype.hasNextRange.call(this);
    };
    IPv4CidrRange.prototype.hasPreviousRange = function () {
        return _super.prototype.hasPreviousRange.call(this);
    };
    IPv4CidrRange.prototype.nextRange = function () {
        if (this.hasNextRange()) {
            var sizeOfCurrentRange = this.getSize();
            var startOfNextRange = this.getFirst().getValue().plus(sizeOfCurrentRange);
            return new IPv4CidrRange(new IPv4_1.IPv4(startOfNextRange), this.cidrPrefix);
        }
        return;
    };
    IPv4CidrRange.prototype.previousRange = function () {
        if (this.hasPreviousRange()) {
            var sizeOfCurrentRange = this.getSize();
            var startOfPreviousRange = this.getFirst().getValue().minus(sizeOfCurrentRange);
            return new IPv4CidrRange(new IPv4_1.IPv4(startOfPreviousRange), this.cidrPrefix);
        }
        return;
    };
    IPv4CidrRange.prototype.next = function (value) {
        var returnValue = this.internalCounterValue;
        this.internalCounterValue = this.internalCounterValue.nextIPNumber();
        if (returnValue.isLessThanOrEquals(this.getLast())) {
            return {
                done: false,
                value: returnValue
            };
        }
        else {
            return {
                done: true,
                value: returnValue
            };
        }
    };
    IPv4CidrRange.prototype[Symbol.iterator] = function () {
        return this;
    };
    return IPv4CidrRange;
}(AbstractIpRange_1.AbstractIpRange));
exports.IPv4CidrRange = IPv4CidrRange;
//# sourceMappingURL=IPv4CidrRange.js.map