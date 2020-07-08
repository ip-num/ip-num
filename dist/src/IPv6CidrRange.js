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
exports.IPv6CidrRange = void 0;
var Prefix_1 = require("./Prefix");
var IPv6_1 = require("./IPv6");
var bigInt = require("big-integer");
var BinaryUtils_1 = require("./BinaryUtils");
var BinaryUtils_2 = require("./BinaryUtils");
var Validator_1 = require("./Validator");
var AbstractIpRange_1 = require("./AbstractIpRange");
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
        _this.internalCounterValue = _this.getFirst();
        return _this;
    }
    /**
     * Convenience method for constructing an instance of an IPV6Range from an IP range represented in CIDR notation
     *
     * @param {string} rangeIncidrNotation the range of the IPv6 number in CIDR notation
     * @returns {IPV6Range} the IPV6Range
     */
    IPv6CidrRange.fromCidr = function (rangeIncidrNotation) {
        var _a = __read(Validator_1.Validator.isValidIPv6CidrNotation(rangeIncidrNotation), 2), isValid = _a[0], message = _a[1];
        if (!isValid) {
            throw new Error(message.filter(function (msg) { return msg !== ''; }).toString());
        }
        var cidrComponents = rangeIncidrNotation.split("/");
        var ipString = cidrComponents[0];
        var prefix = parseInt(cidrComponents[1]);
        return new IPv6CidrRange(IPv6_1.IPv6.fromHexadecimalString(ipString), Prefix_1.IPv6Prefix.fromNumber(prefix));
    };
    ;
    /**
     * Gets the size of IPv6 numbers contained within the IPv6 range
     *
     * @returns {bigInt.BigInteger} the amount of IPv6 numbers in the range
     */
    IPv6CidrRange.prototype.getSize = function () {
        return _super.prototype.getSize.call(this);
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
        return this.ipv6.toString() + "/" + this.cidrPrefix.toString();
    };
    /**
     * Method that returns the IPv6 range in string notation where the first IPv6 number and last IPv6 number are
     * separated by an hyphen. eg. "2001:db8:0:0:0:0:0:0-2001:db8:0:ffff:ffff:ffff:ffff:ffff"
     *
     * @returns {string} the range in [first IPv6 number] - [last IPv6 number] format
     */
    IPv6CidrRange.prototype.toRangeString = function () {
        return this.getFirst() + "-" + this.getLast();
    };
    /**
     * Method that returns the first IPv6 number in the IPv6 range
     *
     * @returns {IPv6} the first IPv6 number in the IPv6 range
     */
    IPv6CidrRange.prototype.getFirst = function () {
        return IPv6_1.IPv6.fromBigInteger(this.ipv6.getValue().and(this.cidrPrefix.toSubnetMask().getValue()));
    };
    /**
     * Method that returns the last IPv6 number in the IPv6 range
     *
     * @returns {IPv6} the last IPv6 number in the IPv6 range
     */
    IPv6CidrRange.prototype.getLast = function () {
        var onMask = bigInt("1".repeat(128), 2);
        var subnetMaskAsBigInteger = this.cidrPrefix.toSubnetMask().getValue();
        var invertedSubnetMask = BinaryUtils_1.leftPadWithZeroBit(subnetMaskAsBigInteger.xor(onMask).toString(2), 128);
        return IPv6_1.IPv6.fromBigInteger(this.ipv6.getValue().or(BinaryUtils_2.parseBinaryStringToBigInteger(invertedSubnetMask)));
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
     * Method that splits an IPv6 range into two halves
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
    IPv6CidrRange.prototype.hasNextRange = function () {
        return _super.prototype.hasNextRange.call(this);
    };
    IPv6CidrRange.prototype.hasPreviousRange = function () {
        return _super.prototype.hasPreviousRange.call(this);
    };
    IPv6CidrRange.prototype.nextRange = function () {
        if (this.hasNextRange()) {
            var sizeOfCurrentRange = this.getSize();
            var startOfNextRange = this.getFirst().getValue().plus(sizeOfCurrentRange);
            return new IPv6CidrRange(new IPv6_1.IPv6(startOfNextRange), this.cidrPrefix);
        }
        return;
    };
    IPv6CidrRange.prototype.previousRange = function () {
        if (this.hasPreviousRange()) {
            var sizeOfCurrentRange = this.getSize();
            var startOfPreviousRange = this.getFirst().getValue().minus(sizeOfCurrentRange);
            return new IPv6CidrRange(new IPv6_1.IPv6(startOfPreviousRange), this.cidrPrefix);
        }
        return;
    };
    IPv6CidrRange.prototype.next = function (value) {
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
    IPv6CidrRange.prototype[Symbol.iterator] = function () {
        return this;
    };
    return IPv6CidrRange;
}(AbstractIpRange_1.AbstractIpRange));
exports.IPv6CidrRange = IPv6CidrRange;
//# sourceMappingURL=IPv6CidrRange.js.map