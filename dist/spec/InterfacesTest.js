"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IPRange_1 = require("../src/IPRange");
var IPNumber_1 = require("../src/IPNumber");
var IPNumber_2 = require("../src/IPNumber");
var IPNumber_3 = require("../src/IPNumber");
var IPRange_2 = require("../src/IPRange");
describe('Interface : ', function () {
    describe('IPNumber', function () {
        it('should correctly encapsulate ASN, IPv4 and IPv6', function () {
            var ipNumbers = [];
            ipNumbers.push(new IPNumber_2.Asn("200"));
            ipNumbers.push(new IPNumber_1.IPv4("133.245.233.255"));
            ipNumbers.push(new IPNumber_3.IPv6("2001:800:0:0:0:0:0:2002"));
            expect(ipNumbers.some(function (ipNumber) { return ipNumber.toString() === "AS200"; })).toBe(true);
            expect(ipNumbers.some(function (ipNumber) { return ipNumber.toString() === "133.245.233.255"; })).toBe(true);
            expect(ipNumbers.some(function (ipNumber) { return ipNumber.toString() === "2001:800:0:0:0:0:0:2002"; })).toBe(true);
        });
    });
    describe('IPRange', function () {
        it('should correctly encapsulate IPv4CidrRange and IPv6CidrRange', function () {
            var ipRanges = [];
            ipRanges.push(IPRange_1.IPv4CidrRange.fromCidr("192.198.0.0/24"));
            ipRanges.push(IPRange_2.IPv6CidrRange.fromCidr("2001:db8::/33"));
            expect(ipRanges.some(function (ipRange) { return ipRange.toCidrString() === "192.198.0.0/24"; })).toBe(true);
            expect(ipRanges.some(function (ipRange) { return ipRange.toCidrString() === "2001:db8:0:0:0:0:0:0/33"; })).toBe(true);
        });
    });
});
//# sourceMappingURL=InterfacesTest.js.map