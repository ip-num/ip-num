'use strict';
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
exports.Validator = void 0;
var BinaryUtils_1 = require("./BinaryUtils");
var BinaryUtils_2 = require("./BinaryUtils");
var bigInt = require("big-integer");
var IPv6Utils_1 = require("./IPv6Utils");
var HexadecimalUtils_1 = require("./HexadecimalUtils");
var HexadecimalUtils_2 = require("./HexadecimalUtils");
var Validator = /** @class */ (function () {
    function Validator() {
    }
    /**
     * Checks if given ipNumber is in between the given lower and upper bound
     *
     * @param ipNumber ipNumber to check
     * @param lowerBound lower bound
     * @param upperBound upper bound
     * @returns {boolean} true if ipNumber is between lower and upper bound
     */
    Validator.isWithinRange = function (ipNumber, lowerBound, upperBound) {
        return ipNumber.greaterOrEquals(lowerBound) && ipNumber.lesserOrEquals(upperBound);
    };
    /**
     * Checks if the number given is within the value considered valid for an ASN number
     *
     * @param asnNumber the asn number to validate
     * @returns {[boolean , string]} first value is true if valid ASN, false otherwise. Second value contains
     * "valid" or an error message when value is invalid
     */
    Validator.isValidAsnNumber = function (asnNumber) {
        var isValid = this.isWithinRange(asnNumber, bigInt.zero, this.THIRTY_TWO_BIT_SIZE);
        return [isValid, isValid ? [] : [Validator.invalidAsnRangeMessage]];
    };
    /**
     * Checks if the given ASN number is a 16bit ASN number
     *
     * @param {bigInt.BigInteger} asnNumber to check if 16bit or not
     * @returns {[boolean , string]} first value is true if valid 16bit ASN, false otherwise. Second value contains
     * "valid" or an error message when value is invalid
     */
    Validator.isValid16BitAsnNumber = function (asnNumber) {
        var isValid = Validator.isWithinRange(asnNumber, bigInt.zero, Validator.SIXTEEN_BIT_SIZE);
        return [isValid, isValid ? [] : [Validator.invalid16BitAsnRangeMessage]];
    };
    /**
     * Checks if the number given is within the value considered valid for an IPv4 number
     *
     * @param ipv4Number the asn number to validate
     * @returns {[boolean , string]} first value is true if valid IPv4 number, false otherwise. Second value contains
     * "valid" or an error message when value is invalid
     */
    Validator.isValidIPv4Number = function (ipv4Number) {
        var isValid = this.isWithinRange(ipv4Number, bigInt.zero, this.THIRTY_TWO_BIT_SIZE);
        return isValid ? [isValid, []] : [isValid, [Validator.invalidIPv4NumberMessage]];
    };
    /**
     * Checks if the number given is within the value considered valid for an IPv6 number
     *
     * @param ipv6Number the asn number to validate
     * @returns {[boolean , string]} first value is true if valid IPv6 number, false otherwise. Second value contains
     * "valid" or an error message when value is invalid
     */
    Validator.isValidIPv6Number = function (ipv6Number) {
        var isValid = this.isWithinRange(ipv6Number, bigInt.zero, this.ONE_HUNDRED_AND_TWENTY_EIGHT_BIT_SIZE);
        return isValid ? [isValid, []] : [isValid, [Validator.invalidIPv6NumberMessage]];
    };
    /**
     * Checks if the number given is valid for an IPv4 octet
     *
     * @param octetNumber the octet value
     * @returns {boolean} true if valid octet, false otherwise
     */
    Validator.isValidIPv4Octet = function (octetNumber) {
        var withinRange = this.isWithinRange(octetNumber, bigInt.zero, this.EIGHT_BIT_SIZE);
        return [withinRange, withinRange ? [] : [Validator.invalidOctetRangeMessage]];
    };
    /**
     * Checks if the number given is valid for an IPv6 hexadecatet
     *
     * @param {bigInt.BigInteger} hexadecatetNum the hexadecatet value
     * @returns {[boolean , string]} first value is true if valid hexadecatet, false otherwise. Second value contains
     * "valid" or an error message when value is invalid
     */
    Validator.isValidIPv6Hexadecatet = function (hexadecatetNum) {
        var isValid = this.isWithinRange(hexadecatetNum, bigInt.zero, this.SIXTEEN_BIT_SIZE);
        return isValid ? [isValid, []] : [isValid, [Validator.invalidHexadecatetMessage]];
    };
    /**
     * Checks if given string is a valid IPv4 value.
     *
     * @param {string} ipv4String the IPv4 string to validate
     * @returns {[boolean , string]} result of validation, first value represents if is valid IPv4, second value
     * contains error message if invalid IPv4
     */
    Validator.isValidIPv4String = function (ipv4String) {
        var rawOctets = ipv4String.split(".");
        if (rawOctets.length != 4 || rawOctets.includes('')) {
            return [false, [Validator.invalidOctetCountMessage]];
        }
        var isValid = rawOctets.every(function (octet) {
            return Validator.isNumeric(octet) ? Validator.isValidIPv4Octet(bigInt(octet))[0] : false;
        });
        return [isValid, isValid ? [] : [Validator.invalidOctetRangeMessage]];
    };
    /**
     * Checks if given string is a valid IPv6 value.
     *
     * @param {string} ipv6String the IPv6 string to validate
     * @returns {[boolean , string]} result of validation, first value represents if is valid IPv6, second value
     * contains error message if invalid IPv6
     */
    Validator.isValidIPv6String = function (ipv6String) {
        try {
            var hexadecimals = IPv6Utils_1.expandIPv6Number(ipv6String).split(":");
            if (hexadecimals.length != 8) {
                return [false, [Validator.invalidHexadecatetCountMessage]];
            }
            var isValid = hexadecimals.every(function (hexadecimal) {
                return Validator.isHexadecatet(hexadecimal) ?
                    Validator.isValidIPv6Hexadecatet(bigInt(parseInt(hexadecimal, 16)))[0] : false;
            });
            return [isValid, isValid ? [] : [Validator.invalidHexadecatetMessage]];
        }
        catch (error) {
            return [false, [error]];
        }
    };
    /**
     * Checks if given value is a valid prefix value
     *
     * @param prefixValue value to check
     * @param ipNumType The type of IP number
     * @returns {(boolean|string)[]} a tuple representing if valid or not and corresponding message
     */
    Validator.isValidPrefixValue = function (prefixValue, ipNumType) {
        if ("IPv4" /* IPv4 */ === ipNumType) {
            var withinRange = Validator.isWithinRange(bigInt(prefixValue), bigInt.zero, bigInt(32));
            return [withinRange, withinRange ? [] : [Validator.invalidPrefixValueMessage]];
        }
        if ("IPv6" /* IPv6 */ === ipNumType) {
            var withinRange = Validator.isWithinRange(bigInt(prefixValue), bigInt.zero, bigInt(128));
            return [withinRange, withinRange ? [] : [Validator.invalidPrefixValueMessage]];
        }
        return [false, [Validator.invalidInetNumType]];
    };
    /**
     * Checks if given string is a valid IPv4 mask
     *
     * @param {string} ipv4MaskString the given IPv4 mask string
     * @returns {[boolean , string]} first value is true if valid IPv4 mask string, false otherwise. Second value
     * contains "valid" or an error message when value is invalid
     */
    Validator.isValidIPv4Mask = function (ipv4MaskString) {
        var ipv4InBinary = BinaryUtils_1.dottedDecimalNotationToBinaryString(ipv4MaskString);
        var isValid = Validator.IPV4_CONTIGUOUS_MASK_BIT_PATTERN.test(ipv4InBinary);
        return isValid ? [isValid, []] : [isValid, [Validator.invalidMaskMessage]];
    };
    /**
     * Checks if given string is a valid IPv6 mask
     *
     * @param {string} ipv6MaskString the given IPv6 mask string
     * @returns {[boolean , string]} first value is true if valid IPv6 mask string, false otherwise. Second value
     * contains "valid" or an error message when value is invalid
     */
    Validator.isValidIPv6Mask = function (ipv6MaskString) {
        var ipv6InBinary = HexadecimalUtils_2.hexadectetNotationToBinaryString(ipv6MaskString);
        var isValid = Validator.IPV6_CONTIGUOUS_MASK_BIT_PATTERN.test(ipv6InBinary);
        return isValid ? [isValid, []] : [isValid, [Validator.invalidMaskMessage]];
    };
    /**
     * Checks if the given string is a valid IPv4 range in Cidr notation
     *
     * @param {string} ipv4RangeAsCidrString the IPv4 range in Cidr notation
     *
     * @returns {[boolean , string[]]} first value is true if valid IPv4 range in Cidr notation, false otherwise. Second
     * value contains "valid" or an error message when value is invalid
     */
    Validator.isValidIPv4CidrNotation = function (ipv4RangeAsCidrString) {
        var cidrComponents = ipv4RangeAsCidrString.split("/");
        if (cidrComponents.length !== 2 || (cidrComponents[0].length === 0 || cidrComponents[1].length === 0)) {
            return [false, [Validator.invalidIPv4CidrNotationMessage]];
        }
        var ip = cidrComponents[0];
        var range = cidrComponents[1];
        if (isNaN(Number(range))) {
            return [false, [Validator.invalidIPv4CidrNotationMessage]];
        }
        var _a = __read(Validator.isValidIPv4String(ip), 2), validIpv4 = _a[0], invalidIpv4Message = _a[1];
        var _b = __read(Validator.isValidPrefixValue(Number(range), "IPv4" /* IPv4 */), 2), validPrefix = _b[0], invalidPrefixMessage = _b[1];
        var isValid = validIpv4 && validPrefix;
        var invalidMessage = invalidIpv4Message.concat(invalidPrefixMessage);
        return isValid ? [isValid, []] : [isValid, invalidMessage];
    };
    /**
     *  Checks if the given string is a valid IPv4 range in Cidr notation, with the ip number in the cidr notation
     *  being the start of the range
     *
     * @param {string}  ipv4CidrNotation the IPv4 range in Cidr notation
     *
     * * @returns {[boolean , string[]]} first value is true if valid Cidr notation, false otherwise. Second
     * value contains [] or an array of error message when invalid
     */
    Validator.isValidIPv4CidrRange = function (ipv4CidrNotation) {
        return Validator.isValidCidrRange(ipv4CidrNotation, Validator.isValidIPv4CidrNotation, BinaryUtils_1.dottedDecimalNotationToBinaryString, function (value) { return BinaryUtils_2.cidrPrefixToMaskBinaryString(value, "IPv4" /* IPv4 */); });
    };
    /**
     *  Checks if the given string is a valid IPv6 range in Cidr notation, with the ip number in the cidr notation
     *  being the start of the range
     *
     * @param {string}  ipv6CidrNotation the IPv6 range in Cidr notation
     *
     * * @returns {[boolean , string[]]} first value is true if valid Cidr notation, false otherwise. Second
     * value contains [] or an array of error message when invalid
     */
    Validator.isValidIPv6CidrRange = function (ipv6CidrNotation) {
        return Validator.isValidCidrRange(ipv6CidrNotation, Validator.isValidIPv6CidrNotation, HexadecimalUtils_1.colonHexadecimalNotationToBinaryString, function (value) { return BinaryUtils_2.cidrPrefixToMaskBinaryString(value, "IPv6" /* IPv6 */); });
    };
    Validator.isValidCidrRange = function (rangeString, cidrNotationValidator, toBinaryStringConverter, prefixFactory) {
        var validationResult = cidrNotationValidator(rangeString);
        if (!validationResult[0]) {
            return validationResult;
        }
        var cidrComponents = rangeString.split("/");
        var ip = cidrComponents[0];
        var range = cidrComponents[1];
        var ipNumber = bigInt(toBinaryStringConverter(ip), 2);
        var mask = bigInt(prefixFactory(parseInt(range)), 2);
        var isValid = ipNumber.and(mask).equals(ipNumber);
        return isValid ? [isValid, []] : [isValid, [Validator.InvalidIPCidrRangeMessage]];
    };
    Validator.isValidIPv4RangeString = function (ipv4RangeString) {
        var firstLastValidator = function (firstIP, lastIP) { return bigInt(BinaryUtils_1.dottedDecimalNotationToBinaryString(firstIP))
            .greaterOrEquals(BinaryUtils_1.dottedDecimalNotationToBinaryString(lastIP)); };
        return this.isValidRange(ipv4RangeString, Validator.isValidIPv4String, firstLastValidator);
    };
    Validator.isValidIPv6RangeString = function (ipv6RangeString) {
        var firstLastValidator = function (firstIP, lastIP) { return bigInt(HexadecimalUtils_2.hexadectetNotationToBinaryString(firstIP))
            .greaterOrEquals(HexadecimalUtils_2.hexadectetNotationToBinaryString(lastIP)); };
        return this.isValidRange(ipv6RangeString, Validator.isValidIPv6String, firstLastValidator);
    };
    // static isValidIPv4RangeSize(rangeSize: bigInt.BigInteger): boolean {
    //     if (rangeSize.greater(Validator.IPV4_SIZE) || rangeSize.equals(bigInt(0))) {
    //         [false, [Validator.invalidIPRangeSizeMessage]];
    //     }
    //     let size = rangeSize;
    //     while (size.isEven()) {
    //         if (size.isOdd() || size.equals(bigInt(2))) {
    //             break;
    //         }
    //         size = size.shiftRight(bigInt(1));
    //     }
    //     return size.isEven();
    // }
    Validator.isValidRange = function (rangeString, validator, firstLastValidator) {
        var rangeComponents = rangeString.split("-").map(function (component) { return component.trim(); });
        if (rangeComponents.length !== 2 || (rangeComponents[0].length === 0 || rangeComponents[1].length === 0)) {
            return [false, [Validator.invalidRangeNotationMessage]];
        }
        var firstIP = rangeComponents[0];
        var lastIP = rangeComponents[1];
        var _a = __read(validator(firstIP), 2), validFirstIP = _a[0], invalidFirstIPMessage = _a[1];
        var _b = __read(validator(lastIP), 2), validLastIP = _b[0], invalidLastIPMessage = _b[1];
        var isValid = validFirstIP && validLastIP;
        if (isValid && firstLastValidator(firstIP, lastIP)) {
            return [false, [Validator.invalidRangeFirstNotGreaterThanLastMessage]];
        }
        var invalidMessage = invalidFirstIPMessage.concat(invalidLastIPMessage);
        return isValid ? [isValid, []] : [isValid, invalidMessage];
    };
    /**
     * Checks if the given string is a valid IPv6 range in Cidr notation
     *
     * @param {string} ipv6RangeAsCidrString the IPv6 range in Cidr notation
     *
     * @returns {[boolean , string]} first value is true if valid IPv6 range in Cidr notation, false otherwise.
     * Second value contains "valid" or an error message when value is invalid
     */
    // TODO change to be like isValidIPv4CidrNotation where validation is done on the component of the cidr notation
    // instead of a single regex check
    Validator.isValidIPv6CidrNotation = function (ipv6RangeAsCidrString) {
        var isValid = Validator.IPV6_RANGE_PATTERN.test(ipv6RangeAsCidrString);
        return isValid ? [isValid, []] : [isValid, [Validator.invalidIPv6CidrNotationString]];
    };
    /**
     * Checks if the given string is a binary string. That is contains only contiguous 1s and 0s
     *
     * @param {string} binaryString the binary string
     * @returns {(boolean|string)[]} a tuple representing if valid or not and corresponding message
     */
    Validator.isValidBinaryString = function (binaryString) {
        if (/^([10])+$/.test(binaryString)) {
            return [true, []];
        }
        else {
            return [false, [Validator.invalidBinaryStringErrorMessage]];
        }
    };
    Validator.isNumeric = function (value) {
        return /^(\d+)$/.test(value);
    };
    Validator.isHexadecatet = function (value) {
        return /^[0-9A-Fa-f]{4}$/.test(value);
    };
    Validator.IPV4_PATTERN = new RegExp(/^(0?[0-9]?[0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.(0?[0-9]?[0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.(0?[0-9]?[0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.(0?[0-9]?[0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])$/);
    Validator.IPV4_RANGE_PATTERN = new RegExp(/^(0?[0-9]?[0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.(0?[0-9]?[0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.(0?[0-9]?[0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.(0?[0-9]?[0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])(\/)([1-9]|[1-2][0-9]|3[0-2])$/);
    Validator.IPV6_RANGE_PATTERN = new RegExp(/^s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:)))(%.+)?s*(\/([0-9]|[1-9][0-9]|1[0-1][0-9]|12[0-8]))?$/);
    Validator.IPV4_CONTIGUOUS_MASK_BIT_PATTERN = new RegExp(/^(1){0,32}(0){0,32}$/);
    Validator.IPV6_CONTIGUOUS_MASK_BIT_PATTERN = new RegExp(/^(1){0,128}(0){0,128}$/);
    Validator.EIGHT_BIT_SIZE = bigInt("1".repeat(8), 2);
    Validator.SIXTEEN_BIT_SIZE = bigInt("1".repeat(16), 2);
    Validator.THIRTY_TWO_BIT_SIZE = bigInt("1".repeat(32), 2);
    Validator.ONE_HUNDRED_AND_TWENTY_EIGHT_BIT_SIZE = bigInt("1".repeat(128), 2);
    Validator.IPV4_SIZE = bigInt("4294967296");
    Validator.IPV6_SIZE = bigInt("340282366920938463463374607431768211456");
    Validator.invalidAsnRangeMessage = "ASN number given less than zero or is greater than 32bit";
    Validator.invalid16BitAsnRangeMessage = "ASN number given less than zero or is greater than 16bit";
    Validator.invalidIPv4NumberMessage = "IPv4 number given less than zero or is greater than 32bit";
    Validator.invalidIPv6NumberMessage = "IPv6 number given less than zero or is greater than 128bit";
    Validator.invalidOctetRangeMessage = "Value given contains an invalid Octet; Value is less than zero or is greater than 8bit";
    Validator.invalidHexadecatetMessage = "The value given is less than zero or is greater than 16bit";
    Validator.invalidOctetCountMessage = "An IP4 number cannot have less or greater than 4 octets";
    Validator.invalidHexadecatetCountMessage = "An IP6 number must have exactly 8 hexadecatet";
    Validator.invalidMaskMessage = "The Mask is invalid";
    Validator.invalidPrefixValueMessage = "A Prefix value cannot be less than 0 or greater than 32";
    Validator.invalidIPv4CidrNotationMessage = "Cidr notation should be in the form [ip number]/[range]";
    Validator.InvalidIPCidrRangeMessage = "Given IP number portion must is not the start of the range";
    Validator.invalidRangeNotationMessage = "Range notation should be in the form [first ip]-[last ip]";
    Validator.invalidRangeFirstNotGreaterThanLastMessage = "First IP in [first ip]-[last ip] must be less than Last IP";
    Validator.invalidIPv6CidrNotationString = "A Cidr notation string should contain an IPv6 number and prefix";
    Validator.takeOutOfRangeSizeMessage = "$count is greater than $size, the size of the range";
    Validator.cannotSplitSingleRangeErrorMessage = "Cannot split an IP range with a single IP number";
    Validator.invalidInetNumType = "Given ipNumType must be either InetNumType.IPv4 or InetNumType.IPv6";
    Validator.invalidBinaryStringErrorMessage = "Binary string should contain only contiguous 1s and 0s";
    Validator.invalidIPRangeSizeMessage = "Given size is zero or greater than maximum size of $iptype";
    Validator.invalidIPRangeSizeForCidrMessage = "Given size can't be created via cidr prefix";
    return Validator;
}());
exports.Validator = Validator;
//# sourceMappingURL=Validator.js.map