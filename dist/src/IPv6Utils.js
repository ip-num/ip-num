"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collapseIPv6Number = exports.expandIPv6Number = void 0;
var BinaryUtils_1 = require("./BinaryUtils");
var Validator_1 = require("./Validator");
var extractPrefix = function (ipv6String) {
    return ipv6String.includes("/") ? "/" + ipv6String.split("/")[1] : "";
};
/**
 * Expands an IPv6 number in abbreviated format into its full form
 *
 * {@see https://en.wikipedia.org/wiki/IPv6_address#Representation} for more on the representation of IPv6 addresses
 *
 * @param {string} ipv6String the abbreviated IPv6 address to expand
 * @returns {string} the expanded IPv6 address
 */
exports.expandIPv6Number = function (ipv6String) {
    var expandWithZero = function (hexadecimalArray) {
        var paddedArray = hexadecimalArray.map(function (hexadecimal) {
            return BinaryUtils_1.leftPadWithZeroBit(hexadecimal, 4);
        });
        return paddedArray.join(":");
    };
    var expandDoubleColon = function (gapCount) {
        var pads = [];
        for (var count = 0; count < gapCount; count++) {
            pads.push("0000");
        }
        return pads.join(":");
    };
    if (/(:){3,}/.test(ipv6String))
        throw "given IPv6 contains consecutive : more than two";
    var prefix = extractPrefix(ipv6String);
    if (ipv6String.includes("/")) {
        ipv6String = ipv6String.split("/")[0];
    }
    var isValid = Validator_1.Validator.IPV6_PATTERN.test(ipv6String);
    if (!isValid) {
        throw Error(Validator_1.Validator.invalidIPv6PatternMessage);
    }
    if (ipv6String.includes("::")) {
        var split = ipv6String.split("::");
        var leftPortion = split[0];
        var rightPortion = split[1];
        var leftPortionSplit = leftPortion.split(":").filter(function (hexadecimal) { return hexadecimal !== ""; });
        var rightPortionSplit = rightPortion.split(":").filter(function (hexadecimal) { return hexadecimal !== ""; });
        var doublePortion = expandDoubleColon(8 - (leftPortionSplit.length + rightPortionSplit.length));
        var leftString = expandWithZero(leftPortionSplit);
        if (leftString !== "") {
            leftString += ":";
        }
        var rightString = expandWithZero(rightPortionSplit);
        if (rightString !== "") {
            rightString = ":" + rightString;
        }
        return "" + leftString + doublePortion + rightString + prefix;
    }
    else {
        return "" + expandWithZero(ipv6String.split(":")) + prefix;
    }
};
/**
 * Collapses an IPv6 number in full format into its abbreviated form
 *
 * {@see https://en.wikipedia.org/wiki/IPv6_address#Representation} for more on the representation of IPv6 addresses
 *
 * @param {string} ipv6String the full form IPv6 number to collapse
 * @returns {string} the collapsed IPv6 number
 */
exports.collapseIPv6Number = function (ipv6String) {
    var prefix = extractPrefix(ipv6String);
    if (ipv6String.includes("/")) {
        ipv6String = ipv6String.split("/")[0];
    }
    var isValid = Validator_1.Validator.IPV6_PATTERN.test(ipv6String);
    if (!isValid) {
        throw Error(Validator_1.Validator.invalidIPv6PatternMessage);
    }
    var hexadecimals = ipv6String.split(":");
    var hexadecimalsWithoutLeadingZeros = hexadecimals.map(function (hexidecimal) {
        var withoutLeadingZero = hexidecimal.replace(/^0+/, '');
        if (withoutLeadingZero !== '') {
            return withoutLeadingZero;
        }
        else {
            return "0";
        }
    });
    var contracted = hexadecimalsWithoutLeadingZeros.join(":").replace(/((^0)?(:0){2,}|(^0)(:0){1,})/, ':');
    if (contracted.slice(-1) === ":") {
        return contracted + ":" + prefix;
    }
    contracted = contracted.replace(":0:", "::");
    return "" + contracted + prefix;
};
//# sourceMappingURL=IPv6Utils.js.map