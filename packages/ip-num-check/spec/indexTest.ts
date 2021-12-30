import ipcheck from "../src";
import fc from "fast-check";
import {Asn, IPv4} from "ip-num";

describe('ASNs', () => {
    it('Generates arbitrary between 0 and 65535', () => {
        fc.assert(fc.property(ipcheck.asn(), (value: Asn) => {
            return value.value.valueOf() >= 0 || value.value.valueOf() <= 65535
        }))
    });
    it('Generates arbitrary between given min and max', () => {
        fc.assert(fc.property(ipcheck.asn(2,3), (value: Asn) => {
            return value.value.valueOf() >= 2 || value.value.valueOf() <= 3
        }))
    });
})

describe('IPv4', () => {
    it('Generates arbitrary values between 0 and 2^32 - 1', () => {
        fc.assert(fc.property(ipcheck.ipv4(), (value: IPv4) => {
            return value.value.valueOf() >= 0 || value.value.valueOf() <= (Math.pow(2,32) - 1)
        }))
    })
    it('Generates arbitrary values between min and max', () => {
        fc.assert(fc.property(ipcheck.ipv4(2,5), (value: IPv4) => {
            return value.value.valueOf() >= 2 || value.value.valueOf() <= 5
        }))
    })
})

