/**
 * A binary representation of a 8 bit value.
 *
 * {@see https://en.wikipedia.org/wiki/Octet_(computing)} for more information on Octets
 *
 * An octet is used in the textual representation of an {@link IPv4} number, where the IP number value is divided
 * into 4 octets
 */
export declare class Octet {
    private readonly value;
    /**
     * Convenience method for creating an Octet out of a string value representing the value of the octet
     *
     * @param {string} rawValue the octet value in string
     * @returns {Octet} the Octet instance
     */
    static fromString(rawValue: string): Octet;
    /**
     * Convenience method for creating an Octet out of a numeric value representing the value of the octet
     *
     * @param {number} rawValue the octet value in number
     * @returns {Octet} the Octet instance
     */
    static fromNumber(rawValue: number): Octet;
    /**
     * Constructor for creating an instance of an Octet.
     *
     * The constructor parameter given could either be a string or number.
     *
     * If a string, it is the string representation of the numeric value of the octet
     * If a number, it is the numeric representation of the value of the octet
     *
     * @param {string | number} givenValue value of the octet to be created.
     */
    constructor(givenValue: string | number);
    /**
     * Method to get the numeric value of the octet
     *
     * @returns {number} the numeric value of the octet
     */
    getValue(): number;
    /**
     * Returns a decimal representation of the value of the octet in string
     *
     * @returns {string} a decimal representation of the value of the octet in string
     */
    toString(): string;
}
