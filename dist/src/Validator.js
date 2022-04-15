'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validator = void 0;
const BinaryUtils_1 = require("./BinaryUtils");
const BinaryUtils_2 = require("./BinaryUtils");
const IPv6Utils_1 = require("./IPv6Utils");
const HexadecimalUtils_1 = require("./HexadecimalUtils");
const HexadecimalUtils_2 = require("./HexadecimalUtils");
class Validator {
    /**
     * Checks if given ipNumber is in between the given lower and upper bound
     *
     * @param ipNumber ipNumber to check
     * @param lowerBound lower bound
     * @param upperBound upper bound
     * @returns {boolean} true if ipNumber is between lower and upper bound
     */
    static isWithinRange(ipNumber, lowerBound, upperBound) {
        return ipNumber >= lowerBound && ipNumber <= upperBound;
    }
    /**
     * Checks if the number given is within the value considered valid for an ASN number
     *
     * @param asnNumber the asn number to validate
     * @returns {[boolean , string]} first value is true if valid ASN, false otherwise. Second value contains
     * "valid" or an error message when value is invalid
     */
    static isValidAsnNumber(asnNumber) {
        let isValid = this.isWithinRange(asnNumber, 0n, this.THIRTY_TWO_BIT_SIZE);
        return [isValid, isValid ? [] : [Validator.invalidAsnRangeMessage]];
    }
    /**
     * Checks if the given ASN number is a 16bit ASN number
     *
     * @param {bigint} asnNumber to check if 16bit or not
     * @returns {[boolean , string]} first value is true if valid 16bit ASN, false otherwise. Second value contains
     * "valid" or an error message when value is invalid
     */
    static isValid16BitAsnNumber(asnNumber) {
        let isValid = Validator.isWithinRange(asnNumber, 0n, Validator.SIXTEEN_BIT_SIZE);
        return [isValid, isValid ? [] : [Validator.invalid16BitAsnRangeMessage]];
    }
    /**
     * Checks if the number given is within the value considered valid for an IPv4 number
     *
     * @param ipv4Number the asn number to validate
     * @returns {[boolean , string]} first value is true if valid IPv4 number, false otherwise. Second value contains
     * "valid" or an error message when value is invalid
     */
    static isValidIPv4Number(ipv4Number) {
        ipv4Number = typeof ipv4Number === "bigint" ? ipv4Number : BigInt(ipv4Number);
        let isValid = this.isWithinRange(ipv4Number, 0n, this.THIRTY_TWO_BIT_SIZE);
        return isValid ? [isValid, []] : [isValid, [Validator.invalidIPv4NumberMessage]];
    }
    /**
     * Checks if the number given is within the value considered valid for an IPv6 number
     *
     * @param ipv6Number the asn number to validate
     * @returns {[boolean , string]} first value is true if valid IPv6 number, false otherwise. Second value contains
     * "valid" or an error message when value is invalid
     */
    static isValidIPv6Number(ipv6Number) {
        let isValid = this.isWithinRange(ipv6Number, 0n, this.ONE_HUNDRED_AND_TWENTY_EIGHT_BIT_SIZE);
        return isValid ? [isValid, []] : [isValid, [Validator.invalidIPv6NumberMessage]];
    }
    /**
     * Checks if the number given is valid for an IPv4 octet
     *
     * @param octetNumber the octet value
     * @returns {boolean} true if valid octet, false otherwise
     */
    static isValidIPv4Octet(octetNumber) {
        let withinRange = this.isWithinRange(octetNumber, 0n, this.EIGHT_BIT_SIZE);
        return [withinRange, withinRange ? [] : [Validator.invalidOctetRangeMessage]];
    }
    /**
     * Checks if the number given is valid for an IPv6 hexadecatet
     *
     * @param {bigint} hexadecatetNum the hexadecatet value
     * @returns {[boolean , string]} first value is true if valid hexadecatet, false otherwise. Second value contains
     * "valid" or an error message when value is invalid
     */
    static isValidIPv6Hexadecatet(hexadecatetNum) {
        let isValid = this.isWithinRange(hexadecatetNum, 0n, this.SIXTEEN_BIT_SIZE);
        return isValid ? [isValid, []] : [isValid, [Validator.invalidHexadecatetMessage]];
    }
    /**
     * Checks if given string is a valid IPv4 value.
     *
     * @param {string} ipv4String the IPv4 string to validate
     * @returns {[boolean , string]} result of validation, first value represents if is valid IPv4, second value
     * contains error message if invalid IPv4
     */
    static isValidIPv4String(ipv4String) {
        let rawOctets = ipv4String.split(".");
        if (rawOctets.length != 4 || rawOctets.includes('')) {
            return [false, [Validator.invalidOctetCountMessage]];
        }
        let isValid = rawOctets.every(octet => {
            return Validator.isNumeric(octet) ? Validator.isValidIPv4Octet(BigInt(octet))[0] : false;
        });
        if (!isValid) {
            return [false, [Validator.invalidOctetRangeMessage]];
        }
        isValid = Validator.IPV4_PATTERN.test(ipv4String);
        return [isValid, isValid ? [] : [Validator.invalidIPv4PatternMessage]];
    }
    /**
     * Checks if given string is a valid IPv6 value.
     *
     * @param {string} ipv6String the IPv6 string to validate
     * @returns {[boolean , string]} result of validation, first value represents if is valid IPv6, second value
     * contains error message if invalid IPv6
     */
    static isValidIPv6String(ipv6String) {
        try {
            let hexadecimals = IPv6Utils_1.expandIPv6Number(ipv6String).split(":");
            if (hexadecimals.length != 8) {
                return [false, [Validator.invalidHexadecatetCountMessage]];
            }
            let isValid = hexadecimals.every(hexadecimal => {
                return Validator.isHexadecatet(hexadecimal) ?
                    Validator.isValidIPv6Hexadecatet(BigInt(`0x${hexadecimal}`))[0] : false;
            });
            if (!isValid) {
                return [false, [Validator.invalidHexadecatetMessage]];
            }
            isValid = Validator.IPV6_PATTERN.test(ipv6String);
            return [isValid, isValid ? [] : [Validator.invalidIPv6PatternMessage]];
        }
        catch (error) {
            return [false, [error]];
        }
    }
    /**
     * Checks if given value is a valid prefix value
     *
     * @param prefixValue value to check
     * @param ipNumType The type of IP number
     * @returns {(boolean|string)[]} a tuple representing if valid or not and corresponding message
     */
    static isValidPrefixValue(prefixValue, ipNumType) {
        if ("IPv4" /* IPv4 */ === ipNumType) {
            let withinRange = Validator.isWithinRange(BigInt(prefixValue), 0n, 32n);
            return [withinRange, withinRange ? [] : [Validator.invalidPrefixValueMessage]];
        }
        if ("IPv6" /* IPv6 */ === ipNumType) {
            let withinRange = Validator.isWithinRange(BigInt(prefixValue), 0n, 128n);
            return [withinRange, withinRange ? [] : [Validator.invalidPrefixValueMessage]];
        }
        return [false, [Validator.invalidInetNumType]];
    }
    /**
     * Checks if given string is a valid IPv4 mask
     *
     * @param {string} ipv4MaskString the given IPv4 mask string
     * @returns {[boolean , string]} first value is true if valid IPv4 mask string, false otherwise. Second value
     * contains "valid" or an error message when value is invalid
     */
    static isValidIPv4Mask(ipv4MaskString) {
        let ipv4InBinary = BinaryUtils_1.dottedDecimalNotationToBinaryString(ipv4MaskString);
        let isValid = Validator.IPV4_CONTIGUOUS_MASK_BIT_PATTERN.test(ipv4InBinary);
        return isValid ? [isValid, []] : [isValid, [Validator.invalidMaskMessage]];
    }
    /**
     * Checks if given string is a valid IPv6 mask
     *
     * @param {string} ipv6MaskString the given IPv6 mask string
     * @returns {[boolean , string]} first value is true if valid IPv6 mask string, false otherwise. Second value
     * contains "valid" or an error message when value is invalid
     */
    static isValidIPv6Mask(ipv6MaskString) {
        let ipv6InBinary = HexadecimalUtils_2.hexadectetNotationToBinaryString(ipv6MaskString);
        let isValid = Validator.IPV6_CONTIGUOUS_MASK_BIT_PATTERN.test(ipv6InBinary);
        return isValid ? [isValid, []] : [isValid, [Validator.invalidMaskMessage]];
    }
    /**
     * Checks if the given string is a valid IPv4 range in Cidr notation
     *
     * @param {string} ipv4RangeAsCidrString the IPv4 range in Cidr notation
     *
     * @returns {[boolean , string[]]} first value is true if valid IPv4 range in Cidr notation, false otherwise. Second
     * value contains "valid" or an error message when value is invalid
     */
    static isValidIPv4CidrNotation(ipv4RangeAsCidrString) {
        let cidrComponents = ipv4RangeAsCidrString.split("/");
        if (cidrComponents.length !== 2 || (cidrComponents[0].length === 0 || cidrComponents[1].length === 0)) {
            return [false, [Validator.invalidIPv4CidrNotationMessage]];
        }
        let ip = cidrComponents[0];
        let range = cidrComponents[1];
        if (isNaN(Number(range))) {
            return [false, [Validator.invalidIPv4CidrNotationMessage]];
        }
        let [validIpv4, invalidIpv4Message] = Validator.isValidIPv4String(ip);
        let [validPrefix, invalidPrefixMessage] = Validator.isValidPrefixValue(BigInt(range), "IPv4" /* IPv4 */);
        let isValid = validIpv4 && validPrefix;
        let invalidMessage = invalidIpv4Message.concat(invalidPrefixMessage);
        return isValid ? [isValid, []] : [isValid, invalidMessage];
    }
    /**
     *  Checks if the given string is a valid IPv4 range in Cidr notation, with the ip number in the cidr notation
     *  being the start of the range
     *
     * @param {string}  ipv4CidrNotation the IPv4 range in Cidr notation
     *
     * * @returns {[boolean , string[]]} first value is true if valid Cidr notation, false otherwise. Second
     * value contains [] or an array of error message when invalid
     */
    static isValidIPv4CidrRange(ipv4CidrNotation) {
        return Validator.isValidCidrRange(ipv4CidrNotation, Validator.isValidIPv4CidrNotation, BinaryUtils_1.dottedDecimalNotationToBinaryString, (value) => BinaryUtils_2.cidrPrefixToMaskBinaryString(value, "IPv4" /* IPv4 */));
    }
    /**
     *  Checks if the given string is a valid IPv6 range in Cidr notation, with the ip number in the cidr notation
     *  being the start of the range
     *
     * @param {string}  ipv6CidrNotation the IPv6 range in Cidr notation
     *
     * * @returns {[boolean , string[]]} first value is true if valid Cidr notation, false otherwise. Second
     * value contains [] or an array of error message when invalid
     */
    static isValidIPv6CidrRange(ipv6CidrNotation) {
        return Validator.isValidCidrRange(ipv6CidrNotation, Validator.isValidIPv6CidrNotation, HexadecimalUtils_1.colonHexadecimalNotationToBinaryString, (value) => BinaryUtils_2.cidrPrefixToMaskBinaryString(value, "IPv6" /* IPv6 */));
    }
    static isValidCidrRange(rangeString, cidrNotationValidator, toBinaryStringConverter, prefixFactory) {
        let validationResult = cidrNotationValidator(rangeString);
        if (!validationResult[0]) {
            return validationResult;
        }
        let cidrComponents = rangeString.split("/");
        let ip = cidrComponents[0];
        let range = cidrComponents[1];
        let ipNumber = BigInt(`0b${toBinaryStringConverter(ip)}`);
        let mask = BigInt(`0b${prefixFactory(parseInt(range))}`);
        let isValid = (ipNumber & (mask)) === (ipNumber);
        return isValid ? [isValid, []] : [isValid, [Validator.InvalidIPCidrRangeMessage]];
    }
    static isValidIPv4RangeString(ipv4RangeString) {
        let firstLastValidator = (firstIP, lastIP) => BigInt(`0b${BinaryUtils_1.dottedDecimalNotationToBinaryString(firstIP)}`)
            >= BigInt(`0b${BinaryUtils_1.dottedDecimalNotationToBinaryString(lastIP)}`);
        return this.isValidRange(ipv4RangeString, Validator.isValidIPv4String, firstLastValidator);
    }
    static isValidIPv6RangeString(ipv6RangeString) {
        let firstLastValidator = (firstIP, lastIP) => BigInt(`0b${HexadecimalUtils_2.hexadectetNotationToBinaryString(firstIP)}`)
            >= BigInt(`0b${HexadecimalUtils_2.hexadectetNotationToBinaryString(lastIP)}`);
        return this.isValidRange(ipv6RangeString, Validator.isValidIPv6String, firstLastValidator);
    }
    static isValidRange(rangeString, validator, firstLastValidator) {
        let rangeComponents = rangeString.split("-").map(component => component.trim());
        if (rangeComponents.length !== 2 || (rangeComponents[0].length === 0 || rangeComponents[1].length === 0)) {
            return [false, [Validator.invalidRangeNotationMessage]];
        }
        let firstIP = rangeComponents[0];
        let lastIP = rangeComponents[1];
        let [validFirstIP, invalidFirstIPMessage] = validator(firstIP);
        let [validLastIP, invalidLastIPMessage] = validator(lastIP);
        let isValid = validFirstIP && validLastIP;
        if (isValid && firstLastValidator(firstIP, lastIP)) {
            return [false, [Validator.invalidRangeFirstNotGreaterThanLastMessage]];
        }
        let invalidMessage = invalidFirstIPMessage.concat(invalidLastIPMessage);
        return isValid ? [isValid, []] : [isValid, invalidMessage];
    }
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
    static isValidIPv6CidrNotation(ipv6RangeAsCidrString) {
        let isValid = Validator.IPV6_RANGE_PATTERN.test(ipv6RangeAsCidrString);
        return isValid ? [isValid, []] : [isValid, [Validator.invalidIPv6CidrNotationString]];
    }
    /**
     * Checks if the given string is a binary string. That is contains only contiguous 1s and 0s
     *
     * @param {string} binaryString the binary string
     * @returns {(boolean|string)[]} a tuple representing if valid or not and corresponding message
     */
    static isValidBinaryString(binaryString) {
        if (/^([10])+$/.test(binaryString)) {
            return [true, []];
        }
        else {
            return [false, [Validator.invalidBinaryStringErrorMessage]];
        }
    }
    static isNumeric(value) {
        return /^(\d+)$/.test(value);
    }
    static isHexadecatet(value) {
        return /^[0-9A-Fa-f]{4}$/.test(value);
    }
}
exports.Validator = Validator;
Validator.IPV4_PATTERN = new RegExp(/^(0?[0-9]?[0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.(0?[0-9]?[0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.(0?[0-9]?[0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.(0?[0-9]?[0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])$/);
// source: https://community.helpsystems.com/forums/intermapper/miscellaneous-topics/5acc4fcf-fa83-e511-80cf-0050568460e4
Validator.IPV6_PATTERN = new RegExp(/^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/);
Validator.IPV4_RANGE_PATTERN = new RegExp(/^(0?[0-9]?[0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.(0?[0-9]?[0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.(0?[0-9]?[0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.(0?[0-9]?[0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])(\/)([1-9]|[1-2][0-9]|3[0-2])$/);
Validator.IPV6_RANGE_PATTERN = new RegExp(/^s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:)))(%.+)?s*(\/([0-9]|[1-9][0-9]|1[0-1][0-9]|12[0-8]))?$/);
Validator.IPV4_CONTIGUOUS_MASK_BIT_PATTERN = new RegExp(/^(1){0,32}(0){0,32}$/);
Validator.IPV6_CONTIGUOUS_MASK_BIT_PATTERN = new RegExp(/^(1){0,128}(0){0,128}$/);
Validator.EIGHT_BIT_SIZE = BigInt(`0b${"1".repeat(8)}`);
Validator.SIXTEEN_BIT_SIZE = BigInt(`0b${"1".repeat(16)}`);
Validator.THIRTY_TWO_BIT_SIZE = BigInt(`0b${"1".repeat(32)}`);
Validator.ONE_HUNDRED_AND_TWENTY_EIGHT_BIT_SIZE = BigInt(`0b${"1".repeat(128)}`);
Validator.IPV4_SIZE = BigInt("4294967296");
Validator.IPV6_SIZE = BigInt("340282366920938463463374607431768211456");
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
Validator.invalidIPv4PatternMessage = "Given IPv4 is not confirm to a valid IPv6 address";
Validator.invalidIPv6PatternMessage = "Given IPv6 is not confirm to a valid IPv6 address";
//# sourceMappingURL=Validator.js.map