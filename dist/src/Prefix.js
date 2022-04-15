"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isIPv4Prefix = exports.IPv6Prefix = exports.IPv4Prefix = void 0;
const Validator_1 = require("./Validator");
const IPNumber_1 = require("./IPNumber");
const BinaryUtils_1 = require("./BinaryUtils");
const HexadecimalUtils_1 = require("./HexadecimalUtils");
const Hexadecatet_1 = require("./Hexadecatet");
/**
 * Represents the prefix portion in the CIDR notation for representing IP ranges
 *
 * The IPv4 prefix portion represents the mask. It is the number of continuous bits turned on (with value 1)
 * counting from the left side of an 8 bit value.
 *
 * {@see https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing} for more information on CIDR
 */
class IPv4Prefix {
    /**
     * Constructor for an instance of IPv4 prefix from a decimal number
     *
     * @param {number} rawValue the decimal value to construct the IPv4 prefix from.
     * @returns {IPv4Prefix} the instance of an IPv4 prefix
     */
    constructor(rawValue) {
        this.type = "IPv4";
        this.bitValue = 32n;
        let isValid;
        let message;
        [isValid, message] = Validator_1.Validator.isValidPrefixValue(rawValue, "IPv4" /* IPv4 */);
        if (!isValid) {
            throw new Error(message.filter(msg => { return msg !== ''; }).toString());
        }
        this.value = rawValue;
    }
    /**
     * Convenience method for constructing an instance of IPv4 prefix from a decimal number
     *
     * @param {number} rawValue the decimal value to construct the IPv4 prefix from.
     * @returns {IPv4Prefix} the instance of an IPv4 prefix
     */
    static fromNumber(rawValue) {
        return new IPv4Prefix(rawValue);
    }
    ;
    static fromRangeSize(rangeSize) {
        let prefixNumber = rangeSize === (1n) ? 32 : 32 - rangeSizeToPrefix(rangeSize, Validator_1.Validator.IPV4_SIZE);
        return IPv4Prefix.fromNumber(BigInt(prefixNumber));
    }
    ;
    /**
     * Gets the decimal value of the IPv4 prefix
     *
     * @returns {number} the decimal value of the IPv4 prefix
     */
    getValue() {
        return this.value;
    }
    /**
     * Gets the decimal value of the IPv4 prefix as string
     * @returns {string} The decimal value of the IPv4 prefix as string
     */
    toString() {
        return this.value.toString();
    }
    /**
     * Converts the IPv4 prefix to a {@link IPv4Mask}
     *
     * The IPv4 mask is the representation of the prefix in the dot-decimal notation
     *
     * @returns {IPv4Mask} the mask representation of the prefix
     */
    toMask() {
        let onBits = '1'.repeat(Number(this.value));
        let offBits = '0'.repeat(Number(32n - this.value));
        return IPNumber_1.IPv4Mask.fromDecimalDottedString(this.toDecimalNotation(`${onBits}${offBits}`));
    }
    /**
     * Returns the size (number of IP numbers) of range of this prefix
     *
     * @return {bigint} the size (number of IP numbers) of range of this prefix
     */
    toRangeSize() {
        /**
         * Using bitwise shift operation this will be
         * 1 << (this.bitValue - this.getValue())
         * Since left shift a number by x is equivalent to multiplying the number by the power x raised to 2
         * 2 << 4 = 2 * (2 raised to 4)
         */
        return 1n << (this.bitValue - this.getValue());
    }
    /**
     * Returns a prefix for when this prefix is merged
     * with another prefix of the same size
     */
    merge() {
        return new IPv4Prefix(this.value - 1n);
    }
    /**
     * Returns a prefix for when this prefix is split
     * into two equal halves
     */
    split() {
        return new IPv4Prefix(this.value + 1n);
    }
    toDecimalNotation(bits) {
        return `${BinaryUtils_1.parseBinaryStringToBigInt(bits.substr(0, 8))}.${BinaryUtils_1.parseBinaryStringToBigInt(bits.substr(8, 8))}.${BinaryUtils_1.parseBinaryStringToBigInt(bits.substr(16, 8))}.${BinaryUtils_1.parseBinaryStringToBigInt(bits.substr(24, 8))}`;
    }
}
exports.IPv4Prefix = IPv4Prefix;
/**
 * Represents the prefix portion in the CIDR notation for representing IP ranges
 *
 * The IPv6 prefix portion represents the mask. It is the number of continuous bits turned on (with value 1)
 * counting from the left side of an 128 bit value.
 *
 * {@see https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing} for more information on CIDR
 */
class IPv6Prefix {
    /**
     * Constructor for an instance of IPv6 prefix from a decimal number
     *
     * @param {number} rawValue the decimal value to construct the IPv6 prefix from.
     * @returns {IPv4Prefix} the instance of an IPv6 prefix
     */
    constructor(rawValue) {
        this.type = "IPv6";
        this.bitValue = 128n;
        let isValid;
        let message;
        [isValid, message] = Validator_1.Validator.isValidPrefixValue(rawValue, "IPv6" /* IPv6 */);
        if (!isValid) {
            throw new Error(message.filter(msg => { return msg !== ''; }).toString());
        }
        this.value = rawValue;
    }
    /**
     * Convenience method for constructing an instance of IPv46 prefix from a decimal number
     *
     * @param {number} rawValue the decimal value to construct the IPv6 prefix from.
     * @returns {IPv4Prefix} the instance of an IPv6 prefix
     */
    static fromNumber(rawValue) {
        return new IPv6Prefix(rawValue);
    }
    ;
    static fromRangeSize(rangeSize) {
        let prefixNumber = rangeSize === (1n) ? 128 : 128 - rangeSizeToPrefix(rangeSize, Validator_1.Validator.IPV6_SIZE);
        return IPv6Prefix.fromNumber(BigInt(prefixNumber));
    }
    /**
     * Gets the decimal value of the IPv6 prefix
     *
     * @returns {number} the decimal value of the IPv6 prefix
     */
    getValue() {
        return this.value;
    }
    /**
     * Gets the decimal value of the IPv4 prefix as string
     * @returns {string} he decimal value of the IPv4 prefix as string
     */
    toString() {
        return this.value.toString();
    }
    /**
     * Converts the IPv6 prefix to a {@link IPv6Mask}
     *
     * The IPv6 mask is the representation of the prefix in 8 groups of 16 bit values represented in hexadecimal
     *
     * @returns {IPv6Mask} the mask representation of the prefix
     */
    toMask() {
        let onBits = '1'.repeat(Number(this.value));
        let offBits = '0'.repeat(128 - Number(this.value));
        return IPNumber_1.IPv6Mask.fromHexadecatet(this.toHexadecatetNotation(`${onBits}${offBits}`));
    }
    /**
     * Returns the size (number of IP numbers) of range of this prefix
     *
     * @return {bigint} the size (number of IP numbers) of range of this prefix
     */
    toRangeSize() {
        /**
         * Using bitwise shift operation this will be
         * 1 << (this.bitValue - this.getValue())
         * Since left shift a number by x is equivalent to multiplying the number by the power x raised to 2
         * 2 << 4 = 2 * (2 raised to 4)
         */
        return 1n << (this.bitValue - this.getValue());
    }
    /**
     * Returns a prefix for when this prefix is merged
     * with another prefix of the same size
     */
    merge() {
        return new IPv6Prefix(this.value - 1n);
    }
    /**
     * Returns a prefix for when this prefix is split
     * into two equal halves
     */
    split() {
        return new IPv6Prefix(this.value + 1n);
    }
    toHexadecatetNotation(bits) {
        let binaryStrings = bits.match(/.{1,16}/g);
        let hexadecimalStrings = binaryStrings.map((binaryString) => {
            return Hexadecatet_1.Hexadecatet.fromString(HexadecimalUtils_1.binaryStringToHexadecimalString(binaryString));
        });
        return hexadecimalStrings.map((value) => { return value.toString(); }).join(":");
    }
}
exports.IPv6Prefix = IPv6Prefix;
function rangeSizeToPrefix(rangeSize, rangeMaxSize) {
    let ipType = rangeMaxSize > (Validator_1.Validator.IPV4_SIZE) ? "IPv6" : "IPv4";
    if (rangeSize > (rangeMaxSize) || rangeSize === (0n)) {
        throw new Error(Validator_1.Validator.invalidIPRangeSizeMessage.replace("$iptype", ipType));
    }
    try {
        return BinaryUtils_1.intLog2(rangeSize);
    }
    catch (e) {
        throw new Error(Validator_1.Validator.invalidIPRangeSizeForCidrMessage);
    }
}
/**
 * Check is the given Prefix is an {@link IPv4Prefix} or not
 * @param prefix the IP prefix to check if it is IPv4Prefix.
 */
function isIPv4Prefix(prefix) {
    return prefix.type === "IPv4";
}
exports.isIPv4Prefix = isIPv4Prefix;
/**
 * Check is the given Prefix is an {@link IPv4Prefix} or not
 * @param prefix the IP prefix to check if it is IPv4Prefix.
 */
function isIPv6Prefix(prefix) {
    return prefix.type === "IPv6";
}
//# sourceMappingURL=Prefix.js.map