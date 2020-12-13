/**
 * A base 16 (hexadecimal) representation of a 16 bit value.
 *
 * It consists of four (base 16) number. ie FFFF
 *
 * It is used to represents the components of an IPv6 address
 */
export declare class Hexadecatet {
    private readonly value;
    /**
     * A convenience method for constructing an instance of {@link Hexadecatet} from a four (base 16) number
     * representation of a 16bit value.
     *
     * @param {string} rawValue the four (base 16) number
     * @returns {Hexadecatet} an instance of {@link Hexadecatet}
     */
    static fromString(rawValue: string): Hexadecatet;
    /**
     * A convenience method for constructing an instance of {@link Hexadecatet} from a decimal number representation
     * of a 16 bit value
     *
     * @param {number} rawValue decimal number representation of a 16 bit value
     * @returns {Hexadecatet} an instance of {@link Hexadecatet}
     */
    static fromNumber(rawValue: number): Hexadecatet;
    /**
     * Constructor for creating an instance of {@link Hexadecatet}
     *
     * @param {string | number} givenValue a string or numeric value. If given value is a string then it should be a
     * four (base 16) number representation of a 16bit value. If it is a number, then it should be a decimal number
     * representation of a 16 bit value
     */
    constructor(givenValue: string | number);
    /**
     * Returns the numeric value in base 10 (ie decimal)
     *
     * @returns {number} the numeric value in base 10 (ie decimal)
     */
    getValue(): number;
    /**
     * Returns the string representation of the base 16 representation of the value
     * @returns {string} the string representation of the base 16 representation of the value
     */
    toString(): string;
}
