import {IPv4CidrRange} from "../src/IPv4CidrRange";
import {IPv4} from "../src/IPv4";
import {IPNumber} from "../src/interface/IPNumber";
import {Asn} from "../src/Asn";
import {IPv6} from "../src/IPv6";
import {IPRange} from "../src/interface/IPRange";
import {IPv6CidrRange} from "../src/IPv6CidrRange";


describe('Interface : ', () => {
    describe('IPNumber', () => {
        it('should correctly encapsulate ASN, IPv4 and IPv6', () => {
            let ipNumbers: IPNumber[] = [];
            ipNumbers.push(new Asn("200"));
            ipNumbers.push(new IPv4("133.245.233.255"));
            ipNumbers.push(new IPv6("2001:800:0:0:0:0:0:2002"));
            expect(ipNumbers.some(ipNumber => { return ipNumber.toString() === "AS200"})).toBe(true);
            expect(ipNumbers.some(ipNumber => { return ipNumber.toString() === "133.245.233.255"})).toBe(true);
            expect(ipNumbers.some(ipNumber => { return ipNumber.toString() === "2001:800:0:0:0:0:0:2002"})).toBe(true);
        });
    });

    describe('IPRange', () => {
        it('should correctly encapsulate IPv4CidrRange and IPv6CidrRange', () => {
            let ipRanges: IPRange[] = [];
            ipRanges.push(IPv4CidrRange.fromCidr("192.198.0.0/24"));
            ipRanges.push(IPv6CidrRange.fromCidr("2001:db8::/33"));
            expect(ipRanges.some(ipRange => { return ipRange.toCidrString() === "192.198.0.0/24"})).toBe(true);
            expect(ipRanges.some(ipRange => { return ipRange.toCidrString() === "2001:db8:0:0:0:0:0:0/33"})).toBe(true);
        });
    });

});