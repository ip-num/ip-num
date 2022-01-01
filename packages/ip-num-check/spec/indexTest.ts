import ipcheck from "../src";
import fc from "fast-check";
import {Asn, IPv4, IPv6, Validator} from "ip-num";

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
    it('Throws an error when given maximum is too large', () => {
        expect(() => {
            ipcheck.asn(0, 75535)
        }).toThrowError(Error);
    })
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
    it('Throws an error when given maximum is too large', () => {
        expect(() => {
            ipcheck.ipv4(0, (Math.pow(2, 32) + 10))
        }).toThrowError(Error);
    })
})

describe('IPv6', () => {
   it('Generates arbitrary values between 0 and 2^128 - 1', () => {
        fc.assert(fc.property(ipcheck.ipv6(), (value: IPv6) => {
            return value.value.geq(0) || value.value.leq(Validator.IPV6_SIZE)
        }))
    })
    it('Generates arbitrary values between min and max', () => {
        fc.assert(fc.property(ipcheck.ipv6(BigInt(2), BigInt(5)), (value: IPv6) => {
            return value.value.geq(2) || value.value.leq(5)
        }))
    })
    it('Throws an error when given maximum is too large', () => {
        expect(() => {
            ipcheck.ipv6(BigInt(0), BigInt("440282366920938463463374607431768211456"))
        }).toThrowError(Error);
    })
})

