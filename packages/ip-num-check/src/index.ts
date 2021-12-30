import fc from "fast-check"
import {Asn} from "ip-num";

const asn = (min:number=0, max:number=65535) => {
    return fc.integer({min, max}).map(value => Asn.fromNumber(value))
}

const ipcheck = {
    asn,
}

export default ipcheck;