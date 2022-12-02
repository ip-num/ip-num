"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isIPv4CidrRange = exports.IPv6CidrRange = exports.IPv4CidrRange = exports.AbstractIPRange = exports.RangedSet = void 0;
const IPNumber_1 = require("./IPNumber");
const Prefix_1 = require("./Prefix");
const BinaryUtils_1 = require("./BinaryUtils");
const Validator_1 = require("./Validator");
/**
 * Represents a continuous segment of either IPv4 or IPv6 numbers
 * without adhering to classless inter-domain routing scheme
 * for allocating IP addresses.
 */
class RangedSet {
    /**
     * Constructor for an instance of {@link RangedSet} from an
     * instance of either {@link IPv4CidrRange} or {@link IPv6CidrRange}
     *
     * Throws an exception if first IP number is not less than given last IP number
     *
     * @param first the first IP number of the range
     * @param last the last IP number of the range
     */
    constructor(first, last) {
        this.first = first;
        this.last = last;
        if (first.isGreaterThan(last)) {
            throw new Error(`${first.toString()} should be lower than ${last.toString()}`);
        }
        this.currentValue = first;
        this.bitValue = BigInt(first.bitSize);
    }
    /**
     * Convenience method for constructing an instance of {@link RangedSet} from a
     * single IP number.
     *
     * @param ip The IP number, either IPv4 or IPv6 to construct the range from.
     */
    static fromSingleIP(ip) {
        return new RangedSet(ip, ip);
    }
    /**
     * Convenience method for constructing an instance of {@link RangedSet} from an
     * instance of either {@link IPv4CidrRange} or {@link IPv6CidrRange}
     *
     * @param cidrRange an instance of {@link RangedSet}
     */
    static fromCidrRange(cidrRange) {
        return new RangedSet(cidrRange.getFirst(), cidrRange.getLast());
    }
    /**
     * Convenience method for constructing an instance of {@link RangedSet} from
     * a range string in the form of firstIp-lastIp
     *
     * @param rangeString  string in the form of firstIp-lastIp
     */
    static fromRangeString(rangeString) {
        let ips = rangeString.split("-").map(ip => ip.trim());
        if (ips.length !== 2) {
            throw new Error("Argument should be in the format firstip-lastip");
        }
        let [firstIPString, lastIPString] = ips;
        let [isValidFirstIPv4,] = Validator_1.Validator.isValidIPv4String(firstIPString);
        let [isValidSecondIPv4,] = Validator_1.Validator.isValidIPv4String(lastIPString);
        let [isValidFirstIPv6,] = Validator_1.Validator.isValidIPv6String(firstIPString);
        let [isValidLastIPv6,] = Validator_1.Validator.isValidIPv6String(lastIPString);
        if (isValidFirstIPv4 && isValidSecondIPv4) {
            return new RangedSet(IPNumber_1.IPv4.fromDecimalDottedString(firstIPString), IPNumber_1.IPv4.fromDecimalDottedString(lastIPString));
        }
        else if (isValidFirstIPv6 && isValidLastIPv6) {
            return new RangedSet(IPNumber_1.IPv6.fromHexadecatet(firstIPString), IPNumber_1.IPv6.fromHexadecatet(lastIPString));
        }
        else {
            throw new Error("First IP and Last IP should be valid and same type");
        }
    }
    /**
     * Returns the first IP number in the range
     */
    getFirst() {
        return this.first;
    }
    /**
     * Returns the last IP number in the range
     */
    getLast() {
        return this.last;
    }
    /**
     * Returns the size, which is the number of IP numbers in the range.
     */
    getSize() {
        return this.last.getValue() - (this.first.getValue()) + 1n;
    }
    /**
     * Converts to a string representation of the range in the form of:
     * <first-ip>-<last-ip>
     */
    toRangeString() {
        return `${this.getFirst()}-${this.getLast()}`;
    }
    /**
     * Checks if this range is inside another range.
     *
     * @param otherRange the other range to check if this range is inside of.
     */
    inside(otherRange) {
        return otherRange.contains(this);
    }
    /**
     * Checks if this range contains the given other range.
     *
     * @param otherRange the other range to check if this range contains
     */
    contains(otherRange) {
        let thisFirst = this.getFirst();
        let thisLast = this.getLast();
        let otherFirst = otherRange.getFirst();
        let otherLast = otherRange.getLast();
        return (thisFirst.isLessThanOrEquals(otherFirst) && thisLast.isGreaterThanOrEquals(otherLast));
    }
    /**
     * Check if this range is equal to the given other range.
     *
     * @param otherRange the other range to check if equal to this range.
     */
    isEquals(otherRange) {
        return this.getFirst().isEquals(otherRange.getFirst())
            && this.getLast().isEquals(otherRange.getLast());
    }
    ;
    /**
     * Check if this range is less than the given range.
     *
     * @param otherRange the other range to check if less than.
     */
    isLessThan(otherRange) {
        if (this.isEquals(otherRange)) {
            return false;
        }
        else {
            if (this.getFirst().isEquals(otherRange.getFirst())) {
                return this.getSize() < (otherRange.getSize());
            }
            return this.getFirst().isLessThan(otherRange.getFirst());
        }
    }
    /**
     * Check if this range is greater than the given range.
     *
     * @param otherRange the other range to check if greater than.
     */
    isGreaterThan(otherRange) {
        if (this.isEquals(otherRange)) {
            return false;
        }
        else {
            if (this.getFirst().isEquals(otherRange.getFirst())) {
                return this.getSize() > (otherRange.getSize());
            }
            return this.getFirst().isGreaterThan(otherRange.getFirst());
        }
    }
    /**
     * Checks of this range overlaps with a given other range.
     *
     * This means it checks if part of a range is part of another range without
     * being totally contained in the other range. Hence Equal or ranges contained inside one
     * another are not considered as overlapping.
     *
     * @param otherRange the other range to check if it overlaps with this range.
     */
    isOverlapping(otherRange) {
        let thisFirst = this.getFirst();
        let thisLast = this.getLast();
        let otherFirst = otherRange.getFirst();
        let otherLast = otherRange.getLast();
        return (thisLast.isGreaterThan(otherFirst) && thisLast.isLessThanOrEquals(otherLast) && thisFirst.isLessThan(otherFirst)
            ||
                otherLast.isGreaterThan(thisFirst) && otherLast.isLessThanOrEquals(thisLast) && otherFirst.isLessThan(thisFirst));
    }
    /**
     * Check if this range can be converted to a CIDR range.
     */
    isCidrAble() {
        if (this.getSize() === 1n) {
            return true;
        }
        try {
            let prefix = BinaryUtils_1.intLog2(this.getSize());
            let netmask = BinaryUtils_1.parseBinaryStringToBigInt(BinaryUtils_1.cidrPrefixToMaskBinaryString(prefix, IPNumber_1.isIPv4(this.currentValue) ? "IPv4" /* IPv4 */ : "IPv6" /* IPv6 */));
            return (this.first.getValue()) === (netmask & (this.first.getValue()));
        }
        catch (e) {
            return false;
        }
    }
    /**
     * Converts an instance of range to an instance of CIDR range
     */
    toCidrRange() {
        if (IPNumber_1.isIPv4(this.currentValue)) {
            return this.toIPv4CidrRange();
        }
        else {
            return this.toIPv6CidrRange();
        }
    }
    ;
    /**
     * Checks if this range is consecutive with another range.
     *
     * This means if the two ranges can be placed side by side, without any gap. Hence Equal
     * or ranges contained inside one another, or overlapping ranges are not considered as consecutive.
     *
     * @param otherRange the other range to check if this range is consecutive to.
     */
    isConsecutive(otherRange) {
        let thisFirst = this.getFirst();
        let thisLast = this.getLast();
        let otherFirst = otherRange.getFirst();
        let otherLast = otherRange.getLast();
        return (thisLast.hasNext() && thisLast.nextIPNumber().isEquals(otherFirst)
            ||
                otherLast.hasNext() && otherLast.nextIPNumber().isEquals(thisFirst));
    }
    /**
     * Creates a range that is a union of this range and the given other range.
     *
     * @param otherRange the other range to combine with this range
     */
    union(otherRange) {
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
    }
    /**
     * Prepends given range with this range.
     * The last IP in the given range should be adjacent to the first IP in this range
     *
     * @param otherRange the other range to prepend
     */
    prepend(otherRange) {
        if (otherRange.getLast().nextIPNumber().isEquals(this.getFirst())) {
            return new RangedSet(otherRange.getFirst(), this.getLast());
        }
        else {
            throw new Error("Range to prepend must be adjacent");
        }
    }
    /**
     * Appends given range with this range.
     * The last IP in this range should be adjacent to the first IP in range to append
     *
     * @param otherRange the other range to append
     */
    append(otherRange) {
        if (this.getLast().nextIPNumber().isEquals(otherRange.getFirst())) {
            return new RangedSet(this.getFirst(), otherRange.getLast());
        }
        else {
            throw new Error("Range to append must be adjacent");
        }
    }
    subtract(otherRange) {
        if (!this.isOverlapping(otherRange)) {
            throw new Error("Cannot subtract ranges that are not overlapping");
        }
        if (!this.isLessThan(otherRange)) {
            throw new Error("Cannot subtract a larger range from this range");
        }
        return new RangedSet(this.getFirst(), otherRange.getLast());
    }
    /**
     * Returns a sub range of a given size from this range.
     *
     * @param offset offset from this range where the subrange should begin
     * @param size the size of the range
     */
    takeSubRange(offset, size) {
        if (offset + (size) > (this.getSize())) {
            throw new RangeError("Requested range is greater than what can be taken");
        }
        if (size === (0n)) {
            throw new Error("Sub range cannot be zero");
        }
        let valueOfFirstIp = this.getFirst().value + (offset);
        let firstIp = IPNumber_1.isIPv4(this.getFirst()) ?
            IPNumber_1.IPv4.fromNumber(valueOfFirstIp) : IPNumber_1.IPv6.fromBigInt(valueOfFirstIp);
        let valueOfLastIp = firstIp.value + (size - 1n);
        let lastIp = IPNumber_1.isIPv4(firstIp) ? IPNumber_1.IPv4.fromNumber(valueOfLastIp) : IPNumber_1.IPv6.fromBigInt(valueOfLastIp);
        return new RangedSet(firstIp, lastIp);
    }
    /**
     * Performs a subtraction operation, where the passed range is removed from the original range.
     *
     * The return range from the subtraction operation could be a single or multiple ranges
     *
     * @param range
     */
    difference(range) {
        if (range.getSize() > (this.getSize())) {
            throw new Error("Range is greater than range to be subtracted from");
        }
        if (!this.contains(range)) {
            throw new Error("Range to subtract is not contained in this range");
        }
        let reminders = [];
        try {
            reminders.push(new RangedSet(this.getFirst(), range.getFirst().previousIPNumber()));
        }
        catch (e) { }
        try {
            reminders.push(new RangedSet(range.getLast().nextIPNumber(), this.getLast()));
        }
        catch (e) { }
        return reminders;
    }
    *take(count) {
        let computed = this.getFirst();
        let returnCount = count === undefined ? this.getSize().valueOf() : count;
        while (returnCount > 0) {
            returnCount--;
            yield computed;
            computed = computed.nextIPNumber();
        }
    }
    *[Symbol.iterator]() {
        yield* this.take();
    }
    toIPv4CidrRange() {
        let candidateRange = new IPv4CidrRange(IPNumber_1.IPv4.fromNumber(this.getFirst().getValue()), Prefix_1.IPv4Prefix.fromRangeSize(this.getSize()));
        if (candidateRange.getFirst().isEquals(this.getFirst())) {
            return candidateRange;
        }
        else {
            throw new Error("Range cannot be converted to CIDR");
        }
    }
    toIPv6CidrRange() {
        let candidateRange = new IPv6CidrRange(IPNumber_1.IPv6.fromBigInt(this.getFirst().getValue()), Prefix_1.IPv6Prefix.fromRangeSize(this.getSize()));
        if (candidateRange.getFirst().isEquals(this.getFirst())) {
            return candidateRange;
        }
        else {
            throw new Error("Range cannot be converted to CIDR");
        }
    }
}
exports.RangedSet = RangedSet;
/**
 * Provides the implementation of functionality that are common to {@link IPv4CidrRange} and {@link IPv6CidrRange}
 */
class AbstractIPRange {
    hasNextRange() {
        let sizeOfCurrentRange = this.getSize();
        return ((2n ** this.bitValue) - sizeOfCurrentRange) >= (this.getFirst().getValue() + (sizeOfCurrentRange));
    }
    hasPreviousRange() {
        return this.getSize() <= (this.getFirst().getValue());
    }
    toRangeSet() {
        return new RangedSet(this.getFirst(), this.getLast());
    }
    inside(otherRange) {
        return this.toRangeSet().inside(otherRange.toRangeSet());
    }
    contains(otherRange) {
        return this.toRangeSet().contains(otherRange.toRangeSet());
    }
    toRangeString() {
        return this.toRangeSet().toRangeString();
    }
    isOverlapping(otherRange) {
        return this.toRangeSet().isOverlapping(otherRange.toRangeSet());
    }
    isConsecutive(otherRange) {
        return this.toRangeSet().isConsecutive(otherRange.toRangeSet());
    }
    isCidrMergeable(otherRange) {
        const count = BigInt(BinaryUtils_1.matchingBitCount(this.getFirst().toBinaryString(), otherRange.getFirst().toBinaryString()));
        if (this.getPrefix().value - count !== 1n) {
            return false;
        }
        return this.isConsecutive(otherRange) && this.getSize() === (otherRange.getSize());
    }
    isMergeable(otherRange) {
        return this.isCidrMergeable(otherRange)
            || this.contains(otherRange)
            || this.inside(otherRange);
    }
    isEquals(otherRange) {
        return this.toRangeSet().isEquals(otherRange.toRangeSet());
    }
    merge(otherRange) {
        if (!this.isCidrMergeable(otherRange)) {
            throw new Error(`Cannot merge. Ranges (${this.toRangeString()},${otherRange.toRangeString()}) are not consecutive and/or of same size`);
        }
        return this.newInstance(this.getFirst(), this.getPrefix().merge());
    }
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
    *takeStream(count) {
        return this.toRangeSet().take(count);
    }
    *[Symbol.iterator]() {
        yield* this.toRangeSet();
    }
}
exports.AbstractIPRange = AbstractIPRange;
/**
 * Represents a continuous segment of IPv4 numbers following the
 * classless inter-domain routing scheme for allocating IP addresses.
 *
 * @see https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing
 */
class IPv4CidrRange extends AbstractIPRange {
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
    constructor(ipv4, cidrPrefix) {
        super();
        this.ipv4 = ipv4;
        this.cidrPrefix = cidrPrefix;
        this.bitValue = 32n;
    }
    /**
     * Convenience method for constructing an instance of an IPv4CidrRange from an IP range represented in CIDR notation
     *
     * @param {string} rangeIncidrNotation the range of the IPv4 number in CIDR notation
     * @returns {IPv4CidrRange} the IPv4CidrRange
     */
    static fromCidr(rangeIncidrNotation) {
        let [isValid, errorMessages] = Validator_1.Validator.isValidIPv4CidrNotation(rangeIncidrNotation);
        if (!isValid) {
            let messages = errorMessages.filter(message => { return message !== ''; });
            throw new Error(messages.join(' and '));
        }
        let cidrComponents = rangeIncidrNotation.split("/");
        let ipString = cidrComponents[0];
        let prefix = BigInt(parseInt(cidrComponents[1]));
        return new IPv4CidrRange(IPNumber_1.IPv4.fromDecimalDottedString(ipString), Prefix_1.IPv4Prefix.fromNumber(prefix));
    }
    /**
     * Gets the size of IPv4 numbers contained within the IPv4 range
     *
     * @returns {bigint} the amount of IPv4 numbers in the range
     */
    getSize() {
        return this.cidrPrefix.toRangeSize();
    }
    /**
     * Method that returns the IPv4 range in CIDR (Classless Inter-Domain Routing) notation.
     *
     * See {@link https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing#CIDR_notation} for more information
     * on the Classless Inter-Domain Routing notation
     *
     * @returns {string} the IPv4 range in CIDR (Classless Inter-Domain Routing) notation
     */
    toCidrString() {
        let first = this.ipv4.toString();
        return `${first.toString()}/${this.cidrPrefix.toString()}`;
    }
    /**
     * Method that returns the IPv4 range in string notation where the first IPv4 number and last IPv4 number are
     * separated by an hyphen. eg. 192.198.0.0-192.198.0.255
     *
     * @returns {string} the range in [first IPv4 number] - [last IPv4 number] format
     */
    toRangeString() {
        return super.toRangeString();
    }
    /**
     * Method that returns the first IPv4 number in the IPv4 range
     *
     * @returns {IPv4} the first IPv4 number in the IPv4 range
     */
    getFirst() {
        return IPNumber_1.IPv4.fromNumber(this.ipv4.getValue() & (this.cidrPrefix.toMask().getValue()));
    }
    /**
     * Method that returns the last IPv4 number in the IPv4 range
     *
     * @returns {IPv4} the last IPv4 number in the IPv4 range
     */
    getLast() {
        return last(this, this.ipv4);
    }
    newInstance(num, prefix) {
        return new IPv4CidrRange(num, prefix);
    }
    getPrefix() {
        return this.cidrPrefix;
    }
    /**
     * Indicates whether the given IPv4 range is an adjacent range.
     *
     * An adjacent range being one where the end of the given range, when incremented by one marks the start of the
     * other range. Or where the start of the given range, when decreased by one, marks the end of the other range
     *
     * @param {IPv4CidrRange} otherRange the other IPv4 range to compare with
     * @returns {boolean} true if the two IPv4 ranges are consecutive, false otherwise
     */
    isConsecutive(otherRange) {
        return super.isConsecutive(otherRange);
    }
    /**
     * Indicates if the given IPv4 range is a subset.
     *
     * By a subset range, it means all the values of the given range are contained by this IPv4 range
     *
     * @param {IPv4CidrRange} otherRange the other IPv4 range
     * @returns {boolean} true if the other Ipv4 range is a subset. False otherwise.
     */
    contains(otherRange) {
        return super.contains(otherRange);
    }
    /**
     * Indicate if the given range is a container range.
     *
     * By container range, it means all the IP number in this current range can be found within the given range.
     *
     * @param {IPv4CidrRange} otherRange he other IPv4 range
     * @returns {boolean} true if the other Ipv4 range is a container range. False otherwise.
     */
    inside(otherRange) {
        return super.inside(otherRange);
    }
    /**
     * Checks if two IPv4 ranges overlap
     * @param {IPv4CidrRange} otherRange the other IPv4 range
     * @returns {boolean} true if the ranges overlap, false otherwise
     */
    isOverlapping(otherRange) {
        return super.isOverlapping(otherRange);
    }
    /**
     * Method that takes IPv4 number from within an IPv4 range, starting from the first IPv4 number
     *
     * @param {bigint} count the amount of IPv4 number to take from the IPv4 range
     * @returns {Array<IPv4>} an array of IPv4 number, taken from the IPv4 range
     */
    take(count) {
        let ipv4s = [this.getFirst()];
        let iteratingIPv4 = this.getFirst();
        if (count > (this.getSize())) {
            let errMessage = Validator_1.Validator.takeOutOfRangeSizeMessage
                .replace("$count", count.toString())
                .replace("$size", this.getSize().toString());
            throw new Error(errMessage);
        }
        for (let counter = 0; counter < count - 1n; counter++) {
            ipv4s.push(iteratingIPv4.nextIPNumber());
            iteratingIPv4 = iteratingIPv4.nextIPNumber();
        }
        return ipv4s;
    }
    /**
     * Method that splits an IPv4 range into two halves
     *
     * @returns {Array<IPv4CidrRange>} An array of two {@link IPv4CidrRange}
     */
    split() {
        let prefixToSplit = this.cidrPrefix.getValue();
        if (prefixToSplit === 32n) {
            throw new Error("Cannot split an IP range with a single IP number");
        }
        let splitCidr = Prefix_1.IPv4Prefix.fromNumber(prefixToSplit + 1n);
        let firstIPOfFirstRange = this.getFirst();
        let firstRange = new IPv4CidrRange(firstIPOfFirstRange, splitCidr);
        let firstIPOfSecondRange = firstRange.getLast().nextIPNumber();
        let secondRange = new IPv4CidrRange(firstIPOfSecondRange, splitCidr);
        return [firstRange, secondRange];
    }
    /**
     * Method that split prefix into ranges of the given prefix,
     * throws an exception if the size of the given prefix is larger than target prefix
     *
     * @param prefix the prefix to use to split
     * @returns {Array<IPv4CidrRange>} An array of two {@link IPv4CidrRange}
     */
    splitInto(prefix) {
        let splitCount = prefix.getValue() - this.cidrPrefix.getValue();
        if (splitCount < 0) {
            throw new Error("Prefix to split into is larger than source prefix");
        }
        else if (splitCount === 0n) {
            return [new IPv4CidrRange(this.getFirst(), prefix)];
        }
        else if (splitCount === 1n) {
            return this.split();
        }
        else {
            let results = this.split();
            while (splitCount > 1) {
                results = results.flatMap(result => result.split());
                splitCount = splitCount - 1n;
            }
            return results;
        }
    }
    /**
     * Returns true if there is an adjacent IPv4 cidr range of exactly the same size next to this range
     */
    hasNextRange() {
        return super.hasNextRange();
    }
    /**
     * Returns true if there is an adjacent IPv4 cidr range of exactly the same size previous to this range
     */
    hasPreviousRange() {
        return super.hasPreviousRange();
    }
    /**
     * Return the next IPv6 cidr range, or undefined if no next range
     */
    nextRange() {
        if (this.hasNextRange()) {
            let sizeOfCurrentRange = this.getSize();
            let startOfNextRange = this.getFirst().getValue() + (sizeOfCurrentRange);
            return new IPv4CidrRange(new IPNumber_1.IPv4(startOfNextRange), this.cidrPrefix);
        }
        return;
    }
    /**
     * Return the previous IPv6 cidr range, or undefined if no next range
     */
    previousRange() {
        if (this.hasPreviousRange()) {
            let sizeOfCurrentRange = this.getSize();
            let startOfPreviousRange = this.getFirst().getValue() - (sizeOfCurrentRange);
            return new IPv4CidrRange(new IPNumber_1.IPv4(startOfPreviousRange), this.cidrPrefix);
        }
        return;
    }
}
exports.IPv4CidrRange = IPv4CidrRange;
/**
 * Represents a continuous segment of IPv6 number following the
 * classless inter-domain routing scheme for allocating IP addresses.
 *
 * @see https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing
 */
class IPv6CidrRange extends AbstractIPRange {
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
    constructor(ipv6, cidrPrefix) {
        super();
        this.ipv6 = ipv6;
        this.cidrPrefix = cidrPrefix;
        this.bitValue = 128n;
    }
    /**
     * Convenience method for constructing an instance of an IPV6Range from an IP range represented in CIDR notation
     *
     * @param {string} rangeInCidrNotation the range of the IPv6 number in CIDR notation
     * @returns {IPv6CidrRange} the IPV6Range
     */
    static fromCidr(rangeInCidrNotation) {
        let [isValid, message] = Validator_1.Validator.isValidIPv6CidrNotation(rangeInCidrNotation);
        if (!isValid) {
            throw new Error(message.filter(msg => { return msg !== ''; }).toString());
        }
        let cidrComponents = rangeInCidrNotation.split("/");
        let ipString = cidrComponents[0];
        let prefix = BigInt(parseInt(cidrComponents[1]));
        return new IPv6CidrRange(IPNumber_1.IPv6.fromHexadecatet(ipString), Prefix_1.IPv6Prefix.fromNumber(prefix));
    }
    ;
    /**
     * Gets the size of IPv6 numbers contained within the IPv6 range
     *
     * @returns {bigint} the amount of IPv6 numbers in the range
     */
    getSize() {
        return this.cidrPrefix.toRangeSize();
    }
    /**
     * Method that returns the IPv6 range in CIDR (Classless Inter-Domain Routing) notation.
     *
     * See {@link https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing#CIDR_notation} for more information
     * on the Classless Inter-Domain Routing notation
     *
     * @returns {string} the IPv6 range in CIDR (Classless Inter-Domain Routing) notation
     */
    toCidrString() {
        let first = this.ipv6.toString();
        return `${first.toString()}/${this.cidrPrefix.toString()}`;
    }
    /**
     * Method that returns the IPv6 range in string notation where the first IPv6 number and last IPv6 number are
     * separated by an hyphen. eg. "2001:db8:0:0:0:0:0:0-2001:db8:0:ffff:ffff:ffff:ffff:ffff"
     *
     * @returns {string} the range in [first IPv6 number] - [last IPv6 number] format
     */
    toRangeString() {
        return super.toRangeString();
    }
    /**
     * Method that returns the first IPv6 number in the IPv6 range
     *
     * @returns {IPv6} the first IPv6 number in the IPv6 range
     */
    getFirst() {
        return IPNumber_1.IPv6.fromBigInt(this.ipv6.getValue() & (this.cidrPrefix.toMask().getValue()));
    }
    /**
     * Method that returns the last IPv6 number in the IPv6 range
     *
     * @returns {IPv6} the last IPv6 number in the IPv6 range
     */
    getLast() {
        return last(this, this.ipv6);
    }
    newInstance(num, prefix) {
        return new IPv6CidrRange(num, prefix);
    }
    getPrefix() {
        return this.cidrPrefix;
    }
    /**
     * Indicates whether the given IPv6 range is an adjacent range.
     *
     * An adjacent range being one where the end of the given range, when incremented by one marks the start of the
     * other range. Or where the start of the given range, when decreased by one, marks the end of the other range
     *
     * @param {IPv6CidrRange} otherRange the other IPv6 range to compare with
     * @returns {boolean} true if the two IPv6 ranges are consecutive, false otherwise
     */
    isConsecutive(otherRange) {
        return super.isConsecutive(otherRange);
    }
    /**
     * Indicates if the given IPv6 range is a subset.
     *
     * By a subset range, it means all the values of the given range are contained by this IPv6 range
     *
     * @param {IPv6CidrRange} otherRange the other IPv6 range
     * @returns {boolean} true if the other Ipv6 range is a subset. False otherwise.
     */
    contains(otherRange) {
        return super.contains(otherRange);
    }
    /**
     * Indicate if the given range is a container range.
     *
     * By container range, it means all the IP number in this current range can be found within the given range.
     *
     * @param {IPv6CidrRange} otherRange he other IPv6 range
     * @returns {boolean} true if the other Ipv6 range is a container range. False otherwise.
     */
    inside(otherRange) {
        return super.inside(otherRange);
    }
    /**
     * Checks if two IPv6 ranges overlap
     * @param {IPv6CidrRange} otherRange the other IPv6 range
     * @returns {boolean} true if the ranges overlap, false otherwise
     */
    isOverlapping(otherRange) {
        return super.isOverlapping(otherRange);
    }
    /**
     * Method that takes IPv6 number from within an IPv6 range, starting from the first IPv6 number
     *
     * @param {bigint} count the amount of IPv6 number to take from the IPv6 range
     * @returns {Array<IPv6>} an array of IPv6 number, taken from the IPv6 range
     */
    take(count) {
        let iPv6s = [this.getFirst()];
        let iteratingIPv6 = this.getFirst();
        if (count > (this.getSize())) {
            throw new Error(`${count.toString()} is greater than ${this.getSize().toString()}, the size of the range`);
        }
        for (var counter = 0; counter < count - 1n; counter++) {
            iPv6s.push(iteratingIPv6.nextIPNumber());
            iteratingIPv6 = iteratingIPv6.nextIPNumber();
        }
        return iPv6s;
    }
    /**
     * Method that splits an IPv6 cidr range into two halves
     *
     * @returns {Array<IPv6CidrRange>} An array of two {@link IPv6CidrRange}
     */
    split() {
        let prefixToSplit = this.cidrPrefix.getValue();
        if (prefixToSplit === 128n) {
            throw new Error("Cannot split an IP range with a single IP number");
        }
        let splitCidr = Prefix_1.IPv6Prefix.fromNumber(prefixToSplit + 1n);
        let firstIPOfFirstRange = this.getFirst();
        let firstRange = new IPv6CidrRange(firstIPOfFirstRange, splitCidr);
        let firstIPOfSecondRange = firstRange.getLast().nextIPNumber();
        let secondRange = new IPv6CidrRange(firstIPOfSecondRange, splitCidr);
        return [firstRange, secondRange];
    }
    /**
     * Method that split prefix into ranges of the given prefix,
     * throws an exception if the size of the given prefix is larger than target prefix
     *
     * @param prefix the prefix to use to split
     * @returns {Array<IPv6CidrRange>} An array of two {@link IPv6CidrRange}
     */
    splitInto(prefix) {
        let splitCount = prefix.getValue() - this.cidrPrefix.getValue();
        if (splitCount < 0) {
            throw new Error("Prefix to split into is larger than source prefix");
        }
        else if (splitCount === 0n) {
            return [new IPv6CidrRange(this.getFirst(), prefix)];
        }
        else if (splitCount === 1n) {
            return this.split();
        }
        else {
            let results = this.split();
            while (splitCount > 1) {
                results = results.flatMap(result => result.split());
                splitCount = splitCount - 1n;
            }
            return results;
        }
    }
    /**
     * Returns true if there is an adjacent IPv6 cidr range of exactly the same size next to this range
     */
    hasNextRange() {
        return super.hasNextRange();
    }
    /**
     * Returns true if there is an adjacent IPv6 cidr range of exactly the same size previous to this range
     */
    hasPreviousRange() {
        return super.hasPreviousRange();
    }
    /**
     * Return the next IPv6 cidr range, or undefined if no next range
     */
    nextRange() {
        if (this.hasNextRange()) {
            let sizeOfCurrentRange = this.getSize();
            let startOfNextRange = this.getFirst().getValue() + (sizeOfCurrentRange);
            return new IPv6CidrRange(new IPNumber_1.IPv6(startOfNextRange), this.cidrPrefix);
        }
        return;
    }
    /**
     * Return the previous IPv6 cidr range, or undefined if no next range
     */
    previousRange() {
        if (this.hasPreviousRange()) {
            let sizeOfCurrentRange = this.getSize();
            let startOfPreviousRange = this.getFirst().getValue() - sizeOfCurrentRange;
            return new IPv6CidrRange(new IPNumber_1.IPv6(startOfPreviousRange), this.cidrPrefix);
        }
        return;
    }
}
exports.IPv6CidrRange = IPv6CidrRange;
// utility functions shared by both IPv6CidrRange and IPv4CidrRange
let last = (range, ip) => {
    let bitValue = Number(range.bitValue.valueOf());
    let maskSize = BigInt(`0b${"1".repeat(bitValue)}`);
    let maskAsBigInteger = range.cidrPrefix.toMask().getValue();
    let invertedMask = BinaryUtils_1.leftPadWithZeroBit((maskAsBigInteger ^ (maskSize)).toString(2), bitValue);
    if (isIPv4CidrRange(range)) {
        return IPNumber_1.IPv4.fromNumber((ip.getValue()) | (BinaryUtils_1.parseBinaryStringToBigInt(invertedMask)));
    }
    else {
        return IPNumber_1.IPv6.fromBigInt((ip.getValue()) | (BinaryUtils_1.parseBinaryStringToBigInt(invertedMask)));
    }
};
function isIPv4CidrRange(ip) {
    return ip.bitValue.valueOf() === 32n;
}
exports.isIPv4CidrRange = isIPv4CidrRange;
//# sourceMappingURL=IPRange.js.map