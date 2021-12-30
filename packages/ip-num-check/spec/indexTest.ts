import ipcheck from "../src";
import fc from "fast-check";
import {Asn} from "ip-num";

describe('ASNs', () => {
    it('Generates Arbitrary between 0 and 65535', () => {
        fc.assert(fc.property(ipcheck.asn(), (value: Asn) => {
            return value.value.valueOf() >= 0 || value.value.valueOf() <= 65535
        }))
    });
    it('Generates Arbitrary between given min and max', () => {
        fc.assert(fc.property(ipcheck.asn(2,3), (value: Asn) => {
            return value.value.valueOf() >= 2 || value.value.valueOf() <= 3
        }))
    });
})

