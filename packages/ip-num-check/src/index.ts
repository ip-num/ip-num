import fc from "fast-check"
import {Asn, IPv4} from "ip-num";
import * as bigInt from "big-integer/BigInteger";

const ipv4max = Math.pow(2,32) - 1

const asn = (min:number=0, max:number=65535) => {
    return fc.integer({min, max}).map(value => Asn.fromNumber(value))
}

const ipv4 = (min:number=0,max:number=ipv4max) => {
    return fc.integer({min,max}).map(value => IPv4.fromBigInteger(bigInt(value)))
}

const ipcheck = {
    asn,
    ipv4
}

export default ipcheck;