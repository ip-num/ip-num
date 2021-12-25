import fc from "fast-check";

export const decimalAndBinary = fc.integer().map((value: number) => {
    return {
        value,
        binary: value.toString(2)
    }
})

export const ipv4DecimalNotation = fc.array(fc.integer({
    min:0,
    max:255
}), {minLength: 4, maxLength: 4}).map(value => {
    return `${value[0]}.${value[1]}.${value[2]}.${value[3]}`
})