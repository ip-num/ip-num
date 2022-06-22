import {Validator} from "./Validator";

/**
 * A representation of a 4-digit hexadecimal number.
 *
 * An IPv6 number contains 128 digits, split into 8 grouping of 16 bits.
 *
 * This data structure represents a 16 bit grouping
 *
 * That is for example FFFF is 16 bit grouping with all 1s
 *
 */
export class Hexadecatet {
    private readonly value: number;

    /**
     * A convenience method for constructing an instance of {@link Hexadecatet} from a four (base 16) number
     * representation of a 16bit value.
     *
     * @param {string} rawValue the four (base 16) number
     * @returns {Hexadecatet} an instance of {@link Hexadecatet}
     */
    static fromString(rawValue: string):Hexadecatet {
        return new Hexadecatet(rawValue);
    };

    /**
     * A convenience method for constructing an instance of {@link Hexadecatet} from a decimal number representation
     * of a 16 bit value
     *
     * @param {number} rawValue decimal number representation of a 16 bit value
     * @returns {Hexadecatet} an instance of {@link Hexadecatet}
     */
    static fromNumber(rawValue: number):Hexadecatet {
        return new Hexadecatet(rawValue.toString(16));
    };

    /**
     * Constructor for creating an instance of {@link Hexadecatet}
     *
     * @param {string} givenValue a string a four (base 16) number representation of a 16bit value.
     */
    constructor(givenValue: string) {
        let hexadecatetValue: number;
        hexadecatetValue = parseInt(givenValue, 16);

        let [isValid, message] = Validator.isValidIPv6Hexadecatet(BigInt(hexadecatetValue));

        if (!isValid) {
            throw Error(message.filter(msg => {return msg !== '';}).toString());
        }
        this.value = hexadecatetValue;
    }

    /**
     * Returns the numeric value in base 10 (ie decimal)
     *
     * @returns {number} the numeric value in base 10 (ie decimal)
     */
    public getValue(): number {
        return this.value;
    }

    /**
     * Returns the string representation of the base 16 representation of the value
     * @returns {string} the string representation of the base 16 representation of the value
     */
    // TODO pad with a zero if digit is less than 4
    public toString(): string {
        return this.value.toString(16);
    }
}