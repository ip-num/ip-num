import fc from "fast-check";
import {leftPadWithZeroBit} from "../../src";

export const positiveIntegersAndBinary = fc.integer({min:0}).map((value: number) => {
    return {
        value,
        binary: value.toString(2)
    }
})

export const positiveIntegersAndHex = fc.integer({min:0}).map((value: number) => {
    return {
        value,
        hex: value.toString(16)
    }
})

export const hexadecatetValue = fc.integer({min:0, max:65535}).map((value: number) => {
    return {
        value: value.toString(16),
        decimalValue: value
    }
})

export const ipv4DecimalNotation = fc.array(fc.integer({
    min:0,
    max:255
}), {minLength: 4, maxLength: 4}).map(value => {
    return {
        decimalNotation: `${value[0]}.${value[1]}.${value[2]}.${value[3]}`,
        binary: `${leftPadWithZeroBit(value[0].toString(2), 8)}${leftPadWithZeroBit(value[1].toString(2), 8)}${leftPadWithZeroBit(value[2].toString(2), 8)}${leftPadWithZeroBit(value[3].toString(2), 8)}`
    }
})