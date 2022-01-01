import fc from "fast-check"
import {Asn, IPv4, IPv6, Validator} from "ip-num";
import * as bigInt from "big-integer/BigInteger";

const ipv4max = Validator.IPV4_SIZE.valueOf()
const ipv6max = Validator.IPV6_SIZE.minus(1)
const asn = (min:number=0, max:number=65535) => {
    return fc.integer({min, max}).map(value => Asn.fromNumber(value))
}

const ipv4 = (min:number=0, max:number=ipv4max) => {
    return fc.integer({min,max}).map(value => IPv4.fromBigInteger(bigInt(value)))
}

const ipv6 = (min:bigint=BigInt(0), max:bigint=BigInt(ipv6max.toString())) => {
    return fc.bigUint({max}).filter(value => {
        return value >= min
    }).map(value => {
        return IPv6.fromBigInteger(bigInt(value))
    })
}

const ipcheck = {
    asn,
    ipv4,
    ipv6
}

export default ipcheck;