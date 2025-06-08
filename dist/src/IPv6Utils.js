"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collapseIPv6Number = exports.expandIPv6Number = void 0;
const BinaryUtils_1 = require("./BinaryUtils");
const Validator_1 = require("./Validator");
let extractPrefix = (ipv6String) => {
    return ipv6String.includes("/") ? `/${ipv6String.split("/")[1]}` : "";
};
let expandIPv6Number = (ipv6String) => {
    let expandWithZero = (hexadecimalArray) => {
        let paddedArray = hexadecimalArray.map((hexadecimal) => {
            return (0, BinaryUtils_1.leftPadWithZeroBit)(hexadecimal, 4);
        });
        return paddedArray.join(":");
    };
    let expandDoubleColon = (gapCount) => {
        let pads = [];
        for (let count = 0; count < gapCount; count++) {
            pads.push("0000");
        }
        return pads.join(":");
    };
    if (/(:){3,}/.test(ipv6String))
        throw "given IPv6 contains consecutive : more than two";
    const prefix = extractPrefix(ipv6String);
    if (ipv6String.includes("/")) {
        ipv6String = ipv6String.split("/")[0];
    }
    let isValid = Validator_1.Validator.IPV6_PATTERN.test(ipv6String);
    if (!isValid) {
        throw Error(Validator_1.Validator.invalidIPv6PatternMessage);
    }
    if (ipv6String.includes("::")) {
        let split = ipv6String.split("::");
        let leftPortion = split[0];
        let rightPortion = split[1];
        let leftPortionSplit = leftPortion.split(":").filter(hexadecimal => { return hexadecimal !== ""; });
        let rightPortionSplit = rightPortion.split(":").filter(hexadecimal => { return hexadecimal !== ""; });
        let doublePortion = expandDoubleColon(8 - (leftPortionSplit.length + rightPortionSplit.length));
        let leftString = expandWithZero(leftPortionSplit);
        if (leftString !== "") {
            leftString += ":";
        }
        let rightString = expandWithZero(rightPortionSplit);
        if (rightString !== "") {
            rightString = ":" + rightString;
        }
        return `${leftString}${doublePortion}${rightString}${prefix}`;
    }
    else {
        return `${expandWithZero(ipv6String.split(":"))}${prefix}`;
    }
};
exports.expandIPv6Number = expandIPv6Number;
// Helper function to shorten hexadecatets
const shortenHexadecatet = (hex) => {
    // Input hex is expected to be like "0000", "0DB8", "001A" from expanded form
    const withoutLeadingZero = hex.replace(/^0+/, '');
    // If hex was "0000", withoutLeadingZero is "", so return "0"
    // Otherwise, return the string without leading zeros.
    return withoutLeadingZero === '' ? '0' : withoutLeadingZero;
};
let collapseIPv6Number = (ipv6String) => {
    const originalPrefix = extractPrefix(ipv6String);
    const processedIPv6String = ipv6String.includes("/") ? ipv6String.split("/")[0] : ipv6String;
    let expandedIPv6 = "";
    try {
        // Expand to full 8 segments, no prefix internally for processing
        let tempExpanded = (0, exports.expandIPv6Number)(processedIPv6String);
        if (tempExpanded.includes("/")) {
            expandedIPv6 = tempExpanded.split("/")[0];
        }
        else {
            expandedIPv6 = tempExpanded;
        }
    }
    catch (e) {
        // Propagate error if expansion fails (e.g. invalid IPv6 format)
        throw e;
    }
    let hexadecatets = expandedIPv6.split(":");
    if (hexadecatets.length !== 8) {
        // This case should ideally be prevented by expandIPv6Number's validation or structure.
        // If expandIPv6Number guarantees 8 segments or throws, this might not be strictly needed.
        // However, as a safeguard:
        throw new Error(`Invalid IPv6 structure after expansion: ${expandedIPv6}. Expected 8 segments.`);
    }
    let zeroSequences = [];
    let currentSequenceStart = -1;
    let currentSequenceLength = 0;
    for (let i = 0; i < 8; i++) {
        // Segments from expandIPv6Number are 4-char 0-padded, e.g., "0000"
        if (hexadecatets[i] === "0000") {
            if (currentSequenceStart === -1) {
                currentSequenceStart = i;
            }
            currentSequenceLength++;
        }
        else {
            if (currentSequenceLength > 0) {
                zeroSequences.push({ start: currentSequenceStart, length: currentSequenceLength });
            }
            currentSequenceStart = -1;
            currentSequenceLength = 0;
        }
    }
    if (currentSequenceLength > 0) { // Capture any trailing zero sequence
        zeroSequences.push({ start: currentSequenceStart, length: currentSequenceLength });
    }
    if (zeroSequences.length === 0) {
        // No zero segments at all, just shorten each hexadecatet
        return hexadecatets.map(shortenHexadecatet).join(":") + originalPrefix;
    }
    // Sort sequences: longest first, then earliest start first
    zeroSequences.sort((a, b) => {
        if (b.length !== a.length) {
            return b.length - a.length;
        }
        return a.start - b.start;
    });
    const bestSequence = zeroSequences[0];
    if (bestSequence.length === 8) { // All 8 segments are zero
        return "::" + originalPrefix;
    }
    // RFC 5952: "The symbol "::" MUST NOT be used to shorten just one 16-bit 0 field."
    // So, length must be > 1 for "::" compression.
    if (bestSequence.length < 2) {
        // No "::" compression is applied (e.g. "1:2:0:4:5:6:7:8")
        return hexadecatets.map(shortenHexadecatet).join(":") + originalPrefix;
    }
    // Apply "::" compression using the bestSequence
    let leftPartSegments = hexadecatets.slice(0, bestSequence.start);
    let rightPartSegments = hexadecatets.slice(bestSequence.start + bestSequence.length);
    let leftString = leftPartSegments.map(shortenHexadecatet).join(":");
    let rightString = rightPartSegments.map(shortenHexadecatet).join(":");
    let finalStr = "";
    if (bestSequence.start === 0) { // Compression at the beginning: "::..."
        finalStr = "::" + rightString;
    }
    else if (bestSequence.start + bestSequence.length === 8) { // Compression at the end: "...::"
        // Ensure that if leftString is empty (which shouldn't happen here if start > 0), it's handled.
        // However, if bestSequence.start > 0, leftPartSegments won't be empty unless bestSequence.start is 0.
        finalStr = leftString + "::";
    }
    else { // Compression in the middle: "...::..."
        finalStr = leftString + "::" + rightString;
    }
    return finalStr + originalPrefix;
};
exports.collapseIPv6Number = collapseIPv6Number;
//# sourceMappingURL=IPv6Utils.js.map