import fc from "fast-check";
import exp = require("constants");

export const asn16BitValues = fc.integer({
    min:0,
    max: 65535
})

export const asn32BitValues = fc.integer({
    min:0,
    max: (Math.pow(2,32) - 1)
})

export const asnPlainValues = fc.oneof(asn16BitValues, asn32BitValues)
export const asnPlainValuesBinary = fc.oneof(asn16BitValues, asn32BitValues).map(value => value.toString(2))

export const asnDotPlusValues = asnPlainValues.map(asnPlain => {
    return {
        intValue: asnPlain,
        asnDotPlusValue: `${Math.floor(asnPlain/65536)}.${asnPlain % 65536}`,
        binaryValue: asnPlain.toString(2)
    }
})
export const asnASStringValues = asnPlainValues.map(integer => { return {
    intValue: integer,
    stringVal: `AS${integer.toString()}`
}})
