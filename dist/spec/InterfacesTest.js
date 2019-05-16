"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IPv4CidrRange_1 = require("../src/IPv4CidrRange");
var IPv4_1 = require("../src/IPv4");
var Asn_1 = require("../src/Asn");
var IPv6_1 = require("../src/IPv6");
var IPv6CidrRange_1 = require("../src/IPv6CidrRange");
describe('Interface : ', function () {
    describe('IPNumber', function () {
        it('should correctly encapsulate ASN, IPv4 and IPv6', function () {
            var ipNumbers = [];
            ipNumbers.push(new Asn_1.Asn("200"));
            ipNumbers.push(new IPv4_1.IPv4("133.245.233.255"));
            ipNumbers.push(new IPv6_1.IPv6("2001:800:0:0:0:0:0:2002"));
            expect(ipNumbers.some(function (ipNumber) { return ipNumber.toString() === "AS200"; })).toBe(true);
            expect(ipNumbers.some(function (ipNumber) { return ipNumber.toString() === "133.245.233.255"; })).toBe(true);
            expect(ipNumbers.some(function (ipNumber) { return ipNumber.toString() === "2001:800:0:0:0:0:0:2002"; })).toBe(true);
        });
    });
    describe('IPRange', function () {
        it('should correctly encapsulate IPv4CidrRange and IPv6CidrRange', function () {
            var ipRanges = [];
            ipRanges.push(IPv4CidrRange_1.IPv4CidrRange.fromCidr("192.198.0.0/24"));
            ipRanges.push(IPv6CidrRange_1.IPv6CidrRange.fromCidr("2001:db8::/33"));
            expect(ipRanges.some(function (ipRange) { return ipRange.toCidrString() === "192.198.0.0/24"; })).toBe(true);
            expect(ipRanges.some(function (ipRange) { return ipRange.toCidrString() === "2001:db8:0:0:0:0:0:0/33"; })).toBe(true);
        });
    });
});
//# sourceMappingURL=InterfacesTest.js.map